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
  if (dot2) {
    dot2.style.transform = `translate(${mx}px, ${my}px)`;
  }
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

// ===== Burger menu (mobile) =====
const burger = document.getElementById("nav-burger");
const navMain = document.querySelector(".nav-main");
const navActions = document.querySelector(".nav-actions");

if (burger && navMain) {
  burger.addEventListener("click", () => {
    const opened = navMain.style.display === "flex";
    navMain.style.display = opened ? "none" : "flex";
    if (navActions) {
      navActions.style.display = opened ? "none" : "flex";
    }
  });
}

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
    return "L’objectif de Sabir est de poursuivre en BTS SIO pour aller plus loin en développement et en systèmes / réseaux, tout en gardant un lien fort avec la cybersécurité.";
  }
  if (q.includes("passion") || q.includes("intérêt") || q.includes("interet")) {
    return "Sabir aime l’informatique, la cybersécurité, les réseaux, le développement web, l’électronique… et aussi le foot et ses projets perso.";
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
    setTimeout(() => addMessage(rep, "bot"), 250);
    iaInput.value = "";
  });
}
