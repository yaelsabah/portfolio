// TEMPORARY: a small tab on the left edge for trying the right-corner ideas.
// Delete this file (and its <script> lines and the .corner-picker styles in corner.css) once one is chosen.
(() => {
  if (!window.Corner) return;
  const choices = [['colorize', '1952'], ['design', 'Design mode'], ['time', 'Local time'], ['none', 'Nothing']];
  let current = 'colorize';
  try { current = new URLSearchParams(location.search).get('corner') || localStorage.getItem('corner-idea') || current; } catch (e) {}

  const wrap = document.createElement('div');
  wrap.className = 'corner-picker';
  wrap.innerHTML = '<button type="button" class="corner-picker-tab" aria-expanded="false" aria-label="Try the right-corner ideas">✦</button>' +
    '<div class="corner-picker-panel" role="group" aria-label="Right corner idea"><span class="corner-picker-title">Right corner · trial</span></div>';
  const tab = wrap.querySelector('.corner-picker-tab');
  const panel = wrap.querySelector('.corner-picker-panel');
  const buttons = choices.map(([key, label]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.setAttribute('aria-pressed', String(key === current));
    b.addEventListener('click', () => {
      window.Corner.show(key);
      try { localStorage.setItem('corner-idea', key); } catch (e) {}
      buttons.forEach((o, i) => o.setAttribute('aria-pressed', String(choices[i][0] === key)));
    });
    panel.append(b);
    return b;
  });
  tab.addEventListener('click', () => {
    const open = !wrap.classList.contains('is-open');
    wrap.classList.toggle('is-open', open);
    tab.setAttribute('aria-expanded', String(open));
  });
  document.body.append(wrap);
})();
