import React, { useState } from 'react';
import { X, Building2, Factory, Truck, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import type { UserProfile } from '../../types';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (user: UserProfile) => void;
  users: UserProfile[];
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  users
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Fallback demo users if API is offline or returning empty
  const defaultDemoUsers: UserProfile[] = [
    {
      id: 'USER-001',
      email: 'tata.admin@looppack.in',
      fullName: 'Rajesh Sharma',
      role: 'Manufacturer',
      companyId: 'COMP-IN-TATA-01',
      companyName: 'Tata AutoComp Systems Ltd',
      companyType: 'Manufacturer'
    },
    {
      id: 'USER-002',
      email: 'bosch.logistics@looppack.in',
      fullName: 'Anita Desai',
      role: 'Manufacturer',
      companyId: 'COMP-IN-BOSCH-02',
      companyName: 'Bosch India Hardware Logistics',
      companyType: 'Manufacturer'
    },
    {
      id: 'USER-003',
      email: 'flipkart.procurement@looppack.in',
      fullName: 'Vikram Mehta',
      role: 'Buyer / Recycler',
      companyId: 'COMP-IN-FLIPKART-06',
      companyName: 'Flipkart Logistics Fulfillment',
      companyType: 'Distribution Hub'
    },
    {
      id: 'USER-004',
      email: 'mahindra.fleet@looppack.in',
      fullName: 'Suresh Kumar',
      role: 'Logistics Fleet',
      companyId: 'COMP-IN-MAHINDRA-07',
      companyName: 'Mahindra Electric Logistics Fleet',
      companyType: 'Logistics Fleet'
    }
  ];

  const displayUsers = users && users.length > 0 ? users : defaultDemoUsers;

  const handleCardSelect = (user: UserProfile) => {
    setErrorMsg(null);
    onSignIn(user);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter an email address.');
      return;
    }

    const trimmed = emailInput.trim().toLowerCase();
    const matched = displayUsers.find(
      (u) => u.email.toLowerCase() === trimmed
    );

    if (matched) {
      setErrorMsg(null);
      onSignIn(matched);
    } else {
      setErrorMsg(`No enterprise profile found matching "${emailInput}". Please select a demo card below.`);
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('Buyer') || role.includes('Recycler')) {
      return <Building2 className="w-4 h-4 text-cyan-400" />;
    }
    if (role.includes('Logistics') || role.includes('Fleet')) {
      return <Truck className="w-4 h-4 text-amber-400" />;
    }
    return <Factory className="w-4 h-4 text-emerald-400" />;
  };

  const getRoleBadgeStyle = (role: string) => {
    if (role.includes('Buyer') || role.includes('Recycler')) {
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
    if (role.includes('Logistics') || role.includes('Fleet')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-emerald-950/40 to-zinc-900 border-b border-emerald-900/50 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ENTERPRISE IDENTITY & ACCESS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight">
              Sign in to LoopPack
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select a demo enterprise profile or enter your work email to access your role dashboard.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-none">
          
          {/* Manual Email Input Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <label className="block text-xs font-bold text-zinc-300">
              Work Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. tata.admin@looppack.in"
                className="w-full pl-10 pr-28 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40">
                {errorMsg}
              </p>
            )}
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-zinc-800"></div>
            <span className="absolute bg-zinc-950 px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Or Select Demo Enterprise Account
            </span>
          </div>

          {/* Demo Account Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleCardSelect(user)}
                className="group p-4 bg-zinc-900/80 hover:bg-emerald-950/30 border border-zinc-800 hover:border-emerald-500/60 rounded-xl transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-zinc-950 border border-zinc-800 group-hover:border-emerald-500/40 rounded-lg">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                        {user.companyName || 'Enterprise Account'}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-medium">{user.fullName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-800/60">
                  <span className={`px-2 py-0.5 rounded-full font-bold border ${getRoleBadgeStyle(user.role)}`}>
                    {user.role}
                  </span>
                  <span className="text-zinc-500 font-mono text-[10px] group-hover:text-zinc-300 transition-colors">
                    {user.email}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Prototype Notice */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center space-x-2.5 text-xs text-zinc-400">
            <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <b>Hackathon Prototype Mode:</b> Click any enterprise card above to sign in instantly with PostgreSQL demo context.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
