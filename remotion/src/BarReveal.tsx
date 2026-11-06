/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Transición de Remotion (React) para video vertical 1080×1920 a 30 fps.
     Si el proyecto no tiene Remotion, créalo (npx create-video@latest), copia este
     archivo en src/ y registra una <Composition>. Duración: barRevealDuration(props).
   - Una barra delgada cruza el centro desde la derecha, se abre hasta cubrir toda la
     pantalla y revela el texto nuevo, línea por línea. Si "reverse" es true, al final
     se cierra y regresa al texto del inicio (sirve para bucles o para volver al video).
   - Para usarla ENCIMA de tu video: pon fromText en "" y background en "transparent";
     la barra tapa tu clip y muestra toText.
   - Ajustes:
     · fromText / toText: textos (líneas separadas con "\n")
     · background, color: escena inicial (blanco y negro por defecto)
     · barColor, revealColor: barra y texto revelado (negro y blanco por defecto)
     · font: archivo en public/ (por defecto Manrope.woff2) o nombre de una fuente
     · barHeight: grosor de la barra antes de abrirse (px)
     · step: cuadros de cada movimiento (30 = 1 s, como el original); hold: pausa
   - No cambies la curva expo.inOut del original salvo que el usuario lo pida.
   - Para renderizar: npx remotion render src/index.ts <Id> out/video.mp4
   ========================================================================== */
// Barra que revela (Remotion) · Miiles Estudio · inspirado en "Responsive Animated Navbar GSAP" de ahmedriad1
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type BarRevealProps = {
  fromText?: string;
  toText: string;
  background?: string;
  color?: string;
  barColor?: string;
  revealColor?: string;
  font?: string;
  fontSize?: number;
  barHeight?: number;
  step?: number;
  hold?: number;
  reverse?: boolean;
};

const EXPO = Easing.bezier(0.87, 0, 0.13, 1); // expo.inOut
const clamp = (v: number) => Math.max(0, Math.min(1, v));

export function barRevealDuration(p: BarRevealProps) {
  const step = p.step ?? 30, hold = p.hold ?? 45;
  const lines = p.toText.split("\n").length;
  const forward = hold + step + step * 0.9 + lines * 6 + 20 + hold;
  return Math.ceil(p.reverse === false ? forward : forward + step * 2 + hold);
}

export const BarReveal: React.FC<BarRevealProps> = ({
  fromText = "", toText, background = "#FFFFFF", color = "#111111", barColor = "#111111", revealColor = "#FFFFFF",
  font = "fonts/Manrope.woff2", fontSize = 110, barHeight = 30, step = 30, hold = 45, reverse = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Cargando tipografía"));
  const isFile = /\.(woff2?|otf|ttf)$/.test(font);
  useEffect(() => {
    if (!isFile) { continueRender(handle); return; }
    new FontFace("BR-Font", `url(${staticFile(font)})`).load().then((f) => { document.fonts.add(f); continueRender(handle); }).catch(() => continueRender(handle));
  }, [font, handle, isFile]);

  const lines = toText.split("\n");
  const forwardEnd = hold + step + step * 0.9 + lines.length * 6 + 20 + hold;
  // Tiempo "de la animación": va hacia adelante y, si reverse, regresa (como tl.reverse() del original)
  const t = reverse && frame > forwardEnd ? Math.max(0, forwardEnd - (frame - forwardEnd) * 1.0) : frame;

  const slideT = clamp((t - hold) / step);                      // la barra entra desde la derecha
  const growT = clamp((t - hold - step * 0.9) / step);          // se abre a pantalla completa (-=.1)
  const barX = width * 2 * (1 - EXPO(slideT));                   // right: -200vw → 0
  const barH = barHeight + (height - barHeight) * EXPO(growT);
  const family = `${isFile ? "BR-Font" : font}, Helvetica, Arial, sans-serif`;
  const textStyle: React.CSSProperties = { fontFamily: family, fontWeight: 600, fontSize, lineHeight: 1.05, letterSpacing: "-0.04em", textAlign: "center" };

  return (
    <AbsoluteFill style={{ background }}>
      {fromText && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 200px" }}>
          <div style={{ ...textStyle, color }}>{fromText.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>
        </AbsoluteFill>
      )}
      <div style={{ position: "absolute", left: barX, width, top: (height - barH) / 2, height: barH, background: barColor, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, width, top: (barH - height) / 2, height, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 200px" }}>
          <div style={{ ...textStyle, color: revealColor }}>
            {lines.map((l, i) => {
              // Cada línea aparece escalonada (stagger .2 del original, empezando 0.8 s antes de que termine de abrirse)
              const o = clamp((t - (hold + step * 0.9 + step * 0.2) - i * 6) / 20);
              return <div key={i} style={{ opacity: EXPO(o) }}>{l}</div>;
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
