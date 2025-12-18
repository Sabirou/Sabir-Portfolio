/* assets/js/script.js (INDEX) */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }

  function setYear() {
    var y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  // Canvas particles (safe + léger)
  function startParticles(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext("2d");
    var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    var W = 0, H = 0;

    var particles = [];
    var linksDist = 130;

    function resize() {
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
    }

    function rand(min, max) { return min + Math.random() * (max - min); }

    function makeParticles() {
      particles = [];
      var area = window.innerWidth * window.innerHeight;
      var count = Math.floor(Math.min(95, Math.max(35, area / 26000)));

      for (var i = 0; i < count; i++) {
        particles.push({
          x: rand(0, W),
          y: rand(0, H),
          r: rand(0.8, 2.2),
          vx: rand(-0.25, 0.25),
          vy: rand(-0.20, 0.20),
          a: rand(0.10, 0.40)
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);

      // Points
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lines
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var pa = particles[a], pb = particles[b];
          var dx = pa.x - pb.x, dy = pa.y - pb.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linksDist) {
            ctx.globalAlpha = (linksDist - dist) / linksDist * 0.12;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.strokeStyle = "rgba(255,255,255,1)";

    resize();
    step();

    window.addEventListener("resize", function () {
      resize();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setYear();
    startParticles("bgCanvas");

    // Mascotte vibration mobile (safe)
    var m = $("#mascotLink");
    if (m) {
      m.addEventListener("click", function () {
        if ("vibrate" in navigator) navigator.vibrate(25);
      });
    }
  });
})();
