import React from "react";
import { Img, staticFile } from "remotion";

export type Card = { src?: string; color?: string; icon?: string; iconColor?: string };

/** Contenido de una tarjeta: foto, o color sólido con un ícono SVG de una tinta. */
export const CardFace: React.FC<{ item: Card; iconSize?: string }> = ({ item, iconSize = "40%" }) => (
  <>
    {item.src && <Img src={item.src.startsWith("http") ? item.src : staticFile(item.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
    {item.icon && (
      <div
        style={{
          position: "absolute", left: "50%", top: "50%", width: iconSize, aspectRatio: "1 / 1",
          transform: "translate(-50%, -50%)", background: item.iconColor ?? "#fff",
          WebkitMaskImage: `url(${staticFile(item.icon)})`, maskImage: `url(${staticFile(item.icon)})`,
          WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
          WebkitMaskPosition: "center", maskPosition: "center",
        }}
      />
    )}
  </>
);

export const miilesCards: Card[] = [
  { src: "carrusel/foto.jpg" },
  { color: "#4059F1", icon: "carrusel/estrella.svg", iconColor: "#FCB5B9" },
  { src: "carrusel/rosa.jpg" },
  { color: "#FCB5B9", icon: "carrusel/flor.svg", iconColor: "#4059F1" },
  { src: "carrusel/azul.jpg" },
  { color: "#1C1E2A", icon: "carrusel/miiles.svg", iconColor: "#FCB5B9" },
  { color: "#4059F1", icon: "carrusel/flor.svg", iconColor: "#FFFFFF" },
  { src: "carrusel/gorra.jpg" },
  { color: "#FCB5B9", icon: "carrusel/estrella.svg", iconColor: "#1C1E2A" },
  { src: "carrusel/azul.jpg" },
];
