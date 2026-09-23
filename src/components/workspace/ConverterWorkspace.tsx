import { useState } from 'react';
import { ToolItem } from '../../types';
import { Dropzone } from '../common/Dropzone';
import {
  textToPDF,
  imagesToPDF,
  downloadUint8Array,
  extractTextQuick,
} from '../../services/pdfService';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileType,
} from 'lucide-react';

interface ConverterWorkspaceProps {
  tool: ToolItem;
}

export function ConverterWorkspace({ tool }: ConverterWorkspaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [rawText, setRawText] = useState('');
  const [docTitle, setDocTitle] = useState('My Document');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<{
    url: string;
    filename: string;
    sizeBytes: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isTextToPdf = tool.id === 'text-to-pdf';
  const isJpgToPdf = tool.id === 'jpg-to-pdf';

  const handleConvert = async () => {
    if (!isTextToPdf && files.length === 0) {
      setError('Please select a file to convert.');
      return;
    }
    if (isTextToPdf && !rawText.trim()) {
      setError('Please enter some text to generate your PDF document.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (isTextToPdf) {
        const { data, filename } = await textToPDF(rawText, docTitle);
        const blob = new Blob([data as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResultBlob({ url, filename, sizeBytes: data.byteLength });
      } else if (isJpgToPdf) {
        const { data, filename } = await imagesToPDF(files);
        const blob = new Blob([data as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResultBlob({ url, filename, sizeBytes: data.byteLength });
      } else if (tool.id === 'pdf-to-word') {
        // Extract text and build formatted Word document
        const text = await extractTextQuick(files[0]);
        const htmlDoc = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head><title>${files[0].name}</title>
          <style>body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.5;margin:1in;}h1{color:#1e293b;}</style>
          </head>
          <body>
          <h1>${files[0].name.replace(/\.pdf$/i, '')}</h1>
          <p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>
          </body>
          </html>
        `;
        const blob = new Blob(['\ufeff', htmlDoc], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        setResultBlob({
          url,
          filename: `${files[0].name.replace(/\.pdf$/i, '')}.doc`,
          sizeBytes: blob.size,
        });
      } else {
        // Fallback for general converter
        const text = await extractTextQuick(files[0]);
        const { data, filename } = await textToPDF(text, files[0].name.replace(/\.[^/.]+$/, ''));
        const blob = new Blob([data as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResultBlob({ url, filename, sizeBytes: data.byteLength });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Conversion error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setRawText('');
    setResultBlob(null);
    setError(null);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      {!resultBlob ? (
        <div className="space-y-6 max-w-xl mx-auto">
          {isTextToPdf ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Project Plan, Meeting Summary"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Text / Notes Content</label>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Type or paste formatted notes to generate a crisp A4 PDF..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <Dropzone
              onFilesSelected={setFiles}
              selectedFiles={files}
              onRemoveFile={(idx) => setFiles((prev) => prev.filter((_, i) => i !== idx))}
              multiple={isJpgToPdf}
              acceptMimeTypes={tool.acceptedMimeTypes || ['application/pdf', 'image/jpeg', 'image/png']}
              label={`Select file(s) for ${tool.name}`}
              description={
                isJpgToPdf
                  ? 'Select one or more JPG/PNG images to compile into a single PDF.'
                  : 'Fast client-side file transformation with zero server upload.'
              }
            />
          )}

          <button
            type="button"
            disabled={isProcessing || (!isTextToPdf && files.length === 0) || (isTextToPdf && !rawText.trim())}
            onClick={handleConvert}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Converting Document...</span>
              </>
            ) : (
              <>
                <FileType className="h-4 w-4" />
                <span>Convert to {tool.name.split(' to ')[1] || 'Target Format'}</span>
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
      ) : (
        <div className="space-y-6 text-center py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100">Conversion Complete!</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your document has been transformed. You can download your formatted file below.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-xs text-slate-300">
            <span>Size:</span>
            <strong className="text-emerald-400">{(resultBlob.sizeBytes / 1024).toFixed(1)} KB</strong>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={resultBlob.url}
              download={resultBlob.filename}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download {resultBlob.filename}</span>
            </a>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              Convert Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
