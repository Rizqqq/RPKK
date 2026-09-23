import { RoleplaySession, DiceRollResult, CharacterDossier, LoreDivergence, ChatAttachment } from '../types/roleplay';

export interface ChatResponsePayload {
  text: string;
  suggestions: string[];
  raw?: string;
  error?: string;
}

export const geminiService = {
  async sendRoleplayMessage(params: {
    session: RoleplaySession;
    userMessage: string;
    attachments?: ChatAttachment[];
    diceRoll?: DiceRollResult;
    gmDirectorNote?: string;
  }): Promise<ChatResponsePayload> {
    const { session, userMessage, attachments, diceRoll, gmDirectorNote } = params;

    const response = await fetch('/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        universe: session.universe,
        canonLore: session.canonLore,
        referenceDocuments: session.referenceDocuments || [],
        fanficDivergences: session.fanficDivergences,
        character: session.character,
        chatHistory: session.messages,
        userMessage,
        attachments: attachments || [],
        diceRoll,
        gmDirectorNote,
        narrativeStyle: session.narrativeStyle,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    return response.json();
  },

  async generateLoreTwists(params: {
    universe: string;
    canonLore: string;
    currentSituation?: string;
    twistTheme?: string;
  }): Promise<LoreDivergence[]> {
    const response = await fetch('/api/roleplay/lore-twist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate lore twists');
    }

    const data = await response.json();
    const twists = data.twists || [];
    return twists.map((t: any, idx: number) => ({
      id: `generated-twist-${Date.now()}-${idx}`,
      title: t.title || 'Fanfic Divergence',
      category: t.category || 'Canon Divergence',
      description: t.description || '',
      priority: t.priority === 'Extreme' ? 'Extreme / AU Overwrite' : 'High',
      active: true,
      tags: ['AI Generated', 'What-If Twist'],
    }));
  },

  async generateCharacterDossier(params: {
    universe: string;
    promptDescription: string;
    characterType?: string;
  }): Promise<Partial<CharacterDossier>> {
    const response = await fetch('/api/roleplay/create-character', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to create character dossier');
    }

    const data = await response.json();
    return data.character;
  },
};
