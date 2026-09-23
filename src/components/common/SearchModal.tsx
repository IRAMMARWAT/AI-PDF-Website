import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { ALL_TOOLS } from '../../config/tools';
import { ToolItem } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolSlug: string) => void;
}

export function SearchModal({ isOpen, onClose, onSelectTool }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = ALL_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectTool(filtered[selectedIndex].slug);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative flex items-center border-b border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownList}
            placeholder="Search tools, conversions, AI features... (e.g. 'merge', 'quiz', 'ocr')"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="ml-2 hidden sm:inline-block rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No matching tools found for "{query}". Try "merge", "chat", "summarize", or "ocr".
            </div>
          ) : (
            filtered.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.slug);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors ${
                    isSelected ? 'bg-indigo-600/15 border border-indigo-500/30' : 'hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        tool.badge === 'AI Powered'
                          ? 'bg-purple-950/80 text-purple-400 border border-purple-800/40'
                          : 'bg-slate-800 text-indigo-400'
                      }`}
                    >
                      {tool.badge === 'AI Powered' ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100 truncate">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className="text-[10px] text-indigo-300 font-mono">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{tool.shortDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
                      {tool.category.replace('-tools', '').toUpperCase()}
                    </span>
                    <ArrowRight className={`h-4 w-4 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 px-4 py-2.5 text-[11px] text-slate-400">
          <span>
            Showing <strong className="text-slate-300">{filtered.length}</strong> available tools
          </span>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
