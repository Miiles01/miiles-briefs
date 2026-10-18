(() => {
  const d = document, root = d.documentElement, body = d.body;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const piezas = (window.UGC && UGC.contenido.piezas) || [];
  const tipos = (window.UGC && UGC.tiposContenido.items) || [];
  const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);
  let lenis = null;

  /* ---------- Smooth scroll ---------- */
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: .1, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const goTo = target => lenis ? lenis.scrollTo(target, { duration: 1.5, offset: 0 }) : (target === 0 ? scrollTo({ top: 0, behavior: 'smooth' }) : target.scrollIntoView({ behavior: 'smooth' }));

  /* ---------- Menú (círculo naranja) ---------- */
  const burger = $('.burger'), menu = $('#menu');
  const setMenu = open => {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.setAttribute('aria-hidden', !open);
    root.classList.toggle('lock', open);
    lenis && (open ? lenis.stop() : lenis.start());
  };
  burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  matchMedia('(min-width: 1241px)').addEventListener('change', e => e.matches && setMenu(false));
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'), target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    const wasOpen = body.classList.contains('menu-open');
    setMenu(false);
    wasOpen ? setTimeout(() => goTo(target), 450) : goTo(target);
  }));

  /* ---------- Garabatos: longitud real de cada trazo ---------- */
  $$('.draw').forEach(svg => $$('path,ellipse,line', svg).forEach(el => {
    try { el.style.setProperty('--len', Math.ceil(el.getTotalLength()) + 1); } catch (e) {}
  }));

  /* ---------- Reveal al entrar en pantalla (como la plantilla) ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .18, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal, [data-reveal], .draw, .card, .cols, .wordmark, .mf-body').forEach(el => io.observe(el));
  } else root.classList.add('no-io');
  $$('.svc').forEach((el, i) => { el.style.transitionDelay = i * .07 + 's'; });
  $$('.t-card').forEach((el, i) => { el.style.transitionDelay = (i % 3) * .08 + 's'; });

  // Hero al cargar
  const fontsReady = d.fonts ? Promise.race([d.fonts.ready, new Promise(r => setTimeout(r, 1200))]) : Promise.resolve();
  fontsReady.then(() => requestAnimationFrame(() => setTimeout(() => {
    $('.hero').classList.add('in');
    $$('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), 250 + i * 120));
    setTimeout(() => $$('.hero .draw').forEach(el => el.classList.add('in')), 800);
  }, 120)));

  /* ---------- Formatos: columnas que se llenan y muestran su ejemplo ---------- */
  const cols = $$('.col'), exText = $('.col-ex-text');
  const setCol = i => {
    cols.forEach((c, k) => { c.classList.toggle('hot', k === i); c.setAttribute('aria-selected', k === i); });
    exText.textContent = tipos[i] ? tipos[i].ejemplo : '';
  };
  cols.forEach((c, i) => {
    c.addEventListener('click', () => setCol(i));
    c.addEventListener('mouseenter', () => matchMedia('(hover: hover)').matches && setCol(i));
  });

  /* ---------- Carrusel de reels: flechas, arrastre, swipe y barra ---------- */
  const track = $('.reel-track'), fillBar = $('.reel-bar span');
  const [prev, next] = $$('.reel-arrows .round');
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
  track.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button === 0) { down = { x: e.clientX, left: track.scrollLeft }; moved = false; } });
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
  track.addEventListener('click', e => {
    if (moved) { e.preventDefault(); e.stopPropagation(); return; }
    const c = e.target.closest('.card'); if (c) openViewer(Number(c.dataset.i), c);
  }, true);
  // Videos en silencio, solo en pantalla
  const vids = $$('video', track);
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver(es => es.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) { v.preload = 'auto'; if (!reduce && !root.classList.contains('viewing')) v.play().catch(() => {}); }
      else v.pause();
    }), { threshold: .5 });
    vids.forEach(v => vio.observe(v));
  }

  /* ---------- Visor grande ---------- */
  const viewer = $('#viewer'), stage = $('.viewer-stage', viewer), cap = $('.viewer-cap', viewer);
  let lastFocus = null;
  function openViewer(i, from) {
    const p = piezas[i]; if (!p) return;
    lastFocus = from;
    vids.forEach(v => v.pause());
    stage.innerHTML = isVideo(p.src) ? `<video src="${p.src}" controls autoplay playsinline></video>` : `<img src="${p.src}" alt="${p.titulo}">`;
    cap.textContent = `${p.titulo} · ${p.tipo} · ${p.nicho}`;
    viewer.hidden = false;
    requestAnimationFrame(() => viewer.classList.add('open'));
    root.classList.add('viewing');
    lenis && lenis.stop();
    $('.viewer-close', viewer).focus();
  }
  function closeViewer() {
    if (viewer.hidden) return;
    viewer.classList.remove('open');
    root.classList.remove('viewing');
    lenis && lenis.start();
    const v = stage.querySelector('video'); v && v.pause();
    setTimeout(() => { viewer.hidden = true; stage.innerHTML = ''; }, 350);
    lastFocus && lastFocus.focus({ preventScroll: true });
    vids.forEach(v => { const r = v.getBoundingClientRect(); if (!reduce && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight) v.play().catch(() => {}); });
  }
  viewer.addEventListener('click', e => { if (e.target === viewer || e.target === stage || e.target.closest('.viewer-close')) closeViewer(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') viewer.hidden ? setMenu(false) : closeViewer(); });

  /* ---------- Header: se esconde al bajar ---------- */
  const header = $('.header');
  let lastY = scrollY;

  /* ---------- Animaciones ligadas al scroll (domo, cintas, palabras que se separan) ---------- */
  const arch = $('.arch-wrap'), archEl = $('.arch'), archImgs = $$('.arch-img'), archBg = $('.arch-bg'), beam = $('.arch-beam'), sides = $$('.arch-side');
  const tracks = $$('.band-track');
  const stRows = $$('.st-row'), photo = $('.st-photo'), statement = $('.statement');
  let marqueeX = 0, prevY = scrollY, vel = 0, shown = -1;
  const showImg = i => { if (i === shown) return; shown = i; archImgs.forEach((im, k) => im.classList.toggle('on', k === i)); };

  function onFrame() {
    const vh = innerHeight, vw = innerWidth, y = scrollY;

    if (!root.classList.contains('lock')) header.classList.toggle('is-hidden', y > lastY + 2 && y > 300);
    if (Math.abs(y - lastY) > 2) lastY = y;

    // 1) Domo: crece de un arco pequeño a pantalla completa, cambia de foto y se oscurece con un haz de luz
    const r = arch.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));
    const grow = clamp(p / .6);
    const e = 1 - Math.pow(1 - grow, 3);
    const startW = vw < 768 ? .7 * vw : .3 * vw;
    archEl.style.width = lerp(startW, vw * 1.02, e) + 'px';
    archEl.style.height = lerp(startW, vh * 1.05, e) + 'px';
    const rad = lerp(vw * .5, vw * .03, clamp((grow - .6) / .4));
    archEl.style.borderRadius = `${rad}px ${rad}px 0 0`;
    showImg(p < .14 ? 0 : p < .28 ? 1 : p < .42 ? 2 : 3);     // la horizontal entra cuando el domo ya es grande
    // La última foto se queda a pantalla completa (no se desvanece) y la siguiente sección sube encima
    const imgOpacity = clamp((p - .02) / .1);
    archImgs.forEach((im, k) => { im.style.transform = `scale(${lerp(1.25, 1, e)})`; im.style.opacity = k === shown ? imgOpacity : 0; });
    archBg.style.opacity = 0;

    // 2) Cintas: avance constante + empuje por velocidad de scroll
    vel = lerp(vel, y - prevY, .1); prevY = y;
    if (!reduce) marqueeX += .6 + Math.abs(vel) * .25;
    tracks.forEach(t => {
      const w = t.scrollWidth / 4;
      const x = (marqueeX % w) * +t.dataset.speed;
      t.style.transform = `translateX(${t.dataset.speed > 0 ? x - w : x}px)`;
    });

    // 3) Sobre mí: las palabras se separan y la foto escala
    const sr = statement.getBoundingClientRect();
    const sp = clamp(1 - (sr.top + sr.height * .35) / vh, 0, 1.4);
    const spread = vw < 768 ? .5 : 1;
    stRows.forEach((row, i) => {
      const dd = sp * (40 + i * 40) * spread;
      row.querySelector('.l').style.transform = `translateX(${-dd}px)`;
      row.querySelector('.r').style.transform = `translateX(${dd}px)`;
    });
    photo.style.transform = `translate(-50%,-50%) scale(${lerp(.7, 1.08, clamp(sp))}) rotate(${lerp(-6, 0, clamp(sp))}deg)`;

    requestAnimationFrame(onFrame);
  }
  requestAnimationFrame(onFrame);

  /* ---------- Color de los links del navbar según el fondo que tienen debajo ---------- */
  (() => {
    const links = document.querySelector('.nav-links');
    if (!links) return;
    const lum = c => { const m = c.match(/[\d.]+/g); if (!m || (m[3] !== undefined && +m[3] === 0)) return null; return (.2126 * m[0] + .7152 * m[1] + .0722 * m[2]) / 255; };
    const tone = () => {
      const r = links.getBoundingClientRect();
      let el = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2).find(e => !links.contains(e) && !e.closest('.nav, header, .logo')), l = null;
      // Las fotos de esta página son de estudio con fondo claro: encima de ellas el texto va oscuro
      if (el && el.tagName === 'IMG' && +getComputedStyle(el).opacity > .5) { links.classList.add('on-light'); return; }
      while (el && el.tagName === 'IMG') el = el.parentElement;
      while (el && l === null) { l = lum(getComputedStyle(el).backgroundColor); el = el.parentElement; }
      links.classList.toggle('on-light', l !== null && l > .6);
    };
    let raf = 0;
    const soon = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; tone(); }); };
    addEventListener('scroll', soon, { passive: true });
    addEventListener('resize', soon);
    addEventListener('load', soon);
    setInterval(soon, 600);
    soon();
  })();
})();
