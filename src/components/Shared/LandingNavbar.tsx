import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


interface LandingNavbarProps {
  onMenuAction?: (id: string) => void;
  cta?: React.ReactNode;
  isLanding?: boolean;
}

const LandingNavbar = ({ onMenuAction, cta, isLanding }: LandingNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(0);
  
  
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isLanding) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding]);

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setMenuKey(k => k + 1);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  

  const menuItems = [
    { label: "Inicio", href: "https://miiles.app/" },
    { label: "Nosotros", href: "https://miiles.app/acerca-de" },
    { label: "Funciones", href: "https://miiles.app/funciones" },
    { label: "Precios", href: "https://miiles.app/precios" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/miiles.studio/" },
    { label: "Tiktok", href: "https://www.tiktok.com/@miiles.studio" },
    { label: "Youtube", href: "https://www.youtube.com/@MiilesAI/shorts" },
  ];

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("/#") && !href.startsWith("http")) {
      const id = href.replace("/#", "");
      if (onMenuAction) {
        onMenuAction(id);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const isHeroTransparent = isLanding && !scrolled;

  return (
    <>
      {/* WRAPPER PARA NAV Y MENÚ */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95vw] md:w-max z-[100] flex flex-col gap-2">
        {/* NAV — flotante estilo glass */}
        <nav className={`w-full flex items-center justify-between gap-4 md:gap-16 px-6 md:px-8 py-4 md:min-w-[320px] rounded-full backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 ${
          isHeroTransparent
            ? "bg-white/80 md:bg-black/20"
            : "bg-white/80"
        }`}>
          <a href="https://miiles.app/" className="flex items-center shrink-0">
            <img 
              src="/logotipo.svg" 
              alt="Miiles" 
              className={`h-5 w-auto transition-all duration-300 ${isHeroTransparent ? 'md:brightness-0 md:invert' : ''}`} 
            />
          </a>

          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <button
              onClick={toggleMenu}
              className={`text-sm font-normal hover:opacity-50 transition-colors duration-300 tracking-tight ${
                isHeroTransparent ? "text-black md:text-white" : "text-black"
              }`}
            >
              {isMenuOpen ? "Cerrar" : "Menú"}
            </button>
            {cta}
          </div>
        </nav>
      </div>

      {/* MEGA MENU DESPLEGABLE — Contenedor flotante centralizado al top-28 */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div 
            key={menuKey}
            initial={{ opacity: 0, scale: 0.98, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              left: "50%",
              x: "-50%",
            }}
            className="fixed top-[92px] z-[90] w-[90vw] md:w-[85vw] max-w-5xl rounded-[32px] md:rounded-[40px] shadow-[0_24px_70px_rgba(0,0,0,0.15)] border border-white/10 bg-black/70 backdrop-blur-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="w-full flex flex-col md:flex-row pt-8 pb-24 px-10 md:py-16 md:px-20 gap-8 md:gap-0">
              
              {/* Left Column: Socials & Legal */}
              <div className="flex flex-col justify-between w-full md:w-1/3 order-2 md:order-1 mt-6 md:mt-0 mb-8 md:mb-0">
                <div className="flex flex-col gap-4">
                  {socialLinks.map((link, i) => (
                    <div 
                      key={link.label} 
                      className="overflow-hidden"
                      style={{ lineHeight: 1.2 }}
                    >
                      <motion.div
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "110%" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.05 }}
                      >
                        <a 
                          href={link.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block text-lg font-light text-white/80 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      </motion.div>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden mt-12" style={{ lineHeight: 1.4 }}>
                  <motion.div 
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="flex flex-col gap-1.5 text-xs font-light text-white/50"
                  >
                    <a href="/afiliados" onClick={() => setIsMenuOpen(false)} className="hover:text-white/80 transition-colors">{"Afiliados"}</a>
                    <a href="/terminos" onClick={() => setIsMenuOpen(false)} className="hover:text-white/80 transition-colors">{"Términos"}</a>
                    <a href="/privacidad" onClick={() => setIsMenuOpen(false)} className="hover:text-white/80 transition-colors">{"Privacidad"}</a>
                  </motion.div>
                </div>
              </div>

              {/* Right Column: Main Navigation Links */}
              <div className="flex flex-col justify-center w-full md:w-2/3 gap-4 md:gap-5 pl-0 md:pl-16 order-1 md:order-2 pb-6 md:pb-0 relative">
                {menuItems.map((item, i) => (
                  <div 
                    key={item.label} 
                    className="overflow-hidden"
                    style={{ lineHeight: 1.15, paddingBottom: '0.05em' }}
                  >
                    <motion.div 
                      initial={{ y: "110%" }} 
                      animate={{ y: "0%" }} 
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.05 }}
                    >
                      <a 
                        href={item.href}
                        onClick={() => handleLinkClick(item.href)}
                        className="block text-4xl md:text-5xl lg:text-[50px] font-medium text-white hover:opacity-50 transition-opacity duration-300 tracking-tight"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        {item.label}
                      </a>
                    </motion.div>
                  </div>
                ))}

                {/* LANGUAGE SELECTOR */}
                <div className="mt-4 md:mt-8 relative z-50">
                  {/* Idioma removido intencionalmente para no crashear */}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay transparente para cerrar al hacer clic afuera */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-[80] cursor-pointer"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNavbar;
