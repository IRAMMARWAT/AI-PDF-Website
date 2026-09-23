import { useState } from 'react';
import { ALL_TOOLS } from '../config/tools';
import { ToolItem } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import { PdfCoreWorkspace } from '../components/workspace/PdfCoreWorkspace';
import { AiChatWorkspace } from '../components/workspace/AiChatWorkspace';
import { AiSummarizeWorkspace } from '../components/workspace/AiSummarizeWorkspace';
import { AiQuizWorkspace } from '../components/workspace/AiQuizWorkspace';
import { AiFlashcardWorkspace } from '../components/workspace/AiFlashcardWorkspace';
import { OcrWorkspace } from '../components/workspace/OcrWorkspace';
import { AiWritingWorkspace } from '../components/workspace/AiWritingWorkspace';
import { ConverterWorkspace } from '../components/workspace/ConverterWorkspace';
import {
  Sparkles,
  FileText,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  Shield,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface ToolDetailPageProps {
  toolSlug: string;
  onNavigate: (path: string) => void;
}

export function ToolDetailPage({ toolSlug, onNavigate }: ToolDetailPageProps) {
  const tool = ALL_TOOLS.find((t) => t.slug === toolSlug) || ALL_TOOLS[0];
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Related tools from the same category or adjacent
  const relatedTools = ALL_TOOLS.filter((t) => t.id !== tool.id && t.category === tool.category).slice(0, 3);

  // Schema.org structured data for SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        operatingSystem: 'All web browsers',
        applicationCategory: 'BusinessApplication',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'HowTo',
        name: `How to use ${tool.name}`,
        step: tool.howToSteps.map((stepText, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          text: stepText,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  const renderWorkspace = () => {
    switch (tool.workspaceType) {
      case 'ai-chat':
        return <AiChatWorkspace tool={tool} />;
      case 'ai-summary':
        return <AiSummarizeWorkspace tool={tool} />;
      case 'ai-quiz':
        return <AiQuizWorkspace tool={tool} />;
      case 'ai-flashcard':
        return <AiFlashcardWorkspace tool={tool} />;
      case 'ocr':
        return <OcrWorkspace tool={tool} />;
      case 'ai-writing':
        return <AiWritingWorkspace tool={tool} />;
      case 'converter':
        return <ConverterWorkspace tool={tool} />;
      case 'pdf-core':
      default:
        return <PdfCoreWorkspace tool={tool} />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEOHead
        title={tool.seoTitle}
        description={tool.metaDesc}
        canonicalUrl={`https://docunova.ai/tool/${tool.slug}`}
        schema={schemaData}
      />

      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-200">
          Home
        </button>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <button onClick={() => onNavigate('/tools')} className="hover:text-slate-200">
          Tools
        </button>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-indigo-400 font-medium truncate">{tool.name}</span>
      </nav>

      {/* Tool Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-300">
          <span className="capitalize">{tool.category.replace('-tools', ' Tools')}</span>
          {tool.badge && (
            <>
              <span>·</span>
              <span className="text-cyan-400 font-semibold">{tool.badge}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          {tool.h1}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {tool.metaDesc}
        </p>
      </div>

      {/* Interactive Live Workspace */}
      <section className="space-y-4">
        {renderWorkspace()}
      </section>

      {/* Step-by-Step How-To Section */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            How to Use {tool.name} (Step-by-Step Guide)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Follow these simple steps to process your document with maximum speed and zero privacy risk.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tool.howToSteps.map((stepText, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2 relative"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-mono text-xs font-bold border border-indigo-600/40">
                0{idx + 1}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{stepText}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features & Technical Specifications */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-200">Core Capabilities</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {tool.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-200">Security & Privacy Assurance</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Zero Document Retention — files purged from RAM automatically.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>TLS 1.3 256-bit encryption for all API streams.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Client-side WebAssembly execution avoids unnecessary file transfers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Stateless AI queries — never used for public model training.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Frequently Asked Questions about {tool.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Everything you need to know about processing limits, security, and formats.</p>
        </div>

        <div className="space-y-2">
          {tool.faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <span className="text-slate-500 font-mono text-sm">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="border-t border-slate-800/80 pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Related Tools You May Need</h3>
            <button
              onClick={() => onNavigate('/tools')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Browse All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {relatedTools.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onNavigate(`/tool/${rel.slug}`)}
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 hover:bg-slate-900/80 transition flex items-center justify-between"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{rel.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{rel.shortDesc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
