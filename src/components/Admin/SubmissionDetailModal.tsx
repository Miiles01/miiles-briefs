import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientSubmission, SubmissionStatus } from '../../types/brief';
import { X, Copy, MessageCircle, Mail, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SubmissionDetailModalProps {
  submission: ClientSubmission | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: SubmissionStatus, notes?: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABELS: Record<SubmissionStatus, { label: string; bg: string; text: string }> = {
  new: { label: 'Nuevo', bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700' },
  reviewing: { label: 'En Revisión', bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400 border-amber-500/20' },
  approved: { label: 'Aprobado', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  proposal_sent: { label: 'Propuesta Enviada', bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400 border-purple-500/20' },
  archived: { label: 'Archivado', bg: 'bg-neutral-500/10 dark:bg-neutral-500/20', text: 'text-neutral-600 dark:text-neutral-400 border-neutral-500/20' },
};

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  submission,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  if (!submission) return null;

  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [notes, setNotes] = useState<string>(submission.notes || '');

  const handleSave = () => {
    onUpdateStatus(submission.id, status, notes);
    toast.success('Cambios guardados con éxito');
    onClose();
  };

  const handleCopySummary = () => {
    const summary = `Brief ID: ${submission.id}
Cliente: ${submission.clientName} (${submission.clientEmail})
Tipo: ${submission.briefTitle}
Presupuesto: ${submission.estimatedBudget || 'N/A'}
Fecha: ${new Date(submission.createdAt).toLocaleString()}
Respuestas:
${Object.entries(submission.answers)
  .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
  .join('\n')}`;

    navigator.clipboard.writeText(summary);
    toast.success('Resumen completo copiado al portapapeles');
  };

  const whatsappMessage = encodeURIComponent(
    `¡Hola ${submission.clientName}! Te contactamos de Miiles Studio respecto a tu brief *${submission.id}* (${submission.briefTitle}). ¿Podemos agendar una breve llamada de 15 minutos?`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/50 dark:border-neutral-700/50">
                  {submission.id}
                </span>
                <span
                  className={`text-xs font-normal px-2.5 py-1 rounded-full border ${
                    STATUS_LABELS[submission.status].bg
                  } ${STATUS_LABELS[submission.status].text}`}
                >
                  {STATUS_LABELS[submission.status].label}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white mt-1">
                {submission.clientName}
              </h3>
              <p className="text-xs text-neutral-400 font-light">
                {submission.briefTitle} • {new Date(submission.createdAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Quick action bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-normal hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Todo</span>
              </button>

              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-normal hover:bg-emerald-500/20 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contactar WhatsApp</span>
              </a>

              {submission.clientEmail && (
                <a
                  href={`mailto:${submission.clientEmail}?subject=Propuesta Miiles Studio - Brief ${submission.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-normal hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Enviar Email</span>
                </a>
              )}
            </div>

            {/* Questions and Answers Card List */}
            <div className="space-y-4">
              <h4 className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                Respuestas del cliente
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {Object.entries(submission.answers).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-100 dark:border-neutral-800"
                  >
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 font-normal">
                      {key}
                    </span>
                    <div className="text-sm font-light text-neutral-800 dark:text-neutral-200 mt-1">
                      {Array.isArray(val) ? (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {val.map((item, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 font-normal"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{String(val)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Internal Notes */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
              <div>
                <label className="block text-xs font-normal text-neutral-500 dark:text-neutral-400 mb-2">
                  Estado del brief
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'reviewing', 'approved', 'proposal_sent', 'archived'] as SubmissionStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-normal transition-all ${
                        status === s
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {STATUS_LABELS[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-neutral-500 dark:text-neutral-400 mb-2">
                  Notas internas de Miiles
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Escribe notas sobre la llamada, presupuesto acordado, entregables..."
                  rows={3}
                  className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors resize-none font-light"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
            <button
              onClick={() => {
                if (confirm('¿Seguro que deseas eliminar este brief?')) {
                  onDelete(submission.id);
                  toast.success('Brief eliminado');
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-red-500 text-xs font-normal hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-normal text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-normal shadow-sm hover:opacity-85 transition-opacity flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
