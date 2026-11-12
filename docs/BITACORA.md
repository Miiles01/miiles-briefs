# Bitácora compartida entre IAs

Reglas:
- Al empezar, corre `./sesion.sh inicio <IA>` y lee esta bitácora completa.
- Antes de tocar un archivo, anótalo en **En curso**. Si otra IA ya lo tiene anotado, **no lo toques**: pregúntale a Manuel.
- Al terminar, quita tu línea de En curso y agrega una entrada arriba de **Historial** (lo más nuevo arriba).
- Guarda siempre con `./sesion.sh guardar <IA> "mensaje" archivos…`, solo con tus archivos.

## En curso
<!-- Formato: - [IA] archivo(s) · tarea · desde AAAA-MM-DD HH:MM -->
- [Codex] remotion/src/UGCThreeLayers.tsx, remotion/src/UGCVersionTwo.tsx, remotion/src/UGCVersionThree.tsx, referencias/REGLAS-DISENO-VIDEO-MIILES.md, remotion/galeria/index.html y remotion/galeria/videos/ · corregir captions para tres palabras por línea, eliminar colisiones y texto sobre animaciones; ajustar zona segura · desde 2026-11-12 14:49

## Historial

### 2026-11-12 · Claude
- Creé `docs/TRASPASO-COMPONENTES.md` (guía completa), esta bitácora y `sesion.sh` (inicio, guardar, historial, recuperar, respaldo y galería).
- Subí a `referencias/` el skill launch-motion con su análisis, las reglas de video y las referencias de animaciones.
- Guardado con permiso de Manuel (commit aparte), trabajo de otra sesión: `.gitignore`, `remotion/package.json`, `remotion/package-lock.json`, `remotion/src/Root.tsx` (registra UGC-Three-Layers / Version-2 / Version-3), `remotion/src/UGC*.tsx`, `remotion/scripts/`, `remotion/.agents/` y `remotion/skills-lock.json`.

### 2026-11-08 · Claude
- 35 componentes nuevos subidos a miiles.app (68 en total); el código es autosuficiente y se probó en un proyecto limpio.
- Componentes nuevos aprobados: TextRoll, PartingParade, TiltWheel y HingeStack.
