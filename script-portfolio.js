// ========== Curseur custom ==========
const dot2 = document.querySelector(".cursor-dot");
const ring2 = document.querySelector(".cursor-ring");

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let rx = mx;
let ry = my;

function moveCursor2(e) {
  mx = e.clientX;
  my = e.clientY;
  if (dot2) {
    dot2.style.transform = `translate(${mx}px, ${my}px)`;
  }
}

if (dot2 && ring2) {
  window.addEventListener("mousemove", moveCursor2);

  function animateRing2() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring2.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animateRing2);
  }
  animateRing2();

  ["a", "button", ".card"].forEach((sel) => {
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

// ========== Retour à l'accueil ==========
const brandLink = document.querySelector("[data-go-home]");
if (brandLink) {
  brandLink.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// ========== Fond orbes ==========
const canvas2 = document.getElementById("bg-orbit");
if (canvas2) {
  const ctx = canvas2.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  function resizeCanvas2() {
    canvas2.width = window.innerWidth * dpr;
    canvas2.height = window.innerHeight * dpr;
  }
  resizeCanvas2();
  window.addEventListener("resize", resizeCanvas2);

  const orbs2 = Array.from({ length: 34 }).map(() => ({
    r: 70 + Math.random() * 230,
    a: Math.random() * Math.PI * 2,
    s: 0.0007 + Math.random() * 0.0018,
    size: 6 + Math.random() * 16,
    hue:
      Math.random() < 0.5
        ? 260 + Math.random() * 40 // violets
        : 190 + Math.random() * 40, // bleus
    ox: (window.innerWidth * dpr) / 2,
    oy: (window.innerHeight * dpr) / 2,
  }));

  function render2() {
    ctx.clearRect(0, 0, canvas2.width, canvas2.height);
    orbs2.forEach((o) => {
      o.a += o.s;
      const x = o.ox + Math.cos(o.a) * o.r * dpr;
      const y = o.oy + Math.sin(o.a) * o.r * dpr;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, o.size * dpr);
      grad.addColorStop(0, `hsla(${o.hue}, 90%, 70%, 0.82)`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, o.size * dpr, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render2);
  }
  render2();
}

// ========== Nav active au scroll ==========
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
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
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

// ========== SabirGPT – IA simple ==========
const sabirForm = document.getElementById("sabirgpt-form");
const sabirInput = document.getElementById("sabirgpt-input");
const sabirChat = document.getElementById("sabirgpt-chat");

function addMsg(text, from = "bot") {
  if (!sabirChat) return;
  const div = document.createElement("div");
  div.className = `msg ${from === "bot" ? "msg-bot" : "msg-user"}`;
  div.textContent = text;
  sabirChat.appendChild(div);
  sabirChat.scrollTop = sabirChat.scrollHeight;
}

function answerSabir(qRaw) {
  const q = qRaw.toLowerCase();

  if (q.includes("âge") || q.includes("age")) {
    return "Sabir est né en janvier 2008, il a 17 ans.";
  }
  if (q.includes("bac pro") || q.includes("ciel")) {
    return "Sabir est en Terminale Bac Pro CIEL à Toulon, une filière orientée cybersécurité, réseaux, informatique et électronique.";
  }
  if (q.includes("stage") && (q.includes("fibre") || q.includes("telecom"))) {
    return "En stage fibre optique, Sabir a aidé à la préparation du matériel, au raccordement des clients, à la sécurité sur le terrain et aux tests de connexion.";
  }
  if (q.includes("stage") && (q.includes("téléphone") || q.includes("telephone"))) {
    return "En réparation de téléphones, Sabir a diagnostiqué des pannes, changé des écrans et des batteries et testé les appareils après intervention.";
  }
  if (q.includes("objectif") || q.includes("après") || q.includes("apres")) {
    return "L’objectif de Sabir est de poursuivre en BTS SIO pour aller plus loin en développement et en systèmes / réseaux, tout en restant proche de la cybersécurité.";
  }
  if (q.includes("passion") || q.includes("intérêt") || q.includes("interet")) {
    return "Sabir aime l’informatique, la cybersécurité, les réseaux, le développement web, l’électronique… et aussi le foot et des projets perso.";
  }

  return "Je n’ai pas cette info précise, mais en résumé : Sabir est un étudiant en Bac Pro CIEL motivé, qui construit son profil entre cybersécurité, réseaux, web et projets concrets, avec comme suite logique le BTS SIO.";
}

if (sabirForm && sabirInput) {
  sabirForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = sabirInput.value.trim();
    if (!q) return;
    addMsg(q, "user");
    const rep = answerSabir(q);
    setTimeout(() => addMsg(rep, "bot"), 300);
    sabirInput.value = "";
  });
}
