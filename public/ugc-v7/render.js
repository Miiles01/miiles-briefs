/* Arma toda la página a partir de window.UGC (data.js) con la estructura de la plantilla 2212 */
(() => {
  const D = window.UGC;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ext = 'target="_blank" rel="noopener"';
  const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);

  // Figuras de la plantilla (flor, asterisco y estrella)
  const shape = {
    flower: (c = 'var(--hot)') => `<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="${c}" d="M50 0l8 20 18-12-2 22 22-2-12 18 20 8-20 8 12 18-22-2 2 22-18-12-8 20-8-20-18 12 2-22-22 2 12-18L0 50l20-8L8 24l22 2-2-22 18 12z"/></svg>`,
    ast: (c = 'var(--lime)') => `<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="${c}" stroke-width="16"><path d="M50 0v100M0 50h100M15 15l70 70M85 15L15 85"/></g></svg>`,
    star: (c = 'var(--orange)') => `<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="${c}" d="M50 0c4 30 16 42 50 50-34 8-46 20-50 50-4-30-16-42-50-50 34-8 46-20 50-50z"/></svg>`
  };
  const shapes = [shape.star, shape.ast, shape.flower];
  const arrow = '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const icons = {
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.9A3.1 3.1 0 1 1 15.1 12 3.1 3.1 0 0 1 12 15.1zM17 5.9a1.1 1.1 0 1 0 1.1 1.1A1.1 1.1 0 0 0 17 5.9zM12 3.6c2.7 0 3 0 4.1.1a5.6 5.6 0 0 1 1.9.4 3.3 3.3 0 0 1 1.9 1.9 5.6 5.6 0 0 1 .4 1.9c.1 1.1.1 1.4.1 4.1s0 3-.1 4.1a5.6 5.6 0 0 1-.4 1.9 3.3 3.3 0 0 1-1.9 1.9 5.6 5.6 0 0 1-1.9.4c-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1a5.6 5.6 0 0 1-1.9-.4 3.3 3.3 0 0 1-1.9-1.9 5.6 5.6 0 0 1-.4-1.9C3.6 15 3.6 14.7 3.6 12s0-3 .1-4.1a5.6 5.6 0 0 1 .4-1.9A3.3 3.3 0 0 1 6 4.1a5.6 5.6 0 0 1 1.9-.4C9 3.6 9.3 3.6 12 3.6M12 2C9.3 2 8.9 2 7.8 2.1a7.3 7.3 0 0 0-2.4.4 5 5 0 0 0-2.9 2.9 7.3 7.3 0 0 0-.4 2.4C2 8.9 2 9.3 2 12s0 3.1.1 4.2a7.3 7.3 0 0 0 .4 2.4 5 5 0 0 0 2.9 2.9 7.3 7.3 0 0 0 2.4.4c1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1a7.3 7.3 0 0 0 2.4-.4 5 5 0 0 0 2.9-2.9 7.3 7.3 0 0 0 .4-2.4c.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2a7.3 7.3 0 0 0-.4-2.4 5 5 0 0 0-2.9-2.9 7.3 7.3 0 0 0-2.4-.4C15.1 2 14.7 2 12 2z"/></svg>',
    TikTok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6 2.7 2.7 0 0 1 .8.1V9.7a5.8 5.8 0 0 0-.8-.1 5.8 5.8 0 1 0 5.8 5.8V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z"/></svg>',
    YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>'
  };
  const waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>';

  const nav = [
    ['#marcas', 'Marcas'], ['#trabajo', 'Mi trabajo'], ['#nichos', 'Nichos'],
    ['#sobre-mi', 'Sobre mí'], ['#testimonios', 'Testimonios'], ['#contacto', 'Contacto']
  ];
  const pills = D.medios.pastillas;
  const pill = (offset, cls) => `<span class="pill ${cls}" data-pill="${offset}" aria-hidden="true">${pills.map((src, i) => `<img src="${esc(src)}" alt="" class="${i === offset % pills.length ? 'on' : ''}" decoding="async">`).join('')}</span>`;
  const tipos = D.tiposContenido.items;
  const tipoColors = ['var(--hot)', 'var(--lime)', 'var(--orange)', 'var(--blue)', 'var(--paper-2)'];

  const pieza = (p, i) => `<li class="reel-item">
      <button class="reel-card" type="button" data-i="${i}" aria-label="Ver ${esc(p.titulo)} (${esc(p.tipo)})">
        <span class="reel-media">
          ${isVideo(p.src)
            ? `<video data-src="${esc(p.src)}" muted loop playsinline preload="none" aria-hidden="true"></video><span class="reel-chip">▶ Reel</span>`
            : `<img src="${esc(p.src)}" alt="${esc(p.titulo)}" loading="lazy" decoding="async" draggable="false"><span class="reel-chip">Foto</span>`}
        </span>
        <span class="reel-meta"><span class="reel-title">${esc(p.titulo)}</span><span class="reel-type">${esc(p.tipo)} · ${esc(p.nicho)}</span></span>
      </button>
    </li>`;

  document.getElementById('app').innerHTML = `
  <!-- Loader: cortina de color con el logo; sube con el borde curvo -->
  <div class="loader" aria-hidden="true">
    <div class="loader-mark">${shape.flower('var(--ink)')}</div>
    <div class="loader-name"><span>${esc(D.nombre)}</span></div>
  </div>

  <nav class="nav" aria-label="Principal">
    <a href="#top" class="logo">${esc(D.nombre)}<span>Creadora UGC</span></a>
    <div class="nav-right">
      ${nav.map(([h, t]) => `<a class="nav-link" href="${h}"><span>${esc(t)}</span><span aria-hidden="true">${esc(t)}</span></a>`).join('')}
      <a href="#contacto" class="btn-outline">Contáctame</a>
    </div>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-label">Menú</span></button>
  </nav>

  <div class="menu" id="menu" aria-hidden="true">
    <div class="menu-shapes" aria-hidden="true">${shape.flower('var(--ink)')}${shape.ast('var(--ink)')}</div>
    <nav class="menu-links" aria-label="Móvil">${nav.map(([h, t], i) => `<a href="${h}" style="--i:${i}"><span>${esc(t)}</span></a>`).join('')}</nav>
    <div class="menu-foot">${D.redes.map(r => `<a href="${esc(r.url)}" ${ext}>${esc(r.nombre)}</a>`).join('')}<a href="mailto:${esc(D.contacto.email)}">${esc(D.contacto.email)}</a></div>
  </div>

  <!-- 01 · HERO -->
  <header class="hero" id="top">
    <span class="shape s-flower">${shape.flower()}</span>
    <span class="shape s-ast">${shape.ast()}</span>
    <span class="shape s-star">${shape.star()}</span>

    <h1 class="hero-title" aria-label="${esc(D.nombre)}, ${esc(D.rol.charAt(0).toLowerCase() + D.rol.slice(1))}">
      <span class="l l1" aria-hidden="true"><span class="lw">${esc(D.nombre)}</span>${pill(0, 'pill-a')}</span>
      <span class="l l2" aria-hidden="true">${pill(2, 'pill-b')}<span class="lw">contenido UGC</span></span>
      <span class="l l3" aria-hidden="true"><span class="lw">para belleza, moda</span></span>
      <span class="l l4" aria-hidden="true"><span class="lw">y bienestar</span>${pill(4, 'pill-c')}</span>
    </h1>
    <div class="hero-foot">
      <p class="hero-intro">${esc(D.intro)}</p>
      <div class="hero-actions">
        <a href="#trabajo" class="btn btn-hot">Ver mi trabajo ${arrow}</a>
        <a href="#contacto" class="btn btn-line">Contáctame</a>
      </div>
      <div class="hero-socials">${D.redes.map(r => `<a href="${esc(r.url)}" ${ext} aria-label="${esc(r.nombre)}">${icons[r.nombre] || ''}</a>`).join('')}</div>
    </div>

    <span class="badge">Creadora de contenido UGC</span>
    <svg class="scroll-arrow" viewBox="0 0 40 60" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 0v58M2 38c10 0 18 8 18 20M38 38c-10 0-18 8-18 20"/></svg>
    <div class="curve" aria-hidden="true"></div>
  </header>

  <main>
    <!-- 02 · MARCAS -->
    <section class="brands" id="marcas">
      <p class="available"><span class="dot"></span><span class="t-words">${esc(D.marcas.titulo)}</span></p>
      <ul class="logos">${D.marcas.logos.map(l => `<li><img src="${esc(l.src)}" alt="${esc(l.nombre)}" loading="lazy" decoding="async"></li>`).join('')}</ul>
    </section>

    <!-- 03 · CONTENIDO: carrusel de reels sobre fondo oscuro -->
    <section class="work" id="trabajo">
      <div class="work-top">
        <div>
          <p class="eyebrow"><i></i>${esc(D.contenido.titulo)}</p>
          <h2 class="h2 t-chars">Reels y fotos</h2>
        </div>
        <div class="reel-arrows">
          <button class="round" type="button" data-dir="-1" aria-label="Anterior"><span class="flip">${arrow}</span></button>
          <button class="round" type="button" data-dir="1" aria-label="Siguiente">${arrow}</button>
        </div>
      </div>
      <div class="reel" data-reel>
        <ul class="reel-track" tabindex="0" aria-label="Carrusel de contenido">${D.contenido.piezas.map(pieza).join('')}</ul>
        <div class="reel-bar" aria-hidden="true"><span></span></div>
      </div>
      <div class="marquee" aria-hidden="true"><div class="track">${Array.from({ length: 4 }, () => D.cinta.map((w, i) => `<b>${esc(w)}</b>${shapes[i % 3]()}`).join('')).join('')}</div></div>
    </section>

    <!-- 04 · NICHOS Y CONTENIDO -->
    <section class="services" id="nichos">
      <img class="avatar" src="${esc(D.medios.hero)}" alt="" loading="lazy" decoding="async">
      <h2 class="h2 t-chars">${esc(D.nichos.titulo)}</h2>
      <div class="cards">${D.nichos.items.map((n, i) => `
        <article class="card">
          <div class="ic">${[shape.flower('var(--hot)'), shape.ast('var(--lime-ink)'), shape.star('var(--orange)'), shape.flower('var(--blue)')][i % 4]}</div>
          <h3>${esc(n.titulo)}</h3>
          <p>${esc(n.texto)}</p>
        </article>`).join('')}
      </div>

      <div class="types">
        <div class="types-head">
          <p class="eyebrow eyebrow--dark"><i></i>Formatos</p>
          <h2 class="h2 t-chars">${esc(D.tiposContenido.titulo)}</h2>
        </div>
        <div class="types-grid">
          <ul class="plist" role="tablist" aria-label="${esc(D.tiposContenido.titulo)}">${tipos.map((t, i) => `<li><button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}" class="${i === 0 ? 'on' : ''}">${esc(t.titulo)}</button></li>`).join('')}</ul>
          <div class="preview">${tipos.map((t, i) => `
            <div class="pv ${i === 0 ? 'on' : ''}" role="tabpanel" style="--c:${tipoColors[i % tipoColors.length]}">
              <span class="pv-n">${String(i + 1).padStart(2, '0')}</span>
              <span class="pv-shape">${shapes[i % 3]('currentColor')}</span>
              <p class="pv-ex"><em>Ej.:</em> ${esc(t.ejemplo)}</p>
              <p class="pv-title">${esc(t.titulo)}</p>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- 05 · SOBRE MÍ -->
    <section class="about" id="sobre-mi">
      <div class="about-media">
        <figure class="about-img"><img src="${esc(D.medios.sobreMi)}" alt="${esc(D.nombre)} con su celular" loading="lazy" decoding="async"></figure>
        <span class="about-sticker">${shape.star()}</span>
      </div>
      <div class="about-text">
        <p class="eyebrow eyebrow--dark"><i></i>${esc(D.nombre)}</p>
        <h2 class="h2 t-chars">${esc(D.sobreMi.titulo)}</h2>
        ${D.sobreMi.parrafos.map(p => `<p class="about-p t-words">${esc(p)}</p>`).join('')}
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <svg class="deco" viewBox="0 0 1000 340" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><ellipse cx="230" cy="-20" rx="300" ry="80"/><ellipse cx="770" cy="-20" rx="300" ry="80" stroke-dasharray="8 8"/><ellipse cx="230" cy="360" rx="300" ry="120" stroke-dasharray="8 8"/><ellipse cx="770" cy="360" rx="300" ry="120"/></svg>
      <p class="tag">${esc(D.nombre)} <i></i> ${esc(D.rol.split(' para ')[0])}</p>
      <h2 class="h2 t-chars">${esc(D.contacto.titulo)}</h2>
      <a href="#contacto" class="btn btn-ink">Contáctame ${arrow}</a>
    </section>

    <!-- 06 · TESTIMONIOS -->
    <section class="testi" id="testimonios">
      <p class="eyebrow eyebrow--dark eyebrow--center"><i></i>Testimonios</p>
      <h2 class="h2 t-chars">${esc(D.testimonios.titulo)}</h2>
      <div class="slider" aria-roledescription="carrusel" aria-live="polite">${D.testimonios.items.map((t, i) => `
        <figure class="slide ${i === 0 ? 'on' : ''}" aria-hidden="${i !== 0}">
          <img class="face" src="${esc(t.foto)}" alt="" loading="lazy" decoding="async">
          <figcaption><strong>${esc(t.cargo)}</strong><small>@${esc(t.empresa)}</small></figcaption>
          <blockquote>“${esc(t.texto)}”</blockquote>
        </figure>`).join('')}
      </div>
      <div class="slider-nav">
        <button class="round round--light" type="button" data-go="-1" aria-label="Testimonio anterior"><span class="flip">${arrow}</span></button>
        <div class="dots">${D.testimonios.items.map((_, i) => `<button type="button" aria-label="Testimonio ${i + 1}" class="${i === 0 ? 'on' : ''}"></button>`).join('')}</div>
        <button class="round round--light" type="button" data-go="1" aria-label="Testimonio siguiente">${arrow}</button>
      </div>
    </section>

    <!-- 07 · CONTACTO + MIS REDES -->
    <section class="final" id="contacto">
      <span class="shape f-flower">${shape.flower()}</span>
      <span class="shape f-star">${shape.star()}</span>
      <p class="tag tag--light">${esc(D.nombre)} <i></i> Contacto</p>
      <h2 class="h2 t-chars">${esc(D.contacto.titulo)}</h2>
      <p class="final-text t-words">${esc(D.contacto.texto)}</p>
      <div class="final-actions">
        <a href="mailto:${esc(D.contacto.email)}" class="btn btn-hot">${esc(D.contacto.email)} ${arrow}</a>
        <a href="${esc(D.contacto.whatsapp.url)}" class="btn btn-line" ${ext}>${waIcon}${esc(D.contacto.whatsapp.texto)}</a>
      </div>
      <p class="final-sub">Mis redes</p>
      <ul class="socials">${D.redes.map((r, i) => `
        <li><a class="social" href="${esc(r.url)}" ${ext} style="--c:${['var(--hot)', 'var(--lime)', 'var(--orange)'][i % 3]}">
          <span class="social-icon">${icons[r.nombre] || ''}</span>
          <span class="social-text"><strong>${esc(r.nombre)}</strong><span>${esc(r.usuario)}</span></span>
          <span class="social-go">${arrow}</span>
        </a></li>`).join('')}
      </ul>
    </section>
  </main>

  <footer class="foot">
    <div class="f-top">
      <div class="f-links">${nav.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join('')}</div>
      <div class="f-btns"><a href="#trabajo">Mi trabajo</a><a href="#contacto" class="fill">Contáctame</a></div>
    </div>
    <div class="f-bottom">
      <a href="mailto:${esc(D.contacto.email)}" class="reach">Escríbeme <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="5" aria-hidden="true"><path d="M4 76L72 8M30 8h42v42"/></svg></a>
      <small>${esc(D.footer)}</small>
    </div>
  </footer>

  <div class="viewer" id="viewer" role="dialog" aria-modal="true" aria-label="Contenido" hidden>
    <button class="viewer-close round" type="button" aria-label="Cerrar">✕</button>
    <div class="viewer-stage"></div>
    <p class="viewer-cap"></p>
  </div>`;
})();
