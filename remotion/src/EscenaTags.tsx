/* ============================================================================
   ESCENA · NUBE DE ETIQUETAS "Ideas que se juntan" · Miiles Estudio
   ----------------------------------------------------------------------------
   Parte de un video (mismo video del hook, de 7.3 s a 12.95 s). Inspirada en "Magnetic Tag Cloud"
   (annnimate starter pack), recreada cuadro por cuadro:
   1. Ella habla con captions de UNA palabra grande (estilo UGC Versión 3).
   2. Corte a una página blanca: los botones (UNA palabra + un ícono) entran desde todos los lados y una
      gravedad en el centro los jala; chocan y se pegan hasta formar una bola apretada (simulación física).
      "Pregunta", "Sorpresa" y "Resultado" dan un salto cuando ella dice esas palabras.
   3. Los captions de una palabra siguen arriba, en negro, sobre la página blanca.
   Zona segura: nada arriba de y≈300 ni abajo de y≈1450.
   ========================================================================== */
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AZUL, DISPLAY, EASE, Fuentes, LAVANDA, ROSA, SANS, clamp } from "./UGCMotor";
import { BookOpen, ChartColumn, CircleHelp, Flame, Heart, Lock, MessageCircle, Play, Smile, Sparkles, Target, TrendingUp, TriangleAlert, type LucideIcon } from "lucide-react";

const FPS = 30;
const INICIO = 7.3;
export const ESCENA_TAGS_FRAMES = Math.round((12.95 - INICIO) * FPS);   // 170 cuadros
const f = (seg: number) => Math.round((seg - INICIO) * FPS);
const CORTE = f(9.35);                                                  // corte a la página blanca

// Guion (palabra, segundo del video)
const P: [string, number][] = [
  ["Si", 7.38], ["no", 7.5], ["enganchas", 7.64], ["ahí", 7.94], ["ya", 8.4], ["perdiste", 8.52],
  ["Empieza", 9.42], ["con", 9.62], ["una", 9.78], ["pregunta", 10.08], ["con", 10.7], ["algo", 10.76], ["que", 10.9], ["sorprenda", 11.08],
  ["o", 11.6], ["con", 11.72], ["el", 11.9], ["resultado", 12.08], ["final", 12.36],
];
const ini = (i: number) => f(P[i][1]);
const conAcento = (t: string) => /[áéíóúüñÁÉÍÓÚÜÑ]/.test(t);

// ---------------------------------------------------------------------------
// Botones: UNA palabra + un ícono. Entran desde todos los lados (fuera del cuadro) y una "gravedad" en el
// centro los jala; chocan entre ellos y se van pegando hasta formar una bola apretada. Es una pequeña
// simulación física calculada cuadro por cuadro (siempre da el mismo resultado al renderizar).
const TINTA = "#111111", PIEDRA = "#E4E4E7";
type Boton = { t: string; Icono: LucideIcon; bg: string; fg: string; dice?: number };   // dice: palabra del guion que lo hace saltar
const BOTONES: Boton[] = [
  { t: "Pregunta", Icono: CircleHelp, bg: AZUL, fg: "#FFFFFF", dice: 9 },
  { t: "Sorpresa", Icono: Sparkles, bg: TINTA, fg: "#FFFFFF", dice: 13 },
  { t: "Resultado", Icono: TrendingUp, bg: ROSA, fg: TINTA, dice: 17 },
  { t: "Dato", Icono: ChartColumn, bg: LAVANDA, fg: TINTA },
  { t: "Historia", Icono: BookOpen, bg: PIEDRA, fg: TINTA },
  { t: "Reto", Icono: Target, bg: AZUL, fg: "#FFFFFF" },
  { t: "Error", Icono: TriangleAlert, bg: ROSA, fg: TINTA },
  { t: "Opinión", Icono: MessageCircle, bg: LAVANDA, fg: TINTA },
  { t: "Secreto", Icono: Lock, bg: TINTA, fg: "#FFFFFF" },
  { t: "Tendencia", Icono: Flame, bg: PIEDRA, fg: TINTA },
  { t: "Humor", Icono: Smile, bg: ROSA, fg: TINTA },
  { t: "Reacción", Icono: Heart, bg: AZUL, fg: "#FFFFFF" },
  { t: "Tutorial", Icono: Play, bg: LAVANDA, fg: TINTA },
];
const FS = 45, ALTO = Math.round(FS * 2.3), PADX = Math.round(FS * 0.85), ICONO = Math.round(FS * 0.95), HUECO = Math.round(FS * 0.32);
const ancho = (t: string) => Math.round(t.length * FS * 0.56 + PADX * 2 + ICONO + HUECO);
const SUELTA = (i: number) => CORTE + 2 + i * 3;          // cada botón entra 3 cuadros después del anterior
const GIRO = [-4, 3, -2, 5, -3, 2, -5, 4, -2, 3, -4, 2, 4, -3];

