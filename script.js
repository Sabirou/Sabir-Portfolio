/* ============================================
   SABIR IAZZA - AWARD-WINNING EDITION
   script.js - JavaScript principal
   ============================================ */

(() => {
  "use strict";

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================
  // CUSTOM CURSOR
  // ============================================
  const cursor = document.querySelector('.cursor');
  const cursorGlow = document.querySelector('.cursor-glow');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    if (cursor) {
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
    }

    if (cursorGlow) {
      cursorGlow.style.left = (glowX - 150) + 'px';
      cursorGlow.style.top = (glowY - 150) + 'px';
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect
  document.querySelectorAll('a, button, .chip, .tile, .brand').forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
  });

  // ============================================
  // TOPBAR SCROLL
  // ============================================
  const topbar = document.getElementById('topbar');
  window.addEventListener('scroll', () => {
    if (topbar) {
      topbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  }, { passive: true });

  // ============================================
  // GLASS CARD MOUSE TRACKING
  // ============================================
  const glassCard = document.getElementById('glassCard');
  if (glassCard) {
    glassCard.addEventListener('mousemove', (e) => {
      const rect = glassCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glassCard.style.setProperty('--mouse-x', x + '%');
      glassCard.style.setProperty('--mouse-y', y + '%');
    });
  }

  // ============================================
  // MAGNETIC BUTTONS
  // ============================================
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ============================================
  // BACKGROUND PARTICLES
  // ============================================
  const bgCanvas = document.getElementById('bgCanvas');
  if (!bgCanvas) return;

  const bgCtx = bgCanvas.getContext('2d');
  
  function resizeBg() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  resizeBg();

  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      r: Math.random() * 2 + 1,
      vx: Math.random() * 0.5 - 0.25,
      vy: Math.random() * 0.5 - 0.25,
      alpha: Math.random() * 0.3 + 0.1
    });
  }

  function drawBg() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;
      
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(180, 92, 255, ${p.alpha})`;
      bgCtx.fill();
    });
    
    requestAnimationFrame(drawBg);
  }
  drawBg();

  window.addEventListener('resize', () => {
    resizeBg();
  });

  // ============================================
  // THREE.JS 3D ORB
  // ============================================
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
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
  const particlesCount = 1000;
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

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  // Animation
  function animate() {
    requestAnimationFrame(animate);
    
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

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  });

  console.log('🚀 Sabir IAZZA - Award-Winning Portfolio loaded!');
})();