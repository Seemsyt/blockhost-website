import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Check, ShieldCheck, HardDrive, Cpu, 
  HelpCircle, Star, ArrowRight, Server, RefreshCw, Layers 
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { PricingCalculator } from '../components/PricingCalculator';
import { soundManager } from '../utils/audio';

interface Props {
  onSelectPlan: (ramGB: number, billing: 'monthly' | 'yearly') => void;
  onOpenDeployWizard: () => void;
}

export const PricingPage: React.FC<Props> = ({ onSelectPlan, onOpenDeployWizard }) => {
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['backups']);

  const addOns = [
    { id: 'dedicated-ip', name: 'Dedicated IPv4 (Default Port 25565)', price: '$2.50/mo', desc: 'No port numbers needed. Players join directly via play.yourdomain.com.', icon: <Globe className="w-5 h-5" /> },
    { id: 'backups', name: 'Automated 6-Hour S3 Snapshots', price: 'FREE', desc: 'Continuous rolling snapshots with 1-click restore to any point in time.', icon: <RefreshCw className="w-5 h-5" /> },
    { id: 'mysql', name: 'Managed MySQL / MariaDB Database', price: 'FREE', desc: 'Instant database provisioning for LuckPerms, CoreProtect, and Vault.', icon: <HardDrive className="w-5 h-5" /> },
    { id: 'ddos-vip', name: 'VIP Priority Anycast BGP Scrubbing', price: '$3.00/mo', desc: 'Dedicated mitigation routing pipeline for large 100+ player tournament events.', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  // Helper icon for missing imports
  const Globe = ({className}: {className:string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>

  const toggleAddon = (id: string) => {
    soundManager.playPop();
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      {/* Route Header */}
      <PageHeader
        badge="Simple, Transparent Hosting"
        badgeIcon={<Zap className="w-3.5 h-3.5" />}
        title="Predictable Pricing with"
        highlightedTitle="Zero Hidden Fees."
        description="Choose exactly the RAM your community needs. Every plan includes dedicated AMD Ryzen 9 7950X3D vCPUs, unmetered NVMe SSD storage, Path.net DDoS filtering, and mobile app access."
        crumbs={[{ label: 'Plans & Pricing' }]}
      />

      {/* Interactive Pricing Calculator Component */}
      <PricingCalculator onSelectPlan={onSelectPlan} />

      {/* Add-ons & Extras */}
      <section className="py-24 relative bg-[#090d16] border-t border-white/5 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-900/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-cyan-900/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono-code text-cyan-400">
              <Layers className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest font-bold">Enhancements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Server Upgrades & Add-Ons</h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Enhance your server with dedicated network IPs, automated database instances, and enterprise backup schedules to power complex modpacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {addOns.map((addon, idx) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex items-start gap-5 group relative overflow-hidden ${
                    isChecked
                      ? 'bg-slate-900/80 border-emerald-500/60 shadow-[0_0_20px_rgba(52,211,153,0.15)] -translate-y-1'
                      : 'bg-slate-950/60 backdrop-blur-md border-white/5 hover:border-emerald-500/30 hover:bg-slate-900/80'
                  }`}
                >
                  {isChecked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
                  )}

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    isChecked 
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]' 
                      : 'bg-slate-800/80 text-slate-400 border border-white/10 group-hover:text-emerald-400'
                  }`}>
                    {isChecked ? <Check className="w-6 h-6" /> : addon.icon}
                  </div>

                  <div className="flex-1 space-y-2 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-extrabold text-white text-base">{addon.name}</h4>
                      <span className={`text-xs font-mono-code font-bold px-2.5 py-1 rounded-md ${
                        addon.price === 'FREE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {addon.price}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-sans leading-relaxed">
                      {addon.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Money-Back Guarantee & SLA */}
      <section className="py-24 bg-[#030712] relative overflow-hidden">
        {/* Glow behind the shield */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl"
          >
            <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(52,211,153,0.2)] relative">
              <ShieldCheck className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              <div className="absolute inset-0 bg-emerald-400/20 rounded-3xl blur-xl -z-10"></div>
            </div>

            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-2xl font-extrabold text-white">7-Day Risk-Free Guarantee</h3>
              <p className="text-base text-slate-300 font-sans leading-relaxed">
                If you are not 100% satisfied with your server speed, our Path.net DDoS protection, or the Erex mobile app within your first 7 days, we will refund your payment immediately—no questions asked.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playLevelUp();
                onOpenDeployWizard();
              }}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-200 text-slate-950 font-extrabold font-mono-code text-sm shrink-0 whitespace-nowrap shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
            >
              Get Started Risk-Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
