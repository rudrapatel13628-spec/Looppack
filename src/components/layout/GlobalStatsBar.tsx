import React from 'react';
import { Leaf, Recycle, ShieldCheck, DollarSign, Sparkles } from 'lucide-react';
import type { GlobalCarbonStats } from '../../types';
import { formatINR } from '../../utils/carbonCalculator';

interface GlobalStatsBarProps {
  stats: GlobalCarbonStats;
  onRefreshData: () => void;
}

export const GlobalStatsBar: React.FC<GlobalStatsBarProps> = ({ stats, onRefreshData }) => {
  return (
    <div className="w-full bg-emerald-950/80 border-b border-emerald-800/40 py-2.5 px-4 sm:px-6 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        
        <div className="flex items-center space-x-6 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center space-x-2 text-emerald-300 font-medium whitespace-nowrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Live LoopNet</span>
          </div>

          <div className="flex items-center space-x-1.5 text-zinc-300 whitespace-nowrap">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400">Embodied CO₂ Avoided:</span>
            <span className="font-bold text-emerald-300">{stats.totalCo2AvoidedTons.toLocaleString()} MT</span>
          </div>

          <div className="flex items-center space-x-1.5 text-zinc-300 whitespace-nowrap">
            <Recycle className="w-4 h-4 text-cyan-400" />
            <span className="text-zinc-400">Waste Diverted:</span>
            <span className="font-bold text-cyan-300">{stats.landfillWasteDivertedTons.toLocaleString()} Tons</span>
          </div>

          <div className="flex items-center space-x-1.5 text-zinc-300 whitespace-nowrap">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-zinc-400">Circular Utilization:</span>
            <span className="font-bold text-amber-300">{stats.circularEconomyRatePercent}%</span>
          </div>

          <div className="flex items-center space-x-1.5 text-zinc-300 whitespace-nowrap">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400">Industry Savings:</span>
            <span className="font-bold text-emerald-300">{formatINR(stats.totalCostSavingsInr)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button 
            onClick={onRefreshData}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 border border-emerald-700/50 transition-all cursor-pointer active:scale-95"
            title="Simulate Real-time Network Recalculation"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Simulate Network Refresh</span>
          </button>
        </div>

      </div>
    </div>
  );
};
