import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { Participation } from "../../data/portfolioProjects";
import { Eye, BarChart2, Star } from "lucide-react";

const ICONS = {
  eye: Eye,
  bar: BarChart2,
  star: Star,
};

interface FloatingProjectInfoProps {
  participation: Participation[] | undefined;
  isVisible: boolean;
}

export const FloatingProjectInfo = ({ participation, isVisible }: FloatingProjectInfoProps) => {
  const lang = "es";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hasMoved, setHasMoved] = useState(false);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX + 20); // offset from cursor
      mouseY.set(e.clientY + 20);
      if (!hasMoved) setHasMoved(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, hasMoved]);

  const [displayData, setDisplayData] = useState(participation);

  useEffect(() => {
    if (participation && participation.length > 0) {
      setDisplayData(participation);
    }
  }, [participation]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x,
        y,
        pointerEvents: "none",
        zIndex: 100,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isVisible && hasMoved ? 1 : 0,
        scale: isVisible && hasMoved ? 1 : 0.8,
      }}
      transition={{ duration: 0.2 }}
      className="hidden md:block font-sans"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-neutral-200/80 min-w-[280px]">
        <h4 className="text-[11px] font-normal text-neutral-400 uppercase tracking-widest mb-4">
          Nuestra participación
        </h4>
        <div className="space-y-3.5">
          {displayData?.map((item, idx) => {
            const IconComponent = ICONS[item.icon as keyof typeof ICONS] || Star;
            return (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-100/80 p-1 shrink-0">
                  <IconComponent className="w-4 h-4 text-neutral-600" />
                </div>
                <span className="text-[13.5px] font-normal tracking-normal text-black">
                  {item.text[lang]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingProjectInfo;
