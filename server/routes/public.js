import { randomInt } from 'node:crypto';
import { q, one, tx } from '../db.js';
import { bad, HttpError, clientIp } from '../http.js';
import { SEATS, ADDONS, CATEGORIES } from '../config.js';
import { availability, dateBookable, slotBookable, HOLDING } from '../availability.js';
import { readFile } from 'node:fs/promises';

export const publicMenu = async () => {
  const rows = await q('select * from menu_items order by category, position, id');
  const seed = JSON.parse(await readFile(new URL('../seed-menu.json', import.meta.url), 'utf8'));
  return {
    categories: CATEGORIES.map((c) => ({ id: c, name: seed.categories[c] })),
    photoIds: seed.photoIds,
    items: rows.map((r) => ({
      id: r.slug, category: r.category, priceIdr: r.price_idr, veg: r.veg, spicy: r.spicy, photo: r.photo, available: r.available, featured: r.featured,
      name: { en: r.name_en, id: r.name_id || r.name_en, ja: r.name_ja || r.name_en },
      desc: { en: r.desc_en, id: r.desc_id || r.desc_en, ja: r.desc_ja || r.desc_en },
    })),
  };
};

export const getAvailability = async (seat) => {
  if (!SEATS[seat]) throw bad('Unknown seating', 'seat');
  return availability(seat);
};

const REF_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newRef = () => 'SUMI-' + Array.from({ length: 5 }, () => REF_CHARS[randomInt(REF_CHARS.length)]).join('');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateReservation(b) {
  if (b.website) throw bad('Rejected', 'spam'); // honeypot
  const c = SEATS[b.seat]; if (!c) throw bad('Choose a seating', 'seat');
  const guests = Number.isInteger(b.guests) ? b.guests : NaN;
  if (!(guests >= c.min && guests <= c.max)) throw bad(`This seating takes ${c.min} to ${c.max} guests`, 'guests');
  if (!dateBookable(b.date)) throw bad('That date is not available', 'date');
  if (!c.slots.includes(b.time) || !slotBookable(b.date, b.time)) throw bad('That time is not available', 'time');
  const name = String(b.name || '').trim(), email = String(b.email || '').trim().toLowerCase();
  const cc = String(b.cc || '+62').trim(), digits = String(b.phone || '').replace(/\D/g, '');
  if (name.length < 2 || name.length > 80) throw bad('Enter your name', 'name');
  if (!EMAIL.test(email) || email.length > 120) throw bad('Enter a valid email', 'email');
  if (!/^\+\d{1,4}$/.test(cc) || digits.length < 6 || digits.length > 14) throw bad('Enter a valid mobile number', 'phone');
  const occasion = Number.isInteger(b.occasion) && b.occasion >= 0 && b.occasion < 12 ? b.occasion : 0;
  const diet = (Array.isArray(b.diet) ? b.diet : []).filter((x) => Number.isInteger(x) && x >= 0 && x < 12).map(String).slice(0, 12);
  const addons = (Array.isArray(b.addons) ? b.addons : []).filter((k) => ADDONS[k] && ADDONS[k].seats.includes(b.seat));
  const notes = String(b.notes || '').slice(0, 500);
  const lang = ['en', 'id', 'ja'].includes(b.lang) ? b.lang : 'en';
  return { seat: b.seat, guests, date: b.date, time: b.time, name, email, phone: `${cc} ${digits}`, occasion, diet, addons, notes, lang };
}

export const money = (r) => {
  const c = SEATS[r.seat]; let est = c.menu * r.guests;
  if (r.addons.includes('sake')) est += ADDONS.sake.price * r.guests;
  if (r.addons.includes('cake')) est += ADDONS.cake.price;
  return { deposit: c.dep * r.guests, estimate: est };
};

export async function createReservation(body, req) {
  const r = validateReservation(body);
  const recent = await one(`select count(*)::int as n from reservations where email = $1 and created_at > now() - interval '1 hour'`, [r.email]);
  if (recent.n >= 5) throw new HttpError(429, 'Too many bookings from this email. Try again later.', 'rate');
  const { deposit, estimate } = money(r), cap = SEATS[r.seat].cap;
  for (let attempt = 0; attempt < 5; attempt++) {
    const ref = newRef();
    try {
      const out = await tx([
        { text: 'select pg_advisory_xact_lock(hashtext($1))', params: [`slot:${r.date}:${r.seat}:${r.time}`] },
        { text: `insert into reservations (ref, seat, guests, date, time, status, occasion, diet, notes, addons, name, email, phone, lang, deposit_idr, estimate_idr)
                 select $1::text,$2::text,$3::int,$4::date,$5::text,
                   case when coalesce((select sum(guests) from reservations where date=$4::date and seat=$2::text and time=$5::text and status = any($6::text[])),0) + $3::int <= $7::int then 'confirmed' else 'waitlist' end,
                   $8::int,$9::text[],$10::text,$11::text[],$12::text,$13::text,$14::text,$15::text,$16::int,$17::int returning id, ref, status`,
          params: [ref, r.seat, r.guests, r.date, r.time, HOLDING, cap, r.occasion, r.diet, r.notes, r.addons, r.name, r.email, r.phone, r.lang, deposit, estimate] },
      ]);
      const row = out[1][0];
      await q('insert into reservation_events (reservation_id, actor, from_status, to_status, note) values ($1,$2,null,$3,$4)', [row.id, 'guest', row.status, 'Booked online']);
      return { ref: row.ref, status: row.status, depositIdr: row.status === 'waitlist' ? 0 : deposit, estimateIdr: estimate };
    } catch (e) { if (!/unique|duplicate/i.test(String(e.message))) throw e; }
  }
  throw new HttpError(500, 'Could not create a reference. Try again.');
}
