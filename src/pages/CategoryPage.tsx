import { ALL_TOOLS, CATEGORY_INFO } from '../config/tools';
import { ToolCategory } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import { Sparkles, FileText, ArrowRight, ChevronRight } from 'lucide-react';

interface CategoryPageProps {
  categoryKey: ToolCategory;
  onNavigate: (path: string) => void;
}

export function CategoryPage({ categoryKey, onNavigate }: CategoryPageProps) {
  const catInfo = CATEGORY_INFO[categoryKey] || CATEGORY_INFO['pdf-tools'];
  const categoryTools = ALL_TOOLS.filter((t) => t.category === categoryKey);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={`${catInfo.name} – Free Online Document Processing | DocuNova AI`}
        description={catInfo.description}
        canonicalUrl={`https://docunova.ai/category/${categoryKey}`}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-200">
          Home
        </button>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <button onClick={() => onNavigate('/tools')} className="hover:text-slate-200">
          Categories
        </button>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-indigo-400 font-medium">{catInfo.name}</span>
      </nav>

      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          {catInfo.name}
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          {catInfo.description}
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onNavigate(`/tool/${tool.slug}`)}
            className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-indigo-400">
                  {tool.badge === 'AI Powered' ? <Sparkles className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                {tool.badge && (
                  <span className="text-[10px] text-cyan-300 font-mono font-medium">
                    {tool.badge}
                  </span>
                )}
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
              <span>Launch Tool</span>
              <ArrowRight className="h-3.5 w-3.5 transform transition group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
