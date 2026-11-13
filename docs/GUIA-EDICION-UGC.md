# Guía de edición UGC (para ChatGPT/Codex y cualquier IA)

Todo el sistema vive en **`remotion/src/UGCMotor.tsx`**: el guion con tiempos, los captions sincronizados, la cámara, el split, los carruseles, la capa detrás de ella y los paneles listos. Cada edición solo arma un `Config` y llama `<EdicionUGC cfg={…} />`. Hay 4 ejemplos en la galería (filtro Escenas), uno por estilo:

| Edición | Archivo | Personalidad |
|---|---|---|
| UGC · Pro | `UGCPro.tsx` | De todo un poco: 2 splits, carrusel, contadores, tachados y un "2" detrás |
| UGC · Versión 1 | `UGCThreeLayers.tsx` | Split 50/50 y frase clave grande: 3 splits (perfil en 0, ganancias que suben a $1,000 cuando dice "mil", cuadrícula de apps) |
| UGC · Versión 2 | `UGCVersionTwo.tsx` | Texto directo: captions de 80 px, palabras clave resaltadas con caja blanca y un bloque dividido con 4 tarjetas que caen cuando dice cada idea |
| UGC · Versión 3 | `UGCVersionThree.tsx` | Una sola palabra por caption (la que dice en ese momento) y fotos detrás de su cabeza, a los lados, dentro de la zona segura |

Para una edición nueva, copia la versión cuyo estilo te pidan y cambia solo la configuración. Si el video es otro, primero transcribe y reemplaza `PALABRAS`.
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
| **Texto detrás de ella** | "hay **2** maneras": un 2 gigante a la izquierda, metido detrás de su pelo, mientras ella hace la señal del 2 con la mano | Capas: video → texto → `ugc-template-foreground.webm` (ella recortada). El texto debe seguir **legible**: colócalo donde su cabeza solo lo toque en un borde (arriba de la cabeza o a un lado). Usa la misma cámara que el video |
| **Contador** | "más de **$1,000 USD**". "puedes tener **0 seguidores**" (baja desde 10,000) | Un solo número cuenta la historia. Dura unos 0.9 s, con números tabulares |
| **Tachado** | "no son los ~~influencers~~", "no vivo en ~~Estados Unidos~~" | Máximo 2 por video |
| **Cámara** | push-in lento (1 → 1.05) en las tomas completas, más un **golpe de zoom** (+6 %) en cada frase clave | Con `spring`, nunca lineal |

Componentes disponibles: todos los de `remotion/src/` (ver la galería). Los más útiles para UGC son TiltWheel, StackCards, HingeStack, FanCarousel, CircularCarousel, DepthGallery, GridFlip, KeyPhrase, TextRoll, UnderlineWords y FallingItems (lluvia de likes).

### Texto detrás de ella: zona segura (Manuel lo pidió explícitamente)
- **Nunca arriba de y≈300.** Ahí van el perfil, "Seguir" y los botones de Reels/TikTok/Shorts. Tampoco abajo de y≈1450 (descripción y audio), ni pegado al borde derecho entre y 1000 y 1700 (íconos de like y comentar).
- En un video de cabeza y hombros, la cabeza empieza en y≈290 y entre y 420 y 1000 ocupa x≈200–830. **Una palabra ancha no cabe detrás sin quedar tapada.** En ese caso, la frase va delante como `clave` (así quedó "TECH UGC"). Detrás solo funcionan piezas compactas a un lado de la cabeza (el "2" mide unos 400 px de ancho, en x 50–450, y 375–950).
- Antes de decidir, **mide la silueta** en esos segundos:
  ```bash
  ffmpeg -c:v libvpx-vp9 -ss <seg> -i public/ugc-template-foreground.webm -frames:v 1 \
    -vf "scale=1080:1920,format=rgba,alphaextract,format=gray" mascara.pgm
  # y por cada renglón (y de 60 en 60) imprime el x mínimo y máximo donde alpha > 128
  ```
- La capa recortada debe llevar `position: "absolute", inset: 0`. Si queda como bloque normal, el navegador pinta encima el texto (que sí tiene posición) y ya no queda detrás.

## 4. Lo que hizo que las versiones anteriores no funcionaran (no repetir)

- Captions inventados ("Todo empieza aquí", "Encuentra tu voz…") que **no correspondían a lo que ella decía** ni a su ritmo.
- Titulares fijos y rótulos sin sentido sobre la toma ("IDEAS QUE CONECTAN").
- Pasar `startFrom` a `<Video>` de `@remotion/media`: ahí la prop se llama **`trimBefore`**. Con la prop equivocada, la capa recortada se desfasa del video.
- Caja blanca de caption sobre un panel blanco: no se ve. El panel de arriba va en crema.
- Texto detrás de la persona en el centro de la toma: la cabeza lo tapa y no se lee. Arriba del todo choca con la UI de la red social.
- Un componente que calcula sus fases con `useVideoConfig().durationInFrames`, metido en un Sequence corto: se rompe (TiltWheel tronó con "inputRange must be strictly monotonically increasing").

## 5. Checklist antes de enseñarle a Manuel

- [ ] Cada caption aparece cuando ella dice esa palabra. Revisa el render **con audio** (`out/<Id>-audio.mp4`), aunque la galería sea muda.
- [ ] Nunca hay dos textos a la vez, y no hay texto sobre carruseles ni animaciones.
- [ ] Caras, manos y textos completos. Split exacto 50/50. Todo dentro de la zona segura.
- [ ] Revisaste las imágenes fijas de: inicio, cada frase clave, cada split (entrada, mitad y salida), el carrusel, el texto detrás y el último cuadro.
- [ ] La galería es sin audio: `./rr.sh <Id>` quita el audio. Sube `?v=` en `galeria/index.html`.
- [ ] Guarda con `./sesion.sh guardar <IA> "…" archivos` y anota en `docs/BITACORA.md`.
