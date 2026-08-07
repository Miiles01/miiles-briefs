import React from 'react';
import { motion } from 'framer-motion';
import { ChoiceOption } from '../../../types/brief';
import { Check, Rocket, RefreshCw, Layers, Target, ShoppingBag, Award, Cpu, Zap, Clock, Calendar, DollarSign, Eye, ShieldCheck, Flame } from 'lucide-react';

interface ChoiceCardsProps {
  options: ChoiceOption[];
  value: string | string[];
  onChange: (val: string | string[]) => void;
  isMultiple?: boolean;
  onAutoSubmit?: () => void;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  RefreshCw: <RefreshCw className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  Layers: <Layers className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  Target: <Target className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  Award: <Award className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  Cpu: <Cpu className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  Zap: <Zap className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  Clock: <Clock className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  Calendar: <Calendar className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  DollarSign: <DollarSign className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  Eye: <Eye className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
  Flame: <Flame className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
};

const KEY_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const ChoiceCards: React.FC<ChoiceCardsProps> = ({
  options,
  value,
  onChange,
  isMultiple = false,
  onAutoSubmit,
}) => {
  const selectedList = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (optionId: string) => {
    if (isMultiple) {
      if (selectedList.includes(optionId)) {
        onChange(selectedList.filter((id) => id !== optionId));
      } else {
        onChange([...selectedList, optionId]);
      }
    } else {
      onChange(optionId);
      if (onAutoSubmit) {
        setTimeout(() => {
          onAutoSubmit();
        }, 280);
      }
    }
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 my-2 font-sans">
      {options.map((opt, idx) => {
        const isSelected = selectedList.includes(opt.id);
        const keyChar = KEY_LABELS[idx] || `${idx + 1}`;

        return (
          <motion.div
            key={opt.id}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelect(opt.id)}
            className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-200 flex items-start justify-between border ${
              isSelected
                ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-900 dark:border-white shadow-sm ring-1 ring-neutral-900 dark:ring-white'
                : 'bg-white dark:bg-neutral-900/80 hover:bg-neutral-50 dark:hover:bg-neutral-850 border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
            }`}
          >
            <div className="flex items-start gap-3 flex-1 pr-2">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-normal shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700'
                }`}
              >
                {keyChar}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {opt.icon && ICONS_MAP[opt.icon] && (
                    <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-800">
                      {ICONS_MAP[opt.icon]}
                    </div>
                  )}
                  <h4 className="text-sm sm:text-base font-normal text-neutral-900 dark:text-white leading-snug">
                    {opt.label}
                  </h4>
                  {opt.badge && (
                    <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {opt.badge}
                    </span>
                  )}
                </div>
                {opt.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-light leading-relaxed">
                    {opt.description}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all ${
                isSelected
                  ? 'bg-black border-black dark:bg-white dark:border-white text-white dark:text-black scale-110'
                  : 'border-neutral-300 dark:border-neutral-700'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
