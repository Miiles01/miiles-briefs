import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { portfolioProjects } from "../../data/portfolioProjects";
import LandingNavbar from "../Shared/LandingNavbar";
import LandingFooter from "../Shared/LandingFooter";
import PortfolioSmoothScroll from "./PortfolioSmoothScroll";
import { ArrowLeft } from "lucide-react";

export const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const lang = "es";

  const project = slug ? portfolioProjects[slug] : null;
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!project) {
      navigate("/trabajo", { replace: true });
    }
    window.scrollTo(0, 0);
  }, [project, navigate]);

  if (!project) return null;

  const getPath = (img: string) => `/proyectos/${project.folder}/${img}`;

  return (
    <PortfolioSmoothScroll>
      <div className="min-h-screen bg-white dark:bg-[#08080a] text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <LandingNavbar isLanding={false} />

        <main className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 lg:px-20 container mx-auto">
          {/* Top Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 md:mb-16"
          >
            <Link
              to="/trabajo"
              className="inline-flex items-center gap-2 text-xs font-normal uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar a Portafolio
            </Link>
          </motion.div>

          {/* Project Header */}
          <header className="mb-20 md:mb-32">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-normal tracking-tight leading-tight mb-8 md:mb-12"
            >
              {project.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-16 border-t border-neutral-200/60 dark:border-neutral-800 pt-10"
            >
              {/* Summary / Strategy */}
              <div className="lg:col-span-8">
                <p className="text-xl md:text-2xl font-light text-black/80 dark:text-neutral-300 leading-relaxed max-w-3xl mb-8">
                  {project.description[lang]}
                </p>
                {project.strategy && (
                  <p className="text-base md:text-lg font-light text-black/60 dark:text-neutral-400 leading-relaxed max-w-3xl">
                    {project.strategy[lang]}
                  </p>
                )}
              </div>

              {/* Meta Info */}
              <div className="lg:col-span-4 space-y-8">
                <div>
                  <h4 className="text-[11px] font-normal text-neutral-400 uppercase tracking-widest mb-3">
                    Industria
                  </h4>
                  <p className="text-base font-medium">{project.industry[lang]}</p>
                </div>
                <div>
                  <h4 className="text-[11px] font-normal text-neutral-400 uppercase tracking-widest mb-3">
                    Rol / Servicios
                  </h4>
                  <p className="text-base font-medium text-black/80 dark:text-neutral-300 leading-relaxed">
                    {project.role[lang]}
                  </p>
                </div>
              </div>
            </motion.div>
          </header>

          {/* Images Feed */}
          <section className="flex flex-col gap-8 md:gap-16 items-center">
            {project.images.map((img, idx) => {
              const isLoaded = loadedImages[idx];
              const maxWidth = img.aspect === "wide" ? "max-w-full" : img.aspect === "square" ? "max-w-3xl" : "max-w-2xl";

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full ${maxWidth} bg-neutral-100/50 dark:bg-neutral-900/50 rounded-2xl overflow-hidden`}
                >
                  <img
                    src={getPath(img.src)}
                    alt={img.alt}
                    loading={idx < 2 ? "eager" : "lazy"}
                    onLoad={() => setLoadedImages((prev) => ({ ...prev, [idx]: true }))}
                    className={`w-full h-auto transition-opacity duration-1000 ease-out ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </motion.div>
              );
            })}
          </section>

          {/* Bottom Navigation */}
          <footer className="mt-32 pt-12 border-t border-neutral-200/60 dark:border-neutral-800 flex justify-between items-center">
            <p className="text-sm font-medium text-neutral-500">We Are Miiles</p>
            <Link
              to="/trabajo"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-miiles-blue transition-colors"
            >
              Explorar más proyectos <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </footer>
        </main>
        <LandingFooter />
      </div>
    </PortfolioSmoothScroll>
  );
};

export default ProjectDetail;
