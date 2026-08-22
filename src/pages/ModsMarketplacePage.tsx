import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Upload, Download, Check, Star, 
  Layers, ShieldCheck, Flame, ArrowRight, Zap, FolderUp 
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ModsBrowserSection } from '../components/ModsBrowserSection';
import { soundManager } from '../utils/audio';

interface Props {
  onOpenDeployWizard: () => void;
}

export const ModsMarketplacePage: React.FC<Props> = ({ onOpenDeployWizard }) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(['geyser-spigot.jar', 'luckperms-5.4.jar']);
  const [isDragging, setIsDragging] = useState(false);

  const curatedModpacks = [
    {
      name: 'Cobblemon Official (Pokémon in Minecraft)',
      flavor: 'Fabric 1.21.4',
      ram: '6 GB+',
      downloads: '14.2M',
      desc: 'Open-source Pokémon mod featuring 500+ catchable Pokémon, animated battle loops, and PC storage boxes.',
      tag: 'Adventure'
    },
    {
      name: 'Better MC [FABRIC] 1.21',
      flavor: 'Fabric 1.21.4',
      ram: '8 GB+',
      downloads: '22.8M',
      desc: 'Minecraft 2.0 concept with 150+ biomes, new boss fights, dungeons, quality-of-life UI, and overhauled nether.',
      tag: 'Overhaul'
    },
    {
      name: 'All The Mods 9 (ATM9)',
      flavor: 'Forge / NeoForge',
      ram: '10 GB+',
      downloads: '18.5M',
      desc: 'The ultimate kitchen-sink modpack featuring GregTech, Mekanism, Applied Energistics, and the ATM Star quest.',
      tag: 'Heavy Tech'
    },
    {
      name: 'Prominence II [RPG]',
      flavor: 'Fabric 1.21',
      ram: '8 GB+',
      downloads: '9.4M',
      desc: 'Rich story-driven RPG with custom talent trees, artifact weapons, voice-acted bosses, and MMO combat.',
      tag: 'Action RPG'
    }
  ];

  const handleSimulatedUpload = (fileName: string) => {
    soundManager.playLevelUp();
    setUploadedFiles(prev => [fileName, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      {/* Route Header */}
      <PageHeader
        badge="CurseForge & Modrinth Marketplace"
        badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
        title="50,000+ Mods & Plugins"
        highlightedTitle="Installed In 1-Click."
        description="Browse thousands of verified plugins and mods with automatic dependency resolution. Or upload your custom .jar files and Bedrock .mcpack addons straight from your phone."
        crumbs={[{ label: '1-Click Mods & Plugins' }]}
      />

      {/* Main Mods Browser Component */}
      <ModsBrowserSection onOpenDeployWizard={onOpenDeployWizard} />

      {/* Featured 1-Click Modpacks Collection */}
      <section className="py-20 bg-[#070a12] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-code text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Pre-Configured Modpacks</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Popular 1-Click Server Modpacks</h2>
            <p className="text-slate-300 text-sm">
              Deploy complex 200+ mod setups instantly with pre-allocated memory limits and tuned JVM flags.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curatedModpacks.map((pack) => (
              <div
                key={pack.name}
                className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl flex flex-col justify-between card-lift cursor-default"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-slate-900 text-emerald-400 border border-emerald-500/30">
                      {pack.flavor}
                    </span>
                    <span className="text-xs font-mono-code text-slate-400">
                      Rec: {pack.ram}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white">{pack.name}</h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {pack.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono-code text-slate-500">↓ {pack.downloads} downloads</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playLevelUp();
                      onOpenDeployWizard();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Deploy Modpack</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Jar / Plugin Upload Dropzone Section */}
      <section className="py-20 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Upload Custom .jar or .mcaddon Files</h2>
            <p className="text-slate-300 text-sm">
              Have a proprietary plugin or private community mod? Drag and drop or upload files to your server directory.
            </p>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleSimulatedUpload('custom-pvp-plugin-v1.0.jar');
            }}
            className={`p-8 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/10'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
            }`}
            onClick={() => handleSimulatedUpload('my-custom-datapack.zip')}
          >
            <FolderUp className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Click to browse or drop file here</h3>
            <p className="text-xs text-slate-400 font-mono-code">
              Supports .jar, .mcpack, .mcaddon, .zip (Max file size: 2 GB)
            </p>
          </div>

          {/* Uploaded File List */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-mono-code font-bold text-slate-400 block uppercase">
              Installed Root Plugins & Jars:
            </span>
            <div className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono-code">
                  <span className="text-white flex items-center gap-2">
                    <span className="text-emerald-400">📦</span> {file}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
