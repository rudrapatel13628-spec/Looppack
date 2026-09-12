import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import type { MaterialCategory, MaterialGrade, Listing } from '../../types';
import { calculateExactCarbonSaved } from '../../utils/carbonCalculator';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitListing: (newListing: Listing) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSubmitListing
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('Cardboard');
  const [quantity, setQuantity] = useState<number>(2000);
  const [unit, setUnit] = useState<string>('boxes');
  const [weightPerUnitKg, setWeightPerUnitKg] = useState<number>(1.0);
  const [pricePerUnitInr, setPricePerUnitInr] = useState<number>(0);
  const [condition, setCondition] = useState<MaterialGrade>('Clean Recyclable');
  const [sellerName, setSellerName] = useState('Tata AutoComp Systems Ltd');
  const [cityState, setCityState] = useState('Pune, MH');

  if (!isOpen) return null;

  const carbonCalc = calculateExactCarbonSaved(category, quantity, weightPerUnitKg, 25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newListing: Listing = {
      id: `LIST-IN-${Math.floor(100 + Math.random() * 900)}`,
      title: title || `Surplus ${category} Stream`,
      category,
      quantity,
      unit,
      weightPerUnitKg,
      location: `${cityState} Hub`,
      cityState: cityState || 'Pune, MH',
      distanceKm: Math.round(15 + Math.random() * 25),
      pricePerUnitInr,
      condition,
      sellerName: sellerName || 'Tata AutoComp Systems Ltd',
      sellerRating: 4.95,
      sellerType: 'Manufacturer',
      image: category === 'Cardboard' 
        ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
        : category === 'HDPE Plastics'
        ? 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80'
        : category === 'Steel Drums'
        ? 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80'
        : category === 'Bio-Foam'
        ? 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      verified: true,
      description: `Clean surplus ${category} stored in indoor facility. Ready for immediate pickup or circular dispatch.`,
      compositionPercent: '100% Recyclable Industrial Input',
      postedDate: 'Just now',
      carbonCalc
    };

    onSubmitListing(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel-glow w-full max-w-2xl rounded-3xl border border-emerald-500/40 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        
        <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-teal-950 px-6 py-5 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-zinc-100">Post Industrial Surplus Packaging</h3>
              <p className="text-xs text-zinc-400 font-medium">
                Calculates CO₂e offset using formula: (Weight × Baseline) - (Weight × Circular) - Transport
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-none">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-300">Material Title / Name *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Surplus Heavy Duty Double-Wall Corrugated Boxes"
              className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Material Category *</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as MaterialCategory;
                  setCategory(cat);
                  if (cat === 'Cardboard') { setUnit('boxes'); setWeightPerUnitKg(1.0); }
                  else if (cat === 'Wooden Pallets') { setUnit('pallets'); setWeightPerUnitKg(20.0); }
                  else if (cat === 'HDPE Plastics') { setUnit('drums'); setWeightPerUnitKg(12.0); }
                  else setUnit('units');
                }}
                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none cursor-pointer"
              >
                <option value="Cardboard" className="bg-zinc-900">Cardboard & Paper</option>
                <option value="Wooden Pallets" className="bg-zinc-900">Wooden Pallets</option>
                <option value="HDPE Plastics" className="bg-zinc-900">HDPE Plastics</option>
                <option value="Steel Drums" className="bg-zinc-900">Steel Drums</option>
                <option value="Bio-Foam" className="bg-zinc-900">Bio-Foam Inserts</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Quality / Condition Grade *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as MaterialGrade)}
                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none cursor-pointer"
              >
                <option value="Clean Recyclable" className="bg-zinc-900">Clean Recyclable</option>
                <option value="Grade A (Like New)" className="bg-zinc-900">Grade A (Like New)</option>
                <option value="Refurbished" className="bg-zinc-900">Refurbished</option>
                <option value="Industrial Bulk" className="bg-zinc-900">Industrial Bulk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Quantity *</label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Weight per Unit (kg)</label>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={weightPerUnitKg}
                onChange={(e) => setWeightPerUnitKg(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Price per Unit (₹)</label>
              <input
                type="number"
                min={0}
                value={pricePerUnitInr}
                onChange={(e) => setPricePerUnitInr(Number(e.target.value))}
                placeholder="0 = Free Claim"
                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Organization Name *</label>
              <input
                type="text"
                required
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">City, State Location *</label>
              <input
                type="text"
                required
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                placeholder="e.g. Pune, MH"
                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-emerald-950 to-cyan-950 rounded-2xl border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Exact Carbon Calculation Output</span>
              <span className="text-xs font-extrabold text-emerald-300">{carbonCalc.netCo2SavedKg.toLocaleString()} kg CO₂e Saved</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono bg-zinc-950 p-2 rounded-lg border border-emerald-950">
              ({carbonCalc.materialWeightKg}kg × {carbonCalc.baselineEmissionFactor}) - ({carbonCalc.materialWeightKg}kg × {carbonCalc.circularEmissionFactor}) - {carbonCalc.transportEmissionsKg}kg = <strong className="text-emerald-300">{carbonCalc.netCo2SavedKg} kg CO₂e</strong>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
            >
              Publish Surplus Stream
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
