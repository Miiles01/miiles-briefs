# Reglas de Diseño y Estructura — WeAreMiiles

## Welth Catriz Font Usage
- **PROHIBIDO DENTRO DEL CUESTIONARIO:** La tipografía Welth Catriz **NUNCA** debe usarse dentro de las preguntas, títulos de preguntas, subtítulos, opciones o inputs del cuestionario. Todo el runner de preguntas debe usar tipografía sans-serif limpia (Poppins / Inter).
- **Uso Exclusivo:** Welth Catriz se utilizará **únicamente** en páginas informativas / portadas / catálogo / landing para resaltar 1 o 2 palabras clave en títulos (h1 y h2).
- Siempre agregar `padding` u `overflow: visible;` para evitar recortes (clipping) en los bordes de la cursiva.

## No Textos en Pura Mayúscula
- **NUNCA** utilices textos en mayúsculas sostenidas completas (evitar clases CSS `uppercase` o textos escritos en bloque mayúsculo). Usa siempre Sentence case (Capitalización natural) o Title case suave con tipografía limpia.

## Títulos sin punto final
- Los títulos y frases destacadas (h1, h2, titulares de hero) **no** llevan punto final.

## Cero Dividers / Sin Líneas Separadoras
- **NUNCA** utilices dividers, elementos `<hr>`, líneas separadoras, `border-b` o `border-t` divisorios entre secciones o tarjetas.
- El espacio en blanco limpio (`margin`, `padding`, `gap`) es el único separador de jerarquía permitido.

## Ilustraciones y Dark Mode
- Al integrar ilustraciones que tengan fondos transparentes, asegúrate de que el contenedor o forma que las sostiene tenga un color de fondo definido (por ejemplo, blanco en modo claro y negro en modo oscuro).

## Portafolios UGC: hero sin CTAs
- En los portafolios UGC **no** se ponen botones tipo "Ver mi trabajo" / "Contáctame" debajo del texto del hero. El hero lleva solo titular, párrafo corto y redes; el contacto vive en el navbar y en la sección final.

## Portafolios UGC: secciones obligatorias
- Toda plantilla UGC, aunque la referencia no las traiga, lleva: hero con números (seguidores, marcas, videos), **Mi trabajo** (piezas en formato reel/foto), **Marcas con las que he colaborado** (con logotipos de `public/ugc-v2/media/marcas/`), **Nichos**, **Sobre mí**, **Testimonios**, un **CTA a mitad de página** (WhatsApp) y **contacto con botones** (WhatsApp, copiar correo) unido al footer.

## Portafolios UGC: reseñas sin estrellas
- **NUNCA** poner estrellas (★★★★★) ni calificaciones en los testimonios. La reseña lleva logo de la marca, texto y quién la escribe.

## Portafolios UGC: contacto sin formularios
- **NUNCA** poner formularios en la sección de contacto. Solo datos de contacto (correo, WhatsApp, redes) y botones directos (WhatsApp, copiar correo).

## Portafolios UGC: menú hamburguesa
- Cuando el navbar sea de menú hamburguesa, el menú se abre como panel a **media pantalla** (desde un lado, con el resto oscurecido) y con un botón visible de **Cerrar**. Nunca a pantalla completa.
- Con menú hamburguesa el navbar va **sin fondo**: solo flotan el logo y el botón.

