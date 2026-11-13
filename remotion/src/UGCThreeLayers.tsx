/* ============================================================================
   UGC · VERSIÓN 1 — "Split 50/50 y frase clave grande" · Miiles Estudio
   ----------------------------------------------------------------------------
   Personalidad: la que más usa la pantalla dividida. Cada vez que ella explica algo concreto,
   la mitad de arriba lo ilustra (perfil sin seguidores, ganancias que suben, cuadrícula de apps),
   y en pantalla completa las ideas fuertes crecen como frase clave. Sin carrusel ni texto detrás.
   Captions con el guion real y los tiempos de cada palabra (motor: UGCMotor.tsx).
   ========================================================================== */
import React from "react";
import { Config, CuadriculaApps, EdicionUGC, Ganancias, Grupo, PerfilCero, inicio } from "./UGCMotor";

const SPLIT_A = { de: inicio(16) - 4, a: inicio(28) - 2 };   // creadores sin comunidad → perfil en 0
const SPLIT_B = { de: inicio(34) - 4, a: inicio(54) - 2 };   // "he hecho más de mil dólares" → ganancias
const SPLIT_C = { de: inicio(64) - 4, a: inicio(74) - 2 };   // "creas contenido para apps e IA" → cuadrícula de apps

const GRUPOS: Grupo[] = [
  { de: 0, a: 2, estilo: "normal" },
  { de: 3, a: 5, estilo: "normal" },
  { de: 6, a: 9, estilo: "clave", grande: 7 },                         // haciendo / MILES DE DÓLARES
  { de: 10, a: 12, estilo: "normal" },
  { de: 13, a: 15, estilo: "tachar", tachar: [15] },
  // split A
  { de: 16, a: 18, estilo: "seam" },
  { de: 19, a: 21, estilo: "seam" },
  { de: 22, a: 24, estilo: "seam" },
  { de: 25, a: 27, estilo: "seam" },
  { de: 28, a: 30, estilo: "normal" },
  { de: 31, a: 33, estilo: "clave", grande: 33, display: true },      // se llama / TECH UGC
  // split B (el panel de arriba cuenta hasta $1,000 cuando ella dice "mil")
  { de: 34, a: 36, estilo: "seam" },
  { de: 37, a: 40, estilo: "seam" },
  { de: 41, a: 44, estilo: "seam" },
  { de: 45, a: 50, estilo: "seam", lineas: [48] },
  { de: 51, a: 53, estilo: "seam" },
  { de: 54, a: 56, estilo: "normal" },
  { de: 57, a: 60, estilo: "tachar", tachar: [59, 60] },
  { de: 61, a: 63, estilo: "clave", grande: 63 },                      // vivo en / LATINOAMÉRICA
  // split C
  { de: 64, a: 66, estilo: "seam" },
  { de: 67, a: 69, estilo: "seam" },
  { de: 70, a: 73, estilo: "seam" },
  { de: 74, a: 76, estilo: "normal" },
  { de: 77, a: 79, estilo: "normal" },
  { de: 80, a: 82, estilo: "normal" },
  { de: 83, a: 85, estilo: "normal" },
  { de: 86, a: 90, estilo: "normal", lineas: [89] },
  { de: 91, a: 93, estilo: "normal" },
  { de: 94, a: 97, estilo: "normal", lineas: [96] },
  { de: 98, a: 104, estilo: "clave", grande: 100, contador: { desde: 10000, hasta: 0, sufijo: " seguidores" } },
  { de: 105, a: 107, estilo: "normal" },
  { de: 108, a: 110, estilo: "normal" },
  { de: 111, a: 113, estilo: "normal" },
  { de: 114, a: 117, estilo: "clave", grande: 116 },                   // Ok hay / DOS MANERAS
];

const CFG: Config = {
  grupos: GRUPOS,
  golpes: [inicio(7), inicio(33), inicio(63), inicio(100), inicio(116)],
  splits: [
    { ...SPLIT_A, arriba: <PerfilCero /> },
    { ...SPLIT_B, arriba: <Ganancias cuenta={inicio(47) - SPLIT_B.de} /> },
    { ...SPLIT_C, arriba: <CuadriculaApps /> },
  ],
};

export const UGCThreeLayers: React.FC = () => <EdicionUGC cfg={CFG} />;
