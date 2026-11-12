# Traspaso: componentes de video Miiles (para la IA que continúa)

Lee esto completo antes de tocar nada. Después lee `docs/CONTEXTO-CLAUDE.md` (repos y cómo publicar) y `AGENTS.md`.
El usuario es Manuel. Habla español de México: responde en español, directo y breve.

---

## 0. Trabajo compartido entre IAs (OBLIGATORIO cada sesión)

Dos IAs (Claude y otra) trabajan en este mismo repo y en la misma galería. Para que nadie borre ni sobrescriba al otro:

1. **Al empezar cada sesión**, siempre:
   ```bash
   cd ~/Code/miiles-briefs && ./sesion.sh inicio <TuNombreIA>
   ```
   Esto:
   - trae lo último de GitHub;
   - te avisa si hay cambios sin guardar (de la otra IA: **no los toques**);
   - muestra los últimos 15 cambios y la sección "En curso" de `docs/BITACORA.md`;
   - crea el respaldo del día.
2. **Lee `docs/BITACORA.md`.** Antes de editar, anota en "En curso" qué archivos vas a tocar. Si la otra IA ya anotó ese archivo, no lo edites: pregúntale a Manuel.
3. **Guarda seguido y solo lo tuyo:**
   ```bash
   ./sesion.sh guardar <IA> "qué cambió" archivo1 archivo2
   ```
   Hace commit con tu nombre en el mensaje y lo sube a GitHub. Nunca uses `git add -A`, `git reset --hard`, `git push --force` ni `git stash` sin nombre.
4. **Al terminar:** quita tu línea de "En curso", agrega tu entrada al Historial de la bitácora y guárdala.
5. **Si algo se rompió:**
   - `./sesion.sh historial remotion/src/TiltWheel.tsx` muestra quién lo cambió y cuándo;
   - `./sesion.sh recuperar <commit> <archivo>` lo regresa;
   - los respaldos diarios son tags `respaldo-AAAA-MM-DD-HHMM` (`git tag -l "respaldo-*"`).
6. **La galería (preview) es la misma para las dos:**
   - se abre con `./sesion.sh galeria`, en http://localhost:5199;
   - el archivo es `remotion/galeria/index.html` y los videos están en `remotion/galeria/videos/`;
   - si ambas IAs trabajan en esta Mac, lo que una renderiza lo ve la otra al recargar;
   - si la otra IA trabaja en otra máquina, lo ve después de `./sesion.sh inicio`, que trae lo último de GitHub;
   - `index.html` lo editan las dos: anótalo en "En curso" mientras lo tienes y guárdalo en cuanto termines.

## 1. Dónde está todo

| Qué | Ruta |
|---|---|
| Repo de wearemiiles.com (plantillas, componentes y galería) | `~/Code/miiles-briefs` · GitHub `Miiles01/miiles-briefs` |
| Proyecto Remotion (todos los componentes) | `~/Code/miiles-briefs/remotion/` |
| Código fuente de cada componente | `remotion/src/*.tsx` (registrados en `remotion/src/Root.tsx`) |
| Tarjetas compartidas (tipo `Card`, `CardFace`, `miilesCards`) | `remotion/src/shared.tsx` |
| Fotos e íconos de ejemplo | `remotion/public/carrusel/` (foto, rosa, gorra, azul .jpg; estrella, flor, miiles .svg) |
| Tipografías | `remotion/public/fonts/` (Manrope, Anton, Advercase) |
| Renderizar a la galería | `remotion/rr.sh Id [Id…]` |
| Empaquetar para miiles.app | `remotion/bundle_comp.py` |
| Galería de aprobación (local) | `remotion/galeria/index.html` + `galeria/videos/*.mp4` |
| Código, videos y portadas públicos | `miiles-briefs/public/studio/componentes/` (se sirve en `wearemiiles.com/studio/componentes/`) |
| Ejemplos públicos (fotos, SVG, fuentes) + CORS | `public/studio/componentes/assets/` con su `.htaccess` |
| App miiles.app (Lovable) | `~/.gemini/antigravity/scratch/flow-ai-studio` · GitHub `Miiles01/flow-ai-studio` |
| Fichas de componentes en miiles.app | `flow-ai-studio/src/data/studio-components.json` (68 fichas) |
| Prompt que arma miiles.app | `flow-ai-studio/src/lib/studioComponents.ts` → `buildComponentPrompt` |
| Copia del código que lee miiles.app primero | `flow-ai-studio/public/studio-code/*.tsx.txt` |
| Reglas de diseño de video (captions, zona segura, recorte) | `miiles-briefs/referencias/REGLAS-DISENO-VIDEO-MIILES.md` |
| Skill de videos de lanzamiento (Higgsfield) | `miiles-briefs/referencias/launch-motion-skill/` (instalado en `~/.claude/skills/launch-motion/`) + `ANALISIS.md` |
| Referencias de animaciones | `miiles-briefs/referencias/componentes-animaciones/` |
| Skills oficiales de Remotion | `remotion/.agents/skills/` (best-practices, captions, create, docs…) |

