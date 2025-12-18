(function () {
  const mascotBtn = document.getElementById("mascotBtn");
  const transition = document.getElementById("transition");
  const clock = document.getElementById("clock");

  function updateClock() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    clock.textContent = `${h}:${m}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  function goPortfolio() {
    if (transition) transition.classList.add("on");
    if ("vibrate" in navigator) navigator.vibrate(25);

    setTimeout(() => {
      window.location.href = "portfolio.html";
    }, 420);
  }

  if (mascotBtn) mascotBtn.addEventListener("click", goPortfolio);

  // Keyboard shortcut
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") goPortfolio();
  });
})();
