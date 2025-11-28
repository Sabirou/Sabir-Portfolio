// ================== ANNÉE FOOTER ==================
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ================== THÈME CLAIR / SOMBRE ==================
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

// ================== ANIMATION REVEAL AU SCROLL ==================
const revealElements = document.querySelectorAll(".reveal");

function handleScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add("visible");
    }
  });

  // Activation du lien de nav correspondant à la section visible
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

// ================== EFFET 3D AU CLIC ==================
function initClick3DEffect() {
  const clickable = document.querySelectorAll(
    ".nav-link, .btn-3d, .social-pill, .suggestion-pill, .btn-primary, .btn-ghost"
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

// ================== SCROLL SMOOTH AVEC OFFSET NAV ==================
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

// ================== FOND NUAGES BLEUS ==================
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

// ================== SABIR PROFILE (BASE DE CONNAISSANCES) ==================
const SABIR_PROFILE = {
  identite: {
    nomComplet: "Sabir IAZZA",
    prenom: "Sabir",
    age: 17,
    dateNaissance: "19 janvier 2008",
    ville: "Saint-Maximin-la-Sainte-Baume (83470)",
    descriptionCourte:
      "élève en Bac Pro CIEL (Cybersécurité, Informatique, Réseaux et Électronique), motivé, sérieux et passionné par le numérique, la cybersécurité et les projets concrets.",
  },

  contact: {
    email: "amiamisabir@gmail.com",
    tel: "07 62 97 26 26",
    adressePostale: "283 Chemin du Petit Ruisseau, 83470 Saint-Maximin-la-Sainte-Baume",
    localisation: "Saint-Maximin-la-Sainte-Baume (Var)",
    instagram: "@clh.Iz",
    instaUrl: "https://www.instagram.com/clh.iz",
    snapchat: "s7chl",
    snapUrl: "https://www.snapchat.com/add/s7chl",
    github: "Sabirou",
    githubUrl: "https://github.com/Sabirou",
    permis: "Permis B",
  },

  etudes: {
    actuel: "Bac Professionnel CIEL (Cybersécurité, Informatique et Électronique)",
    objectifCourtTerme: "intégrer un BTS SIO après le Bac (de préférence en alternance)",
    autresPistes: ["BTS Cybersécurité", "BTS SN", "BTS CIEL"],
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
      "Capacité à apprendre vite par la pratique (TP, stages, projets persos)",
      "Bonne communication avec les clients et collègues",
      "Esprit d’équipe et autonomie",
    ],
    langues: [
      "Français : courant",
      "Anglais : intermédiaire",
      "Espagnol : intermédiaire",
    ],
  },

  stages: [
    {
      id: "batiment",
      titre: "Stage en électricité & installation de climatisation",
      annee: "2023–2024",
      contexte: "Domaine du BTP (bâtiment)",
      details:
        "Découverte des installations électriques et de la pose de climatisations : aide sur chantier, respect des consignes de sécurité, participation à de petites tâches techniques dans le bâtiment.",
    },
    {
      id: "telephones",
      titre: "Stage en réparation de téléphones",
      annee: "2024",
      contexte: "Domaine technologique",
      details:
        "Diagnostic de pannes, démontage propre, changement d’écrans et de batteries, tests après réparation et contact avec la clientèle.",
    },
    {
      id: "devweb",
      titre: "Stage en développement web",
      annee: "2025",
      contexte: "Entreprise / Web",
      details:
        "Découverte du développement web en conditions réelles : participation à de petites tâches, observation de projets, compréhension du workflow d’un développeur.",
    },
    {
      id: "support",
      titre: "Stage support informatique",
      annee: "2024",
      contexte: "Service IT",
      details:
        "Assistance aux utilisateurs, préparation de postes, mises à jour logicielles et diagnostic simple de pannes.",
    },
    {
      id: "reseauAssoc",
      titre: "Stage découverte réseau",
      annee: "2022",
      contexte: "Association locale",
      details:
        "Initiation au câblage et à la configuration d’un réseau local, tests de connectivité et documentation des schémas.",
    },
  ],

  projets: [
    {
      id: "portfolio",
      titre: "Portfolio & identité numérique",
      description:
        "Création d’un site portfolio moderne et animé pour présenter son parcours, ses compétences, ses stages et son mindset.",
      objectif:
        "Avoir une vitrine professionnelle à montrer aux écoles et aux entreprises (stage / alternance).",
    },
    {
      id: "perso",
      titre: "Projets perso & tests",
      description:
        "Tests de configurations réseau, dépannage PC, petites expérimentations web et électroniques.",
      objectif:
        "Comprendre concrètement comment fonctionnent les systèmes et progresser par la pratique.",
    },
  ],

  centresInteret: [
    "Informatique & cybersécurité",
    "Électronique",
    "Informatique en général",
    "Réseaux sociaux",
    "Sport (dont le foot)",
    "Voyage",
  ],
};

// ================== IA SABIRGPT ==================
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const modeButtons = document.querySelectorAll(".mode-btn");
const typingIndicator = document.getElementById("typing-indicator");
const suggestionButtons = document.querySelectorAll(".suggestion-pill");

let currentMode = "chill";
const chatHistory = [];
let lastTopic = null;

// Normalisation message
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
    m === "explique plus" ||
    m === "developpe" ||
    m === "développe" ||
    m === "un peu plus"
  );
}