/** Simulación: posición y giro de cada botón en cada cuadro (desde el corte hasta el final). */
const SIM = (() => {
  const n = BOTONES.length;
  const W = BOTONES.map((b) => ancho(b.t));
  const p = BOTONES.map((_, i) => {                      // salen de alrededor, fuera del cuadro
    const a = (i / n) * Math.PI * 2 + (i % 2 ? 0.35 : -0.2);
    return { x: Math.cos(a) * 1150, y: Math.sin(a) * 1250 };
  });
  const v = p.map(({ x, y }) => { const d = Math.hypot(x, y); return { x: (-x / d) * 34, y: (-y / d) * 34 }; });
  const out: { x: number; y: number; r: number }[][] = [];
  for (let f = 0; f < ESCENA_TAGS_FRAMES; f++) {
    for (let i = 0; i < n; i++) {
      if (f < SUELTA(i)) continue;
      // gravedad hacia el centro (jala más en vertical que en horizontal: la bola queda ancha, no en columna) + freno
      v[i].x = (v[i].x - p[i].x * 0.011) * 0.86;
      v[i].y = (v[i].y - p[i].y * 0.032) * 0.86;
      p[i].x += v[i].x; p[i].y += v[i].y;
    }
    for (let it = 0; it < 6; it++) {                      // choques: los rectángulos no se enciman
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        if (f < SUELTA(i) || f < SUELTA(j)) continue;
        const dx = p[j].x - p[i].x, dy = p[j].y - p[i].y;
        const ox = (W[i] + W[j]) / 2 - Math.abs(dx), oy = ALTO - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        if (ox < oy) { const s = (dx >= 0 ? 1 : -1) * ox / 2; p[i].x -= s; p[j].x += s; const m = (v[i].x + v[j].x) / 2; v[i].x = v[j].x = m; }
        else { const s = (dy >= 0 ? 1 : -1) * oy / 2; p[i].y -= s; p[j].y += s; const m = (v[i].y + v[j].y) / 2; v[i].y = v[j].y = m; }
      }
    }
    out.push(p.map(({ x, y }, i) => ({ x, y, r: GIRO[i] + Math.max(-14, Math.min(14, v[i].x * 0.5)) })));   // se ladean según su velocidad
  }
  return { out, W };
})();

const Nube: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = 1 + 0.05 * EASE(interpolate(frame, [CORTE, ESCENA_TAGS_FRAMES], [0, 1], clamp));   // la cámara se acerca despacio
  const pos = SIM.out[Math.min(frame, SIM.out.length - 1)];
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <div style={{ position: "absolute", left: 540, top: 1010, transform: `scale(${zoom})` }}>
        {BOTONES.map((b, i) => {
          if (frame < SUELTA(i)) return null;
          const { x, y, r } = pos[i];
          const w = SIM.W[i];
          // salto cuando ella dice la palabra
          const salto = b.dice !== undefined ? spring({ frame: frame - ini(b.dice), fps, config: { damping: 9, stiffness: 220, mass: 0.6 } }) : 0;
          const pop = b.dice !== undefined && frame >= ini(b.dice) ? Math.sin(Math.PI * Math.min(1, salto)) * 0.14 : 0;
          return (
            <div key={i} style={{
              position: "absolute", left: x - w / 2, top: y - ALTO / 2, width: w, height: ALTO, borderRadius: 999,
              background: b.bg, color: b.fg, fontFamily: SANS, fontWeight: 500, fontSize: FS, letterSpacing: "-0.03em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: HUECO, whiteSpace: "nowrap",
              transform: `rotate(${r}deg) scale(${1 + pop})`, zIndex: pop > 0 ? 50 : i,
            }}>
              <b.Icono size={ICONO} strokeWidth={2.2} />
              {b.t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Captions estilo Versión 3: una palabra grande (Advercase si no lleva acento, Manrope si lleva)
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {P.map(([w], i) => {
        const desde = ini(i), hasta = i + 1 < P.length ? ini(i + 1) : ESCENA_TAGS_FRAMES;
        if (frame < desde || frame >= hasta) return null;
        const blanco = frame >= CORTE;                         // en la página blanca: negro y arriba
        const p = spring({ frame: frame - desde, fps, config: { damping: 12, stiffness: 180, mass: 0.7 } });
        const sale = interpolate(frame, [hasta - 3, hasta], [1, 0], clamp);
        const display = !conAcento(w);
        return (
          <div key={i} style={{
            position: "absolute", left: 90, right: 90, top: blanco ? 300 : 1090, textAlign: "center",
            color: blanco ? TINTA : "#FFFFFF", textShadow: blanco ? "none" : "0 2px 22px rgba(0,0,0,.45), 0 1px 3px rgba(0,0,0,.35)",
            fontFamily: display ? DISPLAY : SANS, fontWeight: display ? 400 : 800, fontSize: w.length > 11 ? 110 : 140, lineHeight: 1,
            letterSpacing: display ? "-0.02em" : "-0.045em", opacity: Math.min(1, p * 1.5) * sale,
            transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + 0.2 * p})`,
          }}>{w}</div>
        );
      })}
    </>
  );
};

export const EscenaTags: React.FC = () => {
  const frame = useCurrentFrame();
  const escala = 1 + 0.03 * EASE(interpolate(frame, [0, CORTE], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      <Fuentes />
      {/* ella (con audio; su voz sigue durante la página blanca) */}
      <AbsoluteFill style={{ transform: `scale(${escala})`, transformOrigin: "50% 30%" }}>
        <OffthreadVideo src={staticFile("creadora-hook.mp4")} trimBefore={Math.round(INICIO * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {frame >= CORTE && <Nube />}
      <Captions />
    </AbsoluteFill>
  );
};
