// ===== Curseur custom =====
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

function move(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) {
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }
}

if (dot && ring) {
  window.addEventListener("mousemove", move);

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

// ===== Navigation vers le portfolio =====
const enterBtn = document.getElementById("enter-portfolio");
const mascotBtn = document.getElementById("enter-by-mascot");

function goToPortfolio() {
  window.location.href = "portfolio.html";
}

if (enterBtn) enterBtn.addEventListener("click", goToPortfolio);
if (mascotBtn) mascotBtn.addEventListener("click", goToPortfolio);

// ===== Parallax léger sur la carte =====
const introCard = document.querySelector(".intro-card");

if (introCard && window.matchMedia("(pointer: fine)").matches) {
  introCard.addEventListener("mousemove", (e) => {
    const rect = introCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    introCard.style.transform = `translateY(-2px) perspective(900px) rotateX(${
      y * -4
    }deg) rotateY(${x * 4}deg)`;
  });

  introCard.addEventListener("mouseleave", () => {
    introCard.style.transform =
      "translateY(0) perspective(900px) rotateX(0) rotateY(0)";
  });
}