function messageMentionsSabir(message) {
  const m = normalizeMessage(message);
  return (
    m.includes("sabir") ||
    m.includes("iazza") ||
    m.includes("toi") ||
    m.includes("ton") ||
    m.includes("ta") ||
    m.includes("t es qui") ||
    m.includes("qui es tu")
  );
}

function detectTopic(msg) {
  const m = normalizeMessage(msg);

  if ((m.includes("age") || m.includes("ans")) && m.includes("sabir")) return "age";
  if (m.includes("date de naissance")) return "age";

  if (m.includes("tu habites") || m.includes("ou habite") || m.includes("où habite") || m.includes("ville")) {
    return "localisation";
  }

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

  if (m.includes("stage") || m.includes("stages")) {
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

  if (m.includes("orientation") || m.includes("futur") || m.includes("metier") || m.includes("métier")) {
    return "orientation";
  }

  if (m.includes("cv")) return "cv";

  if (m.includes("qualites") || m.includes("qualités") || m.includes("defauts") || m.includes("défauts"))
    return "qualites";

  if (m.includes("hobby") || m.includes("passion") || m.includes("loisir") || m.includes("centre d interet"))
    return "hobbies";

  if (m.includes("qui es tu") || m.includes("t es qui") || m.includes("c est qui sabir")) {
    return "qui";
  }

  if (m.includes("mot de passe") || m.includes("mdp")) return "mdp";

  if (m.includes("bonjour") || m.includes("salut") || m.includes("yo") || m.includes("hey")) {
    return "salut";
  }

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

// Ajout message
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
  chatHistory.push({ sender, text, topic });

  if (chatHistory.length > 50) chatHistory.shift();
  if (sender === "bot" && topic) lastTopic = topic;
}

// Modes
function wrapByMode(coreText, mode) {
  if (mode === "pro") {
    return `<strong>[Mode professionnel]</strong><br>${coreText}`;
  }
  if (mode === "cyber") {
    return `
      <strong>[Mode cybersécurité]</strong><br>
      ${coreText}<br><br>
      <span style="font-size:0.8rem;color:#9ca3af;">
        (Rappel cyber) Toujours penser : menaces → protections → bonnes pratiques.
      </span>
    `;
  }
  if (mode === "orient") {
    return `
      <strong>[Mode orientation]</strong><br>
      ${coreText}<br><br>
      <span style="font-size:0.8rem;color:#9ca3af;">
        Astuce : note ce que tu aimes dans le parcours de Sabir (terrain, réseaux, dev…)
        pour choisir la bonne suite.
      </span>
    `;
  }
  return coreText;
}

// ==== Réponses par sujet ====
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
    Il est scolarisé à Toulon mais vit à Saint-Maximin-la-Sainte-Baume.
  `;
}

function answerContact() {
  const c = SABIR_PROFILE.contact;
  return `
    Tu peux contacter Sabir ici :<br><br>
    • 📧 <strong>Email :</strong> <a href="mailto:${c.email}">${c.email}</a><br>
    • 📱 <strong>Téléphone :</strong> ${c.tel}<br>
    • 📍 <strong>Localisation :</strong> ${c.localisation}<br><br>
    Et tu peux aussi passer par Instagram, Snapchat ou GitHub.
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
    • Lien : <a href="${c.githubUrl}" target="_blank" rel="noopener">${c.githubUrl}</a><br><br>
    Tu y trouveras ses projets publics (dont ce portfolio).
  `;
}

function answerCiel() {
  const e = SABIR_PROFILE.etudes;
  return `
    Sabir est en <strong>${e.actuel}</strong> 🧑‍💻.<br><br>
    Il y travaille sur :<br>
    • des <strong>réseaux</strong> (adressage IP, topologies, TP de routage)<br>
    • des bases de <strong>cybersécurité</strong> (risques, protections, mots de passe…)<br>
    • de l’<strong>électronique</strong> (mesures, composants, cartes)<br>
    • de l’<strong>informatique</strong> (OS, matériel, dépannage, scripts simples).<br><br>
    C’est une très bonne base avant un BTS SIO ou CIEL.
  `;
}

function answerBts() {
  const e = SABIR_PROFILE.etudes;
  return `
    Objectif principal après le Bac 🎯 : <strong>${e.objectifCourtTerme}</strong>.<br><br>
    En BTS SIO, Sabir se voit bien en :<br>
    • <strong>SISR</strong> : réseaux, systèmes, serveurs, infra<br>
    tout en gardant un intérêt pour le développement (web / scripts).<br><br>
    Après le BTS, l’idée est d’aller vers une spécialisation IT (réseaux, cyber, etc.).
  `;
}

function answerCertif() {
  const certs = SABIR_PROFILE.etudes.certifs;
  return `
    Certification de Sabir :<br>
    • <strong>${certs[0]}</strong><br><br>
    Elle lui donne une base sur les menaces, les attaques et les bonnes pratiques
    de cybersécurité.
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
    .map(
      (st) => `• <strong>${st.titre}</strong> (${st.annee}) – ${st.contexte}`
    )
    .join("<br>");
  return `
    Sabir a réalisé plusieurs stages entre 2022 et 2025 :<br><br>
    ${list}<br><br>
    Ça lui donne un profil très concret et polyvalent.
  `;
}

