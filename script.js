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
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  ["a", "button"].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.style.width = "56px";
        ring.style.height = "56px";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "38px";
        ring.style.height = "38px";
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

    const rotX = y * -5;
    const rotY = x * 5;

    introCard.style.transform = `
      translateY(-4px)
      perspective(1000px)
      rotateX(${rotX}deg)
      rotateY(${rotY}deg)
    `;
  });

  introCard.addEventListener("mouseleave", () => {
    introCard.style.transform =
      "translateY(0) perspective(1000px) rotateX(0) rotateY(0)";
  });
}

// ===== Mascotte effet press =====
const mascotBtn = document.getElementById("enter-by-mascot");
if (mascotBtn) {
  mascotBtn.addEventListener("mousedown", () => {
    mascotBtn.classList.add("is-pressed");
  });
  ["mouseup", "mouseleave"].forEach((ev) => {
    mascotBtn.addEventListener(ev, () => mascotBtn.classList.remove("is-pressed"));
  });
}

// ===== Navigation vers portfolio (transition) =====
const enterBtn = document.getElementById("enter-portfolio");
let isNavigating = false;

function goToPortfolio() {
  if (isNavigating) return;
  isNavigating = true;
  document.body.classList.add("page-exit");
  setTimeout(() => {
    window.location.href = "portfolio.html";
  }, 320);
}

if (enterBtn) enterBtn.addEventListener("click", goToPortfolio);
if (mascotBtn) mascotBtn.addEventListener("click", goToPortfolio);
