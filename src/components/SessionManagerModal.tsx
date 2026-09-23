import React, { useRef, useState } from 'react';
import {
  X,
  FolderKanban,
  Plus,
  GitBranch,
  Download,
  Upload,
  Trash2,
  Check,
  Calendar,
  MessageSquare,
  Flame,
  Swords,
  Scroll,
} from 'lucide-react';
import { RoleplaySession, UniverseType } from '../types/roleplay';

interface SessionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: RoleplaySession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: (universeType: UniverseType, title?: string) => void;
  onDuplicateSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onExportSession: (session: RoleplaySession) => void;
  onImportSession: (jsonText: string) => void;
}

export const SessionManagerModal: React.FC<SessionManagerModalProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDuplicateSession,
  onDeleteSession,
  onExportSession,
  onImportSession,
}) => {
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseType>('mha');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession(selectedUniverse, newTitle.trim() || undefined);
    setNewTitle('');
    setShowCreateOptions(false);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportSession(text);
        onClose();
      } catch (err: any) {
        alert('Failed to import campaign: ' + (err.message || 'Invalid JSON'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Campaigns &amp; Continuity Manager</h2>
              <p className="text-xs text-slate-400">
                All roleplay sessions are saved locally on your device for future session continuity.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateOptions(!showCreateOptions)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>New Campaign</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Import Campaign</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {sessions.length} Saved {sessions.length === 1 ? 'Campaign' : 'Campaigns'}
          </span>
        </div>

        {/* Create Campaign Drawer */}
        {showCreateOptions && (
          <form
            onSubmit={handleCreate}
            className="p-4 bg-slate-950 border-b border-amber-500/40 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Universe Foundation
                </label>
                <select
                  value={selectedUniverse}
                  onChange={(e) => setSelectedUniverse(e.target.value as UniverseType)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="mha">My Hero Academia RPG</option>
                  <option value="naruto">Naruto Shippuden RPG</option>
                  <option value="jjk">Jujutsu Kaisen RPG</option>
                  <option value="custom">Custom Anime / Fantasy Universe</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. MHA: The Shadow Vanguard AU"
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateOptions(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Create Campaign
              </button>
            </div>
          </form>
        )}

        {/* Sessions List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {sessions.map((sess) => {
            const isActive = sess.id === activeSessionId;
            const isMHA = sess.universeType === 'mha';
            const isNaruto = sess.universeType === 'naruto';

            return (
              <div
                key={sess.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-900 to-slate-850 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 mt-0.5 ${
                        isMHA
                          ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                          : isNaruto
                          ? 'bg-orange-600/30 text-orange-400 border border-orange-500/40'
                          : 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                      }`}
                    >
                      {isMHA ? <Flame className="w-5 h-5" /> : isNaruto ? <Swords className="w-5 h-5" /> : <Scroll className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {sess.universe}
                        </span>
                        {isActive && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Active Session
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white mb-0.5">{sess.title}</h3>

                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span>
                          Hero: <strong className="text-slate-200">{sess.character.name}</strong> ({sess.character.alias})
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-500" />
                          {sess.messages.length} messages
                        </span>
                        <span>•</span>
                        <span>
                          {sess.fanficDivergences.filter((d) => d.active).length} active divergences
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    {!isActive && (
                      <button
                        onClick={() => {
                          onSelectSession(sess.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition"
                      >
                        Switch
                      </button>
                    )}

                    <button
                      onClick={() => onDuplicateSession(sess.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 rounded-xl transition"
                      title="Fork timeline branch (explore alternate fanfic choices from here)"
                    >
                      <GitBranch className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onExportSession(sess)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 rounded-xl transition"
                      title="Export Campaign JSON backup"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {sessions.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete campaign "${sess.title}"?`)) {
                            onDeleteSession(sess.id);
                          }
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-xl transition"
                        title="Delete campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
