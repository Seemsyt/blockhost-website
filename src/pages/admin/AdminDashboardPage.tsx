import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';
import { Users, Server, DollarSign, Activity, AlertCircle, Play, Square, CircleDashed } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, nodesData, serversData] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/nodes'),
        apiFetch('/admin/servers')
      ]);
      setStats(statsData);
      setNodes(nodesData || []);
      setServers(serversData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const forceStopServer = async (serverId: string) => {
    if (!window.confirm('Force stop this server? Data corruption may occur.')) return;
    try {
      await apiFetch(`/admin/servers/${serverId}/force-stop`, { method: 'POST' });
      fetchAdminData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-rose-500"><CircleDashed className="w-8 h-8 animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-6 m-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Overview</h1>
        <p className="text-sm text-slate-400 font-mono-code mt-1">System-wide monitoring & controls</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'text-blue-400' },
          { label: 'Total Servers', value: stats?.total_servers || 0, icon: Server, color: 'text-indigo-400' },
          { label: 'Active Servers', value: stats?.running_servers || 0, icon: Activity, color: 'text-emerald-400' },
          { label: 'Total Revenue', value: `$${(stats?.total_revenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-rose-400' },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-950 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-mono-code text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Active Nodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.map(node => (
            <div key={node.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white flex items-center gap-2"><Server className="w-4 h-4 text-emerald-500" /> {node.name}</span>
                <span className={`text-xs px-2 py-1 rounded font-mono-code ${node.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{node.status}</span>
              </div>
              <div className="text-sm font-mono-code text-slate-400">
                IP: {node.ip_address}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-mono-code text-slate-500">
                  <span>RAM ({node.used_ram_mb}MB / {node.total_ram_mb}MB)</span>
                  <span>{Math.round((node.used_ram_mb / node.total_ram_mb) * 100) || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(node.used_ram_mb / node.total_ram_mb) * 100}%` }}></div>
                </div>
              </div>
            </div>
          ))}
          {nodes.length === 0 && <p className="text-slate-500 font-mono-code text-sm">No nodes provisioned.</p>}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Recent Servers</h2>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm font-mono-code">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="p-4 font-normal">Server</th>
                <th className="p-4 font-normal">Owner ID</th>
                <th className="p-4 font-normal">State</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {servers.map(server => (
                <tr key={server.id} className="text-slate-300">
                  <td className="p-4">{server.world_name || server.id}</td>
                  <td className="p-4 truncate max-w-[150px]">{server.owner_id}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${server.state === 'running' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {server.state}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {server.state === 'running' && (
                      <button onClick={() => forceStopServer(server.id)} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 justify-end w-full">
                        <Square className="w-3 h-3 fill-current" /> Force Stop
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
