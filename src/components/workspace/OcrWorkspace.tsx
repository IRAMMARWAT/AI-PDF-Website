import { useState } from 'react';
import { ToolItem } from '../../types';
import { Dropzone } from '../common/Dropzone';
import {
  Scan,
  Copy,
  Check,
  Download,
  Loader2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

interface OcrWorkspaceProps {
  tool: ToolItem;
}

export function OcrWorkspace({ tool }: OcrWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const uploaded = files[0];
    setFile(uploaded);
    setExtractedText(null);
    setError(null);

    if (uploaded.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(uploaded);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRunOcr = async () => {
    if (!file) {
      setError('Please upload a scanned document or image first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let imageBase64: string | undefined;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        imageBase64 = await base64Promise;
      }

      const mode = tool.id === 'invoice-ocr' ? 'invoice' : tool.id === 'table-ocr' ? 'table' : 'invoice';

      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          text: !imageBase64 ? `Document: ${file.name}` : undefined,
          mode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract text from scan');
      }

      setExtractedText(data.result || 'No text recognized.');
    } catch (err: any) {
      setError(err.message || 'OCR processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docunova-ocr-${file?.name || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Preview Side */}
        <div className="space-y-4">
          <Dropzone
            onFilesSelected={handleFiles}
            selectedFiles={file ? [file] : []}
            onRemoveFile={() => {
              setFile(null);
              setPreviewUrl(null);
              setExtractedText(null);
            }}
            multiple={false}
            acceptMimeTypes={['image/jpeg', 'image/png', 'image/webp', 'application/pdf']}
            label="Upload Receipt, Invoice, or Scanned Image"
            description="Supports JPG, PNG, WEBP, and PDF. High-resolution OCR with layout preservation."
          />

          {previewUrl && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 overflow-hidden flex items-center justify-center max-h-64">
              <img
                src={previewUrl}
                alt="Document preview"
                className="max-h-60 object-contain rounded-lg"
              />
            </div>
          )}

          <button
            type="button"
            disabled={isProcessing || !file}
            onClick={handleRunOcr}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Extracting Text and Tables with Vision AI...</span>
              </>
            ) : (
              <>
                <Scan className="h-4 w-4" />
                <span>Perform OCR & Extract Data</span>
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

        {/* Results Output Side */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">Recognized Text / Data</span>
            </div>

            {extractedText && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto text-xs leading-relaxed text-slate-200 max-h-[440px] whitespace-pre-wrap font-mono">
            {extractedText ? (
              extractedText
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center space-y-2">
                <FileSpreadsheet className="h-8 w-8 text-slate-700" />
                <p>Upload a document or photo to inspect recognized text and tabular grids.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
