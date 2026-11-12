# Contexto para Claude — Miiles (lee esto primero)

> **Si vas a trabajar en componentes, animaciones o escenas, lee primero `docs/TRASPASO-COMPONENTES.md`** (rutas, flujo, aprendizajes y el método de trabajo completo).

Este documento resume el trabajo hecho con Claude para que un chat nuevo pueda continuarlo.
El usuario habla español (México). Responde en español, directo y breve.

## Repositorios

| Repo | Qué es | Cómo se publica |
|---|---|---|
| `miiles-briefs` (este repo, rama `main`) | wearemiiles.com: plantillas de portafolio UGC en `public/ugc-vN/`, previews y componentes en `public/studio/` | push a `main` y luego copiar a la rama **`production`** (ver abajo) |
| `flow-ai-studio` (Lovable) | miiles.app: dashboard, Estudio (Librería de plantillas y Componentes), /propuesta | push a `main`; el usuario presiona **Publish en Lovable** |

### Publicar en wearemiiles.com
1. Commit en `miiles-briefs` (`main`) y push.
2. En una copia/worktree de la rama `production`: `git fetch origin production && git merge --ff-only origin/production`.
3. Copiar los archivos cambiados (lo que está en `public/` va a la raíz de production), commit y `git push origin HEAD:production`.
4. Tarda unos minutos en verse en vivo. Nunca `git reset --hard`.

### Reglas de trabajo (importantes)
- No publicar nada en miiles.app ni en wearemiiles sin que el usuario lo pida explícitamente.
- Las animaciones nuevas van primero a la **galería local para aprobación**; solo se suben cuando el usuario dice cuáles.
- No saltar bloqueos de Cloudflare / CodePen: pedir el zip o buscar el repo en GitHub.
- No pedir contraseñas ni tokens en el chat.
- Reglas de diseño de portafolios: ver `AGENTS.md` (sin dividers, sin mayúsculas completas, hablarle a todas las marcas, etc.).
- En flow-ai-studio: ver su `CLAUDE.md` (sistema de diseño, dark mode, no tocar landings salvo instrucción).

## Plantillas de portafolio
- **V24 (Laura)** en `public/ugc-v24/` → wearemiiles.com/ugc-v24 (no está en la Librería de miiles.app; el usuario pidió quitarla de ahí).
- **V25 (Laura) "Bloom"** en `public/ugc-v25/` → wearemiiles.com/ugc-v25, publicada y en la Librería de miiles.app (slug `portafolio-ugc-v25`). Reglas que dio el usuario para esta plantilla: blanco, nunca fondos negros en secciones, sin bordes redondeados en secciones, Advercase solo en frases clave sin acentos (lo demás Helvetica), grises y degradados de Miiles, íconos en cuadritos como V23 (morado, azul, azul claro; sin naranja), en móvil scroll normal con menú hamburguesa a media pantalla. Detalle en `AGENTS.md`.
- Siguiente: **V26**.
- Vista previa en video de la Librería: 960×720, ~9.8 s, 30 fps (mp4 + webm), grabada con Playwright haciendo scroll suave; miniatura 1200×900 jpg; zip de la carpeta en `public/studio/descargas/`. Ojo: la CDN de Hostinger recomprime las imágenes al servirlas.
- Catálogo de miiles.app: `flow-ai-studio/src/data/studio-templates.json` (22 plantillas, con `preview_video_url` en wearemiiles `studio/previews/ugc-vN.mp4`). Se refleja también en `supabase/functions/mcp/index.ts`.

