import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, Wifi, Activity, ShieldCheck, Server, 
  RefreshCw, CheckCircle, Zap 
} from 'lucide-react';
import { DatacenterLocation } from '../types';
import { soundManager } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';

const DATACENTERS: DatacenterLocation[] = [
  { id: 'us-east', city: 'Ashburn, VA', country: 'United States', flag: '🇺🇸', region: 'North America East', ipTest: 'va.blockhost.gg', basePingMs: 14, status: 'Operational', hardware: 'Ryzen 9 7950X3D' },
  { id: 'us-west', city: 'Los Angeles, CA', country: 'United States', flag: '🇺🇸', region: 'North America West', ipTest: 'la.blockhost.gg', basePingMs: 22, status: 'Operational', hardware: 'Ryzen 9 7950X3D' },
  { id: 'eu-central', city: 'Frankfurt', country: 'Germany', flag: '🇩🇪', region: 'Europe Central', ipTest: 'de.blockhost.gg', basePingMs: 18, status: 'Operational', hardware: 'Ryzen 9 7950X3D' },
  { id: 'eu-west', city: 'London', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe West', ipTest: 'uk.blockhost.gg', basePingMs: 16, status: 'Operational', hardware: 'Ryzen 9 7950X3D' },
  { id: 'ap-southeast', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', region: 'Asia Pacific', ipTest: 'sg.blockhost.gg', basePingMs: 28, status: 'Operational', hardware: 'Ryzen 9 7950X3D' },
  { id: 'ap-northeast', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', region: 'East Asia', ipTest: 'jp.blockhost.gg', basePingMs: 32, status: 'Operational', hardware: 'Ryzen 9 7950X3D' },
  { id: 'sa-east', city: 'São Paulo', country: 'Brazil', flag: '🇧🇷', region: 'South America', ipTest: 'br.blockhost.gg', basePingMs: 38, status: 'Operational', hardware: 'Ryzen 9 7950X3D' },
  { id: 'oc-east', city: 'Sydney', country: 'Australia', flag: '🇦🇺', region: 'Oceania', ipTest: 'au.blockhost.gg', basePingMs: 35, status: 'Operational', hardware: 'Ryzen 9 7950X3D' },
];

export const GlobalNetworkSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('us-east');
  const [isPinging, setIsPinging] = useState(false);
  const [pingResults, setPingResults] = useState<Record<string, number>>({});

  const runLivePingTest = () => {
    soundManager.playClick();
    setIsPinging(true);

    setTimeout(() => {
      const results: Record<string, number> = {};
      DATACENTERS.forEach((dc) => {
        // Random slight jitter around base ping
        const jitter = Math.floor(Math.random() * 6) - 2;
        results[dc.id] = Math.max(8, dc.basePingMs + jitter);
      });
      setPingResults(results);
      setIsPinging(false);
      soundManager.playLevelUp();
    }, 1200);
  };

  const selectedDc = DATACENTERS.find(d => d.id === activeNode) || DATACENTERS[0];

  return (
    <section id="network" className="py-24 relative bg-[#070a12] border-t border-white/[0.06] overflow-hidden">
      {/* Ambient background mesh orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] mesh-orb-cyan pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[600px] h-[600px] mesh-orb-emerald pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono-code text-emerald-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Anycast Edge Infrastructure</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Low Latency Everywhere. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                8 Global Datacenters.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base">
              Every location runs on dedicated enterprise AMD Ryzen 9 7950X3D nodes with 12 Tbps Path.net DDoS scrubbers.
            </p>

            <div className="pt-2">
              <button
                id="run-ping-test-btn"
                type="button"
                onClick={runLivePingTest}
                disabled={isPinging}
                className="px-5 py-2.5 rounded-2xl glass-panel hover:bg-slate-800/80 border-slate-700 text-slate-200 text-xs font-mono-code font-bold inline-flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Benchmarking Global Nodes...' : 'Run Live Ping Benchmark'}</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Global Node Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {DATACENTERS.map((dc, idx) => {
            const isSelected = activeNode === dc.id;
            const currentPing = pingResults[dc.id] || dc.basePingMs;

            return (
              <motion.div
                key={dc.id}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                onClick={() => {
                  soundManager.playPop();
                  setActiveNode(dc.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer card-lift ${
                  isSelected
                    ? 'glass-panel border-emerald-400/80 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/30'
                    : 'glass-card hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{dc.flag}</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 border border-white/[0.08] text-[10px] font-mono-code text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{currentPing} ms</span>
                  </div>
                </div>

                <h4 className="font-bold text-white text-sm">{dc.city}</h4>
                <p className="text-[11px] text-slate-400 font-mono-code">{dc.region}</p>

                <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono-code text-slate-500">
                  <span className="text-slate-400">{dc.hardware}</span>
                  <span className="text-emerald-400/90">{dc.status}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Datacenter Spec Spotlight */}
        <ScrollReveal variant="fade-up" delay={0.2}>
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-heavy border-white/[0.1] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-mono-code text-emerald-400 uppercase font-bold">Selected Node: {selectedDc.flag} {selectedDc.city}</span>
              <h3 className="text-xl font-bold text-white">Direct Server Route: {selectedDc.ipTest}</h3>
              <p className="text-xs text-slate-300/80 font-mono-code">
                BGP Multi-Homed IP Transit (Level3, Telia, Cogent) with Path.net 12 Tbps volumetric DDoS scrubbers.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 rounded-xl glass-panel-subtle text-center">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase block">Uptime SLA</span>
                <span className="text-base font-bold font-mono-code text-emerald-400">99.99%</span>
              </div>
              <div className="px-4 py-2 rounded-xl glass-panel-subtle text-center">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase block">Packet Loss</span>
                <span className="text-base font-bold font-mono-code text-cyan-400">0.00%</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