function answerStageById(id) {
  const st = SABIR_PROFILE.stages.find((s) => s.id === id);
  if (!st) return answerStagesGlobal();
  return `
    <strong>${st.titre}</strong> (${st.annee}) – ${st.contexte}<br><br>
    ${st.details}
  `;
}

function answerProjets() {
  const p = SABIR_PROFILE.projets;
  return `
    Projets principaux de Sabir :<br><br>
    • <strong>${p[0].titre}</strong><br>
      ${p[0].description}<br>
      Objectif : ${p[0].objectif}<br><br>
    • <strong>${p[1].titre}</strong><br>
      ${p[1].description}<br>
      Objectif : ${p[1].objectif}
  `;
}

function answerOrientation() {
  const e = SABIR_PROFILE.etudes;
  return `
    <strong>Trajectoire de Sabir :</strong><br><br>
    • Aujourd’hui : ${e.actuel}<br>
    • Demain : ${e.objectifCourtTerme}<br>
    • Possibilités : ${e.autresPistes.join(", ")}<br><br>
    Il vise des métiers dans l’IT (réseaux, systèmes, cyber, dev) avec des
    expériences concrètes (stages, alternance).
  `;
}

function answerCv() {
  const c = SABIR_PROFILE.contact;
  return `
    Ce site est son <strong>portfolio</strong> 📂.<br>
    Pour un CV PDF classique, Sabir peut l’envoyer directement par email :<br>
    • <a href="mailto:${c.email}">${c.email}</a><br><br>
    L’idée :<br>
    • CV PDF pour les candidatures<br>
    • Portfolio pour une vision plus complète et moderne.
  `;
}

