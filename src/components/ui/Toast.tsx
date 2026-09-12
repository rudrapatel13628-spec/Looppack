import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="glass-panel-glow p-4 rounded-2xl border border-emerald-500/50 shadow-2xl flex items-start space-x-3 max-w-sm">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-0.5">
          <h4 className="text-xs font-extrabold text-zinc-100">{toast.title}</h4>
          <p className="text-xs text-zinc-300 leading-snug">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
