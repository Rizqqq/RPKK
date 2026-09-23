import { RoleplaySession, UniverseType } from '../types/roleplay';
import { INITIAL_PRESETS, MHA_PRESET_SESSION, NARUTO_PRESET_SESSION, JJK_PRESET_SESSION } from '../data/defaultPresets';

const SESSIONS_STORAGE_KEY = 'kevin_roleplay_sessions_v2';
const ACTIVE_SESSION_KEY = 'kevin_roleplay_active_session_id_v2';

export const storageService = {
  loadAllSessions(): RoleplaySession[] {
    try {
      const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (!data) {
        // Initialize with default presets
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(INITIAL_PRESETS));
        return INITIAL_PRESETS;
      }
      const parsed = JSON.parse(data) as RoleplaySession[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(INITIAL_PRESETS));
        return INITIAL_PRESETS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load sessions from localStorage:', e);
      return INITIAL_PRESETS;
    }
  },

  getActiveSessionId(): string {
    const stored = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (stored) return stored;
    return MHA_PRESET_SESSION.id;
  },

  setActiveSessionId(id: string): void {
    localStorage.setItem(ACTIVE_SESSION_KEY, id);
  },

  saveSession(session: RoleplaySession): RoleplaySession[] {
    try {
      const sessions = this.loadAllSessions();
      const idx = sessions.findIndex((s) => s.id === session.id);
      const updated = { ...session, updatedAt: Date.now() };

      let nextSessions: RoleplaySession[];
      if (idx >= 0) {
        nextSessions = [...sessions];
        nextSessions[idx] = updated;
      } else {
        nextSessions = [updated, ...sessions];
      }

      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(nextSessions));
      return nextSessions;
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
      return [];
    }
  },

  deleteSession(id: string): RoleplaySession[] {
    const sessions = this.loadAllSessions();
    const filtered = sessions.filter((s) => s.id !== id);
    const finalSessions = filtered.length > 0 ? filtered : [MHA_PRESET_SESSION];
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(finalSessions));

    if (this.getActiveSessionId() === id) {
      this.setActiveSessionId(finalSessions[0].id);
    }
    return finalSessions;
  },

  duplicateSession(id: string): { newSession: RoleplaySession; sessions: RoleplaySession[] } {
    const sessions = this.loadAllSessions();
    const source = sessions.find((s) => s.id === id) || MHA_PRESET_SESSION;

    const newId = `session-fork-${Date.now()}`;
    const newSession: RoleplaySession = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      title: `${source.title} (Alternate Branch)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const nextSessions = [newSession, ...sessions];
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(nextSessions));
    this.setActiveSessionId(newId);
    return { newSession, sessions: nextSessions };
  },

  createNewSession(universeType: UniverseType, title?: string): RoleplaySession {
    const newId = `session-${Date.now()}`;
    let template: RoleplaySession;

    if (universeType === 'mha') {
      template = JSON.parse(JSON.stringify(MHA_PRESET_SESSION));
    } else if (universeType === 'naruto') {
      template = JSON.parse(JSON.stringify(NARUTO_PRESET_SESSION));
    } else if (universeType === 'jjk') {
      template = JSON.parse(JSON.stringify(JJK_PRESET_SESSION));
    } else {
      template = {
        id: newId,
        title: title || 'Custom Universe Campaign',
        universe: 'Original Anime Realm',
        universeType: 'custom',
        timelineAnchor: 'Prologue: The Awakening of Powers',
        canonLore: 'Establish the core rules, factions, magic/energy system, and geography of your world here.',
        fanficDivergences: [
          {
            id: `div-${Date.now()}-1`,
            title: 'Forbidden Bloodline Heritage',
            category: 'Quirk / Power Mutation',
            description: 'You carry the dormant genetic catalyst of an extinct ancestral clan.',
            priority: 'High',
            active: true,
          },
        ],
        character: {
          name: 'Shin Kazama',
          alias: 'Phantom Blade',
          power: 'Spectral Kinetic Weaving',
          backstory: 'An exiled warrior carving a legacy among rival guilds.',
          appearance: 'Tall with dark eyes and a weathered mantle.',
          stats: {
            power: 70,
            agility: 75,
            intellect: 70,
            willpower: 80,
            mastery: 70,
          },
          health: 100,
          stamina: 100,
          resolve: 80,
          signatureMoves: [
            {
              name: 'Shadow Flash',
              type: 'Attack',
              description: 'Instant strike through spatial fissures.',
            },
          ],
        },
        messages: [
          {
            id: `msg-${Date.now()}-intro`,
            sender: 'model',
            speakerName: 'LoreMaster GM',
            text: `**Prologue — The Crossing of Paths**\n\nThe wind howls across the horizon. You stand at the boundary line of two clashing territories, your unique power thrumming under your skin.\n\nA scout in battle armor signals from the watchtower as tension mounts in the air.\n\nWhat do you do?`,
            timestamp: Date.now(),
            suggestions: [
              'Conceal your presence and observe from the shadows',
              'Approach the watchtower and present your credentials',
              'Channel your power to test the local energy field',
            ],
          },
        ],
        narrativeStyle: 'cinematic shonen',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    template.id = newId;
    template.title = title || `${template.universe}: New Chronicle`;
    template.createdAt = Date.now();
    template.updatedAt = Date.now();

    this.saveSession(template);
    this.setActiveSessionId(newId);
    return template;
  },

  exportSessionJSON(session: RoleplaySession) {
    const jsonStr = JSON.stringify(session, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9_-]/gi, '_')}_loreplay_session.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importSessionJSON(jsonString: string): RoleplaySession {
    const parsed = JSON.parse(jsonString);
    if (!parsed.id || !parsed.character || !parsed.messages) {
      throw new Error('Invalid LoreWeave session format. Missing critical campaign fields.');
    }
    // ensure unique id
    parsed.id = `imported-${Date.now()}-${parsed.id}`;
    parsed.title = `${parsed.title} (Imported)`;
    parsed.updatedAt = Date.now();
    this.saveSession(parsed);
    this.setActiveSessionId(parsed.id);
    return parsed;
  },

  exportNovelMarkdown(session: RoleplaySession): string {
    let md = `# ${session.title}\n\n`;
    md += `**Universe:** ${session.universe} | **Timeline:** ${session.timelineAnchor}\n`;
    md += `**Protagonist:** ${session.character.name} ("${session.character.alias}") - *${session.character.power}*\n\n`;
    md += `## Active Lore Divergences & What-Ifs\n`;
    session.fanficDivergences
      .filter((d) => d.active)
      .forEach((d, i) => {
        md += `${i + 1}. **${d.title}** [${d.category}]: ${d.description}\n`;
      });
    md += `\n---\n\n## Chronicle & Dialogue Transcript\n\n`;

    session.messages.forEach((msg) => {
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (msg.sender === 'user') {
        md += `### [${session.character.name}] (${time})\n\n`;
        if (msg.diceRoll) {
          md += `> *[Fate Roll: ${msg.diceRoll.actionName} - D20: ${msg.diceRoll.roll} + Mod: ${msg.diceRoll.modifier} = ${msg.diceRoll.total} (${msg.diceRoll.outcome})]*\n\n`;
        }
        if (msg.directorNote) {
          md += `> *[LoreMaster Note: ${msg.directorNote}]*\n\n`;
        }
        md += `${msg.text}\n\n`;
      } else if (msg.sender === 'model') {
        md += `### [LoreMaster GM] (${time})\n\n`;
        md += `${msg.text}\n\n`;
      } else {
        md += `> **System Event:** ${msg.text}\n\n`;
      }
    });

    return md;
  },
};
