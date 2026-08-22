import React from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, ShieldCheck, Folder, Sparkles, Server, Smartphone, 
  Zap, Bell, Lock, Cpu, Globe, Sliders, ArrowRight, Check 
} from 'lucide-react';
import { InteractiveAppSimulator } from './InteractiveAppSimulator';
import { soundManager } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';

interface Props {
  onOpenDeployWizard: () => void;
  onOpenDownloadModal: () => void;
}

export const MobileFeaturesSection: React.FC<Props> = ({
  onOpenDeployWizard,
  onOpenDownloadModal
}) => {
  const featurePillars = [
    {
      icon: Terminal,
      title: 'Live Mobile Console',
      badge: 'Real-Time Streaming',
      color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
      description: 'Stream server logs line-by-line in real time. Send commands (/op, /time, /give, /ban) with smart autocompletion and receive immediate execution feedback.'
    },
    {
      icon: Server,
      title: 'Server Control Dashboard',
      badge: 'Power & Telemetry',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Start, stop, and restart with 1-tap. Monitor live CPU, RAM, and SSD disk metrics. Kick or ban disruptive players instantly on the go.'
    },
    {
      icon: Sparkles,
      title: 'Inbuilt Mods & Plugins Browser',
      badge: '50,000+ Add-ons',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      description: 'Search CurseForge, Modrinth, and SpigotMC. Install EssentialsX, WorldEdit, Lithium, or Geyser with 1-click. Auto-resolves missing dependencies.'
    },
    {
      icon: ShieldCheck,
      title: '1-Click Cloud Backups',
      badge: 'Zero Data Loss',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Take instant full-world snapshots in 2 seconds without interrupting players. Restore any previous save with 1-click rollback or download as .ZIP.'
    },
    {
      icon: Folder,
      title: 'Mobile File Manager & YAML Editor',
      badge: 'Visual & Raw Configs',
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      description: 'Browse, edit, and upload server files directly from your mobile device. Includes a friendly visual slider editor for server.properties.'
    },
    {
      icon: Bell,
      title: 'Push Alerts & Smart Monitoring',
      badge: 'Instant Notification',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      description: 'Get immediate phone notifications when a player joins, server TPS drops, RAM spikes, or a crash happens. Auto-restarts within 3 seconds.'
    }
  ];

  return (
    <section id="app-preview" className="py-24 relative bg-[#070a12] border-t border-white/[0.06] overflow-hidden">
      {/* Glow mesh shapes */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[550px] mesh-orb-emerald pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] mesh-orb-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading with ScrollReveal */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono-code text-emerald-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Interactive Mobile Simulator</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Your Entire Minecraft Server. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Controlled In Your Hand.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base">
              Test drive the BlockHost mobile app below! Click the buttons, type console commands, browse mods, and edit server properties live.
            </p>
          </div>
        </ScrollReveal>

        {/* 2-Column Showcase: Left Phone Simulator, Right Feature Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: The Interactive Phone Simulator with Glassmorphic halo */}
          <ScrollReveal variant="fade-right" className="lg:col-span-6 flex justify-center">
            <InteractiveAppSimulator />
          </ScrollReveal>

          {/* Right Column: Bento Features Breakdown */}
          <ScrollReveal variant="fade-left" className="lg:col-span-6 space-y-4">
            <div className="space-y-2 mb-6">
              <span className="text-xs font-mono-code text-emerald-400 uppercase font-bold tracking-wider">
                Mobile-First Engineering
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Everything you need to run a 24/7 Minecraft world without touching a PC.
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {featurePillars.map((pill, idx) => {
                const Icon = pill.icon;
                return (
                  <motion.div
                    key={pill.title}
                    initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    className="p-4 rounded-2xl glass-card group card-lift cursor-default"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl border ${pill.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-slate-950/70 text-slate-300 border border-white/[0.08]">
                        {pill.badge}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {pill.title}
                    </h4>
                    
                    <p className="text-xs text-slate-300/80 mt-1.5 leading-relaxed">
                      {pill.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Call to Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundManager.playLevelUp();
                  onOpenDeployWizard();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Launch Your First Server</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onOpenDownloadModal();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl glass-panel hover:bg-slate-800/80 border-slate-700 text-slate-200 font-mono-code text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Get BlockHost App</span>
              </button>
            </div>

          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};

