/* ============================================================================
   ESCENA · PANTALLA DIVIDIDA "Entra y sale con motion" · Miiles Estudio
   ----------------------------------------------------------------------------
   Las Escenas son PARTES de un video. Esta va después del hook (mismo video, de 4.86 s a 12.95 s).
   Lo importante aquí es la TRANSICIÓN de la pantalla dividida (arriba solo pasa un carrusel de fotos):
   - Empieza a pantalla completa. En "primeros tres segundos" se abre el split:
       · el panel de arriba cae con un spring que se pasa un poco y se asienta;
       · ella baja 3 cuadros después con su propio spring (720 px: su cara queda entera abajo);
       · el carrusel de adentro llega con parallax (se mueve más que el panel) y todo lleva
         desenfoque de movimiento proporcional a la velocidad.
   - Antes del final se cierra, más rápido de lo que abrió: el panel acelera hacia arriba (ease-in) y
     ella regresa con un spring con rebote a pantalla completa.
   - Captions en UNA línea: en el split, caja blanca sobre la línea del corte (y = 960); a pantalla
     completa, texto blanco debajo de su cara.
   Video: public/creadora-hook.mp4. Guion con tiempos por palabra (faster-whisper).
   ========================================================================== */
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CREMA, EASE, Fuentes, SANS, clamp } from "./UGCMotor";

const FPS = 30;
const INICIO = 4.86;                                                     // segundo del video donde empieza la escena
export const ESCENA_SPLIT_FRAMES = Math.round((12.95 - INICIO) * FPS);   // ≈ 243 cuadros (8.1 s)
const f = (seg: number) => Math.round((seg - INICIO) * FPS);

const P: [string, number][] = [
  ["Y", 4.88], ["la", 5.02], ["respuesta", 5.2], ["está", 5.5], ["en", 5.78], ["los", 5.88], ["primeros", 6.0], ["tres", 6.44], ["segundos", 6.58],
  ["Si", 7.38], ["no", 7.5], ["enganchas", 7.64], ["ahí", 7.94], ["ya", 8.4], ["perdiste", 8.52],
  ["Empieza", 9.42], ["con", 9.62], ["una", 9.78], ["pregunta", 10.08], ["con", 10.7], ["algo", 10.76], ["que", 10.9], ["sorprenda", 11.08],
  ["o", 11.6], ["con", 11.72], ["el", 11.9], ["resultado", 12.08], ["final", 12.36],
];
const ini = (i: number) => f(P[i][1]);
const GRUPOS: [number, number][] = [[0, 2], [3, 5], [6, 8], [9, 12], [13, 14], [15, 18], [19, 22], [23, 27]];

// ---------------------------------------------------------------------------
// La transición
// ---------------------------------------------------------------------------
const ABRE = ini(6) - 4;       // "primeros tres segundos"
const CIERRA = ini(23) - 8;    // antes de "o con el resultado final"
const BAJA = 720;              // px que baja ella: su cara (y≈250–910) queda completa en la mitad de abajo
const PANEL = { damping: 15, stiffness: 120, mass: 0.9 };    // cae y se pasa apenas
const ELLA = { damping: 12, stiffness: 110, mass: 1 };       // un poco más de rebote
const REGRESO = { damping: 11, stiffness: 150, mass: 0.8 };  // al cerrar: rápida, con rebote

/** 0 = pantalla completa, 1 = split. Abre con spring; cierra con ease-in (más rápido). */
const panelEn = (frame: number, fps: number) => {
  const abre = spring({ frame: frame - ABRE, fps, config: PANEL });
  const cierra = interpolate(frame, [CIERRA, CIERRA + 10], [0, 1], { ...clamp, easing: (t) => t * t * t });
  return abre * (1 - cierra);
};
const ellaEn = (frame: number, fps: number) => {
  const baja = spring({ frame: frame - ABRE - 3, fps, config: ELLA });
  const sube = spring({ frame: frame - CIERRA - 2, fps, config: REGRESO });
  // al cerrar, el panel "jala" a ella: su orilla de arriba nunca queda debajo del panel (no se ve ningún hueco)
  return Math.min(baja - sube, (960 / BAJA) * panelEn(frame, fps) + (frame < CIERRA ? 99 : 0));
};
/** desenfoque de movimiento: proporcional a la velocidad (diferencia con el cuadro anterior) */
const borroso = (v: (fr: number) => number, frame: number, escala: number, max: number) => Math.min(max, Math.abs(v(frame) - v(frame - 1)) * escala);

