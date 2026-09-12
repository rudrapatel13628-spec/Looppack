import { useState, useEffect } from 'react';
import { INITIAL_LISTINGS } from './data/mockListings';
import { MOCK_DIGITAL_PASSPORTS } from './data/mockPassport';
import type { Listing, AiMatch, DigitalPassport, GlobalCarbonStats, NotificationItem } from './types';
import { calculateExactCarbonSaved } from './utils/carbonCalculator';
import { getListings, getStats, getLogisticsRoutes, getNotifications } from './services/api';
import { Factory, Building2, Truck, PlusCircle, ShoppingBag, Cpu, ShieldCheck, Loader2 } from 'lucide-react';

// Layout & Navigation Components
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { GlobalStatsBar } from './components/layout/GlobalStatsBar';

// Feature Views
import { LandingPage } from './components/landing/LandingPage';
import { CarbonKpiCards } from './components/dashboard/CarbonKpiCards';
import { CarbonTrendsChart } from './components/dashboard/CarbonTrendsChart';
import { MaterialBreakdownChart } from './components/dashboard/MaterialBreakdownChart';
import { ActivityFeed } from './components/dashboard/ActivityFeed';
import { MarketplaceGrid } from './components/marketplace/MarketplaceGrid';
import { AiMatchmaker } from './components/aimatching/AiMatchmaker';
import { LogisticsVisualizer } from './components/logistics/LogisticsVisualizer';
import { DigitalPassportViewer } from './components/passport/DigitalPassportViewer';

