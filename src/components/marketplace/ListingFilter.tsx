import React from 'react';
import { Search, Filter, MapPin, Tag } from 'lucide-react';
import type { MaterialCategory } from '../../types';

interface ListingFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedDistance: number;
  setSelectedDistance: (dist: number) => void;
  freeOnly: boolean;
  setFreeOnly: (free: boolean) => void;
}

export const ListingFilter: React.FC<ListingFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDistance,
  setSelectedDistance,
  freeOnly,
  setFreeOnly
}) => {
  const categories: (MaterialCategory | 'All')[] = [
    'All',
    'Cardboard',
    'Wooden Pallets',
    'HDPE Plastics',
    'Steel Drums',
    'Bio-Foam'
  ];

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-emerald-900/50 mb-6 space-y-4">
      
      {/* Top Search & Primary Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surplus materials (e.g. Corrugated Boxes, Euro Pallets, Pune)..."
            className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
          />
        </div>

        <div className="flex items-center space-x-3">
          {/* Distance Radius Dropdown */}
          <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400 hidden sm:inline">Radius:</span>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(Number(e.target.value))}
              className="bg-transparent text-zinc-200 font-bold outline-none cursor-pointer"
            >
              <option value={25} className="bg-zinc-900 text-zinc-200">Within 25 km</option>
              <option value={50} className="bg-zinc-900 text-zinc-200">Within 50 km</option>
              <option value={100} className="bg-zinc-900 text-zinc-200">Within 100 km</option>
              <option value={500} className="bg-zinc-900 text-zinc-200">All India (500 km)</option>
            </select>
          </div>

          {/* Free / Surplus Claim Toggle Pill */}
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              freeOnly
                ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-950/50'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700/80 hover:border-emerald-600'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Free Claims Only</span>
          </button>
        </div>

      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pt-1 scrollbar-none">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-emerald-400" /> Category:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-950'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

    </div>
  );
};
