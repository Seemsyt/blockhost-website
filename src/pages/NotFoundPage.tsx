import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Compass, Layers, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4 relative overflow-hidden text-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative z-10 space-y-6"
      >
        <span className="text-6xl block animate-bounce">🕳️</span>

        <div className="space-y-2">
          <span className="text-xs font-mono-code uppercase font-bold text-red-400">Error 404 • Y &lt; -64</span>
          <h1 className="text-3xl font-extrabold text-white">Fell Into The Void!</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            The chunk or page you are looking for has not been generated or was moved to another coordinate.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            to="/"
            onClick={() => soundManager.playLevelUp()}
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Respawn at Home</span>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/mobile-app"
              onClick={() => soundManager.playPop()}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code text-center"
            >
              Mobile App
            </Link>

            <Link
              to="/flavors"
              onClick={() => soundManager.playPop()}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code text-center"
            >
              Flavors
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
