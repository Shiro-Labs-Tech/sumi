import './admin.css';

/* ---------- tiny DOM helper (text is always set as text, never as HTML: guest names and notes are untrusted) ---------- */
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'value') el.value = v;
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
};
const $app = document.getElementById('app');

const idr = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');
const TZ = 'Asia/Jakarta';
const todayISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
const shift = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const longDay = (iso) => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(iso + 'T00:00:00Z'));
const stamp = (t) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(t));
const SEAT = { counter: 'The Counter', table: 'Dining table', room: 'Private room', terrace: 'Terrace' };
const STATUS = { confirmed: 'Confirmed', waitlist: 'Waitlist', arrived: 'Arrived', seated: 'Seated', completed: 'Completed', no_show: 'No-show', cancelled: 'Cancelled' };
const OCC = ['None', 'Birthday', 'Anniversary', 'Business', 'Date night', 'Celebration', 'Just us', 'Other'];
const DIET = ['Vegetarian', 'Pescatarian', 'No pork', 'Gluten-free', 'Nut allergy', 'Shellfish allergy', 'Dairy-free', 'Halal'];
const ADDON = { sake: 'Sake pairing', cake: 'Celebration plate' };
const pill = (s) => h('span', { class: `pill s-${s}` }, STATUS[s] || s);

let me = null, toastTimer;
function toast(msg, bad) {
  document.querySelector('.toast')?.remove();
  const t = h('div', { class: 'toast' + (bad ? ' bad' : ''), role: bad ? 'alert' : 'status' }, msg);
  document.body.append(t); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 3500);
}

async function api(method, path, body) {
  let r;
  try { r = await fetch('/api' + path, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, credentials: 'same-origin' }); }
  catch { const e = new Error('Cannot reach the server'); e.code = 'network'; throw e; }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(j.error || 'Request failed'); e.status = r.status; e.code = j.code; throw e; }
  return j;
}
// Any 401 or forced-password response sends the user back to the right screen.
async function guard(fn) {
  try { return await fn(); }
  catch (e) {
    if (e.status === 401) { me = null; boot(); return null; }
    if (e.code === 'must_change') { showPassword(true); return null; }
    throw e;
  }
}

/* ---------- login and password ---------- */
function showLogin(note) {
  const err = h('p', { class: 'err', role: 'alert' }, note || '');
  const email = h('input', { class: 'inp', type: 'email', autocomplete: 'username', required: true, id: 'l-email' });
  const pw = h('input', { class: 'inp', type: 'password', autocomplete: 'current-password', required: true, id: 'l-pw' });
  const btn = h('button', { class: 'btn btn--p', type: 'submit' }, 'Sign in');
  const form = h('form', { onsubmit: async (e) => {
    e.preventDefault(); err.textContent = ''; btn.disabled = true; btn.textContent = 'Signing in…';
    try { const r = await api('POST', '/auth/login', { email: email.value, password: pw.value }); me = r.user; boot(); }
    catch (x) { err.textContent = x.message; btn.disabled = false; btn.textContent = 'Sign in'; pw.select(); }
  } },
  h('label', { class: 'field' }, h('span', {}, 'Email'), email),
  h('label', { class: 'field' }, h('span', {}, 'Password'), pw), err, btn);
  $app.replaceChildren(h('div', { class: 'login' }, h('div', { class: 'login__box' },
    h('div', { class: 'brand' }, h('span', { class: 'brand__m' }, '炭'), h('div', {}, h('b', {}, 'Shiro Sumi'), h('small', {}, 'Staff'))),
    h('h1', {}, 'Sign in'), h('p', { class: 'muted' }, 'Reservations, check-in and the menu.'), form,
    h('p', { class: 'dim', style: 'margin-top:1.6rem;font-size:.85rem' }, 'Shiro Sumi is a concept restaurant by Shiro Labs. This is a demo system.'))));
  email.focus();
}

