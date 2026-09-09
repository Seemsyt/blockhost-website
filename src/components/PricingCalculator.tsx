import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sliders, Check, Zap, Shield, Cpu, HardDrive, 
  HelpCircle, ArrowRight, Sparkles, CheckCircle2, Star 
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';

interface Props {
  onSelectPlan: (ramGB: number, billing: 'monthly' | 'yearly') => void;
}

export const PricingCalculator: React.FC<Props> = ({ onSelectPlan }) => {
  const [ramGB, setRamGB] = useState(6);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Pricing math: base rate ~$1.80 per GB with volume discounts
  const calculatePrice = (gb: number) => {
    let rate = 1.95;
    if (gb >= 8) rate = 1.75;
    if (gb >= 16) rate = 1.55;
    
    const monthly = parseFloat((gb * rate).toFixed(2));
    const yearly = parseFloat((monthly * 0.8).toFixed(2)); // 20% discount

    return {
      monthly,
      yearly,
      activePrice: billingCycle === 'monthly' ? monthly : yearly
    };
  };

  const getRecommendedSpecs = (gb: number) => {
    if (gb <= 3) {
      return {
        tierName: 'Dirt Tier (Starter)',
        players: '5 - 12 Players',
        flavor: 'Bedrock Dedicated & Vanilla 1.21',
        storage: '25 GB NVMe Gen4',
        cpu: '2 vCPU Ryzen 9 7950X3D',
        badge: 'Best for Small Friend Group'
      };
    }
    if (gb <= 6) {
      return {
        tierName: 'Iron Tier (Standard SMP)',
        players: '20 - 45 Players',
        flavor: 'Paper, Purpur & Geyser Crossplay',
        storage: '60 GB NVMe Gen4',
        cpu: '3 vCPU Ryzen 9 7950X3D',
        badge: 'Most Popular for Public SMP'
      };
    }
    if (gb <= 12) {
      return {
        tierName: 'Diamond Tier (Modded & Pro)',
        players: '50 - 90 Players',
        flavor: 'Fabric 1.21, Create Mod & Heavy Plugins',
        storage: '120 GB NVMe Gen4',
        cpu: '4 vCPU Ryzen 9 7950X3D',
        badge: 'Best for Modern Modpacks'
      };
    }
    return {
      tierName: 'Netherite Tier (Mega Enterprise)',
      players: '100 - 200+ Players',
      flavor: 'Forge Mega Packs (ATM9) & Bungee Proxy',
      storage: '250 GB NVMe Gen4',
      cpu: '6 vCPU Ryzen 9 7950X3D',
      badge: 'Uncapped Extreme Power'
    };
  };

  const currentPricing = calculatePrice(ramGB);
  const specs = getRecommendedSpecs(ramGB);

  const predefinedTiers = [
    { name: 'Dirt Tier', ram: 2, icon: '🟫', price: billingCycle === 'monthly' ? 3.90 : 3.12, tag: 'Bedrock & Vanilla' },
    { name: 'Iron Tier', ram: 4, icon: '⬜', price: billingCycle === 'monthly' ? 7.80 : 6.24, tag: 'Paper SMP', popular: true },
    { name: 'Diamond Tier', ram: 8, icon: '💎', price: billingCycle === 'monthly' ? 14.00 : 11.20, tag: 'Fabric Modded' },
    { name: 'Netherite Tier', ram: 16, icon: '⬛', price: billingCycle === 'monthly' ? 24.80 : 19.84, tag: 'Heavy Modpacks' },
  ];

  return (
    <section id="pricing" className="py-24 relative bg-[#090d16] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow mesh orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] mesh-orb-emerald pointer-events-none opacity-60" />
      <div className="absolute top-10 right-10 w-[450px] h-[450px] mesh-orb-cyan pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-pill border border-emerald-500/30 text-xs font-mono-code text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold tracking-wider uppercase">Interactive Calculator</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Transparent Pricing. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Zero Hidden Fees.
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              All plans include unlimited player slots, unmetered bandwidth, NVMe Gen4 storage, and live mobile app management.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="pt-6 flex items-center justify-center">
              <div className="p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center gap-1 font-mono-code text-sm shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setBillingCycle('monthly');
                  }}
                  className={`px-6 py-2.5 rounded-xl transition-all font-bold cursor-pointer relative ${
                    billingCycle === 'monthly'
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {billingCycle === 'monthly' && (
                    <motion.div layoutId="billingToggle" className="absolute inset-0 bg-slate-800 rounded-xl shadow-md border border-white/5 z-0" />
                  )}
                  <span className="relative z-10">Monthly</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setBillingCycle('yearly');
                  }}
                  className={`px-6 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 cursor-pointer relative ${
                    billingCycle === 'yearly'
                      ? 'text-slate-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {billingCycle === 'yearly' && (
                    <motion.div layoutId="billingToggle" className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.3)] z-0" />
                  )}
                  <span className="relative z-10">Yearly</span>
                  <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${billingCycle === 'yearly' ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    SAVE 20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2-Column: Interactive RAM Slider Card & Live Spec Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto mb-20">
          
          {/* Left Column: Interactive Slider Container */}
          <ScrollReveal variant="fade-right" className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-500/20 transition-colors"></div>
              
              {/* Header with selected RAM */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono-code text-slate-400 uppercase tracking-widest font-bold">Memory Allocation</span>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-5xl font-extrabold font-mono-code text-white drop-shadow-md">{ramGB} GB</span>
                    <span className="text-sm font-mono-code text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">DDR5 ECC 5600MHz</span>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-slate-950/50 border border-emerald-500/30 text-right shadow-inner">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase block tracking-wider">Tier Rating</span>
                  <span className="text-sm font-mono-code font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">{specs.tierName.split(' ')[0]} Tier</span>
                </div>
              </div>

              {/* The Range Slider */}
              <div className="space-y-4 py-2">
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-l-lg pointer-events-none" style={{ width: `${((ramGB - 2) / 30) * 100}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-150"></div>
                  </div>
                  <input
                    id="pricing-ram-slider"
                    type="range"
                    min="2"
                    max="32"
                    step="1"
                    value={ramGB}
                    onChange={(e) => {
                      soundManager.playClick();
                      setRamGB(parseInt(e.target.value));
                    }}
                    className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer relative z-10 opacity-0"
                  />
                  <div className="absolute inset-0 h-3 bg-slate-950 border border-white/10 rounded-lg pointer-events-none"></div>
                </div>
                
                <div className="flex justify-between text-[11px] font-mono-code text-slate-500 font-bold tracking-wider uppercase">
                  <span>2 GB</span>
                  <span>8 GB</span>
                  <span>16 GB</span>
                  <span>32 GB</span>
                </div>
              </div>

              {/* Predefined Quick Jump Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {[2, 4, 8, 16].map((gb) => (
                  <button
                    key={gb}
                    onClick={() => {
                      soundManager.playPop();
                      setRamGB(gb);
                    }}
                    className={`py-3 rounded-xl text-xs font-mono-code font-bold border transition-all cursor-pointer ${
                      ramGB === gb
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                        : 'bg-slate-950/50 text-slate-400 border-white/5 hover:text-white hover:border-emerald-500/30 hover:bg-slate-900'
                    }`}
                  >
                    {gb} GB
                  </button>
                ))}
              </div>

              {/* Included Specs Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-slate-400 block text-[10px] font-mono-code uppercase tracking-widest mb-1 flex items-center gap-1.5"><Cpu className="w-3 h-3"/> CPU</span>
                  <span className="text-slate-100 font-bold font-mono-code text-sm">{specs.cpu}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-slate-400 block text-[10px] font-mono-code uppercase tracking-widest mb-1 flex items-center gap-1.5"><HardDrive className="w-3 h-3"/> Storage</span>
                  <span className="text-slate-100 font-bold font-mono-code text-sm">{specs.storage}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-slate-400 block text-[10px] font-mono-code uppercase tracking-widest mb-1">Capacity</span>
                  <span className="text-emerald-400 font-bold font-mono-code text-sm">{specs.players}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-slate-400 block text-[10px] font-mono-code uppercase tracking-widest mb-1">Flavor</span>
                  <span className="text-cyan-400 font-bold font-mono-code text-sm truncate block">{specs.flavor}</span>
                </div>
              </div>

            </div>
          </ScrollReveal>

          {/* Right Column: Live Plan Summary & Instant Checkout/Deploy */}
          <ScrollReveal variant="fade-left" className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/40 backdrop-blur-2xl border border-emerald-500/40 shadow-[0_0_30px_rgba(52,211,153,0.15)] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[120px] opacity-5 -mt-6 -mr-6">💎</div>
              
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono-code font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  {specs.badge}
                </span>
                
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-6xl font-extrabold font-mono-code text-white drop-shadow-lg">
                    ${currentPricing.activePrice}
                  </span>
                  <span className="text-slate-400 font-mono-code text-base">/mo</span>
                </div>

                <p className="text-sm text-emerald-400/80 mt-2 font-mono-code font-bold">
                  {billingCycle === 'yearly' ? 'Billed annually ($' + (currentPricing.activePrice * 12).toFixed(2) + '/yr)' : 'Billed monthly, cancel anytime.'}
                </p>
              </div>

              {/* Checklist of Included Features */}
              <div className="space-y-3.5 text-sm text-slate-300">
                {[
                  'Full Erex iOS & Android mobile app access',
                  'Real-time streaming live console & commands',
                  '1-Click Mod & Plugin installer (50,000+ available)',
                  'Hourly automated S3 cloud backups & rollback',
                  'Mobile SFTP & visual server.properties editor',
                  '12 Tbps DDoS mitigation (Path.net Protected)',
                  'Free custom subdomain (yourname.erex.gg)'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Main Action Button */}
              <button
                id="deploy-selected-plan-btn"
                type="button"
                onClick={() => {
                  soundManager.playLevelUp();
                  onSelectPlan(ramGB, billingCycle);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono-code text-base font-extrabold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(52,211,153,0.4)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Zap className="w-5 h-5 fill-current relative z-10" />
                <span className="relative z-10">Deploy {ramGB} GB Server (45s)</span>
                <ArrowRight className="w-5 h-5 relative z-10" />
              </button>
            </div>
          </ScrollReveal>

        </div>

        {/* 4 Standard Pre-packaged Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {predefinedTiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden group ${
                tier.popular 
                  ? 'bg-slate-900/80 border-emerald-500/50 shadow-[0_10px_30px_rgba(52,211,153,0.15)] ring-1 ring-emerald-500/30 hover:shadow-[0_15px_40px_rgba(52,211,153,0.25)]' 
                  : 'bg-slate-900/40 backdrop-blur-md border-white/10 hover:border-emerald-500/30 hover:bg-slate-900/60'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-emerald-500/30 transition-colors"></div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl filter drop-shadow-md">{tier.icon}</span>
                  {tier.popular && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                      POPULAR
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-white text-lg tracking-wide">{tier.name}</h4>
                <p className="text-xs text-emerald-400/80 font-mono-code mt-1 font-bold">{tier.tag}</p>

                <div className="my-6 pt-5 border-t border-white/[0.08]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono-code text-white group-hover:text-emerald-400 transition-colors">${tier.price.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 font-mono-code">/mo</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setRamGB(tier.ram);
                    window.scrollTo({ top: document.querySelector('#pricing')?.getBoundingClientRect().top! + window.scrollY - 100, behavior: 'smooth' });
                  }}
                  className={`w-full py-3 rounded-xl font-mono-code text-sm font-bold transition-all cursor-pointer ${
                    tier.popular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                      : 'bg-slate-800 hover:bg-emerald-500 text-white hover:text-slate-950 border border-white/5 hover:border-transparent'
                  }`}
                >
                  Select {tier.ram} GB
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
