// Case study page: reads ?project=<slug> and fills the page from scripts/projects.js
(() => {
  const projects = window.PROJECTS;
  const n = projects.length;
  const slug = new URLSearchParams(window.location.search).get('project');
  let i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) i = 0;
  const p = projects[i];
  const prev = projects[(i - 1 + n) % n];
  const next = projects[(i + 1) % n];

  document.title = p.name + ' case study, Yael';

  // simple text and image fields
  document.querySelectorAll('[data-field="name"]').forEach((el) => { el.textContent = p.name; });
  document.querySelector('[data-field="outcome"]').textContent = p.outcome;
  document.querySelector('[data-field="industry"]').textContent = p.industry;
  // role, company and year keep their [placeholder] text until a project gives them
  ['role', 'company', 'year'].forEach((key) => {
    if (p[key]) document.querySelector('[data-field="' + key + '"]').textContent = p[key];
  });
  document.querySelector('[data-field="backdrop"]').src = p.backdrop;
  let shot = document.querySelector('[data-field="image"]');
  if (p.hero) {
    // a composed head image (e.g. device mockups from Figma) fills the frame, no backdrop around it
    shot.src = p.hero;
    shot.alt = p.heroAlt || p.alt;
    document.querySelector('.case-hero').classList.add('is-full');
    // a head image that is not 16:9 sets its own proportions so nothing is cropped
    if (p.heroAspect) document.querySelector('.case-hero').style.aspectRatio = p.heroAspect;
    // a head image on a transparent background sits on this colour
    if (p.heroBg) {
      document.querySelector('.case-hero').style.background = p.heroBg;
      document.querySelector('.case-hero').classList.add('is-bare');
    }
  } else if (p.video) {
    const v = document.createElement('video');
    v.className = shot.className;
    v.dataset.field = 'image';
    v.src = p.video;
    v.poster = p.image;
    v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    shot.replaceWith(v);
    shot = v;
    document.querySelector('.case-hero').classList.add('is-video');
  } else {
    shot.src = p.image;
  }
  if (!p.hero) shot.setAttribute(p.video ? 'aria-label' : 'alt', p.alt);

  if (p.lead) document.querySelector('.case-lead').textContent = p.lead;
  // lead: false drops the opening statement under the meta row
  if (p.lead === false) document.querySelector('.case-lead').remove();
  // longTitle: a long project name is set smaller so it stays on one line
  if (p.longTitle) document.querySelector('.case-title h1').classList.add('is-long');
  // titleSize: a project can set its own title size (any CSS length, e.g. a clamp())
  if (p.titleSize) document.querySelector('.case-title h1').style.fontSize = p.titleSize;

  // chapters: a project can list its own (see projects.js); otherwise the shared template below.
  // An image is { src, alt, wide } composed in Figma, { crop: 'x% y%', zoom } taken from the
  // screenshot, or { placeholder: 'text' }.
  const chapters = p.chapters || [
    { title: 'The hypothesis', line: '[What we believed, and for whom.]',
      body: '[Describe the assumption the project started from: who it is for, what we expected to change, and what made us think so.]',
      media: { placeholder: '[Add image: the old experience or a key pain point]' } },
    { title: 'Research', line: '[What you set out to learn.]',
      body: '[The research you ran, who you spoke to, and the one insight that changed the direction.]',
      media: { placeholder: '[Add image: research synthesis or user quotes]' } },
    { title: 'Direction', line: '[The idea the design grew from.]',
      body: '[The concept you chose, the options you dropped, and why.]',
      media: { crop: p.crops[1], zoom: 1.8 } },
    { title: 'Design', line: '[The screens and details that matter most.]',
      body: '[Walk through the main flow and the decisions behind it.]',
      media: { crop: '50% 0%', zoom: 1 } },
    { title: 'Result', line: '[What shipped and what changed.]',
      body: '[How the work landed with users and the team, and what you would do next.]',
      media: { crop: p.crops[0], zoom: 2.2 } }
  ];

  const list = document.querySelector('.chapter-list');
  const tpl = document.getElementById('chapter-template');

  // A pinned scene: the page holds still while scrolling, the text and the big screen swap, and a frame slides down the small page.
  function buildScene(sc) {
    const frag = document.createDocumentFragment();
    const article = document.createElement('article');
    article.className = 'chapter is-sub is-scene';
    const scene = document.createElement('div');
    scene.className = 'scene';
    const stick = document.createElement('div');
    stick.className = 'scene-stick';
    const left = document.createElement('div');
    left.className = 'scene-left';
    const copy = document.createElement('div');
    copy.className = 'scene-copy';
    const media = document.createElement('div');
    media.className = 'scene-media';
    sc.steps.forEach((st) => {
      const step = document.createElement('div');
      step.className = 'scene-step';
      const h = document.createElement('h3');
      h.className = 'chapter-title display';
      h.textContent = st.title;
      const para = document.createElement('p');
      para.className = 'scene-text';
      para.textContent = st.body;
      step.append(h, para);
      copy.append(step);
      const img = document.createElement('img');
      img.className = 'scene-shot';
      img.src = st.media.src;
      img.alt = st.media.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      media.append(img);
    });
    const thumb = document.createElement('div');
    thumb.className = 'scene-thumb';
    const timg = document.createElement('img');
    timg.src = sc.thumb.src;
    timg.alt = sc.thumb.alt || '';
    timg.loading = 'lazy';
    const frame = document.createElement('span');
    frame.className = 'scene-frame';
    frame.setAttribute('aria-hidden', 'true');
    thumb.append(timg, frame);
    left.append(copy, thumb);
    stick.append(left, media);
    scene.append(stick);
    scene.dataset.steps = JSON.stringify(sc.steps.map((st) => st.frame));
    article.append(scene);
    frag.append(article);
    return frag;
  }

  // Builds one chapter or, when no number is given, a sub-section that sits under a chapter.
  function buildChapter(c, num) {
    if (c.scene) return buildScene(c.scene);
    const node = tpl.content.cloneNode(true);
    const numEl = node.querySelector('.chapter-num');
    if (num) {
      numEl.textContent = num;
    } else {
      numEl.remove();
      node.querySelector('.chapter').classList.add('is-sub');
    }
    const titleEl = node.querySelector('.chapter-title');
    // no title: the sub-section opens with its line alone, optionally led by a bold phrase (c.bold)
    if (c.title) titleEl.textContent = c.title; else titleEl.remove();
    const line = node.querySelector('.chapter-line');
    if (c.line) {
      line.textContent = c.line;
      if (c.bold) {
        const strong = document.createElement('strong');
        strong.textContent = c.bold;
        line.prepend(strong, ' ');
      }
    } else line.remove();
    // no heading at all: the sub-section is just its image
    if (!c.title && !c.line && !c.bold && !num) node.querySelector('.chapter-head').remove();
    // lineBelow: the line sits under the title as a subtitle instead of in its own column
    if (c.line && c.lineBelow) node.querySelector('.chapter').classList.add('has-subtitle');
    if (c.stats) {
      // stats: a row of large numbers, each with a line of text
      const grid = document.createElement('div');
      grid.className = 'impact-grid';
      c.stats.forEach((it) => {
        const cell = document.createElement('div');
        const big = document.createElement('span');
        big.className = 'impact-number display';
        big.textContent = it.number;
        const txt = document.createElement('p');
        txt.textContent = it.text;
        cell.append(big, txt);
        grid.append(cell);
      });
      node.querySelector('.chapter-body').replaceChildren(grid);
      node.querySelector('.chapter').classList.add('is-stats');
      return node;
    }
    const text = node.querySelector('.chapter-text');
    [].concat(c.body || []).forEach((para) => {
      const el = document.createElement('p');
      el.textContent = para;
      text.append(el);
    });
    if (c.points) {
      const ul = document.createElement('ul');
      // quotes: the items are quotations, so no bullet dots
      ul.className = 'chapter-points' + (c.quotes ? ' is-quotes' : '');
      c.points.forEach((item) => {
        // a point is a string, or { text, tag } where tag is a small coloured label under it
        const pt = typeof item === 'string' ? item : item.text;
        const li = document.createElement('li');
        if (c.quotes && pt.startsWith('“')) {
          // the opening quote mark is lifted out so it can be set very large above the quote
          const mark = document.createElement('span');
          mark.className = 'quote-mark';
          mark.textContent = '“';
          li.append(mark, pt.slice(1));
        } else if (c.boldLead && pt.indexOf('. ') > 0) {
          // boldLead: the first sentence of each point is set in bold
          const cut = pt.indexOf('. ') + 1;
          const strong = document.createElement('strong');
          strong.textContent = pt.slice(0, cut);
          li.append(strong, pt.slice(cut));
        } else {
          li.textContent = pt;
        }
        if (item.tag) {
          const tag = document.createElement('span');
          tag.className = 'point-tag';
          tag.textContent = item.tag;
          li.append(tag);
        }
        ul.append(li);
      });
      text.append(ul);
    }
    // thumb: a small detail picture under the text, showing where the full screen comes from
    if (c.thumb) {
      const th = document.createElement('img');
      th.className = 'chapter-thumb';
      th.src = c.thumb.src;
      th.alt = c.thumb.alt || '';
      th.loading = 'lazy';
      text.append(th);
    }
    const media = node.querySelector('.chapter-media');
    // lineAfter: the line moves from the heading to a caption under the image
    if (c.line && c.lineAfter) {
      line.classList.add('is-caption');
      node.querySelector('.chapter-body').append(line);
    }
    // full: the image runs the full width of the page content, past the sub-section indent
    if (c.media && c.media.full) node.querySelector('.chapter').classList.add('is-full');
    if (!c.media) {
      // no image: the paragraphs sit side by side across the chapter
      media.remove();
      node.querySelector('.chapter').classList.add('is-split');
    } else if (c.media.row) {
      // a horizontal row of equal tiles: images, or placeholders for recordings still to come
      node.querySelector('.chapter').classList.add('is-wide');
      media.classList.add('is-row');
      // stack: the images sit one after the other, each at its own proportions
      if (c.media.row.stack) media.classList.add('is-stack');
      // natural: the images keep their own proportions instead of one shared crop
      if (c.media.row.natural) media.classList.add('is-natural');
      if (c.media.row.images) {
        c.media.row.images.forEach((im) => {
          const img = document.createElement('img');
          img.src = im.src;
          img.alt = im.alt || '';
          img.loading = 'lazy';
          img.decoding = 'async';
          media.append(img);
        });
      } else {
        for (let i = 1; i <= c.media.row.count; i++) {
          const ph = document.createElement('span');
          ph.className = 'placeholder';
          ph.textContent = c.media.row.placeholder + ' ' + i;
          media.append(ph);
        }
      }
    } else if (c.media.strip) {
      // strip: screens side by side at their own size, scrolling sideways
      media.classList.add('is-strip');
      c.media.strip.images.forEach((im) => {
        const img = document.createElement('img');
        img.src = im.src;
        img.alt = im.alt || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        media.append(img);
      });
      // the strip sits in a wrapper that runs to the window edges, with an arrow on each side to page through the screens
      const wrap = document.createElement('div');
      wrap.className = 'strip-wrap';
      media.replaceWith(wrap);
      wrap.append(media);
      const chevron = (flip) => '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"' + (flip ? ' style="transform:scaleX(-1)"' : '') + '><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const mk = (cls, label, flip) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'strip-arrow ' + cls;
        btn.setAttribute('aria-label', label);
        btn.innerHTML = chevron(flip);
        return btn;
      };
      const next = mk('is-next', 'Show the next screens', false);
      const back = mk('is-back', 'Show the previous screens', true);
      wrap.append(back, next);
      const step = () => Math.max(300, media.clientWidth * 0.7);
      next.addEventListener('click', () => media.scrollBy({ left: step(), behavior: 'smooth' }));
      back.addEventListener('click', () => media.scrollBy({ left: -step(), behavior: 'smooth' }));
      const sync = () => {
        // both arrows always show; one is disabled when there is nothing further that way
        back.disabled = media.scrollLeft < 8;
        next.disabled = media.scrollLeft + media.clientWidth >= media.scrollWidth - 8;
      };
      media.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      window.addEventListener('load', sync);
      sync();
    } else if (c.media.video && !c.media.phone) {
      // a silent looping clip, e.g. a screen recording
      media.classList.add('is-video');
      if (c.media.frame) {
        // frame: the clip plays inside a device mockup, laid over the screen of this picture
        media.classList.add('is-device');
        const frame = document.createElement('img');
        frame.className = 'device-frame';
        frame.src = c.media.frame;
        frame.alt = '';
        media.append(frame);
      }
      const v = document.createElement('video');
      v.src = c.media.video;
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('aria-label', c.media.alt || '');
      media.append(v);
    } else if (c.media.phones) {
      // phones: a row of phone mockups, each with its own screen, scrolling sideways
      media.classList.add('is-phones');
      c.media.phones.screens.forEach((sc) => {
        const mock = document.createElement('div');
        mock.className = 'phone-mock';
        const frame = document.createElement('img');
        frame.className = 'phone-frame';
        frame.src = c.media.phones.frame;
        frame.alt = '';
        const screen = document.createElement('img');
        screen.className = 'phone-screen';
        screen.src = sc.src;
        screen.alt = sc.alt || '';
        screen.loading = 'lazy';
        mock.append(frame, screen);
        media.append(mock);
      });
    } else if (c.media.phone) {
      // phone: a phone mockup with a screen image laid over its display
      media.classList.add('is-phone');
      node.querySelector('.chapter').classList.add('has-phone');
      // the heading joins the text column, so heading and paragraph sit together beside the phone
      const phoneTitle = node.querySelector('.chapter-title');
      if (phoneTitle && !c.line) {
        node.querySelector('.chapter-text').prepend(phoneTitle);
        node.querySelector('.chapter-head').remove();
      }
      const frame = document.createElement('img');
      frame.className = 'phone-frame';
      frame.src = c.media.phone;
      frame.alt = '';
      let screen;
      if (c.media.video) {
        // a screen recording plays on the phone's display (the image is its poster until it loads)
        screen = document.createElement('video');
        screen.src = c.media.video;
        if (c.media.src) screen.poster = c.media.src;
        screen.muted = true; screen.loop = true; screen.autoplay = true; screen.playsInline = true;
        screen.setAttribute('aria-label', c.media.alt || '');
      } else {
        screen = document.createElement('img');
        screen.src = c.media.src;
        screen.alt = c.media.alt || '';
        screen.loading = 'lazy';
      }
      screen.className = 'phone-screen';
      media.append(frame, screen);
    } else if (c.media.annotated) {
      // annotated: a diagram with notes laid over it as separate layers; each note appears as the page scrolls to it
      media.classList.add('is-composed', 'is-bare');
      const wrap = document.createElement('div');
      wrap.className = 'annot';
      const base = document.createElement('img');
      base.src = c.media.annotated.base;
      base.alt = c.media.alt || '';
      base.loading = 'lazy';
      base.decoding = 'async';
      wrap.append(base);
      c.media.annotated.layers.forEach((l) => {
        const note = document.createElement('img');
        note.className = 'annot-layer';
        note.src = l.src;
        note.alt = '';
        note.decoding = 'async';
        // at: how far down the diagram (0 to 1) the note sits; it shows once that point has risen into the screen
        note.dataset.at = l.at;
        wrap.append(note);
      });
      media.append(wrap);
    } else if (c.media.src) {
      if (c.media.wide) node.querySelector('.chapter').classList.add('is-wide');
      media.classList.add('is-composed');
      // bare: the image has its own backdrop and shadows, so no white card or hairline around it
      if (c.media.bare) media.classList.add('is-bare');
      // narrow: a portrait image (a phone screen) keeps to its own width
      if (c.media.narrow) media.classList.add('is-narrow');
      // scroll: a very wide image that scrolls sideways inside the column
      if (c.media.scroll) media.classList.add('is-scroll');
      const img = document.createElement('img');
      img.src = c.media.src;
      img.alt = c.media.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      if (c.media.overlays) {
        // overlays: animated GIFs that loop on top of the image, placed in percent of the image so they stay in register
        const wrap = document.createElement('div');
        wrap.className = 'overlay-wrap';
        wrap.append(img);
        c.media.overlays.forEach((o) => {
          const g = document.createElement('img');
          g.className = 'overlay-gif';
          g.src = o.src;
          g.alt = '';
          g.decoding = 'async';
          g.style.left = o.x + '%';
          g.style.top = o.y + '%';
          g.style.width = o.w + '%';
          g.style.height = o.h + '%';
          wrap.append(g);
        });
        media.append(wrap);
      } else {
        media.append(img);
      }
    } else if (c.media.placeholder) {
      const ph = document.createElement('span');
      ph.className = 'placeholder';
      ph.textContent = c.media.placeholder;
      media.append(ph);
    } else {
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.name + ' ' + c.title.toLowerCase();
      img.loading = 'lazy';
      img.style.objectPosition = c.media.crop;
      img.style.transformOrigin = c.media.crop;
      img.style.transform = 'scale(' + c.media.zoom + ')';
      media.append(img);
    }
    return node;
  }

  let count = 0;
  chapters.forEach((c) => {
    if (c.statement) {
      // statement: a large centred sentence between chapters; it takes no number
      const st = document.createElement('p');
      st.className = 'chapter-statement display';
      st.textContent = c.statement;
      list.append(st);
      return;
    }
    count += 1;
    const node = buildChapter(c, String(count).padStart(2, '0'));
    const article = node.querySelector('.chapter');
    // a chapter that is only a title (its content is all in its sub-sections) lets the first one sit right under it
    if (!c.body && !c.points && !c.media && !c.stats) article.classList.add('is-title-only');
    list.append(node);
    if (c.sections) {
      // sections: sub-sections that sit under the chapter, in its column, with no number or divider of their own
      article.classList.add('has-subs');
      c.sections.forEach((s, j) => {
        const sub = buildChapter(s);
        // subGap: room (px) between a title-only chapter and its first sub-section, instead of the tight default
        if (j === 0 && c.subGap) {
          const first = sub.querySelector('.chapter');
          first.style.paddingTop = 'min(' + c.subGap + 'px, 12vw)';
          first.style.marginTop = '0';
        }
        if (j === c.sections.length - 1) sub.querySelector('.chapter').classList.add('is-last');
        list.append(sub);
      });
    }
  });

  // chaptersTitle: false drops the "How it came together" heading and the divider under it
  if (p.chaptersTitle === false) {
    const section = list.closest('.case-chapters');
    document.getElementById('chapters-heading').remove();
    section.removeAttribute('aria-labelledby');
    section.setAttribute('aria-label', 'How it came together');
    list.classList.add('no-top-rule');
  }

  // impact: a project can give the Impact section its own title and number + text items
  if (p.impact) {
    document.getElementById('impact-heading').textContent = p.impact.title;
    document.querySelector('.impact-grid').replaceChildren(...p.impact.items.map((it) => {
      const cell = document.createElement('div');
      const num = document.createElement('span');
      num.className = 'impact-number display';
      num.textContent = it.number;
      const txt = document.createElement('p');
      txt.textContent = it.text;
      cell.append(num, txt);
      return cell;
    }));
  }

  // team: false drops the Team line
  if (p.team === false) document.querySelector('.case-team').remove();

  // impactSection: false drops the shared Impact section (a project can show its numbers inside a chapter instead)
  if (p.impactSection === false) document.querySelector('.case-impact').remove();

  // impactAfter: show the Impact section after the chapter with this title, and carry on with the rest below it
  const split = p.impactAfter ? chapters.findIndex((c) => c.title === p.impactAfter) : -1;
  if (split >= 0 && split < chapters.length - 1) {
    const impact = document.querySelector('.case-impact');
    const first = list.closest('.case-chapters');
    const rest = document.createElement('section');
    rest.className = 'case-chapters is-continued';
    const restList = document.createElement('div');
    restList.className = 'chapter-list';
    restList.append(...[...list.children].slice(split + 1));
    rest.append(restList);
    list.classList.add('no-rule');
    first.after(impact);
    impact.after(rest);
  }

  // previous / next
  [['prev', prev], ['next', next]].forEach(([key, q]) => {
    const link = document.querySelector('[data-field="' + key + '"]');
    link.href = window.caseStudyUrl(q.slug);
    link.querySelector('.glimpse img').src = q.image;
    link.querySelector('.project-link-name').textContent = q.name;
  });

  document.querySelector('[data-back-to-top]').addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  // phone rows run out to both edges of the window, so the phones are never cut off mid-page;
  // the first phone still starts where it did (the space to its left becomes padding inside the row)
  const bleedRows = () => {
    document.querySelectorAll('.chapter-media.is-phones').forEach((el) => {
      el.style.width = ''; el.style.marginLeft = ''; el.style.paddingLeft = '';
      const left = el.getBoundingClientRect().left;
      const cs = getComputedStyle(el);
      el.style.marginLeft = (parseFloat(cs.marginLeft) - left) + 'px';
      el.style.paddingLeft = (parseFloat(cs.paddingLeft) + left) + 'px';
      el.style.width = document.documentElement.clientWidth + 'px';
    });
  };
  // screen strips: the wrapper runs to both window edges; the first screen keeps its place on the text edge
  const bleedStrips = () => {
    document.querySelectorAll('.strip-wrap').forEach((wrap) => {
      const strip = wrap.firstElementChild;
      wrap.style.width = ''; wrap.style.marginLeft = ''; strip.style.paddingLeft = '';
      const left = wrap.getBoundingClientRect().left;
      wrap.style.marginLeft = (parseFloat(getComputedStyle(wrap).marginLeft) - left) + 'px';
      wrap.style.width = document.documentElement.clientWidth + 'px';
      strip.style.paddingLeft = (parseFloat(getComputedStyle(strip).paddingLeft) + left) + 'px';
      // the arrows sit level with the line of text above the strip
      const head = wrap.closest('.chapter').querySelector('.chapter-head');
      if (head) {
        const hr = head.getBoundingClientRect();
        wrap.style.setProperty('--arrow-top', (hr.top + hr.height / 2 - wrap.getBoundingClientRect().top) + 'px');
      }
    });
  };
  bleedStrips();
  window.addEventListener('resize', bleedStrips);
  window.addEventListener('load', bleedStrips);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(bleedStrips);
  bleedRows();
  window.addEventListener('resize', bleedRows);
  window.addEventListener('load', bleedRows);

  // the phone row waits until it is centred on the screen, then stays put while scrolling down the page
  // slides the phones sideways to the last one, and only then lets the page move on (reversed going up)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rows = [...document.querySelectorAll('.chapter-media.is-phones')];
    const travel = (el) => Math.max(0, el.scrollWidth - el.clientWidth);
    const stickTop = (el) => Math.max(72, (window.innerHeight - el.offsetHeight) / 2);
    const pin = () => {
      rows.forEach((el) => {
        el.style.position = 'sticky';
        el.style.alignSelf = 'start';
        el.style.top = stickTop(el) + 'px';
        // the row's parent is made as tall as the row plus the distance it has to travel, so it can stay stuck that long
        el.parentElement.style.minHeight = (el.offsetHeight + travel(el)) + 'px';
      });
    };
    const slideRows = () => {
      rows.forEach((el) => {
        const stuck = stickTop(el) - el.parentElement.getBoundingClientRect().top;
        const max = travel(el);
        el.scrollLeft = max ? Math.min(1, Math.max(0, stuck / max)) * max : 0;
      });
    };
    if (rows.length) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; slideRows(); }); }
      }, { passive: true });
      const refresh = () => { bleedRows(); pin(); slideRows(); };
      window.addEventListener('resize', refresh);
      window.addEventListener('load', refresh);
      refresh();
    }
  }

  // pinned scenes: while the scene is stuck to the screen, scrolling swaps the text and the big screen (one fades out, then the next
  // fades in) and slides a frame down the small page to show where on it the big screen comes from
  const scenes = [...document.querySelectorAll('.scene')];
  if (scenes.length) {
    const reduceQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    const phoneQ = window.matchMedia('(max-width: 760px)');
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const smooth = (v) => v * v * (3 - 2 * v);
    const frames = scenes.map((sc) => JSON.parse(sc.dataset.steps));
    const updateScenes = () => {
      const still = reduceQ.matches || phoneQ.matches;
      scenes.forEach((sc, i) => {
        sc.classList.toggle('is-static', still);
        const steps = sc.querySelectorAll('.scene-step');
        const shots = sc.querySelectorAll('.scene-shot');
        const frame = sc.querySelector('.scene-frame');
        if (still) {
          [...steps, ...shots].forEach((el) => { el.style.opacity = ''; el.style.transform = ''; });
          frame.style.top = ''; frame.style.height = '';
          return;
        }
        const rect = sc.getBoundingClientRect();
        const span = Math.max(1, rect.height - window.innerHeight);
        const p = clamp(-rect.top / span);
        // the frame travels from the first position to the second over the middle of the scroll
        const t = smooth(clamp((p - 0.3) / 0.4));
        const f0 = frames[i][0], f1 = frames[i][frames[i].length - 1];
        frame.style.top = ((f0.y + (f1.y - f0.y) * t) * 100) + '%';
        frame.style.height = ((f0.h + (f1.h - f0.h) * t) * 100) + '%';
        // text and screen: the first fades out during the first half of the move, the second fades in during the second half
        const o = [clamp(1 - 2 * t), clamp(2 * t - 1)];
        steps.forEach((el, k) => {
          const v = o[k] === undefined ? 0 : o[k];
          el.style.opacity = v;
          el.style.transform = 'translateY(' + ((1 - v) * (k === 0 ? -14 : 14)) + 'px)';
          el.style.pointerEvents = v > 0.5 ? 'auto' : 'none';
        });
        shots.forEach((el, k) => { el.style.opacity = o[k] === undefined ? 0 : o[k]; });
      });
    };
    let sceneQueued = false;
    window.addEventListener('scroll', () => {
      if (!sceneQueued) { sceneQueued = true; requestAnimationFrame(() => { sceneQueued = false; updateScenes(); }); }
    }, { passive: true });
    window.addEventListener('resize', updateScenes);
    window.addEventListener('load', updateScenes);
    updateScenes();
  }

  // annotated diagrams: each note appears, one after the other, as its place in the diagram rises into the screen
  const annots = [...document.querySelectorAll('.annot')];
  if (annots.length) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const update = () => {
      annots.forEach((wrap) => {
        const rect = wrap.getBoundingClientRect();
        wrap.querySelectorAll('.annot-layer').forEach((note) => {
          const y = rect.top + parseFloat(note.dataset.at) * rect.height;
          note.classList.toggle('is-on', reduce || y < window.innerHeight * 0.7);
        });
      });
    };
    let queued = false;
    window.addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); }
    }, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  }

  // reveal on scroll: content fades and rises into place as it enters the screen
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll(
      '.case-title, .case-hero, .case-meta, .case-lead, .case-section-title, .chapter-head, .chapter-text, ' +
      '.chapter-media, .chapter-body > .chapter-line, .case-impact, .project-nav');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.documentElement.classList.add('has-reveal');
    targets.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  }
})();
