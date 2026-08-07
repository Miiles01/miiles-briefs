import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

interface BudgetOption {
  id: string;
  label: string;
  range: string;
  popular?: boolean;
}

interface BudgetSliderProps {
  options: BudgetOption[];
  value: string;
  onChange: (val: string) => void;
  onAutoSubmit?: () => void;
}

export const BudgetSlider: React.FC<BudgetSliderProps> = ({
  options,
  value,
  onChange,
  onAutoSubmit,
}) => {
  const handleSelect = (id: string) => {
    onChange(id);
    if (onAutoSubmit) {
      setTimeout(() => {
        onAutoSubmit();
      }, 250);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
      {options.map((opt) => {
        const isSelected = value === opt.id;

        return (
          <motion.div
            key={opt.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(opt.id)}
            className={`relative cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-200 border flex flex-col justify-between ${
              isSelected
                ? 'bg-brand/10 dark:bg-brand/15 border-brand dark:border-brand shadow-[0_0_25px_rgba(64,89,241,0.25)] ring-1 ring-brand'
                : 'bg-white dark:bg-neutral-900/90 hover:bg-neutral-50 dark:hover:bg-neutral-850 border-neutral-200 dark:border-neutral-800 shadow-sm'
            }`}
          >
            {opt.popular && (
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-brand text-white text-[11px] font-semibold flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" />
                Recomendado
              </div>
            )}

            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-neutral-500 dark:text-neutral-400">
                {opt.label}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {opt.range}
              </h3>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {isSelected ? 'Seleccionado' : 'Clic para elegir'}
              </span>
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-brand border-brand text-white'
                    : 'border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
