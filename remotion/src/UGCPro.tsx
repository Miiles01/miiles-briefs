/* ============================================================================
   EDICIÓN UGC DE REFERENCIA (UGC-Pro) · Miiles Estudio
   ----------------------------------------------------------------------------
   Reel vertical 1080×1920 a 30 fps (30 s) sobre el video de una creadora hablando a cámara.
   Es la edición "modelo": cualquier IA que haga otra edición UGC debe seguir este sistema.

   CÓMO ESTÁ HECHA
   1. Guion real: el audio se transcribió con tiempos por palabra (faster-whisper, modelo medium)
      → la lista PALABRAS de abajo (texto limpio + segundo en que empieza cada palabra).
      Los captions aparecen palabra por palabra EXACTAMENTE cuando ella la dice.
   2. Los captions se agrupan a mano en GRUPOS de ~3 palabras por línea. Un grupo se ve
      desde su primera palabra hasta que empieza el siguiente: nunca hay dos textos a la vez.
   3. Cada grupo tiene un estilo:
        · "normal"  → blanco, debajo del rostro (y≈1150), sin caja.
        · "seam"    → en pantalla dividida: caja blanca, texto negro, centrado sobre la línea 50/50.
        · "clave"   → frase clave: una línea chica + una GRANDE (o un contador) que crece dentro del caption.
        · "tachar"  → una palabra se tacha con una línea rosa cuando la termina de decir.
        · "oculto"  → no se muestra (porque en ese momento habla una animación: carrusel o texto detrás).
   4. Momentos visuales (la tabla MOMENTOS): pantalla dividida, carrusel, texto detrás de la
      creadora (con las capas de recorte ugc-template-foreground.webm) y contadores.
   5. Cámara: push-in lento en las tomas completas y un "golpe" de zoom en cada frase clave.

   ARCHIVOS: public/ugc-template-raw.mp4 (video), public/ugc-template-foreground.webm (creadora
   recortada con alpha, generada con scripts/matte-video.mjs), public/fonts/, public/carrusel/.
   Render: npx remotion render src/index.ts UGC-Pro out/UGC-Pro.mp4 --muted   (la galería es sin audio)
   ========================================================================== */
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill, Easing, OffthreadVideo, Sequence, continueRender, delayRender,
  interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { TiltWheel } from "./TiltWheel";
import { StackCards, TaskCard } from "./StackCards";

const FPS = 30;
export const UGC_PRO_FRAMES = 901;
const f = (s: number) => Math.round(s * FPS);
const EASE = Easing.bezier(0.22, 1, 0.36, 1);        // entradas
const SUAVE = Easing.bezier(0.65, 0, 0.35, 1);       // cámara
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SANS = "UP-Manrope, Helvetica, Arial, sans-serif";
const DISPLAY = "UP-Advercase, UP-Manrope, sans-serif"; // Advercase SOLO en palabras sin acento
const ROSA = "#FCB5B9";
const CREMA = "#F4F3EF";   // fondo del panel de arriba del split: la caja blanca del caption se distingue

