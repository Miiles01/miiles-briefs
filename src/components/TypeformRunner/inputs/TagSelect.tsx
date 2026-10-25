import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { ChoiceOption } from '../../../types/brief';

interface TagSelectProps {
  options: ChoiceOption[];
  value: string[];
  onChange: (val: string[]) => void;
  allowCustom?: boolean;
  customPlaceholder?: string;
}

// Etiquetas que se prenden y apagan; se guarda el texto de cada etiqueta (también las personalizadas)
export const TagSelect: React.FC<TagSelectProps> = ({
  options,
  value,
  onChange,
  allowCustom = true,
  customPlaceholder = 'Agregar otra',
}) => {
  const selected = Array.isArray(value) ? value : [];
  const [draft, setDraft] = useState('');
  const optionLabels = options.map((o) => o.label);
  const customTags = selected.filter((t) => !optionLabels.includes(t));
  const allTags = [...optionLabels, ...customTags];

  const toggle = (label: string) => {
    onChange(selected.includes(label) ? selected.filter((t) => t !== label) : [...selected, label]);
  };

  const addDraft = () => {
    const tag = draft.trim().replace(/\s+/g, ' ');
    if (!tag) return;
    const existing = allTags.find((t) => t.toLowerCase() === tag.toLowerCase());
    if (existing) {
      if (!selected.includes(existing)) onChange([...selected, existing]);
    } else {
      onChange([...selected, tag]);
    }
    setDraft('');
  };

  return (
    <div className="w-full font-sans space-y-4">
      <div className="flex flex-wrap gap-2">
        {allTags.map((label) => {
          const isOn = selected.includes(label);
          return (
            <motion.button
              key={label}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(label)}
              aria-pressed={isOn}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-normal border transition-colors ${
                isOn
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'bg-white dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              {isOn && <Check className="w-3.5 h-3.5" />}
              {label}
            </motion.button>
          );
        })}
      </div>

      {allowCustom && (
        <div className="flex items-center gap-2 max-w-sm">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                addDraft();
              }
            }}
            placeholder={customPlaceholder}
            aria-label={customPlaceholder}
            className="flex-1 min-w-0 bg-transparent text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 border-b border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white outline-none py-2 font-light"
          />
          <button
            type="button"
            onClick={addDraft}
            disabled={!draft.trim()}
            aria-label="Agregar etiqueta"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
