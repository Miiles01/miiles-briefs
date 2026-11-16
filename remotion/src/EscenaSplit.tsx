/* ============================================================================
   ESCENA · PANTALLA DIVIDIDA "Los primeros 3 segundos" · Miiles Estudio
   ----------------------------------------------------------------------------
   Las Escenas son PARTES de un video. Esta va después del hook (mismo video, de 4.8 s a 12.95 s).
   Cómo se hace una pantalla dividida (split 50/50):
   1. El panel de arriba (1080 × 960) baja desde arriba en 14 cuadros con curva suave, y AL MISMO TIEMPO
      el video completo baja 720 px: su cara queda entera en la mitad de abajo (no se duplica el video).
   2. Arriba se ilustra lo que ella dice, sincronizado con su voz:
        · "los primeros tres segundos" → un reel con su barra de progreso: los primeros 3 s se llenan en azul
          y el contador corre 0:00 → 0:03.
        · "si no enganchas ahí, ya perdiste" → el reel se desliza hacia arriba (lo saltaron) y entra otro.
        · "una pregunta / algo que sorprenda / el resultado final" → tres tarjetas que se apilan, cada una
          cuando ella la dice.
   3. Los captions van en UNA línea, en caja blanca con texto negro, centrados sobre la línea del corte (y = 960).
   4. Al final el panel sube más rápido de lo que bajó (9 cuadros) y ella vuelve a pantalla completa.
   Video: public/creadora-hook.mp4 (desde el cuadro 146). Guion con tiempos por palabra (faster-whisper).
   ========================================================================== */
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TaskCard } from "./StackCards";
import { AZUL, CREMA, EASE, Fuentes, LAVANDA, ROSA, SANS, Tarjetas, clamp } from "./UGCMotor";

const FPS = 30;
const INICIO = 4.86;                                  // segundo del video donde empieza la escena
export const ESCENA_SPLIT_FRAMES = Math.round((12.95 - INICIO) * FPS);   // ≈ 243 cuadros (8.1 s)
const f = (seg: number) => Math.round((seg - INICIO) * FPS);           // segundo del video → cuadro de la escena

// Guion de este tramo (texto limpio + segundo del video en que empieza cada palabra)
const P: [string, number][] = [
  ["Y", 4.88], ["la", 5.02], ["respuesta", 5.2], ["está", 5.5], ["en", 5.78], ["los", 5.88], ["primeros", 6.0], ["tres", 6.44], ["segundos", 6.58],
  ["Si", 7.38], ["no", 7.5], ["enganchas", 7.64], ["ahí", 7.94], ["ya", 8.4], ["perdiste", 8.52],
  ["Empieza", 9.42], ["con", 9.62], ["una", 9.78], ["pregunta", 10.08], ["con", 10.7], ["algo", 10.76], ["que", 10.9], ["sorprenda", 11.08],
  ["o", 11.6], ["con", 11.72], ["el", 11.9], ["resultado", 12.08], ["final", 12.36],
];
const ini = (i: number) => f(P[i][1]);
// Captions: una línea cada uno
const GRUPOS: [number, number][] = [[0, 2], [3, 5], [6, 8], [9, 12], [13, 14], [15, 18], [19, 22], [23, 27]];

// ---------------------------------------------------------------------------
const BAJA = 720;   // px que baja el video: su cara (y≈250–910) queda completa en la mitad de abajo
const useAbierto = () => {
  const frame = useCurrentFrame();
  const entra = EASE(interpolate(frame, [0, 14], [0, 1], clamp));
  const sale = Easing.in(Easing.cubic)(interpolate(frame, [ESCENA_SPLIT_FRAMES - 9, ESCENA_SPLIT_FRAMES], [0, 1], clamp));
  return entra * (1 - sale);
};

