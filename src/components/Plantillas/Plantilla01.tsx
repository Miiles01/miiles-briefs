import React, { useEffect, useState } from 'react';
import { Menu, Instagram, Twitter, Mail, Play, X } from 'lucide-react';
import { PortfolioSmoothScroll } from '../Portfolio/PortfolioSmoothScroll';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

export const Plantilla01: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);





  // Finite Image Zoom GSAP Logic (mwg_effect050)
  useEffect(() => {
    let ctx = gsap.context(() => {
        const zoomLayers = document.querySelectorAll('.mwg_effect050 .zoom-layer');
        const container = document.querySelector('.mwg_effect050');
        
        if (zoomLayers.length > 0 && container) {
            ScrollTrigger.create({
                trigger: container,
                start: 'top top',
                end: '+=400%', // 4 images to zoom through (total 5 images)
                pin: true,
                animation: gsap.to(zoomLayers, {
                    scale: 1,
                    ease: 'power1.in', // Smooth steady zoom that accelerates slightly at the end
                    stagger: 1
                }),
                scrub: true
            });
        }
    });
    return () => ctx.revert();
  }, []);

  // Rotating Circle Gallery GSAP Logic (mwg_effect007)
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (window.innerWidth >= 768) {
        const pinHeight = document.querySelector('.mwg_effect007 .pin-height');
        const container = document.querySelector('.mwg_effect007 .container-pin');
        const circles = document.querySelectorAll('.mwg_effect007 .circle');
        
        if (pinHeight && container && circles.length) {
          ScrollTrigger.create({
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container
          });

          gsap.fromTo(circles, {
            rotation: (i) => {
              if (i === 0) return 0;   // First image already centered
              if (i === 1) return 18;  // Second image peeking from the right
              return 30;               // Rest hidden further right
            }
          }, {
            rotation: -30,
            ease: 'power2.inOut',
            stagger: 0.08,             // Slightly increased stagger for better pacing
            scrollTrigger: {
              trigger: pinHeight,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true
            }
          });
        }
      }
    });
    return () => ctx.revert();
  }, []);

  // Pinned Mask Gallery GSAP Logic
  useEffect(() => {
    const pinHeight = document.querySelector('.mwg_effect037 .pin-height');
    if (!pinHeight) return;
    
    const container = document.querySelector('.mwg_effect037 .container-pin');
    const medias = document.querySelectorAll('.mwg_effect037 .hidden-mask');
    const mediasChild = document.querySelectorAll('.mwg_effect037 .media-img');

    const distancePerImage = (pinHeight.clientHeight - window.innerHeight) / medias.length;

    let ctx = gsap.context(() => {
        ScrollTrigger.create({
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: container
        });

        gsap.to(medias, {
            maskImage: 'linear-gradient(transparent -25%, #000 0%, #000 100%)',
            webkitMaskImage: 'linear-gradient(transparent -25%, #000 0%, #000 100%)',
            stagger: 0.5,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
        
        gsap.to(mediasChild, {
            y: -30,
            stagger: 0.5,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
        
        gsap.to(mediasChild, {
            y: -60,
            stagger: 0.5,
            immediateRender: false,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top-=' + distancePerImage,
                end: 'bottom bottom-=' + distancePerImage,
                scrub: true
            }
        });
    });

    return () => ctx.revert();
  }, []);


  // Rolling Letters Title GSAP Logic (mwg_effect027)
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (window.innerWidth >= 768) {
        // Desktop: Rolling letters, play once
        gsap.to('.letter-effect', {
          yPercent: 100,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mwg_effect027',
            start: 'top 85%',
            once: true // Trigger only once, no scrub
          },
          stagger: {
            each: 0.03,
            from: 'random'
          }
        });
      } else {
        // Mobile: Simple fade up (disable rolling letters)
        gsap.from('.mwg_effect027 li', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mwg_effect027',
            start: 'top 85%',
            once: true
          }
        });
      }
    });
    return () => ctx.revert();
  }, []);

  // Accordion GSAP Logic
  useEffect(() => {
    const root = document.querySelector('.mwg_effect109')
    if (!root) return
    const container = root.querySelector('.container-slides')
    const slides = [...container.querySelectorAll('.slide')]

    const contents = slides.map(item => item.querySelector('.content-slide'))
    const smallTitles = slides.map(item => item.querySelector('.small-title'))
    const bottoms = slides.map(item => item.querySelector('.bottom-slide'))

    // Responsive widths
    const containerWidth = container.clientWidth || window.innerWidth
    let widthClosed = window.innerWidth < 768 ? 60 : 88
    let widthOpen = containerWidth - (widthClosed * (slides.length - 1)) - (6 * (slides.length - 1))
    if (widthOpen > 736) widthOpen = 736
    
    let borderRadiusClosed = window.innerWidth < 768 ? 30 : 44
    let heightClosed = window.innerWidth < 768 ? 340 : 400
    let heightHover = window.innerWidth < 768 ? 360 : 420
    let slideHeight = window.innerWidth < 768 ? 420 : 506
    
    let smallTitleXOpen = window.innerWidth < 768 ? 40 : 60
    let contentXLeft = -720
    let contentXRight = 70
    let axis = 'x'

    let lastIndexEntered = 0
    slides[0].classList.add('on')

    gsap.set(slides[0], { flex: '0 0 ' + widthOpen + 'px', borderRadius: 20, height: slideHeight })
    gsap.set(slides.slice(1), { borderRadius: borderRadiusClosed, height: heightClosed })
    gsap.set(smallTitles[0], { [axis]: smallTitleXOpen })
    gsap.set(smallTitles.slice(1), { width: heightClosed })
    gsap.set(contents.slice(1), { [axis]: contentXLeft })
    gsap.set(bottoms.slice(1), { autoAlpha: 0 })

    function handleMouseEnter(item, index) {
        if (item.classList.contains('on')) return
        gsap.to(item, { height: heightHover, duration: 0.3, ease: 'back.out(2)' })
        gsap.to(smallTitles[index], { width: heightHover, duration: 0.3, ease: 'back.out(2)' })
    }

    function handleMouseLeave(item, index) {
        if (item.classList.contains('on')) return
        gsap.to(item, { height: heightClosed, duration: 0.3, ease: 'back.out(2)' })
        gsap.to(smallTitles[index], { width: heightClosed, duration: 0.3, ease: 'back.out(2)' })
    }

    function handleMouseClick(item, index) {
        const isBefore = index < lastIndexEntered

        if (index !== lastIndexEntered) {
            slides.forEach(slide => slide.classList.remove('on'))
            gsap.to(slides, {
                flex: '0 0 ' + widthClosed + 'px',
                height: heightClosed,
                borderRadius: borderRadiusClosed,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(contents[lastIndexEntered], {
                [axis]: isBefore ? contentXLeft : contentXRight,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(smallTitles, {
                [axis]: 0,
                width: heightClosed,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(bottoms, {
                autoAlpha: 0,
                duration: 0.4,
                ease: 'power1.inOut',
            })

            item.classList.add('on')
            gsap.to(item, {
                flex: '0 0 ' + widthOpen + 'px',
                borderRadius: 20,
                height: slideHeight,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.fromTo(contents[index], {
                [axis]: isBefore ? contentXRight : contentXLeft,
            }, {
                [axis]: 0,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(smallTitles[index], {
                [axis]: isBefore ? -704 : smallTitleXOpen,
                width: slideHeight,
                duration: 0.5,
                ease: 'back.inOut(0.9)',
            })
            gsap.to(bottoms[index], {
                autoAlpha: 1,
                duration: 0.4,
                ease: 'power1.inOut',
            })
        }
        lastIndexEntered = index
    }

    const enterListeners = []
    const leaveListeners = []
    const clickListeners = []

    slides.forEach((item, index) => {
        const enter = () => handleMouseEnter(item, index)
        const leave = () => handleMouseLeave(item, index)
        const click = () => handleMouseClick(item, index)
        item.addEventListener('mouseenter', enter)
        item.addEventListener('mouseleave', leave)
        item.addEventListener('click', click)
        enterListeners.push(enter)
        leaveListeners.push(leave)
        clickListeners.push(click)
    })

    return () => {
        slides.forEach((item, index) => {
            item.removeEventListener('mouseenter', enterListeners[index])
            item.removeEventListener('mouseleave', leaveListeners[index])
            item.removeEventListener('click', clickListeners[index])
        })
    }
  }, []);

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
                <div className="mt-4 pt-2 flex flex-col gap-6">
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

                      {/* Hero GSAP Effect 050 (Finite Scroll Zoom) */}
            <section className="theme-section mwg_effect050 w-full relative" data-theme="light">
                <style>{`
                  .mwg_effect050 {
                      width: 100vw;
                      position: relative;
                      height: 100vh;
                      background: #000;
                  }
                  .mwg_effect050 .container-zoom {
                      position: relative;
                      z-index: 1;
                      height: 100%;
                      width: 100%;
                      display: block;
                      overflow: hidden;
                  }
                  .mwg_effect050 .real-image {
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      will-change: transform;
                      transform-origin: center center;
                  }
                `}</style>
                
                <div className="container-zoom">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80" className="real-image" style={{zIndex: 1, transform: 'scale(1)'}} alt="Hero 1" />
                    <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80" className="real-image zoom-layer" style={{zIndex: 2, transform: 'scale(0)'}} alt="Hero 2" />
                    <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&q=80" className="real-image zoom-layer" style={{zIndex: 3, transform: 'scale(0)'}} alt="Hero 3" />
                    <img src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=1600&q=80" className="real-image zoom-layer" style={{zIndex: 4, transform: 'scale(0)'}} alt="Hero 4" />
                    <img src="https://images.unsplash.com/photo-1534126511673-b6899657816a?w=1600&q=80" className="real-image zoom-layer" style={{zIndex: 5, transform: 'scale(0)'}} alt="Hero 5" />
                </div>
            </section>

          <main className="px-6 md:px-12 lg:px-24 pt-32 pb-24 max-w-7xl mx-auto flex flex-col gap-48 md:gap-64">
            
            

            {/* About Me Accordion (Light) */}
            <section id="sobre-mi" className="theme-section flex flex-col gap-8 w-full" data-theme="light">
              <div className="mwg_effect027 flex flex-col items-center md:items-start mb-8 md:mb-16 w-full">
                <ul className="flex flex-col items-center md:items-start">
                  {["Soy Laura,", "creadora de", "historias."].map((line, lineIdx) => (
                    <li key={lineIdx} className="flex overflow-hidden text-5xl sm:text-6xl md:text-[90px] lg:text-[130px] font-semibold tracking-tighter leading-[0.85]">
                      {line.split('').map((char, charIdx) => (
                        char === ' ' ? 
                        <span key={charIdx} className="w-[0.25em]" /> :
                        <span key={charIdx} className="letter-effect relative inline-block text-black dark:text-white transition-colors duration-1000">
                          <span>{char}</span>
                          <span className="absolute bottom-full left-0">{char}</span>
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
              
              <style>{`
                .mwg_effect109 .container-slides {
                    height: 506px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    width: 100%;
                    max-width: 100%;
                }
                .mwg_effect109 .slide {
                    position: relative;
                    flex: 0 0 88px;
                    height: 506px;
                    overflow: hidden;
                    background-color: #f3f4f6;
                }
                :global(.dark) .mwg_effect109 .slide {
                    background-color: #171717;
                }
                .mwg_effect109 .slide:not(.on) {
                    cursor: pointer;
                }
                .mwg_effect109 .content-slide {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 2rem;
                    width: 100%;
                }
                .mwg_effect109 .small-title {
                    width: 506px;
                    position: absolute;
                    bottom: 0;
                    left: 100%;
                    transform: rotate(-90deg);
                    transform-origin: 0 100%;
                    padding-left: 2rem;
                    padding-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                }
              `}</style>
              
              <div className="mwg_effect109 w-full">
                <div className="container-slides">
                  {[
                    {
                      title: "Trayectoria",
                      smallTitle: "Trayectoria",
                      text: "Comencé mi carrera digital hace más de 4 años, enfocándome en el estilo de vida y la moda. He colaborado con marcas globales, construyendo una voz única y sólida.",
                      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80"
                    },
                    {
                      title: "Marcas Top",
                      smallTitle: "Marcas",
                      text: "A lo largo de los años he trabajado con firmas como Chanel, Vogue, Adidas y L'Oréal, creando contenido visual y narrativas de alto impacto para sus campañas.",
                      img: "https://images.unsplash.com/photo-1529139574466-a303027c028c?w=800&q=80"
                    },
                    {
                      title: "Estética Visual",
                      smallTitle: "Estética",
                      text: "Mi enfoque se basa en el minimalismo y la autenticidad. Cada pieza está diseñada para transmitir elegancia pura, cuidando la luz y la composición fotográfica.",
                      img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"
                    },
                    {
                      title: "La Comunidad",
                      smallTitle: "Comunidad",
                      text: "Más allá de las marcas, conecto con personas reales. Fomento un espacio donde la moda es accesible y el estilo de vida se comparte desde una perspectiva humana.",
                      img: "https://images.unsplash.com/photo-1512413914564-9273641777b7?w=800&q=80"
                    }
                  ].map((s, i) => (
                    <div key={i} className={`slide rounded-2xl ${i === 0 ? 'on' : ''}`}>
                      <div className="content-slide">
                        <p className="text-3xl md:text-4xl font-light">{s.title}</p>
                        <div className="bottom-slide mt-auto">
                          <img className="w-full h-40 md:h-56 object-cover rounded-xl mb-6" src={s.img} alt={s.title} />
                          <p className="text-sm md:text-base text-black/70 dark:text-white/70">{s.text}</p>
                        </div>
                      </div>
                      <div className="small-title">
                        <p className="text-lg tracking-widest font-medium opacity-50 whitespace-nowrap">{s.smallTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Reels / Video Content GSAP (Dark) */}
            <section id="contenidos" className="theme-section w-full mb-12 md:mb-0" data-theme="dark">
              
              <style>{`
                  .no-scrollbar::-webkit-scrollbar {
                      display: none;
                  }
                  .no-scrollbar {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                  }
                  .mwg_effect007 .pin-height {
                      height: 400vh;
                      width: 100%;
                  }
                  .mwg_effect007 .container-pin {
                      position: relative;
                      height: 100vh;
                      width: 100vw;
                      left: 50%;
                      right: 50%;
                      margin-left: -50vw;
                      margin-right: -50vw;
                      overflow: hidden;
                  }
                  .mwg_effect007 .circle {
                      width: 300%;
                      aspect-ratio: 1;
                      position: absolute;
                      top: 50%;
                      left: -100%;
                      pointer-events: none;
                  }
                  .mwg_effect007 .media {
                      width: 25vw;
                      max-width: 400px;
                      aspect-ratio: 0.5625;
                      border-radius: 1.5rem;
                      object-fit: cover;
                      position: absolute;
                      top: 0;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      pointer-events: auto;
                  }
              `}</style>
              
              {/* Unified Section Title */}
              <div className="w-full text-center pb-12 md:pb-16 pt-8 md:pt-16">
                  <h2 className="animated-title text-4xl md:text-6xl lg:text-7xl font-light tracking-tight transition-colors duration-1000">
                      Contenido en<br />
                      <span className="font-semibold text-5xl md:text-7xl lg:text-8xl mt-1 md:mt-2 block">movimiento</span>
                  </h2>
              </div>
              
              {/* Reels GSAP (Desktop) */}
              <div className="hidden md:block w-full mwg_effect007 relative">
                  <div className="pin-height">
                      <div className="container-pin">
                          
                          {[
                            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
                            "https://images.unsplash.com/photo-1529139574466-a303027c028c?w=600&q=80",
                            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
                            "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&q=80",
                            "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=600&q=80",
                            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                          ].map((src, i) => (
                              <div key={i} className="circle">
                                  <img className="media" src={src} alt={`Reel ${i + 1}`} />
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Reels Carousel (Mobile) */}
              <div className="block md:hidden w-full flex flex-col gap-8">
                  
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 w-screen -mx-6 px-6 no-scrollbar">
                      {[
                        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
                        "https://images.unsplash.com/photo-1529139574466-a303027c028c?w=600&q=80",
                        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
                        "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&q=80",
                        "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=600&q=80",
                        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                      ].map((src, i) => (
                          <div key={i} className="snap-center shrink-0 w-[75vw] aspect-[9/16] relative rounded-2xl overflow-hidden bg-neutral-900 transition-colors duration-1000">
                              <img className="w-full h-full object-cover opacity-80" src={src} alt={`Reel ${i + 1}`} />
                              <Play className="w-12 h-12 text-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          </div>
                      ))}
                  </div>
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

            {/* Portfolio Gallery GSAP (Light) */}
            <section className="theme-section mwg_effect037 w-full -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24 relative" data-theme="light">
              <style>{`
                  .mwg_effect037 .pin-height {
                      height: 500vh;
                      width: 100%;
                  }
                  .mwg_effect037 .container-pin {
                      width: 100%;
                      height: 100vh;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      position: relative;
                  }
                  
                  .mwg_effect037 .text-side {
                      font-weight: 300;
                      font-size: clamp(1.5rem, 3.5vw, 3.5rem);
                      letter-spacing: -0.05em;
                      line-height: 1.1;
                      z-index: 10;
                      position: absolute;
                      top: 50%;
                      transform: translateY(-50%);
                      width: 30%;
                  }
                  .mwg_effect037 .text-side.text-left {
                      left: 0;
                  }
                  .mwg_effect037 .text-side.text-right {
                      right: 0;
                  }
                  
                  .mwg_effect037 .images-stack {
                      width: 80vw;
                      max-width: 320px;
                      aspect-ratio: 0.75;
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      z-index: 1;
                  }
                  
                  @media (min-width: 768px) {
                      .mwg_effect037 .images-stack {
                          width: 35vw;
                          max-width: 380px; /* Reduced from 480px to prevent text collision */
                      }
                  }
                  
                  .mwg_effect037 .hidden-mask {
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      top: 0;
                      left: 0;
                      overflow: hidden;
                      border-radius: 1.5rem;
                      -webkit-mask-image: linear-gradient(transparent 100%, #000 125%, #000 225%);
                      mask-image: linear-gradient(transparent 100%, #000 125%, #000 225%);
                  }
                  
                  .mwg_effect037 .media-img {
                      width: 100%;
                      height: calc(100% + 60px);
                      object-fit: cover;
                      will-change: transform;
                  }
              `}</style>
              
              <div className="pin-height">
                  <div className="container-pin">
                      <p className="text-side text-left">Dirección<br/><span className="font-semibold">Creativa</span></p>
                      
                      <div className="images-stack">
                          <div className="hidden-mask"><img className="media-img" src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" alt="Galeria 1" /></div>
                          <div className="hidden-mask"><img className="media-img" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="Galeria 2" /></div>
                          <div className="hidden-mask"><img className="media-img" src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80" alt="Galeria 3" /></div>
                          <div className="hidden-mask"><img className="media-img" src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&q=80" alt="Galeria 4" /></div>
                          <div className="hidden-mask"><img className="media-img" src="https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&q=80" alt="Galeria 5" /></div>
                      </div>
                      
                      <p className="text-side text-right">Colección<br/><span className="font-semibold">24-25</span></p>
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
