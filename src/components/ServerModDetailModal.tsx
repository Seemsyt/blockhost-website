import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, AlertCircle, Package } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { apiFetch } from '../utils/api';
import { soundManager } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  projectId: string;
  initialTitle: string;
}

export const ServerModDetailModal: React.FC<Props> = ({ isOpen, onClose, serverId, projectId, initialTitle }) => {
  const [modDetails, setModDetails] = useState<any>(null);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchModDetails();
    }
  }, [isOpen, projectId]);

  const fetchModDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/servers/${serverId}/mods/${projectId}`);
      setModDetails(data);
      if (data.versions && data.versions.length > 0) {
        setSelectedVersion(data.versions[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load mod details');
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async () => {
    if (!modDetails || !selectedVersion) return;
    
    const isNewest = selectedVersion.id === modDetails.versions[0].id;

    if (!isNewest) {
      const proceed = window.confirm(
        `Compatibility Warning!\n\nYou are selecting an older version (${selectedVersion.version_number}). Changing mod versions can cause world corruption or plugin conflicts. An automatic backup will be taken before the switch.\n\nDo you want to proceed?`
      );
      if (!proceed) return;

      setInstalling(true);
      try {
        // Create backup
        await apiFetch(`/servers/${serverId}/backups`, {
          method: 'POST',
          body: JSON.stringify({
            name: `Pre-switch: ${modDetails.title} v${selectedVersion.version_number}`,
            description: 'Automatic backup before installing older mod version.'
          })
        });
      } catch (err: any) {
        alert(`Failed to take backup: ${err.message}`);
        setInstalling(false);
        return;
      }
    } else {
      setInstalling(true);
    }

    try {
      await apiFetch(`/servers/${serverId}/mods/install`, {
        method: 'POST',
        body: JSON.stringify({
          project_id: modDetails.project_id,
          version_id: selectedVersion.id
        })
      });
      soundManager.playLevelUp();
      alert(`${modDetails.title} installed! Restart server to activate.`);
      onClose();
    } catch (err: any) {
      soundManager.playPop();
      alert(`Install failed: ${err.message}`);
    } finally {
      setInstalling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-4xl bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] my-4"
        >
          {/* Header */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 truncate pr-4">
              <Package className="w-6 h-6 text-emerald-500 shrink-0" />
              <span className="truncate">{modDetails?.title || initialTitle}</span>
            </h3>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-emerald-500 gap-4">
                <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-sm font-mono-code">Loading details...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-red-400 font-bold mb-2">Failed to load mod</p>
                <p className="text-sm text-red-400/80 font-mono-code max-w-md">{error}</p>
              </div>
            ) : modDetails ? (
              <div className="space-y-8">
                {/* Info Block */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {modDetails.icon_url ? (
                    <img src={modDetails.icon_url} alt={modDetails.title} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      <Package className="w-10 h-10 text-emerald-500" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-slate-400 font-mono-code">
                      <strong className="text-white">{modDetails.downloads?.toLocaleString() || 0}</strong> downloads
                    </p>
                    {modDetails.categories && (
                      <div className="flex flex-wrap gap-2">
                        {modDetails.categories.slice(0, 5).map((cat: string) => (
                          <span key={cat} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono-code font-bold">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Version</label>
                    <select
                      value={selectedVersion?.id || ''}
                      onChange={(e) => setSelectedVersion(modDetails.versions.find((v: any) => v.id === e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono-code focus:outline-none focus:border-emerald-500/50"
                    >
                      {modDetails.versions?.map((v: any, idx: number) => (
                        <option key={v.id} value={v.id}>
                          {v.version_number} {idx === 0 ? '(Latest)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleInstall}
                    disabled={installing || !selectedVersion}
                    className="w-full py-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold font-mono-code border border-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {installing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin" />
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        {selectedVersion?.id === modDetails.versions?.[0]?.id ? 'Install Latest' : 'Backup & Install'}
                      </>
                    )}
                  </button>
                </div>

                {/* Markdown Description */}
                <div className="prose prose-invert prose-emerald max-w-none p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <ReactMarkdown>
                    {modDetails.body || modDetails.description || 'No description provided.'}
                  </ReactMarkdown>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
