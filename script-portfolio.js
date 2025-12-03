// ===== Curseur custom =====
const dot2 = document.querySelector(".cursor-dot");
const ring2 = document.querySelector(".cursor-ring");

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let rx = mx;
let ry = my;

function moveCursor(e) {
  mx = e.clientX;
  my = e.clientY;
  if (dot2) {
    dot2.style.transform = `translate(${mx}px, ${my}px)`;
  }
}

if (dot2 && ring2) {
  window.addEventListener("mousemove", moveCursor, { passive: true });

  function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring2.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // agrandir sur éléments interactifs
  ["a", "button"].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring2.style.width = "60px";
        ring2.style.height = "60px";
      });
      el.addEventListener("mouseleave", () => {
        ring2.style.width = "40px";
        ring2.style.height = "40px";
      });
    });
  });
}

// ===== Scroll animations (IntersectionObserver) =====
const toReveal = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  toReveal.forEach((el) => obs.observe(el));
}

// ===== Canvas background (simple orbits) =====
const canvas = document.getElementById("bg-orbit");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const orbs = Array.from({ length: 26 }).map(() => ({
    r: 40 + Math.random() * 180,
    a: Math.random() * Math.PI * 2,
    s: 0.0006 + Math.random() * 0.0014,
    size: 6 + Math.random() * 16,
    hue: 200 + Math.random() * 80,
    get ox() {
      return (window.innerWidth * dpr) / 2;
    },
    get oy() {
      return (window.innerHeight * dpr) / 2;
    },
  }));

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    orbs.forEach((o) => {
      o.a += o.s;
      const x = o.ox + Math.cos(o.a) * o.r * dpr;
      const y = o.oy + Math.sin(o.a) * o.r * dpr;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, o.size * dpr);
      grad.addColorStop(0, `hsla(${o.hue}, 85%, 68%, 0.85)`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, o.size * dpr, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  }
  render();
}

// ===== Navigation active (survol de section) =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) =>
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
      );
    }
  });
});

// ===== Menu mobile (burger) =====
const burger = document.getElementById("nav-burger");
const navMobile = document.getElementById("nav-mobile");

if (burger && navMobile) {
  burger.addEventListener("click", () => {
    const isOpen = navMobile.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));

    const spans = burger.querySelectorAll("span");
    if (isOpen) {
      spans[0].style.transform = "translateY(3px) rotate(45deg)";
      spans[1].style.transform = "translateY(-3px) rotate(-45deg)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.transform = "";
    }
  });

  navMobile.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMobile.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      const spans = burger.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.transform = "";
    });
  });
}

// ===== IA simple (SabirGPT) =====
const iaForm = document.getElementById("ia-form");
const iaInput = document.getElementById("ia-input");
const iaChat = document.getElementById("ia-chat");

const sabirProfile = {
  name: "Sabir IAZZA",
  age: 17,
  birth: "janvier 2008",
  city: "Saint-Maximin (83)",
  formation: "Terminale Bac Pro CIEL à Toulon (cybersécurité, informatique, réseaux, électronique)",
  objectif: "BTS SIO (développement & systèmes / réseaux) après le Bac Pro CIEL",
  stages: [
    "Stage en fibre optique (raccordement, préparation matériel, sécurité, tests de connexion)",
    "Stage en réparation de téléphones (diagnostic, changement d’écrans et batteries, tests, contact client)",
    "Stages dans le bâtiment et découverte terrain",
  ],
  interests: ["informatique", "cybersécurité", "réseaux", "développement web", "électronique", "foot", "projets persos"],
};

function addMessage(text, from = "bot") {
  if (!iaChat) return;
  const div = document.createElement("div");
  div.className = `ia-message ${
    from === "bot" ? "ia-message-bot" : "ia-message-user"
  }`;
  div.textContent = text;
  iaChat.appendChild(div);
  iaChat.scrollTop = iaChat.scrollHeight;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "ia-message ia-message-bot ia-message-typing";
  div.textContent = "SabirGPT est en train de répondre…";
  iaChat.appendChild(div);
  iaChat.scrollTop = iaChat.scrollHeight;
  return div;
}

