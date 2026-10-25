# Subrayado a mano para el navbar (Osmo)

Referencia: https://osmo-draw-random-underline-drawsvg.webflow.io/ (Osmo Nr.015, copia del original en `original/`).

Cada link del navbar dibuja un subrayado a mano al pasar el mouse; cada hover usa la siguiente de 6 variantes (empieza en una al azar) y al salir la línea se borra hacia la derecha.

- Necesita `gsap.min.js` y `DrawSVGPlugin.min.js` (gratis desde GSAP 3.13; versión 3.15 incluida aquí).
- Marcado: `<a data-draw-line class="text-draw"><span class="text-draw__p">Texto</span><span data-draw-line-box class="text-draw__box"></span></a>`.
- El color de la línea sale de `--line` (se pinta con `currentColor` en `.text-draw__box`).
- Solo aplica con mouse; en celular el menú sigue siendo el panel a media pantalla.
