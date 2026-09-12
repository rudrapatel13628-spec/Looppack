import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MATERIAL_BREAKDOWN } from '../../data/mockAnalytics';
import { PieChart as PieIcon, Layers } from 'lucide-react';

export const MaterialBreakdownChart: React.FC = () => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-emerald-900/50 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-cyan-400" />
          Material Mix Breakdown
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Distribution of packaging waste diverted by category (Tons)
        </p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-1/2 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MATERIAL_BREAKDOWN}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {MATERIAL_BREAKDOWN.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#041a13" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#041c14',
                  borderColor: '#06b6d4',
                  borderRadius: '12px',
                  color: '#ecfdf5',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full sm:w-1/2 space-y-2 text-xs">
          {MATERIAL_BREAKDOWN.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-zinc-200 font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-zinc-100">{item.value} T</span>
                <span className="text-[10px] text-zinc-400 ml-1.5 font-semibold">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center space-x-1">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Top Volume: <b>Cardboard & Paper (41%)</b></span>
        </span>
        <span className="text-emerald-400 font-semibold">1,428 Tons Diverted Total</span>
      </div>
    </div>
  );
};
