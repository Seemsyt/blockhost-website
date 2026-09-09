import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';

const FAQS = [
  {
    q: 'What server flavors and versions does Erex support?',
    a: 'Erex supports every major Minecraft engine: Paper (PaperMC), Purpur, Bedrock Dedicated Server (BDS), Fabric, Forge, NeoForge, Spigot, and pure Vanilla Mojang. We support versions from 1.8.8 up to the latest 1.21.4 release, as well as weekly snapshot builds.'
  },
  {
    q: 'Does my mobile phone need to stay turned on for the server to run?',
    a: 'No! Your Minecraft server runs 24/7 in our enterprise datacenter cloud on dedicated AMD Ryzen 9 7950X3D hardware. Your phone is simply the control remote for live console, power states, player moderation, backups, and mod installations.'
  },
  {
    q: 'How does Bedrock & Pocket Edition crossplay work?',
    a: 'When you create a Paper or Purpur server and toggle "Enable Geyser Crossplay", our daemon automatically attaches GeyserMC and Floodgate on UDP port 19132. Players on iOS, Android, Nintendo Switch, Xbox, and Windows 10 can join using your standard server IP with zero client mods required.'
  },
  {
    q: 'Can I import my existing world from Singleplayer or Minecraft Realms?',
    a: 'Yes! In the mobile file manager, you can upload your existing world folder as a .ZIP file or connect via SFTP/FTP. Erex will automatically unpack and verify your level.dat coordinates.'
  },
  {
    q: 'How do the 1-click mods and plugins work?',
    a: 'Erex directly indexes CurseForge, Modrinth, and SpigotMC. When you tap "Install", our system downloads the correct jar matching your exact server flavor and version, resolves required dependencies (like Fabric API or Vault), and places it in your plugins/ or mods/ folder.'
  },
  {
    q: 'What DDoS protection is included?',
    a: 'All Erex servers are permanently protected by Path.net Anycast DDoS scrubbing with 12 Tbps filtering capacity. Layer 4 and Layer 7 Minecraft volumetric floods, bot joins, and ping attacks are filtered with zero TPS degradation.'
  },
  {
    q: 'Can I switch flavors after creating my server?',
    a: 'Yes, with 1 tap. You can easily switch from Vanilla to Paper or Purpur in the Flavors tab. Your world, player inventories, and builds are completely preserved.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    soundManager.playClick();
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#090d16] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow mesh orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] mesh-orb-emerald pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono-code text-emerald-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base">
              Everything you need to know about hosting Minecraft on Erex mobile.
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.35 }}
                className="rounded-2xl glass-card overflow-hidden transition-colors card-lift-subtle"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-slate-100 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-slate-400 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.08] font-sans">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

