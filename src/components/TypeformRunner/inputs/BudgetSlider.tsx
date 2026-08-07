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
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 my-2 font-sans">
      {options.map((opt) => {
        const isSelected = value === opt.id;

        return (
          <motion.div
            key={opt.id}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelect(opt.id)}
            className={`relative cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-200 border flex flex-col justify-between ${
              isSelected
                ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-900 dark:border-white shadow-sm ring-1 ring-neutral-900 dark:ring-white'
                : 'bg-white dark:bg-neutral-900/80 hover:bg-neutral-50 dark:hover:bg-neutral-850 border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
            }`}
          >
            {opt.popular && (
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[11px] font-normal flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-neutral-300 dark:text-neutral-700" />
                Recomendado
              </div>
            )}

            <div>
              <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                {opt.label}
              </span>
              <h3 className="text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
                {opt.range}
              </h3>
            </div>

            <div className="flex items-center justify-between mt-4 pt-1">
              <span className="text-xs text-neutral-400 font-light">
                {isSelected ? 'Seleccionado' : 'Clic para elegir'}
              </span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-black border-black dark:bg-white dark:border-white text-white dark:text-black'
                    : 'border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
