// Shared text reveal: text lights up over a faint "ghost" of itself.
// Reveal.letters(el) lights it up letter by letter, left to right, with a soft edge.
// Reveal.fade(el) lights the whole element up as one piece.
// Both return an object with set(v), where v runs from 0 (hidden) to 1 (fully shown).
(() => {
  const GHOST = 0.08;   // opacity of the faint text not yet revealed
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v) => Math.max(0, Math.min(1, v));
  // the ghost comes in first and leaves last
  const ghostFor = (v) => GHOST * clamp(v / 0.12);
  const shown = (v) => clamp((v - 0.08) / 0.92);

  // split an element's text into letter spans; screen readers get the plain text instead
  function split(el) {
    const text = el.textContent.trim();
    const plain = document.createElement('span');
    plain.className = 'visually-hidden';
    plain.textContent = text;
    const visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');
    const chars = [];
    text.split(/\s+/).forEach((word, i, words) => {
      const w = document.createElement('span');
      w.className = 'rv-word';
      for (const c of word) {
        const s = document.createElement('span');
        s.textContent = c;
        w.append(s);
        chars.push(s);
      }
      visible.append(w);
      if (i < words.length - 1) visible.append(' ');
    });
    el.replaceChildren(plain, visible);
    return chars;
  }

  function letters(el, { edge = 0.35 } = {}) {
    const chars = split(el);
    const last = Math.max(1, chars.length - 1);
    return {
      set(v, ghostV = v) {
        const ghost = ghostFor(ghostV);
        const head = shown(v) * (1 + edge);
        chars.forEach((s, i) => {
          const o = (ghost + (1 - ghost) * clamp((head - i / last) / edge)).toFixed(3);
          if (s._o !== o) { s._o = o; s.style.opacity = o; }
        });
      }
    };
  }

  function fade(el) {
    return {
      set(v, ghostV = v) {
        const ghost = ghostFor(ghostV);
        // fully shown: step aside so the element's own styles (like a hover fade) apply again
        const o = shown(v) >= 1 ? '' : (ghost + (1 - ghost) * shown(v)).toFixed(3);
        if (el._o !== o) { el._o = o; el.style.opacity = o; }
      }
    };
  }

  window.Reveal = { enabled: !reduceMotion, letters, fade, clamp };
})();
