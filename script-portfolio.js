(() => {
  const $ = (q, root = document) => root.querySelector(q);

  // YEAR
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // CONTACT FORM (visual)
  const form = $("#contactForm");
  const note = $("#formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (note) note.textContent = "✅ Message prêt — envoie-moi directement par mail si besoin.";
    });
  }

  // CANVAS BG (same vibe)
  const canvas = $("#bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    function resize() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    const orbs = Array.from({ length: 26 }, () => ({
      r: 50 + Math.random() * 260,
      a: Math.random() * Math.PI * 2,
      s: 0.0006 + Math.random() * 0.0021,
      size: 4 + Math.random() * 14,
      hue: 250 + Math.random() * 80,
      ox: 0,
      oy: 0
    }));

    function render() {
      ctx.clearRect(0, 0, W(), H());
      const ox = W() / 2;
      const oy = H() / 2;
      for (const o of orbs) {
        o.ox = ox; o.oy = oy;
        o.a += o.s;
        const x = o.ox + Math.cos(o.a) * o.r;
        const y = o.oy + Math.sin(o.a) * o.r;

        const g = ctx.createRadialGradient(x, y, 0, x, y, o.size * 8);
        g.addColorStop(0, `hsla(${o.hue}, 90%, 65%, 0.20)`);
        g.addColorStop(1, `hsla(${o.hue}, 90%, 65%, 0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, o.size * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(render);
    }
    render();
  }

  // SABIRGPT (improved)
  const iaForm = $("#iaForm");
  const iaInput = $("#iaInput");
  const iaChat = $("#iaChat");

  const profile = {
    name: "Sabir IAZZA",
    city: "Saint-Maximin (83)",
    school: "Terminale Bac Pro CIEL à Toulon",
    focus: ["cybersécurité", "réseaux", "développement web", "électronique"],
    stages: {
      fibre: "En fibre optique : préparation matériel, raccordement, sécurité terrain, tests de connexion.",
      phone: "En réparation de téléphones : diagnostic, remplacement écran/batterie, tests après intervention."
    },
    goal: "Objectif : BTS SIO, progresser en systèmes/réseaux et rester connecté à la cybersécurité.",
    contact: "Email : amiamisabir@gmail.com • Tel : 07 62 97 26 26"
  };

  function addMsg(text, who = "bot") {
    if (!iaChat) return;
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.innerHTML = text;
    iaChat.appendChild(div);
    iaChat.scrollTop = iaChat.scrollHeight;
  }

  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function answer(qRaw) {
    const q = normalize(qRaw);

    // greetings
    if (/^(salut|yo|wesh|bonjour|coucou|hey)/.test(q)) {
      return `Salut 👋 Je suis <strong>SabirGPT</strong>. Tu veux parler de mes <strong>stages</strong>, <strong>compétences</strong> ou de mon <strong>objectif BTS</strong> ?`;
    }

    // age
    if (q.includes("age") || q.includes("âge") || q.includes("nee") || q.includes("né")) {
      return `Sabir est né en <strong>janvier 2008</strong> (17 ans).`;
    }

    // school / CIEL
    if (q.includes("ciel") || q.includes("bac pro") || q.includes("lycee") || q.includes("toulon")) {
      return `Je suis en <strong>${profile.school}</strong>. C’est une filière orientée <strong>cyber</strong>, <strong>réseaux</strong>, <strong>info</strong> et <strong>électronique</strong>.`;
    }

    // skills
    if (q.includes("competence") || q.includes("compétence") || q.includes("skills") || q.includes("tu sais faire")) {
      return `Mes compétences principales : <strong>${profile.focus.join("</strong>, <strong>")}</strong>.`;
    }

    // projects
    if (q.includes("projet") || q.includes("portfolio") || q.includes("site")) {
      return `Projet principal : <strong>mon portfolio</strong> (design premium + mobile clean) et <strong>SabirGPT</strong> intégré pour présenter mon profil.`;
    }

    // stages
    if (q.includes("stage") || q.includes("experience") || q.includes("expérience")) {
      if (q.includes("fibre")) return profile.stages.fibre;
      if (q.includes("telephone") || q.includes("téléphone") || q.includes("reparation") || q.includes("réparation")) return profile.stages.phone;
      return `J’ai fait plusieurs expériences. Les plus importantes : <strong>fibre optique</strong> et <strong>réparation téléphones</strong>. Tu veux lequel ?`;
    }

    // goal / after
    if (q.includes("objectif") || q.includes("apres") || q.includes("après") || q.includes("bts") || q.includes("suite")) {
      return profile.goal;
    }

    // contact
    if (q.includes("contact") || q.includes("mail") || q.includes("email") || q.includes("tel") || q.includes("telephone")) {
      return profile.contact;
    }

    // city
    if (q.includes("ville") || q.includes("ou tu habites") || q.includes("où tu habites") || q.includes("saint")) {
      return `J’habite vers <strong>${profile.city}</strong>.`;
    }

    // fallback (smart)
    return `Je peux répondre sur : <strong>CIEL</strong>, <strong>stages</strong>, <strong>compétences</strong>, <strong>objectifs</strong> ou <strong>contact</strong>.  
Essaye : “Parle-moi de ton stage fibre” ou “C’est quoi tes compétences web ?”`;
  }

  if (iaForm && iaInput) {
    iaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = iaInput.value.trim();
      if (!q) return;

      addMsg(q.replace(/</g, "&lt;"), "user");

      const rep = answer(q);
      setTimeout(() => addMsg(rep, "bot"), 220);

      iaInput.value = "";
      iaInput.focus();
    });
  }
})();
