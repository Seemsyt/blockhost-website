import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../utils/api';
import { 
  Server, Play, Square, CircleDashed, Plus, Zap, AlertCircle, 
  Cpu, HardDrive, Wifi, Activity, ArrowRight, ServerCrash 
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const DashboardPage: React.FC = () => {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/servers');
      setServers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load servers');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'running': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.2)]';
      case 'stopped': return 'text-slate-400 bg-slate-800/50 border-slate-700/50';
      case 'provisioning': return 'text-amber-400 bg-amber-400/10 border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/30 shadow-[0_0_10px_rgba(248,113,113,0.2)]';
      default: return 'text-slate-400 bg-slate-800/50 border-slate-700/50';
    }
  };

  const getStatusIcon = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'running': return <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>;
      case 'stopped': return <Square className="w-3 h-3 fill-current" />;
      case 'provisioning': return <CircleDashed className="w-3 h-3 animate-spin" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const activeServersCount = servers.filter(s => s.state?.toLowerCase() === 'running').length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 relative">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header & Quick Stats */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-emerald-400 font-mono-code text-xs font-bold tracking-wider uppercase drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]">
                Control Panel
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl font-extrabold text-white tracking-tight"
            >
              My Instances
            </motion.h1>
          </div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            onClick={() => {
              soundManager.playLevelUp();
              window.dispatchEvent(new CustomEvent('open-deploy-wizard'));
            }}
            className="group relative px-6 py-3 rounded-xl font-mono-code text-sm font-extrabold text-slate-950 overflow-hidden shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex-shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 transition-opacity duration-300"></div>
            <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 fill-current drop-shadow-md" />
              <span className="drop-shadow-sm">Deploy New Server</span>
            </div>
          </motion.button>
        </div>

        {/* Quick Stats Row */}
        {!loading && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-mono-code text-slate-400">Total Instances</p>
                <p className="text-2xl font-bold text-white">{servers.length}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-mono-code text-slate-400">Active</p>
                <p className="text-2xl font-bold text-white">{activeServersCount}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-mono-code text-slate-400">vCores Active</p>
                <p className="text-2xl font-bold text-white">{activeServersCount * 4} <span className="text-sm text-slate-500">Cores</span></p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.1)]">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-mono-code text-slate-400">Storage Used</p>
                <p className="text-2xl font-bold text-white">{servers.length * 60} <span className="text-sm text-slate-500">GB</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <span className="text-emerald-400 font-mono-code text-sm animate-pulse">Scanning Cloud Instances...</span>
        </div>
      ) : error ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center h-48 text-center space-y-2">
          <ServerCrash className="w-10 h-10 text-red-400 mb-2" />
          <h3 className="text-lg font-bold text-red-400">Connection Failed</h3>
          <p className="text-sm text-red-400/80">{error}</p>
        </motion.div>
      ) : servers.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-80 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-dashed border-white/10 text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-center shadow-2xl">
            <Server className="w-10 h-10 text-slate-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">No Instances Found</h3>
            <p className="text-sm text-slate-400 font-mono-code mt-2 max-w-sm mx-auto leading-relaxed">
              You haven't deployed any servers yet. Get your first Minecraft server running globally in under 45 seconds.
            </p>
          </div>
          <button
            onClick={() => {
              soundManager.playLevelUp();
              window.dispatchEvent(new CustomEvent('open-deploy-wizard'));
            }}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold font-mono-code text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.1)] hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]"
          >
            <Zap className="w-4 h-4 fill-current" />
            Deploy First Server
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {servers.map((server, idx) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 + 0.3 }}
              >
                <Link
                  to={`/dashboard/server/${server.id}`}
                  onClick={() => soundManager.playPop()}
                  className="group block relative p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-[0_10px_40px_rgba(52,211,153,0.15)] hover:-translate-y-1"
                >
                  {/* Card Glow Effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-[50px] group-hover:bg-emerald-500/30 transition-colors"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 text-[10px] font-mono-code font-bold uppercase tracking-wider ${getStatusColor(server.state)}`}>
                        {getStatusIcon(server.state)}
                        {server.state || 'UNKNOWN'}
                      </div>
                      <span className="text-[10px] font-mono-code text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/20 tracking-wider">
                        {server.flavor?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-extrabold text-white truncate mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-300">
                      {server.world_name || 'Unnamed Server'}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-8">
                      <Wifi className="w-3.5 h-3.5 text-slate-500" />
                      <p className="text-xs font-mono-code text-slate-400 truncate">
                        {server.shareable_address || `${server.minecraft_host}:${server.minecraft_port}`}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Server className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-mono-code text-slate-500 uppercase">Plan</p>
                          <p className="text-xs font-mono-code font-bold text-slate-300">{server.tier?.toUpperCase() || 'STANDARD'}</p>
                        </div>
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-400 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
