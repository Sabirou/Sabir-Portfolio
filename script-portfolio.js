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

  ["a", "button"].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring2.style.width = "56px";
        ring2.style.height = "56px";
      });
      el.addEventListener("mouseleave", () => {
        ring2.style.width = "38px";
        ring2.style.height = "38px";
      });
    });
  });
}

// ===== Scroll animations =====
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
    { threshold: 0.2 }
  );

  toReveal.forEach((el) => obs.observe(el));
}

// ===== Canvas background (orbits) =====
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

  const orbs = Array.from({ length: 24 }).map(() => ({
    r: 60 + Math.random() * 180,
    a: Math.random() * Math.PI * 2,
    s: 0.0006 + Math.random() * 0.0014,
    size: 8 + Math.random() * 14,
    hue: 215 + Math.random() * 40,
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
      grad.addColorStop(0, `hsla(${o.hue}, 90%, 72%, 0.85)`);
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

// ===== Navigation active =====
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

// ===== Menu mobile =====
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

// ===== SabirGPT =====
const iaForm = document.getElementById("ia-form");
const iaInput = document.getElementById("ia-input");
const iaChat = document.getElementById("ia-chat");

const sabirProfile = {
  name: "Sabir IAZZA",
  age: 17,
  birth: "janvier 2008",
  city: "Saint-Maximin (83)",
  formation:
    "Terminale Bac Pro CIEL à Toulon (cybersécurité, informatique, réseaux, électronique)",
  objectif:
    "BTS SIO (développement & systèmes / réseaux) après le Bac Pro CIEL",
  stages: [
    "Stage en fibre optique (raccordement, préparation matériel, sécurité, tests de connexion)",
    "Stage en réparation de téléphones (diagnostic, changement d’écrans et batteries, tests, contact client)",
    "Stages dans le bâtiment et découverte terrain",
  ],
  interests: [
    "informatique",
    "cybersécurité",
    "réseaux",
    "développement web",
    "électronique",
    "foot",
    "projets persos",
  ],
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
  const court =
    q.includes("bref") || q.includes("rapide") || q.includes("rapidement");

  if (q.includes("âge") || q.includes("age") || q.includes("ans")) {
    return court
      ? "Sabir a 17 ans."
      : `Sabir est né en ${sabirProfile.birth}, il a ${sabirProfile.age} ans.`;
  }

  if (q.includes("où") && (q.includes("habite") || q.includes("ville"))) {
    return `Sabir habite à ${sabirProfile.city}.`;
  }

  if (q.includes("bac pro") || q.includes("ciel") || q.includes("formation")) {
    return court
      ? "Sabir est en Terminale Bac Pro CIEL à Toulon."
      : `Sabir est en ${sabirProfile.formation}. Il travaille sur la cybersécurité, les réseaux, l’informatique et l’électronique.`;
  }

  if (q.includes("stage") && q.includes("fibre")) {
    return sabirProfile.stages[0];
  }

  if (q.includes("stage") && (q.includes("téléphone") || q.includes("telephone"))) {
    return sabirProfile.stages[1];
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
    q.includes("orientation")
  ) {
    return court ? "Son objectif : BTS SIO." : sabirProfile.objectif;
  }

  if (
    q.includes("passion") ||
    q.includes("intérêt") ||
    q.includes("interet") ||
    q.includes("aime")
  ) {
    return `Sabir aime ${sabirProfile.interests.join(", ")}.`;
  }

  if (
    q.includes("compétence") ||
    q.includes("competence") ||
    q.includes("sait faire")
  ) {
    return `Côté compétences, Sabir touche à :\n- Cybersécurité (bases, hygiène numérique)\n- Réseaux & systèmes (adressage IP, VLAN, routage simple)\n- Développement web (HTML / CSS / un peu de JavaScript)\n- Électronique (montage, diagnostic de pannes simples).`;
  }

  if (
    q.includes("présente") ||
    q.includes("presentation") ||
    q.includes("présentation")
  ) {
    return `Sabir est un étudiant en Terminale Bac Pro CIEL à Toulon. Il construit son profil entre cybersécurité, réseaux, développement web et électronique, avec comme objectif d’intégrer un BTS SIO après le Bac.`;
  }

  return `En résumé, Sabir est un étudiant en Bac Pro CIEL motivé, qui construit son profil entre cybersécurité, réseaux, web et projets concrets, avec comme suite logique le BTS SIO.`;
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
      if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
      addMessage(rep, "bot");
    }, 400);

    iaInput.value = "";
  });
}

// ===== Bulle IA draggable =====
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

  if (iaToggle && iaBody) {
    iaToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const hidden = iaBody.style.display === "none";
      iaBody.style.display = hidden ? "block" : "none";
      iaToggle.textContent = hidden ? "–" : "+";
    });
  }
}
