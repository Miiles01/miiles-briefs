// Escena 01 (beta) · Reel 9:16 de 15 s armado desde el prompt "Contenido que se siente real"
// Cada toma del prompt es un bloque <Sequence>. Efectos: kinetic type, shake, bloom flash,
// digital zoom, speed ramp, whip pan, espejo vertical, slow push, clones estroboscópicos,
// cuadrícula con flashes, barrido de color y cierre de logo.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const OUT = Easing.out(Easing.cubic);
const IO = Easing.inOut(Easing.cubic);
const rnd = (k: number) => { const x = Math.sin(k * 91.3 + 7.7) * 43758.5453; return x - Math.floor(x); };
const shake = (f: number, amt: number) => `translate(${(rnd(f) - 0.5) * 2 * amt}px, ${(rnd(f + 99) - 0.5) * 2 * amt}px)`;

const FONT = "E1-Font, Manrope, Helvetica, Arial, sans-serif";
const Photo: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }} />
);
const Flash: React.FC<{ at: number; len?: number }> = ({ at, len = 8 }) => {
  const f = useCurrentFrame();
  const o = f < at ? 0 : 1 - clamp((f - at) / len);
  return <AbsoluteFill style={{ background: "#fff", opacity: o }} />;
};

// SHOT 1 — gancho: palabras que golpean + micro shake + sale en blanco
const Shot1: React.FC = () => {
  const f = useCurrentFrame();
  const words = ["¿Tu", "marca", "se", "ve", "igual", "que", "todas?"];
  const every = 5;
  const lastHit = Math.floor(f / every) * every;
  const shk = f - lastHit < 3 && f < words.length * every ? 6 : 0;
  const bloom = clamp((f - 38) / 7);
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", padding: "0 160px" }}>
      <div style={{ transform: shake(f, shk), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 28px", fontFamily: FONT, fontWeight: 600, fontSize: 130, lineHeight: 1.05, letterSpacing: "-0.045em", color: "#111" }}>
        {words.map((w, i) => {
          const k = f - i * every;
          if (k < 0) return <span key={i} style={{ opacity: 0 }}>{w}</span>;
          const s = 1 + 0.4 * Math.exp(-k / 2.2) * Math.cos(k * 0.9);
          return <span key={i} style={{ display: "inline-block", transform: `scale(${s})`, color: w === "igual" ? "#4059F1" : "#111" }}>{w}</span>;
        })}
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: bloom }} />
    </AbsoluteFill>
  );
};

