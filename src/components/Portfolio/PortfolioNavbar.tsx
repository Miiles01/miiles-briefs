import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Briefcase, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const PortfolioNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-8 max-w-6xl mx-auto pointer-events-none">
      <nav className="w-full flex items-center justify-between px-6 py-3 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] pointer-events-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
            <img
              src="/logotipo.svg"
              alt="Miiles"
              className="h-5 w-auto dark:brightness-0 dark:invert transition-all duration-300"
            />
          </Link>
          
          <div className="hidden sm:flex items-center gap-1 bg-neutral-100/50 dark:bg-neutral-800/50 p-1 rounded-full border border-neutral-200/50 dark:border-neutral-700/50">
            <Link 
              to="/" 
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                location.pathname === '/' 
                  ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm' 
                  : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Briefs
            </Link>
            <Link 
              to="/trabajo" 
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                location.pathname.includes('/trabajo') 
                  ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm' 
                  : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Portafolio
            </Link>
          </div>
        </div>

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
  );
};

export default PortfolioNavbar;
