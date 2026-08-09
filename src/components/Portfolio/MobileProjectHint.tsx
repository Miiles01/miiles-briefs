import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";

export const MobileProjectHint = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-[320px]"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-neutral-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-miiles-blue/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 text-miiles-blue" />
            </div>
            <div className="flex-1 pr-2">
              <p className="text-[13px] text-neutral-800 leading-snug font-medium">
                Toca cualquier proyecto
              </p>
              <p className="text-[12px] text-neutral-500 mt-0.5 leading-snug">
                Descubre cómo ayudamos a las marcas a escalar.
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors shrink-0 -mt-1 -mr-1"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileProjectHint;
