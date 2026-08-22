import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Search, Download, Check, Star, 
  ExternalLink, Layers, ShieldCheck, Zap, ArrowRight, Flame 
} from 'lucide-react';
import { ModItem, MinecraftFlavor } from '../types';
import { soundManager } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const EXTENDED_MODS: ModItem[] = [
  {
    id: 'lithium',
    name: 'Lithium',
    author: 'CaffeineMC',
    downloads: '42.5M',
    category: 'Performance',
    flavors: ['fabric', 'purpur'],
    version: 'v0.12.7 (1.21.4)',
    description: 'General-purpose optimization mod for physics, mob AI, and world ticking.',
    installed: true,
    size: '840 KB',
    rating: 5.0,
    icon: '⚡'
  },
  {
    id: 'sodium',
    name: 'Sodium & Iris Shaders',
    author: 'CaffeineMC',
    downloads: '58.9M',
    category: 'Performance',
    flavors: ['fabric'],
    version: 'v0.5.11',
    description: 'Next-generation rendering engine with 300% FPS boost and shader support.',
    installed: true,
    size: '1.4 MB',
    rating: 5.0,
    icon: '🚀'
  },
  {
    id: 'essentialsx',
    name: 'EssentialsX Core Suite',
    author: 'EssentialsX Team',
    downloads: '68.1M',
    category: 'Essentials',
    flavors: ['paper', 'purpur', 'spigot'],
    version: 'v2.20.1',
    description: 'The foundation for servers: /home, /spawn, /tpa, kits, economy, warps.',
    installed: true,
    size: '2.4 MB',
    rating: 4.9,
    icon: '⭐'
  },
  {
    id: 'geyser',
    name: 'Geyser & Floodgate',
    author: 'GeyserMC',
    downloads: '19.2M',
    category: 'World',
    flavors: ['paper', 'purpur', 'fabric', 'spigot'],
    version: 'v2.4.0',
    description: 'Enables Bedrock players (iOS, Android, Xbox, Switch) to join your Java server.',
    installed: false,
    size: '18.1 MB',
    rating: 5.0,
    icon: '🌉'
  },
  {
    id: 'create',
    name: 'Create Mod (Automated Engineering)',
    author: 'Simibubi',
    downloads: '38.4M',
    category: 'Tech',
    flavors: ['fabric', 'forge'],
    version: 'v0.5.1',
    description: 'Kinetic mechanical components, rotational energy, trains, and factory machinery.',
    installed: false,
    size: '22.6 MB',
    rating: 5.0,
    icon: '⚙️'
  },
  {
    id: 'luckperms',
    name: 'LuckPerms Permissions',
    author: 'Luck',
    downloads: '35.0M',
    category: 'Essentials',
    flavors: ['paper', 'purpur', 'fabric', 'forge', 'spigot'],
    version: 'v5.4.102',
    description: 'Ultra-fast permissions manager with in-app mobile web editor sync.',
    installed: true,
    size: '3.1 MB',
    rating: 5.0,
    icon: '🛡️'
  },
  {
    id: 'worldedit',
    name: 'WorldEdit',
    author: 'EngineHub',
    downloads: '55.3M',
    category: 'World',
    flavors: ['paper', 'purpur', 'fabric', 'forge', 'spigot'],
    version: 'v7.3.0',
    description: 'In-game map editor, selection tools, brushes, and voxel sculpting.',
    installed: false,
    size: '4.1 MB',
    rating: 4.9,
    icon: '🪓'
  },
  {
    id: 'chunky',
    name: 'Chunky World Pre-generator',
    author: 'pop4959',
    downloads: '8.7M',
    category: 'Performance',
    flavors: ['paper', 'purpur', 'fabric'],
    version: 'v1.4.10',
    description: 'Pre-generates chunks to eradicate server stutter when players explore.',
    installed: false,
    size: '1.2 MB',
    rating: 4.9,
    icon: '🗺️'
  },
  {
    id: 'vault',
    name: 'Vault Economy & Chat API',
    author: 'MilkBowl',
    downloads: '47.0M',
    category: 'Economy',
    flavors: ['paper', 'purpur', 'spigot'],
    version: 'v1.7.3',
    description: 'Standardized connector for shops, auctions, player banks, and currency.',
    installed: false,
    size: '350 KB',
    rating: 4.8,
    icon: '💰'
  }
];