function showPassword(forced) {
  const cur = h('input', { class: 'inp', type: 'password', autocomplete: 'current-password', required: true });
  const nw = h('input', { class: 'inp', type: 'password', autocomplete: 'new-password', required: true, minlength: 10 });
  const err = h('p', { class: 'err', role: 'alert' });
  const form = h('form', { onsubmit: async (e) => {
    e.preventDefault(); err.textContent = '';
    try { await api('POST', '/auth/password', { current: cur.value, next: nw.value }); me.mustChange = false; toast('Password changed'); dlg.close(); if (forced) boot(); }
    catch (x) { err.textContent = x.message; }
  } },
  h('label', { class: 'field' }, h('span', {}, 'Current password'), cur),
  h('label', { class: 'field' }, h('span', {}, 'New password (10+ characters)'), nw), err,
  h('div', { class: 'row' }, h('button', { class: 'btn btn--p', type: 'submit' }, 'Change password'), forced ? null : h('button', { class: 'btn', type: 'button', onclick: () => dlg.close() }, 'Cancel')));
  const dlg = modal(h('div', { class: 'dlg' }, h('h2', {}, forced ? 'Choose a new password' : 'Change password'), forced ? h('p', { class: 'muted' }, 'Your account uses a temporary password. Pick your own to continue.') : null, form), forced);
  cur.focus();
}

function modal(content, noClose) {
  const d = h('dialog', {}, content);
  if (noClose) d.addEventListener('cancel', (e) => e.preventDefault());
  d.addEventListener('close', () => d.remove());
  d.addEventListener('click', (e) => { if (!noClose && e.target === d) d.close(); });
  document.body.append(d); d.showModal(); return d;
}

/* ---------- shell and router ---------- */
function shell(active, body) {
  const links = [['#/', 'Reservations', 'res'], ['#/menu', 'Menu', 'menu']];
  if (me.role === 'owner') links.push(['#/team', 'Team', 'team']);
  $app.replaceChildren(
    h('header', { class: 'top' },
      h('a', { class: 'brand', href: '#/' }, h('span', { class: 'brand__m' }, '炭'), h('div', {}, h('b', {}, 'Shiro Sumi'), h('small', {}, 'Staff'))),
      h('nav', { class: 'nav', 'aria-label': 'Sections' }, links.map(([href, label, k]) => h('a', { href, 'aria-current': k === active ? 'page' : null }, label))),
      h('div', { class: 'who' }, h('span', {}, h('b', {}, me.email), ' · ', me.role),
        h('button', { class: 'btn btn--sm', onclick: () => showPassword(false) }, 'Password'),
        h('button', { class: 'btn btn--sm', onclick: async () => { try { await api('POST', '/auth/logout'); } catch {} me = null; boot(); } }, 'Sign out'))),
    h('main', { class: 'main', id: 'main' }, body));
}

