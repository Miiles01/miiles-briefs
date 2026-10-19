# Prompt para Lovable — nuevas versiones del portafolio UGC

Copia todo lo que está debajo de la línea y pégalo en Lovable. Antes de enviarlo, cambia `[PLANTILLA]` por el link o las capturas de la plantilla que toque, y `[N]` por el número de versión.

---

Crea la versión [N] de una plantilla de portafolio para una creadora de contenido UGC.

## Qué vamos a hacer y para qué
- Es una **landing page de una sola página**: el portafolio de una creadora de contenido UGC (videos y fotos para marcas de belleza, moda y bienestar).
- **Objetivo:** que una marca que llega a la página entienda en segundos quién es la creadora, en qué nichos trabaja y qué tipo de contenido hace, vea su trabajo, confíe en ella (marcas y testimonios) y la contacte o la siga en redes. Todo empuja al contacto.
- Es una **plantilla**: sacamos varias versiones con distintos diseños y el mismo contenido. Úsalas de referencia de contenido y calidad (no de diseño):
  - V2: https://wearemiiles.com/ugc-v2/
  - V3: https://wearemiiles.com/ugc-v3/
  - V4: https://wearemiiles.com/ugc-v4/ (la más completa: carrusel de reels, nichos, redes destacadas)

## De dónde sale todo
- **Reglas de diseño:** repositorio de ideas en GitHub → https://github.com/Miiles01/ideas (lee `DESIGN_RULES.md` y `AI_CONTEXT.md` y síguelos).
- **Imágenes, videos, logos y avatares:** repositorio UGC → https://github.com/Miiles01/UGC, carpeta `public/` (`hero/`, `creadora/`, `collabs/`, `avatares/`). Ya están optimizados y publicados en las URLs de "Medios": úsalas directamente.
- **Copy y testimonios:** los de este prompt.
- **Destino final:** wearemiiles.com/ugc-v[N], desde el repo https://github.com/Miiles01/miiles-briefs.

## Base de diseño
- Usa esta plantilla como base y respeta su layout, espaciados, proporciones, colores y **sus tipografías** (no metas otras fuentes): [PLANTILLA]
- No inventes un diseño propio: adapta la plantilla al contenido de abajo. Las secciones que la plantilla no tenga (nichos, carrusel, redes) diséñalas con el mismo lenguaje visual de la plantilla.

## Estructura (una sola página)
- Solo el home. Navbar con links por ancla a cada sección y scroll suave. En móvil, botón "Menú" que abre un menú a pantalla completa y se cierra al elegir una sección. El orden del navbar sigue el orden de la página.
- Orden de secciones:
  1. **Hero:** "Laura" + "Creadora de contenido UGC para marcas de belleza, moda y bienestar" + foto principal + botones "Ver mi trabajo" y "Contáctame" + links a Instagram, TikTok y YouTube.
  2. **Marcas que confiaron en mí** (logos). SIEMPRE en la posición 2 o 3, nunca más abajo.
  3. **Contenido:** un **carrusel de reels** con 9 piezas verticales 9:16 (4 videos y 5 fotos) con título y tipo. Se mueve con flechas, arrastrando con el mouse y con swipe en móvil, con barra de progreso. Los videos se reproducen en silencio solo cuando están en pantalla; al dar clic se abre un visor grande (video con sonido y controles), que se cierra con Esc o clic afuera.
  4. **Nichos y contenido:** "Nichos en los que trabajo" y "Qué tipo de contenido hago", cada uno con un ejemplo (abajo).
  5. **Sobre mí:** 2 párrafos cortos + 1 a 3 fotos.
  6. **Testimonios:** los 6 de abajo, con foto, cargo y empresa.
  7. **Contacto + Mis redes:** título "Hagamos algo juntas", email, WhatsApp y botones grandes de redes (Instagram, TikTok, YouTube) con su usuario. Las redes deben resaltar.
- Solo lo esencial de un portafolio UGC. No agregues precios, paquetes, FAQ, blog, métricas ni datos inventados.

## Animaciones (parte clave)
La página tiene que sentirse viva y premium, sin exagerar:
- **Smooth scroll** en toda la página (GSAP ScrollSmoother o Lenis).
- **Entrada del hero** al cargar, escalonada: título letra por letra o por palabras, luego texto, botones e imagen.
- **Texto:** títulos y párrafos se revelan por palabras o líneas con máscara (suben y aparecen) al entrar en pantalla.
- **Imágenes:** se descubren como cortina con un leve zoom-out; una imagen grande puede arrancar al 50% del ancho y crecer al ancho completo con el scroll (scrub); parallax suave; zoom ligero al pasar el mouse.
- **Scroll:** secciones, logos y tarjetas entran con fade + leve subida, escalonados.
- Microinteracciones en botones y links (hover y click), duraciones de 250 a 500 ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Respeta `prefers-reduced-motion`: sin animaciones si el usuario lo pide.

## Reglas de diseño (obligatorias)
- Todo el copy en español.
- Nada de textos en MAYÚSCULAS sostenidas, aunque la plantilla original las use: mayúscula inicial normal.
- Cero divisores: sin `<hr>` ni `border-top`/`border-bottom` entre secciones o tarjetas; separa con espacio en blanco.
- Los títulos nunca se cortan ni quedan una palabra por línea ("Marcas / que / confiaron / en / mí" está mal). Deja espacio para descendentes (g, j, p, q) y cursivas dentro de las máscaras de animación.
- Las filas de un grid deben crecer con su contenido: ningún texto puede encimarse sobre otro texto ni sobre una imagen que no le corresponde.