// Modals & UI
import { DigitalPassportModal } from './components/passport/DigitalPassportModal';
import { CreateListingModal } from './components/modals/CreateListingModal';
import { ClaimMaterialModal } from './components/modals/ClaimMaterialModal';
import { Toast } from './components/ui/Toast';
import type { ToastMessage } from './components/ui/Toast';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userRole, setUserRole] = useState<string>('Manufacturer');
  const [listings, setListings] = useState<Listing[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<GlobalCarbonStats>({
    totalCo2AvoidedTons: 0,
    landfillWasteDivertedTons: 0,
    circularEconomyRatePercent: 0,
    totalCostSavingsInr: 0,
    activeListingsCount: 0,
    completedExchangesCount: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_apiError, setApiError] = useState<string | null>(null);

  // Load Initial Data from Backend API
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const [fetchedListings, platformStats, _fetchedRoutes, fetchedNotifs] = await Promise.all([
          getListings(),
          getStats(),
          getLogisticsRoutes(),
          getNotifications()
        ]);

        if (isMounted) {
          if (fetchedListings && fetchedListings.length > 0) {
            setListings(fetchedListings);
          } else {
            setListings(INITIAL_LISTINGS);
          }

          if (platformStats && platformStats.globalCarbonStats) {
            setStats(platformStats.globalCarbonStats);
          }

          if (fetchedNotifs && fetchedNotifs.length > 0) {
            setNotifications(fetchedNotifs);
          }
        }
      } catch (err) {
        console.error('Failed to load initial data from LoopPack Express API:', err);
        if (isMounted) {
          setApiError('Connected with fallback mode (Express API offline or unreachable).');
          setListings(INITIAL_LISTINGS);
          setStats({
            totalCo2AvoidedTons: 1428.5,
            landfillWasteDivertedTons: 842.1,
            circularEconomyRatePercent: 84.6,
            totalCostSavingsInr: 3428000,
            activeListingsCount: INITIAL_LISTINGS.length,
            completedExchangesCount: 124
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modal States
  const [selectedClaimListing, setSelectedClaimListing] = useState<Listing | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<DigitalPassport | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({
      id: Date.now().toString(),
      title,
      message,
      type
    });
  };

  // Interactive Role Switcher Handler
  const handleRoleChange = (newRole: string) => {
    setUserRole(newRole);
    showToast('Role Context Updated', `Switched to ${newRole} view`);

    // Prioritize tab views based on role
    if (newRole === 'Buyer / Recycler') {
      if (activeTab === 'landing') setActiveTab('marketplace');
    } else if (newRole === 'Logistics Fleet') {
      if (activeTab === 'landing') setActiveTab('logistics');
    }
  };

  // Notification Actions
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('Notifications Updated', 'All notifications marked as read.');
  };

  const handleSelectNotification = (notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    setActiveTab(notif.targetTab);
  };

  // 1. Refresh Data Handler connected to Backend API
  const handleRefreshData = async () => {
    try {
      const [freshListings, platformStats] = await Promise.all([
        getListings(),
        getStats()
      ]);
      if (freshListings && freshListings.length > 0) setListings(freshListings);
      if (platformStats && platformStats.globalCarbonStats) setStats(platformStats.globalCarbonStats);
      showToast(
        'Live LoopNet Recalculated',
        'Ingested real-time factory surplus streams from LoopPack Express Backend.'
      );
    } catch {
      setStats((prev) => ({
        ...prev,
        totalCo2AvoidedTons: Math.round((prev.totalCo2AvoidedTons + 14.2) * 10) / 10,
        landfillWasteDivertedTons: Math.round((prev.landfillWasteDivertedTons + 8.5) * 10) / 10,
        totalCostSavingsInr: prev.totalCostSavingsInr + 34000
      }));
      showToast(
        'Live LoopNet Recalculated',
        'Simulated 3 new regional factory surplus streams.'
      );
    }
  };

  // 2. Claim Listing Handler
  const handleClaimListing = (listing: Listing) => {
    setSelectedClaimListing(listing);
  };

  const handleConfirmClaim = (listing: Listing, claimQty: number, logisticsMode: string) => {
    const carbonCalc = calculateExactCarbonSaved(listing.category, claimQty, listing.weightPerUnitKg, listing.distanceKm);
    const co2SavedTons = carbonCalc.netCo2SavedKg / 1000;

    setStats((prev) => ({
      ...prev,
      totalCo2AvoidedTons: Math.round((prev.totalCo2AvoidedTons + co2SavedTons) * 10) / 10,
      completedExchangesCount: prev.completedExchangesCount + 1,
      totalCostSavingsInr: prev.totalCostSavingsInr + Math.round(claimQty * 45)
    }));

    showToast(
      'Surplus Claim Dispatched!',
      `Claimed ${claimQty} ${listing.unit} of ${listing.title} via ${logisticsMode}. Saved ${carbonCalc.netCo2SavedKg.toLocaleString()} kg CO₂e!`
    );
  };

  // 3. AI Match Handler
  const handleAcceptAiMatch = (match: AiMatch) => {
    const co2SavedTons = match.co2SavingsTotalKg / 1000;

    setStats((prev) => ({
      ...prev,
      totalCo2AvoidedTons: Math.round((prev.totalCo2AvoidedTons + co2SavedTons) * 10) / 10,
      completedExchangesCount: prev.completedExchangesCount + 1,
      totalCostSavingsInr: prev.totalCostSavingsInr + match.costSavingsTotalInr
    }));

    showToast(
      'AI Match Accepted & Dispatched!',
      `Assigned EV fleet backhaul to ${match.buyerName}. Saved ${match.co2SavingsTotalKg.toLocaleString()} kg CO₂e!`
    );
    
    setActiveTab('logistics');
  };

  // 4. Logistics Route Dispatch
  const handleDispatchRoute = (routeId: string) => {
    showToast(
      'EV Fleet Route Active!',
      `Route ${routeId} dispatched! Shared backhaul loop active. Saved 325 kg freight CO₂e.`
    );
  };

  // 5. Digital Passport View Trigger
  const handleViewPassport = (listing: Listing) => {
    const passport = MOCK_DIGITAL_PASSPORTS[listing.id] || {
      id: `DMP-${listing.id}`,
      serialNumber: `LP-2026-IN-${listing.category.substring(0, 3).toUpperCase()}-${listing.id}`,
      listingId: listing.id,
      materialName: listing.title,
      quantity: listing.quantity,
      unit: listing.unit,
      originCompany: listing.sellerName,
      manufacturingLocation: listing.cityState,
      rawMaterialSource: listing.compositionPercent,
      recycledContentPercent: 92,
      virginContentPercent: 8,
      carbonFootprintKgPerKg: 0.20,
      netCo2SavedKg: listing.carbonCalc.netCo2SavedKg,
      aiMatchScorePercent: 98,
      recyclabilityRating: '100% Recyclable',
      certifications: ['ISO 14040 Verified', 'FSC Chain-of-Custody Certification'],
      movementHistory: [
        {
          timestamp: '2026-03-10 10:00 IST',
          stage: 'Industrial Surplus Generation',
          actor: listing.sellerName,
          location: listing.cityState,
          verificationHash: '0x99a41b...33e1'
        },
        {
          timestamp: '2026-03-12 03:00 IST',
          stage: 'LoopPack Automated Cryptographic Verification',
          actor: 'LoopPack Network',
          location: listing.cityState,
          verificationHash: '0x33c71a...88f4'
        }
      ],
      qrData: `https://looppack.in/passport/${listing.id}`
    };

    setSelectedPassport(passport);
  };

  // 6. Copy Hash
  const handleCopyHash = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast('Copied to Clipboard', text);
  };

  // 7. Post New Listing
  const handleSubmitListing = (newListing: Listing) => {
    setListings([newListing, ...listings]);
    setStats((prev) => ({
      ...prev,
      activeListingsCount: prev.activeListingsCount + 1
    }));
    showToast(
      'Surplus Listing Published!',
      `Created listing "${newListing.title}" with auto-generated Digital Passport.`
    );
  };

  return (
    <div className="min-h-screen bg-[#020b14] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      
      {/* Top Global Stats Ticker Bar */}
      <GlobalStatsBar stats={stats} onRefreshData={handleRefreshData} />

      {/* Main Header & Role Controls */}
      <Header
        userRole={userRole}
        setUserRole={handleRoleChange}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onNavigateLanding={() => setActiveTab('landing')}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* Sticky Tab Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        
        {/* VIEW 0: LANDING PAGE */}
        {activeTab === 'landing' && (
          <LandingPage
            onEnterPlatform={() => setActiveTab('dashboard')}
            onExploreMarketplace={() => setActiveTab('marketplace')}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* VIEW 1: EXECUTIVE CARBON DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Contextual Role Banner & Quick Actions Bar */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-1">
                  {userRole === 'Manufacturer' && <Factory className="w-3.5 h-3.5 text-emerald-400" />}
                  {userRole === 'Buyer / Recycler' && <Building2 className="w-3.5 h-3.5 text-cyan-400" />}
                  {userRole === 'Logistics Fleet' && <Truck className="w-3.5 h-3.5 text-amber-400" />}
                  <span>ACTIVE ROLE CONTEXT: {userRole.toUpperCase()}</span>
                </div>
                <p className="text-xs text-zinc-400">
                  {userRole === 'Manufacturer' && 'Overview of your published packaging surplus streams, active AI matches, and embodied carbon offsets.'}
                  {userRole === 'Buyer / Recycler' && 'Prioritized procurement cost savings, recovered material inputs, and available marketplace claims.'}
                  {userRole === 'Logistics Fleet' && 'Prioritized EV backhaul route optimization, distance saved, and transport CO₂e reduction.'}
                </p>
              </div>

              {/* Role-Specific Actions Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {userRole === 'Manufacturer' && (
                  <>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Post Surplus Packaging</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-zinc-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      My Listings ({stats.activeListingsCount})
                    </button>
                  </>
                )}

                {userRole === 'Buyer / Recycler' && (
                  <>
                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Explore Materials Marketplace</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('aimatchmaker')}
                      className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-zinc-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AI Matching</span>
                    </button>
                  </>
                )}

                {userRole === 'Logistics Fleet' && (
                  <>
                    <button
                      onClick={() => setActiveTab('logistics')}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Eco-Logistics Routes</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('passports')}
                      className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-zinc-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Material Passports</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic Role KPI Cards Grid */}
            <CarbonKpiCards stats={stats} userRole={userRole} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CarbonTrendsChart />
              </div>
              <div>
                <MaterialBreakdownChart />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityFeed />
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-emerald-900/50 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-100">6-Factor AI Recommendation</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    AI matched <b>2,000 Cardboard Boxes</b> in Pune with Mahindra EV Assembly (<b>96% Match Score</b>).
                  </p>
                </div>
                <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/30 text-xs space-y-1">
                  <span className="text-emerald-300 font-extrabold block">Exact CO₂e Saved: 1,350 kg</span>
                  <span className="text-zinc-400 font-mono text-[11px] block">Formula: (2000×0.9) - (2000×0.2) - 50 = 1350 kg</span>
                </div>
                <button
                  onClick={() => setActiveTab('aimatchmaker')}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  Run 6-Factor AI Matcher
                </button>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: B2B CIRCULAR MATERIALS EXCHANGE */}
        {activeTab === 'marketplace' && (
          <div className="animate-in fade-in duration-300">
            <MarketplaceGrid
              listings={listings}
              onClaim={handleClaimListing}
              onViewPassport={handleViewPassport}
              onTriggerAiMatch={() => {
                setActiveTab('aimatchmaker');
              }}
            />
          </div>
        )}

        {/* VIEW 3: AI MATCHMAKING ENGINE */}
        {activeTab === 'aimatchmaker' && (
          <div className="animate-in fade-in duration-300">
            <AiMatchmaker
              listings={listings}
              onAcceptMatch={handleAcceptAiMatch}
            />
          </div>
        )}

        {/* VIEW 4: ECO-LOGISTICS VISUALIZER */}
        {activeTab === 'logistics' && (
          <div className="animate-in fade-in duration-300">
            <LogisticsVisualizer
              onDispatchRoute={handleDispatchRoute}
            />
          </div>
        )}

        {/* VIEW 5: DIGITAL MATERIAL PASSPORTS */}
        {activeTab === 'passports' && (
          <div className="animate-in fade-in duration-300">
            <DigitalPassportViewer
              onSelectPassport={(passport) => setSelectedPassport(passport)}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-950 py-6 px-4 text-center text-xs text-zinc-500 bg-zinc-950">
        <p className="max-w-7xl mx-auto flex items-center justify-center">
          <span>LoopPack © 2026 — Circular Packaging & Materials Exchange Platform</span>
        </p>
      </footer>

      {/* MODALS */}
      <DigitalPassportModal
        passport={selectedPassport}
        onClose={() => setSelectedPassport(null)}
        onCopyHash={handleCopyHash}
      />

      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitListing={handleSubmitListing}
      />

      <ClaimMaterialModal
        listing={selectedClaimListing}
        onClose={() => setSelectedClaimListing(null)}
        onConfirmClaim={handleConfirmClaim}
      />

      {/* Toast Banner */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
