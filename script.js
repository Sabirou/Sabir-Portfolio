// ===== Année dynamique dans le footer =====
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===== Thème clair / sombre =====
const body = document.body;
const toggleBtn = document.getElementById("theme-toggle");

function applyTheme(theme) {
  body.setAttribute("data-theme", theme);
  if (toggleBtn) {
    toggleBtn.textContent = theme === "dark" ? "🌙 Mode sombre" : "☀️ Mode clair";
  }
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const current = body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

// ===== Animation au scroll (reveal) =====
const revealElements = document.querySelectorAll(".reveal");

function handleScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("load", handleScroll);

// ===== Effet 3D au clic sur liens & boutons =====
function initClick3DEffect() {
  const clickable = document.querySelectorAll(
    ".nav-link, .btn-3d, .social-pill, .suggestion-pill"
  );
  clickable.forEach((el) => {
    el.addEventListener("click", () => {
      el.classList.add("clicked-3d");
      setTimeout(() => {
        el.classList.remove("clicked-3d");
      }, 220);
    });
  });
}
window.addEventListener("load", initClick3DEffect);

// ===== Nuages bleus animés sur le canvas =====
const canvas = document.getElementById("sky");
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
      alpha: 0.25 + Math.random() * 0.35,
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
        createCloud(Math.random() * w, Math.random() * h, 60 + Math.random() * 120)
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

// ===== Assistant IA – SabirGPT (multi-modes + mémoire simple) =====
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const modeButtons = document.querySelectorAll(".mode-btn");
const typingIndicator = document.getElementById("typing-indicator");
const suggestionButtons = document.querySelectorAll(".suggestion-pill");

let currentMode = "chill";
const chatHistory = []; // { sender: 'user'|'bot', text: '...' }

// changement de mode
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.getAttribute("data-mode") || "chill";

    addMessage(
      `Mode <strong>${modeLabel(currentMode)}</strong> activé. Pose ta question 😉`,
      "bot"
    );
  });
});

// clic sur une suggestion pré-définie
suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const question = btn.getAttribute("data-question") || btn.textContent.trim();
    if (!question || !chatForm || !chatInput) return;
    chatInput.value = question;
    chatForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  });
});

function modeLabel(mode) {
  switch (mode) {
    case "pro":
      return "Professionnel";
    case "cyber":
      return "Cybersécurité";
    case "orient":
      return "Orientation";
    default:
      return "Chill";
  }
}

function addMessage(text, sender = "bot") {
  if (!chatWindow) return;
  const wrapper = document.createElement("div");
  wrapper.className = `chat-message ${sender}`;
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.innerHTML = text;
  wrapper.appendChild(bubble);
  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  chatHistory.push({ sender, text });
}

