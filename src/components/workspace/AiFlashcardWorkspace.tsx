import { useState } from 'react';
import { ToolItem, Flashcard } from '../../types';
import { Dropzone } from '../common/Dropzone';
import { extractTextQuick } from '../../services/pdfService';
import { postJson } from '../../services/apiClient';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Lightbulb,
} from 'lucide-react';

interface AiFlashcardWorkspaceProps {
  tool: ToolItem;
}

export function AiFlashcardWorkspace({ tool }: AiFlashcardWorkspaceProps) {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setIsProcessing(true);
    setError(null);
    try {
      const text = await extractTextQuick(files[0]);
      setInputText(text);
    } catch (err: any) {
      setError('Error reading file: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateCards = async () => {
    if (!inputText.trim()) {
      setError('Please provide text or upload a document.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const data = await postJson<{ flashcards: Flashcard[] }>('/api/ai/flashcards', {
        text: inputText,
        count: 8,
      });

      setFlashcards(data.flashcards || []);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err: any) {
      setError(err.message || 'Error generating cards');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      {flashcards.length === 0 ? (
        <div className="space-y-6 max-w-xl mx-auto">
          <Dropzone
            onFilesSelected={handleFiles}
            selectedFiles={file ? [file] : []}
            onRemoveFile={() => {
              setFile(null);
              setInputText('');
            }}
            multiple={false}
            label="Upload Notes, Syllabus or PDF"
            description="DocuNova AI identifies key definitions, terms, and conceptual questions."
          />

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300">Or Paste Study Material</label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste study material or key formulas..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            disabled={isProcessing || !inputText.trim()}
            onClick={handleGenerateCards}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synthesizing Flashcard Deck...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Create Interactive Flashcards</span>
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
        <div className="max-w-xl mx-auto space-y-6">
          {/* Deck Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                <Shuffle className="h-3 w-3" />
                <span>Shuffle</span>
              </button>
              <button
                onClick={() => setFlashcards([])}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Deck</span>
              </button>
            </div>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative h-72 w-full cursor-pointer rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl transition-all duration-300 hover:border-indigo-500/50 flex flex-col justify-between select-none"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{isFlipped ? 'ANSWER / DEFINITION' : 'QUESTION / CONCEPT'}</span>
              <span className="text-indigo-400">Click card to flip ↺</span>
            </div>

            <div className="flex-1 flex items-center justify-center text-center px-4">
              <p
                className={`transition-all duration-200 leading-relaxed ${
                  isFlipped ? 'text-sm text-slate-200 font-normal' : 'text-lg font-bold text-white'
                }`}
              >
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            {/* Hint bar */}
            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
              {currentCard.hint && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(!showHint);
                  }}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{showHint ? currentCard.hint : 'Show Clue / Hint'}</span>
                </button>
              )}
              <span className="text-[11px] text-slate-400 ml-auto">
                {isFlipped ? 'Answer revealed' : 'Test your recall'}
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              {isFlipped ? 'Show Question' : 'Flip to Answer'}
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-30"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
