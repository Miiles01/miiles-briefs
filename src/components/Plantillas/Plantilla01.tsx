import React from 'react';
import { Menu, Instagram, Twitter, Mail, Play } from 'lucide-react';
import { PortfolioSmoothScroll } from '../Portfolio/PortfolioSmoothScroll';

export const Plantilla01: React.FC = () => {
  return (
    <PortfolioSmoothScroll>
      <div className="min-h-screen bg-white dark:bg-[#08080a] text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto mix-blend-difference text-white">
          <span className="text-xl font-medium tracking-tight ">Laura.</span>
        </div>
        <button className="pointer-events-auto w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md flex items-center justify-center hover:scale-105 transition-transform mix-blend-difference text-white">
          <Menu className="w-5 h-5" />
        </button>
      </nav>

      <main className="px-6 md:px-12 lg:px-24 pt-32 pb-24 max-w-7xl mx-auto flex flex-col gap-32">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-8">
          <h1 className="text-5xl md:text-7xl lg:text-9xl tracking-tighter font-light">
            Hola, soy <span className="font-welth text-6xl md:text-8xl lg:text-[140px]">Laura</span>
          </h1>
          <p className="text-lg md:text-xl text-black/60 dark:text-white/60 max-w-2xl font-light">
            Creadora de contenido enfocada en estilo de vida, moda y experiencias auténticas. 
            Ayudo a marcas a conectar con su audiencia de forma natural.
          </p>
          <div className="w-full aspect-[21/9] md:aspect-[21/9] bg-gray-100 dark:bg-neutral-900 rounded-3xl mt-8 overflow-hidden relative group">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-black/30 dark:text-white/30 font-medium">Portada principal (Video / Imagen)</span>
            </div>
          </div>
        </section>

        {/* About Me */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] bg-gray-100 dark:bg-neutral-900 rounded-3xl relative">
             <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-black/30 dark:text-white/30 font-medium">Foto de perfil</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight">
              Un poco sobre <span className="font-welth text-4xl md:text-6xl">mí</span>
            </h2>
            <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed font-light">
              Llevo más de 4 años creando contenido digital, buscando siempre la estética perfecta sin perder la esencia real de los momentos. Me apasiona contar historias visuales que inspiren.
            </p>
            <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed font-light">
              Mi comunidad valora la honestidad, el diseño minimalista y las recomendaciones genuinas.
            </p>
          </div>
        </section>

        {/* Reels / Video Content */}
        <section className="flex flex-col gap-12">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight">
              Contenido en <span className="font-welth text-4xl md:text-6xl">movimiento</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-[9/16] bg-gray-100 dark:bg-neutral-900 rounded-2xl relative group cursor-pointer overflow-hidden flex items-center justify-center">
                <Play className="w-8 h-8 text-black/20 dark:text-white/20 group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-6 left-6 text-sm font-medium text-black/40 dark:text-white/40">Reel {item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Clients / Brands */}
        <section className="flex flex-col gap-12 items-center text-center">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            Marcas que <span className="font-welth text-4xl md:text-6xl">confían</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="w-24 h-12 bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium">Marca {item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section className="flex flex-col gap-12">
           <h2 className="text-3xl md:text-5xl font-light tracking-tight">
              Dirección de <span className="font-welth text-4xl md:text-6xl">arte</span>
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 aspect-[4/3] bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center">
              <span className="text-black/30 dark:text-white/30 font-medium">Fotografía destacada</span>
            </div>
            <div className="aspect-[4/3] md:aspect-auto bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center">
              <span className="text-black/30 dark:text-white/30 font-medium">Detalle</span>
            </div>
            <div className="aspect-square bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center">
              <span className="text-black/30 dark:text-white/30 font-medium">Lifestyle</span>
            </div>
            <div className="aspect-square bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center">
              <span className="text-black/30 dark:text-white/30 font-medium">Producto</span>
            </div>
            <div className="aspect-square bg-gray-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center">
              <span className="text-black/30 dark:text-white/30 font-medium">Editorial</span>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="flex flex-col gap-12">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-center">
            Lo que <span className="font-welth text-4xl md:text-6xl">dicen</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 md:p-12 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl flex flex-col gap-6">
              <p className="text-lg md:text-xl font-light italic leading-relaxed text-black/80 dark:text-white/80">
                "Laura entendió la visión de nuestra marca desde el primer momento. El contenido que entregó superó nuestras expectativas y conectó de forma increíble."
              </p>
              <div>
                <p className="font-medium">Directora de Marketing</p>
                <p className="text-sm text-black/50 dark:text-white/50">Marca de Belleza</p>
              </div>
            </div>
            <div className="p-8 md:p-12 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl flex flex-col gap-6">
              <p className="text-lg md:text-xl font-light italic leading-relaxed text-black/80 dark:text-white/80">
                "Su estética minimalista era justo lo que necesitábamos. Muy profesional y creativa durante todo el proceso de producción."
              </p>
              <div>
                <p className="font-medium">Fundador</p>
                <p className="text-sm text-black/50 dark:text-white/50">Startup de Moda</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer CTA */}
      <footer className="bg-black text-white dark:bg-white dark:text-black py-24 px-6 md:px-12 mt-12 rounded-t-[3rem]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl tracking-tighter font-light">
            Vamos a <span className="font-welth text-6xl md:text-8xl lg:text-9xl">colaborar</span>
          </h2>
          <p className="text-lg md:text-xl opacity-70 font-light max-w-xl">
            ¿Tienes un proyecto en mente o quieres que tu marca destaque con contenido auténtico? Hablemos.
          </p>
          
          <button className="mt-4 px-8 py-4 bg-white text-black dark:bg-black dark:text-white rounded-full font-medium flex items-center gap-3 hover:scale-105 transition-transform">
            <Mail className="w-5 h-5" />
            Escribir un correo
          </button>

          {/* Spacer using margin to replace dividers */}
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
    </PortfolioSmoothScroll>
  );
};
