// Refinements on every page (see styles/refine.css). Small things only:
// - the initials in the header open into the full name on hover
// - home: the lines above About and Contact draw in as each section arrives
// - case studies: the lines above the details, each chapter and previous/next draw in too
// - small arrows on the contact links, previous/next and "Back to top"
(() => {
  document.documentElement.classList.add('rf');

  // YS -> Yael Sabah
  const logo = document.querySelector('.site-header .logo');
  if (logo && logo.textContent.trim() === 'YS') {
    logo.innerHTML = 'Y<span class="logo-rest" aria-hidden="true">ael </span>S<span class="logo-rest" aria-hidden="true">abah</span>';
  }

  // lines that draw in: home sections, and on case studies the details, chapters and previous/next
  const watch = (els, cls) => {
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add(cls)); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  };
  watch([...document.querySelectorAll('.section')], 'is-in');
  document.querySelectorAll('.case-meta > div').forEach((d, i) => d.style.setProperty('--rf-i', i));
  // only the chapters that have a line above them
  const ruled = [...document.querySelectorAll('.chapter')].filter((c) => parseFloat(getComputedStyle(c).borderTopWidth) > 0);
  ruled.forEach((c) => c.classList.add('rf-rule'));
  watch([...document.querySelectorAll('.case-meta, .project-nav'), ...ruled], 'rf-in');
  // the funnel chart on phones: the bars grow as it comes into view
  watch([...document.querySelectorAll('.funnel-m')], 'is-in');

  // arrows
  const svg = (cls, d) => `<svg class="link-arrow ${cls}" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="${d}"/></svg>`;
  document.querySelectorAll('.contact-links a').forEach((a) => {
    if (a.hasAttribute('download')) a.insertAdjacentHTML('beforeend', svg('is-down', 'M5.5 1v8M2 6l3.5 3.5L9 6'));
    else if (a.target === '_blank') a.insertAdjacentHTML('beforeend', svg('is-out', 'M2 9l7-7M3.500 2H9v5.500'));
  });
  const prev = document.querySelector('.project-link.is-prev .project-link-label');
  if (prev) prev.insertAdjacentHTML('afterbegin', svg('', 'M10 5.500H2M5 2 1.500 5.500 5 9'));
  const next = document.querySelector('.project-link.is-next .project-link-label');
  if (next) next.insertAdjacentHTML('beforeend', svg('', 'M1 5.500h8M6 2l3.500 3.500L6 9'));
  const top = document.querySelector('.site-footer .text-button');
  if (top) top.insertAdjacentHTML('beforeend', svg('is-up', 'M5.5 10V2M2 5l3.5-3.5L9 5'));
})();
