import { q } from './db.js';
// Idempotent migrations, applied in order. Never edit a shipped entry; append a new one.
export const MIGRATIONS = [
  `create table if not exists schema_migrations (id int primary key, applied_at timestamptz not null default now())`,
  `create table if not exists staff (
     id serial primary key, email text not null unique, name text not null, role text not null check (role in ('owner','host')),
     pw_hash text not null, must_change boolean not null default false, active boolean not null default true,
     created_at timestamptz not null default now(), last_login timestamptz)`,
  `create table if not exists menu_items (
     id serial primary key, slug text not null unique, category text not null, position int not null default 0,
     price_idr int not null check (price_idr >= 0), veg boolean not null default false, spicy boolean not null default false,
     photo text, available boolean not null default true, featured boolean not null default false,
     name_en text not null, name_id text not null default '', name_ja text not null default '',
     desc_en text not null default '', desc_id text not null default '', desc_ja text not null default '',
     updated_at timestamptz not null default now(), updated_by text)`,
  `create table if not exists reservations (
     id serial primary key, ref text not null unique, seat text not null, guests int not null, date date not null, time text not null,
     status text not null, occasion int not null default 0, diet text[] not null default '{}', notes text not null default '',
     addons text[] not null default '{}', name text not null, email text not null, phone text not null, lang text not null default 'en',
     deposit_idr int not null default 0, estimate_idr int not null default 0, table_code text,
     created_at timestamptz not null default now(), updated_at timestamptz not null default now())`,
  `create index if not exists reservations_slot on reservations (date, seat, time)`,
  `create table if not exists reservation_events (
     id serial primary key, reservation_id int not null references reservations(id) on delete cascade,
     at timestamptz not null default now(), actor text not null, from_status text, to_status text not null, note text not null default '')`,
  `create table if not exists login_attempts (id serial primary key, key text not null, at timestamptz not null default now())`,
  `create index if not exists login_attempts_key on login_attempts (key, at)`,
];
export async function migrate() {
  for (let i = 0; i < MIGRATIONS.length; i++) await q(MIGRATIONS[i]);
  for (let i = 0; i < MIGRATIONS.length; i++) await q('insert into schema_migrations (id) values ($1) on conflict do nothing', [i + 1]);
}
