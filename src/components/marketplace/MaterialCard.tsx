import React from 'react';
import type { Listing } from '../../types';
import { MapPin, ShieldCheck, Leaf, Star, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { formatINR } from '../../utils/carbonCalculator';

interface MaterialCardProps {
  listing: Listing;
  onClaim: (listing: Listing) => void;
  onViewPassport: (listing: Listing) => void;
  onTriggerAiMatch: (listing: Listing) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  listing,
  onClaim,
  onViewPassport,
  onTriggerAiMatch
}) => {
  const isFree = listing.pricePerUnitInr === 0;

  return (
    <div className="glass-panel glass-card-hover rounded-2xl border border-emerald-900/40 overflow-hidden flex flex-col justify-between group">
      
      <div>
        {/* Image & Badges */}
        <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-zinc-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
            {listing.category}
          </span>

          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
            {listing.condition}
          </span>

          <div className="absolute bottom-3 left-3">
            {isFree ? (
              <span className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-950 animate-pulse">
                FREE SURPLUS CLAIM
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg text-xs font-black bg-zinc-950/90 text-emerald-300 border border-emerald-500/40 shadow-lg">
                {formatINR(listing.pricePerUnitInr)} <span className="text-[10px] font-normal text-zinc-400">/ {listing.unit.slice(0, -1)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3">
          
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
              <span className="flex items-center space-x-1 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{listing.cityState}</span>
                <span className="text-zinc-500">({listing.distanceKm} km)</span>
              </span>
              <span className="text-zinc-500 font-medium">{listing.postedDate}</span>
            </div>

            <h3 className="text-base font-extrabold text-zinc-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
              {listing.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-900/80 border border-emerald-950 text-xs">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Quantity</span>
              <span className="font-extrabold text-zinc-100 text-sm">
                {listing.quantity.toLocaleString()} <span className="text-xs font-medium text-zinc-400">{listing.unit}</span>
              </span>
            </div>
            <div className="border-l border-emerald-950 pl-2">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-400" /> Net CO₂ Saved
              </span>
              <span className="font-extrabold text-emerald-300 text-sm">
                {listing.carbonCalc.netCo2SavedKg.toLocaleString()} <span className="text-xs font-medium text-emerald-400">kg CO₂e</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/80">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-zinc-300 text-[11px] truncate max-w-[140px]">
                {listing.sellerName}
              </span>
              {listing.verified && (
                <span title="Verified Enterprise">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{listing.sellerRating}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Buttons */}
      <div className="p-4 sm:p-5 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewPassport(listing)}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-emerald-500 text-zinc-300 hover:text-emerald-300 text-xs font-bold transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Passport</span>
          </button>

          <button
            onClick={() => onTriggerAiMatch(listing)}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-cyan-950/60 border border-cyan-700/60 hover:bg-cyan-900/80 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>6-Factor AI Match</span>
          </button>
        </div>

        <button
          onClick={() => onClaim(listing)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
        >
          <span>{isFree ? 'Claim Free Surplus Material' : 'Request Material Quote'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
