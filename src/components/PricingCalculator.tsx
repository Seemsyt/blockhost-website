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
    { name: 'Iron Tier', ram: 4, icon: '⬜', price: billingCycle === 'monthly' ? 7.80 : 6.24, tag: 'Paper SMP (Popular)', popular: true },
    { name: 'Diamond Tier', ram: 8, icon: '💎', price: billingCycle === 'monthly' ? 14.00 : 11.20, tag: 'Fabric Modded' },
    { name: 'Netherite Tier', ram: 16, icon: '⬛', price: billingCycle === 'monthly' ? 24.80 : 19.84, tag: 'Heavy Modpacks' },
  ];

  return (
    <section id="pricing" className="py-24 relative bg-[#090d16] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow mesh orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] mesh-orb-emerald pointer-events-none" />
      <div className="absolute top-10 right-10 w-[450px] h-[450px] mesh-orb-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono-code text-emerald-400">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Server Calculator</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Transparent Pricing. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                No Hidden Fees or Player Slot Limits.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base">
              All plans include unlimited player slots, unmetered bandwidth, NVMe Gen4 storage, and live mobile app management.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <div className="p-1 rounded-2xl glass-panel border-white/[0.08] flex items-center gap-1 font-mono-code text-xs">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setBillingCycle('monthly');
                  }}
                  className={`px-4 py-2 rounded-xl transition-all font-bold cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly Billing
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setBillingCycle('yearly');
                  }}
                  className={`px-4 py-2 rounded-xl transition-all font-bold flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Yearly Billing</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                    SAVE 20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2-Column: Interactive RAM Slider Card & Live Spec Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto mb-16">
          
          {/* Left Column: Interactive Slider Container */}
          <ScrollReveal variant="fade-right" className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl glass-panel-heavy border-white/[0.1] shadow-2xl space-y-6 card-lift-subtle">
              
              {/* Header with selected RAM */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono-code text-slate-400 uppercase">Memory Allocation</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold font-mono-code text-white">{ramGB} GB</span>
                    <span className="text-sm font-mono-code text-emerald-400 font-bold">DDR5 ECC 5600MHz</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl glass-pill text-right border-emerald-500/30">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase block">Tier</span>
                  <span className="text-xs font-mono-code font-bold text-emerald-300">{specs.tierName.split(' ')[0]} Tier</span>
                </div>
              </div>

              {/* The Range Slider */}
              <div className="space-y-2">
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
                  className="w-full h-3 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-white/5"
                />
                <div className="flex justify-between text-[11px] font-mono-code text-slate-500">
                  <span>2 GB (Starter)</span>
                  <span>8 GB (SMP)</span>
                  <span>16 GB (Modpack)</span>
                  <span>32 GB (Titan)</span>
                </div>
              </div>

              {/* Predefined Quick Jump Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[2, 4, 8, 16].map((gb) => (
                  <button
                    key={gb}
                    onClick={() => {
                      soundManager.playPop();
                      setRamGB(gb);
                    }}
                    className={`py-2 rounded-xl text-xs font-mono-code font-bold border transition-all cursor-pointer ${
                      ramGB === gb
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'glass-panel text-slate-300 border-white/[0.08] hover:text-white hover:border-emerald-500/30'
                    }`}
                  >
                    {gb} GB
                  </button>
                ))}
              </div>

              {/* Included Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.08] text-xs">
                <div className="p-3 rounded-xl glass-panel-subtle">
                  <span className="text-slate-400 block text-[10px] font-mono-code uppercase">CPU Allocation</span>
                  <span className="text-slate-100 font-bold font-mono-code">{specs.cpu}</span>
                </div>
                <div className="p-3 rounded-xl glass-panel-subtle">
                  <span className="text-slate-400 block text-[10px] font-mono-code uppercase">Storage Drive</span>
                  <span className="text-slate-100 font-bold font-mono-code">{specs.storage}</span>
                </div>
                <div className="p-3 rounded-xl glass-panel-subtle">
                  <span className="text-slate-400 block text-[10px] font-mono-code uppercase">Recommended Capacity</span>
                  <span className="text-emerald-400 font-bold font-mono-code">{specs.players}</span>
                </div>
                <div className="p-3 rounded-xl glass-panel-subtle">
                  <span className="text-slate-400 block text-[10px] font-mono-code uppercase">Best Flavor</span>
                  <span className="text-cyan-400 font-bold font-mono-code truncate block">{specs.flavor}</span>
                </div>
              </div>

            </div>
          </ScrollReveal>

          {/* Right Column: Live Plan Summary & Instant Checkout/Deploy */}
          <ScrollReveal variant="fade-left" className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/40 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono-code font-bold glass-pill text-emerald-300 border-emerald-500/40 uppercase">
                  {specs.badge}
                </span>
                
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-5xl font-extrabold font-mono-code text-white">
                    ${currentPricing.activePrice}
                  </span>
                  <span className="text-slate-400 font-mono-code text-sm">/month</span>
                </div>

                <p className="text-xs text-slate-400 mt-1 font-mono-code">
                  {billingCycle === 'yearly' ? 'Billed annually ($' + (currentPricing.activePrice * 12).toFixed(2) + '/yr)' : 'Billed monthly, cancel anytime.'}
                </p>
              </div>

              {/* Checklist of Included Features */}
              <div className="space-y-2.5 text-xs text-slate-200">
                {[
                  'Full BlockHost iOS & Android mobile app access',
                  'Real-time streaming live console & commands',
                  '1-Click Mod & Plugin installer (50,000+ available)',
                  'Hourly automated S3 cloud backups & rollback',
                  'Mobile SFTP & visual server.properties editor',
                  '12 Tbps DDoS mitigation (Path.net Protected)',
                  'Free custom subdomain (yourname.blockhost.gg)',
                  '99.99% Network Uptime SLA guarantee'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono-code text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Deploy {ramGB} GB Server (45s)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

        </div>

        {/* 4 Standard Pre-packaged Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {predefinedTiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className={`p-5 rounded-2xl border card-lift cursor-pointer ${
                tier.popular 
                  ? 'glass-panel border-emerald-500/60 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/30' 
                  : 'glass-card hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{tier.icon}</span>
                {tier.popular && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-500 text-slate-950">
                    POPULAR
                  </span>
                )}
              </div>

              <h4 className="font-bold text-white text-base">{tier.name}</h4>
              <p className="text-xs text-slate-400 font-mono-code mt-0.5">{tier.tag}</p>

              <div className="my-4 pt-3 border-t border-white/[0.08]">
                <span className="text-2xl font-extrabold font-mono-code text-white">${tier.price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 font-mono-code">/mo</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setRamGB(tier.ram);
                  window.scrollTo({ top: document.querySelector('#pricing')?.getBoundingClientRect().top! + window.scrollY - 80, behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl glass-panel hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-mono-code text-xs font-bold transition-all cursor-pointer"
              >
                Select {tier.ram} GB
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

