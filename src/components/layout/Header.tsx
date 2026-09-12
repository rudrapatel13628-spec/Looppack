import React, { useState } from 'react';
import { Package, PlusCircle, Bell, Building2, Truck, Factory } from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';
import type { NotificationItem } from '../../types';

interface HeaderProps {
  userRole: string;
  setUserRole: (role: string) => void;
  onOpenCreateModal: () => void;
  onNavigateLanding: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  setUserRole,
  onOpenCreateModal,
  onNavigateLanding,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-emerald-900/40 px-4 sm:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div 
          onClick={onNavigateLanding}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Return to LoopPack Landing Page"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-zinc-900 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                LoopPack
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
              B2B Circular Packaging Exchange & Carbon-Aware Supply Chain
            </p>
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Interactive Role Switcher Bar */}
          <div className="flex items-center p-1 bg-zinc-900/90 border border-emerald-900/60 rounded-xl text-xs shadow-inner">
            
            {/* Manufacturer Button */}
            <button
              onClick={() => setUserRole('Manufacturer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                userRole === 'Manufacturer'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-950/80 border border-emerald-300'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
              }`}
              title="Switch view to Manufacturer (Surplus Supplier)"
            >
              <Factory className={`w-3.5 h-3.5 ${userRole === 'Manufacturer' ? 'text-zinc-950' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline">Manufacturer</span>
              <span className="sm:hidden">Seller</span>
            </button>

            {/* Buyer / Recycler Button */}
            <button
              onClick={() => setUserRole('Buyer / Recycler')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                userRole === 'Buyer / Recycler'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-950/80 border border-emerald-300'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
              }`}
              title="Switch view to Buyer / Recycler (Procurement)"
            >
              <Building2 className={`w-3.5 h-3.5 ${userRole === 'Buyer / Recycler' ? 'text-zinc-950' : 'text-cyan-400'}`} />
              <span>Buyer / Recycler</span>
            </button>

            {/* Logistics Fleet Button */}
            <button
              onClick={() => setUserRole('Logistics Fleet')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                userRole === 'Logistics Fleet'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-950/80 border border-emerald-300'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
              }`}
              title="Switch view to Logistics Fleet (Backhaul Operator)"
            >
              <Truck className={`w-3.5 h-3.5 ${userRole === 'Logistics Fleet' ? 'text-zinc-950' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">Logistics Fleet</span>
              <span className="sm:hidden">Logistics</span>
            </button>

          </div>

          {/* Post Surplus Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/60 border border-emerald-300/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-zinc-950" />
            <span className="hidden sm:inline">Post Surplus Packaging</span>
            <span className="sm:hidden">Post Surplus</span>
          </button>

          {/* Interactive Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`p-2 border rounded-xl transition-all cursor-pointer ${
                isNotificationOpen 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-700'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-zinc-950 text-[10px] font-extrabold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationPopover
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              onMarkAllAsRead={onMarkAllAsRead}
              onSelectNotification={(notif) => {
                onSelectNotification(notif);
                setIsNotificationOpen(false);
              }}
            />
          </div>

        </div>

      </div>
    </header>
  );
};