function normalizeMessage(message) {
  return message
    .toLowerCase()
    .replace(/[?!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isFollowUp(message) {
  const m = normalizeMessage(message);
  return (
    m === "et apres" ||
    m === "et après" ||
    m === "et sinon" ||
    m === "continue" ||
    m === "dis moi plus" ||
    m === "explique plus"
  );
}

function getLastTopic() {
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    const item = chatHistory[i];
    if (item.sender === "bot") {
      const txt = item.text.toLowerCase();
      if (txt.includes("fibre optique")) return "fibre";
      if (txt.includes("téléphones") || txt.includes("téléphone")) return "telephones";
      if (txt.includes("bac pro ciel")) return "ciel";
      if (txt.includes("bts sio")) return "bts";
      if (txt.includes("stages")) return "stages";
    }
  }
  return null;
}

function wrapByMode(coreText, mode) {
  if (mode === "pro") {
    return `
      <strong>[Mode professionnel]</strong><br>
      ${coreText}
    `;
  }
  if (mode === "cyber") {
    return `
      <strong>[Mode cybersécurité]</strong><br>
      ${coreText}<br><br>
      Côté cyber, l’idée est toujours la même : comprendre les risques, protéger les systèmes
      (sauvegardes, mises à jour, mots de passe), et garder une bonne hygiène numérique.
    `;
  }
  if (mode === "orient") {
    return `
      <strong>[Mode orientation]</strong><br>
      ${coreText}<br><br>
      Si tu hésites sur ton futur, note ce que tu aimes vraiment dans ce que fait Sabir :
      le terrain ? le dev ? les réseaux ? Ça peut t’aider à choisir la bonne filière.
    `;
  }
  return coreText; // chill
}

function generateSabirBotReply(message) {
  const raw = message;
  const msg = normalizeMessage(message);
  const mode = currentMode;

  // âge
  if (
    (msg.includes("age") || msg.includes("ans")) &&
    (msg.includes("sabir") || msg.includes("il"))
  ) {
    const core = `
      Sabir a <strong>17 ans</strong> 🎂.<br>
      Il est né le <strong>19 janvier 2008</strong> et vit à <strong>Saint-Maximin (83)</strong>.
    `;
    return wrapByMode(core, mode);
  }

  // follow up
  if (isFollowUp(raw)) {
    const lastTopic = getLastTopic();
    let core;
    if (lastTopic === "fibre") {
      core = `
        Pour compléter sur la <strong>fibre optique</strong> 🧵 :<br>
        pendant ce stage, Sabir a découvert la réalité du terrain : déplacements,
        météo, contraintes clients, sécurité, organisation du matériel.<br>
        Ça lui a montré que les réseaux, ce n’est pas que des schémas, c’est aussi des
        gens derrière chaque connexion.
      `;
    } else if (lastTopic === "telephones") {
      core = `
        Pour la <strong>réparation de téléphones</strong> 📱 :<br>
        en plus du côté technique (diagnostic, démontage, pièces), il y a le contact client :
        expliquer le problème, rassurer, être clair sur les délais.<br>
        C’est un bon mélange entre technique et relationnel.
      `;
    } else if (lastTopic === "ciel") {
      core = `
        Pour aller plus loin sur le <strong>Bac Pro CIEL</strong> 🧑‍💻 :<br>
        c’est une bonne base pour toucher aux réseaux, à la cybersécurité, à l’électronique
        et aux systèmes. Les TP et les stages sont vraiment la clé pour progresser.
      `;
    } else if (lastTopic === "bts") {
      core = `
        Concernant le <strong>BTS SIO</strong> 🎓 :<br>
        l’idée, c’est de passer à un niveau plus pro : projets plus longs, travail en équipe,
        alternance possible, rythme d’IT réel. Tu peux viser SISR (réseaux / infra) ou SLAM (dev).
      `;
    } else if (lastTopic === "stages") {
      core = `
        Pour les <strong>stages</strong> en général :<br>
        Sabir les a utilisés pour tester plusieurs environnements : terrain, atelier,
        support, web. C’est comme ça qu’il a clarifié ce qu’il aime vraiment dans l’IT.
      `;
    } else {
      core = `
        Je peux développer sur les <strong>stages</strong>, le <strong>Bac Pro CIEL</strong>,
        ou le <strong>BTS SIO</strong> si tu veux. Dis-moi juste sur quoi tu veux que je détaille 😉
      `;
    }
    return wrapByMode(core, mode);
  }

  // stages
  if (msg.includes("stages") || msg.includes("stage")) {
    const core = `
      Sabir a réalisé <strong>plusieurs stages entre 2023 et 2025</strong> :<br>
      • <strong>Fibre optique</strong> (2023, télécom)<br>
      • <strong>Réparation de téléphones</strong> (atelier)<br>
      • <strong>Développement web</strong><br>
      • <strong>Électricité bâtiment</strong><br>
      • <strong>Support informatique</strong><br><br>
      L’objectif : voir différents environnements pour mieux choisir la suite
      (BTS, spécialité, orientation).
    `;
    return wrapByMode(core, mode);
  }

  // Bac Pro CIEL
  if (msg.includes("bac pro") || msg.includes("ciel")) {
    const core = `
      Sabir est en <strong>Terminale Bac Pro CIEL</strong> 🧑‍💻.<br>
      CIEL = Cybersécurité, Informatique et Réseaux, Électronique.<br>
      Il y voit : réseaux, bases de cybersécurité, électronique, systèmes,
      TP et projets techniques.<br>
      C’est une bonne voie si tu veux toucher autant au matériel qu’au logiciel.
    `;
    return wrapByMode(core, mode);
  }

  // BTS SIO / orientation
  if (
    msg.includes("bts sio") ||
    msg.includes("apres le bac") ||
    msg.includes("après le bac") ||
    msg.includes("orientation") ||
    msg.includes("futur")
  ) {
    const core = `
      Après son Bac Pro CIEL, Sabir veut poursuivre en <strong>BTS SIO</strong> 🎓.<br>
      Ce BTS permet de se spécialiser :<br>
      • <strong>SISR</strong> → réseaux, systèmes, infra<br>
      • <strong>SLAM</strong> → développement d’applications<br><br>
      L’idée, c’est de renforcer ses bases en IT tout en gardant un lien avec la cybersécurité.
    `;
    return wrapByMode(core, mode);
  }

  // CV / portfolio
  if (
    msg.includes("cv") ||
    msg.includes("portfolio") ||
    msg.includes("port folio")
  ) {
    const core = `
      Ce site fait office de <strong>portfolio</strong> pour Sabir 📂.<br>
      Il présente son parcours, ses compétences et ses expériences.<br>
      Pour un CV plus détaillé (PDF, version pro), il peut l’envoyer par mail :
      <strong>amiamisabir@gmail.com</strong>.
    `;
    return wrapByMode(core, mode);
  }

  // salut / présentation
  if (
    msg.includes("salut") ||
    msg.includes("bonjour") ||
    msg.includes("hey") ||
    msg.includes("yo")
  ) {
    const core = `
      Hey 👋, moi c’est <strong>SabirGPT</strong>.<br>
      Je connais le parcours de Sabir (Bac Pro CIEL, stages, objectif BTS SIO)
      et je peux te répondre sur tout ça.<br>
      Tu peux aussi me poser des questions d’orientation ou sur les domaines qu’il vise.
    `;
    return wrapByMode(core, mode);
  }

  // qui es-tu ?
  if (
    msg.includes("qui es tu") ||
    msg.includes("t es qui") ||
    msg.includes("c est qui") ||
    msg.includes("qui es-tu")
  ) {
    const core = `
      Je suis <strong>SabirGPT</strong> 🤖.<br>
      Je ne suis pas une IA aussi lourde qu’un vrai GPT, mais je suis entraîné (en JavaScript)
      pour parler du parcours de Sabir, de son Bac Pro CIEL, de ses stages,
      de son objectif BTS SIO et de son mindset.
    `;
    return wrapByMode(core, mode);
  }

  // mode cyber : mot de passe
  if (mode === "cyber" && (msg.includes("mot de passe") || msg.includes("mdp"))) {
    const core = `
      Côté cybersécurité 🔐 :<br>
      • Utiliser des mots de passe longs (12+ caractères)<br>
      • Mélanger minuscules, majuscules, chiffres et symboles<br>
      • Éviter de réutiliser le même mot de passe partout<br>
      • Activer la double authentification quand c’est possible<br><br>
      C’est basique, mais beaucoup de gens ne le font pas encore.
    `;
    return wrapByMode(core, mode);
  }

  // défaut
  const coreDefault = `
    Bonne question 👀.<br>
    Je peux t’aider sur :<br>
    • le <strong>Bac Pro CIEL</strong> de Sabir<br>
    • ses <strong>stages</strong> (fibre, téléphones, web, etc.)<br>
    • son <strong>objectif BTS SIO</strong> et l’orientation<br>
    • quelques bases en <strong>cybersécurité</strong> et réseaux<br><br>
    Essaie par exemple :<br>
    <em>« Sabir a quel âge ? »</em>, <em>« C’est quoi le Bac Pro CIEL ? »</em> ou
    <em>« Quels stages il a faits ? »</em>
  `;
  return wrapByMode(coreDefault, mode);
}

// Gestion du formulaire de chat
if (chatForm && chatInput) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");

    if (typingIndicator) {
      typingIndicator.style.display = "flex";
    }

    setTimeout(() => {
      const reply = generateSabirBotReply(text);

      if (typingIndicator) {
        typingIndicator.style.display = "none";
      }

      addMessage(reply, "bot");
    }, 500);

    chatInput.value = "";
  });
}
