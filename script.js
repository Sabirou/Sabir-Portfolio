// Sélection des éléments
const lionBtn = document.getElementById("intro-lion-btn");
const lionImg = document.getElementById("intro-lion");
const enterBtn = document.getElementById("enter-portfolio");

// Fonction pour aller vers le portfolio complet
function goToPortfolio() {
  window.location.href = "portfolio.html";
}

// Clic sur le lion ou sur le bouton -> portfolio
if (lionBtn) {
  lionBtn.addEventListener("click", goToPortfolio);
}
if (enterBtn) {
  enterBtn.addEventListener("click", goToPortfolio);
}

// Parallaxe légère sur le lion
const lionOrbit = document.querySelector(".lion-orbit");

if (lionOrbit) {
  document.addEventListener("mousemove", (e) => {
    const rect = lionOrbit.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;

    const rotateX = y * 10 * -1;
    const rotateY = x * 10;

    lionOrbit.style.transform = `
      translateY(-2px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.02)
    `;
  });

  document.addEventListener("mouseleave", () => {
    lionOrbit.style.transform = "translateY(0) rotateX(0deg) rotateY(0deg) scale(1)";
  });
}
