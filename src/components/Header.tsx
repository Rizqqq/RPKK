import React from 'react';
import {
  BookOpen,
  User,
  Dices,
  FolderKanban,
  Sparkles,
  Download,
  Scroll,
  PlusCircle,
  Flame,
  Swords,
  Home,
  Play,
  LayoutGrid,
} from 'lucide-react';
import { RoleplaySession } from '../types/roleplay';

interface HeaderProps {
  currentSession: RoleplaySession;
  sessions: RoleplaySession[];
  currentView: 'menu' | 'roleplay';
  onToggleView: (view: 'menu' | 'roleplay') => void;
  onSelectSession: (id: string) => void;
  onOpenCodex: () => void;
  onOpenCharacterSheet: () => void;
  onOpenDiceModal: () => void;
  onOpenSessionManager: () => void;
  onOpenNovelExport: () => void;
  onNewCampaign: () => void;
  onNarrativeStyleChange: (style: RoleplaySession['narrativeStyle']) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSession,
  sessions,
  currentView,
  onToggleView,
  onSelectSession,
  onOpenCodex,
  onOpenCharacterSheet,
  onOpenDiceModal,
  onOpenSessionManager,
  onOpenNovelExport,
  onNewCampaign,
  onNarrativeStyleChange,
}) => {
  const activeDivergenceCount = currentSession.fanficDivergences.filter((d) => d.active).length;

  const isMHA = currentSession.universeType === 'mha';
  const isNaruto = currentSession.universeType === 'naruto';
  const isJJK = currentSession.universeType === 'jjk';

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Universe indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div
            onClick={() => onToggleView('menu')}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition group"
            title="Go to Kevin Roleplay Main Menu"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg font-black text-white text-base ${
                isMHA
                  ? 'bg-gradient-to-br from-emerald-500 to-amber-500 shadow-emerald-500/20'
                  : isNaruto
                  ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20'
                  : isJJK
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
                  : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20'
              }`}
            >
              {isMHA ? <Flame className="w-5 h-5 text-amber-200" /> : isNaruto ? <Swords className="w-5 h-5 text-orange-100" /> : <Scroll className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-lg group-hover:text-amber-300 transition">
                  Kevin <span className="text-amber-400 font-mono text-sm uppercase">Roleplay</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-400" /> Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-[280px]">
                {currentSession.title}
              </p>
            </div>
          </div>

          {/* Quick Menu Toggle on Mobile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleView(currentView === 'menu' ? 'roleplay' : 'menu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition ${
                currentView === 'menu'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
              }`}
            >
              {currentView === 'menu' ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Roleplay</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Main Menu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center: Menu Mode Toggle & Session Selector on Desktop */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onToggleView('menu')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              currentView === 'menu'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Menu Hub</span>
          </button>

          <button
            onClick={() => onToggleView('roleplay')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              currentView === 'roleplay'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Story Console</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-1" />

          <select
            value={currentSession.id}
            onChange={(e) => onSelectSession(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 outline-none pr-2 py-1 cursor-pointer max-w-[200px] truncate"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                [{s.universe.slice(0, 8)}] {s.title}
              </option>
            ))}
          </select>
          <button
            onClick={onNewCampaign}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 transition"
            title="Start New Campaign Session"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls & Tooling Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          {/* Fanfic Lore Codex Button */}
          <button
            onClick={onOpenCodex}
            className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-300 flex items-center gap-1.5 transition shadow-sm"
            title="Fanfic Lore Codex & Canon Weave"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Fanfic Lore</span>
            <span className="inline sm:hidden">Lore</span>
            <span className="px-1.5 py-0.2 bg-amber-500/30 text-amber-200 rounded-full text-[10px] font-mono">
              {activeDivergenceCount}
            </span>
          </button>

          {/* Character Dossier Button */}
          <button
            onClick={onOpenCharacterSheet}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
            title="Character Sheet & Stats"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Character</span>
            <span className="inline sm:hidden">Hero</span>
          </button>

          {/* D20 Fate Roll Button */}
          <button
            onClick={onOpenDiceModal}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
            title="Roll Fate D20"
          >
            <Dices className="w-3.5 h-3.5 text-cyan-400" />
            <span>D20</span>
          </button>

          {/* Novel Reader & Export */}
          <button
            onClick={onOpenNovelExport}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
            title="Read as Light Novel / Export"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Novel/Export</span>
          </button>

          {/* Campaign Manager */}
          <button
            onClick={onOpenSessionManager}
            className="hidden md:flex p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            title="Manage Saved Campaigns & Continuity"
          >
            <FolderKanban className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
