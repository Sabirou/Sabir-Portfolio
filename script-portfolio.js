// ===== Helpers =====
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

// ===== Year =====
(() => {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();

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

// ===== Mobile menu =====
(() => {
  const burger = $("#burger");
  const menu = $("#mobileMenu");
  const closeBtn = $("#closeMenu");
  if (!burger || !menu) return;

  const open = () => {
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  menu.addEventListener("click", (e) => {
    if (e.target === menu) close();
  });

  $$(".mobileNav__link", menu).forEach((a) => {
    a.addEventListener("click", () => close());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

// ===== Active nav by section =====
(() => {
  const links = $$(".nav__link");
  const ids = links.map(a => a.getAttribute("href")).filter(Boolean);
  const sections = ids.map(id => $(id)).filter(Boolean);
  if (!sections.length) return;

  const setActive = (hash) => {
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === hash));
  };

  const obs = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(`#${visible.target.id}`);
  }, { rootMargin: "-40% 0px -55% 0px", threshold: [0.12, 0.2, 0.35] });

  sections.forEach(s => obs.observe(s));
})();

// ===== Theme toggle (simple) =====
(() => {
  const btn = $("#themeToggle");
  if (!btn) return;

  const root = document.body;
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);

  const apply = () => {
    const t = root.getAttribute("data-theme") || "dark";
    btn.textContent = t === "dark" ? "☾" : "☀";
    document.querySelector("meta[name='theme-color']")?.setAttribute("content", t === "dark" ? "#070812" : "#f6f0df");
  };

  btn.addEventListener("click", () => {
    const t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    apply();
  });

  apply();
})();

// ===== Fake send: open mail =====
(() => {
  const btn = $("#fakeSend");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const mail = "amiamisabir@gmail.com";
    const subject = encodeURIComponent("Contact — Portfolio Sabir");
    const body = encodeURIComponent("Salut Sabir,\n\n");
    window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
  });
})();

// ===== Custom cursor (PC only) =====
(() => {
  const fine = matchMedia("(pointer: fine)").matches;
  if (!fine) return;

  const c = $(".cursor");
  const d = $(".cursorDot");
  if (!c || !d) return;

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  const loop = () => {
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    c.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    d.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };

  addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
  }, { passive: true });

  loop();
})();

// ===== Particles canvas (léger) =====
(() => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w = 0, h = 0, p = [];

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(a,b){ return a + Math.random()*(b-a); }

  function init() {
    const count = reduced ? 0 : Math.round((w*h)/42000);
    p = Array.from({ length: count }, () => ({
      x: rand(0,w), y: rand(0,h),
      r: rand(1.2,2.5),
      vx: rand(-0.20,0.20),
      vy: rand(-0.12,0.12),
      a: rand(0.08,0.28),
      c: Math.random() > 0.6 ? "rgba(96,165,250," : "rgba(167,139,250,"
    }));
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    if (!p.length) return;

    for (const o of p){
      o.x += o.vx; o.y += o.vy;
      if (o.x < -20) o.x = w+20;
      if (o.x > w+20) o.x = -20;
      if (o.y < -20) o.y = h+20;
      if (o.y > h+20) o.y = -20;

      ctx.beginPath();
      ctx.arc(o.x,o.y,o.r,0,Math.PI*2);
      ctx.fillStyle = `${o.c}${o.a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize(); init(); draw();
  addEventListener("resize", ()=>{ resize(); init(); });
})();
