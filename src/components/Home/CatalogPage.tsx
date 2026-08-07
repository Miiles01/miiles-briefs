import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRIEF_TEMPLATES } from '../../data/briefTemplates';
import { Sparkles, ArrowRight, Clock, ShieldCheck, Sun, Moon, Database, ExternalLink, HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import isotipoImg from '../../assets/isotipo.webp';

export const CatalogPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-neutral-800 border border-neutral-700/50 flex items-center justify-center p-1.5 shadow-sm">
              <img src={isotipoImg} alt="Miiles" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white">
              MIILES<span className="text-brand">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Admin Panel</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-12 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6 border border-brand/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client Experience & Strategy Hub</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight overflow-visible"
        >
          Diseñemos el futuro de tu{' '}
          <span className="font-pacifico text-brand px-1 overflow-visible inline-block">
            Marca
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-5 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Completa un brief interactivo en menos de 4 minutos. Diseñaremos una propuesta visual y estratégica personalizada para tus objetivos.
        </motion.p>
      </section>

      {/* Briefs Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BRIEF_TEMPLATES.map((tmpl, idx) => (
            <motion.div
              key={tmpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.2 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-brand/40 dark:hover:border-brand/40 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-300">
                    {tmpl.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-neutral-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-brand" />
                    <span>~{tmpl.estimatedTime}</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-brand transition-colors overflow-visible">
                  {tmpl.title}{' '}
                  {tmpl.highlightWord && (
                    <span className="font-pacifico text-brand px-1 overflow-visible inline-block">
                      {tmpl.highlightWord}
                    </span>
                  )}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2.5 font-light leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">
                  {tmpl.totalQuestions} Preguntas
                </span>

                <Link
                  to={`/brief/${tmpl.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand text-white text-xs font-semibold shadow-md hover:bg-brand-600 transition-all group-hover:gap-3"
                >
                  <span>Llenar Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature banner */}
        <div className="mt-16 rounded-3xl p-8 bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-brand/20 text-brand flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                ¿Necesitas un brief o desarrollo a la medida?
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light mt-0.5">
                Podemos conectar este formulario con tu base de datos MySQL en Hostinger o enviar respuestas a tu WhatsApp.
              </p>
            </div>
          </div>

          <Link
            to="/admin"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Database className="w-4 h-4 text-brand" />
            <span>Configurar Conexión DB</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 py-8 px-6 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WeAreMiiles — Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="https://miiles.app" target="_blank" rel="noreferrer" className="hover:text-brand transition-colors">
              miiles.app
            </a>
            <span>•</span>
            <a href="https://wearemiiles.com" target="_blank" rel="noreferrer" className="hover:text-brand transition-colors">
              wearemiiles.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
