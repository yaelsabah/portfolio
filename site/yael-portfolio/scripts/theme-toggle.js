// Light / dark mode: a day/night switch in the header's right corner.
// The theme sweeps across the page from left to right when it changes.
// The page starts in the visitor's last choice, or their system setting (see the small
// script in each page's <head>, which sets data-theme before anything is drawn).
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SWEEP = 1100;   // ms for the sweep across the page

  const slot = document.createElement('div');
  slot.className = 'header-end';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-toggle';
  btn.setAttribute('role', 'switch');
  btn.setAttribute('aria-label', 'Dark mode');
  // the switch: a sky with clouds and a sun by day, stars and a moon by night
  btn.innerHTML =
    '<span class="tt-track" aria-hidden="true">' +
      '<span class="tt-cloud tt-cloud-1"></span><span class="tt-cloud tt-cloud-2"></span>' +
      '<span class="tt-star tt-star-1"></span><span class="tt-star tt-star-2"></span><span class="tt-star tt-star-3"></span><span class="tt-star tt-star-4"></span>' +
      '<span class="tt-knob"><span class="tt-crater tt-crater-1"></span><span class="tt-crater tt-crater-2"></span><span class="tt-crater tt-crater-3"></span></span>' +
    '</span>';
  slot.append(btn);
  header.append(slot);

  const isDark = () => root.dataset.theme === 'dark';
  const sync = () => {
    btn.setAttribute('aria-checked', String(isDark()));
    btn.title = isDark() ? 'Switch to light mode' : 'Switch to dark mode';
  };
  sync();

  function apply(theme) {
    root.dataset.theme = theme;
    sync();
  }

  function switchTo(theme, remember) {
    if (remember) { try { localStorage.setItem('theme', theme); } catch (e) {} }
    if (reduceMotion || !document.startViewTransition) { apply(theme); return; }
    // the new theme is revealed from the left edge to the right
    const t = document.startViewTransition(() => apply(theme));
    t.ready.then(() => {
      root.animate(
        { clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'] },
        { duration: SWEEP, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
  }

  btn.addEventListener('click', () => switchTo(isDark() ? 'light' : 'dark', true));

  // follow the system setting while the visitor hasn't picked one
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystem = (e) => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (err) {}
    if (!saved) switchTo(e.matches ? 'dark' : 'light', false);
  };
  if (system.addEventListener) system.addEventListener('change', onSystem);
})();
