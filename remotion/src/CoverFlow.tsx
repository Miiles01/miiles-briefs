/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Componente de Remotion (React) para video vertical 1080×1920 a 30 fps.
     Si el proyecto no tiene Remotion, créalo (npx create-video@latest), copia este
     archivo en src/ y registra una <Composition> con estas props.
   - Carrusel "cover flow": la tarjeta del centro va de frente y un poco más grande;
     las de los lados giran en 3D hacia el centro, se alejan y se desvanecen. Cada
     tantos cuadros avanza una tarjeta con un spring suave. Abajo, una pastilla con
     puntos marca la tarjeta activa. Hace bucle perfecto.
   - "items": fotos (src) o tarjetas de color con ícono (ver el bloque de tarjetas).
     Mejor 6 o más, para que el salto del bucle nunca se vea.
   - Ajustes: background, cardWidth / cardHeight (px), gap (separación entre tarjetas),
     angle (giro de las de los lados, grados), hold (cuadros quieta), move (cuadros
     que dura el paso), dots (mostrar la pastilla de puntos).
   - Duración que hace bucle: coverFlowDuration(props).
   - Para renderizar: npx remotion render src/index.ts CoverFlow out/video.mp4
   ========================================================================== */
// Cover flow (Remotion) · Miiles Estudio · inspirado en "Card Cover Flow" de Amicro (Subhan)
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, CardFace } from "./shared";

export type CoverFlowProps = {
  items: Card[];
  background?: string;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  angle?: number;
  hold?: number;
  move?: number;
  dots?: boolean;
};

export function coverFlowDuration(p: Partial<CoverFlowProps>) {
  return (p.items?.length ?? 8) * ((p.hold ?? 26) + (p.move ?? 22));
}

export const CoverFlow: React.FC<CoverFlowProps> = ({
  items, background = "#FFFFFF", cardWidth = 440, cardHeight = 586, gap = 215, angle = 38, hold = 26, move = 22, dots = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const n = items.length;
  const ciclo = hold + move;

  // posición continua del carrusel: k pasos completos + el spring del paso actual
  const k = Math.floor(frame / ciclo);
  const paso = spring({ frame: frame - k * ciclo - hold, fps, config: { damping: 28, stiffness: 200, mass: 1 }, durationInFrames: move });
  const pos = k + paso;

  // distancia circular de cada tarjeta a la activa (−n/2 … n/2): el bucle no tiene salto
  const dist = (i: number) => {
    let d = (i - pos) % n;
    if (d < -n / 2) d += n;
    if (d >= n / 2) d -= n;
    return d;
  };

  const cx = width / 2, cy = height / 2 - 40;
  const activa = ((Math.round(pos) % n) + n) % n;

  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, perspective: 1800, transformStyle: "preserve-3d" }}>
        {items
          .map((item, i) => ({ item, i, d: dist(i) }))
          .sort((a, b) => Math.abs(b.d) - Math.abs(a.d))          // las del centro, encima
          .map(({ item, i, d }) => {
            const a = Math.abs(d);
            if (a > 3) return null;
            const t = Math.min(1, a);                                // 0 = activa, 1 = ya está de lado
            const rot = -angle * Math.max(-1, Math.min(1, d));       // las de la izquierda miran a la derecha y viceversa
            const z = a < 1 ? interpolate(t, [0, 1], [120, -120]) : -a * 120;
            const escala = a < 1 ? interpolate(t, [0, 1], [1.1, 0.92]) : 1 - a * 0.08;
            const opacidad = interpolate(a, [0, 1.5, 2.6], [1, 1, 0], { extrapolateRight: "clamp" });   // sólidas; solo las de la orilla se desvanecen
            return (
              <div key={i} style={{
                position: "absolute", left: cx - cardWidth / 2, top: cy - cardHeight / 2, width: cardWidth, height: cardHeight,
                transform: `translateX(${d * gap}px) translateZ(${z}px) rotateY(${rot}deg) scale(${escala})`,
              }}>
                {/* la opacidad va en la cara (si va en el contenedor 3D, el navegador aplana el giro) */}
                <div style={{ position: "absolute", inset: 0, borderRadius: 34, overflow: "hidden", background: item.color ?? "#EEEFF2", opacity: opacidad }}>
                  <CardFace item={item} />
                </div>
              </div>
            );
          })}
      </div>
      {dots && (
        <div style={{ position: "absolute", left: 0, right: 0, top: cy + cardHeight / 2 + 110, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 28px", borderRadius: 99, background: "#F1F2F6" }}>
            {items.map((_, i) => {
              const cerca = Math.max(0, 1 - Math.abs(dist(i)));        // se estira suave al volverse la activa
              return <div key={i} style={{ height: 16, width: 16 + 40 * cerca, borderRadius: 99, background: i === activa ? "#111111" : `rgba(17,17,17,${0.22 + 0.6 * cerca})` }} />;
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
