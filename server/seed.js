import { readFile } from 'node:fs/promises';
import { q, one } from './db.js';
import { hashPassword } from './auth.js';

export async function seedMenu() {
  const have = await one('select count(*)::int as n from menu_items');
  if (have.n > 0) return 0;
  const d = JSON.parse(await readFile(new URL('./seed-menu.json', import.meta.url), 'utf8'));
  for (const it of d.items) {
    await q(`insert into menu_items (slug, category, position, price_idr, veg, spicy, photo, featured, name_en, name_id, name_ja, desc_en, desc_id, desc_ja, updated_by)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'seed') on conflict (slug) do nothing`,
      [it.slug, it.category, it.position, it.price_idr, it.veg, it.spicy, it.photo, it.featured, it.name.en, it.name.id, it.name.ja, it.desc.en, it.desc.id, it.desc.ja]);
  }
  return d.items.length;
}

// First owner comes from ADMIN_EMAIL + ADMIN_PASSWORD, only when no staff exist. They must change the password at first sign-in.
export async function seedOwner() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase(), pw = process.env.ADMIN_PASSWORD || '';
  if (!email || pw.length < 10) return false;
  const have = await one('select count(*)::int as n from staff');
  if (have.n > 0) return false;
  await q('insert into staff (email, name, role, pw_hash, must_change) values ($1,$2,$3,$4,true)', [email, 'Owner', 'owner', await hashPassword(pw)]);
  return true;
}
