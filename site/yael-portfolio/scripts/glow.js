// Hero glow: a large soft blur that drifts after the cursor behind the name.
// It eases toward the pointer (so it trails a little), drifts back to the centre
// when the pointer leaves, and fades out with the intro text as the page scrolls.
(() => {
  const stage = document.querySelector('.work-stage');
  const intro = document.querySelector('.work-intro');
  if (!stage || !intro) return;
  // no cursor on touch screens, and no drifting for people who ask for less motion
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'hero-glow';
  glow.setAttribute('aria-hidden', 'true');
  stage.prepend(glow);

  const EASE = 0.06;       // how quickly the glow catches up with the cursor (0–1, lower trails more)
  let tx = 0, ty = 0;      // where the glow is heading
  let x = 0, y = 0;        // where it is now
  let home = true;         // true while the pointer is outside the hero
  let running = false;

  function centre() {
    const r = intro.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
  }

  function frame() {
    if (home) { const c = centre(); tx = c.x; ty = c.y; }
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;
    glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    // show only while the name is on screen
    glow.style.opacity = getComputedStyle(intro).opacity;
    if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 || !home) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }

  stage.addEventListener('pointermove', (e) => {
    const s = stage.getBoundingClientRect();
    tx = e.clientX - s.left;
    ty = e.clientY - s.top;
    home = false;
    kick();
  });
  stage.addEventListener('pointerleave', () => { home = true; kick(); });
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick);

  const c = centre(); x = tx = c.x; y = ty = c.y;
  kick();
})();