// ---------------------------------------------------------------------------
// Arriba: solo un carrusel de fotos que pasa de lado
// ---------------------------------------------------------------------------
const FOTOS = ["carrusel/foto.jpg", "carrusel/rosa.jpg", "carrusel/gorra.jpg", "carrusel/azul.jpg"];
const ANCHO = 500, ALTO = 700, GAP = 36, VEL = 5;   // px por cuadro
const Carrusel: React.FC<{ parallax: number }> = ({ parallax }) => {
  const frame = useCurrentFrame();
  const paso = ANCHO + GAP, total = paso * FOTOS.length;
  const x = -((frame * VEL) % total);
  const tarjetas = [...FOTOS, ...FOTOS, ...FOTOS];
  return (
    <AbsoluteFill style={{ background: CREMA }}>
      <div style={{ position: "absolute", left: 0, top: (960 - ALTO) / 2, height: ALTO, transform: `translate(${x - paso / 2}px, ${parallax}px)` }}>
        {tarjetas.map((src, k) => (
          <div key={k} style={{ position: "absolute", left: k * paso, top: 0, width: ANCHO, height: ALTO, borderRadius: 34, overflow: "hidden" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Captions (una línea): caja blanca en el corte cuando hay split; blanco debajo de su cara si no
// ---------------------------------------------------------------------------
const Palabra: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - ini(i), fps, config: { damping: 13, stiffness: 190, mass: 0.6 } });
  return (
    <span style={{ display: "inline-block", marginRight: "0.26em", opacity: frame < ini(i) ? 0 : Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 20}px) scale(${0.86 + 0.14 * p})` }}>{P[i][0]}</span>
  );
};
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {GRUPOS.map(([a, b], k) => {
        const desde = ini(a);
        const hasta = k + 1 < GRUPOS.length ? ini(GRUPOS[k + 1][0]) : ESCENA_SPLIT_FRAMES;
        if (frame < desde || frame >= hasta) return null;
        // el estilo lo decide si el split está abierto cuando empieza el grupo (no cambia a la mitad)
        const enSplit = panelEn(desde + 6, fps) > 0.5 && desde + 6 < CIERRA;
        if (enSplit && frame >= CIERRA + 4) return null;                 // se va junto con el panel
        const fin = enSplit ? Math.min(hasta, CIERRA + 4) : hasta;
        const entra = spring({ frame: frame - desde, fps, config: { damping: 15, stiffness: 200, mass: 0.6 } });
        const sale = interpolate(frame, [fin - 4, fin], [1, 0], clamp);
        const idx = Array.from({ length: b - a + 1 }, (_, j) => a + j);
        return (
          <div key={k} style={{ position: "absolute", left: 0, right: 0, top: enSplit ? 960 : 1130, display: "flex", justifyContent: "center", transform: enSplit ? `translateY(-50%) scale(${0.9 + 0.1 * entra})` : undefined, opacity: sale }}>
            <div style={{ background: enSplit ? "#FFFFFF" : "transparent", color: enSplit ? "#111111" : "#FFFFFF", textShadow: enSplit ? "none" : "0 2px 18px rgba(0,0,0,.35)", fontFamily: SANS, fontWeight: 800, fontSize: enSplit ? 56 : 66, letterSpacing: "-0.035em", lineHeight: 1.1, padding: enSplit ? "18px 32px 20px" : 0, borderRadius: 16, whiteSpace: "nowrap" }}>
              {idx.map((i) => <Palabra key={i} i={i} />)}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
export const EscenaSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const panel = panelEn(frame, fps);
  const ella = ellaEn(frame, fps);
  const blurPanel = borroso((fr) => panelEn(fr, fps), frame, 60, 7);
  const blurElla = borroso((fr) => ellaEn(fr, fps), frame, 45, 5);
  const escala = 1 + 0.03 * EASE(interpolate(frame, [0, ESCENA_SPLIT_FRAMES], [0, 1], clamp));
  const parallax = (1 - Math.min(1, panel)) * -220;    // el carrusel llega un poco después que el panel
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      <Fuentes />
      {/* ella (con audio; la galería lo exporta sin audio) */}
      <AbsoluteFill style={{ transform: `translateY(${BAJA * ella}px) scale(${escala})`, transformOrigin: "50% 30%", filter: blurElla > 0.3 ? `blur(${blurElla}px)` : undefined }}>
        <OffthreadVideo src={staticFile("creadora-hook.mp4")} trimBefore={Math.round(INICIO * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* arriba: el panel cae desde arriba; mide 960 + 120 de colchón para que el rebote nunca muestre un hueco */}
      {panel > 0.001 && (
        <div style={{ position: "absolute", left: 0, top: -120 - 960 * (1 - panel), width: 1080, height: 1080, overflow: "hidden", background: CREMA, filter: blurPanel > 0.3 ? `blur(${blurPanel}px)` : undefined }}>
          <div style={{ position: "absolute", left: 0, top: 120, width: 1080, height: 960 }}>
            <Carrusel parallax={parallax} />
          </div>
        </div>
      )}
      <Captions />
    </AbsoluteFill>
  );
};
