# Recreación de las Animaciones de dsgninterior.se

Este proyecto recrea de forma exacta las animaciones de la página principal de [dsgninterior.se/en](https://dsgninterior.se/en).

---

## 🔍 Análisis Técnico de las Animaciones

El sitio utiliza una combinación de **GSAP 3** y **Swiper.js** con efectos de paralaje vertical y revelación tipográfica sincronizada:

### 1. Animación de Entrada (*Welcome Reveal Animation*)
Al cargar el sitio, la página contiene la clase `.welcome`:
* El contenedor principal (`.home-banners`) inicia con `opacity: 0` y transiciona a `1` durante **2.0 segundos** (`ease: "power2.out"`).
* El texto del héroe (*"designing interiors / connecting people"*) está dividido en líneas (`SplitText`) con máscaras de recorte (`overflow: hidden`).
* A los **0.3 segundos**, las líneas de texto descienden suavemente desde `yPercent: -15` y `opacity: 0` hacia `yPercent: 0, opacity: 1` con duración de **1.0 segundo** (`ease: "power3.out"`), con un desfase escalonado (`stagger: 0.1s`).
* A los **0.4 segundos**, el encabezado (`.header`) y el pie de página (`.footer`) aparecen con un fundido suave de **1.5 segundos** (`ease: "power2.out"`).
* Al finalizar, se retira la clase `.welcome`.

```javascript
const tl = gsap.timeline({
  onComplete: () => document.querySelector('.homepage').classList.remove('welcome')
});

tl.fromTo('.home-banners', 
  { opacity: 0 }, 
  { opacity: 1, duration: 2, ease: 'power2.out' }
)
.fromTo('header.banner .split-line-inner', 
  { yPercent: -15, opacity: 0 }, 
  { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1 }, 
  '<.3'
)
.fromTo('.header', 
  { opacity: 0 }, 
  { opacity: 1, duration: 1.5, ease: 'power2.out' }, 
  '<.4'
)
.fromTo('.footer', 
  { opacity: 0 }, 
  { opacity: 1, duration: 1.5, ease: 'power2.out' }, 
  '<'
);
```

---

### 2. Slider Vertical con Efecto Paralaje (*Swiper Parallax*)
* Configurado en orientación vertical (`direction: "vertical"`), captura de rueda de ratón (`mousewheel`), gestos táctiles y navegación por teclado.
* **Efecto de profundidad**: 
  - La imagen/video de fondo se desplaza a una velocidad del **60%** (`data-swiper-parallax="60%"`).
  - El título se desplaza al **100%** (`data-swiper-parallax="100%"`), mientras que el texto interior tiene un contradesplazamiento (`data-swiper-parallax="-60"`).
* Al hacer clic en el título de la primera diapositiva, avanza automáticamente a la siguiente (`swiper.slideTo(1)`).
* Paginador lateral dinámico con desplazamiento vertical continuo animado mediante GSAP.

---

### 3. Indicador de Scroll Animado en el Footer
En el footer derecho se encuentra el indicador *"Scroll to explore"*, con una animación cíclica por fotogramas clave (`@keyframes scroll-indicator`):

```css
@keyframes scroll-indicator {
  0% { transform: translateY(-22%); opacity: 0; }
  30% { transform: translateY(-8%); opacity: 1; }
  70% { transform: translateY(8%); opacity: 1; }
  100% { transform: translateY(26%); opacity: 0; }
}
```

---

## 📁 Archivos del Proyecto

* [`index.html`](file:///Users/miileshorton/.gemini/antigravity/scratch/dsgn-animation/index.html): Documento HTML autónomo con videos y fotografías en alta definición de dsgn interior.
* [`styles.css`](file:///Users/miileshorton/.gemini/antigravity/scratch/dsgn-animation/styles.css): Estilos extraídos, variables de color (`#594037`, `#F6F5F4`), tipografía y reglas de paralaje.
* [`script.js`](file:///Users/miileshorton/.gemini/antigravity/scratch/dsgn-animation/script.js): Lógica de animación GSAP, Swiper y controlador de pruebas.

---

## 🚀 Cómo Visualizarlo

Puedes abrir directamente el archivo `index.html` en tu navegador o lanzar un servidor local:

```bash
cd /Users/miileshorton/.gemini/antigravity/scratch/dsgn-animation
python3 -m http.server 3000
```
Luego visita [http://localhost:3000](http://localhost:3000).
