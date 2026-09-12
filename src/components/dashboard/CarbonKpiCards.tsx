import React from 'react';
import { Leaf, Recycle, DollarSign, Trees, Car, ArrowUpRight, ShieldCheck, Truck, Scale } from 'lucide-react';
import type { GlobalCarbonStats } from '../../types';
import { calculateEquivalents, formatINR } from '../../utils/carbonCalculator';

interface CarbonKpiCardsProps {
  stats: GlobalCarbonStats;
  userRole: string;
}

export const CarbonKpiCards: React.FC<CarbonKpiCardsProps> = ({ stats, userRole }) => {
  const equivalents = calculateEquivalents(stats.totalCo2AvoidedTons * 1000);

  if (userRole === 'Buyer / Recycler') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* KPI 1: Procurement Cost Savings */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group border-cyan-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center text-cyan-400 text-xs font-bold bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-500/20">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Procurement Saved
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight mb-1">
            {formatINR(stats.totalCostSavingsInr)}
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-3">Material Cost Savings (Recycled vs Virgin)</p>
          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="text-zinc-400">Claimed Batches:</span>
            <span className="font-bold text-cyan-300">{stats.completedExchangesCount} Orders</span>
          </div>
        </div>

        {/* KPI 2: Recycled Input Volume */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              Recycled Inputs
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
            {stats.landfillWasteDivertedTons.toLocaleString()}{' '}
            <span className="text-base font-semibold text-emerald-400">Tons</span>
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-3">Recovered Industrial Packaging Input</p>
          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="text-zinc-400">Landfill Deflected:</span>
            <span className="font-bold text-emerald-300">{equivalents.landfillVolumeM3.toLocaleString()} m³</span>
          </div>
        </div>

        {/* KPI 3: Circular Reuse Index */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group border-amber-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              Buyer Index
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
            {stats.circularEconomyRatePercent}%
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-3">Circular Supply Chain Utilization</p>
          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="text-zinc-400">Virgin Content Replaced:</span>
            <span className="font-bold text-amber-300">High Score</span>
          </div>
        </div>

        {/* KPI 4: Net Embodied Carbon Saved */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group border-teal-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-teal-400 text-xs font-bold bg-teal-500/10 px-2 py-1 rounded-full border border-teal-500/20">
              Scope 3 Target
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
            {stats.totalCo2AvoidedTons.toLocaleString()}{' '}
            <span className="text-base font-semibold text-teal-400">MT CO₂e</span>
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-3">Net Embodied Carbon Avoidance</p>
          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="flex items-center space-x-1">
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              <span><b>{equivalents.treesPlantedEquivalent.toLocaleString()}</b> trees</span>
            </span>
          </div>
        </div>

      </div>
    );
  }

  if (userRole === 'Logistics Fleet') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* KPI 1: Backhaul Utilization */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group border-amber-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              Zero Empty Return
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
            95%
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-3">EV Fleet Backhaul Capacity Utilization</p>
          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="text-zinc-400">Active Loops:</span>
            <span className="font-bold text-amber-300">2 Corridors Active</span>
          </div>
        </div>

        {/* KPI 2: Freight Transport CO2 Saved */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              72.4% Freight Saved
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
            325 <span className="text-base font-semibold text-emerald-400">kg CO₂e</span>
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-3">Freight Transport Emissions Saved / Loop</p>
          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="text-zinc-400">Emissions Deflected:</span>
            <span className="font-bold text-emerald-300">-325 kg CO₂</span>
          </div>
        </div>

        {/* KPI 3: Distance Saved */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group border-cyan-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-cyan-400 text-xs font-bold bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-500/20">
              Route Optimization
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
            145 <span className="text-base font-semibold text-cyan-400">km</span>
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-3">Empty Transit Distance Saved per Loop</p>
          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="text-zinc-400">Linear vs Circular:</span>
            <span className="font-bold text-cyan-300">50% Distance Cut</span>
          </div>
        </div>

        {/* KPI 4: Logistics Cost Avoidance */}
        <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group border-indigo-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-indigo-400 text-xs font-bold bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">
              Backhaul Value
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight mb-1">
            {formatINR(28500)}
          </div>
          <p className="text-xs text-zinc-400 font-medium mb-3">Fuel & Transport Cost Saved / Trip</p>
          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
            <span className="text-zinc-400">Carrier:</span>
            <span className="font-bold text-indigo-300">Mahindra EV Logistics</span>
          </div>
        </div>

      </div>
    );
  }

  // Default: Manufacturer View
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* KPI Card 1: Embodied CO2 Avoided */}
      <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Leaf className="w-20 h-20 text-emerald-400" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.4% YoY
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
          {stats.totalCo2AvoidedTons.toLocaleString()}{' '}
          <span className="text-base font-semibold text-emerald-400">MT CO₂e</span>
        </div>
        <p className="text-xs text-zinc-400 font-medium mb-3">Total Embodied Carbon Saved</p>
        <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
          <span className="flex items-center space-x-1">
            <Trees className="w-3.5 h-3.5 text-emerald-400" />
            <span>Equiv: <b>{equivalents.treesPlantedEquivalent.toLocaleString()}</b> trees</span>
          </span>
          <span className="flex items-center space-x-1">
            <Car className="w-3.5 h-3.5 text-cyan-400" />
            <span><b>{equivalents.carDaysOffRoad.toLocaleString()}</b> car-days</span>
          </span>
        </div>
      </div>

      {/* KPI Card 2: Waste Diverted */}
      <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Recycle className="w-20 h-20 text-cyan-400" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Recycle className="w-5 h-5" />
          </div>
          <span className="flex items-center text-cyan-400 text-xs font-bold bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-500/20">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +24.1% MoM
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
          {stats.landfillWasteDivertedTons.toLocaleString()}{' '}
          <span className="text-base font-semibold text-cyan-400">Tons</span>
        </div>
        <p className="text-xs text-zinc-400 font-medium mb-3">Landfill Waste Diverted</p>
        <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
          <span className="text-zinc-400">Landfill Volume Saved:</span>
          <span className="font-bold text-cyan-300">{equivalents.landfillVolumeM3.toLocaleString()} m³</span>
        </div>
      </div>

      {/* KPI Card 3: Circular Economy Index */}
      <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <ShieldCheck className="w-20 h-20 text-amber-400" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
            Tier-1 Verified
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">
          {stats.circularEconomyRatePercent}%
        </div>
        <p className="text-xs text-zinc-400 font-medium mb-3">Surplus Stream Utilization</p>
        <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
          <span className="text-zinc-400">Virgin Deflection:</span>
          <span className="font-bold text-amber-300">High Impact</span>
        </div>
      </div>

      {/* KPI Card 4: Total Industry Cost Savings */}
      <div className="glass-panel glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <DollarSign className="w-20 h-20 text-emerald-400" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
            Network Value
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight mb-1">
          {formatINR(stats.totalCostSavingsInr)}
        </div>
        <p className="text-xs text-zinc-400 font-medium mb-3">Dispatched Stream Value Recovered</p>
        <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-zinc-300">
          <span className="text-zinc-400">Completed Trades:</span>
          <span className="font-bold text-emerald-300">{stats.completedExchangesCount} Transactions</span>
        </div>
      </div>

    </div>
  );
};