## Componentes de video (Remotion) — `remotion/`
Proyecto Remotion 4.0.540 + React 19 + lucide-react. Video vertical 1080×1920 a 30 fps.
- `src/*.tsx`: cada componente con un bloque de cabecera **"CÓMO USAR ESTE COMPONENTE"** (instrucciones para cualquier IA). Fondo blanco por defecto, colores Miiles (#4059F1, #FCB5B9, #E8ECFE, #1C1E2A, #111111), texto centrado y dentro de la zona segura de Reels/TikTok, sin sombras.
- `src/Root.tsx`: todas las composiciones registradas (ids usados en la galería).
- `src/shared.tsx`: tipo `Card`, `CardFace`, `miilesCards` (fotos/íconos de ejemplo en `public/carrusel/`).
- Fuentes en `public/fonts/` (Manrope, Anton, Advercase).
- `rr.sh Id [Id…]`: renderiza y baja a 720×1280 en `galeria/videos/` (las de shaders usan `--gl=angle`).
- `npx remotion studio src/index.ts` para verlas en localhost.
- `galeria/index.html`: galería de revisión (filtros por categoría; la casilla marcada = ya está en miiles.app).

### Cómo se sube un componente aprobado a miiles.app
1. `cd remotion/src && python3 ../bundle_comp.py Archivo.tsx=../../public/studio/componentes/slug.tsx.txt` → un solo archivo autosuficiente: incluye las tarjetas de `shared.tsx`, los ejemplos (fotos, íconos y tipografías) apuntan a `wearemiiles.com/studio/componentes/assets/` y usa `archivo()` (URL tal cual o ruta de public/). Advercase se cambia por Gambarino en el código público.
2. Video (de `galeria/videos/`), portada `.jpg` (un cuadro representativo) y `.tsx.txt` → `public/studio/componentes/` en miiles-briefs → publicar en production (rsync de la carpeta).
3. Agregar la ficha en `flow-ai-studio/src/data/studio-components.json` (slug, title, category [Carrusel | Galería | Texto | Elemento | Transición], description, preview_video_url, poster_url, code_url, code_filename, stack, instruction, customize). La instrucción no repite los pasos generales (esos los pone `buildComponentPrompt` en `src/lib/studioComponents.ts`) ni pide copiar tipografías.
4. **Copiar también el `.tsx.txt` a `flow-ai-studio/public/studio-code/`**: miiles.app lee primero esa copia y solo si no existe va a wearemiiles. Si no se actualiza, el prompt sale con código viejo.
5. Probar antes de subir: proyecto Remotion limpio (sin public/) con los `.tsx.txt` y renderizar un cuadro de cada composición (`@remotion/renderer`), como hace el usuario.
6. Marcar la casilla en `galeria/index.html`.

### Estado (68 subidas a miiles.app el 2026-11-08)
Subidas: carruseles (circular, espiral 3D, abanico, ruedas vertical/horizontal, pila 3D, anillo interior), columnas inclinadas, frases (letras, cambio de frase, desde inicio/centro/final/extremos/aleatorio), letras elásticas, frase con puntos, línea que resuena, órbita con zoom, botones que se revelan / en columna, tarjetas que se apilan, fotos que crecen, galería con profundidad, cuadrícula que se reacomoda, lluvia de likes / desde arriba, transiciones escala / cortina curva / disolver / espiral, foto con repetición cápsula / arco.

Por aprobar: frase líneas/palabras, barra que revela, columna de casos, cuadrícula de columnas, transiciones línea/ventana, cuadrícula que se abre (sticky grid), búsqueda (gooey), repetición franjas, 6 subrayados (`UnderlineWords`), palabras que se deslizan (`SlideWords`), 4 letras con scroll (`ScrollLetters`, texto con mix-blend "difference"), y 20 cambios de página de Interlude (`PageChange`: curtain, wipe, columns, circle, typewriter, stack, slide-over, peel, slices, frame, carousel, cube, corner, tear, dither, dissolve, ink, spiral, velvet, channel; páginas con solo texto + imagen).

## miiles.app — Estudio
- `src/pages/Studio.tsx`: sección **Componentes** (tag "Próximo lanzamiento", filtros por categoría con borde gris sin sombra, 2 filas + "Ver más", al pasar el cursor por una fila se reproducen todas sus previews) arriba de la **Librería**.
- `src/components/studio/StudioComponentCard.tsx`, `src/pages/StudioComponent.tsx` (/studio/componentes/:slug), `src/lib/studioComponents.ts` (prompt = instrucción + código).

## Escenas (beta, no publicar)
Idea del usuario: ediciones completas de Reel armadas con varios componentes ("escenas"). Primera prueba: `src/Escena01.tsx` (15 s), hecha a partir del prompt de la habilidad *video-prompt-builder* (`escena-01-prompt.txt`). Esa habilidad solo escribe prompts para Seedance 2.0; no genera video.

## Herramientas instaladas en la sesión anterior
`gallery-dl` y `yt-dlp` (pip) para bajar referencias.

## Capturas de la app para blog, artículos y marketing
- Nunca con datos de Manuel: ni su nombre, avatar, tableros, clientes ni tareas. Usar un perfil de ejemplo ("Laura") y nombres genéricos (o una cuenta de demo).
- Cada idioma con sus propias capturas: las del artículo en inglés con la app en inglés, las del español en español.
- Las capturas de Miiles Blog viven en `flow-ai-studio/public/blog/<artículo>/<es|en>-<pantalla>.webp`.
