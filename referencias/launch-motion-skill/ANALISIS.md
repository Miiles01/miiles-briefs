# Análisis del video de lanzamiento de Sanji (Higgsfield) · lo que aplica a Miiles

Fuente: https://claude.ai/artifact/3C5B127GxpQsjGXA4JdKrr (doc de Manuel, 2026-11-08) y el blog de @sanjii en Higgsfield.

## Lo que no viene en el SKILL.md
- **Frames exactos por escena**: 240 · 420 · 480 · 360 · 300 = 1800 a 60 fps. Con frames fijos, Claude no puede reordenar ni alargar las escenas.
- **Un solo número cuenta la historia**: el contador sube de 0 a 200 en rojo (dolor) y luego baja a 0 (alivio). Se entiende sin voz en off.
- **La cámara cambia con la emoción**:
  - push-in en la tensión;
  - sigue al cursor en el caos;
  - zoom al 130 % en el clic que lo resuelve;
  - pull-back en el alivio.
- **Cinco fixes del primer render** (vienen en el checklist):
  1. fijar el canvas y posicionar desde el centro;
  2. cargar la fuente antes de renderizar;
  3. count-up de ~1 s;
  4. tarjetas escalonadas;
  5. cámara con easy ease.
- **Cinco toques de polish**:
  1. brillo en el contador;
  2. el cursor duda ~1 s;
  3. pulso de la tarjeta al empezar;
  4. checks en cascada;
  5. pull-back al final.
- **Revisión = cambiar una variable** (200 → 999) y volver a renderizar.
- **Prompt "Recreate Everything"**: hace todo de una vez (brief, storyboard, build con fixes y polish). Luego renderiza un still por escena para detectar encimados y exporta 16:9, 9:16 y 1:1.
- **Venderlo como servicio (Upwork)**:
  - Abre con 2 líneas sobre el producto del cliente.
  - Propone un concepto de 30 s en tres bloques: 0–5 s, 5–20 s y 20–30 s.
  - Primer milestone: solo storyboard y styleframes.
  - Filtros: pago verificado, más de $10K gastados, más de 50 % de contratación, menos de 30 min publicado, menos de 15 propuestas.

## Cómo usarlo en Miiles
1. **Video de Product Hunt de miiles.app**
   - El contador como hilo: "Horas armando tu portafolio" sube y luego baja a "0 · listo en minutos".
   - Las escenas usan nuestros componentes ya aprobados como "UI en acción": Text Roll, Tilt Wheel, Hinge Stack, etc.
2. **Escenas / Creator Kit (9:16)**
   - Cada componente de la galería expone sus frames y props como en el storyboard.
   - El prompt de miiles.app puede adoptar la estructura del "Recreate Everything": brief → storyboard → build → still por escena → mp4.
3. **Checklist de los 5 fixes en buildComponentPrompt**: canvas fijo, fuente cargada con delayRender, sin saltos de un frame y escalonado. Ya cumplimos casi todo; falta pedir el "still por escena".
4. **Servicio para creadores UGC**: el pitch de Upwork sirve tal cual como plantilla de propuesta para las creadoras que usen Miiles.
