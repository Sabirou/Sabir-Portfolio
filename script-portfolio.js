/* assets/js/script-portfolio.js (PORTFOLIO) */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function setYear() {
    var y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  // Canvas particles (même moteur que index)
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

    window.addEventListener("resize", function () { resize(); });
  }

  function setupProgress() {
    var progress = $(".scroll-progress");
    if (!progress) return;

    function update() {
      var doc = document.documentElement;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      var p = (doc.scrollTop / max) * 100;
      progress.style.width = clamp(p, 0, 100) + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function setupNavActive() {
    var links = $all(".nav-link[href^='#']");
    if (!links.length) return;

    var sections = links
      .map(function (a) { return $(a.getAttribute("href")); })
      .filter(Boolean);

    function setActive() {
      var pos = window.scrollY + 140;
      var current = sections[0];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= pos) current = sections[i];
      }
      links.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
      });
    }

    window.addEventListener("scroll", setActive, { passive: true });
    setActive();
  }

  function setupBurger() {
    var burger = $("#burger");
    var menu = $("#mobileMenu");
    if (!burger || !menu) return;

    function close() {
      menu.classList.remove("open");
      document.documentElement.classList.remove("no-scroll");
      menu.setAttribute("aria-hidden", "true");
    }
    function open() {
      menu.classList.add("open");
      document.documentElement.classList.add("no-scroll");
      menu.setAttribute("aria-hidden", "false");
    }

    burger.addEventListener("click", function () {
      if (menu.classList.contains("open")) close();
      else open();
    });

    menu.addEventListener("click", function (e) {
      if (e.target === menu) close();
    });

    $all(".m-link", menu).forEach(function (a) {
      a.addEventListener("click", function () { close(); });
    });
  }

  function setupSmoothAnchors() {
    $all('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href === "#") return;
        var target = $(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function setupSkillBars() {
    var bars = $all(".bar-fill");
    if (!bars.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var w = el.getAttribute("data-width") || "70";
        el.style.width = w + "%";
        io.unobserve(el);
      });
    }, { threshold: 0.25 });

    bars.forEach(function (b) { b.style.width = "0%"; io.observe(b); });
  }

  // SabirGPT (réponses utiles + fallback intelligent)
  function setupSabirGPT() {
    var form = $("#gptForm");
    var input = $("#gptInput");
    var chat = $("#gptChat");
    if (!form || !input || !chat) return;

    function add(role, text) {
      var row = document.createElement("div");
      row.className = "msg " + role;

      var bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = text;

      row.appendChild(bubble);
      chat.appendChild(row);
      chat.scrollTop = chat.scrollHeight;
    }

    function norm(s) {
      return (s || "")
        .toLowerCase()
        .replace(/[’']/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function hasAny(t, arr) {
      for (var i = 0; i < arr.length; i++) if (t.indexOf(arr[i]) !== -1) return true;
      return false;
    }

    function reply(text) {
      var t = norm(text);

      // Salut / small talk
      if (hasAny(t, ["salut", "bonjour", "yo", "coucou", "cv", "ça va", "ca va"])) {
        return "Salut 👋 Je suis SabirGPT. Tu veux parler de mes projets, de mes stages, ou de mes compétences ?";
      }

      // Contact
      if (hasAny(t, ["contact", "email", "mail", "tel", "téléphone", "telephone", "appeler"])) {
        return "Tu peux me contacter : amiamisabir@gmail.com • 07 62 97 26 26. Tu préfères email ou appel ?";
      }

      // Stages / alternance
      if (hasAny(t, ["stage", "alternance", "entreprise", "recrut", "cv"])) {
        return "Pour stage/alternance : je peux aider en support IT, réseaux (IP/VLAN bases), et web (HTML/CSS/JS). Tu veux un résumé rapide de mes stages ?";
      }

      // Réseaux
      if (hasAny(t, ["reseau", "réseau", "ip", "vlan", "switch", "routeur", "packet tracer", "ping"])) {
        return "Réseaux : IP, sous-réseaux, notions VLAN, dépannage. Dis-moi ton besoin (ex: config IP, VLAN, ping) et je te guide.";
      }

      // Cyber
      if (hasAny(t, ["cyber", "cybersécurité", "cybersecurite", "sécurité", "securite"])) {
        return "Cybersécurité : bonnes pratiques, hygiène numérique, sensibilisation et progression via projets. Tu veux que je liste mes certifs/compétences ?";
      }

      // Projets
      if (hasAny(t, ["projet", "portfolio", "site", "github", "ui", "design"])) {
        return "Mes projets : Portfolio 2025 (UI glass + responsive) et SabirGPT. Tu veux plutôt voir la partie Showcase ou mes compétences ?";
      }

      // BTS
      if (hasAny(t, ["bts", "sio", "slam", "sisr"])) {
        return "Objectif : BTS SIO (pour monter en dev / systèmes-réseaux). Tu veux que je t’explique mon objectif en 2 phrases pour une candidature ?";
      }

      // Fallback (pas “cv”)
      return "Je peux répondre sur : projets, stages, compétences, contact, BTS SIO. Dis-moi ce que tu veux et je réponds clairement.";
    }

    add("bot", "Salut 👋 Je suis SabirGPT. Pose-moi une question sur mes projets, mes stages, ou mon contact.");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = (input.value || "").trim();
      if (!val) return;
      add("user", val);
      input.value = "";
      window.setTimeout(function () { add("bot", reply(val)); }, 160);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setYear();
    startParticles("bgCanvas");
    setupProgress();
    setupNavActive();
    setupBurger();
    setupSmoothAnchors();
    setupSkillBars();
    setupSabirGPT();
  });
})();
