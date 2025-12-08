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

if (dot2 && ring2 && !matchMedia("(hover: none) and (pointer: coarse)").matches) {
  window.addEventListener("mousemove", moveCursor);

  function animateRing() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
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
    { threshold: 0.18 }
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

  const orbs = Array.from({ length: 30 }).map(() => ({
    r: 40 + Math.random() * 200,
    a: Math.random() * Math.PI * 2,
    s: 0.0007 + Math.random() * 0.0014,
    size: 6 + Math.random() * 16,
    hue: 250 + Math.random() * 40,
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
      grad.addColorStop(0, `hsla(${o.hue}, 90%, 70%, 0.8)`);
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

// ===== Navigation active (scroll) =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const top = section.offsetTop - 150;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) =>
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
      );
    }
  });
});

// ===== Burger menu =====
const burger = document.querySelector(".nav-burger");
const navMain = document.querySelector(".nav-main");

if (burger && navMain) {
  burger.addEventListener("click", () => {
    navMain.style.display = navMain.style.display === "flex" ? "none" : "flex";
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 960) {
        navMain.style.display = "none";
      }
    });
  });
}

// ===== IA simple (SabirGPT) =====
const iaForm = document.getElementById("ia-form");
const iaInput = document.getElementById("ia-input");
const iaChat = document.getElementById("ia-chat");

function addMessage(text, from = "bot") {
  if (!iaChat) return;
  const div = document.createElement("div");
  div.className = `ia-message ${from === "bot" ? "ia-message-bot" : "ia-message-user"}`;
  div.textContent = text;
  iaChat.appendChild(div);
  iaChat.scrollTop = iaChat.scrollHeight;
}

function answerSabir(question) {
  const q = question.toLowerCase();

  if (q.includes("âge") || q.includes("age") || q.includes("ans")) {
    return "Sabir est né en janvier 2008, il a 17 ans.";
  }
  if (q.includes("bac pro") || q.includes("ciel")) {
    return "Sabir est en Terminale Bac Pro CIEL à Toulon : cybersécurité, réseaux, informatique et électronique.";
  }
  if (q.includes("stage") && q.includes("fibre")) {
    return "En stage fibre optique, Sabir a préparé le matériel, aidé au raccordement, suivi la sécurité sur le terrain et effectué des tests de connexion.";
  }
  if (q.includes("stage") && (q.includes("téléphone") || q.includes("telephone") || q.includes("smartphone"))) {
    return "En réparation de téléphones, Sabir a diagnostiqué les pannes, changé des écrans et batteries et testé les appareils après intervention.";
  }
  if (q.includes("objectif") || q.includes("après") || q.includes("apres") || q.includes("après le bac")) {
    return "L’objectif de Sabir est de poursuivre en BTS SIO pour aller plus loin en développement et en systèmes / réseaux, toujours lié à la cybersécurité.";
  }
  if (q.includes("passion") || q.includes("intérêt") || q.includes("interet") || q.includes("aime")) {
    return "Sabir aime l’informatique, la cybersécurité, les réseaux, le développement web, l’électronique… et aussi le foot et les projets perso concrets.";
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
    setTimeout(() => addMessage(rep, "bot"), 260);
    iaInput.value = "";
  });
}
