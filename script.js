// 1. LOADER
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  const progress = document.querySelector('.loader-progress');
  
  progress.style.width = '100%';
  
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1000);
});

// 2. SMOOTH SCROLL (LENIS)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 3. CUSTOM CURSOR
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  dot.style.left = `${posX}px`;
  dot.style.top = `${posY}px`;

  // Petit délai pour l'outline (effet fluide)
  outline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 500, fill: "forwards" });
});

// 4. THREE.JS PARTICLES BACKGROUND
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

// Création des particules
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xa855f7, // Couleur Primary
  transparent: true,
  opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// Animation
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX / window.innerWidth - 0.5;
  mouseY = event.clientY / window.innerHeight - 0.5;
});

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  
  particlesMesh.rotation.y = elapsedTime * 0.05; // Rotation automatique
  particlesMesh.rotation.x = mouseY * 0.5; // Interaction souris
  particlesMesh.rotation.y += mouseX * 0.5;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});