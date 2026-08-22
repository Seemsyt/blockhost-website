import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ServerDeployWizardModal } from './components/ServerDeployWizardModal';
import { DownloadModal } from './components/DownloadModal';
import { MinecraftFlavor } from './types';
import { BookPageTransition } from './components/BookPageTransition';
import { ScrollProgressBar } from './components/ScrollProgressBar';

// Multi-Page Routes
import { HomePage } from './pages/HomePage';
import { MobileAppPage } from './pages/MobileAppPage';
import { FlavorsPage } from './pages/FlavorsPage';
import { LiveConsolePage } from './pages/LiveConsolePage';
import { ModsMarketplacePage } from './pages/ModsMarketplacePage';
import { PricingPage } from './pages/PricingPage';
import { DatacentersPage } from './pages/DatacentersPage';
import { FaqPage } from './pages/FaqPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [deployWizardOpen, setDeployWizardOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<MinecraftFlavor>('paper');
  const [selectedRam, setSelectedRam] = useState<number>(4);

  // Handle plan selection from Pricing Calculator
  const handleSelectPlan = (ramGB: number, billing: 'monthly' | 'yearly') => {
    setSelectedRam(ramGB);
    setDeployWizardOpen(true);
  };

  // Handle direct flavor deploy
  const handleDeployFlavor = (flavor: MinecraftFlavor) => {
    setSelectedFlavor(flavor);
    setDeployWizardOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollProgressBar />
      <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-black font-sans relative flex flex-col justify-between overflow-x-hidden">
        
        {/* Flagship Global Navbar */}
        <Navbar
          onOpenDeployWizard={() => setDeployWizardOpen(true)}
          onOpenDownloadModal={() => setDownloadModalOpen(true)}
        />

        {/* 3D Book Page-Turning Transition Viewport */}
        <main className="flex-1 w-full relative">
          <BookPageTransition>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onOpenDeployWizard={() => setDeployWizardOpen(true)}
                    onOpenDownloadModal={() => setDownloadModalOpen(true)}
                    onSelectFlavor={(f) => setSelectedFlavor(f)}
                    selectedFlavor={selectedFlavor}
                    onDeployFlavor={handleDeployFlavor}
                    onSelectPlan={handleSelectPlan}
                  />
                }
              />

              <Route
                path="/mobile-app"
                element={
                  <MobileAppPage
                    onOpenDeployWizard={() => setDeployWizardOpen(true)}
                    onOpenDownloadModal={() => setDownloadModalOpen(true)}
                  />
                }
              />

              <Route
                path="/flavors"
                element={
                  <FlavorsPage
                    selectedFlavor={selectedFlavor}
                    onSelectFlavor={(f) => setSelectedFlavor(f)}
                    onDeployFlavor={handleDeployFlavor}
                    onOpenDeployWizard={() => setDeployWizardOpen(true)}
                  />
                }
              />

              <Route
                path="/console"
                element={
                  <LiveConsolePage
                    onOpenDeployWizard={() => setDeployWizardOpen(true)}
                  />
                }
              />

              <Route
                path="/mods"
                element={
                  <ModsMarketplacePage
                    onOpenDeployWizard={() => setDeployWizardOpen(true)}
                  />
                }
              />

              <Route
                path="/pricing"
                element={
                  <PricingPage
                    onSelectPlan={handleSelectPlan}
                    onOpenDeployWizard={() => setDeployWizardOpen(true)}
                  />
                }
              />

              <Route
                path="/network"
                element={
                  <DatacentersPage
                    onOpenDeployWizard={() => setDeployWizardOpen(true)}
                  />
                }
              />

              <Route
                path="/faq"
                element={<FaqPage />}
              />

              {/* 404 Void Page */}
              <Route
                path="*"
                element={<NotFoundPage />}
              />
            </Routes>
          </BookPageTransition>
        </main>

        {/* Global Footer */}
        <Footer
          onOpenDeployWizard={() => setDeployWizardOpen(true)}
          onOpenDownloadModal={() => setDownloadModalOpen(true)}
        />

        {/* Instant 45-Second Server Deployment Wizard Modal */}
        <ServerDeployWizardModal
          isOpen={deployWizardOpen}
          onClose={() => setDeployWizardOpen(false)}
          initialFlavor={selectedFlavor}
          initialRam={selectedRam}
          onOpenDownloadModal={() => {
            setDeployWizardOpen(false);
            setDownloadModalOpen(true);
          }}
        />

        {/* Mobile Download Modal (iOS, Android, APK, QR code) */}
        <DownloadModal
          isOpen={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
        />

      </div>
    </BrowserRouter>
  );
}
