import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-flash-latest';

async function generateContentWithRetry(params: any, maxAttempts = 2): Promise<any> {
  // First attempt with primary model: gemini-3.8-flash
  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxAttempts) {
    try {
      attempt++;
      return await ai.models.generateContent({
        ...params,
        model: PRIMARY_MODEL,
      });
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      const isTransient = errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE');

      if (isTransient && attempt < maxAttempts) {
        console.warn(`Gemini 3.8 Flash temporary rate/demand spike (attempt ${attempt}/${maxAttempts}). Retrying in 1s...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      break;
    }
  }

  // If primary model was unavailable due to high demand, attempt with fallback model
  const lastMsg = lastError?.message || String(lastError);
  if (lastMsg.includes('503') || lastMsg.includes('high demand') || lastMsg.includes('UNAVAILABLE')) {
    try {
      console.warn(`Attempting fallback to ${FALLBACK_MODEL} due to high demand on ${PRIMARY_MODEL}...`);
      return await ai.models.generateContent({
        ...params,
        model: FALLBACK_MODEL,
      });
    } catch (fallbackErr: any) {
      console.error(`Fallback failed:`, fallbackErr);
      throw lastError; // Throw original primary error for transparency
    }
  }

  throw lastError;
}

function parseErrorMessage(err: any): string {
  const raw = err?.message || String(err);
  try {
    const jsonMatch = raw.match(/\{"error":\{.*\}\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.error?.message) {
        return parsed.error.message;
      }
    }
  } catch {}
  return raw;
}

// API: Roleplay Chat
app.post('/api/roleplay/chat', async (req: Request, res: Response) => {
  try {
    const {
      universe,
      canonLore,
      referenceDocuments,
      fanficDivergences,
      character,
      chatHistory,
      userMessage,
      attachments,
      diceRoll,
      narrativeStyle = 'cinematic shonen',
      gmDirectorNote,
    } = req.body;

    const activeDivergences = Array.isArray(fanficDivergences)
      ? fanficDivergences.filter((d: { active?: boolean }) => d.active !== false)
      : [];

    const activeDocs = Array.isArray(referenceDocuments)
      ? referenceDocuments.filter((doc: { content?: string }) => Boolean(doc?.content))
      : [];

    const systemInstruction = `You are "Kevin Roleplay AI" (LoreMaster), a master creative writer, anime director, and interactive roleplaying storyteller.
Your mission is seamlessly weaving CANON ANIME LORE with ORIGINAL FANFICTION, CUSTOM CHARACTERS (OCs), AND USER-SUPPLIED LORE REFERENCES.

CURRENT UNIVERSE: "${universe || 'My Hero Academia'}"

=== CANON LORE FOUNDATION ===
${canonLore || 'Official canon world rules, factions, power systems (e.g., Quirks / Chakra / Cursed Energy), iconic locations, and canon characters.'}

=== FIXED FANFIC LORE & REFERENCE DOCUMENTS ===
${
  activeDocs.length > 0
    ? activeDocs
        .map(
          (doc: { title: string; filename?: string; content: string }, i: number) =>
            `--- [DOCUMENT ${i + 1}: ${doc.title || doc.filename || 'Fanfic Reference'}] ---\n${doc.content}`
        )
        .join('\n\n')
    : 'No additional fixed reference documents loaded.'
}

=== ACTIVE FANFICTION DIVERGENCES & WHAT-IF INJECTIONS ===
${
  activeDivergences.length > 0
    ? activeDivergences
        .map(
          (d: { title: string; category?: string; description: string; priority?: string }, i: number) =>
            `${i + 1}. [${d.category || 'Fanfic Override'}] ${d.title}: ${d.description} (Priority: ${d.priority || 'High'})`
        )
        .join('\n')
    : 'Standard timeline unless the player introduces fanfic elements.'
}

=== PROTAGONIST / PLAYER CHARACTER DOSSIER ===
Name: ${character?.name || 'Player OC'}
Alias / Title: ${character?.alias || 'Unknown'}
Power / Ability: ${character?.power || 'Not specified'}
${character?.powerDetails ? `Power Details & Mechanics: ${character.powerDetails}` : ''}
Appearance: ${character?.appearance || 'Described in scene or visual attachments'}
${character?.personality ? `Personality & Demeanor: ${character.personality}` : ''}
Origin & Backstory: ${character?.backstory || 'A central figure in this narrative.'}
${
  character?.signatureMoves && character.signatureMoves.length > 0
    ? `Signature Moves / Techniques: ${character.signatureMoves
        .map((m: { name: string; type?: string; description: string }) => `${m.name} (${m.type || 'Technique'}) - ${m.description}`)
        .join('; ')}`
    : ''
}

=== ROLEPLAYING & NARRATIVE GUIDELINES ===
1. PURE STORYTELLING & LITERARY ROLEPLAY (NOT A VIDEO GAME):
   - This is creative storytelling and anime roleplay. Never output video game stats, health points, stamina bars, or game interfaces.
   - Ground consequences in realistic narrative tension, physical exhaustion, emotional drama, and anime battle momentum.
2. VISUAL GROUNDING & IMAGE DESCRIPTIONS:
   - When the user inserts or attaches an image of a character (or mentions a look), observe their visual traits closely!
   - Describe their face, hairstyle, clothing, posture, and presence vividly in your narration so the user does NOT need to manually explain how they look.
3. AUTHENTIC CANON VOICES & DYNAMIC REACTIONS:
   - Portray established canon characters with their exact anime personalities, quirks, and mannerisms.
   - Let them react organically with surprise, intrigue, caution, or camaraderie to new characters, fanfic powers, or attached lore.
4. FORMATTING:
   - Spoken dialogue: **[Character Name]**: "..."
   - Actions & scene descriptions: *Italics for action beats and internal tension...*
   - At the end of your response, provide exactly 3 contextual next-step suggestions formatted on separate lines:
     SUGGESTION 1: [Action or dialogue option]
     SUGGESTION 2: [Alternative bold or ability maneuver]
     SUGGESTION 3: [Cunning, diplomatic, or investigation choice]
`;

    // Format previous messages
    const contents: Array<{ role: 'user' | 'model'; parts: Array<any> }> = [];

    if (Array.isArray(chatHistory)) {
      const recentHistory = chatHistory.slice(-20);
      for (const msg of recentHistory) {
        const parts: Array<any> = [];
        // If past message had image attachments, include thumbnail preview if needed or text
        parts.push({ text: msg.text });
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts,
        });
      }
    }

    // Build the latest user turn with multimodal attachments
    const userParts: Array<any> = [];
    let userTurnText = userMessage || '';

    // Process attachments (images & docs)
    if (Array.isArray(attachments) && attachments.length > 0) {
      for (const att of attachments) {
        if (att.type === 'image' && att.dataUrl) {
          const match = att.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            const mimeType = match[1];
            const base64Data = match[2];
            userParts.push({
              inlineData: {
                mimeType,
                data: base64Data,
              },
            });
            userTurnText += `\n\n[ATTACHED CHARACTER / SCENE IMAGE: "${att.name || 'image'}" - Observe the visual features, hair, eyes, clothing, and aesthetic shown in this image and describe the character's look vividly in the story!]`;
          }
        } else if (att.type === 'document') {
          if (att.mimeType === 'application/pdf' && att.dataUrl) {
            const match = att.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
            if (match) {
              userParts.push({
                inlineData: {
                  mimeType: 'application/pdf',
                  data: match[2],
                },
              });
              userTurnText += `\n\n[ATTACHED FANFIC LORE REFERENCE PDF: "${att.name}" - Treat the lore, rules, and background in this document as fixed canon/fanfic truth for this story.]`;
            }
          } else if (att.textContent) {
            userTurnText += `\n\n[ATTACHED FANFIC LORE DOCUMENT: "${att.name}"]\n${att.textContent.slice(0, 8000)}\n[END ATTACHED DOCUMENT]`;
          }
        }
      }
    }

    if (gmDirectorNote) {
      userTurnText += `\n\n[LORE DIRECTION NOTE: ${gmDirectorNote}]`;
    }

    userParts.push({ text: userTurnText });

    contents.push({
      role: 'user',
      parts: userParts,
    });

    const response = await generateContentWithRetry({
      contents,
      config: {
        systemInstruction,
        temperature: 0.85,
        topP: 0.95,
      },
    });

    const replyText = response.text || '...';

    // Parse suggestions if present
    const suggestions: string[] = [];
    const suggestionMatches = replyText.match(/SUGGESTION \d:\s*(.+)/gi);
    if (suggestionMatches) {
      for (const match of suggestionMatches) {
        const clean = match.replace(/SUGGESTION \d:\s*/i, '').trim();
        if (clean) suggestions.push(clean);
      }
    }

    // Cleaned main text (remove the raw suggestion tags from body if desired, or keep them formatted)
    const cleanedText = replyText.replace(/SUGGESTION \d:\s*(.+)/gi, '').trim();

    res.json({
      text: cleanedText || replyText,
      suggestions: suggestions.length > 0 ? suggestions : [
        'Strike with your signature technique',
        'Analyze the opponent\'s stance and counter',
        'Attempt to talk down the adversary'
      ],
      raw: replyText,
    });
  } catch (error: any) {
    console.error('Roleplay Chat Error:', error);
    res.status(500).json({
      error: parseErrorMessage(error) || 'Failed to generate roleplay response from LoreMaster AI.',
    });
  }
});

