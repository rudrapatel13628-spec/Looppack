import React, { useState } from 'react';
import { Search, ShieldCheck, QrCode, Award } from 'lucide-react';
import { MOCK_DIGITAL_PASSPORTS } from '../../data/mockPassport';
import type { DigitalPassport } from '../../types';

interface DigitalPassportViewerProps {
  onSelectPassport: (passport: DigitalPassport) => void;
}

export const DigitalPassportViewer: React.FC<DigitalPassportViewerProps> = ({
  onSelectPassport
}) => {
  const [search, setSearch] = useState('');
  const passports = Object.values(MOCK_DIGITAL_PASSPORTS);

  const filteredPassports = passports.filter(p => 
    p.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.materialName.toLowerCase().includes(search.toLowerCase()) ||
    p.originCompany.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-cyan-950 p-6 rounded-2xl border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>VERIFIABLE MATERIAL PASSPORTS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100">
            Digital Material Passport Ledger
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Audit verifiable chain-of-custody, recycled content percentages, and ISO-14040 carbon footprint certifications for every packaging stream.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search passport serial #..."
            className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs rounded-xl pl-9 pr-3 py-2 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPassports.map((passport) => (
          <div 
            key={passport.id} 
            className="glass-panel glass-card-hover p-6 rounded-2xl border border-emerald-900/40 space-y-4 relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  {passport.serialNumber}
                </span>
                <h3 className="text-base font-extrabold text-zinc-100 mt-0.5">{passport.materialName}</h3>
                <span className="text-xs text-zinc-400 block mt-0.5">Holder: {passport.originCompany}</span>
              </div>
              
              <div className="p-2 bg-zinc-950 rounded-xl border border-emerald-950 text-center">
                <QrCode className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Recycled %</span>
                <span className="font-black text-emerald-300 text-sm">{passport.recycledContentPercent}%</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">CO₂ Saved</span>
                <span className="font-black text-cyan-300 text-sm">{passport.netCo2SavedKg} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">AI Score</span>
                <span className="font-bold text-amber-300 text-[11px] block">{passport.aiMatchScorePercent}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> {passport.certifications.length} Certifications
              </span>

              <button
                onClick={() => onSelectPassport(passport)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                Inspect Provenance & Chain
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
