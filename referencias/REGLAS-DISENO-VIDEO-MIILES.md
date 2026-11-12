# Reglas de diseño de video Miiles

Guía reusable para ediciones verticales UGC creadas con Remotion y los componentes de Miiles.

## Formato y composición

- Lienzo 9:16, 1080 × 1920 px, 30 fps salvo que el destino pida otra cosa.
- Preferir fondos claros y paleta Miiles suave. El texto gráfico va en negro; no usar texto azul.
- Usar Manrope para captions, explicaciones y texto de lectura. Reservar Advercase para frases cortas y palabras sin tilde; escribir en Manrope cualquier palabra acentuada.
- Evitar frases en mayúsculas sostenidas si no son una decisión visual deliberada.
- La pantalla dividida debe ser exactamente 50/50: 960 px arriba y 960 px abajo. Comprobar el seam en el render final.
- Alternar pantalla completa y pantalla dividida según la pieza. No dividir todo el video por sistema.
- En una pantalla dividida, ubicar el texto en la zona central. Para captions sobre el seam, usar una caja blanca con texto negro.

## Captions y zona segura

- Mantener captions cerca del centro, un poco por debajo del centro y debajo del rostro. Evitar las áreas superiores e inferiores usadas por la interfaz de Reels, Shorts y TikTok.
- Mantener títulos, captions y frases clave en ventanas de tiempo separadas: nunca deben aparecer dos textos con mensajes distintos a la vez.
- Nunca poner texto sobre carruseles o animaciones de tarjetas; dejar esos momentos limpios.
- Evitar titulares fijos independientes. La narrativa textual vive en los captions, y una frase clave puede crecer tipográficamente dentro del propio caption.
- Las frases clave deben tener jerarquía y tamaño claramente mayores que los captions; usar una sola frase clave por momento.
- Respetar una zona segura vertical para la interfaz de redes: no colocar texto en la franja superior de perfil ni en la franja inferior de descripción, audio y botones.
- Cada línea de caption debe tener tres palabras, con tamaño legible. Puede variar el número de líneas entre captions; las piezas de una palabra requieren una dirección creativa específica.
- En pantalla completa no usar caja de fondo para captions ni frases clave. Elegir texto blanco o negro según el contraste, con una sombra discreta solo cuando haga falta. Las frases clave pueden ir directamente sobre la imagen o integrarse detrás de la persona con recorte; no llevan banner.
- Verificar que el caption no cubra ojos, boca, manos importantes ni elementos de producto.

## Texto detrás de la persona

- Orden de capas: video base, texto animado y video de la persona con alpha por encima.
- Para sujetos humanos, usar `@remotion/video-matting` con el modelo `modnet`; generar las capas una vez y reutilizarlas, no ejecutar el modelo por cada frame del render.
- Alinear exactamente origen, duración, encuadre, tamaño y velocidad de ambas capas.
- El texto debe quedar detrás del rostro y el cuerpo en primer plano. Mantenerlo fuera de rasgos faciales y revisar pelo, manos y bordes en movimiento.
- Se permite una frase grande blanca con `mix-blend-mode: difference` como recurso expresivo sobre el video; usarla de manera puntual y preservar la legibilidad del sujeto.
- Para una dirección más calmada, puede aparecer una sola palabra grande por caption. Dejarla visible alrededor de 2 segundos, mantenerla debajo del rostro y evitar cajas de fondo.
- Las imágenes de apoyo entran de forma ocasional, arriba o a los lados de la creadora, sin tapar ojos, boca ni manos.

## Revisión y galería

- Todo video de revisión se reproduce en silencio. El reproductor completo conserva controles visibles; las miniaturas de componentes se reproducen al pasar el cursor o tocar.
- Los componentes se reproducen al pasar el cursor; en pantallas táctiles se reproducen al tocar y paran al soltar.
- Antes de entregar, revisar fotogramas de inicio, cambios de escena, seam, captions, efecto de recorte y cierre.
- Confirmar que caras, manos y texto no se corten, que el split sea 50/50, que los bordes de la máscara se vean naturales y que el archivo no tenga pista de audio.

## Flujo técnico para el recorte

En `remotion/scripts/matte-video.mjs` se genera la pareja de WebM con alpha del material fuente. El comando espera un entorno local con WebGPU compatible:

```sh
node scripts/matte-video.mjs public/ugc-template-raw.mp4 public/ugc-template-base.webm public/ugc-template-foreground.webm
```

La composición coloca la frase entre el video base y la capa foreground. Los archivos generados pueden ser pesados; mantenerlos fuera de Git si el repositorio ya ignora los medios derivados.

## Guion y voz

- Partir del mensaje y la secuencia del video de referencia; parafrasear en el idioma de la edición y conservar el sentido.
- Escribir como habla la creadora: frases naturales, cortas y conversacionales. Ajustar el texto y el ritmo a su voz; no imponer copy publicitario genérico.
