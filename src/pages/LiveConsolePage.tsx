import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, Zap, Copy, Check, ShieldAlert, Sparkles, 
  HelpCircle, RefreshCw, Send, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LiveConsoleShowcase } from '../components/LiveConsoleShowcase';
import { soundManager } from '../utils/audio';

interface Props {
  onOpenDeployWizard: () => void;
}

export const LiveConsolePage: React.FC<Props> = ({ onOpenDeployWizard }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [crashInput, setCrashInput] = useState('');
  const [analyzingCrash, setAnalyzingCrash] = useState(false);
  const [crashDiagnosis, setCrashDiagnosis] = useState<{
    severity: 'critical' | 'warning' | 'info';
    cause: string;
    fix: string;
  } | null>(null);

  const commandCategories = [
    {
      category: 'Moderation & Players',
      commands: [
        { cmd: '/op <player>', desc: 'Grants full administrator server privileges' },
        { cmd: '/deop <player>', desc: 'Revokes operator privileges from player' },
        { cmd: '/kick <player> [reason]', desc: 'Disconnects a player from the server' },
        { cmd: '/ban <player> [reason]', desc: 'Permanently bans gamertag / UUID' },
        { cmd: '/whitelist add <player>', desc: 'Adds gamertag to private whitelist' }
      ]
    },
    {
      category: 'World & Environment',
      commands: [
        { cmd: '/time set day', desc: 'Sets world tick time to sunrise (1000)' },
        { cmd: '/weather clear 999999', desc: 'Clears rain, storm, and thunder' },
        { cmd: '/gamemode creative @a', desc: 'Changes game mode for all players' },
        { cmd: '/difficulty hard', desc: 'Enables hard mob difficulty mechanics' },
        { cmd: '/gamerule keepInventory true', desc: 'Prevents item loss upon player death' }
      ]
    },
    {
      category: 'Diagnostic & Maintenance',
      commands: [
        { cmd: '/tps', desc: 'Displays 1m, 5m, and 15m server tick rates' },
        { cmd: '/spark sampler', desc: 'Records CPU profiler trace for lag spikes' },
        { cmd: '/timings paste', desc: 'Generates Paper performance analysis report' },
        { cmd: '/save-all flush', desc: 'Forces synchronous chunk disk save' },
        { cmd: '/restart', desc: 'Executes clean server restart daemon sequence' }
      ]
    }
  ];

  const handleCopy = (cmd: string) => {
    soundManager.playPop();
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  const sampleCrashes = [
    {
      label: 'OutOfMemoryError: Java heap space',
      text: `java.lang.OutOfMemoryError: Java heap space
  at net.minecraft.world.level.chunk.LevelChunk.load()
  at java.base/java.lang.Thread.run(Thread.java:840)`
    },
    {
      label: 'Plugin Duplicate YAML / Incompatible Class',
      text: `org.bukkit.plugin.InvalidPluginException: java.lang.NoClassDefFoundError: net/milkbowl/vault/economy/Economy
  at org.bukkit.plugin.java.JavaPluginLoader.loadPlugin()
  at org.bukkit.plugin.SimplePluginManager.loadPlugins()`
    }
  ];

  const runCrashAnalysis = (sampleText?: string) => {
    const textToAnalyze = sampleText || crashInput;
    if (!textToAnalyze.trim()) return;

    soundManager.playClick();
    setAnalyzingCrash(true);
    setCrashDiagnosis(null);

    setTimeout(() => {
      setAnalyzingCrash(false);
      soundManager.playLevelUp();

      if (textToAnalyze.includes('OutOfMemoryError') || textToAnalyze.includes('heap space')) {
        setCrashDiagnosis({
          severity: 'critical',
          cause: 'Java Virtual Machine RAM exhaustion during heavy chunk ticking.',
          fix: 'Allocate at least 4GB RAM or add Chunky to pre-generate chunk borders.'
        });
      } else if (textToAnalyze.includes('Vault') || textToAnalyze.includes('NoClassDefFoundError')) {
        setCrashDiagnosis({
          severity: 'warning',
          cause: 'Missing core dependency plugin (Vault Economy API).',
          fix: 'Install the Vault plugin with 1-click in the Erex Mod Browser tab.'
        });
      } else {
        setCrashDiagnosis({
          severity: 'info',
          cause: 'General exception or clean shutdown command received.',
          fix: 'Verify server.properties port binding and ensure paper.yml is valid.'
        });
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      {/* Route Header */}
      <PageHeader
        badge="Zero-Latency Remote Console"
        badgeIcon={<Terminal className="w-3.5 h-3.5" />}
        title="Real-Time Streaming Terminal"
        highlightedTitle="In The Palm of Your Hand."
        description="Monitor server stdout logs in real-time with sub-15ms WebSocket latency. Run commands, manage operators, inspect tick health, and auto-diagnose crash reports."
        crumbs={[{ label: 'Live Console' }]}
      />

      {/* Main Terminal Showcase Component */}
      <LiveConsoleShowcase />

      {/* Command Cheat Sheet Section */}
      <section className="py-20 bg-[#070a12] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Essential Minecraft Command Reference</h2>
            <p className="text-slate-300 text-sm">
              Tap any command below to copy it directly or use our mobile app's 1-tap quick command drawer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commandCategories.map((cat) => (
              <div key={cat.category} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl card-lift-subtle">
                <h3 className="font-bold text-sm text-emerald-400 font-mono-code uppercase tracking-wider">
                  {cat.category}
                </h3>

                <div className="space-y-2.5">
                  {cat.commands.map((c) => (
                    <div
                      key={c.cmd}
                      onClick={() => handleCopy(c.cmd)}
                      className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 transition-all cursor-pointer group card-lift-subtle"
                    >
                      <div className="flex items-center justify-between font-mono-code text-xs mb-1">
                        <span className="text-white font-bold group-hover:text-emerald-300 transition-colors">
                          {c.cmd}
                        </span>
                        <span className="text-slate-500 group-hover:text-slate-300">
                          {copiedCmd === c.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-tight">
                        {c.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* AI Crash Log Diagnosis Studio */}
      <section className="py-20 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-code text-fuchsia-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Crash Log Analyzer</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Instant Plain-English Crash Diagnostics</h2>
            <p className="text-slate-300 text-sm">
              Paste your server crash log or select a common error below to receive instant remediation guidance.
            </p>
          </div>

          {/* Sample quick buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono-code text-slate-400">Try sample error:</span>
            {sampleCrashes.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCrashInput(s.text);
                  runCrashAnalysis(s.text);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono-code text-slate-300"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-2xl">
            <textarea
              rows={4}
              value={crashInput}
              onChange={(e) => setCrashInput(e.target.value)}
              placeholder="Paste Java stack trace or error log snippet here..."
              className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-xs font-mono-code text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono-code">Analyzed locally with rule heuristics</span>
              <button
                type="button"
                onClick={() => runCrashAnalysis()}
                disabled={analyzingCrash || !crashInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {analyzingCrash ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{analyzingCrash ? 'Diagnosing Stack Trace...' : 'Analyze Crash'}</span>
              </button>
            </div>

            {/* Diagnosis Result */}
            {crashDiagnosis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-mono-code font-bold">
                  {crashDiagnosis.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  {crashDiagnosis.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {crashDiagnosis.severity === 'info' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  <span className="text-white">Diagnosis: {crashDiagnosis.cause}</span>
                </div>
                <p className="text-xs text-emerald-300 font-mono-code pl-6">
                  💡 Recommended Fix: {crashDiagnosis.fix}
                </p>
              </motion.div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};
