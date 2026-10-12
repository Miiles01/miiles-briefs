import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Palette, Globe, Bot } from "lucide-react";
import LandingNavbar from "../Shared/LandingNavbar";
import LandingFooter from "../Shared/LandingFooter";
import PortfolioSmoothScroll from "../Portfolio/PortfolioSmoothScroll";
import { portfolioProjects } from "../../data/portfolioProjects";
import brand1 from "../../assets/brands/brand1.svg";
import brand2 from "../../assets/brands/brand2.svg";
import brand3 from "../../assets/brands/brand3.svg";
import brand4 from "../../assets/brands/brand4.svg";
import brand5 from "../../assets/brands/brand5.svg";
import brand6 from "../../assets/brands/brand6.svg";

const brandLogos = [brand1, brand2, brand3, brand4, brand5, brand6];

const FEATURED_SLUGS = [
  "naabi-kanabi",
  "tapp-telcel",
  "virreinal-tepeyac",
  "the-decant-society",
  "tulum",
  "tularosa",
];

const SERVICES = [
  {
    icon: Palette,
    title: "Identidad de marca",
    desc: "Construimos el ADN de tu marca: logotipo, sistema visual, empaques, redes sociales y todo lo que necesitas para verte profesional y memorable.",
  },
  {
    icon: Globe,
    title: "Sitios web y e-commerce",
    desc: "Diseñamos y desarrollamos páginas web, tiendas en línea y experiencias digitales pensadas para convertir visitas en clientes.",
  },
  {
    icon: Bot,
    title: "Agentes y embudos con IA",
    desc: "Automatizamos la atención y la venta con agentes de inteligencia artificial y embudos comerciales que trabajan por ti las 24 horas.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: Math.min(i * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const welth = { fontFamily: "'Welth Catritz', serif", fontStyle: "italic" as const, paddingRight: "0.08em" };

export const HomePage = () => {
  const featured = FEATURED_SLUGS.map((slug) => portfolioProjects[slug]).filter(Boolean);

  return (
    <PortfolioSmoothScroll>
      <div className="min-h-screen bg-white text-black font-sans flex flex-col selection:bg-black selection:text-white">
        <LandingNavbar isLanding />

        <main className="flex-1">
          {/* Hero */}
          <section className="relative min-h-[85vh] md:min-h-screen flex flex-col items-center justify-center text-center px-6 pt-40 pb-16 md:pb-24 overflow-hidden">
            {/* Fondo punteado */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background:
                  "radial-gradient(circle at center, #FFFFFF 0%, rgba(140, 134, 162, 0.15) 59%, #FFFFFF 100%)",
                maskImage: "radial-gradient(circle, black 1px, transparent 1.5px)",
                WebkitMaskImage: "radial-gradient(circle, black 1px, transparent 1.5px)",
                maskSize: "16px 16px",
                WebkitMaskSize: "16px 16px",
              }}
            />

            <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-[44px] leading-[1.08] sm:text-6xl md:text-7xl lg:text-[84px] font-normal tracking-[-0.035em] text-black max-w-5xl [text-wrap:balance]"
              >
                Marcas, webs y agentes que hacen crecer tu <span style={welth}>negocio</span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1}
                className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl font-light text-black/70 leading-relaxed max-w-2xl [text-wrap:balance]"
              >
                En Miiles diseñamos identidad, desarrollamos sitios web y construimos agentes con
                inteligencia artificial para marcas que buscan autenticidad y escalabilidad.
              </motion.p>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mt-10 md:mt-12">
                <Link
                  to="/trabajo"
                  className="group inline-flex items-center gap-2 rounded-full bg-black text-white px-8 py-4 text-sm font-normal hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300"
                >
                  Ver portafolio
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>

              {/* Elegido por */}
              <div className="w-full pt-14 md:pt-20 pb-6">
                <p className="text-center text-xs font-light text-black/60 mb-8 tracking-widest">Elegido por</p>
                <div className="px-[10%] md:px-[20%]">
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                      WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                    }}
                  >
                    <div className="flex w-max animate-marquee gap-20 items-center">
                      {[...brandLogos, ...brandLogos].map((logo, i) => (
                        <img key={i} src={logo} alt="" className="h-6 md:h-7 w-auto shrink-0" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Casos de éxito */}
          <section className="px-6 md:px-12 lg:px-20 container mx-auto py-20 md:py-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="max-w-3xl mb-12 md:mb-20"
            >
              <h2 className="text-5xl md:text-7xl font-normal tracking-tight leading-[1.05] text-black [text-wrap:balance]">
                Nuestros <span style={welth}>casos</span> de éxito
              </h2>
              <p className="mt-5 text-lg md:text-xl font-light text-black/70 max-w-2xl">
                Proyectos reales de marcas que confiaron en nosotros para crecer, desde su identidad hasta su
                presencia digital.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-14 md:gap-y-20">
              {featured.map((project, i) => (
                <motion.div
                  key={project.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={i % 2}
                >
                  <Link to={`/trabajo/${project.slug}`} className="group block">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-neutral-100/60">
                      <img
                        src={`/proyectos/${project.folder}/${project.previewImages[0]}`}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="mt-6 px-2 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight text-black">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-base md:text-lg font-light text-black/70 leading-relaxed max-w-md">
                          {project.subtitle.es}
                        </p>
                      </div>
                      <ArrowUpRight className="w-6 h-6 mt-2 shrink-0 text-neutral-400 transition-all duration-300 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 md:mt-24 flex justify-center">
              <Link
                to="/trabajo"
                className="group inline-flex items-center gap-2 rounded-full bg-black text-white px-8 py-4 text-sm font-normal hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300"
              >
                Ver todos los proyectos
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </section>

          {/* Qué hacemos */}
          <section className="px-6 md:px-12 lg:px-20 container mx-auto py-20 md:py-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="max-w-3xl mb-12 md:mb-16"
            >
              <h2 className="text-5xl md:text-7xl font-normal tracking-tight leading-[1.05] text-black [text-wrap:balance]">
                Lo que <span style={welth}>hacemos</span> por tu marca
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map(({ icon: Icon, title, desc }, i) => (
                <motion.article
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-[2.5rem] bg-[#F5F5F8] p-8 md:p-10 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-8 text-2xl md:text-3xl font-normal tracking-tight leading-tight text-black">
                    {title}
                  </h3>
                  <p className="mt-4 text-[15px] font-light leading-relaxed text-black/70">{desc}</p>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Cierre */}
          <section className="px-6 md:px-12 lg:px-20 container mx-auto pt-12 md:pt-20 pb-24 md:pb-36 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
              <h2 className="text-5xl md:text-7xl lg:text-[7.5vw] font-normal tracking-tight leading-[1.05] text-black [text-wrap:balance]">
                Conoce todo nuestro <span style={welth}>trabajo</span>
              </h2>
              <div className="mt-10 flex justify-center">
                <Link
                  to="/trabajo"
                  className="group inline-flex items-center gap-2 rounded-full bg-black text-white px-8 py-4 text-sm font-normal hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300"
                >
                  Ver portafolio
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          </section>
        </main>

        <LandingFooter />
      </div>
    </PortfolioSmoothScroll>
  );
};

export default HomePage;
