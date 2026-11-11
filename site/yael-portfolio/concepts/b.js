// Concept B — Quiet. Builds the index of work from scripts/projects.js and runs the details:
// the word "complex" starts tangled and sets itself straight, words come into focus,
// a picture follows the pointer over the index, labels decode on hover, a ruler measures
// the scroll, and the email address can be copied.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const projects = window.PROJECTS || [];
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---- the index ----
  const index = document.querySelector('.index');
  const peek = document.querySelector('.peek'), peekIn = document.querySelector('.peek-in');
  document.querySelector('.count').textContent = `(${pad(projects.length)})`;
  projects.forEach((p, i) => {
    const a = document.createElement('a');
    a.className = 'row';
    a.href = window.caseStudyUrl(p.slug);
    a.style.setProperty('--i', i);
    a.dataset.i = i;
    a.innerHTML = `
      <span class="mono">${pad(i + 1)}</span>
      <span class="row-main">
        <span class="row-name">${esc(p.name)}</span>
        <span class="row-more"><div><p>${esc(p.outcome)}</p></div></span>
        <span class="row-img"><img src="${p.image}" alt="${esc(p.alt || '')}" loading="lazy" style="object-position:${p.mobileFocus || '50% 50%'}"></span>
      </span>
      <span class="mono c-company">${esc(p.company)}</span>
      <span class="mono c-type">${esc(p.industry)}</span>
      <span class="mono c-year">${esc(p.year)}</span>
      <span class="mono row-cta">Read the case study</span>
      <svg class="row-go" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M4 14 14 4M6 4h8v8"/></svg>`;
    index.append(a);
    const img = new Image();
    img.src = p.image; img.alt = '';
    img.style.objectPosition = p.mobileFocus || '50% 50%';
    peekIn.append(img);
  });

  // ---- words come into focus ----
  document.querySelectorAll('[data-words]').forEach((el) => {
    let i = 0;
    const wrap = (text) => text.split(/(\s+)/).map((part) =>
      !part ? '' : /^\s+$/.test(part) ? ' ' : `<span class="word" style="--i:${i++}">${esc(part)}</span>`).join('');
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) { const t = document.createElement('template'); t.innerHTML = wrap(n.textContent); n.replaceWith(t.content); }
      else if (n.nodeType === 1) { n.classList.add('word'); n.style.setProperty('--i', i++); }
    });
    el.classList.add('reveal');
  });
  document.querySelectorAll('.index, .cv').forEach((el) => el.classList.add('reveal'));
  document.querySelectorAll('.cv li').forEach((li, i) => li.style.setProperty('--i', i));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---- "complex": tangled letters that set themselves straight ----
  const tangle = document.querySelector('.tangle');
  if (tangle) {
    tangle.innerHTML = [...tangle.textContent].map((c, j) => `<span class="l" style="--j:${j}">${c}</span>`).join('');
    const ls = [...tangle.children];
    const rnd = (a) => (Math.random() * 2 - 1) * a;
    const mess = () => {
      tangle.classList.add('messy');
      ls.forEach((l) => {
        l.style.setProperty('--tx', rnd(0.09).toFixed(3) + 'em');
        l.style.setProperty('--ty', rnd(0.2).toFixed(3) + 'em');
        l.style.setProperty('--tr', rnd(32).toFixed(1) + 'deg');
      });
    };
    const tidy = () => {
      tangle.classList.remove('messy');
      ls.forEach((l) => { l.style.setProperty('--tx', '0em'); l.style.setProperty('--ty', '0em'); l.style.setProperty('--tr', '0deg'); });
    };
    if (!reduce) {
      mess();
      setTimeout(tidy, 1900);
      tangle.addEventListener('pointerenter', mess);
      tangle.addEventListener('pointerleave', tidy);
    }
  }

  // ---- the picture that follows the pointer ----
  if (fine && !reduce) {
    const imgs = [...peekIn.children];
    let tx = 0, ty = 0, x = 0, y = 0, r = 0, run = false, shown = false;
    const tick = () => {
      const dx = tx - x;
      x += dx * 0.12; y += (ty - y) * 0.12;
      r += (Math.max(-9, Math.min(9, dx * 0.06)) - r) * 0.15;
      peek.style.setProperty('--x', x.toFixed(1) + 'px');
      peek.style.setProperty('--y', y.toFixed(1) + 'px');
      peek.style.setProperty('--r', r.toFixed(2) + 'deg');
      if (Math.abs(dx) + Math.abs(ty - y) + Math.abs(r) > 0.1) requestAnimationFrame(tick); else run = false;
    };
    const place = (cx, cy) => {
      const w = peek.offsetWidth, h = peek.offsetHeight;
      tx = Math.min(window.innerWidth - w - 28, Math.max(cx + 40, window.innerWidth * 0.46));
      ty = Math.max(70, Math.min(window.innerHeight - h - 20, cy - h * 0.62));
      if (!shown) { x = tx; y = ty; }
      if (!run) { run = true; requestAnimationFrame(tick); }
    };
    const show = (row) => {
      imgs.forEach((im, i) => im.classList.toggle('on', i === +row.dataset.i));
      peek.classList.add('on'); shown = true;
    };
    const hide = () => { peek.classList.remove('on'); shown = false; };
    index.addEventListener('pointermove', (e) => {
      const row = e.target.closest('.row');
      if (!row) { hide(); return; }
      place(e.clientX, e.clientY);
      show(row);
    }, { passive: true });
    index.addEventListener('pointerleave', hide);
    index.addEventListener('focusin', (e) => {
      const row = e.target.closest('.row');
      if (!row || !row.matches(':focus-visible')) return;
      const b = row.getBoundingClientRect();
      place(b.left + b.width * 0.5, b.top + b.height / 2);
      show(row);
    });
    index.addEventListener('focusout', hide);
    window.addEventListener('scroll', hide, { passive: true });
  }

  // ---- labels that decode on hover ----
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+—';
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    const text = el.textContent;
    let raf = 0;
    el.addEventListener('pointerenter', () => {
      if (reduce || !fine) return;
      const t0 = performance.now(), D = 420;
      el.style.width = el.offsetWidth + 'px'; el.style.display = 'inline-block'; el.style.whiteSpace = 'nowrap';
      cancelAnimationFrame(raf);
      const step = (now) => {
        const k = Math.min(1, (now - t0) / D), done = Math.floor(k * text.length);
        el.textContent = [...text].map((c, i) => (i < done || c === ' ') ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
        if (k < 1) raf = requestAnimationFrame(step); else { el.textContent = text; el.style.width = ''; }
      };
      raf = requestAnimationFrame(step);
    });
  });

  // ---- ruler and current section ----
  const mark = document.querySelector('.ruler-mark'), num = document.querySelector('.ruler-n');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const secs = navLinks.map((a) => document.querySelector(a.getAttribute('href')));
  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = window.innerHeight, max = document.documentElement.scrollHeight - vh;
    const k = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    mark.style.setProperty('--ry', (k * (vh - 1)).toFixed(1) + 'px');
    num.textContent = String(Math.round(k * 100)).padStart(3, '0');
    num.style.top = k > 0.97 ? '-16px' : k < 0.03 ? '2px' : '-7px';
    let cur = -1;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < vh * 0.5) cur = i; });
    navLinks.forEach((a, i) => a.toggleAttribute('aria-current', i === cur));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  // ---- copy the email address ----
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Copied'; }
      catch (e) { btn.textContent = 'Press ⌘C'; }
      btn.classList.add('done');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
    });
  });
})();
