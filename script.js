(() => {
  "use strict";
  if (!window?.document) return;

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Topbar scroll effect
  const topbar = document.getElementById("topbar");
  const onScroll = () => {
    if (!topbar) return;
    if (window.scrollY > 50) topbar.classList.add("scrolled");
    else topbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mascot click -> portfolio
  const mascotBtn = document.getElementById("mascotBtn");
  if (mascotBtn) {
    mascotBtn.addEventListener("click", () => {
      document.body.style.transition = "opacity 0.35s ease";
      document.body.style.opacity = "0";
      setTimeout(() => (window.location.href = "portfolio.html"), 350);
    });
  }

  // Ripple animation css (once)
  if (!document.getElementById("ripple-style")) {
    const style = document.createElement("style");
    style.id = "ripple-style";
    style.textContent = `
      @keyframes ripple { to { transform: scale(4); opacity: 0; } }
    `;
    document.head.appendChild(style);
  }

  // Ripple on buttons
  document.querySelectorAll(".btn, #mascotBtn").forEach((el) => {
    el.addEventListener("pointerdown", (e) => {
      const target = e.currentTarget;
      if (!(target instanceof HTMLElement)) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:rgba(255,255,255,0.35);
        left:${x}px;
        top:${y}px;
        pointer-events:none;
        transform:scale(0);
        animation:ripple 0.6s ease-out;
        z-index:5;
      `;
      target.style.position = target.style.position || "relative";
      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Canvas particles (clean, no template bugs)
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const random = (min, max) => min + Math.random() * (max - min);
  let particles = [];
  let raf = 0;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // IMPORTANT: reset+scale
  }

  function createParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const count = Math.min(70, Math.max(30, Math.floor((w * h) / 38000)));
    particles = Array.from({ length: count }, () => ({
      x: random(0, w),
      y: random(0, h),
      r: random(1.5, 3.8),
      vx: random(-0.22, 0.22),
      vy: random(-0.16, 0.16),
      a: random(0.10, 0.30),
      phase: random(0, Math.PI * 2),
      freq: random(0.01, 0.03),
    }));
  }

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    // particles
    for (const p of particles) {
      p.phase += p.freq;
      p.x += p.vx + Math.sin(p.phase) * 0.10;
      p.y += p.vy + Math.cos(p.phase) * 0.10;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.4);
      grad.addColorStop(0, `rgba(242,231,216,${p.a})`);
      grad.addColorStop(0.5, `rgba(242,231,216,${p.a * 0.45})`);
      grad.addColorStop(1, "rgba(242,231,216,0)");

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const maxD = 130;
        if (d < maxD) {
          const alpha = ((maxD - d) / maxD) * 0.12;
          const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          g.addColorStop(0, `rgba(180,92,255,${alpha})`);
          g.addColorStop(0.5, `rgba(47,231,255,${alpha * 1.2})`);
          g.addColorStop(1, `rgba(255,107,157,${alpha * 0.8})`);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(draw);
  }

  // init
  resizeCanvas();
  createParticles();
  draw();

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      cancelAnimationFrame(raf);
      resizeCanvas();
      createParticles();
      draw();
    }, 200);
  }, { passive: true });
})();
