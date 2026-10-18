(() => {
  const d = document, root = d.documentElement;
  const $ = (s, c = d) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Cosas que no dependen de GSAP ---------- */

  // Imágenes: <div data-img="x" data-src="img/foto.webp">. Se pinta como fondo del mismo .media-fill,
  // así las animaciones de GSAP siguen apuntando al mismo nodo. Si no carga, queda el color sólido.
  const paint = (box, done) => {
    const src = box.dataset.src, img = new Image();
    img.onload = () => {
      const fill = box.querySelector(':scope > .media-fill');
      fill.style.backgroundImage = `url("${src}")`;
      fill.style.backgroundSize = 'cover';
      fill.style.backgroundPosition = 'center';
      fill.classList.add('has-img');
      (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(done);
    };
    img.onerror = done;
    img.src = src;
  };

  // La portada espera a su foto (o 2.5 s como máximo) y entra completa con un fade;
  // el resto de las fotos se pide después para no competir con ella.
  const heroBox = d.querySelector('.hero [data-src]');
  const heroReady = new Promise(res => { heroBox ? paint(heroBox, res) : res(); setTimeout(res, 2500); });
  heroReady.then(() => {
    root.classList.remove('hero-wait');
    $('[data-img][data-src]').filter(b => b !== heroBox).forEach(b => paint(b, () => {}));
  });

  // Hoja del menú móvil
  const sheet = d.getElementById('sheet'), burger = d.querySelector('.burger');
  let lenis = null;
  const setSheet = open => {
    sheet.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', !open);
    burger.classList.toggle('on', open);
    burger.setAttribute('aria-expanded', open);
    burger.querySelector('.burger-label').textContent = open ? 'Cerrar' : 'Menú';
    root.classList.toggle('lock', open);
    paintBar();
    lenis && (open ? lenis.stop() : lenis.start());
  };
  burger.addEventListener('click', () => setSheet(!sheet.classList.contains('open')));
  matchMedia('(min-width: 1181px)').addEventListener('change', e => e.matches && setSheet(false));

  // Barra: siempre flotante (logo, menú en cápsula y contáctame), sin fondo sólido al bajar
  const bar = d.querySelector('.bar'), hero = d.querySelector('.hero');
  const links = $('.nav a');
  const watched = links.map(a => d.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    watched.forEach(el => io.observe(el));
  }

  /* ---------- Carrusel de reels: flechas, arrastre con mouse, swipe nativo y barra de progreso ---------- */
  const piezas = (window.UGC && UGC.contenido.piezas) || [];
  const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);
  $('[data-reel]').forEach(reel => {
    const track = reel.querySelector('.reel-track'), fillBar = reel.querySelector('.reel-bar span');
    const [prev, next] = $('.reel-arrow', reel);
    const step = () => {
      const item = track.querySelector('.reel-item');
      return item ? item.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth * .8;
    };
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

    // Arrastre con el mouse (en touch se usa el swipe nativo)
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
        // Al soltar, se acomoda en la tarjeta más cercana
        const s = step(), target = Math.round(track.scrollLeft / s) * s;
        track.scrollTo({ left: target, behavior: 'smooth' });
        setTimeout(() => { moved = false; }, 0);
      }
    });
    track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

    // Videos: en silencio y solo mientras están en pantalla
    const vids = $('video[data-src]', track);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; v.preload = 'auto'; }
          if (!reduce && !root.classList.contains('viewing')) v.play().catch(() => {});
        } else v.pause();
      }), { threshold: .55 });
      vids.forEach(v => io.observe(v));
    } else vids.forEach(v => { v.src = v.dataset.src; v.preload = 'metadata'; });

    track.addEventListener('click', e => {
      const card = e.target.closest('.reel-card');
      if (card) openViewer(Number(card.dataset.i), card);
    });
  });

  /* ---------- Visor grande: video con sonido y controles; Esc o clic afuera lo cierran ---------- */
  const viewer = d.getElementById('viewer');
  const stage = viewer.querySelector('.viewer-stage'), cap = viewer.querySelector('.viewer-cap');
  let lastFocus = null;
  function openViewer(i, from) {
    const p = piezas[i];
    if (!p) return;
    lastFocus = from || d.activeElement;
    $('.reel-track video').forEach(v => v.pause());
    stage.innerHTML = isVideo(p.src)
      ? `<video src="${p.src}" controls autoplay playsinline></video>`
      : `<img src="${p.src}" alt="${p.titulo}">`;
    cap.textContent = `${p.titulo} · ${p.tipo} · ${p.nicho}`;
    viewer.hidden = false;
    requestAnimationFrame(() => viewer.classList.add('open'));
    root.classList.add('viewing');
    lenis && lenis.stop();
    viewer.querySelector('.viewer-close').focus();
  }
  function closeViewer() {
    if (viewer.hidden) return;
    viewer.classList.remove('open');
    root.classList.remove('viewing');
    lenis && lenis.start();
    const v = stage.querySelector('video'); v && v.pause();
    setTimeout(() => { viewer.hidden = true; stage.innerHTML = ''; }, 350);
    lastFocus && lastFocus.focus({ preventScroll: true });
    $('.reel-track video[src]').forEach(v => { const r = v.getBoundingClientRect(); if (!reduce && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight) v.play().catch(() => {}); });
  }
  viewer.addEventListener('click', e => { if (e.target === viewer || e.target === stage || e.target.closest('.viewer-close')) closeViewer(); });
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!viewer.hidden) closeViewer(); else setSheet(false);
  });

  /* ---------- Sin GSAP o con movimiento reducido: página estática funcional ---------- */
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    d.querySelector('.star-intro')?.classList.add('is-done');
    $('a[href^="#"]').forEach(a => a.addEventListener('click', () => setSheet(false)));
    return;
  }

  root.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- Smooth scroll (Lenis) enlazado a ScrollTrigger ---------- */
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id.length > 1 ? d.querySelector(id) : d.body;
    if (!target) return;
    e.preventDefault();
    const wasOpen = sheet.classList.contains('open');
    setSheet(false);
    const go = () => lenis ? lenis.scrollTo(target, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) })
                           : target.scrollIntoView({ behavior: 'smooth' });
    wasOpen ? setTimeout(go, 350) : go();
  }));

  /* ---------- Utilidad: partir texto en palabras con máscara ---------- */
  const done = new WeakSet();
  const split = el => {
    if (done.has(el)) return [];
    done.add(el);
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const words = [];
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = d.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) return frag.append(' ');
          const w = d.createElement('span'), i = d.createElement('span');
          w.className = 'w'; i.className = 'wi'; i.textContent = t;
          w.setAttribute('aria-hidden', 'true'); w.append(i); frag.append(w); words.push(i);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(el);
    return words;
  };

  const heroWords = split(d.querySelector('.hero .lines'));
  const headings = $('.display-l, .h-md, .h-sm').map(el => ({ el, words: split(el) }));
  const scrubs = $('.display, .display-s').map(el => ({ el, words: split(el) }));

  /* ---------- Estados iniciales (todo oculto tras el preloader) ---------- */
  gsap.set(heroWords, { yPercent: 115 });
  gsap.set('.bar', { yPercent: -120 });
  gsap.set(['.hero .label', '.hero-intro', '.hero .btn', '.hero-social'], { opacity: 0, y: 24 });
  gsap.set('.wa-float', { scale: 0 });
  gsap.set('.hero .marquee-track', { yPercent: 40, opacity: 0 });
  gsap.set('.hero .media-fill', { scale: 1.3 });

  /* ---------- Entrada del hero (sin preloader: arranca al cargar) ---------- */
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
    .to('.hero .media-fill', { scale: 1, duration: 2.2, ease: 'expo.out' }, 0)
    .to(heroWords, { yPercent: 0, duration: 1.3, stagger: .05 }, .15)
    .to('.hero .label', { opacity: .8, y: 0, duration: 1 }, .5)
    .to('.hero-intro', { opacity: 1, y: 0, duration: 1 }, .6)
    .to('.hero .btn', { opacity: 1, y: 0, duration: 1, stagger: .1 }, .75)
    .to('.hero-social', { opacity: 1, y: 0, duration: .8, stagger: .08 }, .9)
    .to('.wa-float', { scale: 1, duration: 1, ease: 'elastic.out(1, .5)' }, 1.4)
    .to('.hero .marquee-track', { yPercent: 0, opacity: 1, duration: 1.6, ease: 'expo.out' }, .3)
    .to('.bar', { yPercent: 0, duration: 1.1 }, .9);

  // Estrella: gira en cámara lenta mientras carga la portada; luego se encoge hasta desaparecer
  const starBox = d.querySelector('.star-intro'), star = starBox && starBox.querySelector('svg');
  if (star) {
    gsap.set(star, { scale: 4, rotation: 0, transformOrigin: '50% 50%' });
    const idle = gsap.to(star, { rotation: 360, duration: 40, ease: 'none', repeat: -1 });
    // "Portafolio" aparece (CSS), se lee un momento, se desvanece y la estrella se encoge en el centro
    const minShow = new Promise(res => setTimeout(res, Math.max(0, 1900 - performance.now())));
    Promise.all([heroReady, minShow]).then(() => {
      idle.kill();
      gsap.set('.star-word', { animation: 'none', opacity: 1, filter: 'blur(0px)' }); // suelta la animación CSS para poder desvanecerla
      gsap.timeline({ onComplete: () => starBox.classList.add('is-done') })
        .to('.star-word', { opacity: 0, filter: 'blur(8px)', duration: .7, ease: 'power2.in' }, 0)
        .to(star, { scale: 0, duration: 2.5, ease: 'power3.inOut' }, .4)
        .to(star, { rotation: '+=180', duration: 2.5, ease: 'sine.inOut' }, .4)
        .add(() => intro.play(), 1.6);
    });
  } else heroReady.then(() => intro.play());

  /* ---------- Barra: se oculta al bajar, vuelve al subir + progreso ---------- */
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: s => {
      if (sheet.classList.contains('open')) return;
      const hide = s.direction === 1 && s.scroll() > 240;
      bar.classList.toggle('is-hidden', hide);
    }
  });
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  /* ---------- Titulares: palabras suben desde una máscara ---------- */
  headings.forEach(({ el, words }) => {
    gsap.set(words, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: .045 })
    });
  });

  /* ---------- Párrafos grandes: cada palabra se enciende con el scroll ---------- */
  scrubs.forEach(({ el, words }) => {
    gsap.fromTo(words, { opacity: .14 }, {
      opacity: 1, ease: 'none', stagger: .12,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true }
    });
  });

  /* ---------- Entradas suaves: fade + subida, en lotes ---------- */
  const fadeSel = '.logos li, .reel-arrows, .reel-item, .reel-bar, .type-item, .split-text .btn, .quote-card, .contact-actions, .social-grid li';
  gsap.set(fadeSel, { opacity: 0, y: 36 });
  ScrollTrigger.batch(fadeSel, {
    start: 'top 92%', once: true,
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .08, clearProps: 'transform' })
  });

  /* ---------- Títulos chicos (.text): palabra por palabra con SplitText ---------- */
  if (window.SplitText) gsap.registerPlugin(SplitText);
  $('.text').forEach(el => {
    const words = window.SplitText ? SplitText.create(el, { type: 'words' }).words : [el];
    gsap.from(words, {
      opacity: 0, y: 15,
      stagger: 0.06, duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }
    });
  });

  /* ---------- Párrafos (.line): suben uno tras otro dentro de su bloque ---------- */
  gsap.set('.line', { y: 30, opacity: 0 });
  ScrollTrigger.batch('.line', {
    start: 'top 92%', once: true,
    onEnter: els => gsap.to(els, {
      y: 0, opacity: 1,
      stagger: 0.2, duration: 0.8,
      ease: 'power2.out', clearProps: 'transform'
    })
  });

  /* ---------- Título XL: máscara + deriva horizontal ---------- */
  $('.xl-title').forEach(t => {
    const lines = $('span', t);
    gsap.from(lines, {
      yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: .12,
      scrollTrigger: { trigger: t, start: 'top 85%', once: true }
    });
    lines.forEach((l, i) => gsap.fromTo(l, { x: i ? '3vw' : '-3vw' }, {
      x: i ? '-3vw' : '3vw', ease: 'none',
      scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true }
    }));
  });

  /* ---------- Todo lo que depende del tamaño de pantalla ---------- */
  const mm = gsap.matchMedia();
  mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, ctx => {
    const narrow = ctx.conditions.narrow;
    const par = narrow ? 0 : 5;   // % de parallax en imágenes (en móvil no: las fotos van a su tamaño natural)
    const lift = narrow ? 40 : 90; // px de deriva del contenido

    // Parallax interno de cada imagen
    if (par) $('.media, .bleed, .ratio-23').forEach(box => {
      const fill = box.querySelector('.media-fill');
      if (!fill || box.closest('.hero') && !box.classList.contains('media')) return;
      if (box.classList.contains('media')) return; // el hero se maneja abajo
      gsap.fromTo(fill, { yPercent: -par }, {
        yPercent: par, ease: 'none',
        scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Hero: la imagen se queda atrás, el contenido sube y se desvanece
    const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    if (!narrow) {
      gsap.to('.hero .media', { yPercent: 18, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero-mid', { y: -lift, opacity: 0, ease: 'none', scrollTrigger: { ...heroST, end: 'center top' } });
    }

    // Imágenes a todo el ancho: se abren desde un marco al entrar
    $('.bleed').forEach(b => {
      gsap.fromTo(b, { clipPath: narrow ? 'inset(4% 6% 4% 6%)' : 'inset(10% 25% 10% 25%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: b, start: 'top 95%', end: 'top 15%', scrub: true }
      });
    });
    // Imágenes 2:3: cortina que se abre + zoom que se asienta
    $('.ratio-23').forEach(box => {
      gsap.fromTo(box, { clipPath: 'inset(0% 0% 100% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut',
        scrollTrigger: { trigger: box, start: 'top 88%', once: true }
      });
      gsap.from(box.querySelector('.media-fill'), {
        scale: box.classList.contains('about-photo') ? 1.08 : 1.35, duration: 2, ease: 'expo.out',
        scrollTrigger: { trigger: box, start: 'top 88%', once: true }
      });
    });

    // Bloque de texto del split flota a distinta velocidad que su imagen
    if (!narrow) $('.split-text').forEach(t => gsap.fromTo(t, { y: 60 }, {
      y: -60, ease: 'none',
      scrollTrigger: { trigger: t.closest('.split'), start: 'top bottom', end: 'bottom top', scrub: true }
    }));

    // Footer: el contenido emerge desde abajo
    gsap.fromTo('.footer-cta', { y: narrow ? -30 : -80 }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top 20%', scrub: true }
    });
  });

  /* ---------- Marquee: velocidad ligada al scroll ---------- */
  const tweens = $('.marquee-track').map(t => gsap.to(t, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 }));
  let boost = 0, dir = 1, last = scrollY;
  gsap.ticker.add(() => {
    const v = lenis ? lenis.velocity : scrollY - last; last = scrollY;
    if (Math.abs(v) > .1) dir = v > 0 ? 1 : -1;
    boost += (Math.min(Math.abs(v), 40) * .3 - boost) * .08;
    tweens.forEach(t => t.timeScale(dir * (1 + boost)));
  });

  /* ---------- Solo puntero fino: cursor, botones magnéticos ---------- */
  if (fine) {
    const c = d.querySelector('.cursor');
    gsap.set(c, { xPercent: -50, yPercent: -50, opacity: 0 });
    const qx = gsap.quickTo(c, 'x', { duration: .45, ease: 'power3' });
    const qy = gsap.quickTo(c, 'y', { duration: .45, ease: 'power3' });
    addEventListener('pointermove', e => { qx(e.clientX); qy(e.clientY); gsap.to(c, { opacity: 1, duration: .3, overwrite: 'auto' }); });
    $('a, button').forEach(el => {
      el.addEventListener('pointerenter', () => gsap.to(c, { scale: 3, duration: .4, ease: 'power3' }));
      el.addEventListener('pointerleave', () => gsap.to(c, { scale: 1, duration: .4, ease: 'power3' }));
    });
    $('.btn, .bar-cta').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5, ease: 'power3' });
      });
      b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .4)' }));
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
