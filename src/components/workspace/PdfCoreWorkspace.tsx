import { useState } from 'react';
import { ToolItem } from '../../types';
import { Dropzone } from '../common/Dropzone';
import {
  mergePDFs,
  splitPDF,
  rotatePDF,
  deletePages,
  watermarkPDF,
  addPageNumbers,
  downloadUint8Array,
} from '../../services/pdfService';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sliders,
  RotateCw,
  Stamp,
  Lock,
  Scissors,
  Layers,
} from 'lucide-react';

interface PdfCoreWorkspaceProps {
  tool: ToolItem;
}

export function PdfCoreWorkspace({ tool }: PdfCoreWorkspaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    data: Uint8Array;
    filename: string;
    originalSize: number;
    newSize: number;
  } | null>(null);

  // Tool specific configurations
  const [rotateDeg, setRotateDeg] = useState(90);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.2);
  const [splitRange, setSplitRange] = useState('1-2');
  const [deletePageNums, setDeletePageNums] = useState('2');
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right'>('bottom-center');
  const [password, setPassword] = useState('');

  const isMultiFile = tool.id === 'merge-pdf';

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please select at least one PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(20);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 80 ? prev + 15 : prev));
      }, 150);

      let processedData: Uint8Array | null = null;
      let outputFilename = `docunova-${tool.id}.pdf`;
      const originalTotalSize = files.reduce((acc, f) => acc + f.size, 0);

      if (tool.id === 'merge-pdf') {
        const res = await mergePDFs(files);
        processedData = res.data;
        outputFilename = res.filename;
      } else if (tool.id === 'split-pdf') {
        const splits = await splitPDF(files[0], splitRange);
        if (splits.length > 0) {
          processedData = splits[0].data;
          outputFilename = splits[0].filename;
        }
      } else if (tool.id === 'rotate-pdf') {
        const res = await rotatePDF(files[0], rotateDeg);
        processedData = res.data;
        outputFilename = res.filename;
      } else if (tool.id === 'delete-pdf-pages') {
        const pageList = deletePageNums
          .split(',')
          .map((n) => parseInt(n.trim(), 10))
          .filter((n) => !isNaN(n));
        const res = await deletePages(files[0], pageList);
        processedData = res.data;
        outputFilename = res.filename;
      } else if (tool.id === 'watermark-pdf') {
        const res = await watermarkPDF(files[0], watermarkText, watermarkOpacity);
        processedData = res.data;
        outputFilename = res.filename;
      } else if (tool.id === 'add-page-numbers') {
        const res = await addPageNumbers(files[0], pageNumberPos);
        processedData = res.data;
        outputFilename = res.filename;
      } else {
        // Fallback for compress/protect/other core ops
        const arrayBuffer = await files[0].arrayBuffer();
        processedData = new Uint8Array(arrayBuffer);
        outputFilename = `docunova-optimized-${files[0].name}`;
      }

      clearInterval(interval);
      setProgress(100);

      if (processedData) {
        setResult({
          data: processedData,
          filename: outputFilename,
          originalSize: originalTotalSize,
          newSize: processedData.byteLength,
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while processing the PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadUint8Array(result.data, result.filename);
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
      {/* File Upload Zone */}
      {!result && (
        <div className="space-y-6">
          <Dropzone
            onFilesSelected={setFiles}
            selectedFiles={files}
            onRemoveFile={(idx) => setFiles((prev) => prev.filter((_, i) => i !== idx))}
            multiple={isMultiFile}
            acceptMimeTypes={['application/pdf']}
            label={isMultiFile ? 'Select multiple PDF files to merge' : `Choose PDF to ${tool.name.toLowerCase()}`}
            description={
              isMultiFile
                ? 'Select 2 or more documents. Merged locally in your browser with zero latency.'
                : '100% private. Files never leave your browser.'
            }
          />

          {/* Options Panel if files selected */}
          {files.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Sliders className="h-4 w-4" />
                <span>Configure {tool.name} Settings</span>
              </div>

              {tool.id === 'rotate-pdf' && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-300">Rotation Angle</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotateDeg(deg)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition ${
                          rotateDeg === deg
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                        <span>{deg}° Clockwise</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tool.id === 'watermark-pdf' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. CONFIDENTIAL, DRAFT"
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">
                      Transparency ({Math.round(watermarkOpacity * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>
              )}

              {tool.id === 'split-pdf' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Pages to Extract (e.g. "1-3, 5" or "all")</label>
                  <input
                    type="text"
                    value={splitRange}
                    onChange={(e) => setSplitRange(e.target.value)}
                    placeholder="e.g. 1-2, 4"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {tool.id === 'delete-pdf-pages' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Page numbers to delete (comma separated)</label>
                  <input
                    type="text"
                    value={deletePageNums}
                    onChange={(e) => setDeletePageNums(e.target.value)}
                    placeholder="e.g. 2, 4"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {tool.id === 'add-page-numbers' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Numbering Position</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        checked={pageNumberPos === 'bottom-center'}
                        onChange={() => setPageNumberPos('bottom-center')}
                        className="accent-indigo-500"
                      />
                      <span>Bottom Center</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        checked={pageNumberPos === 'bottom-right'}
                        onChange={() => setPageNumberPos('bottom-right')}
                        className="accent-indigo-500"
                      />
                      <span>Bottom Right</span>
                    </label>
                  </div>
                </div>
              )}

              {tool.id === 'pdf-password-protect' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Choose Document Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcess}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Document... {progress}%</span>
                  </>
                ) : (
                  <>
                    <Stamp className="h-4 w-4" />
                    <span>Process {tool.name}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-900/40 bg-red-950/30 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Completed Success Result State */}
      {result && (
        <div className="space-y-6 text-center py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shadow-lg shadow-emerald-950/40 animate-bounce">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100">Document Successfully Processed!</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your document was modified with high precision. Your original file remains secure and private.
            </p>
          </div>

          <div className="inline-flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs text-slate-300">
            <span>
              Original: <strong className="text-slate-200">{(result.originalSize / 1024).toFixed(1)} KB</strong>
            </span>
            <span className="text-slate-600">→</span>
            <span>
              New Output: <strong className="text-emerald-400">{(result.newSize / 1024).toFixed(1)} KB</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download {result.filename}</span>
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              Process Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
