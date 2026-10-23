# Genera public/ugc-v14/index.html a partir de los datos de Diana.
# Para cambiar textos o fotos: edita DATA y vuelve a correr este script.
import hashlib, html, json, os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "ugc-v14", "index.html")

DATA = {
    "name": "Diana",
    "role": "creadora de contenido UGC",
    "script": "belleza, moda y lifestyle",
    "statement": ("Contenido que se siente", "real", "y hace que tu marca", "se vea en uso"),
    "about": [
        "Soy Diana. Grabo videos y fotos que suenan a recomendación de amiga: cercanos, honestos y pensados para que tu producto se vea en la vida diaria.",
        "Me encargo de todo: idea, guion, grabación y edición en formato vertical, listo para TikTok, Reels o anuncios.",
    ],
    "works_title": ("Mi", "trabajo"),
    "works_sub": "Videos y fotos para marcas de belleza, moda y lifestyle.",
    "works": [f"media/w{i:02d}.jpg" for i in range(1, 17)],
    "videos": [(f"media/video-{i}.mp4", f"media/poster-{i}.jpg") for i in range(1, 5)],
    "niches_script": "Nichos",
    "niches": ["Belleza y skincare", "Moda", "Lifestyle", "Bienestar"],
    "niches_title": ("Contenido para", "belleza, moda", "y la vida diaria"),
    "brands_script": "Marcas",
    "brands_title": ("Marcas con las que", "he colaborado"),
    "brands": ["L'Oréal", "Sephora", "Zara", "Bershka", "Nyx", "Garnier", "Mango", "Rare Beauty"],
    "quotes_title": ("Lo que dicen", "de mi trabajo"),
    "quotes": [
        ("Sus videos se sienten naturales y convirtieron mejor que nuestros anuncios de estudio.", "Marca de skincare"),
        ("Entrega rápida, ideas claras y un contenido que nuestra comunidad sí comenta.", "Marca de moda"),
        ("Entendió el producto a la primera y lo contó como alguien que de verdad lo usa.", "Marca de lifestyle"),
    ],
    "email": "hola@dianacreativa.com",
    "whatsapp": "https://wa.me/5215500000000",
    "socials": [("Instagram", "https://instagram.com/"), ("TikTok", "https://tiktok.com/"), ("YouTube", "https://youtube.com/")],
    "media": {
        "hero": "media/poster-1.jpg", "t1": "media/t1.jpg", "t2": "media/t2.jpg", "t3": "media/t3.jpg",
        "feat": "media/feat.jpg", "c1": "media/c1.jpg", "c2": "media/c2.jpg", "wide": "media/wide.jpg",
    },
}

e = html.escape
ROOT = os.path.dirname(OUT)
# Versión por contenido: cada cambio en CSS/JS cambia la URL y el navegador no usa la copia vieja en caché
def ver(*files):
    h = hashlib.md5()
    for f in files:
        h.update(open(os.path.join(ROOT, f), "rb").read())
    return h.hexdigest()[:8]
V_CSS = ver("styles.css")
V_JS = ver("main.js", "grid.js")
d = DATA
m = d["media"]
COLS, ROWS = 4, 6

def column(ci):
    items = []
    for ri in range(ROWS):
        src = d["works"][(ci * 3 + ri * 5) % len(d["works"])]
        items.append(f'<figure class="column__item"><div class="column__item-imgwrap"><div class="column__item-img" style="background-image:url({src})"></div></div></figure>')
    return '<div class="column">' + "".join(items) + "</div>"

nav = [("inicio", "Inicio"), ("sobre-mi", "Sobre mí"), ("trabajo", "Mi trabajo"), ("nichos", "Nichos"), ("marcas", "Marcas"), ("contacto", "Contacto")]

page = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(d['name'])} · Creadora de contenido UGC</title>
<meta name="description" content="{e(d['name'])}, {e(d['role'])} para marcas de {e(d['script'])}.">
<meta property="og:title" content="{e(d['name'])} · Creadora de contenido UGC">
<meta property="og:image" content="https://wearemiiles.com/ugc-v14/{m['hero']}">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@300,400,500,700,800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css?v={V_CSS}">
<script type="importmap">{{"imports":{{"three/webgpu":"./js/three/three.webgpu.min.js","three/tsl":"./js/three/three.tsl.min.js","./js/three/three.core.js":"./js/three/three.core.min.js"}}}}</script>
<script>document.documentElement.classList.add('js');
// Si la intro no arrancó en 6 s (red lenta o un script bloqueado), se muestra la página igual
setTimeout(function () {{ if (window.__introStarted) return; document.documentElement.classList.remove('js'); var p = document.querySelector('.preloader'); if (p) p.style.display = 'none'; }}, 6000);</script>
</head>
<body>

<div class="preloader" aria-hidden="true"><div class="preload-text">{e(d['name'])}</div></div>

<header class="nav">
  <button class="hamburger" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu"><span class="line-h top"></span><span class="line-h bottom"></span></button>
  <a href="#inicio" class="logo go">{e(d['name'])}<small>contenido UGC</small></a>
  <a href="#contacto" class="nav-cta go">Contacto</a>
</header>

<div class="menu" id="menu" aria-hidden="true">
  <div class="menu__overlay"></div>
  <div class="menu__base"></div>
  <aside class="menu__panel">
    <button class="menu__close" aria-label="Cerrar menú">Cerrar <span aria-hidden="true">×</span></button>
    <nav class="menu__links">
      {''.join(f'<a href="#{i}" class="menu__link go"><span>{e(t)}</span><span class="alt-t">{e(t)}</span></a>' for i, t in nav)}
    </nav>
    <div class="menu__social">{' '.join(f'<a href="{u}" target="_blank" rel="noopener">{e(n)}</a>' for n, u in d['socials'])}</div>
  </aside>
</div>

<main>
  <section class="section hero" id="inicio">
    <div class="hero_home">
      <p class="script fade-up">{e(d['role'])}</p>
      <h1 class="reveal-lines"><span class="line"><span>{e(d['name'])}</span></span></h1>
      <p class="hero-role fade-up">Contenido para marcas de {e(d['script'])}</p>
    </div>
  </section>

  <section class="hero-videos" aria-label="Videos UGC de {e(d['name'])}">
    {''.join(f'<div class="hero-video"><video src="{v}" poster="{p}" muted loop playsinline preload="none" aria-label="Video UGC {i + 1}"></video></div>' for i, (v, p) in enumerate(d['videos']))}
  </section>

  <section class="section">
    <h2 class="statement"><span class="alt">{e(d['statement'][0])}</span> {e(d['statement'][1])}<br>{e(d['statement'][2])} <span class="alt">{e(d['statement'][3])}</span></h2>
  </section>

  <section class="section">
    <div class="trittico">
      <div class="image-frame"><img class="image-inner" src="{m['t1']}" alt="" loading="lazy"></div>
      <div class="image-frame"><img class="image-inner" src="{m['t2']}" alt="" loading="lazy"></div>
      <div class="image-frame"><img class="image-inner" src="{m['t3']}" alt="" loading="lazy"></div>
    </div>
  </section>

  <section class="section" id="sobre-mi">
    <div class="narrow">
      <div class="script">Sobre mí</div>
      {''.join(f'<p>{e(p)}</p>' for p in d['about'])}
      <a href="#contacto" class="button go"><span>Hablemos de tu marca</span><span class="button_line"></span></a>
    </div>
  </section>

  <section class="works" id="trabajo">
    <div class="works__head section">
      <div class="script">Portafolio</div>
      <h2>{e(d['works_title'][0])} <span class="alt">{e(d['works_title'][1])}</span></h2>
      <p>{e(d['works_sub'])}</p>
    </div>
    <div class="columns">{''.join(column(c) for c in range(COLS))}</div>
  </section>

  <section class="section" id="nichos">
    <div class="split">
      <div class="content">
        <div class="script">{e(d['niches_script'])}</div>
        <h2>{e(d['niches_title'][0])} <span class="alt">{e(d['niches_title'][1])}</span> {e(d['niches_title'][2])}</h2>
        <ul class="niches">{''.join(f'<li>{e(n)}</li>' for n in d['niches'])}</ul>
      </div>
      <div class="image-frame_featured"><img class="image-inner parallax" src="{m['feat']}" alt="" loading="lazy"></div>
    </div>
  </section>

  <section class="section">
    <div class="composition">
      <div class="image-frame" style="aspect-ratio:4/3"><img class="image-inner" src="{m['c1']}" alt="" loading="lazy"></div>
      <div class="image-frame"><img class="image-inner" src="{m['c2']}" alt="" loading="lazy"></div>
    </div>
  </section>

  <section class="image-section" id="marcas">
    <img class="hero-image_inner" src="{m['wide']}" alt="" loading="lazy">
    <div class="overlay_soft"></div>
    <div class="content">
      <div class="script">{e(d['brands_script'])}</div>
      <h2>{e(d['brands_title'][0])} <span class="alt">{e(d['brands_title'][1])}</span></h2>
      <ul class="brands">{''.join(f'<li>{e(b)}</li>' for b in d['brands'])}</ul>
    </div>
  </section>

  <section class="section quotes">
    <h2>{e(d['quotes_title'][0])} <span class="alt">{e(d['quotes_title'][1])}</span></h2>
    <div class="quotes__list">{''.join(f'<figure class="quote"><blockquote>“{e(q)}”</blockquote><figcaption>{e(a)}</figcaption></figure>' for q, a in d['quotes'])}</div>
  </section>
