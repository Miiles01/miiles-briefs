import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const PortfolioSmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
};

export default PortfolioSmoothScroll;
