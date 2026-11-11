// Hero text reveal: the name lights up letter by letter, then the title fades in as one piece.
// It plays once on load, and runs backwards as the page scrolls down (forwards again on the
// way back up). home.js reports how visible the intro should be for the scroll position.
(() => {
  const root = document.documentElement;
  const intro = document.querySelector('.work-intro');
  const done = () => root.classList.remove('hero-pending');
  if (!intro || !window.Reveal || !window.Reveal.enabled) { done(); return; }
  const { clamp, letters, fade } = window.Reveal;

  // ---- Tweakable settings ----
  const DURATION = 2200;   // ms for the whole reveal on load
  const DELAY = 150;       // ms before it starts
  const NAME_END = 0.75;   // the name is fully lit at this point of the reveal (0–1)
  const TITLE_START = 0.6; // the title starts fading in here, overlapping the end of the name

  const name = letters(intro.querySelector('h1'));
  const title = fade(intro.querySelector('p'));

  let loadV = 0;                                                    // 0 → 1 over the load animation
  let scrollV = typeof intro._vis === 'number' ? intro._vis : 1;    // from home.js
  const smooth = (v) => v * v * (3 - 2 * v);

  function render() {
    const v = Math.min(loadV, scrollV);
    name.set(clamp(v / NAME_END), v);
    title.set(clamp((v - TITLE_START) / (1 - TITLE_START)), v);
  }

  // home.js takes care of the lift on scroll; the reveal takes over the fading
  intro.dataset.reveal = 'letters';
  intro.style.opacity = '';
  intro.addEventListener('herovisibility', (e) => { scrollV = e.detail; render(); });
  render();
  done();

  const start = () => {
    const t0 = performance.now() + DELAY;
    const tick = (now) => {
      loadV = smooth(clamp((now - t0) / DURATION));
      render();
      if (loadV < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  // wait for the web font so the letters don't jump mid-reveal (but not for long)
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))]).then(start);
  } else start();
})();
