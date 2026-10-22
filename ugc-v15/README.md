# Paul Kalkbrenner — Official Website Architecture (Recreation)

Recreación integral, animada y funcional de la estructura de [paulkalkbrenner.net](https://www.paulkalkbrenner.net/), construida de manera autónoma **sin imágenes** (utilizando canvas osciloscopio procedural, vectores geométricos SVG, CSS interactivo y Web Audio API).

---

## 🎛️ Características y Tecnologías Implementadas

### 1. Cero Imágenes Rasterizadas (*Strictly No Images*)
Para cumplir el requerimiento de no usar imágenes:
* **Héroe Osciloscopio en tiempo real:** En lugar del carrusel de fotografías entre *"Paul"* y *"Kalkbrenner"*, se integró un canvas con osciloscopio vectorial HUD que dibuja ondas analógicas dinámicas y reacciona al sonido real.
* **Discos de Vinilo Vectoriales:** Cada álbum (*Berlin Calling*, *Parts of Life*, *7*, *Kabelmann*) posee una portada geométrica con gradientes y un disco de vinilo en SVG/CSS con surcos concéntricos, etiqueta central y animación de extracción con rotación al interactuar.
* **Consola de Hardware en Vivo:** Recreación de la matriz de mezcla analógica con faders, medidores VU de señal estéreo en tiempo real e indicadores LED.

### 2. Sintetizador Procedural Web Audio API
* Al pulsar el botón superior **SOUND [ON/OFF]**, un motor de síntesis de audio procedural en JavaScript genera un ritmo de bombo analógico, hi-hat filtrado y línea de sub-bajo a **128 BPM** en tiempo real.
* La señal pasa por un `AnalyserNode` que modula el osciloscopio del hero y los ecualizadores de la barra de navegación.
* Al pulsar "Play" en cualquier tema (*Sky and Sand*, *Aaron*, *Cloud Rider*, etc.), se reproduce un arpegio melódico sintetizado y el vinilo gira.

### 3. Cursor Reactivo Personalizado (*Custom Reactive Cursor*)
* Implementado con `gsap.quickTo` para un seguimiento fluido a 60fps.
* Al situarse sobre elementos con `data-cursor-hover`, el cursor se expande y proyecta badges contextuales dinámicos: `"LISTEN"`, `"TICKETS"`, `"SYNTH"`, `"PLAY"`, `"TOP"`.

### 4. Animaciones GSAP & ScrollTrigger
* **Hero Entrance:** Entrada cinética del nombre Paul Kalkbrenner y sus badges técnicos.
* **Experience Horizontal Scrub:** Desplazamiento horizontal vinculado al scroll (`scrub: 1`) a través de las columnas de manifesto sonoro.
* **Agenda de Gira (Tour Dates):** Tabla interactiva con filtros en vivo (*All*, *Festivals*, *Headline Shows*), resaltado magnético y botones de tickets con animación escalonada de caracteres en hover.
* **Footer Parallax Brand:** Revelación con paralaje vertical de la tipografía monumental *"PAUL KALKBRENNER"*.

---

## 📁 Archivos Creados

* [`index.html`](file:///Users/miileshorton/.gemini/antigravity/scratch/paul-kalkbrenner/index.html): Estructura semántica completa (`nav`, `hero`, `experience`, `recordings`, `tour-dates`, `live-setup`, `newsletter`, `footer`).
* [`styles.css`](file:///Users/miileshorton/.gemini/antigravity/scratch/paul-kalkbrenner/styles.css): Estilos brutalistas oscuros, tipografía moderna (`Syne`, `Space Mono`, `Plus Jakarta Sans`), paleta monocromática con acento verde neón (`#a7ff9c`) y diseño responsivo.
* [`script.js`](file:///Users/miileshorton/.gemini/antigravity/scratch/paul-kalkbrenner/script.js): Integración de Lenis Scroll, Web Audio API, GSAP ScrollTrigger y controles interactivos.

---

## 🚀 Cómo Probarlo Localmente

Inicia un servidor local en la carpeta del proyecto:

```bash
cd /Users/miileshorton/.gemini/antigravity/scratch/paul-kalkbrenner
python3 -m http.server 4000
```

Y visita [http://localhost:4000](http://localhost:4000) en tu navegador.
