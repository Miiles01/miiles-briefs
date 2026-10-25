// Efecto de puntos (inspirado en area17-award-winning-rebuild): dos capas a pantalla completa
// y una cuadrícula de círculos que crecen y se encogen en ola revelando la capa de enfrente.
// Optimizado: capas pre-renderizadas, DPR máx. 2, solo anima mientras la sección se ve,
// y los círculos crecen un poco más cerca del cursor.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BLUE = '#2f5bff';
  const INK = '#0a0a0a';
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

    function paintStats(c, bg, fg, sub) {
      c.fillStyle = bg; c.fillRect(0, 0, w, h);
      const narrow = w < 768;
      const n = stats.length;
      c.textBaseline = 'alphabetic';
      if (narrow) {
        // Celular: número grande y su etiqueta debajo, una fila por dato
        const rowH = (h - 120) / n;
        const size = Math.min(...stats.map(st => fit(c, st.value, 500, w * 0.86, rowH * 0.62)));
        const lab = Math.max(15, size * 0.2);
        stats.forEach((st, i) => {
          const y = 96 + rowH * i + size * 0.86;
          c.textAlign = 'left';
          c.font = `500 ${size}px ${FONT}`; c.fillStyle = fg;
          c.fillText(partial(st.value, count.p), w * 0.06, y);
          c.font = `400 ${lab}px ${FONT}`; c.fillStyle = sub;
          c.fillText(st.label, w * 0.06 + 4, y + lab * 1.4);
        });
      } else {
        const colW = w / n;
        const size = Math.min(...stats.map(s => fit(c, s.value, 500, colW * 0.8, h * 0.3)));
        stats.forEach((s, i) => {
          const cx = colW * (i + 0.5), y = h * 0.56;
          c.textAlign = 'center';
          c.font = `500 ${size}px ${FONT}`; c.fillStyle = fg;
          c.fillText(partial(s.value, count.p), cx, y);
          c.font = `400 ${Math.max(16, size * 0.14)}px ${FONT}`; c.fillStyle = sub;
          c.fillText(s.label, cx, y + Math.max(30, size * 0.3));
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
        paintStats(front, BLUE, INK, 'rgba(10,10,10,.7)');
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
      ScrollTrigger.create({
        trigger: section, start: 'top 65%', once: true,
        onEnter: () => gsap.to(count, { p: 1, duration: 1.8, ease: 'power3.out', onUpdate: paintLayers })
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
