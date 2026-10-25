# Hero de puntos (AREA 17)

Referencia: https://area17-award-winning-rebuild.webflow.io/ (copia del original en `original/`).

Primera sección a pantalla completa con dos capas. La de atrás (fondo oscuro con un texto) se ve normal y la de enfrente (foto de la creadora con su nombre) aparece a través de una cuadrícula de círculos que crecen y se encogen en ola, en bucle.

- El original usa Paper.js; esta versión es canvas 2D + GSAP (`gsap.min.js`), sin más dependencias.
- Se configura con atributos en la sección: `data-back-text`, `data-front-text`, `data-front-img`, `data-cols` (14) y `data-cols-mobile` (7).
- Los colores salen de las variables `--back`, `--back-ink` y `--front-ink`.
- El canvas es decorativo: el `h1` real va oculto para lectores de pantalla.
- Con movimiento reducido los círculos se quedan quietos a la mitad.
