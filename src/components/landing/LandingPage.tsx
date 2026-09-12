import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Cpu, 
  Truck, 
  ShieldCheck, 
  PlusCircle, 
  RefreshCw, 
  BarChart3, 
  PackageCheck 
} from 'lucide-react';

interface LandingPageProps {
  onEnterPlatform: () => void;
  onExploreMarketplace: () => void;
  onOpenCreateModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterPlatform,
  onExploreMarketplace,
  onOpenCreateModal
}) => {
  const featureCards = [
    {
      id: 'feat-1',
      title: 'B2B Materials Marketplace',
      subtitle: 'Circular Packaging Exchange',
      description: 'List, browse, and claim verified surplus cardboard, HDPE plastics, wooden Euro-pallets, steel drums, and bio-foam across industrial corridors.',
      icon: ShoppingBag,
      color: 'emerald',
      badge: 'Active Exchange',
      ctaText: 'Browse Marketplace',
      action: onExploreMarketplace
    },
    {
      id: 'feat-2',
      title: 'AI Matching Engine',
      subtitle: '6-Factor Neural Matcher',
      description: 'Autonomous algorithm evaluating Material Compatibility (30%), Carbon Benefit (20%), Quantity Fit (15%), Price (15%), Distance (15%), and Availability (5%).',
      icon: Cpu,
      color: 'cyan',
      badge: 'Multi-Weighted AI',
      ctaText: 'Run AI Matcher',
      action: onEnterPlatform
    },
    {
      id: 'feat-3',
      title: 'Green Logistics',
      subtitle: 'Backhaul Route Optimizer',
      description: 'Eliminate empty truck return trips by scheduling shared commercial EV backhaul loops — cutting transport Scope 3 emissions by up to 72%.',
      icon: Truck,
      color: 'indigo',
      badge: 'Zero Empty Miles',
      ctaText: 'View Logistics',
      action: onEnterPlatform
    },
    {
      id: 'feat-4',
      title: 'Carbon Intelligence',
      subtitle: 'Digital Material Passports',
      description: 'ISO-14040 lifecycle verification with cryptographic chain-of-custody movement history, QR auditing, and exact CO₂e offset formulas.',
      icon: ShieldCheck,
      color: 'amber',
      badge: 'ISO-14040 Verified',
      ctaText: 'Inspect Passports',
      action: onEnterPlatform
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'LIST',
      icon: PlusCircle,
      description: 'Manufacturers list industrial surplus packaging. Instant formula preview computes exact CO₂e offset and generates a Digital Material Passport.'
    },
    {
      step: '02',
      title: 'MATCH',
      icon: Cpu,
      description: '6-Factor AI algorithm scans regional buyer demand networks to find optimal high-score circular stream matches.'
    },
    {
      step: '03',
      title: 'OPTIMIZE',
      icon: Truck,
      description: 'Eco-Logistics plans shared EV backhaul routes, calculating linear vs circular distance and transport carbon reduction.'
    },
    {
      step: '04',
      title: 'DELIVER',
      icon: PackageCheck,
      description: 'Automated fleet dispatch with QR code chain-of-custody tracking along the Indian freight corridors.'
    },
    {
      step: '05',
      title: 'MEASURE',
      icon: BarChart3,
      description: 'Executive dashboard logs verified embodied carbon avoidance, landfill volume diverted, and ESG Scope 3 metrics.'
    }
  ];

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-300">
      
      {/* HERO SECTION */}
      <section className="relative glass-panel p-8 sm:p-14 rounded-3xl border border-emerald-500/30 overflow-hidden text-center space-y-8">
        
        {/* Glow Effects Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Hero Top Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>AI-POWERED CIRCULAR CARBON ECOSYSTEM</span>
        </div>

        {/* Main Headline & Subtitle */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-100 leading-tight">
            Turn Packaging Waste Into{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
              Business Value.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed">
            AI-powered circular exchange for packaging, materials and carbon-aware logistics.
          </p>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onEnterPlatform}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-950/80 border border-emerald-300/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center space-x-3 group"
          >
            <span>Enter Platform</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-zinc-950" />
          </button>

          <button
            onClick={onExploreMarketplace}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-emerald-300 font-bold text-sm sm:text-base rounded-2xl border border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span>Explore Marketplace</span>
          </button>
        </div>

        {/* Quick Impact Stats Banner */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-emerald-900/50 max-w-4xl mx-auto text-left">
          <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-emerald-950">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">CO₂ Avoided</span>
            <span className="text-xl font-extrabold text-emerald-300">1,428.5 MT</span>
          </div>

          <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-emerald-950">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Waste Diverted</span>
            <span className="text-xl font-extrabold text-cyan-300">842.1 Tons</span>
          </div>

          <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-emerald-950">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Circular Rate</span>
            <span className="text-xl font-extrabold text-amber-300">84.6%</span>
          </div>

          <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-emerald-950">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Industry Savings</span>
            <span className="text-xl font-extrabold text-emerald-300">₹34.2 Lakh</span>
          </div>
        </div>

      </section>

      {/* FEATURE CARDS SECTION */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Core Platform Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            End-to-end circular ecosystem connecting industrial buyers, sellers, recyclers, and electric backhaul fleets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id} 
                className="glass-panel glass-card-hover p-6 rounded-2xl border border-emerald-900/40 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-900 text-emerald-300 border border-emerald-500/30">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">{card.subtitle}</span>
                    <h3 className="text-lg font-extrabold text-zinc-100 group-hover:text-emerald-300 transition-colors mt-0.5">{card.title}</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{card.description}</p>
                  </div>
                </div>

                <button
                  onClick={card.action}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-emerald-500 text-zinc-200 hover:text-emerald-300 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>{card.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* CIRCULAR WORKFLOW SECTION (LIST -> MATCH -> OPTIMIZE -> DELIVER -> MEASURE) */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-900/50 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>THE LOOPPACK CIRCULAR WORKFLOW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
              5-Step Closed-Loop Lifecycle
            </h2>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm rounded-xl shadow transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-zinc-950" />
            <span>Post Surplus Stream</span>
          </button>
        </div>

        {/* Workflow Steps Horizontal Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {workflowSteps.map((stepItem) => {
            const Icon = stepItem.icon;
            return (
              <div key={stepItem.step} className="p-5 bg-zinc-950/80 rounded-2xl border border-zinc-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                      STEP {stepItem.step}
                    </span>
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-300 transition-colors" />
                  </div>
                  <h3 className="text-base font-extrabold text-zinc-100 tracking-tight">{stepItem.title}</h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{stepItem.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* CTA BOTTOM BANNER */}
      <section className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-cyan-950 p-8 sm:p-12 rounded-3xl border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl font-black text-zinc-100">Ready to Exchange Surplus Packaging?</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Join leading manufacturers across Pune, Bengaluru, Chennai, and Mumbai in cutting embodied packaging carbon and logistics costs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onEnterPlatform}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Enter Executive Dashboard</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </button>
        </div>
      </section>

    </div>
  );
};
