/* ============================================
   SABIR IAZZA - INDEX SCRIPT
   ============================================ */

"use strict";

(() => {
  // ==================== UTILITIES ====================
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const rand = (min, max) => Math.random() * (max - min) + min;

  // Set year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==================== LOADING SCREEN ====================
  window.addEventListener('load', () => {
    setTimeout(() => {
      $('#loader').classList.add('hidden');
    }, 2200);
  });

  // ==================== NAVBAR SCROLL ====================
  const navbar = $('#navbar');
  
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ==================== PARTICLE BACKGROUND ====================
  const particleCanvas = $('#particleCanvas');
  
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animId;

    function resize() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }

    function init() {
      particles = [];
      const count = Math.min(80, Math.floor((particleCanvas.width * particleCanvas.height) / 18000));
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: rand(0, particleCanvas.width),
          y: rand(0, particleCanvas.height),
          vx: rand(-0.4, 0.4),
          vy: rand(-0.4, 0.4),
          size: rand(1, 2.5),
          alpha: rand(0.2, 0.6),
          color: Math.random() > 0.5 ? '#6366f1' : '#22d3ee'
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = particleCanvas.width;
        if (p.x > particleCanvas.width) p.x = 0;
        if (p.y < 0) p.y = particleCanvas.height;
        if (p.y > particleCanvas.height) p.y = 0;

        // Mouse interaction
        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            p.x -= dx * force * 0.02;
            p.y -= dy * force * 0.02;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 100) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resize();
    init();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        init();
      }, 250);
    }, { passive: true });

    // Pause when hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });
  }

  // ==================== MASCOTTE OBSERVATEUR ====================
  const mascotCanvas = $('#mascotCanvas');
  const mascotSpeech = $('#mascotSpeech');

  if (mascotCanvas) {
    const ctx = mascotCanvas.getContext('2d');
    const width = 120;
    const height = 120;
    const centerX = width / 2;
    const centerY = height / 2;
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let eyeTargetX = 0;
    let eyeTargetY = 0;
    let eyeX = 0;
    let eyeY = 0;
    let blinkTimer = 0;
    let isBlinking = false;
    let bobOffset = 0;
    let lastMessageTime = 0;

    const messages = [
      "👀 Je te surveille...",
      "🔍 Intéressant...",
      "🤔 Tu cherches quoi ?",
      "💡 Clique pour entrer !",
      "🎯 Explore le portfolio !",
      "✨ Design de ouf non ?",
      "🚀 Vas-y, clique !",
      "🧠 Je note tout..."
    ];

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function updateEyes() {
      const mascotRect = mascotCanvas.getBoundingClientRect();
      const mascotCenterX = mascotRect.left + mascotRect.width / 2;
      const mascotCenterY = mascotRect.top + mascotRect.height / 2;

      const dx = mouseX - mascotCenterX;
      const dy = mouseY - mascotCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const maxOffset = 6;
      eyeTargetX = (dx / Math.max(distance, 100)) * maxOffset;
      eyeTargetY = (dy / Math.max(distance, 100)) * maxOffset;

      eyeX += (eyeTargetX - eyeX) * 0.15;
      eyeY += (eyeTargetY - eyeY) * 0.15;
    }

    function drawMascot() {
      ctx.clearRect(0, 0, width, height);

      const bob = Math.sin(bobOffset) * 3;
      const cy = centerY + bob;

      // Body gradient
      const gradient = ctx.createRadialGradient(centerX, cy, 0, centerX, cy, 40);
      gradient.addColorStop(0, '#818cf8');
      gradient.addColorStop(0.6, '#6366f1');
      gradient.addColorStop(1, '#4f46e5');

      ctx.beginPath();
      ctx.arc(centerX, cy, 35, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Glow ring
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Eyes
      if (!isBlinking) {
        // Left eye
        ctx.beginPath();
        ctx.arc(centerX - 12 + eyeX, cy - 5 + eyeY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX - 10 + eyeX * 1.5, cy - 5 + eyeY * 1.5, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1b4b';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX - 8 + eyeX, cy - 7 + eyeY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Right eye
        ctx.beginPath();
        ctx.arc(centerX + 12 + eyeX, cy - 5 + eyeY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 14 + eyeX * 1.5, cy - 5 + eyeY * 1.5, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1b4b';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 16 + eyeX, cy - 7 + eyeY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      } else {
        // Closed eyes
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX - 18, cy - 5);
        ctx.lineTo(centerX - 6, cy - 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 6, cy - 5);
        ctx.lineTo(centerX + 18, cy - 5);
        ctx.stroke();
      }

      // Mouth
      ctx.beginPath();
      ctx.arc(centerX, cy + 8, 8, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Antennae
      const antennaWave = Math.sin(bobOffset * 2) * 3;
      
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      
      // Left antenna
      ctx.beginPath();
      ctx.moveTo(centerX - 20, cy - 28);
      ctx.quadraticCurveTo(centerX - 28 + antennaWave, cy - 42, centerX - 22, cy - 50);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX - 22, cy - 50, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f472b6';
      ctx.fill();

      // Right antenna
      ctx.beginPath();
      ctx.moveTo(centerX + 20, cy - 28);
      ctx.quadraticCurveTo(centerX + 28 - antennaWave, cy - 42, centerX + 22, cy - 50);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX + 22, cy - 50, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f472b6';
      ctx.fill();
    }

    function animateMascot() {
      bobOffset += 0.03;
      
      // Blinking
      blinkTimer++;
      if (blinkTimer > 180 && Math.random() < 0.02) {
        isBlinking = true;
        setTimeout(() => { isBlinking = false; }, 120);
        blinkTimer = 0;
      }

      // Random messages
      const now = Date.now();
      if (now - lastMessageTime > 8000 && Math.random() < 0.015) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        mascotSpeech.textContent = msg;
        mascotSpeech.classList.add('visible');
        setTimeout(() => {
          mascotSpeech.classList.remove('visible');
        }, 3000);
        lastMessageTime = now;
      }

      updateEyes();
      drawMascot();
      requestAnimationFrame(animateMascot);
    }

    animateMascot();

    // Initial message
    setTimeout(() => {
      mascotSpeech.classList.add('visible');
      setTimeout(() => {
        mascotSpeech.classList.remove('visible');
      }, 3000);
    }, 3000);
  }

  // ==================== VISUAL CARD CLICK ====================
  const visualCard = $('.visual-card');
  if (visualCard) {
    visualCard.addEventListener('click', () => {
      window.location.href = 'portfolio.html';
    });
  }

  // ==================== CONSOLE ====================
  console.log('%c🚀 Sabir IAZZA Portfolio', 'color: #6366f1; font-size: 24px; font-weight: bold;');
  console.log('%c✨ Bienvenue !', 'color: #22d3ee; font-size: 14px;');

})();