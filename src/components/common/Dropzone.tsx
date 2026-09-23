import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  multiple?: boolean;
  acceptMimeTypes?: string[];
  maxFileSizeMB?: number;
  label?: string;
  description?: string;
}

export function Dropzone({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
  multiple = false,
  acceptMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'],
  maxFileSizeMB = 50,
  label = 'Choose files or drag & drop',
  description = 'Supports PDF, Word, Images, and Text files up to 50MB. Processed client-side.',
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndAdd = (newFiles: FileList | File[]) => {
    setErrorMessage(null);
    const valid: File[] = [];
    const filesArray = Array.from(newFiles);

    for (const file of filesArray) {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the maximum allowed size of ${maxFileSizeMB}MB.`);
        continue;
      }
      valid.push(file);
    }

    if (valid.length > 0) {
      if (multiple) {
        onFilesSelected([...selectedFiles, ...valid]);
      } else {
        onFilesSelected([valid[0]]);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      validateAndAdd(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAdd(e.target.files);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-950/20 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          accept={acceptMimeTypes.join(',')}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 shadow-inner mb-4">
          <UploadCloud className="h-7 w-7" />
        </div>

        <h3 className="text-base font-semibold text-slate-100">{label}</h3>
        <p className="mt-1 max-w-sm text-xs text-slate-400">{description}</p>

        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition">
            Browse Computer
          </span>
          <span className="text-[11px] text-slate-400">or paste clipboard (Ctrl+V)</span>
        </div>
      </div>

      {/* Error Message if any */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
            <span>Selected Files ({selectedFiles.length})</span>
            {multiple && (
              <span className="text-[11px] text-slate-400 font-normal">
                Files will be processed in the listed order
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-indigo-400">
                    <File className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || 'Document'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(idx);
                  }}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
