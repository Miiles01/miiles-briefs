/* ============================================================================
   ESCENA · HOOK "Frase detrás de ella" · Miiles Estudio
   ----------------------------------------------------------------------------
   Las Escenas son PARTES de un video (no videos completos). Este es el hook: los primeros ~5 s.
   - Una frase en tres niveles (línea chica arriba, palabra GIGANTE, línea chica abajo) sigue su guion
     palabra por palabra y queda DETRÁS de ella (capas: video → frase → creadora recortada).
   - Su cabeza está muy arriba (y≈270) para caber debajo de la UI de la red social, así que la cámara
     la baja 230 px durante el hook y el hueco de arriba se rellena con el mismo video desenfocado.
     Al final regresa a su lugar para que la siguiente escena continúe normal.
   - Imágenes: aparecen a los lados de su cabeza (detrás de ella) cuando dice "marcas" y "video".
   - Zona segura: nada arriba de y≈300 ni abajo de y≈1450.
   Video: public/creadora-hook.mp4 · recorte: public/creadora-hook-foreground.webm (scripts/matte-video.mjs).
   Guion transcrito con faster-whisper (tiempos por palabra). Duración: 146 cuadros (4.9 s) a 30 fps.
   ========================================================================== */
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { EASE, Fuentes, SANS, clamp } from "./UGCMotor";

export const ESCENA_HOOK_FRAMES = 146;
const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

// Guion del hook (texto limpio + segundo en que empieza cada palabra)
const P: [string, number][] = [
  ["¿Saben", 0.58], ["qué", 0.98], ["es", 1.08], ["lo", 1.12], ["que", 1.24], ["más", 1.34], ["me", 1.44], ["preguntan", 1.68], ["las", 1.92], ["marcas?", 2.1],
  ["¿Cómo", 2.66], ["hacer", 2.8], ["que", 3.02], ["la", 3.14], ["gente", 3.28], ["no", 3.52], ["se", 3.76], ["salte", 3.9], ["el", 4.08], ["video?", 4.18],
];
const ini = (i: number) => f(P[i][1]);

// Cada frase: [primera, última] de la línea chica de arriba, la GIGANTE y la chica de abajo
type Frase = { de: number; a: number; arriba: [number, number]; grande: [number, number]; abajo?: [number, number]; tam: number };   // tam: que la gigante no se salga de 1080
const FRASES: Frase[] = [
  { de: 0, a: ini(10) - 2, arriba: [0, 7], grande: [8, 9], tam: 158 },                         // ¿Saben qué es lo que más me preguntan / LAS MARCAS?
  { de: ini(10) - 2, a: ESCENA_HOOK_FRAMES, arriba: [10, 14], grande: [15, 17], abajo: [18, 19], tam: 178 },   // ¿Cómo hacer que la gente / NO SE SALTE / el video?
];

const BAJA = 230;   // px que baja la cámara durante el hook
const useBaja = () => {
  const frame = useCurrentFrame();
  return BAJA * (1 - Easing.inOut(Easing.cubic)(interpolate(frame, [ESCENA_HOOK_FRAMES - 16, ESCENA_HOOK_FRAMES], [0, 1], clamp)));
};
const useCamara = () => 1 + 0.04 * EASE(interpolate(useCurrentFrame(), [0, ESCENA_HOOK_FRAMES], [0, 1], clamp));   // push-in lento

const Palabra: React.FC<{ i: number; grande?: boolean }> = ({ i, grande }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = ini(i);
  const p = spring({ frame: frame - d, fps, config: grande ? { damping: 12, stiffness: 140, mass: 0.8 } : { damping: 14, stiffness: 190, mass: 0.6 } });
  const texto = grande ? P[i][0].toUpperCase() : P[i][0];
  return (
    <span style={{ display: "inline-block", overflow: grande ? "hidden" : "visible", verticalAlign: "bottom", marginRight: grande ? "0.18em" : "0.24em", paddingBottom: grande ? "0.04em" : 0 }}>
      <span style={{
        display: "inline-block", opacity: frame < d ? 0 : Math.min(1, p * 1.5),
        transform: grande ? `translateY(${(1 - p) * 100}%)` : `translateY(${(1 - p) * 18}px)`,
        filter: grande ? "none" : `blur(${(1 - Math.min(1, p)) * 6}px)`,
      }}>{texto}</span>
    </span>
  );
};

const Linea: React.FC<{ r?: [number, number]; size: number; grande?: boolean }> = ({ r, size, grande }) => {
  if (!r) return null;
  const idx = Array.from({ length: r[1] - r[0] + 1 }, (_, k) => r[0] + k);
  return (
    <div style={{ fontSize: size, fontWeight: 800, lineHeight: grande ? 0.9 : 1.15, letterSpacing: grande ? "-0.055em" : "-0.03em", whiteSpace: "nowrap" }}>
      {idx.map((i) => <Palabra key={i} i={i} grande={grande} />)}
    </div>
  );
};

