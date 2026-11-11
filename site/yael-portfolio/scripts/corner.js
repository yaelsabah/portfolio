// The right corner of the header. Three ideas live here for now:
//   colorize – a "1952" switch that turns the site into an old photograph
//   design   – design mode: the layout grid, and type specs for whatever is hovered (also the G key)
//   time     – local time, with a dot that shows whether it is working hours
// Corner.show(name) puts one of them in the corner. scripts/corner-picker.js (temporary)
// lets you switch between them; once one is chosen, delete the picker and the other ideas.
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const slot = document.createElement('div');
  slot.className = 'header-end';
  header.append(slot);

  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html) n.innerHTML = html; return n; };

  // ---------- 1. Colorize: "1952" ----------
  const colorize = {
    mount() {
      const btn = el('button', 'corner-switch', '<span class="corner-switch-label">1952</span><span class="corner-switch-track" aria-hidden="true"><span class="corner-switch-thumb"></span></span>');
      btn.type = 'button';
      btn.setAttribute('role', 'switch');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('aria-label', 'See the site as an old photograph');
      btn.title = 'See it as an old photograph';
      // a see-through layer over the page: it tints, grains and vignettes everything behind it
      const layer = el('div', 'vintage-layer');
      layer.setAttribute('aria-hidden', 'true');
      document.body.append(layer);
      const SWEEP = reduceMotion ? 0 : 1100;
      // both ways sweep left to right: the old photo spreads in, then the colour comes back
      const set = (on) => {
        btn.setAttribute('aria-checked', String(on));
        layer.style.transition = 'none';
        layer.style.clipPath = on ? 'inset(0 100% 0 0)' : 'inset(0 0 0 0)';
        layer.style.visibility = 'visible';
        void layer.offsetWidth;   // apply the starting edge before the sweep
        layer.style.transition = `clip-path ${SWEEP}ms cubic-bezier(.65, 0, .35, 1)`;
        layer.style.clipPath = on ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)';
        root.classList.toggle('is-vintage', on);
      };
      btn.addEventListener('click', () => set(btn.getAttribute('aria-checked') !== 'true'));
      slot.append(btn);
      this.cleanup = () => { root.classList.remove('is-vintage'); layer.remove(); btn.remove(); };
    },
    unmount() { if (this.cleanup) this.cleanup(); }
  };

  // ---------- 2. Design mode ----------
  const design = {
    mount() {
      const btn = el('button', 'corner-design', '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="2" y="2" width="14" height="14" rx="1.5"/><path d="M6.7 2v14M11.3 2v14M2 6.7h14M2 11.3h14"/></svg>' + (canHover ? '<kbd>G</kbd>' : ''));
      btn.type = 'button';
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Design mode: show the grid and type specs');
      btn.title = 'Design mode (G)';

      // the layout grid: 12 columns inside the page width
      const grid = el('div', 'dm-grid');
      grid.setAttribute('aria-hidden', 'true');
      const cols = el('div', 'dm-cols');
      for (let i = 0; i < 12; i++) cols.append(el('span'));
      grid.append(cols);
      // the inspector: an outline around what is hovered, and a tag with its specs
      const box = el('div', 'dm-box');
      const tag = el('div', 'dm-tag');
      [box, tag].forEach((n) => n.setAttribute('aria-hidden', 'true'));
      document.body.append(grid, box, tag);

      const hex = (rgb) => {
        const m = rgb.match(/\d+(\.\d+)?/g);
        if (!m) return rgb;
        const h = '#' + m.slice(0, 3).map((v) => Math.round(+v).toString(16).padStart(2, '0')).join('').toUpperCase();
        return m[3] !== undefined && +m[3] < 1 ? h + ' ' + Math.round(m[3] * 100) + '%' : h;
      };
      const hasText = (n) => [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
      function specs(target) {
        let n = target;
        if (n.closest('.dm-grid, .dm-box, .dm-tag, .corner-picker')) return null;
        if (n.tagName === 'IMG' || n.tagName === 'VIDEO') {
          const r = n.getBoundingClientRect();
          return { n, lines: [n.tagName === 'IMG' ? 'Image' : 'Video', Math.round(r.width) + ' × ' + Math.round(r.height)] };
        }
        // climb to the element that holds the text (letters split for the reveal count as their word)
        while (n && n !== document.body && !hasText(n)) n = n.parentElement;
        if (!n || n === document.body) return null;
        while (n.parentElement && (n.parentElement.classList.contains('rv-word') || n.classList.contains('rv-word') || n.parentElement.getAttribute('aria-hidden') === 'true')) n = n.parentElement;
        if (n.getAttribute('aria-hidden') === 'true' && n.parentElement) n = n.parentElement;
        const cs = getComputedStyle(n);
        const size = parseFloat(cs.fontSize);
        const lh = cs.lineHeight === 'normal' ? 'normal' : (parseFloat(cs.lineHeight) / size).toFixed(2).replace(/\.?0+$/, '');
        const ls = cs.letterSpacing === 'normal' ? '' : ' · ' + (parseFloat(cs.letterSpacing) / size).toFixed(3).replace(/0+$/, '') + 'em';
        return { n, lines: [cs.fontFamily.split(',')[0].replace(/["']/g, '') + ' · ' + cs.fontWeight, Math.round(size) + 'px / ' + lh + ls, hex(cs.color)] };
      }
      let frame = 0, last = null;
      const onMove = (e) => {
        last = e;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const s = specs(last.target);
          if (!s) { box.style.opacity = 0; tag.style.opacity = 0; return; }
          const r = s.n.getBoundingClientRect();
          Object.assign(box.style, { opacity: 1, left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
          tag.innerHTML = s.lines.map((l, i) => i === 0 ? '<strong>' + l + '</strong>' : '<span>' + l + '</span>').join('');
          const x = Math.min(last.clientX + 16, window.innerWidth - tag.offsetWidth - 8);
          const y = last.clientY + 20 + tag.offsetHeight > window.innerHeight ? last.clientY - tag.offsetHeight - 12 : last.clientY + 20;
          Object.assign(tag.style, { opacity: 1, left: x + 'px', top: y + 'px' });
        });
      };
      const onLeave = () => { box.style.opacity = 0; tag.style.opacity = 0; };

      const set = (on) => {
        btn.setAttribute('aria-pressed', String(on));
        root.classList.toggle('is-design', on);
        if (on && canHover) { window.addEventListener('pointermove', onMove, { passive: true }); document.addEventListener('pointerleave', onLeave); }
        else { window.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave); onLeave(); }
      };
      const toggle = () => set(btn.getAttribute('aria-pressed') !== 'true');
      const onKey = (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const t = e.target;
        if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        if (e.key === 'g' || e.key === 'G') toggle();
        else if (e.key === 'Escape' && root.classList.contains('is-design')) set(false);
      };
      btn.addEventListener('click', toggle);
      window.addEventListener('keydown', onKey);
      slot.append(btn);
      this.cleanup = () => { set(false); window.removeEventListener('keydown', onKey); grid.remove(); box.remove(); tag.remove(); btn.remove(); };
    },
    unmount() { if (this.cleanup) this.cleanup(); }
  };

  // ---------- 3. Local time ----------
  const time = {
    CITY: 'Tel Aviv',            // the city shown next to the time
    ZONE: 'Asia/Jerusalem',      // its time zone
    mount() {
      const box = el('div', 'corner-time', '<span class="corner-dot" aria-hidden="true"></span><span class="corner-city"></span><time></time><span class="corner-status"></span>');
      box.querySelector('.corner-city').textContent = this.CITY;
      const timeEl = box.querySelector('time');
      const statusEl = box.querySelector('.corner-status');
      const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: this.ZONE, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
      const tick = () => {
        const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
        const h = +parts.hour % 24;
        const day = parts.weekday;          // Sun … Sat; the working week in Israel is Sunday to Thursday
        let state = 'off', status = 'Off for the day';
        if (h >= 23 || h < 7) status = 'Probably asleep';
        else if (day === 'Fri' || day === 'Sat') status = 'Off for the weekend';
        else if (h >= 9 && h < 19) { state = 'on'; status = 'Probably designing something'; }
        timeEl.textContent = parts.hour + ':' + parts.minute;
        statusEl.textContent = status;
        box.dataset.state = state;
        box.setAttribute('aria-label', 'Local time in ' + this.CITY + ': ' + timeEl.textContent + '. ' + status + '.');
        box.title = status;
      };
      tick();
      const timer = setInterval(tick, 20000);
      box.setAttribute('role', 'note');
      slot.append(box);
      this.cleanup = () => { clearInterval(timer); box.remove(); };
    },
    unmount() { if (this.cleanup) this.cleanup(); }
  };

  const ideas = { colorize, design, time };
  let current = null;
  function show(name) {
    if (current) current.unmount();
    current = ideas[name] || null;
    slot.dataset.idea = name || 'none';
    if (current) current.mount();
  }
  window.Corner = { show, ideas: Object.keys(ideas) };

  // the corner starts with the trial choice if there is one (corner-picker.js), else the first idea
  let start = 'colorize';
  try { start = new URLSearchParams(location.search).get('corner') || localStorage.getItem('corner-idea') || start; } catch (e) {}
  show(start);
})();
