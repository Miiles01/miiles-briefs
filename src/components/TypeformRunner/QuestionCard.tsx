import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../../types/brief';
import { TextInput } from './inputs/TextInput';
import { ChoiceCards } from './inputs/ChoiceCards';
import { BudgetSlider } from './inputs/BudgetSlider';
import { ColorPalettePicker } from './inputs/ColorPalettePicker';
import { ArrowRight, Check } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  value: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLast: boolean;
  isValid: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  value,
  onChange,
  onNext,
  isLast,
  isValid,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-center min-h-[58vh] px-4">
      {/* Question Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-300">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
          </span>
          {question.required && (
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-light">
              Obligatorio *
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight overflow-visible">
          {question.title}{' '}
          {question.highlightWord && (
            <span className="font-pacifico text-brand px-1 overflow-visible inline-block">
              {question.highlightWord}
            </span>
          )}
        </h2>

        {question.subtitle && (
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-2.5 font-light leading-relaxed">
            {question.subtitle}
          </p>
        )}
      </motion.div>

      {/* Input component based on type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="my-2"
      >
        {question.type === 'text' && (
          <TextInput
            value={value || ''}
            onChange={onChange}
            onSubmit={onNext}
            placeholder={question.placeholder}
          />
        )}

        {question.type === 'textarea' && (
          <TextInput
            value={value || ''}
            onChange={onChange}
            onSubmit={onNext}
            placeholder={question.placeholder}
            isTextarea
          />
        )}

        {question.type === 'single-choice' && question.options && (
          <ChoiceCards
            options={question.options}
            value={value || ''}
            onChange={onChange}
            onAutoSubmit={onNext}
          />
        )}

        {question.type === 'multiple-choice' && question.options && (
          <ChoiceCards
            options={question.options}
            value={value || []}
            onChange={onChange}
            isMultiple
          />
        )}

        {question.type === 'budget-slider' && question.budgetOptions && (
          <BudgetSlider
            options={question.budgetOptions}
            value={value || ''}
            onChange={onChange}
            onAutoSubmit={onNext}
          />
        )}

        {question.type === 'color-palette' && question.colorPalettes && (
          <ColorPalettePicker
            palettes={question.colorPalettes}
            value={value || ''}
            onChange={onChange}
            onAutoSubmit={onNext}
          />
        )}
      </motion.div>

      {/* Action / Next Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-8 flex items-center justify-between pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50"
      >
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 font-light">
          <span>Usa</span>
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono text-[10px]">Tab</kbd>
          <span>y</span>
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono text-[10px]">Enter ↵</kbd>
        </div>

        <button
          onClick={onNext}
          disabled={!isValid}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 shadow-md ${
            isValid
              ? 'bg-brand text-white hover:bg-brand-600 hover:scale-105 active:scale-95 cursor-pointer shadow-brand/20'
              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{isLast ? 'Enviar Brief Completo' : 'Siguiente'}</span>
          {isLast ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </motion.div>
    </div>
  );
};
