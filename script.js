// --------- HELPERS ---------
const $ = (sel, scope = document) => scope.querySelector(sel);

// --------- CURSEUR CUSTOM ---------
const cursorDot = $(".cursor-dot");
const cursorRing = $(".cursor-ring");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

if (cursorDot && cursorRing) {
  document.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  document.addEventListener("mousedown", () => {
    cursorRing.classList.add("click");
  });
  document.addEventListener("mouseup", () => {
    cursorRing.classList.remove("click");
  });
}

// --------- PARTICULES FOND (simple gradient mouvant) ---------
const canvas = $("#bg-orbit");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let w, h, particles;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };

  const createParticles = () => {
    particles = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 60 + Math.random() * 140,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      alpha: 0.08 + Math.random() * 0.18,
    }));
  };

  const drawParticle = (p) => {
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    grad.addColorStop(0, `rgba(56,189,248,${p.alpha})`);
    grad.addColorStop(1, "rgba(15,23,42,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  };

  const loop = () => {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < -p.r) p.x = w + p.r;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
      if (p.y > h + p.r) p.y = -p.r;
      drawParticle(p);
    });
    requestAnimationFrame(loop);
  };

  resize();
  createParticles();
  loop();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

// --------- LION ORB 3D + REDIRECTION ---------
const lionOrb = $("#lion-orb");
const lionInner = lionOrb ? lionOrb.querySelector(".lion-inner") : null;
const enterBtn = $("#enter-portfolio");

const goToPortfolio = () => {
  window.location.href = "portfolio.html";
};

if (enterBtn) {
  enterBtn.addEventListener("click", goToPortfolio);
}

if (lionOrb && lionInner) {
  lionOrb.addEventListener("click", goToPortfolio);

  // Parallaxe 3D
  document.addEventListener("pointermove", (e) => {
    const rect = lionOrb.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = ((x - midX) / midX) * 10;
    const rotateX = ((midY - y) / midY) * 10;

    lionInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(18px)`;
  });

  lionOrb.addEventListener("pointerleave", () => {
    lionInner.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
  });
}

