/* Arma toda la página a partir de window.UGC (data.js) con el lenguaje de la plantilla Solveig */
(() => {
  const D = window.UGC;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ext = 'target="_blank" rel="noopener"';
  const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);
  const star = (cls = 'star') => `<svg class="${cls}" aria-hidden="true"><use href="#star"/></svg>`;
  const arrow = '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const icons = {
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.9A3.1 3.1 0 1 1 15.1 12 3.1 3.1 0 0 1 12 15.1zM17 5.9a1.1 1.1 0 1 0 1.1 1.1A1.1 1.1 0 0 0 17 5.9zM12 3.6c2.7 0 3 0 4.1.1a5.6 5.6 0 0 1 1.9.4 3.3 3.3 0 0 1 1.9 1.9 5.6 5.6 0 0 1 .4 1.9c.1 1.1.1 1.4.1 4.1s0 3-.1 4.1a5.6 5.6 0 0 1-.4 1.9 3.3 3.3 0 0 1-1.9 1.9 5.6 5.6 0 0 1-1.9.4c-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1a5.6 5.6 0 0 1-1.9-.4 3.3 3.3 0 0 1-1.9-1.9 5.6 5.6 0 0 1-.4-1.9C3.6 15 3.6 14.7 3.6 12s0-3 .1-4.1a5.6 5.6 0 0 1 .4-1.9A3.3 3.3 0 0 1 6 4.1a5.6 5.6 0 0 1 1.9-.4C9 3.6 9.3 3.6 12 3.6M12 2C9.3 2 8.9 2 7.8 2.1a7.3 7.3 0 0 0-2.4.4 5 5 0 0 0-2.9 2.9 7.3 7.3 0 0 0-.4 2.4C2 8.9 2 9.3 2 12s0 3.1.1 4.2a7.3 7.3 0 0 0 .4 2.4 5 5 0 0 0 2.9 2.9 7.3 7.3 0 0 0 2.4.4c1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1a7.3 7.3 0 0 0 2.4-.4 5 5 0 0 0 2.9-2.9 7.3 7.3 0 0 0 .4-2.4c.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2a7.3 7.3 0 0 0-.4-2.4 5 5 0 0 0-2.9-2.9 7.3 7.3 0 0 0-2.4-.4C15.1 2 14.7 2 12 2z"/></svg>',
    TikTok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6 2.7 2.7 0 0 1 .8.1V9.7a5.8 5.8 0 0 0-.8-.1 5.8 5.8 0 1 0 5.8 5.8V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z"/></svg>',
    YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>'
  };
  const waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>';

  // "Creadora de contenido UGC para marcas…" → titular gigante + complemento
  const corte = D.rol.indexOf(' para ');
  const titular = corte > 0 ? D.rol.slice(0, corte) : D.rol;
  const complemento = corte > 0 ? D.rol.slice(corte + 1) : '';

  const nav = [
    ['#marcas', 'Marcas'], ['#trabajo', 'Mi trabajo'], ['#nichos', 'Nichos'],
    ['#sobre-mi', 'Sobre mí'], ['#testimonios', 'Testimonios'], ['#contacto', 'Contacto']
  ];
  const cinta = (words, rep = 3) => Array.from({ length: rep }, () => words.map(w => `<span>${esc(w)}</span>`).join('')).join('');

  const pieza = (p, i) => `<li class="reel-item">
      <button class="card" type="button" data-i="${i}" aria-label="Ver ${esc(p.titulo)} (${esc(p.tipo)})">
        <span class="card-media">
          ${isVideo(p.src)
            ? `<video data-src="${esc(p.src)}" muted loop playsinline preload="none" aria-hidden="true"></video><span class="card-badge">${star()}Reel</span>`
            : `<img src="${esc(p.src)}" alt="${esc(p.titulo)}" loading="lazy" decoding="async" draggable="false">`}
          <span class="view">Ver</span>
        </span>
        <span class="card-meta"><span class="card-title">${esc(p.titulo)}</span><span class="tag">${esc(p.tipo)} · ${esc(p.nicho)}</span></span>
      </button>
    </li>`;

  document.getElementById('app').innerHTML = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="star" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"/></symbol>
  </svg>

  <header class="top">
    <nav class="nav wrap" aria-label="Principal">
      <a href="#top" class="logo">${esc(D.nombre)}${star('logo-star')}</a>
      <div class="nav-links">
        ${nav.map(([h, t]) => `<a class="nav-link" href="${h}"><span>${esc(t)}</span><span aria-hidden="true">${esc(t)}</span></a>`).join('')}
        <a href="#contacto" class="btn">Contáctame ${arrow}</a>
      </div>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-label">Menú</span><span class="menu-dots" aria-hidden="true"><i></i><i></i></span></button>
    </nav>
  </header>

  <div class="menu" id="menu" aria-hidden="true">
    <nav class="menu-links wrap" aria-label="Móvil">${nav.map(([h, t], i) => `<a href="${h}" style="--i:${i}"><span>${esc(t)}</span></a>`).join('')}</nav>
    <div class="menu-foot wrap">
      <a href="mailto:${esc(D.contacto.email)}">${esc(D.contacto.email)}</a>
      <div>${D.redes.map(r => `<a href="${esc(r.url)}" ${ext}>${esc(r.nombre)}</a>`).join('')}</div>
    </div>
  </div>

  <main id="top">
    <!-- 01 · HERO -->
    <section class="hero wrap">
      <p class="hero-kicker">${star()}<span>${esc(D.nombre)}</span></p>
      <h1 class="hero-title">${esc(titular)}</h1>
      <div class="hero-row">
        <p class="hero-sub">${esc(complemento)}</p>
        <div class="hero-side">
          <p class="hero-intro">${esc(D.intro)}</p>
          <div class="hero-actions">
            <a href="#trabajo" class="btn">Ver mi trabajo ${arrow}</a>
            <a href="#contacto" class="btn ghost">Contáctame</a>
          </div>
          <div class="hero-socials">${D.redes.map(r => `<a href="${esc(r.url)}" ${ext} aria-label="${esc(r.nombre)}">${icons[r.nombre] || ''}</a>`).join('')}</div>
        </div>
      </div>
    </section>

    <div class="marquee" aria-hidden="true"><div class="marquee-track">${cinta(D.cinta, 4)}</div></div>

    <div class="wrap"><figure class="hero-img"><img src="${esc(D.medios.hero)}" alt="${esc(D.nombre)} sonriendo" fetchpriority="high" decoding="async"></figure></div>

    <!-- 02 · MARCAS -->
    <section class="clients" id="marcas">
      <div class="wrap"><h2 class="clients-title">${esc(D.marcas.titulo)}</h2></div>
      <div class="logos"><div class="marquee-track">${[0, 1].map(() => D.marcas.logos.map(l => `<span class="client-logo"><img src="${esc(l.src)}" alt="${esc(l.nombre)}" loading="lazy" decoding="async"></span>`).join('')).join('')}</div></div>
    </section>

    <!-- 03 · CONTENIDO -->
    <section class="work" id="trabajo">
      <div class="marquee big" aria-hidden="true"><div class="marquee-track">${cinta([D.contenido.titulo], 6)}</div></div>
      <h2 class="sr">${esc(D.contenido.titulo)}</h2>
      <div class="reel" data-reel>
        <div class="reel-head wrap">
          <p class="label">${star()}Contenido</p>
          <div class="reel-arrows">
            <button class="round" type="button" data-dir="-1" aria-label="Anterior"><span class="flip">${arrow}</span></button>
            <button class="round" type="button" data-dir="1" aria-label="Siguiente">${arrow}</button>
          </div>
        </div>
        <ul class="reel-track" tabindex="0" aria-label="Carrusel de contenido">${D.contenido.piezas.map(pieza).join('')}</ul>
        <div class="wrap"><div class="reel-bar" aria-hidden="true"><span></span></div></div>
      </div>
    </section>

    <!-- 04 · NICHOS Y CONTENIDO -->
    <section class="section wrap" id="nichos">
      <p class="label">${star()}Nichos y contenido</p>
      <h2 class="section-title">${esc(D.nichos.titulo)}</h2>
      <div class="services">${D.nichos.items.map(n => `
        <article class="service">${star()}<h3>${esc(n.titulo)}</h3><p>${esc(n.texto)}</p></article>`).join('')}
      </div>

      <h2 class="section-title section-title--after">${esc(D.tiposContenido.titulo)}</h2>
      <div class="types">${D.tiposContenido.items.map((t, i) => `
        <article class="type"><span class="type-n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t.titulo)}</h3><p><strong>Ej.:</strong> ${esc(t.ejemplo)}</p></article>`).join('')}
      </div>
    </section>

    <!-- 05 · SOBRE MÍ -->
    <section class="section wrap about" id="sobre-mi">
      <div class="about-text">
        <p class="label">${star()}${esc(D.sobreMi.titulo)}</p>
        <div class="profile">
          <img class="avatar" src="${esc(D.medios.hero)}" alt="" width="84" height="84" loading="lazy" decoding="async">
          <div><h2>${esc(D.nombre)}</h2><p>Creadora de contenido UGC</p></div>
        </div>
        ${D.sobreMi.parrafos.map(p => `<p class="about-p">${esc(p)}</p>`).join('')}
        <a href="#contacto" class="btn">Contáctame ${arrow}</a>
      </div>
      <div class="about-media">
        <figure class="about-img"><img src="${esc(D.medios.sobreMi)}" alt="${esc(D.nombre)} con su celular" loading="lazy" decoding="async"></figure>
        <figure class="about-img about-img--wide"><img src="${esc(D.medios.portada)}" alt="${esc(D.nombre)} al aire libre" loading="lazy" decoding="async"></figure>
      </div>
    </section>

    <!-- 06 · TESTIMONIOS -->
    <section class="section wrap" id="testimonios">
      <p class="label">${star()}Testimonios</p>
      <h2 class="section-title">${esc(D.testimonios.titulo)}</h2>
      <ul class="quotes">${D.testimonios.items.map(t => `
        <li class="quote">
          ${star('quote-star')}
          <blockquote>“${esc(t.texto)}”</blockquote>
          <div class="quote-who"><img src="${esc(t.foto)}" alt="" width="44" height="44" loading="lazy" decoding="async"><span><strong>${esc(t.cargo)}</strong><span>${esc(t.empresa)}</span></span></div>
        </li>`).join('')}
      </ul>
    </section>

    <div class="marquee big" aria-hidden="true"><div class="marquee-track">${cinta([D.contacto.titulo], 6)}</div></div>

    <!-- 07 · CONTACTO + MIS REDES -->
    <section class="cta" id="contacto">
      ${star('cta-star')}
      <p class="cta-kicker">${esc(D.contacto.texto)}</p>
      <h2 class="cta-title">${esc(D.contacto.titulo)}</h2>
      <div class="cta-actions">
        <a href="mailto:${esc(D.contacto.email)}" class="btn light">${esc(D.contacto.email)} ${arrow}</a>
        <a href="${esc(D.contacto.whatsapp.url)}" class="btn outline-light" ${ext}>${waIcon}${esc(D.contacto.whatsapp.texto)}</a>
      </div>
      <p class="cta-sub">Mis redes</p>
      <ul class="socials">${D.redes.map(r => `
        <li><a class="social" href="${esc(r.url)}" ${ext}>
          <span class="social-icon">${icons[r.nombre] || ''}</span>
          <span class="social-text"><strong>${esc(r.nombre)}</strong><span>${esc(r.usuario)}</span></span>
          <span class="social-go">${arrow}</span>
        </a></li>`).join('')}
      </ul>
    </section>
  </main>

  <footer class="foot">
    <div class="foot-grid">
      <div><a href="#top" class="logo">${esc(D.nombre)}${star('logo-star')}</a><p class="foot-role">${esc(D.rol)}</p></div>
      <div><h4>Secciones</h4><ul>${nav.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></div>
      <div><h4>Redes</h4><ul>${D.redes.map(r => `<li><a href="${esc(r.url)}" ${ext}>${esc(r.nombre)}</a></li>`).join('')}<li><a href="${esc(D.contacto.whatsapp.url)}" ${ext}>WhatsApp</a></li></ul></div>
      <div class="foot-circle">
        <a href="#contacto" aria-label="${esc(D.contacto.titulo)}">
          <svg class="circle" viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="c" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs>
            <text><textPath href="#c">${esc(D.contacto.titulo)} ✦ ${esc(D.contacto.titulo)} ✦</textPath></text>
          </svg>
          ${star('circle-star')}
        </a>
      </div>
    </div>
    <p class="copy">${esc(D.footer)}</p>
  </footer>

  <div class="viewer" id="viewer" role="dialog" aria-modal="true" aria-label="Contenido" hidden>
    <button class="viewer-close round light" type="button" aria-label="Cerrar">✕</button>
    <div class="viewer-stage"></div>
    <p class="viewer-cap"></p>
  </div>

  <div class="drag-cursor" aria-hidden="true">Arrastra</div>`;
})();
