import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, Search, ChevronDown, Smartphone, 
  Monitor, Gamepad2, MessageSquare, Mail, Sparkles 
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FaqSection } from '../components/FaqSection';
import { soundManager } from '../utils/audio';

export const FaqPage: React.FC = () => {
  const [guidePlatform, setGuidePlatform] = useState<'java' | 'mobile' | 'console'>('java');

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      {/* Route Header */}
      <PageHeader
        badge="Documentation & Knowledgebase"
        badgeIcon={<HelpCircle className="w-3.5 h-3.5" />}
        title="Frequently Asked Questions"
        highlightedTitle="& Connection Guides."
        description="Learn how to connect from iOS, Android, PC, Xbox, PlayStation, or Nintendo Switch, configure Bedrock crossplay, and manage your cloud server like a pro."
        crumbs={[{ label: 'FAQ & Support' }]}
      />

      {/* Connection Guides Step-by-Step */}
      <section className="py-20 bg-[#070a12] border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">How to Join Your Server</h2>
            <p className="text-slate-300 text-sm">
              Select your gaming platform below for step-by-step connection instructions:
            </p>
          </div>

          {/* Platform Switcher */}
          <div className="flex items-center justify-center gap-2">
            {[
              { id: 'java', label: 'Java Edition (PC / Mac)', icon: <Monitor className="w-4 h-4" /> },
              { id: 'mobile', label: 'Bedrock iOS & Android', icon: <Smartphone className="w-4 h-4" /> },
              { id: 'console', label: 'Xbox, Switch, PS5', icon: <Gamepad2 className="w-4 h-4" /> }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setGuidePlatform(p.id as any);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold flex items-center gap-2 transition-all ${
                  guidePlatform === p.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Guide Steps Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl font-mono-code text-xs card-lift-subtle">
            {guidePlatform === 'java' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-sans">Connecting via Minecraft Java Edition:</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 font-sans leading-relaxed">
                  <li>Launch Minecraft Java Edition (Version 1.8 to 1.21.4).</li>
                  <li>Click <strong>Multiplayer</strong> &rarr; <strong>Add Server</strong>.</li>
                  <li>In <strong>Server Address</strong>, enter your Erex server address (e.g. <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">myserver.erex.gg:25565</code>).</li>
                  <li>Click <strong>Done</strong>, select the server, and tap <strong>Join Server</strong>.</li>
                </ol>
              </div>
            )}

            {guidePlatform === 'mobile' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-sans">Connecting via Minecraft Bedrock (Pocket Edition):</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 font-sans leading-relaxed">
                  <li>Open Minecraft on your iPhone, iPad, or Android phone.</li>
                  <li>Tap <strong>Play</strong> &rarr; <strong>Servers</strong> tab.</li>
                  <li>Scroll to bottom and tap <strong>Add Server</strong>.</li>
                  <li>Set <strong>Server Name</strong> to anything you like.</li>
                  <li>Set <strong>Server Address</strong> to <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">myserver.erex.gg</code> and <strong>Port</strong> to <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">19132</code>.</li>
                  <li>Tap <strong>Save</strong> and tap <strong>Join</strong>.</li>
                </ol>
              </div>
            )}

            {guidePlatform === 'console' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-sans">Connecting via Xbox, Switch, or PlayStation:</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 font-sans leading-relaxed">
                  <li>Go into your Console Network Settings &rarr; DNS Settings.</li>
                  <li>Set Primary DNS to <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">104.238.130.180</code> (BedrockConnect server list redirector).</li>
                  <li>Launch Minecraft on your console and join any Featured Server (e.g. The Hive).</li>
                  <li>A custom BedrockConnect server menu will appear! Enter your server address to join instantly.</li>
                </ol>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Main FAQ Accordion */}
      <FaqSection />

      {/* Direct Support Card */}
      <section className="py-16 bg-[#070a12] border-t border-slate-800/80">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Still have questions?</h3>
          <p className="text-xs text-slate-400">
            Our 24/7 technical support engineers and community moderators are ready to assist you.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <a
              href="mailto:support@erex.gg"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Email Support Team</span>
            </a>

            <button
              type="button"
              onClick={() => soundManager.playPop()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Join Discord Community (12,000+ Admins)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
