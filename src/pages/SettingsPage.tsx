import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Mail, Hash, Shield, LogOut, Bell, Music } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [ambientSound, setAmbientSound] = React.useState(true);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-400 font-mono-code mt-1">Manage your BlockHost profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              Profile Information
            </h3>
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative group">
                <User className="w-8 h-8 text-emerald-500" />
                <div className="absolute inset-0 bg-emerald-500/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="text-[10px] font-bold text-emerald-950 uppercase">Change</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Nickname</p>
                <div className="text-xl font-bold text-white">{user?.nickname || 'Unknown'}</div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900"><Mail className="w-4 h-4 text-slate-400" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-mono-code text-slate-300">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900"><Hash className="w-4 h-4 text-slate-400" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account ID</p>
                    <p className="text-sm font-mono-code text-slate-300">{user?.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-500" />
              Preferences
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900"><Bell className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" /></div>
                  <div>
                    <p className="text-sm font-bold text-white">Push Notifications</p>
                    <p className="text-xs font-mono-code text-slate-500">Alerts for server status changes</p>
                  </div>
                </div>
                <div className="w-10 h-6 bg-emerald-500 rounded-full relative shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900"><Music className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" /></div>
                  <div>
                    <p className="text-sm font-bold text-white">Sound Effects</p>
                    <p className="text-xs font-mono-code text-slate-500">Play UI interaction sounds</p>
                  </div>
                </div>
                <div 
                  className={`w-10 h-6 rounded-full relative transition-colors ${ambientSound ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-700'}`}
                  onClick={() => {
                    soundManager.playClick();
                    setAmbientSound(!ambientSound);
                  }}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ambientSound ? 'right-1' : 'left-1'}`} />
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <span className="text-2xl font-black">B⃦</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Blockcoin Balance</p>
              <p className="text-3xl font-black text-white mt-1">{user?.blockcoin_balance?.toLocaleString() || '0'}</p>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono-code text-sm shadow-lg shadow-amber-500/20 transition-all">
              Top Up
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Security
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono-code">
              Sign out from this device if you are on a public computer.
            </p>
            <button
              onClick={() => {
                soundManager.playPop();
                logout();
              }}
              className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
