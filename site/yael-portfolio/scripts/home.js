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
  const PHONE_SIDE = 16;     // phones: space between the card and the screen edges
  const CAP_GAP = 20;        // phones: space between the card and the caption under it

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
    if (vw < PHONE_BREAKPOINT) {
      // phones show the whole caption under the image: room for the tallest one
      const probe = caption.cloneNode(true);
      probe.removeAttribute('aria-live');
      probe.style.cssText = 'visibility:hidden;opacity:0;top:0;left:' + PHONE_SIDE + 'px;right:' + PHONE_SIDE + 'px';
      stage.append(probe);
      capH = 0;
      projects.forEach((p) => {
        probe.querySelector('.work-name').textContent = p.name;
        probe.querySelector('.work-desc').textContent = p.outcome;
        capH = Math.max(capH, probe.offsetHeight);
      });
      probe.remove();
    } else {
      // the drawer's height when closed (the parts that open on hover don't count)
      capH = caption.offsetHeight - [...caption.querySelectorAll('.work-more')].reduce((h, m) => h + m.offsetHeight, 0);
    }
    track.style.height = Math.round(vh * (TOTAL + 1)) + 'px';
    trackTop = track.getBoundingClientRect().top + window.scrollY;
  }

  function update() {
    const s = Math.max(0, (window.scrollY - trackTop) / vh);
    const phone = vw < PHONE_BREAKPOINT;

    // geometry: cards keep the screenshot ratio on every screen.
    // Desktop: the full-size card fits between the header and the caption strip.
    // Phones: the card and the caption under it sit together in the middle of the space below the header.
    const gap = phone ? 16 : GAP;
    const A = 1 / 1.8;
    let W0, W1, cy1;
    if (phone) {
      W1 = vw - PHONE_SIDE * 2;
      W0 = vw - 56;
      const groupH = W1 * A + CAP_GAP + capH;
      const top = headH + Math.max(gap, (vh - headH - groupH) / 2);
      cy1 = top + (W1 * A) / 2;
      caption.style.setProperty('--cap-top', (top + W1 * A + CAP_GAP).toFixed(1) + 'px');
    } else {
      const room = Math.max(160, vh - headH - capH - gap * 2);
      W1 = Math.min(vw * 0.84, room * 1.8);
      W0 = Math.min(vw * START_WIDTH, 1100);
      cy1 = headH + gap + room / 2;
    }
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
    // phones: the name and title sit in the middle of the screen
    intro.style.top = (phone ? Math.max(headH, (vh - intro.offsetHeight) / 2) : Math.max(130, vh * 0.26)) + 'px';
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
    // a jump from a link: the scrolling that follows isn't the person's, so no wall or magnet
    navigating = true;
    clearTimeout(navTimer);
    navTimer = setTimeout(() => { navigating = false; }, 1500);
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

  // ---- Scrolling between the projects ----
  // The page moves naturally with the wheel, trackpad or finger. Two things keep it tidy
  // between the hero and the last project:
  //  - a soft wall: one gesture can't carry past the next stop (hero → each project), so a
  //    strong flick stops on the next project instead of skipping it; the rest of that
  //    flick's momentum is absorbed, but a fresh swipe goes on straight away;
  //  - a magnet: let go part-way between two stops and the page glides to one of them.
  // After the last project the page scrolls freely into About and Contact.
  const COMMIT = 0.06;        // share of the way to the next stop that's enough to carry on there
  const QUIET = 150;          // ms without input that ends a gesture
  const restOf = (zoneEnd, holdEnd) => zoneEnd + (holdEnd - zoneEnd) / 2;   // middle of a still stretch
  function stops() {
    // each stop: [a, b] the still stretch where it shows, and rest, the point it settles on (in screens)
    const list = [{ a: 0, b: 0.02, rest: 0 }, { a: RISE, b: FIRST_SWAP, rest: restOf(RISE, FIRST_SWAP) }];
    for (let j = 1; j < n; j++) {
      const b = FIRST_SWAP + (j - 1) * PACE + SWAP;
      const holdEnd = j < n - 1 ? FIRST_SWAP + j * PACE : b + 0.3;
      list.push({ a: b, b: holdEnd, rest: restOf(b, holdEnd) });
    }
    return list;
  }
  const sNow = () => (window.scrollY - trackTop) / vh;
  const yOf = (rest) => Math.round(trackTop + rest * vh);
  const atStop = (list, s) => list.findIndex((t) => s >= t.a - 0.01 && s <= t.b + 0.01);

  let gliding = 0, ownScroll = false, navigating = false, navTimer = 0;
  const easeOut = (v) => 1 - Math.pow(1 - v, 3);
  function glideTo(rest) {
    const y1 = yOf(rest);
    if (reduceMotion) { ownScroll = true; window.scrollTo(0, y1); return; }
    const y0 = window.scrollY, d = y1 - y0;
    if (Math.abs(d) < 2) return;
    const dur = Math.max(420, Math.min(750, Math.abs(d) * 0.55));
    const t0 = performance.now();
    const id = ++gliding;
    const frame = (now) => {
      if (gliding !== id) return;                        // the person took over
      const k = Math.min(1, (now - t0) / dur);
      ownScroll = true;
      window.scrollTo(0, y0 + d * easeOut(k));
      if (k < 1) requestAnimationFrame(frame); else gliding = 0;
    };
    requestAnimationFrame(frame);
  }

  // the current gesture: where it started, where its wall is
  let g = null;
  function begin(dir) {
    const list = stops();
    const s = sNow();
    const last = list.length - 1;
    if (s > list[last].b + 0.001) {
      // below the projects: free going down; going up, the last project is the wall
      g = dir > 0 ? { free: true, dir } : { dir, from: -1, to: last, wall: yOf(list[last].rest), walled: false, lastAbs: 0 };
      return;
    }
    let from = atStop(list, s);
    if (from < 0) {
      // between stops: count from the stop behind
      from = dir > 0 ? list.reduce((k, t, i) => (t.rest <= s ? i : k), 0)
                     : list.findIndex((t) => t.rest >= s);
    }
    const to = from + dir;
    if (to < 0 || to >= list.length) { g = { free: true, dir, from }; return; }  // down from the last project: free
    g = { dir, from, to, wall: yOf(list[to].rest), walled: false, lastAbs: 0 };
  }
  const past = (y) => g && !g.free && (g.dir > 0 ? y >= g.wall : y <= g.wall);
  function hitWall() {
    g.walled = true;
    ownScroll = true;
    window.scrollTo(0, g.wall);
  }

  // let go part-way: glide to the next stop if the move went far enough, else back
  let settleTimer = 0, touching = false, pointerDown = false;
  function settle() {
    if (touching || pointerDown || gliding || navigating) return;
    const list = stops();
    const s = sNow();
    const gesture = g;
    g = null;
    if (s < 0 || (s > list[list.length - 1].b + 0.001 && !(gesture && gesture.from < 0 && gesture.walled))) return;
    let target;
    if (gesture && !gesture.free && gesture.from < 0) {
      target = gesture.to;                                 // came up from below: settle on the last project
    } else if (gesture && !gesture.free) {
      const span = list[gesture.to].rest - list[gesture.from].rest;
      const progress = (s - list[gesture.from].rest) / span;
      target = progress >= COMMIT ? gesture.to : gesture.from;
    } else {
      // no gesture to go by (a scrollbar drag): the nearest stop, unless already resting on one
      if (atStop(list, s) >= 0) return;
      target = list.reduce((m, t, i) => (Math.abs(t.rest - s) < Math.abs(list[m].rest - s) ? i : m), 0);
    }
    glideTo(list[target].rest);
  }
  const later = () => { clearTimeout(settleTimer); settleTimer = setTimeout(settle, QUIET); };

  // wheel and trackpad
  let lastWheel = 0;
  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey || !e.deltaY || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    const dir = e.deltaY > 0 ? 1 : -1;
    const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vh : 1);
    const abs = Math.abs(dy);
    const now = performance.now();
    // a new gesture: after a pause, a change of direction, or a fresh swipe rising out of a fading flick
    const fresh = !g || now - lastWheel > QUIET || dir !== g.dir || (g.walled && abs > g.lastAbs * 1.5 + 8);
    lastWheel = now;
    gliding = 0;                                          // the person is scrolling: stop any glide
    if (fresh) begin(dir);
    later();
    if (g.free) return;                                   // ordinary scrolling
    g.lastAbs = abs;
    if (g.walled) { e.preventDefault(); return; }         // the rest of a flick that reached its stop
    if (past(window.scrollY + dy)) { e.preventDefault(); hitWall(); }
  }, { passive: false });

  // anything that scrolls without the wheel (touch, scrollbar, keys) meets the same wall
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const moved = y - lastY;
    lastY = y;
    if (ownScroll) { ownScroll = false; return; }
    if (navigating) { clearTimeout(navTimer); navTimer = setTimeout(() => { navigating = false; }, 200); g = null; return; }
    if (gliding || !moved) return;
    if (pointerDown) { g = null; return; }                // dragging the scrollbar: no wall, settle on release
    if (!g) begin(moved > 0 ? 1 : -1);
    if (!g.free && (g.walled ? y !== g.wall : past(y))) hitWall();
    later();
  }, { passive: true });

  window.addEventListener('touchstart', () => { touching = true; gliding = 0; g = null; }, { passive: true });
  window.addEventListener('touchend', () => { touching = false; later(); }, { passive: true });
  window.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') pointerDown = true; });
  window.addEventListener('pointerup', () => { if (pointerDown) { pointerDown = false; if (!navigating) later(); } });

  // keys move one stop at a time between the hero and the last project
  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (e.metaKey || e.ctrlKey || e.altKey || (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(t.tagName) && e.key === ' '))) return;
    const dir = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, ' ': e.shiftKey ? -1 : 1 }[e.key];
    if (!dir) return;
    begin(dir);
    const gesture = g;
    g = null;
    if (gesture.free) return;
    e.preventDefault();
    glideTo(stops()[gesture.to].rest);
  });

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
