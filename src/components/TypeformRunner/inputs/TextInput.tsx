import React, { useEffect, useRef } from 'react';

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isTextarea?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Escribe tu respuesta aquí...',
  isTextarea = false,
}) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus with slight delay for smooth page transition
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isTextarea) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && isTextarea) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    }
  };

  if (isTextarea) {
    return (
      <div className="w-full">
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-transparent text-xl sm:text-2xl md:text-3xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 border-b-2 border-neutral-300 dark:border-neutral-800 focus:border-brand dark:focus:border-brand outline-none transition-all duration-300 py-3 resize-none font-light leading-relaxed"
        />
        <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500 font-normal">
          Presiona <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono text-[10px]">Cmd + Enter</kbd> para continuar
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-xl sm:text-2xl md:text-3xl lg:text-4xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 border-b-2 border-neutral-300 dark:border-neutral-800 focus:border-brand dark:focus:border-brand outline-none transition-all duration-300 py-3 font-light"
      />
      <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500 font-normal">
        Presiona <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono text-[10px]">Enter ↵</kbd> para continuar
      </p>
    </div>
  );
};
