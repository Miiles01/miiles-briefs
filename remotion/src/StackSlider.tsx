/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Es un componente de Remotion (React). Si el proyecto no tiene Remotion,
     créalo (npx create-video@latest), copia este archivo en src/
     y registra una <Composition> de 1080×1920 a 30 fps con estas props.
   - Fotos e íconos van en public/ y se pasan en "items":
       { src: "carpeta/foto.jpg" }                       → tarjeta con foto
       { color: "#4059F1", icon: "icono.svg", iconColor: "#FFF" } → tarjeta de color con un ícono SVG de una tinta
   - Personaliza SOLO con las props de abajo; no cambies las curvas de movimiento
     salvo que el usuario lo pida.
   - background: color de fondo (por defecto blanco).
   - cardWidth / cardHeight: tamaño de cada tarjeta. visible: cuántas se ven en la pila.
   - hold / move: cuadros que se queda la de enfrente y que dura el cambio.
   - Para renderizar: npx remotion render src/index.ts <Id> out/video.mp4
   ========================================================================== */
// Pila de tarjetas en 3D para video (Remotion) · Miiles Estudio · inspirado en "3D Card Slider - GSAP" de Madbones3
// Las tarjetas se apilan hacia el fondo y hacia arriba con perspectiva. La de enfrente se queda un momento,
// baja y sale del cuadro; la pila avanza un lugar y la que salió vuelve a entrar hasta atrás.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Card, CardFace } from "./shared";

export type StackSliderProps = { items: Card[]; background?: string; cardWidth?: number; cardHeight?: number; visible?: number; hold?: number; move?: number };

const CUBIC = Easing.bezier(0.83, 0, 0.17, 1); // la curva del original

export const StackSlider: React.FC<StackSliderProps> = ({ items, background = "#FFFFFF", cardWidth = 560, cardHeight = 700, visible = 5, hold = 24, move = 24 }) => {
  const frame = useCurrentFrame();
  const n = items.length;
  const cycle = hold + move;
  const step = Math.floor(frame / cycle);
  const t = frame - step * cycle;
  const k = t < hold ? 0 : CUBIC(interpolate(t, [hold, cycle], [0, 1], { extrapolateRight: "clamp" }));

  // Lugar de cada tarjeta en la pila: 0 = enfrente (abajo), visible-1 = la más lejana (arriba)
  const place = (s: number) => ({ y: -s * 110, z: -s * 170 });

  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {items.map((item, i) => {
        const slot = ((i - step) % n + n) % n;           // 0 = la de enfrente en este paso
        if (slot >= visible) return null;
        let y: number, z: number, opacity = 1;
        if (slot === 0) {
          // La de enfrente baja y sale del cuadro
          const a = place(0);
          y = a.y + k * 1500; z = a.z;
        } else {
          // Las demás avanzan un lugar hacia enfrente
          const a = place(slot), b = place(slot - 1);
          y = a.y + (b.y - a.y) * k; z = a.z + (b.z - a.z) * k;
          if (slot === visible - 1) opacity = k;           // la de hasta atrás aparece
        }
        return (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "58%", width: cardWidth, height: cardHeight,
            marginLeft: -cardWidth / 2, marginTop: -cardHeight / 2, borderRadius: 26, overflow: "hidden",
            background: item.color ?? "#EEEFF2", zIndex: 100 - slot, opacity,
            transform: `perspective(1400px) translate3d(0, ${y}px, ${z}px)`,
          }}>
            <CardFace item={item} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
