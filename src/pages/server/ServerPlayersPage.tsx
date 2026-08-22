import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Users, UserX, ShieldBan, Swords } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const ServerPlayersPage: React.FC = () => {
  const { server } = useOutletContext<any>();
  const [bans, setBans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [banName, setBanName] = useState('');
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    fetchBans();
  }, [server.id]);

  const fetchBans = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/servers/${server.id}/bans`);
      setBans(data.bans || []);
    } catch (err) {
      console.error("Failed to fetch bans", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banName.trim() || actionLoading) return;
    setActionLoading(true);
    soundManager.playClick();
    try {
      await apiFetch(`/servers/${server.id}/bans`, {
        method: 'POST',
        body: JSON.stringify({ player_name: banName, reason: banReason, xuid: 'offline-ban' })
      });
      soundManager.playLevelUp();
      setBanName('');
      setBanReason('');
      fetchBans();
    } catch (err: any) {
      alert(`Ban failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async (banId: string) => {
    setActionLoading(true);
    try {
      await apiFetch(`/servers/${server.id}/bans/${banId}`, { method: 'DELETE' });
      soundManager.playPop();
      fetchBans();
    } catch (err: any) {
      alert(`Unban failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Player Management</h2>
        <p className="text-sm text-slate-400 font-mono-code">Manage bans, blocklists, and online players.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6">
            <ShieldBan className="w-5 h-5 text-red-500" />
            Ban a Player
          </h3>
          
          <form onSubmit={handleBan} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Player Name / Gamertag</label>
              <input
                type="text"
                value={banName}
                onChange={e => setBanName(e.target.value)}
                placeholder="e.g. Steve"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white font-mono-code placeholder:text-slate-600 focus:outline-none focus:border-red-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reason (Optional)</label>
              <input
                type="text"
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                placeholder="e.g. Griefing"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white font-mono-code placeholder:text-slate-600 focus:outline-none focus:border-red-500/50"
              />
            </div>
            <button
              type="submit"
              disabled={actionLoading || !banName.trim()}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold font-mono-code disabled:opacity-50 transition-colors"
            >
              Issue Ban
            </button>
          </form>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[400px]">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6">
            <UserX className="w-5 h-5 text-slate-400" />
            Active Bans
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
            {loading ? (
              <div className="text-emerald-500 text-center">Loading...</div>
            ) : bans.length === 0 ? (
              <div className="text-slate-500 text-center text-sm font-mono-code pt-10">No banned players.</div>
            ) : (
              bans.map(ban => (
                <div key={ban.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between group">
                  <div>
                    <h4 className="font-bold text-red-400 text-sm">{ban.player_name}</h4>
                    <p className="text-xs font-mono-code text-slate-500 mt-1">{ban.reason || 'No reason specified'}</p>
                  </div>
                  <button
                    onClick={() => handleUnban(ban.id)}
                    disabled={actionLoading}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-bold font-mono-code transition-colors disabled:opacity-50"
                  >
                    Pardon
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