</main>

<footer class="footer" id="contacto">
  <div class="footer-top">
    <div class="script">Hagamos algo juntas</div>
    <h2>Cuéntame de tu marca <span class="alt">y lo que necesitas</span></h2>
    <div class="footer-actions">
      <a class="pill pill--light" href="mailto:{e(d['email'])}">{e(d['email'])}</a>
      <a class="pill" href="{d['whatsapp']}" target="_blank" rel="noopener">Escríbeme por WhatsApp</a>
    </div>
  </div>
  <div class="footer-body">
    <div class="footer-col"><div class="label">Contacto</div><a class="footer-link" href="mailto:{e(d['email'])}">{e(d['email'])}<span class="button_line-alt"></span></a></div>
    <div class="footer-col"><div class="label">Social</div>{''.join(f'<a class="footer-link" href="{u}" target="_blank" rel="noopener">{e(n)}<span class="button_line-alt"></span></a>' for n, u in d['socials'])}</div>
    <div class="footer-col"><div class="label">Páginas</div>{''.join(f'<a class="footer-link go" href="#{i}">{e(t)}<span class="button_line-alt"></span></a>' for i, t in nav[1:5])}</div>
  </div>
  <p class="footer-name">{e(d['name'])}</p>
  <div class="footer-bottom">© 2026 {e(d['name'])} · Plantilla UGC de We Are Miiles</div>
</footer>

<script src="js/gsap.min.js?v=3.13"></script>
<script src="js/ScrollTrigger.min.js?v=3.13"></script>
<script src="js/lenis.min.js?v=1"></script>
<script>window.__v = "{V_JS}"</script>
<script src="main.js?v={V_JS}"></script>
</body>
</html>
"""
import re
# También las fotos y videos llevan versión por contenido, así un cambio de foto con el mismo nombre se ve al instante
page = re.sub(r'(media/[\w.-]+\.(?:jpg|png|webp|mp4))(?=[\'")\s])', lambda mm: f"{mm.group(1)}?v={ver(mm.group(1))}", page)
open(OUT, "w").write(page)
print("ok", len(page))
