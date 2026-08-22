import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Settings, Save } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const ServerPropertiesPage: React.FC = () => {
  const { server } = useOutletContext<any>();
  const [properties, setProperties] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [server.id]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/servers/${server.id}/properties`);
      setProperties(data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    soundManager.playClick();
    try {
      await apiFetch(`/servers/${server.id}/properties`, {
        method: 'PUT',
        body: JSON.stringify(properties)
      });
      soundManager.playLevelUp();
      alert('Properties saved successfully! You may need to restart the server.');
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setProperties(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Server Properties</h2>
        <p className="text-sm text-slate-400 font-mono-code">Visual editor for server.properties</p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="bg-[#111] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-white">Properties Editor</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-emerald-500 text-center py-10">Loading properties...</div>
          ) : Object.keys(properties).length === 0 ? (
            <div className="text-slate-500 text-center font-mono-code py-10">
              No properties found (server may need to start first).
            </div>
          ) : (
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(properties).map(([key, value]) => {
                // Determine input type based on value
                let inputType = 'text';
                if (value === 'true' || value === 'false') {
                  // Boolean select
                  return (
                    <div key={key}>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2" title={key}>
                        {key.replace(/-/g, ' ')}
                      </label>
                      <select
                        value={value}
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-mono-code focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    </div>
                  );
                }

                if (!isNaN(Number(value)) && value !== '') {
                  inputType = 'number';
                }

                return (
                  <div key={key}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 truncate" title={key}>
                      {key.replace(/-/g, ' ')}
                    </label>
                    <input
                      type={inputType}
                      value={value}
                      onChange={e => handleChange(key, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-mono-code focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                );
              })}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