const FraseDetras: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {FRASES.map((fr, k) => {
        if (frame < fr.de || frame >= fr.a) return null;
        const sale = interpolate(frame, [fr.a - 5, fr.a], [1, 0], clamp);                  // sale rápido
        const sube = (1 - sale) * -40;
        return (
          <div key={k} style={{ position: "absolute", left: 0, right: 0, top: 318, textAlign: "center", color: "#FFFFFF", fontFamily: SANS, textShadow: "0 2px 24px rgba(0,0,0,.28)", opacity: sale, transform: `translateY(${sube}px)` }}>
            <Linea r={fr.arriba} size={48} />
            <Linea r={fr.grande} size={fr.tam} grande />
            {/* la de abajo cae a la altura de su cabeza: va a la izquierda, donde su silueta deja espacio */}
            <div style={{ textAlign: "left", paddingLeft: 74, marginTop: 6 }}><Linea r={fr.abajo} size={52} /></div>
          </div>
        );
      })}
    </>
  );
};

// Imágenes a los lados de su cabeza (detrás de ella)
type Foto = { src: string; left: number; top: number; w: number; h: number; rot: number; desde: number; hasta: number; play?: boolean };
const FOTOS: Foto[] = [
  { src: "carrusel/foto.jpg", left: 46, top: 700, w: 250, h: 320, rot: -6, desde: ini(9) - 2, hasta: ini(10) - 2 },        // "marcas"
  { src: "carrusel/rosa.jpg", left: 842, top: 760, w: 220, h: 290, rot: 6, desde: ini(9) + 3, hasta: ini(10) - 2 },
  { src: "carrusel/azul.jpg", left: 46, top: 720, w: 240, h: 330, rot: -5, desde: ini(19) - 3, hasta: ESCENA_HOOK_FRAMES, play: true },  // "el video"
];
const Fotos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {FOTOS.map((ft, k) => {
        if (frame < ft.desde || frame >= ft.hasta) return null;
        const p = spring({ frame: frame - ft.desde, fps, config: { damping: 13, stiffness: 150, mass: 0.8 } });
        const sale = interpolate(frame, [ft.hasta - 5, ft.hasta], [1, 0], clamp);
        return (
          <div key={k} style={{ position: "absolute", left: ft.left, top: ft.top, width: ft.w, height: ft.h, borderRadius: 24, overflow: "hidden", opacity: Math.min(1, p * 1.5) * sale, transform: `translateY(${(1 - p) * 80}px) rotate(${ft.rot * p}deg) scale(${0.8 + 0.2 * p})` }}>
            <Img src={staticFile(ft.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {ft.play && (
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 74, height: 74, marginLeft: -37, marginTop: -37, borderRadius: "50%", background: "rgba(255,255,255,.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 0, height: 0, borderTop: "15px solid transparent", borderBottom: "15px solid transparent", borderLeft: "24px solid #111", marginLeft: 6 }} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export const EscenaHook: React.FC = () => {
  const baja = useBaja();
  const escala = useCamara();
  const cam = { transform: `translateY(${baja}px) scale(${escala})`, transformOrigin: "50% 30%" };
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      <Fuentes />
      {/* relleno del hueco de arriba: el mismo video, más grande y desenfocado */}
      <AbsoluteFill style={{ transform: "scale(1.35)", filter: "blur(38px) brightness(.92)" }}>
        <OffthreadVideo src={staticFile("creadora-hook.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* video completo (con audio; la galería lo exporta sin audio) */}
      <AbsoluteFill style={cam}>
        {/* borde de arriba difuminado: se funde con el relleno desenfocado (sin corte duro) */}
        <OffthreadVideo src={staticFile("creadora-hook.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover", WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, #000 220px)", maskImage: "linear-gradient(to bottom, transparent 0px, #000 220px)" }} />
      </AbsoluteFill>
      {/* frase e imágenes: entre el video y la creadora; se mueven con la cámara */}
      <AbsoluteFill style={cam}>
        <Fotos />
      </AbsoluteFill>
      {/* la frase vive en coordenadas de pantalla (empieza en y=300, zona segura) y sube con la cámara al final */}
      <AbsoluteFill style={{ transform: `translateY(${baja - BAJA}px)` }}>
        <FraseDetras />
      </AbsoluteFill>
      <AbsoluteFill style={cam}>
        <Video src={staticFile("creadora-hook-foreground.webm")} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
