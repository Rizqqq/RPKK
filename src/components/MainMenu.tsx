import React, { useState } from 'react';
import {
  Play,
  PlusCircle,
  FolderKanban,
  User,
  BookOpen,
  Dices,
  Download,
  Sparkles,
  Flame,
  Swords,
  Scroll,
  Zap,
  Heart,
  ChevronRight,
  Shield,
  Layers,
  GitBranch,
  Upload,
  Clock,
  Compass,
} from 'lucide-react';
import { RoleplaySession, UniverseType } from '../types/roleplay';

interface MainMenuProps {
  currentSession: RoleplaySession;
  sessions: RoleplaySession[];
  onEnterRoleplay: () => void;
  onSelectSession: (id: string) => void;
  onOpenNewCampaignModal: () => void;
  onOpenSessionManager: () => void;
  onOpenCharacterSheet: () => void;
  onOpenCodex: () => void;
  onOpenDiceModal: () => void;
  onOpenNovelExport: () => void;
  onSwitchUniversePreset: (universe: 'mha' | 'naruto' | 'jjk') => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  currentSession,
  sessions,
  onEnterRoleplay,
  onSelectSession,
  onOpenNewCampaignModal,
  onOpenSessionManager,
  onOpenCharacterSheet,
  onOpenCodex,
  onOpenDiceModal,
  onOpenNovelExport,
  onSwitchUniversePreset,
}) => {
  const [selectedTab, setSelectedTab] = useState<'hub' | 'campaigns' | 'universes'>('hub');

  const isMHA = currentSession.universeType === 'mha';
  const isNaruto = currentSession.universeType === 'naruto';
  const isJJK = currentSession.universeType === 'jjk';

  const lastMessage = currentSession.messages[currentSession.messages.length - 1];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col space-y-10 relative z-10">
        
        {/* Title Screen Banner */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Anime &amp; Fanfiction Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-400 uppercase">Gemini 3.8 Flash</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md">
            Kevin <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent">Roleplay</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Weave your custom OCs and radical fanfic divergences into authentic canon worlds. Full local session continuity, RPG D20 dynamics, and live AI Game Mastering.
          </p>

          {/* Quick Tab Switcher */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setSelectedTab('hub')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedTab === 'hub'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Main Hub</span>
            </button>

            <button
              onClick={() => setSelectedTab('universes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedTab === 'universes'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Explore Universes</span>
            </button>

            <button
              onClick={() => setSelectedTab('campaigns')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedTab === 'campaigns'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Save Slots ({sessions.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MAIN HUB */}
        {selectedTab === 'hub' && (
          <div className="space-y-8 animate-fade-in">
            {/* HERO CARD: RESUME ACTIVE ADVENTURE */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/40 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                {/* Left: Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                      {isMHA ? <Flame className="w-3.5 h-3.5 text-emerald-400" /> : isNaruto ? <Swords className="w-3.5 h-3.5 text-orange-400" /> : <Scroll className="w-3.5 h-3.5 text-indigo-400" />}
                      {currentSession.universe}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Active Campaign
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {currentSession.narrativeStyle}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentSession.title}
                  </h2>

                  <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                    <div>
                      Hero:{' '}
                      <strong className="text-white font-bold">
                        {currentSession.character.name}
                      </strong>{' '}
                      <span className="text-emerald-400 font-mono">[{currentSession.character.alias}]</span>
                    </div>
                    <span>•</span>
                    <div>
                      Power: <span className="text-amber-300">{currentSession.character.power}</span>
                    </div>
                    <span>•</span>
                    <div>
                      Messages:{' '}
                      <span className="text-cyan-400 font-mono font-bold">
                        {currentSession.messages.length}
                      </span>
                    </div>
                  </div>

                  {/* Character & Lore Snapshot (No video-game HP/stamina) */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 max-w-2xl">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Appearance &amp; Presence:
                      </span>
                      <span className="text-[11px] text-cyan-300 font-mono">
                        {currentSession.referenceDocuments?.length || 0} Docs &bull; {currentSession.fanficDivergences.filter(d => d.active).length} Active Fanfic Divergences
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-2">
                      &ldquo;{currentSession.character.appearance || 'Character appearance established in narrative or visual image attachments.'}&rdquo;
                    </p>
                  </div>

                  {/* Recent excerpt */}
                  {lastMessage && (
                    <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-400 max-w-2xl line-clamp-2 italic">
                      &ldquo;{lastMessage.text.slice(0, 180)}...&rdquo;
                    </div>
                  )}
                </div>

                {/* Right: Enter Button */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                  <button
                    onClick={onEnterRoleplay}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition flex items-center justify-center gap-3 group"
                  >
                    <Play className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition" />
                    <span>Enter Roleplay</span>
                  </button>

                  <button
                    onClick={onOpenNovelExport}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>Read Light Novel</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION TILES: CORE ROLEPLAY MODULES */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kevin Roleplay Modules &amp; Tools
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1: Play Story */}
                <button
                  onClick={onEnterRoleplay}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-105 transition">
                    <Play className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      Interactive Roleplay Console
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Confront heroes, villains, and allies in vivid anime dialogue and narrative prose with Gemini 3.8 Flash.
                    </p>
                  </div>
                </button>

                {/* 2: New Campaign */}
                <button
                  onClick={onOpenNewCampaignModal}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-left transition flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-105 transition">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                      Start New Campaign
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Choose universe, establish your timeline anchor, define custom quirks or bloodlines, and jump in.
                    </p>
                  </div>
                </button>

                {/* 3: Character Sheet */}
                <button
                  onClick={onOpenCharacterSheet}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-left transition flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:scale-105 transition">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      Character Sheet &amp; OC Crafter
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Define appearance, backstory, personality mannerisms, and signature techniques without gamey numbers.
                    </p>
                  </div>
                </button>

                {/* 4: Fanfic Lore Codex */}
                <button
                  onClick={onOpenCodex}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-105 transition">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      Fanfic Lore &amp; Canon Codex
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Manage active what-if injections, inspect world rules, and trigger surprise plot twists.
                    </p>
                  </div>
                </button>

                {/* 5: Fixed Documents & Visual Lore */}
                <button
                  onClick={() => {
                    onEnterRoleplay();
                  }}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-left transition flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 group-hover:scale-105 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                      Visuals &amp; Fixed Fanfic Docs
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Attach character look photos so AI auto-describes their appearance, plus upload PDF/Word lore docs.
                    </p>
                  </div>
                </button>

                {/* 6: Save Slots & Archives */}
                <button
                  onClick={onOpenSessionManager}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 text-left transition flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-105 transition">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                      Save Slots &amp; Fork Branches
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Duplicate timeline branches to test what-if paths, export backups, or load saved sessions.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPLORE UNIVERSES (FEATURED PRESETS) */}
        {selectedTab === 'universes' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-white">Choose a Universe Foundation</h3>
              <p className="text-xs text-slate-400">
                Switch instantaneously to an authentic anime world with pre-configured canon rules, timelines, and hero sheets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Universe 1: My Hero Academia */}
              <div
                className={`p-6 rounded-3xl border transition flex flex-col justify-between ${
                  isMHA
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/60 ring-2 ring-emerald-500/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      Base Universe
                    </span>
                    {isMHA && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white">My Hero Academia</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Class 1-A Ground Beta sparring against Todoroki &amp; Bakugo. Wield an unregistered Kinetic Vector Quirk as rumors of Tartarus prison breaches spread.
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                    <div>• Protagonist: Kaelen &ldquo;Vectis&rdquo; Jin</div>
                    <div>• 4 Active Fanfic Divergences</div>
                  </div>
                </div>

                <div className="pt-5">
                  <button
                    onClick={() => {
                      onSwitchUniversePreset('mha');
                      onEnterRoleplay();
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <span>{isMHA ? 'Continue MHA Story' : 'Switch & Play MHA'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Universe 2: Naruto Shippuden */}
              <div
                className={`p-6 rounded-3xl border transition flex flex-col justify-between ${
                  isNaruto
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-orange-500/60 ring-2 ring-orange-500/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <Swords className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-orange-400 tracking-wider">
                      Shippuden Saga
                    </span>
                    {isNaruto && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white">Naruto Shippuden</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Survive as an Uzumaki bloodline prodigy wielding Void Sealing Chains against Tobi&apos;s Akatsuki and Danzo&apos;s Root assassins in the deep redwood mist.
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                    <div>• Protagonist: Ren Uzumaki</div>
                    <div>• 3 Active Fanfic Divergences</div>
                  </div>
                </div>

                <div className="pt-5">
                  <button
                    onClick={() => {
                      onSwitchUniversePreset('naruto');
                      onEnterRoleplay();
                    }}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <span>{isNaruto ? 'Continue Naruto Story' : 'Switch & Play Naruto'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Universe 3: Jujutsu Kaisen */}
              <div
                className={`p-6 rounded-3xl border transition flex flex-col justify-between ${
                  isJJK
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-indigo-500/60 ring-2 ring-indigo-500/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Scroll className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                      Dark Sorcery
                    </span>
                    {isJJK && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white">Jujutsu Kaisen</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Midnight training yard at Tokyo Jujutsu High with Satoru Gojo and Megumi Fushiguro. Manipulate Spatial Rupture before Kenjaku strikes Shibuya.
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                    <div>• Protagonist: Kaito &ldquo;Rift Walker&rdquo; Kurogane</div>
                    <div>• 3 Active Fanfic Divergences</div>
                  </div>
                </div>

                <div className="pt-5">
                  <button
                    onClick={() => {
                      onSwitchUniversePreset('jjk');
                      onEnterRoleplay();
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <span>{isJJK ? 'Continue JJK Story' : 'Switch & Play JJK'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAVE SLOTS & CAMPAIGNS */}
        {selectedTab === 'campaigns' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Local Saved Campaigns</h3>
                <p className="text-xs text-slate-400">
                  Every campaign session is kept locally on this device.
                </p>
              </div>
              <button
                onClick={onOpenNewCampaignModal}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Save Slot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map((sess) => {
                const isActive = sess.id === currentSession.id;
                return (
                  <div
                    key={sess.id}
                    className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                      isActive
                        ? 'bg-slate-900 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {sess.universe}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                            • Loaded Session
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white">{sess.title}</h4>
                      <p className="text-xs text-slate-400">
                        Hero: <strong className="text-slate-200">{sess.character.name}</strong> ({sess.character.alias})
                      </p>
                      <div className="text-[11px] text-slate-500">
                        {sess.messages.length} messages • {sess.fanficDivergences.filter((d) => d.active).length} what-ifs
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-2 border-t border-slate-800/80 mt-3">
                      <button
                        onClick={() => {
                          onSelectSession(sess.id);
                          onEnterRoleplay();
                        }}
                        className={`px-4 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isActive ? 'Resume' : 'Load & Play'}</span>
                      </button>

                      <button
                        onClick={onOpenSessionManager}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Manage &amp; Fork &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">
            Kevin Roleplay Engine &bull; Powered by Gemini 3.8 Flash
          </p>
          <p className="text-[11px]">
            Designed for anime &amp; fanfiction roleplayers. All stories, characters, and diverged timelines persist locally.
          </p>
        </div>
      </div>
    </div>
  );
};
