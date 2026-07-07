import React, { useState } from 'react';
import { BedCategory, Patient } from '../types';
import { Bed, Users, ShieldAlert, Plus, Trash2 } from 'lucide-react';

interface BedBoardWidgetProps {
  beds: BedCategory[];
  patients: Patient[];
  onUpdateBeds: (updatedBeds: BedCategory[]) => void;
}

export default function BedBoardWidget({
  beds,
  patients,
  onUpdateBeds,
}: BedBoardWidgetProps) {
  const [selectedCategory, setSelectedCategory] = useState<BedCategory | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [patientToAllocate, setPatientToAllocate] = useState('');

  // Calculate dynamic totals
  const totalBeds = beds.reduce((acc, b) => acc + b.total, 0);
  const totalOccupied = beds.reduce((acc, b) => acc + b.occupied, 0);
  const totalAvailable = totalBeds - totalOccupied;

  const handleCategoryClick = (category: BedCategory) => {
    setSelectedCategory(category);
    setShowAllocateModal(true);
  };

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !patientToAllocate) return;

    if (selectedCategory.occupied >= selectedCategory.total) {
      alert("This ward is completely occupied!");
      return;
    }

    const updated = beds.map(b => {
      if (b.name === selectedCategory.name) {
        return { ...b, occupied: b.occupied + 1 };
      }
      return b;
    });

    onUpdateBeds(updated);
    setShowAllocateModal(false);
    setPatientToAllocate('');
    setSelectedCategory(null);
  };

  const handleRelease = (categoryName: string) => {
    const category = beds.find(b => b.name === categoryName);
    if (!category || category.occupied <= 0) return;

    const updated = beds.map(b => {
      if (b.name === categoryName) {
        return { ...b, occupied: b.occupied - 1 };
      }
      return b;
    });

    onUpdateBeds(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
          <Bed className="w-4 h-4 text-sky-600" /> IPD Bed Board
        </h3>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between text-xs space-y-4">
        {/* Statistics row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-600 text-white rounded p-1.5 shadow-xs">
            <span className="text-[9px] block opacity-90 font-semibold uppercase">Total Beds</span>
            <span className="font-bold text-base font-mono">{totalBeds}</span>
          </div>
          <div className="bg-rose-500 text-white rounded p-1.5 shadow-xs">
            <span className="text-[9px] block opacity-90 font-semibold uppercase">Occupied</span>
            <span className="font-bold text-base font-mono">{totalOccupied}</span>
          </div>
          <div className="bg-emerald-500 text-white rounded p-1.5 shadow-xs">
            <span className="text-[9px] block opacity-90 font-semibold uppercase">Available</span>
            <span className="font-bold text-base font-mono">{totalAvailable}</span>
          </div>
        </div>

        {/* Categories List with Progress Bars */}
        <div className="space-y-3 flex-1">
          {beds.map((b, idx) => {
            const occupancyRate = b.total > 0 ? Math.round((b.occupied / b.total) * 100) : 0;
            const progressColor = 
              occupancyRate > 90 ? 'bg-rose-500' :
              occupancyRate > 75 ? 'bg-amber-500' :
              'bg-blue-500';

            return (
              <div 
                key={idx}
                className="space-y-1 hover:bg-slate-50 p-1.5 rounded transition border border-transparent hover:border-slate-100"
              >
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> {b.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span>{b.occupied} / {b.total}</span>
                    <button 
                      onClick={() => handleCategoryClick(b)}
                      className="p-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded hover:bg-sky-100 text-[9px] px-1 font-bold font-sans"
                      title="Manage occupancy"
                    >
                      Manage
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full ${progressColor} transition-all duration-500`}
                    style={{ width: `${occupancyRate}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-[9px] text-slate-400 font-mono font-medium">
                  <span>Occupancy: {occupancyRate}%</span>
                  <span>Available: {b.total - b.occupied}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allocate Modal */}
      {showAllocateModal && selectedCategory && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden text-xs">
            <div className="bg-sky-700 text-white px-4 py-2.5 font-semibold flex justify-between items-center">
              <span>IPD Bed Manager: {selectedCategory.name}</span>
              <button 
                onClick={() => {
                  setShowAllocateModal(false);
                  setSelectedCategory(null);
                }} 
                className="text-white hover:text-red-200 font-bold text-sm"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Occupancy Summary */}
              <div className="bg-slate-50 p-2.5 border border-slate-100 rounded-lg flex justify-between text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">Total Capacity</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedCategory.total}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Currently Occupied</span>
                  <span className="font-bold text-rose-600 font-mono">{selectedCategory.occupied}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Available Beds</span>
                  <span className="font-bold text-emerald-600 font-mono">{selectedCategory.total - selectedCategory.occupied}</span>
                </div>
              </div>

              {/* Vacate bed quick button */}
              {selectedCategory.occupied > 0 && (
                <div className="flex justify-between items-center p-2 bg-rose-50 border border-rose-100 rounded-lg">
                  <span className="text-rose-800 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Discharge/Vacate Bed
                  </span>
                  <button
                    onClick={() => {
                      handleRelease(selectedCategory.name);
                      setSelectedCategory(prev => prev ? { ...prev, occupied: prev.occupied - 1 } : null);
                    }}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded font-bold hover:bg-rose-700 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Vacate Bed
                  </button>
                </div>
              )}

              {/* Allocation form */}
              <form onSubmit={handleAllocate} className="space-y-3">
                <div className="font-semibold text-slate-700 border-b border-slate-100 pb-1">Allocate New Bed</div>
                <div>
                  <label className="block text-slate-500 mb-1">Select Patient to Admit</label>
                  <select
                    value={patientToAllocate}
                    onChange={e => setPatientToAllocate(e.target.value)}
                    required
                    className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => (
                      <option key={p.uhid} value={p.uhid}>{p.name} ({p.uhid})</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAllocateModal(false);
                      setSelectedCategory(null);
                    }}
                    className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold hover:bg-slate-200"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-sky-700 text-white rounded font-bold hover:bg-sky-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Allocate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
