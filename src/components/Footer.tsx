import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Zap, ShieldCheck, Heart, Github, Twitter, MessageSquare, Terminal } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  onOpenDeployWizard: () => void;
  onOpenDownloadModal: () => void;
}

export const Footer: React.FC<Props> = ({ onOpenDeployWizard, onOpenDownloadModal }) => {
  return (
    <footer className="bg-[#050810] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Call to Action Box */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 p-8 sm:p-10 mb-16 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl">
            ⛏️
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Run Your Minecraft Server From Your Phone?
          </h3>
          
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join 48,000+ server owners. Deploy Bedrock, Paper, Purpur, or Fabric with 1-click cloud backups and live mobile console.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundManager.playLevelUp();
                onOpenDeployWizard();
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Deploy Server in 45s</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenDownloadModal();
              }}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold font-mono-code text-xs flex items-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Download iOS & Android App</span>
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-3">
            <Link 
              to="/" 
              onClick={() => soundManager.playPop()}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center text-sm">
                  🟩
                </div>
              </div>
              <span className="text-lg font-extrabold text-white">Block<span className="text-emerald-400">Host</span></span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The flagship mobile app for instant Minecraft server creation, live console, backups, mod browsing, and file management across Paper, Purpur, Bedrock, and Vanilla.
            </p>

            <div className="flex items-center gap-2 font-mono-code text-[11px] text-emerald-400 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Link to="/network" className="hover:underline">All 48 Edge Datacenter Nodes Operational</Link>
            </div>
          </div>

          {/* Col 2: Supported Flavors */}
          <div className="space-y-2 font-mono-code">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Flavors & Engines</span>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/flavors" className="hover:text-emerald-400">Paper 1.21.4</Link></li>
              <li><Link to="/flavors" className="hover:text-emerald-400">Purpur Pro</Link></li>
              <li><Link to="/flavors" className="hover:text-emerald-400">Bedrock Dedicated (BDS)</Link></li>
              <li><Link to="/flavors" className="hover:text-emerald-400">Fabric Modded</Link></li>
              <li><Link to="/flavors" className="hover:text-emerald-400">Official Vanilla</Link></li>
              <li><Link to="/flavors" className="hover:text-emerald-400">Forge Modpacks</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigation Routes */}
          <div className="space-y-2 font-mono-code">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Pages & Features</span>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/mobile-app" className="hover:text-emerald-400">Mobile App Simulator</Link></li>
              <li><Link to="/console" className="hover:text-emerald-400">Live Streaming Console</Link></li>
              <li><Link to="/mods" className="hover:text-emerald-400">1-Click Mod Marketplace</Link></li>
              <li><Link to="/pricing" className="hover:text-emerald-400">Hardware & RAM Pricing</Link></li>
              <li><Link to="/network" className="hover:text-emerald-400">Global Datacenters</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-400">FAQ & Connection Guide</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Downloads */}
          <div className="space-y-2 font-mono-code">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Downloads & Access</span>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={onOpenDownloadModal} className="hover:text-emerald-400 text-left cursor-pointer">Apple App Store (iOS 16+)</button></li>
              <li><button onClick={onOpenDownloadModal} className="hover:text-emerald-400 text-left cursor-pointer">TestFlight Beta</button></li>
              <li><button onClick={onOpenDownloadModal} className="hover:text-emerald-400 text-left cursor-pointer">Google Play Store</button></li>
              <li><button onClick={onOpenDownloadModal} className="hover:text-emerald-400 text-left cursor-pointer">Direct APK (v3.5.2)</button></li>
              <li><button onClick={onOpenDeployWizard} className="hover:text-emerald-400 text-left text-emerald-400 font-bold cursor-pointer">Instant Deploy Wizard →</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} BlockHost Inc. All rights reserved. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/faq" className="hover:text-slate-400 cursor-pointer">Privacy Policy</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-slate-400 cursor-pointer">Terms of Service</Link>
            <span>•</span>
            <Link to="/network" className="hover:text-emerald-400 cursor-pointer flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>Status (20.0 TPS)</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
