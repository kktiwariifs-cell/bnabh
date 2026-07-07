import React, { useState } from 'react';
import { Patient, Visit } from '../types';
import { Sparkles, Plus, Trash2, Heart, ShieldAlert, Pill, CalendarRange } from 'lucide-react';

interface ClinicalSummaryWidgetProps {
  selectedPatient: Patient;
  onUpdatePatient: (updatedPatient: Patient) => void;
}

export default function ClinicalSummaryWidget({
  selectedPatient,
  onUpdatePatient,
}: ClinicalSummaryWidgetProps) {
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);

  // Form states
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  
  const [visitDate, setVisitDate] = useState('Today');
  const [visitDept, setVisitDept] = useState('General Medicine');
  const [visitDoc, setVisitDoc] = useState('Dr. Amit Verma');

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergy) return;
    const currentAllergies = selectedPatient.allergies.filter(a => a !== 'No Known Allergies');
    const updatedPatient = {
      ...selectedPatient,
      allergies: [...currentAllergies, newAllergy]
    };
    onUpdatePatient(updatedPatient);
    setNewAllergy('');
    setShowAddAllergy(false);
  };

  const handleRemoveAllergy = (allergyToRemove: string) => {
    let updatedAllergies = selectedPatient.allergies.filter(a => a !== allergyToRemove);
    if (updatedAllergies.length === 0) {
      updatedAllergies = ['No Known Allergies'];
    }
    onUpdatePatient({
      ...selectedPatient,
      allergies: updatedAllergies
    });
  };

  const handleAddCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondition) return;
    const currentConditions = selectedPatient.chronicConditions.filter(c => c !== 'None Logged');
    const updatedPatient = {
      ...selectedPatient,
      chronicConditions: [...currentConditions, newCondition]
    };
    onUpdatePatient(updatedPatient);
    setNewCondition('');
    setShowAddCondition(false);
  };

  const handleRemoveCondition = (conditionToRemove: string) => {
    let updatedConditions = selectedPatient.chronicConditions.filter(c => c !== conditionToRemove);
    if (updatedConditions.length === 0) {
      updatedConditions = ['None Logged'];
    }
    onUpdatePatient({
      ...selectedPatient,
      chronicConditions: updatedConditions
    });
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedication) return;
    const currentMedications = selectedPatient.currentMedications.filter(m => m !== 'None Logged');
    const updatedPatient = {
      ...selectedPatient,
      currentMedications: [...currentMedications, newMedication]
    };
    onUpdatePatient(updatedPatient);
    setNewMedication('');
    setShowAddMedication(false);
  };

  const handleRemoveMedication = (medicationToRemove: string) => {
    let updatedMeds = selectedPatient.currentMedications.filter(m => m !== medicationToRemove);
    if (updatedMeds.length === 0) {
      updatedMeds = ['None Logged'];
    }
    onUpdatePatient({
      ...selectedPatient,
      currentMedications: updatedMeds
    });
  };

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisit: Visit = {
      date: visitDate,
      department: visitDept,
      doctor: visitDoc
    };
    onUpdatePatient({
      ...selectedPatient,
      recentVisits: [newVisit, ...selectedPatient.recentVisits]
    });
    setShowAddVisit(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" /> Clinical Summary
        </h3>
        <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-medium">ABDM Linked</span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Allergies */}
        <div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-1 mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Allergies
            </span>
            <button 
              onClick={() => setShowAddAllergy(!showAddAllergy)}
              className="p-0.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition"
              title="Add allergy"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showAddAllergy && (
            <form onSubmit={handleAddAllergy} className="flex gap-1.5 mb-2">
              <input 
                type="text" 
                required
                placeholder="e.g. Latex Allergy" 
                value={newAllergy}
                onChange={e => setNewAllergy(e.target.value)}
                className="flex-1 px-2 py-1 text-[11px] border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="px-2 py-1 bg-indigo-600 text-white rounded text-[11px] hover:bg-indigo-700 font-medium">Add</button>
            </form>
          )}

          <div className="flex flex-wrap gap-1.5">
            {selectedPatient.allergies.map((allergy, idx) => (
              <span 
                key={idx} 
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${allergy === 'No Known Allergies' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-100'}`}
              >
                {allergy}
                {allergy !== 'No Known Allergies' && (
                  <button onClick={() => handleRemoveAllergy(allergy)} className="text-rose-400 hover:text-rose-800 ml-0.5 font-bold">
                    &times;
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Chronic Conditions */}
        <div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-1 mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Chronic Conditions
            </span>
            <button 
              onClick={() => setShowAddCondition(!showAddCondition)}
              className="p-0.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition"
              title="Add condition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showAddCondition && (
            <form onSubmit={handleAddCondition} className="flex gap-1.5 mb-2">
              <input 
                type="text" 
                required
                placeholder="e.g. Chronic Asthma" 
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
                className="flex-1 px-2 py-1 text-[11px] border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="px-2 py-1 bg-indigo-600 text-white rounded text-[11px] hover:bg-indigo-700 font-medium">Add</button>
            </form>
          )}

          <div className="space-y-1">
            {selectedPatient.chronicConditions.map((condition, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                <span className="text-slate-800 font-medium">{condition}</span>
                {condition !== 'None Logged' && condition !== 'None' && (
                  <button onClick={() => handleRemoveCondition(condition)} className="text-slate-400 hover:text-rose-600 transition" title="Delete">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-1 mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Pill className="w-3.5 h-3.5 text-indigo-500" /> Current Medications
            </span>
            <button 
              onClick={() => setShowAddMedication(!showAddMedication)}
              className="p-0.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition"
              title="Add medication"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showAddMedication && (
            <form onSubmit={handleAddMedication} className="flex gap-1.5 mb-2">
              <input 
                type="text" 
                required
                placeholder="e.g. Metformin 500mg" 
                value={newMedication}
                onChange={e => setNewMedication(e.target.value)}
                className="flex-1 px-2 py-1 text-[11px] border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="px-2 py-1 bg-indigo-600 text-white rounded text-[11px] hover:bg-indigo-700 font-medium">Add</button>
            </form>
          )}

          <div className="space-y-1">
            {selectedPatient.currentMedications.map((med, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                <span className="text-slate-800 font-medium font-sans">{med}</span>
                {med !== 'None Logged' && med !== 'None' && (
                  <button onClick={() => handleRemoveMedication(med)} className="text-slate-400 hover:text-rose-600 transition" title="Delete">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Visits */}
        <div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-1 mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <CalendarRange className="w-3.5 h-3.5 text-indigo-500" /> Recent Visits
            </span>
            <button 
              onClick={() => setShowAddVisit(!showAddVisit)}
              className="p-0.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition"
              title="Record new OPD/IPD encounter"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showAddVisit && (
            <form onSubmit={handleAddVisit} className="bg-slate-50 p-2 border border-slate-200 rounded mb-2.5 space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="block text-[10px] text-slate-500">Date</label>
                  <input type="text" value={visitDate} onChange={e => setVisitDate(e.target.value)} className="w-full px-1 py-0.5 border border-slate-300 rounded text-[10px]" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500">Dept</label>
                  <input type="text" value={visitDept} onChange={e => setVisitDept(e.target.value)} className="w-full px-1 py-0.5 border border-slate-300 rounded text-[10px]" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500">Doctor</label>
                  <input type="text" value={visitDoc} onChange={e => setVisitDoc(e.target.value)} className="w-full px-1 py-0.5 border border-slate-300 rounded text-[10px]" />
                </div>
              </div>
              <div className="flex justify-end gap-1.5">
                <button type="button" onClick={() => setShowAddVisit(false)} className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[9px] font-bold">Cancel</button>
                <button type="submit" className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[9px] font-bold hover:bg-indigo-700">Add Log</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-sans">
                  <th className="py-1 font-medium">Date</th>
                  <th className="py-1 font-medium">Department</th>
                  <th className="py-1 font-medium">Doctor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {selectedPatient.recentVisits.map((visit, idx) => (
                  <tr key={idx} className="text-slate-700 hover:bg-slate-50">
                    <td className="py-1.5 font-mono">{visit.date}</td>
                    <td className="py-1.5">{visit.department}</td>
                    <td className="py-1.5 text-slate-500">{visit.doctor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
