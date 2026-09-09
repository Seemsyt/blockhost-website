import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Square, RotateCw, Terminal, Download, Folder, ShieldCheck, 
  Settings, Cpu, HardDrive, Users, Wifi, Copy, Check, Search, 
  Plus, CheckCircle, RefreshCw, Zap, Server, ChevronRight, Bell,
  Sparkles, Sliders, ArrowUpRight, ArrowDownToLine, Trash2, Globe
} from 'lucide-react';
import { ConsoleLogLine, ModItem, BackupItem, MinecraftFlavor } from '../types';
import { soundManager } from '../utils/audio';

const INITIAL_LOGS: ConsoleLogLine[] = [
  { id: '1', timestamp: '14:20:01', level: 'SYSTEM', message: 'Erex Mobile Daemon v3.4.2 connected (Socket ID: #8892)' },
  { id: '2', timestamp: '14:20:02', level: 'INFO', message: '[Paper] Loading world "Survival_SMP_S5" (Dimensions: Overworld, Nether, End)' },
  { id: '3', timestamp: '14:20:04', level: 'INFO', message: '[Paper] Preparing spawn area: 100%' },
  { id: '4', timestamp: '14:20:05', level: 'INFO', message: '[Geyser-Spigot] Bedrock crossplay bridge active on UDP 19132' },
  { id: '5', timestamp: '14:20:06', level: 'INFO', message: '[Lithium] Optimization patches applied (22 chunk mixins)' },
  { id: '6', timestamp: '14:20:08', level: 'INFO', message: 'Done (4.218s)! For help, type "help"' },
  { id: '7', timestamp: '14:20:15', level: 'CHAT', message: '<Alex_Gamer> logged in from London (Bedrock PE)' },
  { id: '8', timestamp: '14:20:22', level: 'CHAT', message: '<NotchFan99> joined the game (Java 1.21.4)' },
  { id: '9', timestamp: '14:21:00', level: 'INFO', message: '[Erex Backup] Cloud snapshot #204 verified on S3' },
];

const POPULAR_MODS: ModItem[] = [
  {
    id: 'lithium',
    name: 'Lithium',
    author: 'CaffeineMC',
    downloads: '42.5M',
    category: 'Performance',
    flavors: ['fabric', 'purpur'],
    version: 'v0.12.7 (1.21.4)',
    description: 'General-purpose physics, mob AI, and chunk-ticking optimization mod.',
    installed: true,
    size: '840 KB',
    rating: 4.9,
    icon: '⚡'
  },
  {
    id: 'essentialsx',
    name: 'EssentialsX',
    author: 'EssentialsX Team',
    downloads: '68.1M',
    category: 'Essentials',
    flavors: ['paper', 'purpur', 'spigot'],
    version: 'v2.20.1',
    description: 'Essential suite of 100+ commands: /home, /spawn, /tpa, kits, and economy.',
    installed: true,
    size: '2.4 MB',
    rating: 4.8,
    icon: '⭐'
  },
  {
    id: 'geysermc',
    name: 'Geyser & Floodgate',
    author: 'GeyserMC',
    downloads: '19.2M',
    category: 'World',
    flavors: ['paper', 'purpur', 'fabric', 'spigot'],
    version: 'v2.4.0',
    description: 'Enables Bedrock Edition players (iOS/Android/Xbox/Switch) to join your Java server seamlessly.',
    installed: true,
    size: '18.1 MB',
    rating: 5.0,
    icon: '🌉'
  },
  {
    id: 'worldedit',
    name: 'WorldEdit',
    author: 'EngineHub',
    downloads: '55.3M',
    category: 'World',
    flavors: ['paper', 'purpur', 'fabric', 'forge', 'spigot'],
    version: 'v7.3.0',
    description: 'In-game world generator, terraforming brush, voxel builder, and schematic loader.',
    installed: false,
    size: '4.1 MB',
    rating: 4.9,
    icon: '🪓'
  },
  {
    id: 'chunky',
    name: 'Chunky World Pre-generator',
    author: 'pop4959',
    downloads: '8.7M',
    category: 'Performance',
    flavors: ['paper', 'purpur', 'fabric'],
    version: 'v1.4.10',
    description: 'Pre-generates chunks in radius to completely eliminate terrain generation lag.',
    installed: false,
    size: '1.2 MB',
    rating: 4.9,
    icon: '🗺️'
  },
  {
    id: 'vault',
    name: 'Vault & Economy Bridge',
    author: 'MilkBowl',
    downloads: '47.0M',
    category: 'Economy',
    flavors: ['paper', 'purpur', 'spigot'],
    version: 'v1.7.3',
    description: 'Permissions and Economy ecosystem bridge for shops, trading, and ranks.',
    installed: false,
    size: '350 KB',
    rating: 4.7,
    icon: '💰'
  }
];

