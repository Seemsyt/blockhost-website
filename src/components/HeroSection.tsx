import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Smartphone, ShieldCheck, Terminal, Sparkles, 
  Layers, ArrowRight, Play, CheckCircle2, Flame, Star, Server 
} from 'lucide-react';
import { ThreeBlockCanvas } from './ThreeBlockCanvas';
import { BlockType, MinecraftFlavor } from '../types';
import { soundManager } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';

interface Props {
  onOpenDeployWizard: () => void;
  onOpenDownloadModal: () => void;
  onSelectFlavor: (flavor: MinecraftFlavor) => void;
}

export const HeroSection: React.FC<Props> = ({
  onOpenDeployWizard,
  onOpenDownloadModal,
  onSelectFlavor
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockType>('grass');

  const flavorTags: { label: string; flavor: MinecraftFlavor; icon: string; color: string }[] = [
    { label: 'Bedrock PE & Win10', flavor: 'bedrock', icon: '📱', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20' },
    { label: 'Paper 1.21.4', flavor: 'paper', icon: '⚡', color: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20' },
    { label: 'Purpur Extreme', flavor: 'purpur', icon: '🟣', color: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-500/10 hover:bg-fuchsia-500/20' },
    { label: 'Fabric Modded', flavor: 'fabric', icon: '🧵', color: 'border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20' },
    { label: 'Forge Heavy', flavor: 'forge', icon: '🔨', color: 'border-red-500/40 text-red-300 bg-red-500/10 hover:bg-red-500/20' },
    { label: 'Pure Vanilla', flavor: 'vanilla', icon: '🌿', color: 'border-slate-500/40 text-slate-300 bg-slate-500/10 hover:bg-slate-500/20' },
  ];

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Grids and Ambient Glass Mesh Orbs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[520px] mesh-orb-emerald pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] mesh-orb-cyan pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] mesh-orb-purple pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Floating Announcement Badge */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-emerald-500/30 text-xs font-mono-code text-emerald-300 shadow-xl shadow-emerald-950/40"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>BlockHost Mobile v3.5 Released</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 hover:text-white transition-colors cursor-pointer" onClick={onOpenDownloadModal}>
              Now on iOS & Android →
            </span>
          </motion.div>
        </div>

        {/* 2-Column Hero Grid: Left Content, Right 3D Block Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -25, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Host & Control Your <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Minecraft Server
                </span> <br />
                Directly From Your Phone.
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Create <strong>Bedrock, Paper, Purpur, Vanilla & Fabric</strong> servers in 45 seconds. 
                Full live console, 1-click mod installer, instant cloud backups, and mobile file management right in your pocket.
              </p>
            </div>

            {/* Flavor Tag Pills with Glass Backdrop */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs font-mono-code text-slate-400 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> Flavors:
              </span>
              {flavorTags.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    onSelectFlavor(t.flavor);
                    const elem = document.querySelector('#flavors');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-code border glass-pill transition-all duration-200 hover:scale-105 ${t.color}`}
                >
                  <span className="mr-1">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-deploy-btn"
                type="button"
                onClick={() => {
                  soundManager.playLevelUp();
                  onOpenDeployWizard();
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 hover:from-emerald-400 hover:to-teal-200 text-slate-950 font-mono-code text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Deploy Server in 45 Seconds</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-download-app-btn"
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onOpenDownloadModal();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-panel hover:bg-slate-800/80 border-slate-700 text-slate-100 font-mono-code text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Download Mobile App</span>
              </button>
            </div>

            {/* Trust Proof Ticker inside frosted glass bar */}
            <div className="pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-xl glass-panel-subtle">
                <span className="text-xl sm:text-2xl font-extrabold font-mono-code text-white block">20.0</span>
                <span className="text-[11px] text-slate-400 font-mono-code">Guaranteed TPS</span>
              </div>
              <div className="p-3 rounded-xl glass-panel-subtle">
                <span className="text-xl sm:text-2xl font-extrabold font-mono-code text-emerald-400 block">&lt; 45s</span>
                <span className="text-[11px] text-slate-400 font-mono-code">Auto Provisioning</span>
              </div>
              <div className="p-3 rounded-xl glass-panel-subtle">
                <span className="text-xl sm:text-2xl font-extrabold font-mono-code text-cyan-400 block">12 Tbps</span>
                <span className="text-[11px] text-slate-400 font-mono-code">Path.net DDoS Shield</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Interactive Minecraft Block Canvas with Glassmorphic Halo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="w-full flex justify-center">
              <ThreeBlockCanvas 
                selectedBlock={selectedBlock}
                onBlockChange={(b) => setSelectedBlock(b)}
              />
            </div>
          </motion.div>

        </div>

        {/* Live Running Nodes & Player Activity Ticker in Glassmorphic Panel */}
        <ScrollReveal variant="fade-up" delay={0.2}>
          <div className="mt-14 p-4 rounded-2xl glass-panel flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono-code text-slate-400">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">Live Global Network:</span>
              <span>48,290+ Active Mobile Servers across 7 Datacenters</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-slate-300">
                <Server className="w-3.5 h-3.5 text-emerald-400" /> AMD Ryzen 9 7950X3D (5.7GHz)
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Enterprise S3 Snapshots
              </span>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

