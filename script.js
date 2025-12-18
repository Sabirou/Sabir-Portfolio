(() => {
  const btn = document.getElementById("mascotBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      // petit feedback (mobile)
      if ("vibrate" in navigator) navigator.vibrate(35);
      window.location.href = "portfolio.html";
    });
  }
})();
