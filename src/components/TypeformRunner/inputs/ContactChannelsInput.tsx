import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Youtube, Facebook, Linkedin, Mail, MessageCircle, Link2, Plus, X, Star } from 'lucide-react';

// Un medio de contacto: red social, WhatsApp, correo o uno personalizado
export interface ContactChannel {
  id: string;
  kind: string; // instagram | tiktok | whatsapp | email | youtube | facebook | linkedin | custom
  label: string;
  value: string;
  primary: boolean;
}

const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 5 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z" />
  </svg>
);

const BASE_CHANNELS: Array<Omit<ContactChannel, 'value' | 'primary'> & { placeholder: string; inputType: string }> = [
  { id: 'instagram', kind: 'instagram', label: 'Instagram', placeholder: '@tuusuario', inputType: 'text' },
  { id: 'tiktok', kind: 'tiktok', label: 'TikTok', placeholder: '@tuusuario', inputType: 'text' },
  { id: 'whatsapp', kind: 'whatsapp', label: 'WhatsApp', placeholder: '+52 55 1234 5678', inputType: 'tel' },
  { id: 'email', kind: 'email', label: 'Correo', placeholder: 'nombre@correo.com', inputType: 'email' },
  { id: 'youtube', kind: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@tucanal', inputType: 'text' },
  { id: 'facebook', kind: 'facebook', label: 'Facebook', placeholder: 'facebook.com/tupagina', inputType: 'text' },
  { id: 'linkedin', kind: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/tunombre', inputType: 'text' },
];

const ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  tiktok: <TikTokIcon className="w-4 h-4" />,
  whatsapp: <MessageCircle className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  custom: <Link2 className="w-4 h-4" />,
};

export const channelIcon = (kind: string) => ICONS[kind] || ICONS.custom;

export const emptyContactChannels = (): ContactChannel[] =>
  BASE_CHANNELS.map(({ id, kind, label }) => ({ id, kind, label, value: '', primary: false }));

// Reglas compartidas con el runner: al menos un medio con datos y correo/WhatsApp bien escritos
export const channelError = (c: ContactChannel): string | null => {
  const v = c.value.trim();
  if (!v) return null;
  if (c.kind === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Revisa el correo';
  if (c.kind === 'whatsapp' && v.replace(/\D/g, '').length < 8) return 'Incluye la clave de tu país y tu número';
  if (c.kind === 'custom' && !c.label.trim()) return 'Ponle nombre a este medio';
  return null;
};

export const isContactChannelsValid = (val: unknown): boolean => {
  if (!Array.isArray(val)) return false;
  const filled = (val as ContactChannel[]).filter((c) => c.value.trim());
  return filled.length > 0 && filled.every((c) => !channelError(c));
};

interface ContactChannelsInputProps {
  value: ContactChannel[] | undefined;
  onChange: (val: ContactChannel[]) => void;
  maxPrimary?: number;
}

export const ContactChannelsInput: React.FC<ContactChannelsInputProps> = ({ value, onChange, maxPrimary = 2 }) => {
  const rows: ContactChannel[] = Array.isArray(value) && value.length ? value : emptyContactChannels();
  const primaryCount = rows.filter((r) => r.primary && r.value.trim()).length;

  const update = (id: string, patch: Partial<ContactChannel>) => {
    onChange(
      rows.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...patch };
        if (!next.value.trim()) next.primary = false; // un medio vacío no puede ser principal
        return next;
      })
    );
  };

  const togglePrimary = (row: ContactChannel) => {
    if (!row.value.trim()) return;
    if (!row.primary && primaryCount >= maxPrimary) return;
    update(row.id, { primary: !row.primary });
  };

  const addCustom = () => {
    onChange([...rows, { id: `custom-${Date.now()}`, kind: 'custom', label: '', value: '', primary: false }]);
  };

  const removeRow = (id: string) => onChange(rows.filter((r) => r.id !== id));

  return (
    <div className="w-full font-sans space-y-2.5">
      <AnimatePresence initial={false}>
        {rows.map((row) => {
          const base = BASE_CHANNELS.find((b) => b.id === row.id);
          const filled = Boolean(row.value.trim());
          const error = channelError(row);
          const canBePrimary = filled && (row.primary || primaryCount < maxPrimary);

          return (
            <motion.div
              key={row.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border px-4 py-3 transition-colors ${
                row.primary
                  ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-900 dark:border-white'
                  : 'bg-white dark:bg-neutral-900/80 border-neutral-200/80 dark:border-neutral-800'
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="flex items-center gap-2.5 min-w-[7.5rem] text-neutral-800 dark:text-neutral-200">
                  <span className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    {channelIcon(row.kind)}
                  </span>
                  {row.kind === 'custom' ? (
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => update(row.id, { label: e.target.value })}
                      placeholder="Nombre (ej. Pinterest)"
                      aria-label="Nombre del medio de contacto"
                      className="w-32 bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none border-b border-neutral-200 dark:border-neutral-700 focus:border-black dark:focus:border-white py-1"
                    />
                  ) : (
                    <span className="text-sm font-normal">{row.label}</span>
                  )}
                </div>

                <div className="order-3 sm:order-none basis-full sm:basis-auto flex-1 min-w-0">
                  <input
                    type={base?.inputType || 'text'}
                    inputMode={row.kind === 'whatsapp' ? 'tel' : row.kind === 'email' ? 'email' : undefined}
                    value={row.value}
                    onChange={(e) => update(row.id, { value: e.target.value })}
                    placeholder={base?.placeholder || 'Usuario o enlace'}
                    aria-label={`${row.label || 'Medio personalizado'}: usuario, número o enlace`}
                    className="w-full bg-transparent text-base text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 outline-none border-b border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white py-1.5 font-light"
                  />
                </div>

                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => togglePrimary(row)}
                    disabled={!canBePrimary}
                    aria-pressed={row.primary}
                    title={
                      !filled
                        ? 'Escribe primero tu usuario o número'
                        : !canBePrimary
                        ? `Solo puedes marcar ${maxPrimary} como principales`
                        : 'Marcar como medio principal'
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal transition-all ${
                      row.primary
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : canBePrimary
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${row.primary ? 'fill-current' : ''}`} />
                    Principal
                  </button>
                  {row.kind === 'custom' && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      aria-label="Quitar este medio"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {error && <p className="text-xs text-red-500 mt-1.5 font-light">{error}</p>}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={addCustom}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-normal bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar otro medio
        </button>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
          {primaryCount}/{maxPrimary} principales
        </p>
      </div>
    </div>
  );
};
