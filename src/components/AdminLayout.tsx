import React from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Server, CreditCard, LogOut, ShieldAlert, Cpu } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-emerald-500">Loading...</div>;
  }

  if (!isAuthenticated || !user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-sans">
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 cursor-pointer" onClick={() => soundManager.playPop()}>
            <ShieldAlert className="w-8 h-8 text-rose-500 fill-rose-500/20" />
            <span className="text-xl font-bold tracking-tight text-white">Admin<span className="text-rose-500">Panel</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/admin"
            end
            onClick={() => soundManager.playClick()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-mono-code text-sm transition-colors ${
                isActive ? 'bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              soundManager.playPop();
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors font-mono-code text-sm"
          >
            <LogOut className="w-5 h-5" />
            Exit Admin
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 cursor-pointer" onClick={() => soundManager.playPop()}>
            <ShieldAlert className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            <span className="text-lg font-bold tracking-tight text-white">Admin<span className="text-rose-500">Panel</span></span>
          </Link>
          <button onClick={logout} className="p-2 text-slate-400 hover:text-red-400">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