const INITIAL_BACKUPS: BackupItem[] = [
  { id: 'b1', name: 'Automatic Daily Snapshot #48', created: 'Today, 04:00 AM', size: '248 MB', worldName: 'world_survival', flavor: 'Paper 1.21.4', status: 'Ready' },
  { id: 'b2', name: 'Pre-Modpack Install Safety Point', created: 'Yesterday, 19:34', size: '242 MB', worldName: 'world_survival', flavor: 'Paper 1.21.4', status: 'Ready' },
  { id: 'b3', name: 'Weekly Offsite Cloud Archive', created: 'Aug 14, 00:00', size: '235 MB', worldName: 'world_survival', flavor: 'Paper 1.21.4', status: 'Ready' }
];

type AppTab = 'dashboard' | 'console' | 'mods' | 'files' | 'backups' | 'settings';

export const InteractiveAppSimulator: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [serverState, setServerState] = useState<'online' | 'restarting' | 'offline'>('online');
  const [flavor, setFlavor] = useState<MinecraftFlavor>('paper');
  const [copiedIp, setCopiedIp] = useState(false);
  const [logs, setLogs] = useState<ConsoleLogLine[]>(INITIAL_LOGS);
  const [commandInput, setCommandInput] = useState('');
  const [mods, setMods] = useState<ModItem[]>(POPULAR_MODS);
  const [modFilter, setModFilter] = useState('All');
  const [modSearch, setModSearch] = useState('');
  const [backups, setBackups] = useState<BackupItem[]>(INITIAL_BACKUPS);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>('server.properties');
  const [serverProperties, setServerProperties] = useState({
    motd: '§a§lErex SMP §7• §eBedrock & Java Joinable!',
    maxPlayers: 50,
    difficulty: 'hard',
    pvp: true,
    onlineMode: true,
    viewDistance: 12,
    allowFlight: true
  });

  // Performance simulation
  const [tps, setTps] = useState('20.0');
  const [ramUsed, setRamUsed] = useState(1.85);
  const [cpuUsage, setCpuUsage] = useState(14);
  const [playerCount, setPlayerCount] = useState(18);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Live minor fluctuations
  useEffect(() => {
    if (serverState !== 'online') return;
    const interval = setInterval(() => {
      setRamUsed(parseFloat((1.8 + Math.random() * 0.15).toFixed(2)));
      setCpuUsage(Math.floor(12 + Math.random() * 8));
      setTps((19.9 + Math.random() * 0.1).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, [serverState]);

  // Scroll console to bottom
  useEffect(() => {
    if (currentTab === 'console') {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, currentTab]);

  const toggleServerPower = () => {
    soundManager.playClick();
    if (serverState === 'online') {
      setServerState('offline');
      setLogs(prev => [
        ...prev,
        { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'WARN', message: '[Server] Server shutdown completed by mobile admin.' }
      ]);
    } else {
      setServerState('restarting');
      setTimeout(() => {
        setServerState('online');
        soundManager.playLevelUp();
        setLogs(prev => [
          ...prev,
          { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: '[Erex Engine] Server started in 3.8s on port 25565.' }
        ]);
      }, 1500);
    }
  };

  const restartServer = () => {
    soundManager.playClick();
    setServerState('restarting');
    setTimeout(() => {
      setServerState('online');
      soundManager.playLevelUp();
    }, 1800);
  };

  const copyServerIp = () => {
    soundManager.playPop();
    navigator.clipboard.writeText('mc.erex.gg:25565');
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const executeCommand = (cmdText?: string) => {
    const cmd = (cmdText || commandInput).trim();
    if (!cmd) return;

    soundManager.playCommandSuccess();
    const timeStr = new Date().toLocaleTimeString();

    // Append command sent
    const newLogs: ConsoleLogLine[] = [
      ...logs,
      { id: Date.now().toString(), timestamp: timeStr, level: 'SYSTEM', message: `> ${cmd}` }
    ];

    // Simulate smart responses
    if (cmd.startsWith('/give')) {
      newLogs.push({ id: (Date.now() + 1).toString(), timestamp: timeStr, level: 'INFO', message: `[Server] Gave 64 [Diamond] to player Alex_Gamer` });
    } else if (cmd.startsWith('/time')) {
      newLogs.push({ id: (Date.now() + 1).toString(), timestamp: timeStr, level: 'INFO', message: `[Server] Set time to 1000 (Day)` });
    } else if (cmd.startsWith('/weather')) {
      newLogs.push({ id: (Date.now() + 1).toString(), timestamp: timeStr, level: 'INFO', message: `[Server] Set weather to clear skies` });
    } else if (cmd.startsWith('/op')) {
      newLogs.push({ id: (Date.now() + 1).toString(), timestamp: timeStr, level: 'INFO', message: `[Server] Made player Alex_Gamer a server operator` });
    } else if (cmd.startsWith('/tps')) {
      newLogs.push({ id: (Date.now() + 1).toString(), timestamp: timeStr, level: 'INFO', message: `TPS from last 1m, 5m, 15m: 20.0, 20.0, 20.0 (Memory: 1850MB / 6144MB)` });
    } else if (cmd.startsWith('/whitelist')) {
      newLogs.push({ id: (Date.now() + 1).toString(), timestamp: timeStr, level: 'INFO', message: `[Whitelist] Whitelist reloaded. 14 players allowed.` });
    } else {
      newLogs.push({ id: (Date.now() + 1).toString(), timestamp: timeStr, level: 'INFO', message: `[Command Executed] Response from server: OK` });
    }

    setLogs(newLogs);
    setCommandInput('');
  };

  const toggleInstallMod = (modId: string) => {
    soundManager.playPop();
    setMods(prev => prev.map(m => {
      if (m.id === modId) {
        const nextState = !m.installed;
        if (nextState) {
          soundManager.playLevelUp();
          setLogs(l => [
            ...l,
            { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: `[Mod Installer] Installed ${m.name} ${m.version}. Ready for next restart.` }
          ]);
        }
        return { ...m, installed: nextState };
      }
      return m;
    }));
  };

  const triggerManualBackup = () => {
    if (isBackingUp) return;
    soundManager.playClick();
    setIsBackingUp(true);

    setTimeout(() => {
      setIsBackingUp(false);
      soundManager.playLevelUp();
      const newBackup: BackupItem = {
        id: Date.now().toString(),
        name: `Manual Snapshot #${backups.length + 1}`,
        created: 'Just now',
        size: '251 MB',
        worldName: 'world_survival',
        flavor: `${flavor.toUpperCase()} 1.21.4`,
        status: 'Ready'
      };
      setBackups([newBackup, ...backups]);
    }, 2000);
  };

  const filteredMods = mods.filter(m => {
    const matchesFilter = modFilter === 'All' || m.category === modFilter;
    const matchesSearch = m.name.toLowerCase().includes(modSearch.toLowerCase()) || m.description.toLowerCase().includes(modSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="mobile-app-simulator" className="w-full max-w-sm md:max-w-md mx-auto relative select-none">
      {/* Smartphone Frame (iPhone 16 Pro styling) */}
      <div className="relative rounded-[48px] bg-gradient-to-b from-slate-800 via-slate-900 to-black p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.15)] border-[4px] border-slate-700/80 ring-1 ring-white/10">
        
        {/* Physical buttons simulation on edges */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-8 bg-slate-600 rounded-l-sm" />
        <div className="absolute -left-[7px] top-40 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
        <div className="absolute -left-[7px] top-56 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
        <div className="absolute -right-[7px] top-36 w-[3px] h-16 bg-slate-600 rounded-r-sm" />

        {/* Screen Glass Container */}
        <div className="relative rounded-[38px] bg-[#0c1220] overflow-hidden text-slate-100 flex flex-col h-[650px] border border-slate-800/80 shadow-inner">
          
          {/* Status Bar & Dynamic Island */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between bg-[#0c1220] z-30 shrink-0 text-xs font-mono-code">
            <span className="text-slate-300 font-semibold">14:21</span>
            
            {/* Dynamic Island */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/90 border border-slate-800 text-[10px] text-slate-300 shadow-md">
              <span className={`w-1.5 h-1.5 rounded-full ${serverState === 'online' ? 'bg-emerald-400 animate-pulse' : serverState === 'restarting' ? 'bg-amber-400 animate-spin' : 'bg-red-400'}`} />
              <span className="font-bold text-white tracking-wider uppercase">
                {serverState === 'online' ? `${tps} TPS` : serverState}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold">5G</span>
            </div>
          </div>

          {/* App Header */}
          <div className="px-4 py-2 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm">
                ⛏️
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1">
                  Survival SMP S5
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-mono-code">
                    {flavor}
                  </span>
                </h4>
                <p className="text-[10px] font-mono-code text-slate-400">Node #US-East-04</p>
              </div>
            </div>

            {/* Quick Action Notification icon */}
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                onClick={() => {
                  soundManager.playPop();
                  setLogs(l => [...l, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'SYSTEM', message: '[Mobile Notification] Push alert triggered to admin phone.' }]);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                title="Test Push Notification"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Main App Screen Content based on Current Tab */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar text-xs">
            
            {/* 1. DASHBOARD TAB */}
            {currentTab === 'dashboard' && (
              <motion.div 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-3"
              >
                {/* Power & State Hero Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono-code uppercase text-slate-400">Status</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          serverState === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' :
                          serverState === 'restarting' ? 'bg-amber-400 animate-pulse' : 'bg-red-500'
                        }`} />
                        <span className="font-bold text-sm text-white capitalize">
                          {serverState === 'online' ? 'Server Online' : serverState === 'restarting' ? 'Restarting...' : 'Stopped'}
                        </span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        id="mobile-power-toggle"
                        type="button"
                        onClick={toggleServerPower}
                        className={`px-3 py-1.5 rounded-xl font-bold font-mono-code flex items-center gap-1.5 transition-all text-xs shadow-md ${
                          serverState === 'online'
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold'
                        }`}
                      >
                        {serverState === 'online' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                        <span>{serverState === 'online' ? 'Stop' : 'Start'}</span>
                      </button>

                      <button
                        id="mobile-restart-btn"
                        type="button"
                        onClick={restartServer}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="Restart server"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Connect Address Pill */}
                  <div className="mt-3 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between font-mono-code text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">mc.erex.gg:25565</span>
                    </div>
                    <button
                      id="mobile-copy-ip-btn"
                      type="button"
                      onClick={copyServerIp}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1 shrink-0"
                    >
                      {copiedIp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIp ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Real-Time Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono-code mb-1">
                      <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-cyan-400" /> CPU Load</span>
                      <span className="text-cyan-400 font-bold">{cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${cpuUsage}%` }} 
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 block">Ryzen 9 7950X3D @ 5.7GHz</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono-code mb-1">
                      <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-emerald-400" /> RAM Allocated</span>
                      <span className="text-emerald-400 font-bold">{ramUsed} / 6.0 GB</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(ramUsed / 6.0) * 100}%` }} 
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 block">DDR5 ECC Low-Latency</span>
                  </div>
                </div>

                {/* Player Roster Card */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      Active Players ({playerCount}/50)
                    </span>
                    <span className="text-[10px] font-mono-code text-emerald-400">Crossplay Ready</span>
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {['Alex_Gamer (PE)', 'NotchFan99', 'MineCraftGod', 'StevePro', 'DiamondKing'].map((player, idx) => (
                      <div key={idx} className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5 shrink-0 text-[10px] font-mono-code">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-slate-300">{player}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action Shortcuts */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button 
                    onClick={() => {
                      executeCommand('/time set day');
                      soundManager.playClick();
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-medium text-slate-300 text-center"
                  >
                    ☀️ Set Day
                  </button>
                  <button 
                    onClick={() => {
                      executeCommand('/weather clear');
                      soundManager.playClick();
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-medium text-slate-300 text-center"
                  >
                    🌤️ Clear Rain
                  </button>
                  <button 
                    onClick={() => {
                      triggerManualBackup();
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-medium text-emerald-400 text-center"
                  >
                    💾 Quick Backup
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. CONSOLE TAB */}
            {currentTab === 'console' && (
              <motion.div 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-col h-full space-y-2"
              >
                {/* Console Log Terminal */}
                <div className="flex-1 bg-black/90 rounded-2xl p-2.5 border border-slate-800 font-mono-code text-[10px] overflow-y-auto space-y-1 max-h-[380px] shadow-inner">
                  {logs.map((log) => {
                    let badgeColor = 'text-slate-400';
                    if (log.level === 'SYSTEM') badgeColor = 'text-fuchsia-400 font-bold';
                    if (log.level === 'WARN') badgeColor = 'text-amber-400 font-bold';
                    if (log.level === 'CHAT') badgeColor = 'text-cyan-400';
                    if (log.level === 'INFO') badgeColor = 'text-emerald-400';

                    return (
                      <div key={log.id} className="leading-tight break-all">
                        <span className="text-slate-600">[{log.timestamp}]</span>{' '}
                        <span className={badgeColor}>[{log.level}]</span>{' '}
                        <span className="text-slate-200">{log.message}</span>
                      </div>
                    );
                  })}
                  <div ref={consoleEndRef} />
                </div>

                {/* Quick Presets Bar */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono-code custom-scrollbar">
                  {[
                    '/give @p diamond 64',
                    '/op Alex_Gamer',
                    '/whitelist reload',
                    '/tps',
                    '/time set day'
                  ].map((cmd, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => executeCommand(cmd)}
                      className="px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 shrink-0 text-[10px]"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>

                {/* Command Input Box */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeCommand();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 font-mono-code text-emerald-400 text-xs font-bold">&gt;</span>
                    <input
                      id="mobile-console-input"
                      type="text"
                      value={commandInput}
                      onChange={(e) => setCommandInput(e.target.value)}
                      placeholder="Type command (/op, /give, /kill)..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-xs font-mono-code text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    id="mobile-console-send-btn"
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs font-mono-code"
                  >
                    Run
                  </button>
                </form>
              </motion.div>
            )}

            {/* 3. MODS & PLUGINS BROWSER TAB */}
            {currentTab === 'mods' && (
              <motion.div 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-2.5"
              >
                {/* Search & Category Pills */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={modSearch}
                      onChange={(e) => setModSearch(e.target.value)}
                      placeholder="Search 50k+ Mods & Plugins..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono-code custom-scrollbar">
                    {['All', 'Performance', 'Essentials', 'World', 'Economy'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setModFilter(cat)}
                        className={`px-2.5 py-0.5 rounded-full transition-all shrink-0 ${
                          modFilter === cat 
                            ? 'bg-emerald-500 text-slate-950 font-bold' 
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mod Cards List */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5 custom-scrollbar">
                  {filteredMods.map((mod) => (
                    <div key={mod.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0">
                          {mod.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-xs text-white truncate">{mod.name}</h5>
                            <span className="text-[9px] font-mono-code px-1 rounded bg-slate-800 text-slate-400">{mod.version}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">{mod.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-[9px] font-mono-code text-slate-500">
                            <span>↓ {mod.downloads}</span>
                            <span>•</span>
                            <span>{mod.size}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleInstallMod(mod.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-code font-bold shrink-0 transition-all ${
                          mod.installed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300'
                        }`}
                      >
                        {mod.installed ? 'Installed ✓' : '+ 1-Click'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. FILE MANAGER & PROPERTIES TAB */}
            {currentTab === 'files' && (
              <motion.div 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-2.5"
              >
                <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                  <span>/home/minecraft/server/</span>
                  <span className="text-emerald-400 text-[10px]">SFTP Ready</span>
                </div>

                {/* File Tree Selector */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono-code">
                  {[
                    { name: 'server.properties', icon: '⚙️', size: '2.1 KB' },
                    { name: 'paper-world-defaults.yml', icon: '📄', size: '6.4 KB' },
                    { name: 'plugins/', icon: '📁', size: '8 items' },
                    { name: 'world/', icon: '🗺️', size: '240 MB' },
                  ].map((file) => (
                    <button
                      key={file.name}
                      onClick={() => {
                        soundManager.playClick();
                        setActiveFile(file.name);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between ${
                        activeFile === file.name 
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{file.icon} {file.name}</span>
                    </button>
                  ))}
                </div>

                {/* In-App Visual Properties Editor */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Visual server.properties</span>
                    <span className="text-[10px] font-mono-code text-emerald-400">Auto-Synced</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-mono-code text-slate-400 block mb-0.5">MOTD (Server Name)</label>
                      <input
                        type="text"
                        value={serverProperties.motd}
                        onChange={(e) => setServerProperties({ ...serverProperties, motd: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-emerald-400 font-mono-code"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono-code text-slate-400 block mb-0.5">Max Players</label>
                        <input
                          type="number"
                          value={serverProperties.maxPlayers}
                          onChange={(e) => setServerProperties({ ...serverProperties, maxPlayers: parseInt(e.target.value) || 20 })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-mono-code"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono-code text-slate-400 block mb-0.5">Difficulty</label>
                        <select
                          value={serverProperties.difficulty}
                          onChange={(e) => setServerProperties({ ...serverProperties, difficulty: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-mono-code"
                        >
                          <option value="peaceful">Peaceful</option>
                          <option value="easy">Easy</option>
                          <option value="normal">Normal</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-300">PvP Combat</span>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setServerProperties({ ...serverProperties, pvp: !serverProperties.pvp });
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${serverProperties.pvp ? 'bg-emerald-500' : 'bg-slate-800'}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${serverProperties.pvp ? 'left-4.5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">Online Mode (Mojang Auth)</span>
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setServerProperties({ ...serverProperties, onlineMode: !serverProperties.onlineMode });
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${serverProperties.onlineMode ? 'bg-emerald-500' : 'bg-slate-800'}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${serverProperties.onlineMode ? 'left-4.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. BACKUPS TAB */}
            {currentTab === 'backups' && (
              <motion.div 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-3"
              >
                {/* 1-Click Backup Trigger */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-white">Instant S3 Cloud Backup</h5>
                      <p className="text-[10px] text-slate-400">Zero downtime snapshot</p>
                    </div>
                    <button
                      id="create-backup-btn"
                      type="button"
                      onClick={triggerManualBackup}
                      disabled={isBackingUp}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono-code flex items-center gap-1 shadow-md"
                    >
                      {isBackingUp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isBackingUp ? 'Archiving...' : 'Take Snapshot'}</span>
                    </button>
                  </div>
                </div>

                {/* Backups List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono-code uppercase text-slate-400">Cloud Snapshots ({backups.length})</span>
                  {backups.map((b) => (
                    <div key={b.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                          <h6 className="font-bold text-xs text-slate-200">{b.name}</h6>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[9px] font-mono-code text-slate-500">
                          <span>{b.created}</span>
                          <span>•</span>
                          <span>{b.size}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            soundManager.playLevelUp();
                            setLogs(l => [...l, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'WARN', message: `[Restore] World successfully rolled back to ${b.name}` }]);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono-code"
                        >
                          Rollback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 6. SETTINGS & FLAVORS TAB */}
            {currentTab === 'settings' && (
              <motion.div 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-3"
              >
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-xs text-white">Server Engine / Flavor</h5>
                  <p className="text-[10px] text-slate-400">Change Minecraft flavor with 1-tap. Worlds are automatically preserved.</p>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {(['paper', 'purpur', 'bedrock', 'fabric', 'vanilla', 'forge'] as MinecraftFlavor[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          soundManager.playPop();
                          setFlavor(f);
                        }}
                        className={`p-2 rounded-xl border text-xs font-mono-code font-bold capitalize transition-all ${
                          flavor === f 
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' 
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Java Version</span>
                    <span className="font-mono-code text-white">OpenJDK 21.0.2</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">DDoS Scrubbing</span>
                    <span className="font-mono-code text-emerald-400">Active (Path.net)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Auto Restart on Crash</span>
                    <span className="font-mono-code text-emerald-400">Enabled</span>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Mobile Bottom Tab Navigation */}
          <div className="px-2 py-2 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 flex items-center justify-around shrink-0 z-20">
            {[
              { id: 'dashboard', label: 'Control', icon: Server },
              { id: 'console', label: 'Console', icon: Terminal },
              { id: 'mods', label: 'Mods', icon: Sparkles },
              { id: 'files', label: 'Files', icon: Folder },
              { id: 'backups', label: 'Backups', icon: ShieldCheck },
              { id: 'settings', label: 'Flavors', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentTab(tab.id as AppTab);
                  }}
                  className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
                    isActive ? 'text-emerald-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Home bar notch bottom */}
          <div className="w-28 h-1 bg-slate-700/60 rounded-full mx-auto my-1.5 shrink-0" />
        </div>
      </div>
    </div>
  );
};
