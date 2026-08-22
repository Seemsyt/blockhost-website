import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, CheckCircle2, Zap, Smartphone, Sparkles, Cpu, 
  ArrowRight, ShieldCheck, HelpCircle, Flame, ExternalLink 
} from 'lucide-react';
import { MinecraftFlavor, FlavorInfo } from '../types';
import { soundManager } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';

const FLAVORS_LIST: FlavorInfo[] = [
  {
    id: 'paper',
    name: 'Paper (PaperMC)',
    badge: 'Most Popular',
    tagline: 'High-performance plugin engine with unmatched TPS stability.',
    description: 'The golden standard for multiplayer SMPs. Patches critical Minecraft server lag exploits, asynchronous chunk loading, and supports all Spigot & Bukkit plugins.',
    iconColor: 'text-cyan-400',
    bgGradient: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30',
    bestFor: 'Public SMPs, Towny, Factions, Survival with Friends',
    compatibility: 'Plugins (Bukkit, Spigot, Paper) + Geyser Crossplay',
    tpsScore: 99,
    features: [
      'Asynchronous chunk loading & light engine',
      'Full compatibility with 25,000+ Spigot/Paper plugins',
      'Built-in Anti-Xray and anti-duplication exploits',
      'GeyserMC crossplay enabled with 1-click'
    ],
    popularPluginsOrMods: ['EssentialsX', 'LuckPerms', 'WorldEdit', 'Vault', 'CoreProtect'],
    versionSupport: '1.8.8 to 1.21.4 (Latest)',
    bedrockCrossplay: true,
  },
  {
    id: 'purpur',
    name: 'Purpur',
    badge: 'Extreme Performance & Fun',
    tagline: 'Paper on steroids with ridiculously deep gameplay customization.',
    description: 'A drop-in replacement for Paper that unlocks hundreds of gameplay tweaks, allows riding any mob (rideable ender dragons, dolphins), custom villager trades, and extreme performance configs.',
    iconColor: 'text-fuchsia-400',
    bgGradient: 'from-fuchsia-500/10 to-purple-500/10 border-fuchsia-500/30',
    bestFor: 'Custom SMPs, Minigames, Fun Community Servers',
    compatibility: 'All Paper/Spigot plugins + Purpur.yml tweaks',
    tpsScore: 100,
    features: [
      'Ride any mob (ridable chickens, dragons, phantoms)',
      'AFK player sleep percentage & custom chat formats',
      'Advanced lag-suppression for massive mob farms',
      'Micro-optimizations beyond standard Paper'
    ],
    popularPluginsOrMods: ['GSit', 'Chunky', 'Pl3xMap', 'DecentHolograms', 'GriefPrevention'],
    versionSupport: '1.16.5 to 1.21.4',
    bedrockCrossplay: true,
  },
  {
    id: 'bedrock',
    name: 'Bedrock Dedicated Server (BDS)',
    badge: 'Mobile & Console Native',
    tagline: 'Official C++ server engine designed specifically for Bedrock Edition.',
    description: 'Run native Bedrock servers for Pocket Edition (iOS, Android), Nintendo Switch, Xbox, PS5, and Windows 10. Native support for Bedrock Add-Ons, Behavior Packs, and Resource Packs.',
    iconColor: 'text-emerald-400',
    bgGradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30',
    bestFor: 'Mobile phone players, console groups, Bedrock Add-ons',
    compatibility: 'Bedrock .mcaddon & .mcpack support',
    tpsScore: 98,
    features: [
      'Ultra-lean memory usage (Runs on low RAM)',
      'Native Xbox Live gamertag authentication',
      'Official Mojang C++ codebase for zero rendering bugs',
      'Direct mobile join via port 19132'
    ],
    popularPluginsOrMods: ['Bedrock Add-ons', 'Behavior Packs', 'Custom Skins', 'Ray-Tracing Packs'],
    versionSupport: 'Latest Bedrock 1.21.60+',
    bedrockCrossplay: true,
  },
  {
    id: 'vanilla',
    name: 'Official Vanilla',
    badge: '100% Authentic Mojang',
    tagline: 'The pure, unmodified Minecraft experience with exact redstone mechanics.',
    description: 'Direct from Mojang Studios. Zero physics alterations, 100% accurate redstone contraption mechanics, mob spawning behavior, and immediate support for weekly snapshots.',
    iconColor: 'text-amber-400',
    bgGradient: 'from-amber-500/10 to-yellow-500/10 border-amber-500/30',
    bestFor: 'Technical redstone players, Snapshot testing, Pure Survival',
    compatibility: 'Vanilla Datapacks & Resource packs only',
    tpsScore: 88,
    features: [
      'Unmodified redstone tick mechanics (Zero quirks)',
      '100% vanilla mob spawning algorithms & iron farms',
      'Instant access to Mojang weekly snapshots',
      'Cleanest world saves compatible with singleplayer'
    ],
    popularPluginsOrMods: ['Vanilla Datapacks', 'Vanilla Tweaks', 'Custom World Gen'],
    versionSupport: 'Release 1.0 to 1.21.4 & Snapshots',
    bedrockCrossplay: false,
  },
  {
    id: 'fabric',
    name: 'Fabric Modded',
    badge: 'Modern & Lightweight',
    tagline: 'Blazing-fast modular modloader with the latest community mods.',
    description: 'The premier modern modding engine. Enjoy massive performance boosts with Sodium/Lithium or build epic technical industrial automation with Create Mod and Tech Reborn.',
    iconColor: 'text-teal-400',
    bgGradient: 'from-teal-500/10 to-emerald-500/10 border-teal-500/30',
    bestFor: 'Modern modpacks, Create Mod, High-FPS Client/Server sync',
    compatibility: 'Fabric Mods (.jar) + Fabric API',
    tpsScore: 97,
    features: [
      'Fast startup times (under 5 seconds)',
      'Home of Create Mod, Sodium, Lithium, and Iris',
      'Modular architecture that preserves vanilla feel',
      'BlockHost 1-click Fabric mod installer integration'
    ],
    popularPluginsOrMods: ['Create Mod', 'Lithium', 'FerriteCore', 'FTB Quests', 'Applied Energistics 2'],
    versionSupport: '1.14.4 to 1.21.4',
    bedrockCrossplay: true,
  },
  {
    id: 'forge',
    name: 'Forge Modded',
    badge: 'Heavyweight Modpacks',
    tagline: 'The classic titan of modding for 100+ to 300+ mod packs.',
    description: 'The heavyweight platform for legendary massive modpacks. Run RLCraft, All The Mods 9, Pixelmon, and complex dimension expansions with allocated dedicated high-speed RAM.',
    iconColor: 'text-red-400',
    bgGradient: 'from-red-500/10 to-rose-500/10 border-red-500/30',
    bestFor: 'Mega modpacks (ATM9, RLCraft, Pixelmon, GregTech)',
    compatibility: 'Forge & NeoForge mods (.jar)',
    tpsScore: 92,
    features: [
      'Support for 300+ mod mega packs',
      'Optimized JVM garbage collection flags pre-configured',
      'Automatic config conflict detector in BlockHost app',
      'High-memory allocation options up to 32GB RAM'
    ],
    popularPluginsOrMods: ['RLCraft', 'All The Mods', 'Pixelmon', 'Tinkers Construct', 'Mekanism'],
    versionSupport: '1.7.10 to 1.21.4',
    bedrockCrossplay: false,
  }
];

