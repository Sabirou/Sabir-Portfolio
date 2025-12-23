/* ============================================
   SABIR IAZZA - PORTFOLIO PREMIUM
   script-portfolio.js
   ============================================ */

(() => {
  "use strict";

  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);

  // Year
  const y = qs("#pYear");
  if (y) y.textContent = new Date().getFullYear();

  // Orb button -> index
  const orbBtn = qs("#orbBtn");
  if (orbBtn) {
    orbBtn.addEventListener("click", () => {
      document.body.style.transition = "opacity .35s ease";
      document.body.style.opacity = "0";
      setTimeout(() => (window.location.href = "index.html"), 350);
    });
  }

  // Burger menu
  const burger