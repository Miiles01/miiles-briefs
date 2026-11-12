import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { KeyPhrase, KeyPhraseProps } from "./KeyPhrase";
import { GridFlip } from "./GridFlip";
import { miilesCards } from "./shared";
import { StackCards, TaskCard } from "./StackCards";

const cream = "#F4F3EF";
const manropeFile = "fonts/Manrope.woff2";
const advertcaseFile = "fonts/Advercase-Regular.otf";

const beats = [
  { start: 180, end: 255, card: { title: "La idea", text: "Un mensaje para tu gente.", bg: "#F5EFD9", color: "#171717" } },
  { start: 255, end: 330, card: { title: "Tu voz", text: "Que suene a ti.", bg: "#F7D7D4", color: "#171717" } },
  { start: 330, end: 405, card: { title: "El ritmo", text: "Gancho, valor y acción.", bg: "#E7E5DF", color: "#171717" } },
] as const;

type Beat = (typeof beats)[number];

const INTRO = {
  phrases: [{ text: "Tu historia\nmerece destacar", highlight: ["destacar"] }],
  split: "words",
  from: "center",
  transition: "reveal",
  background: cream,
  color: "#171717",
  highlightColor: "#171717",
  font: manropeFile,
  highlightFont: advertcaseFile,
  fontSize: 136,
  lineHeight: 0.98,
  align: "center",
  stagger: 3,
  enter: 18,
  hold: 32,
  exit: 14,
  safeArea: true,
} as KeyPhraseProps;

const CAPTIONS = [
  [75, 120, "Todo empieza aquí"],
  [120, 180, "Una idea clara"],
  [180, 255, "Forma tu mensaje"],
  [255, 330, "Encuentra tu voz"],
  [330, 405, "Cierra con acción"],
  [675, 720, "Muestra tu esencia"],
  [720, 765, "Conecta con estilo"],
  [765, 810, "Haz que permanezca"],
] as const;

const BrandFonts: React.FC = () => {
  const [handle] = useState(() => delayRender("Cargando tipografías Miiles"));
  useEffect(() => {
    Promise.all([
      new FontFace("MiilesManrope", `url(${staticFile(manropeFile)})`).load(),
      new FontFace("MiilesAdvertcase", `url(${staticFile(advertcaseFile)})`).load(),
    ]).then((faces) => {
      faces.forEach((face) => document.fonts.add(face));
      continueRender(handle);
    }).catch(() => continueRender(handle));
  }, [handle]);
  return null;
};

const CaptionPill: React.FC<{ text: string; split?: boolean; duration?: number }> = ({ text, split = false, duration = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 175, mass: 0.75 } });
  const opacity = interpolate(frame, [0, 6, duration - 8, duration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: split ? 866 : 1040, height: split ? 188 : 160, display: "flex", alignItems: "center", justifyContent: "center", opacity, pointerEvents: "none", zIndex: 8 }}>
      <div style={{ background: split ? "#FFFFFF" : "transparent", color: split ? "#171717" : "#FFFFFF", borderRadius: split ? 18 : 0, padding: split ? "17px 30px 19px" : "10px 20px", maxWidth: 940, fontFamily: "MiilesManrope, Arial, sans-serif", fontWeight: 800, fontSize: 50, lineHeight: 1.08, letterSpacing: "-.035em", textAlign: "center", textShadow: split ? "none" : "0 2px 8px rgba(0,0,0,.72)", transform: `scale(${scale})` }}>
        {text}
      </div>
    </div>
  );
};

