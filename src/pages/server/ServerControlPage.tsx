import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Play, Square, RefreshCw, Cpu, MemoryStick, Users, Power, Activity } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const ServerControlPage: React.FC = () => {
  const { server, setServer } = useOutletContext<any>();
  const [stats, setStats] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await apiFetch(`/servers/${server.id}/stats`);
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [server.id]);

  const handleAction = async (action: 'start' | 'stop' | 'toggle' | 'reprovision') => {
    if (actionLoading) return;
    setActionLoading(true);
    soundManager.playLevelUp();
    try {
      const data = await apiFetch(`/servers/${server.id}/${action}`, { method: 'POST' });
      setServer(data.server); // Update server state
    } catch (err) {
      alert(`Action failed: ${err}`);
    } finally {
      setActionLoading(false);
    }
  };

  const isRunning = server.state === 'running';
  const cpuPercent = stats?.cpu_percent ?? 0;
  const ramPercent = stats?.memory_limit_bytes ? (stats.memory_usage_bytes / stats.memory_limit_bytes) * 100 : 0;
  const onlinePlayers = stats?.online_players ?? 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Power className="w-5 h-5" />
            <h3 className="font-bold">Status</h3>
          </div>
          <div className={`text-2xl font-black font-mono-code ${isRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
            {server.state.toUpperCase()}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Cpu className="w-5 h-5" />
            <h3 className="font-bold">CPU Usage</h3>
          </div>
          <div className="text-2xl font-black font-mono-code text-white">
            {cpuPercent.toFixed(1)}%
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <MemoryStick className="w-5 h-5" />
            <h3 className="font-bold">RAM Usage</h3>
          </div>
          <div className="text-2xl font-black font-mono-code text-white">
            {ramPercent.toFixed(1)}%
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Users className="w-5 h-5" />
            <h3 className="font-bold">Players</h3>
          </div>
          <div className="text-2xl font-black font-mono-code text-emerald-400">
            {onlinePlayers} <span className="text-sm text-slate-500">/ 20</span>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="text-emerald-500 w-6 h-6" />
          Power Controls
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleAction('start')}
            disabled={isRunning || actionLoading}
            className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 rounded-xl font-bold font-mono-code bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors disabled:opacity-50 disabled:pointer-events-none border border-emerald-500/20"
          >
            <Play className="w-5 h-5 fill-current" /> START
          </button>
          
          <button
            onClick={() => handleAction('stop')}
            disabled={!isRunning || actionLoading}
            className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 rounded-xl font-bold font-mono-code bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none border border-red-500/20"
          >
            <Square className="w-5 h-5 fill-current" /> STOP
          </button>
          
          <button
            onClick={() => {
              if(window.confirm("Are you sure you want to reprovision this server? This will rebuild the container but preserve world data.")) {
                handleAction('reprovision');
              }
            }}
            disabled={actionLoading}
            className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 rounded-xl font-bold font-mono-code bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors disabled:opacity-50 disabled:pointer-events-none border border-amber-500/20"
          >
            <RefreshCw className="w-5 h-5" /> REPROVISION
          </button>
        </div>
      </div>
    </div>
  );
};
