import { useState } from 'react';
import { ToolItem, QuizQuestion } from '../../types';
import { Dropzone } from '../common/Dropzone';
import { extractTextQuick } from '../../services/pdfService';
import { postJson } from '../../services/apiClient';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Loader2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface AiQuizWorkspaceProps {
  tool: ToolItem;
}

export function AiQuizWorkspace({ tool }: AiQuizWorkspaceProps) {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
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

  const handleGenerateQuiz = async () => {
    if (!inputText.trim()) {
      setError('Please provide document text or upload study materials.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setShowResults(false);
    setUserAnswers({});

    try {
      const data = await postJson<{ quiz: QuizQuestion[] }>('/api/ai/quiz', {
        text: inputText,
        questionCount: 5,
        difficulty: 'medium',
      });

      setQuizQuestions(data.quiz || []);
    } catch (err: any) {
      setError(err.message || 'Error generating quiz');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (showResults) return;
    setUserAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answerIndex) score++;
    });
    return score;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
      {quizQuestions.length === 0 ? (
        <div className="space-y-6 max-w-xl mx-auto">
          <Dropzone
            onFilesSelected={handleFiles}
            selectedFiles={file ? [file] : []}
            onRemoveFile={() => {
              setFile(null);
              setInputText('');
            }}
            multiple={false}
            label="Upload Lecture Slides, Chapter, or Notes"
            description="DocuNova AI generates multiple-choice questions with verified answer keys."
          />

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300">Or Paste Study Material</label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste textbook sections, definitions, or lecture transcription..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            disabled={isProcessing || !inputText.trim()}
            onClick={handleGenerateQuiz}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Formulating Practice Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Interactive Quiz</span>
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
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Quiz Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Practice Exam & Review</h3>
              <p className="text-xs text-slate-400">
                {quizQuestions.length} Questions · Answer each question below
              </p>
            </div>
            <button
              onClick={() => {
                setQuizQuestions([]);
                setUserAnswers({});
                setShowResults(false);
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>New Quiz</span>
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {quizQuestions.map((q, qIdx) => {
              const selectedOpt = userAnswers[qIdx];
              return (
                <div
                  key={qIdx}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4"
                >
                  <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                    <span className="text-indigo-400 font-mono mr-2">{qIdx + 1}.</span>
                    {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      const isCorrect = q.answerIndex === optIdx;

                      let optStyle = 'border-slate-800 bg-slate-900/70 hover:border-slate-700 text-slate-300';
                      if (showResults) {
                        if (isCorrect) {
                          optStyle = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200';
                        } else if (isChosen && !isCorrect) {
                          optStyle = 'border-red-500/60 bg-red-950/30 text-red-200';
                        }
                      } else if (isChosen) {
                        optStyle = 'border-indigo-500 bg-indigo-950/40 text-white font-medium';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={showResults}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full flex items-center justify-between rounded-lg border p-3 text-xs text-left transition ${optStyle}`}
                        >
                          <span>{opt}</span>
                          {showResults && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                          {showResults && isChosen && !isCorrect && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300 flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300 font-medium">Explanation: </strong>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action / Submit bar */}
          {!showResults ? (
            <button
              type="button"
              onClick={() => setShowResults(true)}
              disabled={Object.keys(userAnswers).length < quizQuestions.length}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition disabled:opacity-50"
            >
              Submit Quiz & Check Score ({Object.keys(userAnswers).length}/{quizQuestions.length} Answered)
            </button>
          ) : (
            <div className="rounded-xl border border-indigo-900/50 bg-indigo-950/30 p-5 text-center space-y-2">
              <span className="text-xs text-indigo-300 uppercase tracking-wider font-semibold">
                Test Results
              </span>
              <h4 className="text-2xl font-black text-white">
                Score: {calculateScore()} / {quizQuestions.length} ({Math.round((calculateScore() / quizQuestions.length) * 100)}%)
              </h4>
              <p className="text-xs text-slate-400">
                Review the rationale and explanations for each question above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
