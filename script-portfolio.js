// --------- HELPERS ---------
function $(selector, scope = document) {
  return scope.querySelector(selector);
}
function $all(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

// --------- ANNÉE FOOTER ---------
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = $("#year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// --------- THÈME CLAIR / SOMBRE ---------
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

// --------- REVEAL SECTIONS + NAV ACTIVE + ANIM SHELL ---------
const sections = $all(".section");
const navLinks = $all(".nav-link");
const mainShell = $("#main-shell");

function setActiveNav(id) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === `#${id}`) link.classList.add("active");
    else link.classList.remove("active");
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

// --------- HERO CARD TILT ---------
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

    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(14px)`;
    heroCard.style.boxShadow =
      "0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(59,130,246,0.35)";
  });

  heroTiltContainer.addEventListener("mouseleave", () => {
    heroCard.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    heroCard.style.boxShadow = "";
  });
}

// --------- CANVAS NUAGES ---------
const canvas = $("#sky");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const clouds = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

// --------- TIMELINE (clic mobile) ---------
const timelineItems = $all(".timeline-item");
timelineItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (window.innerWidth <= 900) {
      item.classList.toggle("open");
    }
  });
});

// --------- SABIRGPT – IA PERSONNALISÉE ---------

const chatMessages = $("#chat-messages");
const chatForm = $("#chat-form");
const chatInput = $("#chat-input");

const sabirFacts = {
  age: "Sabir est né le 19 janvier 2008. En 2025, il a 17 ans.",
  studies:
    "Sabir est en Terminale Bac Pro CIEL à Toulon (Cybersécurité, Informatique, Réseaux et Électronique).",
  goal:
    "Après le Bac Pro CIEL, son objectif est d’intégrer un BTS SIO pour aller plus loin en informatique (développement, systèmes, réseaux).",
  stagesShort:
    "Sabir a déjà fait plusieurs stages : développement web, réparation de téléphones, technicien fibre optique, électricité bâtiment et support informatique.",
  stagesDetail:
    "En résumé :\n- Développement web (workflow, petites intégrations, clients).\n- Réparation de téléphones (diagnostic, écrans, batteries, tests, relation client).\n- Fibre optique (raccordement, sécurité, tests de connexion).\n- Électricité bâtiment et support informatique.",
  bacPro:
    "Le Bac Pro CIEL de Sabir couvre la cybersécurité, l’informatique, les réseaux et l’électronique avec beaucoup de TP et de projets concrets.",
  hobbies:
    "Sabir aime l’informatique, la cybersécurité, les projets web, mais aussi le foot et les projets digitaux.",
  portfolio:
    "Ce portfolio présente le parcours de Sabir, ses compétences, ses stages et ses objectifs pour la suite (BTS SIO, puis d’autres formations en informatique).",
};

let lastTopic = null;

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectTopic(message) {
  const msg = message.toLowerCase();

  if (/(quel age|quel âge|a quel age|âge|ans)/.test(msg)) return "age";
  if (/(bac pro|ciel|lycee|lycée|formation)/.test(msg)) return "studies";
  if (/(bts sio|apres le bac|après le bac|objectif|futur|plus tard|orientation)/.test(
    msg
  ))
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
        `${sabirFacts.age} Il est encore jeune mais déjà bien lancé dans l’IT.`,
      ]);
    case "studies":
      return randomChoice([
        sabirFacts.studies,
        `${sabirFacts.studies} Il y travaille la sécurité, les réseaux, l’électronique et l’informatique.`,
      ]);
    case "goal":
      return randomChoice([
        sabirFacts.goal,
        `${sabirFacts.goal} L’idée est de construire une base solide pour ensuite se spécialiser.`,
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
        "Je suis SabirGPT. Pose-moi des questions sur le parcours de Sabir, ses stages, son Bac Pro CIEL ou son objectif BTS SIO.",
        "Je peux te parler de son âge, de ses études, de ses stages (fibre, web, téléphones, etc.) et de ce qu’il veut faire après le Bac.",
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

// Message d’accueil
if (chatMessages) {
  addMessage(
    "bot",
    "Salut, je suis SabirGPT 🤝 Je réponds aux questions sur le parcours de Sabir, ses stages, son Bac Pro CIEL et son objectif BTS SIO."
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
      answer +=
        " On est toujours sur le même sujet ; tu peux me demander des détails plus précis si tu veux.";
    }

    lastTopic = topic;

    setTimeout(() => addMessage("bot", answer), 220);
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });
}

// --------- BULLE IA DÉPLAÇABLE ---------
const aiBubble = $("#ai-bubble");
if (aiBubble) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  aiBubble.addEventListener("pointerdown", (e) => {
    dragging = true;
    offsetX = e.clientX - aiBubble.offsetLeft;
    offsetY = e.clientY - aiBubble.offsetTop;
    aiBubble.setPointerCapture(e.pointerId);
  });

  aiBubble.addEventListener("pointerup", (e) => {
    dragging = false;
    aiBubble.releasePointerCapture(e.pointerId);
  });

  aiBubble.addEventListener("pointercancel", () => {
    dragging = false;
  });

  document.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    aiBubble.style.left = `${x}px`;
    aiBubble.style.top = `${y}px`;
  });
}

// --------- CURSEUR CUSTOM ---------
const cursorDot = $(".cursor-dot");
const cursorRing = $(".cursor-ring");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

if (cursorDot && cursorRing) {
  document.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  document.addEventListener("mousedown", () => {
    cursorRing.classList.add("click");
  });
  document.addEventListener("mouseup", () => {
    cursorRing.classList.remove("click");
  });
}
