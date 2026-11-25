/* ============================================================================
   ESCENA · RUEDA ALREDEDOR DE ELLA · Miiles Estudio
   ----------------------------------------------------------------------------
   Parte de un video (del segundo 2.0 al 9.4 del clip de la creadora). Usa la Rueda inclinada
   (aro 3D de fotos, visto un poco desde arriba) alrededor de ella, como un tren de fotos:
   1. Ella habla sola un instante.
   2. Las fotos entran en LÍNEA desde la derecha, por detrás de ella. La primera llega al aro
      y empieza a darle la vuelta; las demás la siguen y la línea se va cerrando en círculo.
   3. Ya en rueda, giran alrededor de ella: la mitad de enfrente pasa DELANTE de ella y la de
      atrás queda detrás.
   4. La primera se suelta por detrás y sale hacia la izquierda; las demás la siguen: la rueda
      se deshace en línea otra vez y se va al otro lado, siempre por detrás de ella.
   Capas: video original → fotos de atrás → recorte de ella (creadora-hook-foreground.webm)
   → fotos de enfrente.
   ========================================================================== */
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { Card, CardFace, miilesCards } from "./shared";

const FPS = 30;
const INICIO = 2.0;
export const ESCENA_RUEDA_FRAMES = Math.round((9.4 - INICIO) * FPS);   // 222 cuadros
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LENTO = 0.3;    // mientras la rueda pasa por enfrente va a 30 % de la velocidad

const MUEVE = [10, 214];      // cuadros en que viaja el tren de fotos
const VUELTAS = 2;            // vueltas que da la primera foto: SIEMPRE entero (la salida arranca en el punto de atrás del aro)
const CARD_W = 215, CARD_H = 320, RADIO = 490, TILT = 17, PERSPECTIVA = 1500;   // verticales pero no tan delgadas; inclinado hacia abajo al pasar por enfrente   // tarjetas verticales tipo reel; perspectiva marcada
const CENTRO_Y = 1130;        // a la altura del pecho / cintura
const RECTA = 1300;           // largo de la línea de entrada y de salida (empiezan / terminan fuera de cuadro)

// 11 fotos en fila (se repiten las de ejemplo)
const FILA: Card[] = Array.from({ length: 11 }, (_, i) => miilesCards[i % miilesCards.length]);

export const EscenaRueda: React.FC<{ items?: Card[] }> = ({ items = FILA }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const n = items.length;
  const tilt = ((TILT + Math.sin(frame / 22) * 3) * Math.PI) / 180;   // visto un poco desde arriba
  const ladeo = Math.sin(frame / 30) * 2.5;                             // se ladea apenas

  // El camino: recta por detrás (desde la derecha) → vueltas al aro → recta por detrás (hacia la izquierda).
  // Las fotos van en fila sobre ese camino, separadas lo justo para cerrar el círculo.
  const C = 2 * Math.PI * RADIO, sep = C / n;
  const total = RECTA + VUELTAS * C + (n - 1) * sep + RECTA;
  // Velocidad según dónde va la fila: entra con su velocidad, frena un poco mientras la rueda gira
  // frente a ella y, al irse, recupera la velocidad y sale así (sin frenar al final).
  const S1 = RECTA + (n - 1) * sep, S2 = RECTA + VUELTAS * C;      // rueda completa → la primera se suelta
  const suave = (a: number, b: number, x: number) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  const vel = (d: number) => 1 - (1 - LENTO) * suave(S1 - 100, S1 + 400, d) * (1 - suave(S2 - 1300, S2 - 600, d));   // ≈2.6 s lento
  let tiempo = 0; for (let d = 0; d < total; d += 10) tiempo += 10 / vel(d);   // "tiempo" a velocidad 1
  const rapido = tiempo / (MUEVE[1] - MUEVE[0]);                                 // px por cuadro a velocidad completa
  let cabeza = 0;
  for (let f = MUEVE[0]; f < Math.min(frame, MUEVE[1]); f++) for (let k = 0; k < 4; k++) cabeza += (rapido * vel(cabeza)) / 4;
  if (frame >= MUEVE[1]) cabeza = total;
  const punto = (s: number) => {
    const atrasY = -RADIO * Math.sin(tilt), atrasZ = -RADIO * Math.cos(tilt);   // el punto de atrás del aro
    if (s < RECTA) return { x: RECTA - s, y: atrasY, z: atrasZ };               // llega por detrás, de derecha a izquierda
    if (s < RECTA + VUELTAS * C) {
      const th = Math.PI + (s - RECTA) / RADIO;                                  // da la vuelta al aro
      const z0 = RADIO * Math.cos(th);
      return { x: RADIO * Math.sin(th), y: z0 * Math.sin(tilt), z: z0 * Math.cos(tilt) };
    }
    return { x: -(s - RECTA - VUELTAS * C), y: atrasY, z: atrasZ };             // se suelta por detrás hacia la izquierda
  };

  const fichas = items.map((item, i) => {
    const { x, y, z } = punto(cabeza - i * sep);
    const k = PERSPECTIVA / (PERSPECTIVA - z);
    return { item, i, x: x * k, y: y * k, z, k };
  }).sort((a, b) => a.z - b.z);

  const x0 = width / 2;
  // las de la mitad de enfrente del aro pasan delante de ella; las de atrás (y las líneas) van detrás
  const atras = fichas.filter((f) => f.z < 0);
  const frente = fichas.filter((f) => f.z >= 0);

  const Ficha = ({ f }: { f: (typeof fichas)[number] }) => (
    <div style={{
      position: "absolute", left: x0 + f.x - (CARD_W * f.k) / 2, top: CENTRO_Y + f.y - (CARD_H * f.k) / 2,
      width: CARD_W * f.k, height: CARD_H * f.k, borderRadius: 14 * f.k, overflow: "hidden",
      background: f.item.color ?? "#EEEFF2", boxShadow: "0 18px 40px rgba(0,0,0,.25)",
      transform: `rotate(${ladeo}deg)`,
    }}>
      <CardFace item={f.item} />
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      {/* ella (con audio) */}
      <AbsoluteFill>
        <OffthreadVideo src={staticFile("creadora-hook.mp4")} trimBefore={Math.round(INICIO * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* fotos de atrás del aro */}
      <AbsoluteFill>{atras.map((f) => <Ficha key={f.i} f={f} />)}</AbsoluteFill>
      {/* su recorte encima: así las fotos de atrás quedan detrás de ella */}
      <AbsoluteFill>
        <Video src={staticFile("creadora-hook-foreground.webm")} trimBefore={Math.round(INICIO * FPS)} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* fotos de enfrente del aro: pasan delante de ella */}
      <AbsoluteFill>{frente.map((f) => <Ficha key={f.i} f={f} />)}</AbsoluteFill>
    </AbsoluteFill>
  );
};
