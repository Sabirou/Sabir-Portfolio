// 1. LOADER & INIT
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const progress = document.querySelector('.loader-progress');
  
  progress.style.width = '100%';
  setTimeout(() => loader.classList.add('hidden'), 1000);
});

// 2. SMOOTH SCROLL (Fluidité)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 3. THREE.JS PARTICLES (Étoiles 3D)
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
  size: 0.025,
  color: 0x06b6d4, // Couleur Cyan
  transparent: true,
  opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX / window.innerWidth - 0.5;
  mouseY = event.clientY / window.innerHeight - 0.5;
});

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  particlesMesh.rotation.y = elapsedTime * 0.05;
  particlesMesh.rotation.x = mouseY * 0.2;
  particlesMesh.rotation.y += mouseX * 0.2;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 4. MASCOTTE OEIL
const orbEye = document.getElementById('orbEye');
const pupil = document.querySelector('.orb-pupil');
const orbSpeech = document.getElementById('orbSpeech');

document.addEventListener('mousemove', (e) => {
  if (!orbEye) return;
  const rect = orbEye.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const maxDist = 10;
  
  const moveX = (dx / dist) * Math.min(dist, maxDist);
  const moveY = (dy / dist) * Math.min(dist, maxDist);
  
  pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

setInterval(() => {
  if (Math.random() > 0.7) {
    const msgs = ["👀 Je te vois...", "✨ Scrolle !", "📂 Voir Projets", "📧 Contacte-moi"];
    orbSpeech.innerText = msgs[Math.floor(Math.random() * msgs.length)];
    orbSpeech.classList.add('visible');
    setTimeout(() => orbSpeech.classList.remove('visible'), 3000);
  }
}, 5000);
