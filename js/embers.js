/* Ember field: warm sparks drift upward and flare near the pointer.
   Paused when the tab is hidden; one static frame under prefers-reduced-motion. */
(function () {
  'use strict';
  var c = document.getElementById('embers');
  if (!c || !c.getContext) return;
  var ctx = c.getContext('2d');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0, h = 0, parts = [], raf = 0, last = 0;
  var ptr = { x: -999, y: -999 };

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function make(initial) {
    return {
      x: rnd(0, w),
      y: initial ? rnd(0, h) : h + rnd(0, 40),
      r: rnd(0.6, 2.2),
      vy: rnd(14, 42),
      sw: rnd(0.4, 1.6),
      ph: rnd(0, 6.28),
      life: initial ? rnd(0, 1) : 0,
      hue: rnd(8, 42)
    };
  }

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    c.width = Math.floor(w * dpr); c.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(26, Math.min(110, Math.round((w * h) / 15000)));
    parts = [];
    for (var i = 0; i < n; i++) parts.push(make(true));
    if (reduce) draw(0, true);
  }

  function draw(dt, still) {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!still) {
        var dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy;
        var heat = d2 < 22500 ? 1 - Math.sqrt(d2) / 150 : 0;
        p.y -= (p.vy + heat * 90) * dt;
        p.x += Math.sin(p.ph + p.y * 0.012) * p.sw * 20 * dt + (heat ? dx / 150 * 30 * dt : 0);
        p.life += dt * 0.14;
        p.heat = heat;
        if (p.y < -10 || p.life > 1) parts[i] = make(false);
      }
      var a = Math.sin(Math.min(1, p.life) * Math.PI) * 0.75 + (p.heat || 0) * 0.35;
      if (a <= 0.01) continue;
      var rad = p.r * (1 + (p.heat || 0) * 0.8);
      ctx.beginPath();
      ctx.fillStyle = 'hsla(' + p.hue + ',92%,' + (52 + (p.heat || 0) * 14) + '%,' + a.toFixed(3) + ')';
      ctx.shadowColor = 'hsla(' + p.hue + ',95%,55%,.8)';
      ctx.shadowBlur = 8 + rad * 3;
      ctx.arc(p.x, p.y, rad, 0, 6.2832);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function loop(t) {
    var dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;
    draw(dt, false);
    raf = requestAnimationFrame(loop);
  }

  function start() { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  resize();
  window.addEventListener('resize', function () { resize(); });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  window.addEventListener('pointermove', function (e) { ptr.x = e.clientX; ptr.y = e.clientY; }, { passive: true });
  window.addEventListener('pointerleave', function () { ptr.x = ptr.y = -999; });
  start();
})();
