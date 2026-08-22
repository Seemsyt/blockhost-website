import React from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquare, ShieldCheck, Heart, Users } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const REVIEWS = [
  {
    name: 'Marcus "Krypto" Vance',
    role: 'Owner, Horizon SMP (85+ Concurrent Players)',
    avatar: '⚔️',
    flavor: 'Purpur 1.21.4',
    rating: 5,
    text: 'Running a 80-player SMP used to mean sitting at my desktop constantly watching logs. With BlockHost on my iPhone, I can op players, roll back griefing, and check TPS while waiting in line at coffee. It literally changed how I manage my community.'
  },
  {
    name: 'Sarah Chen',
    role: 'Bedrock Realm Migrator & Pocket Edition Host',
    avatar: '📱',
    flavor: 'Bedrock BDS + Geyser',
    rating: 5,
    text: 'We exceeded the 10-player limit on standard Minecraft Realms. BlockHost allowed our entire school class of 35 Bedrock and iOS players to connect with 0 lag and 20.0 TPS. The 1-click cloud backups gave us total peace of mind.'
  },
  {
    name: 'Dmitri Pavlov',
    role: 'Lead Developer, IndustrialTech Modpack',
    avatar: '⚙️',
    flavor: 'Fabric 1.21 Modded',
    rating: 5,
    text: 'Deploying heavy Fabric servers with Create Mod and 80 add-ons used to take 2 hours of config troubleshooting. The 1-click mod installer and instant JVM flag optimization had our world booted in under a minute.'
  },
  {
    name: 'Tyler & Liam',
    role: 'Factions & PvP Tournament Organizers',
    avatar: '🏆',
    flavor: 'Paper 1.21.4 + Path.net DDoS Shield',
    rating: 5,
    text: 'We were targeted by a 400 Gbps DDoS attack during our finals weekend. Path.net scrubbed every bit with zero lag spikes. The live console streamed all alerts directly to my lock screen push notifications.'
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-24 relative bg-[#070a12] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow mesh orbs */}
      <div className="absolute top-1/3 left-1/3 w-[650px] h-[450px] mesh-orb-emerald pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] mesh-orb-purple pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono-code text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Loved by 48,000+ Server Owners</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Trusted by Creators, SMPs & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300">
                Community Leaders Worldwide.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base">
              See why server admins rate BlockHost 4.9/5 stars on iOS App Store and Google Play.
            </p>
          </div>
        </ScrollReveal>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((r, idx) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.45 }}
              className="p-6 sm:p-8 rounded-3xl glass-card flex flex-col justify-between shadow-xl card-lift-amber cursor-default group hover:border-amber-400/30"
            >
              <div className="space-y-4">
                {/* Rating & Flavor pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold glass-pill text-emerald-300 border-emerald-500/30">
                    {r.flavor}
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed italic">
                  "{r.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full glass-panel border-white/[0.12] flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  {r.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{r.name}</h4>
                  <p className="text-xs text-slate-400 font-mono-code">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

