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
  Rocket: <Rocket className="w-5 h-5 text-brand" />,
  RefreshCw: <RefreshCw className="w-5 h-5 text-brand" />,
  Layers: <Layers className="w-5 h-5 text-brand" />,
  Target: <Target className="w-5 h-5 text-brand" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-brand" />,
  Award: <Award className="w-5 h-5 text-brand" />,
  Cpu: <Cpu className="w-5 h-5 text-brand" />,
  Zap: <Zap className="w-5 h-5 text-brand" />,
  Clock: <Clock className="w-5 h-5 text-brand" />,
  Calendar: <Calendar className="w-5 h-5 text-brand" />,
  DollarSign: <DollarSign className="w-5 h-5 text-brand" />,
  Eye: <Eye className="w-5 h-5 text-brand" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-brand" />,
  Flame: <Flame className="w-5 h-5 text-brand" />,
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
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-2">
      {options.map((opt, idx) => {
        const isSelected = selectedList.includes(opt.id);
        const keyChar = KEY_LABELS[idx] || `${idx + 1}`;

        return (
          <motion.div
            key={opt.id}
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => handleSelect(opt.id)}
            className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-200 flex items-start justify-between border ${
              isSelected
                ? 'bg-brand/10 dark:bg-brand/15 border-brand dark:border-brand shadow-[0_0_20px_rgba(64,89,241,0.2)]'
                : 'bg-white dark:bg-neutral-900/90 hover:bg-neutral-50 dark:hover:bg-neutral-850 border-neutral-200 dark:border-neutral-800 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3.5 flex-1 pr-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-brand text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {keyChar}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {opt.icon && ICONS_MAP[opt.icon] && (
                    <div className="p-1 rounded bg-brand/10 dark:bg-brand/20">
                      {ICONS_MAP[opt.icon]}
                    </div>
                  )}
                  <h4 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-white leading-snug">
                    {opt.label}
                  </h4>
                  {opt.badge && (
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand/15 text-brand dark:text-brand-300">
                      {opt.badge}
                    </span>
                  )}
                </div>
                {opt.description && (
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-light leading-relaxed">
                    {opt.description}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all ${
                isSelected
                  ? 'bg-brand border-brand text-white scale-110'
                  : 'border-neutral-300 dark:border-neutral-700'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
