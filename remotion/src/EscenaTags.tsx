/* ============================================================================
   ESCENA · NUBE DE ETIQUETAS "Ideas que se juntan" · Miiles Estudio
   ----------------------------------------------------------------------------
   Parte de un video (mismo video del hook, de 7.3 s a 12.95 s). Inspirada en "Magnetic Tag Cloud"
   (annnimate starter pack), recreada cuadro por cuadro:
   1. Ella habla con captions de UNA palabra grande (estilo UGC Versión 3).
   2. Corte a una página blanca: las etiquetas (pastillas de colores) salen una por una desde distintas
      direcciones y se pegan al centro como imán, con un pequeño rebote; al llegar empujan tantito a
      sus vecinas. "Una pregunta", "Algo que sorprenda" y "El resultado final" llegan cuando ella las dice.
   3. Los captions de una palabra siguen arriba, en negro, sobre la página blanca.
   Zona segura: nada arriba de y≈300 ni abajo de y≈1450.
   ========================================================================== */
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AZUL, DISPLAY, EASE, Fuentes, LAVANDA, ROSA, SANS, clamp } from "./UGCMotor";

const FPS = 30;
const INICIO = 7.3;
export const ESCENA_TAGS_FRAMES = Math.round((12.95 - INICIO) * FPS);   // 170 cuadros
const f = (seg: number) => Math.round((seg - INICIO) * FPS);
const CORTE = f(9.35);                                                  // corte a la página blanca

// Guion (palabra, segundo del video)
const P: [string, number][] = [
  ["Si", 7.38], ["no", 7.5], ["enganchas", 7.64], ["ahí", 7.94], ["ya", 8.4], ["perdiste", 8.52],
  ["Empieza", 9.42], ["con", 9.62], ["una", 9.78], ["pregunta", 10.08], ["con", 10.7], ["algo", 10.76], ["que", 10.9], ["sorprenda", 11.08],
  ["o", 11.6], ["con", 11.72], ["el", 11.9], ["resultado", 12.08], ["final", 12.36],
];
const ini = (i: number) => f(P[i][1]);
const conAcento = (t: string) => /[áéíóúüñÁÉÍÓÚÜÑ]/.test(t);

// ---------------------------------------------------------------------------
// Etiquetas: texto, colores, fila y cuándo llegan (cuadros de la escena)
const TINTA = "#111111", PIEDRA = "#E4E4E7";
type Tag = { t: string; bg: string; fg: string; fila: number; llega: number };
const TAGS: Tag[] = [
  { t: "Un dato", bg: PIEDRA, fg: TINTA, fila: 0, llega: 80 },
  { t: "Una pregunta", bg: AZUL, fg: "#FFFFFF", fila: 0, llega: ini(8) },          // cuando dice "una pregunta"
  { t: "Tu opinión", bg: ROSA, fg: TINTA, fila: 0, llega: 86 },
  { t: "Algo que sorprenda", bg: TINTA, fg: "#FFFFFF", fila: 1, llega: ini(11) }, // "algo que sorprenda"
  { t: "Un reto", bg: LAVANDA, fg: TINTA, fila: 1, llega: 92 },
  { t: "Un error común", bg: ROSA, fg: TINTA, fila: 2, llega: 112 },
  { t: "El resultado final", bg: AZUL, fg: "#FFFFFF", fila: 2, llega: ini(16) },   // "el resultado final"
  { t: "Una historia", bg: LAVANDA, fg: TINTA, fila: 3, llega: 118 },
  { t: "Un antes y después", bg: PIEDRA, fg: TINTA, fila: 4, llega: 146 },
  { t: "Un secreto", bg: TINTA, fg: "#FFFFFF", fila: 3, llega: 124 },
];
const FS = 44, ALTO = Math.round(FS * 2.3), PADX = Math.round(FS * 0.95);
const ancho = (t: string) => Math.round(t.length * FS * 0.53 + PADX * 2);   // aprox. Manrope 500
const DESFASE = [-30, 40, -40, 30, -20];                                           // filas irregulares
const GIRO = [-3, 4, -2, 3, -4, 2, -3, 4, -2, 3];                              // un poco chuecas en casa

