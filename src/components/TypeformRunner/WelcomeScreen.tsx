import React from 'react';
import { motion } from 'framer-motion';
import { BriefTemplate } from '../../types/brief';
import { Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import isotipoImg from '../../assets/isotipo.webp';

interface WelcomeScreenProps {
  template: BriefTemplate;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ template, onStart }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[62vh] px-4 text-center">
      {/* Brand icon container with defined background for contrast */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-neutral-900 dark:bg-neutral-800 border border-white/10 flex items-center justify-center shadow-xl mb-6 p-3.5"
      >
        <img src={isotipoImg} alt="Miiles" className="w-full h-full object-contain" />
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-brand/20"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {template.badge}
      </motion.div>

      {/* Title with Pacifico keyword */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight max-w-xl overflow-visible"
      >
        {template.title}{' '}
        {template.highlightWord && (
          <span className="font-pacifico text-brand px-1 overflow-visible inline-block">
            {template.highlightWord}
          </span>
        )}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mt-4 max-w-md font-light leading-relaxed"
      >
        {template.welcomeSubtitle}
      </motion.p>

      {/* Meta tags (Time, confidentiality) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-center justify-center gap-6 mt-6 text-xs text-neutral-500 dark:text-neutral-400"
      >
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-brand" />
          <span>Toma ~{template.estimatedTime}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-brand" />
          <span>100% Confidencial</span>
        </div>
      </motion.div>

      {/* Start CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <button
          onClick={onStart}
          className="group flex items-center gap-3 px-8 py-4 rounded-full bg-brand text-white font-semibold text-base shadow-[0_10px_30px_rgba(64,89,241,0.35)] hover:bg-brand-600 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span>Comenzar Brief</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500 font-light">
          Presiona <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono text-[10px]">Enter ↵</kbd> para iniciar
        </p>
      </motion.div>
    </div>
  );
};
