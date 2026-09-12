import React, { useEffect, useRef } from 'react';
import { 
  Bell, 
  Cpu, 
  Truck, 
  ShieldCheck, 
  ShoppingBag, 
  Leaf, 
  X, 
  CheckCheck,
  ChevronRight
} from 'lucide-react';
import type { NotificationItem } from '../../types';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'match':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'route':
        return <Truck className="w-4 h-4 text-emerald-400" />;
      case 'passport':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'request':
        return <ShoppingBag className="w-4 h-4 text-indigo-400" />;
      case 'carbon':
        return <Leaf className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div 
      ref={popoverRef}
      className="absolute right-0 top-12 z-50 w-80 sm:w-96 glass-panel-glow rounded-2xl border border-emerald-500/40 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="bg-zinc-950/90 px-4 py-3 border-b border-emerald-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs sm:text-sm font-extrabold text-zinc-100">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-zinc-950">
              {unreadCount} UNREAD
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer rounded-lg hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/50 scrollbar-none bg-zinc-950/95">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`p-3.5 flex items-start space-x-3 transition-all cursor-pointer hover:bg-emerald-950/40 group ${
                notif.unread ? 'bg-zinc-900/60' : 'opacity-80'
              }`}
            >
              <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${
                notif.unread 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-zinc-900 border-zinc-800'
              }`}>
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${
                    notif.unread ? 'text-zinc-100 group-hover:text-emerald-300' : 'text-zinc-400'
                  }`}>
                    {notif.title}
                  </span>
                  
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <span className="text-[10px] text-zinc-500 font-medium">{notif.time}</span>
                    {notif.unread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"></span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                  {notif.message}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors self-center flex-shrink-0" />
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-zinc-500">
            No notifications available.
          </div>
        )}
      </div>

      <div className="bg-zinc-950 px-4 py-2 border-t border-emerald-900/40 text-center">
        <span className="text-[10px] text-zinc-500 font-medium">
          Click notification to navigate to section
        </span>
      </div>

    </div>
  );
};
