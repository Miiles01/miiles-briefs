/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Componente de Remotion (React) para video vertical 1080×1920 a 30 fps.
     Si el proyecto no tiene Remotion, créalo (npx create-video@latest), copia este
     archivo en src/ y registra una <Composition>. Duración: stickyGridDuration(props).
   - Las columnas de fotos entran (una desde arriba, la otra desde
     abajo), luego la cuadrícula hace zoom: las columnas de los lados se van hacia
     afuera y la del centro se abre, y aparece la frase sola en medio. Al final regresa
     (sirve como bucle).
   - "items": 12 fotos (3 columnas × 4 filas) o tarjetas de color con ícono.
   - Ajustes:
     · text: frase (líneas con "\n"), color, background (blanco por defecto)
     · font: archivo en public/ (Manrope.woff2 por defecto) · fontSize
     · zoom: cuánto se acerca la cuadrícula (2.05 como el original)
     · stretch: qué tan lento va (2.6 = cada segundo del original dura 2.6 s)
     · hold: cuadros de pausa con la frase sola; loop: true para regresar al inicio
   - No cambies las curvas (power1.inOut / power3.inOut) salvo que el usuario lo pida.
   - Para renderizar: npx remotion render src/index.ts <Id> out/video.mp4
   ========================================================================== */
// Cuadrícula que se abre (Remotion) · Miiles Estudio · inspirado en "Sticky Grid Scroll" de Théo Plawinski (Codrops)
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, CardFace } from "./shared";

export type StickyGridProps = {
  items: Card[];
  text: string;
  color?: string;
  background?: string;
  font?: string;
  fontSize?: number;
  zoom?: number;
  stretch?: number;
  hold?: number;
  loop?: boolean;
};

const P1 = Easing.bezier(0.45, 0, 0.55, 1);  // power1.inOut
const P3 = Easing.bezier(0.65, 0, 0.35, 1);  // power3.inOut
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ZOOM_AT = 0.62; // el zoom espera a que la cuadrícula esté completa (en el original se enciman por el scroll)
const TL = ZOOM_AT + 1; // largo de la línea de tiempo (s)

export function stickyGridDuration(p: Partial<StickyGridProps>) {
  const run = TL * (p.stretch ?? 2.6) * 30, hold = p.hold ?? 50;
  return Math.ceil(15 + run + hold + (p.loop === false ? 0 : run + 15));
}

export const StickyGrid: React.FC<StickyGridProps> = ({
  items, text, color = "#111111", background = "#FFFFFF", font = "fonts/Manrope.woff2", fontSize = 96,
  zoom = 2.05, stretch = 2.6, hold = 50, loop = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Cargando tipografía"));
  const isFile = /\.(woff2?|otf|ttf)$/.test(font);
  useEffect(() => {
    if (!isFile) { continueRender(handle); return; }
    new FontFace("SG-Font", `url(${staticFile(font)})`).load().then((f) => { document.fonts.add(f); continueRender(handle); }).catch(() => continueRender(handle));
  }, [font, handle, isFile]);
  const family = `${isFile ? "SG-Font" : font}, Manrope, Helvetica, Arial, sans-serif`;

  // Tiempo de la línea de tiempo original (0 → 1.08 s), hacia adelante y de regreso
  const run = TL * stretch * fps, start = 15;
  let f = frame - start;
  if (loop && f > run + hold) f = Math.max(0, run - (f - run - hold));
  const t = Math.max(0, Math.min(run, f)) / (stretch * fps);

  // Cuadrícula 3 × 4 cuadrada, centrada
  const cols = 3, rows = 4, colGap = 30, rowGap = 38;
  const gw = width - 80, cell = (gw - colGap * (cols - 1)) / cols;
  const gh = rows * cell + rowGap * (rows - 1);
  const dy = height - (height - gh) / 2; // distancia para empezar fuera de cuadro

  // Zoom (dura 1 s)
  const zt = clamp((t - ZOOM_AT) / 1);
  const z = P3(zt);
  const scale = 1 + (zoom - 1) * z;
  const centerSplit = P1(clamp((t - ZOOM_AT - 0.5) / 0.5)); // la columna del centro se abre (0.5 s, "-=0.5")

  const lines = text.split("\n");
  const titleIn = clamp((t - ZOOM_AT - 0.45) / 0.4); // la frase aparece cuando el centro se abre
  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: (width - gw) / 2, top: (height - gh) / 2, width: gw, height: gh, transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          const fromTop = c % 2 === 0;
          // entrada: columnas pares desde arriba (de la última a la primera), impares desde abajo; stagger 0.06
          const order = fromTop ? rows - 1 - r : r;
          const rt = P1(clamp((t - order * 0.06) / 0.5));
          let y = (1 - rt) * dy * (fromTop ? -1 : 1) / scale;
          let xPct = 0, yPct = 0;
          if (c === 0) xPct = -40 * z;
          if (c === 2) xPct = 40 * z;
          if (c === 1) yPct = (r < rows / 2 ? -1 : 1) * 40 * centerSplit;
          return (
            <div key={i} style={{
              position: "absolute", left: c * (cell + colGap), top: r * (cell + rowGap), width: cell, height: cell, overflow: "hidden",
              background: items[i % items.length].color ?? "#EEEFF2",
              transform: `translate(${xPct}%, ${yPct}%) translateY(${y}px)`,
            }}>
              <CardFace item={items[i % items.length]} />
            </div>
          );
        })}
      </div>
      {/* La frase va encima, al centro (dentro de la zona segura de Reels / TikTok) */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 200px", opacity: P1(titleIn) }}>
        <div style={{ textAlign: "center", color, fontFamily: family, fontWeight: 600, fontSize, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
          {lines.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
