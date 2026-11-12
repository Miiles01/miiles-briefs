import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cream = "#F4F3EF";
const manrope = "fonts/Manrope.woff2";
const advertcase = "fonts/Advercase-Regular.otf";

const FontLoader: React.FC = () => {
  const [handle] = useState(() => delayRender("Cargando tipografías Miiles"));
  useEffect(() => {
    Promise.all([new FontFace("MiilesManrope", `url(${staticFile(manrope)})`).load(), new FontFace("MiilesAdvertcase", `url(${staticFile(advertcase)})`).load()])
      .then((faces) => { faces.forEach((face) => document.fonts.add(face)); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [handle]);
  return null;
};

const captions = [
  [55, 100, "Una idea crece"],
  [145, 190, "Haz sonar tu voz"],
  [235, 280, "Crea con intención"],
  [325, 370, "Tu estilo conecta"],
  [415, 460, "Deja huella hoy"],
  [505, 550, "Todo parte aquí"],
  [595, 640, "Cuenta algo importante"],
  [685, 730, "Construye tu camino"],
  [775, 820, "Hazlo muy tuyo"],
] as const;

const MiniCard: React.FC<{ label: string; asset: string; index: number }> = ({ label, asset, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * 4;
  const enter = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 125, mass: .85 } });
  return <div style={{ width: 184, height: 212, background: "#FFFFFF", borderRadius: 21, padding: 8, boxShadow: "0 12px 30px rgba(23,23,23,.14)", transform: `translateY(${(1-enter)*28}px) scale(${.94+.06*enter})`, opacity: interpolate(frame-delay,[0,10,100,115],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}) }}>
    <div style={{ width:"100%", height:144, borderRadius:14, overflow:"hidden", background:cream }}><Img src={staticFile(asset)} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>
    <div style={{ color:"#171717", fontFamily:"MiilesManrope,Arial,sans-serif", fontWeight:800, fontSize:16, padding:"10px 4px 3px" }}>{label}</div>
  </div>;
};

const InsightRow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const opacity = interpolate(frame,[0,10,95,110],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const entries = [{title:"La idea",color:"#F4EBD4",icon:"✳"},{title:"Tu voz",color:"#F7D7D4",icon:"↗"},{title:"Tu estilo",color:"#E6E8E4",icon:"◌"}];
  return <AbsoluteFill style={{ top: 120, height: 560, flexDirection:"row", alignItems:"center", justifyContent:"center", gap:18, opacity, pointerEvents:"none" }}>
    {entries.map((item,i)=><div key={item.title} style={{ width:310,height:350,borderRadius:26,background:item.color,color:"#171717",padding:26,display:"flex",flexDirection:"column",justifyContent:"space-between",boxShadow:"0 18px 48px rgba(0,0,0,.12)",transform:`translateY(${(1-p)*40+i*4}px) scale(${.96+p*.04})` }}>
      <div style={{ fontFamily:"MiilesManrope,Arial,sans-serif",fontSize:56,fontWeight:800 }}>{item.icon}</div>
      <div style={{ fontFamily:"MiilesAdvertcase,Georgia,serif",fontSize:54,lineHeight:.95 }}>{item.title}</div>
    </div>)}
  </AbsoluteFill>;
};

const SplitSteps: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position:"absolute",inset:"0 0 auto",height:960,background:cream,overflow:"hidden" }}>
      <div style={{ position:"absolute",left:0,right:0,top:0,height:1920,transform:"scale(.76)",transformOrigin:"top center" }}>
        <InsightRow />
      </div>
      <div style={{ position:"absolute",left:46,top:35,fontFamily:"MiilesManrope,Arial,sans-serif",fontWeight:800,fontSize:20,letterSpacing:".1em",color:"#686966" }}>IDEA · VOZ · ESTILO</div>
    </div>
    <OffthreadVideo src={staticFile("ugc-template-raw.mp4")} startFrom={390} muted style={{ position:"absolute",left:0,top:960,width:"100%",height:960,objectFit:"cover",objectPosition:"50% 25%" }} />
    <div style={{ position:"absolute",left:0,right:0,top:956,height:8,background:"#FFFFFF" }} />
  </AbsoluteFill>
);

const Caption: React.FC<{ text:string; split?:boolean }> = ({ text, split=false }) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const p=spring({frame,fps,config:{damping:17,stiffness:160,mass:.75}});
  const opacity=interpolate(frame,[0,5,38,45],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{top:split?866:1040,height:split?188:160,alignItems:"center",justifyContent:"center",opacity,pointerEvents:"none"}}>
    <div style={{fontFamily:"MiilesManrope,Arial,sans-serif",fontWeight:800,fontSize:52,lineHeight:1.05,letterSpacing:"-.035em",color:split?"#171717":"#FFFFFF",background:split?"#FFFFFF":"transparent",borderRadius:split?18:0,padding:split?"17px 30px":"10px 20px",maxWidth:940,textAlign:"center",textShadow:split?"none":"0 2px 9px rgba(0,0,0,.72)",transform:`scale(${.94+.06*p})`}}>{text}</div>
  </AbsoluteFill>;
};

export const UGCVersionTwo: React.FC = () => (
  <AbsoluteFill style={{background:cream,overflow:"hidden"}}>
    <FontLoader />
    <OffthreadVideo src={staticFile("ugc-template-raw.mp4")} muted style={{width:"100%",height:"100%",objectFit:"cover"}} />
    <Sequence from={190} durationInFrames={200}><SplitSteps /></Sequence>
    <Sequence from={510} durationInFrames={150}>
      <AbsoluteFill style={{background:cream,alignItems:"center",justifyContent:"center"}}>
        <div style={{position:"absolute",top:150,left:60,right:60,textAlign:"center",fontFamily:"MiilesAdvertcase,Georgia,serif",fontSize:104,lineHeight:.98,color:"#171717"}}>De la idea a la acción</div>
        <div style={{position:"absolute",top:500,left:0,right:0,display:"flex",justifyContent:"center"}}><MiniCard label="Una voz reconocible" asset="carrusel/foto.jpg" index={0}/></div>
      </AbsoluteFill>
    </Sequence>
    {captions.map(([from,to,text],i)=><Sequence key={i} from={from} durationInFrames={to-from}><Caption text={text} split={from>=190&&from<390}/></Sequence>)}
  </AbsoluteFill>
);