// ---------------------------------------------------------------------------
// 1. Guion: texto limpio + segundo en que empieza cada palabra (de la transcripción)
// ---------------------------------------------------------------------------
const PALABRAS: [string, number][] = [
  ["Sí,", 0.0], ["los", 0.32], ["creadores", 0.42], ["de", 0.64], ["contenido", 0.8], ["están", 1.08], ["haciendo", 1.28], ["miles", 1.52], ["de", 1.74], ["dólares,", 1.88],
  ["pero", 2.18], ["no,", 2.44], ["no", 2.78], ["son", 2.96], ["los", 3.12], ["influencers.", 3.32],
  ["De", 3.96], ["hecho,", 4.06], ["son", 4.18], ["los", 4.3], ["creadores", 4.46], ["que", 4.82], ["no", 5.06], ["tienen", 5.26], ["ningún", 5.5], ["tipo", 5.82], ["de", 6.06], ["comunidad.", 6.26],
  ["¿Te", 6.72], ["preguntas", 6.88], ["cómo", 7.24], ["se", 7.58], ["llama?", 7.86], ["Tech UGC.", 8.18],
  ["Créeme", 9.2], ["que", 9.4], ["esto", 9.5], ["te", 9.64], ["va", 9.72], ["a", 9.8], ["interesar,", 9.84], ["porque", 10.16], ["yo", 10.38], ["he", 10.52], ["hecho", 10.56],
  ["más", 10.66], ["de", 10.86], ["mil", 10.96], ["dólares", 11.08], ["la", 11.32], ["hora", 11.6], ["con", 12.08], ["el", 12.38], ["Tech UGC.", 12.54],
  ["Y", 13.2], ["no,", 13.38], ["no", 13.52], ["vivo", 13.72], ["en", 13.86], ["Estados", 14.02], ["Unidos,", 14.28], ["vivo", 14.68], ["en", 14.9], ["Latinoamérica.", 15.02],
  ["Básicamente", 15.82], ["tú", 16.22], ["creas", 16.4], ["contenido", 16.6], ["para", 16.94], ["apps", 17.22], ["y", 17.44], ["plataformas", 17.6], ["de", 18.02], ["IA.", 18.16],
  ["Y", 18.54], ["te", 18.68], ["pagan", 18.84], ["por", 19.02], ["este", 19.28], ["contenido", 19.42], ["y", 19.8], ["tú", 19.94], ["no", 20.08], ["tienes", 20.18], ["que", 20.38], ["publicarlo", 20.56], ["en", 20.96], ["tus", 21.14], ["redes", 21.24], ["sociales", 21.44], ["personales.", 21.78],
  ["Por", 22.42], ["eso", 22.58], ["no", 22.68], ["necesitas", 22.88], ["ser", 23.2], ["ningún", 23.42], ["influencer,", 23.7], ["puedes", 24.42], ["tener", 24.58], ["cero", 24.96], ["seguidores", 25.24], ["sin", 25.64], ["poder", 25.8], ["hacerlo.", 26.02],
  ["Ok,", 26.52], ["si", 26.74], ["te", 26.88], ["preguntas", 27.06], ["cómo", 27.26], ["puedo", 27.52], ["monetizar", 27.74], ["todo", 28.2], ["esto.", 28.34], ["Ok,", 28.58], ["hay", 29.1], ["dos", 29.16], ["maneras…", 29.36],
];

// ---------------------------------------------------------------------------
// 2. Grupos de captions: [primera palabra, última palabra] (índices de PALABRAS) y estilo
// ---------------------------------------------------------------------------
type Estilo = "normal" | "seam" | "clave" | "tachar" | "oculto";
type Grupo = {
  de: number; a: number; estilo: Estilo;
  lineas?: number[];            // índice de la palabra donde empieza cada línea nueva
  grande?: number;              // "clave": desde esta palabra la línea va en grande
  display?: boolean;            // "clave": la parte grande va en Advercase (solo si no tiene acentos)
  contador?: { desde: number; hasta: number; prefijo?: string; sufijo?: string }; // "clave" con número
  tachar?: number[];            // palabras que se tachan
};
const GRUPOS: Grupo[] = [
  { de: 0, a: 2, estilo: "normal" },
  { de: 3, a: 5, estilo: "normal" },
  { de: 6, a: 9, estilo: "clave", grande: 7, display: false },                       // haciendo / MILES DE DÓLARES
  { de: 10, a: 12, estilo: "normal" },
  { de: 13, a: 15, estilo: "tachar", tachar: [15] },                                  // son los ~~influencers~~
  { de: 16, a: 18, estilo: "seam" },
  { de: 19, a: 21, estilo: "seam" },
  { de: 22, a: 24, estilo: "seam" },
  { de: 25, a: 27, estilo: "seam" },
  { de: 28, a: 30, estilo: "normal" },
  { de: 31, a: 32, estilo: "normal" },
  { de: 33, a: 33, estilo: "oculto" },                                                // TECH UGC detrás de ella
  { de: 34, a: 36, estilo: "normal" },
  { de: 37, a: 40, estilo: "normal" },
  { de: 41, a: 44, estilo: "normal" },
  { de: 45, a: 50, estilo: "clave", grande: 47, contador: { desde: 0, hasta: 1000, prefijo: "$", sufijo: " USD" } }, // más de / $1,000 USD
  { de: 51, a: 53, estilo: "normal" },
  { de: 54, a: 56, estilo: "normal" },
  { de: 57, a: 60, estilo: "tachar", tachar: [59, 60] },                              // vivo en ~~Estados Unidos~~
  { de: 61, a: 63, estilo: "clave", grande: 63 },                                     // vivo en / LATINOAMÉRICA
  { de: 64, a: 67, estilo: "normal", lineas: [66] },
  { de: 68, a: 73, estilo: "oculto" },                                                // carrusel (sin texto encima)
  { de: 74, a: 76, estilo: "seam" },
  { de: 77, a: 79, estilo: "seam" },
  { de: 80, a: 82, estilo: "seam" },
  { de: 83, a: 85, estilo: "seam" },
  { de: 86, a: 88, estilo: "seam" },
  { de: 89, a: 90, estilo: "seam" },
  { de: 91, a: 93, estilo: "normal" },
  { de: 94, a: 97, estilo: "normal", lineas: [96] },
  { de: 98, a: 104, estilo: "clave", grande: 100, contador: { desde: 10000, hasta: 0, sufijo: " seguidores" } }, // puedes tener / 0 seguidores
  { de: 105, a: 107, estilo: "normal" },
  { de: 108, a: 110, estilo: "normal" },
  { de: 111, a: 113, estilo: "normal" },
  { de: 114, a: 117, estilo: "normal", lineas: [116] },                               // Ok hay / dos maneras (con un 2 gigante detrás de ella)
];

