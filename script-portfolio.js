/* ============================================
   SABIR IAZZA - PORTFOLIO PREMIUM EDITION
   script-portfolio.js Ultra-Premium
   ============================================ */

(function() {
  'use strict';
  
  // Safe guard
  if (typeof window === "undefined" || !window.document) return;

  // ============================================
  // UTILITIES
  // ============================================
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => root.querySelectorAll(sel);
  const random = (min, max) => min + Math.random() * (max - min);
  
  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ============================================
  // YEAR AUTO-UPDATE
  // ============================================
  const yearEl = qs("#pYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // ORB BUTTON -> ACCUEIL
  // ============================================
  const orbBtn = qs("#orbBtn");
  if (orbBtn) {
    orbBtn.addEventListener("click", () => {
      document.body.style.opacity = "0";
      document.body.style.transition = "opacity 0.4s ease";
      
      setTimeout(() => {
        window.location.href = "index.html";
      }, 400);
    });

    // Ripple effect
    orbBtn.addEventListener("mousedown", function(e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        z-index: 10;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  // ============================================
  // BURGER MENU (MOBILE)
  // ============================================
  const burger = qs("#burger");
  const mMenu = qs("#mMenu");
  const closeMenu = qs("#closeMenu");

  function openMenu() {
    if (!mMenu) return;
    mMenu.classList.add("is-open");
    mMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function hideMenu() {
    if (!mMenu) return;
    mMenu.classList.remove("is-open");
    mMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (burger) burger.addEventListener("click", openMenu);
  if (closeMenu) closeMenu.addEventListener("click", hideMenu);

  if (mMenu) {
    // Click outside to close
    mMenu.addEventListener("click", (e) => {
      if (e.target === mMenu) hideMenu();
    });

    // Close on link click
    qsa(".mNav__link", mMenu).forEach(link => {
      link.addEventListener("click", hideMenu);
    });

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mMenu.classList.contains("is-open")) {
        hideMenu();
      }
    });
  }

  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  const progressBar = qs("#progressBar");
  let progressTicking = false;

  function updateProgress() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrollPercent.toFixed(2) + "%";
    }
    
    progressTicking = false;
  }

  function requestProgress() {
    if (!progressTicking) {
      window.requestAnimationFrame(updateProgress);
      progressTicking = true;
    }
  }

  window.addEventListener("scroll", requestProgress, { passive: true });
  updateProgress();

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = qs("#header");
  let headerTicking = false;

  function updateHeader() {
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 50) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
    
    headerTicking = false;
  }

  function requestHeader() {
    if (!headerTicking) {
      window.requestAnimationFrame(updateHeader);
      headerTicking = true;
    }
  }

  window.addEventListener("scroll", requestHeader, { passive: true });
  updateHeader();

  // ============================================
  // REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ============================================
  const reveals = qsa(".reveal");

  if ("IntersectionObserver" in window && reveals.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add("is-in"));
  }

  // ============================================
  // SKILL BARS ANIMATION
  // ============================================
  const bars = qsa(".bar");
  
  function animateBars() {
    bars.forEach(bar => {
      const val = parseInt(bar.getAttribute("data-val"), 10) || 60;
      const fill = qs(".bar__fill", bar);
      
      if (fill) {
        setTimeout(() => {
          fill.style.width = val + "%";
        }, 100);
      }
    });
  }

  if (bars.length > 0) {
    if ("IntersectionObserver" in window) {
      const barsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateBars();
              barsObserver.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );

      bars.forEach(bar => barsObserver.observe(bar));
    } else {
      setTimeout(animateBars, 500);
    }
  }

  // ============================================
  // NAVIGATION SCROLLSPY (ACTIVE LINKS)
  // ============================================
  const navLinks = qsa(".nav__link");
  const sections = [];

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      const section = qs(href);
      if (section) {
        sections.push({ id: href, el: section, link });
      }
    }
  });

  let scrollspyTicking = false;

  function updateActiveNav() {
    if (sections.length === 0) return;
    
    const scrollY = window.pageYOffset;
    let currentSection = null;

    sections.forEach(section => {
      const rect = section.el.getBoundingClientRect();
      const top = rect.top + scrollY;
      
      if (scrollY + 150 >= top) {
        currentSection = section;
      }
    });

    sections.forEach(section => {
      section.link.classList.remove("is-active");
    });

    if (currentSection) {
      currentSection.link.classList.add("is-active");
    }
    
    scrollspyTicking = false;
  }

  function requestScrollspy() {
    if (!scrollspyTicking) {
      window.requestAnimationFrame(updateActiveNav);
      scrollspyTicking = true;
    }
  }

  window.addEventListener("scroll", requestScrollspy, { passive: true });
  updateActiveNav();

  // ============================================
  // CANVAS PARTICLES (ULTRA-PREMIUM)
  // ============================================
  const canvas = qs("#pCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  let particles = [];
  const maxParticles = 65;
  let animationId;
  let mouseX = 0;
  let mouseY = 0;
  let isMouseMoving = false;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    particles = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const area = w * h;
    const count = Math.min(
      maxParticles,
      Math.max(32, Math.floor(area / 37000))
    );

    for (let i = 0; i < count; i++) {
      particles.push({
        x: random(0, w),
        y: random(0, h),
        r: random(1.6, 4.0),
        vx: random(-0.22, 0.22),
        vy: random(-0.16, 0.16),
        alpha: random(0.10, 0.32),
        phase: random(0, Math.PI * 2),
        frequency: random(0.008, 0.022),
        hue: random(0, 60),
        pulseSpeed: random(0.015, 0.035),
        pulsePhase: random(0, Math.PI * 2)
      });
    }
  }

  function drawParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    // Update and draw particles
    particles.forEach((p) => {
      p.phase += p.frequency;
      p.pulsePhase += p.pulseSpeed;

      // Mouse interaction
      if (isMouseMoving) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 160) {
          const force = (160 - dist) / 160;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }
      }

      // Natural movement
      p.x += p.vx + Math.sin(p.phase) * 0.10;
      p.y += p.vy + Math.cos(p.phase) * 0.10;

      // Wrap around
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Pulsing
      const pulseScale = 1 + Math.sin(p.pulsePhase) * 0.25;
      const currentRadius = p.r * pulseScale;
      const currentAlpha = p.alpha * (0.85 + Math.sin(p.pulsePhase) * 0.15);

      // Draw with glow
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, currentRadius * 3.5
      );
      
      gradient.addColorStop(0, `rgba(242, 231, 216, ${currentAlpha})`);
      gradient.addColorStop(0.4, `rgba(242, 231, 216, ${currentAlpha * 0.5})`);
      gradient.addColorStop(0.7, `rgba(180, 92, 255, ${currentAlpha * 0.25})`);
      gradient.addColorStop(1, 'rgba(180, 92, 255, 0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 231, 216, ${currentAlpha * 1.4})`;
      ctx.fill();

      ctx.restore();
    });

    // Connections
    ctx.globalCompositeOperation = 'lighter';
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const pa = particles[i];
        const pb = particles[j];
        const dx = pa.x - pb.x;
        const dy = pa.y - pb.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 135;

        if (distance < maxDist) {
          const alpha = ((maxDist - distance) / maxDist) * 0.14;
          
          const gradient = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
          gradient.addColorStop(0, `rgba(180, 92, 255, ${alpha})`);
          gradient.addColorStop(0.35, `rgba(47, 231, 255, ${alpha * 1.25})`);
          gradient.addColorStop(0.65, `rgba(255, 107, 157, ${alpha * 1.1})`);
          gradient.addColorStop(1, `rgba(180, 92, 255, ${alpha * 0.85})`);

          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    animationId = requestAnimationFrame(drawParticles);
  }

  // Mouse tracking
  let mouseMoveTimeout;
  
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;

    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      isMouseMoving = false;
    }, 100);
  }, { passive: true });

  // Initialize canvas
  function initCanvas() {
    resize();
    createParticles();
    drawParticles();
  }

  // Handle resize with debounce
  const handleResize = debounce(() => {
    cancelAnimationFrame(animationId);
    resize();
    createParticles();
    drawParticles();
  }, 250);

  window.addEventListener("resize", handleResize);

  // ============================================
  // SABIRGPT - MINI CHAT DEMO
  // ============================================
  const chatForm = qs("#chatForm");
  const chatInput = qs("#chatInput");
  const chatLog = qs("#chatLog");

  function addMessage(text, sender) {
    if (!chatLog) return;
    
    const msg = document.createElement("div");
    msg.className = `msg msg--${sender}`;
    msg.textContent = text;
    msg.style.opacity = "0";
    msg.style.transform = "translateY(10px)";
    
    chatLog.appendChild(msg);
    
    // Animate in
    requestAnimationFrame(() => {
      msg.style.transition = "all 0.3s ease";
      msg.style.opacity = "1";
      msg.style.transform = "translateY(0)";
    });
    
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function getBotResponse(query) {
    const q = (query || "").toLowerCase().trim();

    // Réponses intelligentes
    if (q.includes("projet") && (q.includes("réseau") || q.includes("reseau"))) {
      return "💡 3 idées concrètes :\n\n1️⃣ Dashboard monitoring réseau (ping, latence, graph temps réel)\n2️⃣ Lab Packet Tracer avec VLAN + routage + firewall\n3️⃣ Script Python de scan réseau (nmap) avec rapport HTML";
    }

    if (q.includes("cv")) {
      return "📄 Conseils CV :\n\n✅ Intro percutante (2 lignes max)\n✅ Section 'Projets' avec résultats mesurables\n✅ Certifications (Pix, Cisco)\n✅ Compétences techniques en haut\n✅ Format 1 page, sobre et moderne";
    }

    if (q.includes("alternance") || q.includes("stage")) {
      return "🎯 Stratégie alternance :\n\n1. Cible 5-10 entreprises (IT/réseaux)\n2. Email perso + CV + portfolio\n3. Relance après 1 semaine\n4. Prépare 3 questions techniques\n5. Mets en avant tes projets concrets";
    }

    if (q.includes("compétence") || q.includes("skill")) {
      return "🔧 Focus 2025 :\n\n🔹 Réseau : VLAN, routage, sécurité\n🔹 Cyber : Wireshark, firewall, pentest basics\n🔹 Web : React, API REST, déploiement\n🔹 Linux : terminal, scripts bash, Docker";
    }

    if (q.includes("bts") || q.includes("sio")) {
      return "🎓 BTS SIO :\n\n📌 Option SISR (réseau/cyber) recommandée\n📌 Alternance = expérience + salaire\n📌 Prépare ton dossier dès maintenant\n📌 Renforce tes bases réseaux/cyber";
    }

    if (q.includes("portfolio") || q.includes("site")) {
      return "🌐 Ton portfolio :\n\n✨ Design premium validé\n✨ Ajoute tes certifications\n✨ Documente 3-5 projets avec screenshots\n✨ Ajoute un CV téléchargeable\n✨ Optimise pour mobile";
    }

    if (q.includes("cisco") || q.includes("certif")) {
      return "📜 Certifications utiles :\n\n🏆 Cisco CCNA (très valorisé)\n🏆 CompTIA Security+\n🏆 Pix (obligatoire)\n🏆 Linux Essentials\n🏆 Google IT Support";
    }

    if (q.includes("salut") || q.includes("bonjour") || q.includes("hello")) {
      return "👋 Salut ! Je suis SabirGPT, ton assistant perso.\n\nPose-moi des questions sur :\n• Projets réseau/cyber\n• CV et candidatures\n• Compétences à développer\n• Alternance/stage";
    }

    if (q.includes("help") || q.includes("aide")) {
      return "❓ Je peux t'aider sur :\n\n💼 Carrière (CV, alternance, stage)\n🛠️ Projets (idées, conseils techniques)\n🎓 Formation (BTS, certifications)\n💻 Compétences (réseau, cyber, web)\n\nPose ta question !";
    }

    // Réponse par défaut
    return "🤔 Question intéressante !\n\nPrécise un peu plus :\n• Quel domaine ? (réseau, cyber, web)\n• Quel objectif ? (projet, formation, carrière)\n• Quel niveau de détail ?\n\nJe te donnerai une réponse structurée et actionnable ! 💪";
  }

  // Initial bot message
  if (chatLog) {
    addMessage("👋 Salut ! Je suis SabirGPT.\n\nPose-moi tes questions sur projets, CV, alternance ou compétences !", "bot");
  }

  // Handle chat form
  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const query = chatInput.value.trim();
      if (!query) return;

      // Add user message
      addMessage(query, "me");
      chatInput.value = "";

      // Simulate thinking delay
      setTimeout(() => {
        const response = getBotResponse(query);
        addMessage(response, "bot");
      }, 400);
    });

    // Auto-resize input
    chatInput.addEventListener("input", function() {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href === "#" || !href) return;

      e.preventDefault();
      const target = qs(href);
      
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth"
        });

        // Close mobile menu if open
        if (mMenu?.classList.contains("is-open")) {
          hideMenu();
        }
      }
    });
  });

  // ============================================
  // BUTTON RIPPLE EFFECTS
  // ============================================
  qsa(".btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        z-index: 1;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation
  if (!qs("#ripple-style")) {
    const style = document.createElement("style");
    style.id = "ripple-style";
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================
  // PARALLAX EFFECT ON SCROLL
  // ============================================
  const parallaxElements = qsa("[data-parallax]");
  let parallaxTicking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    parallaxTicking = false;
  }

  function requestParallax() {
    if (!parallaxTicking) {
      window.requestAnimationFrame(updateParallax);
      parallaxTicking = true;
    }
  }

  if (parallaxElements.length > 0) {
    window.addEventListener("scroll", requestParallax, { passive: true });
  }

  // ============================================
  // PAGE LOAD ANIMATION
  // ============================================
  window.addEventListener("load", () => {
    document.body.style.opacity = "1";
    
    // Log performance
    if (window.performance) {
      const loadTime = performance.now();
      console.log(`✨ Portfolio chargé en ${loadTime.toFixed(2)}ms`);
    }
  });

  // Set initial opacity
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.6s ease";

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================
  initCanvas();

  console.log("🚀 Sabir IAZZA - Portfolio Premium Edition");
  console.log("💎 Tous les systèmes sont opérationnels !");
  console.log("⚡ Canvas: OK | Animations: OK | SabirGPT: OK");

})();