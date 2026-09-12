import React, { useState } from 'react';
import { Cpu, Sparkles, CheckCircle2, RefreshCcw, MapPin, Leaf, Layers, Clock, Tag, Scale } from 'lucide-react';
import type { Listing, AiMatch } from '../../types';
import { calculateExactCarbonSaved, calculateDeterministicAiScore, formatINR } from '../../utils/carbonCalculator';

interface AiMatchmakerProps {
  listings: Listing[];
  onAcceptMatch: (match: AiMatch) => void;
}

export const AiMatchmaker: React.FC<AiMatchmakerProps> = ({ listings, onAcceptMatch }) => {
  const [selectedListingId, setSelectedListingId] = useState<string>(listings[0]?.id || 'LIST-IN-101');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [matches, setMatches] = useState<AiMatch[] | null>(null);

  const selectedListing = listings.find((l) => l.id === selectedListingId) || listings[0];

  const handleRunAiMatch = () => {
    setIsScanning(true);
    setMatches(null);

    setTimeout(() => {
      setIsScanning(false);
      
      const carbonCalc = calculateExactCarbonSaved(
        selectedListing.category,
        selectedListing.quantity,
        selectedListing.weightPerUnitKg,
        selectedListing.distanceKm
      );

      const match1Calc = calculateDeterministicAiScore(98, 95, 96, 92, 94, 100);
      const match2Calc = calculateDeterministicAiScore(92, 88, 90, 85, 86, 95);
      const match3Calc = calculateDeterministicAiScore(85, 82, 84, 80, 78, 90);

      const generatedMatches: AiMatch[] = [
        {
          id: 'MATCH-IN-901',
          listingId: selectedListing.id,
          listingTitle: selectedListing.title,
          buyerName: 'Mahindra EV Assembly Hub',
          buyerType: 'Automotive OEM',
          distanceKm: 14.8,
          matchScorePercent: match1Calc.totalScore,
          factors: match1Calc.factors,
          co2SavingsTotalKg: carbonCalc.netCo2SavedKg,
          costSavingsTotalInr: Math.round(selectedListing.quantity * (selectedListing.pricePerUnitInr === 0 ? 35 : selectedListing.pricePerUnitInr * 1.5)),
          suggestedPricePerUnitInr: selectedListing.pricePerUnitInr === 0 ? 0 : Math.round(selectedListing.pricePerUnitInr * 0.9),
          status: 'Pending',
          logisticsMode: 'Shared Backhaul Loop',
          matchReasoning: [
            '100% FEFCO & ISO material standard compatibility',
            'Saves 1,350 kg CO₂e via local backhaul route',
            'Same-day EV fleet pickup available in Chakan'
          ]
        },
        {
          id: 'MATCH-IN-902',
          listingId: selectedListing.id,
          listingTitle: selectedListing.title,
          buyerName: 'Bajaj Electricals Packaging Depot',
          buyerType: 'Consumer Appliances Mfg',
          distanceKm: 28.2,
          matchScorePercent: match2Calc.totalScore,
          factors: match2Calc.factors,
          co2SavingsTotalKg: Math.round(carbonCalc.netCo2SavedKg * 0.9),
          costSavingsTotalInr: Math.round(selectedListing.quantity * 28),
          suggestedPricePerUnitInr: Math.round(selectedListing.pricePerUnitInr * 0.85),
          status: 'Pending',
          logisticsMode: 'Direct EV Courier',
          matchReasoning: [
            'High volume batch processing match',
            'Verified 100% closed loop recycling compliance'
          ]
        },
        {
          id: 'MATCH-IN-903',
          listingId: selectedListing.id,
          listingTitle: selectedListing.title,
          buyerName: 'Flipkart Bhiwandi Fulfillment Center',
          buyerType: 'E-Commerce Logistics Hub',
          distanceKm: 42.0,
          matchScorePercent: match3Calc.totalScore,
          factors: match3Calc.factors,
          co2SavingsTotalKg: Math.round(carbonCalc.netCo2SavedKg * 0.82),
          costSavingsTotalInr: Math.round(selectedListing.quantity * 22),
          suggestedPricePerUnitInr: selectedListing.pricePerUnitInr,
          status: 'Pending',
          logisticsMode: 'Rail Freight Loop',
          matchReasoning: [
            'Rail freight integration available',
            'Continuous monthly circular packaging demand'
          ]
        }
      ];

      setMatches(generatedMatches);
    }, 1600);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-emerald-950 p-6 rounded-2xl border border-cyan-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Cpu className="w-32 h-32 text-cyan-400" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>EXACT 6-FACTOR AI MATCHMAKING ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100">
            Multi-Weighted AI Circular Matcher
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Matches industrial surplus with optimal regional buyers based on 6 weighted parameters: Material Compatibility (30%), Carbon Benefit (20%), Quantity Fit (15%), Price (15%), Distance (15%), and Availability Time (5%).
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-emerald-900/50 space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          Select Surplus Material Stream for AI Evaluation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {listings.slice(0, 3).map((listing) => {
            const isSelected = listing.id === selectedListingId;
            return (
              <button
                key={listing.id}
                onClick={() => {
                  setSelectedListingId(listing.id);
                  setMatches(null);
                }}
                className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-950/60'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                  <span>{listing.category}</span>
                  <span>{listing.quantity} {listing.unit}</span>
                </div>
                <h4 className="text-xs font-extrabold text-zinc-100 line-clamp-1">{listing.title}</h4>
                <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-500" /> {listing.cityState}
                </p>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs">
            <span className="text-zinc-400">Target Surplus Stream:</span>{' '}
            <strong className="text-zinc-200">{selectedListing.title}</strong>{' '}
            <span className="text-emerald-400">({selectedListing.quantity} {selectedListing.unit})</span>
          </div>

          <button
            onClick={handleRunAiMatch}
            disabled={isScanning}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-950/60 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RefreshCcw className="w-4 h-4 text-zinc-950 animate-spin" />
                <span>Running 6-Factor AI Neural Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>Compute 6-Factor AI Match Scores</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isScanning && (
        <div className="glass-panel p-12 text-center rounded-2xl border border-cyan-500/40 relative overflow-hidden space-y-4">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border border-emerald-500/40"></div>
            <Cpu className="w-10 h-10 text-cyan-400 animate-bounce" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-zinc-100">Evaluating 6 Weighted Match Factors...</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Material Compatibility (30%) • Carbon Benefit (20%) • Quantity Fit (15%) • Price (15%) • Distance (15%) • Availability (5%)
            </p>
          </div>
        </div>
      )}

      {matches && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-zinc-200 flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              AI Match Results ({matches.length} Regional Counterparties Evaluated)
            </h3>
            <span className="text-xs text-cyan-400 font-bold">Weighted Algorithm Output</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="glass-panel glass-card-hover p-5 rounded-2xl border border-emerald-500/40 flex flex-col justify-between space-y-4 relative">
                
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-zinc-950 shadow-md">
                    {match.matchScorePercent}% AI MATCH SCORE
                  </span>
                  <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {match.distanceKm} km
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-zinc-100">{match.buyerName}</h4>
                  <span className="text-xs text-zinc-400 font-medium block mt-0.5">{match.buyerType}</span>

                  <div className="mt-4 p-3 bg-zinc-950/90 rounded-xl border border-emerald-950 space-y-2 text-[11px]">
                    <div className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center justify-between border-b border-emerald-950 pb-1">
                      <span>6 Weighted AI Factors</span>
                      <span>Weight</span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-emerald-400" /> Material Compatibility</span>
                      <span className="font-bold text-emerald-300">{match.factors.materialCompatibilityScore}% <span className="text-zinc-500 font-normal">(30%)</span></span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-cyan-400" /> Carbon Benefit</span>
                      <span className="font-bold text-cyan-300">{match.factors.carbonBenefitScore}% <span className="text-zinc-500 font-normal">(20%)</span></span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="flex items-center gap-1"><Scale className="w-3 h-3 text-amber-400" /> Quantity Fit</span>
                      <span className="font-bold text-amber-300">{match.factors.quantityFitScore}% <span className="text-zinc-500 font-normal">(15%)</span></span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-emerald-400" /> Price Fit</span>
                      <span className="font-bold text-emerald-300">{match.factors.priceScore}% <span className="text-zinc-500 font-normal">(15%)</span></span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" /> Distance Proximity</span>
                      <span className="font-bold text-indigo-300">{match.factors.distanceScore}% <span className="text-zinc-500 font-normal">(15%)</span></span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-pink-400" /> Availability Time</span>
                      <span className="font-bold text-pink-300">{match.factors.availabilityTimeScore}% <span className="text-zinc-500 font-normal">(5%)</span></span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-zinc-900/80 rounded-xl space-y-1 text-xs border border-zinc-800">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Net CO₂ Reduction:</span>
                      <span className="font-bold text-emerald-400">{match.co2SavingsTotalKg.toLocaleString()} kg CO₂e</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Estimated Cost Saved:</span>
                      <span className="font-bold text-amber-300">{formatINR(match.costSavingsTotalInr)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onAcceptMatch(match)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Accept AI Match & Dispatch</span>
                </button>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