/** Casa de cada etiqueta: filas pegadas (sin espacio), centradas, con desfase por fila. */
const CASAS = (() => {
  const filas = [0, 1, 2, 3, 4].map((r) => TAGS.map((tg, i) => ({ tg, i })).filter((x) => x.tg.fila === r));
  const out: { x: number; y: number }[] = [];
  filas.forEach((fila, r) => {
    const total = fila.reduce((a, x) => a + ancho(x.tg.t), 0);
    let x = -total / 2 + DESFASE[r];
    fila.forEach(({ tg, i }) => { const w = ancho(tg.t); out[i] = { x: x + w / 2, y: (r - 2) * ALTO }; x += w; });
  });
  return out;
})();
// desde dónde llega cada una (ángulo, lejos del centro)
const DESDE = TAGS.map((_, i) => { const a = (i * 137.5 * Math.PI) / 180; return { x: Math.cos(a) * 760, y: Math.sin(a) * 900 }; });

const Nube: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = 1 + 0.06 * EASE(interpolate(frame, [CORTE, ESCENA_TAGS_FRAMES], [0, 1], clamp));   // la cámara se acerca despacio
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <div style={{ position: "absolute", left: 540, top: 1000, transform: `scale(${zoom})` }}>
        {TAGS.map((tg, i) => {
          if (frame < tg.llega - 2) return null;
          const p = spring({ frame: frame - tg.llega, fps, config: { damping: 13, stiffness: 110, mass: 0.9 } });
          const casa = CASAS[i];
          // empujoncitos: cuando llega otra etiqueta cerca, esta se mueve un poco y regresa (resorte)
          let ex = 0, ey = 0, er = 0;
          TAGS.forEach((otra, j) => {
            if (j === i || frame < otra.llega + 8 || otra.llega < tg.llega) return;
            const dx = casa.x - CASAS[j].x, dy = casa.y - CASAS[j].y, d = Math.hypot(dx, dy) || 1;
            if (d > 420) return;
            const t = frame - otra.llega - 8;
            const golpe = 22 * (1 - d / 420) * Math.exp(-t / 9) * Math.sin(t / 2.2);
            ex += (dx / d) * golpe; ey += (dy / d) * golpe; er += golpe * 0.25;
          });
          const x = DESDE[i].x + (casa.x - DESDE[i].x) * p + ex;
          const y = DESDE[i].y + (casa.y - DESDE[i].y) * p + ey;
          const rot = (1 - p) * (i % 2 ? 40 : -40) + GIRO[i] * p + er;
          const w = ancho(tg.t);
          return (
            <div key={i} style={{
              position: "absolute", left: x - w / 2, top: y - ALTO / 2, width: w, height: ALTO, borderRadius: 999,
              background: tg.bg, color: tg.fg, fontFamily: SANS, fontWeight: 500, fontSize: FS, letterSpacing: "-0.03em",
              display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap",
              transform: `rotate(${rot}deg) scale(${0.7 + 0.3 * Math.min(1, p)})`, opacity: Math.min(1, p * 2.5),
            }}>{tg.t}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Captions estilo Versión 3: una palabra grande (Advercase si no lleva acento, Manrope si lleva)
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {P.map(([w], i) => {
        const desde = ini(i), hasta = i + 1 < P.length ? ini(i + 1) : ESCENA_TAGS_FRAMES;
        if (frame < desde || frame >= hasta) return null;
        const blanco = frame >= CORTE;                         // en la página blanca: negro y arriba
        const p = spring({ frame: frame - desde, fps, config: { damping: 12, stiffness: 180, mass: 0.7 } });
        const sale = interpolate(frame, [hasta - 3, hasta], [1, 0], clamp);
        const display = !conAcento(w);
        return (
          <div key={i} style={{
            position: "absolute", left: 90, right: 90, top: blanco ? 300 : 1090, textAlign: "center",
            color: blanco ? TINTA : "#FFFFFF", textShadow: blanco ? "none" : "0 2px 22px rgba(0,0,0,.45), 0 1px 3px rgba(0,0,0,.35)",
            fontFamily: display ? DISPLAY : SANS, fontWeight: display ? 400 : 800, fontSize: w.length > 11 ? 110 : 140, lineHeight: 1,
            letterSpacing: display ? "-0.02em" : "-0.045em", opacity: Math.min(1, p * 1.5) * sale,
            transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + 0.2 * p})`,
          }}>{w}</div>
        );
      })}
    </>
  );
};

export const EscenaTags: React.FC = () => {
  const frame = useCurrentFrame();
  const escala = 1 + 0.03 * EASE(interpolate(frame, [0, CORTE], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      <Fuentes />
      {/* ella (con audio; su voz sigue durante la página blanca) */}
      <AbsoluteFill style={{ transform: `scale(${escala})`, transformOrigin: "50% 30%" }}>
        <OffthreadVideo src={staticFile("creadora-hook.mp4")} trimBefore={Math.round(INICIO * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {frame >= CORTE && <Nube />}
      <Captions />
    </AbsoluteFill>
  );
};
