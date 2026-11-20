/* Hero ember field. Original code.
   One pre-rendered glow sprite, additive blending, no per-particle shadowBlur.
   Pointer attracts and brightens nearby embers on fine pointers.
   Pauses when off screen or when the tab is hidden. Reduced motion: one still frame. */
export function initEmbers(canvas, { reduce, fine }) {
  const host = canvas.parentElement;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const sprite = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,236,190,1)');
    r.addColorStop(0.18, 'rgba(255,170,70,.9)');
    r.addColorStop(0.5, 'rgba(255,90,31,.32)');
    r.addColorStop(1, 'rgba(255,90,31,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
    return c;
  })();

  let w = 0, h = 0, dpr = 1, raf = 0, running = false, last = 0;
  const ps = [];
  const mouse = { x: -9999, y: -9999 };
  const rnd = (a, b) => a + Math.random() * (b - a);

  const spawn = (anywhere) => ({
    x: rnd(0, w), y: anywhere ? rnd(0, h) : h + rnd(8, 60),
    vx: rnd(-0.12, 0.12), vy: -rnd(0.18, 0.7), s: rnd(8, 34),
    a: rnd(0.35, 1), ph: rnd(0, 6.28), sp: rnd(0.6, 1.8),
  });

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = w < 700 ? 34 : 90;
    while (ps.length < n) ps.push(spawn(true));
    ps.length = n;
  }

  function draw(t, dt) {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of ps) {
      p.y += p.vy * dt * 60;
      p.x += p.vx * dt * 60 + Math.sin(t * 0.001 * p.sp + p.ph) * 0.22;
      let boost = 0;
      if (fine) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          const f = 1 - Math.sqrt(d2) / 150;
          p.x += dx * 0.02 * f; p.y += dy * 0.02 * f;
          boost = f;
        }
      }
      if (p.y < -40 || p.x < -40 || p.x > w + 40) Object.assign(p, spawn(false));
      const flick = 0.75 + 0.25 * Math.sin(t * 0.004 * p.sp + p.ph);
      ctx.globalAlpha = Math.min(1, p.a * flick * (1 + boost * 1.6) * Math.min(1, p.y / (h * 0.3) + 0.2));
      const s = p.s * (1 + boost * 0.8);
      ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    if (!running) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;
    draw(t, dt);
    raf = requestAnimationFrame(loop);
  }
  const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  size();
  if (reduce) { draw(0, 0); return; }
  if (fine) {
    host.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    host.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  }
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible && !document.hidden ? start() : stop(); }).observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden || !visible ? stop() : start()));
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 150); });
  start();
}
