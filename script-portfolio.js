// ===== Curseur custom (même principe que landing) =====
const dot2 = document.querySelector(".cursor-dot");
const ring2 = document.querySelector(".cursor-ring");

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let rx = mx;
let ry = my;

function moveCursor(e) {
  mx = e.clientX;
  my = e.clientY;
  dot2.style.transform = `translate(${mx}px, ${my}px)`;
}

if (dot2 && ring2) {
  window.addEventListener("mousemove", moveCursor);

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
      threshold: 0.2
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

  const orbs = Array.from({ length: 30 }).map((_, i) => ({
    r: 40 + Math.random() * 180,
    a: Math.random() * Math.PI * 2,
    s: 0.0006 + Math.random() * 0.0014,
    size: 6 + Math.random() * 16,
    hue: 200 + Math.random() * 80,
    ox: (window.innerWidth * dpr) / 2,
    oy: (window.innerHeight * dpr) / 2
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
    const top = section.offsetTop - 120;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) =>
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
      );
    }
  });
});

// ===== IA simple (SabirGPT) =====
const iaForm = document.getElementById("ia-form");
const iaInput = document.getElementById("ia-input");
const iaChat = document.getElementById("ia-chat");

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

function answerSabir(question) {
  const q = question.toLowerCase();

  if (q.includes("âge") || q.includes("age")) {
    return "Sabir est né en janvier 2008, il a 17 ans.";
  }
  if (q.includes("bac pro") || q.includes("ciel")) {
    return "Sabir est en Terminale Bac Pro CIEL à Toulon, une filière orientée cybersécurité, réseaux, informatique et électronique.";
  }
  if (q.includes("stage") && q.includes("fibre")) {
    return "En stage fibre optique, Sabir a aidé à la préparation du matériel, au raccordement des clients, à la sécurité sur le terrain et aux tests de connexion.";
  }
  if (q.includes("stage") && (q.includes("téléphone") || q.includes("telephone"))) {
    return "En réparation de téléphones, Sabir a diagnostiqué des pannes, changé des écrans et batteries et testé les appareils après intervention.";
  }
  if (q.includes("objectif") || q.includes("après") || q.includes("apres")) {
    return "L’objectif de Sabir est de poursuivre en BTS SIO pour aller plus loin en développement et en systèmes / réseaux, tout en restant connecté à la cybersécurité.";
  }
  if (q.includes("passion") || q.includes("intérêt") || q.includes("interet")) {
    return "Sabir aime l’informatique, la cybersécurité, les réseaux, le développement web, l’électronique… et aussi le foot et quelques projets perso.";
  }

  return "Je n’ai pas cette info précise, mais en résumé : Sabir est un étudiant en Bac Pro CIEL motivé, qui construit son profil entre cybersécurité, réseaux, web et projets concrets, avec comme suite logique le BTS SIO.";
}

if (iaForm && iaInput) {
  iaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = iaInput.value.trim();
    if (!q) return;
    addMessage(q, "user");
    const rep = answerSabir(q);
    setTimeout(() => addMessage(rep, "bot"), 300);
    iaInput.value = "";
  });
}

// ===== Thème sombre / clair =====
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);

    if (next === "light") {
      if (themeLabel) themeLabel.textContent = "Clair";
      if (themeIcon) themeIcon.textContent = "☀️";
    } else {
      if (themeLabel) themeLabel.textContent = "Sombre";
      if (themeIcon) themeIcon.textContent = "🌙";
    }
  });
}

// ===== Bulle IA draggable =====
const iaBubble = document.getElementById("ia-bubble");
const iaToggle = document.getElementById("ia-toggle");
const iaBody = document.getElementById("ia-body");

if (iaBubble) {
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
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    iaBubble.style.left = `${clientX - offsetX}px`;
    iaBubble.style.top = `${clientY - offsetY}px`;
    iaBubble.style.right = "auto";
    iaBubble.style.bottom = "auto";
  }

  function endDrag() {
    isDragging = false;
    iaBubble.style.cursor = "grab";
  }

  iaBubble.addEventListener("mousedown", startDrag);
  iaBubble.addEventListener("touchstart", startDrag, { passive: true });
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
