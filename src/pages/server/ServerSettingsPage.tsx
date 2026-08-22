import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Settings2, Globe, Cpu, Hash, Clock, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ServerSoftwareSwitchModal } from '../../components/ServerSoftwareSwitchModal';

export const ServerSettingsPage: React.FC = () => {
  const { server, refreshServer } = useOutletContext<any>();
  const [isSwitching, setIsSwitching] = useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Server Settings</h2>
        <p className="text-sm text-slate-400 font-mono-code">Manage core server configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-500" />
            Connection Details
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Shareable Address</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono-code mt-1 break-all">
                {server.shareable_address || 'Not assigned'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Node IP</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono-code mt-1 break-all">
                  {server.minecraft_host}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Port</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono-code mt-1">
                  {server.minecraft_port}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-500" />
              Software & Hardware
            </h3>
            <button
              onClick={() => {
                soundManager.playPop();
                setIsSwitching(true);
              }}
              className="p-1.5 bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors border border-transparent hover:border-emerald-500/30"
              title="Change Software"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Flavor</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono-code mt-1 capitalize">
                  {server.flavor}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Version</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono-code mt-1">
                  {server.mc_version || 'Latest'}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tier</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono-code font-bold mt-1 uppercase">
                {server.tier}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              setIsSwitching(true);
            }}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold font-mono-code transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Change Software
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-slate-400" />
          General Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="p-3 bg-slate-900 rounded-lg text-slate-400"><Hash className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Server ID</p>
              <p className="font-mono-code text-sm text-white">{server.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="p-3 bg-slate-900 rounded-lg text-slate-400"><Clock className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Created At</p>
              <p className="font-mono-code text-sm text-white">{new Date(server.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <ServerSoftwareSwitchModal
        isOpen={isSwitching}
        onClose={() => setIsSwitching(false)}
        server={server}
        onSuccess={() => {
          if (refreshServer) refreshServer();
        }}
      />
    </div>
  );
};
