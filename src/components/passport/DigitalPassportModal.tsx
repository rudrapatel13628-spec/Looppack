import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Award, Download, Copy, Share2, Layers, Leaf, Cpu } from 'lucide-react';
import type { DigitalPassport } from '../../types';

interface DigitalPassportModalProps {
  passport: DigitalPassport | null;
  onClose: () => void;
  onCopyHash: (hash: string) => void;
}

export const DigitalPassportModal: React.FC<DigitalPassportModalProps> = ({
  passport,
  onClose,
  onCopyHash
}) => {
  if (!passport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel-glow w-full max-w-3xl rounded-3xl border border-emerald-500/40 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        
        <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-cyan-950 px-6 py-5 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-zinc-100">Digital Material Passport</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-zinc-950">
                  ISO-14040 VERIFIED
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                Verifiable Material Passport & Cryptographic Provenance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-none">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-zinc-900/90 rounded-2xl border border-zinc-800">
            <div className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                PASSPORT ID: {passport.serialNumber}
              </span>
              <h4 className="text-base font-extrabold text-zinc-100">{passport.materialName}</h4>
              <p className="text-xs text-zinc-400">
                Quantity: <strong className="text-zinc-200">{passport.quantity.toLocaleString()} {passport.unit}</strong> | Source: <strong className="text-zinc-200">{passport.originCompany}</strong>
              </p>
              
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-400" /> {passport.netCo2SavedKg.toLocaleString()} kg CO₂e Saved
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" /> {passport.aiMatchScorePercent}% AI Score
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-zinc-950 rounded-xl border border-emerald-950 text-center space-y-2">
              <div className="p-2 bg-white rounded-lg shadow-md">
                <svg className="w-20 h-20 text-zinc-950" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M0 0h35v35H0zM10 10h15v15H10zM65 0h35v35H65zM75 10h15v15H75zM0 65h35v35H0zM10 75h15v15H10zM40 10h15v15H40zM40 40h20v20H40zM70 40h25v15H70zM10 40h20v15H10zM70 70h25v25H70z" />
                </svg>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Scan for Audit Hash</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Material Composition & Baseline Factor
            </h4>
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-400">{passport.recycledContentPercent}% Recycled Fiber / Resin</span>
                <span className="text-zinc-400">{passport.virginContentPercent}% Virgin Material</span>
              </div>
              <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                  style={{ width: `${passport.recycledContentPercent}%` }}
                ></div>
                <div 
                  className="h-full bg-zinc-600" 
                  style={{ width: `${passport.virginContentPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                Raw Material Source: <span className="text-zinc-200">{passport.rawMaterialSource}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> Verified Sustainability Certifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {passport.certifications.map((cert, idx) => (
                <div key={idx} className="p-3 bg-zinc-900/80 rounded-xl border border-emerald-950 flex items-center space-x-2 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" /> Complete Movement & Audit History
            </h4>
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 space-y-4">
              {passport.movementHistory.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs relative pb-3 border-b border-zinc-800/60 last:border-0 last:pb-0">
                  <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-100">{step.stage}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-zinc-400">Actor: <strong className="text-zinc-300">{step.actor}</strong> ({step.location})</p>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-[10px] text-emerald-400/80 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-emerald-950">
                        Hash: {step.verificationHash}
                      </span>
                      <button 
                        onClick={() => onCopyHash(step.verificationHash)}
                        className="text-[10px] text-zinc-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="bg-zinc-950 px-6 py-4 border-t border-emerald-900/40 flex items-center justify-between gap-4">
          <button
            onClick={() => onCopyHash(passport.serialNumber)}
            className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-emerald-300 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Passport Link</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onCopyHash(`PDF Passport report generated for ${passport.serialNumber}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 text-zinc-950" />
              <span>Export PDF Passport</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
