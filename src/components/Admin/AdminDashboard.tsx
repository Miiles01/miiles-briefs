import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBriefs } from '../../context/BriefContext';
import { ClientSubmission, SubmissionStatus } from '../../types/brief';
import { SubmissionDetailModal } from './SubmissionDetailModal';
import {
  Inbox,
  Search,
  Download,
  Eye,
  Database,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  CheckCircle,
  Clock,
  Copy,
  Lock,
  ArrowRight,
  LogOut,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'sonner';
import isotipoImg from '../../assets/isotipo.webp';

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; bg: string; text: string }> = {
  new: { label: 'Nuevo', bg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700' },
  reviewing: { label: 'En Revisión', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  approved: { label: 'Aprobado', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  proposal_sent: { label: 'Propuesta Enviada', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  archived: { label: 'Archivado', bg: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20' },
};

export const AdminDashboard: React.FC = () => {
  const { submissions, updateStatus, deleteSubmission, exportSubmissionsJSON } = useBriefs();
  const { isDark, toggleTheme } = useTheme();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('miiles_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeSubmission, setActiveSubmission] = useState<ClientSubmission | null>(null);
  const [showDbHelp, setShowDbHelp] = useState(false);

  // Real-time MySQL Connection state
  const [dbState, setDbState] = useState<{
    status: 'checking' | 'connected' | 'disconnected';
    message: string;
    database?: string;
    submissionsCount?: number;
  }>({
    status: 'checking',
    message: 'Verificando conexión...',
  });

  const checkDbStatus = async (notify = false) => {
    setDbState(prev => ({ ...prev, status: 'checking', message: 'Verificando MySQL...' }));
    try {
      const res = await fetch('/api/test.php');
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setDbState({
          status: 'connected',
          message: 'MySQL Conectado',
          database: data.database || 'uablinco_miiles_briefs',
          submissionsCount: data.submissions_in_db,
        });
        if (notify) toast.success('Conexión con MySQL en HostGator activa');
      } else {
        setDbState({
          status: 'disconnected',
          message: data.message || 'No conectado a MySQL',
        });
        if (notify) toast.error(data.message || 'Error de conexión MySQL');
      }
    } catch (err: any) {
      setDbState({
        status: 'disconnected',
        message: 'Servidor MySQL no responde o en modo local',
      });
      if (notify) toast.error('No se pudo contactar con la API MySQL');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkDbStatus();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'creativo2022') {
      sessionStorage.setItem('miiles_admin_auth', 'true');
      setIsAuthenticated(true);
      setPasswordError(false);
      toast.success('Acceso autorizado al Panel de Administración');
    } else {
      setPasswordError(true);
      toast.error('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('miiles_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
    toast.info('Sesión cerrada');
  };

  // If not authenticated, render password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#08080a] text-neutral-900 dark:text-neutral-100 flex flex-col justify-between transition-colors duration-300 font-sans">
        {/* Header */}
        <header className="w-full pt-6 pb-4 px-6 sm:px-12 flex items-center justify-between z-20">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-light text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Portal</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </header>

        {/* Login Form Stage */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm mx-auto flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6 p-4">
              <img src={isotipoImg} alt="Miiles" className="w-full h-full object-contain" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white tracking-tight">
              Admin Panel
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-light max-w-xs">
              Ingresa la contraseña para gestionar los briefs y respuestas de los clientes.
            </p>

            <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(false);
                  }}
                  placeholder="Contraseña de acceso"
                  autoFocus
                  className={`w-full bg-transparent border-b ${
                    passwordError
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : 'border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white'
                  } py-3 px-2 text-center text-base tracking-widest text-neutral-900 dark:text-white placeholder:text-neutral-400 placeholder:tracking-normal focus:outline-none transition-colors font-sans`}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-normal text-sm hover:opacity-85 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Desbloquear Panel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </main>
      </div>
    );
  }

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
    <div className="min-h-screen bg-white dark:bg-[#08080a] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans">
      {/* Top Navigation */}
      <nav className="w-full border-b border-neutral-100 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-light text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Portal</span>
            </Link>
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex items-center gap-2.5">
              <img
                src="/logotipo.svg"
                alt="Miiles"
                className="h-4 sm:h-4.5 w-auto dark:brightness-0 dark:invert transition-all duration-300"
              />
              <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50">
                Studio Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time DB Connection Status Badge */}
            <button
              onClick={() => {
                checkDbStatus(true);
                setShowDbHelp(!showDbHelp);
              }}
              title="Clic para re-verificar o ver estado de conexión MySQL"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer border ${
                dbState.status === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  : dbState.status === 'disconnected'
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}
            >
              {dbState.status === 'connected' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              {dbState.status === 'disconnected' && (
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
              )}
              {dbState.status === 'checking' && (
                <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
              )}
              <span>
                {dbState.status === 'connected'
                  ? 'MySQL Conectado'
                  : dbState.status === 'disconnected'
                  ? 'MySQL Desconectado'
                  : 'Verificando SQL...'}
              </span>
            </button>

            <button
              onClick={exportSubmissionsJSON}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-normal hover:opacity-85 transition-opacity cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </button>

            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-red-600 dark:hover:text-red-400 border border-neutral-200/80 dark:border-neutral-800 transition-colors cursor-pointer"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-8 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-normal text-neutral-900 dark:text-white tracking-tight overflow-visible">
              Centro de Respuestas &{' '}
              <span className="font-editorial italic px-1 overflow-visible inline-block">
                Prospectos
              </span>
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
              Revisa las respuestas completadas de los clientes, filtra estados y exporta información.
            </p>
          </div>
        </div>

        {/* Database Config Modal / Dropdown info */}
        {showDbHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Estado de Conexión MySQL (HostGator)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => checkDbStatus(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Probar Conexión</span>
                </button>
                <button
                  onClick={copySqlSchema}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar SQL Schema</span>
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border text-xs font-light flex items-center justify-between ${
              dbState.status === 'connected'
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-300'
            }`}>
              <div>
                <span className="font-medium block mb-0.5">
                  {dbState.status === 'connected' ? '✅ Conexión Activa con Base de Datos' : '⚠️ Estado: Desconectado o Modo Local'}
                </span>
                <span>
                  {dbState.status === 'connected'
                    ? `Base de datos: ${dbState.database || 'uablinco_miiles_briefs'} — Respuestas registradas en MySQL: ${dbState.submissionsCount ?? submissions.length}`
                    : dbState.message}
                </span>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-200 text-xs font-mono overflow-x-auto">
              {sqlSchemaCode}
            </pre>
          </motion.div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-xs text-neutral-400 font-light">Total Recibidos</span>
            <p className="text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
              {totalSubmissions}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-xs text-neutral-400 font-light">Nuevos Sin Revisar</span>
            <p className="text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
              {newSubmissions}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-xs text-neutral-400 font-light">En Evaluación</span>
            <p className="text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
              {reviewingSubmissions}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-xs text-neutral-400 font-light">Aprobados</span>
            <p className="text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
              {approvedSubmissions}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, brief o email..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-sans"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['all', 'new', 'reviewing', 'approved', 'proposal_sent', 'archived'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-normal transition-colors whitespace-nowrap cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                {st === 'all' ? 'Todos' : STATUS_CONFIG[st as SubmissionStatus]?.label || st}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions Table / Cards */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
            <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-3" />
            <h4 className="text-base font-normal text-neutral-900 dark:text-white">
              No hay respuestas en esta vista
            </h4>
            <p className="text-xs text-neutral-400 font-light mt-1 max-w-sm">
              Cuando un cliente termine de llenar un brief interactivo, sus respuestas se registrarán automáticamente aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-400 font-light border-b border-neutral-100 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Cliente / Marca</th>
                    <th className="py-3 px-4">Tipo de Brief</th>
                    <th className="py-3 px-4">Presupuesto</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-light">
                  {filtered.map((sub) => {
                    const statusInfo = STATUS_CONFIG[sub.status] || STATUS_CONFIG.new;
                    const dateFormatted = new Date(sub.createdAt).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <tr
                        key={sub.id}
                        onClick={() => setActiveSubmission(sub)}
                        className="hover:bg-neutral-50/80 dark:hover:bg-neutral-850/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-normal text-neutral-900 dark:text-white block">
                            {sub.clientName}
                          </span>
                          <span className="text-neutral-400 text-[11px]">
                            {sub.clientEmail || 'Sin email'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-normal text-neutral-800 dark:text-neutral-200">
                          {sub.briefTitle}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400">
                          {sub.estimatedBudget || 'No especificado'}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400">
                          {dateFormatted}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${statusInfo.bg} ${statusInfo.text}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSubmission(sub);
                              }}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`¿Deseas eliminar la respuesta de ${sub.clientName} (${sub.id})?`)) {
                                  deleteSubmission(sub.id);
                                  toast.success('Respuesta eliminada correctamente');
                                }
                              }}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Eliminar respuesta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {activeSubmission && (
        <SubmissionDetailModal
          submission={activeSubmission}
          onClose={() => setActiveSubmission(null)}
          onUpdateStatus={(id, newStatus, notes) => updateStatus(id, newStatus, notes)}
          onDelete={(id) => {
            deleteSubmission(id);
            setActiveSubmission(null);
          }}
        />
      )}
    </div>
  );
};
