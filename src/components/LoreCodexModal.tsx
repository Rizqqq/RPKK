import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  ToggleLeft,
  ToggleRight,
  Flame,
  Shield,
  Zap,
  Globe,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { LoreDivergence, DivergenceCategory, RoleplaySession } from '../types/roleplay';
import { geminiService } from '../services/geminiService';

interface LoreCodexModalProps {
  session: RoleplaySession;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSession: (updatedSession: RoleplaySession) => void;
}

export const LoreCodexModal: React.FC<LoreCodexModalProps> = ({
  session,
  isOpen,
  onClose,
  onUpdateSession,
}) => {
  const [activeTab, setActiveTab] = useState<'divergences' | 'canon' | 'aiWeave'>('divergences');

  // Form state for new divergence
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DivergenceCategory>('Character Divergence');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<LoreDivergence['priority']>('High');
  const [newTags, setNewTags] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Canon editing
  const [canonLoreText, setCanonLoreText] = useState(session.canonLore);
  const [timelineText, setTimelineText] = useState(session.timelineAnchor);

  // AI Lore Weave
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingTwists, setIsGeneratingTwists] = useState(false);
  const [generatedTwists, setGeneratedTwists] = useState<LoreDivergence[]>([]);

  if (!isOpen) return null;

  const handleToggleActive = (id: string) => {
    const updated = session.fanficDivergences.map((div) =>
      div.id === id ? { ...div, active: !div.active } : div
    );
    onUpdateSession({ ...session, fanficDivergences: updated });
  };

  const handleDeleteDivergence = (id: string) => {
    const updated = session.fanficDivergences.filter((div) => div.id !== id);
    onUpdateSession({ ...session, fanficDivergences: updated });
  };

  const handleAddDivergence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newDiv: LoreDivergence = {
      id: `div-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      priority: newPriority,
      active: true,
      tags: newTags
        ? newTags.split(',').map((t) => t.trim()).filter(Boolean)
        : [newCategory],
    };

    onUpdateSession({
      ...session,
      fanficDivergences: [newDiv, ...session.fanficDivergences],
    });

    setNewTitle('');
    setNewDescription('');
    setNewTags('');
    setShowAddForm(false);
  };

  const handleSaveCanon = () => {
    onUpdateSession({
      ...session,
      canonLore: canonLoreText,
      timelineAnchor: timelineText,
    });
  };

  const handleGenerateAiTwists = async () => {
    setIsGeneratingTwists(true);
    try {
      const twists = await geminiService.generateLoreTwists({
        universe: session.universe,
        canonLore: session.canonLore,
        currentSituation: session.timelineAnchor,
        twistTheme: aiPrompt || 'Unexpected canon divergence or power awakening',
      });
      setGeneratedTwists(twists);
    } catch (e) {
      console.error('Failed to generate twists:', e);
    } finally {
      setIsGeneratingTwists(false);
    }
  };

  const handleAdoptTwist = (twist: LoreDivergence) => {
    onUpdateSession({
      ...session,
      fanficDivergences: [twist, ...session.fanficDivergences],
    });
    setGeneratedTwists((prev) => prev.filter((t) => t.id !== twist.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Fanfic Lore Codex &amp; Canon Weave
              </h2>
              <p className="text-xs text-slate-400">
                Universe: <span className="text-amber-400 font-semibold">{session.universe}</span> — Weave your fanfic directly into canon timeline
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

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex gap-2 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('divergences')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'divergences'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Fanfic Divergences ({session.fanficDivergences.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('canon')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'canon'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Canon World Foundation</span>
          </button>

          <button
            onClick={() => setActiveTab('aiWeave')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'aiWeave'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Lore Weave Generator</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: FANFIC DIVERGENCES */}
          {activeTab === 'divergences' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 max-w-lg">
                  These custom lore entries override or branch away from official canon. Toggle them on or off anytime; LoreMaster AI will dynamically adjust to active entries.
                </p>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Fanfic Divergence</span>
                </button>
              </div>

              {/* Add Divergence Form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddDivergence}
                  className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3"
                >
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Add Custom Fanfic Override
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase">
                        Divergence Title
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Todoroki unlocked his fire side at age 10"
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as DivergenceCategory)}
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Character Divergence">Character Divergence</option>
                        <option value="Quirk / Power Mutation">Quirk / Power Mutation</option>
                        <option value="Timeline Shift">Timeline Shift</option>
                        <option value="Secret Organization">Secret Organization</option>
                        <option value="Canon Rule Override">Canon Rule Override</option>
                        <option value="Relationship / Rivalry">Relationship / Rivalry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">
                      Lore Details &amp; Fanfic Impact
                    </label>
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Explain how this changes the world, character relationships, or upcoming battles..."
                      rows={3}
                      className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase">
                        Narrative Priority
                      </label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as any)}
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Subtle">Subtle (Background color)</option>
                        <option value="High">High (Noticeable canon break)</option>
                        <option value="Extreme / AU Overwrite">Extreme / AU Overwrite (Total shift)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        placeholder="e.g. Todoroki, Awakening, Rivalry"
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                    >
                      Save Lore Override
                    </button>
                  </div>
                </form>
              )}

              {/* Divergence Cards List */}
              <div className="grid grid-cols-1 gap-3">
                {session.fanficDivergences.map((div) => (
                  <div
                    key={div.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      div.active
                        ? 'bg-slate-950/80 border-slate-700 shadow-md'
                        : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {div.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                            Priority: {div.priority}
                          </span>
                          {div.tags?.map((t, tidx) => (
                            <span key={tidx} className="text-[10px] text-slate-500 flex items-center gap-0.5">
                              <Tag className="w-2.5 h-2.5" /> {t}
                            </span>
                          ))}
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1">{div.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{div.description}</p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(div.id)}
                          className={`p-1.5 rounded-lg border transition ${
                            div.active
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/50'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                          title={div.active ? 'Active in lore' : 'Disabled'}
                        >
                          {div.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteDivergence(div.id)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-500 hover:text-red-400 border border-slate-800 transition"
                          title="Delete divergence"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CANON WORLD FOUNDATION */}
          {activeTab === 'canon' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" /> Current Timeline Anchor &amp; Arc
                </label>
                <input
                  type="text"
                  value={timelineText}
                  onChange={(e) => setTimelineText(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" /> Official Canon World Rules, Factions &amp; Power Systems
                </label>
                <textarea
                  value={canonLoreText}
                  onChange={(e) => setCanonLoreText(e.target.value)}
                  rows={10}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs leading-relaxed text-slate-200 focus:outline-none focus:border-amber-500 resize-none font-mono"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveCanon}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Canon Foundation</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AI LORE WEAVE GENERATOR */}
          {activeTab === 'aiWeave' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Generate Canon-Divergent Fanfic Twists</span>
                </div>
                <p className="text-xs text-slate-300">
                  Provide an optional prompt or what-if premise, and Gemini 3.8 Flash will architect 3 high-stakes narrative twists that seamlessly blend with your canon setting.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Secret traitor in U.A. High, or Minato had a hidden sealing disciple"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleGenerateAiTwists}
                    disabled={isGeneratingTwists}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {isGeneratingTwists ? (
                      <Sparkles className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>Weave Twists</span>
                  </button>
                </div>
              </div>

              {/* Generated Twists Output */}
              {generatedTwists.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Generated Fanfic Options — Click to Adopt into Session Lore
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    {generatedTwists.map((twist) => (
                      <div
                        key={twist.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-400 transition flex items-start justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                              {twist.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Priority: {twist.priority}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-white mb-1">{twist.title}</h5>
                          <p className="text-xs text-slate-300">{twist.description}</p>
                        </div>

                        <button
                          onClick={() => handleAdoptTwist(twist)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition flex-shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adopt</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
