import React from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, LogOut, Hexagon, Settings } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-emerald-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 cursor-pointer" onClick={() => soundManager.playPop()}>
            <Hexagon className="w-8 h-8 text-emerald-500 fill-emerald-500/20" />
            <span className="text-xl font-bold tracking-tight text-white">Block<span className="text-emerald-500">Host</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/dashboard"
            end
            onClick={() => soundManager.playClick()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-mono-code text-sm transition-colors ${
                isActive ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            My Servers
          </NavLink>
          
          <NavLink
            to="/dashboard/settings"
            onClick={() => soundManager.playClick()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-mono-code text-sm transition-colors ${
                isActive ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 mb-2">
            <User className="w-5 h-5 text-emerald-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.nickname}</p>
              <p className="text-[10px] font-mono-code text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors font-mono-code text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header (visible only on small screens) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 cursor-pointer" onClick={() => soundManager.playPop()}>
            <Hexagon className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
            <span className="text-lg font-bold tracking-tight text-white">Block<span className="text-emerald-500">Host</span></span>
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
