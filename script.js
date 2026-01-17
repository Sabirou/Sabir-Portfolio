/* ============================================
   SABIR IAZZA - SCRIPT LANDING PAGE
   script.js
   ============================================ */

(() => {
  "use strict";

  // ==================== UTILITIES ====================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const random = (min, max) => Math.random() * (max - min) + min;

  // Device detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==================== YEAR ====================
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==================== LOADER ====================
  const loader = $('#loader');
  
  const hideLoader = () => {
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 1200);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 1500));
  }
  
  // Fallback
  setTimeout(hideLoader, 4000);

  // ==================== STARS BACKGROUND ====================
  const bgStars = $('#bgStars');
  
  if (bgStars && !prefersReducedMotion) {
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.cssText = `
        left: ${random(0, 100)}%;
        top: ${random(0, 100)}%;
        animation-delay: ${random(0, 3)}s;
        opacity: ${random(0.2, 0.6)};
      `;
      bgStars.appendChild(star);
    }
  }

  // ==================== NAVBAR ====================
  const navbar = $('#navbar');
  const navToggle = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  
  // Scroll effect
  let lastScrollY = 0;
  let ticking = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 50);
    }
    
    lastScrollY = scrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close on link click
    $$('.mobile-link', mobileMenu).forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Smooth scroll
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = $(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar?.offsetHeight || 80;
        const targetPos = target.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPos,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // ==================== ORB OBSERVATEUR ====================
  const orbEye = $('#orbEye');
  const orbSpeech = $('#orbSpeech');
  const orbWatcher = $('#orbWatcher');

  if (orbEye && isDesktop && !prefersReducedMotion) {
    let lastMessageTime = 0;
    const messages = [
      "👁️ Je t'observe...",
      "🔍 Intéressant...",
      "💡 Besoin d'aide ?",
      "✨ Joli scroll !",
      "🎯 Continue !",
      "🚀 Explore le portfolio !"
    ];

    // Eye tracking
    document.addEventListener('mousemove', (e) => {
      const orbRect = orbWatcher.getBoundingClientRect();
      const orbCenterX = orbRect.left + orbRect.width / 2;
      const orbCenterY = orbRect.top + orbRect.height / 2;

      const dx = e.clientX - orbCenterX;
      const dy = e.clientY - orbCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxOffset = 8;
      const eyeX = Math.min(Math.max((dx / Math.max(distance, 100)) * maxOffset, -maxOffset), maxOffset);
      const eyeY = Math.min(Math.max((dy / Math.max(distance, 100)) * maxOffset, -maxOffset), maxOffset);

      orbEye.style.transform = `translate(calc(-50% + ${eyeX}px), calc(-50% + ${eyeY}px))`;
    }, { passive: true });

    // Random messages
    const showMessage = (msg) => {
      if (orbSpeech) {
        orbSpeech.textContent = msg;
        orbSpeech.classList.add('visible');
        setTimeout(() => orbSpeech.classList.remove('visible'), 3000);
      }
    };

    setInterval(() => {
      const now = Date.now();
      if (now - lastMessageTime > 12000 && Math.random() < 0.3) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        showMessage(msg);
        lastMessageTime = now;
      }
    }, 3000);

    // Initial message
    setTimeout(() => {
      showMessage("👁️ Je t'observe...");
      lastMessageTime = Date.now();
    }, 2500);
  } else if (orbWatcher && (isMobile || !isDesktop)) {
    orbWatcher.style.display = 'none';
  }

  // ==================== HERO ORB INTERACTION ====================
  const heroOrb = $('#heroOrb');
  
  if (heroOrb && isDesktop) {
    heroOrb.addEventListener('mouseenter', () => {
      heroOrb.style.animationPlayState = 'paused';
    });

    heroOrb.addEventListener('mouseleave', () => {
      heroOrb.style.animationPlayState = 'running';
    });
  }

  // ==================== CONSOLE BRANDING ====================
  console.log(
    '%c🚀 Sabir IAZZA - Portfolio',
    'color: #6366f1; font-size: 20px; font-weight: bold;'
  );
  console.log(
    '%c✨ Bienvenue sur mon portfolio !',
    'color: #22d3ee; font-size: 14px;'
  );

})();