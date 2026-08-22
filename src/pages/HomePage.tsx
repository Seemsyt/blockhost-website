import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { MobileFeaturesSection } from '../components/MobileFeaturesSection';
import { FlavorsSection } from '../components/FlavorsSection';
import { LiveConsoleShowcase } from '../components/LiveConsoleShowcase';
import { ModsBrowserSection } from '../components/ModsBrowserSection';
import { PricingCalculator } from '../components/PricingCalculator';
import { GlobalNetworkSection } from '../components/GlobalNetworkSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FaqSection } from '../components/FaqSection';
import { MinecraftFlavor } from '../types';

interface Props {
  onOpenDeployWizard: () => void;
  onOpenDownloadModal: () => void;
  onSelectFlavor: (flavor: MinecraftFlavor) => void;
  selectedFlavor: MinecraftFlavor;
  onDeployFlavor: (flavor: MinecraftFlavor) => void;
  onSelectPlan: (ramGB: number, billing: 'monthly' | 'yearly') => void;
}

export const HomePage: React.FC<Props> = ({
  onOpenDeployWizard,
  onOpenDownloadModal,
  onSelectFlavor,
  selectedFlavor,
  onDeployFlavor,
  onSelectPlan
}) => {
  return (
    <div className="space-y-0">
      {/* Hero Section with Interactive 3D Minecraft Block */}
      <HeroSection
        onOpenDeployWizard={onOpenDeployWizard}
        onOpenDownloadModal={onOpenDownloadModal}
        onSelectFlavor={onSelectFlavor}
      />

      {/* Interactive Mobile App Simulator & Bento Features Breakdown */}
      <MobileFeaturesSection
        onOpenDeployWizard={onOpenDeployWizard}
        onOpenDownloadModal={onOpenDownloadModal}
      />

      {/* Flavors Section (Paper, Purpur, Bedrock BDS, Fabric, Forge, Vanilla) */}
      <FlavorsSection
        selectedFlavor={selectedFlavor}
        onSelectFlavor={onSelectFlavor}
        onDeployFlavor={onDeployFlavor}
      />

      {/* Live Mobile Console Deep Dive */}
      <LiveConsoleShowcase />

      {/* 1-Click Mods & Plugin Browser Marketplace */}
      <ModsBrowserSection
        onOpenDeployWizard={onOpenDeployWizard}
      />

      {/* Interactive Pricing & Specs Calculator */}
      <PricingCalculator
        onSelectPlan={onSelectPlan}
      />

      {/* Global Datacenters & Live Ping Benchmark Tester */}
      <GlobalNetworkSection />

      {/* Client Reviews & Proof */}
      <TestimonialsSection />

      {/* Searchable FAQ */}
      <FaqSection />
    </div>
  );
};
