import React from 'react';
import { motion } from 'framer-motion';
import { BriefTemplate } from '../../types/brief';
import { Clock, ArrowRight } from 'lucide-react';
import isotipoImg from '../../assets/isotipo.webp';

interface WelcomeScreenProps {
  template: BriefTemplate;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ template, onStart }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[62vh] px-4 text-center font-sans">
      {/* Brand icon container with defined background for contrast */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6 p-4"
      >
        <img src={isotipoImg} alt="Miiles" className="w-full h-full object-contain" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-normal text-neutral-900 dark:text-white tracking-tight leading-tight max-w-xl"
      >
        {template.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-4 max-w-lg font-light leading-relaxed"
      >
        {template.welcomeSubtitle}
      </motion.p>

      {/* Meta tags (Estimated time) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-6 mt-6 text-xs text-neutral-800 dark:text-neutral-200 font-medium"
      >
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-neutral-900 dark:text-white stroke-[2]" />
          <span>Toma ~{template.estimatedTime}</span>
        </div>
      </motion.div>

      {/* Start CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8"
      >
        <button
          onClick={onStart}
          className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-normal text-sm shadow-sm hover:opacity-85 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span>{template.ctaText || 'Empezar'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};
