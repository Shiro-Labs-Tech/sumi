import { readFile } from 'node:fs/promises';
import { q, one, tx } from '../db.js';
import { bad, HttpError } from '../http.js';
import { CATEGORIES, STATUSES, TRANSITIONS, TABLES, SEATS, nowParts, isDate } from '../config.js';
import { HOLDING } from '../availability.js';
import { hashPassword } from '../auth.js';

const needOwner = (u) => { if (u.role !== 'owner') throw new HttpError(403, 'Owner access only', 'forbidden'); };

/* ---------- menu ---------- */
const photoKeys = async () => Object.keys(JSON.parse(await readFile(new URL('../seed-menu.json', import.meta.url), 'utf8')).photoIds);
const shape = (r) => ({ id: r.id, slug: r.slug, category: r.category, position: r.position, priceIdr: r.price_idr, veg: r.veg, spicy: r.spicy, photo: r.photo, available: r.available, featured: r.featured,
  name: { en: r.name_en, id: r.name_id, ja: r.name_ja }, desc: { en: r.desc_en, id: r.desc_id, ja: r.desc_ja }, updatedAt: r.updated_at, updatedBy: r.updated_by });

export const adminMenu = async () => {
  const seed = JSON.parse(await readFile(new URL('../seed-menu.json', import.meta.url), 'utf8'));
  return { items: (await q('select * from menu_items order by category, position, id')).map(shape), photos: Object.keys(seed.photoIds), photoIds: seed.photoIds, categories: CATEGORIES.map((id) => ({ id, name: seed.categories[id] })) };
};

async function cleanItem(b) {
  const o = {};
  const str = (v, max) => String(v ?? '').trim().slice(0, max);
  if (!CATEGORIES.includes(b.category)) throw bad('Choose a category', 'category');
  o.category = b.category;
  if (!Number.isInteger(b.priceIdr) || b.priceIdr < 0 || b.priceIdr > 10_000_000) throw bad('Price must be a whole number of rupiah', 'price');
  o.price = b.priceIdr;
  const n = b.name || {}, d = b.desc || {};
  if (str(n.en, 80).length < 2) throw bad('English name is required', 'name');
  o.name = { en: str(n.en, 80), id: str(n.id, 80), ja: str(n.ja, 80) };
  o.desc = { en: str(d.en, 300), id: str(d.id, 300), ja: str(d.ja, 300) };
  if (b.photo && !(await photoKeys()).includes(b.photo)) throw bad('Unknown photo', 'photo');
  o.photo = b.photo || null; o.veg = !!b.veg; o.spicy = !!b.spicy; o.available = b.available !== false; o.featured = !!b.featured;
  return o;
}
const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'item';

