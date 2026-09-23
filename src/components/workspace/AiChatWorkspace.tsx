import { useState, useRef, useEffect } from 'react';
import { ToolItem, ChatMessage } from '../../types';
import { Dropzone } from '../common/Dropzone';
import { extractTextQuick } from '../../services/pdfService';
import { postJson } from '../../services/apiClient';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  FileText,
  RotateCcw,
  Loader2,
  AlertCircle,
  Download,
} from 'lucide-react';

interface AiChatWorkspaceProps {
  tool: ToolItem;
}

export function AiChatWorkspace({ tool }: AiChatWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [docText, setDocText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding]);

  const handleFileSelected = async (selected: File[]) => {
    if (selected.length === 0) return;
    const uploaded = selected[0];
    setFile(uploaded);
    setIsExtracting(true);
    setError(null);

    try {
      const text = await extractTextQuick(uploaded);
      setDocText(text);

      // Initial welcoming AI assistant message
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `Hello! I've loaded and analyzed **${uploaded.name}** (${(uploaded.size / 1024).toFixed(1)} KB). Ask me anything about this document, request an executive summary, or extract specific data points.`,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setError('Could not extract text from document: ' + err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isAiResponding) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAiResponding(true);

    try {
      const data = await postJson<{ response: string }>('/api/ai/chat', {
        message: query,
        documentText: docText,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'No response generated.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to AI engine. Please verify network.');
    } finally {
      setIsAiResponding(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedQuestions = [
    'Provide a 3-bullet executive summary of this document',
    'What are the key obligations, deadlines, or dates mentioned?',
    'Identify any financial figures, metrics, or revenue estimates',
    'What potential risks or liabilities are highlighted in this text?',
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl space-y-6">
      {!file ? (
        <div className="max-w-xl mx-auto py-8">
          <Dropzone
            onFilesSelected={handleFileSelected}
            selectedFiles={[]}
            onRemoveFile={() => {}}
            multiple={false}
            acceptMimeTypes={['application/pdf', 'text/plain', 'application/json']}
            label="Upload Document to Start AI Chat"
            description="Upload PDF or text. Document parsed securely in memory with zero persistence."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
          {/* Left Panel: Document Overview */}
          <div className="lg:col-span-4 flex flex-col rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200 truncate">{file.name}</span>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setDocText('');
                  setMessages([]);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition"
              >
                Change File
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div className="text-[11px] text-slate-400 font-medium">DOCUMENT PREVIEW (PARSED CONTEXT)</div>
              <div className="rounded-lg border border-slate-900 bg-slate-900/50 p-3 font-mono text-[11px] leading-relaxed text-slate-300 max-h-60 lg:max-h-96 overflow-y-auto whitespace-pre-wrap">
                {isExtracting ? 'Extracting document text...' : docText.slice(0, 1500) + '...'}
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-slate-400 font-medium block mb-2">QUICK PROMPT CHIPS</span>
                <div className="space-y-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      disabled={isAiResponding}
                      className="w-full text-left text-[11px] rounded-lg border border-slate-800 bg-slate-900/90 p-2 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 transition"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Chat Thread */}
          <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
            {/* Thread Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-900/40">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  Grounded Document Intelligence (Gemini 3 Flash)
                </span>
              </div>
              <button
                onClick={() => setMessages([messages[0]])}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                title="Clear thread"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[440px]">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {!isUser && (
                        <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-800/60 pt-2 text-[10px] text-slate-400">
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="flex items-center gap-1 hover:text-slate-200"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isAiResponding && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                    <span>Analyzing document and formulating citation-grounded response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error banner if any */}
            {error && (
              <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-red-900/40 bg-red-950/30 p-2.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Query Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="border-t border-slate-800 p-3 bg-slate-900/50 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask any question about this document..."
                className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none px-2"
                disabled={isAiResponding}
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isAiResponding}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
