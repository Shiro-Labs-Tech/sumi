import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

process.env.SUMI_PGLITE = 'memory';
process.env.ADMIN_EMAIL = 'owner@sumi.test';
process.env.ADMIN_PASSWORD = 'first-password-123';
process.env.SESSION_SECRET = 'test-secret-test-secret-test-secret';
const { handle } = await import('../server/router.js');
const { addDays, nowParts, weekday } = await import('../server/config.js');

const srv = http.createServer(handle); await new Promise((r) => srv.listen(0, r));
const base = `http://127.0.0.1:${srv.address().port}/api`;
test.after(() => srv.close());

let cookie = '';
const call = async (method, path, body, opts = {}) => {
  const res = await fetch(base + path, { method, headers: { 'content-type': 'application/json', ...(opts.nocookie ? {} : { cookie }), ...(opts.headers || {}) }, body: body ? JSON.stringify(body) : undefined });
  const sc = res.headers.get('set-cookie'); if (sc && opts.keep !== false) cookie = sc.split(';')[0];
  let data = null; try { data = await res.json(); } catch {}
  return { status: res.status, data };
};
const goodDay = () => { let d = addDays(nowParts().date, 5); while (weekday(d) === 1) d = addDays(d, 1); return d; };
const mondayAhead = () => { let d = addDays(nowParts().date, 3); while (weekday(d) !== 1) d = addDays(d, 1); return d; };
const booking = (o = {}) => ({ seat: 'counter', guests: 2, date: goodDay(), time: '20:00', name: 'Test Guest', email: 'g@test.co', cc: '+62', phone: '81234567890', occasion: 1, diet: [0], addons: ['cake'], lang: 'en', ...o });

test('health and seeded menu', async () => {
  assert.equal((await call('GET', '/health')).status, 200);
  const m = await call('GET', '/menu');
  assert.equal(m.status, 200); assert.equal(m.data.items.length, 15); assert.equal(m.data.categories.length, 5);
  assert.match(m.data.items.find((x) => x.id === 'sate').name.ja, /サテ/);
});

test('availability: closed Monday, open day, shape', async () => {
  const a = await call('GET', '/availability?seat=counter');
  assert.equal(a.status, 200);
  assert.equal(a.data.days[mondayAhead()].state, 'closed');
  assert.equal(a.data.days[goodDay()].slots['20:00'], 12);
  assert.equal((await call('GET', '/availability?seat=nope')).status, 400);
});

test('booking validation', async () => {
  const bad = async (o, code) => { const r = await call('POST', '/reservations', booking(o)); assert.equal(r.status, 400, JSON.stringify(o)); assert.equal(r.data.code, code); };
  await bad({ seat: 'x' }, 'seat'); await bad({ guests: 9 }, 'guests'); await bad({ seat: 'room', guests: 2 }, 'guests');
  await bad({ date: mondayAhead() }, 'date'); await bad({ date: '2020-01-01' }, 'date'); await bad({ time: '03:00' }, 'time');
  await bad({ name: 'A' }, 'name'); await bad({ email: 'nope' }, 'email'); await bad({ phone: '12' }, 'phone'); await bad({ website: 'bot' }, 'spam');
});

test('booking, capacity, waitlist', async () => {
  const day = goodDay();
  const a = await call('POST', '/reservations', booking({ date: day, time: '17:30', guests: 4, email: 'a@t.co' }));
  assert.equal(a.status, 201); assert.match(a.data.ref, /^SUMI-[A-Z2-9]{5}$/); assert.equal(a.data.status, 'confirmed'); assert.equal(a.data.depositIdr, 800000);
  await call('POST', '/reservations', booking({ date: day, time: '17:30', guests: 4, email: 'b@t.co' }));
  const c = await call('POST', '/reservations', booking({ date: day, time: '17:30', guests: 4, email: 'c@t.co' }));
  assert.equal(c.data.status, 'confirmed');
  const d = await call('POST', '/reservations', booking({ date: day, time: '17:30', guests: 2, email: 'd@t.co' }));
  assert.equal(d.data.status, 'waitlist'); assert.equal(d.data.depositIdr, 0);
  const av = await call('GET', '/availability?seat=counter');
  assert.equal(av.data.days[day].slots['17:30'], 0);
});

