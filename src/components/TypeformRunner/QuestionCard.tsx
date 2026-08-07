import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../../types/brief';
import { TextInput } from './inputs/TextInput';
import { ChoiceCards } from './inputs/ChoiceCards';
import { BudgetSlider } from './inputs/BudgetSlider';
import { ColorPalettePicker } from './inputs/ColorPalettePicker';
import { ColorPickerInput } from './inputs/ColorPickerInput';
import { ArrowRight, Check } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  value: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onUndefined?: () => void;
  isLast: boolean;
  isValid: boolean;
  submitButtonText?: string;
}

export const canQuestionBeUndefined = (question: Question): boolean => {
  if (question.allowUndefined === false) return false;
  if (question.allowUndefined === true) return true;

  // Don't show on contact info questions
  if (
    question.id.includes('contact') ||
    question.type === 'email' ||
    question.type === 'phone'
  ) {
    return false;
  }

  // If question has conditional input (e.g. differentiator which already offers "No, aún no lo tengo")
  if (question.hasConditionalInput) {
    return false;
  }

  // If choices already contain an option like "No", "Aún no", "Sin definir", "En planificación"
  if (question.options && question.options.length > 0) {
    const hasNegativeOrUndefinedOption = question.options.some((opt) => {
      const text = `${opt.label} ${opt.description || ''}`.toLowerCase();
      return (
        text.includes('aún no') ||
        text.includes('aun no') ||
        text.includes('sin definir') ||
        text.includes('no lo tengo') ||
        text.includes('no estoy seguro') ||
        text.includes('en planificación') ||
        text.includes('en planificacion') ||
        opt.id === 'no' ||
        opt.id === 'none'
      );
    });
    if (hasNegativeOrUndefinedOption) {
      return false;
    }
  }

  return true;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  value,
  onChange,
  onNext,
  onUndefined,
  isLast,
  isValid,
  submitButtonText = 'Finalizar',
}) => {
  const fullTitle = question.highlightWord
    ? `${question.title} ${question.highlightWord}`
    : question.title;

  // Extract selected choice id when value is an object or string
  const selectedChoiceId =
    typeof value === 'object' && value !== null && 'choice' in value
      ? value.choice
      : typeof value === 'string'
      ? value
      : '';

  const isConditionalTriggered =
    question.hasConditionalInput &&
    selectedChoiceId === (question.conditionalTriggerId || 'si');

  const handleChoiceSelect = (selectedId: string | string[]) => {
    if (question.hasConditionalInput) {
      if (typeof selectedId === 'string') {
        if (selectedId === (question.conditionalTriggerId || 'si')) {
          const currentDetail =
            typeof value === 'object' && value !== null ? value.detail || '' : '';
          onChange({ choice: selectedId, detail: currentDetail });
        } else {
          onChange({ choice: selectedId, detail: '' });
        }
      }
    } else {
      onChange(selectedId);
    }
  };

  const handleConditionalDetailChange = (detailText: string) => {
    onChange({
      choice: question.conditionalTriggerId || 'si',
      detail: detailText,
    });
  };

  const showUndefinedButton = canQuestionBeUndefined(question) && Boolean(onUndefined);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-center min-h-[58vh] px-4 font-sans">
      {/* Question Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 sm:mb-8"
      >
        {/* Section Tag & Question Number */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-neutral-400 dark:text-neutral-500 font-sans">
              {currentIndex + 1}
            </span>
            {question.required && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-light">
                · Obligatorio
              </span>
            )}
          </div>

          {question.section && (
            <span className="text-xs font-normal text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1 rounded-full">
              {question.section}
            </span>
          )}
        </div>

        {/* Section Contextual Header (if any) */}
        {question.sectionHeader && (
          <p className="text-xs sm:text-sm font-sans font-light text-neutral-500 dark:text-neutral-400 mb-2 leading-relaxed">
            {question.sectionHeader}
          </p>
        )}

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-neutral-900 dark:text-white leading-tight">
          {fullTitle}
        </h2>

        {/* Subtitle / Examples */}
        {question.subtitle && (
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-2 font-light leading-relaxed">
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
          <div className="space-y-4">
            <ChoiceCards
              options={question.options}
              value={selectedChoiceId}
              onChange={handleChoiceSelect}
              onAutoSubmit={
                // Never auto-advance when question has a conditional input —
                // the user must fill the detail textarea first, then press "Siguiente".
                !question.hasConditionalInput ? onNext : undefined
              }
            />

            {/* Conditional Input Drawer */}
            <AnimatePresence>
              {isConditionalTriggered && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -5 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden pt-2"
                >
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                    <label className="text-xs font-normal text-neutral-700 dark:text-neutral-300 block">
                      {question.conditionalInputLabel || 'Describe tu diferenciador:'}
                    </label>
                    <textarea
                      value={typeof value === 'object' && value !== null ? value.detail || '' : ''}
                      onChange={(e) => handleConditionalDetailChange(e.target.value)}
                      placeholder={
                        question.conditionalInputPlaceholder ||
                        'Escribe aquí tu respuesta detallada...'
                      }
                      rows={3}
                      autoFocus
                      className="w-full bg-transparent text-base sm:text-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 border-b border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none py-2 resize-none font-light leading-relaxed"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

        {question.type === 'color-picker' && (
          <ColorPickerInput
            value={value || []}
            onChange={onChange}
          />
        )}
      </motion.div>

      {/* Action / Next Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-8 flex items-center justify-end gap-3"
      >
        {showUndefinedButton && (
          <button
            type="button"
            onClick={onUndefined}
            className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-normal text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 cursor-pointer"
            title="Aún no tengo definida esta respuesta"
          >
            Sin definir
          </button>
        )}

        <button
          onClick={onNext}
          disabled={!isValid}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-normal text-sm transition-all duration-300 shadow-sm ${
            isValid
              ? 'bg-black text-white dark:bg-white dark:text-black hover:opacity-85 hover:scale-105 active:scale-95 cursor-pointer'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{isLast ? submitButtonText : 'Siguiente'}</span>
          {isLast ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </motion.div>
    </div>
  );
};
