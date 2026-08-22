import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [percent, setPercent] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowBackToTop(latest > 350);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    soundManager.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Glassmorphic Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1 bg-transparent">
        {/* Glow backdrop track */}
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
        
        {/* Animated Gradient Runner */}
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]"
          style={{ scaleX }}
        />
      </div>

      {/* Floating Scroll Indicator Badge & Back-to-Top Button */}
      {showBackToTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={scrollToTop}
            className="group px-3.5 py-2 rounded-2xl glass-panel text-slate-300 hover:text-white hover:border-emerald-500/50 flex items-center gap-2 text-xs font-mono-code shadow-xl shadow-black/60 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Scroll to Top"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              <ArrowUp className="w-3 h-3" />
            </div>
            <span className="hidden sm:inline font-bold">Top</span>
            <span className="text-[10px] text-emerald-400/90 font-mono border-l border-white/10 pl-2">
              {percent}%
            </span>
          </button>
        </motion.div>
      )}
    </>
  );
};
