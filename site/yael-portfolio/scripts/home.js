// Home page: the first project peeks up from the bottom, rises to fill the screen
// on scroll, then each next project slides up over the previous one.
(() => {
  const projects = window.PROJECTS;
  const n = projects.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Tweakable settings ----
  const PACE = 1.2;          // screens of scrolling per project
  const PEEK = 0.2;          // how much of the first card shows at the start (share of screen height)
  const START_WIDTH = 0.58;  // first card width at the start (share of screen width), desktop
  const PHONE_BREAKPOINT = 700;

  // ---- Timeline, in screens scrolled ----
  const RISE = 1.0;                       // first card grows to full size
  const FIRST_SWAP = RISE + 0.25;         // short hold, then the next card arrives
  const SWAP = PACE * 0.75;               // how long each slide-up takes
  const TOTAL = FIRST_SWAP + (n - 2) * PACE + SWAP + 0.4;

  const $ = (sel) => document.querySelector(sel);
  const track = $('.work-track');
  const stage = $('.work-stage');
  const intro = $('.work-intro');
  const cardsEl = $('.work-cards');
  const caption = $('.work-caption');
  const capCounter = $('.work-counter');
  const capName = $('.work-name');
  const capDesc = $('.work-desc');
  const capLink = $('.work-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const about = $('#about');
  const contact = $('#contact');

  const clamp = (v) => Math.max(0, Math.min(1, v));
  const smooth = (v) => v * v * (3 - 2 * v);
  const ease = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const step = (v) => (v >= 0.5 ? 1 : 0);
  const lerp = (a, b, t) => a + (b - a) * t;

  const header = $('.site-header');
  const GAP = 28;            // space between the full-size card and the header / caption strip

  let vw = 0, vh = 0, trackTop = 0, headH = 0, capH = 0, current = -1;

  // ---- Build one card per project ----
  const cards = projects.map((p, q) => {
    const a = document.createElement('a');
    a.className = 'work-card';
    a.href = window.caseStudyUrl(p.slug);
    a.style.zIndex = String(10 + q);
    if (p.cardBg) a.style.background = p.cardBg;
    // a project with a video plays it muted on a loop; the image stays as its poster.
    // cardVideo: false keeps the still image on the card (the case study can still use the video)
    const cardVideo = p.video && p.cardVideo !== false;
    const img = document.createElement(cardVideo ? 'video' : 'img');
    if (cardVideo) {
      img.src = p.video;
      img.poster = p.image;
      img.muted = true; img.loop = true; img.autoplay = true; img.playsInline = true;
      img.preload = 'metadata';
    } else {
      img.src = p.image;
      img.alt = '';
      img.decoding = 'async';
    }
    const dim = document.createElement('span');
    dim.className = 'work-card-dim';
    dim.setAttribute('aria-hidden', 'true');
    a.append(img, dim);
    a.addEventListener('click', (e) => {
      // while it is still peeking, clicking scrolls it up instead of leaving the page
      if (a.dataset.peek === 'true') { e.preventDefault(); scrollToY(trackTop + vh * (RISE + 0.05)); }
    });
    cardsEl.append(a);
    return { a, img, dim, p };
  });

  function measure() {
    vw = document.documentElement.clientWidth;
    vh = stage.clientHeight || window.innerHeight;
    headH = header.offsetHeight;
    // the drawer's height when closed (the parts that open on hover don't count)
    capH = caption.offsetHeight - [...caption.querySelectorAll('.work-more')].reduce((h, m) => h + m.offsetHeight, 0);
    track.style.height = Math.round(vh * (TOTAL + 1)) + 'px';
    trackTop = track.getBoundingClientRect().top + window.scrollY;
  }

  function update() {
    const s = Math.max(0, (window.scrollY - trackTop) / vh);
    const phone = vw < PHONE_BREAKPOINT;

    // geometry: desktop keeps the screenshot ratio, phones use a taller card.
    // The full-size card fits in the space between the header and the caption strip.
    const gap = phone ? 16 : GAP;
    const room = Math.max(160, vh - headH - capH - gap * 2);
    let W0, W1, A, cy1;
    if (phone) {
      W1 = vw - 32;
      A = Math.min(room, W1 * 1.35) / W1;
      W0 = vw - 56;
    } else {
      W1 = Math.min(vw * 0.84, room * 1.8);
      A = 1 / 1.8;
      W0 = Math.min(vw * START_WIDTH, 1100);
    }
    cy1 = headH + gap + room / 2;
    const H0 = W0 * A, H1 = W1 * A;
    const top0 = vh * (1 - (phone ? Math.min(PEEK, 0.18) : PEEK));
    const cx = vw / 2;

    const e0 = reduceMotion ? step(s / RISE) : smooth(clamp(s / RISE));
    const t = [0];
    for (let j = 1; j < n; j++) {
      const v = (s - (FIRST_SWAP + (j - 1) * PACE)) / SWAP;
      t.push(reduceMotion ? step(v) : ease(clamp(v)));
    }
    let cur = 0, bump = 0;
    for (let j = 1; j < n; j++) {
      if (t[j] >= 0.5) cur = j;
      bump = Math.max(bump, Math.sin(Math.PI * t[j]));
    }

    cards.forEach(({ a, img, dim, p }, q) => {
      let y, w, r = 0, opacity = 1;
      if (q === 0) {
        w = lerp(W0, W1, e0);
        y = lerp(top0 + H0 / 2, cy1, e0);
      } else if (t[q] <= 0) {
        w = W1; y = vh + H1; opacity = 0;
      } else {
        w = W1;
        y = cy1 + (vh * 0.5 + H1 * 0.5 + 24) * (1 - t[q]);
        r = (1 - t[q]) * (phone ? 2 : 3);
      }
      // cards already shown sink back as the next one arrives
      let dimAmount = 0;
      for (let m = q + 1; m < n; m++) {
        w *= 1 - 0.06 * t[m];
        y -= (phone ? 14 : 22) * t[m];
        if (m === q + 1) dimAmount = 0.35 * t[m];
        if (m >= q + 2) opacity *= 1 - t[m];
      }
      const h = w * A;
      const peeking = q === 0 && e0 < 0.3;
      const live = q === cur && e0 >= 0.95 && bump < 0.25;
      const interactive = peeking || live;

      a.style.width = w.toFixed(1) + 'px';
      a.style.height = h.toFixed(1) + 'px';
      a.style.transform = `translate(${(cx - w / 2).toFixed(1)}px, ${(y - h / 2).toFixed(1)}px) rotate(${r.toFixed(2)}deg)`;
      a.style.opacity = opacity.toFixed(3);
      a.style.pointerEvents = interactive ? 'auto' : 'none';
      a.tabIndex = interactive ? 0 : -1;
      a.dataset.peek = peeking ? 'true' : 'false';
      a.classList.toggle('is-peek', q === 0 && e0 < 0.05);
      a.setAttribute('aria-label', peeking ? 'Scroll to ' + p.name : 'Read the ' + p.name + ' case study');
      img.style.objectPosition = phone ? p.mobileFocus : '50% 0%';
      dim.style.opacity = dimAmount.toFixed(3);
    });

    // caption strip lines its content up with the full-size card's edges
    caption.style.setProperty('--card-inset', ((vw - W1) / 2).toFixed(1) + 'px');

    // headline fades and lifts away
    intro.style.top = (phone ? Math.max(110, vh * 0.2) : Math.max(130, vh * 0.26)) + 'px';
    const introVis = reduceMotion ? (s > 0.1 ? 0 : 1) : clamp(1 - s / 0.4);
    intro._vis = introVis;
    if (intro.dataset.reveal) intro.dispatchEvent(new CustomEvent('herovisibility', { detail: introVis }));
    else intro.style.opacity = introVis.toFixed(3);
    intro.style.transform = reduceMotion ? 'none' : `translateY(${(-Math.min(s, 1) * 180).toFixed(1)}px)`;

    // caption for the project on screen
    const capOpacity = clamp((e0 - 0.8) / 0.2) * (1 - bump);
    caption.style.opacity = capOpacity.toFixed(3);
    caption.style.pointerEvents = capOpacity > 0.5 ? 'auto' : 'none';
    caption._capOpacity = capOpacity;
    if (capOpacity <= 0.5) caption.classList.remove('is-open');
    const capChanged = cur !== current;
    if (cur !== current) {
      current = cur;
      const p = projects[cur];
      capCounter.textContent = 'Project ' + (cur + 1) + ' of ' + n;
      capName.textContent = p.name;
      capDesc.textContent = p.outcome;
      capLink.href = window.caseStudyUrl(p.slug);
    }
    // home-reveals.js plays the caption's text reveal from this
    caption.dispatchEvent(new CustomEvent('captionupdate', { detail: { opacity: capOpacity, changed: capChanged } }));

    // highlight the section in view
    const y = window.scrollY;
    const atEnd = y >= document.documentElement.scrollHeight - window.innerHeight - 4;
    let section = null;
    if (atEnd || y >= contact.offsetTop - vh * 0.5) section = 'contact';
    else if (y >= about.offsetTop - vh * 0.5) section = 'about';
    else if (s >= 0.6) section = 'work';
    navLinks.forEach((l) => l.setAttribute('aria-current', l.dataset.scroll === section ? 'true' : 'false'));
  }

  function scrollToY(y) {
    window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  // in-page links scroll smoothly
  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.dataset.scroll;
      if (target === 'top') scrollToY(0);
      else if (target === 'work') scrollToY(trackTop + vh * (RISE + 0.05));
      else scrollToY(document.getElementById(target).offsetTop - 80);
    });
  });

  // the drawer opens over the image while the pointer is on the drawer or on the project image
  let closeTimer = 0;
  const openDrawer = (open) => {
    clearTimeout(closeTimer);
    if (open) caption.classList.add('is-open');
    // a short pause so a quick move out of the zone and back doesn't flicker
    else closeTimer = setTimeout(() => caption.classList.remove('is-open'), 140);
  };
  // it opens while the pointer is in the bottom quarter of the screen
  const DRAWER_ZONE = 0.75;   // the zone starts this far down the screen (0–1)
  let pointerY = -1;
  const checkDrawer = () => {
    const inZone = pointerY >= window.innerHeight * DRAWER_ZONE;
    if (inZone && (caption._capOpacity || 0) > 0.5) openDrawer(true);
    else if (caption.classList.contains('is-open') && !caption.contains(document.activeElement)) openDrawer(false);
  };
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', (e) => { pointerY = e.clientY; checkDrawer(); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { pointerY = -1; checkDrawer(); });
    // the drawer can come into view under a still pointer as the page scrolls
    window.addEventListener('scroll', checkDrawer, { passive: true });
  }
  // keyboard users get the intro when the button is focused
  caption.addEventListener('focusin', () => openDrawer(true));
  caption.addEventListener('focusout', () => openDrawer(false));

  // ---- Magnet: after scrolling stops part-way between two resting states (the hero, or a
  // project filling the screen), glide on to the next one in the direction of travel ----
  const SNAP_IDLE = 150;     // ms without scrolling before the magnet pulls
  const COMMIT = 0.03;       // share of a transition the user must scroll before it carries on
  const restOf = (zoneEnd, holdEnd) => zoneEnd + (holdEnd - zoneEnd) / 2;   // middle of a still stretch
  function zones() {
    // [start, end, rest before, rest after], in screens scrolled
    const z = [[0, RISE, 0, restOf(RISE, FIRST_SWAP)]];
    for (let j = 1; j < n; j++) {
      const a = FIRST_SWAP + (j - 1) * PACE, b = a + SWAP;
      const holdEnd = j < n - 1 ? FIRST_SWAP + j * PACE : b + 0.3;
      z.push([a, b, z[j - 1][3], restOf(b, holdEnd)]);
    }
    return z;
  }
  let lastY = window.scrollY, dir = 0, idle = 0, snapping = 0, pointerDown = false;
  const easeInOut = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  function glideTo(y) {
    if (reduceMotion) { window.scrollTo(0, y); return; }
    const y0 = window.scrollY, d = y - y0;
    const dur = Math.max(450, Math.min(900, Math.abs(d) * 0.7));
    const t0 = performance.now();
    const id = ++snapping;
    const step = (now) => {
      if (snapping !== id) return;                       // the user took over
      const k = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, y0 + d * easeInOut(k));
      if (k < 1) requestAnimationFrame(step); else snapping = 0;
    };
    requestAnimationFrame(step);
  }
  function magnet() {
    if (pointerDown) return;
    const s = (window.scrollY - trackTop) / vh;
    const z = zones().find(([a, b]) => s > a + 0.002 && s < b - 0.002);
    if (!z) return;                                       // resting already, or past the projects
    const [a, b, before, after] = z;
    const p = (s - a) / (b - a);
    const target = dir >= 0 ? (p > COMMIT ? after : before) : (p < 1 - COMMIT ? before : after);
    glideTo(Math.round(trackTop + target * vh));
  }
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (!snapping && y !== lastY) dir = y > lastY ? 1 : -1;
    lastY = y;
    clearTimeout(idle);
    if (!snapping) idle = setTimeout(magnet, SNAP_IDLE);
  }, { passive: true });
  // any new input from the person stops a glide in progress
  ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { snapping = 0; }, { passive: true }));
  window.addEventListener('pointerdown', () => { pointerDown = true; snapping = 0; });
  window.addEventListener('pointerup', () => { pointerDown = false; clearTimeout(idle); idle = setTimeout(magnet, SNAP_IDLE); });

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  };

  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); });
  // fonts can shift layout once they load
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); update(); });
})();