## 2. Cómo correr y ver

```bash
cd ~/Code/miiles-briefs/remotion
npx remotion studio src/index.ts          # ver/ajustar en localhost
./rr.sh TiltWheel HingeStack              # render 1080×1920 → baja a 720×1280 en galeria/videos/
```
- `rr.sh` necesita `ffmpeg` en el PATH. Los efectos con shaders usan `--gl=angle` (ya incluido).
- La galería se sirve en localhost:5199 con un servidor estático en UTF-8. En Claude Code es la configuración `componentes` de `.claude/launch.json`. Si no, usa cualquier servidor estático en `remotion/galeria/`.
- La galería no autoreproduce: solo se reproduce la fila bajo el cursor, con `#t=0.1` como portada. Cuando re-renderices un video, súbele la versión en la URL (`?v=N`) o el navegador mostrará el viejo.

## 3. Reglas del usuario (no negociables)

- **No publicar nada** en miiles.app ni en wearemiiles.com sin que Manuel lo pida explícitamente. Pregunta cada vez.
- Toda animación nueva va **primero a la galería local** para aprobación. Solo se sube lo que él diga, por nombre.
- Nunca `git reset --hard`. No pedir contraseñas ni tokens. No saltarse bloqueos (Cloudflare/CodePen): pide el zip o busca el repo.
- Estilo de los componentes:
  - Video vertical 1080×1920 a 30 fps.
  - **Fondo blanco** por defecto, nunca fondos negros.
  - Colores Miiles: `#4059F1`, `#FCB5B9`, `#E8ECFE`, `#1C1E2A`, `#111111`.
  - Sin sombras.
  - Texto centrado y dentro de la zona segura de Reels/TikTok.
- Tipografía:
  - Manrope para el texto.
  - **Advercase solo en palabras sin acento** (la versión gratis no trae acentos). En el código público se reemplaza por Gambarino.
- Cada componente debe hacer **bucle perfecto**: exporta una función `xxxDuration(props)` que da la duración exacta del bucle.
- Cada `.tsx` empieza con el bloque **"CÓMO USAR ESTE COMPONENTE"** en español. Sirve para que cualquier IA (Claude, Codex, Gemini, Cursor…) lo pueda usar: qué hace, props, duración y comando de render.
- Manuel da feedback con grabaciones de pantalla. Si vienen como archivo temporal que desaparece, pídele que las guarde en el Escritorio. El nombre lleva un espacio estrecho (U+202F) antes de "a.m./p.m.", así que búscalas con un glob.

## 4. Flujo para un componente nuevo

1. **Referencia → storyboard corto.** Qué pasa, en qué orden, cuántos cuadros. Muchos componentes vienen de efectos de "Made With GSAP" o de CodePen: anota en la cabecera "inspirado en el efecto N…".
2. Escribe `remotion/src/Nombre.tsx` con la cabecera, los props con valores por defecto y `nombreDuration()`. Regístralo en `Root.tsx` con `{...V}` (1080×1920, 30 fps).
3. `./rr.sh Id`, agrega la tarjeta en `galeria/index.html` (con `?v=`) y enséñaselo a Manuel.
4. Itera con su feedback hasta que diga "sí, así".
5. Cuando pida subirlo, sigue la sección 5.

## 5. Subir un componente aprobado a miiles.app (solo cuando lo pida)

