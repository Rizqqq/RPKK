import React, { useState } from 'react';
import { X, Dices, Sparkles, Check, Flame, Shield, ArrowRight } from 'lucide-react';
import { CharacterDossier, CharacterStats, DiceRollResult } from '../types/roleplay';

interface DiceRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterDossier;
  onSubmitRoll: (rollResult: DiceRollResult, actionText: string) => void;
}

export const DiceRollModal: React.FC<DiceRollModalProps> = ({
  isOpen,
  onClose,
  character,
  onSubmitRoll,
}) => {
  const [actionName, setActionName] = useState('Quirk / Jutsu Technique');
  const [selectedStat, setSelectedStat] = useState<keyof CharacterStats | 'flat'>('mastery');
  const [difficultyDC, setDifficultyDC] = useState<number>(13);
  const [actionDescription, setActionDescription] = useState('');

  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [calculatedResult, setCalculatedResult] = useState<DiceRollResult | null>(null);

  if (!isOpen) return null;

  const statValue = selectedStat === 'flat' ? 50 : (character.stats?.[selectedStat] ?? 50);
  const modifier = selectedStat === 'flat' ? 0 : Math.floor((statValue - 50) / 10);

  const handleRoll = () => {
    setIsRolling(true);
    setCalculatedResult(null);

    let counter = 0;
    const interval = setInterval(() => {
      setLastRoll(Math.floor(Math.random() * 20) + 1);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        setLastRoll(finalRoll);

        const total = finalRoll + modifier;
        let outcome: DiceRollResult['outcome'] = 'Success';

        if (finalRoll === 20) outcome = 'Critical Success';
        else if (finalRoll === 1) outcome = 'Critical Failure';
        else if (total >= difficultyDC) outcome = 'Success';
        else outcome = 'Complication';

        const result: DiceRollResult = {
          actionName,
          statUsed: String(selectedStat),
          roll: finalRoll,
          modifier,
          total,
          difficultyDC,
          outcome,
        };

        setCalculatedResult(result);
        setIsRolling(false);
      }
    }, 60);
  };

  const handleSubmit = () => {
    if (!calculatedResult) return;
    const narrationText = actionDescription.trim()
      ? actionDescription.trim()
      : `*Attempts ${actionName} with focused intensity.*`;

    onSubmitRoll(calculatedResult, narrationText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Fate D20 RPG Check</h2>
              <p className="text-xs text-slate-400">
                Determine the outcome of high-stakes anime stunts &amp; clashes
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Action Name */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase">
              Action Attempt
            </label>
            <input
              type="text"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
              placeholder="e.g. Unleash 100% Vector Reversal against Todoroki's Glacier"
              className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Stat selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">
                Relevant Stat
              </label>
              <select
                value={String(selectedStat)}
                onChange={(e) => setSelectedStat(e.target.value as any)}
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="power">Power ({character.stats?.power ?? 50})</option>
                <option value="agility">Agility ({character.stats?.agility ?? 50})</option>
                <option value="intellect">Intellect ({character.stats?.intellect ?? 50})</option>
                <option value="willpower">Willpower ({character.stats?.willpower ?? 50})</option>
                <option value="mastery">Mastery ({character.stats?.mastery ?? 50})</option>
                <option value="flat">No Stat (Flat D20)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">
                Difficulty Class (DC)
              </label>
              <select
                value={difficultyDC}
                onChange={(e) => setDifficultyDC(parseInt(e.target.value, 10))}
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value={10}>DC 10 — Standard Genin / Student</option>
                <option value={13}>DC 13 — Moderate Hero Challenge</option>
                <option value={16}>DC 16 — Hard / Pro Hero / Chunin</option>
                <option value={20}>DC 20 — Extreme / Plus Ultra / S-Rank</option>
              </select>
            </div>
          </div>

          {/* Action Narration Context */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase">
              Action Narration / Dialogue (Optional)
            </label>
            <textarea
              value={actionDescription}
              onChange={(e) => setActionDescription(e.target.value)}
              placeholder="e.g. *Planting my boots firmly into the fractured asphalt, I touch the oncoming ice wave...*"
              rows={2}
              className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Dice Display Area */}
          <div className="py-6 flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black transition-all ${
                isRolling
                  ? 'bg-cyan-500 text-slate-950 animate-bounce shadow-cyan-500/50 shadow-xl'
                  : calculatedResult
                  ? calculatedResult.outcome === 'Critical Success'
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/50 shadow-xl'
                    : calculatedResult.outcome === 'Success'
                    ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/50 shadow-xl'
                    : calculatedResult.outcome === 'Complication'
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/50 shadow-xl'
                    : 'bg-red-500 text-white shadow-red-500/50 shadow-xl'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {lastRoll !== null ? lastRoll : '?'}
            </div>

            <div className="mt-3 text-center">
              {calculatedResult ? (
                <div className="space-y-1">
                  <div className="text-xs text-slate-400 font-mono">
                    D20 ({calculatedResult.roll}) + Mod ({calculatedResult.modifier >= 0 ? `+${calculatedResult.modifier}` : calculatedResult.modifier}) = Total{' '}
                    <strong className="text-white text-sm font-bold">{calculatedResult.total}</strong> vs DC {difficultyDC}
                  </div>
                  <div
                    className={`text-sm font-black uppercase tracking-wider ${
                      calculatedResult.outcome === 'Critical Success'
                        ? 'text-emerald-400'
                        : calculatedResult.outcome === 'Success'
                        ? 'text-cyan-400'
                        : calculatedResult.outcome === 'Complication'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {calculatedResult.outcome}!
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-mono">
                  Modifier: {modifier >= 0 ? `+${modifier}` : modifier} | Target DC: {difficultyDC}
                </div>
              )}
            </div>

            <button
              onClick={handleRoll}
              disabled={isRolling}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Dices className="w-4 h-4" />
              <span>{calculatedResult ? 'Re-Roll D20' : 'Roll Fate D20'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!calculatedResult}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Send Roll to LoreMaster AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
