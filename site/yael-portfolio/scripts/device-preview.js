// TEMPORARY design tool: a Desktop / Phone switch in the bottom-right corner that shows
// the site in a phone-sized frame, so the mobile layout can be checked while you edit.
// The page loads inside a real phone-width iframe, so the 700 px / 760 px media queries
// and the phone checks in home.js behave exactly as on a phone.
//
// It only appears on your own computer (localhost or a file opened from Finder), so
// visitors to the live site never see it. To use it on the live site, add ?preview to
// the address once; ?preview=off hides it again.
//
// To remove: delete this file and its <script> tag in index.html and case-study.html.
(() => {
  const FRAME_NAME = 'device-preview-frame';
  const KEY = 'device-preview';          // remembered phone size, when phone view is on
  const ENABLE_KEY = 'device-preview-enabled';
  const SIZES = { '375': [375, 667], '390': [390, 844], '430': [430, 932] };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) {} }
  };

  // inside the phone frame: show the site as normal, with no switch and no desktop
  // scrollbar (phones overlay theirs, so it would take width away from the layout)
  if (window.name === FRAME_NAME) {
    const s = document.createElement('style');
    s.textContent = 'html{scrollbar-width:none}html::-webkit-scrollbar{display:none}';
    document.head.append(s);
    return;
  }

  // only on your own computer, unless turned on with ?preview
  const param = new URLSearchParams(location.search).get('preview');
  if (param !== null) store.set(ENABLE_KEY, param === 'off' ? null : '1');
  const local = location.protocol === 'file:' ||
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname) ||
    location.hostname.endsWith('.local');
  if (!local && !store.get(ENABLE_KEY)) return;

  const style = document.createElement('style');
  style.textContent = `
    .dp-bar{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;gap:4px;align-items:center;
      padding:4px;border-radius:999px;background:#111;color:#fff;font:500 13px/1 'Instrument Sans',system-ui,sans-serif;
      box-shadow:0 0 0 1px rgba(255,255,255,.12),0 10px 30px -10px rgba(0,0,0,.5)}
    .dp-bar button,.dp-bar select{font:inherit;color:inherit;background:none;border:0;border-radius:999px;padding:8px 12px;cursor:pointer}
    .dp-bar button[aria-pressed="true"]{background:#fff;color:#111}
    .dp-bar select{padding:8px 6px;background:rgba(255,255,255,.12)}
    .dp-bar select option{color:#111}
    .dp-bar .dp-label{padding:0 8px 0 10px;opacity:.6}
    html.dp-on,html.dp-on body{overflow:hidden!important;height:100%}
    html.dp-on body>*:not(.dp-stage):not(.dp-bar){display:none!important}
    .dp-stage{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;
      background:#d9d5cf;padding:24px 24px 72px}
    .dp-device{border-radius:44px;padding:12px;background:#111;box-shadow:0 30px 80px -30px rgba(0,0,0,.5)}
    .dp-device iframe{display:block;border:0;border-radius:32px;background:#fff}
  `;
  document.head.append(style);

  const bar = document.createElement('div');
  bar.className = 'dp-bar';
  bar.innerHTML = `<span class="dp-label">Preview</span>
    <button type="button" data-mode="desktop">Desktop</button>
    <button type="button" data-mode="phone">Phone</button>
    <select aria-label="Phone size">
      <option value="375">375 × 667</option>
      <option value="390">390 × 844</option>
      <option value="430">430 × 932</option>
    </select>`;
  const select = bar.querySelector('select');
  select.value = '390';

  let stage = null, frame = null;

  // width stays exact; height shrinks if the window is too short for the whole phone
  function fit() {
    if (!frame) return;
    const [w, h] = SIZES[select.value] || SIZES['390'];
    frame.style.width = w + 'px';
    frame.style.height = Math.min(h, window.innerHeight - 120) + 'px';
  }

  function on(size) {
    select.value = SIZES[size] ? size : '390';
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'dp-stage';
      const device = document.createElement('div');
      device.className = 'dp-device';
      frame = document.createElement('iframe');
      frame.name = FRAME_NAME;
      frame.title = 'Phone preview';
      frame.src = location.href.split('#')[0];
      device.append(frame);
      stage.append(device);
      document.body.append(stage);
    }
    document.documentElement.classList.add('dp-on');
    fit();
    store.set(KEY, select.value);
    sync('phone');
  }

  function off() {
    let inner = null;
    try { inner = frame && frame.contentWindow.location.href; } catch (e) {}
    store.set(KEY, null);
    // if you clicked through to another page in the phone, open that page on desktop
    if (inner && inner.split('#')[0] !== location.href.split('#')[0]) { location.href = inner; return; }
    document.documentElement.classList.remove('dp-on');
    if (stage) { stage.remove(); stage = null; frame = null; }
    sync('desktop');
    window.dispatchEvent(new Event('resize'));
  }

  function sync(mode) {
    bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    select.hidden = mode !== 'phone';
  }

  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) b.dataset.mode === 'phone' ? on(select.value) : off();
  });
  select.addEventListener('change', () => { fit(); store.set(KEY, select.value); });
  window.addEventListener('resize', fit);

  document.body.append(bar);
  const saved = store.get(KEY);
  saved ? on(saved) : sync('desktop');
})();
