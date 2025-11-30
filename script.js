// script.js

// ---------- UTIL ----------
function $(selector, scope = document) {
  return scope.querySelector(selector);
}
function $all(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

// ---------- ANNÉE DANS LE FOOTER ----------
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = $("#year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// ---------- THÈME ----------
const body = document.body;
const themeToggle = $("#theme-toggle");

function applyTheme(theme) {
  body.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent =
      theme === "dark" ? "🌙 Mode sombre" : "☀️ Mode clair";
  }
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

// ---------- RÉVÉLATION SECTIONS + NAV ----------
const sections = $all(".section");
const navLinks = $all(".nav-link");
const mainShell = $("#main-shell");

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
          const id = entry.target.getAttribute("id");
          if (id) setActiveNav(id);
        }
      });
    },
    { threshold: 0.2 }
  );
  sections.forEach((section) => observer.observe(section));
} else {
  sections.forEach((s) => s.classList.add("section-visible"));
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    if (mainShell) {
      mainShell.classList.add("nav-anim");
      setTimeout(() => mainShell.classList.remove("nav-anim"), 350);
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---------- HERO CARD 3D ----------
const heroTiltContainer = $(".hero-tilt");
const heroCard = $(".hero-card");

if (heroTiltContainer && heroCard) {
  heroTiltContainer.addEventListener("mousemove", (e) => {
    const rect = heroTiltContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = ((x - midX) / midX) * 10;
    const rotateX = ((midY - y) / midY) * 10;

    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
    heroCard.style.boxShadow =
      "0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(59,130,246,0.35)";
  });

  heroTiltContainer.addEventListener("mouseleave", () => {
    heroCard.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    heroCard.style.boxShadow = "";
  });
}

// ---------- CANVAS NUAGES ----------
const canvas = $("#sky");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const clouds = [];
  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createCloud(x, y, radius) {
    return {
      x,
      y,
      r: radius,
      alpha: 0.18 + Math.random() * 0.32,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
    };
  }

  function initClouds() {
    clouds.length = 0;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 18; i++) {
      clouds.push(
        createCloud(
          Math.random() * w,
          Math.random() * h,
          60 + Math.random() * 120
        )
      );
    }
  }

  function drawCloud(c) {
    const gradient = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
    gradient.addColorStop(0, `rgba(56,189,248,${c.alpha})`);
    gradient.addColorStop(1, "rgba(15,23,42,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function animateClouds() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    clouds.forEach((c) => {
      c.x += c.dx;
      c.y += c.dy;

      if (c.x < -c.r) c.x = w + c.r;
      if (c.x > w + c.r) c.x = -c.r;
      if (c.y < -c.r) c.y = h + c.r;
      if (c.y > h + c.r) c.y = -c.r;

      drawCloud(c);
    });

    requestAnimationFrame(animateClouds);
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 8; i++) {
      const c = createCloud(
        x + (Math.random() - 0.5) * 80,
        y + (Math.random() - 0.5) * 60,
        40 + Math.random() * 80
      );
      c.dx *= 2;
      c.dy *= 2;
      clouds.push(c);
    }
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    initClouds();
  });

  resizeCanvas();
  initClouds();
  animateClouds();
}

// ---------- TIMELINE CLIQUABLE MOBILE ----------
const timelineItems = $all(".timeline-item");
timelineItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (window.innerWidth <= 900) {
      item.classList.toggle("open");
    }
  });
});

// ---------- SABIRGPT ----------

const chatMessages = $("#chat-messages");
const chatForm = $("#chat-form");
const chatInput = $("#chat-input");

const sabirFacts = {
  age: "Sabir est né le 19 janvier 2008. En 2025, il a 17 ans.",
  studies:
    "Sabir est en Terminale Bac Pro CIEL à Toulon. CIEL = Cybersécurité, Informatique, Réseaux et Électronique.",
  goal:
    "Après le Bac Pro CIEL, son objectif est d’intégrer un BTS SIO pour aller plus loin en informatique (développement, systèmes, réseaux).",
  stagesShort:
    "Sabir a déjà fait plusieurs stages : développement web, réparation de téléphones, technicien fibre optique, électricité bâtiment et support informatique.",
  stagesDetail:
    "En résumé : \n- Stage en développement web (workflow, intégration, petites tâches de dev).\n- Stage en réparation de téléphones (diagnostic, changement d’écrans et batteries, tests, contact client).\n- Stage en fibre optique (raccordement, sécurité, tests de connexion).\n- Expériences en électricité bâtiment et support informatique.",
  bacPro:
    "Le Bac Pro CIEL de Sabir couvre la cybersécurité, l’informatique, les réseaux et l’électronique, avec beaucoup de TP et de projets concrets.",
  hobbies:
    "Sabir aime l’informatique, la cybersécurité, les projets web, mais aussi le foot et les projets digitaux.",
  portfolio:
    "Ce portfolio sert à présenter le parcours de Sabir, ses compétences, ses stages et ses objectifs pour la suite (BTS SIO, etc.).",
};

