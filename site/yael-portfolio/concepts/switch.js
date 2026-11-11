// TEMPORARY (design exploration): a small bar in the bottom-left corner for switching
// between the current homepage and the three homepage concepts.
// On the concept pages it always shows. On the real homepage it only shows on your own
// computer or after adding ?preview to the address, so visitors never see it.
// To remove: delete the concepts folder, concept-a/b/c.html, refined.html and this script's tag in index.html.
(() => {
  if (window.name === 'device-preview-frame') return;   // not inside the phone preview frame
  const PAGES = [
    ['index.html', 'Current'],
    ['refined.html', 'Refined'],
    ['concept-a.html', 'A · Editorial'],
    ['concept-b.html', 'B · Quiet'],
    ['concept-c.html', 'C · Playground']
  ];
  const file = location.pathname.split('/').pop() || 'index.html';
  const isConcept = /^(concept-|refined)/.test(file);
  if (!isConcept) {
    let on = null;
    try { on = localStorage.getItem('device-preview-enabled'); } catch (e) {}
    const local = location.protocol === 'file:' ||
      /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname) || location.hostname.endsWith('.local');
    if (!local && !on && !/[?&]preview/.test(location.search)) return;
  }
  const style = document.createElement('style');
  style.textContent = `
    .cs-bar{position:fixed;left:16px;bottom:16px;z-index:2147483647;display:flex;gap:2px;align-items:center;padding:4px;
      border-radius:999px;background:#111;color:#fff;font:500 13px/1 system-ui,-apple-system,'Segoe UI',sans-serif;
      box-shadow:0 0 0 1px rgba(255,255,255,.12),0 10px 30px -10px rgba(0,0,0,.5);max-width:calc(100vw - 32px);overflow-x:auto}
    .cs-bar a{color:inherit;text-decoration:none;padding:8px 12px;border-radius:999px;white-space:nowrap}
    .cs-bar a:hover{background:rgba(255,255,255,.14);color:#fff}
    .cs-bar a[aria-current="page"]{background:#fff;color:#111}
    @media (max-width:700px){.cs-bar{font-size:12px}.cs-bar a{padding:8px 9px}}
    @media (max-width:1100px){.dp-bar{bottom:60px!important}}
  `;
  document.head.append(style);
  const bar = document.createElement('nav');
  bar.className = 'cs-bar';
  bar.setAttribute('aria-label', 'Homepage concepts');
  PAGES.forEach(([href, label]) => {
    const a = document.createElement('a');
    a.href = href; a.textContent = label;
    if (href === file) a.setAttribute('aria-current', 'page');
    bar.append(a);
  });
  document.body.append(bar);
})();
