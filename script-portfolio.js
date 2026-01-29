// ===== 1. SMOOTH SCROLL PREMIUM (LENIS) =====
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===== 2. SCROLL REVEAL AVEC STAGGER =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('active');
      }, index * 100); // Effet stagger
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== 3. NAVBAR PREMIUM AVEC SCROLL =====
const progressFill = document.getElementById('progressFill');
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  // Barre de progression
  if (docHeight > 0) {
    const progress = (scrollY / docHeight) * 100;
    progressFill.style.width = `${progress}%`;
  }
  
  // Effet navbar au scroll
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Auto-hide navbar (optionnel)
  if (scrollY > lastScrollY && scrollY > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = scrollY;
});

// ===== 4. EFFET TILT 3D AVANCÉ =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / 15;
    const dy = (y - cy) / 15;
    
    card.style.transform = `perspective(1000px) rotateY(${dx}deg) rotateX(${-dy}deg) scale(1.02)`;
    
    // Effet de lumière qui suit la souris
    const lightX = (x / rect.width) * 100;
    const lightY = (y / rect.height) * 100;
    card.style.background = `
      radial-gradient(circle at ${lightX}% ${lightY}%, 
        rgba(168, 85, 247, 0.15), 
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.02))
    `;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateY(0) rotateX(0) scale(1)`;
    card.style.background = '';
  });
});

// ===== 5. ANIMATION DES BARRES DE COMPÉTENCES =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach((fill, index) => {
        setTimeout(() => {
          const width = fill.style.width;
          fill.style.width = '0';
          setTimeout(() => {
            fill.style.width = width;
          }, 50);
        }, index * 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillObserver.observe(card);
});

// ===== 6. CHATBOT INTELLIGENT PREMIUM =====
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const chatSend = document.getElementById('chatSend');

// Base de connaissances enrichie
const responses = {
  "hello": "Salut ! 👋 Je suis ravi de discuter avec toi. Tu peux me poser des questions sur mon parcours, mes compétences, mes projets ou ma recherche d'alternance !",
  "parcours": "Je suis actuellement en <strong>Terminale CIEL</strong> (Cybersécurité, Informatique et réseaux, ÉLectronique). Cette formation me permet de développer des compétences en infrastructure réseau, cybersécurité et administration système. Mon objectif est d'intégrer un <strong>BTS SIO option SISR</strong> en alternance dès septembre 2025.",
  "formation": "Je suis en Terminale CIEL, une formation spécialisée en réseaux et cybersécurité. J'y apprends la configuration de réseaux complexes, l'analyse de sécurité, et l'administration de systèmes Linux. Je vise un BTS SIO SISR en alternance pour approfondir ces compétences.",
  "bts": "Je recherche une alternance en <strong>BTS SIO option SISR</strong> (Solutions d'Infrastructure, Systèmes et Réseaux) pour la rentrée de septembre 2025. Cette formation me permettra d'approfondir mes compétences en infrastructure réseau et cybersécurité tout en acquérant une expérience professionnelle concrète.",
  "competences": "Mes compétences principales sont :<br>🛡️ <strong>Cybersécurité</strong> : Wireshark, analyse de trafic, détection d'intrusions<br>🌐 <strong>Réseaux</strong> : Cisco Packet Tracer, VLAN, TCP/IP, routage<br>💻 <strong>Développement</strong> : HTML/CSS/JS, Linux, Bash scripting",
  "cisco": "Je maîtrise <strong>Cisco Packet Tracer</strong> pour la simulation de réseaux d'entreprise. J'ai réalisé des projets incluant la configuration de VLANs, le routage inter-VLAN, la mise en place de serveurs DHCP et la sécurisation par ACL. Je peux concevoir et déployer des architectures réseau complètes.",
  "wireshark": "J'utilise <strong>Wireshark</strong> pour l'analyse de trafic réseau et la détection d'anomalies. Je sais capturer et filtrer des paquets, analyser les protocoles TCP/IP, HTTP, DNS, et identifier des tentatives d'intrusion. C'est un outil essentiel pour la cybersécurité !",
  "linux": "Je travaille régulièrement avec <strong>Linux</strong> (Ubuntu Server principalement). Je sais installer et configurer des services (Apache, FTP), sécuriser avec UFW, et automatiser des tâches avec des scripts Bash. L'administration système Linux est une de mes compétences clés.",
  "projets": "J'ai réalisé plusieurs projets techniques :<br>🎨 <strong>Portfolio Premium</strong> : Site web avec animations 3D (Three.js) et chatbot<br>🛰️ <strong>Lab Infrastructure</strong> : Simulation réseau Cisco avec VLANs et routage<br>🔍 <strong>Analyse Wireshark</strong> : Détection d'anomalies réseau<br>🐧 <strong>Serveur Linux</strong> : Configuration complète avec services web et sécurité",
  "portfolio": "Ce portfolio que tu consultes actuellement est un de mes projets ! J'ai créé un site web moderne avec des animations 3D utilisant Three.js, un chatbot interactif (c'est moi ! 🤖), et un design responsive. Tout est codé en HTML/CSS/JavaScript pur.",
  "reseau": "Mon projet de <strong>Lab Infrastructure</strong> simule un réseau d'entreprise complet avec 3 VLANs (Administration, Utilisateurs, Invités), du routage inter-VLAN, un serveur DHCP et des ACL pour la sécurité. C'est une infrastructure réaliste que j'ai conçue avec Cisco Packet Tracer.",
  "alternance": "Je recherche activement une <strong>alternance en infrastructure réseau et cybersécurité</strong> pour septembre 2025. Je suis motivé, rigoureux et passionné par les technologies réseau. Je peux contribuer à la sécurisation et l'optimisation de vos infrastructures tout en continuant à apprendre. Contactez-moi : <strong>amiamisabir@gmail.com</strong> ou <strong>07 62 97 26 26</strong>",
  "disponibilite": "Je suis disponible pour une alternance dès <strong>septembre 2025</strong> dans le cadre de mon BTS SIO SISR. Je suis basé à Saint-Maximin (83) mais mobile selon les besoins de l'entreprise. Mon rythme d'alternance sera défini par l'école (généralement 2-3 jours école / 2-3 jours entreprise).",
  "contact": "Tu peux me contacter facilement :<br>📧 Email : <strong>amiamisabir@gmail.com</strong><br>📱 Téléphone : <strong>07 62 97 26 26</strong><br>📍 Lieu : Saint-Maximin (83)<br>Tu peux aussi télécharger mon CV complet en cliquant sur le bouton en bas de la section Contact !",
  "cv": "Mon CV est disponible en téléchargement dans la section Contact ci-dessous. Il détaille mon parcours, mes compétences techniques, mes projets et mes expériences. N'hésite pas à le consulter pour en savoir plus sur mon profil !",
  "motivation": "Ma passion pour les réseaux et la cybersécurité vient de ma fascination pour comprendre comment les données circulent et comment protéger les systèmes. J'aime résoudre des problèmes complexes, analyser des architectures réseau et trouver des solutions de sécurisation. C'est un domaine en constante évolution qui me passionne !",
  "default": "Intéressant ! 🤔 Je peux répondre à des questions sur :<br>• Mon <strong>parcours</strong> et ma <strong>formation</strong><br>• Mes <strong>compétences</strong> (Cisco, Wireshark, Linux)<br>• Mes <strong>projets</strong> techniques<br>• Ma recherche d'<strong>alternance</strong><br>• Mes <strong>coordonnées</strong> pour me contacter<br><br>N'hésite pas à reformuler ta question !"
};

// Suggestions de questions
const suggestions = [
  "Quelles sont tes compétences ?",
  "Parle-moi de tes projets",
  "Tu recherches quoi ?",
  "Comment te contacter ?"
];

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  div.innerHTML = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Animation d'apparition
  setTimeout(() => {
    div.style.opacity = '1';
    div.style.transform = 'translateY(0)';
  }, 10);
}

function addSuggestions() {
  const suggestionsDiv = document.createElement('div');
  suggestionsDiv.className = 'chat-suggestions';
  suggestionsDiv.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  `;
  
  suggestions.forEach(suggestion => {
    const btn = document.createElement('button');
    btn.textContent = suggestion;
    btn.style.cssText = `
      padding: 8px 12px;
      background: rgba(168, 85, 247, 0.2);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 20px;
      color: white;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    btn.onmouseover = () => {
      btn.style.background = 'rgba(168, 85, 247, 0.4)';
      btn.style.transform = 'scale(1.05)';
    };
    btn.onmouseout = () => {
      btn.style.background = 'rgba(168, 85, 247, 0.2)';
      btn.style.transform = 'scale(1)';
    };
    btn.onclick = () => {
      chatInput.value = suggestion;
      handleChat();
    };
    suggestionsDiv.appendChild(btn);
  });
  
  chatMessages.appendChild(suggestionsDiv);
}

// Ajouter les suggestions au chargement
setTimeout(() => {
  addSuggestions();
}, 1000);

function findBestResponse(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.match(/\b(salut|bonjour|hello|hey|coucou)\b/)) return responses.hello;
  if (lowerText.match(/\b(parcours|étude|école|lycée|ciel)\b/)) return responses.parcours;
  if (lowerText.match(/\b(formation|diplôme|terminale)\b/)) return responses.formation;
  if (lowerText.match(/\b(bts|sio|sisr)\b/)) return responses.bts;
  if (lowerText.match(/\b(compétence|skill|savoir|maîtrise)\b/)) return responses.competences;
  if (lowerText.match(/\b(cisco|packet tracer|routeur|switch)\b/)) return responses.cisco;
  if (lowerText.match(/\b(wireshark|analyse|trafic|paquet)\b/)) return responses.wireshark;
  if (lowerText.match(/\b(linux|ubuntu|bash|serveur)\b/)) return responses.linux;
  if (lowerText.match(/\b(projet|réalisation|travaux)\b/)) return responses.projets;
  if (lowerText.match(/\b(portfolio|site|web)\b/)) return responses.portfolio;
  if (lowerText.match(/\b(réseau|vlan|infrastructure|lab)\b/)) return responses.reseau;
  if (lowerText.match(/\b(alternance|stage|entreprise|recrutement)\b/)) return responses.alternance;
  if (lowerText.match(/\b(disponible|disponibilité|quand|date)\b/)) return responses.disponibilite;
  if (lowerText.match(/\b(contact|mail|email|téléphone|joindre)\b/)) return responses.contact;
  if (lowerText.match(/\b(cv|curriculum)\b/)) return responses.cv;
  if (lowerText.match(/\b(motivation|pourquoi|passion|intérêt)\b/)) return responses.motivation;
  
  return responses.default;
}

function handleChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  
  addMessage(chatInput.value, 'user');
  chatInput.value = '';
  
  // Effet de saisie
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.innerHTML = '<span style="opacity:0.5">...</span>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const reply = findBestResponse(text);
    addMessage(reply, 'bot');
  }, 600);
}

if (chatSend && chatInput) {
  chatSend.addEventListener('click', handleChat);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
  });
}

// ===== 7. MENU MOBILE PREMIUM =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Animation du bouton
    if (navToggle.classList.contains('active')) {
      navToggle.innerHTML = '✕';
    } else {
      navToggle.innerHTML = '☰';
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.innerHTML = '☰';
    });
  });
}

// ===== 8. BOUTON RETOUR EN HAUT PREMIUM =====
const backToTopButton = document.createElement('button');
backToTopButton.className = 'back-to-top';
backToTopButton.innerHTML = '↑';
backToTopButton.setAttribute('aria-label', 'Retour en haut');
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ===== 9. NAVIGATION ACTIVE =====
const sections = document.querySelectorAll('.section[id]');
const navLinksArray = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinksArray.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===== 10. EFFET PARALLAXE SUR LES CARTES =====
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.card');
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
  
  cards.forEach((card, index) => {
    const speed = (index + 1) * 0.5;
    const x = (mouseX - 0.5) * speed;
    const y = (mouseY - 0.5) * speed;
    
    if (!card.matches(':hover')) {
      card.style.transform = `translate(${x}px, ${y}px)`;
    }
  });
});

// ===== 11. COMPTEUR ANIMÉ POUR LES STATISTIQUES (optionnel) =====
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = Math.round(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.round(start);
    }
  }, 16);
}

// ===== 12. EFFET DE PARTICULES AU CLIC =====
document.addEventListener('click', (e) => {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.8), transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    left: ${e.clientX - 5}px;
    top: ${e.clientY - 5}px;
    animation: particleExpand 0.6s ease-out forwards;
  `;
  
  document.body.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 600);
});

// Animation CSS pour les particules
const style = document.createElement('style');
style.textContent = `
  @keyframes particleExpand {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== 13. PRÉCHARGEMENT DES IMAGES =====
window.addEventListener('load', () => {
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
});

// ===== 14. EASTER EGG : KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    document.body.style.animation = 'rainbow 2s linear infinite';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 5000);
  }
});

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(rainbowStyle);

// ===== 15. PERFORMANCE : THROTTLE SCROLL =====
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Appliquer le throttle aux événements scroll
window.addEventListener('scroll', throttle(() => {
  // Optimisation des performances
}, 100));

console.log('🚀 Portfolio Premium chargé avec succès !');
console.log('💡 Astuce : Essaye le Konami Code pour un effet surprise !');
