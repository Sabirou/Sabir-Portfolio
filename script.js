// ===== Année footer =====
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
    toggleBtn.textContent =
      theme === "dark" ? "🌙 Mode sombre" : "☀️ Mode clair";
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

// ===== Animation sections au scroll + nav active =====
const revealElements = document.querySelectorAll(".reveal");

function handleScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add("visible");
    }
  });

  const sections = document.querySelectorAll("section[id]");
  let activeId = null;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 80) {
      activeId = section.id;
    }
  });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    if (id === activeId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("load", handleScroll);

// ===== Effet clic 3D léger =====
function initClick3DEffect() {
  const clickable = document.querySelectorAll(
    ".btn-3d, .social-pill, .suggestion-pill"
  );
  clickable.forEach((el) => {
    el.addEventListener("click", () => {
      el.classList.add("clicked-3d");
      setTimeout(() => {
        el.classList.remove("clicked-3d");
      }, 180);
    });
  });
}
window.addEventListener("load", initClick3DEffect);

// ===== Scroll smooth avec offset header =====
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const headerOffset = 70;
    const rect = target.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY - headerOffset;
    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  });
});

// ===== Fond nuages BLEUS simplifié (stable) =====
const canvas = document.getElementById("sky");
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
      alpha: 0.2 + Math.random() * 0.35,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15,
    };
  }

  function initClouds() {
    clouds.length = 0;
    const w = canvas.width;
    const h = canvas.height;
    const count = window.innerWidth < 800 ? 8 : 12; // moins de nuages sur mobile
    for (let i = 0; i < count; i++) {
      clouds.push(
        createCloud(
          Math.random() * w,
          Math.random() * h,
          80 + Math.random() * 120
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
    const w = canvas.width;
    const h = canvas.height;
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

    for (let i = 0; i < 5; i++) {
      const c = createCloud(
        x + (Math.random() - 0.5) * 60,
        y + (Math.random() - 0.5) * 40,
        50 + Math.random() * 80
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

// ===== Base de connaissances Sabir =====
const SABIR_PROFILE = {
  identite: {
    nomComplet: "Sabir IAZZA",
    prenom: "Sabir",
    age: 17,
    dateNaissance: "19 janvier 2008",
    ville: "Saint-Maximin-la-Sainte-Baume (83470)",
  },
  contact: {
    email: "amiamisabir@gmail.com",
    tel: "07 62 97 26 26",
    localisation: "Saint-Maximin-la-Sainte-Baume (Var)",
    instagram: "@clh.Iz",
    instaUrl: "https://www.instagram.com/clh.iz",
    snapchat: "s7chl",
    snapUrl: "https://www.snapchat.com/add/s7chl",
    github: "Sabirou",
    githubUrl: "https://github.com/Sabirou",
  },
  etudes: {
    actuel: "Bac Professionnel CIEL (Cybersécurité, Informatique et Électronique)",
    objectifCourtTerme: "intégrer un BTS SIO après le Bac (de préférence en alternance)",
    certifs: ["Certification Cisco 2025 : Introduction à la cybersécurité"],
  },
  competences: {
    techniques: [
      "Notions de cybersécurité (types de menaces, mots de passe, sauvegardes, mises à jour)",
      "Adressage IP, petits réseaux locaux et diagnostic simple",
      "Montage / démontage de PC, remplacement de composants et dépannage matériel",
      "Bases en électricité (BTP) et installation de climatisation",
      "Bases HTML / CSS et logique de programmation",
      "Utilisation de la suite bureautique (Word, Excel, PowerPoint)",
    ],
    softSkills: [
      "Sérieux et ponctualité",
      "Motivation et envie de progresser",
      "Capacité à apprendre vite par la pratique",
      "Bonne communication avec les clients et collègues",
      "Esprit d’équipe et autonomie",
    ],
  },
  stages: [
    {
      id: "devweb",
      titre: "Stage en développement web",
      annee: "2025",
      details:
        "Découverte du développement web : petites tâches, observation de projets, compréhension du workflow d’un développeur.",
    },
    {
      id: "telephones",
      titre: "Stage en réparation de téléphones",
      annee: "2024",
      details:
        "Diagnostic, démontage, changement d’écrans et batteries, tests après intervention, contact client.",
    },
    {
      id: "fibre",
      titre: "Stage technicien fibre optique",
      annee: "2023",
      details:
        "Préparation du matériel, aide au raccordement, tests de connexion, sécurité terrain.",
    },
    {
      id: "batiment",
      titre: "Stage électricité bâtiment & climatisation",
      annee: "2023–2024",
      details:
        "Petites installations électriques, installation clim, aide sur chantier, respect des normes de sécurité.",
    },
    {
      id: "support",
      titre: "Stage support informatique / réseau",
      annee: "2022–2024",
      details:
        "Câblage, tests réseau, configuration simple, assistance utilisateurs, préparation de postes.",
    },
  ],
  centresInteret: [
    "Informatique & cybersécurité",
    "Électronique",
    "Développement web",
    "Sport (dont le foot)",
    "Business & digital",
  ],
};

// ===== IA SabirGPT =====
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const modeButtons = document.querySelectorAll(".mode-btn");
const typingIndicator = document.getElementById("typing-indicator");
const suggestionButtons = document.querySelectorAll(".suggestion-pill");

let currentMode = "chill";
let lastTopic = null;

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
    m === "et après" ||
    m === "et apres" ||
    m === "continue" ||
    m === "explique plus" ||
    m === "développe" ||
    m === "developpe"
  );
}

function messageMentionsSabir(message) {
  const m = normalizeMessage(message);
  return (
    m.includes("sabir") ||
    m.includes("iazza") ||
    m.includes("c est qui") ||
    m.includes("qui es tu") ||
    m.includes("t es qui")
  );
}

function detectTopic(msg) {
  const m = normalizeMessage(msg);

  if ((m.includes("age") || m.includes("ans")) && m.includes("sabir")) return "age";
  if (m.includes("date de naissance")) return "age";

  if (m.includes("habite") || m.includes("ville")) return "localisation";

  if (m.includes("mail") || m.includes("email") || m.includes("contact")) return "contact";
  if (m.includes("instagram") || m.includes("insta")) return "instagram";
  if (m.includes("snap") || m.includes("snapchat")) return "snapchat";
  if (m.includes("github")) return "github";

  if (m.includes("bac pro") || m.includes("ciel")) return "ciel";
  if (m.includes("bts sio") || m.includes("bts") || m.includes("apres le bac") || m.includes("après le bac"))
    return "bts";

  if (m.includes("certif") || m.includes("certification")) return "certif";

  if (m.includes("competence") || m.includes("compétence") || m.includes("skills"))
    return "competences";

  if (m.includes("stage")) {
    if (m.includes("fibre")) return "fibre";
    if (m.includes("telephone") || m.includes("téléphone")) return "telephones";
    if (m.includes("batiment") || m.includes("bâtiment") || m.includes("electricite"))
      return "batiment";
    if (m.includes("web")) return "devweb";
    if (m.includes("support")) return "support";
    return "stages";
  }

  if (m.includes("projet") || m.includes("portfolio") || m.includes("site")) {
    return "projets";
  }

  if (
    m.includes("orientation") ||
    m.includes("futur") ||
    m.includes("metier") ||
    m.includes("métier")
  ) {
    return "orientation";
  }

  if (m.includes("cv")) return "cv";
  if (m.includes("qualites") || m.includes("qualités")) return "qualites";
  if (m.includes("hobby") || m.includes("loisir") || m.includes("centre d interet"))
    return "hobbies";

  if (m.includes("bonjour") || m.includes("salut") || m.includes("hey") || m.includes("yo"))
    return "salut";

  if (messageMentionsSabir(msg)) return "resumeGlobal";

  return "inconnu";
}

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

function addMessage(text, sender = "bot", topic = null) {
  if (!chatWindow) return;
  const wrapper = document.createElement("div");
  wrapper.className = `chat-message ${sender}`;
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.innerHTML = text;
  wrapper.appendChild(bubble);
  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  if (sender === "bot" && topic) lastTopic = topic;
}

function wrapByMode(coreText, mode) {
  if (mode === "pro") {
    return `<strong>[Mode pro]</strong><br>${coreText}`;
  }
  if (mode === "cyber") {
    return `
      <strong>[Mode cyber]</strong><br>
      ${coreText}
    `;
  }
  if (mode === "orient") {
    return `
      <strong>[Mode orientation]</strong><br>
      ${coreText}
    `;
  }
  return coreText;
}

// ===== Réponses simples =====
function answerAge() {
  const p = SABIR_PROFILE.identite;
  return `
    Sabir a <strong>${p.age} ans</strong> 🎂.<br>
    Il est né le <strong>${p.dateNaissance}</strong> et habite à
    <strong>${p.ville}</strong>.
  `;
}

function answerLocalisation() {
  return `
    Sabir habite à <strong>${SABIR_PROFILE.identite.ville}</strong> 📍.<br>
    Il étudie à Toulon et vit à Saint-Maximin-la-Sainte-Baume.
  `;
}

function answerContact() {
  const c = SABIR_PROFILE.contact;
  return `
    Tu peux contacter Sabir ici :<br><br>
    • 📧 <strong>Email :</strong> <a href="mailto:${c.email}">${c.email}</a><br>
    • 📱 <strong>Téléphone :</strong> ${c.tel}<br>
    • 📍 <strong>Localisation :</strong> ${c.localisation}
  `;
}

function answerInstagram() {
  const c = SABIR_PROFILE.contact;
  return `
    Instagram de Sabir 📸 :<br>
    • Pseudo : <strong>${c.instagram}</strong><br>
    • Lien : <a href="${c.instaUrl}" target="_blank" rel="noopener">${c.instaUrl}</a>
  `;
}

function answerSnapchat() {
  const c = SABIR_PROFILE.contact;
  return `
    Snapchat de Sabir 👻 :<br>
    • Pseudo : <strong>${c.snapchat}</strong><br>
    • Lien : <a href="${c.snapUrl}" target="_blank" rel="noopener">${c.snapUrl}</a>
  `;
}

function answerGithub() {
  const c = SABIR_PROFILE.contact;
  return `
    GitHub de Sabir 🐙 :<br>
    • Pseudo : <strong>${c.github}</strong><br>
    • Lien : <a href="${c.githubUrl}" target="_blank" rel="noopener">${c.githubUrl}</a>
  `;
}

function answerCiel() {
  const e = SABIR_PROFILE.etudes;
  return `
    Sabir est en <strong>${e.actuel}</strong> 🧑‍💻.<br><br>
    Il y travaille sur : réseaux, cybersécurité, électronique et informatique.
  `;
}

function answerBts() {
  const e = SABIR_PROFILE.etudes;
  return `
    Objectif après le Bac 🎯 :<br>
    • <strong>${e.objectifCourtTerme}</strong><br><br>
    Il vise un BTS SIO orienté réseaux / systèmes, en lien avec son Bac Pro CIEL.
  `;
}

function answerCertif() {
  const cert = SABIR_PROFILE.etudes.certifs[0];
  return `
    Certification de Sabir :<br>
    • <strong>${cert}</strong><br><br>
    Elle lui donne une base solide en cybersécurité et bonnes pratiques.
  `;
}

function answerCompetences() {
  const t = SABIR_PROFILE.competences.techniques;
  const s = SABIR_PROFILE.competences.softSkills;
  return `
    <strong>Compétences techniques :</strong><br>
    • ${t.join("<br>• ")}<br><br>
    <strong>Savoir-être :</strong><br>
    • ${s.join("<br>• ")}
  `;
}

function answerStagesGlobal() {
  const list = SABIR_PROFILE.stages
    .map((st) => `• <strong>${st.titre}</strong> (${st.annee})`)
    .join("<br>");
  return `
    Stages réalisés par Sabir :<br><br>
    ${list}<br><br>
    Chaque stage lui a permis de voir un autre aspect de l’IT ou du technique.
  `;
}

function answerStageById(id) {
  const st = SABIR_PROFILE.stages.find((s) => s.id === id);
  if (!st) return answerStagesGlobal();
  return `
    <strong>${st.titre}</strong> (${st.annee})<br><br>
    ${st.details}
  `;
}

function answerProjets() {
  return `
    Projets principaux de Sabir :<br><br>
    • <strong>Portfolio & identité numérique</strong> : ce site animé pour présenter son parcours.<br>
    • <strong>Projets perso</strong> : tests réseau, dépannage PC, petites expérimentations web/électronique.
  `;
}

function answerOrientation() {
  const e = SABIR_PROFILE.etudes;
  return `
    Trajectoire de Sabir :<br><br>
    • Aujourd’hui : ${e.actuel}<br>
    • Demain : ${e.objectifCourtTerme}<br><br>
    Il vise des métiers en lien avec les réseaux, la cyber, l’IT et le web.
  `;
}

function answerCv() {
  const c = SABIR_PROFILE.contact;
  return `
    Ce site joue le rôle de <strong>portfolio</strong> 📂.<br>
    Pour un CV PDF classique, Sabir peut l’envoyer par email :<br>
    • <a href="mailto:${c.email}">${c.email}</a>
  `;
}

function answerQualites() {
  const s = SABIR_PROFILE.competences.softSkills;
  return `
    Qualités de Sabir :<br>
    • ${s.join("<br>• ")}<br>
  `;
}

function answerHobbies() {
  const h = SABIR_PROFILE.centresInteret;
  return `
    Centres d’intérêt de Sabir 🎮⚽ :<br>
    • ${h.join("<br>• ")}
  `;
}

function answerSalut() {
  return `
    Salut 👋, je suis <strong>SabirGPT</strong>.<br>
    Pose-moi tes questions sur Sabir : âge, ville, Bac Pro CIEL, stages,
    projet après le bac, compétences, etc.
  `;
}

function answerResumeGlobal() {
  const p = SABIR_PROFILE.identite;
  return `
    <strong>Résumé rapide :</strong><br><br>
    • Nom : ${p.nomComplet}<br>
    • Âge : ${p.age} ans (né le ${p.dateNaissance})<br>
    • Ville : ${p.ville}<br>
    • Études : Bac Pro CIEL<br>
    • Objectif : BTS SIO<br>
    • Stages : fibre, téléphones, dev web, support IT, bâtiment…<br>
  `;
}

function answerFollowUp(topic) {
  switch (topic) {
    case "fibre":
      return `
        Pour compléter sur la <strong>fibre optique</strong> :<br>
        Sabir a vu le côté terrain des réseaux : tests, qualité du signal,
        déplacement chez les clients, sécurité, etc.
      `;
    case "devweb":
      return `
        Pour compléter sur le <strong>dev web</strong> :<br>
        Il a compris comment on passe d’une maquette / d’une idée à un site,
        avec des petites tâches de code et de correction.
      `;
    case "ciel":
      return `
        Pour compléter sur le <strong>Bac Pro CIEL</strong> :<br>
        Beaucoup de TP, de manipulations, et un mélange entre réseaux,
        électronique et informatique.
      `;
    default:
      return `
        Je peux détailler davantage la fibre, le dev web, le Bac Pro CIEL,
        ou les autres stages. Dis-moi lequel tu veux que j’approfondisse 😉
      `;
  }
}

function answerDefault(message) {
  if (messageMentionsSabir(message)) {
    return answerResumeGlobal();
  }
  return `
    Je réponds à toutes les questions qui concernent <strong>Sabir</strong> :<br>
    son âge, sa ville, ses études, ses stages, ses compétences, ses projets.<br><br>
    Reformule ta question en parlant de lui (ex : « Quels stages Sabir a faits ? »).
  `;
}

function generateSabirBotReply(message) {
  const mode = currentMode;

  if (isFollowUp(message)) {
    const core = answerFollowUp(lastTopic || "ciel");
    return { text: wrapByMode(core, mode), topic: lastTopic };
  }

  const topic = detectTopic(message);
  let core;
  let t = topic;

  switch (topic) {
    case "age":
      core = answerAge();
      break;
    case "localisation":
      core = answerLocalisation();
      break;
    case "contact":
      core = answerContact();
      break;
    case "instagram":
      core = answerInstagram();
      break;
    case "snapchat":
      core = answerSnapchat();
      break;
    case "github":
      core = answerGithub();
      break;
    case "ciel":
      core = answerCiel();
      break;
    case "bts":
      core = answerBts();
      break;
    case "certif":
      core = answerCertif();
      break;
    case "competences":
      core = answerCompetences();
      break;
    case "stages":
      core = answerStagesGlobal();
      break;
    case "devweb":
      core = answerStageById("devweb");
      break;
    case "telephones":
      core = answerStageById("telephones");
      break;
    case "fibre":
      core = answerStageById("fibre");
      break;
    case "batiment":
      core = answerStageById("batiment");
      break;
    case "support":
      core = answerStageById("support");
      break;
    case "projets":
      core = answerProjets();
      break;
    case "orientation":
      core = answerOrientation();
      break;
    case "cv":
      core = answerCv();
      break;
    case "qualites":
      core = answerQualites();
      break;
    case "hobbies":
      core = answerHobbies();
      break;
    case "salut":
      core = answerSalut();
      break;
    case "resumeGlobal":
      core = answerResumeGlobal();
      break;
    default:
      core = answerDefault(message);
      t = null;
  }

  return {
    text: wrapByMode(core, mode),
    topic: t,
  };
}

// ===== Gestion du chat =====
if (chatForm && chatInput && chatWindow) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");

    if (typingIndicator) typingIndicator.style.display = "flex";

    setTimeout(() => {
      const { text: reply, topic } = generateSabirBotReply(text);
      if (typingIndicator) typingIndicator.style.display = "none";
      addMessage(reply, "bot", topic || undefined);
    }, 450);

    chatInput.value = "";
  });
}

// Modes IA
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

// Suggestions
suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const question =
      btn.getAttribute("data-question") || btn.textContent.trim();
    if (!question || !chatForm || !chatInput) return;
    chatInput.value = question;
    chatForm.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  });
});
