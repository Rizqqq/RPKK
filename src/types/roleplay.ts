export type UniverseType = 'mha' | 'naruto' | 'jjk' | 'custom';

export type DivergenceCategory =
  | 'Character Divergence'
  | 'Quirk / Power Mutation'
  | 'Timeline Shift'
  | 'Secret Organization'
  | 'Canon Rule Override'
  | 'Relationship / Rivalry';

export interface LoreDivergence {
  id: string;
  title: string;
  category: DivergenceCategory;
  description: string;
  priority: 'Subtle' | 'High' | 'Extreme / AU Overwrite';
  active: boolean;
  tags?: string[];
}

export interface SignatureMove {
  name: string;
  type: string;
  description: string;
}

export interface CharacterStats {
  power?: number;
  agility?: number;
  intellect?: number;
  willpower?: number;
  mastery?: number;
}

export interface CharacterDossier {
  name: string;
  alias: string;
  power: string;       // Quirk name or Jutsu / Bloodline limit
  powerDetails?: string;
  backstory: string;
  appearance: string;
  personality?: string;
  avatarUrl?: string;
  stats?: CharacterStats;
  signatureMoves: SignatureMove[];
  // Legacy vitals made optional
  health?: number;
  stamina?: number;
  resolve?: number;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'document';
  mimeType: string;
  dataUrl: string; // base64 representation
  textContent?: string; // extracted text content for text/word/pdf files
  size?: number;
  isCharacterLook?: boolean; // if true, AI is instructed to describe the person's look
}

export interface LoreReferenceDocument {
  id: string;
  title: string;
  filename: string;
  mimeType: string;
  content: string; // full text or lore reference
  uploadedAt: number;
}

export interface DiceRollResult {
  actionName: string;
  statUsed: string;
  roll: number;
  modifier: number;
  total: number;
  difficultyDC: number;
  outcome: 'Critical Success' | 'Success' | 'Complication' | 'Critical Failure';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model' | 'system';
  speakerName?: string;
  text: string;
  timestamp: number;
  attachments?: ChatAttachment[];
  diceRoll?: DiceRollResult;
  directorNote?: string;
  suggestions?: string[];
}

export interface RoleplaySession {
  id: string;
  title: string;
  universe: string;
  universeType: UniverseType;
  timelineAnchor: string;
  canonLore: string;
  referenceDocuments?: LoreReferenceDocument[];
  fanficDivergences: LoreDivergence[];
  character: CharacterDossier;
  messages: ChatMessage[];
  narrativeStyle: 'cinematic shonen' | 'gritty dark shonen' | 'detailed light novel' | 'fast-paced manga';
  createdAt: number;
  updatedAt: number;
}
