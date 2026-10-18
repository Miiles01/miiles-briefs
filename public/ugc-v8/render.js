/* Arma toda la página a partir de window.UGC (data.js) con la estructura de la plantilla Mira / Cue */
(() => {
  const D = window.UGC;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ext = 'target="_blank" rel="noopener"';
  const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);
  const roll = t => `<span class="roll"><span>${esc(t)}</span><span aria-hidden="true">${esc(t)}</span></span>`;
  const arrow = '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const icons = {
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.9A3.1 3.1 0 1 1 15.1 12 3.1 3.1 0 0 1 12 15.1zM17 5.9a1.1 1.1 0 1 0 1.1 1.1A1.1 1.1 0 0 0 17 5.9zM12 3.6c2.7 0 3 0 4.1.1a5.6 5.6 0 0 1 1.9.4 3.3 3.3 0 0 1 1.9 1.9 5.6 5.6 0 0 1 .4 1.9c.1 1.1.1 1.4.1 4.1s0 3-.1 4.1a5.6 5.6 0 0 1-.4 1.9 3.3 3.3 0 0 1-1.9 1.9 5.6 5.6 0 0 1-1.9.4c-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1a5.6 5.6 0 0 1-1.9-.4 3.3 3.3 0 0 1-1.9-1.9 5.6 5.6 0 0 1-.4-1.9C3.6 15 3.6 14.7 3.6 12s0-3 .1-4.1a5.6 5.6 0 0 1 .4-1.9A3.3 3.3 0 0 1 6 4.1a5.6 5.6 0 0 1 1.9-.4C9 3.6 9.3 3.6 12 3.6M12 2C9.3 2 8.9 2 7.8 2.1a7.3 7.3 0 0 0-2.4.4 5 5 0 0 0-2.9 2.9 7.3 7.3 0 0 0-.4 2.4C2 8.9 2 9.3 2 12s0 3.1.1 4.2a7.3 7.3 0 0 0 .4 2.4 5 5 0 0 0 2.9 2.9 7.3 7.3 0 0 0 2.4.4c1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1a7.3 7.3 0 0 0 2.4-.4 5 5 0 0 0 2.9-2.9 7.3 7.3 0 0 0 .4-2.4c.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2a7.3 7.3 0 0 0-.4-2.4 5 5 0 0 0-2.9-2.9 7.3 7.3 0 0 0-2.4-.4C15.1 2 14.7 2 12 2z"/></svg>',
    TikTok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6 2.7 2.7 0 0 1 .8.1V9.7a5.8 5.8 0 0 0-.8-.1 5.8 5.8 0 1 0 5.8 5.8V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z"/></svg>',
    YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>'
  };
  const mail = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  const wa = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>';

  const navL = [['#marcas', 'Marcas'], ['#trabajo', 'Mi trabajo'], ['#nichos', 'Nichos']];
  const navR = [['#sobre-mi', 'Sobre mí'], ['#testimonios', 'Testimonios'], ['#contacto', 'Contacto']];
  const nav = [...navL, ...navR];
  const piezas = D.contenido.piezas;
  const heroWords = ['Creadora', 'de contenido', 'UGC', 'para marcas'];
  const nicheWords = ['Belleza', 'Moda', 'Bienestar'];

  const panel = (p, i) => `
    <figure class="panel img ${i % 3 === 0 ? 'small' : ''}">
      <button class="panel-btn" type="button" data-i="${i}" aria-label="Ver ${esc(p.titulo)} (${esc(p.tipo)})">
        <span class="panel-media">${isVideo(p.src)
          ? `<video src="${esc(p.src)}#t=0.1" data-src="${esc(p.src)}" muted loop playsinline preload="metadata" aria-hidden="true"></video>`
          : `<img src="${esc(p.src)}" alt="${esc(p.titulo)}" loading="lazy" decoding="async" draggable="false">`}</span>
      </button>
      <figcaption><span>${esc(p.titulo)}</span><span class="label">${esc(p.tipo)} · ${esc(p.nicho)}</span></figcaption>
    </figure>`;

  document.getElementById('app').innerHTML = `
  <div class="page-loader" aria-hidden="true"></div>

  <nav class="navbar" aria-label="Principal">
    <div class="nav-side">
      <button class="menu-btn nav-link" type="button" aria-expanded="false" aria-controls="menu">${roll('Menú')}</button>
      ${navL.map(([h, t]) => `<a class="nav-link nav-desk" href="${h}">${roll(t)}</a>`).join('')}
    </div>
    <a href="#top" class="logo script" aria-label="${esc(D.nombre)}, inicio">${esc(D.nombre.toLowerCase())}</a>
    <div class="nav-side right">
      ${navR.slice(0, 2).map(([h, t]) => `<a class="nav-link nav-desk" href="${h}">${roll(t)}</a>`).join('')}
      <a class="nav-link nav-cta" href="#contacto">${roll('Contáctame →')}</a>
    </div>
  </nav>

  <div class="menu" id="menu" aria-hidden="true">
    <nav class="menu-links" aria-label="Móvil">${nav.map(([h, t], i) => `<a href="${h}" style="--i:${i}"><span>${esc(t)}</span></a>`).join('')}</nav>
    <div class="menu-foot">${D.redes.map(r => `<a href="${esc(r.url)}" ${ext}>${esc(r.nombre)}</a>`).join('')}<a href="mailto:${esc(D.contacto.email)}">${esc(D.contacto.email)}</a></div>
    <div class="menu-brand script" aria-hidden="true">${esc(D.nombre.toLowerCase())}</div>
  </div>

  <main id="top">
    <!-- 01 · HERO: wordmark gigante, foto que crece, se achica y abre el collage -->
    <header class="header">
      <h1 class="sr">${esc(D.nombre)}, ${esc(D.rol.charAt(0).toLowerCase() + D.rol.slice(1))}</h1>
      <div class="header_sticky">
        <div class="header_brand script" aria-hidden="true">${esc(D.nombre.toLowerCase())}</div>
        <div class="collage" aria-hidden="true">${D.medios.collage.map((src, i) => `<div class="collage_img c${i}"><img src="${esc(src)}" alt="" decoding="async"></div>`).join('')}</div>
        <div class="header_main-image">
          <div class="hero_image-reveal"><img src="${esc(D.medios.hero)}" alt="${esc(D.nombre)} sonriendo" fetchpriority="high" decoding="async"></div>
        </div>
        ${heroWords.map((w, i) => `<div class="header_word hw${i}" aria-hidden="true"><span>${esc(w)}</span></div>`).join('')}
        <div class="header_foot">
          <div class="header_socials">${D.redes.map(r => `<a href="${esc(r.url)}" ${ext} class="nav-link">${roll(r.nombre)}</a>`).join('')}</div>
          <div class="header_ctas">
            <a href="#trabajo" class="nav-link">${roll('Ver mi trabajo')}</a>
            <a href="#contacto" class="nav-link">${roll('Contáctame →')}</a>
          </div>
        </div>
      </div>
    </header>

    <!-- 02 · MARCAS: títulos que viajan al centro -->
    <section class="section applause container" id="marcas">
      <p class="label center">${esc(D.nombre)} · UGC</p>
      <h2 class="sr">${esc(D.marcas.titulo)}</h2>
      <div class="row h-l" data-center aria-hidden="true"><span>Marcas que</span><div class="thumb mask_reveal"><img src="${esc(D.medios.portada)}" alt="" loading="lazy" decoding="async"></div></div>
      <div class="row h-l row-right" data-center="left" aria-hidden="true"><span>confiaron en mí</span></div>
      <ul class="logos">${D.marcas.logos.map(l => `<li><img src="${esc(l.src)}" alt="${esc(l.nombre)}" loading="lazy" decoding="async"></li>`).join('')}</ul>

      <div class="intro">
        <span class="label">${esc(D.nombre)}</span>
        <p class="h-m color-change"><span class="indent"></span>${esc(D.intro)}</p>
      </div>
    </section>

    <!-- 03 · CONTENIDO: scroll horizontal fijado (en móvil, carrusel con swipe) -->
    <section class="is-green work" id="trabajo">
      <div class="manifesto">
        <p class="label">${esc(D.contenido.titulo)}</p>
        <h2 class="h-xl" data-reveal>${esc(D.contenido.manifiesto)}</h2>
      </div>
      <div class="hpin">
      <div class="hscroll" data-reel>
        <div class="hscroll_track">
          <div class="panel text">
            <span class="label">Contenido</span>
            <p class="h-m"><span class="indent"></span>${esc(D.contenido.nota)}</p>
            <a href="#contacto" class="nav-link">${roll('Contáctame →')}</a>
          </div>
          ${piezas.map(panel).join('')}
        </div>
      </div>
      <div class="hscroll_ui container">
        <div class="reel-bar" aria-hidden="true"><span></span></div>
        <div class="reel-arrows">
          <button class="round" type="button" data-dir="-1" aria-label="Anterior"><span class="flip-x">${arrow}</span></button>
          <button class="round" type="button" data-dir="1" aria-label="Siguiente">${arrow}</button>
        </div>
      </div>
      </div>
    </section>

    <!-- 04 · NICHOS Y CONTENIDO -->
    <section class="steps" id="nichos">
      <h2 class="steps-title h-xl" data-reveal>Nichos en los que <span class="script">trabajo</span></h2>
      ${D.nichos.items.map((n, i) => `
      <article class="step ${i % 2 ? 'flip' : ''}">
        <div class="copy">
          <h3 class="h-m"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="indent"></span>${esc(n.titulo)}</h3>
          <p>${esc(n.texto)}</p>
        </div>
        <div><div class="media ${i % 2 ? 'tall' : ''} mask_reveal"><img src="${esc(D.fotosNichos[i])}" alt="${esc(n.titulo)}" loading="lazy" decoding="async"></div><div class="caption">${esc(n.titulo)}</div></div>
      </article>
      ${i === 1 ? `
      <div class="heads" aria-hidden="true">
        <div class="heads_script script">${esc(D.nombre.toLowerCase())}</div>
        <div class="heads_img mask_reveal"><img src="${esc(D.medios.nichos)}" alt="" loading="lazy" decoding="async"></div>
        ${nicheWords.map((w, k) => `<div class="heads_word hd${k}" data-speed="${[1.2, 0.8, 0.95][k]}">${esc(w)}</div>`).join('')}
      </div>` : ''}`).join('')}

      <div class="types container">
        <p class="label">Formatos</p>
        <h2 class="h-l" data-reveal>${esc(D.tiposContenido.titulo)}</h2>
        <ol class="type-list">${D.tiposContenido.items.map((t, i) => `
          <li class="type">
            <span class="num">${String(i + 1).padStart(2, '0')}</span>
            <span class="h-m">${esc(t.titulo)}</span>
            <p><span class="script">Ej.</span> ${esc(t.ejemplo)}</p>
          </li>`).join('')}
        </ol>
      </div>
    </section>

    <!-- 05 · SOBRE MÍ -->
    <section class="section about container" id="sobre-mi">
      <div class="about-grid">
        <div class="about-media mask_reveal"><img src="${esc(D.medios.sobreMi)}" alt="${esc(D.nombre)} con su celular" loading="lazy" decoding="async"></div>
        <div class="about-copy">
          <h2 class="about-h">${esc(D.sobreMi.titulo)}</h2>
          ${D.sobreMi.parrafos.map(p => `<p class="h-m color-change">${esc(p)}</p>`).join('')}
          <a href="#contacto" class="btn">${roll('Contáctame')} ${arrow}</a>
        </div>
      </div>
    </section>

    <!-- 06 · TESTIMONIOS -->
    <section class="section is-green testimonials" id="testimonios">
      <div class="top container">
        <h2 class="h-l" data-reveal>${esc(D.testimonios.titulo)}</h2>
        <a href="#contacto" class="btn btn-light">${roll('Hagamos algo juntas')} ${arrow}</a>
      </div>
      <ul class="cards container">${D.testimonios.items.map(t => `
        <li class="card">
          <blockquote>“${esc(t.texto)}”</blockquote>
          <div class="meta"><img src="${esc(t.foto)}" alt="" loading="lazy" decoding="async"><span><strong>${esc(t.cargo)}</strong><span>${esc(t.empresa)}</span></span></div>
        </li>`).join('')}
      </ul>
    </section>
  </main>

  <!-- 07 · CONTACTO + MIS REDES -->
  <footer class="footer" id="contacto">
    <div class="container footer-head">
      <span class="label">Contacto</span>
      <h2 class="h-l color-change">${esc(D.contacto.titulo)}</h2>
      <p class="footer-text">${esc(D.contacto.texto)}</p>
    </div>
    <div class="loc-list">
      <a href="mailto:${esc(D.contacto.email)}" class="loc"><span class="h-m">${esc(D.contacto.email)}</span><span class="phone">Email <span class="circle">${mail}</span></span></a>
      <a href="${esc(D.contacto.whatsapp.url)}" class="loc" ${ext}><span class="h-m">${esc(D.contacto.whatsapp.texto)}</span><span class="phone">WhatsApp <span class="circle">${wa}</span></span></a>
    </div>
    <div class="container socials-head"><span class="label">Mis redes</span></div>
    <div class="socials">${D.redes.map(r => `
      <a href="${esc(r.url)}" class="social" ${ext}>
        <span class="social-icon">${icons[r.nombre] || ''}</span>
        <span class="social-name">${esc(r.nombre)}</span>
        <span class="social-user">${esc(r.usuario)}</span>
        <span class="social-go">${arrow}</span>
      </a>`).join('')}
    </div>
    <div class="footer_brand script" aria-hidden="true">${esc(D.nombre.toLowerCase())}</div>
    <div class="footer_bottom"><span>${esc(D.footer)}</span><a href="#top" class="nav-link">${roll('Volver arriba ↑')}</a></div>
  </footer>

  <div class="viewer" id="viewer" role="dialog" aria-modal="true" aria-label="Contenido" hidden>
    <button class="viewer-close round" type="button" aria-label="Cerrar">✕</button>
    <div class="viewer-stage"></div>
    <p class="viewer-cap"></p>
  </div>`;
})();
