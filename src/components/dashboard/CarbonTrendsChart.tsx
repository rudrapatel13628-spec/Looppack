import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MONTHLY_CARBON_TRENDS } from '../../data/mockAnalytics';
import { TrendingUp, Info } from 'lucide-react';

export const CarbonTrendsChart: React.FC = () => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-emerald-900/50 flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Embodied Carbon Avoidance vs. Virgin Material Usage
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cumulative MT CO₂e avoided by circular packaging exchanges over time
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-zinc-300">CO₂e Avoided (MT)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50"></span>
            <span className="text-zinc-300">Virgin Material Avoided (Tons)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MONTHLY_CARBON_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorVirgin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#062e22" vertical={false} />
            <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 11 }} />
            <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#041c14',
                borderColor: '#10b981',
                borderRadius: '12px',
                color: '#ecfdf5',
                fontSize: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="co2AvoidedTons" 
              name="CO₂ Avoided (MT)" 
              stroke="#10b981" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorCo2)" 
            />
            <Area 
              type="monotone" 
              dataKey="virginMaterialAvoidedTons" 
              name="Virgin Material Avoided (Tons)" 
              stroke="#06b6d4" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorVirgin)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-emerald-950 flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified using ISO 14044 Lifecycle Assessment Data</span>
        </span>
        <span className="font-bold text-emerald-400">+28.5% Net Circular Efficiency</span>
      </div>
    </div>
  );
};
