# Bitácora compartida entre IAs

Reglas:
- Al empezar, corre `./sesion.sh inicio <IA>` y lee esta bitácora completa.
- Antes de tocar un archivo, anótalo en **En curso**. Si otra IA ya lo tiene anotado, **no lo toques**: pregúntale a Manuel.
- Al terminar, quita tu línea de En curso y agrega una entrada arriba de **Historial** (lo más nuevo arriba).
- Guarda siempre con `./sesion.sh guardar <IA> "mensaje" archivos…`, solo con tus archivos.

## En curso
<!-- Formato: - [IA] archivo(s) · tarea · desde AAAA-MM-DD HH:MM -->
- (nadie)

## Historial

### 2026-11-12 · Codex
- Corregí los captions UGC a tres palabras por línea, quité titulares fijos y texto superpuesto a los carruseles, moví la frase clave a una sola línea y mantuve las imágenes de apoyo detrás de la creadora en la versión 3. Agregué las tres escenas al filtro Escenas de la galería local y revisé fotogramas y exportaciones mudas.

### 2026-11-12 · Claude
- Creé `docs/TRASPASO-COMPONENTES.md` (guía completa), esta bitácora y `sesion.sh` (inicio, guardar, historial, recuperar, respaldo y galería).
- Subí a `referencias/` el skill launch-motion con su análisis, las reglas de video y las referencias de animaciones.
- Guardado con permiso de Manuel (commit aparte), trabajo de otra sesión: `.gitignore`, `remotion/package.json`, `remotion/package-lock.json`, `remotion/src/Root.tsx` (registra UGC-Three-Layers / Version-2 / Version-3), `remotion/src/UGC*.tsx`, `remotion/scripts/`, `remotion/.agents/` y `remotion/skills-lock.json`.

### 2026-11-08 · Claude
- 35 componentes nuevos subidos a miiles.app (68 en total); el código es autosuficiente y se probó en un proyecto limpio.
- Componentes nuevos aprobados: TextRoll, PartingParade, TiltWheel y HingeStack.
