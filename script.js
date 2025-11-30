// =======================
// Utilitaires simples
// =======================
function $(selector, scope = document) {
  return scope.querySelector(selector);
}

// =======================
// Année dynamique footer
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = $("#year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// =======================
// Lion 3D interactif
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const lionWrap = $("#lion-wrap");
  const lionImg = $("#intro-lion");
  const cta = $("#enter-portfolio");

  if (!lionWrap || !lionImg) return;

  const maxTilt = 16; // degrés max
  const damp = 0.08; // amortissement pour animation douce

  let currentRX = 0;
  let currentRY = 0;
  let targetRX = 0;
  let targetRY = 0;
  let hovering = false;

  // boucle animation lissée
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
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    targetRY = x * maxTilt; // gauche/droite
    targetRX = -y * maxTilt; // haut/bas (inverse)

    if (!hovering) {
      hovering = true;
      lionWrap.classList.add("is-active");
      animate();
    }
  });

  lionWrap.addEventListener("mouseleave", () => {
    // retour à 0
    targetRX = 0;
    targetRY = 0;

    setTimeout(() => {
      hovering = false;
      lionWrap.classList.remove("is-active");
      lionWrap.style.removeProperty("--rx");
      lionWrap.style.removeProperty("--ry");
    }, 200);
  });

  // clic sur le lion = clic sur le bouton "Entrer dans mon portfolio"
  lionWrap.addEventListener("click", () => {
    if (cta) {
      cta.click();
    }
  });

  // accessibilité clavier : Entrée/Espace quand focus
  lionWrap.setAttribute("tabindex", "0");
  lionWrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (cta) cta.click();
    }
  });
});
