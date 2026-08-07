import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Palette, Sparkles } from 'lucide-react';

// ─── Color conversion helpers ─────────────────────────────────────────────────

function hsvToHex(h: number, s: number, v: number): string {
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToHsv(hex: string): [number, number, number] {
  let cleaned = hex.replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  if (cleaned.length !== 6) return [0, 100, 100];

  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
  }
  const s = max === 0 ? 0 : Math.round((d / max) * 100);
  const v = Math.round(max * 100);
  return [h, s, v];
}

function isValidHex(hex: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(hex);
}

// ─── Preset swatches ──────────────────────────────────────────────────────────

const PRESETS = [
  { hex: '#EF4444', label: 'Rojo' },
  { hex: '#F97316', label: 'Naranja' },
  { hex: '#EAB308', label: 'Amarillo' },
  { hex: '#22C55E', label: 'Verde' },
  { hex: '#14B8A6', label: 'Teal' },
  { hex: '#3B82F6', label: 'Azul' },
  { hex: '#8B5CF6', label: 'Violeta' },
  { hex: '#EC4899', label: 'Rosa' },
  { hex: '#1C1C1E', label: 'Negro' },
  { hex: '#6B7280', label: 'Gris' },
  { hex: '#F9FAFB', label: 'Blanco' },
  { hex: '#92400E', label: 'Café' },
  { hex: '#D4AF37', label: 'Dorado' },
  { hex: '#C0C0C0', label: 'Plata' },
  { hex: '#1E3A5F', label: 'Azul marino' },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface ColorPickerInputProps {
  value: string | string[];
  onChange: (colors: string[]) => void;
}

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({ value, onChange }) => {
  const colors: string[] = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim() && value !== 'Sin definir'
    ? [value]
    : [];

  const handleRemove = (idx: number) => {
    const next = colors.filter((_, i) => i !== idx);
    onChange(next);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(355);
  const [saturation, setSaturation] = useState(75);
  const [brightness, setBrightness] = useState(88);
  const [hexInput, setHexInput] = useState('#D44C4C');

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Sync HEX input with HSV changes
  useEffect(() => {
    setHexInput(hsvToHex(hue, saturation, brightness));
  }, [hue, saturation, brightness]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  // ── Canvas drag ──────────────────────────────────────────────────────────────
  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    setSaturation(Math.round(x * 100));
    setBrightness(Math.round((1 - y) * 100));
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    updateFromPointer(e.clientX, e.clientY);
    const onMove = (ev: MouseEvent) => {
      if (isDragging.current) updateFromPointer(ev.clientX, ev.clientY);
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [updateFromPointer]);

  const handleCanvasTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    updateFromPointer(touch.clientX, touch.clientY);
    const onTouchMove = (ev: TouchEvent) => {
      ev.preventDefault();
      const t = ev.touches[0];
      updateFromPointer(t.clientX, t.clientY);
    };
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', () => window.removeEventListener('touchmove', onTouchMove), { once: true });
  }, [updateFromPointer]);

  // ── HEX input handler ────────────────────────────────────────────────────────
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#') && val.length > 0) {
      val = '#' + val;
    }
    setHexInput(val);
    if (isValidHex(val)) {
      const formatted = val.startsWith('#') ? val : `#${val}`;
      const [h, s, v] = hexToHsv(formatted);
      setHue(h);
      setSaturation(s);
      setBrightness(v);
    }
  };

  const handlePreset = (hex: string) => {
    const [h, s, v] = hexToHsv(hex);
    setHue(h);
    setSaturation(s);
    setBrightness(v);
    setHexInput(hex.toUpperCase());
  };

  const currentHex = hsvToHex(hue, saturation, brightness);
  const isAlreadyAdded = colors.includes(currentHex);

  const handleAdd = () => {
    if (!isAlreadyAdded && colors.length < 6) {
      onChange([...colors, currentHex]);
    }
    setIsOpen(false);
  };

  const cursorLeft = `${saturation}%`;
  const cursorTop = `${100 - brightness}%`;

  return (
    <div className="relative font-sans w-full max-w-xl">
      {/* ── Selected chips ──────────────────────────────────────────────────────── */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mb-5">
          {colors.map((color, idx) => (
            <div
              key={`${color}-${idx}`}
              className="group flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              <div
                className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 shrink-0 shadow-inner"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono font-medium tracking-wider text-neutral-800 dark:text-neutral-200 uppercase">
                {color}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                aria-label={`Eliminar color ${color}`}
                className="w-4 h-4 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors ml-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Open Picker Button ──────────────────────────────────────────────────── */}
      {colors.length < 6 && (
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#121214] text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:border-neutral-900 dark:hover:border-white hover:shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar color</span>
          </button>
        </div>
      )}

      {/* ── Modal Picker (Centered Dialog with Backdrop) ─────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-white dark:bg-[#141417] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 p-5 sm:p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                      Selector de color
                    </h3>
                    <p className="text-xs text-neutral-400 font-light">
                      Elige el tono perfecto o ingresa un código HEX
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body: 2 Columns on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {/* ── Left Column: Big Color Preview & Suggestions ───────────────── */}
                <div className="flex flex-col justify-between space-y-4">
                  {/* Big Color Preview Box with Editable HEX inside top corner */}
                  <div>
                    <span className="block text-xs font-normal text-neutral-500 dark:text-neutral-400 mb-2">
                      Vista previa
                    </span>
                    <div
                      className="w-full h-32 sm:h-36 rounded-2xl relative shadow-md transition-colors overflow-hidden flex flex-col justify-between p-3 border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: currentHex }}
                    >
                      {/* Top Corner: Editable HEX pill */}
                      <div className="flex items-center justify-between">
                        <div className="bg-black/40 backdrop-blur-md border border-white/25 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                          <span className="text-[10px] font-mono font-semibold text-white/70">#</span>
                          <input
                            type="text"
                            value={hexInput.replace(/^#/, '')}
                            onChange={handleHexChange}
                            maxLength={6}
                            spellCheck={false}
                            className="w-16 bg-transparent text-white text-xs font-mono font-bold tracking-wider outline-none"
                            placeholder="FFFFFF"
                          />
                        </div>
                        <span className="text-[10px] font-mono font-medium text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md">
                          {saturation}% Sat
                        </span>
                      </div>

                      {/* Bottom indicator */}
                      <div className="flex items-center justify-between text-white/90">
                        <span className="text-xs font-mono font-bold tracking-wide drop-shadow-sm">
                          {currentHex}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions Swatches */}
                  <div>
                    <span className="block text-xs font-normal text-neutral-500 dark:text-neutral-400 mb-2">
                      Sugerencias
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESETS.map((p) => {
                        const isSelected = hexInput.toUpperCase() === p.hex.toUpperCase();
                        return (
                          <button
                            key={p.hex}
                            type="button"
                            title={p.label}
                            onClick={() => handlePreset(p.hex)}
                            className="w-6 h-6 rounded-full transition-transform hover:scale-115 active:scale-95 border border-black/10 dark:border-white/10 shrink-0"
                            style={{
                              backgroundColor: p.hex,
                              boxShadow: isSelected
                                ? '0 0 0 2px #fff, 0 0 0 4px #000'
                                : 'none',
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Right Column: 2D Gradient Canvas & Hue Slider ───────────────── */}
                <div className="flex flex-col justify-between space-y-4">
                  <div>
                    <span className="block text-xs font-normal text-neutral-500 dark:text-neutral-400 mb-2">
                      Gradiente y brillo
                    </span>
                    {/* Gradient 2D Canvas */}
                    <div
                      ref={canvasRef}
                      onMouseDown={handleCanvasMouseDown}
                      onTouchStart={handleCanvasTouchStart}
                      className="relative w-full h-32 sm:h-36 rounded-2xl cursor-crosshair overflow-hidden touch-none shadow-inner border border-neutral-200 dark:border-neutral-800"
                      style={{
                        background: [
                          'linear-gradient(to bottom, transparent 0%, #000 100%)',
                          `linear-gradient(to right, #fff 0%, hsl(${hue}, 100%, 50%) 100%)`,
                        ].join(', '),
                      }}
                    >
                      <div
                        className="absolute w-5 h-5 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 shadow-lg"
                        style={{
                          left: cursorLeft,
                          top: cursorTop,
                          backgroundColor: currentHex,
                          boxShadow:
                            '0 0 0 2px #fff, 0 0 0 3.5px rgba(0,0,0,0.3), 0 3px 10px rgba(0,0,0,0.5)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Hue Slider */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                      <span>Tono (Espectro)</span>
                      <span className="font-mono">{hue}°</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={hue}
                        onChange={(e) => setHue(Number(e.target.value))}
                        className="flex-1 h-3 rounded-full appearance-none cursor-pointer outline-none shadow-inner"
                        style={{
                          background:
                            'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)',
                          WebkitAppearance: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer: Confirm Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isAlreadyAdded || colors.length >= 6}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isAlreadyAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ya agregado</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Seleccionar color</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
