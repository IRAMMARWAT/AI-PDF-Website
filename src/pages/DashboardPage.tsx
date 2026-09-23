import { useState } from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import {
  Clock,
  ShieldAlert,
  FileText,
  Sparkles,
  Download,
  Trash2,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeFiles, setActiveFiles] = useState([
    {
      id: 'doc-1',
      name: 'Q3_Financial_Analysis_Draft.pdf',
      size: '2.4 MB',
      processedTool: 'Chat with PDF',
      timeRemaining: '24 mins remaining until purge',
      status: 'Ready',
    },
    {
      id: 'doc-2',
      name: 'Vendor_Agreement_Executed.pdf',
      size: '1.1 MB',
      processedTool: 'Merge PDF',
      timeRemaining: '18 mins remaining until purge',
      status: 'Ready',
    },
  ]);

  const [purgedAll, setPurgedAll] = useState(false);

  const handlePurgeAll = () => {
    setActiveFiles([]);
    setPurgedAll(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="User Command Dashboard | DocuNova AI"
        description="Monitor your daily document processing quotas, view ephemeral files with 30-minute auto-purge timers, and manage AI workflows."
        canonicalUrl="https://docunova.ai/dashboard"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Document Operations Dashboard</h1>
            <span className="rounded bg-indigo-950 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-300 border border-indigo-800/50">
              FREE TIER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, ephemeral document lifecycle, and daily AI credits
          </p>
        </div>

        <button
          onClick={handlePurgeAll}
          disabled={activeFiles.length === 0}
          className="flex items-center gap-1.5 rounded-xl border border-red-900/50 bg-red-950/40 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/60 transition disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Purge All Active Files</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily AI Credits</span>
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">18 / 20</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[90%]" />
          </div>
          <span className="text-[10px] text-slate-400">Resets daily at 00:00 UTC</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Client PDF Merges</span>
            <Cpu className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">Unlimited</div>
          <span className="text-[10px] text-emerald-400 font-medium">Local WebAssembly Engine</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Retention Period</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">30 Minutes</div>
          <span className="text-[10px] text-slate-400">Zero-persistence safety auto-purge</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Estimated Time Saved</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">4.2 Hours</div>
          <span className="text-[10px] text-slate-400">Across 14 tasks this week</span>
        </div>
      </div>

      {/* Ephemeral Documents Queue */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Ephemeral Active Files</h3>
            <p className="text-xs text-slate-400">
              Files are automatically purged from system memory when countdown expires.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {activeFiles.length} file{activeFiles.length === 1 ? '' : 's'} active
          </span>
        </div>

        {purgedAll && (
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>All temporary document streams have been securely erased from volatile RAM.</span>
          </div>
        )}

        {activeFiles.length === 0 && !purgedAll ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <FileText className="h-8 w-8 mx-auto text-slate-600" />
            <p>No active documents in memory. All files have been purged.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {activeFiles.map((doc) => (
              <div
                key={doc.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-indigo-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{doc.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {doc.size} · Tool: {doc.processedTool}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400">
                    <Clock className="h-3 w-3" />
                    <span>{doc.timeRemaining}</span>
                  </span>

                  <button
                    onClick={() => onNavigate('/tool/chat-with-pdf')}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
                  >
                    <span>Re-open</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Launchers */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Recommended Next Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            onClick={() => onNavigate('/tool/chat-with-pdf')}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-500/50 hover:bg-slate-900/80 transition flex items-center justify-between"
          >
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Chat with PDF</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Ask questions with page citations</p>
            </div>
            <ArrowRight className="h-4 w-4 text-indigo-400" />
          </div>

          <div
            onClick={() => onNavigate('/tool/merge-pdf')}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-500/50 hover:bg-slate-900/80 transition flex items-center justify-between"
          >
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Merge PDF Files</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Zero latency client-side assembly</p>
            </div>
            <ArrowRight className="h-4 w-4 text-indigo-400" />
          </div>

          <div
            onClick={() => onNavigate('/tool/ai-quiz-generator')}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-500/50 hover:bg-slate-900/80 transition flex items-center justify-between"
          >
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Create Study Quiz</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Turn lecture notes into MCQs</p>
            </div>
            <ArrowRight className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
