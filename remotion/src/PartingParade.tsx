/* ============================================================================
   CÓMO USAR ESTE COMPONENTE (instrucciones para tu asistente de IA:
   Claude, Codex, Gemini, Cursor, Antigravity o cualquier otro)
   ----------------------------------------------------------------------------
   - Componente de Remotion (React) para video vertical 1080×1920 a 30 fps.
     Si el proyecto no tiene Remotion, créalo (npx create-video@latest), copia este
     archivo en src/ y registra una <Composition> con estas props.
   - La cámara sigue a una imagen: un marco al centro, siempre del mismo tamaño, que
     va cambiando de foto. Detrás, un título gigante en dos líneas se queda quieto y luego
     avanza de golpe, como si la imagen cruzara la frase; se detiene y vuelve a avanzar.
     Cuando las letras pasan por el marco se abren para dejarle paso (la línea de arriba
     sube y la de abajo baja) y luego vuelven a su lugar.
   - "top" y "bottom": las dos líneas del título. "items": fotos del marco (src).
   - Ajustes: color, background, font (archivo en public/ o nombre), fontSize, weight,
     frameWidth / frameHeight (tamaño del marco en px), radius (esquinas del marco),
     framesPerImage (cuadros por foto), part (cuánto se abren las letras, 0-1).
   - La duración que hace un bucle perfecto es partingParadeDuration(props).
   - Para renderizar: npx remotion render src/index.ts PartingParade out/video.mp4
   ========================================================================== */
// Parting Letters Parade (Remotion) · Miiles Estudio · inspirado en el efecto 123 "Parting letters parade" de Made With GSAP
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

type Foto = { src: string };
export type PartingParadeProps = {
  top: string;
  bottom: string;
  items: Foto[];
  color?: string;
  background?: string;
  font?: string;
  fontSize?: number;
  weight?: number;
  frameWidth?: number;
  frameHeight?: number;
  radius?: number;
  framesPerImage?: number;
  part?: number;
};

export const exampleParadeItems: Foto[] = [
  { src: "carrusel/foto.jpg" }, { src: "carrusel/rosa.jpg" }, { src: "carrusel/gorra.jpg" }, { src: "carrusel/azul.jpg" },
];

export function partingParadeDuration(p: Partial<PartingParadeProps>) {
  return (p.items?.length ?? exampleParadeItems.length) * (p.framesPerImage ?? 60);
}

const SUAVE = Easing.bezier(0.65, 0, 0.35, 1);

export const PartingParade: React.FC<PartingParadeProps> = ({
  top, bottom, items, color = "#111111", background = "#FFFFFF", font = "fonts/Manrope.woff2",
  fontSize = 200, weight = 700, frameWidth = 380, frameHeight = 480, radius = 28, framesPerImage = 60, part = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const [handle] = useState(() => delayRender("Cargando tipografía"));
  const [ready, setReady] = useState(false);
  const isFile = /\.(woff2?|otf|ttf)$/.test(font);
  useEffect(() => {
    const done = () => { setReady(true); continueRender(handle); };
    if (!isFile) { done(); return; }
    new FontFace("PP-Font", `url(${staticFile(font)})`).load().then((f) => { document.fonts.add(f); done(); }).catch(done);
  }, [font, handle, isFile]);
  const family = `${isFile ? "PP-Font" : font}, Helvetica, Arial, sans-serif`;

  // Posición x de cada letra dentro de su línea (medidas reales con la tipografía cargada)
  const medir = useMemo(() => {
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.font = `${weight} ${fontSize}px ${family}`;
    const tracking = -0.04 * fontSize;
    return (texto: string) => {
      const t = texto + "   ";                      // espacio entre repeticiones
      const xs: number[] = []; let x = 0;
      for (const ch of t) { xs.push(x); x += ctx.measureText(ch).width + tracking; }
      return { letras: [...t], xs, ancho: x };
    };
  }, [fontSize, weight, family, ready]);
  const lineas = [medir(top), medir(bottom)];

  // Marco: crece al llegar cada foto y se encoge antes de cambiar
  const idx = Math.floor(frame / framesPerImage) % items.length;
  const t = (frame % framesPerImage) / framesPerImage;
  const escala = 1;                                     // el marco siempre mide lo mismo; solo cambia la foto
  const zoomFoto = interpolate(t, [0, 1], [1.12, 1]);
  const medioAlto = (frameHeight * escala) / 2;
  const medioAncho = (frameWidth * escala) / 2;

  const cx = width / 2, cy = height / 2;
  const separacion = fontSize * 0.5;                // las dos líneas, arriba y abajo del centro

  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {lineas.map((ln, li) => {
        // el texto pasa de izquierda a derecha (la cámara va con la imagen, que avanza a la izquierda)
        // el texto se queda quieto y luego avanza de golpe (la imagen cruza la frase), se detiene, y así
        const vueltas = durationInFrames / framesPerImage;
        const local = (frame % framesPerImage) / framesPerImage;
        const paso = Math.floor(frame / framesPerImage) + SUAVE(Math.max(0, Math.min(1, (local - 0.45) / 0.45)));
        const recorrido = (paso / vueltas) * ln.ancho;
        const base = -ln.ancho + (recorrido % ln.ancho) + (li === 0 ? 0 : ln.ancho * 0.37);
        const dir = li === 0 ? -1 : 1;
        const y0 = cy + (li === 0 ? -separacion : separacion);
        const piezas: React.ReactNode[] = [];
        for (let rep = 0; rep < Math.ceil(width / ln.ancho) + 2; rep++) {
          ln.letras.forEach((ch, k) => {
            if (ch === " ") return;
            const x = base + rep * ln.ancho + ln.xs[k];
            if (x < -fontSize || x > width + fontSize) return;
            // cuánto se aparta: máximo justo frente al marco, nada lejos de él
            const dx = Math.abs(x + fontSize * 0.28 - cx);
            // curva suave (campana): las letras frente al marco se abren justo lo necesario y las vecinas apenas
            const s = medioAncho + fontSize * 0.35;
            const cerca = Math.exp(-(dx * dx) / (2 * s * s));
            const empuje = cerca * (medioAlto - separacion + fontSize * 0.62) * part;
            piezas.push(
              <span key={`${rep}-${k}`} style={{
                position: "absolute", left: x, top: y0 - fontSize / 2, lineHeight: 1,
                transform: `translateY(${dir * Math.max(0, empuje)}px)`,
              }}>{ch}</span>,
            );
          });
        }
        return (
          <div key={li} style={{ position: "absolute", inset: 0, fontFamily: family, fontSize, fontWeight: weight, color, whiteSpace: "pre" }}>
            {piezas}
          </div>
        );
      })}

      {/* el marco que seguimos */}
      <div style={{
        position: "absolute", left: cx - frameWidth / 2, top: cy - frameHeight / 2, width: frameWidth, height: frameHeight,
        borderRadius: radius, overflow: "hidden", transform: `scale(${escala})`, background: "#EEEFF2",
      }}>
        <Img src={items[idx].src.startsWith("http") ? items[idx].src : staticFile(items[idx].src)} style={{
          width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoomFoto})`,
        }} />
      </div>
    </AbsoluteFill>
  );
};
