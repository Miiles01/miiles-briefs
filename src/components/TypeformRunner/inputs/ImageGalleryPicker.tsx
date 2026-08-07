import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { ImageOption } from '../../../types/brief';

interface ImageGalleryPickerProps {
  options: ImageOption[];
  value: string[] | string;
  onChange: (val: string[]) => void;
}

export const ImageGalleryPicker: React.FC<ImageGalleryPickerProps> = ({
  options,
  value,
  onChange,
}) => {
  const selectedIds: string[] = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim() && value !== 'Sin definir'
    ? [value]
    : [];

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  // Dynamic responsive columns so images flow naturally left-to-right, row-by-row downwards
  const [colCount, setColCount] = useState(4);

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth < 640) {
        setColCount(2);
      } else if (window.innerWidth < 1024) {
        setColCount(3);
      } else {
        setColCount(4);
      }
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const columns = useMemo(() => {
    const cols: ImageOption[][] = Array.from({ length: colCount }, () => []);
    options.forEach((opt, idx) => {
      cols[idx % colCount].push(opt);
    });
    return cols;
  }, [options, colCount]);

  return (
    <div className="w-full font-sans">
      {/* Header Info & Counter */}
      <div className="flex items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
          <span>
            {selectedIds.length === 0
              ? 'Haz clic en las tipografías que más resuenen con tu visión estética'
              : `${selectedIds.length} ${
                  selectedIds.length === 1
                    ? 'referencia seleccionada'
                    : 'referencias seleccionadas'
                }`}
          </span>
        </div>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors underline cursor-pointer"
          >
            Limpiar selección
          </button>
        )}
      </div>

      {/* Full Collage Flowing Downwards (Natural uncropped aspect ratios, complete gallery) */}
      <div className="w-full flex gap-3.5 sm:gap-4 items-start pb-8">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-3.5 sm:gap-4">
            {col.map((opt, itemIdx) => {
              const isSelected = selectedIds.includes(opt.id);

              return (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min((colIdx + itemIdx * colCount) * 0.02, 0.3),
                  }}
                  onClick={() => handleToggle(opt.id)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-900 transition-all duration-200 select-none block w-full ${
                    isSelected
                      ? 'ring-2 ring-black dark:ring-white border-2 border-black dark:border-white shadow-xl scale-[0.98]'
                      : 'border border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-md'
                  }`}
                >
                  {/* Checkbox Icon Badge */}
                  <div
                    className={`absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-md scale-100'
                        : 'bg-black/30 dark:bg-black/50 backdrop-blur-md border border-white/50 text-transparent opacity-0 group-hover:opacity-100 scale-90'
                    }`}
                  >
                    <Check
                      className={`w-3.5 h-3.5 stroke-[2.5] ${
                        isSelected ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>

                  {/* Image with natural uncropped aspect ratio */}
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <img
                      src={opt.url}
                      alt={opt.label || `Tipografía ${opt.id}`}
                      loading="lazy"
                      className={`w-full h-auto block transition-transform duration-300 ease-out ${
                        isSelected ? 'scale-100' : 'group-hover:scale-103'
                      }`}
                    />
                  </div>

                  {/* Subtle overlay on selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/10 dark:bg-white/5 pointer-events-none" />
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
