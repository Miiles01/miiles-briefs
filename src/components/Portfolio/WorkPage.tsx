import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PortfolioNavbar from "./PortfolioNavbar";
import FloatingProjectInfo from "./FloatingProjectInfo";
import MobileProjectHint from "./MobileProjectHint";
import PortfolioSmoothScroll from "./PortfolioSmoothScroll";
import { portfolioProjects, PortfolioProject, Participation } from "../../data/portfolioProjects";
import { ArrowUpRight } from "lucide-react";

/* ── Smooth image with load fade ── */
const FadeImage = ({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onLoad={() => setLoaded(true)}
      className={`${className || ""} transition-opacity duration-1000 ease-out ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

const ProjectSection = ({
  project,
  slug,
  lang,
  onHover,
}: {
  project: PortfolioProject;
  slug: string;
  lang: "es" | "en";
  onHover: (participation: Participation[] | null) => void;
}) => {
  const getPath = (img: string) => `/proyectos/${project.folder}/${img}`;
  const cover = project.previewImages[0];
  const secondary = [project.previewImages[1], project.previewImages[2]];

  return (
    <div
      className="mb-28 md:mb-40 group"
      onMouseEnter={() => onHover(project.participation || [])}
      onMouseLeave={() => onHover(null)}
    >
      {/* Main Cover */}
      <Link to={`/trabajo/${slug}`} className="block w-full mb-6 md:mb-8 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-neutral-100/60 dark:bg-neutral-800/60 transition-all">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="aspect-[16/9] w-full overflow-hidden"
        >
          <FadeImage
            src={getPath(cover)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </motion.div>
      </Link>

      {/* Secondary Images & Gallery Preview */}
      {secondary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          {secondary.map((img, idx) => (
            <Link
              key={idx}
              to={`/trabajo/${slug}`}
              className="block overflow-hidden rounded-[2rem] bg-neutral-100/60 dark:bg-neutral-800/60 transition-all"
            >
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, delay: 0.1 * (idx + 1), ease: [0.22, 1, 0.36, 1] }}
                className="aspect-[4/5] overflow-hidden"
              >
                <FadeImage
                  src={getPath(img)}
                  alt={`${project.title} preview ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                />
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {/* Project Meta Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-2 md:px-4 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div className="max-w-2xl">
          <Link to={`/trabajo/${slug}`} className="inline-flex items-center gap-2 group/title">
            <h3 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight text-black dark:text-white transition-colors group-hover/title:text-miiles-blue">
              {project.title}
            </h3>
            <ArrowUpRight className="w-6 h-6 text-neutral-400 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-1 group-hover/title:-translate-y-1 transition-all" />
          </Link>
          <p className="text-base md:text-lg font-light text-black/70 dark:text-neutral-400 mt-2 leading-relaxed tracking-normal">
            {project.subtitle[lang]}
          </p>
        </div>

        <Link
          to={`/trabajo/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-normal uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors pt-2 md:pt-0"
        >
          {lang === "es" ? "Ver proyecto completo" : "View full project"} &rarr;
        </Link>
      </motion.div>
    </div>
  );
};

export const WorkPage = () => {
  const lang = "es";
  const [hoveredParticipation, setHoveredParticipation] = useState<Participation[] | null>(null);

  const projectsList = Object.values(portfolioProjects);

  return (
    <PortfolioSmoothScroll>
      <div className="min-h-screen bg-white dark:bg-[#08080a] text-black dark:text-white font-sans flex flex-col selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <FloatingProjectInfo
          participation={hoveredParticipation || []}
          isVisible={hoveredParticipation !== null}
        />

        <MobileProjectHint />

        <PortfolioNavbar />

        <main className="flex-1 px-6 md:px-12 lg:px-20 container mx-auto pt-36 md:pt-48 pb-20">
          {/* Header Section */}
          <section className="mb-20 md:mb-32">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight max-w-3xl mb-6 text-black dark:text-white leading-relaxed"
            >
              Diseñamos experiencias que escalan. Desde la identidad visual hasta la automatización con IA, este es el resultado de transformar visión en valor.
            </motion.p>
          </section>

          {/* Projects Feed */}
          <section className="max-w-7xl mx-auto">
            {projectsList.map((project) => (
              <ProjectSection
                key={project.slug}
                project={project}
                slug={project.slug}
                lang={lang}
                onHover={setHoveredParticipation}
              />
            ))}
          </section>
        </main>
      </div>
    </PortfolioSmoothScroll>
  );
};

export default WorkPage;
