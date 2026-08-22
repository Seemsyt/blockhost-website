import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Shield, Plus, Download, Trash2, Clock, Calendar } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const ServerBackupsPage: React.FC = () => {
  const { server } = useOutletContext<any>();
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [schedule, setSchedule] = useState<any>(null);

  useEffect(() => {
    fetchBackups();
    fetchSchedule();
  }, [server.id]);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/servers/${server.id}/backups?limit=50`);
      setBackups(data.items || []);
    } catch (err) {
      console.error("Failed to fetch backups", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    try {
      const data = await apiFetch(`/servers/${server.id}/backup-schedule`);
      setSchedule(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createBackup = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    soundManager.playClick();
    try {
      await apiFetch(`/servers/${server.id}/backups`, {
        method: 'POST',
        body: JSON.stringify({ name: 'Manual Backup', description: 'Triggered from web panel' })
      });
      soundManager.playLevelUp();
      alert('Backup job started! It will appear here shortly.');
      setTimeout(fetchBackups, 3000);
    } catch (err: any) {
      alert(`Backup failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!window.confirm("Are you sure you want to delete this backup?")) return;
    setActionLoading(true);
    try {
      await apiFetch(`/servers/${server.id}/backups/${backupId}`, { method: 'DELETE' });
      soundManager.playPop();
      fetchBackups();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? (mb / 1024).toFixed(2) + ' GB' : mb.toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Backup Management</h2>
          <p className="text-sm text-slate-400 font-mono-code">Keep your server data safe.</p>
        </div>
        <button
          onClick={createBackup}
          disabled={actionLoading}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Plus className="w-4 h-4 fill-current" />
          Create Backup
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-emerald-500" />
            Backup History
          </h3>
          
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-emerald-500 py-10">Loading...</div>
            ) : backups.length === 0 ? (
              <div className="text-center text-slate-500 font-mono-code py-10 border-2 border-dashed border-slate-800 rounded-xl">
                No backups found.
              </div>
            ) : (
              backups.map(backup => (
                <div key={backup.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-emerald-500/30 transition-colors">
                  <div>
                    <h4 className="font-bold text-white text-sm">{backup.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs font-mono-code text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(backup.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span>{formatSize(backup.bytes)}</span>
                      {backup.is_successful ? (
                        <span className="text-emerald-500">SUCCESS</span>
                      ) : (
                        <span className="text-red-400">FAILED</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteBackup(backup.id)} className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-span-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 self-start">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-slate-400" />
            Schedule
          </h3>
          {schedule && schedule.enabled ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                Schedule is Active
              </div>
              <div className="space-y-2 text-sm font-mono-code text-slate-300">
                <div className="flex justify-between p-2 rounded bg-slate-950">
                  <span className="text-slate-500">Interval</span>
                  <span>Every {schedule.interval_minutes / 60} hours</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950">
                  <span className="text-slate-500">Retention</span>
                  <span>{schedule.retention_count} backups</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 font-mono-code py-6 border border-slate-800 rounded-xl">
              No schedule configured.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