interface Props {
  onOpenDeployWizard: () => void;
}

export const ModsBrowserSection: React.FC<Props> = ({ onOpenDeployWizard }) => {
  const [modList, setModList] = useState<ModItem[]>(EXTENDED_MODS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const categories = ['All', 'Performance', 'Essentials', 'World', 'Tech', 'Economy'];

  const { user, isAuthenticated } = useAuth();
  
  const toggleInstall = async (modId: string) => {
    soundManager.playPop();
    if (!isAuthenticated) {
      alert("Please login to install mods.");
      return;
    }
    
    setInstallingId(modId);

    try {
      // Get the user's first server
      const servers = await apiFetch('/servers');
      if (!servers || servers.length === 0) {
        alert("You don't have any servers! Deploy one first.");
        onOpenDeployWizard();
        setInstallingId(null);
        return;
      }
      const serverId = servers[0].id;

      // Install the mod
      await apiFetch(`/servers/${serverId}/mods/install`, {
        method: 'POST',
        body: JSON.stringify({ modrinth_project_id: modId })
      });

      soundManager.playLevelUp();
      setModList(prev => prev.map(m => {
        if (m.id === modId) {
          return { ...m, installed: true };
        }
        return m;
      }));
    } catch (err: any) {
      console.error(err);
      alert(`Failed to install mod: ${err.message}`);
    } finally {
      setInstallingId(null);
    }
  };

  const filteredMods = modList.filter(m => {
    const matchesCat = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="mods" className="py-24 relative bg-[#090d16] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow mesh orbs */}
      <div className="absolute top-1/2 right-1/4 w-[750px] h-[450px] mesh-orb-emerald pointer-events-none" />
      <div className="absolute top-10 left-10 w-[450px] h-[450px] mesh-orb-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono-code text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CurseForge & Modrinth API Direct Integration</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              50,000+ Mods & Plugins. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Installed With 1-Click On Your Phone.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base">
              No more manual FTP uploads or searching through obscure forums. Browse verified mod repositories with automated dependency resolvers and instant conflict alerts.
            </p>
          </div>
        </ScrollReveal>

        {/* Search & Filter Bar */}
        <ScrollReveal variant="fade-up" delay={0.1}>
          <div className="max-w-3xl mx-auto mb-10 space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                id="mods-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mods, plugins, authors (e.g. Sodium, WorldEdit, EssentialsX, Create)..."
                className="w-full glass-input rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 shadow-xl"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setActiveCategory(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-code transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                      : 'glass-panel text-slate-300 hover:text-white border-white/[0.08] hover:border-emerald-500/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Mods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredMods.map((mod, idx) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 6) * 0.06, duration: 0.4 }}
              className="p-5 rounded-2xl glass-card flex flex-col justify-between transition-all group shadow-lg card-lift-cyan cursor-default"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl glass-panel border-white/[0.12] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                    {mod.icon}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold glass-pill text-slate-300 border-white/[0.08]">
                      {mod.category}
                    </span>
                    <div className="flex items-center text-amber-400 text-xs font-mono-code font-bold">
                      <Star className="w-3 h-3 fill-current inline mr-0.5" />
                      {mod.rating.toFixed(1)}
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                  {mod.name}
                </h4>
                
                <span className="text-[11px] font-mono-code text-slate-400 block mb-1">
                  by {mod.author} • {mod.version}
                </span>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <div className="text-[10px] font-mono-code text-slate-400">
                  <span>↓ {mod.downloads}</span>
                  <span className="mx-1">•</span>
                  <span>{mod.size}</span>
                </div>

                <button
                  id={`install-mod-${mod.id}`}
                  type="button"
                  onClick={() => toggleInstall(mod.id)}
                  disabled={installingId === mod.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    mod.installed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md hover:scale-105 active:scale-95'
                  }`}
                >
                  {installingId === mod.id ? (
                    <span>Installing...</span>
                  ) : mod.installed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Installed</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>1-Click Install</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner CTA */}
        <ScrollReveal variant="glass-reveal">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-heavy border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white">Need a Custom Modpack or Plugin Jar?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Drag-and-drop or upload custom .jar and .mcpack files through the mobile in-app file manager.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playLevelUp();
                onOpenDeployWizard();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold font-mono-code text-xs shrink-0 flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Modded Server (45s)</span>
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

