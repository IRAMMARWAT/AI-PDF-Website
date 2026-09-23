import { useState } from 'react';
import { ALL_TOOLS, CATEGORY_INFO, BLOG_POSTS } from '../config/tools';
import { ToolCategory } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  FileText,
  Scan,
  MessageSquare,
  FileType,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export function HomePage({ onNavigate, onOpenSearch }: HomePageProps) {
  const [selectedCat, setSelectedCat] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredTools = ALL_TOOLS.filter((t) =>
    ['chat-with-pdf', 'merge-pdf', 'ai-pdf-summarizer', 'ocr-pdf', 'compress-pdf', 'pdf-to-word', 'ai-quiz-generator', 'watermark-pdf'].includes(t.id)
  );

  const displayedTools = ALL_TOOLS.filter((t) => {
    const matchesCat = selectedCat === 'all' || t.category === selectedCat;
    const matchesQuery =
      searchQuery.trim() === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  }).slice(0, 12);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DocuNova AI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All modern web browsers',
    description: 'All-in-one AI and PDF processing suite. Merge, OCR, convert, and chat with documents securely.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="space-y-20 pb-20">
      <SEOHead
        title="DocuNova AI – All-in-One AI & PDF Workspace"
        description="Next-generation PDF editing, intelligent OCR, AI document chat with citations, conversion, and productivity suite. Fast, private, and zero-retention."
        canonicalUrl="https://docunova.ai/"
        schema={structuredData}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] -z-10 pointer-events-none rounded-full" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Release kicker */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-800/60 bg-indigo-950/40 px-3.5 py-1 text-xs text-indigo-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>DocuNova Engine 3.0 — Powered by Gemini 3 Flash</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Transform, Edit & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300">Converse with Documents</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-400 leading-relaxed sm:text-lg">
            Merge, split, compress, and OCR PDFs locally in your browser. Ask questions, generate
            quizzes, and synthesize insights with citation-grounded Document AI.
          </p>

          {/* Quick Search & Filter Bar */}
          <div className="mx-auto max-w-xl pt-2">
            <div className="relative flex items-center rounded-2xl border border-slate-700 bg-slate-900/90 p-1.5 shadow-2xl backdrop-blur-md focus-within:border-indigo-500 transition">
              <Search className="ml-3 h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 60+ PDF & AI tools (e.g. merge, chat, ocr, quiz)..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={onOpenSearch}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition shrink-0"
              >
                Find Tool
              </button>
            </div>
            <div className="mt-2.5 flex items-center justify-center gap-4 text-xs text-slate-500">
              <span>Popular:</span>
              <button onClick={() => onNavigate('/tool/chat-with-pdf')} className="hover:text-indigo-400 text-slate-400">
                Chat with PDF
              </button>
              <span>·</span>
              <button onClick={() => onNavigate('/tool/merge-pdf')} className="hover:text-indigo-400 text-slate-400">
                Merge PDF
              </button>
              <span>·</span>
              <button onClick={() => onNavigate('/tool/ocr-pdf')} className="hover:text-indigo-400 text-slate-400">
                OCR Scan
              </button>
              <span>·</span>
              <button onClick={() => onNavigate('/tool/compress-pdf')} className="hover:text-indigo-400 text-slate-400">
                Compress
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Core Tools Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Featured Workspaces</h2>
            <p className="text-xs text-slate-400 mt-0.5">Most widely used document utilities and AI intelligence tools</p>
          </div>
          <button
            onClick={() => onNavigate('/tools')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>View all 60+ tools</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(`/tool/${tool.slug}`)}
              className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      tool.badge === 'AI Powered'
                        ? 'bg-purple-950/80 text-purple-400 border border-purple-800/40'
                        : 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/40'
                    }`}
                  >
                    {tool.badge === 'AI Powered' ? <Sparkles className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] font-mono font-semibold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/50">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.shortDesc}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400 group-hover:text-indigo-300">
                <span>Launch Tool</span>
                <ArrowRight className="h-3.5 w-3.5 transform transition group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Explorer Tabs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Browse All Categories</h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore modular suites configured for everyday document tasks, academic study, and commercial operations
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCat('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCat === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                All Tools ({ALL_TOOLS.length})
              </button>
              {(Object.keys(CATEGORY_INFO) as ToolCategory[]).slice(0, 4).map((catKey) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setSelectedCat(catKey)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedCat === catKey
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {CATEGORY_INFO[catKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigate(`/tool/${tool.slug}`)}
                className="group cursor-pointer rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition hover:border-slate-700 hover:bg-slate-900/80 flex items-start gap-3.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition truncate">
                      {tool.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {tool.category.replace('-tools', '')}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{tool.shortDesc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('/tools')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
            >
              <span>Explore Complete 60+ Tool Catalog</span>
              <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Engineering Pillars & Zero Retention Assurance */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">Zero Document Retention</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uploaded files are stored only in volatile memory during active processing, then
              automatically destroyed. We maintain no historical backups of your confidential files.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">Client-Side WebAssembly</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard operations like merging, rotating, watermarking, and splitting happen directly
              on your browser thread, delivering instant execution with zero server upload bottleneck.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">Anti-Hallucination RAG</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Document chats, summaries, and quizzes are anchored exclusively in your file context.
              Every claim is attributed with verifiable page references.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Blog Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Document Engineering & Guides</h2>
            <p className="text-xs text-slate-400 mt-0.5">Original research and tutorials on document workflows and AI</p>
          </div>
          <button
            onClick={() => onNavigate('/blog')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>Read all articles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-700 hover:bg-slate-900/70 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="text-indigo-400 font-semibold">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
                <span>Read Guide</span>
                <ArrowRight className="h-3.5 w-3.5 transform transition group-hover:translate-x-1" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
