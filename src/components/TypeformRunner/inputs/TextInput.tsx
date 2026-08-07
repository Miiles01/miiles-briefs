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
      <div className="w-full font-sans">
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-transparent text-xl sm:text-2xl text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 border-b border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white outline-none transition-all duration-300 py-3 resize-none font-light leading-relaxed"
        />
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-xl sm:text-2xl lg:text-3xl text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 border-b border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white outline-none transition-all duration-300 py-3 font-light"
      />
    </div>
  );
};
