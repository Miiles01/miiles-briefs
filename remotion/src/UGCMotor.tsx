/* ============================================================================
   MOTOR DE EDICIÓN UGC · Miiles Estudio
   ----------------------------------------------------------------------------
   Todo lo que comparten las ediciones UGC (UGC-Pro y las versiones 1, 2 y 3):
   - PALABRAS: el guion real con el segundo en que empieza cada palabra (transcripción con faster-whisper).
   - Captions sincronizados: cada palabra entra cuando ella la dice. Estilos de grupo:
       normal · seam (en split) · clave (línea chica + grande o contador) · tachar · marcar (resaltado) · palabra (una sola, grande).
   - Cámara (push-in lento + golpes de zoom), pantalla dividida 50/50 (el video baja, el panel de arriba entra),
     pantallas completas con entrada en círculo (carruseles) y capa "detrás de ella" (texto o fotos entre el
     video y la creadora recortada).
   - Paneles listos: PerfilCero, Pagos, Ganancias, CuadriculaApps, Tarjetas.
   Cada edición solo arma un objeto Config (qué grupos, qué splits, qué momentos) y llama <EdicionUGC cfg={…} />.
   Reglas: docs/GUIA-EDICION-UGC.md (zona segura, nunca dos textos a la vez, nada de texto sobre carruseles).
   ========================================================================== */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender,
  interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { StackCards, TaskCard } from "./StackCards";
import { GridFlip } from "./GridFlip";
import { Card, CardFace } from "./shared";

export const FPS = 30;
export const UGC_FRAMES = 901;
export const f = (s: number) => Math.round(s * FPS);
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const SUAVE = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const SANS = "UM-Manrope, Helvetica, Arial, sans-serif";
export const DISPLAY = "UM-Advercase, UM-Manrope, sans-serif";   // Advercase SOLO sin acentos
export const ROSA = "#FCB5B9";
export const AZUL = "#4059F1";
export const LAVANDA = "#E8ECFE";
export const CREMA = "#F4F3EF";
const conAcento = (t: string) => /[áéíóúüñÁÉÍÓÚÜÑ]/.test(t);

// ---------------------------------------------------------------------------
// Guion (transcripción revisada a mano)
// ---------------------------------------------------------------------------
export const PALABRAS: [string, number][] = [
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
export const inicio = (i: number) => f(PALABRAS[i][1]);
export const limpia = (t: string) => t.replace(/[.,]+$/, "");

// ---------------------------------------------------------------------------
// Configuración de una edición
// ---------------------------------------------------------------------------
export type Estilo = "normal" | "seam" | "clave" | "tachar" | "oculto" | "palabra";
export type Grupo = {
  de: number; a: number; estilo: Estilo;
  lineas?: number[];            // palabra donde empieza cada línea nueva
  grande?: number;              // clave: desde esta palabra va en grande
  display?: boolean;            // clave: la parte grande en Advercase (solo sin acentos)
  contador?: { desde: number; hasta: number; prefijo?: string; sufijo?: string };
  tachar?: number[];            // palabras tachadas (línea rosa)
  marcar?: number[];            // palabras resaltadas (caja blanca que barre, texto negro)
};
export type Pieza = { texto: string; left: number; top: number; size: number; retraso?: number };
export type FotoDetras = { item: Card; left: number; top: number; w: number; h: number; rot?: number; retraso?: number };
export type Config = {
  grupos: Grupo[];
  splits: { de: number; a: number; arriba: React.ReactNode }[];
  golpes: number[];                                                     // cuadros con golpe de zoom
  pantallas?: { de: number; a: number; contenido: React.ReactNode }[];  // pantalla completa encima (entra en círculo)
  detras?: { de: number; a: number; piezas?: Pieza[]; fotos?: FotoDetras[] }[];
  tamCaption?: number;                                                  // tamaño de los captions normales
  topCaption?: number;                                                  // y de los captions normales
};
const Ctx = createContext<Config>({ grupos: [], splits: [], golpes: [] });

// ---------------------------------------------------------------------------
export const Fuentes: React.FC = () => {
  const [h] = useState(() => delayRender("Fuentes UGC"));
  useEffect(() => {
    Promise.all([
      new FontFace("UM-Manrope", `url(${staticFile("fonts/Manrope.woff2")})`, { weight: "200 800" }).load(),
      new FontFace("UM-Advercase", `url(${staticFile("fonts/Advercase-Regular.otf")})`).load(),
    ]).then((fs) => { fs.forEach((x) => document.fonts.add(x)); continueRender(h); }).catch(() => continueRender(h));
  }, [h]);
  return null;
};

const BAJA = 810;   // px que baja el video en el split: su cara queda completa en la mitad de abajo
const abiertoSplit = (frame: number, splits: Config["splits"]) => {
  for (const sp of splits) {
    if (frame < sp.de || frame >= sp.a) continue;
    const t = frame - sp.de, dur = sp.a - sp.de;
    const entra = EASE(interpolate(t, [0, 14], [0, 1], clamp));                          // baja con calma
    const sale = Easing.in(Easing.cubic)(interpolate(t, [dur - 9, dur], [0, 1], clamp));  // sube más rápido
    return entra * (1 - sale);
  }
  return 0;
};

// Cámara: push-in lento (1 → 1.05) + golpe de zoom (+6 %) en cada frase clave
const useCamara = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { golpes } = useContext(Ctx);
  const lento = 1 + 0.05 * SUAVE((frame % 300) / 300);
  const golpe = golpes.reduce((acc, g) => {
    if (frame < g) return acc;
    const s = spring({ frame: frame - g, fps, config: { damping: 14, stiffness: 160, mass: 0.7 } });
    return acc + 0.06 * s * interpolate(frame - g, [24, 40], [1, 0], clamp);
  }, 0);
  return lento + golpe;
};

