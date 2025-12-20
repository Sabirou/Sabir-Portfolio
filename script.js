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

  // ============================================
  // YEAR AUTO-UPDATE
  // ============================================
  const yearEl = qs("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // TOPBAR SCROLL EFFECT (PREMIUM)
  // ============================================
  const topbar = qs("#topbar");
  let lastScroll = 0;
  let ticking = false;

  function updateTopbar() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      topbar.classList.add("scrolled");
    } else {
      topbar.classList.remove("scrolled");
    }
    
    lastScroll = currentScroll;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateTopbar);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // ============================================
  // MASCOT BUTTON -> PORTFOLIO
  // ============================================
  const mascotBtn = qs("#mascotBtn");
  if (mascotBtn) {
    mascotBtn.addEventListener("click", () => {
      // Smooth transition effect
      document.body.style.opacity = "0";
      document.body.style.transition = "opacity 0.4s ease";
      
      setTimeout(() => {
        window.location.href = "portfolio.html";
      }, 400);
    });

    // Add ripple effect on click
    mascotBtn.addEventListener("mousedown", function(e) {
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
      `;

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  }

  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // CANVAS PARTICLES (ULTRA-PREMIUM)
  // ============================================
  const canvas = qs("#bgCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  let particles = [];
  const maxParticles = 70;
  let animationId;
  let mouseX = 0;
  let mouseY = 0;
  let isMouseMoving = false;

  // Resize canvas
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);
  }

  // Create particles
  function createParticles() {
    particles = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const area = w * h;
    const count = Math.min(
      maxParticles,
      Math.max(35, Math.floor(area / 35000))
    );

    for (let i = 0; i < count; i++) {
      particles.push({
        x: random(0, w),
        y: random(0, h),
        r: random(1.8, 4.2),
        vx: random(-0.25, 0.25),
        vy: random(-0.18, 0.18),
        alpha: random(0.12, 0.35),
        phase: random(0, Math.PI * 2),
        frequency: random(0.008, 0.025),
        hue: random(0, 360),
        hueSpeed: random(-0.3, 0.3),
        pulseSpeed: random(0.02, 0.04),
        pulsePhase: random(0, Math.PI * 2)
      });
    }
  }

  // Draw particles with advanced effects
  function drawParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    // Update and draw each particle
    particles.forEach((p, index) => {
      // Update phase and position
      p.phase += p.frequency;
      p.pulsePhase += p.pulseSpeed;
      p.hue += p.hueSpeed;
      if (p.hue > 360) p.hue = 0;
      if (p.hue < 0) p.hue = 360;

      // Mouse interaction
      if (isMouseMoving) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }
      }

      // Natural movement with sine/cosine
      p.x += p.vx + Math.sin(p.phase) * 0.12;
      p.y += p.vy + Math.cos(p.phase) * 0.12;

      // Wrap around screen
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Pulsing effect
      const pulseScale = 1 + Math.sin(p.pulsePhase) * 0.3;
      const currentRadius = p.r * pulseScale;
      const currentAlpha = p.alpha * (0.8 + Math.sin(p.pulsePhase) * 0.2);

      // Draw particle with radial gradient glow
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, currentRadius * 4
      );
      
      gradient.addColorStop(0, `rgba(242, 231, 216, ${currentAlpha})`);
      gradient.addColorStop(0.3, `rgba(242, 231, 216, ${currentAlpha * 0.6})`);
      gradient.addColorStop(0.6, `rgba(180, 92, 255, ${currentAlpha * 0.3})`);
      gradient.addColorStop(1, 'rgba(180, 92, 255, 0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core particle
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 231, 216, ${currentAlpha * 1.5})`;
      ctx.fill();

      ctx.restore();
    });

    // Draw connections with color gradient
    ctx.globalCompositeOperation = 'lighter';
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const pa = particles[i];
        const pb = particles[j];
        const dx = pa.x - pb.x;
        const dy = pa.y - pb.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 140;

        if (distance < maxDist) {
          const alpha = ((maxDist - distance) / maxDist) * 0.15;
          
          // Create gradient line
          const gradient = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
          gradient.addColorStop(0, `rgba(180, 92, 255, ${alpha})`);
          gradient.addColorStop(0.3, `rgba(47, 231, 255, ${alpha * 1.3})`);
          gradient.addColorStop(0.7, `rgba(255, 107, 157, ${alpha * 1.1})`);
          gradient.addColorStop(1, `rgba(180, 92, 255, ${alpha * 0.8})`);

          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Add glow to line
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    ctx.globalCompositeOperation = 'source-over';

    animationId = requestAnimationFrame(drawParticles);
  }

  // Mouse tracking for particle interaction
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

  // Handle resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animationId);
      resize();
      createParticles();
      drawParticles();
    }, 250);
  });

  // ============================================
  // INTERSECTION OBSERVER (REVEAL ANIMATIONS)
  // ============================================
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered animation delay
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            entry.target.classList.add("revealed");
          }, index * 50);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = qsa(".miniRow, .chip, .heroCard__title, .heroCard__sub");
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR LINKS
  // ============================================
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = qs(href);
      
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth"
        });
      }
    });
  });

  // ============================================
  // PARALLAX EFFECT ON HERO ELEMENTS
  // ============================================
  const heroCard = qs(".heroCard");
  const mascot = qs(".mascot");
  let parallaxTicking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;

    if (heroCard) {
      heroCard.style.transform = `translateY(${rate * 0.3}px)`;
    }
    
    if (mascot) {
      mascot.style.transform = `translateY(${rate * -0.2}px)`;
    }

    parallaxTicking = false;
  }

  function requestParallax() {
    if (!parallaxTicking) {
      window.requestAnimationFrame(updateParallax);
      parallaxTicking = true;
    }
  }

  window.addEventListener("scroll", requestParallax, { passive: true });

  // ============================================
  // CURSOR GLOW EFFECT (PREMIUM)
  // ============================================
  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  cursorGlow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(180,92,255,0.15), transparent 70%);
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: screen;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(cursorGlow);

  let cursorX = 0;
  let cursorY = 0;
  let glowX = 0;
  let glowY = 0;

  window.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorGlow.style.opacity = "1";
  });

  window.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });

  function animateCursorGlow() {
    glowX += (cursorX - glowX) * 0.15;
    glowY += (cursorY - glowY) * 0.15;

    cursorGlow.style.left = glowX + "px";
    cursorGlow.style.top = glowY + "px";

    requestAnimationFrame(animateCursorGlow);
  }

  animateCursorGlow();

  // ============================================
  // BUTTON RIPPLE EFFECT
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

  // ============================================
  // PAGE LOAD ANIMATION
  // ============================================
  window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.6s ease";
    
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  });

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================
  initCanvas();

  // Add performance monitoring
  if (window.performance && window.performance.now) {
    const loadTime = window.performance.now();
    console.log(`✨ Portfolio loaded in ${loadTime.toFixed(2)}ms`);
  }

  console.log("🚀 Sabir IAZZA Portfolio - Premium Edition");
  console.log("💎 Tous les effets sont chargés et actifs!");
})();