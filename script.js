// ===== Scroll progress =====
(() => {
  const bar = document.querySelector(".scroll-progress");
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = `${p}%`;
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
})();

// ===== Particles canvas (léger) =====
(() => {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  let w = 0, h = 0, particles = [];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function init() {
    const count = reduced ? 0 : Math.round((w * h) / 38000); // léger
    particles = Array.from({ length: count }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(1.2, 2.6),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.12, 0.12),
      a: rand(0.10, 0.35)
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    if (particles.length === 0) return;

    // dots
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${p.a})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();

  addEventListener("resize", () => {
    resize();
    init();
  });
})();
