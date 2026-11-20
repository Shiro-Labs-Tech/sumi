/* Menu from the API. The static HTML is the fallback (no JS, API down); once /api/menu answers, the DB is the source of truth. */
const I = () => window.SUMI_I18N;
const lang = () => (I() && I().get()) || 'en';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const photoUrl = (ids, key, w) => (ids[key] ? `https://images.unsplash.com/photo-${ids[key]}?auto=format&fit=crop&w=${w}&q=68` : '');

let data = null;

function dishHTML(it, ids) {
  const l = lang();
  const tags = (it.veg ? '<span class="tag" data-t="tag.v"></span>' : '') + (it.spicy ? '<span class="tag tag--hot" data-t="tag.s"></span>' : '') + (it.available ? '' : '<span class="tag tag--out" data-t="tag.out"></span>');
  const peek = photoUrl(ids, it.photo, 700);
  return `<li class="dish${it.available ? '' : ' is-out'}" data-slug="${esc(it.id)}"${peek ? ` data-peek="${esc(peek)}"` : ''}>
    <div class="dish__head"><h3 class="dish__name">${esc(it.name[l])}</h3><span class="dish__leader" aria-hidden="true"></span><span class="dish__price" data-idr="${it.priceIdr}"></span></div>
    ${it.desc[l] ? `<p class="dish__desc">${esc(it.desc[l])}</p>` : ''}${tags ? `<p class="dish__tags">${tags}</p>` : ''}</li>`;
}

function renderMenu(root) {
  const { categories, items, photoIds } = data;
  root.innerHTML = categories.map((c) => {
    const rows = items.filter((i) => i.category === c.id);
    if (!rows.length) return '';
    return `<section class="cat" id="${c.id}" aria-labelledby="h-${c.id}"><h2 class="cat__title" id="h-${c.id}" data-t="cat.${c.id}">${esc(c.name[lang()])}</h2><ul class="dishes">${rows.map((i) => dishHTML(i, photoIds)).join('')}</ul></section>`;
  }).join('');
  paint(root);
}

// Translate [data-t] we just created and price the rows (i18n.js only runs on load and on language change).
function paint(root) {
  const i18n = I(); if (!i18n) return;
  root.querySelectorAll('[data-t]').forEach((el) => { el.textContent = i18n.t(el.getAttribute('data-t')); });
  root.querySelectorAll('[data-idr]').forEach((el) => { el.textContent = i18n.money(parseInt(el.getAttribute('data-idr'), 10), lang()); });
}

// Home page gallery: keep the photo and layout, take name, description and price from the menu.
function updateCards() {
  const byId = Object.fromEntries(data.items.map((i) => [i.id, i])), l = lang();
  document.querySelectorAll('.card[data-slug]').forEach((c) => {
    const it = byId[c.dataset.slug]; if (!it) return;
    const n = c.querySelector('.card__name'), d = c.querySelector('.card__desc'), p = c.querySelector('.card__price');
    n.removeAttribute('data-t'); d.removeAttribute('data-t');
    n.textContent = it.name[l]; d.textContent = it.desc[l];
    p.setAttribute('data-idr', it.priceIdr); p.textContent = I().money(it.priceIdr, l);
  });
}

export async function initMenu() {
  const root = document.querySelector('.menu'), cards = document.querySelector('.card[data-slug]');
  if (!root && !cards) return;
  try {
    const r = await fetch('/api/menu', { headers: { accept: 'application/json' } });
    if (!r.ok) throw new Error(String(r.status));
    data = await r.json();
  } catch { return; } // keep the static fallback
  const draw = () => { if (root) renderMenu(root); if (cards) updateCards(); };
  draw();
  document.addEventListener('sumi:lang', draw);
}