function answerQualites() {
  const s = SABIR_PROFILE.competences.softSkills;
  return `
    Quelques qualités de Sabir :<br>
    • ${s.join("<br>• ")}<br><br>
    Profil sérieux, motivé, à l’aise avec le concret et le travail en équipe.
  `;
}

function answerHobbies() {
  const h = SABIR_PROFILE.centresInteret;
  return `
    Centres d’intérêt de Sabir 🎮⚽ :<br>
    • ${h.join("<br>• ")}<br>
  `;
}

function answerQui() {
  const p = SABIR_PROFILE.identite;
  return `
    Je suis <strong>SabirGPT</strong> 🤖, l’IA intégrée au portfolio de ${p.nomComplet}.<br><br>
    Mon rôle :<br>
    • répondre aux questions sur son <strong>parcours</strong><br>
    • expliquer son <strong>Bac Pro CIEL</strong>, ses <strong>stages</strong> et ses <strong>projets</strong><br>
    • t’aider à comprendre où il veut aller (BTS, IT, cyber, réseaux, dev).<br><br>
    Je fonctionne en JavaScript avec une base de connaissances sur Sabir, je ne
    suis pas une IA géante comme ChatGPT dans le cloud.
  `;
}

function answerMdp() {
  return `
    Côté <strong>mots de passe</strong> (ce que Sabir voit aussi en cyber) 🔐 :<br>
    • au moins 12 caractères<br>
    • mélange majuscules / minuscules / chiffres / symboles<br>
    • pas d’info perso (nom, date de naissance, etc.)<br>
    • un mot de passe différent pour chaque compte important<br>
    • activer la double authentification dès que possible.<br><br>
    Ce sont les bases qu’il applique aussi pour lui-même.
  `;
}

function answerSalut() {
  return `
    Hey 👋, moi c’est <strong>SabirGPT</strong>.<br>
    Je peux te parler de Sabir, de son Bac Pro CIEL, de ses stages (fibre,
    téléphones, web, bâtiment, support IT), de ses compétences, de ses projets
    et de ses objectifs (BTS SIO…).<br><br>
    Tu peux commencer par :<br>
    • « Sabir a quel âge ? »<br>
    • « Quels stages il a faits ? »<br>
    • « C’est quoi son Bac Pro CIEL ? »<br>
    • « C’est quoi son projet après le bac ? »
  `;
}

function answerResumeGlobal() {
  const p = SABIR_PROFILE.identite;
  return `
    <strong>Résumé rapide de Sabir :</strong><br><br>
    • Nom : <strong>${p.nomComplet}</strong><br>
    • Âge : <strong>${p.age} ans</strong> (né le ${p.dateNaissance})<br>
    • Ville : <strong>${p.ville}</strong><br>
    • Études : <strong>Bac Pro CIEL</strong><br>
    • Objectif : <strong>BTS SIO</strong> après le Bac<br>
    • Stages : fibre optique, réparation téléphones, dev web, support IT, bâtiment, réseau asso<br>
    • Centres d’intérêt : informatique, cyber, dev web, sport (dont le foot), business & digital.<br><br>
    Demande-moi de détailler ce que tu veux : stages, compétences, projet après le bac, etc.
  `;
}

