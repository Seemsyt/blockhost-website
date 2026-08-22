import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useParams, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { ArrowLeft, Terminal, Activity, Settings, Package, HardDrive, Shield, Users } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const ServerLayout: React.FC = () => {
  const { id } = useParams();
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiFetch(`/servers/${id}`)
        .then(data => {
          setServer(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="p-10 text-emerald-500">Loading server...</div>;
  }

  if (!server) {
    return <div className="p-10 text-red-500">Server not found.</div>;
  }

  const tabs = [
    { name: 'Control Panel', path: `/dashboard/server/${id}`, icon: <Activity className="w-4 h-4" />, exact: true },
    { name: 'Console', path: `/dashboard/server/${id}/console`, icon: <Terminal className="w-4 h-4" /> },
    { name: 'Settings', path: `/dashboard/server/${id}/settings`, icon: <Settings className="w-4 h-4" /> },
    { name: 'Properties', path: `/dashboard/server/${id}/properties`, icon: <Settings className="w-4 h-4" /> },
    { name: 'Mods', path: `/dashboard/server/${id}/mods`, icon: <Package className="w-4 h-4" /> },
    { name: 'Files', path: `/dashboard/server/${id}/files`, icon: <HardDrive className="w-4 h-4" /> },
    { name: 'Players', path: `/dashboard/server/${id}/players`, icon: <Users className="w-4 h-4" /> },
    { name: 'Backups', path: `/dashboard/server/${id}/backups`, icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#090d16]">
      <div className="p-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard" onClick={() => soundManager.playPop()} className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{server.world_name}</h1>
            <p className="text-xs font-mono-code text-slate-400 mt-1">{server.shareable_address}</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.exact}
              onClick={() => soundManager.playClick()}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg font-mono-code text-sm transition-colors whitespace-nowrap ${
                  isActive ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/50'
                }`
              }
            >
              {tab.icon}
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <Outlet context={{ server, setServer }} />
      </div>
    </div>
  );
};
