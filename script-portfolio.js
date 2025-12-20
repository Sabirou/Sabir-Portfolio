(() => {
  "use strict";
  if (!window?.document) return;

  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const random = (min, max) => min + Math.random() * (max - min);

  // Year
  const y = qs("#pYear");
  if (y) y.textContent = String(new Date().getFullYear());

  // Orb button -> accueil
  const orbBtn = qs("#orbBtn");
  if (orbBtn) {
    orbBtn.addEventListener("click", () => {
      document.body.style.transition = "opacity 0.35s ease";
      document.body.style.opacity = "0";
      setTimeout(() => (window.location.href = "index.html"), 350);
    });
  }

  // Burger menu
  const burger = qs("#burger");
  const mMenu = qs("#mMenu");
  const closeMenu = qs("#closeMenu");

  const openMenu = () => {
    if (!mMenu) return;
    mMenu.classList.add("is-open");
    mMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const hideMenu = () => {
    if (!mMenu) return;
    mMenu.classList.remove("is-open");
    mMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  if (burger) burger.addEventListener("click", openMenu);
  if (closeMenu) closeMenu.addEventListener("click", hideMenu);
  if (mMenu) {
    mMenu.addEventListener("click", (e) => {
      if (e.target === mMenu) hideMenu();
    });
    qsa(".mNav__link", mMenu).forEach((a) => a.addEventListener("click", hideMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mMenu.classList.contains("is-open")) hideMenu();
    });
  }

  // Header scroll effect
  const header = qs("#header");
  const updateHeader = () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // Scroll progress
  const progressBar = qs("#progressBar");
  const updateProgress = () => {
    if (!progressBar) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollH = doc.scrollHeight - doc.clientHeight;
    const pct = scrollH > 0 ? (scrollTop / scrollH) * 100 : 0;
    progressBar.style.width = `${pct.toFixed(2)}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal animations
  const reveals = qsa(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Skill bars
  const bars = qsa(".bar");
  const animateBars = () => {
    bars.forEach((bar) => {
      const val = parseInt(bar.getAttribute("data-val") || "60", 10);
      const fill = qs(".bar__fill", bar);
      if (fill) fill.style.width = `${Math.max(0, Math.min(100, val))}%`;
    });
  };
  if (bars.length) {
    if ("IntersectionObserver" in window) {
      const ioBars = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            animateBars();
            ioBars.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      bars.forEach((b) => ioBars.observe(b));
    } else {
      setTimeout(animateBars, 500);
    }
  }

  // Scrollspy nav active
  const navLinks = qsa(".nav__link");
  const sections = navLinks
    .map((a) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return null;
      const el = qs(href);
      if (!el) return null;
      return { href, el, a };
    })
    .filter(Boolean);

  const updateActiveNav = () => {
    if (!sections.length) return;
    const scrollY = window.scrollY;
    let current = null;
    for (const s of sections) {
      const top = s.el.getBoundingClientRect().top + scrollY;
      if (scrollY + 160 >= top) current = s;
    }
    sections.forEach((s) => s.a.classList.remove("is-active"));
    if (current) current.a.classList.add("is-active");
  };
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // Smooth scroll anchors
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Canvas particles (clean)
  const canvas = qs("#pCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let particles = [];
  let raf = 0;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const count = Math.min(65, Math.max(32, Math.floor((w * h) / 37000)));
    particles = Array.from({ length: count }, () => ({
      x: random(0, w),
      y: random(0, h),
      r: random(1.6, 4.0),
      vx: random(-0.22, 0.22),
      vy: random(-0.16, 0.16),
      a: random(0.10, 0.32),
      phase: random(0, Math.PI * 2),
      freq: random(0.008, 0.022),
      pulse: random(0, Math.PI * 2),
      pulseSpeed: random(0.015, 0.035),
    }));
  }

  let mouseX = 0, mouseY = 0, mouseMoving = false;
  let mouseTimer = 0;
  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseMoving = true;
      clearTimeout(mouseTimer);
      mouseTimer = window.setTimeout(() => (mouseMoving = false), 100);
    },
    { passive: true }
  );

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    // particles
    for (const p of particles) {
      p.phase += p.freq;
      p.pulse += p.pulseSpeed;

      // mouse repulse
      if (mouseMoving) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const max = 160;
        if (dist < max) {
          const force = (max - dist) / max;
          p.x -= (dx / dist) * force * 2.2;
          p.y -= (dy / dist) * force * 2.2;
        }
      }

      p.x += p.vx + Math.sin(p.phase) * 0.10;
      p.y += p.vy + Math.cos(p.phase) * 0.10;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const pulseScale = 1 + Math.sin(p.pulse) * 0.25;
      const rr = p.r * pulseScale;
      const aa = p.a * (0.85 + Math.sin(p.pulse) * 0.15);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr * 3.5);
      g.addColorStop(0, `rgba(242,231,216,${aa})`);
      g.addColorStop(0.4, `rgba(242,231,216,${aa * 0.5})`);
      g.addColorStop(0.7, `rgba(180,92,255,${aa * 0.25})`);
      g.addColorStop(1, "rgba(180,92,255,0)");

      ctx.beginPath();
      ctx.arc(p.x, p.y, rr * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.restore();
    }

    // connections
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const maxD = 135;
        if (d < maxD) {
          const alpha = ((maxD - d) / maxD) * 0.14;
          const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          g.addColorStop(0, `rgba(180,92,255,${alpha})`);
          g.addColorStop(0.35, `rgba(47,231,255,${alpha * 1.25})`);
          g.addColorStop(0.65, `rgba(255,107,157,${alpha * 1.1})`);
          g.addColorStop(1, `rgba(180,92,255,${alpha * 0.85})`);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    raf = requestAnimationFrame(draw);
  }

  // SabirGPT mini chat (local)
  const chatForm = qs("#chatForm");
  const chatInput = qs("#chatInput");
  const chatLog = qs("#chatLog");

  function addMessage(text, who) {
    if (!chatLog) return;
    const div = document.createElement("div");
    div.className = `msg msg--${who}`;
    div.textContent = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function botReply(q) {
    const s = (q || "").toLowerCase().trim();
    if (s.includes("projet") && (s.includes("réseau") || s.includes("reseau")))
      return "💡 3 idées :\n1) Dashboard monitoring (ping/latence)\n2) Lab VLAN + routage + firewall\n3) Scan réseau + rapport HTML";
    if (s.includes("cv"))
      return "📄 CV : intro 2 lignes, projets concrets, certifs, compétences en haut, 1 page.";
    if (s.includes("alternance") || s.includes("stage"))
      return "🎯 Alternance : cible 10 entreprises, email perso + CV + portfolio, relance J+7, prépare 3 questions techniques.";
    if (s.includes("hello") || s.includes("bonjour") || s.includes("salut"))
      return "👋 Salut ! Pose-moi une question sur réseau, cyber, web, CV ou alternance.";
    return "👌 Dis-moi : tu veux du réseau, du cyber, du web, ou du CV ? Je te réponds avec un plan clair.";
  }

  if (chatLog) addMessage("👋 Salut ! Je suis SabirGPT. Demande-moi des idées de projets, CV ou alternance.", "bot");

  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = chatInput.value.trim();
      if (!q) return;
      addMessage(q, "me");
      chatInput.value = "";
      setTimeout(() => addMessage(botReply(q), "bot"), 250);
    });

    chatInput.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 120) + "px";
    });
  }

  // Init canvas
  resizeCanvas();
  createParticles();
  draw();

  // Resize debounce
  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        cancelAnimationFrame(raf);
        resizeCanvas();
        createParticles();
        draw();
      }, 200);
    },
    { passive: true }
  );

  console.log("🚀 Sabir IAZZA — Portfolio OK");
})();
