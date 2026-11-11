// Concept A — Editorial. Builds the features from scripts/projects.js and runs the motion:
// letters and words rising out of a mask, pictures unveiling with a slow drift, a page
// number in the header, and a round "Read" badge that follows the pointer over pictures.
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const projects = window.PROJECTS || [];
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // first word upright, the rest in italic
  const title = (name) => { const [a, ...r] = name.split(' '); return esc(a) + (r.length ? ' <em>' + esc(r.join(' ')) + '</em>' : ''); };

  // ---- build the contents list and the features ----
  const list = document.querySelector('.contents-list');
  const features = document.querySelector('.features');
  projects.forEach((p, i) => {
    const url = window.caseStudyUrl(p.slug);
    const li = document.createElement('li');
    li.innerHTML = `<a href="#f-${p.slug}"><span class="n">${pad(i + 1)}</span><span class="t">${esc(p.name)}</span><span class="y">${esc(p.year)}</span></a>`;
    list.append(li);
    const art = document.createElement('article');
    art.className = 'feature';
    art.id = 'f-' + p.slug;
    art.dataset.folio = p.name;
    art.innerHTML = `
      <div class="f-head label"><span class="f-num">${pad(i + 1)}</span><span>${esc(p.company)} — ${esc(p.year)}</span></div>
      <h2 class="f-title" data-split><a href="${url}">${title(p.name)}</a></h2>
      <a class="f-media reveal" href="${url}" tabindex="-1" aria-hidden="true">
        <div class="f-frame"><img src="${p.image}" alt="" loading="${i ? 'lazy' : 'eager'}" style="object-position:${p.mobileFocus || '50% 50%'}"></div>
        <div class="f-cap"><span>${esc(p.alt || '')}</span><span>${pad(i + 1)}/${pad(projects.length)}</span></div>
      </a>
      <div class="f-text reveal">
        <p class="f-deck fade">${esc(p.outcome)}</p>
        <dl class="f-meta fade">
          <dt>Company</dt><dd>${esc(p.company)}</dd>
          <dt>Year</dt><dd>${esc(p.year)}</dd>
          <dt>Role</dt><dd>${esc(p.role)}, ${esc(p.industry)}</dd>
        </dl>
        <a class="f-link fade" href="${url}">Read the case study <span aria-hidden="true">→</span></a>
      </div>`;
    features.append(art);
  });

  // ---- split text into masked pieces ----
  document.querySelectorAll('.mast-w').forEach((w) => {
    w.innerHTML = [...w.textContent].map((c, i) => `<span class="ch" style="--i:${i + (w.classList.contains('mast-b') ? 3 : 0)}">${c}</span>`).join('');
  });
  document.querySelectorAll('[data-split]').forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.innerHTML = `<span style="--i:${i++}">${esc(part)}</span>`;
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    el.classList.add('reveal');
  });
  document.querySelectorAll('.cv tbody tr, .contact-row').forEach((el) => el.classList.add('fade', 'reveal'));

  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('loaded')));

  // ---- reveal on scroll ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---- scroll: progress line, masthead drift, picture drift, page number ----
  const progress = document.querySelector('.progress');
  const mastA = document.querySelector('.mast-a'), mastB = document.querySelector('.mast-b');
  const imgs = [...document.querySelectorAll('.f-frame img')];
  const pages = [...document.querySelectorAll('[data-folio]')];
  const folio = document.querySelector('.folio'), folioN = document.querySelector('.folio-n'), folioT = document.querySelector('.folio-t');
  const navLinks = [...document.querySelectorAll('.nav a')];
  let page = -1, ticking = false;

  function frame() {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (!reduce && y < vh * 1.2) {
      mastA.style.transform = `translate3d(${(-y * 0.12).toFixed(1)}px,0,0)`;
      mastB.style.transform = `translate3d(${(y * 0.12).toFixed(1)}px,0,0)`;
    }
    if (!reduce) imgs.forEach((img) => {
      const r = img.parentNode.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const t = (r.top + r.height / 2 - vh / 2) / vh;       // -1 … 1 across the screen
      img.style.setProperty('--py', (t * -r.height * 0.08).toFixed(1) + 'px');
    });
    let now = 0;
    pages.forEach((el, i) => { if (el.getBoundingClientRect().top < vh * 0.45) now = i; });
    if (now !== page) {
      page = now;
      folioN.textContent = pad(now + 1);
      folioT.textContent = pages[now].dataset.folio;
      folio.classList.remove('flip'); void folio.offsetWidth; folio.classList.add('flip');
      const sec = pages[now].closest('section');
      navLinks.forEach((a) => a.toggleAttribute('aria-current', !!sec && a.getAttribute('href') === '#' + sec.id));
    }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  // ---- the "Read" badge ----
  const cursor = document.querySelector('.cursor');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let tx = -200, ty = -200, x = tx, y = ty, run = false;
    const tick = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      cursor.style.setProperty('--x', x.toFixed(1) + 'px');
      cursor.style.setProperty('--y', y.toFixed(1) + 'px');
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.2) requestAnimationFrame(tick); else run = false;
    };
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.toggle('on', !!(e.target.closest && e.target.closest('.f-frame')));
      if (!run) { run = true; requestAnimationFrame(tick); }
    }, { passive: true });
    window.addEventListener('scroll', () => cursor.classList.remove('on'), { passive: true });
  }
})();
