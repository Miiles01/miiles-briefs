# Guía de edición UGC (para ChatGPT/Codex y cualquier IA)

La edición modelo es **`remotion/src/UGCPro.tsx`** (composición `UGC-Pro` en la galería, filtro Escenas). Ábrela y léela junto con esta guía: todo lo que se describe aquí está ahí en código, con comentarios.
Antes de empezar, lee también `docs/TRASPASO-COMPONENTES.md` (sección 0: trabajo compartido) y `referencias/REGLAS-DISENO-VIDEO-MIILES.md`.

---

## 1. El orden de trabajo (no te saltes pasos)

1. **Transcribe el audio con tiempos por palabra.** Sin esto, los captions nunca van a ir a la velocidad de la voz. Inventar el texto o repartirlo "a ojo" está prohibido.
   ```bash
   S=<carpeta temporal>
   ffmpeg -i public/<video>.mp4 -ac 1 -ar 16000 $S/audio.wav
   python3 -m venv $S/venv && $S/venv/bin/pip install faster-whisper imageio-ffmpeg
   # tr.py: WhisperModel("medium", device="cpu", compute_type="int8").transcribe(audio, word_timestamps=True)
   ```
   - Revisa la transcripción a mano. Whisper se equivoca: "Gréeme" era "Créeme" y "TechUGC" se escribe "Tech UGC".
   - El resultado es la lista `PALABRAS: [texto, segundo][]`.
2. **Mira el video completo** y saca una hoja de cuadros (cada 2 s) para ver dónde está la cara, las manos y los gestos. La cara suele estar en y≈250–900 (de 1920), así que los captions van **debajo de la cara** (y≈1130).
3. **Escribe el storyboard en una tabla** antes de programar: qué dice en cada tramo → qué recurso visual va ahí (sección 3). Cada recurso tiene que **ilustrar lo que ella dice en ese momento**, no ser decoración.
4. Programa, saca **imágenes fijas de cada momento clave** (`npx remotion still … --frame=N --scale=0.4`) y revísalas antes del render completo.
5. Haz el render completo, revisa el inicio, cada cambio de escena y el final, y súbelo a la galería con `?v=` nuevo.

## 2. Captions (lo que más importa)

