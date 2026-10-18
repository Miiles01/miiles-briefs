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
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.querySelector('.menu-label').textContent = open ? 'Cerrar' : 'Menú';
    root.classList.toggle('lock', open);
    lenis && (open ? lenis.stop() : lenis.start());
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  matchMedia('(min-width: 1181px)').addEventListener('change', e => e.matches && setMenu(false));

  /* ---------- Navegación: se esconde al bajar ---------- */
  const nav = d.querySelector('.nav');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (!root.classList.contains('lock')) nav.classList.toggle('is-hidden', y > lastY && y > 300);
    lastY = y;
    toneSoon();
  }, { passive: true });

  // Color del navbar según el fondo que tiene debajo (claro → tinta, oscuro/color → blanco)
  const lum = c => { const m = c.match(/[\d.]+/g); if (!m || (m[3] !== undefined && +m[3] === 0)) return null; return (.2126 * m[0] + .7152 * m[1] + .0722 * m[2]) / 255; };
  const setTone = () => {
    const h = nav.offsetHeight / 2;
    let el = d.elementsFromPoint(innerWidth / 2, h).find(e => !nav.contains(e)), l = null;
    while (el && l === null) { l = lum(getComputedStyle(el).backgroundColor); el = el.parentElement; }
    nav.classList.toggle('on-light', l !== null && l > .6);
  };
  let toneRaf = 0;
  const toneSoon = () => { if (!toneRaf) toneRaf = requestAnimationFrame(() => { toneRaf = 0; setTone(); }); };
  addEventListener('resize', toneSoon);
  addEventListener('load', toneSoon);

  /* ---------- Pastillas del hero: las fotos se intercambian solas ---------- */
  const pills = $('.pill');
  if (!reduce) setInterval(() => {
    if (d.hidden) return;
    pills.forEach(p => {
      const imgs = $('img', p), i = imgs.findIndex(x => x.classList.contains('on'));
      imgs[i].classList.remove('on'); imgs[(i + 1) % imgs.length].classList.add('on');
    });
  }, 1500);

  /* ---------- Tipos de contenido: lista + vista previa ---------- */
  const tabs = $('.plist button'), panes = $('.pv');
  const showType = i => {
    tabs.forEach((t, k) => { t.classList.toggle('on', k === i); t.setAttribute('aria-selected', k === i); });
    panes.forEach((p, k) => p.classList.toggle('on', k === i));
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => showType(i));
    if (fine) t.addEventListener('mouseenter', () => showType(i));
  });

  /* ---------- Testimonios: slider con autoplay, puntos, flechas y swipe ---------- */
  const slides = $('.slide'), dots = $('.dots button');
  let cur = 0, timer = null;
  const go = i => {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k !== cur); });
    dots.forEach((b, k) => b.classList.toggle('on', k === cur));
  };
  const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(cur + 1), 6000); };
  dots.forEach((b, i) => b.addEventListener('click', () => { go(i); auto(); }));
  $('[data-go]').forEach(b => b.addEventListener('click', () => { go(cur + Number(b.dataset.go)); auto(); }));
  const slider = d.querySelector('.slider');
  let sx = null;
  slider.addEventListener('pointerdown', e => { sx = e.clientX; });
  slider.addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); auto(); }
  });
  auto();

  /* ---------- Carrusel de reels ---------- */
  const reel = d.querySelector('[data-reel]');
  const track = reel.querySelector('.reel-track'), fillBar = reel.querySelector('.reel-bar span');
  const [prev, next] = $('.work .round[data-dir]');
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

  /* ---------- Visor grande ---------- */
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
  track.addEventListener('click', e => { const c = e.target.closest('.reel-card'); if (c) openViewer(Number(c.dataset.i), c); });
  viewer.addEventListener('click', e => { if (e.target === viewer || e.target === stage || e.target.closest('.viewer-close')) closeViewer(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') viewer.hidden ? setMenu(false) : closeViewer();
    if (d.activeElement && d.activeElement.closest('.testi') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { go(cur + (e.key === 'ArrowRight' ? 1 : -1)); auto(); }
  });

  /* ---------- Sin GSAP o con movimiento reducido: página estática funcional ---------- */
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    root.classList.remove('has-loader', 'hero-hold');
    $('a[href^="#"]').forEach(a => a.addEventListener('click', () => setMenu(false)));
    return;
  }

  root.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- Smooth scroll (mismos ajustes que la referencia) ---------- */
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .1, wheelMultiplier: .9, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'), target = id.length > 1 ? d.querySelector(id) : d.body;
    if (!target) return;
    e.preventDefault();
    const wasOpen = menu.classList.contains('open');
    setMenu(false);
    const go2 = () => lenis ? lenis.scrollTo(target, { duration: 1.5, easing: t => 1 - Math.pow(1 - t, 4) }) : target.scrollIntoView({ behavior: 'smooth' });
    wasOpen ? setTimeout(go2, 450) : go2();
  }));

  /* ---------- Textos: letras y palabras que suben (parámetros de la referencia) ---------- */
  // Se reproduce al entrar y se reinicia al salir por abajo, como en el sitio de referencia.
  const replay = (el, tl) => {
    ScrollTrigger.create({ trigger: el, start: 'top bottom', onLeaveBack: () => { tl.progress(0).pause(); } });
    ScrollTrigger.create({ trigger: el, start: 'top 82%', onEnter: () => tl.play() });
  };
  const fontsReady = d.fonts ? Promise.race([d.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve();

  // Loader: la página entra desde abajo mientras el lima se aleja y se oscurece
  const loaderOut = new Promise(res => {
    if (!root.classList.contains('has-loader')) { lenis && lenis.start(); return res(); }
    const app = d.getElementById('app');
    const since = window.__loaderStart ? (performance.now() - window.__loaderStart) / 1000 : 0;
    gsap.timeline({ delay: Math.max(.15, 1.65 - since) })
      .to('.loader-inner', { scale: .9, yPercent: -6, duration: 1.1, ease: 'power3.inOut' }, 0)
      .to('.loader-shade', { opacity: .55, duration: 1.1, ease: 'power2.in' }, 0)
      .fromTo(app, { y: () => innerHeight }, { y: 0, duration: 1.1, ease: 'power3.inOut', immediateRender: false }, 0)
      .add(res, .55)
      .add(() => { root.classList.remove('has-loader'); gsap.set(app, { clearProps: 'transform' }); scrollTo(0, 0); lenis && lenis.start(); ScrollTrigger.refresh(); });
  });

  fontsReady.then(() => {
    /* ---------- Loader → entrada del hero ---------- */
    // Entrada con fade (sin máscaras, así la letra nunca se corta)
    const heroWords = window.SplitText ? SplitText.create('.hero-title .lw', { type: 'words' }).words : $('.hero-title .lw');
    gsap.set(heroWords, { opacity: 0, y: 24, filter: 'blur(6px)' });
    gsap.set('.pill', { opacity: 0, scale: .85 });
    gsap.set('.hero .shape', { opacity: 0, scale: .4 });
    gsap.set(['.hero-intro', '.hero-socials a', '.scroll-arrow'], { opacity: 0, y: 24 });
    gsap.set('.nav', { yPercent: -120 });

    // La entrada se arma pausada (estados iniciales ya puestos) y se reproduce cuando sale el loader
    const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    intro
      .to(heroWords, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out', stagger: .09, clearProps: 'filter' }, 0)
      .to('.pill', { opacity: 1, scale: 1, duration: 1, ease: 'power2.out', stagger: .12 }, '-=.9')
      .to('.hero .shape', { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.6)', stagger: .1 }, '<')
      .to('.hero-intro', { opacity: 1, y: 0, duration: .8 }, '-=.8')
      .to('.hero-socials a', { opacity: 1, y: 0, duration: .6, stagger: .06 }, '-=.5')
      .to('.scroll-arrow', { opacity: 1, y: 0, duration: .7 }, '-=.5')
      .to('.nav', { yPercent: 0, duration: .9, ease: 'expo.out' }, '-=1');
    root.classList.remove('hero-hold');
    loaderOut.then(() => intro.play());

    /* ---------- Títulos y párrafos: fade simple de todo el bloque (la letra nunca se corta) ---------- */
    $('.t-chars, .t-words').forEach(el => {
      const tl = gsap.timeline({ paused: true }).from(el, { opacity: 0, y: 24, duration: 1, ease: 'power2.out' });
      replay(el, tl);
    });
    ScrollTrigger.refresh();
  });


  /* ---------- Scroll: curva del hero, parallax y cortinas ---------- */
  const mm = gsap.matchMedia();
  mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, ctx => {
    const narrow = ctx.conditions.narrow;
    const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    // La sección clara "sube" con el borde curvo
    gsap.fromTo('.curve', { scaleY: .5 }, { scaleY: 1.8, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero-title', { yPercent: narrow ? -6 : -14, ease: 'none', scrollTrigger: heroST });
    // Filas del titular: la 1 va a la izquierda, la 2 a la derecha y la 3 a la izquierda
    [-1, 1, -1].forEach((dir, i) => gsap.to(`.hero-title .l${i + 1}`, { xPercent: dir * (narrow ? 8 : 10), ease: 'none', scrollTrigger: heroST }));

    // El bloque oscuro de "Mi trabajo" se abre al llegar
    gsap.fromTo('.work', { clipPath: narrow ? 'inset(0% 3% 0% 3% round 28px 28px 0 0)' : 'inset(0% 6% 0% 6% round 28px 28px 0 0)' },
      { clipPath: 'inset(0% 0% 0% 0% round 28px 28px 0 0)', ease: 'none', scrollTrigger: { trigger: '.work', start: 'top bottom', end: 'top 30%', scrub: true } });

    // El CTA rosa arranca al 50% del ancho y crece al completo
    gsap.fromTo('.cta', { clipPath: narrow ? 'inset(0% 12% 0% 12% round 22px)' : 'inset(0% 25% 0% 25% round 22px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 22px)', ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top 95%', end: 'top 35%', scrub: true } });

    // Foto de "Sobre mí": cortina + zoom-out + parallax
    gsap.fromTo('.about-img', { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: '.about-img', start: 'top 85%', once: true } });
    gsap.fromTo('.about-img img', { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: '.about-img', start: 'top 85%', once: true } });
    gsap.fromTo('.about-img img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });

    // Vista previa de formatos y avatar
    gsap.from('.preview', { scale: .85, rotate: -3, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.preview', start: 'top 85%', once: true } });
    gsap.from('.avatar', { scale: 0, rotate: -20, duration: 1, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.avatar', start: 'top 88%', once: true } });
  });

  /* ---------- Entradas en lote: fade + leve subida ---------- */
  const batch = sel => {
    gsap.set(sel, { opacity: 0, y: 40 });
    ScrollTrigger.batch(sel, { start: 'top 90%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .07, clearProps: 'transform' }) });
  };
  ['.logos li', '.reel-arrows', '.reel-item', '.card', '.plist li', '.socials li', '.final-actions .btn', '.slider-nav', '.f-links a', '.f-btns a'].forEach(batch);
  gsap.from('.reach', { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.reach', start: 'top 95%', once: true } });

  /* ---------- Cinta inclinada: avanza sola y acelera con el scroll ---------- */
  const tracks = $('.track').map(t => gsap.to(t, { xPercent: -50, ease: 'none', duration: 26, repeat: -1 }));
  let boost = 0, sdir = 1, last = scrollY;
  gsap.ticker.add(() => {
    const v = lenis ? lenis.velocity : scrollY - last; last = scrollY;
    if (Math.abs(v) > .1) sdir = v > 0 ? 1 : -1;
    boost += (Math.min(Math.abs(v), 40) * .25 - boost) * .08;
    tracks.forEach(t => t.timeScale(sdir * (1 + boost)));
  });

  /* ---------- Botones magnéticos ---------- */
  if (fine) $('.btn, .btn-outline, .round').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: 'power3' });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1, .45)' }));
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
