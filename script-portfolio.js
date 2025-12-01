// --------- Helpers ----------
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

// --------- Année footer ----------
const yearSpan = $("#year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// --------- Thème clair / sombre ----------
const body = document.body;
const themeToggle = $("#theme-toggle");

function applyTheme(theme) {
  body.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "🌙 Sombre" : "☀️ Clair";
  }
}

const savedTheme = localStorage.getItem("sabir-theme") || "dark";
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = body.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("sabir-theme", next);
  });
}

// --------- Canvas background (petites orbes douces) ----------
const canvas = $("#bg-orbit");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  const bubbles = [];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeBubble() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 40 + Math.random() * 120,
      alpha: 0.18 + Math.random() * 0.2,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
    };
  }

  function init() {
    bubbles.length = 0;
    for (let i = 0; i < 16; i++) {
      bubbles.push(makeBubble());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    bubbles.forEach((b) => {
      b.x += b.dx;
      b.y += b.dy;
      if (b.x < -b.r) b.x = w + b.r;
      if (b.x > w + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = h + b.r;
      if (b.y > h + b.r) b.y = -b.r;

      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, `rgba(59,130,246,${b.alpha})`);
      g.addColorStop(1, "rgba(15,23,42,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resize();
    init();
  });

  resize();
  init();
  draw();
}

// --------- Sections reveal + nav active ----------
const sections = $$(".section");
const navLinks = $$(".nav-link");

function setActiveNav(id) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === `#${id}`) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          const id = entry.target.id;
          if (id) setActiveNav(id);
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((s) => observer.observe(s));
} else {
  sections.forEach((s) => s.classList.add("section-visible"));
}

// --------- Hero card 3D tilt ----------
const heroCardWrapper = $(".hero-card-3d");
const heroCard = $(".hero-card");

