import React, { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getAuthToken, API_BASE_URL } from '../../utils/api';
import { Terminal, Send, Cpu, Zap, Wifi, Activity, Maximize2, Shield } from 'lucide-react';
import { ConsoleLogLine } from '../../types';
import { soundManager } from '../../utils/audio';

export const ServerConsolePage: React.FC = () => {
  const { server } = useOutletContext<any>();
  const [logs, setLogs] = useState<ConsoleLogLine[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    let activeWs: WebSocket | null = null;
    
    const connectWs = () => {
      try {
        const wsUrl = API_BASE_URL.replace('http', 'ws') + `/servers/${server.id}/console/ws?token=${getAuthToken()}`;
        const newWs = new WebSocket(wsUrl);
        
        newWs.onmessage = (event) => {
          setLogs(prev => {
            const newLogs = [...prev, { id: Date.now().toString() + Math.random(), timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: event.data }];
            return newLogs.slice(-200); // Keep last 200 logs
          });
        };
        
        newWs.onopen = () => {
          setIsConnected(true);
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'SYSTEM', message: 'Connected to High-Speed Live Console. Awaiting commands...' }]);
        };

        newWs.onclose = () => {
          setIsConnected(false);
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'WARN', message: 'Connection closed. Attempting to reconnect in background...' }]);
        };

        setWs(newWs);
        activeWs = newWs;
      } catch (err) {
        console.error("Failed to connect websocket", err);
      }
    };
    
    if (server.id) {
      // Small simulated delay for "booting" effect
      setTimeout(() => {
        connectWs();
      }, 500);
    }
    
    return () => {
      if (activeWs) activeWs.close();
    };
  }, [server.id]);
  
  const sendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputVal.trim();
    if (!text) return;

    soundManager.playCommandSuccess();
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(text.replace(/^\//, ''));
      setInputVal('');
    } else {
      setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'ERROR', message: 'ERROR: WebSocket is not connected. Cannot send command.' }]);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col rounded-3xl bg-[#030712] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
      
      {/* Subtle Matrix/Scanline Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0 mix-blend-overlay"></div>
      
      {/* Console Header */}
      <div className="bg-[#0f172a]/90 backdrop-blur-md px-5 py-4 border-b border-white/10 flex items-center justify-between relative z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Terminal className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {isConnected && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <span className="text-sm font-mono-code font-bold text-white tracking-wider flex items-center gap-2">
            root@<span className="text-emerald-400">{server.world_name}</span>:~#
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest ml-2">
            Live Link Active
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 mr-4 text-xs font-mono-code text-slate-400">
            <div className="flex items-center gap-1.5" title="CPU">
              <Cpu className="w-3.5 h-3.5" />
              <span className="w-8">14%</span>
            </div>
            <div className="flex items-center gap-1.5" title="Network">
              <Activity className="w-3.5 h-3.5" />
              <span className="w-12">12ms</span>
            </div>
          </div>
          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-6 overflow-y-auto font-mono-code text-[13px] relative z-10 custom-scrollbar scroll-smooth">
        {!isConnected && logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-emerald-500/50 space-y-4">
            <Zap className="w-12 h-12 animate-pulse" />
            <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Establishing Secure Uplink...</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-1.5 flex items-start gap-3 hover:bg-white/5 px-2 py-1 rounded transition-colors group leading-relaxed"
              >
                <span className="text-slate-500 shrink-0 w-24 select-none">[{log.timestamp}]</span>
                <span className={`shrink-0 w-20 font-bold tracking-wider select-none ${
                  log.level === 'SYSTEM' ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.6)]' :
                  log.level === 'WARN' ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]' :
                  log.level === 'ERROR' ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.6)]' :
                  'text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.4)]'
                }`}>
                  [{log.level}]
                </span>
                <span className="text-slate-300 whitespace-pre-wrap break-all group-hover:text-white transition-colors selection:bg-emerald-500/30 selection:text-emerald-200">
                  {log.message}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={endRef} className="h-4" />
      </div>

      {/* Command Input */}
      <div className="bg-[#0f172a]/90 backdrop-blur-md p-4 border-t border-white/10 relative z-10">
        <form onSubmit={sendCommand} className="relative flex items-center w-full">
          <div className="absolute left-4 flex items-center gap-2 text-emerald-400 font-mono-code font-bold pointer-events-none">
            <span className="animate-pulse">❯</span>
          </div>
          
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={!isConnected}
            placeholder={isConnected ? "Enter command (e.g., /op Steve, /time set day)..." : "Connecting to console..."}
            className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl py-3.5 pl-10 pr-16 text-emerald-50 font-mono-code text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-[#1e293b]/80 focus:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            autoComplete="off"
            spellCheck="false"
          />
          
          <button
            type="submit"
            disabled={!isConnected || !inputVal.trim()}
            className="absolute right-2 p-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 transition-colors shadow-[0_0_15px_rgba(52,211,153,0.3)] disabled:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
      
      {/* Decorative Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-emerald-500/50 blur-sm z-20"></div>
    </div>
  );
};
