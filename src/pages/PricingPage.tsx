import { useState } from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Check, Zap, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const [annualBilling, setAnnualBilling] = useState(true);

  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      desc: 'Essential client-side PDF tools and daily AI document inquiries.',
      features: [
        'Unlimited client-side merges, splits, and rotations',
        '20 daily AI requests (Summarize, Q&A, Chat)',
        'Up to 50MB per document upload',
        '30-minute auto-purge security window',
        'Standard OCR with layout extraction',
        'Community Support',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro Workspace',
      price: annualBilling ? '$9' : '$12',
      period: '/ month',
      desc: 'For researchers, legal counsels, students, and power professionals.',
      features: [
        'Unlimited AI queries powered by Gemini 3 Flash',
        'Up to 500MB per file with multi-doc comparisons',
        'Unlimited Batch OCR and Invoice Table exports',
        'Custom watermark presets & batch signing',
        'Priority low-latency server processing queue',
        'Direct email support with 4-hour SLA',
      ],
      cta: 'Start 7-Day Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise / Team',
      price: annualBilling ? '$24' : '$29',
      period: '/ user / month',
      desc: 'Advanced compliance, SSO, audit trails, and dedicated API access.',
      features: [
        'Everything in Pro Workspace',
        'SAML SSO & Google Workspace centralized auth',
        'Zero-retention BAA & custom security auditing',
        'Dedicated high-throughput REST API key',
        'Role-based access controls & shared team folders',
        '24/7 dedicated engineering account manager',
      ],
      cta: 'Contact Enterprise Sales',
      popular: false,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SEOHead
        title="Transparent Pricing & Plans | DocuNova AI"
        description="Choose the ideal plan for document intelligence, WebAssembly PDF processing, and unlimited AI citations. Start free today."
        canonicalUrl="https://docunova.ai/pricing"
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Core PDF tools are always 100% free and client-side. Upgrade for unlimited AI analysis,
          batch OCR, and commercial limits.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 p-1.5 text-xs text-slate-300">
          <button
            onClick={() => setAnnualBilling(false)}
            className={`rounded-full px-4 py-1.5 transition ${
              !annualBilling ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnualBilling(true)}
            className={`rounded-full px-4 py-1.5 transition flex items-center gap-1 ${
              annualBilling ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 relative ${
              tier.popular
                ? 'border-2 border-indigo-500 bg-slate-900/90 shadow-2xl shadow-indigo-500/10'
                : 'border border-slate-800 bg-slate-950/60 hover:border-slate-700'
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-md">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{tier.desc}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{tier.price}</span>
                <span className="text-xs text-slate-400">{tier.period}</span>
              </div>

              <button
                onClick={() => onNavigate('/tools')}
                className={`w-full rounded-xl py-3 text-xs font-semibold shadow-sm transition ${
                  tier.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30'
                    : 'border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tier.cta}
              </button>

              <div className="border-t border-slate-800/80 pt-6 space-y-3">
                <span className="text-xs font-semibold text-slate-300">Included Features:</span>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-800/50 pt-4 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Encrypted TLS 1.3</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
