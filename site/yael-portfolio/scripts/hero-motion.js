// Hero typography that moves a little with the cursor.
// The name and the title drift toward the pointer by a few pixels, the name further
// than the title, so the two lines feel like layers. They ease into place (a slight
// trail) and settle back when the pointer leaves the window.
(() => {
  const stage = document.querySelector('.work-stage');
  const name = document.querySelector('.work-intro h1');
  const title = document.querySelector('.work-intro p');
  if (!stage || !name || !title) return;
  // no cursor on touch screens, and no movement for people who ask for less motion
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const NAME_SHIFT = 18;   // most the name moves, in px, with the pointer at the edge of the screen
  const TITLE_SHIFT = 9;   // most the title moves
  const EASE = 0.08;       // how quickly the text catches up (0–1, lower trails more)

  let tx = 0, ty = 0;      // target, from -1 to 1 across the screen
  let x = 0, y = 0;        // current
  let running = false;

  function frame() {
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;
    name.style.transform = `translate3d(${(x * NAME_SHIFT).toFixed(2)}px, ${(y * NAME_SHIFT).toFixed(2)}px, 0)`;
    title.style.transform = `translate3d(${(x * TITLE_SHIFT).toFixed(2)}px, ${(y * TITLE_SHIFT).toFixed(2)}px, 0)`;
    if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) requestAnimationFrame(frame);
    else running = false;
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }

  // track the pointer across the whole window (the menu bar sits above the hero),
  // and settle back to the centre when it leaves the window
  window.addEventListener('pointermove', (e) => {
    tx = (e.clientX / window.innerWidth) * 2 - 1;
    ty = (e.clientY / window.innerHeight) * 2 - 1;
    kick();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
})();