const route = () => {
  const m = location.hash.replace(/^#/, '') || '/';
  let x;
  if ((x = m.match(/^\/r\/([A-Za-z0-9-]+)/))) return viewDetail(x[1].toUpperCase());
  if (m.startsWith('/menu')) return viewMenu();
  if (m.startsWith('/team') && me.role === 'owner') return viewTeam();
  return viewList();
};

async function boot() {
  if (!me) { try { me = (await api('GET', '/auth/me')).user; } catch { me = null; } }
  if (!me) return showLogin();
  if (me.mustChange) return showPassword(true);
  route();
}
addEventListener('hashchange', () => { if (me && !me.mustChange) route(); });

/* ---------- reservations list ---------- */
const V = { date: todayISO(), status: '', q: '' };
async function viewList() {
  const list = h('div'), stats = h('div', { class: 'stats' });
  const dayLbl = h('div', { class: 'day__d', 'aria-live': 'polite' });
  const search = h('input', { class: 'inp', type: 'search', placeholder: 'Search name, phone, email', 'aria-label': 'Search reservations', value: V.q });
  const lookup = h('input', { class: 'inp', placeholder: 'Reference (SUMI-…)', 'aria-label': 'Look up by reference', autocapitalize: 'characters' });
  const chips = h('div', { class: 'row', role: 'group', 'aria-label': 'Filter by status' });
  const load = async () => {
    dayLbl.textContent = V.date === 'all' ? 'All dates' : longDay(V.date) + (V.date === todayISO() ? ' · today' : '');
    chips.replaceChildren(...['', 'confirmed', 'waitlist', 'arrived', 'seated', 'completed', 'no_show', 'cancelled'].map((s) =>
      h('button', { class: 'chip', 'aria-pressed': String(V.status === s), onclick: () => { V.status = s; load(); } }, s ? STATUS[s] : 'All')));
    let d;
    try { d = await guard(() => api('GET', `/admin/reservations?date=${V.date}&status=${V.status}&q=${encodeURIComponent(V.q)}`)); } catch (e) { list.replaceChildren(h('p', { class: 'err' }, e.message)); return; }
    if (!d) return;
    const st = d.stats, n = (k) => (st[k] ? st[k].n : 0);
    const covers = ['confirmed', 'arrived', 'seated', 'completed'].reduce((a, k) => a + (st[k] ? st[k].covers : 0), 0);
    stats.replaceChildren(...[['Covers', covers], ['Confirmed', n('confirmed')], ['Arrived', n('arrived')], ['Seated', n('seated')], ['Waitlist', n('waitlist')], ['No-shows', n('no_show')]].map(([l, v]) => h('div', { class: 'stat' }, h('b', {}, v), h('span', {}, l))));
    if (!d.reservations.length) { list.replaceChildren(h('div', { class: 'empty' }, V.q || V.status ? 'No reservations match.' : 'No reservations for this day yet.')); return; }
    const out = []; let last = '';
    for (const r of d.reservations) {
      const key = V.date === 'all' ? r.date : r.time;
      if (key !== last) { out.push(h('h2', { class: 'slot-h' }, V.date === 'all' ? longDay(r.date) : r.time)); last = key; }
      const bits = [SEAT[r.seat], r.table ? `table ${r.table}` : null, r.occasion ? OCC[r.occasion] : null, r.diet.length ? r.diet.map((i) => DIET[+i]).filter(Boolean).join(', ') : null, ...r.addons.map((a) => ADDON[a])].filter(Boolean).join(' · ');
      out.push(h('a', { class: 'rsv', href: `#/r/${r.ref}` }, h('span', { class: 'rsv__t' }, r.time),
        h('span', { class: 'rsv__n' }, r.name, ' · ', `${r.guests} ${r.guests === 1 ? 'guest' : 'guests'}`), h('span', { class: 'rsv__s' }, pill(r.status), h('small', { class: 'dim' }, r.ref)),
        h('span', { class: 'rsv__m' }, bits)));
    }
    list.replaceChildren(...out);
  };
  let t; search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { V.q = search.value.trim(); load(); }, 250); });
  const go = (e) => { e.preventDefault(); const m = lookup.value.toUpperCase().match(/SUMI-[A-Z0-9]{5}/); if (!m) return toast('Enter a reference like SUMI-AB2CD', true); location.hash = `#/r/${m[0]}`; };
  const step = (n) => () => { V.date = shift(V.date === 'all' ? todayISO() : V.date, n); load(); };
  const picker = h('input', { class: 'inp', type: 'date', 'aria-label': 'Pick a date', value: V.date === 'all' ? todayISO() : V.date, style: 'width:auto', onchange: (e) => { if (e.target.value) { V.date = e.target.value; load(); } } });
  shell('res', [
    h('h1', { class: 'pg' }, 'Reservations'), h('p', { class: 'sub' }, 'Today’s book, check-in and seating.'),
    h('div', { class: 'bar' },
      h('div', { class: 'day' }, h('button', { class: 'btn btn--i', 'aria-label': 'Previous day', onclick: step(-1) }, '←'), dayLbl, h('button', { class: 'btn btn--i', 'aria-label': 'Next day', onclick: step(1) }, '→')),
      h('button', { class: 'btn btn--sm', onclick: () => { V.date = todayISO(); load(); } }, 'Today'), picker,
      h('button', { class: 'btn btn--sm', 'aria-pressed': 'false', onclick: () => { V.date = V.date === 'all' ? todayISO() : 'all'; load(); } }, 'All dates'),
      h('form', { class: 'look', onsubmit: go }, lookup, h('button', { class: 'btn btn--p', type: 'submit' }, 'Open'), 'BarcodeDetector' in window ? h('button', { class: 'btn', type: 'button', onclick: scanDialog }, 'Scan') : null)),
    stats, h('div', { class: 'bar' }, search, chips), list]);
  load();
}

