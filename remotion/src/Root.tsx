import React from "react";
import { Composition } from "remotion";
import { CircularCarousel, defaultItems } from "./CircularCarousel";
import { SpiralCarousel, spiralItems } from "./SpiralCarousel";
import { FanCarousel } from "./FanCarousel";
import { WheelCarousel } from "./WheelCarousel";
import { TiltedColumns } from "./TiltedColumns";
import { StackSlider } from "./StackSlider";
import { InnerRing } from "./InnerRing";
import { ElasticStack } from "./ElasticStack";
import { ResonantLine } from "./ResonantLine";
import { EndlessWord, endlessWordLoopFrames } from "./EndlessWord";
import { BarReveal, BarRevealProps, barRevealDuration } from "./BarReveal";
import { IconPills, examplePills } from "./IconPills";
import { DotsPhrase } from "./DotsPhrase";
import { StackCards, StackCardsProps, exampleTasks, stackCardsDuration } from "./StackCards";
import { FlipGrow, flipGrowDuration } from "./FlipGrow";
import { CasesColumn } from "./CasesColumn";
import { DepthGallery } from "./DepthGallery";
import { GridFlip, gridFlipDuration } from "./GridFlip";
import { StickyGrid, stickyGridDuration } from "./StickyGrid";
import { GooeySearch, gooeySearchDuration } from "./GooeySearch";
import { SlideWords, slideWordsDuration } from "./SlideWords";
import { Escena01, ESCENA01_FRAMES } from "./Escena01";
import { PageChange, PageChangeProps, pageChangeDuration } from "./PageChange";
import { ScrollLetters, ScrollLettersProps, scrollLettersDuration } from "./ScrollLetters";
import { UnderlineWords, UnderlineWordsProps, underlineWordsDuration } from "./UnderlineWords";
import { RepetitionImage, RepetitionImageProps, repetitionDuration } from "./RepetitionImage";
import { PageTransition, PageTransitionProps, pageTransitionDuration } from "./PageTransition";
import { RotatingColumn } from "./RotatingColumn";
import { FallingItems, exampleDrops } from "./FallingItems";
import { OrbitZoom, OrbitZoomProps, orbitZoomDuration } from "./OrbitZoom";
import { KeyPhrase, KeyPhraseProps, examplePhrases, keyPhraseDuration } from "./KeyPhrase";
import { miilesCards } from "./shared";

