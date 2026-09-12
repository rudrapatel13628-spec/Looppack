import React, { useState } from 'react';
import { X, Truck, ArrowRight } from 'lucide-react';
import type { Listing } from '../../types';
import { calculateExactCarbonSaved, formatINR } from '../../utils/carbonCalculator';

interface ClaimMaterialModalProps {
  listing: Listing | null;
  onClose: () => void;
  onConfirmClaim: (listing: Listing, claimQty: number, logisticsMode: string) => void;
}

export const ClaimMaterialModal: React.FC<ClaimMaterialModalProps> = ({
  listing,
  onClose,
  onConfirmClaim
}) => {
  if (!listing) return null;

  const [claimQty, setClaimQty] = useState<number>(listing.quantity);
  const [logisticsMode, setLogisticsMode] = useState<string>('Shared Backhaul Loop');

  const carbonCalc = calculateExactCarbonSaved(
    listing.category,
    claimQty,
    listing.weightPerUnitKg,
    listing.distanceKm
  );
  const totalCostInr = listing.pricePerUnitInr * claimQty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmClaim(listing, claimQty, logisticsMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel-glow w-full max-w-lg rounded-3xl border border-emerald-500/40 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        
        <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-teal-950 px-6 py-5 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-zinc-100">Claim Industrial Packaging</h3>
              <p className="text-xs text-zinc-400 font-medium">
                Reserve material stream & schedule eco-backhaul dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-extrabold">{listing.category}</span>
            <h4 className="text-sm font-extrabold text-zinc-100">{listing.title}</h4>
            <p className="text-xs text-zinc-400">Supplier: <strong className="text-zinc-200">{listing.sellerName}</strong> ({listing.cityState})</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300">Quantity to Claim (Max: {listing.quantity} {listing.unit})</label>
            <input
              type="number"
              min={1}
              max={listing.quantity}
              value={claimQty}
              onChange={(e) => setClaimQty(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300">Select Logistics Mode</label>
            <select
              value={logisticsMode}
              onChange={(e) => setLogisticsMode(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none cursor-pointer"
            >
              <option value="Shared Backhaul Loop" className="bg-zinc-900">Shared Backhaul Loop (Lowest CO₂ - Recommended)</option>
              <option value="Direct EV Courier" className="bg-zinc-900">Direct Commercial EV Courier</option>
              <option value="Buyer Self-Pickup" className="bg-zinc-900">Buyer Self-Pickup</option>
            </select>
          </div>

          <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-500/30 space-y-2 text-xs">
            <div className="flex justify-between items-center text-zinc-300">
              <span>Total Embodied CO₂ Saved:</span>
              <strong className="text-emerald-300 font-extrabold">{carbonCalc.netCo2SavedKg.toLocaleString()} kg CO₂e</strong>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span>Total Material Cost:</span>
              <strong className="text-zinc-100 font-extrabold">
                {totalCostInr === 0 ? 'FREE SURPLUS CLAIM' : formatINR(totalCostInr)}
              </strong>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Confirm & Dispatch Claim</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
