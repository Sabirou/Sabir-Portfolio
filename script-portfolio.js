(() => {
  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobile menu
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  const header = document.getElementById("header");

  const toggleMenu = () => {
    const open = menu.classList.toggle("is-open");
    menu.setAttribute("aria-hidden", String(!open));
  };

  if (burger && menu) {
    burger.addEventListener("click", toggleMenu);
    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        menu.classList.remove("is-open");
        menu.setAttribute("aria-hidden", "true");
      });
    });
  }

  // Active nav link on scroll (desktop)
  const links = Array.from(document.querySelectorAll(".nav__link"));
  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
  };

  const io = new IntersectionObserver((entries) => {
    const best = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (best?.target?.id) setActive(best.target.id);
  }, { threshold: [0.2, 0.35, 0.5, 0.65] });

  sections.forEach(s => io.observe(s));

  // Copy “ready email”
  const copyBtn = document.getElementById("copyMail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const text =
`Bonjour,

Je vous contacte suite à votre offre / pour une candidature.
Je suis Sabir IAZZA, étudiant en Bac Pro CIEL (cybersécurité, réseaux, informatique & électronique).
Je souhaite échanger avec vous pour une opportunité (stage / alternance / projet).

Cordialement,
Sabir IAZZA
07 62 97 26 26
amiamisabir@gmail.com
Portfolio : ${location.href.split("#")[0]}`;

      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copié ✅";
        setTimeout(() => (copyBtn.textContent = "Copier un email prêt →"), 1600);
      } catch {
        alert("Copie impossible. Sélectionne le texte manuellement.");
      }
    });
  }
})();
