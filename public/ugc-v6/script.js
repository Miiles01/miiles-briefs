(() => {
  const d = document, root = d.documentElement;
  const $ = (s, c = d) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const piezas = (window.UGC && UGC.contenido.piezas) || [];
  const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);
  let lenis = null;

  /* ---------- Menú a pantalla completa ---------- */
  const menu = d.getElementById('menu'), menuBtn = d.querySelector('.menu-btn');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', !open);
    menuBtn.classList.toggle('on', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.querySelector('.menu-label').textContent = open ? 'Cerrar' : 'Menú';
    root.classList.toggle('lock', open);
    lenis && (open ? lenis.stop() : lenis.start());
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  matchMedia('(min-width: 1181px)').addEventListener('change', e => e.matches && setMenu(false));

  /* ---------- Navegación: se esconde al bajar, vuelve al subir; enlace activo ---------- */
  const top = d.querySelector('.top');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (!root.classList.contains('lock')) top.classList.toggle('is-hidden', y > lastY && y > 300);
    lastY = y;
  }, { passive: true });
  const links = $('.nav-link');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(a => { const t = d.querySelector(a.getAttribute('href')); t && io.observe(t); });
  }

  /* ---------- Carrusel: flechas, arrastre con mouse, swipe nativo y barra de progreso ---------- */
  const reel = d.querySelector('[data-reel]');
  const track = reel.querySelector('.reel-track'), fillBar = reel.querySelector('.reel-bar span');
  const [prev, next] = $('.round[data-dir]', reel);
  const step = () => { const it = track.querySelector('.reel-item'); return it ? it.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth * .8; };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const vis = Math.min(1, track.clientWidth / track.scrollWidth);
    const p = max > 0 ? track.scrollLeft / max : 0;
    fillBar.style.width = vis * 100 + '%';
    fillBar.style.transform = `translateX(${p * (1 - vis) / vis * 100}%)`;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  };
  track.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
  [prev, next].forEach(btn => btn.addEventListener('click', () => {
    const per = Math.max(1, Math.floor(track.clientWidth / step()) - 1);
    track.scrollBy({ left: Number(btn.dataset.dir) * step() * per, behavior: 'smooth' });
  }));
  let down = null, moved = false;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = { x: e.clientX, left: track.scrollLeft }; moved = false;
  });
  addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - down.x;
    if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('is-dragging'); }
    if (moved) track.scrollLeft = down.left - dx;
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    down = null;
    if (moved) {
      track.classList.remove('is-dragging');
      const s = step();
      track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior: 'smooth' });
      setTimeout(() => { moved = false; }, 0);
    }
  });
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  // Videos en silencio, solo mientras están en pantalla
  const vids = $('video[data-src]', track);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src) { v.src = v.dataset.src; v.preload = 'auto'; }
        if (!reduce && !root.classList.contains('viewing')) v.play().catch(() => {});
      } else v.pause();
    }), { threshold: .55 });
    vids.forEach(v => io.observe(v));
  } else vids.forEach(v => { v.src = v.dataset.src; });

  /* ---------- Visor grande: video con sonido y controles ---------- */
  const viewer = d.getElementById('viewer');
  const stage = viewer.querySelector('.viewer-stage'), cap = viewer.querySelector('.viewer-cap');
  let lastFocus = null;
  const openViewer = (i, from) => {
    const p = piezas[i]; if (!p) return;
    lastFocus = from;
    $('video', track).forEach(v => v.pause());
    stage.innerHTML = isVideo(p.src) ? `<video src="${p.src}" controls autoplay playsinline></video>` : `<img src="${p.src}" alt="${p.titulo}">`;
    cap.textContent = `${p.titulo} · ${p.tipo} · ${p.nicho}`;
    viewer.hidden = false;
    requestAnimationFrame(() => viewer.classList.add('open'));
    root.classList.add('viewing');
    lenis && lenis.stop();
    viewer.querySelector('.viewer-close').focus();
  };
  const closeViewer = () => {
    if (viewer.hidden) return;
    viewer.classList.remove('open');
    root.classList.remove('viewing');
    lenis && lenis.start();
    const v = stage.querySelector('video'); v && v.pause();
    setTimeout(() => { viewer.hidden = true; stage.innerHTML = ''; }, 350);
    lastFocus && lastFocus.focus({ preventScroll: true });
    $('video[src]', track).forEach(v => { const r = v.getBoundingClientRect(); if (!reduce && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight) v.play().catch(() => {}); });
  };
  track.addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openViewer(Number(c.dataset.i), c); });
  viewer.addEventListener('click', e => { if (e.target === viewer || e.target === stage || e.target.closest('.viewer-close')) closeViewer(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') viewer.hidden ? setMenu(false) : closeViewer(); });

  /* ---------- Sin GSAP o con movimiento reducido: página estática funcional ---------- */
  const unhide = () => root.classList.remove('is-loading');
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    root.classList.remove('has-loader');
    unhide();
    $('a[href^="#"]').forEach(a => a.addEventListener('click', () => setMenu(false)));
    return;
  }

  root.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const EASE = 'power4.out';

  /* ---------- Smooth scroll ---------- */
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'), target = id.length > 1 ? d.querySelector(id) : d.body;
    if (!target) return;
    e.preventDefault();
    const wasOpen = menu.classList.contains('open');
    setMenu(false);
    const go = () => lenis ? lenis.scrollTo(target, { offset: id === '#top' ? 0 : -24, duration: 1.5, easing: t => 1 - Math.pow(1 - t, 4) }) : target.scrollIntoView({ behavior: 'smooth' });
    wasOpen ? setTimeout(go, 400) : go();
  }));

  /* ---------- Utilidades de texto con máscara (SplitText) ---------- */
  const splitWords = (el, vars, trigger) => window.SplitText
    ? SplitText.create(el, { type: 'words,lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: self => gsap.from(self.words, { yPercent: 115, duration: 1.1, ease: EASE, stagger: .05, ...vars, scrollTrigger: trigger }) })
    : gsap.from(el, { opacity: 0, y: 30, ...vars, scrollTrigger: trigger });
  const splitLines = (el, vars, trigger) => window.SplitText
    ? SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: self => gsap.from(self.lines, { yPercent: 105, duration: .9, ease: 'power3.out', stagger: .1, ...vars, scrollTrigger: trigger }) })
    : gsap.from(el, { opacity: 0, y: 24, ...vars, scrollTrigger: trigger });
  const onView = (el, start = 'top 88%') => ({ trigger: el, start, once: true });

  /* ---------- Entrada del hero (escalonada) ---------- */
  const fontsReady = d.fonts ? Promise.race([d.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve();
  // Loader: la página entra desde abajo mientras el azul se aleja y se oscurece
  const loaderOut = new Promise(res => {
    if (!root.classList.contains('has-loader')) return res();
    const app = d.getElementById('app');
    const since = window.__loaderStart ? (performance.now() - window.__loaderStart) / 1000 : 0;
    gsap.timeline({ delay: Math.max(.15, 1.65 - since) })
      .to('.loader-inner', { scale: .9, yPercent: -6, duration: 1.1, ease: 'power3.inOut' }, 0)
      .to('.loader-shade', { opacity: .55, duration: 1.1, ease: 'power2.in' }, 0)
      .fromTo(app, { y: () => innerHeight }, { y: 0, duration: 1.1, ease: 'power3.inOut', immediateRender: false }, 0)
      .add(res, .55)
      .add(() => { root.classList.remove('has-loader'); gsap.set(app, { clearProps: 'transform' }); ScrollTrigger.refresh(); });
  });
  Promise.all([fontsReady, loaderOut]).then(() => {
    unhide();
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.from('.top', { yPercent: -100, duration: 1 }, 0)
      .from('.hero-kicker', { opacity: 0, y: 16, duration: .8 }, .1);
    if (window.SplitText) {
      const t = SplitText.create('.hero-title', { type: 'chars,words,lines', mask: 'lines', linesClass: 'split-line' });
      tl.from(t.chars, { yPercent: 115, duration: 1.2, stagger: .022 }, .15);
      const s = SplitText.create('.hero-sub', { type: 'lines', mask: 'lines', linesClass: 'split-line' });
      tl.from(s.lines, { yPercent: 105, duration: 1, stagger: .08 }, .55);
    } else tl.from('.hero-title, .hero-sub', { opacity: 0, y: 40, duration: 1 }, .15);
    tl.from('.hero-intro', { opacity: 0, y: 20, duration: .9 }, .7)
      .from('.hero-actions .btn', { opacity: 0, y: 20, duration: .8, stagger: .08 }, .8)
      .from('.hero-socials a', { opacity: 0, scale: .6, duration: .7, stagger: .06, ease: 'back.out(2)' }, .9)
      .from('.hero + .marquee', { opacity: 0, duration: 1 }, .9)
      .from('.hero-img', { clipPath: 'inset(100% 0% 0% 0% round 20px)', duration: 1.4, ease: 'expo.inOut' }, .5)
      .from('.hero-img img', { scale: 1.3, duration: 2, ease: 'expo.out' }, .7);

    /* ---------- Títulos y párrafos al entrar en pantalla ---------- */
    $('.section-title, .cta-title, .clients-title, .profile h2').forEach(el => splitWords(el, {}, onView(el)));
    $('.service h3, .type h3').forEach(el => splitWords(el, { duration: .9, stagger: .04 }, onView(el, 'top 92%')));
    $('.about-p, .cta-kicker, .service p, .type p').forEach(el => splitLines(el, {}, onView(el, 'top 92%')));
    $('.label, .cta-sub, .profile p').forEach(el => gsap.from(el, { opacity: 0, y: 16, duration: .7, ease: 'power3.out', scrollTrigger: onView(el, 'top 92%') }));
    ScrollTrigger.refresh();
  });

  /* ---------- Imagen del hero: crece al ancho completo con el scroll + parallax ---------- */
  const mm = gsap.matchMedia();
  mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, ctx => {
    const narrow = ctx.conditions.narrow;
    gsap.fromTo('.hero-img', { width: narrow ? '86%' : '62%' }, { width: '100%', ease: 'none', scrollTrigger: { trigger: '.hero-img', start: 'top 92%', end: 'center 45%', scrub: true } });
    gsap.fromTo('.hero-img img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.hero-img', start: 'top bottom', end: 'bottom top', scrub: true } });

    // Imágenes de "Sobre mí": cortina + zoom-out + parallax suave
    $('.about-img').forEach((f, i) => {
      gsap.fromTo(f, { clipPath: 'inset(100% 0% 0% 0% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.4, ease: 'expo.inOut', delay: i * .12, scrollTrigger: onView(f) });
      gsap.fromTo(f.querySelector('img'), { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out', delay: i * .12, scrollTrigger: onView(f) });
      if (!narrow) gsap.fromTo(f, { y: i ? 80 : 0 }, { y: i ? -40 : -20, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // El bloque oscuro de contacto se abre como tarjeta al llegar
    gsap.fromTo('.cta', { clipPath: narrow ? 'inset(4% 4% 0% 4% round 20px)' : 'inset(8% 10% 0% 10% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top 95%', end: 'top 35%', scrub: true } });
  });

  /* ---------- Tarjetas, logos y redes: fade + leve subida, escalonados ---------- */
  const batch = (sel, vars = {}) => {
    gsap.set(sel, { opacity: 0, y: 40 });
    ScrollTrigger.batch(sel, { start: 'top 92%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .08, clearProps: 'transform', ...vars }) });
  };
  batch('.reel-item');
  batch('.service');
  batch('.type');
  batch('.quote');
  batch('.socials li');
  batch('.cta-actions .btn');
  batch('.foot-grid > div');
  gsap.from('.reel-head .round', { opacity: 0, scale: .6, duration: .7, stagger: .08, ease: 'back.out(2)', scrollTrigger: onView('.reel-head') });

  /* ---------- Cintas: avanzan solas y aceleran (y cambian de sentido) con el scroll ---------- */
  const marquees = $('.marquee-track').map((t, i) => {
    const dir = t.closest('.marquee.big') && i % 2 ? 1 : -1;
    return { tween: gsap.fromTo(t, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, ease: 'none', duration: t.closest('.logos') ? 40 : 30, repeat: -1 }), base: 1 };
  });
  let boost = 0, sdir = 1, last = scrollY;
  gsap.ticker.add(() => {
    const v = lenis ? lenis.velocity : scrollY - last; last = scrollY;
    if (Math.abs(v) > .1) sdir = v > 0 ? 1 : -1;
    boost += (Math.min(Math.abs(v), 40) * .25 - boost) * .08;
    marquees.forEach(m => m.tween.timeScale(sdir * (1 + boost)));
  });

  /* ---------- Puntero fino: cursor "Arrastra" sobre el carrusel y botones magnéticos ---------- */
  if (fine) {
    const dc = d.querySelector('.drag-cursor');
    const qx = gsap.quickTo(dc, 'x', { duration: .35, ease: 'power3' }), qy = gsap.quickTo(dc, 'y', { duration: .35, ease: 'power3' });
    track.addEventListener('pointermove', e => { qx(e.clientX); qy(e.clientY); });
    track.addEventListener('pointerenter', e => { gsap.set(dc, { x: e.clientX, y: e.clientY }); gsap.to(dc, { scale: 1, opacity: 1, duration: .35, ease: 'back.out(2)' }); });
    track.addEventListener('pointerleave', () => gsap.to(dc, { scale: 0, opacity: 0, duration: .3, ease: 'power2.in' }));
    $('.btn, .round, .menu-btn').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: 'power3' });
      });
      b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1, .45)' }));
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
