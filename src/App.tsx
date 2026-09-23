/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StoryFeed } from './components/StoryFeed';
import { MainMenu } from './components/MainMenu';
import { LoreCodexModal } from './components/LoreCodexModal';
import { CharacterSheetModal } from './components/CharacterSheetModal';
import { DiceRollModal } from './components/DiceRollModal';
import { SessionManagerModal } from './components/SessionManagerModal';
import { NovelExportModal } from './components/NovelExportModal';
import { RoleplaySession, ChatMessage, DiceRollResult, UniverseType, ChatAttachment, LoreReferenceDocument } from './types/roleplay';
import { storageService } from './services/storage';
import { geminiService } from './services/geminiService';
import { MHA_PRESET_SESSION, NARUTO_PRESET_SESSION, JJK_PRESET_SESSION } from './data/defaultPresets';

export default function App() {
  const [sessions, setSessions] = useState<RoleplaySession[]>(() => storageService.loadAllSessions());
  const [activeSessionId, setActiveSessionId] = useState<string>(() => storageService.getActiveSessionId());
  const [currentView, setCurrentView] = useState<'menu' | 'roleplay'>('menu');
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState(false);
  const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState(false);
  const [isNovelExportOpen, setIsNovelExportOpen] = useState(false);

  // Active session
  const currentSession =
    sessions.find((s) => s.id === activeSessionId) ||
    sessions[0] ||
    MHA_PRESET_SESSION;

  // Sync activeSessionId with storage
  useEffect(() => {
    storageService.setActiveSessionId(currentSession.id);
  }, [currentSession.id]);

  const updateCurrentSession = (updatedSession: RoleplaySession) => {
    const nextSessions = storageService.saveSession(updatedSession);
    setSessions(nextSessions);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    storageService.setActiveSessionId(id);
  };

  const handleCreateNewSession = (universeType: UniverseType, title?: string) => {
    const created = storageService.createNewSession(universeType, title);
    setSessions(storageService.loadAllSessions());
    setActiveSessionId(created.id);
    setCurrentView('roleplay');
  };

  const handleDuplicateSession = (id: string) => {
    const { newSession, sessions: updated } = storageService.duplicateSession(id);
    setSessions(updated);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string) => {
    const remaining = storageService.deleteSession(id);
    setSessions(remaining);
    setActiveSessionId(remaining[0].id);
  };

  const handleImportSession = (jsonText: string) => {
    const imported = storageService.importSessionJSON(jsonText);
    setSessions(storageService.loadAllSessions());
    setActiveSessionId(imported.id);
    setCurrentView('roleplay');
  };

  // Quick switch between universe presets
  const handleSwitchToUniversePreset = (universe: 'mha' | 'naruto' | 'jjk') => {
    const existing = sessions.find((s) => s.universeType === universe);
    if (existing) {
      handleSelectSession(existing.id);
    } else {
      handleCreateNewSession(universe);
    }
  };

  // Chat message sending with multimodal attachments and fixed lore docs
  const handleSendMessage = async (
    text: string,
    options?: {
      attachments?: ChatAttachment[];
      diceRoll?: DiceRollResult;
      directorNote?: string;
    }
  ) => {
    const hasAttachments = Boolean(options?.attachments && options.attachments.length > 0);
    if ((!text.trim() && !hasAttachments) || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      speakerName: currentSession.character.name,
      text: text.trim() || (hasAttachments ? `[Sent ${options?.attachments?.length} attachment(s)]` : '...'),
      timestamp: Date.now(),
      attachments: options?.attachments,
      diceRoll: options?.diceRoll,
      directorNote: options?.directorNote,
    };

    const sessionWithUserMsg: RoleplaySession = {
      ...currentSession,
      messages: [...currentSession.messages, userMsg],
      updatedAt: Date.now(),
    };

    updateCurrentSession(sessionWithUserMsg);
    setIsLoading(true);

    try {
      const response = await geminiService.sendRoleplayMessage({
        session: sessionWithUserMsg,
        userMessage: userMsg.text,
        attachments: options?.attachments,
        diceRoll: options?.diceRoll,
        gmDirectorNote: options?.directorNote,
      });

      const modelMsg: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        sender: 'model',
        speakerName: 'LoreMaster GM',
        text: response.text,
        timestamp: Date.now(),
        suggestions: response.suggestions,
      };

      const finalSession: RoleplaySession = {
        ...sessionWithUserMsg,
        messages: [...sessionWithUserMsg.messages, modelMsg],
        updatedAt: Date.now(),
      };

      updateCurrentSession(finalSession);
    } catch (error: any) {
      console.error('Failed to get GM response:', error);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'system',
        speakerName: 'System Error',
        text: `*(Error contacting LoreMaster AI: ${error.message || 'Please check your connection and try again.'})*`,
        timestamp: Date.now(),
      };

      const errSession: RoleplaySession = {
        ...sessionWithUserMsg,
        messages: [...sessionWithUserMsg.messages, errorMsg],
        updatedAt: Date.now(),
      };
      updateCurrentSession(errSession);
    } finally {
      setIsLoading(false);
    }
  };

  // Add fixed fanfic lore reference document
  const handleAddReferenceDocument = (doc: { title: string; filename: string; mimeType: string; content: string }) => {
    const newDoc: LoreReferenceDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: doc.title,
      filename: doc.filename,
      mimeType: doc.mimeType,
      content: doc.content,
      uploadedAt: Date.now(),
    };
    updateCurrentSession({
      ...currentSession,
      referenceDocuments: [...(currentSession.referenceDocuments || []), newDoc],
    });
  };

  // Remove fixed fanfic lore reference document
  const handleRemoveReferenceDocument = (docId: string) => {
    updateCurrentSession({
      ...currentSession,
      referenceDocuments: (currentSession.referenceDocuments || []).filter((d) => d.id !== docId),
    });
  };

  // Re-roll last message
  const handleRerollLastMessage = async () => {
    if (isLoading || currentSession.messages.length === 0) return;

    const messages = [...currentSession.messages];
    const lastMsg = messages[messages.length - 1];

    if (lastMsg.sender !== 'model') return;

    // Pop the last model message
    messages.pop();
    const prevUserMsg = [...messages].reverse().find((m) => m.sender === 'user');

    if (!prevUserMsg) return;

    const rollbackSession: RoleplaySession = {
      ...currentSession,
      messages,
      updatedAt: Date.now(),
    };

    updateCurrentSession(rollbackSession);
    setIsLoading(true);

    try {
      const response = await geminiService.sendRoleplayMessage({
        session: rollbackSession,
        userMessage: prevUserMsg.text,
        diceRoll: prevUserMsg.diceRoll,
        gmDirectorNote: prevUserMsg.directorNote,
      });

      const newModelMsg: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        sender: 'model',
        speakerName: 'LoreMaster GM',
        text: response.text,
        timestamp: Date.now(),
        suggestions: response.suggestions,
      };

      const finalSession: RoleplaySession = {
        ...rollbackSession,
        messages: [...rollbackSession.messages, newModelMsg],
        updatedAt: Date.now(),
      };

      updateCurrentSession(finalSession);
    } catch (error: any) {
      console.error('Failed to reroll turn:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit message in-place
  const handleEditMessage = (messageId: string, newText: string) => {
    const updatedMessages = currentSession.messages.map((m) =>
      m.id === messageId ? { ...m, text: newText } : m
    );
    updateCurrentSession({
      ...currentSession,
      messages: updatedMessages,
    });
  };

  // Fate D20 check submission
  const handleSubmitDiceRoll = (rollResult: DiceRollResult, actionText: string) => {
    handleSendMessage(actionText, { diceRoll: rollResult });
  };

  // Inject a sudden fanfiction twist or villain arrival mid-scene
  const handleInjectQuickTwist = () => {
    const isMha = currentSession.universeType === 'mha';
    const twistOptions = isMha
      ? [
          'A purple mist gate suddenly opens in Ground Beta—Kurogiri and a Vanguard Squad villain step through to abduct a student!',
          'Your Quirk factor undergoes an unexpected resonant surge, causing shockwaves that shatter nearby glass and alert All Might!',
          'Shoto Todoroki pauses the spar and reveals he knows about your unregistered quirk file from Endeavor\'s agency records!',
          'An emergency siren wails across U.A. High: Tartarus prison has reported a classified breach!',
        ]
      : [
          'Tobi phase-shifts directly behind you as black flames ignite the surrounding forest!',
          'A raven from Itachi manifests from shadows and whispers an emergency decoded seal coordinates!',
          'Root ANBU strike without warning from the tree canopy, attempting to seize your sealing scroll!',
          'The sky turns pitch crimson as the spatial barrier around the forest begins to collapse!',
        ];

    const chosenTwist = twistOptions[Math.floor(Math.random() * twistOptions.length)];

    handleSendMessage(`*Suddenly, an unforeseen crisis ruptures the flow of events!*`, {
      directorNote: chosenTwist,
    });
  };



  // Toggle active divergence
  const handleToggleDivergence = (id: string) => {
    const updated = currentSession.fanficDivergences.map((d) =>
      d.id === id ? { ...d, active: !d.active } : d
    );
    updateCurrentSession({
      ...currentSession,
      fanficDivergences: updated,
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <Header
        currentSession={currentSession}
        sessions={sessions}
        currentView={currentView}
        onToggleView={setCurrentView}
        onSelectSession={handleSelectSession}
        onOpenCodex={() => setIsCodexOpen(true)}
        onOpenCharacterSheet={() => setIsCharacterSheetOpen(true)}
        onOpenDiceModal={() => setIsDiceModalOpen(true)}
        onOpenSessionManager={() => setIsSessionManagerOpen(true)}
        onOpenNovelExport={() => setIsNovelExportOpen(true)}
        onNewCampaign={() => setIsSessionManagerOpen(true)}
        onNarrativeStyleChange={(style) =>
          updateCurrentSession({ ...currentSession, narrativeStyle: style })
        }
      />

      {/* Main App Body: Menu View or Interactive Roleplay Feed */}
      {currentView === 'menu' ? (
        <MainMenu
          currentSession={currentSession}
          sessions={sessions}
          onEnterRoleplay={() => setCurrentView('roleplay')}
          onSelectSession={handleSelectSession}
          onOpenNewCampaignModal={() => setIsSessionManagerOpen(true)}
          onOpenSessionManager={() => setIsSessionManagerOpen(true)}
          onOpenCharacterSheet={() => setIsCharacterSheetOpen(true)}
          onOpenCodex={() => setIsCodexOpen(true)}
          onOpenDiceModal={() => setIsDiceModalOpen(true)}
          onOpenNovelExport={() => setIsNovelExportOpen(true)}
          onSwitchUniversePreset={(uni) => {
            handleSwitchToUniversePreset(uni);
            setCurrentView('roleplay');
          }}
        />
      ) : (
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Control Sidebar */}
          <Sidebar
            session={currentSession}
            onOpenCharacterSheet={() => setIsCharacterSheetOpen(true)}
            onOpenCodex={() => setIsCodexOpen(true)}
            onOpenDiceModal={() => setIsDiceModalOpen(true)}
            onToggleDivergence={handleToggleDivergence}
            onSelectMove={(moveName) => {
              handleSendMessage(`*Unleashes signature move:* **[${moveName}]**!`);
            }}
            onSwitchToUniversePreset={handleSwitchToUniversePreset}
          />

          {/* Center Story Feed & Interactive Action Console */}
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            <StoryFeed
              session={currentSession}
              onSendMessage={handleSendMessage}
              onRerollLastMessage={handleRerollLastMessage}
              onEditMessage={handleEditMessage}
              onOpenDiceModal={() => setIsDiceModalOpen(true)}
              onInjectQuickTwist={handleInjectQuickTwist}
              onAddReferenceDocument={handleAddReferenceDocument}
              onRemoveReferenceDocument={handleRemoveReferenceDocument}
              isLoading={isLoading}
            />
          </main>
        </div>
      )}

      {/* Modals */}
      <LoreCodexModal
        session={currentSession}
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        onUpdateSession={updateCurrentSession}
      />

      <CharacterSheetModal
        session={currentSession}
        isOpen={isCharacterSheetOpen}
        onClose={() => setIsCharacterSheetOpen(false)}
        onUpdateCharacter={(updated) =>
          updateCurrentSession({ ...currentSession, character: updated })
        }
      />

      <DiceRollModal
        isOpen={isDiceModalOpen}
        onClose={() => setIsDiceModalOpen(false)}
        character={currentSession.character}
        onSubmitRoll={handleSubmitDiceRoll}
      />

      <SessionManagerModal
        isOpen={isSessionManagerOpen}
        onClose={() => setIsSessionManagerOpen(false)}
        sessions={sessions}
        activeSessionId={currentSession.id}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateNewSession}
        onDuplicateSession={handleDuplicateSession}
        onDeleteSession={handleDeleteSession}
        onExportSession={storageService.exportSessionJSON}
        onImportSession={handleImportSession}
      />

      <NovelExportModal
        session={currentSession}
        isOpen={isNovelExportOpen}
        onClose={() => setIsNovelExportOpen(false)}
        onUpdateNarrativeStyle={(style) =>
          updateCurrentSession({ ...currentSession, narrativeStyle: style })
        }
      />
    </div>
  );
}
