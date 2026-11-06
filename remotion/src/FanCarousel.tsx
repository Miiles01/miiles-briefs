/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Es un componente de Remotion (React). Si el proyecto no tiene Remotion,
     créalo (npx create-video@latest), copia este archivo y ./shared.tsx en src/
     y registra una <Composition> de 1080×1920 a 30 fps con estas props.
   - Fotos e íconos van en public/ y se pasan en "items":
       { src: "carpeta/foto.jpg" }                       → tarjeta con foto
       { color: "#4059F1", icon: "icono.svg", iconColor: "#FFF" } → tarjeta de color con un ícono SVG de una tinta
   - Personaliza SOLO con las props de abajo; no cambies las curvas de movimiento
     salvo que el usuario lo pida.
   - background: color de fondo (por defecto blanco).
   - cardWidth / cardHeight: tamaño de cada tarjeta.
   - hold / move: cuadros que se queda cada tarjeta y que dura el giro.
   - Para renderizar: npx remotion render src/index.ts <Id> out/video.mp4
   ========================================================================== */
// Abanico de tarjetas para video (Remotion) · Miiles Estudio · inspirado en "Carousel with drag and wheel" de supah
// La tarjeta activa queda al centro; las demás se abren en abanico hacia abajo y a los lados, girando desde su esquina,
// y se van apagando según se alejan. Cada pocos cuadros avanza a la siguiente tarjeta.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Card, CardFace } from "./shared";

export type FanCarouselProps = { items: Card[]; background?: string; cardWidth?: number; cardHeight?: number; hold?: number; move?: number };

const EASE = Easing.bezier(0, 0.02, 0, 1); // la misma curva del original: arranca rápido y frena largo

export const FanCarousel: React.FC<FanCarouselProps> = ({ items, background = "#FFFFFF", cardWidth = 560, cardHeight = 760, hold = 18, move = 26 }) => {
  const frame = useCurrentFrame();
  const n = items.length;
  const cycle = hold + move;
  const step = Math.floor(frame / cycle);
  const t = frame - step * cycle;
  const active = step + (t < hold ? 0 : EASE(interpolate(t, [hold, cycle], [0, 1], { extrapolateRight: "clamp" })));
  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {items.map((item, i) => {
        let d = ((i - active) % n + n) % n;
        if (d > n / 2) d -= n;
        const a = d / n;                       // igual que --active del original
        const z = n - Math.abs(d);
        const opacity = Math.max(0, Math.min(1, z / n * 3 - 2));
        return (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%", width: cardWidth, height: cardHeight,
            marginLeft: -cardWidth / 2, marginTop: -cardHeight / 2, borderRadius: 24, overflow: "hidden",
            zIndex: Math.round(z * 10), transformOrigin: "0% 100%",
            transform: `translate(${a * 800}%, ${a * 200}%) rotate(${a * 120}deg)`,
            background: item.color ?? "#EEEFF2", opacity: 0.15 + 0.85 * opacity,
          }}>
            <CardFace item={item} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
