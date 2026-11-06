/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Componente de Remotion (React) para video vertical 1080×1920 a 30 fps.
     Si el proyecto no tiene Remotion, créalo (npx create-video@latest), copia este
     archivo en src/ y registra una <Composition> con estas props.
   - Una palabra repetida en filas que suben sin parar: cada fila entra grande por
     abajo y se va haciendo pequeña hasta salir por arriba (bucle perfecto).
   - Ajustes:
     · word: la palabra (corta, de 1 a 2 palabras)
     · background, color: fondo blanco y letras negras por defecto
     · font: archivo en public/ (por defecto Manrope.woff2) o nombre de una fuente
     · fontSize: tamaño de la fila más grande; minScale: tamaño de la de arriba (0.5)
     · rows: filas visibles a la vez; speed: px por segundo que sube
   - Para que el video haga bucle sin cortes, la duración debe ser múltiplo de
     (alto / rows) / speed segundos. endlessWordLoopFrames(props) te da ese número.
   - Para renderizar: npx remotion render src/index.ts <Id> out/video.mp4
   ========================================================================== */
// Palabra sin fin (Remotion) · Miiles Estudio · inspirado en "Endless Motion" de vanholtzco (OKAY DEV)
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type EndlessWordProps = {
  word: string;
  background?: string;
  color?: string;
  font?: string;
  fontSize?: number;
  minScale?: number;
  rows?: number;
  speed?: number;
};

export function endlessWordLoopFrames(p: EndlessWordProps, fps = 30, height = 1920) {
  const rows = p.rows ?? 5, speed = p.speed ?? 140;
  return Math.round(((height / rows) / speed) * fps);
}

export const EndlessWord: React.FC<EndlessWordProps> = ({
  word, background = "#FFFFFF", color = "#111111", font = "fonts/Manrope.woff2", fontSize = 300, minScale = 0.5, rows = 5, speed = 140,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Cargando tipografía"));
  const isFile = /\.(woff2?|otf|ttf)$/.test(font);
  useEffect(() => {
    if (!isFile) { continueRender(handle); return; }
    new FontFace("EW-Font", `url(${staticFile(font)})`).load().then((f) => { document.fonts.add(f); continueRender(handle); }).catch(() => continueRender(handle));
  }, [font, handle, isFile]);

  const rowH = height / rows;
  const shift = ((frame / fps) * speed) % rowH; // cuánto ha subido la cinta
  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {Array.from({ length: rows + 2 }, (_, i) => {
        const yCenter = (i + 0.5) * rowH - shift;              // centro de la fila en pantalla
        // Igual que el original: escala 1 al entrar por abajo y minScale al salir por arriba
        const progress = Math.max(0, Math.min(1, (height + rowH / 2 - yCenter) / (height + rowH)));
        const scale = 1 - (1 - minScale) * progress;
        return (
          <div key={i} style={{ position: "absolute", left: 0, width, top: yCenter - rowH / 2, height: rowH, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{
              fontFamily: `${isFile ? "EW-Font" : font}, Helvetica, Arial, sans-serif`, fontWeight: 600, fontSize, letterSpacing: "-0.06em",
              color, whiteSpace: "nowrap", lineHeight: 1, transform: `scale(${scale})`,
            }}>
              {word}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
