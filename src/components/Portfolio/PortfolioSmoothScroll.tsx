import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

/**
 * PortfolioSmoothScroll
 * Envuelve /trabajo y /trabajo/:slug con Lenis smooth scroll.
 * Se destruye y re-inicializa en cada cambio de ruta para
 * garantizar que el scroll vuelve al top correctamente.
 */
export const PortfolioSmoothScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Respetar preferencia de accesibilidad del usuario
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      window.scrollTo(0, 0);
      return;
    }

    // Destruir instancia anterior si existe
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Scroll al top instantáneo antes de inicializar Lenis
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Pequeño delay para que React pinte el nuevo contenido primero
    const initTimer = setTimeout(() => {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 1.8,
        infinite: false,
      });

      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);
    }, 80);

    return () => {
      clearTimeout(initTimer);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [pathname]);

  return <>{children}</>;
};

export default PortfolioSmoothScroll;
