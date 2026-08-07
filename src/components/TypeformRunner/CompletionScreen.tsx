import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CompletionScreenProps {
  submissionId: string;
  briefTitle?: string;
  answers?: Record<string, any>;
  onReset?: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  submissionId,
}) => {
  useEffect(() => {
    // Fire confetti celebration
    const end = Date.now() + 1000;
    const colors = ['#000000', '#666666', '#ffffff', '#22C55E'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    toast.success('Código copiado al portapapeles');
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[62vh] px-4 text-center font-sans">
      {/* Success Icon Image */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200 }}
        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-6"
      >
        <img
          src="/success-check.png"
          alt="Éxito"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl font-normal text-neutral-900 dark:text-white tracking-tight leading-tight"
      >
        ¡Recibido con éxito!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-sm sm:text-base text-neutral-900 dark:text-neutral-100 mt-3 max-w-md font-normal leading-relaxed"
      >
        Nuestro equipo ya está analizando tus respuestas para preparar una propuesta estratégica a tu medida.
      </motion.p>

      {/* Code Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={handleCopyId}
        className="mt-6 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-sans cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group shadow-sm"
      >
        <span className="text-neutral-500 dark:text-neutral-400 font-normal">ID de seguimiento:</span>
        <span className="font-medium text-neutral-900 dark:text-white">{submissionId}</span>
        <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
      </motion.div>
    </div>
  );
};