1. Empaqueta:
   ```bash
   cd remotion/src
   python3 ../bundle_comp.py Archivo.tsx=../../public/studio/componentes/slug.tsx.txt
   ```
   Genera un solo archivo **autosuficiente**:
   - mete las tarjetas de `shared.tsx`;
   - cambia las rutas de ejemplo por URLs de `wearemiiles.com/studio/componentes/assets/`;
   - cambia `staticFile(` por un helper `archivo()` (URL tal cual, o `public/` si es ruta local);
   - cambia Advercase por Gambarino.

   Falla si queda alguna referencia a `shared`.
2. Copia el video (`galeria/videos/Id.mp4`) y una portada `.jpg` (un cuadro representativo) a `public/studio/componentes/`.
3. **Prueba en un proyecto Remotion limpio**, sin `public/`. Los `.tsx.txt` se copian tal cual y se renderiza un cuadro de cada uno con `@remotion/bundler` + `renderStill`. Si no renderiza ahí, no lo subas: así es como lo va a usar la IA de cada usuario.
4. Agrega la ficha en `flow-ai-studio/src/data/studio-components.json`. Campos:
   - `slug`, `title`;
   - `category`: Carrusel | Galería | Texto | Elemento | Transición;
   - `description`;
   - `preview_video_url`, `poster_url`, `code_url`, `code_filename`;
   - `stack`, `instruction`, `customize`.

   La `instruction` no repite los pasos generales, porque esos ya los pone `buildComponentPrompt`:
   1. `npx create-video@latest --blank`;
   2. guardar el código tal cual en `src/`;
   3. registrar la Composition en 1080×1920 a 30 fps;
   4. probarlo sin cambios con `npx remotion studio`;
   5. cambiar los ejemplos por sus archivos en `public/`.
5. **Copia el mismo `.tsx.txt` a `flow-ai-studio/public/studio-code/`.** miiles.app lee primero esa copia; si no la actualizas, el prompt sale con el código viejo.
6. Publica:
   - **wearemiiles:** commit a `main` en miiles-briefs; luego, en un worktree de la rama `production`, rsync de `public/studio/componentes/` a `studio/componentes/`, commit y `git push origin HEAD:production`.
   - **flow-ai-studio:** commit y push a `main`. Después **Manuel da Publish en Lovable**: tú no puedes.
7. Marca el componente como "En miiles.app" en `galeria/index.html`.

## 6. Aprendizajes técnicos (lo que costó descubrir)

**Tipografías**
- Cárgalas con `delayRender` + `new FontFace(...).load()` + `continueRender`. Si no, los primeros cuadros salen en Times.
- Para medir letras (posiciones por letra), usa un `<canvas>` con `ctx.measureText` y vuelve a medir cuando la fuente esté lista (`ready` en las dependencias del `useMemo`).

**3D**
- La `opacity` sobre un contenedor con `preserve-3d` **aplana el 3D**. Ponla en cada cara (como en `HingeStack`).
- Las tarjetas con dos caras usan `backfaceVisibility: hidden`, y la de atrás va con `rotateX(180deg)`.
- Rueda inclinada (`TiltWheel`):
  - la proyección es manual (`k = P / (P - z)`) y se ordena por `z`;
  - una inclinación **baja** da un óvalo aplastado;
  - al voltear, la inclinación se invierte pasando por una línea, nunca por un círculo.

**Bucles**
- Todo debe terminar exactamente como empezó: n vueltas completas, `índice % n` y curvas que regresan a 0.
- La duración sale de una función, nunca está fija a mano.

**Movimiento**
- Nada lineal. Usa curvas tipo `Easing.bezier(0.65, 0, 0.35, 1)` (suave) o `(0.45, 0, 0.25, 1)` (fluido).
- Entradas con un ligero overshoot.
- Las salidas son más rápidas que las entradas.
- El siguiente movimiento arranca antes de que el anterior se asiente: **nada se detiene por completo**.
- Contadores de unos 1 s, nunca un salto de un cuadro.
- Elementos escalonados (stagger) a pocos cuadros entre sí.
- Lo importante se queda unos 1.5 s en pantalla.
- Todo esto viene del skill launch-motion: lee `referencias/launch-motion-skill/SKILL.md` y `ANALISIS.md` antes de hacer escenas o un video de lanzamiento.

