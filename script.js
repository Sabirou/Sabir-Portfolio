(function () {
  // Safe guard (évite erreur si quelqu’un double-clique le .js sous Windows Script Host)
  if (typeof window === "undefined" || !window.document) return;

  function qs(sel) { return document.querySelector(sel); }

  // Year
  var y = qs("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mascot click -> portfolio
  var mascotBtn = qs("#mascotBtn");
  if (mascotBtn) {
    mascotBtn.addEventListener("click", function () {
      window.location.href = "portfolio.html";
    });
  }

  // Canvas background particles (léger + fluide)
  var canvas = qs("#bgCanvas");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var W = 0, H = 0;
  var particles = [];
  var maxP = 48;

  function resize() {
    W = canvas.width = Math.floor(window.innerWidth * (window.devicePixelRatio || 1));
    H = canvas.height = Math.floor(window.innerHeight * (window.devicePixelRatio || 1));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // scale down for drawing coords in CSS pixels
    ctx.scale((window.devicePixelRatio || 1), (window.devicePixelRatio || 1));
  }

  function rand(min, max) { return min + Math.random() * (max - min); }

  function createParticles() {
    particles = [];
    var w = window.innerWidth;
    var h = window.innerHeight;

    var count = Math.min(maxP, Math.max(26, Math.floor((w * h) / 42000)));
    for (var i = 0; i < count; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(1.2, 3.2),
        vx: rand(-0.18, 0.18),
        vy: rand(-0.14, 0.14),
        a: rand(0.08, 0.22)
      });
    }
  }

  function step() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    // draw
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
      ctx.fillStyle = "rgba(242,231,216," + p.a + ")";
      ctx.fill();
    }

    // subtle links
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var pa = particles[a], pb = particles[b];
        var dx = pa.x - pb.x, dy = pa.y - pb.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          var alpha = (110 - d) / 110 * 0.08;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = "rgba(47,231,255," + alpha + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    window.requestAnimationFrame(step);
  }

  function init() {
    resize();
    createParticles();
    step();
  }

  window.addEventListener("resize", function () {
    resize();
    createParticles();
  });

  init();
})();
