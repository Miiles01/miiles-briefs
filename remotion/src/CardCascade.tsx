/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Componente de Remotion (React) para video vertical 1080×1920 a 30 fps.
     Si el proyecto no tiene Remotion, créalo (npx create-video@latest), copia este
     archivo en src/ y registra una <Composition> con estas props.
   - Cascada de pasos: empieza ABIERTA (las tarjetas en diagonal, cada una más arriba,
     más a la derecha y un poco girada, con su número 01, 02, 03…). Luego el mazo se
     cierra en cascada (primero las de atrás) y queda apilado con la 01 encima. Después
     se vuelve a abrir en orden (01 → 05). Hace bucle perfecto.
   - "steps": tarjetas en orden: { title?, color, text } (el número se pone solo).
   - Ajustes: background, font (archivo en public/ o nombre), cardWidth / cardHeight,
     spread (cuánto se abren, 1 = normal), stagger (cuadros entre tarjeta y tarjeta),
     hold (cuadros abierta y cerrada).
   - Duración que hace bucle: cardCascadeDuration(props).
   - Para renderizar: npx remotion render src/index.ts CardCascade out/video.mp4
   ========================================================================== */
// Cascada de pasos (Remotion) · Miiles Estudio · inspirado en "Card Cascade Stagger"
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type Paso = { title?: string; color: string; text: string };
export type CardCascadeProps = {
  steps: Paso[];
  background?: string;
  font?: string;
  cardWidth?: number;
  cardHeight?: number;
  spread?: number;
  stagger?: number;
  hold?: number;
};

export const exampleSteps: Paso[] = [
  { title: "Idea", color: "#4059F1", text: "#FFFFFF" },
  { title: "Guion", color: "#FCB5B9", text: "#111111" },
  { title: "Graba", color: "#E8ECFE", text: "#111111" },
  { title: "Edita", color: "#1C1E2A", text: "#FFFFFF" },
  { title: "Entrega", color: "#F4F3EF", text: "#111111" },
];

export function cardCascadeDuration(p: Partial<CardCascadeProps>) {
  const n = p.steps?.length ?? 5, st = p.stagger ?? 4, h = p.hold ?? 45;
  const mov = 24 + st * (n - 1);          // lo que tarda la cascada completa
  return 2 * (h + mov);                   // abierta → se cierra → cerrada → se abre
}

const RESORTE = { stiffness: 200, damping: 25, mass: 0.9 };   // el mismo del original

export const CardCascade: React.FC<CardCascadeProps> = ({
  steps, background = "#FFFFFF", font = "fonts/Manrope.woff2", cardWidth = 430, cardHeight = 590, spread = 1, stagger = 4, hold = 45,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Cargando tipografía"));
  const isFile = /\.(woff2?|otf|ttf)$/.test(font);
  useEffect(() => {
    if (!isFile) { continueRender(handle); return; }
    new FontFace("CC-Font", `url(${staticFile(font)})`, { weight: "200 800" }).load().then((f) => { document.fonts.add(f); continueRender(handle); }).catch(() => continueRender(handle));
  }, [font, handle, isFile]);

  const n = steps.length, centro = (n - 1) / 2;
  const mov = 24 + stagger * (n - 1);
  const cierra = hold, abre = hold + mov + hold;               // inicio de cada cascada
  const esc = cardWidth / 128;                                 // el original mide 128 px de ancho

  return (
    <AbsoluteFill style={{ background, fontFamily: `${isFile ? "CC-Font" : font}, Helvetica, Arial, sans-serif` }}>
      {steps.map((s, i) => {
        const d = i - centro;
        // se cierra en cascada desde la de atrás (05 → 01) y se abre desde la de enfrente (01 → 05)
        const pc = spring({ frame: frame - cierra - (n - 1 - i) * stagger, fps, config: RESORTE });
        const pa = spring({ frame: frame - abre - i * stagger, fps, config: RESORTE });
        const abierta = 1 - pc + pa;                           // 1 = abierta, 0 = cerrada (puede pasarse un poco)
        const y = (d * -28 - 14) * esc * spread * abierta + d * 2 * esc * (1 - abierta);
        const x = d * 14 * esc * spread * abierta;
        const rot = d * 6 * abierta;
        const escala = 1 + (i === 0 ? 0.05 : -0.02) * abierta;   // la 01 un poco más grande al abrirse
        return (
          <div key={i} style={{
            position: "absolute", left: width / 2 - cardWidth / 2, top: height / 2 - cardHeight / 2 + 60, width: cardWidth, height: cardHeight,
            borderRadius: 44, background: s.color, color: s.text, zIndex: n - i,       // la 01 enfrente
            transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${escala})`,
            padding: "22px 36px 34px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 68, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
            {s.title && <span style={{ fontSize: 62, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1 }}>{s.title}</span>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