/* ---------- QR scan (Chromium BarcodeDetector) ---------- */
async function scanDialog() {
  const video = h('video', { class: 'vid', playsinline: true, muted: true });
  const msg = h('p', { class: 'muted' }, 'Point the camera at the guest’s QR code.');
  let stream, stop = false;
  const dlg = modal(h('div', { class: 'dlg' }, h('h2', {}, 'Scan a reservation'), video, msg, h('button', { class: 'btn', onclick: () => dlg.close() }, 'Close')));
  dlg.addEventListener('close', () => { stop = true; stream?.getTracks().forEach((t) => t.stop()); });
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream; await video.play();
    const det = new BarcodeDetector({ formats: ['qr_code'] });
    const tick = async () => {
      if (stop) return;
      try { const c = await det.detect(video); const m = c.map((x) => x.rawValue.toUpperCase().match(/SUMI-[A-Z0-9]{5}/)).find(Boolean); if (m) { dlg.close(); location.hash = `#/r/${m[0]}`; return; } } catch {}
      setTimeout(tick, 250);
    };
    tick();
  } catch { msg.textContent = 'Camera unavailable. Type the reference instead.'; msg.className = 'err'; }
}

/* ---------- reservation detail and check-in ---------- */
async function viewDetail(ref) {
  const body = h('div'); shell('res', body);
  let r;
  try { r = await guard(() => api('GET', `/admin/reservations/${ref}`)); } catch (e) {
    body.replaceChildren(h('a', { class: 'back', href: '#/' }, '← Reservations'), h('h1', { class: 'pg' }, e.code === 'not_found' ? 'No reservation found' : 'Something went wrong'), h('p', { class: 'sub' }, e.code === 'not_found' ? `Nothing matches ${ref}. Check the reference and try again.` : e.message)); return;
  }
  if (!r) return;
  const draw = (r) => {
    const note = h('textarea', { class: 'inp', placeholder: 'Note for the log (optional)', 'aria-label': 'Note', maxlength: 200 });
    let table = null;
    const act = async (to, btn) => {
      btn.disabled = true;
      try { const nr = await guard(() => api('POST', `/admin/reservations/${r.ref}/status`, { to, table, note: note.value })); if (nr) { toast(`${STATUS[to]}`); draw(nr); } }
      catch (e) { btn.disabled = false; toast(e.message, true); }
    };
    const danger = (label, to) => { const b = h('button', { class: 'btn btn--d' }, label); let armed = false; b.addEventListener('click', () => { if (!armed) { armed = true; b.textContent = 'Tap again to confirm'; setTimeout(() => { armed = false; b.textContent = label; }, 4000); } else act(to, b); }); return b; };
    const main = (label, to) => { const b = h('button', { class: 'btn btn--p' }, label); b.addEventListener('click', () => act(to, b)); return b; };
    const a = [];
    if (r.status === 'confirmed') a.push(main('Mark arrived', 'arrived'), danger('No-show', 'no_show'), danger('Cancel reservation', 'cancelled'));
    else if (r.status === 'waitlist') a.push(main('Confirm from waitlist', 'confirmed'), danger('Cancel reservation', 'cancelled'));
    else if (r.status === 'arrived') {
      const go = h('button', { class: 'btn btn--p', disabled: true }, 'Seat guests'); go.addEventListener('click', () => act('seated', go));
      const tbs = r.freeTables.map((t) => h('button', { class: 'tbl', 'aria-pressed': 'false', onclick: (e) => { table = t; tbs.forEach((x) => x.setAttribute('aria-pressed', String(x === e.currentTarget))); go.disabled = false; go.textContent = `Seat at ${t}`; } }, t));
      a.push(h('div', {}, h('p', { class: 'lbl', style: 'margin:0 0 .5rem' }, 'Choose a table'), tbs.length ? h('div', { class: 'tables' }, tbs) : h('p', { class: 'err' }, 'No free tables in this area.')), go, danger('Cancel reservation', 'cancelled'));
    } else if (r.status === 'seated') a.push(main('Complete visit', 'completed'));
    else if (r.status === 'no_show') a.push(main('Arrived late', 'arrived'));
    else a.push(h('p', { class: 'muted' }, 'This reservation is closed.'));
    const kv = (k, v) => v ? [h('dt', {}, k), h('dd', {}, v)] : [];
    body.replaceChildren(
      h('a', { class: 'back', href: '#/' }, '← Reservations'),
      h('div', { class: 'det' },
        h('div', { class: 'card' }, h('div', { class: 'row', style: 'justify-content:space-between' }, pill(r.status), h('span', { class: 'dim' }, `Booked ${stamp(r.createdAt)}`)),
          h('p', { class: 'ref' }, r.ref),
          h('dl', { class: 'kv' },
            ...kv('Guest', r.name), ...kv('Phone', r.phone), ...kv('Email', r.email),
            ...kv('Date', `${longDay(r.date)} · ${r.time}`), ...kv('Seating', SEAT[r.seat] + (r.table ? ` · table ${r.table}` : '')), ...kv('Party', `${r.guests} ${r.guests === 1 ? 'guest' : 'guests'}`),
            ...kv('Occasion', r.occasion ? OCC[r.occasion] : ''), ...kv('Dietary', r.diet.map((i) => DIET[+i]).filter(Boolean).join(', ')), ...kv('Add-ons', r.addons.map((x) => ADDON[x]).join(', ')),
            ...kv('Notes', r.notes), ...kv('Deposit', r.depositIdr ? `${idr(r.depositIdr)} · credited to the bill` : r.status === 'waitlist' ? 'None until confirmed' : ''), ...kv('Estimate', r.estimateIdr ? idr(r.estimateIdr) : ''))),
        h('div', { class: 'actions' }, h('div', { class: 'card actions' }, h('h2', { class: 'lbl', style: 'margin:0' }, 'Check-in'), note, ...a),
          h('div', { class: 'card' }, h('h2', { class: 'lbl', style: 'margin:0 0 .9rem' }, 'History'),
            h('ol', { class: 'tl' }, r.events.map((e) => h('li', {}, `${STATUS[e.to] || e.to}`, h('small', {}, `${stamp(e.at)} · ${e.actor}${e.note ? ' · ' + e.note : ''}`))))))));
  };
  draw(r);
}

