import { BLOG_POSTS } from '../config/tools';
import { SEOHead } from '../components/seo/SEOHead';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

export function BlogPage({ onNavigate }: BlogPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="Engineering & Guides – Document Intelligence Blog | DocuNova AI"
        description="Explore deep-dive technical articles on RAG architectures, zero-retention security, OCR table reconstruction, and modern PDF manipulation."
        canonicalUrl="https://docunova.ai/blog"
      />

      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-mono">
          <BookOpen className="h-4 w-4" />
          <span>DOCUNOVA INSIGHTS</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Document Intelligence & AI Research
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Technical architectures, privacy benchmarks, and productivity playbooks for modern knowledge workers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            onClick={() => onNavigate(`/blog/${post.slug}`)}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-700 hover:bg-slate-900/80 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-indigo-400 font-semibold">{post.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readTime}</span>
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition leading-snug">
                  {post.title}
                </h2>
                <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
              <span>{post.publishedAt}</span>
              <ArrowRight className="h-4 w-4 transform transition group-hover:translate-x-1 text-indigo-400" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
