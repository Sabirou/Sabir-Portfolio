/* ============================================
   SABIR IAZZA - SCRIPT PORTFOLIO PAGE
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
  const progressBar = $('#progressBar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');
  
  let lastScrollY = 0;
  let ticking = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Navbar background
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 50);
    }
    
    // Progress bar
    if (progressBar && docHeight > 0) {
      const progress = (scrollY / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
    
    // Active nav link
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
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

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

        // Close mobile menu
        if (mobileMenu?.classList.contains('active')) {
          navToggle?.classList.remove('active');
          mobileMenu.classList.remove('active');
        }
      }
    });
  });

  // ==================== BACK HOME BUTTON ====================
  const backHome = $('#backHome');
  if (backHome) {
    backHome.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

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
      "🚀 Tu explores bien !",
      "📧 Contacte Sabir !",
      "💼 CV disponible !"
    ];

    document.addEventListener('mousemove', (e) => {
      const orbRect = orbWatcher.getBoundingClientRect();
      const orbCenterX = orbRect.left + orbRect.width / 2;
      const orbCenterY = orbRect.top + orbRect.height / 2;

      const dx = e.clientX - orbCenterX;
      const dy = e.clientY - orbCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxOffset = 8;
      const eyeX = clamp((dx / Math.max(distance, 100)) * maxOffset, -maxOffset, maxOffset);
      const eyeY = clamp((dy / Math.max(distance, 100)) * maxOffset, -maxOffset, maxOffset);

      orbEye.style.transform = `translate(calc(-50% + ${eyeX}px), calc(-50% + ${eyeY}px))`;
    }, { passive: true });

    const showMessage = (msg) => {
      if (orbSpeech) {
        orbSpeech.textContent = msg;
        orbSpeech.classList.add('visible');
        setTimeout(() => orbSpeech.classList.remove('visible'), 3500);
      }
    };

    setInterval(() => {
      const now = Date.now();
      if (now - lastMessageTime > 15000 && Math.random() < 0.25) {
        showMessage(messages[Math.floor(Math.random() * messages.length)]);
        lastMessageTime = now;
      }
    }, 4000);

    setTimeout(() => {
      showMessage("👁️ Je t'observe...");
      lastMessageTime = Date.now();
    }, 2500);

    // Scroll milestones
    let lastMilestone = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const milestone = Math.floor(scrollPercent * 4);

      if (milestone !== lastMilestone && milestone > 0) {
        const scrollMessages = [
          "📜 Tu descends bien !",
          "👀 Encore plus...",
          "🎯 Presque à la fin !",
          "🏆 Tu as tout vu !"
        ];
        if (scrollMessages[milestone - 1]) {
          showMessage(scrollMessages[milestone - 1]);
        }
        lastMilestone = milestone;
      }
    }, { passive: true });

  } else if (orbWatcher && (isMobile || !isDesktop)) {
    orbWatcher.style.display = 'none';
  }

  // ==================== SCROLL REVEAL ====================
  const revealElements = $$('.reveal');

  if (revealElements.length > 0 && !prefersReducedMotion) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('active');
              }, index * 80);
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
      );

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('active'));
    }
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==================== SKILL BARS ====================
  const skillBars = $$('.skill-bar-fill');

  if (skillBars.length > 0) {
    if ('IntersectionObserver' in window) {
      const barObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const bar = entry.target;
              const width = bar.dataset.width;
              
              if (width) {
                setTimeout(() => {
                  bar.style.width = `${width}%`;
                }, 250);
              }
              
              barObserver.unobserve(bar);
            }
          });
        },
        { threshold: 0.5 }
      );

      skillBars.forEach(bar => barObserver.observe(bar));
    } else {
      skillBars.forEach(bar => {
        const width = bar.dataset.width;
        if (width) bar.style.width = `${width}%`;
      });
    }
  }

  // ==================== CHATBOT ====================
  const chatInput = $('#chatInput');
  const chatSend = $('#chatSend');
  const chatMessages = $('#chatMessages');

  if (chatInput && chatSend && chatMessages) {
    const knowledge = {
      greetings: ['salut', 'bonjour', 'hello', 'hey', 'coucou', 'yo', 'hi', 'bonsoir'],
      thanks: ['merci', 'thanks', 'thx', 'cool', 'super', 'génial', 'parfait', 'top'],
      skills: ['compétence', 'skill', 'sait', 'maîtrise', 'connais', 'technologie', 'outil'],
      projects: ['projet', 'portfolio', 'réalisation', 'travail', 'création', 'fait'],
      contact: ['contact', 'email', 'mail', 'téléphone', 'phone', 'appeler', 'joindre'],
      location: ['où', 'ville', 'habite', 'localisation', 'région', 'adresse'],
      education: ['étude', 'formation', 'école', 'lycée', 'bac', 'diplôme', 'bts', 'ciel'],
      network: ['réseau', 'cisco', 'vlan', 'routeur', 'switch', 'ip', 'tcp', 'packet'],
      cyber: ['cyber', 'sécurité', 'security', 'wireshark', 'hack', 'firewall'],
      web: ['web', 'site', 'html', 'css', 'javascript', 'js', 'frontend', 'design'],
      cv: ['cv', 'curriculum', 'télécharger', 'pdf', 'resume'],
      availability: ['disponible', 'alternance', 'stage', 'embauche', 'recrute']
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
        "🛠️ <b>Compétences :</b><br>• Réseaux : Cisco, VLAN, TCP/IP (85%)<br>• Cyber : Wireshark, Firewall (78%)<br>• Web : HTML/CSS/JS (82%)<br>• Système : Windows, Linux (75%)"
      ],
      projects: [
        "📂 <b>Projets :</b><br>• Portfolio Premium avec orbe 3D<br>• Lab Réseau Cisco<br>• Analyses de sécurité<br>• Interfaces UI/UX"
      ],
      contact: [
        "📧 <b>Contact :</b><br>Email : amiamisabir@gmail.com<br>Tél : 07 62 97 26 26<br>📍 Saint-Maximin (83)"
      ],
      location: [
        "📍 Sabir est basé à <b>Saint-Maximin (83)</b> dans le Var !"
      ],
      education: [
        "🎓 <b>Formation :</b><br>Terminale CIEL (Cybersécurité, Informatique et Électronique).<br>Objectif : BTS SIO SISR en alternance !"
      ],
      network: [
        "🌐 <b>Réseaux :</b><br>• Cisco Packet Tracer (85%)<br>• Configuration VLAN<br>• Routage, TCP/IP, DNS"
      ],
      cyber: [
        "🛡️ <b>Cybersécurité :</b><br>• Wireshark (78%)<br>• Nmap, Firewall<br>• Bonnes pratiques"
      ],
      web: [
        "💻 <b>Web :</b><br>• HTML5, CSS3, JavaScript (82%)<br>• Animations Canvas<br>• Design responsive"
      ],
      cv: [
        "📄 Tu peux télécharger le CV de Sabir en cliquant sur le bouton 'Télécharger CV' dans la section Contact ! ⬇️"
      ],
      availability: [
        "✅ Sabir recherche une alternance en BTS SIO SISR !<br>📧 Contact : amiamisabir@gmail.com"
      ],
      default: [
        "🤔 Bonne question ! Essaie : 'compétences', 'projets' ou 'contact'.",
        "📧 Pour plus d'infos, contacte Sabir : amiamisabir@gmail.com"
      ]
    };

    const getResponse = (message) => {
      const msg = message.toLowerCase().trim();
      let bestMatch = 'default';
      let maxScore = 0;

      for (const [category, keywords] of Object.entries(knowledge)) {
        let score = 0;
        keywords.forEach(keyword => {
          if (msg.includes(keyword)) score++;
        });

        if (score > maxScore) {
          maxScore = score;
          bestMatch = category;
        }
      }

      const categoryResponses = responses[bestMatch] || responses.default;
      return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    };

    const addMessage = (text, type) => {
      const msg = document.createElement('div');
      msg.className = `chat-msg ${type}`;
      msg.innerHTML = text;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      while (chatMessages.children.length > 20) {
        chatMessages.removeChild(chatMessages.firstChild);
      }
    };

    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      chatInput.value = '';

      const typingId = 'typing-' + Date.now();
      const typingEl = document.createElement('div');
      typingEl.className = 'chat-msg bot';
      typingEl.id = typingId;
      typingEl.innerHTML = '<span style="opacity: 0.6">💭 Réfléchit...</span>';
      chatMessages.appendChild(typingEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(() => {
        const typing = document.getElementById(typingId);
        if (typing) typing.remove();
        addMessage(getResponse(text), 'bot');
      }, 500 + Math.random() * 700);
    };

    chatSend.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // ==================== COPY EMAIL ====================
  $$('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      const email = link.href.replace('mailto:', '');
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).catch(() => {});
      }
    });
  });

  // ==================== PAUSE ON HIDDEN ====================
  document.addEventListener('visibilitychange', () => {
    // Can be used to pause animations
  });

  // ==================== CONSOLE ====================
  console.log(
    '%c🎯 Sabir IAZZA - Portfolio Premium',
    'color: #6366f1; font-size: 20px; font-weight: bold;'
  );
  console.log(
    '%c✨ Merci de visiter !',
    'color: #22d3ee; font-size: 14px;'
  );
  console.log(
    '%c📧 Contact: amiamisabir@gmail.com',
    'color: #f472b6; font-size: 12px;'
  );

})();