function answerSabir(question) {
  const q = question.toLowerCase();

  const court = q.includes("bref") || q.includes("rapide") || q.includes("rapidement");

  if (q.includes("âge") || q.includes("age") || q.includes("ans")) {
    return court
      ? "Sabir a 17 ans."
      : `Sabir est né en ${sabirProfile.birth}, il a ${sabirProfile.age} ans.`;
  }

  if (q.includes("où") && (q.includes("habite") || q.includes("vie") || q.includes("ville"))) {
    return `Sabir habite à ${sabirProfile.city}.`;
  }

  if (q.includes("bac pro") || q.includes("ciel") || q.includes("formation")) {
    return court
      ? "Sabir est en Terminale Bac Pro CIEL à Toulon."
      : `Sabir est en ${sabirProfile.formation}. Il travaille sur la cybersécurité, les réseaux, l’informatique et l’électronique.`;
  }

  if (q.includes("stage") && q.includes("fibre")) {
    return `En stage fibre optique, Sabir a aidé à la préparation du matériel, au raccordement des clients, à la sécurité sur le terrain et aux tests de connexion.`;
  }

  if (q.includes("stage") && (q.includes("téléphone") || q.includes("telephone"))) {
    return `En réparation de téléphones, Sabir a diagnostiqué des pannes, changé des écrans et des batteries, puis testé les appareils avant de les rendre au client.`;
  }

  if (q.includes("stage") || q.includes("expérience") || q.includes("experience")) {
    return `Sabir a réalisé plusieurs stages :\n- ${sabirProfile.stages.join(
      "\n- "
    )}\nChaque expérience lui a permis d’être plus à l’aise sur le terrain.`;
  }

  if (
    q.includes("objectif") ||
    q.includes("après") ||
    q.includes("apres") ||
    q.includes("après le bac") ||
    q.includes("orientation")
  ) {
    return court
      ? "Son objectif : BTS SIO."
      : `L’objectif de Sabir est de poursuivre en BTS SIO pour aller plus loin en développement et en systèmes / réseaux, tout en gardant un pied dans la cybersécurité.`;
  }

  if (q.includes("passion") || q.includes("intérêt") || q.includes("interet") || q.includes("aime")) {
    return `Sabir aime l’informatique, la cybersécurité, les réseaux, le développement web, l’électronique… et aussi le foot et des projets persos.`;
  }

  if (q.includes("compétence") || q.includes("competence") || q.includes("sait faire")) {
    return `Côté compétences, Sabir touche à :\n- Cybersécurité (bases, hygiène numérique)\n- Réseaux & systèmes (adressage IP, VLAN, routage simple)\n- Développement web (HTML / CSS / un peu de JavaScript)\n- Électronique (montage, diagnostic de pannes simples).`;
  }

  if (q.includes("présente") || q.includes("presentation") || q.includes("présentation")) {
    return `Sabir est un étudiant en Terminale Bac Pro CIEL à Toulon. Il construit son profil entre cybersécurité, réseaux, développement web et électronique, avec comme objectif d’intégrer un BTS SIO après le Bac.`;
  }

  return `Je n’ai pas cette info précise, mais en résumé : Sabir est un étudiant en Bac Pro CIEL motivé, qui construit son profil entre cybersécurité, réseaux, web et projets concrets, avec comme suite logique le BTS SIO.`;
}

if (iaForm && iaInput && iaChat) {
  iaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = iaInput.value.trim();
    if (!q) return;
    addMessage(q, "user");

    const typingEl = addTyping();
    const rep = answerSabir(q);

    setTimeout(() => {
      if (typingEl && typingEl.parentNode) {
        typingEl.parentNode.removeChild(typingEl);
      }
      addMessage(rep, "bot");
    }, 400);

    iaInput.value = "";
  });
}

// ===== Thème sombre / clair (avec mémorisation) =====
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  if (theme === "light") {
    if (themeLabel) themeLabel.textContent = "Clair";
    if (themeIcon) themeIcon.textContent = "☀️";
  } else {
    if (themeLabel) themeLabel.textContent = "Sombre";
    if (themeIcon) themeIcon.textContent = "🌙";
  }
  localStorage.setItem("sabir-theme", theme);
}

// init thème
const savedTheme = localStorage.getItem("sabir-theme");
if (savedTheme === "light" || savedTheme === "dark") {
  applyTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

// ===== Bulle IA draggable (header seulement, limites écran) =====
const iaBubble = document.getElementById("ia-bubble");
const iaToggle = document.getElementById("ia-toggle");
const iaBody = document.getElementById("ia-body");
const iaHeader = document.getElementById("ia-bubble-header");

if (iaBubble && iaHeader) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function startDrag(e) {
    isDragging = true;
    iaBubble.style.cursor = "grabbing";
    const rect = iaBubble.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  }

  function onDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const bubbleWidth = iaBubble.offsetWidth;
    const bubbleHeight = iaBubble.offsetHeight;

    let nextLeft = clientX - offsetX;
    let nextTop = clientY - offsetY;

    const padding = 10;
    const maxLeft = window.innerWidth - bubbleWidth - padding;
    const maxTop = window.innerHeight - bubbleHeight - padding;

    nextLeft = Math.max(padding, Math.min(nextLeft, maxLeft));
    nextTop = Math.max(padding, Math.min(nextTop, maxTop));

    iaBubble.style.left = `${nextLeft}px`;
    iaBubble.style.top = `${nextTop}px`;
    iaBubble.style.right = "auto";
    iaBubble.style.bottom = "auto";
  }

  function endDrag() {
    isDragging = false;
    iaBubble.style.cursor = "grab";
  }

  iaHeader.addEventListener("mousedown", startDrag);
  iaHeader.addEventListener("touchstart", startDrag, { passive: true });
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("touchmove", onDrag, { passive: false });
  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchend", endDrag);

  // Minimize / expand
  if (iaToggle && iaBody) {
    iaToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const hidden = iaBody.style.display === "none";
      iaBody.style.display = hidden ? "block" : "none";
      iaToggle.textContent = hidden ? "–" : "+";
    });
  }
}