if (heroCardWrapper && heroCard) {
  heroCardWrapper.addEventListener("mousemove", (e) => {
    const rect = heroCardWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = ((x - midX) / midX) * 10;
    const rotateX = ((midY - y) / midY) * 10;

    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(16px)`;
    heroCard.style.boxShadow =
      "0 30px 90px rgba(0,0,0,0.9), 0 0 40px rgba(59,130,246,0.4)";
  });

  heroCardWrapper.addEventListener("mouseleave", () => {
    heroCard.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    heroCard.style.boxShadow = "";
  });
}

// --------- Smooth scroll on nav click ----------
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// --------- SabirGPT – base de connaissance ----------
const chatMessagesEl = $("#chat-messages");
const chatForm = $("#chat-form");
const chatInput = $("#chat-input");
const modeSelect = $("#ai-mode-select");

const facts = {
  age: "Sabir est né le 19 janvier 2008. En 2025, il a 17 ans.",
  studies:
    "Sabir est en Terminale Bac Pro CIEL à Toulon. CIEL = Cybersécurité, Informatique, Réseaux et Électronique.",
  goal:
    "Après le Bac Pro CIEL, son objectif est d’intégrer un BTS SIO pour aller plus loin en informatique (développement, systèmes et réseaux).",
  stagesShort:
    "Sabir a déjà réalisé plusieurs stages : développement web, réparation de téléphones, technicien fibre optique, électricité bâtiment et support informatique.",
  stagesDetail:
    "En résumé : \n- Stage en développement web (workflow, intégration, découverte des clients).\n- Stage en réparation de téléphones (diagnostic, écrans, batteries, tests, relation client).\n- Stage en fibre optique (raccordements, tests de connexion, sécurité sur le terrain).\n- Expériences en électricité bâtiment et support informatique.",
  bacPro:
    "Le Bac Pro CIEL de Sabir couvre la cybersécurité, les réseaux, l’informatique et l’électronique, avec beaucoup de travaux pratiques.",
  hobbies:
    "Sabir aime l’informatique, la cybersécurité, les projets web, mais aussi le foot et les projets personnels autour du digital.",
  portfolio:
    "Ce portfolio présente le parcours de Sabir, ses compétences, ses stages et ses objectifs (Bac Pro CIEL aujourd’hui, BTS SIO ensuite).",
};

let lastTopic = null;

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectTopic(text) {
  const msg = text.toLowerCase();

  if (/(quel age|quel âge|a quel age|âge|ans)/.test(msg)) return "age";
  if (/(bac pro|ciel|lycee|lycée|formation)/.test(msg)) return "studies";
  if (/(bts sio|apres le bac|après le bac|objectif|futur|plus tard)/.test(msg))
    return "goal";
  if (
    /(stage|stages|experience|expérience|fibre|réparation|telephone|téléphone|web)/.test(
      msg
    )
  )
    return "stages";
  if (/(parcours|profil|qui est sabir|présente sabir)/.test(msg)) return "profil";
  if (/(hobby|passion|foot|football|loisir|loisirs)/.test(msg)) return "hobbies";
  if (/(portfolio|site|github)/.test(msg)) return "portfolio";

  return "generic";
}

function baseAnswer(topic) {
  switch (topic) {
    case "age":
      return randomChoice([
        facts.age,
        `${facts.age} Il est encore jeune mais déjà bien lancé dans l’IT.`,
      ]);
    case "studies":
      return randomChoice([
        facts.studies,
        `${facts.studies} Il travaille surtout la cybersécurité, les réseaux et les TP concrets.`,
      ]);
    case "goal":
      return randomChoice([
        facts.goal,
        `${facts.goal} L’idée est de construire une base solide pour la suite dans l’IT.`,
      ]);
    case "stages":
      return randomChoice([facts.stagesShort, facts.stagesDetail]);
    case "profil":
      return (
        facts.studies +
        " " +
        facts.stagesShort +
        " " +
        facts.goal
      );
    case "hobbies":
      return randomChoice([
        facts.hobbies,
        `Niveau loisirs, ${facts.hobbies}`,
      ]);
    case "portfolio":
      return facts.portfolio;
    default:
      return randomChoice([
        "Je suis SabirGPT. Pose-moi des questions sur le parcours de Sabir, ses stages, son Bac Pro CIEL ou ses objectifs, et je répondrai avec ce que je sais sur lui.",
        "Je peux parler de son âge, de ses études, de ses stages (fibre, web, téléphones, etc.) et de ce qu’il veut faire après le Bac.",
      ]);
  }
}

function wrapByMode(text, mode, topic) {
  if (mode === "chill") {
    return randomChoice([
      text + " 😄",
      "Version chill : " + text,
      text + " N’hésite pas à demander plus de détails.",
    ]);
  }
  if (mode === "pro") {
    return "En mode plus professionnel : " + text;
  }
  if (mode === "cyber") {
    let extra = "";
    if (topic === "studies" || topic === "bacPro") {
      extra =
        " Côté cybersécurité, l’objectif est d’apprendre les bons réflexes de protection dès maintenant.";
    } else if (topic === "goal") {
      extra =
        " Le BTS SIO permettra aussi de renforcer la partie systèmes, réseaux et sécurité.";
    }
    return text + extra;
  }
  if (mode === "orientation") {
    let extra = "";
    if (topic === "goal" || topic === "studies") {
      extra =
        " Globalement, son parcours est cohérent pour quelqu’un qui veut travailler dans l’informatique : Bac Pro CIEL → BTS SIO → possible spécialisation ensuite.";
    }
    return text + extra;
  }
  return text;
}

function addMessage(role, text) {
  if (!chatMessagesEl) return;
  const row = document.createElement("div");
  row.className = `chat-row ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = text;
  row.appendChild(bubble);
  chatMessagesEl.appendChild(row);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Message d’accueil
if (chatMessagesEl) {
  addMessage(
    "bot",
    "Salut, je suis SabirGPT 🤝 Pose-moi des questions sur Sabir, son Bac Pro CIEL, ses stages, son âge ou ses objectifs."
  );
}

if (chatForm && chatInput) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = chatInput.value.trim();
    if (!value) return;
    const mode = modeSelect ? modeSelect.value : "chill";

    addMessage("user", value);
    chatInput.value = "";

    const topic = detectTopic(value);
    let answer = baseAnswer(topic);

    if (lastTopic && lastTopic === topic && topic !== "generic") {
      answer += " On reste sur le même sujet, je peux détailler davantage si tu veux.";
    }

    lastTopic = topic;
    const wrapped = wrapByMode(answer, mode, topic);

    setTimeout(() => addMessage("bot", wrapped), 220);
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });
}
