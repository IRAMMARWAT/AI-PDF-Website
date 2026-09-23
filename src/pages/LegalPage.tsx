import { SEOHead } from '../components/seo/SEOHead';
import { ShieldCheck, Lock, FileCheck } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'disclaimer';
  onNavigate: (path: string) => void;
}

export function LegalPage({ type, onNavigate }: LegalPageProps) {
  const titles = {
    privacy: 'Privacy Policy & Zero Retention Guarantee',
    terms: 'Terms and Conditions of Service',
    disclaimer: 'Legal & AI Processing Disclaimer',
  };

  const descriptions = {
    privacy: 'How DocuNova AI safeguards document privacy with ephemeral memory processing and strict zero-retention standards.',
    terms: 'Conditions governing the fair use of DocuNova AI services, WebAssembly engines, and APIs.',
    disclaimer: 'Important information regarding generative AI outputs, accuracy disclaimers, and legal document review.',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title={`${titles[type]} | DocuNova AI`}
        description={descriptions[type]}
        canonicalUrl={`https://docunova.ai/${type === 'privacy' ? 'privacy-policy' : type === 'terms' ? 'terms-and-conditions' : 'disclaimer'}`}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 text-xs font-semibold">
        <button
          onClick={() => onNavigate('/privacy-policy')}
          className={`rounded-lg px-3.5 py-1.5 transition ${
            type === 'privacy'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => onNavigate('/terms-and-conditions')}
          className={`rounded-lg px-3.5 py-1.5 transition ${
            type === 'terms'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => onNavigate('/disclaimer')}
          className={`rounded-lg px-3.5 py-1.5 transition ${
            type === 'disclaimer'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Disclaimer
        </button>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">{titles[type]}</h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026 · Version 2.4</p>
      </header>

      {/* Privacy Policy Content */}
      {type === 'privacy' && (
        <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-xs sm:text-sm space-y-6 leading-relaxed">
          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 text-emerald-300 flex items-start gap-3">
            <Lock className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white">Our Core Privacy Commitment:</strong>
              DocuNova AI was engineered from the ground up as a zero-retention platform. Core PDF utilities execute entirely inside your local browser via WebAssembly without sending raw files across the internet. When AI operations (Q&A, summaries, OCR) are invoked, document text is processed in volatile memory and purged automatically within 30 minutes.
            </div>
          </div>

          <h2 className="text-lg font-bold text-white">1. Data Minimization and In-Browser Processing</h2>
          <p>
            Whenever technologically viable, operations are delegated to client-side WebAssembly execution (using libraries such as <code>pdf-lib</code> and <code>jspdf</code>). This ensures your files never traverse external networks for common actions like page merging, splitting, reordering, rotating, and numbering.
          </p>

          <h2 className="text-lg font-bold text-white">2. Ephemeral AI Processing & Auto-Purge Policy</h2>
          <p>
            When you invoke AI capabilities (such as Chat with PDF or AI Summarizer), the document stream is parsed and forwarded to our stateless backend via TLS 1.3 encryption. Data resides solely in temporary RAM workers with an enforced hard TTL (Time-to-Live) of 30 minutes, after which all temporary caches are permanently unlinked and overwritten.
          </p>

          <h2 className="text-lg font-bold text-white">3. Zero Model Training on User Data</h2>
          <p>
            Under no circumstances is customer content, uploaded files, or chat conversation logs utilized to train, retrain, fine-tune, or validate public foundation models (including Gemini or open weights models). Your proprietary intellectual property remains solely yours.
          </p>

          <h2 className="text-lg font-bold text-white">4. GDPR and CCPA Compliance</h2>
          <p>
            We adhere strictly to General Data Protection Regulation (GDPR) standards and California Consumer Privacy Act (CCPA) provisions. Because files are purged dynamically without persistent storage, user documents cannot be subpoenaed or breached from persistent databases.
          </p>
        </div>
      )}

      {/* Terms of Service Content */}
      {type === 'terms' && (
        <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-xs sm:text-sm space-y-6 leading-relaxed">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using DocuNova AI services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
          </p>

          <h2 className="text-lg font-bold text-white">2. Acceptable Use Policy</h2>
          <p>
            You agree not to use DocuNova AI to upload, process, or disseminate:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Any materials infringing on third-party intellectual property or copyright without explicit authorization.</li>
            <li>Malicious software, exploit payloads, or corrupted PDF files designed to disrupt server infrastructure.</li>
            <li>Materials violating regional or international privacy statutes.</li>
          </ul>

          <h2 className="text-lg font-bold text-white">3. Fair Usage & Rate Limits</h2>
          <p>
            Free tier accounts are subject to fair usage limits (such as 20 daily AI inquiries and 50MB file caps) to ensure optimal service availability for all users. Automated scraping or reverse-engineering of endpoints without written enterprise agreements is prohibited.
          </p>
        </div>
      )}

      {/* Disclaimer Content */}
      {type === 'disclaimer' && (
        <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-xs sm:text-sm space-y-6 leading-relaxed">
          <h2 className="text-lg font-bold text-white">1. Artificial Intelligence Accuracy Disclaimer</h2>
          <p>
            DocuNova AI leverages modern Large Language Models (specifically Google Gemini 2.5 Flash) to generate summaries, answers, quizzes, and OCR extractions. While our retrieval-augmented pipelines are engineered to minimize hallucinations by grounding responses in provided document text, generative models may occasionally misinterpret nuances or complex figures.
          </p>

          <h2 className="text-lg font-bold text-white">2. Not Legal, Financial, or Medical Advice</h2>
          <p>
            Outputs generated by DocuNova AI tools (including contract summaries, legal clause checks, invoice extractions, and financial analysis) are provided for informational and productivity purposes only. They do not constitute formal legal, accounting, tax, or medical advice. Always consult a qualified professional before executing binding legal agreements.
          </p>
        </div>
      )}
    </div>
  );
}
