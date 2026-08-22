import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Check, ShieldCheck, HardDrive, Cpu, 
  HelpCircle, Star, ArrowRight, Server, RefreshCw 
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
    { id: 'dedicated-ip', name: 'Dedicated IPv4 (Default Port 25565)', price: '$2.50/mo', desc: 'No port numbers needed. Players join directly via play.yourdomain.com.' },
    { id: 'backups', name: 'Automated 6-Hour S3 Snapshots', price: 'FREE', desc: 'Continuous rolling snapshots with 1-click restore to any point in time.' },
    { id: 'mysql', name: 'Managed MySQL / MariaDB Database', price: 'FREE', desc: 'Instant database provisioning for LuckPerms, CoreProtect, and Vault.' },
    { id: 'ddos-vip', name: 'VIP Priority Anycast BGP Scrubbing', price: '$3.00/mo', desc: 'Dedicated mitigation routing pipeline for large 100+ player tournament events.' },
  ];

  const toggleAddon = (id: string) => {
    soundManager.playPop();
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
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
      <section className="py-20 bg-[#070a12] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Server Upgrades & Add-Ons</h2>
            <p className="text-slate-300 text-sm">
              Enhance your server with dedicated network IPs, automated database instances, and enterprise backup schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {addOns.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 card-lift-subtle ${
                    isChecked
                      ? 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/80 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                    isChecked ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700 bg-slate-900'
                  }`}>
                    {isChecked && <Check className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{addon.name}</h4>
                      <span className="text-xs font-mono-code text-emerald-400 font-bold">{addon.price}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {addon.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Money-Back Guarantee & SLA */}
      <section className="py-20 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl shrink-0">
              🛡️
            </div>

            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-white">7-Day Risk-Free Money Back Guarantee</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                If you are not 100% satisfied with your server speed, latency, or our mobile app within your first 7 days, we will refund your payment immediately—no questions asked.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playLevelUp();
                onOpenDeployWizard();
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs shrink-0 whitespace-nowrap"
            >
              Get Started Risk-Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
