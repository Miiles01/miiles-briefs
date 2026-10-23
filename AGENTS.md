# Reglas de Diseño y Estructura — WeAreMiiles

## Welth Catriz Font Usage
- **PROHIBIDO DENTRO DEL CUESTIONARIO:** La tipografía Welth Catriz **NUNCA** debe usarse dentro de las preguntas, títulos de preguntas, subtítulos, opciones o inputs del cuestionario. Todo el runner de preguntas debe usar tipografía sans-serif limpia (Poppins / Inter).
- **Uso Exclusivo:** Welth Catriz se utilizará **únicamente** en páginas informativas / portadas / catálogo / landing para resaltar 1 o 2 palabras clave en títulos (h1 y h2).
- Siempre agregar `padding` u `overflow: visible;` para evitar recortes (clipping) en los bordes de la cursiva.

## No Textos en Pura Mayúscula
- **NUNCA** utilices textos en mayúsculas sostenidas completas (evitar clases CSS `uppercase` o textos escritos en bloque mayúsculo). Usa siempre Sentence case (Capitalización natural) o Title case suave con tipografía limpia.

## Cero Dividers / Sin Líneas Separadoras
- **NUNCA** utilices dividers, elementos `<hr>`, líneas separadoras, `border-b` o `border-t` divisorios entre secciones o tarjetas.
- El espacio en blanco limpio (`margin`, `padding`, `gap`) es el único separador de jerarquía permitido.

## Ilustraciones y Dark Mode
- Al integrar ilustraciones que tengan fondos transparentes, asegúrate de que el contenedor o forma que las sostiene tenga un color de fondo definido (por ejemplo, blanco en modo claro y negro en modo oscuro).

## Portafolios UGC: hero sin CTAs
- En los portafolios UGC **no** se ponen botones tipo "Ver mi trabajo" / "Contáctame" debajo del texto del hero. El hero lleva solo titular, párrafo corto y redes; el contacto vive en el navbar y en la sección final.
- Excepción pedida para Diana (V16): el hero lleva botones de contacto directo (WhatsApp y copiar correo). Nunca "Ver mi trabajo".

## Portafolios UGC: menú hamburguesa
- Cuando el navbar sea de menú hamburguesa, el menú se abre como panel a **media pantalla** (desde un lado, con el resto oscurecido) y con un botón visible de **Cerrar**. Nunca a pantalla completa.
- Con menú hamburguesa el navbar va **sin fondo**: solo flotan el logo y el botón.

## Portafolios UGC en Lovable (dominios)
- V10 → repo Miiles01/rotate-display → https://ugc10.lovable.app/
- V11 → repo Miiles01/media-portfolio-garden → https://ugc11.lovable.app/
- V12 → repo Miiles01/portfolio-painter-43 → https://ugc12.lovable.app/
- V13 → repo Miiles01/ugc13 → publicado estático en https://wearemiiles.com/ugc-v13/ (public/ugc-v13). Se compila como SPA con un vite.config aparte (React + Tailwind, alias @ → ugc13/src, base /ugc-v13/, la foto del hero de Lovable se sirve desde media/portada-laura.jpg); tras cambiar ugc13 hay que recompilar y volver a copiar.
- V14 → Diana (editorial en negro, cuadrícula 3D de Codrops On-Scroll Columns & Rows variación 15 en Mi trabajo, videos sin audio) → publicado estático en https://wearemiiles.com/ugc-v14/ (public/ugc-v14). Textos y fotos en tools/build-ugc-v14.py.
- V15 → Diana en rosa con texto negro, estructura y animaciones de minimal-goods.webflow.io (logo que se encoge al nav, titular enmascarado, círculo que crece, tema rosa/negro, título fijo del grid, parallax) → publicado estático en https://wearemiiles.com/ugc-v15/ (public/ugc-v15, un solo index.html).
- V16 → Diana en negro con rosa, estructura tipo "Nuno Space" (logo que se encoge, titular enmascarado, círculo sticky, reveal con blur, galería Swiper con cursor "arrastra", cortina rosa, texto gigante sólido en movimiento, popup FLIP de campañas tamaño reel, paquetes con tilt 3D, cambio de tema negro → rosa) → publicado estático en https://wearemiiles.com/ugc-v16/ (public/ugc-v16, un solo index.html; librerías en js/).
- Recursos para más adelante: https://ruben-menu.webflow.io/ (título animado, mención honorífica).
- Referencias (no publicadas, componentes para reutilizar): referencias/dsgn-interior (slider vertical paralaje + SplitText) y referencias/paul-kalkbrenner (animaciones analógicas + sintetizador Web Audio).
- Se trabaja en `main` de cada repo (Lovable sincroniza solo); el sitio público se actualiza cuando se da Publish en Lovable.
