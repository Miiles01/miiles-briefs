import React from 'react';
import { motion } from 'framer-motion';
import { ColorPaletteOption } from '../../../types/brief';
import { Check } from 'lucide-react';

interface ColorPalettePickerProps {
  palettes: ColorPaletteOption[];
  value: string;
  onChange: (id: string) => void;
  onAutoSubmit?: () => void;
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  palettes,
  value,
  onChange,
  onAutoSubmit,
}) => {
  const handleSelect = (id: string) => {
    onChange(id);
    if (onAutoSubmit) {
      setTimeout(() => {
        onAutoSubmit();
      }, 280);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
      {palettes.map((palette) => {
        const isSelected = value === palette.id;

        return (
          <motion.div
            key={palette.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(palette.id)}
            className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 border ${
              isSelected
                ? 'bg-brand/10 dark:bg-brand/15 border-brand dark:border-brand shadow-[0_0_25px_rgba(64,89,241,0.25)] ring-1 ring-brand'
                : 'bg-white dark:bg-neutral-900/90 hover:bg-neutral-50 dark:hover:bg-neutral-850 border-neutral-200 dark:border-neutral-800 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                {palette.name}
              </h4>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-brand border-brand text-white'
                    : 'border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Swatches bar */}
            <div className="flex items-center gap-1.5 h-9 rounded-xl overflow-hidden p-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
              {palette.colors.map((color, cIdx) => (
                <div
                  key={cIdx}
                  className="flex-1 h-full rounded-lg shadow-inner transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5 font-light">
              {palette.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};
