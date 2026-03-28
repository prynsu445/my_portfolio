/* ============================================================
   PRIYANSHU SHARMA PORTFOLIO — script.js
   Vanilla JS: cursor, particles, scroll, counters, sidebar,
   theme, filters, tilt, reveal
   ============================================================ */
'use strict';

/* ── HELPERS ──────────────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ── CURSOR ───────────────────────────────────────────────── */
(function initCursor() {
  let cx = -40, cy = -40, cx2 = -40, cy2 = -40;
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
  });
  function frame() {
    cx2 += (cx - cx2) * 0.12;
    cy2 += (cy - cy2) * 0.12;
    document.documentElement.style.setProperty('--cx',  cx  + 'px');
    document.documentElement.style.setProperty('--cy',  cy  + 'px');
    document.documentElement.style.setProperty('--cx2', cx2 + 'px');
    document.documentElement.style.setProperty('--cy2', cy2 + 'px');
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ── PARTICLE CANVAS ──────────────────────────────────────── */
(function initCanvas() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, parts = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); build(); });

  class P {
    constructor() { this.reset(true); }
    reset(fresh) {
      this.x  = Math.random() * W;
      this.y  = fresh ? Math.random() * H : H + 5;
      this.r  = Math.random() * 1.4 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.a  = Math.random() * 0.4 + 0.05;
      this.c  = Math.random() > 0.8
        ? `rgba(255,90,31,${this.a})`
        : `rgba(255,255,255,${this.a * 0.4})`;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -5) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.c;
      ctx.fill();
    }
  }

  function build() {
    const n = Math.floor(W * H / 12000);
    parts = Array.from({ length: n }, () => new P());
  }
  build();

  function loop() {
    ctx.clearRect(0, 0, W, H);
    parts.forEach(p => { p.update(); p.draw(); });
    // connections
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const dx = parts[i].x - parts[j].x;
        const dy = parts[i].y - parts[j].y;
        const d  = dx * dx + dy * dy;
        if (d < 7000) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - d / 7000)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(parts[i].x, parts[i].y);
          ctx.lineTo(parts[j].x, parts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── HERO DOM PARTICLES ───────────────────────────────────── */
(function initHeroParticles() {
  const wrap = $('#heroParticles');
  if (!wrap) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('span');
    p.className = 'hp';
    const sz = Math.random() * 5 + 2;
    p.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${Math.random() * 100}%; top:${Math.random() * 100}%;
      --dur:${Math.random() * 4 + 5}s;
      --del:${Math.random() * 6}s;
      filter:blur(${Math.random() * 2}px);
    `;
    wrap.appendChild(p);
  }
})();

/* ── SCROLL SYSTEM ────────────────────────────────────────── */
const scrollWrap   = $('#scrollWrap');
const slides       = $$('.slide');
const sideDots     = $$('.side-dot');
const navLinks     = $$('.nav-link');
const progressBar  = $('#scrollProgress');
let currentSlide   = 0;
let countersRun    = false;
let skillsRun      = false;

function setActive(i) {
  currentSlide = i;
  sideDots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  navLinks.forEach((l) => {
    const t = parseInt(l.dataset.slide);
    l.classList.toggle('active', t === i);
  });
}

// Intersection observer for reveals + counters + skills
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const idx = slides.indexOf(el);

    if (idx >= 0) setActive(idx);

    // Reveal children
    el.querySelectorAll('.reveal').forEach(r => r.classList.add('in'));

    // Counters
    if (el.id === 'slide2' && !countersRun) {
      countersRun = true;
      runCounters();
    }
    // Skill bars
    if (el.id === 'slide4' && !skillsRun) {
      skillsRun = true;
      setTimeout(() => {
        $$('.skill-card').forEach(c => c.classList.add('in'));
      }, 300);
    }
  });
}, { root: scrollWrap, threshold: 0.35 });

slides.forEach(s => io.observe(s));

// Side dot click
sideDots.forEach(d => {
  d.addEventListener('click', () => {
    slides[+d.dataset.target].scrollIntoView({ behavior: 'smooth' });
  });
});

// Nav link click
navLinks.forEach(l => {
  l.addEventListener('click', e => {
    e.preventDefault();
    const idx = +l.dataset.slide;
    slides[idx].scrollIntoView({ behavior: 'smooth' });
  });
});

// Scroll progress bar
scrollWrap.addEventListener('scroll', () => {
  const max  = scrollWrap.scrollHeight - scrollWrap.clientHeight;
  const pct  = max > 0 ? (scrollWrap.scrollTop / max) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
});

// Keyboard nav
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' && currentSlide < slides.length - 1)
    slides[currentSlide + 1].scrollIntoView({ behavior: 'smooth' });
  if (e.key === 'ArrowUp' && currentSlide > 0)
    slides[currentSlide - 1].scrollIntoView({ behavior: 'smooth' });
  if (e.key === 'Escape') closeSidebar();
});

/* ── COUNTER ANIMATION ────────────────────────────────────── */
function runCounters() {
  $$('.counter').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const decimal = el.dataset.decimal === 'true';
    const dur     = 1800;
    const start   = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3); // ease out cubic
      const v = e * target;
      el.textContent = decimal ? (v / 10).toFixed(1) : Math.floor(v);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = decimal ? (target / 10).toFixed(1) : target;
    }
    requestAnimationFrame(tick);
  });
}

/* ── THEME TOGGLE ─────────────────────────────────────────── */
const html      = document.documentElement;
const themeBtn  = $('#themeBtn');
const themeIcon = $('#themeIcon');

const saved = localStorage.getItem('ps-theme') || 'dark';
html.setAttribute('data-theme', saved);
if (themeIcon) themeIcon.textContent = saved === 'dark' ? '☽' : '☀';

themeBtn && themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('ps-theme', next);
  if (themeIcon) themeIcon.textContent = next === 'dark' ? '☽' : '☀';
  // flash
  const f = document.createElement('div');
  f.style.cssText = `position:fixed;inset:0;z-index:9999;
    background:${next==='light'?'#f4f3ef':'#0b0b0f'};
    pointer-events:none;opacity:.25;transition:opacity .4s;`;
  document.body.appendChild(f);
  setTimeout(() => { f.style.opacity = '0'; }, 20);
  setTimeout(() => f.remove(), 440);
});

/* ── SIDEBAR ──────────────────────────────────────────────── */
const sidebar   = $('#sidebar');
const sbOverlay = $('#sbOverlay');

function openSidebar() {
  sidebar.classList.add('open');
  sbOverlay.classList.add('on');
  document.body.style.overflow = 'hidden';
  // stagger items
  $$('.sb-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(24px)';
    setTimeout(() => {
      item.style.transition = 'opacity .4s ease, transform .4s cubic-bezier(.34,1.56,.64,1)';
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 120 + i * 65);
  });
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sbOverlay.classList.remove('on');
  document.body.style.overflow = '';
}

$('#contactOpenBtn')  && $('#contactOpenBtn').addEventListener('click',  openSidebar);
$('#heroContactBtn')  && $('#heroContactBtn').addEventListener('click',  openSidebar);
$('#sbClose')         && $('#sbClose').addEventListener('click',         closeSidebar);
$('#sbOverlay')       && $('#sbOverlay').addEventListener('click',       closeSidebar);

/* ── PROJECT FILTER ───────────────────────────────────────── */
const filterBtns  = $$('.filter-btn');
const projectCards = $$('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;
      card.style.transition = 'opacity .35s ease, transform .35s ease';
      if (show) {
        card.style.opacity = '0';
        card.style.transform = 'scale(.95)';
        card.classList.remove('hidden');
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 30);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(.95)';
        setTimeout(() => card.classList.add('hidden'), 360);
      }
    });
  });
});

/* ── SKILL CARD 3D TILT ───────────────────────────────────── */
$$('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateY(${x*10}deg) rotateX(${-y*7}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── PROJECT CARD TILT ────────────────────────────────────── */
projectCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x*6}deg) rotateX(${-y*4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── PARALLAX ON SLIDE 2 ──────────────────────────────────── */
scrollWrap.addEventListener('scroll', () => {
  const s2 = $('#slide2');
  if (!s2) return;
  const rect = s2.getBoundingClientRect();
  const vH   = window.innerHeight;
  const prog = (vH - rect.top) / (vH + rect.height);
  const dg   = s2.querySelector('.desk-lamp-glow');
  if (dg) dg.style.transform = `translateY(${(prog - .5) * 28}px)`;
});

/* ── ORBIT SYSTEM: ensure ring-inner animation ────────────── */
(function fixOrbitInner() {
  // The ring-inner uses a separate keyframe; verify DOM is ready
  const ri = $('.ring-inner');
  if (ri) {
    ri.style.animationPlayState = 'running';
  }
})();

/* ── CV DOWNLOAD PULSE ────────────────────────────────────── */
(function cvPulse() {
  const btns = $$('.btn-primary, .sb-cv-btn');
  btns.forEach(btn => {
    setInterval(() => {
      btn.style.transition = 'box-shadow .4s ease';
      btn.style.boxShadow  = '0 0 50px rgba(255,90,31,.7)';
      setTimeout(() => {
        btn.style.boxShadow = '';
      }, 500);
    }, 3000);
  });
})();

/* ── DONE ─────────────────────────────────────────────────── */
console.log('%c[PS] Portfolio ✦ Loaded', 'color:#ff5a1f;font-size:13px;font-weight:900;font-family:monospace;');