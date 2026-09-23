import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Plus,
  Trash2,
  Sparkles,
  Award,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { CharacterDossier, SignatureMove, RoleplaySession } from '../types/roleplay';
import { geminiService } from '../services/geminiService';
import { readFileAsDataUrl } from '../utils/fileAttachmentUtils';

interface CharacterSheetModalProps {
  session: RoleplaySession;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCharacter: (updatedCharacter: CharacterDossier) => void;
}

export const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({
  session,
  isOpen,
  onClose,
  onUpdateCharacter,
}) => {
  const [character, setCharacter] = useState<CharacterDossier>(session.character);
  const [activeTab, setActiveTab] = useState<'profile' | 'visual' | 'moves' | 'aiCrafter'>('profile');

  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // New move form
  const [newMoveName, setNewMoveName] = useState('');
  const [newMoveType, setNewMoveType] = useState('Offensive Strike');
  const [newMoveDesc, setNewMoveDesc] = useState('');
  const [showMoveForm, setShowMoveForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setCharacter((prev) => ({
        ...prev,
        avatarUrl: dataUrl,
      }));
    } catch (err) {
      console.error('Failed to load image', err);
    }
  };

  const handleAddMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMoveName.trim() || !newMoveDesc.trim()) return;

    const newMove: SignatureMove = {
      name: newMoveName.trim(),
      type: newMoveType,
      description: newMoveDesc.trim(),
    };

    setCharacter((prev) => ({
      ...prev,
      signatureMoves: [...(prev.signatureMoves || []), newMove],
    }));

    setNewMoveName('');
    setNewMoveDesc('');
    setShowMoveForm(false);
  };

  const handleDeleteMove = (index: number) => {
    setCharacter((prev) => ({
      ...prev,
      signatureMoves: prev.signatureMoves.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onUpdateCharacter(character);
    onClose();
  };

  const handleAiCraft = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await geminiService.generateCharacterDossier({
        universe: session.universe,
        promptDescription: aiPrompt,
      });

      setCharacter((prev) => ({
        ...prev,
        name: generated.name || prev.name,
        alias: generated.alias || prev.alias,
        power: generated.power || prev.power,
        powerDetails: generated.powerDetails || prev.powerDetails,
        backstory: generated.backstory || prev.backstory,
        appearance: generated.appearance || prev.appearance,
        personality: generated.personality || prev.personality,
        signatureMoves: generated.signatureMoves && generated.signatureMoves.length > 0
          ? generated.signatureMoves
          : prev.signatureMoves,
      }));

      setActiveTab('profile');
    } catch (err) {
      console.error('Failed to generate character:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Character Dossier &amp; Profile
              </h2>
              <p className="text-xs text-slate-400">
                {character.name} <span className="text-emerald-400 font-mono">[{character.alias}]</span>
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
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Lore</span>
          </button>

          <button
            onClick={() => setActiveTab('visual')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'visual'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Visual Look &amp; Image</span>
          </button>

          <button
            onClick={() => setActiveTab('moves')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'moves'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Signature Moves ({character.signatureMoves?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('aiCrafter')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'aiCrafter'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI OC Crafter</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Character Name
                  </label>
                  <input
                    type="text"
                    value={character.name}
                    onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Hero Alias / Moniker / Rank
                  </label>
                  <input
                    type="text"
                    value={character.alias}
                    onChange={(e) => setCharacter({ ...character, alias: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Quirk / Jutsu / Power Name &amp; Core Mechanics
                </label>
                <input
                  type="text"
                  value={character.power}
                  onChange={(e) => setCharacter({ ...character, power: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Power Limits, Drawbacks &amp; Physics
                </label>
                <textarea
                  value={character.powerDetails || ''}
                  onChange={(e) => setCharacter({ ...character, powerDetails: e.target.value })}
                  placeholder="Detail how fatigue, recoil, range, or physical limits affect this power..."
                  rows={2}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Personality, Demeanor &amp; Speaking Style
                </label>
                <textarea
                  value={character.personality || ''}
                  onChange={(e) => setCharacter({ ...character, personality: e.target.value })}
                  placeholder="How does your character talk, react under pressure, or treat allies..."
                  rows={2}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Fanfic Backstory &amp; Origin Ties
                </label>
                <textarea
                  value={character.backstory}
                  onChange={(e) => setCharacter({ ...character, backstory: e.target.value })}
                  rows={3}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL LOOK & IMAGE */}
          {activeTab === 'visual' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      Visual Portrait &amp; Character Image
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Upload an image of your character. The AI will inspect their hair, face, costume, and build to describe them automatically!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {character.avatarUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className="w-32 h-32 rounded-2xl object-cover border border-slate-700 shadow-md"
                    />
                    <div className="space-y-1.5 text-xs text-slate-300 flex-1">
                      <div className="font-bold text-white text-sm">{character.name} Portrait Attached</div>
                      <p className="text-slate-400">
                        This image will guide the AI LoreMaster when describing your character in scenes.
                      </p>
                      <button
                        type="button"
                        onClick={() => setCharacter({ ...character, avatarUrl: undefined })}
                        className="text-red-400 hover:text-red-300 font-semibold text-xs flex items-center gap-1 pt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Image</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-900/30"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-300 block">Click to upload character look image</span>
                    <span className="text-[11px] text-slate-500">PNG, JPG, WEBP supported</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Physical Appearance Description &amp; Costume Details
                </label>
                <textarea
                  value={character.appearance}
                  onChange={(e) => setCharacter({ ...character, appearance: e.target.value })}
                  placeholder="Height, hair style/color, eye color, uniform, hero costume, distinctive scars or markings..."
                  rows={4}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SIGNATURE MOVES */}
          {activeTab === 'moves' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Custom super-moves, ultimate arts, and tactical maneuvers.
                </p>
                <button
                  onClick={() => setShowMoveForm(!showMoveForm)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Move</span>
                </button>
              </div>

              {showMoveForm && (
                <form
                  onSubmit={handleAddMove}
                  className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3"
                >
                  <h4 className="text-xs font-bold text-white">Create Signature Technique</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Technique Name
                      </label>
                      <input
                        type="text"
                        value={newMoveName}
                        onChange={(e) => setNewMoveName(e.target.value)}
                        placeholder="E.g. Vector Cannon: Mach Impact"
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Type / Category
                      </label>
                      <select
                        value={newMoveType}
                        onChange={(e) => setNewMoveType(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                      >
                        <option value="Offensive Strike">Offensive Strike</option>
                        <option value="Defensive Barrier">Defensive Barrier</option>
                        <option value="Mobility Surge">Mobility Surge</option>
                        <option value="Tactical Subversion">Tactical Subversion</option>
                        <option value="Ultimate Art">Ultimate Art</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Visual Effect &amp; Description
                    </label>
                    <textarea
                      value={newMoveDesc}
                      onChange={(e) => setNewMoveDesc(e.target.value)}
                      placeholder="Describe the kinetic impact, visual blast, or strategic execution..."
                      rows={2}
                      className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMoveForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
                    >
                      Save Technique
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2.5">
                {character.signatureMoves?.map((move, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 group hover:border-slate-700 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{move.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-emerald-400 border border-slate-700">
                          {move.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{move.description}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteMove(idx)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                      title="Delete move"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI OC CRAFTER */}
          {activeTab === 'aiCrafter' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Character Synthesizer</span>
                </div>
                <p className="text-xs text-slate-300">
                  Provide a concept, trope, or inspiration. Gemini 3.8 Flash will generate an authentic anime OC complete with power details, backstory, appearance, and signature techniques.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Concept Prompt
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g. A cynical Shiketsu transfer student with a sound-absorption quirk who secretly investigates Tartarus conspiracies..."
                  rows={3}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAiCraft}
                disabled={isGenerating || !aiPrompt.trim()}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
                  isGenerating || !aiPrompt.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-300" />
                    <span>Synthesizing Character Dossier...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Complete Character Dossier</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition"
          >
            Save Character
          </button>
        </div>
      </div>
    </div>
  );
};
