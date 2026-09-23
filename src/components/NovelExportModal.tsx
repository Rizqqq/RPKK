import React, { useState } from 'react';
import { X, BookOpen, Download, Copy, Check, FileText, Sparkles } from 'lucide-react';
import { RoleplaySession } from '../types/roleplay';
import { storageService } from '../services/storage';

interface NovelExportModalProps {
  session: RoleplaySession;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNarrativeStyle: (style: RoleplaySession['narrativeStyle']) => void;
}

export const NovelExportModal: React.FC<NovelExportModalProps> = ({
  session,
  isOpen,
  onClose,
  onUpdateNarrativeStyle,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownText = storageService.exportNovelMarkdown(session);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title.replace(/[^a-z0-9_-]/gi, '_')}_novel_chapter.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Chronicle Reader &amp; Novel Export</h2>
              <p className="text-xs text-slate-400">
                Read your loreplaying transcript formatted as a continuous anime light novel
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

        {/* Narrative Style Toolbar */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Narrative Prose Style:</span>
            <select
              value={session.narrativeStyle}
              onChange={(e) => onUpdateNarrativeStyle(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="cinematic shonen">Cinematic Shonen (High energy, vivid powers)</option>
              <option value="gritty dark shonen">Gritty Dark Shonen (Visceral stakes, tension)</option>
              <option value="detailed light novel">Detailed Light Novel (Rich psychology &amp; world rules)</option>
              <option value="fast-paced manga">Fast-Paced Manga Action (Snappy banter &amp; impacts)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Transcript' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>
          </div>
        </div>

        {/* Formatted Reader Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/70 space-y-6 font-serif">
          {/* Cover style Title */}
          <div className="text-center py-6 border-b border-slate-800 font-sans">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {session.universe} Chronicle
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-1">
              {session.title}
            </h1>
            <p className="text-sm text-slate-400">
              Protagonist: <strong className="text-slate-200">{session.character.name}</strong> ({session.character.alias}) — {session.character.power}
            </p>
          </div>

          {/* Active Divergences summary */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-sans text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-2">
              Active Canon Divergences &amp; What-If Injections
            </h4>
            <ul className="space-y-1 text-slate-300">
              {session.fanficDivergences
                .filter((d) => d.active)
                .map((d) => (
                  <li key={d.id} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono">•</span>
                    <span>
                      <strong className="text-white">{d.title}:</strong> {d.description}
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Messages rendered like a light novel */}
          <div className="space-y-6 pt-2">
            {session.messages.map((msg, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2 font-sans text-xs text-slate-500 border-b border-slate-800/60 pb-1">
                  <span className="font-bold text-slate-400">
                    {msg.sender === 'user' ? session.character.name : 'LoreMaster GM'}
                  </span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {msg.diceRoll && (
                  <div className="font-sans text-xs text-cyan-400 bg-cyan-950/20 border border-cyan-800/40 p-2 rounded-lg">
                    [Fate Check: {msg.diceRoll.actionName} — D20: {msg.diceRoll.roll} + Mod: {msg.diceRoll.modifier} = {msg.diceRoll.total} ({msg.diceRoll.outcome})]
                  </div>
                )}

                <div className="text-slate-200 leading-relaxed text-sm sm:text-base whitespace-pre-line pl-2">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
