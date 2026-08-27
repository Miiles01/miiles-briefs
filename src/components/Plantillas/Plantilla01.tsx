import React, { useEffect, useState } from 'react';
import { Menu, Instagram, Twitter, Mail, Play, X } from 'lucide-react';
import { PortfolioSmoothScroll } from '../Portfolio/PortfolioSmoothScroll';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const Plantilla01: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sections = gsap.utils.toArray('.theme-section') as HTMLElement[];
    
    const triggers = sections.map((section) => {
      const sectionTheme = section.getAttribute('data-theme') as 'light' | 'dark';
      
      return ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setTheme(sectionTheme),
        onEnterBack: () => setTheme(sectionTheme),
      });
    });

    
    
    // Title animations with SplitText on scroll
    const titles = gsap.utils.toArray('.animated-title');
    titles.forEach((title) => {
      const split = new SplitText(title, { type: 'words' });
      gsap.from(split.words, {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          once: true
        },
        opacity: 0,
        y: 25,
        stagger: 0.06,
        duration: 0.6,
        ease: 'power2.out'
      });
    });

    // Paragraph animations with stagger on scroll
    ScrollTrigger.batch('.animated-p', {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(batch, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power2.out", overwrite: true }
        );
      }
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Sobre mí', id: 'sobre-mi' },
    { name: 'Contenidos', id: 'contenidos' },
    { name: 'Clientes', id: 'clientes' },
    { name: 'Contacto', id: 'contacto' },
  ];

  return (
    <PortfolioSmoothScroll>
      <div className={`${theme}`}>
        <div className="min-h-screen bg-white dark:bg-[#08080a] text-black dark:text-white font-dmsans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-1000 ease-in-out relative">
          
          {/* Floating Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
            <div className="pointer-events-auto text-black dark:text-white transition-colors duration-1000">
              <span className="text-xl font-medium tracking-tight">Laura.</span>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="pointer-events-auto w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md flex items-center justify-center hover:scale-105 transition-all duration-1000 text-black dark:text-white z-[60]"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>

          {/* Menu Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-20 right-6 left-6 md:left-auto md:w-72 bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-2xl z-50 flex flex-col gap-6"
              >
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold tracking-widest text-black/40 dark:text-white/40 mb-2">Menú</p>
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(e) => handleScroll(e, link.id)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="text-3xl font-light hover:translate-x-2 transition-transform duration-300 inline-block"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>
                <div className="mt-4 pt-6 border-t border-black/5 dark:border-white/10 flex flex-col gap-6">
                  <a href="mailto:hola@lauracreativa.com" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                    hola@lauracreativa.com
                  </a>
                  <div className="flex gap-4">
                    <a href="#" className="p-3 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-3 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="px-6 md:px-12 lg:px-24 pt-32 pb-24 max-w-7xl mx-auto flex flex-col gap-48 md:gap-64">
            
            {/* Hero Section (Light) */}
            <section className="theme-section flex flex-col items-center text-center gap-8" data-theme="light">
              <h1 className="animated-title text-5xl md:text-7xl lg:text-9xl tracking-tighter font-light transition-colors duration-1000"
              >
                Hola, soy <span className="font-semibold text-6xl md:text-8xl lg:text-[140px]">Laura</span>
              </h1>
              <p className="animated-p text-lg md:text-xl text-black/60 dark:text-white/60 max-w-2xl font-light transition-colors duration-1000">
                Creadora de contenido enfocada en estilo de vida, moda y experiencias auténticas. 
                Ayudo a marcas a conectar con su audiencia de forma natural.
              </p>
              <div className="w-full aspect-[21/9] md:aspect-[21/9] bg-gray-100 dark:bg-neutral-900 rounded-3xl mt-8 overflow-hidden relative group transition-colors duration-1000">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black/30 dark:text-white/30 font-medium transition-colors duration-1000">Portada principal (Video / Imagen)</span>
                </div>
              </div>
            </section>

            {/* About Me (Light) */}
            <section id="sobre-mi" className="theme-section grid grid-cols-1 md:grid-cols-2 gap-12 items-center" data-theme="light">
              <div className="aspect-[4/5] bg-gray-100 dark:bg-neutral-900 rounded-3xl relative transition-colors duration-1000">
                 <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black/30 dark:text-white/30 font-medium transition-colors duration-1000">Foto de perfil</span>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <h2 className="animated-title text-3xl md:text-5xl font-light tracking-tight transition-colors duration-1000"
              >
                  Un poco sobre <span className="font-semibold text-4xl md:text-6xl">mí</span>
                </h2>
                <p className="animated-p text-lg text-black/70 dark:text-white/70 leading-relaxed font-light transition-colors duration-1000">
                  Llevo más de 4 años creando contenido digital, buscando siempre la estética perfecta sin perder la esencia real de los momentos. Me apasiona contar historias visuales que inspiren.
                </p>
                <p className="animated-p text-lg text-black/70 dark:text-white/70 leading-relaxed font-light transition-colors duration-1000">
                  Mi comunidad valora la honestidad, el diseño minimalista y las recomendaciones genuinas.
                </p>
              </div>
            </section>

            {/* Reels / Video Content (Dark) */}
            <section id="contenidos" className="theme-section flex flex-col gap-12" data-theme="dark">
              <div className="flex justify-between items-end">
                <h2 className="animated-title text-3xl md:text-5xl font-light tracking-tight transition-colors duration-1000"
              >
                  Contenido en <span className="font-semibold text-4xl md:text-6xl">movimiento</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="aspect-[9/16] bg-gray-100 dark:bg-neutral-900 rounded-2xl relative group cursor-pointer overflow-hidden flex items-center justify-center transition-colors duration-1000">
                    <Play className="w-8 h-8 text-black/20 dark:text-white/20 group-hover:scale-110 transition-transform" />
                    <span className="absolute bottom-6 left-6 text-sm font-medium text-black/40 dark:text-white/40 transition-colors duration-1000">Reel {item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Clients / Brands (Light) */}
            <section id="clientes" className="theme-section flex flex-col gap-16 items-center text-center" data-theme="light">
              <h2 className="animated-title text-3xl md:text-5xl font-light tracking-tight transition-colors duration-1000"
              >
                Marcas que <span className="font-semibold text-4xl md:text-6xl">confían</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 md:gap-16 place-items-center w-full max-w-4xl mx-auto">
                <img src="/collabs/adidas-13.svg" alt="adidas-13" className="h-16 md:h-24 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/chanel-2.svg" alt="chanel-2" className="h-14 md:h-20 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/dji-1.svg" alt="dji-1" className="h-12 md:h-16 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/loreal.svg" alt="loreal" className="h-6 md:h-8 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/la-roche-posay.svg" alt="la-roche-posay" className="h-8 md:h-12 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/samsung-8.svg" alt="samsung-8" className="h-10 md:h-14 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/spotify-logo.svg" alt="spotify-logo" className="h-10 md:h-14 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/vichy-laboratoires.svg" alt="vichy-laboratoires" className="h-16 md:h-24 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/zoah-1.svg" alt="zoah-1" className="h-12 md:h-16 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/zara.svg" alt="zara" className="h-8 md:h-10 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/vogue.svg" alt="vogue" className="h-8 md:h-10 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/versace.svg" alt="versace" className="h-8 md:h-10 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/pull-bear-2.svg" alt="pull-bear-2" className="h-6 md:h-8 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/bershka-1.svg" alt="bershka-1" className="h-8 md:h-10 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
                <img src="/collabs/shein.svg" alt="shein" className="hidden md:block h-6 md:h-10 w-auto object-contain brightness-0 opacity-60 hover:opacity-100 transition-opacity duration-500" />
              </div>
            </section>

            {/* Portfolio Gallery (Light) */}
            <section className="theme-section flex flex-col gap-12" data-theme="light">
               <h2 className="animated-title text-3xl md:text-5xl font-light tracking-tight transition-colors duration-1000"
              >
                  Dirección de <span className="font-semibold text-4xl md:text-6xl">arte</span>
                </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 aspect-[4/3] bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center transition-colors duration-1000">
                  <span className="text-black/30 dark:text-white/30 font-medium transition-colors duration-1000">Fotografía destacada</span>
                </div>
                <div className="aspect-[4/3] md:aspect-auto bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center transition-colors duration-1000">
                  <span className="text-black/30 dark:text-white/30 font-medium transition-colors duration-1000">Detalle</span>
                </div>
                <div className="aspect-square bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center transition-colors duration-1000">
                  <span className="text-black/30 dark:text-white/30 font-medium transition-colors duration-1000">Lifestyle</span>
                </div>
                <div className="aspect-square bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center transition-colors duration-1000">
                  <span className="text-black/30 dark:text-white/30 font-medium transition-colors duration-1000">Producto</span>
                </div>
                <div className="aspect-square bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center transition-colors duration-1000">
                  <span className="text-black/30 dark:text-white/30 font-medium transition-colors duration-1000">Editorial</span>
                </div>
              </div>
            </section>

            {/* Testimonials (Dark) */}
            <section className="theme-section flex flex-col gap-12" data-theme="dark">
              <h2 className="animated-title text-3xl md:text-5xl font-light tracking-tight text-center transition-colors duration-1000"
              >
                Lo que <span className="font-semibold text-4xl md:text-6xl">dicen</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 md:p-12 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl flex flex-col gap-6 transition-colors duration-1000">
                  <p className="animated-p text-lg md:text-xl font-light italic leading-relaxed text-black/80 dark:text-white/80 transition-colors duration-1000">
                    "Laura entendió la visión de nuestra marca desde el primer momento. El contenido que entregó superó nuestras expectativas y conectó de forma increíble."
                  </p>
                  <div>
                    <p className="font-medium transition-colors duration-1000">Directora de Marketing</p>
                    <p className="text-sm text-black/50 dark:text-white/50 transition-colors duration-1000">Marca de Belleza</p>
                  </div>
                </div>
                <div className="p-8 md:p-12 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl flex flex-col gap-6 transition-colors duration-1000">
                  <p className="animated-p text-lg md:text-xl font-light italic leading-relaxed text-black/80 dark:text-white/80 transition-colors duration-1000">
                    "Su estética minimalista era justo lo que necesitábamos. Muy profesional y creativa durante todo el proceso de producción."
                  </p>
                  <div>
                    <p className="font-medium transition-colors duration-1000">Fundador</p>
                    <p className="text-sm text-black/50 dark:text-white/50 transition-colors duration-1000">Startup de Moda</p>
                  </div>
                </div>
              </div>
            </section>

          </main>

          {/* Footer CTA (Dark) */}
          <footer id="contacto" className="theme-section text-black dark:text-white py-32 px-6 md:px-12 mt-32 transition-colors duration-1000" data-theme="dark">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
              <h2 className="animated-title text-5xl md:text-7xl lg:text-8xl tracking-tighter font-light"
              >
                Vamos a <span className="font-semibold text-6xl md:text-8xl lg:text-9xl">colaborar</span>
              </h2>
              <p className="animated-p text-lg md:text-xl opacity-70 font-light max-w-xl">
                ¿Tienes un proyecto en mente o quieres que tu marca destaque con contenido auténtico? Hablemos.
              </p>
              
              <button className="mt-4 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium flex items-center gap-3 hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
                Escribir un correo
              </button>

              <div className="w-full mt-16 mb-4"></div>

              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 opacity-70 text-sm">
                <p>Laura © 2026. Diseño inspirado.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:opacity-100 transition-opacity flex items-center gap-2">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                  <a href="#" className="hover:opacity-100 transition-opacity flex items-center gap-2">
                    <Twitter className="w-4 h-4" /> Twitter
                  </a>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </PortfolioSmoothScroll>
  );
};
