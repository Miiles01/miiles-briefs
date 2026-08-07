import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../../types/brief';
import { Search, Hash, ArrowRight, X, Sparkles, CornerDownLeft } from 'lucide-react';

interface AdminJumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentIndex: number;
  onJump: (index: number) => void;
}

export const AdminJumpModal: React.FC<AdminJumpModalProps> = ({
  isOpen,
  onClose,
  questions,
  currentIndex,
  onJump,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(currentIndex);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, currentIndex]);

  // Filter questions based on number or title/section
  const filteredQuestions = questions
    .map((q, idx) => ({ question: q, index: idx, number: idx + 1 }))
    .filter(({ question, number }) => {
      if (!query.trim()) return true;
      const qText = query.trim().toLowerCase();
      // If query is a number
      if (/^\d+$/.test(qText)) {
        return number.toString().startsWith(qText) || number === parseInt(qText, 10);
      }
      return (
        question.title.toLowerCase().includes(qText) ||
        (question.section && question.section.toLowerCase().includes(qText)) ||
        (question.subtitle && question.subtitle.toLowerCase().includes(qText))
      );
    });

  // Keep selected index in bounds of filtered list
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelectAndJump = (targetIdx: number) => {
    onJump(targetIdx);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      // If query is directly a valid question number
      const parsedNum = parseInt(query.trim(), 10);
      if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= questions.length) {
        handleSelectAndJump(parsedNum - 1);
        return;
      }

      if (filteredQuestions.length > 0 && selectedIndex < filteredQuestions.length) {
        handleSelectAndJump(filteredQuestions[selectedIndex].index);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredQuestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-white dark:bg-[#121214] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10"
        >
          {/* Header & Input */}
          <div className="p-4 bg-neutral-50/50 dark:bg-neutral-900/30">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-bold">
                  ⚡
                </span>
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  Navegación rápida admin
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Ctrl + A
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-neutral-400 flex items-center pointer-events-none">
                {/^\d+$/.test(query.trim()) ? (
                  <Hash className="w-4 h-4 text-neutral-900 dark:text-white" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Escribe el número (1-${questions.length}) o busca por título...`}
                className="w-full pl-10 pr-24 py-2.5 bg-white dark:bg-[#1a1a1e] text-neutral-900 dark:text-white text-sm rounded-xl border border-neutral-200 dark:border-neutral-700/80 outline-none focus:border-neutral-900 dark:focus:border-white transition-all shadow-inner placeholder:text-neutral-400 font-normal"
              />
              <div className="absolute right-3 flex items-center gap-1.5 text-[11px] text-neutral-400 pointer-events-none font-mono">
                <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <span>Enter</span>
                  <CornerDownLeft className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Question List */}
          <div
            ref={listRef}
            className="max-h-[380px] overflow-y-auto p-2 divide-y divide-neutral-100/50 dark:divide-neutral-800/40 space-y-1"
          >
            {filteredQuestions.length === 0 ? (
              <div className="py-8 text-center text-neutral-400 text-sm">
                No se encontró ninguna pregunta para "{query}"
              </div>
            ) : (
              filteredQuestions.map(({ question, index, number }, itemIdx) => {
                const isSelected = itemIdx === selectedIndex;
                const isCurrent = index === currentIndex;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => handleSelectAndJump(index)}
                    onMouseEnter={() => setSelectedIndex(itemIdx)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 shrink-0 rounded-lg text-xs font-mono font-medium flex items-center justify-center ${
                          isSelected
                            ? 'bg-white/20 dark:bg-black/10 text-white dark:text-black font-bold'
                            : isCurrent
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {number}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium truncate ${
                              isSelected ? 'text-white dark:text-neutral-950' : 'text-neutral-900 dark:text-white'
                            }`}
                          >
                            {question.title}
                          </p>
                          {isCurrent && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                isSelected
                                  ? 'bg-white/20 text-white dark:bg-black/10 dark:text-black'
                                  : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                              }`}
                            >
                              Actual
                            </span>
                          )}
                        </div>
                        {question.section && (
                          <p
                            className={`text-xs truncate ${
                              isSelected
                                ? 'text-white/70 dark:text-black/60'
                                : 'text-neutral-400 dark:text-neutral-500'
                            }`}
                          >
                            {question.section}
                          </p>
                        )}
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected
                          ? 'opacity-100 translate-x-0.5'
                          : 'opacity-0 -translate-x-1 group-hover:opacity-100'
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between text-[11px] text-neutral-400">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono">
                  ↑
                </kbd>{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono">
                  ↓
                </kbd>{' '}
                Navegar
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono">
                  Enter
                </kbd>{' '}
                Saltar
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono">
                  Esc
                </kbd>{' '}
                Cerrar
              </span>
            </div>
            <span className="font-mono">{questions.length} preguntas en total</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