function answerDefault(message) {
  if (messageMentionsSabir(message)) {
    return answerResumeGlobal();
  }
  return `
    Bonne question 👀.<br><br>
    Je peux répondre à toutes les questions qui concernent <strong>Sabir</strong> :<br>
    • son <strong>âge</strong>, sa <strong>ville</strong>, son <strong>parcours</strong><br>
    • son <strong>Bac Pro CIEL</strong>, son futur <strong>BTS SIO</strong><br>
    • ses <strong>stages</strong> (fibre, téléphones, web, bâtiment, support IT…)<br>
    • ses <strong>compétences</strong>, ses <strong>qualités</strong>, ses <strong>projets</strong> et ses centres d’intérêt.<br><br>
    Reformule ta question en la centrant sur Sabir (par ex. :<br>
    « Quels stages Sabir a faits ? », « C’est quoi son projet après le bac ? »).
  `;
}

function answerFollowUp(topic) {
  switch (topic) {
    case "fibre":
      return `
        Pour compléter sur la <strong>fibre optique</strong> 🧵 :<br>
        Ce stage a montré à Sabir le côté très <strong>terrain</strong> des réseaux :<br>
        • déplacements, météo, contraintes chez les clients<br>
        • importance du signal et des tests<br>
        • impact direct sur la vie des gens (internet qui marche ou pas).<br>
      `;
    case "telephones":
      return `
        En <strong>réparation de téléphones</strong>, Sabir a appris :<br>
        • la patience (petites vis, nappes fragiles)<br>
        • le respect d’un ordre précis de démontage/remontage<br>
        • l’importance des tests avant de rendre un appareil.<br>
      `;
    case "ciel":
      return `
        Pour aller plus loin sur le <strong>Bac Pro CIEL</strong> :<br>
        • beaucoup de <strong>TP</strong> (câblage, config réseau, mesures, montage)<br>
        • début de culture <strong>cyber</strong> (menaces, protections)<br>
        • lien entre <strong>électronique</strong> et informatique classique.<br>
      `;
    case "bts":
      return `
        Sur le <strong>BTS SIO</strong> :<br>
        • SISR = réseaux / systèmes, parfait pour son profil CIEL<br>
        • SLAM = développement, qu’il garde aussi en vue.<br><br>
        L’idée : BTS + alternance = progression rapide et concrète.
      `;
    case "stages":
      return `
        Globalement, ses <strong>stages</strong> lui ont permis de :<br>
        • tester plusieurs environnements (terrain, atelier, IT, chantier)<br>
        • voir ce qu’il préfère (réseaux, support, web, technique…)<br>
        • gagner en confiance, autonomie et professionnalisme.<br>
      `;
    default:
      return `
        Je peux détailler la <strong>fibre</strong>, la <strong>réparation de téléphones</strong>,
        le <strong>Bac Pro CIEL</strong>, le <strong>BTS SIO</strong> ou ses <strong>stages</strong> en général.<br>
        Dis-moi ce que tu veux que je développe 😉
      `;
  }
}

// Génération de réponse
function generateSabirBotReply(message) {
  const mode = currentMode;
  const topic = detectTopic(message);

  if (isFollowUp(message)) {
    const t = lastTopic || "stages";
    const core = answerFollowUp(t);
    return { text: wrapByMode(core, mode), topic: t };
  }

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
    case "support":
      core = answerStageById("support");
      break;
    case "fibre":
      core = answerStageById("fibre");
      break;
    case "telephones":
      core = answerStageById("telephones");
      break;
    case "batiment":
      core = answerStageById("batiment");
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
    case "qui":
      core = answerQui();
      break;
    case "mdp":
      core = answerMdp();
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

// ================== UI CHAT ==================
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
      const { text: reply, topic } = generateSabirBotReply(text);

      if (typingIndicator) {
        typingIndicator.style.display = "none";
      }

      addMessage(reply, "bot", topic || undefined);
    }, 500);

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
