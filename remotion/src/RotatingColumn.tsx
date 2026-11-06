/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Componente de Remotion (React) para video vertical 1080×1920 a 30 fps.
     Si el proyecto no tiene Remotion, créalo (npx create-video@latest), copia este
     archivo en src/ y registra una <Composition> con estas props.
   - Columna de fotos cuadradas que sube: cada foto entra inclinada en 3D desde abajo,
     se endereza al pasar por el centro (ahí se detiene un momento) y sale inclinada al
     revés por arriba. Las de arriba y abajo se desvanecen hacia el fondo. Sin fin.
   - "items": fotos (src) o tarjetas de color con ícono.
   - Ajustes: background (blanco; el desvanecido toma este color), size (px),
     pitch (distancia entre fotos, px), tilt (inclinación máxima en grados),
     sway (vaivén a los lados, px), hold y move (cuadros), seed (cambia los ángulos).
   - Para renderizar: npx remotion render src/index.ts <Id> out/video.mp4
   ========================================================================== */
// Columna que gira (Remotion) · Miiles Estudio · inspirado en "Rotating On-Scroll Animations" (demo 1) de Codrops
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

type Card = { src?: string; color?: string; icon?: string; iconColor?: string };
export type RotatingColumnProps = { items: Card[]; background?: string; size?: number; pitch?: number; tilt?: number; sway?: number; hold?: number; move?: number; seed?: number };

const EASE = Easing.bezier(0.65, 0, 0.35, 1);

export const RotatingColumn: React.FC<RotatingColumnProps> = ({
  items, background = "#FFFFFF", size = 470, pitch = 700, tilt = 95, sway = 110, hold = 24, move = 26, seed = 3,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const n = items.length;
  const cycle = hold + move;
  const step = Math.floor(frame / cycle);
  const t = frame - step * cycle;
  const p = step + (t < hold ? 0 : EASE(interpolate(t, [hold, cycle], [0, 1], { extrapolateRight: "clamp" })));
  const rnd = (k: number) => { const x = Math.sin((k + seed) * 78.233) * 43758.5453; return x - Math.floor(x); };
  const fade = "linear-gradient(to bottom, transparent 2%, #000 30%, #000 70%, transparent 98%)";
  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      <AbsoluteFill style={{ WebkitMaskImage: fade, maskImage: fade }}>
        {items.map((item, i) => {
          let d = ((i - p) % n + n) % n;
          if (d > n / 2) d -= n;
          if (Math.abs(d) > 2) return null;
          // q: -1 (abajo, entrando) … 0 (centro) … 1 (arriba, saliendo); como en el original, la rotación va de +ángulo a -ángulo
          const q = Math.max(-1, Math.min(1, d / 1.5)); // a 1.5 pasos ya salió de cuadro
          const rx = (tilt * (0.75 + 0.5 * rnd(i))) * q;
          const ry = (rnd(i + 11) * 40 - 20) * q;
          const rz = (rnd(i + 23) * 40 - 20) * q;
          const z = Math.cos(q * Math.PI / 2) * -50 + 50;    // se hunde un poco al pasar (sin(π·progreso) del original)
          const x = Math.sin(i * 0.45 + p * 0.45) * sway;   // vaivén izquierda/derecha (onda senoidal del original)
          const y = height / 2 - d * pitch;
          return (
            <div key={i} style={{ position: "absolute", left: width / 2 - size / 2 + x, top: y - size / 2, width: size, height: size, perspective: 900, zIndex: Math.round(100 - Math.abs(d) * 10) }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: 16, overflow: "hidden", background: item.color ?? "#EEEFF2",
                transform: `translateZ(${-z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
              }}>
                {item.src && <Img src={item.src.startsWith("http") ? item.src : staticFile(item.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                {item.icon && (
                  <div style={{
                    position: "absolute", left: "50%", top: "50%", width: "40%", aspectRatio: "1 / 1", transform: "translate(-50%, -50%)", background: item.iconColor ?? "#fff",
                    WebkitMaskImage: `url(${staticFile(item.icon)})`, maskImage: `url(${staticFile(item.icon)})`, WebkitMaskSize: "contain", maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center",
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
