import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Smartphone, Zap, Sparkles, Terminal, 
  Layers, HardDrive, Download, ChevronRight, Shield, Globe, Volume2, VolumeX 
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  onOpenDeployWizard: () => void;
  onOpenDownloadModal: () => void;
}

export const Navbar: React.FC<Props> = ({ 
  onOpenDeployWizard, 
  onOpenDownloadModal 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const location = useLocation();

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-[#090d16]/40 backdrop-blur-md py-4 border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/"
          onClick={() => soundManager.playLevelUp()}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          {/* Custom 3D-styled Minecraft block icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-slate-900 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <span className="text-xl">🟩</span>
            </div>
          </div>
          
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              Block<span className="text-emerald-400">Host</span>
            </span>
            <span className="text-[10px] font-mono-code text-slate-400 -mt-1 block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Mobile Minecraft Cloud
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/80 text-xs font-medium font-mono-code text-slate-300 shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => soundManager.playPop()}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons & Utilities */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Audio toggle button */}
          <button
            id="nav-sound-toggle"
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isMuted ? "Unmute FX" : "Mute FX"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Download App CTA */}
          <button
            id="nav-download-app-btn"
            type="button"
            onClick={() => {
              soundManager.playClick();
              onOpenDownloadModal();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-mono-code text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Get App</span>
          </button>

          {/* Launch / Deploy Instant Server CTA */}
          <button
            id="nav-deploy-server-btn"
            type="button"
            onClick={() => {
              soundManager.playLevelUp();
              onOpenDeployWizard();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono-code text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Deploy (45s)</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Audio toggle mobile */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090d16]/98 backdrop-blur-2xl border-b border-slate-800 px-5 py-4 space-y-3 mt-2 shadow-2xl">
          <div className="flex flex-col gap-1 text-sm font-mono-code">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  soundManager.playPop();
                  setMobileMenuOpen(false);
                }}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-emerald-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                soundManager.playLevelUp();
                setMobileMenuOpen(false);
                onOpenDeployWizard();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold font-mono-code text-xs text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              Deploy Minecraft Server (45s)
            </button>
            
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(false);
                onOpenDownloadModal();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold font-mono-code text-xs text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Download BlockHost iOS / Android
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
