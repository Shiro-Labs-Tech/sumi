import { send, readJson, sameOrigin, HttpError } from './http.js';
import { currentUser, cookieHeader } from './auth.js';
import { hasDatabase, q } from './db.js';
import { migrate } from './schema.js';
import { seedMenu, seedOwner } from './seed.js';
import * as pub from './routes/public.js';
import * as auth from './routes/auth.js';
import * as adm from './routes/admin.js';

let ready;
const ensure = () => (ready ||= (async () => { await migrate(); await seedMenu(); await seedOwner(); })().catch((e) => { ready = null; throw e; }));

const need = async (req, roles) => {
  const u = await currentUser(req);
  if (!u) throw new HttpError(401, 'Sign in required', 'auth');
  if (u.mustChange && !req.__allowMustChange) throw new HttpError(403, 'Change your password first', 'must_change');
  return u;
};

export async function handle(req, res) {
  try {
    const url = new URL(req.url, 'http://x');
    const path = url.pathname.replace(/^\/api/, '').replace(/\/+$/, '') || '/';
    const m = req.method, Q = Object.fromEntries(url.searchParams);
    if (path === '/health') return send(res, 200, { ok: true, database: hasDatabase() });
    if (!hasDatabase()) throw new HttpError(503, 'The database is not connected yet.', 'no_database');
    if (m !== 'GET' && m !== 'HEAD' && !sameOrigin(req)) throw new HttpError(403, 'Cross-site request refused', 'origin');
    await ensure();
    let seg;

    if (m === 'GET' && path === '/menu') return send(res, 200, await pub.publicMenu(), { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=120' });
    if (m === 'GET' && path === '/availability') return send(res, 200, await pub.getAvailability(Q.seat), { 'Cache-Control': 'no-store' });
    if (m === 'POST' && path === '/reservations') return send(res, 201, await pub.createReservation(await readJson(req), req));

    if (m === 'POST' && path === '/auth/login') { const r = await auth.login(await readJson(req), req); return send(res, 200, { user: r.user }, { 'Set-Cookie': r.cookie }); }
    if (m === 'POST' && path === '/auth/logout') return send(res, 200, { ok: true }, { 'Set-Cookie': cookieHeader('', req, true) });
    if (m === 'GET' && path === '/auth/me') { const u = await currentUser(req); return send(res, 200, { user: u }); }
    if (m === 'POST' && path === '/auth/password') { req.__allowMustChange = true; const u = await need(req); const r = await auth.changePassword(u, await readJson(req), req); return send(res, 200, { ok: true }, { 'Set-Cookie': r.cookie }); }

    if (path.startsWith('/admin/')) {
      const u = await need(req);
      if (m === 'GET' && path === '/admin/menu') return send(res, 200, await adm.adminMenu());
      if (m === 'POST' && path === '/admin/menu') { if (u.role !== 'owner') throw new HttpError(403, 'Owner access only', 'forbidden'); return send(res, 201, await adm.createItem(u, await readJson(req))); }
      if (m === 'POST' && path === '/admin/menu/reorder') return send(res, 200, await adm.reorder(u, await readJson(req)));
      if ((seg = path.match(/^\/admin\/menu\/(\d+)$/))) {
        if (m === 'PUT') return send(res, 200, await adm.updateItem(u, +seg[1], await readJson(req)));
        if (m === 'DELETE') return send(res, 200, await adm.deleteItem(u, +seg[1]));
      }
      if (m === 'GET' && path === '/admin/reservations') return send(res, 200, await adm.listReservations(Q));
      if ((seg = path.match(/^\/admin\/reservations\/([A-Za-z0-9-]+)$/)) && m === 'GET') return send(res, 200, await adm.getReservation(seg[1]));
      if ((seg = path.match(/^\/admin\/reservations\/([A-Za-z0-9-]+)\/status$/)) && m === 'POST') return send(res, 200, await adm.changeStatus(u, seg[1], await readJson(req)));
      if (m === 'GET' && path === '/admin/staff') return send(res, 200, await adm.listStaff(u));
      if (m === 'POST' && path === '/admin/staff') return send(res, 201, await adm.createStaff(u, await readJson(req)));
      if ((seg = path.match(/^\/admin\/staff\/(\d+)$/)) && m === 'PATCH') return send(res, 200, await adm.updateStaff(u, +seg[1], await readJson(req)));
    }
    throw new HttpError(404, 'Not found', 'not_found');
  } catch (e) {
    const status = e.status || 500;
    if (status >= 500) console.error('[api]', req.method, req.url, e);
    send(res, status, { error: status >= 500 && status !== 503 ? 'Something went wrong' : e.message, code: e.code || 'error', ...(e.extra || {}) });
  }
}
