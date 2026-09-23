import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Dices,
  RefreshCw,
  Edit3,
  Copy,
  Check,
  Zap,
  Flame,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Shield,
  HelpCircle,
  Lightbulb,
  Image as ImageIcon,
  FileText,
  Upload,
  X,
  Eye,
  Maximize2,
  BookOpen,
  Pin,
  Paperclip,
} from 'lucide-react';
import {
  ChatMessage,
  RoleplaySession,
  ChatAttachment,
  LoreReferenceDocument,
} from '../types/roleplay';
import { processUploadedFile } from '../utils/fileAttachmentUtils';

interface StoryFeedProps {
  session: RoleplaySession;
  onSendMessage: (
    text: string,
    customOptions?: {
      attachments?: ChatAttachment[];
      directorNote?: string;
    }
  ) => void;
  onRerollLastMessage: () => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onOpenDiceModal: () => void;
  onInjectQuickTwist: () => void;
  onAddReferenceDocument?: (doc: { title: string; filename: string; mimeType: string; content: string }) => void;
  onRemoveReferenceDocument?: (docId: string) => void;
  isLoading: boolean;
}

export const StoryFeed: React.FC<StoryFeedProps> = ({
  session,
  onSendMessage,
  onRerollLastMessage,
  onEditMessage,
  onOpenDiceModal,
  onInjectQuickTwist,
  onAddReferenceDocument,
  onRemoveReferenceDocument,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [directorNote, setDirectorNote] = useState('');
  const [showDirectorInput, setShowDirectorInput] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multimodal Attachments State
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [showDocLibraryModal, setShowDocLibraryModal] = useState(false);
  const [activePreviewDoc, setActivePreviewDoc] = useState<{ title: string; content: string } | null>(null);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);
  const [pinNewDocsPermanently, setPinNewDocsPermanently] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const isMHA = session.universeType === 'mha';
  const isNaruto = session.universeType === 'naruto';
  const isJJK = session.universeType === 'jjk';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, isLoading, pendingAttachments.length]);

  // Handle file uploads (images or documents)
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingFiles(true);
    try {
      const newAttachments: ChatAttachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const processed = await processUploadedFile(file);
        newAttachments.push(processed);

        // If it's a lore document and user has permanent pin enabled, add to session reference docs
        if (processed.type === 'document' && onAddReferenceDocument && pinNewDocsPermanently) {
          onAddReferenceDocument({
            title: processed.name,
            filename: processed.name,
            mimeType: processed.mimeType,
            content: processed.textContent || `[Document: ${processed.name}]`,
          });
        }
      }
      setPendingAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err) {
      console.error('Error processing attachments:', err);
    } finally {
      setIsProcessingFiles(false);
      // Reset inputs
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (docInputRef.current) docInputRef.current.value = '';
    }
  };

  // Clipboard paste support for images
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const filesToProcess: File[] = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) filesToProcess.push(file);
      }
    }

    if (filesToProcess.length > 0) {
      setIsProcessingFiles(true);
      try {
        const newAttachments: ChatAttachment[] = [];
        for (const file of filesToProcess) {
          const processed = await processUploadedFile(file);
          newAttachments.push(processed);
        }
        setPendingAttachments((prev) => [...prev, ...newAttachments]);
      } catch (err) {
        console.error('Failed to paste image', err);
      } finally {
        setIsProcessingFiles(false);
      }
    }
  };

  // Drag and drop onto story area
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFilesSelected(e.dataTransfer.files);
    }
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleDescribeCharacterLook = (id: string) => {
    setPendingAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isCharacterLook: !a.isCharacterLook } : a))
    );
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const hasText = Boolean(inputText.trim());
    const hasAttachments = pendingAttachments.length > 0;

    if ((!hasText && !hasAttachments) || isLoading) return;

    onSendMessage(inputText.trim(), {
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
      directorNote: directorNote.trim() ? directorNote.trim() : undefined,
    });

    setInputText('');
    setDirectorNote('');
    setShowDirectorInput(false);
    setPendingAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const insertDialogueQuote = () => {
    setInputText((prev) => prev + '""');
    textareaRef.current?.focus();
  };

  const insertActionAsterisk = () => {
    setInputText((prev) => prev + '**');
    textareaRef.current?.focus();
  };

  // Render markdown formatting
  const formatDialogue = (content: string) => {
    const formatted = content
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-black">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-amber-200/90 italic font-serif">$1</em>')
      .replace(/"([^"]+)"/g, '<span class="text-emerald-300 font-medium">“$1”</span>');

    return { __html: formatted };
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative"
    >
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        onChange={(e) => handleFilesSelected(e.target.files)}
        className="hidden"
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md,text/plain"
        multiple
        onChange={(e) => handleFilesSelected(e.target.files)}
        className="hidden"
      />

      {/* Top Session Story Banner */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider">
              {session.universe}
            </span>
          </div>
          <span className="text-slate-500 hidden sm:inline">&bull;</span>
          <span className="text-slate-400 hidden sm:inline truncate max-w-sm">
            {session.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reference Documents counter button */}
          <button
            onClick={() => setShowDocLibraryModal(true)}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 flex items-center gap-1.5 font-semibold text-[11px] transition shadow-sm"
            title="Manage fixed fanfic reference documents"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Lore Docs ({session.referenceDocuments?.length || 0})</span>
          </button>

          <button
            onClick={onInjectQuickTwist}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold text-[11px] transition"
            title="Inject an unexpected fanfic twist or crisis into the timeline"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Surprise Twist</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Welcome Lore Banner */}
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800/80 text-xs space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-black text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              {isMHA ? (
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
              ) : isNaruto ? (
                <Shield className="w-3.5 h-3.5 text-orange-400" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
              )}
              Timeline Anchor &amp; Lore Engine
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-emerald-400">
              Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">{session.timelineAnchor}</p>
          <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
            <span className="text-amber-400 font-semibold">Active Divergences:</span>
            {session.fanficDivergences.filter((d) => d.active).map((d) => (
              <span
                key={d.id}
                className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px]"
              >
                {d.title}
              </span>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        {session.messages.map((message, index) => {
          const isUser = message.sender === 'user';
          const isSystem = message.sender === 'system';
          const isLastModel = !isUser && index === session.messages.length - 1;

          if (isSystem) {
            return (
              <div key={message.id} className="max-w-2xl mx-auto my-3">
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-center justify-between gap-3 shadow">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{message.text}</span>
                  </div>
                  <button
                    onClick={onRerollLastMessage}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition flex-shrink-0 shadow"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Retry</span>
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              {/* Sender Name & Meta */}
              <div className="flex items-center gap-2 mb-1.5 px-2">
                <span className="text-xs font-bold text-slate-400">
                  {isUser ? session.character.name : 'LoreMaster GM (Gemini 3.8 Flash)'}
                </span>
                {isUser && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {session.character.alias}
                  </span>
                )}
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Message Box */}
              <div
                className={`relative max-w-3xl rounded-2xl p-4 sm:p-5 shadow-xl transition-all ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 text-slate-100 rounded-tr-sm'
                    : 'bg-slate-900/95 border border-slate-800 text-slate-100 rounded-tl-sm'
                }`}
              >
                {/* Visual Image Attachments if present in message */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <Paperclip className="w-3 h-3 text-cyan-400" />
                      <span>Attached Visuals &amp; Lore References ({message.attachments.length})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {message.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950/90 p-2 space-y-2"
                        >
                          {att.type === 'image' && att.dataUrl ? (
                            <div className="relative group/img cursor-pointer" onClick={() => setActivePreviewImage(att.dataUrl!)}>
                              <img
                                src={att.dataUrl}
                                alt={att.name}
                                className="w-full h-44 object-cover rounded-lg border border-slate-800"
                              />
                              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition rounded-lg flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-xs">
                                <Maximize2 className="w-4 h-4" />
                                <span>Zoom Image</span>
                              </div>
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/50 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>Character Appearance Reference</span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-indigo-400" />
                                  <span className="text-xs font-bold text-white truncate max-w-[180px]">
                                    {att.name}
                                  </span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded bg-indigo-900/60 text-[9px] font-mono text-indigo-300 uppercase">
                                  {att.mimeType.includes('pdf') ? 'PDF' : 'DOC'}
                                </span>
                              </div>
                              {att.textContent && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActivePreviewDoc({
                                      title: att.name,
                                      content: att.textContent || '',
                                    })
                                  }
                                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 pt-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Inspect Attached Lore</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Director Note badge if present */}
                {message.directorNote && (
                  <div className="mb-3 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>
                      <strong className="font-bold">Director/Fanfic Note:</strong> {message.directorNote}
                    </span>
                  </div>
                )}

                {/* Editable Content or Standard Render */}
                {editingMessageId === message.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full h-32 bg-slate-950 text-white text-sm p-3 rounded-xl border border-indigo-500 focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingMessageId(null)}
                        className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onEditMessage(message.id, editText);
                          setEditingMessageId(null);
                        }}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500"
                      >
                        Save Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans text-slate-200"
                    dangerouslySetInnerHTML={formatDialogue(message.text)}
                  />
                )}

                {/* Actions Toolbar */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCopy(message.id, message.text)}
                      className="hover:text-slate-300 flex items-center gap-1 transition"
                      title="Copy to clipboard"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingMessageId(message.id);
                        setEditText(message.text);
                      }}
                      className="hover:text-slate-300 flex items-center gap-1 transition"
                      title="Edit this post"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {isLastModel && !isLoading && (
                    <button
                      onClick={onRerollLastMessage}
                      className="text-amber-400/90 hover:text-amber-300 flex items-center gap-1 font-semibold transition"
                      title="Regenerate this turn with Gemini 3.8 Flash"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reroll Response</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Suggestions Chips from Flash 3.8 Gemini */}
              {isLastModel && message.suggestions && message.suggestions.length > 0 && !isLoading && (
                <div className="mt-3.5 w-full max-w-3xl pl-2 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-bold uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Story Next-Step Options:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {message.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => {
                          setInputText(sug);
                          textareaRef.current?.focus();
                        }}
                        className="text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-xs sm:text-sm text-slate-200 hover:text-white transition flex items-center justify-between group shadow-sm"
                      >
                        <span className="flex-1 pr-2">
                          <strong className="text-amber-400 font-mono mr-1.5">[{sIdx + 1}]</strong>
                          {sug}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transform group-hover:translate-x-0.5 transition flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-md">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                LoreMaster AI is narrating the scene...
              </div>
              <p className="text-xs text-slate-400">
                Observing attached character appearances, fixed fanfic reference documents, and canon lore...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Action Console */}
      <div className="p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* ATTACHMENT TRAY (Images & Documents ready to send) */}
          {pendingAttachments.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-amber-500/40 space-y-2 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Ready to Send with This Turn ({pendingAttachments.length}):
                </span>
                <span className="text-[11px] text-slate-400">
                  AI will inspect character look &amp; incorporate attached documents
                </span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {pendingAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="relative flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 group"
                  >
                    {att.type === 'image' && att.dataUrl ? (
                      <img
                        src={att.dataUrl}
                        alt={att.name}
                        className="w-14 h-14 object-cover rounded-lg border border-slate-700"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-indigo-950 border border-indigo-800 flex flex-col items-center justify-center text-indigo-300">
                        <FileText className="w-6 h-6" />
                        <span className="text-[9px] font-mono uppercase mt-0.5">
                          {att.mimeType.includes('pdf') ? 'PDF' : 'DOC'}
                        </span>
                      </div>
                    )}

                    <div className="space-y-1 pr-6 max-w-[200px]">
                      <div className="text-xs font-bold text-white truncate">{att.name}</div>
                      {att.type === 'image' ? (
                        <button
                          type="button"
                          onClick={() => toggleDescribeCharacterLook(att.id)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border transition ${
                            att.isCharacterLook
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                          title="Click to toggle: Prompt AI to describe this character's look"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          <span>Describe Character Look</span>
                        </button>
                      ) : (
                        <div className="text-[10px] text-emerald-400 font-medium">
                          Fixed Lore Reference Doc
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removePendingAttachment(att.id)}
                      className="absolute top-1 right-1 p-1 text-slate-500 hover:text-red-400 rounded-md transition"
                      title="Remove attachment"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Toolbar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Insert Image Button */}
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isProcessingFiles}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded border border-amber-500/40 flex items-center gap-1 font-bold text-xs shadow-sm transition"
                title="Insert character or scene image (AI will describe their visual look!)"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Insert Image (Character Look)</span>
              </button>

              {/* Attach Document Button */}
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                disabled={isProcessingFiles}
                className="px-2.5 py-1 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 rounded border border-indigo-700/50 flex items-center gap-1 font-bold text-xs shadow-sm transition"
                title="Attach PDF, Word, or text file for fixed fanfic lore reference"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Attach Fanfic Document</span>
              </button>

              <button
                type="button"
                onClick={insertDialogueQuote}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-serif font-bold text-xs"
                title='Insert Dialogue Quote ("...")'
              >
                &ldquo;Dialogue&rdquo;
              </button>

              <button
                type="button"
                onClick={insertActionAsterisk}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-mono text-xs"
                title="Insert Action Asterisks (*...*)"
              >
                *Action*
              </button>

              <button
                type="button"
                onClick={() => setShowDirectorInput(!showDirectorInput)}
                className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 border transition ${
                  showDirectorInput
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Add a Director/GM note to guide the narrative or insert a custom fanfic twist"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Director Note</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <span>Paste image (Ctrl+V) or drag file &bull; [Enter] to send</span>
            </div>
          </div>

          {/* Director Note Expandable Field */}
          {showDirectorInput && (
            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <input
                type="text"
                value={directorNote}
                onChange={(e) => setDirectorNote(e.target.value)}
                placeholder="E.g. [Director: Shigaraki arrives with Kurogiri's warp gate] or [Director: Let them observe the newcomer with skepticism]"
                className="w-full bg-transparent text-xs text-amber-200 placeholder-amber-400/50 outline-none"
              />
            </div>
          )}

          {/* Main Input Form */}
          <form onSubmit={handleSend} className="flex gap-2 items-end">
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={`Speak as ${session.character.name} or introduce a character/action... (Tip: insert an image and AI will describe how they look!)`}
                rows={2}
                className="w-full resize-none bg-slate-950 border border-slate-700 rounded-xl p-3 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition"
              />
            </div>

            <button
              type="submit"
              disabled={(!inputText.trim() && pendingAttachments.length === 0) || isLoading}
              className={`p-3 rounded-xl font-bold transition flex items-center justify-center shadow-lg ${
                (!inputText.trim() && pendingAttachments.length === 0) || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
              }`}
              title="Send to LoreMaster AI"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* MODAL 1: LORE REFERENCE DOCUMENTS LIBRARY */}
      {showDocLibraryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Fixed Fanfic Lore &amp; Reference Documents</h2>
                  <p className="text-xs text-slate-400">
                    Uploaded PDF, Word, and text files permanently ground the AI in your fanfic lore.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDocLibraryModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Reference File (PDF / Word / TXT)</span>
                </button>

                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pinNewDocsPermanently}
                    onChange={(e) => setPinNewDocsPermanently(e.target.checked)}
                    className="accent-indigo-500 rounded"
                  />
                  <span>Auto-pin uploads to campaign</span>
                </label>
              </div>

              {(!session.referenceDocuments || session.referenceDocuments.length === 0) ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-300">No fixed lore documents uploaded yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Upload your fanfiction chapters, worldbuilding rules, or character sheets in PDF/Word format. The AI reads them as fixed canon truth.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {session.referenceDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-sm font-bold text-white">{doc.title}</h4>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-[10px] font-mono text-indigo-300">
                            {doc.mimeType.includes('pdf') ? 'PDF' : 'DOC/TXT'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 italic">
                          {doc.content.slice(0, 150)}...
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setActivePreviewDoc({
                              title: doc.title,
                              content: doc.content,
                            })
                          }
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        {onRemoveReferenceDocument && (
                          <button
                            onClick={() => onRemoveReferenceDocument(doc.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                            title="Remove from campaign lore"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={() => setShowDocLibraryModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DOCUMENT PREVIEW MODAL */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">{activePreviewDoc.title}</h3>
              </div>
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950">
              {activePreviewDoc.content}
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: IMAGE FULL LIGHTBOX */}
      {activePreviewImage && (
        <div
          onClick={() => setActivePreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
            <img
              src={activePreviewImage}
              alt="Character Look Preview"
              className="max-w-full max-h-[85vh] object-contain"
            />
            <button
              onClick={() => setActivePreviewImage(null)}
              className="absolute top-3 right-3 p-2 bg-slate-900/80 text-white rounded-full hover:bg-slate-800 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
