import React, { useState } from 'react';
import type { Listing } from '../../types';
import { ListingFilter } from './ListingFilter';
import { MaterialCard } from './MaterialCard';
import { PackageX, Sparkles, ShoppingBag } from 'lucide-react';

interface MarketplaceGridProps {
  listings: Listing[];
  onClaim: (listing: Listing) => void;
  onViewPassport: (listing: Listing) => void;
  onTriggerAiMatch: (listing: Listing) => void;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  listings,
  onClaim,
  onViewPassport,
  onTriggerAiMatch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistance, setSelectedDistance] = useState<number>(500);
  const [freeOnly, setFreeOnly] = useState<boolean>(false);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || listing.category === selectedCategory;

    const matchesDistance = listing.distanceKm <= selectedDistance;

    const matchesFree = !freeOnly || listing.pricePerUnitInr === 0;

    return matchesSearch && matchesCategory && matchesDistance && matchesFree;
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-zinc-900 to-cyan-950 p-6 rounded-2xl border border-emerald-800/40">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            B2B Circular Materials Exchange
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Browse verified industrial surplus packaging (cardboard, HDPE, pallets, steel drums) available across Indian manufacturing hubs.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">{filteredListings.length} Active Exchange Listings</span>
        </div>
      </div>

      <ListingFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDistance={selectedDistance}
        setSelectedDistance={setSelectedDistance}
        freeOnly={freeOnly}
        setFreeOnly={setFreeOnly}
      />

      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <MaterialCard
              key={listing.id}
              listing={listing}
              onClaim={onClaim}
              onViewPassport={onViewPassport}
              onTriggerAiMatch={onTriggerAiMatch}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl border border-emerald-900/40 space-y-3">
          <PackageX className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">No surplus listings match your filters</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Try adjusting your search criteria, clearing the "Free Claims" toggle, or widening your distance radius.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDistance(500);
              setFreeOnly(false);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
