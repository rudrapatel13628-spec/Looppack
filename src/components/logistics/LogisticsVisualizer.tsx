import React, { useState, useEffect } from 'react';
import { Truck, Navigation, Play, Pause, RotateCcw } from 'lucide-react';
import type { LogisticsRoute } from '../../types';
import { MOCK_LOGISTICS_ROUTES } from '../../data/mockRoutes';
import { formatINR } from '../../utils/carbonCalculator';

interface LogisticsVisualizerProps {
  onDispatchRoute: (routeId: string) => void;
}

export const LogisticsVisualizer: React.FC<LogisticsVisualizerProps> = ({ onDispatchRoute }) => {
  const [selectedRoute, setSelectedRoute] = useState<LogisticsRoute>(MOCK_LOGISTICS_ROUTES[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(35);

  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 5;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setProgressPercent(0);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-indigo-950 p-6 rounded-2xl border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-3">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CIRCULAR LOGISTICS & BACKHAUL ROUTE OPTIMIZATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100">
            Traditional vs LoopPack Route Comparison
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Compare empty linear freight return trips against LoopPack's circular pickup loops to optimize distance, transport emissions, cost savings, and backhaul utilization.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedRoute.id}
            onChange={(e) => {
              const r = MOCK_LOGISTICS_ROUTES.find((item) => item.id === e.target.value);
              if (r) setSelectedRoute(r);
            }}
            className="bg-zinc-900 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none cursor-pointer"
          >
            {MOCK_LOGISTICS_ROUTES.map((route) => (
              <option key={route.id} value={route.id} className="bg-zinc-900 text-zinc-200">
                {route.routeName} ({route.totalDistanceKm} km)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Route Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Animated Interactive Route Diagram */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-emerald-900/50 flex flex-col justify-between space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-extrabold text-zinc-100">{selectedRoute.routeName}</h3>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              {selectedRoute.vehicleType}
            </span>
          </div>

          {/* Node Route Canvas */}
          <div className="relative bg-zinc-950/90 rounded-2xl border border-zinc-800/80 p-8 flex flex-col justify-center items-center min-h-[280px] overflow-hidden">
            
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Simulated Animated EV Truck */}
            <div 
              className="absolute top-12 transition-all duration-300 z-20 flex items-center space-x-1"
              style={{ left: `${Math.max(10, Math.min(85, progressPercent))}%` }}
            >
              <div className="p-2 bg-emerald-500 text-zinc-950 rounded-xl shadow-lg shadow-emerald-500/50 animate-bounce">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black bg-zinc-900 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/40 whitespace-nowrap shadow-md">
                EV Backhaul ({progressPercent}%)
              </span>
            </div>

            {/* Connecting Vector */}
            <div className="w-full relative flex items-center justify-between my-8 z-10">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-zinc-800 rounded-full"></div>
              <div 
                className="absolute left-6 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent * 0.85}%` }}
              ></div>

              {/* Waypoints */}
              {selectedRoute.nodes.map((node, index) => {
                const isPassed = progressPercent >= ((index + 1) / selectedRoute.nodes.length) * 100;
                return (
                  <div key={node.id} className="relative z-10 flex flex-col items-center group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all border ${
                      isPassed
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-950'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs font-bold text-zinc-200 block max-w-[110px] truncate">{node.name}</span>
                      <span className="text-[10px] text-zinc-400 block">{node.address}</span>
                      <span className="text-[9px] text-emerald-400 font-semibold block">{node.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-emerald-950">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-zinc-950" />}
                <span>{isSimulating ? 'Pause Dispatch' : 'Simulate Fleet Route'}</span>
              </button>

              <button
                onClick={handleResetSimulation}
                className="p-2 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-emerald-400 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <span className="text-zinc-400">
                Backhaul Utilization: <strong className="text-emerald-300 font-extrabold">{selectedRoute.backhaulOpportunityPercent}%</strong>
              </span>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Traditional vs LoopPack Comparison */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-900/50 flex flex-col justify-between space-y-4">
          
          <div>
            <h3 className="text-base font-extrabold text-zinc-100 mb-1">Route Metrics & Carbon Comparison</h3>
            <p className="text-xs text-zinc-400">Traditional Linear vs LoopPack Circular</p>
          </div>

          <div className="space-y-3">
            
            {/* Traditional Unoptimized Route */}
            <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-red-400 tracking-wider">Traditional Linear Route</span>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Total Distance:</span>
                <span className="text-red-400 font-bold">{selectedRoute.linearRouteDistanceKm} km</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Transport Emissions:</span>
                <span className="text-red-400 font-bold">{selectedRoute.linearEmissionsKg} kg CO₂e</span>
              </div>
            </div>

            {/* LoopPack Optimized Route */}
            <div className="p-3.5 bg-emerald-950/80 rounded-xl border border-emerald-500/40 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">LoopPack Circular Route</span>
              <div className="flex justify-between items-center text-emerald-300">
                <span>Total Distance:</span>
                <span className="font-extrabold text-emerald-300">{selectedRoute.totalDistanceKm} km</span>
              </div>
              <div className="flex justify-between items-center text-emerald-300">
                <span>Distance Saved:</span>
                <span className="font-extrabold text-cyan-300">{selectedRoute.distanceSavedKm} km</span>
              </div>
              <div className="flex justify-between items-center text-emerald-300">
                <span>Transport Emissions:</span>
                <span className="font-extrabold text-emerald-300">{selectedRoute.loopEmissionsKg} kg CO₂e</span>
              </div>
            </div>

            {/* Net Savings Box */}
            <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/50 text-center space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black block">Net Freight Savings</span>
              <span className="text-2xl font-black text-emerald-300 block">{selectedRoute.emissionsSavedKg} kg CO₂e Saved</span>
              <span className="text-xs font-bold text-amber-300 block">Cost Saved: {formatINR(selectedRoute.estimatedCostSavedInr)}</span>
            </div>

          </div>

          <button
            onClick={() => onDispatchRoute(selectedRoute.id)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <Truck className="w-4 h-4 text-zinc-950" />
            <span>Confirm Route & Dispatch Fleet</span>
          </button>

        </div>

      </div>

    </div>
  );
};
