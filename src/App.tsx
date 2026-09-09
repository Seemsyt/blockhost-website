import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ServerDeployWizardModal } from './components/ServerDeployWizardModal';
import { DownloadModal } from './components/DownloadModal';
import { AuthModal } from './components/AuthModal';
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
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

// Dashboard Routes
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ServerLayout } from './components/ServerLayout';
import { ServerControlPage } from './pages/server/ServerControlPage';
import { ServerConsolePage } from './pages/server/ServerConsolePage';
import { ServerSettingsPage } from './pages/server/ServerSettingsPage';
import { ServerModsPage } from './pages/server/ServerModsPage';
import { ServerFilesPage } from './pages/server/ServerFilesPage';
import { ServerBackupsPage } from './pages/server/ServerBackupsPage';
import { ServerPlayersPage } from './pages/server/ServerPlayersPage';
import { ServerPropertiesPage } from './pages/server/ServerPropertiesPage';
import { SettingsPage } from './pages/SettingsPage';

// Admin Routes
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

const MarketingLayout = ({ 
  deployWizardOpen, setDeployWizardOpen, 
  downloadModalOpen, setDownloadModalOpen, 
  authModalOpen, setAuthModalOpen,
  selectedFlavor, setSelectedFlavor, 
  handleDeployFlavor, handleSelectPlan, selectedRam 
}: any) => (
  <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-black font-sans relative flex flex-col justify-between overflow-x-hidden">
    <Navbar
      onOpenDeployWizard={() => setDeployWizardOpen(true)}
      onOpenDownloadModal={() => setDownloadModalOpen(true)}
      onOpenAuthModal={() => setAuthModalOpen(true)}
    />
    <main className="flex-1 w-full relative">
      <BookPageTransition>
        <Routes>
          <Route path="/" element={<HomePage onOpenDeployWizard={() => setDeployWizardOpen(true)} onOpenDownloadModal={() => setDownloadModalOpen(true)} onSelectFlavor={setSelectedFlavor} selectedFlavor={selectedFlavor} onDeployFlavor={handleDeployFlavor} onSelectPlan={handleSelectPlan} />} />
          <Route path="/mobile-app" element={<MobileAppPage onOpenDeployWizard={() => setDeployWizardOpen(true)} onOpenDownloadModal={() => setDownloadModalOpen(true)} />} />
          <Route path="/flavors" element={<FlavorsPage selectedFlavor={selectedFlavor} onSelectFlavor={setSelectedFlavor} onDeployFlavor={handleDeployFlavor} onOpenDeployWizard={() => setDeployWizardOpen(true)} />} />
          <Route path="/console" element={<LiveConsolePage onOpenDeployWizard={() => setDeployWizardOpen(true)} />} />
          <Route path="/mods" element={<ModsMarketplacePage onOpenDeployWizard={() => setDeployWizardOpen(true)} />} />
          <Route path="/pricing" element={<PricingPage onSelectPlan={handleSelectPlan} onOpenDeployWizard={() => setDeployWizardOpen(true)} />} />
          <Route path="/network" element={<DatacentersPage onOpenDeployWizard={() => setDeployWizardOpen(true)} />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BookPageTransition>
    </main>
    <Footer onOpenDeployWizard={() => setDeployWizardOpen(true)} onOpenDownloadModal={() => setDownloadModalOpen(true)} />
    
    <ServerDeployWizardModal isOpen={deployWizardOpen} onClose={() => setDeployWizardOpen(false)} initialFlavor={selectedFlavor} initialRam={selectedRam} onOpenDownloadModal={() => { setDeployWizardOpen(false); setDownloadModalOpen(true); }} />
    <DownloadModal isOpen={downloadModalOpen} onClose={() => setDownloadModalOpen(false)} />
    <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
  </div>
);

export default function App() {
  const [deployWizardOpen, setDeployWizardOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<MinecraftFlavor>('paper');
  const [selectedRam, setSelectedRam] = useState<number>(4);

  useEffect(() => {
    const handleOpenDeploy = () => setDeployWizardOpen(true);
    window.addEventListener('open-deploy-wizard', handleOpenDeploy);
    return () => window.removeEventListener('open-deploy-wizard', handleOpenDeploy);
  }, []);

  const handleDeployFlavor = (f: MinecraftFlavor) => {
    setSelectedFlavor(f);
    setDeployWizardOpen(true);
  };

  const handleSelectPlan = (ramGB: number, billing: 'monthly' | 'yearly') => {
    setSelectedRam(ramGB);
    setDeployWizardOpen(true);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <ScrollProgressBar />
        <Routes>
          {/* Protected App Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="server/:id" element={<ServerLayout />}>
              <Route index element={<ServerControlPage />} />
              <Route path="console" element={<ServerConsolePage />} />
              <Route path="settings" element={<ServerSettingsPage />} />
              <Route path="mods" element={<ServerModsPage />} />
              <Route path="files" element={<ServerFilesPage />} />
              <Route path="players" element={<ServerPlayersPage />} />
              <Route path="backups" element={<ServerBackupsPage />} />
              <Route path="properties" element={<ServerPropertiesPage />} />
            </Route>
          </Route>

          {/* Protected Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
          </Route>
          
          {/* Marketing Website Catch-All */}
          <Route path="*" element={
            <MarketingLayout 
              deployWizardOpen={deployWizardOpen} setDeployWizardOpen={setDeployWizardOpen}
              downloadModalOpen={downloadModalOpen} setDownloadModalOpen={setDownloadModalOpen}
              authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen}
              selectedFlavor={selectedFlavor} setSelectedFlavor={setSelectedFlavor}
              handleDeployFlavor={handleDeployFlavor} handleSelectPlan={handleSelectPlan}
              selectedRam={selectedRam}
            />
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
