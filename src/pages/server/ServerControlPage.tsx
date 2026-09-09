import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Play, Square, RefreshCw, Cpu, MemoryStick, Users, Power, Activity, Shield, Trash2, MapPin, UserX, MessageSquare, Sun, CloudRain, CloudLightning, Clock } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const ServerControlPage: React.FC = () => {
  const { server, setServer } = useOutletContext<any>();
  const [stats, setStats] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Advanced Controls State
  const [targetPlayer, setTargetPlayer] = useState('');
  const [sayMessage, setSayMessage] = useState('');
  const [tpCoords, setTpCoords] = useState({ x: '', y: '', z: '' });
  const [bannedPlayers, setBannedPlayers] = useState<string[]>([]);

  const fetchStats = async () => {
    try {
      const data = await apiFetch(`/servers/${server.id}/stats`);
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const fetchBannedPlayers = async () => {
    try {
      const data = await apiFetch(`/servers/${server.id}/blocklist`);
      setBannedPlayers(data || []);
    } catch (err) {
      console.error("Failed to load blocklist", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBannedPlayers();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [server.id]);

  const handlePowerAction = async (action: 'start' | 'stop' | 'toggle' | 'reprovision') => {
    if (actionLoading) return;
    setActionLoading(true);
    soundManager.playLevelUp();
    try {
      const data = await apiFetch(`/servers/${server.id}/${action}`, { method: 'POST' });
      setServer(data.server);
    } catch (err) {
      alert(`Action failed: ${err}`);
    } finally {
      setActionLoading(false);
    }
  };

  const runCommand = async (endpoint: string, payload: any) => {
    if (!server || server.state !== 'running') {
      alert("Server must be running to execute commands.");
      return;
    }
    soundManager.playClick();
    try {
      await apiFetch(`/servers/${server.id}/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      soundManager.playLevelUp();
    } catch (err: any) {
      soundManager.playPop();
      alert(`Command failed: ${err.message}`);
    }
  };

  const isRunning = server.state === 'running';
  const cpuPercent = stats?.cpu_percent ?? 0;
  const cpuUsageNormalized = Math.min(cpuPercent / 100, 1.0);
  const ramPercent = stats?.memory_limit_bytes ? (stats.memory_usage_bytes / stats.memory_limit_bytes) * 100 : 0;
  const ramUsageNormalized = Math.min(ramPercent / 100, 1.0);
  const onlinePlayers = stats?.online_players ?? 0;
  const onlinePlayersList: any[] = stats?.online_players_list || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Top Stats Row */}
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

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Cpu className="w-5 h-5" />
            <h3 className="font-bold flex-1">CPU Usage</h3>
            <span className="text-sm font-mono-code text-white font-bold">{cpuPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-out rounded-full" 
              style={{ width: `${cpuUsageNormalized * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <MemoryStick className="w-5 h-5" />
            <h3 className="font-bold flex-1">RAM Usage</h3>
            <span className="text-sm font-mono-code text-white font-bold">{ramPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000 ease-out rounded-full" 
              style={{ width: `${ramUsageNormalized * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Users className="w-5 h-5" />
            <h3 className="font-bold">Players</h3>
          </div>
          <div className="text-2xl font-black font-mono-code text-emerald-400">
            {onlinePlayers} <span className="text-sm text-slate-500">/ {stats?.players_max || 20}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Power & World Controls */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Power Controls */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-emerald-500 w-6 h-6" />
              Power
            </h2>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handlePowerAction('start')}
                disabled={isRunning || actionLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold font-mono-code bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors disabled:opacity-50 disabled:pointer-events-none border border-emerald-500/20"
              >
                <Play className="w-5 h-5 fill-current" /> START SERVER
              </button>
              
              <button
                onClick={() => handlePowerAction('stop')}
                disabled={!isRunning || actionLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold font-mono-code bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none border border-red-500/20"
              >
                <Square className="w-5 h-5 fill-current" /> STOP SERVER
              </button>
              
              <button
                onClick={() => {
                  if(window.confirm("Are you sure you want to reprovision this server? This will rebuild the container but preserve world data.")) {
                    handlePowerAction('reprovision');
                  }
                }}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold font-mono-code bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors disabled:opacity-50 disabled:pointer-events-none border border-amber-500/20"
              >
                <RefreshCw className="w-5 h-5" /> FORCE REPROVISION
              </button>
            </div>
          </div>

          {/* World Controls */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 opacity-90 hover:opacity-100 transition-opacity">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="text-emerald-500 w-5 h-5" />
              World & Environment
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['day', 'noon', 'sunset', 'night'].map(t => (
                    <button key={t} onClick={() => runCommand('time', { value: t })} className="py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono-code border border-slate-800 capitalize transition-colors">
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sun className="w-4 h-4" /> Weather
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => runCommand('weather', { weather: 'clear' })} className="py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono-code border border-slate-800 transition-colors flex items-center justify-center gap-1"><Sun className="w-3 h-3"/> Clear</button>
                  <button onClick={() => runCommand('weather', { weather: 'rain' })} className="py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono-code border border-slate-800 transition-colors flex items-center justify-center gap-1"><CloudRain className="w-3 h-3"/> Rain</button>
                  <button onClick={() => runCommand('weather', { weather: 'thunder' })} className="py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono-code border border-slate-800 transition-colors flex items-center justify-center gap-1"><CloudLightning className="w-3 h-3"/> Thunder</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Broadcast
                </label>
                <div className="flex gap-2">
                  <input type="text" value={sayMessage} onChange={e => setSayMessage(e.target.value)} placeholder="Message all players..." className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500/50 outline-none" />
                  <button onClick={() => { runCommand('say', { message: sayMessage }); setSayMessage(''); }} className="px-4 bg-emerald-500 text-slate-950 font-bold rounded-lg text-sm hover:bg-emerald-400">Say</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Player Management */}
        <div className="xl:col-span-2 space-y-8">
          
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="text-emerald-500 w-6 h-6" />
              Player Management
            </h2>

            <div className="space-y-6">
              {/* Target Selector */}
              <div>
                <label className="text-sm font-bold text-slate-400 mb-2 block">Target Player (Online or Offline)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={targetPlayer}
                    onChange={(e) => setTargetPlayer(e.target.value)}
                    placeholder="Enter player name..." 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none font-mono-code"
                  />
                </div>
                {onlinePlayersList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs text-slate-500 mt-1">Online:</span>
                    {onlinePlayersList.map((p: any) => {
                      const name = p.name || p;
                      return (
                        <button key={name} onClick={() => setTargetPlayer(name)} className={`px-2 py-1 rounded border text-xs font-mono-code transition-colors ${targetPlayer === name ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}>
                          {name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => targetPlayer && runCommand('op', { player: targetPlayer, grant: true })} disabled={!targetPlayer} className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl flex flex-col items-center gap-2 transition-colors disabled:opacity-30">
                  <Shield className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wide">Grant OP</span>
                </button>
                <button onClick={() => targetPlayer && runCommand('op', { player: targetPlayer, grant: false })} disabled={!targetPlayer} className="p-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl flex flex-col items-center gap-2 transition-colors disabled:opacity-30">
                  <Shield className="w-5 h-5 opacity-50" />
                  <span className="text-xs font-bold uppercase tracking-wide">Revoke OP</span>
                </button>
                <button onClick={() => targetPlayer && runCommand('clear-inventory', { player: targetPlayer })} disabled={!targetPlayer} className="p-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl flex flex-col items-center gap-2 transition-colors disabled:opacity-30">
                  <Trash2 className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wide">Clear Inv</span>
                </button>
                <button onClick={() => targetPlayer && runCommand('kick', { player: targetPlayer })} disabled={!targetPlayer} className="p-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-xl flex flex-col items-center gap-2 transition-colors disabled:opacity-30">
                  <UserX className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wide">Kick</span>
                </button>
              </div>

              {/* Gamemode & TP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Set Gamemode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['survival', 'creative', 'adventure', 'spectator'].map(mode => (
                      <button key={mode} onClick={() => targetPlayer && runCommand('gamemode', { player: targetPlayer, mode })} disabled={!targetPlayer} className="py-2 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 capitalize disabled:opacity-30 transition-colors">
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1"><MapPin className="w-4 h-4"/> Teleport To Coords</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="X" value={tpCoords.x} onChange={e=>setTpCoords(prev=>({...prev, x: e.target.value}))} className="w-16 bg-slate-950 border border-slate-800 rounded-lg text-center text-sm text-white font-mono-code focus:border-emerald-500/50 outline-none" />
                    <input type="number" placeholder="Y" value={tpCoords.y} onChange={e=>setTpCoords(prev=>({...prev, y: e.target.value}))} className="w-16 bg-slate-950 border border-slate-800 rounded-lg text-center text-sm text-white font-mono-code focus:border-emerald-500/50 outline-none" />
                    <input type="number" placeholder="Z" value={tpCoords.z} onChange={e=>setTpCoords(prev=>({...prev, z: e.target.value}))} className="w-16 bg-slate-950 border border-slate-800 rounded-lg text-center text-sm text-white font-mono-code focus:border-emerald-500/50 outline-none" />
                    <button 
                      onClick={() => targetPlayer && runCommand('teleport', { player: targetPlayer, x: Number(tpCoords.x), y: Number(tpCoords.y), z: Number(tpCoords.z) })} 
                      disabled={!targetPlayer || !tpCoords.x || !tpCoords.y || !tpCoords.z}
                      className="flex-1 bg-emerald-500 text-slate-950 rounded-lg text-sm font-bold disabled:opacity-30 hover:bg-emerald-400"
                    >
                      TP
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Banned Players */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 opacity-90">
            <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
              <UserX className="w-5 h-5" />
              Banned Players List
            </h2>
            
            {bannedPlayers.length === 0 ? (
              <p className="text-sm text-slate-500 font-mono-code">No banned players.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {bannedPlayers.map(p => (
                  <div key={p} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono-code">
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
