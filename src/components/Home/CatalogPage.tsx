import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRIEF_TEMPLATES } from '../../data/briefTemplates';
import { Sparkles, ArrowRight, Clock, ShieldCheck, Sun, Moon, Database } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const CatalogPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080a] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans">
      {/* Top Floating Navbar */}
      <div className="sticky top-4 z-40 px-4 sm:px-8 max-w-6xl mx-auto">
        <nav className="w-full flex items-center justify-between px-6 py-3 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logotipo.svg"
              alt="Miiles"
              className="h-5 w-auto dark:brightness-0 dark:invert transition-all duration-300"
            />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-12 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-normal tracking-wide mb-6 border border-neutral-200/50 dark:border-neutral-700/50"
        >
          <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
          <span>Client Experience & Strategy</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-normal text-neutral-900 dark:text-white tracking-tight leading-tight overflow-visible"
        >
          Diseñemos el futuro de tu{' '}
          <span className="font-editorial italic px-1 overflow-visible inline-block">
            Marca
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 mt-5 max-w-2xl mx-auto font-light leading-relaxed"
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
              whileHover={{ y: -5 }}
              className="rounded-3xl p-7 bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-normal px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {tmpl.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-light">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>~{tmpl.estimatedTime}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-normal text-neutral-900 dark:text-white transition-colors overflow-visible">
                  {tmpl.title}{' '}
                  {tmpl.highlightWord && (
                    <span className="font-editorial italic px-1 overflow-visible inline-block">
                      {tmpl.highlightWord}
                    </span>
                  )}
                </h2>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 font-light leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-light">
                  {tmpl.totalQuestions} Preguntas
                </span>

                <Link
                  to={`/brief/${tmpl.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-normal shadow-sm hover:opacity-85 transition-all group-hover:gap-3"
                >
                  <span>Llenar Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature banner */}
        <div className="mt-16 rounded-3xl p-8 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-normal text-neutral-900 dark:text-white">
                ¿Necesitas un brief o desarrollo a la medida?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light mt-0.5">
                Podemos conectar este formulario con tu base de datos MySQL en Hostinger o enviar respuestas a tu WhatsApp.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/525549201823"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-normal hover:opacity-85 transition-opacity"
          >
            <span>Consultar por WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-100 dark:border-neutral-800/80 py-8 px-6 text-center text-xs text-neutral-400 font-light">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 WeAreMiiles — Todos los derechos reservados.</p>
          <p>
            Diseñado por <span className="font-normal text-neutral-700 dark:text-neutral-300">Miiles Studio</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