// SHOT 2 — retrato: entra desde el blanco, zoom con speed ramp, sale con whip pan
const Shot2: React.FC = () => {
  const f = useCurrentFrame();
  const z = 1 + 0.28 * Easing.bezier(0.7, 0, 0.2, 1)(clamp(f / 40));
  const whip = clamp((f - 38) / 7);
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${-1100 * Easing.in(Easing.cubic)(whip)}px) scale(${z})`, filter: `brightness(${1 + 1.2 * (1 - clamp(f / 9))}) blur(${whip * 28}px)` }}>
        <Photo src="carrusel/foto.jpg" />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: 1 - clamp(f / 9) }} />
    </AbsoluteFill>
  );
};

// SHOT 3 — gorra: llega con el smear del whip pan y queda espejada en el eje vertical
const Shot3: React.FC = () => {
  const f = useCurrentFrame();
  const enter = clamp(f / 7);
  const half = (flip: boolean) => (
    <div style={{ position: "absolute", top: 0, bottom: 0, width: "50%", left: flip ? "50%" : 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 1080, left: flip ? -540 : 0, transform: flip ? "scaleX(-1)" : undefined }}>
        <Img src={staticFile("carrusel/gorra.jpg")} style={{ position: "absolute", left: -280, top: 0, height: "100%", width: 1640, objectFit: "cover" }} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${1100 * (1 - OUT(enter))}px)`, filter: `blur(${(1 - enter) * 28}px)` }}>
        {half(false)}{half(true)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// SHOT 4 — textura rosa, empuje lento + "Contenido real" por líneas; sale con zoom-through al blanco
const Shot4: React.FC = () => {
  const f = useCurrentFrame();
  const out = clamp((f - 48) / 12);
  const lines = ["Contenido", "real"];
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${(1 + 0.06 * (f / 60)) * (1 + 2 * Easing.in(Easing.cubic)(out))}) rotate(${2 * (f / 60)}deg)`, opacity: 1 - out }}>
        <Photo src="carrusel/rosa.jpg" />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 170, lineHeight: 1, letterSpacing: "-0.05em", color: "#111", textAlign: "center" }}>
          {lines.map((l, i) => {
            const k = IO(clamp((f - 6 - i * 5) / 14));
            return <div key={i} style={{ overflow: "hidden", paddingBottom: 10 }}><div style={{ transform: `translateY(${(1 - k) * 110}%)` }}>{l}</div></div>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// SHOT 5 — FIRMA: la tarjeta cruza en diagonal dejando 7 copias (time-slice) con speed ramp
const Shot5: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  // ramp: rápido → muy lento al centro → rápido
  const pos = (t: number) => { const x = clamp(t / 75); return x < 0.5 ? 0.5 - 0.5 * Math.pow(1 - x * 2, 3) : 0.5 + 0.5 * Math.pow(x * 2 - 1, 3); };
  const collapse = clamp((f - 60) / 12);
  const P = (p: number) => ({ x: -350 + (width + 700) * p, y: height + 300 - (height + 600) * p });
  const cards = ["carrusel/azul.jpg", "carrusel/foto.jpg", "carrusel/gorra.jpg", "carrusel/rosa.jpg"];
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      {Array.from({ length: 8 }, (_, i) => {
        const lag = (7 - i) * 3 * (1 - collapse);
        const p = pos(Math.max(0, f - lag));
        const { x, y } = P(p);
        const main = i === 7;
        return (
          <div key={i} style={{ position: "absolute", left: x - 230, top: y - 290, width: 460, height: 580, borderRadius: 22, overflow: "hidden", opacity: main ? 1 : (0.16 + 0.1 * i) * (1 - collapse), transform: `rotate(${-8 + p * 16}deg)` }}>
            <Photo src={cards[i % cards.length]} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// SHOT 6 — cuadrícula 2×2: una foto por golpe, con un cuadro blanco entre golpes
const Shot6: React.FC = () => {
  const f = useCurrentFrame();
  const imgs = ["carrusel/foto.jpg", "carrusel/rosa.jpg", "carrusel/gorra.jpg", "carrusel/azul.jpg"];
  const zoom = 1.08 - 0.08 * OUT(clamp(f / 60));
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 14, padding: 14 }}>
        {imgs.map((s, i) => (
          <div key={i} style={{ position: "relative", borderRadius: 18, overflow: "hidden", opacity: f >= i * 6 ? 1 : 0 }}><Photo src={s} /></div>
        ))}
      </AbsoluteFill>
      {[0, 6, 12, 18].map((at) => <Flash key={at} at={at} len={3} />)}
    </AbsoluteFill>
  );
};

// SHOT 7 — barrido azul de abajo hacia arriba y "Hecho por creadores"
const Shot7: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = IO(clamp(f / 14));
  const lines = ["Hecho por", "creadores"];
  const hit = f >= 26 && f < 30 ? 7 : 0;
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "#4059F1", transform: `translateY(${(1 - wipe) * 100}%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: shake(f, hit) }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 150, lineHeight: 1.02, letterSpacing: "-0.05em", color: "#fff", textAlign: "center" }}>
          {lines.map((l, i) => {
            const k = OUT(clamp((f - 10 - i * 8) / 12));
            return <div key={i} style={{ overflow: "hidden", paddingBottom: 8 }}><div style={{ transform: `translateY(${(1 - k) * 110}%)` }}>{l}</div></div>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// SHOT 8 — cierre: logo Miiles y "miiles.app" sobre blanco, con un bloom suave
const Shot8: React.FC = () => {
  const f = useCurrentFrame();
  const k = OUT(clamp(f / 18));
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ width: 300, height: 300, transform: `scale(${0.85 + 0.15 * k})`, opacity: k, background: "#111",
        WebkitMaskImage: `url(${staticFile("carrusel/miiles.svg")})`, maskImage: `url(${staticFile("carrusel/miiles.svg")})`,
        WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 64, letterSpacing: "-0.03em", color: "#111", opacity: OUT(clamp((f - 10) / 14)) }}>miiles.app</div>
      <AbsoluteFill style={{ background: "#fff", opacity: 0.7 * (1 - clamp(f / 14)) }} />
    </AbsoluteFill>
  );
};

// tiempos en cuadros (30 fps), siguiendo el timeline del prompt
const SHOTS: [React.FC, number, number][] = [
  [Shot1, 0, 45], [Shot2, 45, 45], [Shot3, 90, 45], [Shot4, 135, 60],
  [Shot5, 195, 75], [Shot6, 270, 60], [Shot7, 330, 60], [Shot8, 390, 60],
];
export const ESCENA01_FRAMES = 450;

export const Escena01: React.FC = () => {
  const [handle] = useState(() => delayRender("Cargando tipografía"));
  useEffect(() => {
    new FontFace("E1-Font", `url(${staticFile("fonts/Manrope.woff2")})`).load().then((f) => { document.fonts.add(f); continueRender(handle); }).catch(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {SHOTS.map(([C, from, len], i) => <Sequence key={i} from={from} durationInFrames={len}><C /></Sequence>)}
    </AbsoluteFill>
  );
};
