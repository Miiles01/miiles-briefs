import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// Estilos de identidad visual: cada uno muestra "Aa" con su tipografía
export interface BrandStyle {
  id: string;
  label: string;
  description: string;
  fontFamily: string;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: string;
}

export const BRAND_STYLES: BrandStyle[] = [
  { id: 'minimalista', label: 'Minimalista', description: 'Limpio y ligero', fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: '-0.04em' },
  { id: 'elegante', label: 'Elegante', description: 'Editorial y sofisticado', fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: 'italic' },
  { id: 'clasico', label: 'Clásico', description: 'Atemporal, de revista', fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 },
  { id: 'moderno', label: 'Moderno', description: 'Geométrico y actual', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '-0.03em' },
  { id: 'impacto', label: 'Impacto', description: 'Fuerte y llamativo', fontFamily: "'Anton', sans-serif", fontWeight: 400 },
  { id: 'gotico', label: 'Gótico', description: 'Oscuro y con carácter', fontFamily: "'UnifrakturMaguntia', serif", fontWeight: 400 },
  { id: 'retro', label: 'Retro', description: 'Nostálgico, años 70', fontFamily: "'Shrikhand', cursive", fontWeight: 400 },
  { id: 'manuscrito', label: 'Manuscrito', description: 'Cercano, hecho a mano', fontFamily: "'Caveat', cursive", fontWeight: 600 },
  { id: 'divertido', label: 'Divertido', description: 'Redondo y juguetón', fontFamily: "'Fredoka', sans-serif", fontWeight: 600 },
  { id: 'tech', label: 'Tech', description: 'Digital y preciso', fontFamily: "'Space Mono', monospace", fontWeight: 700 },
  { id: 'futurista', label: 'Futurista', description: 'Y2K, de otro planeta', fontFamily: "'Orbitron', sans-serif", fontWeight: 700 },
  { id: 'organico', label: 'Orgánico', description: 'Suave y natural', fontFamily: "'Fraunces', serif", fontWeight: 300 },
];

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@600&family=Cormorant+Garamond:wght@500&family=Fraunces:opsz,wght@9..144,300&family=Fredoka:wght@600&family=Inter:wght@300&family=Orbitron:wght@700&family=Playfair+Display:ital@1&family=Shrikhand&family=Space+Mono:wght@700&family=Syne:wght@700&family=UnifrakturMaguntia&display=swap';

// ─── Contraste (WCAG) ─────────────────────────────────────────────────────────

const normHex = (hex: string): string | null => {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return /^[0-9a-fA-F]{6}$/.test(h) ? `#${h.toUpperCase()}` : null;
};

const luminance = (hex: string): number => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (a: string, b: string): number => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const INK = '#111111';
const PAPER = '#FFFFFF';

// Letra blanca si se lee bien (contraste ≥ 3, suficiente para el "Aa" grande); si no, negra.
// Así queda blanco sobre azul o rosa y negro sobre amarillo o verde claro.
export const bestInk = (bg: string): string => (contrastRatio(bg, PAPER) >= 3 ? PAPER : INK);

// Combinaciones fondo/letra a partir de los colores de la persona, siempre legibles
export const buildColorPairs = (rawColors: unknown): Array<{ bg: string; fg: string }> => {
  const colors = (Array.isArray(rawColors) ? rawColors : [])
    .map((c) => (typeof c === 'string' ? normHex(c) : null))
    .filter((c): c is string => Boolean(c))
    .filter((c, i, arr) => arr.indexOf(c) === i);

  if (colors.length === 0) return [{ bg: '#F4F1EA', fg: INK }, { bg: INK, fg: '#F4F1EA' }];

  const pairs: Array<{ bg: string; fg: string }> = [];
  const add = (bg: string, fg: string) => {
    if (!pairs.some((p) => p.bg === bg && p.fg === fg)) pairs.push({ bg, fg });
  };

  // 1) Sus colores combinados entre sí, del más legible al menos (contraste mínimo 3)
  const own: Array<{ bg: string; fg: string; ratio: number }> = [];
  colors.forEach((bg, i) =>
    colors.forEach((fg, j) => {
      const ratio = contrastRatio(bg, fg);
      if (i !== j && ratio >= 3) own.push({ bg, fg, ratio });
    })
  );
  own.sort((a, b) => b.ratio - a.ratio).forEach(({ bg, fg }) => add(bg, fg));
  // 2) Cada color de fondo con letra blanca o negra
  colors.forEach((bg) => add(bg, bestInk(bg)));
  // 3) Cada color como letra sobre negro o blanco, para que haya variedad aun con un solo color
  colors.forEach((fg) => {
    const bg = contrastRatio(INK, fg) >= contrastRatio(PAPER, fg) ? INK : PAPER;
    if (contrastRatio(bg, fg) >= 3) add(bg, fg);
  });
  return pairs;
};

// ─── Componente ───────────────────────────────────────────────────────────────

export interface StyleChoice {
  id: string;
  label: string;
  bg: string;
  fg: string;
}

interface StyleGridProps {
  value: StyleChoice | undefined;
  onChange: (val: StyleChoice) => void;
  colors: unknown;
  onAutoSubmit?: () => void;
}

export const useBrandStyleFonts = () => {
  useEffect(() => {
    if (document.querySelector('link[data-brand-style-fonts]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_URL;
    link.setAttribute('data-brand-style-fonts', '');
    document.head.appendChild(link);
  }, []);
};

export const StyleGrid: React.FC<StyleGridProps> = ({ value, onChange, colors, onAutoSubmit }) => {
  useBrandStyleFonts();
  const pairs = useMemo(() => buildColorPairs(colors), [colors]);

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans">
      {BRAND_STYLES.map((style, idx) => {
        const { bg, fg } = pairs[idx % pairs.length];
        const isSelected = value?.id === style.id;

        return (
          <motion.button
            key={style.id}
            type="button"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onChange({ id: style.id, label: style.label, bg, fg });
              if (onAutoSubmit) setTimeout(onAutoSubmit, 320);
            }}
            aria-pressed={isSelected}
            className={`relative text-left rounded-2xl overflow-hidden border transition-all ${
              isSelected
                ? 'border-neutral-900 dark:border-white ring-2 ring-offset-2 ring-neutral-900 dark:ring-white ring-offset-white dark:ring-offset-neutral-950'
                : 'border-neutral-200/80 dark:border-neutral-800'
            }`}
          >
            <div
              className="relative aspect-square sm:aspect-[5/4] flex flex-col items-center justify-center gap-2 sm:gap-3"
              style={{ backgroundColor: bg, color: fg }}
            >
              <span
                className="leading-none select-none"
                style={{
                  fontFamily: style.fontFamily,
                  fontWeight: style.fontWeight,
                  fontStyle: style.fontStyle,
                  letterSpacing: style.letterSpacing,
                  fontSize: 'clamp(3.6rem, 11vw, 6.5rem)',
                }}
              >
                Aa
              </span>
              <span className="text-sm sm:text-base font-normal leading-none select-none">{style.label}</span>
              <span
                className="absolute top-3 right-3 w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all"
                style={
                  isSelected
                    ? { backgroundColor: fg, borderColor: fg, color: bg }
                    : { borderColor: fg, opacity: 0.45 }
                }
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
