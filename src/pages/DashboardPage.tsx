import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { Server, Play, Square, CircleDashed, Plus, Zap, AlertCircle } from 'lucide-react';
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
    switch (state) {
      case 'running': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'stopped': return 'text-slate-400 bg-slate-800/50 border-slate-700/50';
      case 'provisioning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-800/50 border-slate-700/50';
    }
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'running': return <Play className="w-3.5 h-3.5 fill-current" />;
      case 'stopped': return <Square className="w-3.5 h-3.5 fill-current" />;
      case 'provisioning': return <CircleDashed className="w-3.5 h-3.5 animate-spin" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Servers</h1>
          <p className="text-sm text-slate-400 font-mono-code mt-1">Manage your Minecraft instances</p>
        </div>
        <button
          onClick={() => {
            soundManager.playLevelUp();
            // In a real app this might open the deploy wizard from App.tsx or navigate to a deploy page
            window.dispatchEvent(new CustomEvent('open-deploy-wizard'));
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
        >
          <Zap className="w-4 h-4 fill-current" />
          Deploy Server
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-emerald-500">
          <CircleDashed className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      ) : servers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-3xl text-center space-y-4">
          <Server className="w-12 h-12 text-slate-600" />
          <div>
            <h3 className="text-lg font-bold text-white">No servers found</h3>
            <p className="text-sm text-slate-400 font-mono-code mt-1">Deploy your first server in 45 seconds.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <Link
              key={server.id}
              to={`/dashboard/server/${server.id}`}
              onClick={() => soundManager.playPop()}
              className="group block p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all card-lift"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[10px] font-mono-code font-bold uppercase ${getStatusColor(server.state)}`}>
                  {getStatusIcon(server.state)}
                  {server.state || 'UNKNOWN'}
                </div>
                <span className="text-[10px] font-mono-code text-slate-500 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                  {server.flavor?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white truncate mb-1 group-hover:text-emerald-400 transition-colors">
                {server.world_name || 'Unnamed Server'}
              </h3>
              <p className="text-xs font-mono-code text-slate-400 mb-6 truncate">
                {server.shareable_address || `${server.minecraft_host}:${server.minecraft_port}`}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-mono-code text-slate-500">
                <span>{server.tier?.toUpperCase() || 'STANDARD'} PLAN</span>
                <span className="flex items-center gap-1 text-slate-300">
                  Manage <span className="text-emerald-500">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
