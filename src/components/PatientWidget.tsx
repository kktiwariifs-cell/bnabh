import React, { useState } from 'react';
import { Patient } from '../types';
import { Search, UserPlus, Shield, User, Phone, CalendarRange } from 'lucide-react';

interface PatientWidgetProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: (patient: Patient) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function PatientWidget({
  patients,
  selectedPatient,
  onSelectPatient,
  onAddPatient,
  activeTab,
  setActiveTab,
}: PatientWidgetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // New patient state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('30');
  const [newGender, setNewGender] = useState('Male');
  const [newPhone, setNewPhone] = useState('9876543210');
  const [newAbha, setNewAbha] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.abhaId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    // Generate random identifiers if not provided
    const uhidNum = Math.floor(10000000 + Math.random() * 90000000);
    const uhid = `UH00${uhidNum.toString().substring(0, 6)}`;
    const finalAbha = newAbha || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const abhaAddress = `${newName.toLowerCase().replace(/\s+/g, '')}@abdm`;

    const newPatient: Patient = {
      name: newName,
      uhid,
      abhaId: finalAbha,
      abhaAddress,
      age: parseInt(newAge) || 30,
      gender: newGender,
      phone: newPhone,
      allergies: ["No Known Allergies"],
      chronicConditions: ["None Logged"],
      currentMedications: ["None Logged"],
      recentVisits: [
        { date: "Today", department: "General OPD", doctor: "Dr. Amit Verma" }
      ]
    };

    onAddPatient(newPatient);
    setShowAddModal(false);
    
    // Reset form
    setNewName('');
    setNewAge('30');
    setNewGender('Male');
    setNewPhone('9876543210');
    setNewAbha('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Widget Header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-sky-600" /> Patient Dashboard
        </h3>
        <div className="flex gap-2">
          {/* Quick search button */}
          <button 
            onClick={() => setIsSearching(!isSearching)}
            className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
            title="Search patients"
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-1 hover:bg-slate-200 rounded text-sky-700 transition flex items-center gap-0.5 text-xs font-medium"
            title="Register new patient / ABHA"
          >
            <UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Register</span>
          </button>
        </div>
      </div>

      {/* Search Input Tray */}
      {isSearching && (
        <div className="p-2 bg-sky-50 border-b border-slate-200 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input 
              type="text" 
              placeholder="Search Name, UHID or ABHA ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:border-sky-500"
              autoFocus
            />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-1"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Patient Search Results dropdown if searching and typed */}
      {isSearching && searchQuery && (
        <div className="bg-sky-50 max-h-36 overflow-y-auto border-b border-slate-200">
          {filteredPatients.length === 0 ? (
            <div className="p-2 text-xs text-slate-500 text-center">No patients found</div>
          ) : (
            filteredPatients.map(p => (
              <button
                key={p.uhid}
                onClick={() => {
                  onSelectPatient(p);
                  setIsSearching(false);
                  setSearchQuery('');
                }}
                className={`w-full text-left p-2 border-b border-slate-100 last:border-0 hover:bg-white text-xs flex justify-between items-center ${selectedPatient.uhid === p.uhid ? 'bg-sky-100 font-medium' : ''}`}
              >
                <div>
                  <div className="text-slate-800">{p.name} ({p.gender}, {p.age})</div>
                  <div className="text-slate-500 text-[10px] font-mono">UHID: {p.uhid} | ABHA: {p.abhaId}</div>
                </div>
                <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded-full font-medium">Select</span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Patient Card View */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex gap-4 items-start">
          {/* Avatar Area */}
          <div className="w-14 h-14 rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center flex-shrink-0">
            {selectedPatient.gender === 'Male' ? (
              <User className="w-8 h-8 text-sky-600" />
            ) : (
              <User className="w-8 h-8 text-pink-500" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 text-base leading-tight truncate">{selectedPatient.name}</h4>
            <div className="text-xs text-slate-500 mt-1 flex flex-col gap-0.5 font-mono">
              <p><span className="font-medium text-slate-700 font-sans">UHID :</span> {selectedPatient.uhid}</p>
              <p><span className="font-medium text-slate-700 font-sans">ABHA ID :</span> {selectedPatient.abhaId}</p>
              <p><span className="font-medium text-slate-700 font-sans">ABHA Address :</span> {selectedPatient.abhaAddress}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Age / Male</span>
                <span className="font-medium text-slate-800">{selectedPatient.age} / {selectedPatient.gender}</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <span className="text-[10px] text-slate-500 block flex items-center gap-0.5"><Phone className="w-2.5 h-2.5 text-slate-400" /> Phone</span>
                <span className="font-medium text-slate-800 font-mono">{selectedPatient.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons matching image layout (OPD Visit, IPD Admission, Appointments, More) */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button 
            onClick={() => setActiveTab('OPD')}
            className={`py-1.5 px-2 text-xs font-semibold rounded border transition flex items-center justify-center gap-1 ${activeTab === 'OPD' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
          >
            <CalendarRange className="w-3.5 h-3.5" /> OPD Visit
          </button>
          <button 
            onClick={() => setActiveTab('IPD')}
            className={`py-1.5 px-2 text-xs font-semibold rounded border transition flex items-center justify-center gap-1 ${activeTab === 'IPD' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
          >
            <Shield className="w-3.5 h-3.5" /> IPD Admission
          </button>
          <button 
            onClick={() => setActiveTab('Appointments')}
            className={`py-1.5 px-2 text-xs font-semibold rounded border transition ${activeTab === 'Appointments' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
          >
            Appointments
          </button>
          <div className="relative group">
            <button 
              className="w-full py-1.5 px-2 text-xs font-semibold rounded border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 transition"
            >
              More Patients
            </button>
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded shadow-lg max-h-40 overflow-y-auto hidden group-hover:block z-10">
              <div className="p-1 bg-slate-50 text-[10px] text-slate-500 font-semibold border-b border-slate-200">Select Patient:</div>
              {patients.map(p => (
                <button
                  key={p.uhid}
                  onClick={() => onSelectPatient(p)}
                  className="w-full text-left px-2 py-1.5 hover:bg-sky-50 text-xs truncate border-b border-slate-100 last:border-0 block"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Register Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-sky-700 text-white px-4 py-3 font-semibold text-sm flex justify-between items-center">
              <span>Register ABDM-Compliant Patient</span>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white font-bold">&times;</button>
            </div>
            <form onSubmit={handleCreatePatient} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Age</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="120"
                    value={newAge} 
                    onChange={e => setNewAge(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gender</label>
                  <select 
                    value={newGender} 
                    onChange={e => setNewGender(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={newPhone} 
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Custom ABHA Number (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Format: XX-XXXX-XXXX-XXXX"
                  value={newAbha} 
                  onChange={e => setNewAbha(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-sky-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Leave empty to auto-generate a simulated compliant ABHA.</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded hover:bg-slate-200 transition font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3 py-1.5 bg-sky-700 text-white rounded hover:bg-sky-800 transition font-semibold flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register & Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