test('concurrent bookings never exceed capacity', async () => {
  const day = addDays(goodDay(), 1), d = weekday(day) === 1 ? addDays(day, 1) : day;
  const rs = await Promise.all(Array.from({ length: 6 }, (_, i) => call('POST', '/reservations', booking({ date: d, time: '20:00', guests: 4, email: `p${i}@t.co` }), { nocookie: true })));
  const conf = rs.filter((r) => r.data.status === 'confirmed').length;
  assert.equal(conf, 3, `confirmed ${conf}`);
});

test('admin requires sign in; origin check', async () => {
  cookie = '';
  assert.equal((await call('GET', '/admin/menu')).status, 401);
  assert.equal((await call('GET', '/admin/reservations')).status, 401);
  assert.equal((await call('POST', '/reservations', booking({ email: 'o@t.co' }), { headers: { origin: 'https://evil.example' } })).status, 403);
});

test('login, forced password change, rate limit', async () => {
  assert.equal((await call('POST', '/auth/login', { email: 'owner@sumi.test', password: 'wrong' })).status, 401);
  const ok = await call('POST', '/auth/login', { email: 'owner@sumi.test', password: 'first-password-123' });
  assert.equal(ok.status, 200); assert.equal(ok.data.user.mustChange, true);
  assert.equal((await call('GET', '/admin/menu')).status, 403); // must change first
  assert.equal((await call('POST', '/auth/password', { current: 'first-password-123', next: 'short' })).status, 400);
  assert.equal((await call('POST', '/auth/password', { current: 'first-password-123', next: 'a-better-password-9' })).status, 200);
  assert.equal((await call('GET', '/admin/menu')).status, 200);
  const me = await call('GET', '/auth/me'); assert.equal(me.data.user.mustChange, false);
  // old password no longer works, brute force locks out
  const keep = cookie; cookie = '';
  for (let i = 0; i < 9; i++) await call('POST', '/auth/login', { email: 'victim@sumi.test', password: 'x' + i });
  assert.equal((await call('POST', '/auth/login', { email: 'victim@sumi.test', password: 'x' })).status, 429);
  cookie = keep;
});

test('menu CRUD as owner', async () => {
  const item = { category: 'mains', priceIdr: 120000, name: { en: 'Test Duck', id: 'Bebek Tes', ja: '' }, desc: { en: 'Smoked.', id: '', ja: '' }, veg: false, spicy: true, photo: 'grill', available: true, featured: false };
  const c = await call('POST', '/admin/menu', item); assert.equal(c.status, 201); assert.equal(c.data.slug, 'test-duck');
  assert.equal((await call('POST', '/admin/menu', { ...item, priceIdr: -5 })).status, 400);
  assert.equal((await call('POST', '/admin/menu', { ...item, name: { en: '' } })).status, 400);
  assert.equal((await call('POST', '/admin/menu', { ...item, photo: 'nope' })).status, 400);
  const u = await call('PUT', `/admin/menu/${c.data.id}`, { ...item, priceIdr: 130000, available: false });
  assert.equal(u.data.priceIdr, 130000);
  const pub = await call('GET', '/menu'); const row = pub.data.items.find((x) => x.id === 'test-duck');
  assert.equal(row.priceIdr, 130000); assert.equal(row.available, false); assert.equal(row.name.ja, 'Test Duck'); // falls back to English
  const list = (await call('GET', '/admin/menu')).data.items.filter((x) => x.category === 'mains').map((x) => x.id).reverse();
  assert.equal((await call('POST', '/admin/menu/reorder', { category: 'mains', ids: list })).status, 200);
  assert.equal((await call('DELETE', `/admin/menu/${c.data.id}`)).status, 200);
  assert.equal((await call('DELETE', `/admin/menu/${c.data.id}`)).status, 404);
});

test('staff: host role limits', async () => {
  const mk = await call('POST', '/admin/staff', { email: 'host@sumi.test', name: 'Host One', role: 'host', password: 'temp-password-1' });
  assert.equal(mk.status, 201);
  const owner = cookie; cookie = '';
  await call('POST', '/auth/login', { email: 'host@sumi.test', password: 'temp-password-1' });
  await call('POST', '/auth/password', { current: 'temp-password-1', next: 'host-password-99' });
  assert.equal((await call('GET', '/admin/staff')).status, 403);
  const items = (await call('GET', '/admin/menu')).data.items;
  const it = items[0];
  assert.equal((await call('PUT', `/admin/menu/${it.id}`, { ...it, priceIdr: 1 })).status, 403);
  assert.equal((await call('PUT', `/admin/menu/${it.id}`, { available: false })).status, 200);
  assert.equal((await call('DELETE', `/admin/menu/${it.id}`)).status, 403);
  await call('PUT', `/admin/menu/${it.id}`, { available: true });
  cookie = owner;
});

