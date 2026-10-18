/* Arma toda la página a partir de window.UGC (data.js) */
(() => {
  const D = window.UGC;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ext = 'target="_blank" rel="noopener"';
  const roll = (href, text, attrs = '') => `<a class="roll" href="${href}" ${attrs}><span>${esc(text)}</span><span>${esc(text)}</span></a>`;
  const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);

  const icons = {
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.9A3.1 3.1 0 1 1 15.1 12 3.1 3.1 0 0 1 12 15.1zM17 5.9a1.1 1.1 0 1 0 1.1 1.1A1.1 1.1 0 0 0 17 5.9zM12 3.6c2.7 0 3 0 4.1.1a5.6 5.6 0 0 1 1.9.4 3.3 3.3 0 0 1 1.9 1.9 5.6 5.6 0 0 1 .4 1.9c.1 1.1.1 1.4.1 4.1s0 3-.1 4.1a5.6 5.6 0 0 1-.4 1.9 3.3 3.3 0 0 1-1.9 1.9 5.6 5.6 0 0 1-1.9.4c-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1a5.6 5.6 0 0 1-1.9-.4 3.3 3.3 0 0 1-1.9-1.9 5.6 5.6 0 0 1-.4-1.9C3.6 15 3.6 14.7 3.6 12s0-3 .1-4.1a5.6 5.6 0 0 1 .4-1.9A3.3 3.3 0 0 1 6 4.1a5.6 5.6 0 0 1 1.9-.4C9 3.6 9.3 3.6 12 3.6M12 2C9.3 2 8.9 2 7.8 2.1a7.3 7.3 0 0 0-2.4.4 5 5 0 0 0-2.9 2.9 7.3 7.3 0 0 0-.4 2.4C2 8.9 2 9.3 2 12s0 3.1.1 4.2a7.3 7.3 0 0 0 .4 2.4 5 5 0 0 0 2.9 2.9 7.3 7.3 0 0 0 2.4.4c1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1a7.3 7.3 0 0 0 2.4-.4 5 5 0 0 0 2.9-2.9 7.3 7.3 0 0 0 .4-2.4c.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2a7.3 7.3 0 0 0-.4-2.4 5 5 0 0 0-2.9-2.9 7.3 7.3 0 0 0-2.4-.4C15.1 2 14.7 2 12 2z"/></svg>',
    TikTok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6 2.7 2.7 0 0 1 .8.1V9.7a5.8 5.8 0 0 0-.8-.1 5.8 5.8 0 1 0 5.8 5.8V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z"/></svg>',
    YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>'
  };
  const waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>';
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Parte un texto en ~3 líneas parejas para el titular del hero
  const lines = (text, n = 3) => {
    const target = text.length / n, out = [''];
    text.split(' ').forEach(w => {
      const cur = out[out.length - 1];
      if (cur && out.length < n && cur.length + 1 + w.length / 2 > target) out.push(w);
      else out[out.length - 1] = cur ? cur + ' ' + w : w;
    });
    return out;
  };

  const nav = [
    ['#marcas', 'Marcas'], ['#trabajo', 'Mi trabajo'], ['#nichos', 'Nichos'],
    ['#sobre-mi', 'Sobre mí'], ['#testimonios', 'Testimonios'], ['#contacto', 'Contacto']
  ];
  const redesMini = D.redes.map(r => `<a class="hero-social" href="${esc(r.url)}" ${ext} aria-label="${esc(r.nombre)}">${icons[r.nombre] || ''}<span>${esc(r.nombre)}</span></a>`).join('');

  const pieza = (p, i) => {
    const media = isVideo(p.src)
      ? `<video class="reel-media" data-src="${esc(p.src)}" muted loop playsinline preload="none" aria-hidden="true"></video>`
      : `<img class="reel-media" src="${esc(p.src)}" alt="${esc(p.titulo)}" loading="lazy" decoding="async" draggable="false">`;
    return `<li class="reel-item">
      <button class="reel-card" type="button" data-i="${i}" aria-label="Ver ${esc(p.titulo)} (${esc(p.tipo)})">
        <span class="reel-frame">${media}${isVideo(p.src) ? '<span class="reel-play" aria-hidden="true"></span>' : ''}</span>
        <span class="reel-cap"><span class="reel-title">${esc(p.titulo)}</span><span class="reel-type">${esc(p.tipo)} · ${esc(p.nicho)}</span></span>
      </button>
    </li>`;
  };

  document.getElementById('app').innerHTML = `
  <header class="bar">
    <a class="brand" href="#top" aria-label="${esc(D.nombre)}, inicio"><span class="brand-mark" aria-hidden="true">✦</span><span>${esc(D.nombre)}</span></a>
    <nav class="nav" aria-label="Principal">${nav.map(([h, t]) => roll(h, t)).join('')}</nav>
    <a class="bar-cta" href="#contacto">Contáctame</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="sheet"><span class="burger-label">Menú</span></button>
  </header>

  <div class="sheet" id="sheet" aria-hidden="true">
    <nav aria-label="Móvil">${nav.map(([h, t], i) => `<a href="${h}" style="--i:${i}"><span>${esc(t)}</span></a>`).join('')}</nav>
    <p class="sheet-foot">${esc(D.contacto.email)}<br>${D.redes.map(r => esc(r.nombre)).join(' · ')}</p>
  </div>

  <!-- 01 · HERO -->
  <header class="hero" id="top">
    <div class="media" data-img="hero" data-src="${esc(D.medios.hero)}"><div class="media-fill"></div></div>
    <div class="hero-mid container">
      <span class="label">${esc(D.nombre)}</span>
      <div class="hero-sub">
        <h1 class="lines">${lines(D.rol).map(l => `<span>${esc(l)}</span>`).join('')}</h1>
        <p class="hero-intro">${esc(D.intro)}</p>
        <div class="hero-actions">
          <a class="btn dark" href="#trabajo">Ver mi trabajo</a>
          <a class="btn outline" href="#contacto">Contáctame</a>
        </div>
        <div class="hero-socials">${redesMini}</div>
      </div>
    </div>
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track"><span>${esc(D.nombre)} <i>✦</i> UGC <i>✦</i></span><span>${esc(D.nombre)} <i>✦</i> UGC <i>✦</i></span></div>
    </div>
  </header>

  <main>
    <!-- 02 · MARCAS -->
    <section class="section section--tight" id="marcas">
      <div class="container">
        <div class="intro">
          <span class="label text">Marcas</span>
          <h2 class="h-md">${esc(D.marcas.titulo)}</h2>
        </div>
        <ul class="logos">${D.marcas.logos.map(l => `<li><img src="${esc(l.src)}" alt="${esc(l.nombre)}" loading="lazy" decoding="async"></li>`).join('')}</ul>
      </div>
    </section>

    <!-- 03 · CONTENIDO: carrusel de reels -->
    <section class="section section--flush" id="trabajo">
      <div class="container">
        <h2 class="xl-title" aria-label="${esc(D.contenido.titulo)}"><span>${esc(D.contenido.titulo)}</span></h2>
      </div>
      <div class="reel" data-reel>
        <div class="container reel-head">
          <span class="label text">Reels y fotos · arrastra o usa las flechas</span>
          <div class="reel-arrows">
            <button class="reel-arrow" type="button" data-dir="-1" aria-label="Anterior"><span style="transform:scaleX(-1)">${arrow}</span></button>
            <button class="reel-arrow" type="button" data-dir="1" aria-label="Siguiente">${arrow}</button>
          </div>
        </div>
        <ul class="reel-track" tabindex="0" aria-label="Carrusel de contenido">${D.contenido.piezas.map(pieza).join('')}</ul>
        <div class="container"><div class="reel-bar" aria-hidden="true"><span></span></div></div>
      </div>
    </section>

    <!-- 04 · NICHOS Y CONTENIDO -->
    <section class="section" id="nichos">
      <div class="container">
        <div class="intro">
          <span class="label text">Nichos</span>
          <h2 class="h-md">${esc(D.nichos.titulo)}</h2>
        </div>
        <ul class="text-list">${D.nichos.items.map(n => `
          <li class="text-item">
            <div class="label-col"><span class="label text">${esc(n.titulo)}</span></div>
            <div class="text-col"><h3 class="h-sm">${esc(n.titulo)}</h3><p class="muted line">${esc(n.texto)}</p></div>
          </li>`).join('')}
        </ul>

        <div class="intro intro--after">
          <span class="label text">Contenido</span>
          <h2 class="h-md">${esc(D.tiposContenido.titulo)}</h2>
        </div>
        <ul class="type-grid">${D.tiposContenido.items.map(t => `
          <li class="type-item">
            <h3 class="h-sm">${esc(t.titulo)}</h3>
            <p class="line"><em>Ej.:</em> ${esc(t.ejemplo)}</p>
          </li>`).join('')}
        </ul>
      </div>
    </section>

    <figure class="bleed" data-img="portada" data-src="${esc(D.medios.portada)}">
      <div class="media-fill"></div>
      <div class="bleed-overlay"></div>
      <figcaption class="bleed-cap container">
        <p class="display-l">${esc(D.frasePortada)}</p>
      </figcaption>
    </figure>

    <!-- 05 · SOBRE MÍ -->
    <section class="section" id="sobre-mi">
      <div class="container">
        <div class="split split--rev">
          <div class="split-text">
            <span class="label text">${esc(D.nombre)}</span>
            <h2 class="h-md">${esc(D.sobreMi.titulo)}</h2>
            ${D.sobreMi.parrafos.map(p => `<p class="muted line">${esc(p)}</p>`).join('')}
            <a class="btn dark" href="#contacto">Contáctame</a>
          </div>
          <div class="ratio-23 split-img" data-img="sobre-mi" data-src="${esc(D.medios.sobreMi)}"><div class="media-fill"></div></div>
        </div>
      </div>
    </section>

    <!-- 06 · TESTIMONIOS -->
    <section class="section section--soft" id="testimonios">
      <div class="container">
        <div class="intro">
          <span class="label text">Testimonios</span>
          <h2 class="h-md">${esc(D.testimonios.titulo)}</h2>
        </div>
        <ul class="quotes">${D.testimonios.items.map(t => `
          <li class="quote-card">
            <blockquote><p>“${esc(t.texto)}”</p></blockquote>
            <div class="quote-who">
              <img src="${esc(t.foto)}" alt="" width="48" height="48" loading="lazy" decoding="async">
              <span><strong>${esc(t.cargo)}</strong><span>${esc(t.empresa)}</span></span>
            </div>
          </li>`).join('')}
        </ul>
      </div>
    </section>
  </main>

  <!-- 07 · CONTACTO + MIS REDES -->
  <footer class="footer" id="contacto">
    <div class="container footer-cta">
      <span class="label text">Contacto</span>
      <h2 class="display-l">${esc(D.contacto.titulo).replace(/(\S+)$/, '<em>$1</em>')}</h2>
      <p class="line contact-text">${esc(D.contacto.texto)}</p>
      <div class="contact-actions">
        <a class="contact-mail" href="mailto:${esc(D.contacto.email)}">${esc(D.contacto.email)}</a>
        <a class="btn plain" href="${esc(D.contacto.whatsapp.url)}" ${ext}>${waIcon}<span>${esc(D.contacto.whatsapp.texto)}</span></a>
      </div>
    </div>

    <div class="container socials">
      <h3 class="h-sm">Mis redes</h3>
      <ul class="social-grid">${D.redes.map(r => `
        <li><a class="social-btn" href="${esc(r.url)}" ${ext}>
          <span class="social-icon">${icons[r.nombre] || ''}</span>
          <span class="social-text"><strong>${esc(r.nombre)}</strong><span>${esc(r.usuario)}</span></span>
          <span class="social-arrow">${arrow}</span>
        </a></li>`).join('')}
      </ul>
    </div>

    <div class="marquee marquee--footer" aria-hidden="true">
      <div class="marquee-track"><span>${esc(D.nombre)} <i>✦</i></span><span>${esc(D.nombre)} <i>✦</i></span><span>${esc(D.nombre)} <i>✦</i></span></div>
    </div>
    <p class="container legal">${esc(D.footer)}</p>
  </footer>

  <a class="wa-float" href="${esc(D.contacto.whatsapp.url)}" ${ext} aria-label="${esc(D.contacto.whatsapp.texto)} por WhatsApp">${waIcon}</a>

  <!-- Visor grande del carrusel -->
  <div class="viewer" id="viewer" role="dialog" aria-modal="true" aria-label="Contenido" hidden>
    <button class="viewer-close" type="button" aria-label="Cerrar">✕</button>
    <div class="viewer-stage"></div>
    <p class="viewer-cap"></p>
  </div>`;
})();
