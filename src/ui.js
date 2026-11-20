/* Non-motion UI: mobile nav and the concept reservation form (nothing is sent). */
export function initUI() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const I = window.SUMI_I18N;
  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (I) toggle.setAttribute('aria-label', I.t(open ? 'nav.close' : 'nav.toggle'));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
    matchMedia('(min-width: 860px)').addEventListener('change', (m) => { if (m.matches) setNav(false); });
    document.addEventListener('sumi:lang', () => setNav(toggle.getAttribute('aria-expanded') === 'true'));
  }

  const form = document.getElementById('res-form');
  if (!form) return;
  const ok = document.getElementById('res-ok');
  const name = form.elements.name, date = form.elements.date;
  const eName = document.getElementById('e-name'), eDate = document.getElementById('e-date');
  let lastName = null;
  const show = (el, input, key) => {
    el.hidden = !key;
    el.textContent = key ? I.t(key) : '';
    input.setAttribute('aria-invalid', key ? 'true' : 'false');
  };
  const isClosed = (v) => {
    if (!v) return true;
    const p = v.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).getDay() === 1; // Monday closed
  };
  const renderOk = () => {
    if (lastName == null) return;
    ok.hidden = false;
    ok.textContent = I.t('res.ok').replace('{name}', lastName);
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let bad = false;
    const nm = name.value.trim();
    show(eName, name, nm ? '' : 'res.err.name'); if (!nm) bad = true;
    show(eDate, date, isClosed(date.value) ? 'res.err.date' : ''); if (isClosed(date.value)) bad = true;
    if (bad) { ok.hidden = true; lastName = null; (nm ? date : name).focus(); return; }
    lastName = nm; renderOk(); ok.setAttribute('tabindex', '-1'); ok.focus();
  });
  document.addEventListener('sumi:lang', () => {
    if (!eName.hidden) eName.textContent = I.t('res.err.name');
    if (!eDate.hidden) eDate.textContent = I.t('res.err.date');
    renderOk();
  });
}
