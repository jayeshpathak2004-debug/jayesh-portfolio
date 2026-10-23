```javascript
// ============================================
// JAYESH PATHAK — INTERACTIVE PORTFOLIO
// Animated particles + 3D portrait + UI effects
// ============================================

(() => {
  const canvas = document.getElementById("space-canvas");
  const scene = canvas?.parentElement;
  const ctx = canvas?.getContext("2d");
  const orb = document.getElementById("profile-orb");

  if (!canvas || !scene || !ctx) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let particles = [];
  let animationFrame;
  let width = 0;
  let height = 0;
  let tick = 0;
  let mouseX = 0;
  let mouseY = 0;

  const PARTICLE_COUNT = 95;
  const CONNECTION_DISTANCE = 105;

  // Create the animated particle field
  function resizeCanvas() {
    const rect = scene.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width;
    height = rect.height;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.7 + Math.random() * 1.6,
      speed: 0.12 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? "70, 165, 255" : "169, 112, 255"
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    const points = particles.map((p) => {
      const wave = reducedMotion ? 0 : Math.sin(tick * p.speed + p.phase);

      return {
        x: p.x + wave * 9 + mouseX * 14,
        y: p.y + Math.cos(tick * p.speed + p.phase) * (
          reducedMotion ? 0 : 7
        ) + mouseY * 12,
        radius: p.radius,
        color: p.color
      };
    });

    // Glowing lines between nearby particles
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        if (distance < CONNECTION_DISTANCE) {
          const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.22;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(91, 151, 255, ${opacity})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }

    // Draw the particles with a subtle glow
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, 0.8)`;
      ctx.shadowColor = `rgb(${p.color})`;
      ctx.shadowBlur = 10;
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    tick++;

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(drawParticles);
    }
  }

  // Make the portrait tilt slightly with the pointer
  function movePortrait(event) {
    if (!orb || reducedMotion || window.innerWidth < 700) return;

    const rect = scene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    orb.style.transform =
      `translate(-50%, -50%) ` +
      `rotateY(${x * 12}deg) ` +
      `rotateX(${-y * 10}deg)`;
  }

  function resetPortrait() {
    mouseX = 0;
    mouseY = 0;

    if (orb) {
      orb.style.transform = "translate(-50%, -50%)";
    }
  }

  scene.addEventListener("pointermove", (event) => {
    const rect = scene.getBoundingClientRect();

    mouseX = (event.clientX - rect.left) / rect.width - 0.5;
    mouseY = (event.clientY - rect.top) / rect.height - 0.5;

    movePortrait(event);
  }, { passive: true });

  scene.addEventListener("pointerleave", resetPortrait, {
    passive: true
  });

  resizeCanvas();
  drawParticles();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resizeCanvas();

    if (reducedMotion) {
      drawParticles();
    } else {
      drawParticles();
    }
  }, { passive: true });
})();

// ============================================
// NAVIGATION, ICONS AND SCROLL REVEAL
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  toggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.innerHTML = isOpen
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");

      if (toggle) {
        toggle.innerHTML = '<i data-lucide="menu"></i>';

        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    });
  });

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // 3D tilt on project and skill cards
  const cards = document.querySelectorAll(
    ".project-card, .skill-card, .stat-card, .growth-card"
  );

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (
        window.innerWidth < 700 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `perspective(900px) ` +
        `rotateY(${x * 5}deg) ` +
        `rotateX(${-y * 5}deg) ` +
        `translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
});
```
