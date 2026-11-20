import { one, q } from '../db.js';
import { HttpError, bad, clientIp } from '../http.js';
import { verifyPassword, hashPassword, makeSession, cookieHeader, tooManyAttempts, noteFailure, clearFailures } from '../auth.js';

export async function login(body, req) {
  const email = String(body.email || '').trim().toLowerCase(), pw = String(body.password || '');
  const keys = [`e:${email}`, `ip:${clientIp(req)}`];
  if (await tooManyAttempts(keys)) throw new HttpError(429, 'Too many attempts. Wait 15 minutes.', 'rate');
  const u = await one('select * from staff where email = $1', [email]);
  // Always spend the hashing time so timing does not reveal whether the account exists.
  const ok = u ? await verifyPassword(pw, u.pw_hash) : (await hashPassword(pw), false);
  if (!u || !u.active || !ok) { await noteFailure(keys); throw new HttpError(401, 'Wrong email or password', 'credentials'); }
  await clearFailures(keys);
  await q('update staff set last_login = now() where id = $1', [u.id]);
  return { user: { id: u.id, email: u.email, name: u.name, role: u.role, mustChange: u.must_change }, cookie: cookieHeader(makeSession(u), req) };
}

export async function changePassword(user, body, req) {
  const cur = String(body.current || ''), next = String(body.next || '');
  if (next.length < 10) throw bad('Use at least 10 characters', 'password');
  const u = await one('select * from staff where id = $1', [user.id]);
  if (!(await verifyPassword(cur, u.pw_hash))) throw new HttpError(401, 'Current password is wrong', 'credentials');
  if (cur === next) throw bad('Choose a different password', 'password');
  const h = await hashPassword(next);
  await q('update staff set pw_hash = $1, must_change = false where id = $2', [h, user.id]);
  return { cookie: cookieHeader(makeSession({ id: u.id, pw_hash: h }), req) };
}
