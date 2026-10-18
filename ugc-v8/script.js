(() => {
  const d = document, root = d.documentElement;
  const $ = (s, c = d) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const piezas = (window.UGC && UGC.contenido.piezas) || [];
  const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);
  const loader = d.querySelector('.page-loader');
  let lenis = null;

  /* Posiciones finales del collage del hero (en vw / vh), escritorio y móvil */
  const collagePos = narrow => narrow
    ? [[-31, -27, -5], [30, -31, 4], [-33, 21, 4], [32, 17, -4], [18, 35, 3], [-19, 37, -3]]
    : [[-33, -19, -4], [31, -25, 3], [-36, 21, 3], [33, 19, -3], [15, -37, 2], [-14, 37, -2]];

  /* ---------- Menú a pantalla completa ---------- */
  const menu = d.getElementById('menu'), menuBtn = d.querySelector('.menu-btn');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', !open);
    menuBtn.setAttribute('aria-expanded', open);
    $('.roll > span', menuBtn).forEach(s => { s.textContent = open ? 'Cerrar' : 'Menú'; });
    root.classList.toggle('lock', open);
    lenis && (open ? lenis.stop() : lenis.start());
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  matchMedia('(min-width: 1101px)').addEventListener('change', e => e.matches && setMenu(false));

  /* ---------- Visor grande ---------- */
  const viewer = d.getElementById('viewer');
  const stage = viewer.querySelector('.viewer-stage'), cap = viewer.querySelector('.viewer-cap');
  let lastFocus = null;
  const openViewer = (i, from) => {
    const p = piezas[i]; if (!p) return;
    lastFocus = from;
    $('.hscroll video').forEach(v => v.pause());
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
    $('.hscroll video[src]').forEach(v => { const r = v.getBoundingClientRect(); if (!reduce && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight) v.play().catch(() => {}); });
  };
  viewer.addEventListener('click', e => { if (e.target === viewer || e.target === stage || e.target.closest('.viewer-close')) closeViewer(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') viewer.hidden ? setMenu(false) : closeViewer(); });

  /* ---------- Contenido: videos en silencio solo en pantalla ---------- */
  const hs = d.querySelector('.hscroll'), track = d.querySelector('.hscroll_track');
  const fillBar = d.querySelector('.reel-bar span');
  const [prev, next] = $('.reel-arrows .round');
  let dragged = false;
  track.addEventListener('click', e => {
    if (dragged) { e.preventDefault(); e.stopPropagation(); return; }
    const b = e.target.closest('.panel-btn'); if (b) openViewer(Number(b.dataset.i), b);
  });
  const vids = $('video[data-src]', track);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (v.preload !== 'auto') v.preload = 'auto';
        if (!reduce && !root.classList.contains('viewing')) v.play().catch(() => {});
      } else v.pause();
    }), { threshold: .5 });
    vids.forEach(v => io.observe(v));
  }

  /* Modo carrusel nativo (móvil/tablet, o sin GSAP): swipe, flechas, arrastre y barra */
  const nativeMode = () => getComputedStyle(hs).overflowX === 'auto';
  const panelStep = () => { const p = track.querySelector('.panel.img'); return p ? p.offsetWidth + 32 : hs.clientWidth * .8; };
  const setBar = p => {
    const vis = Math.min(1, hs.clientWidth / track.scrollWidth);
    fillBar.style.width = vis * 100 + '%';
    fillBar.style.transform = `translateX(${p * (1 - vis) / vis * 100}%)`;
    prev.disabled = p <= .005; next.disabled = p >= .995;
  };
  const nativeUpdate = () => { if (!nativeMode()) return; const max = hs.scrollWidth - hs.clientWidth; setBar(max > 0 ? hs.scrollLeft / max : 0); };
  hs.addEventListener('scroll', nativeUpdate, { passive: true });
  addEventListener('resize', nativeUpdate);
  let pinST = null;
  [prev, next].forEach(btn => btn.addEventListener('click', () => {
    const dir = Number(btn.dataset.dir);
    if (nativeMode()) return hs.scrollBy({ left: dir * panelStep(), behavior: 'smooth' });
    if (pinST) {
      const dist = pinST.end - pinST.start, per = panelStep() / (track.scrollWidth - innerWidth);
      const target = pinST.start + Math.min(1, Math.max(0, pinST.progress + dir * per * 1.5)) * dist;
      lenis ? lenis.scrollTo(target, { duration: 1 }) : scrollTo({ top: target, behavior: 'smooth' });
    }
  }));
  // Arrastre con el mouse: en modo nativo mueve el carrusel; en escritorio mueve el scroll fijado
  let down = null;
  hs.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button === 0) { down = { x: e.clientX, left: hs.scrollLeft, y: scrollY }; dragged = false; } });
  addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - down.x;
    if (!dragged && Math.abs(dx) > 6) { dragged = true; hs.classList.add('is-dragging'); }
    if (!dragged) return;
    if (nativeMode()) hs.scrollLeft = down.left - dx;
    else if (pinST) { const ratio = (pinST.end - pinST.start) / (track.scrollWidth - innerWidth); const y = down.y - dx * ratio; lenis ? lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); }
  });
  addEventListener('pointerup', () => { if (!down) return; down = null; hs.classList.remove('is-dragging'); setTimeout(() => { dragged = false; }, 0); });
  nativeUpdate();

  /* ---------- Sin GSAP o con movimiento reducido: página estática funcional ---------- */
  const placeCollage = () => {
    const pos = collagePos(innerWidth < 768);
    $('.collage_img').forEach((el, i) => { const [x, y, r] = pos[i]; el.style.transform = `translate(${x}vw, ${y}vh) rotate(${r}deg)`; el.style.opacity = 1; });
  };
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    loader && loader.remove();
    placeCollage();
    $('a[href^="#"]').forEach(a => a.addEventListener('click', () => setMenu(false)));
    return;
  }
  loader.style.animation = 'none';
  root.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- Smooth scroll (misma curva que la plantilla) ---------- */
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  scrollTo(0, 0);
  $('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'), target = id.length > 1 ? d.querySelector(id) : d.body;
    if (!target) return;
    e.preventDefault();
    const wasOpen = menu.classList.contains('open');
    setMenu(false);
    const go = () => lenis ? lenis.scrollTo(id === '#top' ? 0 : target, { duration: 1.6 }) : target.scrollIntoView({ behavior: 'smooth' });
    wasOpen ? setTimeout(go, 450) : go();
  }));

  /* ---------- Estados iniciales (antes del loader) ---------- */
  gsap.set('.hero_image-reveal', { height: 0 });
  gsap.set('.header_word span', { yPercent: 110 });
  gsap.set('.navbar', { yPercent: -100 });
  gsap.set('.header_foot', { opacity: 0, y: 20 });
  gsap.set('.collage_img', { opacity: 0, scale: .4 });
  gsap.set('.mask_reveal', { clipPath: 'inset(100% 0% 0% 0%)' });
  $('.mask_reveal img').forEach(i => gsap.set(i, { scale: 1.25 }));

  const fontsReady = d.fonts ? Promise.race([d.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve();
  fontsReady.then(() => {
    const desktop = innerWidth >= 992;

    /* ---------- Loader + entrada del hero ---------- */
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to(loader, { scaleY: 0, duration: 1.8 })
      .to('.hero_image-reveal', { height: '100%', duration: 2.4 }, '<+.7')
      .fromTo('.header_main-image', { scale: desktop ? 1.3 : 1.1 }, { scale: 1, duration: 2.2 }, '<')
      .to('.header_word span', { yPercent: 0, duration: 1, stagger: .14 }, '<+.5')
      .to('.navbar', { yPercent: 0, duration: 1 }, '<+.3')
      .to('.header_foot', { opacity: 1, y: 0, duration: 1 }, '<')
      .add(() => { loader.remove(); lenis && lenis.start(); }, '<+.2');

    /* ---------- Hero con scroll: la foto crece, se achica y salen más fotos ---------- */
    const mm = gsap.matchMedia();
    mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, ctx => {
      const narrow = ctx.conditions.narrow;
      const pos = collagePos(narrow);
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.header', start: 'top top', end: 'bottom bottom', scrub: 1 } });
      tl.to('.header_brand', { yPercent: -75, ease: 'none', duration: .55 }, 0)
        .to('.header_foot', { opacity: 0, duration: .12 }, 0)
        .to('.hw0, .hw2', { y: -180, opacity: 0, ease: 'none', duration: .3 }, 0)
        .to('.hw1, .hw3', { y: -280, opacity: 0, ease: 'none', duration: .3 }, 0)
        .to('.header_main-image', { scale: narrow ? 1.7 : 1.9, ease: 'power1.inOut', duration: .35 }, 0)
        .to('.header_main-image', { scale: narrow ? .62 : .7, ease: 'power2.inOut', duration: .35 }, .35);
      $('.collage_img').forEach((el, i) => {
        const [x, y, r] = pos[i];
        tl.fromTo(el, { x: 0, y: 0, rotate: 0, scale: .4, opacity: 0 },
          { x: `${x}vw`, y: `${y}vh`, rotate: r, scale: 1, opacity: 1, ease: 'power3.out', duration: .32 }, .42 + i * .04);
      });
      tl.to(['.collage', '.header_main-image'], { yPercent: narrow ? -6 : -10, ease: 'none', duration: .2 }, .8);
    });

    /* ---------- Títulos que viajan al centro ---------- */
    $('[data-center]').forEach(row => {
      const left = row.dataset.center === 'left';
      const kids = [...row.children];
      const getX = () => {
        const content = kids.reduce((a, c) => a + c.offsetWidth, 0) + parseFloat(getComputedStyle(row).columnGap || 0) * (kids.length - 1);
        const free = Math.max(0, (row.clientWidth - content) / 2);
        return left ? -free : free;
      };
      gsap.to(kids, { x: getX, ease: 'power1.out', scrollTrigger: { trigger: row, start: 'top 85%', end: 'bottom 30%', scrub: 1, invalidateOnRefresh: true } });
    });

    /* ---------- Palabras que se encienden con el scroll ---------- */
    $('.color-change').forEach(el => {
      const words = window.SplitText ? SplitText.create(el, { type: 'words', wordsClass: 'word' }).words : [el];
      const on = el.closest('.is-green') ? '#f7f5ea' : '#087a43';
      gsap.to(words, { color: on, stagger: .1, ease: 'steps(1)', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 40%', scrub: 1 } });
    });

    /* ---------- Títulos que entran línea por línea ---------- */
    $('[data-reveal]').forEach(el => {
      if (!window.SplitText) return gsap.from(el, { opacity: 0, y: 40, duration: 1, scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
      SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: self => gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .15, scrollTrigger: { trigger: el, start: 'top 80%', once: true } }) });
    });

    /* ---------- Imágenes con máscara: se descubren desde abajo ---------- */
    $('.mask_reveal').forEach(el => {
      const tl = gsap.timeline({ paused: true, defaults: { duration: 1.6, ease: 'expo.out' } })
        .to(el, { clipPath: 'inset(0% 0% 0% 0%)' }).to(el.querySelector('img'), { scale: 1 }, '<');
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => tl.play() });
    });

    /* ---------- Scroll horizontal fijado (escritorio) ---------- */
    mm.add('(min-width: 992px)', () => {
      const dist = () => track.scrollWidth - innerWidth;
      const tw = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.hpin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
          onUpdate: s => setBar(s.progress), onRefresh: s => setBar(s.progress) }
      });
      pinST = tw.scrollTrigger;
      return () => { pinST = null; };
    });

    /* ---------- Parallax: palabras sueltas, script gigante y wordmark final ---------- */
    $('[data-speed]').forEach(el => {
      const s = parseFloat(el.dataset.speed);
      gsap.to(el, { y: () => (1 - s) * 400, ease: 'none', scrollTrigger: { trigger: '.heads', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });
    gsap.fromTo('.heads_script', { xPercent: 10 }, { xPercent: -15, ease: 'none', scrollTrigger: { trigger: '.heads', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.heads_img img', { yPercent: -8, scale: 1.1 }, { yPercent: 8, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.heads', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.footer_brand', { yPercent: 30 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer_brand', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    /* ---------- Entradas suaves en lote ---------- */
    const batch = sel => {
      gsap.set(sel, { opacity: 0, y: 40 });
      ScrollTrigger.batch(sel, { start: 'top 90%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .08, clearProps: 'transform' }) });
    };
    ['.logos li', '.step .copy', '.type', '.card', '.loc', '.social', '.about-copy > *', '.testimonials .btn'].forEach(batch);

    /* ---------- Navbar: se oculta al bajar, vuelve al subir; cambia de color sobre verde ---------- */
    const nav = d.querySelector('.navbar');
    const show = gsap.to(nav, { yPercent: -110, paused: true, duration: .35, ease: 'power2.out' });
    ScrollTrigger.create({ start: 'top top-=200', end: 'max', onUpdate: s => (s.direction === 1 && !root.classList.contains('lock')) ? show.play() : show.reverse() });
    $('.is-green').forEach(sec => ScrollTrigger.create({ trigger: sec, start: 'top 40px', end: 'bottom 40px', toggleClass: { targets: nav, className: 'on-green' } }));

    ScrollTrigger.refresh();
  });

  // Red de seguridad: el loader nunca se queda tapando la página
  setTimeout(() => { if (d.body.contains(loader)) { loader.remove(); lenis && lenis.start(); gsap.set(['.hero_image-reveal', '.header_word span', '.navbar', '.header_foot'], { clearProps: 'all' }); } }, 6000);

  /* ---------- Botones magnéticos ---------- */
  if (fine) $('.btn, .round').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: 'power3' });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1, .45)' }));
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
