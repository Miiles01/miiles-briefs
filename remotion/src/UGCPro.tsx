/* ============================================================================
   EDICIÓN UGC DE REFERENCIA (UGC-Pro) · Miiles Estudio
   ----------------------------------------------------------------------------
   Reel vertical 1080×1920 a 30 fps (30 s) sobre el video de una creadora hablando a cámara.
   Es la edición "modelo": cualquier IA que haga otra edición UGC debe seguir este sistema.

   CÓMO ESTÁ HECHA
   1. Guion real: el audio se transcribió con tiempos por palabra (faster-whisper, modelo medium)
      → la lista PALABRAS en UGCMotor.tsx (texto limpio + segundo en que empieza cada palabra).
   El motor (captions, cámara, split, pantallas, capa detrás) vive en UGCMotor.tsx; aquí solo está la configuración.
      Los captions aparecen palabra por palabra EXACTAMENTE cuando ella la dice.
   2. Los captions se agrupan a mano en GRUPOS de ~3 palabras por línea. Un grupo se ve
      desde su primera palabra hasta que empieza el siguiente: nunca hay dos textos a la vez.
   3. Cada grupo tiene un estilo:
        · "normal"  → blanco, debajo del rostro (y≈1150), sin caja.
        · "seam"    → en pantalla dividida: caja blanca, texto negro, centrado sobre la línea 50/50.
        · "clave"   → frase clave: una línea chica + una GRANDE (o un contador) que crece dentro del caption.
        · "tachar"  → una palabra se tacha con una línea rosa cuando la termina de decir.
        · "oculto"  → no se muestra (porque en ese momento habla una animación: carrusel o texto detrás).
   4. Momentos visuales (la tabla MOMENTOS): pantalla dividida, carrusel, texto detrás de la
      creadora (con las capas de recorte ugc-template-foreground.webm) y contadores.
   5. Cámara: push-in lento en las tomas completas y un "golpe" de zoom en cada frase clave.

   ARCHIVOS: public/ugc-template-raw.mp4 (video), public/ugc-template-foreground.webm (creadora
   recortada con alpha, generada con scripts/matte-video.mjs), public/fonts/, public/carrusel/.
   Render: npx remotion render src/index.ts UGC-Pro out/UGC-Pro.mp4 --muted   (la galería es sin audio)
   ========================================================================== */
import React from "react";
import { Sequence } from "remotion";
import { TiltWheel } from "./TiltWheel";
import { Config, EdicionUGC, Grupo, ITEMS_APPS, PAGOS, PerfilCero, Tarjetas, UGC_FRAMES, inicio } from "./UGCMotor";

export const UGC_PRO_FRAMES = UGC_FRAMES;

// Grupos de captions: [primera palabra, última palabra] (índices de PALABRAS en UGCMotor.tsx) y estilo
const GRUPOS: Grupo[] = [
  { de: 0, a: 2, estilo: "normal" },
  { de: 3, a: 5, estilo: "normal" },
  { de: 6, a: 9, estilo: "clave", grande: 7, display: false },                       // haciendo / MILES DE DÓLARES
  { de: 10, a: 12, estilo: "normal" },
  { de: 13, a: 15, estilo: "tachar", tachar: [15] },                                  // son los ~~influencers~~
  { de: 16, a: 18, estilo: "seam" },
  { de: 19, a: 21, estilo: "seam" },
  { de: 22, a: 24, estilo: "seam" },
  { de: 25, a: 27, estilo: "seam" },
  { de: 28, a: 30, estilo: "normal" },
  { de: 31, a: 33, estilo: "clave", grande: 33, display: true },                     // se llama / TECH UGC (delante: detrás no cabe sin chocar con la UI de arriba)
  { de: 34, a: 36, estilo: "normal" },
  { de: 37, a: 40, estilo: "normal" },
  { de: 41, a: 44, estilo: "normal" },
  { de: 45, a: 50, estilo: "clave", grande: 47, contador: { desde: 0, hasta: 1000, prefijo: "$", sufijo: " USD" } }, // más de / $1,000 USD
  { de: 51, a: 53, estilo: "normal" },
  { de: 54, a: 56, estilo: "normal" },
  { de: 57, a: 60, estilo: "tachar", tachar: [59, 60] },                              // vivo en ~~Estados Unidos~~
  { de: 61, a: 63, estilo: "clave", grande: 63 },                                     // vivo en / LATINOAMÉRICA
  { de: 64, a: 67, estilo: "normal", lineas: [66] },
  { de: 68, a: 73, estilo: "oculto" },                                                // carrusel (sin texto encima)
  { de: 74, a: 76, estilo: "seam" },
  { de: 77, a: 79, estilo: "seam" },
  { de: 80, a: 82, estilo: "seam" },
  { de: 83, a: 85, estilo: "seam" },
  { de: 86, a: 88, estilo: "seam" },
  { de: 89, a: 90, estilo: "seam" },
  { de: 91, a: 93, estilo: "normal" },
  { de: 94, a: 97, estilo: "normal", lineas: [96] },
  { de: 98, a: 104, estilo: "clave", grande: 100, contador: { desde: 10000, hasta: 0, sufijo: " seguidores" } }, // puedes tener / 0 seguidores
  { de: 105, a: 107, estilo: "normal" },
  { de: 108, a: 110, estilo: "normal" },
  { de: 111, a: 113, estilo: "normal" },
  { de: 114, a: 117, estilo: "normal", lineas: [116] },                               // Ok hay / dos maneras (con un 2 gigante detrás de ella)
];

const SPLIT_1 = { de: inicio(16) - 4, a: inicio(28) - 2 };          // "son los creadores sin comunidad"
const CARRUSEL = { de: inicio(68) - 3, a: inicio(74) - 1 };         // "para apps y plataformas de IA"
const SPLIT_2 = { de: inicio(74) - 1, a: inicio(91) - 2 };          // "te pagan… sin publicar en tus redes" (entra cuando el carrusel ya cerró)

const CFG: Config = {
  grupos: GRUPOS,
  golpes: [inicio(7), inicio(33), inicio(47), inicio(63), inicio(100)],
  splits: [
    { ...SPLIT_1, arriba: <PerfilCero /> },
    { ...SPLIT_2, arriba: <Tarjetas cards={PAGOS} /> },
  ],
  pantallas: [{
    ...CARRUSEL,
    contenido: (
      // la rueda se adelanta 130 cuadros: ya está alejada y girando como anillo
      <Sequence from={-130} durationInFrames={366} layout="none">
        <TiltWheel items={ITEMS_APPS} cardWidth={340} cardHeight={440} radius={520} tilt={28} hold={20} lejos={0.86} turns={2} />
      </Sequence>
    ),
  }],
  detras: [{ de: inicio(116) - 2, a: UGC_FRAMES, piezas: [{ texto: "2", left: 50, top: 330, size: 700 }] }],   // el 2 a un lado de su cabeza, dentro de la zona segura
};

export const UGCPro: React.FC = () => <EdicionUGC cfg={CFG} />;
