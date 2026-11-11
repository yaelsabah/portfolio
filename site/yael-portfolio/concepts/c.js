// Concept C — Playground. Builds the project prints from scripts/projects.js and runs the play:
// the name gets heavier near the pointer (and breathes on its own on touch screens), the
// prints and stickers can be picked up and thrown, the desk takes the colour of the print
// you touch, and the letters of "Keep in touch" hop.
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wide = () => window.innerWidth > 820;
  const projects = window.PROJECTS || [];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---- the name: one elastic line ----
  const nameIn = document.querySelector('.name-in');
  const words = nameIn.textContent.trim().split(' ');
  let n = 0;
  nameIn.innerHTML = words.map((w) => `<span class="ln">${[...w].map((c) => `<span class="c" style="--i:${n++}">${c}</span>`).join('')}</span>`).join('<span class="sp"></span>');
  nameIn.style.display = 'inline-flex';
  document.querySelectorAll('.name .ln').forEach((l) => { l.style.display = 'inline-flex'; l.style.alignItems = 'flex-end'; });
  const chars = [...document.querySelectorAll('.name .c')];
  const nameEl = document.querySelector('.name');
  const W_MIN = 260, W_MAX = 800;

  // size the name so that, at its heaviest, it exactly fills the width
  function fit() {
    nameEl.style.fontSize = '';
    chars.forEach((c) => c.style.setProperty('--w', W_MAX));
    const avail = nameEl.clientWidth;
    // on phones the two words stack, so the longer word sets the size
    const w = wide() ? nameIn.getBoundingClientRect().width
      : Math.max(...[...nameIn.querySelectorAll('.ln')].map((l) => l.getBoundingClientRect().width));
    const fs = parseFloat(getComputedStyle(nameEl).fontSize);
    nameEl.style.fontSize = Math.min(fs * avail / w, window.innerHeight * 0.62).toFixed(1) + 'px';
  }
  let px = -1, py = -1, live = false, t0 = performance.now();
  function nameFrame(now) {
    const t = (now - t0) / 1000;
    chars.forEach((c, i) => {
      let k;
      if (live) {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        k = 1 - clamp(d / (window.innerWidth * 0.34), 0, 1);
        k = k * k * (3 - 2 * k);
      } else k = 0.5 + 0.5 * Math.sin(t * 1.3 - i * 0.55);    // no pointer: a slow wave
      const cur = +c.dataset.k || 0;
      const next = cur + (k - cur) * 0.14;
      c.dataset.k = next;
      c.style.setProperty('--w', (W_MIN + (W_MAX - W_MIN) * next).toFixed(0));
      c.style.setProperty('--sy', (1 + next * 0.07).toFixed(3));
    });
    if (nameEl.getBoundingClientRect().bottom > 0) requestAnimationFrame(nameFrame); else running = false;
  }
  let running = false;
  const startName = () => { if (!running && !reduce) { running = true; requestAnimationFrame(nameFrame); } };
  window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { px = e.clientX; py = e.clientY; live = true; } }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { live = false; });
  window.addEventListener('scroll', startName, { passive: true });
  window.addEventListener('resize', fit);
  const boot = () => {
    fit();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('loaded')));
    setTimeout(() => { root.classList.add('settled'); startName(); }, 1700);
  };
  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(boot); else boot();

  // ---- the prints on the desk ----
  const COLORS = [['#FF5A36', '#17130E'], ['#2B46F0', '#F3EDE0'], ['#C9F25C', '#17130E'], ['#FFB3D6', '#17130E']];
  const SPOTS = [['2%', '7%', -5], ['31%', '25%', 3.5], ['61%', '3%', -2.5], ['45%', '40%', 4]];
  const desk = document.querySelector('.desk'), stage = document.querySelector('.stage');
  let z = 1;
  projects.forEach((p, i) => {
    const [c, cf] = COLORS[i % COLORS.length], [l, t, rot] = SPOTS[i % SPOTS.length];
    const a = document.createElement('a');
    a.className = 'print';
    a.href = window.caseStudyUrl(p.slug);
    a.draggable = false;
    a.style.cssText = `--l:${l};--t:${t};--rot:${rot}deg;--mrot:${i % 2 ? 1.5 : -1.5}deg;--c:${c};--cf:${cf};--i:${i};z-index:${z++}`;
    a.dataset.rot = rot;
    a.innerHTML = `
      <span class="print-img"><span class="print-no">${String(i + 1).padStart(2, '0')}</span><img src="${p.image}" alt="${esc(p.alt || '')}" draggable="false" style="object-position:${p.mobileFocus || '50% 50%'}"></span>
      <span class="print-name">${esc(p.name)}</span>
      <span class="print-meta"><span>${esc(p.company)}</span><span>${esc(p.year)}</span><span>${esc(p.industry)}</span></span>
      <span class="print-desc">${esc(p.outcome)}</span>
      <span class="print-go">Read the case study<svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 9h13M10 4l5 5-5 5"/></svg></span>`;
    const tint = () => { desk.style.setProperty('--bg', c); desk.style.setProperty('--fg', cf); };
    a.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') tint(); });
    a.addEventListener('focus', tint);
    a._tint = tint;
    stage.append(a);
  });
  const untint = () => { desk.style.removeProperty('--bg'); desk.style.removeProperty('--fg'); };
  stage.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') untint(); });
  stage.addEventListener('focusout', untint);

  // pick things up: drag with a little tilt, let go with a glide
  function grabbable(el, { tilt = true, bounds = null } = {}) {
    let x = 0, y = 0, sx = 0, sy = 0, ox = 0, oy = 0, vx = 0, vy = 0, lx = 0, ly = 0, lt = 0, moved = false, id = null, raf = 0;
    const base = parseFloat(el.dataset.rot || 0);
    const set = (r) => {
      el.style.setProperty('--dx', x.toFixed(1) + 'px'); el.style.setProperty('--dy', y.toFixed(1) + 'px');
      if (tilt) el.style.setProperty('--rot', r.toFixed(2) + 'deg');
    };
    el.addEventListener('pointerdown', (e) => {
      if (e.button || (bounds && !(fine && wide()))) return;
      id = e.pointerId; moved = false; cancelAnimationFrame(raf);
      sx = e.clientX; sy = e.clientY; ox = x; oy = y; lx = sx; ly = sy; lt = e.timeStamp; vx = vy = 0;
      el.classList.remove('glide');
      if (bounds) el.style.zIndex = ++z;
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      if (!moved) { moved = true; el.setPointerCapture(id); el.classList.add('held'); }
      const dt = Math.max(1, e.timeStamp - lt);
      vx = vx * 0.6 + ((e.clientX - lx) / dt) * 0.4 * 16; vy = vy * 0.6 + ((e.clientY - ly) / dt) * 0.4 * 16;
      lx = e.clientX; ly = e.clientY; lt = e.timeStamp;
      x = ox + dx; y = oy + dy;
      set(base + clamp(vx * 0.35, -14, 14));
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      if (!moved) return;
      el.classList.remove('held'); el.classList.add('glide');
      const glide = () => {
        vx *= 0.93; vy *= 0.93; x += vx; y += vy;
        if (bounds) {
          const b = bounds.getBoundingClientRect(), r = el.getBoundingClientRect();
          if (r.left < b.left - r.width * 0.5) { x += b.left - r.width * 0.5 - r.left; vx = Math.abs(vx) * 0.5; }
          if (r.right > b.right + r.width * 0.5) { x -= r.right - b.right - r.width * 0.5; vx = -Math.abs(vx) * 0.5; }
          if (r.top < b.top - 40) { y += b.top - 40 - r.top; vy = Math.abs(vy) * 0.5; }
          if (r.bottom > b.bottom + 40) { y -= r.bottom - b.bottom - 40; vy = -Math.abs(vy) * 0.5; }
        }
        set(base + clamp(vx * 0.35, -14, 14));
        if (Math.abs(vx) + Math.abs(vy) > 0.25) raf = requestAnimationFrame(glide);
        else { el.classList.remove('glide'); set(base); }
      };
      raf = requestAnimationFrame(glide);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    // a drag is not a click
    el.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener('dragstart', (e) => e.preventDefault());
  }
  if (!reduce) {
    document.querySelectorAll('.print').forEach((el) => grabbable(el, { bounds: desk }));
    document.querySelectorAll('.grab').forEach((el) => grabbable(el, { tilt: false }));
  }

  // ---- reveal on scroll ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      if (e.target === stage) setTimeout(() => stage.classList.add('ready'), 1500);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  [stage, document.querySelector('.statement')].forEach((el) => io.observe(el));

  // ---- scroll: current section, and on touch screens the desk takes the colour of the print in view ----
  const navLinks = [...document.querySelectorAll('.nav a')];
  const secs = navLinks.map((a) => document.querySelector(a.getAttribute('href')));
  const prints = [...document.querySelectorAll('.print')];
  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = window.innerHeight;
    let cur = -1;
    secs.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.5) cur = i; });
    navLinks.forEach((a, i) => a.toggleAttribute('aria-current', i === cur));
    if (!(fine && wide())) {
      let best = null, bd = Infinity;
      prints.forEach((p) => { const r = p.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - vh / 2); if (d < bd) { bd = d; best = p; } });
      if (best && bd < vh * 0.5) best._tint(); else untint();
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  // ---- "Keep in touch": letters that hop ----
  document.querySelectorAll('[data-hop]').forEach((el) => {
    el.innerHTML = el.textContent.split(' ').map((w) =>
      `<span style="display:inline-block;white-space:nowrap">${[...w].map((c) => `<span class="h">${c}</span>`).join('')}</span>`).join(' ');
    if (reduce) return;
    const hs = [...el.querySelectorAll('.h')];
    const hop = (h) => {
      h.style.setProperty('--hr', (Math.random() * 14 - 7).toFixed(1) + 'deg');
      h.classList.add('up');
      setTimeout(() => h.classList.remove('up'), 190);
    };
    hs.forEach((h) => h.addEventListener('pointerenter', () => hop(h)));
    const wave = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) hs.forEach((h, i) => setTimeout(() => hop(h), 300 + i * 60)); });
    }, { threshold: 0.6 });
    wave.observe(el);
  });
})();
