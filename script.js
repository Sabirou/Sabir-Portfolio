// ===== Curseur custom =====
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (dot) {
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }
}

if (dot && ring) {
  window.addEventListener("mousemove", handleMouseMove, { passive: true });

  function animateRing() {
    // interpolation lissée
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // agrandir le ring sur éléments interactifs
  const interactiveSelectors = ["a", "button"];
  interactiveSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.style.width = "64px";
        ring.style.height = "64px";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "42px";
        ring.style.height = "42px";
      });
    });
  });
}

// ===== Tilt 3D léger sur la carte =====
const introCard = document.querySelector(".intro-card[data-tilt]");
if (introCard && window.matchMedia("(pointer: fine)").matches) {
  introCard.addEventListener("mousemove", (e) => {
    const rect = introCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = y * -6;
    const rotY = x * 6;

    introCard.style.transform = `
      translateY(-4px)
      perspective(1000px)
      rotateX(${rotX}deg)
      rotateY(${rotY}deg)
    `;
  });

  introCard.addEventListener("mouseleave", () => {
    introCard.style.transform = "translateY(0) perspective(1000px) rotateX(0) rotateY(0)";
  });
}

// ===== Mascotte : effet press / “pulse” =====
const mascotBtn = document.getElementById("enter-by-mascot");
if (mascotBtn) {
  mascotBtn.addEventListener("mousedown", () => {
    mascotBtn.classList.add("is-pressed");
  });
  ["mouseup", "mouseleave"].forEach((ev) => {
    mascotBtn.addEventListener(ev, () => mascotBtn.classList.remove("is-pressed"));
  });
}

// ===== Navigation vers le portfolio avec transition =====
const enterBtn = document.getElementById("enter-portfolio");

let isNavigating = false;

function goToPortfolio() {
  if (isNavigating) return;
  isNavigating = true;

  // Transition de sortie
  document.body.classList.add("page-exit");

  // Redirection légère après l’anim
  setTimeout(() => {
    // NOTE: si ton fichier a un autre nom, change "portfolio.html" ici
    window.location.href = "portfolio.html";
  }, 350);
}

if (enterBtn) enterBtn.addEventListener("click", goToPortfolio);
if (mascotBtn) mascotBtn.addEventListener("click", goToPortfolio);