const V = { fps: 30, width: 1080, height: 1920 };
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CircularCarousel" component={CircularCarousel} durationInFrames={7 * 42} {...V} defaultProps={{ items: defaultItems }} />
    <Composition id="SpiralCarousel" component={SpiralCarousel} durationInFrames={7 * 46} {...V} defaultProps={{ items: spiralItems }} />
    <Composition id="FanCarousel" component={FanCarousel} durationInFrames={8 * 44} {...V} defaultProps={{ items: miilesCards }} />
    <Composition id="WheelVertical" component={WheelCarousel} durationInFrames={8 * 42} {...V} defaultProps={{ items: [...miilesCards, ...miilesCards], direction: "vertical", cardSize: 460, radius: 1710, perspective: 2600 }} />
    <Composition id="WheelHorizontal" component={WheelCarousel} durationInFrames={8 * 42} {...V} defaultProps={{ items: [...miilesCards, ...miilesCards], direction: "horizontal", cardSize: 560, radius: 2020, perspective: 2600 }} />
    <Composition id="TiltedColumns" component={TiltedColumns} durationInFrames={12 * 30} {...V} defaultProps={{ items: miilesCards }} />
    <Composition id="StackSlider" component={StackSlider} durationInFrames={8 * 48} {...V} defaultProps={{ items: miilesCards }} />
    <Composition id="InnerRing" component={InnerRing} durationInFrames={12 * 30} {...V} defaultProps={{ items: [...miilesCards, ...miilesCards.slice(0, 4)] }} />
    <Composition id="PhraseLines" component={KeyPhrase} durationInFrames={keyPhraseDuration({ phrases: examplePhrases, split: "lines", stagger: 6 } as KeyPhraseProps)} {...V} defaultProps={{ phrases: examplePhrases, split: "lines", stagger: 6 } as KeyPhraseProps} />
    <Composition id="PhraseWords" component={KeyPhrase} durationInFrames={keyPhraseDuration({ phrases: examplePhrases, split: "words", stagger: 3 } as KeyPhraseProps)} {...V} defaultProps={{ phrases: examplePhrases, split: "words", stagger: 3 } as KeyPhraseProps} />
    <Composition id="PhraseLetters" component={KeyPhrase} durationInFrames={keyPhraseDuration({ phrases: examplePhrases, split: "letters", stagger: 1 } as KeyPhraseProps)} {...V} defaultProps={{ phrases: examplePhrases, split: "letters", stagger: 1 } as KeyPhraseProps} />
    <Composition id="PhraseSwap" component={KeyPhrase} durationInFrames={keyPhraseDuration({ phrases: examplePhrases, split: "lines", transition: "swap", stagger: 2, enter: 12, exit: 12 } as KeyPhraseProps)} {...V} defaultProps={{ phrases: examplePhrases, split: "lines", transition: "swap", stagger: 2, enter: 12, exit: 12 } as KeyPhraseProps} />
    <Composition id="PhraseFromStart" component={KeyPhrase} durationInFrames={keyPhraseDuration({ phrases: examplePhrases, split: "letters", from: "start", stagger: 1.5 } as KeyPhraseProps)} {...V} defaultProps={{ phrases: examplePhrases, split: "letters", from: "start", stagger: 1.5 } as KeyPhraseProps} />
    <Composition id="PhraseFromCenter" component={KeyPhrase} durationInFrames={keyPhraseDuration({ phrases: examplePhrases, split: "letters", from: "center", stagger: 1.5 } as KeyPhraseProps)} {...V} defaultProps={{ phrases: examplePhrases, split: "letters", from: "center", stagger: 1.5 } as KeyPhraseProps} />
    <Composition id="PhraseFromEnd" component={KeyPhrase} durationInFrames={keyPhraseDuration({ phrases: examplePhrases, split: "letters", from: "end", stagger: 1.5 } as KeyPhraseProps)} {...V} defaultProps={{ phrases: examplePhrases, split: "letters", from: "end", stagger: 1.5 } as KeyPhraseProps} />
    <Composition id="PhraseFromEdges" component={KeyPhrase} durationInFrames={keyPhraseDuration({ phrases: examplePhrases, split: "letters", from: "edges", stagger: 1.5 } as KeyPhraseProps)} {...V} defaultProps={{ phrases: examplePhrases, split: "letters", from: "edges", stagger: 1.5 } as KeyPhraseProps} />
    <Composition id="PhraseFromRandom" component={KeyPhrase} durationInFrames={keyPhraseDuration({ phrases: examplePhrases, split: "letters", from: "random", stagger: 1.5 } as KeyPhraseProps)} {...V} defaultProps={{ phrases: examplePhrases, split: "letters", from: "random", stagger: 1.5 } as KeyPhraseProps} />
    <Composition id="ElasticStack" component={ElasticStack} durationInFrames={10 * 30} {...V} defaultProps={{ text: "VIRAL" }} />
    <Composition id="ResonantLine" component={ResonantLine} durationInFrames={9 * 30} {...V} defaultProps={{}} />
    <Composition id="OrbitZoom" component={OrbitZoom} durationInFrames={orbitZoomDuration({ items: miilesCards, focus: [0, 1] } as OrbitZoomProps)} {...V} defaultProps={{ items: miilesCards.slice(0, 9), focus: [0, 1] } as OrbitZoomProps} />
    <Composition id="EndlessWord" component={EndlessWord} durationInFrames={endlessWordLoopFrames({ word: "Viral" }) * 3} {...V} defaultProps={{ word: "Viral" }} />
    <Composition id="BarReveal" component={BarReveal} durationInFrames={barRevealDuration({ fromText: "Antes de\nvender", toText: "cuenta\nuna buena\nhistoria" } as BarRevealProps)} {...V} defaultProps={{ fromText: "Antes de\nvender", toText: "cuenta\nuna buena\nhistoria" } as BarRevealProps} />
    <Composition id="IconPills" component={IconPills} durationInFrames={22 * 10 + 44} {...V} defaultProps={{ rows: examplePills }} />
    <Composition id="DotsPhrase" component={DotsPhrase} durationInFrames={10 * 30} {...V} defaultProps={{ text: "Contenido\nque conecta\ncon tu gente" }} />
    <Composition id="StackCards" component={StackCards} durationInFrames={stackCardsDuration({ cards: exampleTasks } as StackCardsProps)} {...V} defaultProps={{ cards: exampleTasks }} />
    <Composition id="IconPillsColumn" component={IconPills} durationInFrames={26 * 4 + 52} {...V} defaultProps={{ rows: [[{ icon: "Video", label: "Reels" }], [{ icon: "TrendingUp", label: "Tendencias" }], [{ icon: "Heart", label: "Likes" }], [{ icon: "ShoppingBag", label: "Ventas" }]], fontSize: 92, every: 26 }} />
    <Composition id="FlipGrow" component={FlipGrow} durationInFrames={flipGrowDuration({ images: [] })} {...V} defaultProps={{ images: ["carrusel/rosa.jpg", "carrusel/gorra.jpg", "carrusel/azul.jpg", "carrusel/foto.jpg", "carrusel/rosa.jpg", "carrusel/gorra.jpg", "carrusel/azul.jpg", "carrusel/foto.jpg"] }} />
    <Composition id="CasesColumn" component={CasesColumn} durationInFrames={10 * 48} {...V} defaultProps={{ items: miilesCards }} />
    <Composition id="DepthGallery" component={DepthGallery} durationInFrames={12 * 30} {...V} defaultProps={{ items: miilesCards }} />
    <Composition id="RotatingColumn" component={RotatingColumn} durationInFrames={10 * 50} {...V} defaultProps={{ items: miilesCards }} />
    <Composition id="FallingItems" component={FallingItems} durationInFrames={10 * 30} {...V} defaultProps={{ text: "Contenido que\nse guarda\ny se comparte", drops: exampleDrops }} />
    <Composition id="FallingItemsTop" component={FallingItems} durationInFrames={10 * 30} {...V} defaultProps={{ text: "Contenido que\nse guarda\ny se comparte", drops: exampleDrops, fromTop: true, sources: 2, every: 5 }} />
    <Composition id="Transition-scale" component={PageTransition} durationInFrames={pageTransitionDuration({ variant: "scale" } as PageTransitionProps)} {...V} defaultProps={{ variant: "scale" } as PageTransitionProps} />
    <Composition id="Transition-dissolve" component={PageTransition} durationInFrames={pageTransitionDuration({ variant: "dissolve", to: { text: "Contenido\nque se\nsiente real", background: "#FCB5B9", color: "#111111" }, overlayColor: "#4059F1" } as PageTransitionProps)} {...V} defaultProps={{ variant: "dissolve", to: { text: "Contenido\nque se\nsiente real", background: "#FCB5B9", color: "#111111" }, overlayColor: "#4059F1" } as PageTransitionProps} />
    <Composition id="Transition-curve" component={PageTransition} durationInFrames={pageTransitionDuration({ variant: "curve", to: { text: "Contenido\nque se\nsiente real", background: "#111111", color: "#FFFFFF" }, overlayColor: "#4059F1" } as PageTransitionProps)} {...V} defaultProps={{ variant: "curve", to: { text: "Contenido\nque se\nsiente real", background: "#111111", color: "#FFFFFF" }, overlayColor: "#4059F1" } as PageTransitionProps} />
    <Composition id="Transition-line" component={PageTransition} durationInFrames={pageTransitionDuration({ variant: "line", overlayColor: "#111111", to: { text: "Contenido\nque se\nsiente real", background: "#E8ECFE", color: "#111111" } } as PageTransitionProps)} {...V} defaultProps={{ variant: "line", overlayColor: "#111111", to: { text: "Contenido\nque se\nsiente real", background: "#E8ECFE", color: "#111111" } } as PageTransitionProps} />
    <Composition id="Transition-spiral" component={PageTransition} durationInFrames={pageTransitionDuration({ variant: "spiral", overlayColor: "#FCB5B9", to: { text: "Contenido\nque se\nsiente real", background: "#4059F1", color: "#FFFFFF" } } as PageTransitionProps)} {...V} defaultProps={{ variant: "spiral", overlayColor: "#FCB5B9", to: { text: "Contenido\nque se\nsiente real", background: "#4059F1", color: "#FFFFFF" } } as PageTransitionProps} />
    <Composition id="Transition-window" component={PageTransition} durationInFrames={pageTransitionDuration({ variant: "window", overlayColor: "#4059F1", to: { text: "", image: "carrusel/foto.jpg" } } as PageTransitionProps)} {...V} defaultProps={{ variant: "window", overlayColor: "#4059F1", to: { text: "", image: "carrusel/foto.jpg" } } as PageTransitionProps} />
    <Composition id="StickyGrid" component={StickyGrid} durationInFrames={stickyGridDuration({})} {...V} defaultProps={{ items: [...miilesCards, ...miilesCards].slice(0, 12), text: "Lo que haces\nmerece\nser visto" }} />
    <Composition id="GooeySearch" component={GooeySearch} durationInFrames={gooeySearchDuration({})} {...V} defaultProps={{}} />
    <Composition id="RepetitionPill" component={RepetitionImage} durationInFrames={repetitionDuration({ image: "carrusel/foto.jpg", shape: "pill", elems: 4 } as RepetitionImageProps)} {...V} defaultProps={{ image: "carrusel/foto.jpg", shape: "pill", elems: 4 } as RepetitionImageProps} />
    <Composition id="RepetitionArch" component={RepetitionImage} durationInFrames={repetitionDuration({ image: "carrusel/gorra.jpg", shape: "arch", origin: "50% 100%", elems: 6, initialScale: 2.5 } as RepetitionImageProps)} {...V} defaultProps={{ image: "carrusel/gorra.jpg", shape: "arch", origin: "50% 100%", elems: 6, initialScale: 2.5 } as RepetitionImageProps} />
    <Composition id="RepetitionBars" component={RepetitionImage} durationInFrames={repetitionDuration({ image: "carrusel/foto.jpg", shape: "rect", animate: "scaleX", origin: "0% 50%", elems: 5 } as RepetitionImageProps)} {...V} defaultProps={{ image: "carrusel/foto.jpg", shape: "rect", animate: "scaleX", origin: "0% 50%", elems: 5 } as RepetitionImageProps} />
    <Composition id="Underline-line" component={UnderlineWords} durationInFrames={underlineWordsDuration({ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "line" } as UnderlineWordsProps)} {...V} defaultProps={{ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "line" } as UnderlineWordsProps} />
    <Composition id="Underline-double" component={UnderlineWords} durationInFrames={underlineWordsDuration({ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "double" } as UnderlineWordsProps)} {...V} defaultProps={{ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "double" } as UnderlineWordsProps} />
    <Composition id="Underline-strike" component={UnderlineWords} durationInFrames={underlineWordsDuration({ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "strike" } as UnderlineWordsProps)} {...V} defaultProps={{ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "strike" } as UnderlineWordsProps} />
    <Composition id="Underline-arc" component={UnderlineWords} durationInFrames={underlineWordsDuration({ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "arc" } as UnderlineWordsProps)} {...V} defaultProps={{ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "arc" } as UnderlineWordsProps} />
    <Composition id="Underline-scribble" component={UnderlineWords} durationInFrames={underlineWordsDuration({ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "scribble" } as UnderlineWordsProps)} {...V} defaultProps={{ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "scribble" } as UnderlineWordsProps} />
    <Composition id="Underline-wave" component={UnderlineWords} durationInFrames={underlineWordsDuration({ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "wave" } as UnderlineWordsProps)} {...V} defaultProps={{ text: "Contenido que\n*conecta* con\ntu *gente*", underline: "wave" } as UnderlineWordsProps} />
    <Composition id="SlideWords" component={SlideWords} durationInFrames={slideWordsDuration({ words: ["Crea", "Graba", "Edita", "Publica", "Crece"], items: miilesCards })} {...V} defaultProps={{ words: ["Crea", "Graba", "Edita", "Publica", "Crece"], items: miilesCards }} />
    <Composition id="ScrollLetters-1" component={ScrollLetters} durationInFrames={scrollLettersDuration({ slides: [{ image: "carrusel/foto.jpg", word: "Crea" }, { image: "carrusel/gorra.jpg", word: "Graba" }, { image: "carrusel/rosa.jpg", word: "Edita" }, { image: "carrusel/azul.jpg", word: "Publica" }], demo: 1 } as ScrollLettersProps)} {...V} defaultProps={{ slides: [{ image: "carrusel/foto.jpg", word: "Crea" }, { image: "carrusel/gorra.jpg", word: "Graba" }, { image: "carrusel/rosa.jpg", word: "Edita" }, { image: "carrusel/azul.jpg", word: "Publica" }], demo: 1 } as ScrollLettersProps} />
    <Composition id="ScrollLetters-2" component={ScrollLetters} durationInFrames={scrollLettersDuration({ slides: [{ image: "carrusel/foto.jpg", word: "Crea" }, { image: "carrusel/gorra.jpg", word: "Graba" }, { image: "carrusel/rosa.jpg", word: "Edita" }, { image: "carrusel/azul.jpg", word: "Publica" }], demo: 2 } as ScrollLettersProps)} {...V} defaultProps={{ slides: [{ image: "carrusel/foto.jpg", word: "Crea" }, { image: "carrusel/gorra.jpg", word: "Graba" }, { image: "carrusel/rosa.jpg", word: "Edita" }, { image: "carrusel/azul.jpg", word: "Publica" }], demo: 2 } as ScrollLettersProps} />
    <Composition id="ScrollLetters-3" component={ScrollLetters} durationInFrames={scrollLettersDuration({ slides: [{ image: "carrusel/foto.jpg", word: "Crea" }, { image: "carrusel/gorra.jpg", word: "Graba" }, { image: "carrusel/rosa.jpg", word: "Edita" }, { image: "carrusel/azul.jpg", word: "Publica" }], demo: 3, textColor: "#111111" } as ScrollLettersProps)} {...V} defaultProps={{ slides: [{ image: "carrusel/foto.jpg", word: "Crea" }, { image: "carrusel/gorra.jpg", word: "Graba" }, { image: "carrusel/rosa.jpg", word: "Edita" }, { image: "carrusel/azul.jpg", word: "Publica" }], demo: 3, textColor: "#111111" } as ScrollLettersProps} />
    <Composition id="ScrollLetters-4" component={ScrollLetters} durationInFrames={scrollLettersDuration({ slides: [{ image: "carrusel/foto.jpg", word: "Crea" }, { image: "carrusel/gorra.jpg", word: "Graba" }, { image: "carrusel/rosa.jpg", word: "Edita" }, { image: "carrusel/azul.jpg", word: "Publica" }], demo: 4 } as ScrollLettersProps)} {...V} defaultProps={{ slides: [{ image: "carrusel/foto.jpg", word: "Crea" }, { image: "carrusel/gorra.jpg", word: "Graba" }, { image: "carrusel/rosa.jpg", word: "Edita" }, { image: "carrusel/azul.jpg", word: "Publica" }], demo: 4 } as ScrollLettersProps} />
    <Composition id="Page-curtain" component={PageChange} durationInFrames={pageChangeDuration({ variant: "curtain" })} {...V} defaultProps={{ variant: "curtain" } as PageChangeProps} />
    <Composition id="Page-wipe" component={PageChange} durationInFrames={pageChangeDuration({ variant: "wipe" })} {...V} defaultProps={{ variant: "wipe" } as PageChangeProps} />
    <Composition id="Page-columns" component={PageChange} durationInFrames={pageChangeDuration({ variant: "columns" })} {...V} defaultProps={{ variant: "columns" } as PageChangeProps} />
    <Composition id="Page-circle" component={PageChange} durationInFrames={pageChangeDuration({ variant: "circle" })} {...V} defaultProps={{ variant: "circle" } as PageChangeProps} />
    <Composition id="Page-typewriter" component={PageChange} durationInFrames={pageChangeDuration({ variant: "typewriter" })} {...V} defaultProps={{ variant: "typewriter" } as PageChangeProps} />
    <Composition id="Page-stack" component={PageChange} durationInFrames={pageChangeDuration({ variant: "stack" })} {...V} defaultProps={{ variant: "stack" } as PageChangeProps} />
    <Composition id="Page-slide-over" component={PageChange} durationInFrames={pageChangeDuration({ variant: "slide-over" })} {...V} defaultProps={{ variant: "slide-over" } as PageChangeProps} />
    <Composition id="Page-peel" component={PageChange} durationInFrames={pageChangeDuration({ variant: "peel" })} {...V} defaultProps={{ variant: "peel" } as PageChangeProps} />
    <Composition id="Page-slices" component={PageChange} durationInFrames={pageChangeDuration({ variant: "slices" })} {...V} defaultProps={{ variant: "slices" } as PageChangeProps} />
    <Composition id="Page-frame" component={PageChange} durationInFrames={pageChangeDuration({ variant: "frame" })} {...V} defaultProps={{ variant: "frame" } as PageChangeProps} />
    <Composition id="Page-carousel" component={PageChange} durationInFrames={pageChangeDuration({ variant: "carousel" })} {...V} defaultProps={{ variant: "carousel" } as PageChangeProps} />
    <Composition id="Page-cube" component={PageChange} durationInFrames={pageChangeDuration({ variant: "cube" })} {...V} defaultProps={{ variant: "cube" } as PageChangeProps} />
    <Composition id="Page-corner" component={PageChange} durationInFrames={pageChangeDuration({ variant: "corner" })} {...V} defaultProps={{ variant: "corner" } as PageChangeProps} />
    <Composition id="Page-tear" component={PageChange} durationInFrames={pageChangeDuration({ variant: "tear" })} {...V} defaultProps={{ variant: "tear" } as PageChangeProps} />
    <Composition id="Page-dither" component={PageChange} durationInFrames={pageChangeDuration({ variant: "dither" })} {...V} defaultProps={{ variant: "dither" } as PageChangeProps} />
    <Composition id="Page-dissolve" component={PageChange} durationInFrames={pageChangeDuration({ variant: "dissolve" })} {...V} defaultProps={{ variant: "dissolve" } as PageChangeProps} />
    <Composition id="Page-ink" component={PageChange} durationInFrames={pageChangeDuration({ variant: "ink" })} {...V} defaultProps={{ variant: "ink" } as PageChangeProps} />
    <Composition id="Page-spiral" component={PageChange} durationInFrames={pageChangeDuration({ variant: "spiral" })} {...V} defaultProps={{ variant: "spiral" } as PageChangeProps} />
    <Composition id="Page-velvet" component={PageChange} durationInFrames={pageChangeDuration({ variant: "velvet" })} {...V} defaultProps={{ variant: "velvet" } as PageChangeProps} />
    <Composition id="Page-channel" component={PageChange} durationInFrames={pageChangeDuration({ variant: "channel" })} {...V} defaultProps={{ variant: "channel" } as PageChangeProps} />
    <Composition id="Escena01" component={Escena01} durationInFrames={ESCENA01_FRAMES} {...V} />
    <Composition id="GridFlip" component={GridFlip} durationInFrames={gridFlipDuration({})} {...V} defaultProps={{ items: miilesCards }} />
    <Composition id="GridFlipAll" component={GridFlip} durationInFrames={gridFlipDuration({ layouts: [{ cols: 5, rows: 0, width: 900 }, { cols: 3, rows: 0, width: 900 }, { cols: 4, rows: 0, width: 900 }] })} {...V} defaultProps={{ items: miilesCards, flow: true, count: 15, ratio: 1.15, gap: 14, layouts: [{ cols: 5, rows: 0, width: 900 }, { cols: 3, rows: 0, width: 900 }, { cols: 4, rows: 0, width: 900 }] }} />
  </>
);