interface Props {
  selectedFlavor: MinecraftFlavor;
  onSelectFlavor: (flavor: MinecraftFlavor) => void;
  onDeployFlavor: (flavor: MinecraftFlavor) => void;
}

export const FlavorsSection: React.FC<Props> = ({
  selectedFlavor,
  onSelectFlavor,
  onDeployFlavor
}) => {
  const activeFlavorData = FLAVORS_LIST.find(f => f.id === selectedFlavor) || FLAVORS_LIST[0];

  return (
    <section id="flavors" className="py-24 relative bg-[#090d16] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow mesh orbs */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] mesh-orb-emerald pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] mesh-orb-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono-code text-emerald-400">
              <Layers className="w-3.5 h-3.5" />
              <span>All Engines Supported</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Choose Your Flavor. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300">
                Deploy with 1-Tap on Mobile.
              </span>
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base">
              Whether you want ultra-fast Bedrock mobile crossplay, hardcore Paper SMP with 50+ plugins, or a 200-mod Fabric tech pack — BlockHost handles all dependencies automatically.
            </p>
          </div>
        </ScrollReveal>

        {/* Flavor Selector Tabs */}
        <ScrollReveal variant="fade-up" delay={0.1}>
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
            {FLAVORS_LIST.map((f) => {
              const isSelected = f.id === selectedFlavor;
              return (
                <button
                  key={f.id}
                  id={`flavor-tab-${f.id}`}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    onSelectFlavor(f.id);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-mono-code font-bold transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-105'
                      : 'glass-panel hover:bg-slate-800 text-slate-300 border-white/[0.08]'
                  }`}
                >
                  <span>{f.name.split(' ')[0]}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Detailed Flavor Spotlight Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFlavorData.id}
            initial={{ opacity: 0, y: 20, scale: 0.98, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-br ${activeFlavorData.bgGradient} backdrop-blur-2xl border border-white/[0.12] relative shadow-2xl overflow-hidden`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Flavor Info & Stats */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono-code font-extrabold glass-pill text-emerald-400 border-emerald-500/30">
                      {activeFlavorData.badge}
                    </span>
                    <span className="text-xs font-mono-code text-slate-400">
                      Supports: {activeFlavorData.versionSupport}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                    {activeFlavorData.name}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium">
                    {activeFlavorData.tagline}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                  {activeFlavorData.description}
                </p>

                {/* Key Features Bullet List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeFlavorData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Popular Addons Pills */}
                <div className="pt-2">
                  <span className="text-xs font-mono-code text-slate-400 block mb-2">
                    Popular 1-Click Installs for {activeFlavorData.name.split(' ')[0]}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeFlavorData.popularPluginsOrMods.map((item) => (
                      <span key={item} className="px-2.5 py-1 rounded-lg glass-pill text-xs font-mono-code text-slate-300">
                        📦 {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deploy Button */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playLevelUp();
                      onDeployFlavor(activeFlavorData.id);
                    }}
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Create {activeFlavorData.name.split(' ')[0]} Server in 45s</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Spec Meter & Compatibility Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl glass-panel-heavy border-white/[0.1] shadow-2xl space-y-4">
                  <h4 className="text-xs font-mono-code uppercase font-bold text-slate-400">
                    Engine Technical Benchmark
                  </h4>

                  {/* TPS Score Meter */}
                  <div>
                    <div className="flex justify-between text-xs font-mono-code mb-1">
                      <span className="text-slate-300">TPS Stability Index</span>
                      <span className="text-emerald-400 font-bold">{activeFlavorData.tpsScore} / 100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        style={{ width: `${activeFlavorData.tpsScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Best For Card */}
                  <div className="p-3.5 rounded-xl glass-panel-subtle text-xs">
                    <span className="text-[10px] font-mono-code uppercase text-slate-400 block mb-1">Recommended Use:</span>
                    <p className="text-slate-200 font-medium">{activeFlavorData.bestFor}</p>
                  </div>

                  {/* Compatibility Badge */}
                  <div className="p-3.5 rounded-xl glass-panel-subtle text-xs">
                    <span className="text-[10px] font-mono-code uppercase text-slate-400 block mb-1">Ecosystem:</span>
                    <p className="text-slate-200 font-medium">{activeFlavorData.compatibility}</p>
                  </div>

                  {/* Crossplay Flag */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl glass-panel-subtle text-xs font-mono-code">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      Mobile Bedrock Crossplay
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {activeFlavorData.bedrockCrossplay ? 'Supported ✓' : 'Java Only'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
