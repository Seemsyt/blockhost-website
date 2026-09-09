import React from 'react';
import { motion } from 'motion/react';
import { Globe, ShieldCheck, Wifi, Activity, Server, Zap, Lock } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { GlobalNetworkSection } from '../components/GlobalNetworkSection';
import { soundManager } from '../utils/audio';

interface Props {
  onOpenDeployWizard: () => void;
}

export const DatacentersPage: React.FC<Props> = ({ onOpenDeployWizard }) => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      {/* Route Header */}
      <PageHeader
        badge="Enterprise Edge Network"
        badgeIcon={<Globe className="w-3.5 h-3.5" />}
        title="8 Global Datacenters with"
        highlightedTitle="Path.net 12 Tbps DDoS Scrubbing."
        description="Every Erex node is provisioned on AMD Ryzen 9 7950X3D dedicated hardware with BGP Anycast routing and multi-homed Tier-1 fiber connectivity for minimal latency."
        crumbs={[{ label: 'Global Datacenters' }]}
      />

      {/* Main Interactive Network Ping Benchmark Section */}
      <GlobalNetworkSection />

      {/* DDoS Protection Architecture Section */}
      <section className="py-20 bg-[#070a12] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-code text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Layer 3, 4 & 7 Minecraft Filtering</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise DDoS Protection That Actually Works.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Never get knocked offline by bot floods, query attacks, or multi-hundred gigabit volumetric UDP reflections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 card-lift cursor-default">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Path.net 12 Tbps Capacity</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Traffic is inspected and cleaned in hardware state machines with sub-millisecond inspection latency and 0 packet drops.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 card-lift-cyan cursor-default">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Bedrock & Java Protocol Scrubbing</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Custom protocol validation filters malicious handshake packets, handshake spoofing, and ping reflector flood vectors.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 card-lift-purple cursor-default">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Always-On Zero Trigger Delay</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                No 30-second delay while attack detection activates. Mitigation is permanently active with 0 TPS impact.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Network SLA & Uptime */}
      <section className="py-20 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">99.99% Guaranteed Infrastructure SLA</h2>
          <p className="text-slate-300 text-sm">
            Deploy in Ashburn, Frankfurt, London, Singapore, Tokyo, Sydney, São Paulo, or Los Angeles in under 45 seconds.
          </p>

          <button
            type="button"
            onClick={() => {
              soundManager.playLevelUp();
              onOpenDeployWizard();
            }}
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs inline-flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Deploy Near Your Players</span>
          </button>
        </div>
      </section>
    </div>
  );
};
