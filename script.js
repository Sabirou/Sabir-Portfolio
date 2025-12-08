// ========== Curseur custom ==========
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

function moveCursor(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) {
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }
}

if (dot && ring) {
  window.addEventListener("mousemove", moveCursor);

  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  ["a", "button", "[data-go-portfolio]"].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.style.width = "60px";
        ring.style.height = "60px";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "40px";
        ring.style.height = "40px";
      });
    });
  });
}

// ========== Navigation vers portfolio ==========
function goToPortfolio() {
  window.location.href = "portfolio.html";
}
document.querySelectorAll("[data-go-portfolio]").forEach((el) => {
  el.addEventListener("click", goToPortfolio);
});

// ========== Fond orbes ==========
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
    r: 60 + Math.random() * 220,
    a: Math.random() * Math.PI * 2,
    s: 0.0006 + Math.random() * 0.0016,
    size: 6 + Math.random() * 16,
    hue:
      Math.random() < 0.5
        ? 260 + Math.random() * 40 // violets
        : 190 + Math.random() * 40, // bleus
    ox: (window.innerWidth * dpr) / 2,
    oy: (window.innerHeight * dpr) / 2,
  }));

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    orbs.forEach((o) => {
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

    requestAnimationFrame(render);
  }
  render();
}