/* ---------- menu ---------- */
let MENU = null;
const thumb = (ids, key, w = 160) => ids[key] ? `https://images.unsplash.com/photo-${ids[key]}?auto=format&fit=crop&w=${w}&q=60` : '';
async function viewMenu() {
  const body = h('div'); shell('menu', body);
  const load = async () => {
    try { MENU = await guard(() => api('GET', '/admin/menu')); } catch (e) { body.replaceChildren(h('p', { class: 'err' }, e.message)); return; }
    if (!MENU) return;
    const owner = me.role === 'owner';
    const toggle = async (it, on) => {
      try { await guard(() => api('PUT', `/admin/menu/${it.id}`, owner ? { ...fromItem(it), available: on } : { available: on })); toast(on ? `${it.name.en} is back on` : `${it.name.en} marked sold out`); load(); }
      catch (e) { toast(e.message, true); load(); }
    };
    const move = async (cat, it, dir) => {
      const ids = MENU.items.filter((x) => x.category === cat.id).map((x) => x.id), i = ids.indexOf(it.id), j = i + dir;
      if (j < 0 || j >= ids.length) return; [ids[i], ids[j]] = [ids[j], ids[i]];
      try { await api('POST', '/admin/menu/reorder', { category: cat.id, ids }); load(); } catch (e) { toast(e.message, true); }
    };
    body.replaceChildren(
      h('div', { class: 'row', style: 'justify-content:space-between;align-items:flex-end' },
        h('div', {}, h('h1', { class: 'pg' }, 'Menu'), h('p', { class: 'sub' }, owner ? 'Changes go live on the website within seconds.' : 'You can mark dishes sold out. The owner edits everything else.')),
        h('div', { class: 'row' }, h('a', { class: 'btn', href: '/menu', target: '_blank', rel: 'noopener' }, 'View menu ↗'), owner ? h('button', { class: 'btn btn--p', onclick: () => editItem(null, load) }, '+ Add dish') : null)),
      ...MENU.categories.map((c) => {
        const rows = MENU.items.filter((x) => x.category === c.id);
        return h('section', { class: 'mcat' }, h('h2', {}, c.name.en, h('small', { class: 'dim' }, `${rows.length} ${rows.length === 1 ? 'dish' : 'dishes'}`)),
          rows.length ? rows.map((it, i) => h('div', { class: 'mi' + (it.available ? '' : ' is-out') },
            h('div', { class: 'mi__thumb', style: it.photo ? `background-image:url(${thumb(MENU.photoIds, it.photo)})` : '' }),
            h('div', { class: 'mi__n' }, it.name.en, h('small', {}, [it.veg ? 'Vegetarian' : '', it.spicy ? 'Spicy' : '', it.featured ? 'On home page' : '', !it.name.id || !it.name.ja ? 'Missing translation' : ''].filter(Boolean).join(' · ') || ' ')),
            h('div', { class: 'mi__p' }, idr(it.priceIdr)),
            h('div', { class: 'mi__a' },
              h('button', { class: 'sw', role: 'switch', 'aria-checked': String(it.available), 'aria-label': `${it.name.en} available`, title: it.available ? 'Available. Click to mark sold out' : 'Sold out. Click to put back', onclick: () => toggle(it, !it.available) }),
              owner ? [h('button', { class: 'btn btn--sm btn--i', 'aria-label': `Move ${it.name.en} up`, disabled: i === 0, onclick: () => move(c, it, -1) }, '↑'), h('button', { class: 'btn btn--sm btn--i', 'aria-label': `Move ${it.name.en} down`, disabled: i === rows.length - 1, onclick: () => move(c, it, 1) }, '↓'), h('button', { class: 'btn btn--sm', onclick: () => editItem(it, load) }, 'Edit')] : null)))
            : h('div', { class: 'empty' }, 'No dishes in this section.'));
      }));
  };
  load();
}
const fromItem = (it) => ({ category: it.category, priceIdr: it.priceIdr, name: it.name, desc: it.desc, veg: it.veg, spicy: it.spicy, photo: it.photo, available: it.available, featured: it.featured });

