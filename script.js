(() => {
  const REPO = "/Sabir-Portfolio";

  const $ = (q, root = document) => root.querySelector(q);

  // YEAR
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // MOBILE MENU
  const burger = $("#burger");
  const mobile = $("#mobileMenu");
  const closeBtn = $("#mobileClose");

  function openMenu() {
    if (!mobile || !burger) return;
    mobile.classList.add("show");
    mobile.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!mobile || !burger) return;
    mobile.classList.remove("show");
    mobile.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger) burger.addEventListener("click", () => {
    const isOpen = mobile && mobile.classList.contains("show");
    isOpen ? closeMenu() : openMenu();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  if (mobile) mobile.addEventListener("click", (e) => {
    if (e.target === mobile) closeMenu();
  });

  // Close menu after click a link
  document.querySelectorAll(".mobile-link").forEach(a => {
    a.addEventListener("click", closeMenu);
  });

  // CONTACT FORM (visual)
  const form = $("#contactForm");
  const note = $("#formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (note) note.textContent = "✅ Message prêt — copie/colle et envoie-moi par mail si besoin.";
    });
  }

  // CANVAS BG (orbs)
  const canvas = $("#bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize() {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  }
  resize();
  window.addEventListener("resize", resize);

  const W = () => canvas.width;
  const H = () => canvas.height;

  const orbs = Array.from({ length: 22 }, () => ({
    r: 60 + Math.random() * 220,
    a: Math.random() * Math.PI * 2,
    s: 0.0007 + Math.random() * 0.0018,
    size: 5 + Math.random() * 16,
    hue: 260 + Math.random() * 70, // violet -> cyan
    ox: 0,
    oy: 0
  }));

  function render() {
    ctx.clearRect(0, 0, W(), H());

    const ox = W() / 2;
    const oy = H() / 2;
    orbs.forEach(o => { o.ox = ox; o.oy = oy; });

    for (const o of orbs) {
      o.a += o.s;

      const x = o.ox + Math.cos(o.a) * o.r;
      const y = o.oy + Math.sin(o.a) * o.r;

      const g = ctx.createRadialGradient(x, y, 0, x, y, o.size * 8);
      g.addColorStop(0, `hsla(${o.hue}, 90%, 65%, 0.22)`);
      g.addColorStop(1, `hsla(${o.hue}, 90%, 65%, 0)`);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, o.size * 8, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  render();
})();
