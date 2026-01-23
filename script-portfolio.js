// 1. SMOOTH SCROLL (LENIS)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 3. NAVBAR PROGRESS BAR
const progressFill = document.getElementById('progressFill');
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  if (docHeight > 0) {
    progressFill.style.width = `${(scrollY / docHeight) * 100}%`;
  }
  
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// 4. 3D TILT EFFECT (Vanilla JS)
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
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateY(0) rotateX(0) scale(1)`;
  });
});

// 5. CHATBOT LOGIC
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const chatSend = document.getElementById('chatSend');

const responses = {
  "hello": "Salut ! Comment puis-je t'aider ?",
  "skill": "Je maîtrise Cisco, Wireshark, HTML/CSS et Linux.",
  "projet": "Regarde la section Projets pour voir mon Portfolio et mon Lab Cisco !",
  "contact": "Tu peux m'envoyer un mail à amiamisabir@gmail.com",
  "default": "Intéressant ! Peux-tu reformuler ou demander mes compétences ?"
};

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  div.innerHTML = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChat() {
  const text = chatInput.value.toLowerCase();
  if (!text) return;
  addMessage(chatInput.value, 'user');
  chatInput.value = '';
  
  // Simulation écriture
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.innerHTML = '<span style="opacity:0.5">...</span>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    let reply = responses.default;
    if (text.includes('salut') || text.includes('bonjour')) reply = responses.hello;
    if (text.includes('compétence') || text.includes('skill')) reply = responses.skill;
    if (text.includes('projet')) reply = responses.projet;
    if (text.includes('contact') || text.includes('mail')) reply = responses.contact;
    addMessage(reply, 'bot');
  }, 600);
}

chatSend.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleChat();
});

// 6. MOBILE MENU
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
});