const inicio = (i: number) => f(PALABRAS[i][1]);
const limpia = (t: string) => t.replace(/[.,]+$/, "");   // los captions no llevan comas ni puntos al final
const FIN_VIDEO = UGC_PRO_FRAMES;

// ---------------------------------------------------------------------------
// 3. Momentos visuales (cuadros a 30 fps)
// ---------------------------------------------------------------------------
const SPLIT_1 = { de: inicio(16) - 4, a: inicio(28) - 2 };          // "son los creadores sin comunidad"
const TECH = { de: inicio(33) - 2, a: inicio(34) - 2 };             // TECH UGC detrás
const CARRUSEL = { de: inicio(68) - 3, a: inicio(74) - 1 };         // "para apps y plataformas de IA"
const SPLIT_2 = { de: inicio(74) - 1, a: inicio(91) - 2 };          // "te pagan… sin publicar en tus redes" (entra cuando el carrusel ya cerró)
const DOS = { de: inicio(116) - 2, a: FIN_VIDEO };                  // 2 MANERAS detrás
// Cuánto está abierta la pantalla dividida (0 = pantalla completa, 1 = split 50/50). El panel de arriba
// baja con calma (14 cuadros) y sube más rápido (9); el video completo se desliza hacia abajo a la vez,
// así su cara queda entera en la mitad de abajo sin duplicar el video.
const SPLITS = [SPLIT_1, SPLIT_2];
const BAJA = 810;   // px que baja el video para que la cara quede en la mitad de abajo
const abiertoSplit = (frame: number) => {
  for (const sp of SPLITS) {
    if (frame < sp.de || frame >= sp.a) continue;
    const t = frame - sp.de, dur = sp.a - sp.de;
    const entra = EASE(interpolate(t, [0, 14], [0, 1], clamp));
    const sale = Easing.in(Easing.cubic)(interpolate(t, [dur - 9, dur], [0, 1], clamp));
    return entra * (1 - sale);
  }
  return 0;
};
const GOLPES = [inicio(7), inicio(47), inicio(63), inicio(100)];    // zoom en frases clave

// ---------------------------------------------------------------------------
const Fuentes: React.FC = () => {
  const [h] = useState(() => delayRender("Fuentes UGC-Pro"));
  useEffect(() => {
    Promise.all([
      new FontFace("UP-Manrope", `url(${staticFile("fonts/Manrope.woff2")})`, { weight: "200 800" }).load(),
      new FontFace("UP-Advercase", `url(${staticFile("fonts/Advercase-Regular.otf")})`).load(),
    ]).then((fs) => { fs.forEach((x) => document.fonts.add(x)); continueRender(h); }).catch(() => continueRender(h));
  }, [h]);
  return null;
};

// Cámara: push-in lento (1 → 1.05 en cada toma) + golpe de zoom en cada frase clave
const useCamara = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lento = 1 + 0.05 * SUAVE((frame % 300) / 300);
  const golpe = GOLPES.reduce((acc, g) => {
    if (frame < g) return acc;
    const s = spring({ frame: frame - g, fps, config: { damping: 14, stiffness: 160, mass: 0.7 } });
    const sale = interpolate(frame - g, [24, 40], [1, 0], clamp);
    return acc + 0.06 * s * sale;
  }, 0);
  return lento + golpe;
};

