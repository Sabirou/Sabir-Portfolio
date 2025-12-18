(function () {
  // Safe guard pour éviter l’erreur si double-clic sur .js sous Windows
  if (typeof window === "undefined" || !window.document) return;

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return (root || document).querySelectorAll(sel); }

  // Year
  var y = qs("#pYear");
  if (y) y.textContent = String(new Date().getFullYear());

  // Orb button -> accueil
  var orb = qs("#orbBtn");
  if (orb) {
    orb.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }

  // Burger menu
  var burger = qs("#burger");
  var mMenu = qs("#mMenu");
  var closeMenu = qs("#closeMenu");

  function openMenu() {
    if (!mMenu) return;
    mMenu.classList.add("is-open");
    mMenu.setAttribute("aria-hidden", "false");
  }
  function hideMenu() {
    if (!mMenu) return;
    mMenu.classList.remove("is-open");
    mMenu.setAttribute("aria-hidden", "true");
  }

  if (burger) burger.addEventListener("click", openMenu);
  if (closeMenu) closeMenu.addEventListener("click", hideMenu);
  if (mMenu) {
    mMenu.addEventListener("click", function (e) {
      if (e.target === mMenu) hideMenu();
    });

    var mLinks = qsa(".mNav__link", mMenu);
    for (var i = 0; i < mLinks.length; i++) {
      mLinks[i].addEventListener("click", function () {
        hideMenu();
      });
    }
  }

  // Scroll progress
  var progressBar = qs("#progressBar");
  function onScroll() {
    var doc = document.documentElement;
    var st = doc.scrollTop || document.body.scrollTop;
    var h = doc.scrollHeight - doc.clientHeight;
    var pct = h > 0 ? (st / h) * 100 : 0;
    if (progressBar) progressBar.style.width = pct.toFixed(2) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal
  var reveals = qsa(".reveal");
  function revealFallback() {
    for (var i = 0; i < reveals.length; i++) reveals[i].classList.add("is-in");
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) entries[i].target.classList.add("is-in");
      }
    }, { threshold: 0.12 });

    for (var r = 0; r < reveals.length; r++) io.observe(reveals[r]);
  } else {
    revealFallback();
  }

  // Skill bars animate
  var bars = qsa(".bar");
  function fillBars() {
    for (var i = 0; i < bars.length; i++) {
      var val = parseInt(bars[i].getAttribute("data-val"), 10);
      if (isNaN(val)) val = 60;
      var fill = qs(".bar__fill", bars[i]);
      if (fill) fill.style.width = val + "%";
    }
  }
  // once a bit after load
  setTimeout(fillBars, 500);

  // Nav active (scrollspy)
  var navLinks = qsa(".nav__link");
  var sections = [];
  for (var s = 0; s < navLinks.length; s++) {
    var href = navLinks[s].getAttribute("href");
    if (href && href.indexOf("#") === 0) {
      var sec = qs(href);
      if (sec) sections.push({ id: href, el: sec, link: navLinks[s] });
    }
  }

  function updateActive() {
    if (!sections.length) return;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var best = null;

    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].el.getBoundingClientRect().top + scrollY;
      if (scrollY + 140 >= top) best = sections[i];
    }

    for (var j = 0; j < sections.length; j++) {
      sections[j].link.classList.remove("is-active");
    }
    if (best) best.link.classList.add("is-active");
  }
  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  // Background canvas particles (léger, style premium)
  var canvas = qs("#pCanvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var maxP = 56;

    function rand(min, max) { return min + Math.random() * (max - min); }

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function seed() {
      particles = [];
      var w = window.innerWidth;
      var h = window.innerHeight;
      var count = Math.min(maxP, Math.max(28, Math.floor((w * h) / 42000)));

      for (var i = 0; i < count; i++) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(1.2, 3.2),
          vx: rand(-0.16, 0.16),
          vy: rand(-0.12, 0.12),
          a: rand(0.06, 0.20),
          t: rand(0, Math.PI * 2)
        });
      }
    }

    function draw() {
      var w = window.innerWidth;
      var h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.t += 0.01;
        p.x += p.vx + Math.sin(p.t) * 0.05;
        p.y += p.vy + Math.cos(p.t) * 0.05;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(242,231,216," + p.a + ")";
        ctx.fill();
      }

      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var pa = particles[a], pb = particles[b];
          var dx = pa.x - pb.x, dy = pa.y - pb.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            var alpha = (120 - d) / 120 * 0.07;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.strokeStyle = "rgba(180,92,255," + alpha + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      window.requestAnimationFrame(draw);
    }

    window.addEventListener("resize", function () {
      resize();
      seed();
    });

    resize();
    seed();
    draw();
  }

  // SabirGPT demo (réponses utiles, pas "cv")
  var chatForm = qs("#chatForm");
  var chatInput = qs("#chatInput");
  var chatLog = qs("#chatLog");

  function addMsg(text, who) {
    if (!chatLog) return;
    var div = document.createElement("div");
    div.className = "msg " + (who === "me" ? "msg--me" : "msg--bot");
    div.textContent = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function botAnswer(q) {
    var t = (q || "").toLowerCase();

    if (t.indexOf("projet") !== -1 && (t.indexOf("réseau") !== -1 || t.indexOf("reseau") !== -1)) {
      return "3 idées rapides : 1) Mini-dashboard réseau (ping + latence + IP) en JS, 2) Lab Packet Tracer (VLAN + routage inter-VLAN) + capture, 3) Scan LAN (nmap) + rapport de sécurité (risques + corrections).";
    }
    if (t.indexOf("cv") !== -1) {
      return "Pour ton CV : mets une intro courte (2 lignes), ajoute tes certifs (Pix + Cisco), et mets 3 projets concrets avec résultats (ce que tu as fait + outils). Si tu veux, je te propose une version 10/10.";
    }
    if (t.indexOf("alternance") !== -1) {
      return "Pour l’alternance : cible 1 poste (IT support / réseau / web), prépare 1 mail court + 1 CV + 1 portfolio, et ajoute une section 'Projets' (3 preuves). Je peux te rédiger le mail.";
    }
    if (t.indexOf("bug") !== -1 || t.indexOf("404") !== -1) {
      return "Si tu vois 404 : c’est un chemin faux. Sur GitHub Pages la casse compte. Vérifie que tes liens sont comme 'script.js' et pas 'assets/js/script.js'.";
    }
    if (t.indexOf("salut") !== -1 || t.indexOf("cava") !== -1 || t.indexOf("ça va") !== -1) {
      return "Oui ça va 😄 Dis-moi ce que tu veux améliorer : design, projets, CV, ou une section cyber/réseau ?";
    }
    return "Ok. Dis-moi ton objectif (cyber / réseau / web) et je te donne une réponse structurée + actionnable (étapes + exemples).";
  }

  if (chatLog) {
    addMsg("Salut 👋 Je suis SabirGPT. Pose une question (projets, réseau, cyber, CV).", "bot");
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = (chatInput.value || "").trim();
      if (!q) return;

      addMsg(q, "me");
      chatInput.value = "";

      setTimeout(function () {
        addMsg(botAnswer(q), "bot");
      }, 250);
    });
  }
})();
