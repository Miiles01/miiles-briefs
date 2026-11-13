/* ============================================================================
   UGC · VERSIÓN 2 — "Texto directo y bloque dividido" · Miiles Estudio
   ----------------------------------------------------------------------------
   Personalidad: el texto manda. Captions más grandes (2 líneas de ~3 palabras), y las palabras que
   venden se RESALTAN con una caja blanca que barre detrás (texto negro). Un solo bloque dividido largo
   cuando explica cómo funciona (tú creas → para apps e IA → te pagan → sin publicar), con tarjetas que
   se apilan justo cuando ella dice cada idea. Sin carrusel ni texto detrás.
   Captions con el guion real y los tiempos de cada palabra (motor: UGCMotor.tsx).
   ========================================================================== */
import React from "react";
import { TaskCard } from "./StackCards";
import { Config, EdicionUGC, Grupo, LAVANDA, ROSA, Tarjetas, inicio } from "./UGCMotor";

const BLOQUE = { de: inicio(64) - 4, a: inicio(91) - 2 };   // de "Básicamente" a "personales"

// Cada tarjeta entra cada 49 cuadros: cae justo en "Básicamente", "apps", "te pagan" y "publicarlo"
const PASOS: TaskCard[] = [
  { title: "Tú creas", text: "Videos cortos, a tu estilo", bg: "#FFFFFF", color: "#111111" },
  { title: "Para apps e IA", text: "Marcas de tecnología", bg: LAVANDA, color: "#111111" },
  { title: "Te pagan", text: "Por cada video que entregas", bg: ROSA, color: "#111111" },
  { title: "Sin publicar", text: "Nada va a tus redes", bg: "#FFFFFF", color: "#111111" },
];

const GRUPOS: Grupo[] = [
  { de: 0, a: 5, estilo: "normal", lineas: [3] },
  { de: 6, a: 9, estilo: "normal", lineas: [7], marcar: [7, 8, 9] },          // miles de dólares
  { de: 10, a: 15, estilo: "tachar", lineas: [13], tachar: [15] },
  { de: 16, a: 21, estilo: "normal", lineas: [19] },
  { de: 22, a: 27, estilo: "normal", lineas: [25], marcar: [27] },            // comunidad
  { de: 28, a: 33, estilo: "normal", lineas: [31], marcar: [33] },            // Tech UGC
  { de: 34, a: 40, estilo: "normal", lineas: [37] },
  { de: 41, a: 44, estilo: "normal" },
  { de: 45, a: 50, estilo: "normal", lineas: [48], marcar: [45, 46, 47, 48] },  // más de mil dólares
  { de: 51, a: 53, estilo: "normal" },
  { de: 54, a: 60, estilo: "tachar", lineas: [57], tachar: [59, 60] },
  { de: 61, a: 63, estilo: "normal", marcar: [63] },                          // Latinoamérica
  // bloque dividido
  { de: 64, a: 67, estilo: "seam", lineas: [66] },
  { de: 68, a: 73, estilo: "seam", lineas: [71] },
  { de: 74, a: 79, estilo: "seam", lineas: [77] },
  { de: 80, a: 85, estilo: "seam", lineas: [83] },
  { de: 86, a: 90, estilo: "seam", lineas: [89] },
  { de: 91, a: 97, estilo: "normal", lineas: [95] },
  { de: 98, a: 101, estilo: "normal", lineas: [100], marcar: [100, 101] },     // cero seguidores
  { de: 105, a: 110, estilo: "normal", lineas: [108] },
  { de: 111, a: 113, estilo: "normal", marcar: [111] },                        // monetizar
  { de: 114, a: 117, estilo: "normal", lineas: [116], marcar: [116, 117] },    // dos maneras
];

const CFG: Config = {
  grupos: GRUPOS,
  tamCaption: 80,
  topCaption: 1090,
  golpes: [inicio(7), inicio(33), inicio(45), inicio(100), inicio(116)],
  splits: [{ ...BLOQUE, arriba: <Tarjetas cards={PASOS} enter={16} hold={33} /> }],
};

export const UGCVersionTwo: React.FC = () => <EdicionUGC cfg={CFG} />;
