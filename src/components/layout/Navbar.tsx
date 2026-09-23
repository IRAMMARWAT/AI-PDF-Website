import { useState } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  Menu,
  X,
  Layers,
  ShieldCheck,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export function Navbar({ currentPath, onNavigate, onOpenSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'All Tools', path: '/tools' },
    { name: 'PDF Tools', path: '/category/pdf-tools' },
    { name: 'AI Tools', path: '/category/ai-pdf-tools' },
    { name: 'OCR', path: '/category/ocr-tools' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('/')}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/20">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
              DocuNova <span className="text-indigo-400 font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60">AI</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Action Group */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search 60+ tools...</span>
            <kbd className="rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Chat with PDF CTA */}
          <button
            onClick={() => onNavigate('/tool/chat-with-pdf')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chat with PDF</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white"
            aria-label="Search tools"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3">
            <button
              onClick={() => {
                onNavigate('/tool/chat-with-pdf');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white"
            >
              <Sparkles className="h-4 w-4" />
              <span>Chat with PDF</span>
            </button>
            <button
              onClick={() => {
                onNavigate('/tool/merge-pdf');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 py-2.5 text-xs font-semibold text-slate-200"
            >
              <Layers className="h-4 w-4" />
              <span>Merge PDF</span>
            </button>
          </div>

          <div className="space-y-1 border-t border-slate-800 pt-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <span>{link.name}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encrypted · Zero Document Retention</span>
          </div>
        </div>
      )}
    </header>
  );
}
