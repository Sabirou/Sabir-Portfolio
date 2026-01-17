/* ============================================
   SABIR IAZZA - PORTFOLIO PREMIUM V2
   script-portfolio.js
   ============================================ */

(() => {
  "use strict";

  // ==================== UTILITIES ====================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const random = (min, max) => Math.random() * (max - min) + min;
  const lerp = (start, end, factor) => start + (end - start) * factor;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // Device detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==================== YEAR ====================
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==================== LOADING SCREEN ====================
  const loader = $('#loader');
  
  if (loader) {
    const hideLoader = () => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    };

    // Hide loader when page is fully loaded
    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 1500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hideLoader, 2000);
      });
    }

    // Fallback: hide after 5 seconds max
    setTimeout(hideLoader, 5000);
  }

  // ==================== NAVBAR ====================
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const navToggle = $('#navToggle');
  const sections = $$('section[id]');

  // Scroll effect
  let lastScrollY = 0;
  let ticking = false;

  const handleNavbarScroll = () => {
    const scrollY = window.scrollY;
    
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 50);
    }

    // Update active nav link
    const scrollPosition = scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    lastScrollY = scrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleNavbarScroll);
      ticking = true;
    }
  }, { passive: true });

  // Smooth scroll for anchor links
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = $(href);
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar?.offsetHeight || 80;
        const targetPosition = target.offsetTop - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Close mobile menu if open
        if (navToggle?.classList.contains('active')) {
          navToggle.classList.remove('active');
        }
      }
    });
  });

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
    });
  }

  // ==================== MASCOTTE OBSERVATEUR ====================
  const mascotCanvas = $('#mascotCanvas');
  const mascotSpeech = $('#mascotSpeech');
  const mascotWatcher = $('#mascotWatcher');

  if (mascotCanvas && isDesktop && !prefersReducedMotion) {
    const ctx = mascotCanvas.getContext('2d');
    const width = mascotCanvas.width;
    const height = mascotCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Mascot state
    const mascot = {
      eyeX: 0,
      eyeY: 0,
      targetEyeX: 0,
      targetEyeY: 0,
      bobOffset: 0,
      blinkTimer: 0,
      isBlinking: false,
      messageTimer: 0,
      lastMessageTime: 0
    };

    // Mouse position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Messages
    const messages = [
      "👀 Je te surveille...",
      "🔍 Intéressant...",
      "🤔 Tu cherches quoi ?",
      "💡 Besoin d'aide ?",
      "🎯 Continue comme ça !",
      "✨ Joli scroll !",
      "🚀 Tu explores bien !",
      "🧠 Je note tout...",
      "😎 T'es curieux toi !",
      "🔥 Ce portfolio est cool non ?",
      "💬 Parle-moi dans le chat !",
      "📧 Contacte Sabir !"
    ];

    let currentMessageIndex = 0;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Calculate eye direction
    const updateEyeDirection = () => {
      const mascotRect = mascotCanvas.getBoundingClientRect();
      const mascotCenterX = mascotRect.left + mascotRect.width / 2;
      const mascotCenterY = mascotRect.top + mascotRect.height / 2;

      const dx = mouseX - mascotCenterX;
      const dy = mouseY - mascotCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxOffset = 6;
      mascot.targetEyeX = clamp((dx / Math.max(distance, 100)) * maxOffset, -maxOffset, maxOffset);
      mascot.targetEyeY = clamp((dy / Math.max(distance, 100)) * maxOffset, -maxOffset, maxOffset);

      // Smooth interpolation
      mascot.eyeX = lerp(mascot.eyeX, mascot.targetEyeX, 0.12);
      mascot.eyeY = lerp(mascot.eyeY, mascot.targetEyeY, 0.12);
    };

    // Draw mascot
    const drawMascot = () => {
      ctx.clearRect(0, 0, width, height);

      const bob = Math.sin(mascot.bobOffset) * 3;
      const cy = centerY + bob;

      // Glow effect
      const glowGradient = ctx.createRadialGradient(centerX, cy, 30, centerX, cy, 60);
      glowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
      glowGradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(centerX, cy, 55, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Main body
      const bodyGradient = ctx.createRadialGradient(centerX, cy - 10, 0, centerX, cy, 40);
      bodyGradient.addColorStop(0, '#a5b4fc');
      bodyGradient.addColorStop(0.5, '#6366f1');
      bodyGradient.addColorStop(1, '#4338ca');

      ctx.beginPath();
      ctx.arc(centerX, cy, 35, 0, Math.PI * 2);
      ctx.fillStyle = bodyGradient;
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner ring
      ctx.beginPath();
      ctx.arc(centerX, cy, 30, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Eyes
      const eyeY = cy - 5;
      const eyeSpacing = 12;

      if (!mascot.isBlinking) {
        // Left eye white
        ctx.beginPath();
        ctx.ellipse(centerX - eyeSpacing + mascot.eyeX * 0.5, eyeY + mascot.eyeY * 0.5, 9, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Left pupil
        ctx.beginPath();
        ctx.arc(centerX - eyeSpacing + mascot.eyeX, eyeY + mascot.eyeY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1b4b';
        ctx.fill();

        // Left highlight
        ctx.beginPath();
        ctx.arc(centerX - eyeSpacing + mascot.eyeX - 2, eyeY + mascot.eyeY - 3, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Right eye white
        ctx.beginPath();
        ctx.ellipse(centerX + eyeSpacing + mascot.eyeX * 0.5, eyeY + mascot.eyeY * 0.5, 9, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Right pupil
        ctx.beginPath();
        ctx.arc(centerX + eyeSpacing + mascot.eyeX, eyeY + mascot.eyeY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1b4b';
        ctx.fill();

        // Right highlight
        ctx.beginPath();
        ctx.arc(centerX + eyeSpacing + mascot.eyeX - 2, eyeY + mascot.eyeY - 3, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      } else {
        // Closed eyes (happy expression)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.arc(centerX - eyeSpacing, eyeY, 6, 0.8 * Math.PI, 0.2 * Math.PI, true);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX + eyeSpacing, eyeY, 6, 0.8 * Math.PI, 0.2 * Math.PI, true);
        ctx.stroke();
      }

      // Mouth
      ctx.beginPath();
      ctx.arc(centerX, cy + 10, 10, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Antennae
      const antennaWave1 = Math.sin(mascot.bobOffset * 1.5) * 4;
      const antennaWave2 = Math.sin(mascot.bobOffset * 1.5 + 0.5) * 4;

      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';

      // Left antenna
      ctx.beginPath();
      ctx.moveTo(centerX - 18, cy - 30);
      ctx.quadraticCurveTo(centerX - 28 + antennaWave1, cy - 48, centerX - 20, cy - 55);
      ctx.stroke();

      // Left antenna ball
      const ballGradient1 = ctx.createRadialGradient(centerX - 20, cy - 55, 0, centerX - 20, cy - 55, 5);
      ballGradient1.addColorStop(0, '#f9a8d4');
      ballGradient1.addColorStop(1, '#ec4899');
      ctx.beginPath();
      ctx.arc(centerX - 20, cy - 55, 5, 0, Math.PI * 2);
      ctx.fillStyle = ballGradient1;
      ctx.fill();

      // Right antenna
      ctx.beginPath();
      ctx.moveTo(centerX + 18, cy - 30);
      ctx.quadraticCurveTo(centerX + 28 + antennaWave2, cy - 48, centerX + 20, cy - 55);
      ctx.stroke();

      // Right antenna ball
      const ballGradient2 = ctx.createRadialGradient(centerX + 20, cy - 55, 0, centerX + 20, cy - 55, 5);
      ballGradient2.addColorStop(0, '#f9a8d4');
      ballGradient2.addColorStop(1, '#ec4899');
      ctx.beginPath();
      ctx.arc(centerX + 20, cy - 55, 5, 0, Math.PI * 2);
      ctx.fillStyle = ballGradient2;
      ctx.fill();

      // Sparkles around mascot
      const sparkleCount = 4;
      for (let i = 0; i < sparkleCount; i++) {
        const angle = (mascot.bobOffset * 0.5 + i * (Math.PI * 2 / sparkleCount)) % (Math.PI * 2);
        const sparkleRadius = 48 + Math.sin(mascot.bobOffset * 2 + i) * 5;
        const sparkleX = centerX + Math.cos(angle) * sparkleRadius;
        const sparkleY = cy + Math.sin(angle) * sparkleRadius;
        const sparkleSize = 2 + Math.sin(mascot.bobOffset * 3 + i) * 1;
        const sparkleAlpha = 0.3 + Math.sin(mascot.bobOffset * 2 + i) * 0.3;

        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 
          ? `rgba(99, 102, 241, ${sparkleAlpha})` 
          : `rgba(34, 211, 238, ${sparkleAlpha})`;
        ctx.fill();
      }
    };

    // Show message
    const showMessage = (msg) => {
      if (mascotSpeech) {
        mascotSpeech.textContent = msg;
        mascotSpeech.classList.add('visible');

        setTimeout(() => {
          mascotSpeech.classList.remove('visible');
        }, 3500);
      }
    };

    // Animation loop
    let animationId;
    const animate = () => {
      mascot.bobOffset += 0.035;

      // Blinking
      mascot.blinkTimer++;
      if (mascot.blinkTimer > 200 && Math.random() < 0.015) {
        mascot.isBlinking = true;
        setTimeout(() => {
          mascot.isBlinking = false;
        }, 150);
        mascot.blinkTimer = 0;
      }

      // Random messages every 10-15 seconds
      const now = Date.now();
      if (now - mascot.lastMessageTime > 12000 && Math.random() < 0.008) {
        showMessage(messages[currentMessageIndex]);
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        mascot.lastMessageTime = now;
      }

      updateEyeDirection();
      drawMascot();

      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Initial message
    setTimeout(() => {
      showMessage("👀 Je te surveille...");
      mascot.lastMessageTime = Date.now();
    }, 3000);

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });

    // Message on scroll milestones
    let lastScrollMilestone = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const milestone = Math.floor(scrollPercent * 4); // 0, 25%, 50%, 75%, 100%

      if (milestone !== lastScrollMilestone && milestone > 0) {
        const scrollMessages = [
          "📜 Tu descends bien !",
          "👀 Encore plus bas...",
          "🎯 Presque à la fin !",
          "🏆 Tu as tout vu !"
        ];
        if (scrollMessages[milestone - 1]) {
          showMessage(scrollMessages[milestone - 1]);
        }
        lastScrollMilestone = milestone;
      }
    }, { passive: true });

  } else if (mascotWatcher && (isMobile || !isDesktop)) {
    // Hide mascot on mobile
    mascotWatcher.style.display = 'none';
  }

  // ==================== SCROLL REVEAL ANIMATIONS ====================
  const revealElements = $$('.reveal');

  if (revealElements.length > 0 && !prefersReducedMotion) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              // Staggered animation
              setTimeout(() => {
                entry.target.classList.add('active');
              }, index * 100);
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -80px 0px'
        }
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      // Fallback: show all elements
      revealElements.forEach((el) => el.classList.add('active'));
    }
  } else {
    // Reduced motion or no reveal elements
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // ==================== SKILL BARS ANIMATION ====================
  const skillBars = $$('.skill-bar-fill, .bar-fill');

  if (skillBars.length > 0) {
    if ('IntersectionObserver' in window) {
      const barObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const bar = entry.target;
              const width = bar.dataset.width || bar.dataset.val;
              
              if (width) {
                setTimeout(() => {
                  bar.style.width = `${width}%`;
                }, 300);
              }
              
              barObserver.unobserve(bar);
            }
          });
        },
        { threshold: 0.5 }
      );

      skillBars.forEach((bar) => barObserver.observe(bar));
    } else {
      // Fallback
      skillBars.forEach((bar) => {
        const width = bar.dataset.width || bar.dataset.val;
        if (width) bar.style.width = `${width}%`;
      });
    }
  }

  // ==================== CHATBOT ====================
  const chatInput = $('#chatInput');
  const chatSend = $('#chatSend');
  const chatMessages = $('#chatMessages');

  if (chatInput && chatSend && chatMessages) {
    // Knowledge base
    const knowledge = {
      greetings: ['salut', 'bonjour', 'hello', 'hey', 'coucou', 'yo', 'hi', 'bonsoir'],
      thanks: ['merci', 'thanks', 'thx', 'cool', 'super', 'génial', 'parfait', 'top'],
      skills: ['compétence', 'skill', 'sait', 'maîtrise', 'connais', 'technologie', 'outil', 'langage'],
      projects: ['projet', 'portfolio', 'réalisation', 'travail', 'création', 'fait'],
      contact: ['contact', 'email', 'mail', 'téléphone', 'phone', 'appeler', 'joindre', 'écrire'],
      location: ['où', 'ville', 'habite', 'localisation', 'région', 'adresse'],
      education: ['étude', 'formation', 'école', 'lycée', 'bac', 'diplôme', 'bts', 'ciel'],
      network: ['réseau', 'cisco', 'vlan', 'routeur', 'switch', 'ip', 'tcp', 'packet'],
      cyber: ['cyber', 'sécurité', 'security', 'wireshark', 'hack', 'firewall', 'virus'],
      web: ['web', 'site', 'html', 'css', 'javascript', 'js', 'frontend', 'design'],
      availability: ['disponible', 'alternance', 'stage', 'embauche', 'recrute', 'travail'],
      mascot: ['mascotte', 'robot', 'ia', 'bot', 'assistant', 'yeux', 'surveille'],
      who: ['qui', 'toi', 'sabir', 'présente', 'âge', 'ans']
    };

    const responses = {
      greetings: [
        "👋 Salut ! Bienvenue sur le portfolio de Sabir !",
        "Hello ! Comment puis-je t'aider ?",
        "Hey ! Ravi de te voir ici ! 😊"
      ],
      thanks: [
        "Avec plaisir ! 😊",
        "Merci à toi de visiter ! ✨",
        "Content que ça te plaise ! 🎉"
      ],
      skills: [
        "🛠️ <b>Compétences de Sabir :</b><br>• Réseaux : Cisco, VLAN, TCP/IP (85%)<br>• Cyber : Wireshark, Firewall (78%)<br>• Web : HTML/CSS/JS, Canvas (82%)<br>• Système : Windows, Linux (75%)"
      ],
      projects: [
        "📂 <b>Projets réalisés :</b><br>• Portfolio Premium avec mascotte IA<br>• Lab Réseau Cisco (VLAN, routage)<br>• Analyses de sécurité Wireshark<br>• Interfaces UI/UX modernes"
      ],
      contact: [
        "📧 <b>Contact :</b><br>Email : amiamisabir@gmail.com<br>Tél : 07 62 97 26 26<br>📍 Saint-Maximin (83)"
      ],
      location: [
        "📍 Sabir est basé à <b>Saint-Maximin (83)</b> dans le Var, entre Marseille et Nice !"
      ],
      education: [
        "🎓 <b>Formation :</b><br>Actuellement en Terminale CIEL (Cybersécurité, Informatique et Électronique).<br>Objectif : BTS SIO SISR en alternance !"
      ],
      network: [
        "🌐 <b>Réseaux :</b><br>• Cisco Packet Tracer (85%)<br>• Configuration VLAN et routage<br>• Adressage IP et subnetting<br>• Protocoles TCP/IP, DNS, DHCP"
      ],
      cyber: [
        "🛡️ <b>Cybersécurité :</b><br>• Analyse de trafic Wireshark<br>• Scans avec Nmap<br>• Configuration Firewall<br>• Bonnes pratiques sécurité"
      ],
      web: [
        "💻 <b>Développement Web :</b><br>• HTML5, CSS3, JavaScript (82%)<br>• Animations Canvas<br>• Design responsive<br>• Ce portfolio est 100% fait main !"
      ],
      availability: [
        "✅ <b>Disponibilité :</b><br>Sabir recherche activement une alternance en BTS SIO SISR !<br>📧 Contact : amiamisabir@gmail.com"
      ],
      mascot: [
        "🤖 Je suis la mascotte IA de ce portfolio ! Mes yeux suivent ta souris et je te surveille... 👀 Pas de panique, je suis gentil ! 😄"
      ],
      who: [
        "👤 <b>Sabir IAZZA</b><br>Étudiant en Terminale CIEL, passionné par les réseaux, la cybersécurité et le développement web. Curieux, autodidacte et toujours prêt à apprendre !"
      ],
      default: [
        "🤔 Bonne question ! Tu peux me demander des infos sur les compétences, projets, ou le contact de Sabir.",
        "Hmm, je ne suis pas sûr de comprendre. Essaie : 'compétences', 'projets' ou 'contact' !",
        "📧 Pour plus d'infos, contacte Sabir : amiamisabir@gmail.com"
      ]
    };

    // Get response based on message
    const getResponse = (message) => {
      const msg = message.toLowerCase().trim();
      let bestMatch = 'default';
      let maxScore = 0;

      // Check each category
      for (const [category, keywords] of Object.entries(knowledge)) {
        let score = 0;
        keywords.forEach((keyword) => {
          if (msg.includes(keyword)) score++;
        });

        if (score > maxScore) {
          maxScore = score;
          bestMatch = category;
        }
      }

      // Get random response from category
      const categoryResponses = responses[bestMatch] || responses.default;
      return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    };

    // Add message to chat
    const addMessage = (text, type) => {
      const msg = document.createElement('div');
      msg.className = `chat-msg ${type}`;
      msg.innerHTML = text;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Limit messages (keep last 20)
      while (chatMessages.children.length > 20) {
        chatMessages.removeChild(chatMessages.firstChild);
      }
    };

    // Send message
    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      // Add user message
      addMessage(text, 'user');
      chatInput.value = '';

      // Show typing indicator
      const typingId = 'typing-' + Date.now();
      const typingEl = document.createElement('div');
      typingEl.className = 'chat-msg bot';
      typingEl.id = typingId;
      typingEl.innerHTML = '<span style="opacity: 0.6">💭 Réfléchit...</span>';
      chatMessages.appendChild(typingEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Respond after delay
      setTimeout(() => {
        const typing = document.getElementById(typingId);
        if (typing) typing.remove();
        addMessage(getResponse(text), 'bot');
      }, 600 + Math.random() * 800);
    };

    // Event listeners
    chatSend.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea if it's a textarea
    if (chatInput.tagName === 'TEXTAREA') {
      chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
      });
    }
  }

  // ==================== GLASS CARD MOUSE TRACKING ====================
  if (isDesktop && !prefersReducedMotion) {
    $$('.glass-card, .about-card, .skill-card, .project-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      }, { passive: true });
    });
  }

  // ==================== PARALLAX ELEMENTS ====================
  if (isDesktop && !prefersReducedMotion) {
    const parallaxElements = $$('[data-parallax]');

    if (parallaxElements.length > 0) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        parallaxElements.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax) || 0.1;
          const yOffset = scrollY * speed;
          el.style.transform = `translateY(${yOffset}px)`;
        });
      }, { passive: true });
    }
  }

  // ==================== KEYBOARD NAVIGATION ====================
  document.addEventListener('keydown', (e) => {
    // Press 'H' to go home
    if (e.key === 'h' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const activeElement = document.activeElement;
      if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Escape to close any open modals/menus
    if (e.key === 'Escape') {
      if (navToggle?.classList.contains('active')) {
        navToggle.classList.remove('active');
      }
    }
  });

  // ==================== PERFORMANCE: PAUSE ANIMATIONS WHEN HIDDEN ====================
  let isPageVisible = true;

  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  // ==================== COPY EMAIL TO CLIPBOARD ====================
  $$('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', () => {
      const email = link.href.replace('mailto:', '');

      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          // Show brief notification
          const originalText = link.textContent;
          link.textContent = '✓ Copié !';
          setTimeout(() => {
            link.textContent = originalText;
          }, 2000);
        }).catch(() => {
          // Fallback: just let the mailto work
        });
      }
    });
  });

  // ==================== CONSOLE BRANDING ====================
  console.log(
    '%c🚀 Sabir IAZZA - Portfolio Premium V2',
    'color: #6366f1; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 0 #22d3ee;'
  );
  console.log(
    '%c✨ Design by Sabir | Powered by passion',
    'color: #22d3ee; font-size: 14px;'
  );
  console.log(
    '%c📧 Contact: amiamisabir@gmail.com',
    'color: #f472b6; font-size: 12px;'
  );

  // ==================== INIT COMPLETE ====================
  console.log('✅ Portfolio script loaded successfully!');

})();