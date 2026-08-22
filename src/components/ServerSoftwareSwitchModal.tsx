import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { soundManager } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  server: any;
  onSuccess: () => void;
}

export const ServerSoftwareSwitchModal: React.FC<Props> = ({ isOpen, onClose, server, onSuccess }) => {
  const [flavor, setFlavor] = useState(server.flavor || 'bedrock');
  const [version, setVersion] = useState(server.mc_version || 'latest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // In a real app we might fetch available versions from the API here
  // For now, we provide some basic options
  const flavors = [
    { id: 'bedrock', name: 'Bedrock (Vanilla)', desc: 'Official vanilla server for Bedrock Edition clients.' },
    { id: 'pocketmine', name: 'PocketMine-MP', desc: 'Custom server for plugins. No vanilla mob AI.' },
    { id: 'paper', name: 'Paper (Java)', desc: 'High performance Java server with plugin support.' },
    { id: 'fabric', name: 'Fabric (Java)', desc: 'Lightweight Java modding platform.' },
    { id: 'forge', name: 'Forge (Java)', desc: 'Heavy duty Java modding platform.' },
  ];

  const handleSwitch = async () => {
    if (!flavor) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/servers/${server.id}/switch-software`, {
        method: 'POST',
        body: JSON.stringify({
          target_flavor: flavor,
          target_mc_version: version
        })
      });
      soundManager.playLevelUp();
      onSuccess();
      onClose();
    } catch (err: any) {
      soundManager.playPop();
      setError(err.message || 'Failed to switch software');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden my-8"
        >
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-emerald-500" />
                  Switch Software
                </h3>
                <p className="text-sm text-slate-400 font-mono-code mt-1">Change your server flavor and version.</p>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-400 text-sm font-mono-code">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block mb-1">Warning: Backup highly recommended!</strong>
                Switching software might corrupt world data or make plugins incompatible. 
                Ensure your server is stopped before continuing.
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Select Flavor</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {flavors.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      soundManager.playClick();
                      setFlavor(f.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      flavor === f.id
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold font-mono-code text-white">{f.name}</span>
                      {flavor === f.id && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-xs leading-relaxed opacity-80">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Version (Optional)</h4>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. latest, 1.20.4"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono-code text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-slate-500 font-mono-code">Leave as 'latest' for the newest version.</p>
            </div>

            <button
              onClick={handleSwitch}
              disabled={loading || !flavor}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                  Applying Changes...
                </>
              ) : (
                'Switch Software'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
