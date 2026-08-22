import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/audio';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookPageTransitionProps {
  children: React.ReactNode;
}

// Ordered page hierarchy for natural book page progression
const PAGE_ORDER = [
  '/',
  '/mobile-app',
  '/flavors',
  '/console',
  '/mods',
  '/pricing',
  '/network',
  '/faq',
];

const PAGE_NAMES: Record<string, string> = {
  '/': 'Ch. 1: Global Platform',
  '/mobile-app': 'Ch. 2: Pocket Node App',
  '/flavors': 'Ch. 3: Core Engines',
  '/console': 'Ch. 4: Live Terminal',
  '/mods': 'Ch. 5: Mod Matrix',
  '/pricing': 'Ch. 6: Cloud Tiers',
  '/network': 'Ch. 7: Low-Latency Grid',
  '/faq': 'Ch. 8: Archival Codex',
};

export const BookPageTransition: React.FC<BookPageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isFlipping, setIsFlipping] = useState(false);
  const [bookModeEnabled, setBookModeEnabled] = useState(true);

  // Current page index in book
  const currentIndex = PAGE_ORDER.indexOf(location.pathname);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const prevIndex = PAGE_ORDER.indexOf(prevPathRef.current);
  const safePrevIndex = prevIndex === -1 ? 0 : prevIndex;

  const prevPagePath = safeIndex > 0 ? PAGE_ORDER[safeIndex - 1] : null;
  const nextPagePath = safeIndex < PAGE_ORDER.length - 1 ? PAGE_ORDER[safeIndex + 1] : null;

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      const dir = safeIndex >= safePrevIndex ? 'forward' : 'backward';
      setDirection(dir);
      setIsFlipping(true);
      
      // Play tactile paper turn rustle sound
      if (bookModeEnabled) {
        soundManager.playPageTurn();
      }

      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 650);

      prevPathRef.current = location.pathname;
      return () => clearTimeout(timer);
    }
  }, [location.pathname, safeIndex, safePrevIndex, bookModeEnabled]);

  // Book Page Turning Physics Variants
  const bookVariants = {
    initial: (dir: 'forward' | 'backward') => ({
      rotateY: dir === 'forward' ? 35 : -35,
      opacity: 0.15,
      scale: 0.98,
      transformOrigin: dir === 'forward' ? 'left center' : 'right center',
      boxShadow: dir === 'forward' 
        ? '-25px 0 50px -10px rgba(0,0,0,0.8), inset 30px 0 60px -15px rgba(0,0,0,0.9)'
        : '25px 0 50px -10px rgba(0,0,0,0.8), inset -30px 0 60px -15px rgba(0,0,0,0.9)',
      filter: 'brightness(0.85)',
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: 'center center',
      boxShadow: '0 0 0px 0px rgba(0,0,0,0), inset 0px 0 0px 0px rgba(0,0,0,0)',
      filter: 'brightness(1)',
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1], // Custom paper elasticity bezier
      },
    },
    exit: (dir: 'forward' | 'backward') => ({
      rotateY: dir === 'forward' ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      transformOrigin: dir === 'forward' ? 'left center' : 'right center',
      boxShadow: dir === 'forward'
        ? '-40px 0 60px -10px rgba(0,0,0,0.95), inset 60px 0 80px -10px rgba(0,0,0,0.9)'
        : '40px 0 60px -10px rgba(0,0,0,0.95), inset -60px 0 80px -10px rgba(0,0,0,0.9)',
      filter: 'brightness(0.65)',
      transition: {
        duration: 0.48,
        ease: [0.4, 0.0, 0.2, 1],
      },
    }),
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ perspective: '2400px' }}>
      
      {/* Dynamic Book Spine Gutter Ambient Lighting on Left / Center */}
      <div 
        className="fixed top-0 bottom-0 left-0 w-8 pointer-events-none z-40 bg-gradient-to-r from-black/40 via-black/15 to-transparent transition-opacity duration-300"
        style={{ opacity: isFlipping ? 0.8 : 0.3 }}
      />
      
      {/* Animated 3D Book Page Canvas */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={bookModeEnabled ? bookVariants : undefined}
          initial={bookModeEnabled ? "initial" : { opacity: 0 }}
          animate={bookModeEnabled ? "animate" : { opacity: 1 }}
          exit={bookModeEnabled ? "exit" : { opacity: 0 }}
          className="w-full min-h-screen will-change-transform relative"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Dynamic Paper Surface Glare Highlight on Flip */}
          {isFlipping && bookModeEnabled && (
            <motion.div
              initial={{ opacity: 0.6, x: direction === 'forward' ? '-100%' : '100%' }}
              animate={{ opacity: 0, x: direction === 'forward' ? '100%' : '-100%' }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-r from-transparent via-emerald-400/10 to-white/10 mix-blend-overlay"
            />
          )}

          {children}
        </motion.div>
      </AnimatePresence>

      {/* Floating Interactive Tome / Bookmark Navigation HUD */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-2 shadow-2xl shadow-black/80 font-mono-code text-xs">
        
        {/* Previous Chapter Book Page Turn */}
        {prevPagePath ? (
          <Link
            to={prevPagePath}
            onClick={() => soundManager.playPageTurn()}
            title="Turn to previous page"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors flex items-center gap-1 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div className="p-2 rounded-xl bg-slate-900/40 text-slate-600 border border-slate-900 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </div>
        )}

        {/* Current Book Chapter Display */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">
              {PAGE_NAMES[location.pathname] || 'Tome of Blocks'}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              Page {safeIndex + 1} of {PAGE_ORDER.length}
            </span>
          </div>
        </div>

        {/* Next Chapter Book Page Turn */}
        {nextPagePath ? (
          <Link
            to={nextPagePath}
            onClick={() => soundManager.playPageTurn()}
            title="Turn to next page"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors flex items-center gap-1 group"
          >
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div className="p-2 rounded-xl bg-slate-900/40 text-slate-600 border border-slate-900 cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </div>
        )}

        {/* Book Flip Mode Toggle */}
        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            setBookModeEnabled(!bookModeEnabled);
          }}
          title={bookModeEnabled ? "3D Book Page Flip: Active" : "3D Book Flip: Disabled"}
          className={`p-2 rounded-xl border transition-all ${
            bookModeEnabled
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