const Palabra: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - ini(i), fps, config: { damping: 13, stiffness: 190, mass: 0.6 } });
  return (
    <span style={{ display: "inline-block", marginRight: "0.26em", opacity: frame < ini(i) ? 0 : Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 20}px) scale(${0.86 + 0.14 * p})` }}>
      {P[i][0]}
    </span>
  );
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {GRUPOS.map(([a, b], k) => {
        const desde = ini(a);
        const hasta = k + 1 < GRUPOS.length ? ini(GRUPOS[k + 1][0]) : ESCENA_SPLIT_FRAMES - 9;
        if (frame < desde || frame >= hasta) return null;
        const entra = spring({ frame: frame - desde, fps, config: { damping: 15, stiffness: 200, mass: 0.6 } });
        const sale = interpolate(frame, [hasta - 4, hasta], [1, 0], clamp);
        const idx = Array.from({ length: b - a + 1 }, (_, j) => a + j);
        return (
          <div key={k} style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", transform: `translateY(-50%) scale(${0.9 + 0.1 * entra})`, opacity: sale }}>
            <div style={{ background: "#FFFFFF", color: "#111111", fontFamily: SANS, fontWeight: 800, fontSize: 56, letterSpacing: "-0.035em", lineHeight: 1.1, padding: "18px 32px 20px", borderRadius: 16, whiteSpace: "nowrap" }}>
              {idx.map((i) => <Palabra key={i} i={i} />)}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// Panel 1: un reel con su barra de progreso; los primeros 3 s se llenan y luego lo saltan
const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 130, mass: 0.85 } });
  const t3 = EASE(interpolate(frame, [ini(6), ini(8) + 12], [0, 1], clamp));             // "primeros tres segundos"
  const seg = Math.min(3, Math.floor(t3 * 3 + 0.0001));
  const salta = Easing.in(Easing.cubic)(interpolate(frame, [ini(13) - 2, ini(13) + 12], [0, 1], clamp));   // "ya perdiste": lo saltan
  const otro = EASE(interpolate(frame, [ini(13) + 2, ini(13) + 18], [0, 1], clamp));
  const telefono = (src: string, extra: React.CSSProperties, barra: boolean) => (
    <div style={{ position: "absolute", left: 470 - 220, top: 70, width: 440, height: 800, borderRadius: 48, overflow: "hidden", background: "#111", ...extra }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {barra && (
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 30, height: 14, borderRadius: 14, background: "rgba(255,255,255,.45)", overflow: "hidden" }}>
          {/* los primeros 3 s de un reel de 30 s = 10 % de la barra */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${10 * t3}%`, background: AZUL, borderRadius: 14 }} />
        </div>
      )}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: CREMA, fontFamily: SANS }}>
      {telefono("carrusel/rosa.jpg", { transform: `translateY(${(1 - otro) * 900}px)`, opacity: otro }, false)}
      {telefono("carrusel/foto.jpg", { transform: `translateY(${(1 - entra) * 160 - salta * 980}px) rotate(${-salta * 6}deg) scale(${0.92 + 0.08 * entra})`, opacity: Math.min(1, entra * 1.5) }, true)}
      {/* contador 0:00 → 0:03 a la derecha del reel */}
      <div style={{ position: "absolute", left: 740, top: 400, fontSize: 112, fontWeight: 800, letterSpacing: "-0.04em", color: t3 > 0 ? AZUL : "#111111", fontVariantNumeric: "tabular-nums", opacity: Math.min(1, entra * 1.5) * (1 - salta) }}>
        0:0{seg}
      </div>
    </AbsoluteFill>
  );
};

// Panel 2: las tres maneras de empezar, una tarjeta cuando ella dice cada una (entran cada 30 cuadros)
const MANERAS: TaskCard[] = [
  { title: "Una pregunta", text: "¿Sabías que…? ¿Te ha pasado…?", bg: "#FFFFFF", color: "#111111" },
  { title: "Algo que sorprenda", text: "Un dato o un giro inesperado", bg: LAVANDA, color: "#111111" },
  { title: "El resultado final", text: "Muestra el después primero", bg: ROSA, color: "#111111" },
];
const CAMBIO = ini(15) - 6;   // "Empieza…": el reel se va y entran las tarjetas

const Panel: React.FC = () => {
  const frame = useCurrentFrame();
  const cruce = EASE(interpolate(frame, [CAMBIO, CAMBIO + 10], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ background: CREMA }}>
      <AbsoluteFill style={{ opacity: 1 - cruce, transform: `scale(${1 - 0.05 * cruce})` }}><Reel /></AbsoluteFill>
      {/* la 1.ª tarjeta cae en "una pregunta" (ini 17); luego una cada 30 cuadros ("algo", "el resultado") */}
      <Sequence from={ini(17) - 4}>
        <Tarjetas cards={MANERAS} enter={14} hold={16} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
export const EscenaSplit: React.FC = () => {
  const abierto = useAbierto();
  const frame = useCurrentFrame();
  const escala = 1 + 0.03 * EASE(interpolate(frame, [0, ESCENA_SPLIT_FRAMES], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      <Fuentes />
      {/* ella: el video completo baja para que su cara quede en la mitad de abajo (con audio; la galería lo quita) */}
      <AbsoluteFill style={{ transform: `translateY(${BAJA * abierto}px) scale(${escala})`, transformOrigin: "50% 30%" }}>
        <OffthreadVideo src={staticFile("creadora-hook.mp4")} trimBefore={Math.round(INICIO * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* arriba: el panel baja desde arriba */}
      <div style={{ position: "absolute", left: 0, top: -960 * (1 - abierto), width: 1080, height: 960, overflow: "hidden", background: CREMA }}>
        <Panel />
      </div>
      <Captions />
    </AbsoluteFill>
  );
};
