import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Copy, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface CompletionScreenProps {
  submissionId: string;
  briefTitle: string;
  answers: Record<string, any>;
  onReset: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  submissionId,
  briefTitle,
  answers,
}) => {
  useEffect(() => {
    // Fire confetti celebration
    const end = Date.now() + 1000;
    const colors = ['#4059F1', '#8FA4FF', '#ffffff', '#FFD700'];

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

  const whatsappMessage = encodeURIComponent(
    `¡Hola Miiles Studio! Acabo de completar el brief de ${briefTitle} con código de seguimiento *${submissionId}*. Me gustaría conversar sobre mi proyecto.`
  );

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[62vh] px-4 text-center">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200 }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/10"
      >
        <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight overflow-visible"
      >
        ¡Brief Recibido con{' '}
        <span className="font-pacifico text-brand px-1 overflow-visible inline-block">
          Éxito!
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-3 max-w-md font-light leading-relaxed"
      >
        Nuestro equipo creativo ya está revisando tus respuestas para preparar una propuesta visual y estratégica a tu medida.
      </motion.p>

      {/* Code Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={handleCopyId}
        className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-mono cursor-pointer hover:border-brand transition-colors group shadow-sm"
      >
        <span className="text-neutral-500 dark:text-neutral-400">ID de Seguimiento:</span>
        <span className="font-bold text-brand">{submissionId}</span>
        <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand transition-colors" />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto"
      >
        <a
          href={`https://wa.me/525549201823?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Avisar por WhatsApp</span>
        </a>

        <Link
          to="/"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ver Más Briefs</span>
        </Link>
      </motion.div>
    </div>
  );
};