const VideoCompleto: React.FC = () => {
  const escala = useCamara();
  const baja = BAJA * abiertoSplit(useCurrentFrame());
  return (
    <AbsoluteFill style={{ transform: `translateY(${baja}px) scale(${escala})`, transformOrigin: "50% 32%" }}>
      {/* el único video con audio: la galería lo quita al exportar (rr.sh usa -an) */}
      <OffthreadVideo src={staticFile("ugc-template-raw.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Captions
// ---------------------------------------------------------------------------
const Palabra: React.FC<{ texto: string; desde: number; tachada?: boolean; finTachar?: number; color: string }> = ({ texto, desde, tachada, finTachar = 0, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - desde, fps, config: { damping: 13, stiffness: 190, mass: 0.6 } }); // entra con un poco de rebote
  const linea = tachada ? EASE(interpolate(frame, [finTachar, finTachar + 9], [0, 1], clamp)) : 0;
  if (frame < desde) return <span style={{ opacity: 0, marginRight: "0.26em" }}>{texto}</span>;
  return (
    <span style={{ position: "relative", display: "inline-block", marginRight: "0.26em", opacity: Math.min(1, p * 1.4) * (1 - 0.35 * linea), transform: `translateY(${(1 - p) * 26}px) scale(${0.86 + 0.14 * p})`, color }}>
      {texto}
      {tachada && <span style={{ position: "absolute", left: "-4%", right: "-4%", top: "54%", height: "0.13em", background: ROSA, transformOrigin: "0 50%", transform: `scaleX(${linea}) rotate(-3deg)`, borderRadius: 4 }} />}
    </span>
  );
};

const formato = (n: number) => Math.round(n).toLocaleString("en-US");

const Caption: React.FC<{ g: Grupo; desde: number; hasta: number }> = ({ g, desde, hasta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sale = interpolate(frame, [hasta - 4, hasta], [1, 0], clamp);   // sale rápido (salidas < entradas)
  const idx = Array.from({ length: g.a - g.de + 1 }, (_, k) => g.de + k);
  const seam = g.estilo === "seam";
  const color = seam ? "#111111" : "#FFFFFF";
  const sombra = seam ? "none" : "0 2px 18px rgba(0,0,0,.35)";

  if (g.estilo === "clave") {
    const chicas = idx.filter((i) => i < (g.grande ?? g.a));
    const grandes = idx.filter((i) => i >= (g.grande ?? g.a));
    const tg = inicio(g.grande!);
    const pg = spring({ frame: frame - tg, fps, config: { damping: 11, stiffness: 150, mass: 0.8 } });
    let grandeTxt: React.ReactNode;
    if (g.contador) {
      const t = EASE(interpolate(frame, [tg, tg + 26], [0, 1], clamp));
      const n = g.contador.desde + (g.contador.hasta - g.contador.desde) * t;
      grandeTxt = (
        <div style={{ fontFamily: SANS, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.95, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ fontSize: 190 }}>{g.contador.prefijo}{formato(n)}</span>
          <span style={{ display: "block", fontSize: 64, letterSpacing: "-0.03em", marginTop: 6 }}>{g.contador.sufijo?.trim()}</span>
        </div>
      );
    } else {
      const txt = grandes.map((i) => PALABRAS[i][0].replace(/[,.]$/, "")).join(" ");
      grandeTxt = (
        <div style={{ fontFamily: g.display ? DISPLAY : SANS, fontWeight: 800, fontSize: txt.length > 12 ? 118 : 150, letterSpacing: "-0.05em", lineHeight: 0.95 }}>
          {grandes.map((i) => (
            <Palabra key={i} texto={PALABRAS[i][0].replace(/[,.]$/, "")} desde={inicio(i)} color={color} />
          ))}
        </div>
      );
    }
    return (
      <AbsoluteFill style={{ opacity: sale, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 110, right: 110, top: 1010, textAlign: "center", color, textShadow: sombra }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em", marginBottom: 6 }}>
            {chicas.map((i) => <Palabra key={i} texto={limpia(PALABRAS[i][0])} desde={inicio(i)} color={color} />)}
          </div>
          <div style={{ transform: `scale(${0.7 + 0.3 * pg})`, opacity: frame < tg ? 0 : 1 }}>{grandeTxt}</div>
        </div>
      </AbsoluteFill>
    );
  }

  // normal / seam / tachar: líneas de ~3 palabras
  const lineas: number[][] = [];
  idx.forEach((i) => {
    if (lineas.length === 0 || g.lineas?.includes(i)) lineas.push([]);
    lineas[lineas.length - 1].push(i);
  });
  const entra = spring({ frame: frame - desde, fps, config: { damping: 15, stiffness: 200, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ opacity: sale, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 0, right: 0, top: seam ? 960 : 1130, display: "flex", justifyContent: "center",
        transform: seam ? `translateY(-50%) scale(${0.9 + 0.1 * entra})` : undefined,
      }}>
        <div style={{
          maxWidth: 820, textAlign: "center", color, textShadow: sombra, fontFamily: SANS, fontWeight: 800,
          fontSize: seam ? 58 : 68, lineHeight: 1.08, letterSpacing: "-0.035em",
          background: seam ? "#FFFFFF" : "transparent", padding: seam ? "20px 34px 22px" : 0, borderRadius: seam ? 16 : 0,
        }}>
          {lineas.map((l, k) => (
            <div key={k} style={{ whiteSpace: "nowrap" }}>
              {l.map((i) => {
                const tach = g.tachar?.includes(i);
                const ult = g.tachar ? Math.max(...g.tachar) : i;
                const finTachar = inicio(ult) + 9;   // se tacha mientras termina de decir la palabra
                return <Palabra key={i} texto={limpia(PALABRAS[i][0])} desde={inicio(i)} tachada={tach} finTachar={finTachar} color={color} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC = () => (
  <>
    {GRUPOS.map((g, k) => {
      if (g.estilo === "oculto") return null;
      const desde = inicio(g.de);
      const sig = GRUPOS[k + 1];
      const hasta = sig ? inicio(sig.de) : FIN_VIDEO;
      const fin = sig && sig.estilo === "oculto" ? Math.min(hasta, inicio(g.a) + 26) : hasta;   // si viene una animación, se va antes
      return (
        <Sequence key={k} from={desde} durationInFrames={fin - desde} layout="none">
          <Sequence from={-desde} layout="none"><Caption g={g} desde={desde} hasta={fin} /></Sequence>
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------
// Pantalla dividida 50/50: arriba una animación, abajo ella (cara completa), línea en y=960
// ---------------------------------------------------------------------------
const Split: React.FC<{ de: number; a: number; children: React.ReactNode }> = ({ de, children }) => {
  const abierto = abiertoSplit(useCurrentFrame() + de);   // useCurrentFrame es relativo al Sequence
  return (
    <AbsoluteFill>
      {/* abajo no hay otro video: el video completo baja (ver VideoCompleto) */}
      {/* arriba: la animación baja desde arriba */}
      <div style={{ position: "absolute", left: 0, top: -960 * (1 - abierto), width: 1080, height: 960, overflow: "hidden", background: CREMA }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Arriba del split 1: perfil sin comunidad (el contador de seguidores cae a 0)
const PerfilCero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 6, fps, config: { damping: 13, stiffness: 140, mass: 0.8 } });
  const n = interpolate(frame, [18, 48], [12400, 0], { ...clamp, easing: EASE });
  const num = n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${Math.round(n)}`;
  const stats: [string, string][] = [["Publicaciones", "0"], ["Seguidores", num], ["Seguidos", "0"]];
  return (
    <AbsoluteFill style={{ background: CREMA, alignItems: "center", justifyContent: "center", fontFamily: SANS }}>
      <div style={{ width: 760, background: "#FFFFFF", borderRadius: 40, padding: "56px 56px 60px", transform: `translateY(${(1 - p) * 120}px) scale(${0.92 + 0.08 * p})`, opacity: Math.min(1, p * 1.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ width: 150, height: 150, borderRadius: "50%", background: "#E8ECFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 800, color: "#4059F1" }}>@</div>
          <div>
            <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.03em", color: "#111" }}>@creadora.ugc</div>
            <div style={{ fontSize: 30, fontWeight: 500, color: "#6B6F80", marginTop: 6 }}>Cuenta nueva</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48 }}>
          {stats.map(([k, v]) => (
            <div key={k} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: k === "Seguidores" ? 92 : 64, fontWeight: 800, letterSpacing: "-0.04em", color: k === "Seguidores" ? "#4059F1" : "#111", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#6B6F80", marginTop: 10 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Arriba del split 2: tarjetas que se apilan (le pagan por el contenido)
const PAGOS: TaskCard[] = [
  { title: "Te pagan", text: "+$350 USD por 3 videos para una app", bg: "#E8ECFE", color: "#111111" },
  { title: "Nuevo brief", text: "App de IA · video de 30 s", bg: ROSA, color: "#111111" },
  { title: "Tus redes", text: "Intactas: no publicas nada", bg: "#FFFFFF", color: "#111111" },
];
const Pagos: React.FC = () => (
  <AbsoluteFill style={{ background: CREMA }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "translateY(-350px) scale(.9)", transformOrigin: "50% 0" }}>
      <StackCards cards={PAGOS} background="transparent" enter={16} hold={20} />
    </div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Texto detrás de la creadora (video → texto → creadora recortada encima)
// ---------------------------------------------------------------------------
type Pieza = { texto: string; left: number; top: number; size: number; retraso?: number };
const Detras: React.FC<{ piezas: Pieza[]; desde: number; dur: number }> = ({ piezas, desde, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const escala = useCamara();
  const sale = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill>
      {/* texto entre el video y la creadora: misma cámara que el video para que no "flote" */}
      <AbsoluteFill style={{ opacity: sale, transform: `scale(${escala})`, transformOrigin: "50% 32%" }}>
        {piezas.map((pz, k) => {
          const p = spring({ frame: frame - (pz.retraso ?? k * 4), fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
          return (
            <div key={k} style={{ position: "absolute", left: pz.left, right: pz.left < 0 ? pz.left : undefined, top: pz.top, overflow: "hidden", fontFamily: DISPLAY, color: "#FFFFFF", fontSize: pz.size, lineHeight: 0.92, letterSpacing: "-0.02em", textAlign: pz.left < 0 ? "center" : "left", whiteSpace: "nowrap" }}>
              <div style={{ transform: `translateY(${(1 - p) * 105}%)` }}>{pz.texto}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${escala})`, transformOrigin: "50% 32%" }}>
        <Video src={staticFile("ugc-template-foreground.webm")} trimBefore={desde} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Carrusel a pantalla completa con entrada y salida en círculo
// ---------------------------------------------------------------------------
const ITEMS_APPS = [
  { color: "#4059F1", icon: "carrusel/estrella.svg", iconColor: ROSA },
  { src: "carrusel/foto.jpg" },
  { color: ROSA, icon: "carrusel/flor.svg", iconColor: "#4059F1" },
  { src: "carrusel/azul.jpg" },
  { color: "#1C1E2A", icon: "carrusel/miiles.svg", iconColor: ROSA },
  { src: "carrusel/rosa.jpg" },
  { color: "#E8ECFE", icon: "carrusel/estrella.svg", iconColor: "#4059F1" },
  { src: "carrusel/gorra.jpg" },
];
const Carrusel: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  if (frame > dur) return null;
  const r = interpolate(frame, [0, 12], [0, 1250], { ...clamp, easing: EASE }) * interpolate(frame, [dur - 8, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at 50% 46%)`, background: "#FFFFFF" }}>
      {/* se adelanta la rueda 130 cuadros: ya está alejada y girando como anillo */}
      <Sequence from={-130} durationInFrames={366} layout="none">
        <TiltWheel items={ITEMS_APPS} cardWidth={340} cardHeight={440} radius={520} tilt={28} hold={20} lejos={0.86} turns={2} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
export const UGCPro: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
    <Fuentes />
    <VideoCompleto />
    <Sequence from={TECH.de} durationInFrames={TECH.a - TECH.de}>
      <Detras desde={TECH.de} dur={TECH.a - TECH.de} piezas={[{ texto: "TECH UGC", left: -40, top: 120, size: 225 }]} />
    </Sequence>
    <Sequence from={DOS.de} durationInFrames={DOS.a - DOS.de}>
      <Detras desde={DOS.de} dur={DOS.a - DOS.de + 20} piezas={[{ texto: "2", left: 40, top: 120, size: 820 }]} />
    </Sequence>
    <Sequence from={SPLIT_1.de} durationInFrames={SPLIT_1.a - SPLIT_1.de}>
      <Split de={SPLIT_1.de} a={SPLIT_1.a}><PerfilCero /></Split>
    </Sequence>
    <Sequence from={SPLIT_2.de} durationInFrames={SPLIT_2.a - SPLIT_2.de}>
      <Split de={SPLIT_2.de} a={SPLIT_2.a}><Pagos /></Split>
    </Sequence>
    {/* sin durationInFrames: la rueda necesita su duración completa para calcular sus fases; Carrusel se oculta solo */}
    <Sequence from={CARRUSEL.de}>
      <Carrusel dur={CARRUSEL.a - CARRUSEL.de} />
    </Sequence>
    <Captions />
  </AbsoluteFill>
);
