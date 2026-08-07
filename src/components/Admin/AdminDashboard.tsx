import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBriefs } from '../../context/BriefContext';
import { ClientSubmission, SubmissionStatus } from '../../types/brief';
import { SubmissionDetailModal } from './SubmissionDetailModal';
import {
  Inbox,
  Search,
  Filter,
  Download,
  Eye,
  Database,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Clock,
  HelpCircle,
  Copy,
  Code
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'sonner';
import isotipoImg from '../../assets/isotipo.webp';

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; bg: string; text: string }> = {
  new: { label: 'Nuevo', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  reviewing: { label: 'En Revisión', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  approved: { label: 'Aprobado', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  proposal_sent: { label: 'Propuesta Enviada', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  archived: { label: 'Archivado', bg: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20' },
};

export const AdminDashboard: React.FC = () => {
  const { submissions, updateStatus, deleteSubmission, exportSubmissionsJSON } = useBriefs();
  const { isDark, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeSubmission, setActiveSubmission] = useState<ClientSubmission | null>(null);
  const [showDbHelp, setShowDbHelp] = useState(false);

  // Filtered submissions
  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      sub.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.briefTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || sub.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalSubmissions = submissions.length;
  const newSubmissions = submissions.filter((s) => s.status === 'new').length;
  const reviewingSubmissions = submissions.filter((s) => s.status === 'reviewing').length;
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved').length;

  const sqlSchemaCode = `-- MySQL Table Schema for WeAreMiiles Briefs
CREATE TABLE IF NOT EXISTS \`client_briefs\` (
  \`id\` VARCHAR(32) PRIMARY KEY,
  \`brief_id\` VARCHAR(64) NOT NULL,
  \`brief_title\` VARCHAR(255) NOT NULL,
  \`client_name\` VARCHAR(255) NOT NULL,
  \`client_email\` VARCHAR(255) NOT NULL,
  \`client_phone\` VARCHAR(64),
  \`status\` ENUM('new', 'reviewing', 'approved', 'proposal_sent', 'archived') DEFAULT 'new',
  \`estimated_budget\` VARCHAR(128),
  \`answers_json\` JSON NOT NULL,
  \`notes\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const copySqlSchema = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    toast.success('Script SQL copiado al portapapeles');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Portal</span>
            </Link>
            <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-800" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-800 border border-neutral-700/50 flex items-center justify-center p-1 shadow-sm">
                <img src={isotipoImg} alt="Miiles" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-neutral-900 dark:text-white">
                MIILES <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-brand/10 text-brand ml-1">Studio Admin</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDbHelp(!showDbHelp)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-brand" />
              <span>Conexión MySQL</span>
            </button>

            <button
              onClick={exportSubmissionsJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </button>

            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-8 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight overflow-visible">
              Centro de Respuestas &{' '}
              <span className="font-pacifico text-brand px-1 overflow-visible inline-block">
                Briefs
              </span>
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-light">
              Monitorea en tiempo real todas las respuestas enviadas por tus clientes potenciales.
            </p>
          </div>
        </div>

        {/* Database instructions accordion if expanded */}
        {showDbHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-brand/30 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>Configuración de Base de Datos MySQL (Hostinger / cPanel)</span>
              </div>
              <button
                onClick={copySqlSchema}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-brand text-white font-medium hover:bg-brand-600 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copiar SQL Schema</span>
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
              Para almacenar las respuestas directamente en tu hosting Hostinger / cPanel:
              <br />
              1. En tu cPanel o hPanel ve a <strong>phpMyAdmin</strong> y ejecuta el script SQL adjunto para crear la tabla <code>client_briefs</code>.
              <br />
              2. Sube un archivo <code>/api/save_brief.php</code> con tus credenciales de base de datos.
            </p>

            <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 text-xs font-mono overflow-x-auto border border-neutral-800">
              {sqlSchemaCode}
            </pre>
          </motion.div>
        )}

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Briefs</span>
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-2 flex items-center justify-between">
              <span>{totalSubmissions}</span>
              <Inbox className="w-5 h-5 text-brand opacity-80" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Nuevos por revisar</span>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 flex items-center justify-between">
              <span>{newSubmissions}</span>
              <Sparkles className="w-5 h-5 opacity-80" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">En Evaluación</span>
            <div className="text-3xl font-extrabold text-amber-500 mt-2 flex items-center justify-between">
              <span>{reviewingSubmissions}</span>
              <Clock className="w-5 h-5 opacity-80" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Aprobados / Cerrados</span>
            <div className="text-3xl font-extrabold text-emerald-500 mt-2 flex items-center justify-between">
              <span>{approvedSubmissions}</span>
              <CheckCircle className="w-5 h-5 opacity-80" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente, email o ID..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-brand transition-colors"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'new', label: 'Nuevos' },
              { id: 'reviewing', label: 'En Revisión' },
              { id: 'approved', label: 'Aprobados' },
              { id: 'proposal_sent', label: 'Propuesta Enviada' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedStatus === st.id
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions Table / Grid */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                No se encontraron respuestas con los filtros actuales.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <th className="py-3.5 px-5">ID & Cliente</th>
                    <th className="py-3.5 px-5">Tipo de Brief</th>
                    <th className="py-3.5 px-5">Presupuesto Estimado</th>
                    <th className="py-3.5 px-5">Fecha</th>
                    <th className="py-3.5 px-5">Estado</th>
                    <th className="py-3.5 px-5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs sm:text-sm">
                  {filtered.map((sub) => {
                    const st = STATUS_CONFIG[sub.status] || STATUS_CONFIG.new;

                    return (
                      <tr
                        key={sub.id}
                        onClick={() => setActiveSubmission(sub)}
                        className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                              {sub.id}
                            </span>
                            <span className="font-semibold text-neutral-900 dark:text-white">
                              {sub.clientName}
                            </span>
                          </div>
                          {sub.clientEmail && (
                            <span className="text-xs text-neutral-400 font-light block mt-0.5">
                              {sub.clientEmail}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 font-medium text-neutral-800 dark:text-neutral-200">
                          {sub.briefTitle}
                        </td>

                        <td className="py-4 px-5 text-neutral-600 dark:text-neutral-400">
                          {sub.estimatedBudget || 'No especificado'}
                        </td>

                        <td className="py-4 px-5 text-neutral-400 text-xs">
                          {new Date(sub.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${st.bg}`}
                          >
                            {st.label}
                          </span>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSubmission(sub);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-brand hover:text-white transition-colors text-xs font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Detalle</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <SubmissionDetailModal
        submission={activeSubmission}
        onClose={() => setActiveSubmission(null)}
        onUpdateStatus={updateStatus}
        onDelete={deleteSubmission}
      />
    </div>
  );
};
