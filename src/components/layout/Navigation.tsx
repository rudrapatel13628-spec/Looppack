import React from 'react';
import { Home, LayoutDashboard, ShoppingBag, Cpu, Truck, FileCheck } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    {
      id: 'landing',
      label: 'Home & Overview',
      shortLabel: 'Home',
      icon: Home,
      badge: 'Welcome'
    },
    {
      id: 'dashboard',
      label: 'Executive Carbon Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'marketplace',
      label: 'Materials Marketplace',
      shortLabel: 'Exchange',
      icon: ShoppingBag,
      badge: '6 Active'
    },
    {
      id: 'aimatchmaker',
      label: 'AI Matchmaking Engine',
      shortLabel: 'AI Matcher',
      icon: Cpu,
      badge: '6 Factors'
    },
    {
      id: 'logistics',
      label: 'Eco-Logistics Visualizer',
      shortLabel: 'Logistics',
      icon: Truck,
      badge: null
    },
    {
      id: 'passports',
      label: 'Digital Passports',
      shortLabel: 'Passports',
      icon: FileCheck,
      badge: 'ISO Audit'
    }
  ];

  return (
    <div className="w-full bg-zinc-950/80 border-b border-emerald-950 px-4 sm:px-8 py-2 sticky top-[69px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none space-x-1 sm:space-x-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.shortLabel}</span>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  isActive 
                    ? 'bg-emerald-500 text-zinc-950' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
