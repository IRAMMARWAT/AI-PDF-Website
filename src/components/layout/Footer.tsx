import { FileText, Shield, Lock, Zap, Clock, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      {/* Security & Reliability Banner */}
      <div className="border-b border-slate-900/80 bg-slate-900/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-950/60 p-2.5 text-emerald-400 border border-emerald-800/40">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Zero Retention Policy</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Files are processed client-side or automatically purged from RAM within 30 minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-indigo-950/60 p-2.5 text-indigo-400 border border-indigo-800/40">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">WebAssembly Core</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Essential PDF merges, rotations, and splits run in-browser with zero upload latency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-950/60 p-2.5 text-purple-400 border border-purple-800/40">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">No Model Training</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Your confidential documents and questions are never used to train public AI models.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-950/60 p-2.5 text-amber-400 border border-amber-800/40">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">High-Availability API</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Powered by Gemini 2.5 Flash for sub-second responses and verified citations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Col 1: Brand & Identity */}
          <div className="col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('/')}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                DocuNova <span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              The high-performance, privacy-conscious all-in-one document intelligence platform.
              Manipulate, convert, OCR, and converse with documents without compromising proprietary data.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Systems Operational
              </span>
              <span className="text-xs text-slate-400">v2.4.0 Engine</span>
            </div>
          </div>

          {/* Col 2: Core PDF Tools */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200">PDF Tools</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/tool/merge-pdf')} className="hover:text-indigo-400 transition">
                  Merge PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/split-pdf')} className="hover:text-indigo-400 transition">
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/compress-pdf')} className="hover:text-indigo-400 transition">
                  Compress PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/rotate-pdf')} className="hover:text-indigo-400 transition">
                  Rotate PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/watermark-pdf')} className="hover:text-indigo-400 transition">
                  Watermark PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/sign-pdf')} className="hover:text-indigo-400 transition">
                  Sign PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/pdf-password-protect')} className="hover:text-indigo-400 transition">
                  Protect PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: AI & OCR Tools */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200">AI & OCR</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/tool/chat-with-pdf')} className="hover:text-indigo-400 transition">
                  Chat with PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/ai-pdf-summarizer')} className="hover:text-indigo-400 transition">
                  AI Summarizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/ai-quiz-generator')} className="hover:text-indigo-400 transition">
                  Quiz & MCQ Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/ai-flashcard-generator')} className="hover:text-indigo-400 transition">
                  AI Flashcards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/ocr-pdf')} className="hover:text-indigo-400 transition">
                  Scanned PDF OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tool/invoice-ocr')} className="hover:text-indigo-400 transition">
                  Invoice & Receipt OCR
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Legal */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Company & Trust</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/blog')} className="hover:text-indigo-400 transition">
                  Engineering Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-indigo-400 transition">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pricing')} className="hover:text-indigo-400 transition">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-indigo-400 transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms-and-conditions')} className="hover:text-indigo-400 transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/disclaimer')} className="hover:text-indigo-400 transition">
                  Legal Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DocuNova AI. All rights reserved. Original document workspace.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-slate-400">
              Privacy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/terms-and-conditions')} className="hover:text-slate-400">
              Terms
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/faq')} className="hover:text-slate-400">
              Security Notice
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
