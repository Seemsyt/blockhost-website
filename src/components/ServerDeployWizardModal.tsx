import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, Zap, Server, Smartphone, Globe, 
  Layers, Copy, CheckCircle, ArrowRight, ArrowLeft, RefreshCw, QrCode 
} from 'lucide-react';
import { MinecraftFlavor } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { apiFetch } from '../utils/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialFlavor?: MinecraftFlavor;
  initialRam?: number;
  onOpenDownloadModal: () => void;
}

export const ServerDeployWizardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialFlavor = 'paper',
  initialRam = 4,
  onOpenDownloadModal
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [flavor, setFlavor] = useState<MinecraftFlavor>(initialFlavor);
  const [serverName, setServerName] = useState('My Survival World');
  const [mcVersion, setMcVersion] = useState('1.21.4 (Latest)');
  const [ramGB, setRamGB] = useState(initialRam);
  const [region, setRegion] = useState('us-east');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisionStatusText, setProvisionStatusText] = useState('Initializing daemon...');
  const [deployedIp, setDeployedIp] = useState('');
  const [copiedIp, setCopiedIp] = useState(false);

  useEffect(() => {
    if (initialFlavor) setFlavor(initialFlavor);
  }, [initialFlavor]);

  useEffect(() => {
    if (initialRam) setRamGB(initialRam);
  }, [initialRam]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsProvisioning(false);
      setProvisionProgress(0);
    }
  }, [isOpen]);

  const startDeployment = async () => {
    soundManager.playClick();
    setStep(4);
    setIsProvisioning(true);
    setProvisionProgress(10);
    setProvisionStatusText('Sending deployment request...');

    try {
      const realMcVersion = mcVersion.split(' ')[0];
      const payload = {
        world_name: serverName || 'My Server',
        flavor,
        mc_version: realMcVersion,
        config: {
          max_players: 20,
          gamemode: 'survival',
          difficulty: 'normal',
          bedrock_version: flavor === 'bedrock' ? 'latest' : undefined
        }
      };

      const serverRes = await apiFetch('/servers', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const serverId = serverRes.id;

      setProvisionProgress(40);
      setProvisionStatusText('Provisioning server resources...');

      // Poll until state is running
      let isRunning = false;
      let finalIp = '';
      
      for (let i = 0; i < 30; i++) { // Poll for up to ~60s
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          const statusRes = await apiFetch(`/servers/${serverId}`);
          if (statusRes.state === 'running') {
            isRunning = true;
            finalIp = statusRes.shareable_address || `${statusRes.minecraft_host}:${statusRes.minecraft_port}`;
            break;
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }

      if (isRunning) {
        setProvisionProgress(100);
        setIsProvisioning(false);
        setDeployedIp(finalIp);
        soundManager.playLevelUp();
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 }
        });
      } else {
        setProvisionStatusText('Provisioning taking longer than expected. Check console.');
        setIsProvisioning(false);
        setDeployedIp('pending...');
      }

    } catch (err: any) {
      console.error(err);
      setProvisionStatusText(`Error: ${err.message || 'Failed to deploy'}`);
      setIsProvisioning(false);
    }
  };

  const copyIp = () => {
    soundManager.playPop();
    navigator.clipboard.writeText(deployedIp);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Steps Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-code font-bold uppercase">
              Step {step} of 4
            </span>
            <span className="text-xs font-mono-code text-slate-400">Instant Server Provisioner</span>
          </div>

          <h3 className="text-2xl font-bold text-white">
            {step === 1 && 'Select Your Minecraft Flavor'}
            {step === 2 && 'Server Name & Game Version'}
            {step === 3 && 'Choose RAM & Location'}
            {step === 4 && (isProvisioning ? 'Deploying Server...' : 'Server Ready to Join!')}
          </h3>
        </div>

        {/* STEP 1: FLAVOR SELECTION */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'paper', name: 'Paper 1.21.4', tag: 'Fast Plugins', icon: '⚡' },
                { id: 'purpur', name: 'Purpur Pro', tag: 'Extreme Configs', icon: '🟣' },
                { id: 'bedrock', name: 'Bedrock BDS', tag: 'Mobile Native', icon: '📱' },
                { id: 'fabric', name: 'Fabric Modded', tag: 'Modern Mods', icon: '🧵' },
                { id: 'vanilla', name: 'Vanilla Mojang', tag: 'Pure Survival', icon: '🌿' },
                { id: 'forge', name: 'Forge Modded', tag: 'Heavy Packs', icon: '🔨' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setFlavor(f.id as MinecraftFlavor);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    flavor === f.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl block mb-1">{f.icon}</span>
                  <span className="font-bold text-xs block truncate">{f.name}</span>
                  <span className="text-[10px] font-mono-code text-slate-400">{f.tag}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setStep(2);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SERVER NAME & VERSION */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono-code text-slate-400 block mb-1">Server Display Name</label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="e.g. DreamSMP Season 2"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono-code focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono-code text-slate-400 block mb-1">Minecraft Version</label>
              <select
                value={mcVersion}
                onChange={(e) => setMcVersion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono-code focus:outline-none focus:border-emerald-500"
              >
                <option value="1.21.4 (Latest)">Minecraft 1.21.4 (Recommended Latest)</option>
                <option value="1.20.6">Minecraft 1.20.6</option>
                <option value="1.19.4">Minecraft 1.19.4</option>
                <option value="1.16.5">Minecraft 1.16.5 (Legacy Modpack Stable)</option>
                <option value="1.8.8">Minecraft 1.8.8 (PvP Classic)</option>
              </select>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono-code text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setStep(3);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RAM & LOCATION */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono-code text-slate-400 block mb-1">RAM Capacity</label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 8, 16].map((gb) => (
                  <button
                    key={gb}
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setRamGB(gb);
                    }}
                    className={`py-2 rounded-xl border text-center text-xs font-mono-code font-bold ${
                      ramGB === gb 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {gb} GB
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono-code text-slate-400 block mb-1">Datacenter Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono-code focus:outline-none focus:border-emerald-500"
              >
                <option value="us-east">🇺🇸 US East (Ashburn, VA - 14ms)</option>
                <option value="us-west">🇺🇸 US West (Los Angeles, CA - 22ms)</option>
                <option value="eu-central">🇩🇪 Europe Central (Frankfurt - 18ms)</option>
                <option value="eu-west">🇬🇧 Europe West (London - 16ms)</option>
                <option value="ap-southeast">🇸🇬 Asia Pacific (Singapore - 28ms)</option>
                <option value="ap-northeast">🇯🇵 East Asia (Tokyo - 32ms)</option>
                <option value="sa-east">🇧🇷 South America (São Paulo - 38ms)</option>
                <option value="oc-east">🇦🇺 Oceania (Sydney - 35ms)</option>
              </select>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono-code text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={startDeployment}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 font-bold font-mono-code text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Launch Server in 45s</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PROGRESS & FINAL CONNECT SCREEN */}
        {step === 4 && (
          <div className="space-y-5">
            {isProvisioning ? (
              <div className="py-6 text-center space-y-4">
                <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                <div>
                  <h4 className="text-lg font-bold text-white">{provisionStatusText}</h4>
                  <p className="text-xs font-mono-code text-slate-400 mt-1">
                    Setting up NVMe SSD & Bedrock crossplay bridge...
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${provisionProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <span className="text-3xl block mb-1">🎉</span>
                  <h4 className="text-base font-bold text-emerald-300">Server is Live & Operational!</h4>
                  <p className="text-xs text-slate-300 font-mono-code mt-0.5">
                    {flavor.toUpperCase()} • {ramGB} GB RAM • 20.0 TPS
                  </p>
                </div>

                {/* Address Box with Copy */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono-code text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Server Address</span>
                    <span className="text-emerald-400 font-bold">{deployedIp}</span>
                  </div>

                  <button
                    type="button"
                    onClick={copyIp}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-1"
                  >
                    {copiedIp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIp ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Mobile Manage Card */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                    <QrCode className="w-full h-full text-slate-950" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">Scan to Manage on Phone</h5>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      Open in BlockHost mobile app for live console, player controls, and 1-click backups.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      onClose();
                      onOpenDownloadModal();
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs text-center flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Smartphone className="w-4 h-4 fill-current" />
                    <span>Download Mobile App</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-code text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
