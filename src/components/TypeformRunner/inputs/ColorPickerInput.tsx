import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Plus } from 'lucide-react';

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
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
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
  return /^#[0-9a-fA-F]{6}$/.test(hex);
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
  { hex: '#F9FAFB', label: 'Blanco' },
  { hex: '#6B7280', label: 'Gris' },
  { hex: '#1C1C1E', label: 'Negro' },
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
  // Normalize value: always an array of hex strings
  const colors: string[] = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim()
    ? [value]
    : [];

  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue]             = useState(0);
  const [saturation, setSaturation] = useState(70);
  const [brightness, setBrightness] = useState(85);
  const [hexInput, setHexInput]   = useState('#D44C4C');

  const canvasRef  = useRef<HTMLDivElement>(null);
  const pickerRef  = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Sync hex display → driven by hsv state
  useEffect(() => {
    setHexInput(hsvToHex(hue, saturation, brightness));
  }, [hue, saturation, brightness]);

  // Close picker when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen]);

  // ── Canvas drag logic ────────────────────────────────────────────────────────
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

  // Touch support for canvas
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

  // ── HEX input ────────────────────────────────────────────────────────────────
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHex(val)) {
      const [h, s, v] = hexToHsv(val);
      setHue(h);
      setSaturation(s);
      setBrightness(v);
    }
  };

  // ── Preset swatch click ───────────────────────────────────────────────────────
  const handlePreset = (hex: string) => {
    const [h, s, v] = hexToHsv(hex);
    setHue(h);
    setSaturation(s);
    setBrightness(v);
  };

  // ── Add / remove colors ────────────────────────────────────────────────────────
  const handleAdd = () => {
    const hex = hsvToHex(hue, saturation, brightness);
    if (!colors.includes(hex) && colors.length < 6) {
      onChange([...colors, hex]);
    }
    setIsOpen(false);
  };

  const handleRemove = (idx: number) => {
    onChange(colors.filter((_, i) => i !== idx));
  };

  const currentHex = hsvToHex(hue, saturation, brightness);
  const cursorLeft = `${saturation}%`;
  const cursorTop  = `${100 - brightness}%`;

  return (
    <div className="relative font-sans">

      {/* ── Selected chips ─────────────────────────────────────────────────────── */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mb-5">
          {colors.map((color, idx) => (
            <div
              key={`${color}-${idx}`}
              className="group flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
            >
              <div
                className="w-6 h-6 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono tracking-wide text-neutral-600 dark:text-neutral-400 uppercase">
                {color}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                aria-label={`Eliminar color ${color}`}
                className="w-4 h-4 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Add button ────────────────────────────────────────────────────────── */}
      {colors.length < 6 && (
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-300 hover:border-neutral-700 dark:hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar color</span>
        </button>
      )}

      {/* ── Picker panel ──────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute left-0 top-full mt-3 w-72 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3.5 select-none"
        >
          {/* Gradient canvas */}
          <div
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onTouchStart={handleCanvasTouchStart}
            className="relative w-full h-44 rounded-xl cursor-crosshair overflow-hidden touch-none"
            style={{
              background: [
                'linear-gradient(to bottom, transparent 0%, #000 100%)',
                `linear-gradient(to right, #fff 0%, hsl(${hue}, 100%, 50%) 100%)`,
              ].join(', '),
            }}
          >
            {/* Cursor dot */}
            <div
              className="absolute w-4 h-4 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: cursorLeft,
                top: cursorTop,
                backgroundColor: currentHex,
                boxShadow: '0 0 0 2px #fff, 0 0 0 3px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.4)',
              }}
            />
          </div>

          {/* Hue rainbow slider */}
          <div className="flex items-center gap-3">
            {/* Preview swatch */}
            <div
              className="w-7 h-7 rounded-full shrink-0 border border-black/10"
              style={{ backgroundColor: currentHex }}
            />
            <input
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="flex-1 h-3 rounded-full appearance-none cursor-pointer outline-none"
              style={{
                background:
                  'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)',
                WebkitAppearance: 'none',
              }}
            />
          </div>

          {/* HEX input row */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-normal text-neutral-400 shrink-0 w-8">HEX</span>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              maxLength={7}
              spellCheck={false}
              className="flex-1 text-sm font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 outline-none focus:border-neutral-500 dark:focus:border-neutral-500 transition-colors"
              placeholder="#000000"
            />
            <div
              className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 shrink-0"
              style={{ backgroundColor: isValidHex(hexInput) ? hexInput : '#ccc' }}
            />
          </div>

          {/* Preset swatches */}
          <div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-2.5">Sugerencias</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const isSelected = hexInput.toLowerCase() === p.hex.toLowerCase();
                return (
                  <button
                    key={p.hex}
                    type="button"
                    title={p.label}
                    onClick={() => handlePreset(p.hex)}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-110 active:scale-95"
                    style={{
                      backgroundColor: p.hex,
                      boxShadow: isSelected
                        ? '0 0 0 2px #fff, 0 0 0 3.5px #000'
                        : '0 0 0 1px rgba(0,0,0,0.15)',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Confirm button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={colors.includes(currentHex)}
            className="w-full py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-normal hover:opacity-85 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {colors.includes(currentHex) ? 'Ya agregado' : 'Agregar'}
          </button>
        </div>
      )}
    </div>
  );
};
