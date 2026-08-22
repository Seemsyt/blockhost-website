import React, { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getAuthToken, API_BASE_URL } from '../../utils/api';
import { Terminal, Send } from 'lucide-react';
import { ConsoleLogLine } from '../../types';
import { soundManager } from '../../utils/audio';

export const ServerConsolePage: React.FC = () => {
  const { server } = useOutletContext<any>();
  const [logs, setLogs] = useState<ConsoleLogLine[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
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
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'SYSTEM', message: 'Connected to Server Console.' }]);
        };

        newWs.onclose = () => {
          setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'WARN', message: 'Connection closed.' }]);
        };

        setWs(newWs);
        activeWs = newWs;
      } catch (err) {
        console.error("Failed to connect websocket", err);
      }
    };
    
    if (server.id) {
      connectWs();
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
      setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'WARN', message: 'WebSocket is not connected.' }]);
    }
  };

  return (
    <div className="h-full flex flex-col rounded-3xl bg-[#0a0a0a] border border-slate-800 overflow-hidden shadow-2xl">
      {/* Console Header */}
      <div className="bg-[#111] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-mono-code font-bold text-slate-300">live_console ~ {server.world_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-6 overflow-y-auto font-mono-code text-sm">
        {logs.map((log) => (
          <div key={log.id} className="mb-2 flex items-start gap-3 hover:bg-white/5 px-2 py-1 rounded transition-colors group">
            <span className="text-slate-500 shrink-0 w-20">[{log.timestamp}]</span>
            <span className={`shrink-0 w-16 font-bold ${
              log.level === 'SYSTEM' ? 'text-purple-400' :
              log.level === 'WARN' ? 'text-amber-400' :
              log.level === 'ERROR' ? 'text-red-400' :
              'text-emerald-400'
            }`}>
              [{log.level}]
            </span>
            <span className="text-slate-300 whitespace-pre-wrap break-all group-hover:text-white transition-colors">
              {log.message}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Command Input */}
      <div className="bg-[#111] p-4 border-t border-slate-800">
        <form onSubmit={sendCommand} className="relative flex items-center max-w-4xl mx-auto">
          <span className="absolute left-4 font-mono-code text-emerald-500 font-bold">{'>'}</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a command (e.g., /op Steve, /time set day)..."
            className="w-full bg-[#1a1a1a] border-2 border-slate-800 rounded-xl py-3 pl-12 pr-16 text-slate-200 font-mono-code placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-[#222] transition-all"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="absolute right-2 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
