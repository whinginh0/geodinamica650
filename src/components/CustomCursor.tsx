import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MousePointer2 } from 'lucide-react';

export const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('hoverable')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      id="custom-cursor"
      className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center"
      animate={{
        x: mousePos.x - 20,
        y: mousePos.y - 20,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 400,
        mass: 0.5,
      }}
    >
      <div className="relative w-10 h-10">
        {/* Globe Background (Blue for Oceans) */}
        <div className="absolute inset-0 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" />

        {/* Land Mass Simulation (Green) */}
        <motion.div
          className="absolute inset-1 bg-green-500 rounded-full opacity-80"
          style={{ clipPath: 'polygon(20% 10%, 80% 10%, 90% 50%, 60% 90%, 10% 80%)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 bg-green-400 rounded-full opacity-60"
          style={{ clipPath: 'polygon(10% 40%, 40% 10%, 70% 40%, 40% 70%)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />

        {/* Highlight/Sun (Yellow) */}
        <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full blur-[1px]" />

        {/* Longitudinal/Latitudinal Lines */}
        <div className="absolute inset-0 border border-white/20 rounded-full" />
        <div className="absolute inset-[2px] border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/10" />

        {/* Pointer Arrow */}
        <div className="absolute -bottom-1 -right-1">
          <MousePointer2 className="w-4 h-4 text-white fill-white shadow-sm" />
        </div>
      </div>
    </motion.div>
  );
};
