/* ============================================
   SABIR IAZZA - AWARD-WINNING EDITION
   script.js - JavaScript principal
   ============================================ */

(() => {
  "use strict";

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  
  // Check if device supports hover (desktop)
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ============================================
  // YEAR UPDATE
  // ============================================
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================
  // CUSTOM CURSOR (Desktop only)
  // ============================================
  if (isDesktop) {
    const cursor = $('.cursor');
    const cursorGlow = $('.cursor-glow');
    
    if (cursor && cursorGlow) {
      let mouseX = 0, mouseY = 0;
      let cursorX = 0, cursorY = 0;
      let glowX = 0, glowY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }, { passive: true });

      function animateCursor() {
        // Smooth interpolation
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;

        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      // Hover effect on interactive elements
      const interactiveElements = $$('a, button, .chip, .tile, .brand, [role="button"]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    }
  }

  // ============================================
  // TOPBAR SCROLL EFFECT
  // ============================================
  const topbar = $('#topbar');
  if (topbar) {
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      lastScroll = window.scrollY;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          topbar.classList.toggle('scrolled', lastScroll > 50);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // GLASS CARD MOUSE TRACKING
  // ============================================
  const glassCard = $('#glassCard');
  if (glassCard && isDesktop) {
    glassCard.addEventListener('mousemove', (e) => {
      const rect = glassCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glassCard.style.setProperty('--mouse-x', `${x}%`);
      glassCard.style.setProperty('--mouse-y', `${y}%`);
    }, { passive: true });
  }

  // ============================================
  // MAGNETIC BUTTONS (Desktop only)
  // ============================================
  if (isDesktop) {
    $$('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ============================================
  // BACKGROUND PARTICLES
  // ============================================
  const bgCanvas = $('#bgCanvas');
  if (bgCanvas) {
    const bgCtx = bgCanvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeBgCanvas() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      const count = Math.min(50, Math.floor((bgCanvas.width * bgCanvas.height) / 30000));
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * bgCanvas.width,
          y: Math.random() * bgCanvas.height,
          r: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: Math.random() * 0.3 + 0.1
        });
      }
    }

    function drawParticles() {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around edges
        if (p.x < 0) p.x = bgCanvas.width;
        if (p.x > bgCanvas.width) p.x = 0;
        if (p.y < 0) p.y = bgCanvas.height;
        if (p.y > bgCanvas.height) p.y = 0;
        
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(180, 92, 255, ${p.alpha})`;
        bgCtx.fill();
      });
      
      animationId = requestAnimationFrame(drawParticles);
    }

    resizeBgCanvas();
    initParticles();
    drawParticles();

    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeBgCanvas();
        initParticles();
      }, 250);
    }, { passive: true });

    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        drawParticles();
      }
    });
  }

  // ============================================
  // THREE.JS 3D ORB
  // ============================================
  const threeCanvas = $('#three-canvas');
  
  if (threeCanvas && typeof THREE !== 'undefined') {
    const container = threeCanvas.parentElement;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      container.offsetWidth / container.offsetHeight, 
      0.1, 
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: threeCanvas, 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Main orb
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xB45CFF,
      emissive: 0x2FE7FF,
      emissiveIntensity: 0.5,
      shininess: 100,
      wireframe: false
    });
    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    // Wireframe overlay
    const wireframeGeo = new THREE.IcosahedronGeometry(1.52, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x2FE7FF,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeo, wireframeMat);
    scene.add(wireframe);

    // Particles around orb
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 800;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x2FE7FF,
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // Lights
    const light1 = new THREE.PointLight(0xB45CFF, 2, 100);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x2FE7FF, 2, 100);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Mouse interaction
    let targetX = 0;
    let targetY = 0;

    threeCanvas.addEventListener('mousemove', (e) => {
      const rect = threeCanvas.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }, { passive: true });

    // Touch support
    threeCanvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = threeCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        targetX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        targetY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      }
    }, { passive: true });

    // Animation
    let threeAnimationId;
    
    function animate() {
      threeAnimationId = requestAnimationFrame(animate);
      
      // Smooth rotation
      orb.rotation.y += (targetX * 0.5 - orb.rotation.y) * 0.05;
      orb.rotation.x += (targetY * 0.5 - orb.rotation.x) * 0.05;
      orb.rotation.z += 0.002;
      
      wireframe.rotation.y = orb.rotation.y;
      wireframe.rotation.x = orb.rotation.x;
      wireframe.rotation.z = -orb.rotation.z;
      
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0003;
      
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    let threeResizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(threeResizeTimeout);
      threeResizeTimeout = setTimeout(() => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 250);
    }, { passive: true });

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(threeAnimationId);
      } else {
        animate();
      }
    });
  }

  // ============================================
  // CONSOLE MESSAGE
  // ============================================
  console.log('%c🚀 Sabir IAZZA - Award-Winning Portfolio', 
    'color: #B45CFF; font-size: 16px; font-weight: bold;');
  console.log('%cDéveloppé avec passion ✨', 
    'color: #2FE7FF; font-size: 12px;');

})();