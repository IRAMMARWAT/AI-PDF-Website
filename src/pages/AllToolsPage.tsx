import { useState } from 'react';
import { ALL_TOOLS, CATEGORY_INFO } from '../config/tools';
import { ToolCategory } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import { Search, Sparkles, FileText, ArrowRight } from 'lucide-react';

interface AllToolsPageProps {
  onNavigate: (path: string) => void;
}

export function AllToolsPage({ onNavigate }: AllToolsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = ALL_TOOLS.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="All PDF & AI Tools – Complete Catalog | DocuNova AI"
        description="Explore 60+ PDF, OCR, and AI document intelligence tools. Merge, split, compress, convert, and chat with documents with zero data retention."
        canonicalUrl="https://docunova.ai/tools"
      />

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          All-in-One Document Tools Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Over 60 dedicated tools engineered for privacy, speed, and intelligence.
        </p>

        {/* Search input */}
        <div className="relative max-w-lg mx-auto pt-3">
          <Search className="absolute left-3.5 top-5.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by keyword (e.g. merge, ocr, translate, quiz)..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none shadow-lg"
          />
        </div>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800/80 pb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Tools ({ALL_TOOLS.length})
        </button>
        {(Object.keys(CATEGORY_INFO) as ToolCategory[]).map((catKey) => {
          const count = ALL_TOOLS.filter((t) => t.category === catKey).length;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                selectedCategory === catKey
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              {CATEGORY_INFO[catKey].name} ({count})
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onNavigate(`/tool/${tool.slug}`)}
            className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    tool.badge === 'AI Powered'
                      ? 'bg-purple-950/80 text-purple-400 border border-purple-800/40'
                      : 'bg-slate-800 text-indigo-400 border border-slate-700/50'
                  }`}
                >
                  {tool.badge === 'AI Powered' ? <Sparkles className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {tool.category.replace('-tools', '').toUpperCase()}
                  </span>
                  {tool.badge && (
                    <span className="text-[10px] text-cyan-300 font-mono font-medium">
                      {tool.badge}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition">
                  {tool.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {tool.shortDesc}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
              <span>Launch</span>
              <ArrowRight className="h-3.5 w-3.5 transform transition group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
