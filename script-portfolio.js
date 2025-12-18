(function () {
  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Progress bar
  const progress = document.getElementById("progress");
  function updateProgress() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const p = height > 0 ? (scrollTop / height) * 100 : 0;
    if (progress) progress.style.width = `${p}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Mobile menu
  const burger = document.getElementById("burger");
  const mobile = document.getElementById("mobile");
  const closeMobile = document.getElementById("closeMobile");

  function openMenu() {
    mobile.classList.add("show");
    mobile.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobile.classList.remove("show");
    mobile.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (burger) burger.addEventListener("click", openMenu);
  if (closeMobile) closeMobile.addEventListener("click", closeMenu);
  if (mobile) {
    mobile.addEventListener("click", (e) => {
      if (e.target === mobile) closeMenu();
    });
    mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  // Active nav links
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("section[id]"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0.02 }
  );

  sections.forEach((s) => io.observe(s));

  // Reveal on scroll
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const rio = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("on");
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => rio.observe(el));

  // Particles background (light + stable, no “bg stuck” bug)
  const canvas = document.getElementById("particles");
  const ctx = canvas ? canvas.getContext("2d") : null;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia && window.matchMedia("(max-width: 980px)").matches;

  let w = 0, h = 0, dpr = 1;
  const particles = [];

  function resize() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function initParticles() {
    if (!canvas || !ctx) return;
    particles.length = 0;

    const base = isMobile ? 34 : 52;
    const count = reduceMotion ? 0 : base;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(1.0, 2.4),
        vx: rand(-0.18, 0.18),
        vy: rand(-0.14, 0.14),
        a: rand(0.15, 0.55),
        hue: Math.random() < 0.55 ? "violet" : "cyan",
      });
    }
  }

  function draw() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, w, h);

    // subtle vignette
    const g = ctx.createRadialGradient(w * 0.5, h * 0.25, 80, w * 0.5, h * 0.35, Math.max(w, h));
    g.addColorStop(0, "rgba(180,92,255,0.05)");
    g.addColorStop(0.45, "rgba(47,231,255,0.03)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      const color =
        p.hue === "violet"
          ? `rgba(180,92,255,${p.a})`
          : `rgba(47,231,255,${p.a})`;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  if (canvas && ctx && !reduceMotion) {
    resize();
    initParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });
  } else if (canvas && ctx) {
    resize();
  }

  // SabirGPT (smart local bot)
  const chatBody = document.getElementById("chatBody");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");

  function addMsg(text, who = "bot") {
    if (!chatBody) return;
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.innerHTML = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function answer(qRaw) {
    const q = normalize(qRaw);

    const greet = /(salut|yo|bonjour|coucou|hey|wesh)/;
    const how = /(ca va|cv|comment tu vas|tu vas bien)/;
    const alt = /(alternance|apprentissage|entreprise|recrute)/;
    const stage = /(stage|stages|experience|experiences)/;
    const skills = /(competence|competences|skills|reseau|cyber|web|html|css|javascript)/;
    const bts = /(bts|sio|slam|sisr)/;
    const contact = /(contact|mail|email|telephone|tel|appeler|numero)/;
    const where = /(ou tu habites|localisation|ville|saint|maximin)/;
    const projects = /(projet|projets|portfolio|site)/;

    if (greet.test(q)) {
      return "Salut 👋 Tu veux parler de mes <strong>compétences</strong>, de mes <strong>stages</strong>, de mon <strong>objectif BTS SIO</strong> ou du <strong>contact</strong> ?";
    }
    if (how.test(q)) {
      return "Ça va nickel 😄 Merci ! Dis-moi ce que tu veux savoir sur mon profil (stages, compétences, projets, alternance…).";
    }
    if (alt.test(q)) {
      return "Oui, je suis <strong>ouvert aux opportunités</strong> (projets / alternance selon période). Tu peux me contacter via <a href='mailto:amiamisabir@gmail.com'>amiamisabir@gmail.com</a> ou <a href='tel:+33762972626'>07 62 97 26 26</a>.";
    }
    if (stage.test(q)) {
      return "J’ai fait des expériences en <strong>fibre optique</strong>, <strong>réparation smartphone</strong> et <strong>support/diagnostic</strong>. Je peux te détailler ce que j’ai fait sur chaque stage si tu veux.";
    }
    if (skills.test(q)) {
      return "Mes bases fortes : <strong>réseaux (IP/VLAN)</strong>, <strong>cybersécurité (bonnes pratiques)</strong> et <strong>web (HTML/CSS/JS)</strong>. Tu veux plutôt côté réseau ou côté web ?";
    }
    if (bts.test(q)) {
      return "Mon objectif est de continuer en <strong>BTS SIO</strong> pour monter en niveau sur dev + systèmes/réseaux, avec une progression solide et des projets concrets.";
    }
    if (projects.test(q)) {
      return "Projet principal : ce <strong>portfolio premium</strong> (UI/UX + animations). Je peux aussi ajouter une section “projets techniques” si tu veux (réseau, scripts, mini-apps…).";
    }
    if (contact.test(q)) {
      return "Contact : <a href='mailto:amiamisabir@gmail.com'>amiamisabir@gmail.com</a> • <a href='tel:+33762972626'>07 62 97 26 26</a> • <a target='_blank' rel='noreferrer' href='https://www.google.com/maps?q=Saint-Maximin-la-Sainte-Baume'>Saint-Maximin (83)</a>.";
    }
    if (where.test(q)) {
      return "Je suis basé vers <strong>Saint-Maximin (83)</strong>. Voici le lien Maps : <a target='_blank' rel='noreferrer' href='https://www.google.com/maps?q=Saint-Maximin-la-Sainte-Baume'>ouvrir Google Maps ↗</a>";
    }

    // fallback smart
    return "Je vois 👍 Dis-moi juste si tu veux une info sur : <strong>stages</strong>, <strong>compétences</strong>, <strong>BTS SIO</strong>, <strong>projets</strong> ou <strong>contact</strong>.";
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = chatInput.value.trim();
      if (!v) return;

      addMsg(v, "user");
      chatInput.value = "";

      setTimeout(() => {
        addMsg(answer(v), "bot");
      }, 280);
    });
  }

  // Quick buttons
  document.querySelectorAll(".q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-q") || "";
      if (!q) return;
      addMsg(q, "user");
      setTimeout(() => addMsg(answer(q), "bot"), 220);
    });
  });
})();
