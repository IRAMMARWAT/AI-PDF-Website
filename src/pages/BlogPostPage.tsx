import { BLOG_POSTS } from '../config/tools';
import { SEOHead } from '../components/seo/SEOHead';
import { ChevronRight, Clock, ArrowLeft, Share2 } from 'lucide-react';

interface BlogPostPageProps {
  postSlug: string;
  onNavigate: (path: string) => void;
}

export function BlogPostPage({ postSlug, onNavigate }: BlogPostPageProps) {
  const post = BLOG_POSTS.find((p) => p.slug === postSlug) || BLOG_POSTS[0];

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'DocuNova AI Research Team',
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title={`${post.title} | DocuNova AI Blog`}
        description={post.excerpt}
        canonicalUrl={`https://docunova.ai/blog/${post.slug}`}
        schema={schemaArticle}
      />

      {/* Back button & breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <button
          onClick={() => onNavigate('/blog')}
          className="flex items-center gap-1 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Blog</span>
        </button>
        <span className="text-indigo-400">{post.category}</span>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-slate-800 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Published on {post.publishedAt}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{post.readTime}</span>
          </span>
          <span>·</span>
          <span>By DocuNova Research</span>
        </div>
      </header>

      {/* Article Markdown Body */}
      <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
        {post.content.map((para: string, idx: number) => {
          if (para.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-bold text-white pt-4 pb-2 border-b border-slate-800/80">
                {para.replace('## ', '')}
              </h2>
            );
          }
          if (para.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-semibold text-slate-100 pt-3">
                {para.replace('### ', '')}
              </h3>
            );
          }
          if (para.startsWith('```')) {
            const lines = para.split('\n');
            const code = lines.slice(1, -1).join('\n');
            return (
              <pre key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-x-auto text-indigo-300">
                <code>{code}</code>
              </pre>
            );
          }
          if (para.startsWith('- ')) {
            const bullets = para.split('\n');
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
                {bullets.map((b: string, bIdx: number) => (
                  <li key={bIdx}>{b.replace(/^- \*\*?/, '').replace(/\*\*?:?$/, '')}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {para}
            </p>
          );
        })}
      </div>

      {/* Share / Try tools CTA */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
        <div>
          <h3 className="text-sm font-semibold text-white">Experience AI Document Chat First-Hand</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test Gemini 2.5 Flash document summarization and Q&A with zero retention.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/tool/chat-with-pdf')}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shrink-0"
        >
          Open Chat Workspace
        </button>
      </div>
    </article>
  );
}
