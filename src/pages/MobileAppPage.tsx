import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, Bell, Shield, Lock, WifiOff, FileCode, 
  Download, Zap, CheckCircle2, QrCode, Sparkles, RefreshCw, Cpu 
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MobileFeaturesSection } from '../components/MobileFeaturesSection';
import { soundManager } from '../utils/audio';

interface Props {
  onOpenDeployWizard: () => void;
  onOpenDownloadModal: () => void;
}

export const MobileAppPage: React.FC<Props> = ({
  onOpenDeployWizard,
  onOpenDownloadModal
}) => {
  const [activeAlert, setActiveAlert] = useState<'crash' | 'join' | 'tps' | 'backup'>('crash');

  const alertDemos = {
    crash: {
      title: '⚠️ Server Watchdog Alert',
      body: 'Horizon SMP stopped unexpectedly! Auto-restarting in 5s. Tap to view crash trace.',
      time: 'Just now',
      tag: 'Critical'
    },
    join: {
      title: '👥 Player Milestone',
      body: '25 players now online on Bedrock & Java! Server TPS: 20.0 (Healthy)',
      time: '2m ago',
      tag: 'Milestone'
    },
    tps: {
      title: '⚡ TPS Optimization',
      body: 'Redstone tick lag detected in chunk [X: 120, Z: -450]. Auto-cleared 80 loose items.',
      time: '12m ago',
      tag: 'Performance'
    },
    backup: {
      title: '☁️ S3 Cloud Backup Complete',
      body: 'Nightly snapshot #482 (2.4 GB) successfully archived with SHA256 checksum.',
      time: '1h ago',
      tag: 'System'
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      {/* Route Header */}
      <PageHeader
        badge="BlockHost Mobile App v3.5"
        badgeIcon={<Smartphone className="w-3.5 h-3.5" />}
        title="Your Entire Minecraft Server Cloud"
        highlightedTitle="In Your Pocket."
        description="Manage live terminals, player moderation, 1-click modpacks, YAML configs, and S3 backups directly from your smartphone with native iOS & Android performance."
        crumbs={[{ label: 'Mobile App' }]}
      />

      {/* Main Interactive Phone Simulator Component */}
      <MobileFeaturesSection
        onOpenDeployWizard={onOpenDeployWizard}
        onOpenDownloadModal={onOpenDownloadModal}
      />

      {/* Deep Dive Section: Push Notifications & Lock Screen Alerts */}
      <section className="py-20 bg-[#070a12] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-code text-cyan-400">
                <Bell className="w-3.5 h-3.5" />
                <span>Real-Time Push Notifications</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Never Miss a Server Crash or Griefing Incident Again.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Stay updated even when the app is closed. Configure granular push notifications for server state changes, TPS drops below 18.0, new player joins, or automatic night backups.
              </p>

              {/* Interactive Alert Selector */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono-code text-slate-400 block font-bold uppercase">
                  Test Push Alert Types:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['crash', 'join', 'tps', 'backup'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        soundManager.playPop();
                        setActiveAlert(type);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-mono-code font-bold capitalize transition-all ${
                        activeAlert === type
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {type} Alert
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Simulated Smartphone Lock Screen Alert Banner */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
                <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 pb-2 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-white font-bold">
                    <Smartphone className="w-4 h-4 text-emerald-400" /> iPhone Lock Screen
                  </span>
                  <span>9:41 AM</span>
                </div>

                {/* Animated Notification Card */}
                <motion.div
                  key={activeAlert}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-xl space-y-2 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-xs text-black font-black">
                        BH
                      </div>
                      <span className="font-bold text-xs text-white">BlockHost</span>
                      <span className="text-[10px] font-mono-code text-slate-400">• {alertDemos[activeAlert].time}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {alertDemos[activeAlert].tag}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{alertDemos[activeAlert].title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{alertDemos[activeAlert].body}</p>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => soundManager.playLevelUp()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold font-mono-code text-[11px]"
                    >
                      Open Live Tail
                    </button>
                    <button
                      type="button"
                      onClick={() => soundManager.playClick()}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-mono-code text-[11px]"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Grid of 4 Core Mobile Capabilities */}
      <section className="py-20 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Engineered Specifically For Mobile Administering</h2>
            <p className="text-slate-300 text-sm">
              Standard web panels are clunky on touchscreen phones. BlockHost was built from the ground up with native gestures, zero battery drain, and offline queueing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 card-lift cursor-default">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">FaceID & Biometric Lock</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Protect your server against unauthorized console commands with biometric lock before sending /op or /stop.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 card-lift-cyan cursor-default">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl">
                <WifiOff className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Offline Command Queue</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In an elevator or on spotty cellular? Queue whitelist, ban, and config commands—they execute the second you reconnect.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 card-lift-purple cursor-default">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 text-xl">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Mobile YAML Editor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Custom mobile syntax editor with indentation guides and validation to prevent broken server.properties or Bukkit configs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 card-lift-amber cursor-default">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Battery Optimized Daemon</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ultra-lightweight binary WebSocket protocol uses under 1% battery per day during background console listening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-16 bg-[#070a12] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Download BlockHost for iOS & Android Today</h2>
          <p className="text-slate-300 text-sm">
            Join over 48,000 server creators who run their worlds seamlessly on their phones.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                soundManager.playLevelUp();
                onOpenDownloadModal();
              }}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Get iOS & Android App</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenDeployWizard();
              }}
              className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold font-mono-code text-xs flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Launch Cloud Server</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
