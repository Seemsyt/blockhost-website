import React from 'react';
import { motion } from 'motion/react';
import { 
  X, Smartphone, Apple, Play, Download, 
  QrCode, ShieldCheck, Zap, Bell, CheckCircle2, Star 
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 relative overflow-hidden"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl shadow-lg">
            📱
          </div>

          <h3 className="text-2xl font-extrabold text-white">
            Get Erex on Your Phone
          </h3>
          
          <p className="text-xs sm:text-sm text-slate-300">
            Native iOS & Android apps with live console, push notifications, and 1-click mod manager.
          </p>
        </div>

        {/* QR Code & Scan Instructions */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
            <QrCode className="w-full h-full text-slate-950" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase font-bold text-emerald-400">Scan with Camera</span>
            <h4 className="text-sm font-bold text-white">Direct Mobile Install</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Point your smartphone camera at this code to immediately download or sync your running server.
            </p>
          </div>
        </div>

        {/* App Store Buttons */}
        <div className="space-y-2.5 mb-6">
          {/* iOS App Store */}
          <a
            href="#download-ios"
            onClick={(e) => {
              e.preventDefault();
              soundManager.playLevelUp();
              alert("Downloading Erex for iOS (TestFlight / App Store build v3.5.2)...");
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white text-xl">
                
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono-code text-slate-400 block leading-tight">Available on</span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-300">Apple App Store & TestFlight</span>
              </div>
            </div>
            <span className="text-xs font-mono-code text-slate-400">iOS 16+</span>
          </a>

          {/* Google Play Store */}
          <a
            href="#download-android"
            onClick={(e) => {
              e.preventDefault();
              soundManager.playLevelUp();
              alert("Downloading Erex for Android (Google Play build v3.5.2)...");
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-emerald-400 text-xl">
                ▶
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono-code text-slate-400 block leading-tight">Get it on</span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-300">Google Play Store</span>
              </div>
            </div>
            <span className="text-xs font-mono-code text-slate-400">Android 10+</span>
          </a>

          {/* Direct APK */}
          <a
            href="#download-apk"
            onClick={(e) => {
              e.preventDefault();
              soundManager.playPop();
              alert("Direct APK download started: Erex-v3.5.2-release.apk (18.4 MB)");
            }}
            className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-between transition-all text-xs text-slate-300 font-mono-code"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Direct APK Download (v3.5.2)</span>
            </div>
            <span className="text-slate-500">18.4 MB</span>
          </a>
        </div>

        {/* Mobile App Highlights */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Biometric Lock (FaceID)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Crash Push Alerts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-Time Log Stream</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Offline Queueing</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
