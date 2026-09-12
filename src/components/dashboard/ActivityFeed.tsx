import React from 'react';
import { Activity, Zap, ShieldCheck } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 'ACT-IN-1',
      time: '10 mins ago',
      title: 'Surplus Claimed & Dispatched',
      description: 'Tata AutoComp claimed 350 Euro Pallets from Bosch India Logistics.',
      co2: '10.4 MT CO₂ Saved',
      badge: 'Completed',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'ACT-IN-2',
      time: '28 mins ago',
      title: '6-Factor AI Optimal Match',
      description: 'AI Engine matched Tata AutoComp (2,000 Cardboard Boxes) with Mahindra EV Hub (96% score).',
      co2: '1,350 kg CO₂e Saved',
      badge: 'AI Match',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'ACT-IN-3',
      time: '1 hour ago',
      title: 'Digital Passport ISO-14040 Audit Verified',
      description: 'ISO-14040 Audit verified for 2,500 Bio-Foam Protective Inserts in Electronic City.',
      co2: '1.2 MT CO₂ Saved',
      badge: 'Passport Verified',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'ACT-IN-4',
      time: '2 hours ago',
      title: 'Circular Route Optimization',
      description: 'Mahindra Electric EV Truck dispatched on Pune-Mumbai Eco-Backhaul #4.',
      co2: '325 kg Freight CO₂ Saved',
      badge: 'Logistics Optimized',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    }
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-emerald-900/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Live Network Circular Exchange Feed
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time trades, AI matches & verified carbon savings</p>
        </div>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-72 scrollbar-none pr-1">
        {activities.map((act) => (
          <div key={act.id} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-emerald-700/50 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${act.badgeColor}`}>
                {act.badge}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium">{act.time}</span>
            </div>
            <h4 className="text-xs font-bold text-zinc-200 mt-1">{act.title}</h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{act.description}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-zinc-800/50">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                {act.co2}
              </span>
              <span className="text-zinc-500 flex items-center gap-1">
                Verified <ShieldCheck className="w-3 h-3 text-emerald-400" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
