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

// 2. CURSOR LOGIC (Duplicated for consistency)
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;
  dot.style.left = `${posX}px`;
  dot.style.top = `${posY}px`;
  outline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});

// 3. SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 4. 3D TILT EFFECT (Vanilla JS - No library needed)
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calcul du centre
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotation légère (max 10deg)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// 5. CHATBOT LOGIC
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');
const chatSend = document.getElementById('chatSend');

const responses = {
  "hello": "Salut ! Prêt à voir mon CV ?",
  "skills": "Je gère le réseau (Cisco) et le code (JS/HTML).",
  "contact": "Envoie-moi un mail : amiamisabir@gmail.com",
  "default": "Intéressant... Demande-moi mes compétences !"
};

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  div.innerText = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

chatSend.addEventListener('click', () => {
  const text = chatInput.value.toLowerCase();
  if (!text) return;
  
  addMessage(chatInput.value, 'user');
  chatInput.value = '';

  setTimeout(() => {
    let reply = responses.default;
    if (text.includes('bonjour') || text.includes('salut')) reply = responses.hello;
    if (text.includes('compétence') || text.includes('savoir')) reply = responses.skills;
    if (text.includes('contact') || text.includes('mail')) reply = responses.contact;
    
    addMessage(reply, 'bot');
  }, 500);
});

// Touche Entrée pour envoyer
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') chatSend.click();
});