export async function createItem(user, b) {
  const o = await cleanItem(b);
  let slug = slugify(o.name.en), i = 1;
  while (await one('select 1 from menu_items where slug = $1', [slug])) slug = `${slugify(o.name.en)}-${++i}`;
  const pos = await one('select coalesce(max(position),-1)+1 as p from menu_items where category = $1', [o.category]);
  const r = await one(`insert into menu_items (slug, category, position, price_idr, veg, spicy, photo, available, featured, name_en, name_id, name_ja, desc_en, desc_id, desc_ja, updated_by)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) returning *`,
    [slug, o.category, pos.p, o.price, o.veg, o.spicy, o.photo, o.available, o.featured, o.name.en, o.name.id, o.name.ja, o.desc.en, o.desc.id, o.desc.ja, user.email]);
  return shape(r);
}
export async function updateItem(user, id, b) {
  const cur = await one('select * from menu_items where id = $1', [id]);
  if (!cur) throw new HttpError(404, 'Not found');
  if (user.role !== 'owner') { // hosts can only 86 an item
    if (typeof b.available !== 'boolean' || Object.keys(b).some((k) => k !== 'available')) throw new HttpError(403, 'Hosts can only mark items available or sold out', 'forbidden');
    return shape(await one('update menu_items set available = $1, updated_at = now(), updated_by = $2 where id = $3 returning *', [b.available, user.email, id]));
  }
  const o = await cleanItem(b);
  const moved = o.category !== cur.category ? (await one('select coalesce(max(position),-1)+1 as p from menu_items where category = $1', [o.category])).p : cur.position;
  return shape(await one(`update menu_items set category=$1, position=$2, price_idr=$3, veg=$4, spicy=$5, photo=$6, available=$7, featured=$8,
    name_en=$9, name_id=$10, name_ja=$11, desc_en=$12, desc_id=$13, desc_ja=$14, updated_at=now(), updated_by=$15 where id=$16 returning *`,
    [o.category, moved, o.price, o.veg, o.spicy, o.photo, o.available, o.featured, o.name.en, o.name.id, o.name.ja, o.desc.en, o.desc.id, o.desc.ja, user.email, id]));
}
export async function deleteItem(user, id) {
  needOwner(user);
  const r = await one('delete from menu_items where id = $1 returning id', [id]);
  if (!r) throw new HttpError(404, 'Not found');
  return { ok: true };
}
export async function reorder(user, b) {
  needOwner(user);
  if (!CATEGORIES.includes(b.category) || !Array.isArray(b.ids) || !b.ids.every(Number.isInteger)) throw bad('Invalid order');
  await tx(b.ids.map((id, i) => ({ text: 'update menu_items set position = $1, updated_at = now(), updated_by = $2 where id = $3 and category = $4', params: [i, user.email, id, b.category] })));
  return { ok: true };
}

/* ---------- reservations ---------- */
const R = (r) => ({ ref: r.ref, seat: r.seat, guests: r.guests, date: r.d, time: r.time, status: r.status, occasion: r.occasion, diet: r.diet, notes: r.notes, addons: r.addons,
  name: r.name, email: r.email, phone: r.phone, lang: r.lang, depositIdr: r.deposit_idr, estimateIdr: r.estimate_idr, table: r.table_code, createdAt: r.created_at });
const COLS = `*, to_char(date,'YYYY-MM-DD') as d`;