## Control de calidad antes de entregar
Revisa a **375, 768, 1024, 1440 y 1920 px** de ancho y confirma en cada uno:
- No hay scroll horizontal ni textos que se salgan de la pantalla.
- Ningún texto choca con otro ni queda tapado por una imagen.
- Ningún título queda de una palabra por línea.
- El navbar cabe sin encimarse con el logo (si no cabe, pasa al botón "Menú").
- El carrusel, el visor y el menú móvil funcionan.

## Copy
- **Hero:** "Laura" / "Creadora de contenido UGC para marcas de belleza, moda y bienestar". Párrafo: "Soy Laura. Hago videos y fotos que se sienten como la recomendación de una amiga: reales, cercanos y pensados para que tu producto se vea en uso."
- **Marcas:** "Marcas que confiaron en mí".
- **Carrusel (título · tipo):** Rutina de cuidado · Reel · Belleza / Ropa deportiva · Foto · Moda / Primeras impresiones · Reel · Lifestyle / Entrenamiento · Foto · Bienestar / Reseña honesta · Reel · Producto / Día al aire libre · Foto · Lifestyle / Unboxing · Reel · Producto / Retrato natural · Foto · Belleza / Selfie de producto · Foto · UGC.
- **Nichos en los que trabajo:**
  - Belleza y skincare: rutinas, texturas, antes y después y primeras impresiones.
  - Moda: try-on hauls, outfits y cómo combinar una prenda.
  - Bienestar y fitness: entrenamientos, suplementos y hábitos diarios.
  - Lifestyle y hogar: mi día a día, productos en casa y momentos reales.
- **Qué tipo de contenido hago (con ejemplo):**
  - Videos UGC para anuncios. Ej.: hook en 3 segundos, problema, solución y llamada a la acción.
  - Unboxing. Ej.: abro tu producto y muestro cada detalle por primera vez.
  - Reseñas y testimoniales. Ej.: opinión honesta a cámara, como recomendación de amiga.
  - Tutoriales. Ej.: paso a paso de cómo se usa tu producto.
  - Fotografía de producto. Ej.: fotos lifestyle con el producto en uso.
- **Sobre mí:**
  - "Me encargo de todo: idea, guion, grabación y edición en formato vertical, listo para publicar en TikTok, Reels o anuncios."
  - "Trabajo con marcas de belleza, moda y bienestar que buscan contenido honesto que genere confianza y ventas."
- **Testimonios** (título "Lo que dicen de mí"):
  1. "Laura entendió la visión de nuestra marca desde el primer momento. El contenido superó nuestras expectativas." — Directora de Marketing, Tech Innovators
  2. "Su capacidad para contar historias a través de la fotografía es única. Cada proyecto es un éxito garantizado." — Fundador, Artisan Coffee Co.
  3. "El nivel de atención al detalle que Laura le puso a nuestra última campaña fue increíble." — Directora de Arte, Fashion Forward
  4. "Logró capturar la esencia de lo que somos en cada toma. Es una verdadera profesional." — CEO, Eco Beauty
  5. "Transformó por completo la manera en la que nuestra audiencia nos percibe visualmente." — Brand Manager, Luxe Events
  6. "Una creatividad desbordante y una técnica impecable. Sus fotos hablan por sí solas." — Editor en Jefe, Revista Estilo
- **Contacto:** "Hagamos algo juntas" / "Cuéntame de tu marca y de lo que necesitas. Te respondo en menos de 24 horas." / hola@lauracreativa.com.
- **Mis redes** (links de relleno por ahora): Instagram @laura.ugc → https://instagram.com · TikTok @laura.ugc → https://tiktok.com · YouTube @laura.ugc → https://youtube.com · WhatsApp "Escríbeme directo" → https://wa.me/
- **Footer:** "© 2026 Laura · Plantilla UGC de We Are Miiles".

## Medios (usa estas URLs tal cual)
Base: `https://wearemiiles.com/ugc-v4/media/`

- Foto horizontal (portada a sangre): `portada.jpg`
- Retrato principal (hero): `hero.jpg`
- Sobre mí: `sobre-mi.jpg`
- Videos verticales: `video-1.mp4`, `video-2.mp4`, `video-3.mp4`, `video-4.mp4`
- Fotos verticales: `foto-1.jpg`, `foto-2.jpg`, `foto-3.jpg`, `foto-4.jpg`, `foto-5.jpg`
- Avatares de testimonios (en orden): `testimonios/persona-1.jpg` … `testimonios/persona-6.jpg`
- Logos (SVG, mostrarlos en un solo color de la paleta): `marcas/adidas-13.svg`, `marcas/chanel-2.svg`, `marcas/dji-1.svg`, `marcas/loreal.svg`, `marcas/la-roche-posay.svg`, `marcas/samsung-8.svg`, `marcas/spotify-logo.svg`, `marcas/vichy-laboratoires.svg`, `marcas/zoah-1.svg`, `marcas/zara.svg`, `marcas/vogue.svg`, `marcas/versace.svg`, `marcas/pull-bear-2.svg`, `marcas/bershka-1.svg`, `marcas/shein.svg`

## Entrega
- Todo el contenido (textos, medios, testimonios, marcas, nichos, redes) en un solo archivo de datos, para crear otra versión cambiando solo ese archivo.
- Sin backend ni base de datos: debe poder exportarse como sitio estático (HTML/CSS/JS).
- Conecta el proyecto a GitHub para que yo lo publique en wearemiiles.com/ugc-v[N].
