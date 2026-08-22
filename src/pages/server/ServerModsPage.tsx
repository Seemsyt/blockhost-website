import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Search, Download, Trash2, Package } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const ServerModsPage: React.FC = () => {
  const { server } = useOutletContext<any>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [installedMods, setInstalledMods] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchInstalledMods();
  }, [server.id]);

  const fetchInstalledMods = async () => {
    try {
      const data = await apiFetch(`/servers/${server.id}/mods`);
      setInstalledMods(data.files || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoadingSearch(true);
    try {
      const data = await apiFetch(`/servers/${server.id}/mods/search?q=${encodeURIComponent(query)}&limit=10`);
      setResults(data.hits || []);
    } catch (err) {
      console.error(err);
      alert('Search failed. Ensure this server supports mods.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const installMod = async (modId: string) => {
    if (actionLoading) return;
    setActionLoading(modId);
    soundManager.playClick();
    try {
      await apiFetch(`/servers/${server.id}/mods/install`, {
        method: 'POST',
        body: JSON.stringify({ modrinth_project_id: modId })
      });
      soundManager.playLevelUp();
      alert('Mod installed successfully!');
      fetchInstalledMods();
    } catch (err: any) {
      alert(`Install failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const uninstallMod = async (filename: string) => {
    if (!window.confirm(`Uninstall ${filename}?`)) return;
    setActionLoading(filename);
    try {
      await apiFetch(`/servers/${server.id}/mods/${filename}`, { method: 'DELETE' });
      soundManager.playPop();
      fetchInstalledMods();
    } catch (err: any) {
      alert(`Uninstall failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Mods Manager</h2>
        <p className="text-sm text-slate-400 font-mono-code">Search, install, and manage Modrinth mods directly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Marketplace */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[600px]">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-emerald-500" />
            Install New Mods
          </h3>
          <form onSubmit={handleSearch} className="mb-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Modrinth..."
              className="w-full bg-[#111] border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white font-mono-code placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </form>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
            {loadingSearch ? (
              <div className="text-emerald-500 text-center mt-10">Searching...</div>
            ) : results.length === 0 ? (
              <div className="text-slate-500 text-center mt-10 text-sm font-mono-code">No search results</div>
            ) : (
              results.map((mod) => (
                <div key={mod.project_id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4 hover:border-emerald-500/30 transition-colors">
                  {mod.icon_url ? (
                    <img src={mod.icon_url} alt={mod.title} className="w-12 h-12 rounded-lg bg-slate-900" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center">
                      <Package className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{mod.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{mod.description}</p>
                  </div>
                  <button
                    onClick={() => installMod(mod.project_id)}
                    disabled={actionLoading === mod.project_id}
                    className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50 shrink-0"
                    title="Install"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Installed Mods */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[600px]">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-slate-400" />
            Installed Mods
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
            {installedMods.length === 0 ? (
              <div className="text-slate-500 text-center mt-10 text-sm font-mono-code">No mods installed</div>
            ) : (
              installedMods.map((modStr, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <Package className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="text-sm font-mono-code text-slate-300 truncate">{modStr}</span>
                  </div>
                  <button
                    onClick={() => uninstallMod(modStr)}
                    disabled={actionLoading === modStr}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
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
