import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";

// Parafrasea la idea del original con un tono conversacional: privacidad y marca pública pueden convivir.
const words = ["¿Puedes", "ser", "reservada", "y aun", "así", "crear", "una", "marca", "pública", "sin", "mostrarlo", "todo?"];
const wordDuration = 60;

const FontLoader: React.FC = () => {
  const [handle] = useState(() => delayRender("Cargando tipografías Miiles"));
  useEffect(() => {
    Promise.all([
      new FontFace("MiilesManrope", `url(${staticFile("fonts/Manrope.woff2")})`).load(),
      new FontFace("MiilesAdvertcase", `url(${staticFile("fonts/Advercase-Regular.otf")})`).load(),
    ]).then((faces) => { faces.forEach((face) => document.fonts.add(face)); continueRender(handle); }).catch(() => continueRender(handle));
  }, [handle]);
  return null;
};

const WordCaption: React.FC<{ word: string }> = ({ word }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 18, stiffness: 105, mass: .8 } });
  const opacity = interpolate(frame, [0, 6, wordDuration - 8, wordDuration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const accent = /[áéíóúñ]/i.test(word);
  return <AbsoluteFill style={{ top: 1090, height: 190, alignItems: "center", justifyContent: "center", opacity, pointerEvents: "none" }}>
    <div style={{ fontFamily: accent ? "MiilesManrope,Arial,sans-serif" : "MiilesAdvertcase,Georgia,serif", fontWeight: accent ? 800 : 400, fontSize: 132, lineHeight: 1, letterSpacing: "-.035em", color: "#FFFFFF", textShadow: "0 3px 12px rgba(0,0,0,.64)", transform: `translateY(${(1-p)*28}px) scale(${.94+.06*p})` }}>{word}</div>
  </AbsoluteFill>;
};

const ImageInsert: React.FC<{ asset:string; side:"left"|"right"; delay:number }> = ({ asset, side, delay }) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const p=spring({frame:frame-delay,fps,config:{damping:20,stiffness:115,mass:.9}});
  const opacity=interpolate(frame,[delay,delay+8,delay+82,delay+96],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <div style={{position:"absolute",top:220,left:side==="left"?42:"auto",right:side==="right"?42:"auto",width:190,height:220,padding:9,borderRadius:22,background:"rgba(244,243,239,.97)",boxShadow:"0 12px 34px rgba(0,0,0,.16)",opacity,transform:`translateY(${(1-p)*24}px) rotate(${side==="left"?-3:3}deg)`,pointerEvents:"none"}}>
    <div style={{height:202,borderRadius:15,overflow:"hidden",background:"#FFFFFF"}}><Img src={staticFile(asset)} style={{width:"100%",height:"100%",objectFit:"cover"}} /></div>
  </div>;
};

const ImageMoment: React.FC<{ images:[string,string] }> = ({ images }) => (
  <AbsoluteFill style={{pointerEvents:"none"}}>
    <ImageInsert asset={images[0]} side="left" delay={4}/>
    <ImageInsert asset={images[1]} side="right" delay={10}/>
  </AbsoluteFill>
);

const BackgroundImages: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 19, stiffness: 95, mass: 0.9 } });
  const opacity = interpolate(frame, [0, 8, 78, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <Video src={staticFile("ugc-template-base.webm")} startFrom={405} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", top: 360, left: 28, width: 300, height: 360, overflow: "hidden", borderRadius: 26, opacity: opacity*.86, transform: `translateY(${(1-enter)*30}px) rotate(-3deg)` }}><Img src={staticFile("carrusel/foto.jpg")} style={{width:"100%",height:"100%",objectFit:"cover"}} /></div>
    <div style={{ position: "absolute", top: 420, right: 28, width: 300, height: 360, overflow: "hidden", borderRadius: 26, opacity: opacity*.86, transform: `translateY(${(1-enter)*36}px) rotate(3deg)` }}><Img src={staticFile("carrusel/rosa.jpg")} style={{width:"100%",height:"100%",objectFit:"cover"}} /></div>
    <Video src={staticFile("ugc-template-foreground.webm")} startFrom={405} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity }} />
  </AbsoluteFill>;
};

export const UGCVersionThree: React.FC = () => (
  <AbsoluteFill style={{background:"#F4F3EF",overflow:"hidden"}}>
    <FontLoader />
    <OffthreadVideo src={staticFile("ugc-template-raw.mp4")} muted style={{width:"100%",height:"100%",objectFit:"cover"}} />
    <Sequence from={0} durationInFrames={100}><ImageMoment images={["carrusel/foto.jpg","carrusel/rosa.jpg"]}/></Sequence>
    <Sequence from={300} durationInFrames={100}><ImageMoment images={["carrusel/azul.jpg","carrusel/gorra.jpg"]}/></Sequence>
    <Sequence from={600} durationInFrames={100}><ImageMoment images={["carrusel/foto.jpg","carrusel/flor.svg"]}/></Sequence>
    <Sequence from={405} durationInFrames={90}><BackgroundImages /></Sequence>
    {words.map((word,index)=><Sequence key={`${word}-${index}`} from={30+index*wordDuration} durationInFrames={wordDuration}><WordCaption word={word}/></Sequence>)}
  </AbsoluteFill>
);
