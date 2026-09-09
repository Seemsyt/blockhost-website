import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Smartphone, Zap, Sparkles, Terminal, 
  Layers, HardDrive, Download, ChevronRight, Shield, Globe, Volume2, VolumeX, User, LogOut 
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

interface Props {
  onOpenDeployWizard: () => void;
  onOpenDownloadModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<Props> = ({ 
  onOpenDeployWizard, 
  onOpenDownloadModal,
  onOpenAuthModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playPop();
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Mobile App', to: '/mobile-app' },
    { label: 'Flavors', to: '/flavors' },
    { label: 'Live Console', to: '/console' },
    { label: 'Mod Marketplace', to: '/mods' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Datacenters', to: '/network' },
    { label: 'FAQ', to: '/faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#090d16]/80 backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/"
          onClick={() => soundManager.playLevelUp()}
          className="flex items-center gap-3 group cursor-pointer relative"
        >
          {/* Custom 3D-styled Minecraft block icon */}
          <div className="relative w-11 h-11">
            <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-slate-900 p-[2px] shadow-lg group-hover:scale-105 transition-transform duration-300 transform-gpu">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <motion.span 
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="text-2xl origin-center block"
                >
                  🟩
                </motion.span>
                {/* Glossy overlay */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[10px] pointer-events-none"></div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Block<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">Host</span>
            </span>
            <span className="text-[10px] font-mono-code text-slate-400 -mt-1 block flex items-center gap-1.5 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Mobile Cloud
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-xl px-2.5 py-2 rounded-2xl border border-white/10 text-xs font-semibold font-mono-code text-slate-300 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => soundManager.playPop()}
              className={({ isActive }) =>
                `relative px-3.5 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl z-0"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons & Utilities */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Audio toggle button */}
          <button
            id="nav-sound-toggle"
            type="button"
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-slate-200 transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            title={isMuted ? "Unmute FX" : "Mute FX"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/dashboard"
                onClick={() => soundManager.playClick()}
                className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold font-mono-code text-xs transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Go to Dashboard
              </Link>
              <div className="h-5 w-px bg-white/10 mx-1"></div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/5 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-slate-300">
                  {user?.nickname}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  logout();
                }}
                className="p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="nav-login-btn"
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenAuthModal();
              }}
              className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 text-slate-200 border border-white/10 font-mono-code text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Login</span>
            </button>
          )}

          {/* Download App CTA */}
          <button
            id="nav-download-app-btn"
            type="button"
            onClick={() => {
              soundManager.playClick();
              onOpenDownloadModal();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 text-slate-200 border border-white/10 font-mono-code text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Get App</span>
          </button>

          {/* Launch / Deploy Instant Server CTA */}
          <button
            id="nav-deploy-server-btn"
            type="button"
            onClick={() => {
              soundManager.playLevelUp();
              if (!isAuthenticated) {
                onOpenAuthModal();
              } else {
                onOpenDeployWizard();
              }
            }}
            className="group relative px-5 py-2.5 rounded-xl font-mono-code text-xs font-extrabold text-slate-950 overflow-hidden shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 transition-opacity duration-300"></div>
            <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex items-center gap-2">
              <Zap className="w-4 h-4 fill-current drop-shadow-md" />
              <span className="drop-shadow-sm">Deploy (45s)</span>
            </div>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Audio toggle mobile */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-200 cursor-pointer transition-colors hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#090d16]/95 backdrop-blur-3xl border-b border-white/10 px-5 py-6 shadow-2xl"
          >
            <div className="flex flex-col gap-2 text-sm font-mono-code">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.to}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => {
                      soundManager.playPop();
                      setMobileMenuOpen(false);
                    }}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>

            {isAuthenticated && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <Link
                  to="/dashboard"
                  onClick={() => {
                    soundManager.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono-code text-sm text-center flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-emerald-500/20"
                >
                  <Layers className="w-4 h-4" />
                  Go to Dashboard
                </Link>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-3"
            >
              {!isAuthenticated && (
                 <button
                  onClick={() => {
                    soundManager.playClick();
                    setMobileMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full py-3.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 font-bold font-mono-code text-sm text-center flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Login / Register
                </button>
              )}
              
              <button
                onClick={() => {
                  soundManager.playLevelUp();
                  setMobileMenuOpen(false);
                  onOpenDeployWizard();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold font-mono-code text-sm text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Zap className="w-5 h-5 fill-current" />
                Deploy Minecraft Server (45s)
              </button>
              
              <button
                onClick={() => {
                  soundManager.playClick();
                  setMobileMenuOpen(false);
                  onOpenDownloadModal();
                }}
                className="w-full py-3.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 font-bold font-mono-code text-sm text-center flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800"
              >
                <Smartphone className="w-5 h-5 text-cyan-400" />
                Download Erex App
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