function editItem(it, done) {
  const isNew = !it, cur = it ? fromItem(it) : { category: MENU.categories[0].id, priceIdr: 50000, name: { en: '', id: '', ja: '' }, desc: { en: '', id: '', ja: '' }, veg: false, spicy: false, photo: null, available: true, featured: false };
  const LANGS = [['en', 'English'], ['id', 'Bahasa Indonesia'], ['ja', '日本語']];
  let lang = 'en', photo = cur.photo;
  const cat = h('select', { class: 'inp' }, MENU.categories.map((c) => h('option', { value: c.id, selected: c.id === cur.category }, c.name.en)));
  const price = h('input', { class: 'inp', type: 'number', min: 0, step: 1000, value: cur.priceIdr, inputmode: 'numeric' });
  const names = {}, descs = {}, panes = {};
  for (const [l, label] of LANGS) {
    names[l] = h('input', { class: 'inp', maxlength: 80, value: cur.name[l], placeholder: l === 'en' ? 'Dish name' : 'Falls back to English if empty' });
    descs[l] = h('textarea', { class: 'inp', maxlength: 300, placeholder: 'Short description' }); descs[l].value = cur.desc[l];
    panes[l] = h('div', { class: 'grid2', style: 'grid-template-columns:1fr', hidden: l !== 'en' }, h('label', { class: 'field' }, h('span', {}, `Name · ${label}`), names[l]), h('label', { class: 'field' }, h('span', {}, `Description · ${label}`), descs[l]));
  }
  const tabs = h('div', { class: 'tabs', role: 'group', 'aria-label': 'Language' }, LANGS.map(([l, label]) => h('button', { type: 'button', class: 'chip', 'aria-pressed': String(l === lang), onclick: () => { lang = l; tabs.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(LANGS[i][0] === l))); for (const k in panes) panes[k].hidden = k !== l; } }, label)));
  const mk = (label, v) => { const c = h('input', { type: 'checkbox', checked: !!v }); return [c, h('label', {}, c, label)]; };
  const [veg, vegL] = mk('Vegetarian', cur.veg), [spicy, spicyL] = mk('Spicy', cur.spicy), [feat, featL] = mk('Show on home page', cur.featured), [avail, availL] = mk('Available tonight', cur.available);
  const photos = h('div', { class: 'photos', role: 'group', 'aria-label': 'Photo' }, [null, ...MENU.photos].map((k) => h('button', { type: 'button', class: 'ph', title: k || 'No photo', 'aria-label': k || 'No photo', 'aria-pressed': String(k === photo), style: k ? `background-image:url(${thumb(MENU.photoIds, k, 200)})` : '', onclick: () => { photo = k; photos.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === document.activeElement || b.title === (k || 'No photo')))); } }, k ? '' : '–')));
  const err = h('p', { class: 'err', role: 'alert' });
  const save = h('button', { class: 'btn btn--p', type: 'submit' }, isNew ? 'Add dish' : 'Save changes');
  const form = h('form', { class: 'dlg', onsubmit: async (e) => {
    e.preventDefault(); err.textContent = ''; save.disabled = true;
    const payload = { category: cat.value, priceIdr: parseInt(price.value, 10), name: Object.fromEntries(LANGS.map(([l]) => [l, names[l].value])), desc: Object.fromEntries(LANGS.map(([l]) => [l, descs[l].value])), veg: veg.checked, spicy: spicy.checked, photo, available: avail.checked, featured: feat.checked };
    try { await guard(() => isNew ? api('POST', '/admin/menu', payload) : api('PUT', `/admin/menu/${it.id}`, payload)); toast(isNew ? 'Dish added' : 'Saved'); dlg.close(); done(); }
    catch (x) { err.textContent = x.message; save.disabled = false; }
  } },
  h('h2', {}, isNew ? 'Add a dish' : `Edit ${it.name.en}`),
  h('div', { class: 'grid2' }, h('label', { class: 'field' }, h('span', {}, 'Section'), cat), h('label', { class: 'field' }, h('span', {}, 'Price (Rp)'), price)),
  tabs, ...Object.values(panes), h('p', { class: 'dim', style: 'margin:0;font-size:.85rem' }, 'Indonesian and Japanese fall back to English when empty. Have a native speaker check new copy.'),
  h('div', { class: 'checks' }, vegL, spicyL, featL, availL),
  h('div', { class: 'field' }, h('span', {}, 'Photo (illustrative stock)'), photos), err,
  h('div', { class: 'row', style: 'justify-content:space-between' },
    h('div', { class: 'row' }, save, h('button', { class: 'btn', type: 'button', onclick: () => dlg.close() }, 'Cancel')),
    isNew ? null : (() => { const b = h('button', { class: 'btn btn--d', type: 'button' }, 'Delete'); let armed = false; b.addEventListener('click', async () => { if (!armed) { armed = true; b.textContent = 'Tap again to delete'; setTimeout(() => { armed = false; b.textContent = 'Delete'; }, 4000); return; } try { await api('DELETE', `/admin/menu/${it.id}`); toast('Deleted'); dlg.close(); done(); } catch (x) { err.textContent = x.message; } }); return b; })()));
  const dlg = modal(form); names.en.focus();
}

