/* Shiro Sumi: loader, nav, reveals, menu glow, reservation form. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Loader: shown once per session, never blocks for long. */
  var loader = document.getElementById('loader');
  function endLoader() {
    if (!loader || loader.classList.contains('is-done')) return;
    loader.classList.add('is-done');
    try { sessionStorage.setItem('sumi-loaded', '1'); } catch (e) {}
    setTimeout(function () { revealStart(); loader.remove(); }, 900);
  }
  if (loader && !root.classList.contains('no-loader')) {
    setTimeout(endLoader, 1700);
  } else {
    if (loader) loader.remove();
  }

  /* Reveal on scroll */
  var io = null;
  function revealStart() {
    var els = document.querySelectorAll('.reveal:not(.in)');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    io = io || new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }
  if (!loader || root.classList.contains('no-loader')) revealStart();

  /* Nav toggle (mobile) */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    var I = window.SUMI_I18N;
    if (I) toggle.setAttribute('aria-label', I.t(open ? 'nav.close' : 'nav.toggle'));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    matchMedia('(min-width: 860px)').addEventListener('change', function (m) { if (m.matches) setNav(false); });
    document.addEventListener('sumi:lang', function () { setNav(toggle.getAttribute('aria-expanded') === 'true'); });
  }

  /* Menu rows: ember glow follows the pointer */
  document.querySelectorAll('.dish').forEach(function (d) {
    d.addEventListener('pointermove', function (e) {
      var r = d.getBoundingClientRect();
      d.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      d.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* Reservation form (concept: nothing is sent) */
  var form = document.getElementById('res-form');
  if (form) {
    var I18 = window.SUMI_I18N;
    var ok = document.getElementById('res-ok');
    var name = form.elements.name, date = form.elements.date;
    var eName = document.getElementById('e-name'), eDate = document.getElementById('e-date');
    var lastName = null;

    function show(el, input, key) {
      el.hidden = !key;
      el.textContent = key ? I18.t(key) : '';
      if (input) input.setAttribute('aria-invalid', key ? 'true' : 'false');
    }
    function isClosed(v) {
      if (!v) return true;
      var p = v.split('-');
      var dow = new Date(+p[0], +p[1] - 1, +p[2]).getDay(); // 1 = Monday
      return dow === 1;
    }
    function renderOk() {
      if (lastName == null) return;
      ok.hidden = false;
      ok.textContent = I18.t('res.ok').replace('{name}', lastName);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = false;
      var nm = name.value.trim();
      show(eName, name, nm ? '' : 'res.err.name'); if (!nm) bad = true;
      show(eDate, date, isClosed(date.value) ? 'res.err.date' : ''); if (isClosed(date.value)) bad = true;
      if (bad) { ok.hidden = true; lastName = null; (nm ? date : name).focus(); return; }
      lastName = nm; renderOk(); ok.focus && ok.setAttribute('tabindex', '-1'); ok.focus();
    });
    document.addEventListener('sumi:lang', function () {
      if (!eName.hidden) eName.textContent = I18.t('res.err.name');
      if (!eDate.hidden) eDate.textContent = I18.t('res.err.date');
      renderOk();
    });
  }
})();
