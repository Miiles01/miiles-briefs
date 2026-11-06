/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Componente de Remotion (React) para video vertical 1080×1920 a 30 fps.
     Si el proyecto no tiene Remotion, créalo (npx create-video@latest), copia este
     archivo en src/ y registra una <Composition> con estas props.
   - Columna de fotos que sube: la que pasa por el centro se hace grande y las demás
     se achican (solo una grande a la vez; columna centrada con las fotos alineadas a la izquierda). Avanza de una en una con una pausa en cada foto y da la vuelta sin fin.
   - "items": fotos (src) o tarjetas de color con ícono, como en los carruseles.
   - Ajustes: background (blanco), maxWidth / minWidth (foto grande y pequeña, px),
     ratio (alto ÷ ancho de las fotos, 1.25 = vertical), gap (px), hold y move (cuadros).
   - Para renderizar: npx remotion render src/index.ts <Id> out/video.mp4
   ========================================================================== */
// Columna de casos (Remotion) · Miiles Estudio · inspirado en la sección "Cases" de joffreyspitzer.com
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

type Card = { src?: string; color?: string; icon?: string; iconColor?: string };
export type CasesColumnProps = { items: Card[]; background?: string; maxWidth?: number; minWidth?: number; ratio?: number; gap?: number; hold?: number; move?: number };

const EASE = Easing.bezier(0.65, 0, 0.35, 1);

export const CasesColumn: React.FC<CasesColumnProps> = ({ items, background = "#FFFFFF", maxWidth = 620, minWidth = 240, ratio = 1.25, gap = 22, hold = 26, move = 22 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const n = items.length;
  const cycle = hold + move;
  const step = Math.floor(frame / cycle);
  const t = frame - step * cycle;
  const p = step + (t < hold ? 0 : EASE(interpolate(t, [hold, cycle], [0, 1], { extrapolateRight: "clamp" })));
  // Ancho según la distancia al centro (0 = la del centro)
  // Solo la del centro es grande: al salir del centro se encoge y la siguiente crece en su lugar
  const w = (d: number) => { const k = Math.max(0, 1 - Math.abs(d)); return minWidth + (maxWidth - minWidth) * k * k * (3 - 2 * k); };
  const colLeft = (width - maxWidth) / 2; // columna centrada, fotos alineadas a la izquierda (como el original)
  // Posición vertical: se apilan una tras otra con su alto real (integral de alto + espacio)
  const yAt = (d: number) => {
    const steps = 40, sign = Math.sign(d), abs = Math.abs(d);
    let y = 0;
    for (let s = 0; s < steps; s++) { const x = (s + 0.5) / steps * abs; y += (w(sign * x) * ratio + gap) * (abs / steps); }
    return sign * y;
  };
  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {items.map((item, i) => {
        let d = ((i - p) % n + n) % n;
        if (d > n / 2) d -= n;
        const cw = w(d), ch = cw * ratio, cy = height / 2 + yAt(d);
        if (cy + ch / 2 < -50 || cy - ch / 2 > height + 50) return null;
        return (
          <div key={i} style={{ position: "absolute", left: colLeft, top: cy - ch / 2, width: cw, height: ch, overflow: "hidden", borderRadius: 10, background: item.color ?? "#EEEFF2" }}>
            {item.src && <Img src={item.src.startsWith("http") ? item.src : staticFile(item.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            {item.icon && (
              <div style={{
                position: "absolute", left: "50%", top: "50%", width: "40%", aspectRatio: "1 / 1", transform: "translate(-50%, -50%)", background: item.iconColor ?? "#fff",
                WebkitMaskImage: `url(${staticFile(item.icon)})`, maskImage: `url(${staticFile(item.icon)})`, WebkitMaskSize: "contain", maskSize: "contain",
                WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center",
              }} />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
