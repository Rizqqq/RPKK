import React from 'react';
import {
  Flame,
  User,
  Heart,
  Zap,
  Activity,
  Award,
  BookOpen,
  Plus,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Swords,
  ChevronRight,
  ShieldAlert,
  Scroll,
} from 'lucide-react';
import { RoleplaySession, CharacterDossier } from '../types/roleplay';

interface SidebarProps {
  session: RoleplaySession;
  onOpenCharacterSheet: () => void;
  onOpenCodex: () => void;
  onOpenDiceModal: () => void;
  onToggleDivergence: (id: string) => void;
  onSelectMove: (moveName: string) => void;
  onSwitchToUniversePreset: (universe: 'mha' | 'naruto' | 'jjk') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  session,
  onOpenCharacterSheet,
  onOpenCodex,
  onOpenDiceModal,
  onToggleDivergence,
  onSelectMove,
  onSwitchToUniversePreset,
}) => {
  const { character, fanficDivergences } = session;
  const isMHA = session.universeType === 'mha';
  const isNaruto = session.universeType === 'naruto';
  const isJJK = session.universeType === 'jjk';

  return (
    <aside className="w-80 bg-slate-900/90 border-r border-slate-800 flex flex-col h-full overflow-y-auto hidden lg:flex select-none">
      {/* Universe Quick Switcher & Info */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active Universe
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSwitchToUniversePreset('mha')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                isMHA
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Roleplay: My Hero Academia"
            >
              MHA
            </button>
            <button
              onClick={() => onSwitchToUniversePreset('naruto')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                isNaruto
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Roleplay: Naruto Shippuden"
            >
              Naruto
            </button>
            <button
              onClick={() => onSwitchToUniversePreset('jjk')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                isJJK
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Roleplay: Jujutsu Kaisen"
            >
              JJK
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-white mb-0.5">
            {isMHA ? <Flame className="w-3.5 h-3.5 text-emerald-400" /> : isNaruto ? <Swords className="w-3.5 h-3.5 text-orange-400" /> : <Scroll className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="truncate">{session.universe}</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {session.timelineAnchor}
          </p>
        </div>
      </div>

      {/* Character Dossier Card */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Character Dossier</span>
          </div>
          <button
            onClick={onOpenCharacterSheet}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Edit Sheet
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-[170px]">
                {character.name}
              </h3>
              <p className="text-xs text-emerald-400 font-mono font-medium">
                [{character.alias}]
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-amber-300 border border-slate-700">
              Protagonist
            </span>
          </div>

          <div className="text-xs text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
              Power / Quirk / Jutsu
            </span>
            <p className="font-semibold text-white truncate">{character.power}</p>
          </div>

          {/* Character Appearance preview */}
          <div className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
              Visual Appearance
            </span>
            <p className="text-[11px] text-slate-300 italic line-clamp-2">
              {character.appearance || 'Described in chat or attached visual reference'}
            </p>
          </div>

          {/* Fixed Documents badge if any */}
          {session.referenceDocuments && session.referenceDocuments.length > 0 && (
            <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 flex items-center justify-between">
              <span className="font-semibold">{session.referenceDocuments.length} Lore Ref Docs</span>
              <span className="text-[10px] font-mono">Active</span>
            </div>
          )}
        </div>

        {/* Signature Moves Quick Insert */}
        {character.signatureMoves && character.signatureMoves.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Signature Techniques (Click to Declare)
            </span>
            <div className="space-y-1">
              {character.signatureMoves.slice(0, 3).map((move, i) => (
                <button
                  key={i}
                  onClick={() => onSelectMove(move.name)}
                  className="w-full text-left p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition flex items-center justify-between group"
                  title={move.description}
                >
                  <span className="truncate flex-1 font-medium">{move.name}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fanfic Divergence Lore Vault Quick Access */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Fanfic Lore Codex</span>
          </div>
          <button
            onClick={onOpenCodex}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
          >
            Manage ({fanficDivergences.filter((d) => d.active).length} Active)
          </button>
        </div>

        <div className="space-y-2">
          {fanficDivergences.map((div) => (
            <div
              key={div.id}
              className={`p-2.5 rounded-xl border text-xs transition ${
                div.active
                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                  : 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-white text-[12px] truncate">{div.title}</span>
                <button
                  onClick={() => onToggleDivergence(div.id)}
                  className="text-slate-400 hover:text-white flex-shrink-0"
                >
                  {div.active ? (
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {div.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