let lastTopic = null;

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectTopic(message) {
  const msg = message.toLowerCase();

  if (/(quel age|quel âge|a quel age|âge|ans)/.test(msg)) return "age";
  if (/(bac pro|ciel|lycee|lycée|formation)/.test(msg)) return "studies";
  if (/(bts sio|apres le bac|après le bac|objectif|futur|plus tard)/.test(msg))
    return "goal";
  if (/(stage|stages|experience|expérience|fibre|réparation|telephone|téléphone|web)/.test(
    msg
  ))
    return "stages";
  if (/(parcours|profil|qui est sabir|parle de sabir)/.test(msg)) return "profil";
  if (/(hobby|passion|foot|football|loisir|loisirs)/.test(msg)) return "hobbies";
  if (/(portfolio|site|github)/.test(msg)) return "portfolio";
  return "generic";
}

function baseAnswer(topic) {
  switch (topic) {
    case "age":
      return randomChoice([
        sabirFacts.age,
        `${sabirFacts.age} Il est donc encore jeune mais déjà bien orienté dans l’IT.`,
      ]);
    case "studies":
      return randomChoice([
        sabirFacts.studies,
        `${sabirFacts.studies} Il y travaille la cybersécurité, les réseaux, l’électronique et l’informatique.`,
      ]);
    case "goal":
      return randomChoice([
        sabirFacts.goal,
        `${sabirFacts.goal} L’idée est de construire une base solide en informatique.`,
      ]);
    case "stages":
      return randomChoice([sabirFacts.stagesShort, sabirFacts.stagesDetail]);
    case "profil":
      return (
        sabirFacts.studies +
        " " +
        sabirFacts.goal +
        " Il a déjà plusieurs stages en poche et continue à se construire un profil technique."
      );
    case "hobbies":
      return randomChoice([
        sabirFacts.hobbies,
        `Côté loisirs, ${sabirFacts.hobbies}`,
      ]);
    case "portfolio":
      return sabirFacts.portfolio;
    case "generic":
    default:
      return randomChoice([
        "Je suis SabirGPT. Pose-moi des questions sur le parcours de Sabir, ses stages, son Bac Pro CIEL ou ses objectifs.",
        "Je peux te parler de son âge, de ses études, de ses stages (fibre, web, téléphones…) et de ce qu’il veut faire après le Bac.",
      ]);
  }
}

function addMessage(role, text) {
  if (!chatMessages) return;
  const wrapper = document.createElement("div");
  wrapper.className = `chat-message ${role}`;
  const span = document.createElement("span");
  span.textContent = text;
  wrapper.appendChild(span);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// message d’accueil
if (chatMessages) {
  addMessage(
    "bot",
    "Salut, je suis SabirGPT 🤝 Je peux répondre aux questions sur Sabir, son Bac Pro CIEL, ses stages, son âge, ses objectifs, etc."
  );
}

if (chatForm && chatInput) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = chatInput.value.trim();
    if (!value) return;

    addMessage("user", value);
    chatInput.value = "";

    const topic = detectTopic(value);
    let answer = baseAnswer(topic);

    if (lastTopic && lastTopic === topic && topic !== "generic") {
      answer += " On reste sur le même sujet, tu peux demander plus de détails si tu veux.";
    }

    lastTopic = topic;

    setTimeout(() => {
      addMessage("bot", answer);
    }, 250);
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });
}

// ---------- INTRO LION – INTERACTION ----------
const introScreen = $("#intro-screen");
const introLion = $("#intro-lion");

if (introScreen && introLion) {
  const maxOffset = 10; // mouvement léger

  function moveLion(e) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nx = (e.clientX / vw) * 2 - 1;
    const ny = (e.clientY / vh) * 2 - 1;

    const offsetX = -nx * maxOffset;
    const offsetY = -ny * maxOffset;

    introLion.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  }

  window.addEventListener("pointermove", moveLion);

  introLion.addEventListener("click", () => {
    introScreen.classList.add("intro-exit");

    setTimeout(() => {
      introScreen.style.display = "none";
      const profil = document.querySelector("#profil");
      if (profil) {
        profil.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  });
}