export async function listReservations({ date, status, q: text }) {
  const where = [], p = [];
  if (date && date !== 'all') { if (!isDate(date)) throw bad('Bad date'); p.push(date); where.push(`date = $${p.length}`); }
  if (status && STATUSES.includes(status)) { p.push(status); where.push(`status = $${p.length}`); }
  if (text) { p.push(`%${String(text).trim().slice(0, 60)}%`); where.push(`(ref ilike $${p.length} or name ilike $${p.length} or phone ilike $${p.length} or email ilike $${p.length})`); }
  const rows = await q(`select ${COLS} from reservations ${where.length ? 'where ' + where.join(' and ') : ''} order by date, time, id limit 300`, p);
  const day = date && date !== 'all' ? date : nowParts().date;
  const stats = await q(`select status, count(*)::int as n, coalesce(sum(guests),0)::int as covers from reservations where date = $1 group by status`, [day]);
  return { date: date || null, reservations: rows.map(R), stats: Object.fromEntries(stats.map((s) => [s.status, { n: s.n, covers: s.covers }])), today: nowParts().date, tables: TABLES };
}
export async function getReservation(ref) {
  const r = await one(`select ${COLS} from reservations where ref = $1`, [String(ref).toUpperCase()]);
  if (!r) throw new HttpError(404, 'No reservation with that reference', 'not_found');
  const events = await q('select at, actor, from_status, to_status, note from reservation_events where reservation_id = $1 order by id', [r.id]);
  const taken = await q(`select table_code from reservations where date = $1 and status = 'seated' and table_code is not null and id <> $2`, [r.d, r.id]);
  return { ...R(r), events: events.map((e) => ({ at: e.at, actor: e.actor, from: e.from_status, to: e.to_status, note: e.note })), freeTables: (TABLES[r.seat] || []).filter((t) => !taken.some((x) => x.table_code === t)) };
}
export async function changeStatus(user, ref, b) {
  const r = await one(`select ${COLS} from reservations where ref = $1`, [String(ref).toUpperCase()]);
  if (!r) throw new HttpError(404, 'No reservation with that reference', 'not_found');
  const to = b.to, note = String(b.note || '').slice(0, 200);
  if (!STATUSES.includes(to) || !TRANSITIONS[r.status].includes(to)) throw new HttpError(409, `Cannot move from ${r.status} to ${to}`, 'transition');
  let table = r.table_code;
  if (to === 'seated') {
    if (!(TABLES[r.seat] || []).includes(b.table)) throw bad('Choose a table', 'table');
    const busy = await one(`select ref from reservations where date = $1 and status = 'seated' and table_code = $2 and id <> $3`, [r.d, b.table, r.id]);
    if (busy) throw new HttpError(409, `${b.table} is already taken (${busy.ref})`, 'table_busy');
    table = b.table;
  }
  const stmts = [];
  if (to === 'confirmed') { // waitlist promotion needs room in the slot
    stmts.push({ text: 'select pg_advisory_xact_lock(hashtext($1))', params: [`slot:${r.d}:${r.seat}:${r.time}`] });
    stmts.push({ text: `update reservations set status = 'confirmed', updated_at = now(), deposit_idr = $5::int where id = $1::int
      and coalesce((select sum(guests) from reservations where date=$2::date and seat=$3::text and time=$4::text and status = any($6::text[])),0) + $7::int <= $8::int returning id`,
      params: [r.id, r.d, r.seat, r.time, SEATS[r.seat].dep * r.guests, HOLDING, r.guests, SEATS[r.seat].cap] });
    const out = await tx(stmts);
    if (!out[1].length) throw new HttpError(409, 'No room left in that slot', 'full');
  } else {
    await q('update reservations set status = $1, table_code = $2, updated_at = now() where id = $3', [to, table, r.id]);
  }
  await q('insert into reservation_events (reservation_id, actor, from_status, to_status, note) values ($1,$2,$3,$4,$5)', [r.id, user.email, r.status, to, to === 'seated' ? `Table ${table}${note ? '. ' + note : ''}` : note]);
  return getReservation(r.ref);
}

/* ---------- staff ---------- */
export async function listStaff(user) { needOwner(user); return { staff: (await q('select id, email, name, role, active, must_change, last_login from staff order by id')).map((s) => ({ id: s.id, email: s.email, name: s.name, role: s.role, active: s.active, mustChange: s.must_change, lastLogin: s.last_login })) }; }
export async function createStaff(user, b) {
  needOwner(user);
  const email = String(b.email || '').trim().toLowerCase(), name = String(b.name || '').trim().slice(0, 60), pw = String(b.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw bad('Enter a valid email', 'email');
  if (name.length < 2) throw bad('Enter a name', 'name');
  if (!['owner', 'host'].includes(b.role)) throw bad('Choose a role', 'role');
  if (pw.length < 10) throw bad('Temporary password needs 10+ characters', 'password');
  if (await one('select 1 from staff where email = $1', [email])) throw new HttpError(409, 'That email already has an account', 'exists');
  await q('insert into staff (email, name, role, pw_hash, must_change) values ($1,$2,$3,$4,true)', [email, name, b.role, await hashPassword(pw)]);
  return listStaff(user);
}
export async function updateStaff(user, id, b) {
  needOwner(user);
  if (id === user.id && (b.active === false || (b.role && b.role !== 'owner'))) throw new HttpError(409, 'You cannot lock yourself out', 'self');
  if (typeof b.active === 'boolean') await q('update staff set active = $1 where id = $2', [b.active, id]);
  if (b.role && ['owner', 'host'].includes(b.role)) await q('update staff set role = $1 where id = $2', [b.role, id]);
  if (b.password) { if (String(b.password).length < 10) throw bad('Temporary password needs 10+ characters', 'password'); await q('update staff set pw_hash = $1, must_change = true where id = $2', [await hashPassword(String(b.password)), id]); }
  return listStaff(user);
}