**Hosting**
- La CDN de Hostinger (hcdn) recomprime las imágenes.
- Los assets públicos necesitan CORS: lo da el `.htaccess` de la carpeta `assets/`.

## 7. Estado al 2026-11-12

- **68 componentes en miiles.app** (68 fichas en el JSON; el código está en `public/studio-code`).
  - Los 4 últimos que se aprobaron: Texto que rueda en 3D (`TextRoll`), Desfile de letras que se abren (`PartingParade`), Rueda inclinada (`TiltWheel`) y Pila con bisagra (`HingeStack`).
  - Pendiente: Manuel debe confirmar que dio Publish en Lovable.
- **En la galería, sin aprobar todavía:**
  - frase por líneas/palabras, barra que revela, columna de casos, cuadrícula de columnas;
  - transiciones línea/ventana, sticky grid, búsqueda gooey, repetición en franjas;
  - `UnderlineWords`, `SlideWords`, `ScrollLetters` y los 20 cambios de página de `PageChange`.
- **Escenas (beta, no publicar):**
  - Son ediciones completas de Reel armadas con varios componentes. La primera prueba es `src/Escena01.tsx`.
  - Otra sesión agregó `UGCThreeLayers`, `UGCVersionTwo` y `UGCVersionThree` (texto detrás de la persona con `@remotion/video-matting`, script en `remotion/scripts/matte-video.mjs`). Esos cambios en `Root.tsx`, `package.json` y `.gitignore` **siguen sin commit**: pregúntale a Manuel antes de commitearlos.
- **Ideas en cola:**
  - video de lanzamiento de miiles.app para Product Hunt con el skill launch-motion (storyboard primero);
  - ficha de Product Hunt;
  - versiones horizontales de los componentes.

---

## 8. Cómo trabajo yo (Claude): el método completo

Esta es la parte más importante. Lo que hace que el resultado le guste a Manuel no es una sola técnica, sino este proceso.

### 8.1 Antes de escribir código
1. **Leo primero y no supongo.** Leo el archivo completo que voy a tocar, el componente más parecido que ya existe (para copiar su estructura) y las reglas de este documento. Los componentes nuevos se parecen a los anteriores: misma cabecera, mismos props, `shared.tsx` y una función de duración.
2. **Si me pasa una referencia** (video, CodePen, efecto de GSAP, sitio):
   - la estudio cuadro por cuadro y la describo en palabras;
   - qué entra, por dónde, en qué orden, cuánto dura, qué curva usa y cómo hace el bucle;
   - después la traduzco a Remotion.
   No copio el look de otra marca: adapto el movimiento a Miiles.
3. **Defino el storyboard en cuadros** antes de animar, por ejemplo: "quieta 36 cuadros → se aleja 60 → gira → se acerca 66 al final". Así el timing es intencional y el bucle cierra.

### 8.2 Cómo escribo el componente
- **Todo es función del cuadro** (`useCurrentFrame`). Nada de `setTimeout`, CSS transitions ni animaciones de librería que corran solas: Remotion renderiza cuadro por cuadro.
- Uso `interpolate` con `extrapolateLeft/Right: "clamp"` y curvas `Easing.bezier`. **Nunca lineal**, salvo un giro o desplazamiento continuo que debe ser constante.
- Escribo **comentarios en español** que explican la intención ("las letras frente al marco se abren justo lo necesario"), no lo obvio. Así, cuando Manuel pide un cambio, encuentro rápido dónde.
- Los props tienen **valores por defecto que ya se ven bien**. Expongo solo lo que alguien querría cambiar (colores, tamaños, tiempos) y lo documento en la cabecera.
- Si algo depende de medidas reales (ancho de letras, tamaño de fotos), lo mido; no lo adivino.
- **Un cambio a la vez.** Cuando Manuel da feedback, cambio exactamente lo que pidió y no "mejoro" otras cosas sin preguntar.