- **Van palabra por palabra**: cada palabra entra (rebote corto: sube 26 px, escala 0.86 → 1, `spring` con damping 13 / stiffness 190) en el cuadro exacto en que ella empieza a decirla.
- **Grupos de ~3 palabras por línea.** Un grupo se ve desde su primera palabra hasta que empieza el siguiente. **Nunca hay dos captions a la vez**, y cada grupo sale en 4 cuadros (las salidas son más rápidas que las entradas).
- Llevan el guion real, ligeramente limpio: sin comas ni puntos al final, signos de pregunta sí, y errores de dicción corregidos. No se parafrasea lo que ella dice.
- **Estilos** (campo `estilo` de cada grupo):
  | Estilo | Cuándo | Cómo se ve |
  |---|---|---|
  | `normal` | pantalla completa | Manrope 800, 68 px, blanco, sombra suave, debajo de la cara, sin caja |
  | `seam` | pantalla dividida | caja blanca, texto negro, centrada sobre la línea 50/50 (y=960). El panel de arriba es crema (#F4F3EF) para que la caja se distinga |
  | `clave` | la frase que vende | una línea chica + una **GRANDE** (118–190 px) que entra con un golpe de escala, o un **contador** que corre 0 → número en ~0.9 s |
  | `tachar` | cuando ella niega algo ("no son los influencers", "no vivo en Estados Unidos") | la palabra se tacha con una línea rosa (#FCB5B9) mientras la termina de decir |
  | `oculto` | cuando habla una animación (carrusel, texto detrás de ella) | sin caption: el tramo animado queda limpio |
- Advercase **solo** en palabras sin acento (TECH UGC, 2). Todo lo acentuado va en Manrope.
- Zona segura: el texto va entre x 130 y 950, y no baja de y≈1450 (ahí están los botones y la descripción de Reels/TikTok).

## 3. Recursos visuales (la caja de herramientas)

Úsalos **cuando el guion los pide**. En 30 s caben unos 5 o 6 momentos fuertes; entre ellos, deja respirar el video con captions normales.

| Recurso | Ejemplo en UGC-Pro | Regla |
|---|---|---|
| **Pantalla dividida 50/50** | "creadores que no tienen comunidad" → arriba un perfil con 0 seguidores. "Te pagan… no lo publicas en tus redes" → arriba tarjetas de pago (StackCards) | Arriba la animación baja en 14 cuadros y sale hacia arriba en 9. Abajo va ella, con la cara completa. Caption `seam`. Exactamente 960/960 |
| **Carrusel a pantalla completa** | "para apps y plataformas de IA" → rueda inclinada (TiltWheel) con fotos e íconos | Entra y sale con un círculo que se abre y se cierra. **Sin texto encima.** Si el componente usa la duración del video, no limites su Sequence (ver el código) |
| **Texto detrás de ella** | "¿cómo se llama? → **TECH UGC**". "hay **2** maneras" (ella hace la señal del 2) | Capas: video → texto → `ugc-template-foreground.webm` (ella recortada). El texto debe seguir **legible**: colócalo donde su cabeza solo lo toque en un borde (arriba de la cabeza o a un lado). Usa la misma cámara que el video |
| **Contador** | "más de **$1,000 USD**". "puedes tener **0 seguidores**" (baja desde 10,000) | Un solo número cuenta la historia. Dura unos 0.9 s, con números tabulares |
| **Tachado** | "no son los ~~influencers~~", "no vivo en ~~Estados Unidos~~" | Máximo 2 por video |
| **Cámara** | push-in lento (1 → 1.05) en las tomas completas, más un **golpe de zoom** (+6 %) en cada frase clave | Con `spring`, nunca lineal |

Componentes disponibles: todos los de `remotion/src/` (ver la galería). Los más útiles para UGC son TiltWheel, StackCards, HingeStack, FanCarousel, CircularCarousel, DepthGallery, GridFlip, KeyPhrase, TextRoll, UnderlineWords y FallingItems (lluvia de likes).

## 4. Lo que hizo que las versiones anteriores no funcionaran (no repetir)

- Captions inventados ("Todo empieza aquí", "Encuentra tu voz…") que **no correspondían a lo que ella decía** ni a su ritmo.
- Titulares fijos y rótulos sin sentido sobre la toma ("IDEAS QUE CONECTAN").
- Pasar `startFrom` a `<Video>` de `@remotion/media`: ahí la prop se llama **`trimBefore`**. Con la prop equivocada, la capa recortada se desfasa del video.
- Caja blanca de caption sobre un panel blanco: no se ve. El panel de arriba va en crema.
- Texto detrás de la persona en el centro de la toma: la cabeza lo tapa y no se lee.
- Un componente que calcula sus fases con `useVideoConfig().durationInFrames`, metido en un Sequence corto: se rompe (TiltWheel tronó con "inputRange must be strictly monotonically increasing").

## 5. Checklist antes de enseñarle a Manuel

- [ ] Cada caption aparece cuando ella dice esa palabra. Revisa el render **con audio** (`out/<Id>-audio.mp4`), aunque la galería sea muda.
- [ ] Nunca hay dos textos a la vez, y no hay texto sobre carruseles ni animaciones.
- [ ] Caras, manos y textos completos. Split exacto 50/50. Todo dentro de la zona segura.
- [ ] Revisaste las imágenes fijas de: inicio, cada frase clave, cada split (entrada, mitad y salida), el carrusel, el texto detrás y el último cuadro.
- [ ] La galería es sin audio: `./rr.sh <Id>` quita el audio. Sube `?v=` en `galeria/index.html`.
- [ ] Guarda con `./sesion.sh guardar <IA> "…" archivos` y anota en `docs/BITACORA.md`.
