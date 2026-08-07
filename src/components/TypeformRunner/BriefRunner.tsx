import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BRIEF_TEMPLATES } from '../../data/briefTemplates';
import { useBriefs } from '../../context/BriefContext';
import { WelcomeScreen } from './WelcomeScreen';
import { QuestionCard } from './QuestionCard';
import { CompletionScreen } from './CompletionScreen';
import { ChevronUp, ChevronDown, ArrowLeft, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import logotipoSvg from '../../../public/logotipo.svg';

export const BriefRunner: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
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
          // If valid
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
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  };

  const handleNext = () => {
    if (!isCurrentValid()) return;

    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Final submission
      const clientName = answers['brand-name'] || answers['web-project-name'] || answers['growth-brand'] || 'Cliente Miiles';
      const clientContact = answers['contact-info'] || answers['web-contact'] || answers['growth-contact'] || '';
      
      const newId = addSubmission({
        briefId: template.id,
        briefTitle: template.title,
        clientName: clientName,
        clientEmail: clientContact.includes('@') ? clientContact.split('|')[0].trim() : 'contacto@cliente.com',
        clientCompany: clientName,
        answers: answers,
        estimatedBudget: answers['budget-investment'] || answers['web-budget'] || answers['growth-budget'] || '',
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
      y: direction > 0 ? 50 : -50,
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
      y: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: {
        y: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      {/* Top Header & Progress */}
      <header className="w-full pt-6 pb-4 px-6 sm:px-12 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Todos los briefs</span>
          </Link>
          <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-800" />
          <Link to="/" className="flex items-center gap-2">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-neutral-900 dark:text-white font-sans">
              MIILES<span className="text-brand">.</span>
            </span>
          </Link>
        </div>

        {/* Theme and Admin Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="text-xs px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-medium transition-colors"
          >
            Admin Panel
          </Link>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-900 fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="h-full bg-brand"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex items-center justify-center relative z-10 py-6">
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
                isLast={currentQuestionIndex === questions.length - 1}
                isValid={isCurrentValid()}
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

      {/* Navigation Controls (Bottom Right Floating Pill) */}
      {step === 'questions' && (
        <div className="fixed bottom-6 right-6 z-30 flex items-center gap-1.5 bg-white dark:bg-neutral-900 rounded-full p-1.5 border border-neutral-200 dark:border-neutral-800 shadow-lg">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title="Pregunta anterior (Flecha Arriba)"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={!isCurrentValid()}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isCurrentValid()
                ? 'text-brand hover:bg-brand/10'
                : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
            }`}
            title="Siguiente pregunta (Flecha Abajo)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer info */}
      <footer className="w-full py-4 px-6 text-center text-xs text-neutral-400 dark:text-neutral-600 z-10">
        <span>Diseñado por </span>
        <span className="font-semibold text-neutral-600 dark:text-neutral-400">Miiles Studio</span>
        <span> — wearemiiles.com</span>
      </footer>
    </div>
  );
};
