/* ============================================================================
   UGC · VERSIÓN 3 — "Imágenes detrás de ella y una palabra por caption" · Miiles Estudio
   ----------------------------------------------------------------------------
   Personalidad: calmada y editorial. Un caption = UNA sola palabra grande: la que ella está diciendo
   en ese momento, en el cuadro exacto en que la dice. Advercase en palabras sin
   acento y Manrope en las acentuadas. En los momentos que lo piden aparecen fotos/íconos DETRÁS de
   ella, a los lados de su cabeza, dentro de la zona segura (y 380–1000), y al final un "2" gigante
   detrás mientras hace la señal del 2. Sin splits ni carrusel.
   Captions con el guion real y los tiempos de cada palabra (motor: UGCMotor.tsx).
   ========================================================================== */
import React from "react";
import { AZUL, Config, EdicionUGC, FotoDetras, LAVANDA, ROSA, UGC_FRAMES, gruposPalabra, inicio } from "./UGCMotor";

// fotos a los lados de la cabeza: la orilla de su pelo las tapa un poco (efecto "detrás")
const lados = (izq: FotoDetras["item"], der: FotoDetras["item"]): FotoDetras[] => [
  { item: izq, left: 40, top: 430, w: 260, h: 330, rot: -5 },
  { item: der, left: 785, top: 500, w: 255, h: 320, rot: 5, retraso: 6 },
];

const CFG: Config = {
  grupos: gruposPalabra(),
  golpes: [inicio(7), inicio(33), inicio(47), inicio(100)],
  splits: [],
  detras: [
    // "los creadores de contenido… no son los influencers"
    { de: inicio(2) - 2, a: inicio(16) - 2, fotos: lados({ src: "carrusel/foto.jpg" }, { src: "carrusel/rosa.jpg" }) },
    // "contenido para apps y plataformas de IA"
    { de: inicio(67) - 2, a: inicio(74) - 2, fotos: lados({ color: AZUL, icon: "carrusel/estrella.svg", iconColor: ROSA }, { color: LAVANDA, icon: "carrusel/miiles.svg", iconColor: AZUL }) },
    // "en tus redes sociales personales"
    { de: inicio(87) - 2, a: inicio(91) - 2, fotos: lados({ src: "carrusel/gorra.jpg" }, { src: "carrusel/azul.jpg" }) },
    // "hay dos maneras" + ella hace la señal del 2
    { de: inicio(116) - 2, a: UGC_FRAMES, piezas: [{ texto: "2", left: 50, top: 330, size: 700 }] },
  ],
};

export const UGCVersionThree: React.FC = () => <EdicionUGC cfg={CFG} />;
