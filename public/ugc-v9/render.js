/* Arma toda la página a partir de window.UGC (data.js) con la estructura de la plantilla Persuasion / Mann */
(() => {
  const D = window.UGC;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ext = 'target="_blank" rel="noopener"';
  const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);
  const roll = t => `<span class="roll"><span>${esc(t)}</span><span aria-hidden="true">${esc(t)}</span></span>`;
  const lm = t => `<span class="line-mask"><span>${t}</span></span>`;
  // Garabatos naranjas de la plantilla (se dibujan al entrar)
  const oMark = ch => `<span class="o-mark">${ch}<svg class="draw" viewBox="0 0 60 100" fill="none" stroke="var(--orange)" stroke-width="4" stroke-linecap="round" aria-hidden="true"><ellipse cx="30" cy="62" rx="16" ry="30" transform="rotate(8 30 62)"/><line x1="30" y1="2" x2="30" y2="20"/><line x1="8" y1="12" x2="16" y2="24"/><line x1="52" y1="12" x2="44" y2="24"/></svg></span>`;
  const swirl = '<svg class="draw" viewBox="0 0 160 140" fill="none" stroke="var(--orange)" stroke-width="4" stroke-linecap="round" aria-hidden="true"><path d="M4 30C40-10 110 6 90 50C78 76 52 62 66 40C80 18 128 30 130 80C131 100 124 116 112 128M112 128L94 120M112 128L136 110"/></svg>';
  const arrowLong = '<svg class="arrow" viewBox="0 0 116 56" aria-hidden="true"><path d="M0 28H114M86 0C88 16 98 26 114 28C98 30 88 40 86 56"/></svg>';
  const arrow = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const pillIcon = '<svg viewBox="0 0 26 36" aria-hidden="true"><path d="M4 2C6 14 14 18 22 18C14 18 6 22 4 34"/></svg>';
  const icons = {
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.9A3.1 3.1 0 1 1 15.1 12 3.1 3.1 0 0 1 12 15.1zM17 5.9a1.1 1.1 0 1 0 1.1 1.1A1.1 1.1 0 0 0 17 5.9zM12 3.6c2.7 0 3 0 4.1.1a5.6 5.6 0 0 1 1.9.4 3.3 3.3 0 0 1 1.9 1.9 5.6 5.6 0 0 1 .4 1.9c.1 1.1.1 1.4.1 4.1s0 3-.1 4.1a5.6 5.6 0 0 1-.4 1.9 3.3 3.3 0 0 1-1.9 1.9 5.6 5.6 0 0 1-1.9.4c-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1a5.6 5.6 0 0 1-1.9-.4 3.3 3.3 0 0 1-1.9-1.9 5.6 5.6 0 0 1-.4-1.9C3.6 15 3.6 14.7 3.6 12s0-3 .1-4.1a5.6 5.6 0 0 1 .4-1.9A3.3 3.3 0 0 1 6 4.1a5.6 5.6 0 0 1 1.9-.4C9 3.6 9.3 3.6 12 3.6M12 2C9.3 2 8.9 2 7.8 2.1a7.3 7.3 0 0 0-2.4.4 5 5 0 0 0-2.9 2.9 7.3 7.3 0 0 0-.4 2.4C2 8.9 2 9.3 2 12s0 3.1.1 4.2a7.3 7.3 0 0 0 .4 2.4 5 5 0 0 0 2.9 2.9 7.3 7.3 0 0 0 2.4.4c1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1a7.3 7.3 0 0 0 2.4-.4 5 5 0 0 0 2.9-2.9 7.3 7.3 0 0 0 .4-2.4c.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2a7.3 7.3 0 0 0-.4-2.4 5 5 0 0 0-2.9-2.9 7.3 7.3 0 0 0-2.4-.4C15.1 2 14.7 2 12 2z"/></svg>',
    TikTok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6 2.7 2.7 0 0 1 .8.1V9.7a5.8 5.8 0 0 0-.8-.1 5.8 5.8 0 1 0 5.8 5.8V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z"/></svg>',
    YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>'
  };

  const nav = [['#marcas', 'Marcas'], ['#trabajo', 'Mi trabajo'], ['#nichos', 'Nichos'], ['#sobre-mi', 'Sobre mí'], ['#testimonios', 'Testimonios'], ['#contacto', 'Contacto']];
  const piezas = D.contenido.piezas;
  const tipos = D.tiposContenido.items;
  const [rolA, rolB] = [D.rol.split(' para ')[0], 'para ' + D.rol.split(' para ')[1]];   // "Creadora de contenido UGC" | "para marcas de…"

  const reel = (p, i) => `
    <li class="reel-item">
      <button class="card" type="button" data-i="${i}" aria-label="Ver ${esc(p.titulo)} (${esc(p.tipo)})">
        <span class="card-media"><span class="card-inner">${isVideo(p.src)
          ? `<video src="${esc(p.src)}#t=0.1" muted loop playsinline preload="metadata" aria-hidden="true"></video><span class="card-tag">Reel</span>`
          : `<img src="${esc(p.src)}" alt="${esc(p.titulo)}" loading="lazy" decoding="async" draggable="false"><span class="card-tag">Foto</span>`}</span></span>
        <span class="card-row"><span class="card-title">${esc(p.titulo)}</span><span class="card-type">${esc(p.tipo)} · ${esc(p.nicho)}</span>${arrowLong}</span>
      </button>
    </li>`;

  const band = (words, cls, speed) => `<div class="band ${cls}"><div class="band-track" data-speed="${speed}">${Array.from({ length: 4 }, () => words.map(w => `<span>${esc(w)}</span><span class="badge">UGC</span>`).join('')).join('')}</div></div>`;

  document.getElementById('app').innerHTML = `
  <a href="#top" class="logo" aria-label="${esc(D.nombre)}, inicio">${esc(D.nombre)}<br>UGC<br>Co.</a>
  <header class="header">
    <nav class="nav-links" aria-label="Principal">${nav.map(([h, t]) => `<a href="${h}">${roll(t)}</a>`).join('')}</nav>
    <div class="header-actions">
      <button class="burger" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu"><span></span></button>
      <a href="#contacto" class="btn">${roll('Contáctame')}</a>
    </div>
  </header>

  <nav class="menu" id="menu" aria-label="Menú" aria-hidden="true">
    ${nav.map(([h, t], i) => `<a href="${h}" style="--i:${i}"><span>${esc(t)}</span></a>`).join('')}
    <p class="menu-foot">${D.redes.map(r => `<a href="${esc(r.url)}" ${ext}>${esc(r.nombre)}</a>`).join('')}</p>
  </nav>

  <main id="top">
    <!-- 01 · HERO -->
    <section class="hero" data-reveal>
      <h1>
        ${lm(`Creadora de`)}
        ${lm(`contenid${oMark('o')} UGC`)}
      </h1>
      <p class="label tag reveal">${esc(rolB.charAt(0).toUpperCase() + rolB.slice(1))}</p>
      <p class="hero-intro reveal">${esc(D.intro)}</p>
      <div class="hero-ctas reveal">
        <a href="#trabajo" class="btn">${roll('Ver mi trabajo')}</a>
        <a href="#contacto" class="btn dark">${roll('Contáctame')}</a>
      </div>
      <div class="hero-foot label">
        <span>${D.redes.map(r => `<a href="${esc(r.url)}" ${ext}>${roll(r.nombre)}</a>`).join(' · ')}</span>
        <span>Sigue bajando ↓</span>
      </div>
    </section>

    <!-- 02 · MARCAS -->
    <section class="clients" id="marcas">
      <h2 class="reveal">Marcas que confiar${oMark('o')}n en mí</h2>
      <p class="label reveal">${esc(D.nombre)} · Contenido UGC</p>
      <ul class="client-list reveal">${D.marcas.logos.map((l, i) => `<li><img src="${esc(l.src)}" alt="${esc(l.nombre)}" loading="lazy" decoding="async"></li>${i < D.marcas.logos.length - 1 ? '<li class="dot" aria-hidden="true">●</li>' : ''}`).join('')}</ul>
    </section>

    <!-- Domo que crece con el scroll y cambia de foto -->
    <section class="arch-wrap" aria-hidden="true">
      <div class="arch-sticky">
        <div class="arch-bg"></div>
        <div class="arch">
          ${D.medios.domo.map((src, i) => `<img class="arch-img" data-i="${i}" src="${esc(src)}" alt="" decoding="async" loading="${i ? 'lazy' : 'eager'}">`).join('')}
          <div class="arch-beam"></div>
        </div>
        <span class="label arch-side l">Sigue bajando</span>
        <span class="label arch-side r">${esc(D.contenido.titulo)} ↓</span>
      </div>
    </section>

    <!-- 03 · MI TRABAJO: reels verticales -->
    <section class="dark work" id="trabajo">
      <h2 class="reveal">${esc(D.contenido.titulo)}</h2>
      <p class="work-sub reveal">${esc(D.contenido.manifiesto)}</p>
      <div class="reel" data-reel>
        <ul class="reel-track" tabindex="0" aria-label="Carrusel de contenido">${piezas.map(reel).join('')}</ul>
        <div class="reel-ui">
          <div class="reel-bar" aria-hidden="true"><span></span></div>
          <div class="reel-arrows">
            <button class="round" type="button" data-dir="-1" aria-label="Anterior"><span class="flip-x">${arrow}</span></button>
            <button class="round" type="button" data-dir="1" aria-label="Siguiente">${arrow}</button>
          </div>
        </div>
      </div>
      <div class="see-more reveal">
        <div class="big">ver m${oMark('á')}s</div>
        <div class="links">${D.redes.slice(0, 2).map(r => `<a href="${esc(r.url)}" class="label" ${ext}>${roll('En ' + r.nombre)}</a>`).join('')}</div>
      </div>
    </section>

    <!-- Cintas -->
    <section class="bands" aria-hidden="true">
      ${band(D.cintas[0], 'b', -1)}
      ${band(D.cintas[1], 'a', 1)}
    </section>

    <!-- 04 · NICHOS Y CONTENIDO -->
    <section class="services" id="nichos">
      <blockquote class="quote reveal">“${esc(D.intro.replace(/^Soy [^.]+\.\s*/, ''))}”<span class="by">— ${esc(D.nombre)}</span></blockquote>
      <div>
        <p class="svc-intro reveal">${esc(D.nichos.titulo)}</p>
        <ul class="svc-list">${D.nichos.items.map(n => `
          <li class="svc reveal"><span class="pill">${pillIcon}</span><span class="svc-text"><span class="svc-name">${esc(n.titulo)}</span><span class="svc-desc">${esc(n.texto)}</span></span></li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="future">
      <h2 class="reveal">${esc(D.tiposContenido.titulo)}</h2>
      <p class="label reveal">Pasa el mouse o toca una columna</p>
      <div class="cols" role="tablist" aria-label="${esc(D.tiposContenido.titulo)}">${tipos.map((t, i) => `
        <button class="col ${i === 0 ? 'hot' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-i="${i}">
          <span class="col-head">0${i + 1}</span><span class="col-fill"></span>
          <span class="col-name">${esc(t.titulo)}</span>
        </button>`).join('')}
      </div>
      <p class="col-example" aria-live="polite"><span class="serif">Ej.</span> <span class="col-ex-text">${esc(tipos[0].ejemplo)}</span></p>
    </section>

    <!-- 05 · SOBRE MÍ -->
    <section class="dark statement" id="sobre-mi">
      <div class="note">${esc(D.sobreMi.titulo)}<br>de ${esc(D.nombre)}
        <svg class="draw" viewBox="0 0 100 140" fill="none" stroke="var(--orange)" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M2 8C40-6 80 10 78 46C76 70 46 70 50 50C54 30 92 40 90 80C88 110 70 124 48 126M48 126L62 112M48 126L66 134"/></svg>
      </div>
      <div class="st-lines" aria-label="Belleza, moda y bienestar">
        <div class="st-photo" aria-hidden="true"><img src="${esc(D.medios.sobreMi)}" alt="" loading="lazy" decoding="async"></div>
        <div class="st-row front" aria-hidden="true"><span class="l">Belleza,</span><span class="r"><i>moda</i></span></div>
        <div class="st-row front" aria-hidden="true"><span class="l">y</span><span class="r"><i>bienestar</i></span></div>
      </div>
    </section>

    <section class="manifesto">
      <div class="mf-label reveal"><span class="serif">${esc(D.sobreMi.titulo.toLowerCase())}*</span>${swirl}</div>
      <h2 class="mf-title" data-reveal>
        ${lm('Me encargo')}
        ${lm(`de <span class="circled">todo<svg class="draw" viewBox="0 0 400 120" preserveAspectRatio="none" fill="none" stroke="var(--orange)" stroke-width="3" aria-hidden="true"><ellipse cx="200" cy="62" rx="196" ry="54" transform="rotate(-2 200 62)"/></svg></span>.`)}
      </h2>
      <div class="mf-body reveal">
        <p>${esc(D.sobreMi.parrafos[0]).replace('listo para publicar', '<span class="underline">listo para publicar</span>')}</p>
        <p>${esc(D.sobreMi.parrafos[1])}</p>
      </div>
      <div class="mf-sign reveal">— ${esc(D.nombre)}
        <svg class="draw" viewBox="0 0 110 110" fill="none" stroke="var(--orange)" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M10 4C60-4 106 30 96 64C88 92 50 96 34 92M34 92L50 80M34 92L48 106"/></svg>
      </div>
    </section>

    <!-- 06 · TESTIMONIOS -->
    <section class="testi" id="testimonios">
      <h2 class="reveal">L${oMark('o')} que dicen de mí</h2>
      <ul class="t-grid">${D.testimonios.items.map(t => `
        <li class="t-card reveal">
          <blockquote>“${esc(t.texto)}”</blockquote>
          <div class="t-who"><img src="${esc(t.foto)}" alt="" loading="lazy" decoding="async"><span><strong>${esc(t.cargo)}</strong><span>${esc(t.empresa)}</span></span></div>
        </li>`).join('')}
      </ul>
    </section>
  </main>

  <!-- 07 · CONTACTO + MIS REDES -->
  <footer class="footer" id="contacto">
    <div class="f-top">
      <h2 class="reveal">${esc(D.contacto.titulo).replace(' juntas', '<br>juntas')}</h2>
      <div class="f-card reveal"><p>${esc(D.contacto.texto)}</p><a href="mailto:${esc(D.contacto.email)}" class="btn dark">${roll(D.contacto.email)}</a></div>
      <div class="f-card reveal"><p>${esc(D.contacto.whatsapp.texto)}</p><a href="${esc(D.contacto.whatsapp.url)}" class="btn dark" ${ext}>${roll('WhatsApp')}</a></div>
    </div>
    <div class="f-mid">
      <p class="label">Mis redes</p>
      <ul class="socials">${D.redes.map(r => `
        <li><a href="${esc(r.url)}" class="social" ${ext}><span class="social-icon">${icons[r.nombre] || ''}</span><span class="social-text"><strong>${esc(r.nombre)}</strong><span>${esc(r.usuario)}</span></span>${arrow}</a></li>`).join('')}
      </ul>
    </div>
    <div class="wordmark" aria-hidden="true">${[...D.nombre].map((ch, i) => `<span style="transition-delay:${i * .05}s">${esc(ch)}</span>`).join('')} <span style="transition-delay:${D.nombre.length * .05}s"><i>ugc</i></span></div>
    <div class="f-bottom label"><span>${esc(D.footer)}</span><a href="#top">${roll('Volver arriba ↑')}</a></div>
  </footer>

  <div class="viewer" id="viewer" role="dialog" aria-modal="true" aria-label="Contenido" hidden>
    <button class="viewer-close round" type="button" aria-label="Cerrar">✕</button>
    <div class="viewer-stage"></div>
    <p class="viewer-cap"></p>
  </div>`;
})();
