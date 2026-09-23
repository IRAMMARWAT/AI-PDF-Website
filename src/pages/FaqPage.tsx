import { useState } from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { HelpCircle, ChevronDown, ShieldCheck, Zap, Lock } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (path: string) => void;
}

export function FaqPage({ onNavigate }: FaqPageProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are my uploaded documents safe and private?',
      a: 'Yes, 100%. Standard PDF operations (merging, splitting, rotating, watermarking, text-to-pdf) run entirely inside your browser using client-side WebAssembly. For AI operations (Chat, Summaries, OCR), text streams are transmitted over TLS 1.3 encryption to volatile RAM workers, processed, and purged automatically within 30 minutes. We never use user documents to train public AI models.',
    },
    {
      q: 'What is the maximum file size limit?',
      a: 'On the free tier, you can process documents up to 50MB each. Pro tier workspaces unlock uploads up to 500MB with multi-document comparative synthesis.',
    },
    {
      q: 'Which AI model powers DocuNova AI?',
      a: 'DocuNova AI is powered directly by Google Gemini 2.5 Flash, providing sub-second inference speeds, extensive multi-page context windows, and verifiable citation anchors.',
    },
    {
      q: 'Can DocuNova extract text from scanned images and photos?',
      a: 'Yes! Our OCR suite handles scanned PDFs, camera photos, receipts, and invoices. It extracts tabular data into formatted grids, CSV, and markdown tables.',
    },
    {
      q: 'Do I need to install any software or browser extensions?',
      a: 'No. DocuNova AI is a pure web application compatible with all modern browsers (Chrome, Edge, Safari, Firefox) on desktop, tablet, and mobile devices.',
    },
    {
      q: 'Is there a free trial for Pro features?',
      a: 'Yes! You can explore all standard features completely free without a credit card. Upgrading to Pro gives you a 7-day trial with unlimited AI processing and priority queues.',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEOHead
        title="Frequently Asked Questions (FAQ) | DocuNova AI"
        description="Find answers to common questions regarding document security, privacy, client-side PDF processing, and AI features."
        canonicalUrl="https://docunova.ai/faq"
      />

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-mono">
          <HelpCircle className="h-4 w-4" />
          <span>HELP & KNOWLEDGE BASE</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Clear answers about security, document processing, limits, and AI technology.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-slate-200 hover:text-indigo-400 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-center space-y-3">
        <h3 className="text-sm font-semibold text-white">Still have questions?</h3>
        <p className="text-xs text-slate-400">
          Our engineering team is available 24/7 to address enterprise security queries and custom integrations.
        </p>
        <button
          onClick={() => onNavigate('/tools')}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
        >
          Explore All Tools
        </button>
      </div>
    </div>
  );
}
