/* Shiro Sumi motion layer. Original code; techniques credited in docs/research.md and docs/motion.md.
   Rules: transform, opacity and clip-path only. Every piece has a touch and reduced-motion fallback.
   - Lenis + ScrollTrigger sync: Lenis README / GSAP forum (docs/research.md M3).
   - Pinned mask reveal idea: Codrops "Pinned image mask reveal on scroll" (M2).
   - Grid mask idea: Codrops "SVG Mask Transitions on Scroll" (M1). Implemented here with plain grid cells.
   - Cross-document View Transitions: CSS in style.css (M6), GSAP curtain fallback below. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';
import { initEmbers } from './embers.js';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const tr = (k) => window.SUMI_I18N.t(k);

let lenis = null;
let splits = [];
let splitTriggers = [];

/* ---------- smooth scroll (fine pointers only) ---------- */
function initLenis() {
  if (reduce || !fine) return;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hash.length < 2) return;
    const el = document.querySelector(a.hash);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -(parseFloat(getComputedStyle(root).getPropertyValue('--hdr')) * 16 + 56) });
  });
}

/* ---------- split text ---------- */
function resplit(langChanged) {
  splitTriggers.forEach((t) => t.kill());
  splitTriggers = [];
  if (!langChanged) splits.forEach((s) => { try { s.revert(); } catch (e) { /* text already replaced */ } });
  splits = [];
  const ja = root.lang === 'ja';
  $$('.split').forEach((el) => {
    el.classList.remove('is-split', 'is-plain');
    if (reduce || ja) { el.classList.add('is-plain'); return; }
    const s = new SplitType(el, { types: 'lines,words,chars', tagName: 'span' });
    splits.push(s);
    el.classList.add('is-split');
  });
}

function animateHeadings(immediate) {
  $$('.split').forEach((el) => {
    if (el.closest('.hero') || reduce) return;
    const chars = el.classList.contains('is-split') ? $$('.char', el) : null;
    const play = () => (chars
      ? gsap.to(chars, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.014, overwrite: true })
      : gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', overwrite: true }));
    if (immediate) return;
    chars ? gsap.set(chars, { yPercent: 115 }) : gsap.set(el, { y: 36, opacity: 0 });
    splitTriggers.push(ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: play }));
  });
}

/* ---------- intro: preloader (first visit only) then hero ---------- */
function heroIn() {
  const h1 = $('.hero .split');
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  if (h1) {
    if (h1.classList.contains('is-split')) tl.to($$('.char', h1), { yPercent: 0, duration: 1.2, stagger: 0.02 }, 0);
    else tl.fromTo(h1, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0);
  }
  tl.to('[data-in]', { opacity: 1, y: 0, duration: 1, stagger: 0.1, clearProps: 'transform' }, 0.25);
  const bg = $('[data-hero-bg] img');
  if (bg) tl.fromTo(bg, { scale: 1.18 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0);
  return tl;
}

function intro() {
  const loader = $('#loader');
  const hasHero = !!$('.hero');
  if (hasHero && $('.hero .split.is-split')) gsap.set($$('.hero .split .char'), { yPercent: 115 });
  if (!loader || root.classList.contains('no-loader')) {
    loader?.remove();
    if (hasHero && !reduce) heroIn();
    return;
  }
  root.classList.add('is-loading');
  lenis?.stop();
  const tl = gsap.timeline({
    onComplete: () => {
      loader.remove();
      root.classList.remove('is-loading');
      lenis?.start();
      try { sessionStorage.setItem('sumi-loaded', '1'); } catch (e) { /* private mode */ }
      ScrollTrigger.refresh();
    },
  });
  tl.to('.loader__ring', { strokeDashoffset: 6, duration: 0.9, ease: 'power2.inOut' }, 0)
    .to('.loader__core', { opacity: 0.95, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.15)
    .fromTo('.loader__core', { scale: 0.3 }, { scale: 1, duration: 0.7, ease: 'back.out(2)' }, 0.15)
    .to('.loader__word', { opacity: 0.9, duration: 0.5 }, 0.35)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.75, ease: 'power4.inOut' }, 1.05)
    .add(() => { if (hasHero) heroIn(); }, 1.3);
}

