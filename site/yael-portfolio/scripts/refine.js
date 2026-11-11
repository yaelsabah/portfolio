// Refinements to the current homepage (see styles/refine.css). Small things only:
// - the initials in the header open into the full name on hover
// - the lines above About and Contact draw in as each section arrives
// - small arrows on the contact links and on "Back to top"
(() => {
  document.documentElement.classList.add('rf');

  // YS -> Yael Sabah
  const logo = document.querySelector('.site-header .logo');
  if (logo && logo.textContent.trim() === 'YS') {
    logo.innerHTML = 'Y<span class="logo-rest" aria-hidden="true">ael </span>S<span class="logo-rest" aria-hidden="true">abah</span>';
  }

  // section lines
  const sections = document.querySelectorAll('.section');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    sections.forEach((s) => io.observe(s));
  } else sections.forEach((s) => s.classList.add('is-in'));

  // arrows
  const svg = (cls, d) => `<svg class="link-arrow ${cls}" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="${d}"/></svg>`;
  document.querySelectorAll('.contact-links a').forEach((a) => {
    if (a.hasAttribute('download')) a.insertAdjacentHTML('beforeend', svg('is-down', 'M5.5 1v8M2 6l3.5 3.5L9 6'));
    else if (a.target === '_blank') a.insertAdjacentHTML('beforeend', svg('is-out', 'M2 9l7-7M3.500 2H9v5.500'));
  });
  const top = document.querySelector('.site-footer .text-button');
  if (top) top.insertAdjacentHTML('beforeend', svg('is-up', 'M5.5 10V2M2 5l3.5-3.5L9 5'));
})();