### 8.3 Cómo verifico (nunca entrego sin ver)
1. Renderizo con `./rr.sh Id`.
2. **Miro el resultado yo mismo** antes de decir que quedó. Extraigo cuadros clave con ffmpeg:
   ```bash
   ffmpeg -ss 2.5 -i galeria/videos/Id.mp4 -frames:v 1 /tmp/f.png
   ```
   Reviso el inicio, cada cambio de fase, el punto medio y el último cuadro, para confirmar que empalma con el primero.
3. Busco lo que suele fallar:
   - texto cortado o fuera de la zona segura;
   - tarjetas que se salen del cuadro;
   - saltos de un cuadro;
   - fuente equivocada en los primeros cuadros;
   - el 3D aplanado;
   - el bucle que no cierra.
4. Para webs (plantillas UGC): abro el preview, reviso la consola, tomo screenshots en escritorio y en móvil (375 px) y pruebo el scroll y los clics reales.
5. Solo entonces actualizo la galería (con `?v=` nuevo) y le digo a Manuel qué cambió, en 2–4 líneas.

### 8.4 Cómo leo el feedback de Manuel
- Manuel es visual y escribe rápido, a veces con faltas o por dictado ("miles.app" = miiles.app). Interpreta la intención.
- Cuando manda una grabación, la reviso cuadro por cuadro para ver exactamente qué señala.
- Si dice "más tranquilo", baja velocidad y amplitud. Si dice "que no se corte", revisa el bucle y los bordes. Si dice "así", **no toques nada más**.
- Si algo es ambiguo y el cambio es caro, pregunto **una** cosa concreta. Si es barato, hago la versión más probable y se la enseño.
- Cuando pide una lista de cambios, los hago todos y reporto cuál quedó y cuál no. Nunca digo "listo" si no lo verifiqué.

### 8.5 Cuándo uso cada skill (las que Manuel me ha pasado)
| Skill / recurso | Para qué lo uso |
|---|---|
| `launch-motion` (`~/.claude/skills/launch-motion/`, copia en `referencias/`) | Escenas, videos de lanzamiento, cualquier secuencia con historia. Storyboard primero, reglas de movimiento (overshoot, salidas rápidas, nada se detiene, cursor en arco, press en clics) y checklist antes de renderizar. |
| `remotion` + `remotion/.agents/skills/remotion-*` | API de Remotion: fuentes, captions, video, `delayRender`, render. Las consulto si dudo de una API. |
| `transitions-dev` / `transitions-polish` | Tokens de movimiento (duraciones, curvas, distancias) para webs y para calibrar timing. Las curvas de los componentes salen de ahí. |
| `ui-ux-pro-max`, `apple-design` | Revisar layout, jerarquía y legibilidad de plantillas web y de la galería. |
| `video-prompt-builder` | Solo escribe prompts para Seedance 2.0; no genera video. Lo usé para el guion de `Escena01`. |
| `stop-slop` | Limpiar textos (copy de plantillas, descripciones de fichas) para que no suenen a IA. |
| `referencias/REGLAS-DISENO-VIDEO-MIILES.md` | Captions, zona segura, split 50/50 y texto detrás de la persona en ediciones UGC. |
| Repo de ideas `~/Code/la-patatheque` (Vite) y el annnimate starter pack (`~/Downloads/annnimate-starter-pack/`: scale-slider, rotating-words, pricing) | Efectos para webs: odómetro, palabras que rotan, slider con escala. |
| `~/Downloads/Patrones` | Patrones gráficos para fondos y secciones de las plantillas. |
| Made With GSAP (efectos numerados) | Fuente de inspiración de muchos componentes. Se cita en la cabecera. |

Cómo aplico una skill: **la leo completa una vez** y extraigo las reglas concretas (números, no adjetivos). Luego las sigo como checklist mientras escribo y al verificar. No la cito de memoria.

### 8.6 Cómo me comunico
- Siempre en español, corto y concreto: qué hice, qué verifiqué y qué falta. Sin relleno.
- Cuando algo requiere una acción suya (Publish en Lovable, aprobar en la galería, guardar una grabación), lo digo claramente en una línea.
- Antes de publicar o subir, pregunto y espero su "sí, publícalo". Antes de commitear trabajo que no es mío, pregunto.
- Al terminar algo grande, actualizo este documento y `docs/CONTEXTO-CLAUDE.md` para que la siguiente IA no empiece de cero.
