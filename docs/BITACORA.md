# Bitácora compartida entre IAs

Reglas:
- Al empezar, corre `./sesion.sh inicio <IA>` y lee esta bitácora completa.
- Antes de tocar un archivo, anótalo en **En curso**. Si otra IA ya lo tiene anotado, **no lo toques**: pregúntale a Manuel.
- Al terminar, quita tu línea de En curso y agrega una entrada arriba de **Historial** (lo más nuevo arriba).
- Guarda siempre con `./sesion.sh guardar <IA> "mensaje" archivos…`, solo con tus archivos.

## En curso
<!-- Formato: - [IA] archivo(s) · tarea · desde AAAA-MM-DD HH:MM -->
- [Codex] remotion/galeria/index.html, docs/BITACORA.md · afinar scrubber y separar botón de cierre del video en popup · desde 2026-11-13 10:31

## Historial

### 2026-11-13 · Codex
- UGC · Versión 3: fade de entrada explícito y perceptible para captions de una palabra, limitado a la duración real de cada palabra; el caption previo termina al empezar el siguiente.
- Galería · Escenas: barra blanca minimalista para avanzar/retroceder y botón de ampliación en popup con cierre. El reproductor permanece siempre silenciado y no incluye control de audio.
- Render de V3 actualizado en la galería (`?v=6`); se revisaron el fotograma del fade, el scrubber y la apertura/cierre del popup.

### 2026-11-13 · Claude (2)
- Rehice las versiones UGC 1, 2 y 3 con el sistema de UGC-Pro: guion real con tiempos por palabra, zona segura, golpes de cámara y momentos que ilustran lo que ella dice. Cada una conserva su estilo (ver la tabla al inicio de `docs/GUIA-EDICION-UGC.md`).
- Nuevo `remotion/src/UGCMotor.tsx` con todo lo compartido. UGC-Pro ahora también lo usa (se ve igual).
- Versión 3: una sola palabra por caption, como pidió Manuel (`gruposPalabra`, sin juntar palabras cortas).
- Las versiones con audio quedaron en `remotion/out/*.mp4` y en el Escritorio de Manuel (`*-con-audio.mp4`); la galería no tiene audio (`?v=5`).

### 2026-11-13 · Claude
- Versiones UGC 1–3: `startFrom` → `trimBefore`. `<Video>` de `@remotion/media` ignoraba `startFrom` y la capa recortada arrancaba en el segundo 0 (se veía una toma fantasma encima). Ya están sincronizadas y re-renderizadas (`?v=4`).
- En la versión 1, "CREA SIN EXPONERTE" sigue delante de ella: su capa recortada no tiene `position: absolute`, y si la frase quedara detrás, su torso la taparía casi completa.
- UGC-Pro: "TECH UGC" pasó a ser frase clave delante (Advercase, debajo de la cara). Antes estaba arriba del todo y chocaba con la UI de la red social. El "2" detrás de ella bajó a y≈375–950. La zona segura y cómo medir la silueta están en `docs/GUIA-EDICION-UGC.md`.

### 2026-11-12 · Claude (tarde)
- Nueva edición de referencia **UGC-Pro** (`remotion/src/UGCPro.tsx`, filtro Escenas, la primera de la galería). Captions con el guion real y los tiempos de cada palabra (faster-whisper), 2 pantallas divididas (perfil con 0 seguidores, tarjetas de pago), carrusel TiltWheel, contadores ($1,000 USD / 0 seguidores), tachados, "TECH UGC" y un "2" detrás de ella, y cámara con golpes de zoom.
- Guía para ChatGPT/Codex: `docs/GUIA-EDICION-UGC.md` (orden de trabajo, sistema de captions, recursos y checklist).
- Ojo: en `<Video>` de `@remotion/media` la prop es `trimBefore`, no `startFrom`. Las versiones 1–3 usan `startFrom` en la capa recortada; conviene revisarlas.
- La versión con audio para revisar la sincronía está en `remotion/out/UGC-Pro.mp4` (y en el Escritorio de Manuel); la de la galería no tiene audio.

### 2026-11-12 · Codex
- Corregí los captions UGC a tres palabras por línea, quité titulares fijos y texto superpuesto a los carruseles, moví la frase clave a una sola línea y mantuve las imágenes de apoyo detrás de la creadora en la versión 3. Agregué las tres escenas al filtro Escenas de la galería local y revisé fotogramas y exportaciones mudas.

### 2026-11-12 · Claude
- Creé `docs/TRASPASO-COMPONENTES.md` (guía completa), esta bitácora y `sesion.sh` (inicio, guardar, historial, recuperar, respaldo y galería).
- Subí a `referencias/` el skill launch-motion con su análisis, las reglas de video y las referencias de animaciones.
- Guardado con permiso de Manuel (commit aparte), trabajo de otra sesión: `.gitignore`, `remotion/package.json`, `remotion/package-lock.json`, `remotion/src/Root.tsx` (registra UGC-Three-Layers / Version-2 / Version-3), `remotion/src/UGC*.tsx`, `remotion/scripts/`, `remotion/.agents/` y `remotion/skills-lock.json`.

### 2026-11-08 · Claude
- 35 componentes nuevos subidos a miiles.app (68 en total); el código es autosuficiente y se probó en un proyecto limpio.
- Componentes nuevos aprobados: TextRoll, PartingParade, TiltWheel y HingeStack.
