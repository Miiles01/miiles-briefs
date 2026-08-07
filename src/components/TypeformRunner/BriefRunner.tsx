import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BRIEF_TEMPLATES } from '../../data/briefTemplates';
import { useBriefs } from '../../context/BriefContext';
import { WelcomeScreen } from './WelcomeScreen';
import { QuestionCard } from './QuestionCard';
import { CompletionScreen } from './CompletionScreen';
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const BriefRunner: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addSubmission } = useBriefs();
  const { isDark, toggleTheme } = useTheme();

  // Find template by slug or default to first
  const template = BRIEF_TEMPLATES.find((t) => t.slug === slug || t.id === slug) || BRIEF_TEMPLATES[0];

  const [step, setStep] = useState<'welcome' | 'questions' | 'completed'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [direction, setDirection] = useState<number>(1);
  const [submissionId, setSubmissionId] = useState<string>('');

  const questions = template.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent =
    step === 'welcome'
      ? 0
      : step === 'completed'
      ? 100
      : Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step === 'welcome' && e.key === 'Enter') {
        setStep('questions');
      } else if (step === 'questions') {
        if (e.key === 'ArrowDown' && currentQuestionIndex < questions.length - 1) {
          if (isCurrentValid()) {
            handleNext();
          }
        } else if (e.key === 'ArrowUp' && currentQuestionIndex > 0) {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, currentQuestionIndex, answers]);

  const handleAnswerChange = (val: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const isCurrentValid = () => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    const val = answers[currentQuestion.id];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val)) return val.length > 0;
    if (currentQuestion.hasConditionalInput && typeof val === 'object') {
      if (!val.choice) return false;
      if (val.choice === (currentQuestion.conditionalTriggerId || 'si')) {
        return Boolean(val.detail && val.detail.trim().length > 0);
      }
      return true;
    }
    if (typeof val === 'string') return val.trim().length > 0;
    return true;
  };

  const handleAnswerAndNext = (val: any) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: val,
    };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Final submission
      const clientName =
        updatedAnswers['b-name'] ||
        updatedAnswers['brand-name'] ||
        updatedAnswers['web-project-name'] ||
        updatedAnswers['growth-brand'] ||
        'Cliente Miiles';
      const clientContact =
        updatedAnswers['contact-info'] ||
        updatedAnswers['web-contact'] ||
        updatedAnswers['growth-contact'] ||
        '';

      const newId = addSubmission({
        briefId: template.id,
        briefTitle: template.title,
        clientName: clientName,
        clientEmail: clientContact.includes('@')
          ? clientContact.split('|')[0].trim()
          : 'contacto@cliente.com',
        clientCompany: clientName,
        answers: updatedAnswers,
        estimatedBudget:
          updatedAnswers['budget-investment'] ||
          updatedAnswers['web-budget'] ||
          updatedAnswers['growth-budget'] ||
          'A definir',
      });

      setSubmissionId(newId);
      setStep('completed');
    }
  };

  const handleUndefined = () => {
    handleAnswerAndNext('Sin definir');
  };

  const handleNext = () => {
    if (!isCurrentValid()) return;

    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Final submission
      const clientName =
        answers['b-name'] ||
        answers['brand-name'] ||
        answers['web-project-name'] ||
        answers['growth-brand'] ||
        'Cliente Miiles';
      const clientContact =
        answers['contact-info'] ||
        answers['web-contact'] ||
        answers['growth-contact'] ||
        '';

      const newId = addSubmission({
        briefId: template.id,
        briefTitle: template.title,
        clientName: clientName,
        clientEmail: clientContact.includes('@')
          ? clientContact.split('|')[0].trim()
          : 'contacto@cliente.com',
        clientCompany: clientName,
        answers: answers,
        estimatedBudget:
          answers['budget-investment'] ||
          answers['web-budget'] ||
          answers['growth-budget'] ||
          'A definir',
      });

      setSubmissionId(newId);
      setStep('completed');
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setStep('welcome');
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        y: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? -40 : 40,
      opacity: 0,
      transition: {
        y: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080a] text-neutral-900 dark:text-neutral-100 flex flex-col justify-between relative overflow-hidden transition-colors duration-300 font-sans">
      {/* Fixed Top Header & Progress */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#08080a]/80 backdrop-blur-md pt-5 pb-3.5 px-6 sm:px-12 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-3.5">
          {/* Navigation Arrows in circular buttons with shadow */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] flex items-center justify-center text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Pregunta anterior"
              aria-label="Pregunta anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={!isCurrentValid() || step !== 'questions'}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all ${
                isCurrentValid() && step === 'questions'
                  ? 'text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white hover:scale-105 active:scale-95 cursor-pointer'
                  : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed opacity-40'
              }`}
              title="Siguiente pregunta"
              aria-label="Siguiente pregunta"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mini vertical divider */}
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

          {/* Logo Miiles */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logotipo.svg"
              alt="Miiles"
              className="h-4 sm:h-4.5 w-auto dark:brightness-0 dark:invert transition-all duration-300"
            />
          </Link>
        </div>

        {/* Theme Toggle (Admin button removed) */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] flex items-center justify-center text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-900 fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="h-full bg-neutral-900 dark:bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex items-center justify-center relative z-10 pt-24 sm:pt-28 pb-10 px-4">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <WelcomeScreen template={template} onStart={() => setStep('questions')} />
            </motion.div>
          )}

          {step === 'questions' && (
            <motion.div
              key={`q-${currentQuestionIndex}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <QuestionCard
                question={currentQuestion}
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                value={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
                onNext={handleNext}
                onPrev={handlePrev}
                onUndefined={handleUndefined}
                isLast={currentQuestionIndex === questions.length - 1}
                isValid={isCurrentValid()}
                submitButtonText={template.submitText || 'Finalizar'}
              />
            </motion.div>
          )}

          {step === 'completed' && (
            <motion.div
              key="completed"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <CompletionScreen
                submissionId={submissionId}
                briefTitle={template.title}
                answers={answers}
                onReset={() => {
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                  setStep('welcome');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer info */}
      <footer className="w-full py-4 px-6 text-center text-xs text-neutral-400 font-light z-10">
        <span>Diseñado por </span>
        <span className="font-normal text-neutral-700 dark:text-neutral-300">Miiles Studio</span>
      </footer>
    </div>
  );
};
