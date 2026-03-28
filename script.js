/* ============================================================
   PORTFOLIO — script.js
   Vanilla JS: particles, scroll, counter, sidebar, theme
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. PARTICLE CANVAS BACKGROUND
     ========================================================= */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.color = Math.random() > 0.85
        ? `rgba(255,90,31,${this.alpha})`
        : `rgba(255,255,255,${this.alpha * 0.5})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => new Particle());
  }
  initParticles();

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // draw faint connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - dist/90)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  /* =========================================================
     2. HERO FLOATING PARTICLES (DOM)
     ========================================================= */
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = 'hero-particle';
      const size = Math.random() * 5 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        --dur:${Math.random()*4+4}s;
        --delay:${Math.random()*5}s;
        filter: blur(${Math.random()*2}px);
        opacity: ${Math.random()*0.5+0.1};
      `;
      heroParticles.appendChild(p);
    }
  }

  /* =========================================================
     3. SCROLL SNAP — ACTIVE DOT SYNC
     ========================================================= */
  const scrollContainer = document.getElementById('scrollContainer');
  const dots = document.querySelectorAll('.dot');
  const slides = document.querySelectorAll('.slide');

  function updateDots(index) {
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.slide);
      slides[idx].scrollIntoView({ behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(slides).indexOf(entry.target);
          if (idx >= 0) updateDots(idx);

          // trigger reveal-up inside visible slide
          entry.target.querySelectorAll('.reveal-up').forEach(el => {
            el.classList.add('visible');
          });

          // trigger counter if slide2
          if (entry.target.id === 'slide2') animateCounters();
        }
      });
    },
    { root: scrollContainer, threshold: 0.4 }
  );

  slides.forEach(s => observer.observe(s));

  /* =========================================================
     4. COUNTER ANIMATION
     ========================================================= */
  let countersRun = false;

  function animateCounters() {
    if (countersRun) return;
    countersRun = true;

    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }

  /* =========================================================
     5. THEME TOGGLE
     ========================================================= */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);

    // Flash transition overlay
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:${next==='light'?'#fff':'#0b0b0f'};
      pointer-events:none;
      animation:flashFade 0.4s ease forwards;
    `;
    document.head.insertAdjacentHTML('beforeend', `
      <style id="flashStyle">
        @keyframes flashFade{from{opacity:0.3}to{opacity:0}}
      </style>
    `);
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.remove();
      document.getElementById('flashStyle')?.remove();
    }, 400);
  });

  /* =========================================================
     6. CONTACT SIDEBAR
     ========================================================= */
  const contactBtn    = document.getElementById('contactBtn');
  const sidebar       = document.getElementById('contactSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarClose  = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  contactBtn.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  // Animate sidebar contact items on open
  contactBtn.addEventListener('click', () => {
    const items = document.querySelectorAll('.contact-item');
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(30px)';
      setTimeout(() => {
        item.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 100 + i * 80);
    });
  });

  /* =========================================================
     7. KEYBOARD NAVIGATION
     ========================================================= */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();

    const current = getCurrentSlide();
    if (e.key === 'ArrowDown' && current < slides.length - 1) {
      slides[current + 1].scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp' && current > 0) {
      slides[current - 1].scrollIntoView({ behavior: 'smooth' });
    }
  });

  function getCurrentSlide() {
    const scrollTop = scrollContainer.scrollTop;
    const slideH = window.innerHeight;
    return Math.round(scrollTop / slideH);
  }

  /* =========================================================
     8. PARALLAX ON MENTORIAS BACKGROUND
     ========================================================= */
  scrollContainer.addEventListener('scroll', () => {
    const slide2 = document.getElementById('slide2');
    const rect = slide2.getBoundingClientRect();
    const slideH = window.innerHeight;
    const progress = (slideH - rect.top) / (slideH + rect.height);

    const deskScene = slide2.querySelector('.desk-scene');
    if (deskScene) {
      deskScene.style.transform = `translateY(${(progress - 0.5) * 30}px)`;
    }
  });

  /* =========================================================
     9. LETTER CURSOR GLOW (Hero)
     ========================================================= */
  document.querySelectorAll('.hero-letter').forEach(letter => {
    letter.addEventListener('mouseenter', () => {
      letter.style.filter = 'drop-shadow(0 0 20px rgba(255,90,31,0.7))';
    });
    letter.addEventListener('mouseleave', () => {
      letter.style.filter = '';
    });
  });

  /* =========================================================
     10. SERVICE CARD TILT
     ========================================================= */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x*8}deg) rotateX(${-y*6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* =========================================================
     DONE
     ========================================================= */
  console.log('%c[PRSHN] Portfolio loaded ✓', 'color:#ff5a1f;font-size:14px;font-weight:bold;');
});