const VideoCompleto: React.FC = () => {
  const escala = useCamara();
  const { splits } = useContext(Ctx);
  const baja = BAJA * abiertoSplit(useCurrentFrame(), splits);
  return (
    <AbsoluteFill style={{ transform: `translateY(${baja}px) scale(${escala})`, transformOrigin: "50% 32%" }}>
      {/* el único video con audio; la galería lo quita al exportar (rr.sh usa -an) */}
      <OffthreadVideo src={staticFile("ugc-template-raw.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Captions
// ---------------------------------------------------------------------------
const Palabra: React.FC<{ texto: string; desde: number; color: string; tachada?: boolean; marcada?: boolean; fin?: number }> = ({ texto, desde, color, tachada, marcada, fin = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - desde, fps, config: { damping: 13, stiffness: 190, mass: 0.6 } });
  const linea = tachada ? EASE(interpolate(frame, [fin, fin + 9], [0, 1], clamp)) : 0;
  const barre = marcada ? EASE(interpolate(frame, [desde + 2, desde + 10], [0, 1], clamp)) : 0;
  if (frame < desde) return <span style={{ opacity: 0, marginRight: "0.26em" }}>{texto}</span>;
  return (
    <span style={{ position: "relative", display: "inline-block", marginRight: "0.26em", opacity: Math.min(1, p * 1.4) * (1 - 0.35 * linea), transform: `translateY(${(1 - p) * 26}px) scale(${0.86 + 0.14 * p})`, color: marcada && barre > 0.5 ? "#111111" : color, textShadow: marcada && barre > 0.5 ? "none" : undefined }}>
      {marcada && <span style={{ position: "absolute", left: "-0.12em", right: "-0.12em", top: "0.02em", bottom: "-0.04em", background: "#FFFFFF", borderRadius: 8, transformOrigin: "0 50%", transform: `scaleX(${barre})`, zIndex: -1 }} />}
      {texto}
      {tachada && <span style={{ position: "absolute", left: "-4%", right: "-4%", top: "54%", height: "0.13em", background: ROSA, transformOrigin: "0 50%", transform: `scaleX(${linea}) rotate(-3deg)`, borderRadius: 4 }} />}
    </span>
  );
};

const formato = (n: number) => Math.round(n).toLocaleString("en-US");

const Caption: React.FC<{ g: Grupo; desde: number; hasta: number }> = ({ g, desde, hasta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cfg = useContext(Ctx);
  const sale = interpolate(frame, [hasta - 4, hasta], [1, 0], clamp);
  const idx = Array.from({ length: g.a - g.de + 1 }, (_, k) => g.de + k);
  const seam = g.estilo === "seam";
  const color = seam ? "#111111" : "#FFFFFF";
  const sombra = seam ? "none" : "0 2px 18px rgba(0,0,0,.35)";

  if (g.estilo === "palabra") {
    // una sola palabra (o palabra corta + la siguiente), grande, debajo de la cara
    const txt = idx.map((i) => limpia(PALABRAS[i][0])).join(" ");
    const p = spring({ frame: frame - desde, fps, config: { damping: 12, stiffness: 180, mass: 0.7 } });
    // Fade breve pero visible; se ajusta al tiempo real disponible para esa palabra.
    // El caption anterior desaparece al empezar este, así nunca quedan dos a la vez.
    const fadeFrames = Math.max(2, Math.min(6, hasta - desde));
    const entrada = Easing.inOut(Easing.cubic)(interpolate(frame, [desde, desde + fadeFrames], [0, 1], clamp));
    const display = !conAcento(txt) && !/[¿?¡!…]/.test(txt);
    return (
      <AbsoluteFill style={{ opacity: entrada, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 90, right: 90, top: 1090, textAlign: "center", color: "#FFFFFF", textShadow: "0 2px 22px rgba(0,0,0,.45), 0 1px 3px rgba(0,0,0,.35)", fontFamily: display ? DISPLAY : SANS, fontWeight: display ? 400 : 800, fontSize: txt.length > 11 ? 110 : 140, lineHeight: 1, letterSpacing: display ? "-0.02em" : "-0.045em", transform: `translateY(${(1 - p) * 14}px) scale(${0.94 + 0.06 * p})` }}>
          {txt}
        </div>
      </AbsoluteFill>
    );
  }

  if (g.estilo === "clave") {
    const chicas = idx.filter((i) => i < (g.grande ?? g.a));
    const grandes = idx.filter((i) => i >= (g.grande ?? g.a));
    const tg = inicio(g.grande!);
    const pg = spring({ frame: frame - tg, fps, config: { damping: 11, stiffness: 150, mass: 0.8 } });
    let grande: React.ReactNode;
    if (g.contador) {
      const n = g.contador.desde + (g.contador.hasta - g.contador.desde) * EASE(interpolate(frame, [tg, tg + 26], [0, 1], clamp));
      grande = (
        <div style={{ fontFamily: SANS, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.95, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ fontSize: 190 }}>{g.contador.prefijo}{formato(n)}</span>
          <span style={{ display: "block", fontSize: 64, letterSpacing: "-0.03em", marginTop: 6 }}>{g.contador.sufijo?.trim()}</span>
        </div>
      );
    } else {
      const txt = grandes.map((i) => limpia(PALABRAS[i][0])).join(" ");
      grande = (
        <div style={{ fontFamily: g.display ? DISPLAY : SANS, fontWeight: g.display ? 400 : 800, textTransform: g.display ? "uppercase" : "none", fontSize: g.display ? 170 : txt.length > 12 ? 118 : 150, letterSpacing: g.display ? "-0.02em" : "-0.05em", lineHeight: 0.95 }}>
          {grandes.map((i) => <Palabra key={i} texto={limpia(PALABRAS[i][0])} desde={inicio(i)} color={color} />)}
        </div>
      );
    }
    return (
      <AbsoluteFill style={{ opacity: sale, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 100, right: 100, top: 1010, textAlign: "center", color, textShadow: sombra }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52, letterSpacing: "-0.03em", marginBottom: 6 }}>
            {chicas.map((i) => <Palabra key={i} texto={limpia(PALABRAS[i][0])} desde={inicio(i)} color={color} />)}
          </div>
          <div style={{ transform: `scale(${0.7 + 0.3 * pg})`, opacity: frame < tg ? 0 : 1 }}>{grande}</div>
        </div>
      </AbsoluteFill>
    );
  }

  const lineas: number[][] = [];
  idx.forEach((i) => {
    if (lineas.length === 0 || g.lineas?.includes(i)) lineas.push([]);
    lineas[lineas.length - 1].push(i);
  });
  const entra = spring({ frame: frame - desde, fps, config: { damping: 15, stiffness: 200, mass: 0.6 } });
  const tam = seam ? 58 : cfg.tamCaption ?? 68;
  return (
    <AbsoluteFill style={{ opacity: sale, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: seam ? 960 : cfg.topCaption ?? 1130, display: "flex", justifyContent: "center", transform: seam ? `translateY(-50%) scale(${0.9 + 0.1 * entra})` : undefined }}>
        <div style={{ maxWidth: 860, textAlign: "center", color, textShadow: sombra, fontFamily: SANS, fontWeight: 800, fontSize: tam, lineHeight: 1.1, letterSpacing: "-0.035em", background: seam ? "#FFFFFF" : "transparent", padding: seam ? "20px 34px 22px" : 0, borderRadius: seam ? 16 : 0, isolation: "isolate" }}>
          {lineas.map((l, k) => (
            <div key={k} style={{ whiteSpace: "nowrap" }}>
              {l.map((i) => {
                const ult = g.tachar ? Math.max(...g.tachar) : i;
                return <Palabra key={i} texto={limpia(PALABRAS[i][0])} desde={inicio(i)} color={color} tachada={g.tachar?.includes(i)} fin={inicio(ult) + 9} marcada={g.marcar?.includes(i)} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC = () => {
  const { grupos } = useContext(Ctx);
  return (
    <>
      {grupos.map((g, k) => {
        if (g.estilo === "oculto") return null;
        const desde = inicio(g.de);
        const sig = grupos[k + 1];
        const hasta = sig ? inicio(sig.de) : UGC_FRAMES;
        const fin = sig && sig.estilo === "oculto" ? Math.min(hasta, inicio(g.a) + 26) : hasta;
        if (fin <= desde) return null;
        return (
          <Sequence key={k} from={desde} durationInFrames={fin - desde} layout="none">
            <Sequence from={-desde} layout="none"><Caption g={g} desde={desde} hasta={fin} /></Sequence>
          </Sequence>
        );
      })}
    </>
  );
};

/** Captions de una palabra: un grupo por palabra, la que ella está diciendo en ese momento.
 *  juntarCortas = true pega las palabras de 1–3 letras a la siguiente (por defecto no: Manuel pidió una sola palabra). */
export const gruposPalabra = (desde = 0, hasta = PALABRAS.length - 1, ocultar: [number, number][] = [], juntarCortas = false): Grupo[] => {
  const out: Grupo[] = [];
  let i = desde;
  while (i <= hasta) {
    const oc = ocultar.find(([a, b]) => i >= a && i <= b);
    if (oc) { out.push({ de: oc[0], a: oc[1], estilo: "oculto" }); i = oc[1] + 1; continue; }
    let j = i;
    const corta = (w: string) => limpia(w).replace(/[¿?]/g, "").length <= 3;
    while (juntarCortas && j < hasta && corta(PALABRAS[j][0]) && !ocultar.some(([a]) => a === j + 1)) j++;
    out.push({ de: i, a: j, estilo: "palabra" });
    i = j + 1;
  }
  return out;
};

// ---------------------------------------------------------------------------
// Split, pantallas completas y capa detrás de ella
// ---------------------------------------------------------------------------
const Split: React.FC<{ de: number; children: React.ReactNode }> = ({ de, children }) => {
  const { splits } = useContext(Ctx);
  const abierto = abiertoSplit(useCurrentFrame() + de, splits);
  return (
    <div style={{ position: "absolute", left: 0, top: -960 * (1 - abierto), width: 1080, height: 960, overflow: "hidden", background: CREMA }}>
      {children}
    </div>
  );
};

const Circulo: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  if (frame > dur) return null;
  const r = interpolate(frame, [0, 12], [0, 1250], { ...clamp, easing: EASE }) * interpolate(frame, [dur - 8, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return <AbsoluteFill style={{ clipPath: `circle(${r}px at 50% 46%)`, background: "#FFFFFF" }}>{children}</AbsoluteFill>;
};

// ZONA SEGURA: nada arriba de y≈300 (UI de la red social) ni abajo de y≈1450; solo donde su silueta deja espacio.
const Detras: React.FC<{ desde: number; dur: number; piezas?: Pieza[]; fotos?: FotoDetras[] }> = ({ desde, dur, piezas = [], fotos = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const escala = useCamara();
  const sale = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  const cam = { transform: `scale(${escala})`, transformOrigin: "50% 32%" };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: sale, ...cam }}>
        {piezas.map((pz, k) => {
          const p = spring({ frame: frame - (pz.retraso ?? k * 4), fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
          return (
            <div key={k} style={{ position: "absolute", left: pz.left, top: pz.top, overflow: "hidden", fontFamily: DISPLAY, color: "#FFFFFF", fontSize: pz.size, lineHeight: 0.92, whiteSpace: "nowrap" }}>
              <div style={{ transform: `translateY(${(1 - p) * 105}%)` }}>{pz.texto}</div>
            </div>
          );
        })}
        {fotos.map((ft, k) => {
          const p = spring({ frame: frame - (ft.retraso ?? k * 5), fps, config: { damping: 15, stiffness: 120, mass: 0.85 } });
          return (
            <div key={k} style={{ position: "absolute", left: ft.left, top: ft.top, width: ft.w, height: ft.h, borderRadius: 22, overflow: "hidden", background: ft.item.color ?? LAVANDA, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 70}px) rotate(${(ft.rot ?? 0) * p}deg) scale(${0.85 + 0.15 * p})` }}>
              <CardFace item={ft.item} />
            </div>
          );
        })}
      </AbsoluteFill>
      {/* la creadora recortada encima (position absolute: si no, el navegador pinta el texto por encima) */}
      <AbsoluteFill style={cam}>
        <Video src={staticFile("ugc-template-foreground.webm")} trimBefore={desde} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
export const EdicionUGC: React.FC<{ cfg: Config }> = ({ cfg }) => (
  <Ctx.Provider value={cfg}>
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <Fuentes />
      <VideoCompleto />
      {(cfg.detras ?? []).map((d, k) => (
        <Sequence key={`d${k}`} from={d.de} durationInFrames={d.a - d.de}>
          <Detras desde={d.de} dur={d.a - d.de} piezas={d.piezas} fotos={d.fotos} />
        </Sequence>
      ))}
      {cfg.splits.map((sp, k) => (
        <Sequence key={`s${k}`} from={sp.de} durationInFrames={sp.a - sp.de}>
          <Split de={sp.de}>{sp.arriba}</Split>
        </Sequence>
      ))}
      {/* sin durationInFrames: algunos componentes calculan sus fases con la duración; Circulo se oculta solo */}
      {(cfg.pantallas ?? []).map((pt, k) => (
        <Sequence key={`p${k}`} from={pt.de}>
          <Circulo dur={pt.a - pt.de}>{pt.contenido}</Circulo>
        </Sequence>
      ))}
      <Captions />
    </AbsoluteFill>
  </Ctx.Provider>
);

// ---------------------------------------------------------------------------
// Paneles listos para el split (1080 × 960, fondo crema)
// ---------------------------------------------------------------------------
export const PerfilCero: React.FC = () => {
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
          <div style={{ width: 150, height: 150, borderRadius: "50%", background: LAVANDA, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 800, color: AZUL }}>@</div>
          <div>
            <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.03em", color: "#111" }}>@creadora.ugc</div>
            <div style={{ fontSize: 30, fontWeight: 500, color: "#6B6F80", marginTop: 6 }}>Cuenta nueva</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48 }}>
          {stats.map(([k, v]) => (
            <div key={k} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: k === "Seguidores" ? 92 : 64, fontWeight: 800, letterSpacing: "-0.04em", color: k === "Seguidores" ? AZUL : "#111", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#6B6F80", marginTop: 10 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Tarjetas que se apilan dentro del panel de arriba. */
export const Tarjetas: React.FC<{ cards: TaskCard[]; enter?: number; hold?: number }> = ({ cards, enter = 16, hold = 20 }) => (
  <AbsoluteFill style={{ background: CREMA }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "translateY(-350px) scale(.9)", transformOrigin: "50% 0" }}>
      <StackCards cards={cards} background="transparent" enter={enter} hold={hold} />
    </div>
  </AbsoluteFill>
);
export const PAGOS: TaskCard[] = [
  { title: "Te pagan", text: "+$350 USD por 3 videos para una app", bg: LAVANDA, color: "#111111" },
  { title: "Nuevo brief", text: "App de IA · video de 30 s", bg: ROSA, color: "#111111" },
  { title: "Tus redes", text: "Intactas: no publicas nada", bg: "#FFFFFF", color: "#111111" },
];

/** Panel de ganancias: el saldo sube a $1,000 justo cuando ella lo dice (cuenta = cuadro relativo al split). */
export const Ganancias: React.FC<{ cuenta: number }> = ({ cuenta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 4, fps, config: { damping: 13, stiffness: 140, mass: 0.8 } });
  const n = interpolate(frame, [cuenta, cuenta + 28], [0, 1000], { ...clamp, easing: EASE });
  const barras = [0.35, 0.5, 0.42, 0.7, 0.62, 0.86, 1];
  return (
    <AbsoluteFill style={{ background: CREMA, alignItems: "center", justifyContent: "center", fontFamily: SANS }}>
      <div style={{ width: 780, background: "#FFFFFF", borderRadius: 40, padding: "52px 56px", transform: `translateY(${(1 - p) * 120}px) scale(${0.92 + 0.08 * p})`, opacity: Math.min(1, p * 1.5) }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: "#6B6F80" }}>Ganancias con Tech UGC</div>
        <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", color: "#111", fontVariantNumeric: "tabular-nums", lineHeight: 1.05, marginTop: 8 }}>+${formato(n)}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 200, marginTop: 30 }}>
          {barras.map((b, k) => {
            const pb = EASE(interpolate(frame, [cuenta + k * 3, cuenta + k * 3 + 18], [0, 1], clamp));
            return <div key={k} style={{ flex: 1, height: `${b * 100 * Math.max(0.08, pb)}%`, background: k === barras.length - 1 ? AZUL : LAVANDA, borderRadius: 14 }} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ITEMS_APPS: Card[] = [
  { color: AZUL, icon: "carrusel/estrella.svg", iconColor: ROSA },
  { src: "carrusel/foto.jpg" },
  { color: ROSA, icon: "carrusel/flor.svg", iconColor: AZUL },
  { src: "carrusel/azul.jpg" },
  { color: "#1C1E2A", icon: "carrusel/miiles.svg", iconColor: ROSA },
  { src: "carrusel/rosa.jpg" },
  { color: LAVANDA, icon: "carrusel/estrella.svg", iconColor: AZUL },
  { src: "carrusel/gorra.jpg" },
];

/** Cuadrícula de fotos/apps que se reacomoda (GridFlip) dentro del panel de arriba. */
export const CuadriculaApps: React.FC = () => (
  <AbsoluteFill style={{ background: CREMA }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "translateY(-480px)" }}>
      <GridFlip items={ITEMS_APPS} background="transparent" layouts={[{ cols: 4, rows: 2, width: 940 }, { cols: 3, rows: 2, width: 820 }, { cols: 4, rows: 2, width: 940 }]} ratio={0.82} gap={16} radius={22} move={18} hold={14} />
    </div>
  </AbsoluteFill>
);
