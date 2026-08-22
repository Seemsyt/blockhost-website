import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Folder, File, FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ServerFileEditorModal } from '../../components/ServerFileEditorModal';

export const ServerFilesPage: React.FC = () => {
  const { server } = useOutletContext<any>();
  const [files, setFiles] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [editingFile, setEditingFile] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles(currentPath);
  }, [server.id, currentPath]);

  const fetchFiles = async (path: string) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/servers/${server.id}/files/list?path=${encodeURIComponent(path)}`);
      setFiles(data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (newPath: string) => {
    soundManager.playClick();
    setCurrentPath(newPath);
  };

  const handleBack = () => {
    if (!currentPath) return;
    const parts = currentPath.split('/');
    parts.pop();
    handleNavigate(parts.join('/'));
  };

  const isEditable = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['json', 'yml', 'yaml', 'properties', 'txt', 'md', 'log'].includes(ext || '');
  };

  const handleFileClick = (file: any) => {
    if (file.is_dir) {
      handleNavigate(currentPath ? `${currentPath}/${file.name}` : file.name);
    } else if (isEditable(file.name)) {
      soundManager.playPop();
      setEditingFile(currentPath ? `${currentPath}/${file.name}` : file.name);
    }
  };

  const getFileIcon = (file: any) => {
    if (file.is_dir) return <Folder className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />;
    if (isEditable(file.name)) return <FileText className="w-5 h-5 text-amber-400" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">File Manager</h2>
        <p className="text-sm text-slate-400 font-mono-code">Browse and manage your server files.</p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="bg-[#111] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              disabled={!currentPath}
              className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-mono-code font-bold text-slate-300">
              /home/container/{currentPath}
            </span>
          </div>
          <button onClick={() => fetchFiles(currentPath)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-950/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium w-32">Size</th>
                <th className="px-6 py-3 font-medium w-48">Modified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm font-mono-code text-slate-300">
              {files.map((file, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-3">
                    <div 
                      className={`flex items-center gap-3 ${file.is_dir || isEditable(file.name) ? 'cursor-pointer hover:text-emerald-400 transition-colors' : ''}`}
                      onClick={() => handleFileClick(file)}
                    >
                      {getFileIcon(file)}
                      {file.name}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-500">
                    {file.is_dir ? '-' : (file.size / 1024).toFixed(1) + ' KB'}
                  </td>
                  <td className="px-6 py-3 text-slate-500">
                    {new Date(file.modified * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
              {files.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-500">
                    This directory is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ServerFileEditorModal
        isOpen={!!editingFile}
        onClose={() => {
          setEditingFile(null);
          fetchFiles(currentPath); // Refresh to get updated size/modified
        }}
        serverId={server.id}
        filePath={editingFile || ''}
      />
    </div>
  );
};