// API: Generate Fanfic Twist / What-If Event Injection
app.post('/api/roleplay/lore-twist', async (req: Request, res: Response) => {
  try {
    const { universe, canonLore, currentSituation, twistTheme } = req.body;

    const prompt = `You are a creative anime screenwriter and fanfiction novelist.
Create 3 intriguing, high-stakes "Fanfiction Lore Divergence / What-If Twists" for the universe: "${universe || 'My Hero Academia'}".

Current situation/scene: "${currentSituation || 'Hero/Shinobi training and daily life before a crisis'}"
Desired Theme: "${twistTheme || 'Unforeseen complication / Hidden lineage / Quirk or Jutsu awakening / Traitor reveal'}"
Canon Context: "${canonLore || 'Standard canon timeline'}"

Output format strictly as a JSON array of objects with keys:
- "title": Short catchy title (e.g. "The Kamino Revelation", "Shadow Bloodline Awakening")
- "category": e.g. "Quirk Mutation", "Canon Divergence", "Hidden Faction", "Villainous Turn", "Secret Alliances"
- "description": 2-3 sentences explaining the what-if twist and its dramatic impact on the current story.
- "priority": "High" or "Extreme"
`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '[]';
    const parsed = JSON.parse(rawText);
    res.json({ twists: parsed });
  } catch (error: any) {
    console.error('Lore Twist Error:', error);
    res.status(500).json({ error: parseErrorMessage(error) || 'Failed to generate lore twists.' });
  }
});

