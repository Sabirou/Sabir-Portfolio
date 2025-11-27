// Année dynamique dans le footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Thème clair / sombre
const body = document.body;
const toggleBtn = document.getElementById("theme-toggle");

function applyTheme(theme) {
  body.setAttribute("data-theme", theme);
  if (toggleBtn) {
    toggleBtn.textContent = theme === "dark" ? "🌙 Mode sombre" : "☀️ Mode clair";
  }
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const current = body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

// Animation au scroll
const revealElements = document.querySelectorAll('.reveal');

function handleScrollReveal() {
  const triggerBottom = window.innerHeight * 0.85;
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);

// Barre de progression de scroll
const progressBar = document.getElementById('scroll-progress');
function handleScrollProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
  progressBar.style.width = `${ratio * 100}%`;
}

window.addEventListener('scroll', handleScrollProgress);
window.addEventListener('load', handleScrollProgress);

// Animation de focus quand on clique sur un lien de nav
const navLinks = document.querySelectorAll('header nav a[href^="#"]');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    target.classList.add('section-focus');
    setTimeout(() => target.classList.remove('section-focus'), 800);
  });
});

// Nuages bleus animés sur le canvas
const canvas = document.getElementById('sky');
let ctx = null;
if (canvas) {
  ctx = canvas.getContext('2d');
}
const clouds = [];
let dpr = window.devicePixelRatio || 1;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createCloud(x, y, radius) {
  return {
    x,
    y,
    r: radius,
    alpha: 0.25 + Math.random() * 0.35,
    dx: (Math.random() - 0.5) * 0.25,
    dy: (Math.random() - 0.5) * 0.25
  };
}

function initClouds() {
  if (!canvas) return;
  clouds.length = 0;
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < 18; i++) {
    clouds.push(createCloud(
      Math.random() * w,
      Math.random() * h,
      60 + Math.random() * 120
    ));
  }
}

function drawCloud(c) {
  if (!ctx) return;
  const gradient = ctx.createRadialGradient(
    c.x, c.y, 0,
    c.x, c.y, c.r
  );
  gradient.addColorStop(0, `rgba(56,189,248,${c.alpha})`);
  gradient.addColorStop(1, 'rgba(15,23,42,0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
  ctx.fill();
}

function animate() {
  if (!canvas || !ctx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  clouds.forEach(c => {
    c.x += c.dx;
    c.y += c.dy;

    if (c.x < -c.r) c.x = w + c.r;
    if (c.x > w + c.r) c.x = -c.r;
    if (c.y < -c.r) c.y = h + c.r;
    if (c.y > h + c.r) c.y = -c.r;

    drawCloud(c);
  });

  requestAnimationFrame(animate);
}

// Clic = explosion de nuages bleus
if (canvas) {
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 8; i++) {
      const c = createCloud(
        x + (Math.random() - 0.5) * 80,
        y + (Math.random() - 0.5) * 60,
        40 + Math.random() * 80
      );
      c.dx *= 2;
      c.dy *= 2;
      clouds.push(c);
    }
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    initClouds();
  });

  // Init clouds
  resizeCanvas();
  initClouds();
  animate();
}

// ===== Assistant IA – SabirBot (front uniquement) =====
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function addMessage(text, sender = 'bot') {
  if (!chatWindow) return;
  const wrapper = document.createElement('div');
  wrapper.className = `chat-message ${sender}`;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = text;
  wrapper.appendChild(bubble);
  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateSabirBotReply(message) {
  const msg = message.toLowerCase();

  // Quelques réponses simples basées sur des mots-clés
  if (msg.includes('stage') && msg.includes('fibre')) {
    return `
      Sabir a réalisé un <strong>stage en fibre optique en 2023</strong> 🧵.<br>
      Il a participé à des interventions terrain : préparation du matériel,
      raccordement, respect des règles de sécurité et tests de connexion.
    `;
  }

  if (msg.includes('stage') && msg.includes('téléphone')) {
    return `
      Sabir a aussi fait un <strong>stage en réparation de téléphones</strong> 📱.<br>
      Il s’occupait du diagnostic, du changement d’écrans / batteries
      et des tests après intervention, avec contact client.
    `;
  }

  if (msg.includes('stages') || msg.includes('stage')) {
    return `
      Sabir a réalisé <strong>plusieurs stages entre 2023 et 2025</strong> :<br>
      • Fibre optique (2023, télécom)<br>
      • Réparation de téléphones (atelier)<br>
      • Développement web<br>
      • Électricité bâtiment<br>
      • Support informatique<br><br>
      Demande-moi un détail sur un stage précis si tu veux 😉
    `;
  }

  if (msg.includes('bac pro') || msg.includes('ciel')) {
    return `
      Sabir est en <strong>Terminale Bac Pro CIEL</strong> 🧑‍💻.<br>
      CIEL = Cybersécurité, Informatique et Réseaux, Électronique.<br>
      Il y voit : réseaux, cybersécurité (bases), électronique, TP,
      projets et préparation à un BTS dans l’IT.
    `;
  }

  if (msg.includes('bts sio') || msg.includes('après le bac') || msg.includes('apres le bac')) {
    return `
      L’objectif de Sabir est de poursuivre en <strong>BTS SIO</strong> 🎓.<br>
      Ça lui permettrait de renforcer le développement, l’admin systèmes / réseaux,
      tout en gardant un pied dans la cybersécurité.<br>
      Option probable : <strong>SISR</strong> (réseaux) ou <strong>SLAM</strong> (développement).
    `;
  }

  if (msg.includes('orientation') || msg.includes('conseil') || msg.includes('conseils')) {
    return `
      En mode conseil rapide :<br>
      • Si tu aimes le <strong>terrain + réseaux</strong> → Bac Pro / BTS orienté CIEL / SIO SISR<br>
      • Si tu préfères le <strong>code</strong> → BTS SIO SLAM ou écoles de dev<br>
      • Le plus important : <strong>faire des stages</strong> et tester en vrai ce que tu aimes.
    `;
  }

  if (msg.includes('cv') || msg.includes('portfolio')) {
    return `
      Ce site fait office de <strong>portfolio en ligne</strong> 📂.<br>
      Sabir peut aussi envoyer un CV plus détaillé sur demande.<br>
      Tu peux le contacter directement par mail : <strong>amiamisabir@gmail.com</strong>.
    `;
  }

  if (msg.includes('salut') || msg.includes('bonjour') || msg.includes('hey')) {
    return `
      Hey 👋, moi c’est <strong>SabirBot</strong>.<br>
      Pose-moi une question sur le parcours de Sabir, ses stages, son Bac Pro CIEL
      ou son projet de BTS SIO et je t’aide.
    `;
  }

  // Réponse par défaut
  return `
    Bonne question 👀.<br>
    Je ne suis qu’un petit assistant en JavaScript pour l’instant,
    donc je n’ai pas toutes les infos comme ChatGPT.<br>
    Essaie de me demander par exemple :<br>
    • <em>Quels stages a fait Sabir ?</em><br>
    • <em>C’est quoi son objectif après le Bac ?</em><br>
    • <em>Il fait quoi en Bac Pro CIEL ?</em>
  `;
}

if (chatForm && chatInput) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');

    // petite attente pour l'effet "IA"
    setTimeout(() => {
      const reply = generateSabirBotReply(text);
      addMessage(reply, 'bot');
    }, 350);

    chatInput.value = '';
  });
}
