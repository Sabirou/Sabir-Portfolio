/* ============================================
   SABIR IAZZA - SCRIPT PORTFOLIO
   ============================================ */

(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);

  // Year
  const yearEl = $("#pYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================
  // ORB BUTTON
  // ============================================
  const orbBtn = $("#orbBtn");
  if (orbBtn) {
    orbBtn.addEventListener("click", () => {
      document.body.style.transition = "opacity 0.35s ease";
      document.body.style.opacity = "0";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 350);
    });
  }

  // ============================================
  // BURGER MENU
  // ============================================
  const burger = $("#burger");
  const mMenu = $("#mMenu");
  const closeMenu = $("#closeMenu");
  const mMenuLinks = $$(".mNav__link");

  function openMenu() {
    if (mMenu) {
      mMenu.classList.add("is-open");
      mMenu.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMenuFn() {
    if (mMenu) {
      mMenu.classList.remove("is-open");
      mMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  if (burger) burger.addEventListener("click", openMenu);
  if (closeMenu) closeMenu.addEventListener("click", closeMenuFn);
  mMenuLinks.forEach(link => link.addEventListener("click", closeMenuFn));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mMenu?.classList.contains("is-open")) {
      closeMenuFn();
    }
  });

  if (mMenu) {
    mMenu.addEventListener("click", (e) => {
      if (e.target === mMenu) closeMenuFn();
    });
  }

  // ============================================
  // HEADER SCROLL
  // ============================================
  const header = $("#header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    }, { passive: true });
  }

  // ============================================
  // PROGRESS BAR
  // ============================================
  const progressBar = $("#progressBar");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${percent}%`;
    }, { passive: true });
  }

  // ============================================
  // ACTIVE NAV
  // ============================================
  const sections = $$("section[id]");
  const navLinks = $$(".nav__link");

  function updateActiveNav() {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove("is-active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("is-active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;
      
      const targetEl = $(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header?.offsetHeight || 80;
        window.scrollTo({
          top: targetEl.offsetTop - headerHeight - 20,
          behavior: "smooth"
        });
      }
    });
  });

  // ============================================
  // REVEAL ON SCROLL
  // ============================================
  const revealElements = $$(".reveal");

  if (revealElements.length > 0) {
    if ("IntersectionObserver" in window) {
      // Add class to enable JS-based reveal
      document.documentElement.classList.add("js-enabled");
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      revealElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback: show all immediately
      revealElements.forEach((el) => el.classList.add("is-in"));
    }
  }

  // ============================================
  // SKILL BARS
  // ============================================
  const bars = $$(".bar");

  if (bars.length > 0 && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const value = bar.dataset.val || 0;
            const fill = $(".bar__fill", bar);
            if (fill) {
              setTimeout(() => {
                fill.style.width = `${value}%`;
              }, 200);
            }
            barObserver.unobserve(bar);
          }
        });
      },
      { threshold: 0.5 }
    );

    bars.forEach((bar) => barObserver.observe(bar));
  }

  // ============================================
  // CHAT
  // ============================================
  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const chatLog = $("#chatLog");

  const responses = {
    default: [
      "Merci pour ton message ! 😊",
      "Je suis une démo, mais Sabir te répondra vite !",
      "Tu peux me contacter : amiamisabir@gmail.com",
      "N'hésite pas à explorer le portfolio !"
    ],
    greetings: [
      "Salut ! Comment puis-je t'aider ? 👋",
      "Hey ! Bienvenue sur le portfolio de Sabir !",
      "Bonjour ! Ravi de te voir ici !"
    ],
    skills: [
      "Sabir maîtrise : Réseaux, Cybersécurité, Web, Cisco...",
      "Compétences : Packet Tracer, Wireshark, HTML/CSS/JS"
    ],
    contact: [
      "Email : amiamisabir@gmail.com 📧",
      "Téléphone : 07 62 97 26 26 📞"
    ]
  };

  function getResponse(msg) {
    const m = msg.toLowerCase();
    if (m.match(/salut|hello|bonjour|hey|coucou/)) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }
    if (m.match(/compétence|skill|sait faire|maîtrise/)) {
      return responses.skills[Math.floor(Math.random() * responses.skills.length)];
    }
    if (m.match(/contact|email|téléphone|joindre/)) {
      return responses.contact[Math.floor(Math.random() * responses.contact.length)];
    }
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }

  function addMessage(text, type) {
    if (!chatLog) return;
    const msg = document.createElement("div");
    msg.className = `msg msg--${type}`;
    msg.textContent = text;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  if (chatForm && chatInput && chatLog) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;
      
      addMessage(message, "me");
      chatInput.value = "";
      
      setTimeout(() => {
        addMessage(getResponse(message), "bot");
      }, 500 + Math.random() * 800);
    });

    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event("submit"));
      }
    });
  }

  // ============================================
  // BACKGROUND PARTICLES
  // ============================================
  const pCanvas = $("#pCanvas");
  
  if (pCanvas) {
    const ctx = pCanvas.getContext("2d");
    let particles = [];
    let animId;

    function resize() {
      pCanvas.width = window.innerWidth;
      pCanvas.height = window.innerHeight;
    }

    function init() {
      particles = [];
      const count = Math.min(40, Math.floor((pCanvas.width * pCanvas.height) / 40000));
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: rand(0, pCanvas.width),
          y: rand(0, pCanvas.height),
          r: rand(1, 3),
          vx: rand(-0.3, 0.3),
          vy: rand(-0.3, 0.3),
          alpha: rand(0.1, 0.4)
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(47, 231, 255, ${p.alpha})`;
        ctx.fill();
      });
      
      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        init();
      }, 250);
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });
  }

  console.log("%c🎯 Portfolio Sabir chargé !", "color: #B45CFF; font-size: 14px; font-weight: bold;");

})();