/* ---------- hero: pointer parallax + scroll depth + embers ---------- */
function hero() {
  const sec = $('[data-hero]');
  if (!sec) return;
  const canvas = $('#embers');
  if (canvas) initEmbers(canvas, { reduce, fine });
  if (reduce) return;
  const bg = $('[data-hero-bg]'), glyph = $('[data-hero-glyph]');
  gsap.to(bg, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to(glyph, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true } });
  if (fine) {
    const bx = gsap.quickTo(bg, 'x', { duration: 1.2, ease: 'power3' }), by = gsap.quickTo(bg, 'y', { duration: 1.2, ease: 'power3' });
    const gx = gsap.quickTo(glyph, 'x', { duration: 1.6, ease: 'power3' }), gy = gsap.quickTo(glyph, 'y', { duration: 1.6, ease: 'power3' });
    sec.addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      bx(nx * -18); by(ny * -12); gx(nx * 40); gy(ny * 26);
    });
  }
}

/* ---------- marquee: speeds up and reverses with scroll ---------- */
function marquee() {
  const el = $('[data-marq]');
  if (!el || reduce) return;
  const track = $('.marq__track', el);
  let x = 0, dir = 1, lastY = scrollY, vis = true;
  new IntersectionObserver(([en]) => { vis = en.isIntersecting; }).observe(el);
  gsap.ticker.add(() => {
    const y = scrollY, v = y - lastY; lastY = y;
    if (!vis) return;
    if (Math.abs(v) > 0.5) dir += ((v > 0 ? 1 : -1) - dir) * 0.08;
    x -= dir * (0.7 + Math.min(Math.abs(v), 40) * 0.22);
    const half = track.scrollWidth / 2;
    if (x <= -half) x += half;
    if (x > 0) x -= half;
    track.style.transform = `translate3d(${x}px,0,0)`;
  });
}

/* ---------- set pieces ---------- */
function setPieces() {
  const mm = gsap.matchMedia();

  // A: pinned fire. A clip-path window opens to full bleed while three lines swap.
  mm.add('(min-width: 700px) and (prefers-reduced-motion: no-preference)', () => {
    const sec = $('[data-fire]');
    if (!sec) return;
    sec.classList.add('is-pinned');
    const img = $('.fire__img', sec), pic = $('.fire__img img', sec), shade = $('.fire__shade', sec), steps = $$('.fire__step', sec);
    const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: '+=260%', pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true } });
    tl.fromTo(img, { clipPath: 'inset(34% 36% 34% 36% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1, ease: 'power2.inOut' }, 0)
      .fromTo(pic, { scale: 1.35 }, { scale: 1, duration: 1.2, ease: 'none' }, 0)
      .to(shade, { opacity: 1, duration: 0.4 }, 0.6);
    steps.forEach((s, i) => {
      const at = 0.8 + i * 0.85;
      tl.fromTo(s, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, at);
      if (i < steps.length - 1) tl.to(s, { opacity: 0, y: -50, duration: 0.3, ease: 'power3.in' }, at + 0.55);
    });
    tl.to({}, { duration: 0.3 });
    return () => sec.classList.remove('is-pinned');
  });

  // B: horizontal dish gallery with per-card image counter-shift.
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const sec = $('[data-gal]');
    if (!sec) return;
    sec.classList.add('is-pinned');
    const track = $('.gal__track', sec), bar = $('.gal__bar i', sec);
    const dist = () => Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle($('.gal__view', sec)).paddingLeft) * 2);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }) },
    });
    $$('.card', sec).forEach((card) => {
      gsap.fromTo($('.card__img img', card), { xPercent: -5 }, { xPercent: 5, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
    return () => sec.classList.remove('is-pinned');
  });

  // C: coal grid. A grid of dark cells burns away to reveal the room.
  const grid = $('[data-grid]');
  if (grid) {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cells = [];
      for (let i = 0; i < 60; i++) { const c = document.createElement('i'); grid.append(c); cells.push(c); }
      gsap.to(cells, { scale: 0, ease: 'none', stagger: { grid: [6, 10], from: 'start', amount: 0.9 },
        scrollTrigger: { trigger: $('[data-visit]'), start: 'top 78%', end: 'top 8%', scrub: 0.5 } });
      return () => { grid.textContent = ''; };
    });
    mm.add('(prefers-reduced-motion: reduce)', () => { grid.style.display = 'none'; });
  }

  // Under 900px the gallery is a native swipe row, under 700px the fire is a static stack: nothing to do.
}

/* ---------- small pieces ---------- */
function counters() {
  if (reduce) return;
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, o = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () =>
      gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = String(Math.round(o.v)); } }) });
  });
}

