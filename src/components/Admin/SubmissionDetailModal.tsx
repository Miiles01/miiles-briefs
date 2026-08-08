import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientSubmission, SubmissionStatus, Question } from '../../types/brief';
import { BRIEF_TEMPLATES } from '../../data/briefTemplates';
import {
  X,
  Copy,
  MessageCircle,
  Mail,
  Check,
  Trash2,
  Calendar,
  DollarSign,
  User,
  Building,
  Sparkles,
  ExternalLink,
  Maximize2,
  Printer,
  FileText,
  Palette,
  Type,
  Layers,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface SubmissionDetailModalProps {
  submission: ClientSubmission | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: SubmissionStatus, notes?: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; bg: string; text: string; dot: string }> = {
  new: {
    label: 'Nuevo',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    text: 'text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700',
    dot: 'bg-blue-500'
  },
  reviewing: {
    label: 'En Revisión',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500'
  },
  approved: {
    label: 'Aprobado',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500'
  },
  proposal_sent: {
    label: 'Propuesta Enviada',
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400 border-purple-500/20',
    dot: 'bg-purple-500'
  },
  archived: {
    label: 'Archivado',
    bg: 'bg-neutral-500/10 dark:bg-neutral-500/20',
    text: 'text-neutral-600 dark:text-neutral-400 border-neutral-500/20',
    dot: 'bg-neutral-400'
  },
};

const TYPOGRAPHY_MAP: Record<string, string> = {
  'typo-1': '/tipografia/104d9a8cce07bc400306497f66a72a6a.jpg',
  'typo-2': '/tipografia/1f33624f98edf0ab9cc032a915330540.jpg',
  'typo-3': '/tipografia/2a89b91663bdbbbb5771515c836264d7.jpg',
  'typo-4': '/tipografia/3a9d82a2b9c9b057b592c36048c7cde2.jpg',
  'typo-5': '/tipografia/435614356446bf26c5d4fdd48a343b46.jpg',
  'typo-6': '/tipografia/450845ada40fdf8f588cc3ee924102dc.jpg',
  'typo-7': '/tipografia/5235f4e995af4d76926022ec5eba90a8.jpg',
  'typo-8': '/tipografia/60623bcabc43118889f5218cf554d2d5.jpg',
  'typo-9': '/tipografia/6bab53de6cd5214654a6e8f84c3cdd5f.jpg',
  'typo-10': '/tipografia/7a448646dd2fc6634ec8277377aceef9.jpg',
  'typo-11': '/tipografia/8bf7782e03898c93d0b4fd97e18cecc7.jpg',
  'typo-12': '/tipografia/8f211bea4aa602b7084fe4c5e911714b.jpg',
  'typo-13': '/tipografia/905b22b4a2cf043a11e0c2c83b441de3.jpg',
  'typo-14': '/tipografia/c96b1164ae49bf64b6b31fb128ea4abf.jpg',
  'typo-15': '/tipografia/c9c8b626df900dc98ef6a8e21f055bd7.jpg',
  'typo-16': '/tipografia/c9eab539173c7f3bd63996e34c7ed48c.jpg',
  'typo-17': '/tipografia/d607620952f89d03e80d608c57f69c71.jpg',
  'typo-18': '/tipografia/ec91551c2e7e130e808a06cc8d18b2e5.jpg',
  'typo-19': '/tipografia/f1350b36a6411660218ce460d0e6ebef.jpg',
  'typo-20': '/tipografia/fce69ea63a03c17c31230aed42ec71dd.jpg',
  'typo-21': '/tipografia/b27d28297949fde9852ec7e1c0ff4e84.jpg',
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
  const [activeImageZoom, setActiveImageZoom] = useState<string | null>(null);

  // Find matching template to enrich questions
  const template = useMemo(() => {
    return BRIEF_TEMPLATES.find(
      (t) => t.id === submission.briefId || t.title.toLowerCase() === submission.briefTitle?.toLowerCase()
    ) || BRIEF_TEMPLATES[0];
  }, [submission]);

  // Extract phone if present in answers or submission
  const clientPhone = useMemo(() => {
    if (submission.clientPhone) return submission.clientPhone;
    for (const [k, v] of Object.entries(submission.answers)) {
      if (
        (k.includes('phone') || k.includes('whatsapp') || k.includes('telefono') || k.includes('contacto')) &&
        typeof v === 'string' &&
        /\d{6,}/.test(v)
      ) {
        return v;
      }
    }
    return '';
  }, [submission]);

  // Clean phone for wa.me link
  const cleanPhone = useMemo(() => {
    const raw = clientPhone.replace(/\D/g, '');
    if (raw.length === 10) return `52${raw}`; // Default to MX if 10 digits
    return raw;
  }, [clientPhone]);

  // Group questions by section
  const enrichedSections = useMemo(() => {
    const questionsMap = new Map<string, Question>();
    template?.questions.forEach((q) => questionsMap.set(q.id, q));

    const sectionsMap = new Map<
      string,
      Array<{
        key: string;
        question?: Question;
        answer: any;
      }>
    >();

    // Process answered keys that exist in template questions
    template?.questions.forEach((q) => {
      if (submission.answers[q.id] !== undefined) {
        const sec = q.section || 'General';
        if (!sectionsMap.has(sec)) sectionsMap.set(sec, []);
        sectionsMap.get(sec)!.push({
          key: q.id,
          question: q,
          answer: submission.answers[q.id],
        });
      }
    });

    // Process any other answers not in template
    const otherAnswers: Array<{ key: string; question?: Question; answer: any }> = [];
    Object.entries(submission.answers).forEach(([k, val]) => {
      if (!questionsMap.has(k)) {
        otherAnswers.push({
          key: k,
          answer: val,
        });
      }
    });

    if (otherAnswers.length > 0) {
      sectionsMap.set('Información Adicional', otherAnswers);
    }

    return Array.from(sectionsMap.entries());
  }, [template, submission.answers]);

  const handleSave = () => {
    onUpdateStatus(submission.id, status, notes);
    toast.success('Cambios guardados correctamente');
    onClose();
  };

  const handleCopySummary = () => {
    const lines: string[] = [
      `=========================================`,
      `📄 BRIEF EJECUTIVO — MIILES STUDIO`,
      `=========================================`,
      `Brief ID: ${submission.id}`,
      `Cliente: ${submission.clientName}`,
      `Email: ${submission.clientEmail}`,
      `Teléfono: ${clientPhone || 'No especificado'}`,
      `Empresa: ${submission.companyName || 'N/A'}`,
      `Tipo de Brief: ${submission.briefTitle}`,
      `Presupuesto Estimado: ${submission.estimatedBudget || 'Por cotizar'}`,
      `Fecha de Registro: ${new Date(submission.createdAt).toLocaleString('es-MX')}`,
      `Estado: ${STATUS_CONFIG[status].label}`,
      `-----------------------------------------`,
      `RESPUESTAS DETALLADAS:`,
      `-----------------------------------------`,
    ];

    enrichedSections.forEach(([sectionTitle, items]) => {
      lines.push(`\n📌 ${sectionTitle.toUpperCase()}`);
      items.forEach(({ question, key, answer }) => {
        const qTitle = question ? question.title : key;
        let formattedAnswer = '';
        if (Array.isArray(answer)) {
          formattedAnswer = answer.join(', ');
        } else if (typeof answer === 'object' && answer !== null) {
          formattedAnswer = JSON.stringify(answer);
        } else {
          formattedAnswer = String(answer);
        }
        lines.push(`  • ${qTitle}:`);
        lines.push(`    → ${formattedAnswer}`);
      });
    });

    if (notes) {
      lines.push(`\n-----------------------------------------`);
      lines.push(`📝 NOTAS INTERNAS:`);
      lines.push(notes);
    }

    navigator.clipboard.writeText(lines.join('\n'));
    toast.success('Resumen completo copiado en formato ejecutivo');
  };

  const whatsappMessage = encodeURIComponent(
    `¡Hola ${submission.clientName}! Te contactamos de Miiles Studio respecto a tu brief *${submission.briefTitle}* (${submission.id}). Hemos revisado las respuestas y requerimientos de tu proyecto y nos gustaría presentarte la propuesta inicial.`
  );

  const emailSubject = encodeURIComponent(
    `Propuesta Creativa Miiles Studio — Brief ${submission.briefTitle} (${submission.id})`
  );

  const emailBody = encodeURIComponent(
    `Hola ${submission.clientName},\n\n` +
    `Esperamos que te encuentres muy bien.\n\n` +
    `Te escribimos de Miiles Studio para confirmar que hemos recibido y analizado minuciosamente las respuestas de tu brief para el proyecto de ${submission.briefTitle}.\n\n` +
    `Nos encantaría coordinar una breve sesión de 15 minutos para presentarte nuestra propuesta conceptual y alcance de trabajo.\n\n` +
    `Quedamos a tu entera disposición.\n\n` +
    `Atentamente,\n` +
    `Equipo de Estrategia & Diseño\n` +
    `Miiles Studio\n` +
    `https://wearemiiles.com`
  );

  // Helper to render visual answer based on question type
  const renderVisualAnswer = (answer: any, question?: Question) => {
    // 1. Array of typography images
    if (question?.type === 'image-gallery' || question?.id === 'b-typography-style') {
      const selectedItems = Array.isArray(answer) ? answer : [answer];
      if (selectedItems.includes('Sin definir') || selectedItems.includes('sin-definir')) {
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sin definir — Abierto a la propuesta tipográfica de Miiles</span>
          </div>
        );
      }

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
            {selectedItems.map((itemId, idx) => {
              const imgUrl = TYPOGRAPHY_MAP[itemId] || (typeof itemId === 'string' && itemId.startsWith('/') ? itemId : null);
              if (!imgUrl) return null;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveImageZoom(imgUrl)}
                  className="group relative rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow-sm"
                >
                  <img
                    src={imgUrl}
                    alt={`Referencia Tipográfica ${idx + 1}`}
                    className="w-full h-32 sm:h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-normal backdrop-blur-[2px]">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Ver grande</span>
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-white font-mono">
                    {itemId}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    // 2. Color picker / palette answers
    if (
      question?.type === 'color-picker' ||
      question?.id === 'b-brand-colors' ||
      (Array.isArray(answer) && answer.some((val) => typeof val === 'string' && val.startsWith('#')))
    ) {
      const colors = Array.isArray(answer) ? answer : [answer];
      if (colors.includes('Sin definir') || colors.includes('sin-definir')) {
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
            <Palette className="w-3.5 h-3.5 text-purple-500" />
            <span>Sin definir — Abierto a la paleta de colores propuesta por Miiles</span>
          </div>
        );
      }

      return (
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {colors.map((hex, i) => (
            <button
              key={i}
              onClick={() => {
                navigator.clipboard.writeText(hex);
                toast.success(`Color ${hex} copiado al portapapeles`);
              }}
              title="Clic para copiar código HEX"
              className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 shadow-sm transition-all cursor-pointer group"
            >
              <div
                className="w-6 h-6 rounded-full shadow-inner border border-black/10 dark:border-white/20 transition-transform group-hover:scale-110"
                style={{ backgroundColor: hex }}
              />
              <span className="font-mono text-xs text-neutral-800 dark:text-neutral-200 font-normal">
                {hex}
              </span>
              <Copy className="w-3 h-3 text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-white" />
            </button>
          ))}
        </div>
      );
    }

    // 3. Single Choice & Multi Choice Options with resolved labels
    if (question?.options && (question.type === 'single-choice' || question.type === 'multiple-choice')) {
      const selectedIds = Array.isArray(answer) ? answer : [answer];
      return (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedIds.map((optId, i) => {
            const foundOpt = question.options?.find((o) => o.id === optId || o.label === optId);
            return (
              <div
                key={i}
                className="p-3 rounded-2xl bg-neutral-100/70 dark:bg-neutral-850 border border-neutral-200/60 dark:border-neutral-800 flex items-start gap-2.5 max-w-lg"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-normal text-neutral-900 dark:text-white">
                    {foundOpt ? foundOpt.label : String(optId)}
                  </p>
                  {foundOpt?.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-0.5">
                      {foundOpt.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // 4. Default array of items
    if (Array.isArray(answer)) {
      return (
        <div className="flex flex-wrap gap-2 pt-1">
          {answer.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-normal text-neutral-800 dark:text-neutral-200 border border-neutral-200/50 dark:border-neutral-700/50"
            >
              {String(item)}
            </span>
          ))}
        </div>
      );
    }

    // 5. Default text / textarea / string
    return (
      <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-light leading-relaxed whitespace-pre-wrap">
        {String(answer)}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-5xl max-h-[94vh] bg-white dark:bg-neutral-950 rounded-3xl shadow-2xl border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col overflow-hidden"
        >
          {/* Header Bar */}
          <div className="p-6 sm:p-7 bg-neutral-50/80 dark:bg-neutral-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-normal">
                  {submission.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-normal px-3 py-1 rounded-full border ${
                    STATUS_CONFIG[status].bg
                  } ${STATUS_CONFIG[status].text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[status].dot}`} />
                  {STATUS_CONFIG[status].label}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-normal">
                  {submission.briefTitle}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white tracking-tight">
                {submission.clientName}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-light">
                {submission.companyName && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {submission.companyName}
                  </span>
                )}
                {submission.clientEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {submission.clientEmail}
                  </span>
                )}
                {clientPhone && (
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {clientPhone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(submission.createdAt).toLocaleString('es-MX', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
                {submission.estimatedBudget && (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-normal">
                    <DollarSign className="w-3.5 h-3.5" />
                    Presupuesto: {submission.estimatedBudget}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                onClick={() => window.print()}
                title="Imprimir o guardar PDF"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Communication Action Bar */}
          <div className="px-6 sm:px-7 py-3 bg-neutral-100/60 dark:bg-neutral-900/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* WhatsApp direct button */}
              <a
                href={
                  cleanPhone
                    ? `https://wa.me/${cleanPhone}?text=${whatsappMessage}`
                    : `https://web.whatsapp.com/send?text=${whatsappMessage}`
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-normal transition-all shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contactar por WhatsApp</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>

              {/* Gmail compose button */}
              {submission.clientEmail && (
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    submission.clientEmail
                  )}&su=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-normal transition-all shadow-sm cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-red-500" />
                  <span>Enviar por Gmail</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              {/* Copy Full Executive Summary */}
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-normal transition-all shadow-sm cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Todo</span>
              </button>
            </div>

            <span className="text-[11px] text-neutral-400 font-light hidden sm:inline">
              Brief completado en tiempo estimado (~{template?.estimatedTime || '8 min'})
            </span>
          </div>

          {/* Body Content — Structured Questions & Answers */}
          <div className="p-6 sm:p-7 overflow-y-auto space-y-8 flex-1">
            {enrichedSections.map(([sectionTitle, items], sIdx) => (
              <div key={sIdx} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                    {sectionTitle}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {items.map(({ key, question, answer }, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-5 rounded-2xl bg-neutral-50/90 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/80 space-y-2.5"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-normal text-neutral-900 dark:text-neutral-100">
                            {question ? question.title : key}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-400 font-light">
                            {key}
                          </span>
                        </div>
                        {question?.subtitle && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                            {question.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Visual Answer Renderer */}
                      <div className="pt-1">{renderVisualAnswer(answer, question)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Status Selector & Internal Notes Card */}
            <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Actualizar estado del brief
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'reviewing', 'approved', 'proposal_sent', 'archived'] as SubmissionStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer ${
                        status === s
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                          : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`} />
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Notas internas del equipo Miiles
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Añade notas privadas sobre acuerdos en llamada, presupuesto final, fechas de entrega o feedback del cliente..."
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors resize-none font-light"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-neutral-50/80 dark:bg-neutral-900/60 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                if (confirm('¿Seguro que deseas eliminar permanentemente este brief?')) {
                  onDelete(submission.id);
                  toast.success('Brief eliminado correctamente');
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-red-500 text-xs font-normal hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Brief</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-normal text-neutral-500 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-normal shadow-sm hover:opacity-85 transition-opacity flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Fullscreen Lightbox Zoom Modal for Typography References */}
        {activeImageZoom && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImageZoom(null)}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-zoom-out"
            >
              <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
                <img
                  src={activeImageZoom}
                  alt="Vista previa ampliada"
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                />
                <button
                  onClick={() => setActiveImageZoom(null)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </AnimatePresence>
  );
};
