import { useState } from 'react';
import { ToolItem } from '../../types';
import { Dropzone } from '../common/Dropzone';
import { extractTextQuick, textToPDF, downloadUint8Array } from '../../services/pdfService';
import { postJson } from '../../services/apiClient';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Loader2,
  AlertCircle,
  FileText,
  AlignLeft,
} from 'lucide-react';

interface AiSummarizeWorkspaceProps {
  tool: ToolItem;
}

export function AiSummarizeWorkspace({ tool }: AiSummarizeWorkspaceProps) {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'executive' | 'tldr' | 'detailed' | 'keypoints' | 'actionitems'>('executive');
  const [summary, setSummary] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setIsProcessing(true);
    setError(null);
    try {
      const extracted = await extractTextQuick(file);
      setInputText(extracted);
    } catch (e: any) {
      setError('Failed to extract text from file: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please provide document text or upload a file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const data = await postJson<{ summary: string }>('/api/ai/summarize', {
        text: inputText,
        mode,
      });

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || 'Error communicating with AI service');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!summary) return;
    const { data, filename } = await textToPDF(summary, 'DocuNova-Summary');
    downloadUint8Array(data, filename);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      {/* Mode Selectors */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        <span className="text-xs font-semibold text-slate-400 mr-2">Summary Format:</span>
        {[
          { id: 'executive', label: 'Executive Summary' },
          { id: 'tldr', label: 'Quick TL;DR' },
          { id: 'keypoints', label: 'Key Points' },
          { id: 'actionitems', label: 'Action Items' },
          { id: 'detailed', label: 'Comprehensive' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id as any)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              mode === m.id
                ? 'bg-indigo-600 text-white font-semibold'
                : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Upload or Paste Content</span>
            {selectedFile && (
              <span className="text-xs text-indigo-400 font-medium truncate max-w-[200px]">
                Loaded: {selectedFile.name}
              </span>
            )}
          </div>

          <Dropzone
            onFilesSelected={handleFiles}
            selectedFiles={selectedFile ? [selectedFile] : []}
            onRemoveFile={() => {
              setSelectedFile(null);
              setInputText('');
            }}
            multiple={false}
            label="Upload Document (PDF/Text)"
            description="Drag & drop document to extract and summarize"
          />

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">Or Paste Text Directly</label>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste meeting notes, research abstract, article text or contracts..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <button
            type="button"
            disabled={isProcessing || !inputText.trim()}
            onClick={handleSummarize}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synthesizing Document with Gemini 3 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate {tool.name}</span>
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

        {/* Output Section */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">Synthesized Document Output</span>
            </div>

            {summary && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  <Download className="h-3 w-3" />
                  <span>PDF</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto text-xs leading-relaxed text-slate-300 max-h-[460px] whitespace-pre-wrap font-sans">
            {summary ? (
              summary
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center space-y-2">
                <AlignLeft className="h-8 w-8 text-slate-700" />
                <p>Your generated executive summary or key points will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