function reveals() {
  if (reduce) return;
  ScrollTrigger.batch('.reveal', { start: 'top 90%', once: true,
    onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' }) });
}

function banners() {
  if (reduce) return;
  $$('[data-banner]').forEach((b) => gsap.fromTo($('.ph', b), { yPercent: -7 }, { yPercent: 7, ease: 'none',
    scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true } }));
  const route = $('.map__route');
  if (route) {
    gsap.fromTo(route, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none',
      scrollTrigger: { trigger: '.map', start: 'top 85%', end: 'bottom 55%', scrub: true } });
  }
  const glow = $('.cta__glow');
  if (glow) gsap.fromTo(glow, { yPercent: 25, opacity: 0.4 }, { yPercent: -10, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '[data-cta]', start: 'top bottom', end: 'bottom bottom', scrub: true } });
}

function headerHide() {
  const header = $('#site-header');
  if (!header || reduce) return;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => {
    const open = $('.nav-toggle')?.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('is-hidden', s.direction === 1 && s.scroll() > 240 && !open);
  } });
}

/* ---------- pointer details (fine pointers only) ---------- */
function magnetic() {
  if (!fine || reduce) return;
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28); yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

function cursor() {
  const c = $('#cursor');
  if (!c || !fine || reduce) return;
  const xTo = gsap.quickTo(c, 'x', { duration: 0.4, ease: 'power3' }), yTo = gsap.quickTo(c, 'y', { duration: 0.4, ease: 'power3' });
  const label = c.firstElementChild;
  const setLabel = () => { label.textContent = tr('cur.view'); };
  setLabel();
  document.addEventListener('sumi:lang', setLabel);
  addEventListener('pointermove', (e) => {
    c.classList.add('is-on');
    xTo(e.clientX); yTo(e.clientY);
    const t = e.target.closest?.('[data-cursor],a,button,input,select,textarea,summary');
    const view = !!t && t.matches('[data-cursor="view"]');
    c.classList.toggle('is-view', view);
    c.classList.toggle('is-link', !!t && !view);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => c.classList.remove('is-on'));
}

function peek() {
  const rows = $$('.dish[data-peek]');
  if (!rows.length || !fine || reduce) return;
  const p = document.createElement('div');
  p.className = 'peek';
  p.innerHTML = '<img alt="" width="700" height="875">';
  document.body.append(p);
  const im = p.firstChild;
  const xTo = gsap.quickTo(p, 'x', { duration: 0.5, ease: 'power3' }), yTo = gsap.quickTo(p, 'y', { duration: 0.5, ease: 'power3' });
  const move = (e) => { xTo(Math.min(e.clientX + 32, innerWidth - p.offsetWidth - 24)); yTo(Math.min(Math.max(e.clientY - p.offsetHeight / 2, 80), innerHeight - p.offsetHeight - 16)); };
  rows.forEach((r) => {
    r.addEventListener('pointerenter', (e) => {
      im.src = r.dataset.peek;
      gsap.to(p, { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power3.out', overwrite: true });
      move(e);
    });
    r.addEventListener('pointermove', move);
    r.addEventListener('pointerleave', () => gsap.to(p, { opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.35, ease: 'power3.in', overwrite: true }));
  });
}

/* ---------- page transition fallback (Firefox) ---------- */
function transitions() {
  if (reduce || 'onpagereveal' in window) return; // native View Transitions handle the rest
  const c = $('#curtain');
  if (!c) return;
  if (root.classList.contains('nav-in')) {
    gsap.fromTo(c, { y: '0%' }, { y: '-101%', duration: 0.7, ease: 'power4.inOut', onComplete: () => { root.classList.remove('nav-in'); gsap.set(c, { clearProps: 'all' }); } });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || a.target || u.pathname === location.pathname || a.hasAttribute('download')) return;
    e.preventDefault();
    try { sessionStorage.setItem('sumi-nav', '1'); } catch (err) { /* ignore */ }
    gsap.fromTo(c, { y: '101%' }, { y: '0%', duration: 0.55, ease: 'power4.inOut', onComplete: () => { location.href = a.href; } });
  });
}

/* ---------- boot ---------- */
export async function initMotion() {
  initLenis();
  cursor();
  magnetic();
  transitions();
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
  resplit(false);
  animateHeadings(false);
  hero();
  marquee();
  setPieces();
  counters();
  reveals();
  banners();
  headerHide();
  peek();
  intro();

  document.addEventListener('sumi:lang', () => requestAnimationFrame(() => {
    resplit(true);
    animateHeadings(true);
    if (!reduce) { $$('.split.is-split .char').forEach((c) => { c.style.transform = 'none'; }); }
    ScrollTrigger.refresh();
  }));
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 200); });
  addEventListener('load', () => ScrollTrigger.refresh());
}