test('check-in flow: arrive, seat, table conflict, complete, audit', async () => {
  const day = addDays(goodDay(), 2), d = weekday(day) === 1 ? addDays(day, 1) : day;
  const a = (await call('POST', '/reservations', booking({ seat: 'table', date: d, time: '19:00', guests: 2, email: 'x@t.co', name: 'Ayu One' }))).data.ref;
  const b = (await call('POST', '/reservations', booking({ seat: 'table', date: d, time: '19:30', guests: 2, email: 'y@t.co', name: 'Budi Two' }))).data.ref;
  const find = await call('GET', `/admin/reservations?date=${d}&q=ayu`); assert.equal(find.data.reservations.length, 1);
  assert.equal((await call('POST', `/admin/reservations/${a}/status`, { to: 'seated', table: 'T1' })).status, 409); // cannot skip arrived
  assert.equal((await call('POST', `/admin/reservations/${a}/status`, { to: 'arrived' })).status, 200);
  assert.equal((await call('POST', `/admin/reservations/${a}/status`, { to: 'seated' })).status, 400); // table required
  assert.equal((await call('POST', `/admin/reservations/${a}/status`, { to: 'seated', table: 'C1' })).status, 400); // wrong area
  assert.equal((await call('POST', `/admin/reservations/${a}/status`, { to: 'seated', table: 'T1' })).data.status, 'seated');
  await call('POST', `/admin/reservations/${b}/status`, { to: 'arrived' });
  const clash = await call('POST', `/admin/reservations/${b}/status`, { to: 'seated', table: 'T1' }); assert.equal(clash.status, 409); assert.equal(clash.data.code, 'table_busy');
  const detail = await call('GET', `/admin/reservations/${b}`); assert.ok(!detail.data.freeTables.includes('T1'));
  assert.equal((await call('POST', `/admin/reservations/${a}/status`, { to: 'completed' })).data.status, 'completed');
  assert.equal((await call('POST', `/admin/reservations/${a}/status`, { to: 'arrived' })).status, 409);
  const ev = (await call('GET', `/admin/reservations/${a}`)).data.events.map((e) => e.to);
  assert.deepEqual(ev, ['confirmed', 'arrived', 'seated', 'completed']);
  assert.equal((await call('GET', '/admin/reservations/SUMI-ZZZZZ')).status, 404);
});

test('waitlist promotion respects capacity', async () => {
  const day = addDays(goodDay(), 3), d = weekday(day) === 1 ? addDays(day, 1) : day;
  const mk = async (g, e) => (await call('POST', '/reservations', booking({ seat: 'room', guests: g, date: d, time: '18:00', email: e }), { nocookie: true })).data;
  const first = await mk(8, 'r1@t.co'); assert.equal(first.status, 'confirmed');
  const w = await mk(4, 'r2@t.co'); assert.equal(w.status, 'waitlist');
  assert.equal((await call('POST', `/admin/reservations/${w.ref}/status`, { to: 'confirmed' })).status, 409); // no room
  await call('POST', `/admin/reservations/${first.ref}/status`, { to: 'cancelled' });
  assert.equal((await call('POST', `/admin/reservations/${w.ref}/status`, { to: 'confirmed' })).data.status, 'confirmed');
});

test('Vercel rewrite form (/api/index?__p=...) routes like the plain path', async () => {
  const origin = base.replace(/\/api$/, '');
  const me = await fetch(`${origin}/api/index?__p=auth%2Fme`).then((r) => r.json());
  assert.ok('user' in me);
  const av = await fetch(`${origin}/api/index?__p=availability&seat=counter`).then((r) => r.json());
  assert.equal(av.seat, 'counter'); // other query params survive, __p is stripped
  assert.equal((await fetch(`${origin}/api/index?__p=nope/missing`)).status, 404);
});