## Portafolios UGC en Lovable (dominios)
- V10 → repo Miiles01/rotate-display → https://ugc10.lovable.app/
- V11 → repo Miiles01/media-portfolio-garden → https://ugc11.lovable.app/
- V12 → repo Miiles01/portfolio-painter-43 → https://ugc12.lovable.app/
- V13 → repo Miiles01/ugc13 → publicado estático en https://wearemiiles.com/ugc-v13/ (public/ugc-v13). Se compila como SPA con un vite.config aparte (React + Tailwind, alias @ → ugc13/src, base /ugc-v13/, la foto del hero de Lovable se sirve desde media/portada-laura.jpg); tras cambiar ugc13 hay que recompilar y volver a copiar.
- V14 → Diana (editorial en negro, cuadrícula 3D de Codrops On-Scroll Columns & Rows variación 15 en Mi trabajo, videos sin audio, estadísticas de dos en dos y fondo del footer con el efecto de puntos negro/azul de AREA 17 en dots.js; el azul solo se usa en el menú y en ese efecto) → publicado estático en https://wearemiiles.com/ugc-v14/ (public/ugc-v14). Textos y fotos en tools/build-ugc-v14.py.
- V15 → Diana en rosa con texto negro, estructura y animaciones de minimal-goods.webflow.io (logo que se encoge al nav, titular enmascarado, círculo que crece, tema rosa/negro, título fijo del grid, parallax) → publicado estático en https://wearemiiles.com/ugc-v15/ (public/ugc-v15, un solo index.html).
- V16 → Diana en negro con rosa, estructura tipo "Nuno Space" (logo que se encoge, titular enmascarado, círculo sticky, reveal con blur, galería Swiper con cursor "arrastra", cortina rosa, texto gigante sólido en movimiento, popup FLIP de campañas tamaño reel, paquetes con tilt 3D, cambio de tema negro → rosa) → publicado estático en https://wearemiiles.com/ugc-v16/ (public/ugc-v16, un solo index.html; librerías en js/).
- V17 → Diana en blanco y azul cielo con texto negro (sin naranja): hero tipo "Brand Brain" con título gigante "Diana UGC", carrusel de tarjetas tech (notas, guion, kit de marca, archivo .mp4, métricas, entrega, voz en off y fotos) detrás de la foto de Diana sin fondo (media/modelo.webp, recorte que mandó el usuario), fondo de la página que cambia blanco ↔ azul entre secciones con el scroll, slider Splide con olas y piezas en formato reel 9:16 sin etiquetas, menú tipo cortina desde la derecha (oculto en el hero), íconos de trazo grueso y acentos verde/rosa en estadísticas, sobre mí, nichos, testimonios con logo y contacto → publicado estático en https://wearemiiles.com/ugc-v17/ (public/ugc-v17).
- V18 → Carolina (nuevo modelo), estructura editorial de "Editorial — Em Design" (sin loader, sin marquee): hero serif amarillo en 3 filas sobre foto oscura, navbar en cápsula blanca con píldora amarilla que se desliza, columnas con cortina, círculo que gira, animaciones de scroll de V5 con GSAP (palabras que suben desde máscara, frases que se encienden, fotos con cortina + zoom + parallax, filas que derivan, barra de progreso, botones magnéticos); navbar sin play ni contador; Sobre mí ordenado (texto con el círculo Hablemos a la derecha, foto de las cabras a todo el ancho con revelado fijo tipo footer —en móvil foto normal—, frase y tres fotos iguales); testimonios en negro como tarjetas de reseña; fondo que cambia de color con el scroll sin cortes → publicado estático en https://wearemiiles.com/ugc-v18/ (public/ugc-v18). Fotos de Carolina en media/ (Modelo 3).
- V19 → Carolina en crema, coral y lila, estructura y animaciones de gsap-flip-tutorial.webflow.io (GSAP Flip): fotos apiladas que crecen y vuelan a la fila del hero, menú en cápsula con forma que se desliza, reels que se abren en grande, tarjetas de nichos que se expanden al pasar el mouse, foto chica que viaja al marco grande en Sobre mí y testimonios que se reacomodan → publicado estático en https://wearemiiles.com/ugc-v19/ (public/ugc-v19; librerías en js/).
- V20 → Laura (fotos y videos de ugc-v4 y ugc-v13) en gris oscuro con lavanda, estructura y animaciones de velocity-tricks.webflow.io: titular en dos filas cruzadas, slider infinito Splide que se encoge con la velocidad del arrastre, lista de nichos con foto que sigue al cursor y se inclina con su velocidad, cuadrícula de reels que entra con fade (sin efecto de torcido) y footer que se revela debajo → publicado estático en https://wearemiiles.com/ugc-v20/ (public/ugc-v20; librerías en js/).
- V21 → Laura en crema y dorado, estructura y animaciones de nf-daily-02.webflow.io: foto fija de fondo (sin la foto del pasto, que es de baja calidad) con el nombre gigante, tarjeta que sube y crece hasta llenar la pantalla, paso horizontal a Mi trabajo (solo tablet y desktop) con foto de Laura, secciones con ventanas a la foto de fondo que cambia por sección, menú hamburguesa con el subrayado a mano de referencias/navbar-subrayado-osmo. Sin rótulos de capítulos. Fuentes: General Sans (la de la referencia) y Gloock en lugar de Cobya, que es de pago → publicado estático en https://wearemiiles.com/ugc-v21/ (public/ugc-v21; librerías en js/).
- V22 → Diana (fotos de montaña, banca, lancha, lirios y cabras + videos de V17) en crema, amarillo #fbec6a, oliva #7e6b00 y casi negro; títulos en Gambarino (Fontshare, licencia libre, fonts/) con las letras casi juntas (−5 a −7.5%) y texto en Satoshi; estructura editorial propia: hero "Porta | folio" partido con una pantalla tipo celular al centro que con el scroll (pin) crece, cambia de fotos, separa las palabras (izquierda arriba, derecha abajo) y abre un moodboard de fotos y tarjetas UI alrededor (referencia Pinterest 311452130503859453), presentación con estadísticas, reels 9:16, Sobre mí, foto de las cabras con revelado fijo (en móvil foto normal), marcas, nichos con palabras gigantes que pasan, testimonios con logo, contacto con botones; fondo que cambia crema ↔ amarillo ↔ negro con el scroll; menú hamburguesa a media pantalla que se desliza → publicado estático en https://wearemiiles.com/ugc-v22/ (public/ugc-v22). Advercase no se usó: la versión gratis es demo (sin acentos, con marca de agua).
- V23 → Diana "Studio", variante de V22 con estilo de app de diseño: blanco y negro con acentos lima/naranja/azul/violeta/amarillo, cuadrícula y guías visibles, regla, selección con manijas y etiqueta de tamaño, cursores con nombre que se mueven (solo desktop), celda resaltada al pasar el mouse; hero en cuadrícula con fotos, video y colores alrededor de "Diana UGC" (estilo Medium Day); barra de herramientas flotante abajo como menú (en móvil abre panel lateral); números en celdas; Mi trabajo en marcos con nombre; Sobre mí con fotos dentro del texto y palabras que se colorean + 4 pasos con íconos; banda artística de colores difuminados con grano y botón de WhatsApp; marcas en celdas que se colorean; nichos como panel de capas con vista previa; testimonios como comentarios; contacto en tarjetas que copian/abren. Gambarino + Manrope (Google Fonts) → publicado estático en https://wearemiiles.com/ugc-v23/ (public/ugc-v23).
- Recursos para más adelante: https://ruben-menu.webflow.io/ (título animado, mención honorífica).
- Referencias (no publicadas, componentes para reutilizar): referencias/dsgn-interior (slider vertical paralaje + SplitText) y referencias/paul-kalkbrenner (animaciones analógicas + sintetizador Web Audio).
- Componentes guardados para próximas plantillas: referencias/hero-puntos-area17 (primera sección: dos capas y cuadrícula de círculos que revela la foto de la creadora, de area17-award-winning-rebuild.webflow.io) y referencias/navbar-subrayado-osmo (links del navbar con subrayado a mano aleatorio con DrawSVG, de osmo-draw-random-underline-drawsvg.webflow.io). Cada uno tiene README y la copia del original.
- Se trabaja en `main` de cada repo (Lovable sincroniza solo); el sitio público se actualiza cuando se da Publish en Lovable.