// API: Generate / Optimize Character Dossier
app.post('/api/roleplay/create-character', async (req: Request, res: Response) => {
  try {
    const { universe, promptDescription, characterType = 'hero' } = req.body;

    const prompt = `You are an anime character designer and RPG master.
Create a rich, flavorful character dossier for an original or fanfiction-modified character in the universe "${universe || 'My Hero Academia'}".

User's Concept: "${promptDescription || 'A student with a dangerous kinetic distortion quirk striving to prove themselves at U.A.'}"
Character Alignment: "${characterType}"

Output strictly a JSON object with:
- "name": Full character name
- "alias": Hero name, Villain moniker, or Shinobi Title
- "power": Detailed name and mechanics of their Quirk or Jutsu (strengths, limits, drawbacks)
- "backstory": 3 sentences of backstory blending into canon lore with a unique fanfiction hook
- "appearance": 1-2 sentence visual description
- "stats": object with "power" (0-100), "agility" (0-100), "intellect" (0-100), "willpower" (0-100), "mastery" (0-100)
- "signatureMoves": array of 3 creative technique names with brief description
`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(rawText);
    res.json({ character: parsed });
  } catch (error: any) {
    console.error('Character Creation Error:', error);
    res.status(500).json({ error: parseErrorMessage(error) || 'Failed to generate character.' });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LoreWeave RPG Server listening on http://0.0.0.0:${PORT} (model: ${PRIMARY_MODEL})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
});
