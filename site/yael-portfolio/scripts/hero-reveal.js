// Hero text reveal: the name and title light up letter by letter, left to right,
// with a soft edge, over a faint "ghost" of the text. It plays once on load, and
// runs backwards as the page scrolls down (and forwards again when scrolling up).
// home.js reports how visible the intro should be for the scroll position.
(() => {
  const root = document.documentElement;
  const intro = document.querySelector('.work-intro');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const done = () => root.classList.remove('hero-pending');
  if (!intro || reduceMotion) { done(); return; }

  // ---- Tweakable settings ----
  const DURATION = 2200;   // ms for the reveal on load
  const DELAY = 150;       // ms before it starts
  const EDGE = 0.35;       // width of the soft edge, as a share of all the letters (bigger = softer, more letters mid-fade)
  const GHOST = 0.08;      // opacity of the faint text not yet revealed

  // split each line into letters; screen readers get the plain text instead
  const chars = [];
  intro.querySelectorAll('h1, p').forEach((el) => {
    const text = el.textContent.trim();
    const plain = document.createElement('span');
    plain.className = 'visually-hidden';
    plain.textContent = text;
    const shown = document.createElement('span');
    shown.setAttribute('aria-hidden', 'true');
    text.split(/\s+/).forEach((word, i, words) => {
      const w = document.createElement('span');
      w.className = 'rv-word';
      for (const c of word) {
        const s = document.createElement('span');
        s.className = 'rv-ch';
        s.textContent = c;
        w.append(s);
        chars.push(s);
      }
      shown.append(w);
      if (i < words.length - 1) shown.append(' ');
    });
    el.replaceChildren(plain, shown);
  });
  const last = Math.max(1, chars.length - 1);

  let loadV = 0;                                                      // 0 → 1 over the load animation
  let scrollV = typeof intro._vis === 'number' ? intro._vis : 1;      // from home.js
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const smooth = (v) => v * v * (3 - 2 * v);

  function render() {
    const v = Math.min(loadV, scrollV);
    const ghost = GHOST * clamp(v / 0.12);                  // the ghost comes in first and leaves last
    const head = clamp((v - 0.08) / 0.92) * (1 + EDGE);     // the soft edge sweeps across the letters
    chars.forEach((s, i) => {
      const f = clamp((head - i / last) / EDGE);
      const o = (ghost + (1 - ghost) * f).toFixed(3);
      if (s._o !== o) { s._o = o; s.style.opacity = o; }
    });
  }

  // home.js takes care of the lift on scroll; the letters take over the fading
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
