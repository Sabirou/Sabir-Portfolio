function $(selector, scope = document) {
  return scope.querySelector(selector);
}

// 👉 La page cible de ton vrai portfolio
const PORTFOLIO_URL = "portfolio.html";

// année footer
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = $("#year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// Lion 3D + redirection
document.addEventListener("DOMContentLoaded", () => {
  const lionWrap = $("#lion-wrap");
  const cta = $("#enter-portfolio");

  if (!lionWrap) return;

  const maxTilt = 16;
  const damp = 0.08;
  let currentRX = 0;
  let currentRY = 0;
  let targetRX = 0;
  let targetRY = 0;
  let hovering = false;

  function animate() {
    currentRX += (targetRX - currentRX) * damp;
    currentRY += (targetRY - currentRY) * damp;

    lionWrap.style.setProperty("--rx", `${currentRX.toFixed(2)}deg`);
    lionWrap.style.setProperty("--ry", `${currentRY.toFixed(2)}deg`);

    if (hovering) {
      requestAnimationFrame(animate);
    }
  }

  lionWrap.addEventListener("mousemove", (e) => {
    const rect = lionWrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    targetRY = x * maxTilt;
    targetRX = -y * maxTilt;

    if (!hovering) {
      hovering = true;
      lionWrap.classList.add("is-active");
      animate();
    }
  });

  lionWrap.addEventListener("mouseleave", () => {
    targetRX = 0;
    targetRY = 0;

    setTimeout(() => {
      hovering = false;
      lionWrap.classList.remove("is-active");
      lionWrap.style.removeProperty("--rx");
      lionWrap.style.removeProperty("--ry");
    }, 200);
  });

  lionWrap.addEventListener("click", () => {
    window.location.href = PORTFOLIO_URL;
  });

  lionWrap.setAttribute("tabindex", "0");
  lionWrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = PORTFOLIO_URL;
    }
  });

  if (cta) {
    cta.setAttribute("href", PORTFOLIO_URL);
  }
});
