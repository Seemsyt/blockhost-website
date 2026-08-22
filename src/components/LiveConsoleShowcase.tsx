import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal, Send, ShieldAlert, Sparkles, RefreshCw, Bell, Search, Copy, Check, Zap } from 'lucide-react';
import { ConsoleLogLine } from '../types';
import { soundManager } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { apiFetch, API_BASE_URL, getAuthToken } from '../utils/api';

const DEMO_LOGS: ConsoleLogLine[] = [
  { id: '1', timestamp: '14:30:10', level: 'SYSTEM', message: '[BlockHost Bridge] WebSocket connected securely on TLS v1.3 (Latency: 11ms)' },
  { id: '2', timestamp: '14:30:11', level: 'INFO', message: '[Paper] Loaded 84 plugin jars with 0 dependency conflicts.' },
  { id: '3', timestamp: '14:30:12', level: 'INFO', message: '[LuckPerms] Loaded 4 permission groups (default, vip, mod, admin) from SQLite.' },
  { id: '4', timestamp: '14:30:15', level: 'CHAT', message: '§b<Alex_Pro>§r: Hello everyone! Just joined from Pocket Edition iOS!' },
  { id: '5', timestamp: '14:30:18', level: 'CHAT', message: '§a<Admin_Steve>§r: Welcome Alex! Server TPS is currently 20.0.' },
  { id: '6', timestamp: '14:30:25', level: 'WARN', message: '[LagDetector] Async chunk save completed in 14ms (Healthy: <50ms)' },
  { id: '7', timestamp: '14:30:30', level: 'SYSTEM', message: '[Push Notification] Alert sent to mobile: 24 players now online.' }
];

export const LiveConsoleShowcase: React.FC = () => {
  const [logs, setLogs] = useState<ConsoleLogLine[]>(DEMO_LOGS);
  const [inputVal, setInputVal] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [copiedConsole, setCopiedConsole] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logContainerRef.current?.scrollTo({ top: logContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  const { user, isAuthenticated } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    let activeWs: WebSocket | null = null;
    
    const connectWs = async () => {
      if (!isAuthenticated) return;
      try {
        const servers = await apiFetch('/servers');
        if (!servers || servers.length === 0) return;
        const serverId = servers[0].id;
        
        const wsUrl = API_BASE_URL.replace('http', 'ws') + `/servers/${serverId}/console/ws?token=${getAuthToken()}`;
        const newWs = new WebSocket(wsUrl);
        
        newWs.onmessage = (event) => {
          setLogs(prev => {
            const newLogs = [...prev, { id: Date.now().toString() + Math.random(), timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: event.data }];
            return newLogs.slice(-100);
          });
        };
        
        newWs.onopen = () => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'SYSTEM', message: '[BlockHost Bridge] WebSocket connected securely.' }]);
        };

        newWs.onclose = () => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'WARN', message: '[BlockHost Bridge] Connection closed.' }]);
        };

        setWs(newWs);
        activeWs = newWs;
      } catch (err) {
        console.error("Failed to connect websocket", err);
      }
    };
    
    connectWs();
    
    return () => {
      if (activeWs) activeWs.close();
    };
  }, [isAuthenticated]);
  
  const sendCommand = async (cmdText?: string) => {
    const text = (cmdText || inputVal).trim();
    if (!text) return;
    
    if (!isAuthenticated) {
      alert("Please login to use the console.");
      return;
    }

    soundManager.playCommandSuccess();
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(text.replace(/^\//, ''));
      setInputVal('');
    } else {
      setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'WARN', message: 'WebSocket is not connected.' }]);
    }
  };

  const copyLogHistory = () => {
    soundManager.playPop();
    const plainText = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(plainText);
    setCopiedConsole(true);
    setTimeout(() => setCopiedConsole(false), 2000);
  };

  const filteredLogs = logs.filter(l => {
    if (filterLevel === 'ALL') return true;
    return l.level === filterLevel;
  });

  return (
    <section id="console" className="py-24 relative bg-[#070a12] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow mesh orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] mesh-orb-purple pointer-events-none" />
      <div className="absolute top-10 left-10 w-[400px] h-[400px] mesh-orb-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono-code text-fuchsia-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>Zero-Latency Terminal Daemon</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Live Streaming Mobile Console. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300">
                Run Commands with 1-Tap Autocomplete.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base">
              Stream server logs line-by-line in real time. Send OP commands, execute server restarts, clear rain, and get crash push notifications directly to your lock screen.
            </p>
          </div>
        </ScrollReveal>

        {/* Live Interactive Console Box with Glassmorphism */}
        <ScrollReveal variant="glass-reveal" delay={0.15}>
          <div className="max-w-4xl mx-auto rounded-3xl glass-panel-heavy border-fuchsia-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(217,70,239,0.15)] overflow-hidden font-mono-code">
            
            {/* Terminal Window Header Bar */}
            <div className="px-5 py-3.5 glass-panel border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs text-slate-300 font-bold ml-2">
                  root@blockhost-mobile-daemon:~# live-tail
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Filter Pills */}
                <div className="hidden sm:flex items-center gap-1 text-[10px]">
                  {['ALL', 'INFO', 'WARN', 'CHAT', 'SYSTEM'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        soundManager.playClick();
                        setFilterLevel(lvl);
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        filterLevel === lvl ? 'bg-fuchsia-500 text-black font-bold' : 'glass-pill text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={copyLogHistory}
                  className="px-3 py-1 rounded-lg glass-panel hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                  title="Copy full log"
                >
                  {copiedConsole ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span className="hidden sm:inline">{copiedConsole ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Logs Area */}
            <div 
              ref={logContainerRef}
              className="p-5 text-xs text-slate-200 space-y-1.5 h-80 overflow-y-auto custom-scrollbar leading-relaxed bg-[#03060f]/80 backdrop-blur-md"
            >
              {filteredLogs.map((log) => {
                let levelColor = 'text-slate-400';
                if (log.level === 'SYSTEM') levelColor = 'text-fuchsia-400 font-bold';
                if (log.level === 'WARN') levelColor = 'text-amber-400 font-bold';
                if (log.level === 'CHAT') levelColor = 'text-cyan-400';
                if (log.level === 'INFO') levelColor = 'text-emerald-400';

                return (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                    <span className={`${levelColor} shrink-0`}>[{log.level}]</span>
                    <span className="text-slate-300 break-all">{log.message}</span>
                  </div>
                );
              })}
            </div>

            {/* Quick Autocomplete Command Buttons */}
            <div className="px-4 py-2 glass-panel-subtle border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-1 shrink-0">Quick Commands:</span>
              {[
                '/op Alex_Pro',
                '/gamemode creative',
                '/weather clear',
                '/whitelist add Notch',
                '/give @p diamond 64',
                '/save-all'
              ].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => sendCommand(cmd)}
                  className="px-2.5 py-1 rounded-lg glass-pill hover:bg-fuchsia-500 hover:text-black text-slate-300 text-[11px] shrink-0 transition-colors cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Terminal Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendCommand();
              }}
              className="p-3.5 glass-panel border-t border-white/[0.08] flex items-center gap-2"
            >
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-fuchsia-400 font-bold">&gt;</span>
                <input
                  id="live-console-showcase-input"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type Minecraft command here (e.g. /op Alex, /time set day, /stop)..."
                  className="w-full glass-input rounded-xl pl-8 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <button
                id="live-console-submit-btn"
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

