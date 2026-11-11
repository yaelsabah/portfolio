// Text reveals on the home page below the hero:
// - the project caption: the project name lights up letter by letter, then the button
//   fades in; it plays each time a project's caption appears
//   and reverses when it leaves.
// - About and Contact: the big sentences light up letter by letter as they scroll into
//   view, and the labels, table and links fade in; scrolling back up reverses them.
(() => {
  if (!window.Reveal || !window.Reveal.enabled) return;
  const { clamp, letters, fade } = window.Reveal;

  // ---- Project caption ----
  const caption = document.querySelector('.work-caption');
  // only when home.js reports the caption's state; otherwise leave the caption as it is
  if (caption && typeof caption._capOpacity === 'number') {
    const IN = 1100;    // ms to reveal
    const OUT = 450;    // ms to hide
    const nameEl = caption.querySelector('.work-name');
    const rest = ['.work-link'].map((s) => caption.querySelector(s)).filter(Boolean).map(fade);
    let name = letters(nameEl);
    let v = 0, target = 0, last = 0, running = false;

    const render = () => {
      name.set(clamp(v / 0.65), v);
      rest.forEach((r) => r.set(clamp((v - 0.45) / 0.55), v));
    };
    const tick = (now) => {
      const dt = last ? now - last : 16;
      last = now;
      v = target > v ? Math.min(target, v + dt / IN) : Math.max(target, v - dt / OUT);
      render();
      if (v !== target) requestAnimationFrame(tick);
      else { running = false; last = 0; }
    };
    const go = () => { if (!running) { running = true; requestAnimationFrame(tick); } };

    const onState = ({ opacity, changed }) => {
      // home.js has just written the new project's name: split it again and start from hidden
      if (changed) { name = letters(nameEl); v = 0; }
      target = opacity > 0.5 ? 1 : 0;
      render();
      go();
    };
    caption.addEventListener('captionupdate', (e) => onState(e.detail));
    // start in step with where home.js left the caption
    v = target = (caption._capOpacity || 0) > 0.5 ? 1 : 0;
    render();
  }

  // ---- About and Contact, tied to scrolling ----
  const items = [];
  const add = (sel, kind, from = 0.92, to = 0.5) => {
    const el = document.querySelector(sel);
    if (!el) return;
    items.push({ el, r: kind === 'letters' ? letters(el, { edge: 0.3 }) : fade(el), from, to });
  };
  add('#about .section-title', 'fade');
  add('#about .big-statement', 'letters', 0.9, 0.45);
  add('#about .experience', 'fade', 0.95, 0.6);
  add('#contact .section-title', 'fade');
  add('#contact .big-statement', 'letters', 0.9, 0.45);
  add('#contact .contact-links', 'fade', 0.95, 0.55);

  function update() {
    const vh = window.innerHeight;
    const y = window.scrollY;
    const maxY = document.documentElement.scrollHeight - vh;
    items.forEach((it) => {
      const top = it.el.getBoundingClientRect().top + y;
      // scroll positions where the reveal starts and ends; near the end of the page
      // it finishes by the bottom, so the contact text always lights up fully
      const s0 = top - vh * it.from;
      const s1 = Math.max(s0 + 1, Math.min(top - vh * it.to, maxY - 2));
      it.r.set(clamp((y - s0) / (s1 - s0)));
    });
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
