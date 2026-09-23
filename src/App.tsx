import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { DashboardPage } from './pages/DashboardPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { FaqPage } from './pages/FaqPage';
import { LegalPage } from './pages/LegalPage';
import { ToolCategory } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync state with browser popstate (back/forward buttons)
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Navigation handler
  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Dispatcher
  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />;
    }

    if (currentPath === '/tools') {
      return <AllToolsPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/tool/')) {
      const toolSlug = currentPath.replace('/tool/', '').split('/')[0];
      return <ToolDetailPage toolSlug={toolSlug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/category/')) {
      const catSlug = currentPath.replace('/category/', '').split('/')[0] as ToolCategory;
      return <CategoryPage categoryKey={catSlug} onNavigate={navigate} />;
    }

    if (currentPath === '/dashboard') {
      return <DashboardPage onNavigate={navigate} />;
    }

    if (currentPath === '/pricing') {
      return <PricingPage onNavigate={navigate} />;
    }

    if (currentPath === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/blog/')) {
      const postSlug = currentPath.replace('/blog/', '').split('/')[0];
      return <BlogPostPage postSlug={postSlug} onNavigate={navigate} />;
    }

    if (currentPath === '/faq') {
      return <FaqPage onNavigate={navigate} />;
    }

    if (currentPath === '/privacy-policy') {
      return <LegalPage type="privacy" onNavigate={navigate} />;
    }

    if (currentPath === '/terms-and-conditions') {
      return <LegalPage type="terms" onNavigate={navigate} />;
    }

    if (currentPath === '/disclaimer') {
      return <LegalPage type="disclaimer" onNavigate={navigate} />;
    }

    // Fallback: Default to Home
    return <HomePage onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Quick Search Modal (Cmd+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={(slug) => navigate(`/tool/${slug}`)}
      />
    </div>
  );
}
