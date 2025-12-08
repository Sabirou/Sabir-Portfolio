// Curseur + canvas réutilisés
const dotP = document.querySelector(".cursor-dot");
const ringP = document.querySelector(".cursor-ring");

let pmx = window.innerWidth / 2;
let pmy = window.innerHeight / 2;
let prx = pmx;
let pry = pmy;

function moveCursorP(e) {
  pmx = e.clientX;
  pmy = e.clientY;
  if (dotP) {
    dotP.style.transform = `translate(${pmx}px, ${pmy}px)`;
  }
}

if (dotP && ringP && !matchMedia("(hover: none) and (pointer: coarse)").matches) {
  window.addEventListener("mousemove", moveCursorP);

  function animateRingP() {
    prx += (pmx - prx) * 0.16;
    pry += (pmy - pry) * 0.16;
    ringP.style.transform = `translate(${prx}px, ${pry}px)`;
    requestAnimationFrame(animateRingP);
  }
  animateRingP();
}

// Canvas léger
const canvasP = document.getElementById("bg-orbit");
if (canvasP) {
  const ctx = canvasP.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  function resizeCanvasP() {
    canvasP.width = window.innerWidth * dpr;
    canvasP.height = window.innerHeight * dpr;
  }
  resizeCanvasP();
  window.addEventListener("resize", resizeCanvasP);

  const orbsP = Array.from({ length: 20 }).map(() => ({
    r: 40 + Math.random() * 180,
    a: Math.random() * Math.PI * 2,
    s: 0.0008 + Math.random() * 0.0013,
    size: 8 + Math.random() * 16,
    hue: 250 + Math.random() * 40,
    ox: (window.innerWidth * dpr) / 2,
    oy: (window.innerHeight * dpr) / 2
  }));

  function renderP() {
    ctx.clearRect(0, 0, canvasP.width, canvasP.height);
    orbsP.forEach((o) => {
      o.a += o.s;
      const x = o.ox + Math.cos(o.a) * o.r * dpr;
      const y = o.oy + Math.sin(o.a) * o.r * dpr;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, o.size * dpr);
      grad.addColorStop(0, `hsla(${o.hue}, 90%, 70%, 0.85)`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, o.size * dpr, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(renderP);
  }

  renderP();
}

// Reveal simple
const toRevealP = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const obsP = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obsP.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  toRevealP.forEach((el) => obsP.observe(el));
}