const VideoTitle: React.FC<{ label: string; sub?: string }> = ({ label, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 17, stiffness: 135, mass: 0.8 } });
  const opacity = interpolate(frame, [0, 10, 110, 125], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ top: 110, height: 360, alignItems: "center", opacity, pointerEvents: "none" }}>
      <div style={{ transform: `translateY(${(1 - p) * 38}px)`, padding: "18px 36px 22px", borderRadius: 30, background: "rgba(244,243,239,.94)", color: "#171717", textAlign: "center", boxShadow: "0 15px 40px rgba(0,0,0,.12)" }}>
        <div style={{ fontFamily: "MiilesAdvertcase, MiilesManrope, sans-serif", fontSize: 86, lineHeight: 1.02, letterSpacing: "-.025em" }}>{label}</div>
        {sub && <div style={{ marginTop: 5, fontFamily: "MiilesManrope, Arial, sans-serif", fontWeight: 700, fontSize: 28 }}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

const StepPanel: React.FC<{ beat: Beat }> = ({ beat }) => {
  const { start, card } = beat;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: "0 0 auto", height: 960, background: cream, overflow: "hidden", zIndex: 2 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1920, transform: "scale(.76)", transformOrigin: "top center" }}>
          <StackCards cards={[card as TaskCard]} background="transparent" font={manropeFile} enter={18} hold={42} />
        </div>
        <div style={{ position: "absolute", left: 46, top: 32, fontFamily: "MiilesManrope, Arial, sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: ".1em", color: "#686966" }}>UNA HISTORIA, EN TRES CAPAS</div>
      </div>
      <OffthreadVideo
        src={staticFile("ugc-template-raw.mp4")}
        startFrom={start}
        muted
        style={{ position: "absolute", left: 0, top: 960, width: "100%", height: 960, objectFit: "cover", objectPosition: "50% 25%", zIndex: 1 }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 956, height: 8, background: "#FFFFFF", zIndex: 3 }} />
    </AbsoluteFill>
  );
};

const Gallery: React.FC = () => (
  <AbsoluteFill style={{ background: cream }}>
    <GridFlip
      items={miilesCards}
      layouts={[{ cols: 2, rows: 2, width: 760 }, { cols: 3, rows: 2, width: 930 }, { cols: 2, rows: 3, width: 760 }]}
      background={cream}
      ratio={0.82}
      gap={18}
      radius={22}
      move={20}
      hold={20}
    />
  </AbsoluteFill>
);

const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16, stiffness: 125, mass: 0.85 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 1050, left: 75, right: 75, padding: "25px 24px 30px", textAlign: "center", borderRadius: 26, background: "rgba(244,243,239,.96)", color: "#171717", transform: `translateY(${(1 - p) * 38}px)`, boxShadow: "0 15px 40px rgba(0,0,0,.12)" }}>
        <div style={{ fontFamily: "MiilesAdvertcase, MiilesManrope, sans-serif", fontSize: 112, lineHeight: 1 }}>TU VOZ</div>
        <div style={{ marginTop: 4, fontFamily: "MiilesManrope, Arial, sans-serif", fontWeight: 800, fontSize: 62, letterSpacing: "-.045em" }}>puede conectar</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 260, textAlign: "center", color: "#FFFFFF", fontFamily: "MiilesManrope, Arial, sans-serif", fontWeight: 800, fontSize: 30, textShadow: "0 2px 10px rgba(0,0,0,.65)" }}>miiles.app</div>
    </AbsoluteFill>
  );
};

export const UGCThreeLayers: React.FC = () => (
  <AbsoluteFill style={{ background: cream, overflow: "hidden" }}>
    <BrandFonts />
    <OffthreadVideo src={staticFile("ugc-template-raw.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", background: cream }} />
    <Sequence from={0} durationInFrames={75}><KeyPhrase {...INTRO} /></Sequence>
    {beats.map((beat, i) => <Sequence key={i} from={beat.start} durationInFrames={beat.end - beat.start}><StepPanel beat={beat} /></Sequence>)}
    <Sequence from={525} durationInFrames={150}><Gallery /></Sequence>
    <Sequence from={405} durationInFrames={90}>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Video src={staticFile("ugc-template-base.webm")} startFrom={405} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 1040, left: 30, right: 30, height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#FFFFFF", textShadow: "0 3px 12px rgba(0,0,0,.5)", fontFamily: "MiilesAdvertcase, MiilesManrope, sans-serif", textAlign: "center", lineHeight: .86 }}>
          <div style={{ fontSize: 180, letterSpacing: "-.035em" }}>CREA</div>
          <div style={{ fontSize: 70, marginTop: 12, letterSpacing: "-.02em" }}>A TU RITMO</div>
        </div>
        <Video src={staticFile("ugc-template-foreground.webm")} startFrom={405} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
    {CAPTIONS.map(([from, to, text], i) => <Sequence key={i} from={from} durationInFrames={to - from}><CaptionPill text={text} duration={to-from} split={from >= 180 && from < 405} /></Sequence>)}
  </AbsoluteFill>
);
