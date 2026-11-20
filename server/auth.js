import { scrypt as _scrypt, randomBytes, timingSafeEqual, createHmac, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { one, q } from './db.js';
const scrypt = promisify(_scrypt);

export async function hashPassword(pw) {
  const salt = randomBytes(16);
  const key = await scrypt(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `s1$${salt.toString('base64')}$${key.toString('base64')}`;
}
export async function verifyPassword(pw, stored) {
  const [v, s, k] = String(stored).split('$');
  if (v !== 's1' || !s || !k) return false;
  const key = await scrypt(pw, Buffer.from(s, 'base64'), 64, { N: 16384, r: 8, p: 1 });
  const want = Buffer.from(k, 'base64');
  return want.length === key.length && timingSafeEqual(want, key);
}

const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 24) return s;
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') { const e = new Error('SESSION_SECRET is not set'); e.status = 503; throw e; }
  return 'dev-only-secret-not-for-production';
};
const sign = (data) => createHmac('sha256', secret()).update(data).digest('base64url');
const fp = (pwHash) => createHash('sha256').update(pwHash).digest('base64url').slice(0, 10);
export const COOKIE = 'sumi_session';
const TTL = 12 * 3600;

export function makeSession(user) {
  const body = Buffer.from(JSON.stringify({ u: user.id, f: fp(user.pw_hash), e: Math.floor(Date.now() / 1000) + TTL })).toString('base64url');
  return `${body}.${sign(body)}`;
}
export function cookieHeader(value, req, clear = false) {
  const secure = req.headers['x-forwarded-proto'] === 'https' || !!process.env.VERCEL;
  return `${COOKIE}=${clear ? '' : value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear ? 0 : TTL}${secure ? '; Secure' : ''}`;
}
const parseCookies = (h = '') => Object.fromEntries(h.split(';').map((c) => c.trim().split('=')).filter((x) => x[0]).map(([k, ...v]) => [k, v.join('=')]));

export async function currentUser(req) {
  const tok = parseCookies(req.headers.cookie)[COOKIE];
  if (!tok) return null;
  const [body, mac] = tok.split('.');
  if (!body || !mac) return null;
  const good = sign(body);
  if (mac.length !== good.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(good))) return null;
  let p; try { p = JSON.parse(Buffer.from(body, 'base64url').toString()); } catch { return null; }
  if (!p.e || p.e < Date.now() / 1000) return null;
  const u = await one('select id, email, name, role, pw_hash, must_change, active from staff where id = $1', [p.u]);
  if (!u || !u.active || fp(u.pw_hash) !== p.f) return null;
  return { id: u.id, email: u.email, name: u.name, role: u.role, mustChange: u.must_change };
}

// Failed sign-ins per email and per IP in the last 15 minutes.
export async function tooManyAttempts(keys) {
  for (const k of keys) {
    const r = await one(`select count(*)::int as n from login_attempts where key = $1 and at > now() - interval '15 minutes'`, [k]);
    if (r.n >= (k.startsWith('ip:') ? 30 : 8)) return true;
  }
  return false;
}
export const noteFailure = (keys) => Promise.all(keys.map((k) => q('insert into login_attempts (key) values ($1)', [k])));
export const clearFailures = (keys) => Promise.all(keys.map((k) => q('delete from login_attempts where key = $1', [k])));
