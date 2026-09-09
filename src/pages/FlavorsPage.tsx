import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, Zap, Check, X, Sparkles, Server, 
  HelpCircle, ArrowRight, ShieldCheck, Cpu 
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FlavorsSection } from '../components/FlavorsSection';
import { MinecraftFlavor } from '../types';
import { soundManager } from '../utils/audio';

interface Props {
  selectedFlavor: MinecraftFlavor;
  onSelectFlavor: (flavor: MinecraftFlavor) => void;
  onDeployFlavor: (flavor: MinecraftFlavor) => void;
  onOpenDeployWizard: () => void;
}

export const FlavorsPage: React.FC<Props> = ({
  selectedFlavor,
  onSelectFlavor,
  onDeployFlavor,
  onOpenDeployWizard
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'flags' | 'versions'>('matrix');

  const comparisonData = [
    {
      name: 'PaperMC 1.21.4',
      type: 'Plugin Server',
      ram: '2 - 8 GB',
      tps: '20.0 (Ultra High)',
      plugins: 'Bukkit / Spigot / Paper (50,000+)',
      bedrock: '1-Click Geyser Bridge',
      bestFor: 'Survival SMPs, MiniGames, Multi-player groups'
    },
    {
      name: 'Purpur Pro',
      type: 'Configurable Fork',
      ram: '2 - 12 GB',
      tps: '20.0 (Tuned)',
      plugins: 'All Paper plugins + Custom mob AI configs',
      bedrock: '1-Click Geyser Bridge',
      bestFor: 'Competitive SMPs, Rideable mobs, Custom physics'
    },
    {
      name: 'Bedrock BDS',
      type: 'Native C++ Server',
      ram: '1 - 4 GB',
      tps: '20.0 (Native)',
      plugins: 'Behavior & Resource Packs (.mcaddon)',
      bedrock: 'Native (iOS, Android, Xbox, Switch, Win10)',
      bestFor: 'Pure Pocket Edition & Console friend groups'
    },
    {
      name: 'Fabric 1.21.4',
      type: 'Lightweight Modded',
      ram: '4 - 16 GB',
      tps: '19.5 - 20.0 (Optimized)',
      plugins: 'Fabric Mods & Lithium / Sodium ecosystem',
      bedrock: 'Supported via Floodgate',
      bestFor: 'Create mod, modern tech mods, lightweight modpacks'
    },
    {
      name: 'Forge / NeoForge',
      type: 'Heavy Modded',
      ram: '6 - 32 GB',
      tps: '18.5 - 20.0',
      plugins: 'Forge Mods (FTB, All The Mods, Pixelmon)',
      bedrock: 'Limited (Java modded items)',
      bestFor: 'Massive 200+ modpacks, dimension packs, Pixelmon'
    },
    {
      name: 'Official Vanilla',
      type: 'Pure Mojang Jar',
      ram: '2 - 6 GB',
      tps: '18.0 - 20.0',
      plugins: 'Datapacks & Vanilla Commands only',
      bedrock: 'Java Only',
      bestFor: 'Pure vanilla mechanics, technical redstone farms'
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      {/* Route Header */}
      <PageHeader
        badge="Server Engines & Flavors"
        badgeIcon={<Layers className="w-3.5 h-3.5" />}
        title="Choose the Perfect Engine"
        highlightedTitle="For Your Community."
        description="Whether you are hosting a casual Bedrock Realm replacement, a 50-player Paper SMP, or a 200-modpack Forge world, Erex supports all major flavors with 1-click installation."
        crumbs={[{ label: 'Flavors & Engines' }]}
      />

      {/* Interactive Engine Selector Showcase */}
      <FlavorsSection
        selectedFlavor={selectedFlavor}
        onSelectFlavor={onSelectFlavor}
        onDeployFlavor={onDeployFlavor}
      />

      {/* Deep-Dive Tabs Section */}
      <section className="py-20 bg-[#070a12] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tab Switcher */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[
              { id: 'matrix', label: 'Engine Comparison Matrix' },
              { id: 'flags', label: "Aikar's Optimized JVM Flags" },
              { id: 'versions', label: 'Supported Versions (1.8 - 1.21.4)' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Comparison Matrix */}
          {activeTab === 'matrix' && (
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
              <table className="w-full text-left border-collapse text-xs font-mono-code">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                    <th className="p-4 sm:p-5 font-bold text-white">Engine / Flavor</th>
                    <th className="p-4 sm:p-5 font-bold">Architecture</th>
                    <th className="p-4 sm:p-5 font-bold">Recommended RAM</th>
                    <th className="p-4 sm:p-5 font-bold">TPS Rating</th>
                    <th className="p-4 sm:p-5 font-bold">Bedrock Crossplay</th>
                    <th className="p-4 sm:p-5 font-bold">Primary Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {comparisonData.map((row) => (
                    <tr key={row.name} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-2">
                        <span className="text-emerald-400">●</span> {row.name}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-400">{row.type}</td>
                      <td className="p-4 sm:p-5 text-emerald-400 font-bold">{row.ram}</td>
                      <td className="p-4 sm:p-5 text-cyan-400 font-bold">{row.tps}</td>
                      <td className="p-4 sm:p-5 text-slate-300">{row.bedrock}</td>
                      <td className="p-4 sm:p-5 text-slate-400 font-sans">{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Aikar's Flags */}
          {activeTab === 'flags' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono-code text-emerald-400 font-bold uppercase">Pre-Configured Performance</span>
                <h3 className="text-2xl font-bold text-white">Garbage Collection Tuned for Zero Micro-Stutter</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                  Erex automatically configures industry-standard Aikar flags and ZGC/G1GC garbage collectors based on your server's RAM allocation. This eliminates the infamous 1-second freeze spikes during chunk saving.
                </p>
              </div>

              {/* Code block */}
              <div className="p-4 rounded-2xl bg-black border border-slate-800 text-xs font-mono-code text-emerald-400 overflow-x-auto leading-relaxed">
                <code>
                  java -Xms4096M -Xmx4096M -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -jar server.jar nogui
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 card-lift">
                  <span className="font-bold text-white block mb-1">AlwaysPreTouch</span>
                  <p className="text-slate-400 font-sans">Pre-allocates RAM pages at boot to prevent OS swapping during world generation.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 card-lift">
                  <span className="font-bold text-white block mb-1">MaxGCPauseMillis=200</span>
                  <p className="text-slate-400 font-sans">Enforces a strict 200ms ceiling on pause times to keep TPS pegged at 20.0.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 card-lift">
                  <span className="font-bold text-white block mb-1">ParallelRefProcEnabled</span>
                  <p className="text-slate-400 font-sans">Offloads garbage collection references across AMD Ryzen multi-core threads.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Versions */}
          {activeTab === 'versions' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
              <h3 className="text-2xl font-bold text-white">Full Minecraft Version Archive</h3>
              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                Need to run legacy 1.8.8 for competitive PvP with block-hitting? Or 1.16.5 for favorite modpacks? Erex retains all release jars with automatic Java 8, 17, and 21 runtime switching.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
                {[
                  { ver: '1.21.4 (Latest)', java: 'Java 21 LTS', status: 'Recommended' },
                  { ver: '1.20.6 / 1.20.4', java: 'Java 21 LTS', status: 'Stable' },
                  { ver: '1.19.4', java: 'Java 17 LTS', status: 'Stable' },
                  { ver: '1.18.2', java: 'Java 17 LTS', status: 'Stable' },
                  { ver: '1.16.5', java: 'Java 11 / 16', status: 'Legacy Modpacks' },
                  { ver: '1.12.2', java: 'Java 8', status: 'Classic Modpacks' },
                  { ver: '1.8.8', java: 'Java 8', status: 'PvP Tournaments' },
                  { ver: 'Weekly Snapshots', java: 'Java 21+', status: 'Experimental' },
                ].map((item) => (
                  <div key={item.ver} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">{item.ver}</span>
                    <span className="text-slate-400 block text-[11px]">{item.java}</span>
                    <span className="text-[10px] text-emerald-400">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Ready to Deploy Callout */}
      <section className="py-16 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Deploy Any Minecraft Flavor in 45s</h2>
          <p className="text-slate-300 text-sm">
            Launch your world now. You can switch flavors at any time without losing your world map.
          </p>

          <button
            type="button"
            onClick={() => {
              soundManager.playLevelUp();
              onOpenDeployWizard();
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold font-mono-code text-xs inline-flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Launch Server Wizard</span>
          </button>
        </div>
      </section>
    </div>
  );
};
