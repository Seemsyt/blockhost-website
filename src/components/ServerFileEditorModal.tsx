import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, FileCode2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { soundManager } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  filePath: string;
}

export const ServerFileEditorModal: React.FC<Props> = ({ isOpen, onClose, serverId, filePath }) => {
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && filePath) {
      loadFile();
    }
  }, [isOpen, filePath]);

  const loadFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/servers/${serverId}/files/read?path=${encodeURIComponent(filePath)}`);
      setContent(data.content || '');
      setOriginalContent(data.content || '');
    } catch (err: any) {
      setError(err.message || 'Failed to read file');
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async () => {
    if (content === originalContent) {
      soundManager.playPop();
      onClose();
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/servers/${serverId}/files/write?path=${encodeURIComponent(filePath)}`, {
        method: 'PUT',
        body: JSON.stringify({ content })
      });
      soundManager.playLevelUp();
      onClose();
    } catch (err: any) {
      soundManager.playPop();
      setError(err.message || 'Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = content !== originalContent;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-5xl h-[85vh] rounded-2xl bg-[#090d16] border border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FileCode2 className="w-5 h-5 text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-white font-mono-code">{filePath.split('/').pop()}</h3>
                <p className="text-[10px] text-slate-500 font-mono-code truncate max-w-[200px] md:max-w-md">
                  {filePath}
                </p>
              </div>
              {hasChanges && (
                <div className="w-2 h-2 rounded-full bg-amber-400 ml-2" title="Unsaved changes" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={saveFile}
                disabled={loading || saving}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold font-mono-code flex items-center gap-2 transition-all ${
                  hasChanges 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                } disabled:opacity-50`}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative bg-[#1E1E2E]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-emerald-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <span className="text-sm font-mono-code">Loading file...</span>
                </div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="max-w-md p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                  <p className="text-red-400 font-bold mb-2">Error loading file</p>
                  <p className="text-sm text-red-400/80 font-mono-code">{error}</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex overflow-hidden">
                {/* Line numbers (simplified) */}
                <div className="w-12 bg-[#181825] border-r border-[#313244] flex-shrink-0 text-right py-4 pr-3 overflow-hidden text-[#585B70] font-mono-code text-sm leading-relaxed pointer-events-none select-none hidden md:block">
                  {content.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  spellCheck={false}
                  className="flex-1 w-full h-full resize-none bg-transparent text-[#CDD6F4] font-mono-code text-sm leading-relaxed p-4 focus:outline-none focus:ring-0"
                  style={{
                    tabSize: 4,
                  }}
                  onKeyDown={(e) => {
                    // Basic tab support
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const start = e.currentTarget.selectionStart;
                      const end = e.currentTarget.selectionEnd;
                      const newContent = content.substring(0, start) + '    ' + content.substring(end);
                      setContent(newContent);
                      // React state update is async, so we need a tiny timeout to set cursor
                      setTimeout(() => {
                        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                      }, 0);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
