// Efecto de puntos (inspirado en area17-award-winning-rebuild): dos capas a pantalla completa
// y una cuadrícula de círculos que crecen y se encogen en ola revelando la capa de enfrente.
// Optimizado: capas pre-renderizadas, DPR máx. 2, solo anima mientras la sección se ve,
// y los círculos crecen un poco más cerca del cursor.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BLUE = '#2f5bff';
  const INK = '#000000';
  const WHITE = '#ffffff';
  const FONT = '"Cabinet Grotesk", "Helvetica Neue", Arial, sans-serif';

  function init(section) {
    const canvas = section.querySelector('.dots__canvas');
    const ctx = canvas.getContext('2d');
    const kind = section.dataset.dots; // "stats" | "cta"
    const stats = kind === 'stats' ? JSON.parse(section.dataset.stats) : null;
    let w = 0, h = 0, dpr = 1, back, front, circles = [], tween, visible = false;
    const count = { p: reduce ? 1 : 0 };
    const pointer = { x: -9999, y: -9999 };

    const layer = () => { const c = document.createElement('canvas'); c.width = w * dpr; c.height = h * dpr; const x = c.getContext('2d'); x.scale(dpr, dpr); return x; };

    const fit = (c, text, weight, maxW, maxSize) => {
      c.font = `${weight} 100px ${FONT}`;
      return Math.min(maxSize, 100 * maxW / c.measureText(text).width);
    };

    // Número con su progreso de conteo: "+12K" → "+7K" a mitad
    const partial = (value, p) => value.replace(/\d+(\.\d+)?/, n => {
      const v = parseFloat(n) * p;
      return n.includes('.') ? v.toFixed(1) : String(Math.round(v));
    });

    // Estadísticas de dos en dos: se muestran grandes y cambian a las siguientes dos
    const PER = 2;
    let page = 0;
    const pages = () => Math.ceil(stats.length / PER);
    function paintStats(c, bg, fg, sub) {
      c.fillStyle = bg; c.fillRect(0, 0, w, h);
      const items = stats.slice(page * PER, page * PER + PER);
      const all = stats.map(st => st.value);
      const narrow = w < 768;
      c.textBaseline = 'alphabetic';
      c.textAlign = narrow ? 'left' : 'center';
      if (narrow) {
        // Celular: los dos datos uno arriba del otro, ocupando casi todo el ancho
        const size = Math.min(...all.map(v => fit(c, v, 500, w * 0.86, h * 0.26)));
        const lab = Math.max(16, size * 0.17);
        items.forEach((st, i) => {
          const y = h * (i ? 0.78 : 0.42);
          c.font = `500 ${size}px ${FONT}`; c.fillStyle = fg;
          c.fillText(partial(st.value, count.p), w * 0.07, y);
          c.font = `400 ${lab}px ${FONT}`; c.fillStyle = sub;
          c.fillText(st.label, w * 0.07 + 4, y + lab * 1.5);
        });
      } else {
        // Desktop: dos columnas; el tamaño sale del dato más ancho para que nada se corte
        const size = Math.min(...all.map(v => fit(c, v, 500, w * 0.36, h * 0.42)));
        const lab = Math.max(18, size * 0.12);
        items.forEach((st, i) => {
          const cx = w * (i ? 0.73 : 0.27), y = h * 0.58;
          c.font = `500 ${size}px ${FONT}`; c.fillStyle = fg;
          c.fillText(partial(st.value, count.p), cx, y);
          c.font = `400 ${lab}px ${FONT}`; c.fillStyle = sub;
          c.fillText(st.label, cx, y + lab * 2.2);
        });
      }
    }

    function paintCta(c, bg, fg) {
      c.fillStyle = bg; c.fillRect(0, 0, w, h);
      const lines = section.dataset.text.split('|');
      const size = Math.min(...lines.map(l => fit(c, l, 500, w * 0.86, h * 0.2)));
      c.font = `500 ${size}px ${FONT}`; c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle';
      const lh = size * 1.02, top = h * 0.44 - (lh * (lines.length - 1)) / 2;
      lines.forEach((l, i) => c.fillText(l, w / 2, top + i * lh));
    }

    function paintLayers() {
      back = layer(); front = layer();
      if (stats) {
        paintStats(back, INK, WHITE, 'rgba(255,255,255,.6)');
        paintStats(front, BLUE, INK, 'rgba(0,0,0,.7)');
      } else if (kind === 'plain') {
        // Fondo de sección (footer): solo los dos colores; el contenido HTML va encima
        back.fillStyle = INK; back.fillRect(0, 0, w, h);
        front.fillStyle = BLUE; front.fillRect(0, 0, w, h);
      } else {
        paintCta(back, INK, WHITE);
        paintCta(front, BLUE, INK);
      }
    }

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = section.clientWidth; h = section.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      paintLayers();
      const cols = w < 768 ? 7 : 14;
      const space = w / cols;
      circles = [];
      for (let x = 0; x < w; x += space)
        for (let y = 0; y < h; y += space)
          circles.push({ x: x + space / 2, y: y + space / 2, r: space / 2, s: reduce ? 1.1 : 0.001 });
      tween && tween.kill();
      if (!reduce) {
        tween = gsap.fromTo(circles, { s: 0.001 }, { s: 2, duration: 2, repeat: -1, yoyo: true, stagger: { each: 0.01, from: 'start' }, ease: 'sine.inOut', paused: !visible });
      }
      render();
    }

    function render() {
      if (!back) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(back.canvas, 0, 0);
      ctx.save();
      ctx.beginPath();
      const reach = Math.max(w, h) * 0.18;
      for (const c of circles) {
        const d = Math.hypot(c.x - pointer.x, c.y - pointer.y);
        const boost = d < reach ? 1 + (1 - d / reach) * 0.8 : 1;
        const r = Math.min(c.r * c.s * boost, c.r * 2.2) * dpr;
        if (r > 0.3) { ctx.moveTo(c.x * dpr + r, c.y * dpr); ctx.arc(c.x * dpr, c.y * dpr, r, 0, Math.PI * 2); }
      }
      ctx.clip();
      ctx.drawImage(front.canvas, 0, 0);
      ctx.restore();
    }

    // Solo dibuja mientras la sección está en pantalla; el menú fijo deja el modo "difference"
    // encima del azul para que su texto siga siendo blanco
    const nav = document.querySelector('.nav');
    new IntersectionObserver(([en]) => {
      section.classList.toggle('is-under-nav', en.isIntersecting);
      nav && nav.classList.toggle('nav--plain', en.isIntersecting);
    }, { rootMargin: '0px 0px -92% 0px' }).observe(section);
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (!tween) return;
      visible ? tween.play() : tween.pause();
    }, { rootMargin: '100px 0px' }).observe(section);
    gsap.ticker.add(() => { if (visible) render(); });

    // Conteo de los números al entrar (solo estadísticas)
    if (stats && !reduce) {
      const pager = section.querySelector('.dots__page');
      const show = () => {
        if (pager) pager.textContent = `${page + 1} / ${pages()}`;
        count.p = 0; paintLayers();
        gsap.to(count, { p: 1, duration: 1.6, ease: 'power3.out', onUpdate: paintLayers });
      };
      let timer = null;
      ScrollTrigger.create({
        trigger: section, start: 'top 65%', end: 'bottom 35%',
        onEnter: () => { show(); timer = timer || setInterval(() => { if (visible) { page = (page + 1) % pages(); show(); } }, 4200); },
        onEnterBack: () => { timer = timer || setInterval(() => { if (visible) { page = (page + 1) % pages(); show(); } }, 4200); },
        onLeave: () => { clearInterval(timer); timer = null; },
        onLeaveBack: () => { clearInterval(timer); timer = null; }
      });
    }

    section.addEventListener('pointermove', e => {
      const r = section.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    });
    section.addEventListener('pointerleave', () => { pointer.x = pointer.y = -9999; });

    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 150); });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);
    build();
  }

  document.querySelectorAll('[data-dots]').forEach(init);
})();