/* ---------- team (owner) ---------- */
async function viewTeam() {
  const body = h('div'); shell('team', body);
  const load = async () => {
    let d; try { d = await guard(() => api('GET', '/admin/staff')); } catch (e) { body.replaceChildren(h('p', { class: 'err' }, e.message)); return; }
    if (!d) return;
    const patch = async (id, p) => { try { await api('PATCH', `/admin/staff/${id}`, p); toast('Updated'); load(); } catch (e) { toast(e.message, true); load(); } };
    const reset = (s) => { const pw = h('input', { class: 'inp', type: 'text', minlength: 10, required: true, autocomplete: 'off' }); const err = h('p', { class: 'err' });
      const dlg = modal(h('form', { class: 'dlg', onsubmit: async (e) => { e.preventDefault(); try { await api('PATCH', `/admin/staff/${s.id}`, { password: pw.value }); toast('Temporary password set'); dlg.close(); load(); } catch (x) { err.textContent = x.message; } } },
        h('h2', {}, `Reset password for ${s.name}`), h('p', { class: 'muted' }, 'They must choose a new password at their next sign-in.'), h('label', { class: 'field' }, h('span', {}, 'Temporary password'), pw), err,
        h('div', { class: 'row' }, h('button', { class: 'btn btn--p', type: 'submit' }, 'Set password'), h('button', { class: 'btn', type: 'button', onclick: () => dlg.close() }, 'Cancel')))); pw.focus(); };
    const f = { email: h('input', { class: 'inp', type: 'email', required: true, autocomplete: 'off' }), name: h('input', { class: 'inp', required: true, autocomplete: 'off' }), role: h('select', { class: 'inp' }, h('option', { value: 'host' }, 'Host (reservations, sold-out toggle)'), h('option', { value: 'owner' }, 'Owner (everything)')), pw: h('input', { class: 'inp', type: 'text', required: true, minlength: 10, autocomplete: 'off', placeholder: '10+ characters' }) };
    const err = h('p', { class: 'err', role: 'alert' });
    body.replaceChildren(h('h1', { class: 'pg' }, 'Team'), h('p', { class: 'sub' }, 'Who can sign in. New people get a temporary password and must change it.'),
      h('div', { class: 'card', style: 'overflow-x:auto' }, h('table', { class: 'table' }, h('thead', {}, h('tr', {}, ['Name', 'Email', 'Role', 'Last sign-in', ''].map((x) => h('th', {}, x)))),
        h('tbody', {}, d.staff.map((s) => h('tr', {}, h('td', {}, s.name, s.mustChange ? h('small', { class: 'dim' }, ' · temp password') : ''), h('td', {}, s.email),
          h('td', {}, h('select', { class: 'inp', 'aria-label': `Role for ${s.name}`, style: 'width:auto', onchange: (e) => patch(s.id, { role: e.target.value }) }, ['owner', 'host'].map((r) => h('option', { value: r, selected: r === s.role }, r)))),
          h('td', { class: 'muted' }, s.lastLogin ? stamp(s.lastLogin) : 'Never'),
          h('td', {}, h('div', { class: 'row' }, h('button', { class: 'btn btn--sm', onclick: () => reset(s) }, 'Reset password'), h('button', { class: 'btn btn--sm ' + (s.active ? 'btn--d' : ''), onclick: () => patch(s.id, { active: !s.active }) }, s.active ? 'Deactivate' : 'Reactivate')))))))),
      h('form', { class: 'card', style: 'margin-top:1.4rem;display:grid;gap:1rem', onsubmit: async (e) => { e.preventDefault(); err.textContent = ''; try { await api('POST', '/admin/staff', { email: f.email.value, name: f.name.value, role: f.role.value, password: f.pw.value }); toast('Account created'); load(); } catch (x) { err.textContent = x.message; } } },
        h('h2', { class: 'lbl', style: 'margin:0' }, 'Add a team member'),
        h('div', { class: 'grid2' }, h('label', { class: 'field' }, h('span', {}, 'Name'), f.name), h('label', { class: 'field' }, h('span', {}, 'Email'), f.email), h('label', { class: 'field' }, h('span', {}, 'Role'), f.role), h('label', { class: 'field' }, h('span', {}, 'Temporary password'), f.pw)), err,
        h('div', {}, h('button', { class: 'btn btn--p', type: 'submit' }, 'Create account'))));
  };
  load();
}

boot();
