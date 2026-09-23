import { useState } from 'react';
import { ToolItem } from '../../types';
import { postJson } from '../../services/apiClient';
import {
  PenTool,
  Copy,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
  Download,
  Languages,
} from 'lucide-react';

interface AiWritingWorkspaceProps {
  tool: ToolItem;
}

export function AiWritingWorkspace({ tool }: AiWritingWorkspaceProps) {
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState<string | null>(null);
  const [tone, setTone] = useState<'professional' | 'academic' | 'casual' | 'punchy'>('professional');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTranslator = tool.id === 'ai-document-translator';

  const handleGenerate = async () => {
    if (!inputContent.trim()) {
      setError('Please provide text or draft notes.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const toolKey = tool.id.replace(/^ai-/, '');
      const data = await postJson<{ result: string }>('/api/ai/writing', {
        input: inputContent,
        tool: toolKey,
        tone,
        targetLanguage,
      });

      setOutputContent(data.result || 'No response generated.');
    } catch (err: any) {
      setError(err.message || 'Error communicating with writing engine');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!outputContent) return;
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {!isTranslator ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Tone Preset:</span>
            {(['professional', 'academic', 'casual', 'punchy'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`rounded-lg px-3 py-1 text-xs capitalize transition ${
                  tone === t
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-400">Target Language:</span>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Japanese">Japanese (日本語)</option>
              <option value="Mandarin">Mandarin (中文)</option>
              <option value="Portuguese">Portuguese (Português)</option>
              <option value="Italian">Italian (Italiano)</option>
            </select>
          </div>
        )}

        <div className="text-xs text-slate-500 font-mono">
          {inputContent.length} characters · {inputContent.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>

      {/* Split Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Box */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300">Original Text / Prompt</label>
          <textarea
            rows={12}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Type or paste your text here to polish, rewrite, translate, or check..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
          />

          <button
            type="button"
            disabled={isGenerating || !inputContent.trim()}
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition disabled:opacity-40"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Refining with Gemini 3 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Execute {tool.name}</span>
              </>
            )}
          </button>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Output Box */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-semibold text-slate-200">Refined Result</span>
            {outputContent && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto text-xs leading-relaxed text-slate-200 max-h-[380px] whitespace-pre-wrap">
            {outputContent ? (
              outputContent
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center space-y-2">
                <PenTool className="h-8 w-8 text-slate-700" />
                <p>Your polished writing, grammar corrections, or translation will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
