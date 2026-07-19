import React, { useState } from 'react';
import { Patient } from '../types';
import { 
  ShieldAlert, Activity, Users, Flame, HeartPulse, Sparkles, Wrench, Package, 
  ShoppingCart, Truck, Trash2, Shield, ChefHat, CheckSquare, Settings, Play, 
  Check, Plus, Search, AlertTriangle, RefreshCw, BarChart3, Database, Calendar, Eye
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, LineChart, Line } from 'recharts';

interface AlliedOperationalPanelsProps {
  activePanel: string;
  patients: Patient[];
  onUpdatePatient: (patient: Patient) => void;
}

export default function AlliedOperationalPanels({ activePanel, patients, onUpdatePatient }: AlliedOperationalPanelsProps) {
  // --- Global panel active sub-tabs ---
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({
    "Infection Control Team": "hai",
    "Dietician Panel": "dietRoster",
    "Physiotherapy Panel": "progressTracker",
    "CSSD Panel": "sterilityCycles",
    "Housekeeping Panel": "wardStatus",
    "Biomedical Waste": "wasteSegregation",
    "Ambulance Panel": "fleetLive",
    "Purchase Panel": "procurements",
    "Inventory Panel": "stockRegister",
    "Maintenance Panel": "workOrders"
  });

  const getSubTab = (panel: string) => activeTabs[panel] || "";
  const setSubTab = (panel: string, tab: string) => {
    setActiveTabs(prev => ({ ...prev, [panel]: tab }));
  };

  // ==========================================
  // STATE DEFINITIONS FOR THE 10 PANELS
  // ==========================================

  // 1. INFECTION CONTROL TEAM
  const [haiCases, setHaiCases] = useState([
    { id: "HAI-001", patientName: "Ramesh Sharma", type: "CLABSI", date: "15-Jul-2026", organism: "K. pneumoniae (ESBL)", status: "Isolated" },
    { id: "HAI-002", patientName: "Anita Verma", type: "CAUTI", date: "18-Jul-2026", organism: "E. coli", status: "Under Treatment" }
  ]);
  const [newHaiCase, setNewHaiCase] = useState({ patientName: "", type: "CLABSI", organism: "", status: "Isolated" });

  const [handHygieneAudits, setHandHygieneAudits] = useState([
    { id: "HHA-101", dept: "ICU Complex", role: "Nurses", momentsObserved: 45, momentsCompliant: 41, score: 91 },
    { id: "HHA-102", dept: "OPD Clinics", role: "Doctors", momentsObserved: 30, momentsCompliant: 24, score: 80 }
  ]);
  const [newHhAudit, setNewHhAudit] = useState({ dept: "ICU Complex", role: "Nurses", observed: 20, compliant: 18 });

  const [needleLogs, setNeedleLogs] = useState([
    { id: "NSI-501", staff: "Nurse Preeti", dept: "Emergency", date: "10-Jul-2026", device: "Hollow-bore Needle", action: "PEP Initiated" }
  ]);
  const [newNsi, setNewNsi] = useState({ staff: "", dept: "Emergency", device: "Hollow-bore Needle", action: "PEP Initiated" });

  // 2. DIETICIAN PANEL
  const [diets, setDiets] = useState([
    { uhid: "UHID-1002", name: "Ramesh Sharma", type: "Diabetic Diet", calories: 1800, allergen: "Nuts", remarks: "Sugar-free meals only" },
    { uhid: "UHID-1004", name: "Priyanjali Sen", type: "Low Sodium", calories: 1500, allergen: "Shellfish", remarks: "Renal monitoring required" }
  ]);
  const [newDiet, setNewDiet] = useState({ patientUhid: patients[0]?.uhid || "", type: "Diabetic Diet", calories: 1800, allergen: "None", remarks: "" });

  const [calcBmi, setCalcBmi] = useState({ weight: 70, height: 175, bmi: 22.9, recommendation: "Normal" });

  const [meals, setMeals] = useState([
    { room: "ICU Bed 2", patient: "Ramesh Sharma", diet: "Diabetic Diet", status: "Prepared", time: "08:15 AM" },
    { room: "Ward 304", patient: "Anita Verma", diet: "High Protein", status: "Served", time: "08:30 AM" }
  ]);

  // 3. PHYSIOTHERAPY PANEL
  const [physioPlans, setPhysioPlans] = useState([
    { id: "PHY-001", patientName: "Gopal Rao", condition: "Post-Stroke Left Hemiplegia", goals: "Restore Gait & Balance", therapist: "Dr. Alok Roy", progress: "65%" },
    { id: "PHY-002", patientName: "Meera Nair", condition: "Post-TKR (Knee Flexion)", goals: "Knee bend to 110 degrees", therapist: "Dr. Alok Roy", progress: "40%" }
  ]);
  const [newPhysio, setNewPhysio] = useState({ patientName: "", condition: "", goals: "", therapist: "Dr. Alok Roy" });

  const [sessionLogs, setSessionLogs] = useState([
    { date: "19-Jul-2026", patientName: "Gopal Rao", rom: "90°", painIndex: 4, gaitSpeed: "0.6 m/s", modalities: "TENS + Manual" }
  ]);
  const [newSession, setNewSession] = useState({ patientName: "Gopal Rao", rom: "90°", painIndex: 3, gaitSpeed: "0.5 m/s", modalities: "TENS + Manual" });

  // 4. CSSD PANEL
  const [cssdCycles, setCssdCycles] = useState([
    { id: "CYCLE-401", autoclaveId: "AC-1", batch: "B-22", temp: "134°C", duration: "30 min", indicatorTape: "Passed", status: "Sterilized" },
    { id: "CYCLE-402", autoclaveId: "AC-2", batch: "B-23", temp: "121°C", duration: "45 min", indicatorTape: "Passed", status: "In Progress" }
  ]);
  const [newCycle, setNewCycle] = useState({ autoclaveId: "AC-1", batch: "", temp: "134°C", duration: "30 min", indicatorTape: "Passed" });

  const [sporeTests, setSporeTests] = useState([
    { id: "SPORE-901", date: "18-Jul-2026", result: "Negative (Passed)", controlResult: "Positive (Valid)", incubatorTemp: "57°C" }
  ]);

  const [cssdRequests, setCssdRequests] = useState([
    { id: "REQ-301", requestingDept: "OT Block-1", kitType: "Laparoscopy Kit", qty: 2, status: "Dispatched" },
    { id: "REQ-302", requestingDept: "ICU Ward", kitType: "Central Line Kit", qty: 5, status: "Awaiting Clearance" }
  ]);

  // 5. HOUSEKEEPING PANEL
  const [wardsChecklist, setWardsChecklist] = useState([
    { id: "W-1", wardName: "OPD Reception", status: "Clean", housekeeper: "Vijay K.", lastCleaned: "10 mins ago" },
    { id: "W-2", wardName: "Emergency Bay", status: "Cleaning In Progress", housekeeper: "Sunita S.", lastCleaned: "In Progress" },
    { id: "W-3", wardName: "OT Room 1", status: "Awaiting Cleaning", housekeeper: "Vijay K.", lastCleaned: "2 hours ago" }
  ]);

  const [terminalCleans, setTerminalCleans] = useState([
    { date: "19-Jul-2026", ward: "ICU Bed 4", chemicalUsed: "Sodium Hypochlorite 1%", certifiedBy: "Sister In-Charge" }
  ]);
  const [newTermClean, setNewTermClean] = useState({ ward: "ICU Bed 4", chemicalUsed: "Sodium Hypochlorite 1%", certifiedBy: "Sister In-Charge" });

  // 6. BIOMEDICAL WASTE
  const [wasteLogs, setWasteLogs] = useState([
    { id: "BMW-301", colorBag: "Red", weight: "4.2 kg", source: "ICU Ward", time: "08:10 AM" },
    { id: "BMW-302", colorBag: "Yellow", weight: "8.5 kg", source: "OT Block-1", time: "08:15 AM" },
    { id: "BMW-303", colorBag: "White", weight: "0.8 kg", source: "Emergency", time: "08:20 AM" }
  ]);
  const [newWaste, setNewWaste] = useState({ colorBag: "Red", weight: "", source: "ICU Ward" });

  const [manifests, setManifests] = useState([
    { manifestNo: "CTF-2026-098", vehicleNo: "DL-1LM-4011", weightYellow: "42.5 kg", weightRed: "28.0 kg", status: "Dispatched" }
  ]);

  // 7. AMBULANCE PANEL
  const [ambulanceFleet, setAmbulanceFleet] = useState([
    { licensePlate: "DL-3C-9011", type: "ALS (Cardiac)", crew: "EMT Sandeep / Dr. Mehta", location: "South Delhi Ring Road", status: "Dispatched" },
    { licensePlate: "DL-3C-1200", type: "BLS Unit", crew: "EMT Rajeev", location: "Main Campus Standby", status: "Standby" },
    { licensePlate: "DL-3C-0988", type: "Neonatal Transport", crew: "Sister Maria", location: "East Wing Standby", status: "Standby" }
  ]);
  const [newDispatch, setNewDispatch] = useState({ licensePlate: "DL-3C-1200", destination: "", priority: "High Priority" });

  // 8. PURCHASE PANEL
  const [requisitions, setRequisitions] = useState([
    { id: "PR-2026-101", item: "Disposable Syringes 5ml", qty: 5000, dept: "Central Stores", priority: "Planned", status: "Awaiting Quotes" },
    { id: "PR-2026-102", item: "Oxygen Flowmeters", qty: 20, dept: "ICU Department", priority: "Immediate", status: "PO Approved" }
  ]);
  const [newRequisition, setNewRequisition] = useState({ item: "", qty: 100, dept: "Central Stores", priority: "Planned" });

  const [vendorQuotes, setVendorQuotes] = useState([
    { prId: "PR-2026-101", vendorName: "Hindustan Medicals Ltd", pricePerUnit: "₹3.50", deliveryTime: "5 days", status: "Selected" },
    { prId: "PR-2026-101", vendorName: "Global Healthcare Devices", pricePerUnit: "₹3.80", deliveryTime: "2 days", status: "Awaiting Review" }
  ]);

  // 9. INVENTORY PANEL
  const [inventories, setInventories] = useState([
    { code: "INV-SYR-05", name: "5ml Luer Lock Syringes", category: "Consumables", stock: 1250, unit: "Pcs", reorder: 500, rack: "A-12" },
    { code: "INV-GGL-02", name: "Sterile Nitrile Gloves (Sz 7)", category: "PPE", stock: 85, unit: "Pairs", reorder: 200, rack: "B-03" },
    { code: "INV-IVF-01", name: "Normal Saline 500ml IV", category: "Fluids", stock: 680, unit: "Bottles", reorder: 250, rack: "C-05" }
  ]);
  const [newInvItem, setNewInvItem] = useState({ name: "", category: "Consumables", stock: 100, unit: "Pcs", reorder: 50, rack: "" });

  const [stockIssues, setStockIssues] = useState([
    { id: "ISS-401", ward: "OPD Clinic 2", item: "Sterile Nitrile Gloves", qty: 50, date: "Today" }
  ]);
  const [newStockIssue, setNewStockIssue] = useState({ ward: "OPD Clinic 2", itemCode: "INV-GGL-02", qty: 10 });

  // 10. MAINTENANCE PANEL
  const [workOrders, setWorkOrders] = useState([
    { id: "WO-990", location: "OT Block Room 3", description: "HVAC cooling temperature erratic", priority: "High", assignedTo: "Suresh Pal", status: "Assigned" },
    { id: "WO-991", location: "ICU Bed 10 Wall Unit", description: "Oxygen secondary valve leaking slightly", priority: "Immediate", assignedTo: "Vinay Kumar", status: "Completed" }
  ]);
  const [newWorkOrder, setNewWorkOrder] = useState({ location: "", description: "", priority: "Medium", assignedTo: "Suresh Pal" });

  const [dailyFacilityCheck, setDailyFacilityCheck] = useState({
    roTds: 45,
    dgFuel: 82,
    gasManifoldPressure: 55,
    checkedAt: "08:00 AM Today"
  });


  // --- Helper to trigger recalculation of BMI ---
  const handleBmiCalc = (w: number, h: number) => {
    const heightInM = h / 100;
    const score = Number((w / (heightInM * heightInM)).toFixed(1));
    let rec = "Normal Weight";
    if (score < 18.5) rec = "Underweight";
    else if (score >= 25 && score < 30) rec = "Overweight";
    else if (score >= 30) rec = "Obese";
    setCalcBmi({ weight: w, height: h, bmi: score, recommendation: rec });
  };


  return (
    <div className="w-full mt-2">
      
      {/* 1. INFECTION CONTROL TEAM */}
      {activePanel === "Infection Control Team" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <ShieldAlert className="w-5 h-5 text-indigo-700" /> Infection Control Team (HICC) Audit Portal
            </h3>
            <span className="text-[10px] bg-red-50 border border-red-200 text-red-800 font-bold px-2.5 py-0.5 rounded">NABH HICC Compliant</span>
          </div>

          {/* Submenus */}
          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "hai")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "hai" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>HAI Surveillance</button>
            <button onClick={() => setSubTab(activePanel, "hh")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "hh" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Hand Hygiene Audits</button>
            <button onClick={() => setSubTab(activePanel, "nsi")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "nsi" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Needle Stick Incident Logs</button>
          </div>

          {/* SUBTAB: HAI Surveillance */}
          {getSubTab(activePanel) === "hai" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Log Suspected HAI Incident</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newHaiCase.patientName) return;
                  const incident = { id: `HAI-00${haiCases.length + 1}`, ...newHaiCase, date: "Today" };
                  setHaiCases([...haiCases, incident]);
                  setNewHaiCase({ patientName: "", type: "CLABSI", organism: "", status: "Isolated" });
                  alert("🚨 Suspected Hospital-Acquired Infection logged. Isolation protocols prompted.");
                }} className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Patient Name</label>
                    <input type="text" required placeholder="e.g. Priyanjali Sen" value={newHaiCase.patientName} onChange={e => setNewHaiCase({ ...newHaiCase, patientName: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">HAI Type</label>
                    <select value={newHaiCase.type} onChange={e => setNewHaiCase({ ...newHaiCase, type: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="CLABSI">CLABSI (Central Line Associated Bloodstream Infection)</option>
                      <option value="CAUTI">CAUTI (Catheter-Associated Urinary Tract Infection)</option>
                      <option value="VAE">VAE (Ventilator-Associated Event)</option>
                      <option value="SSI">SSI (Surgical Site Infection)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Isolated Culture Organism</label>
                    <input type="text" required placeholder="e.g. Pseudomonas aeruginosa" value={newHaiCase.organism} onChange={e => setNewHaiCase({ ...newHaiCase, organism: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    Dispatch Alert to Ward Nursing
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Active Isolation & HAI Register</span>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {haiCases.map((cs, idx) => (
                    <div key={idx} className="p-2 border bg-white rounded shadow-3xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-700 text-[11px]">{cs.patientName} ({cs.type})</div>
                        <div className="text-[9.5px] text-slate-400 font-mono">Date Registered: {cs.date} | Culture: {cs.organism}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 font-bold rounded text-[9px] uppercase">{cs.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Hand Hygiene */}
          {getSubTab(activePanel) === "hh" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Record Moment Observation</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const score = Math.round((newHhAudit.compliant / newHhAudit.observed) * 100);
                  const audit = { id: `HHA-${Date.now().toString().substring(7)}`, score, ...newHhAudit };
                  setHandHygieneAudits([audit, ...handHygieneAudits]);
                  alert("✓ Peer-reviewed hand hygiene observation logged securely.");
                }} className="space-y-2.5">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Clinical Department</label>
                    <select value={newHhAudit.dept} onChange={e => setNewHhAudit({ ...newHhAudit, dept: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="ICU Complex">ICU Complex</option>
                      <option value="Emergency Department">Emergency Department</option>
                      <option value="OPD Clinics">OPD Clinics</option>
                      <option value="OT Block">OT Block</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Professional Group</label>
                    <select value={newHhAudit.role} onChange={e => setNewHhAudit({ ...newHhAudit, role: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="Doctors">Doctors</option>
                      <option value="Nurses">Nurses</option>
                      <option value="Physiotherapists">Physiotherapists</option>
                      <option value="Housekeeping staff">Housekeeping staff</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Moments Observed</label>
                      <input type="number" value={newHhAudit.observed} onChange={e => setNewHhAudit({ ...newHhAudit, observed: Number(e.target.value) })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Moments Compliant</label>
                      <input type="number" value={newHhAudit.compliant} onChange={e => setNewHhAudit({ ...newHhAudit, compliant: Number(e.target.value) })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2 bg-slate-900 text-white font-bold rounded uppercase text-[10px] hover:bg-slate-950">
                    File Audit Stamped Payload
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Audit Compliance Log Matrix</span>
                <div className="space-y-2">
                  {handHygieneAudits.map((h, i) => (
                    <div key={i} className="p-2.5 bg-white rounded border shadow-3xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-700 text-[11px]">{h.dept} • {h.role}</div>
                        <div className="text-[10px] text-slate-400">Compliant Moments: {h.momentsCompliant} / {h.momentsObserved}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[12px] font-mono font-black ${h.score >= 90 ? 'text-[#006437]' : 'text-amber-600'}`}>{h.score}% Compliance</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Needle Stick */}
          {getSubTab(activePanel) === "nsi" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Log Occupational Exposure</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newNsi.staff) return;
                  const newLog = { id: `NSI-${Date.now().toString().substring(7)}`, date: "Today", ...newNsi };
                  setNeedleLogs([newLog, ...needleLogs]);
                  setNewNsi({ staff: "", dept: "Emergency", device: "Hollow-bore Needle", action: "PEP Initiated" });
                  alert("⚠️ Occupational injury recorded. Post-Exposure Prophylaxis protocol triggered.");
                }} className="space-y-2.5">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Injured Staff Name</label>
                    <input type="text" required placeholder="e.g. Dr. Varun Kumar" value={newNsi.staff} onChange={e => setNewNsi({ ...newNsi, staff: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Injury Ward Location</label>
                    <select value={newNsi.dept} onChange={e => setNewNsi({ ...newNsi, dept: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="Emergency">Emergency Complex</option>
                      <option value="ICU Block 2">ICU Block 2</option>
                      <option value="OT Room 4">OT Room 4</option>
                      <option value="General Ward B">General Ward B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Device Involved</label>
                    <input type="text" required placeholder="e.g. Suture needle, hollow-bore syringe" value={newNsi.device} onChange={e => setNewNsi({ ...newNsi, device: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-red-700 text-white font-bold rounded uppercase text-[10px] hover:bg-red-800">
                    File Injury & Launch PEP Protocol
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">HICC Needle Stick Exposure Registry</span>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {needleLogs.map((log, i) => (
                    <div key={i} className="p-2 border bg-white rounded shadow-3xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-700 text-[11px]">{log.staff} ({log.dept})</div>
                        <div className="text-[10px] text-slate-400 font-mono">Date: {log.date} | Device: {log.device}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 font-bold rounded text-[9px] uppercase">{log.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 2. DIETICIAN PANEL */}
      {activePanel === "Dietician Panel" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <ChefHat className="w-5 h-5 text-indigo-700 animate-pulse" /> Clinical Dietician & Patient Nutrition Hub
            </h3>
            <span className="text-[10px] bg-sky-150 text-sky-800 font-bold px-2.5 py-0.5 rounded">Nutrition Ward Sync</span>
          </div>

          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "dietRoster")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "dietRoster" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Patient Diet Roster</button>
            <button onClick={() => setSubTab(activePanel, "calorieCalc")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "calorieCalc" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>BMI & Nutrient Planner</button>
            <button onClick={() => setSubTab(activePanel, "mealDispatch")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "mealDispatch" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Kitchen Meal Dispatch</button>
          </div>

          {/* SUBTAB: Patient Diet Roster */}
          {getSubTab(activePanel) === "dietRoster" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Assign Clinical Diet plan</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const targetPatient = patients.find(p => p.uhid === newDiet.patientUhid);
                  if (!targetPatient) return;
                  const registeredDiet = { uhid: targetPatient.uhid, name: targetPatient.name, type: newDiet.type, calories: newDiet.calories, allergen: newDiet.allergen, remarks: newDiet.remarks };
                  setDiets([registeredDiet, ...diets]);
                  alert(`✓ ${targetPatient.name} assigned diet regimen: ${newDiet.type}.`);
                }} className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Select Hospitalized Patient</label>
                    <select value={newDiet.patientUhid} onChange={e => setNewDiet({ ...newDiet, patientUhid: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      {patients.map((p, idx) => (
                        <option key={idx} value={p.uhid}>{p.name} ({p.uhid})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Dietary Regimen Category</label>
                    <select value={newDiet.type} onChange={e => setNewDiet({ ...newDiet, type: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="Diabetic Diet">Diabetic Diet (Low glycemic index)</option>
                      <option value="Renal Low Sodium">Renal Low Sodium (Restricted potassium/salt)</option>
                      <option value="High Protein Liquid">High Protein Liquid (Post-operative)</option>
                      <option value="Keto/Seizure Control">Keto / Seizure Control Diet</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Calorie Cap (kcal)</label>
                      <input type="number" value={newDiet.calories} onChange={e => setNewDiet({ ...newDiet, calories: Number(e.target.value) })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Known Allergens</label>
                      <input type="text" placeholder="e.g. Nuts, Lactose" value={newDiet.allergen} onChange={e => setNewDiet({ ...newDiet, allergen: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Special Dietician Instructions</label>
                    <textarea rows={2} value={newDiet.remarks} onChange={e => setNewDiet({ ...newDiet, remarks: e.target.value })} className="w-full p-1.5 border rounded bg-white text-[11px]"></textarea>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    Lock diet plan & Sync Kitchen
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Hospital Nutrition Roster</span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {diets.map((d, idx) => (
                    <div key={idx} className="p-2 border bg-white rounded shadow-3xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-slate-800 text-[11.5px]">{d.name}</span>
                          <p className="text-[10px] text-slate-400">Diet Type: {d.type} | Target: {d.calories} kcal</p>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.2 bg-red-50 border border-red-200 text-red-700 rounded font-mono uppercase font-bold">
                          Allergy: {d.allergen}
                        </span>
                      </div>
                      <p className="text-[10px] italic text-indigo-900 font-bold bg-indigo-50/50 p-1 rounded mt-1.5 leading-snug">Remarks: {d.remarks}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Calorie Calculator */}
          {getSubTab(activePanel) === "calorieCalc" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Patient Anthropometry Calculator</span>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Weight (kg)</label>
                      <input type="number" value={calcBmi.weight} onChange={e => handleBmiCalc(Number(e.target.value), calcBmi.height)} className="w-full p-2 border rounded bg-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Height (cm)</label>
                      <input type="number" value={calcBmi.height} onChange={e => handleBmiCalc(calcBmi.weight, Number(e.target.value))} className="w-full p-2 border rounded bg-white font-mono" />
                    </div>
                  </div>

                  <div className="p-3 bg-white border rounded space-y-1">
                    <div className="text-[10px] font-bold text-slate-500">Calculated Body Mass Index (BMI):</div>
                    <div className="text-xl font-mono font-black text-indigo-900">{calcBmi.bmi} kg/m²</div>
                    <div className="text-[11px] font-extrabold text-[#006437] uppercase">{calcBmi.recommendation}</div>
                  </div>

                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded font-semibold text-[10px] leading-relaxed">
                    <strong>Daily Energy expenditure formula (Mifflin St. Jeor):</strong><br />
                    - Basal Metabolic Rate target: ~1,540 kcal/day<br />
                    - Recommended daily protein intake index: 1.2g/kg (84g protein)
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 border rounded flex flex-col justify-between h-56 text-center space-y-2">
                <div className="w-10 h-10 bg-[#ecf4e6] rounded-full flex items-center justify-center mx-auto text-[#006437]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Nutritional Plan Assistant</h4>
                  <p className="text-[10.5px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                    Directly maps verified lab biochemistry values (e.g. serum potassium, glucose, creatinine) and automatically locks menu restrictions in patient meal plans.
                  </p>
                </div>
                <button onClick={() => alert("✓ All clinical menus aligned. Nutrient planner synchronized against latest LIS lab panels.")} className="w-full py-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded uppercase text-[10px]">
                  Sync Biochemistry Panel Lab Results
                </button>
              </div>
            </div>
          )}

          {/* SUBTAB: Meal Dispatch */}
          {getSubTab(activePanel) === "mealDispatch" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12 bg-slate-50 p-3.5 rounded border space-y-3">
                <div className="flex justify-between items-center border-b pb-1.5">
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Active Kitchen Meal Dispatch Board</span>
                  <button onClick={() => {
                    setMeals(meals.map(m => m.status === 'Prepared' ? { ...m, status: 'Served', time: 'Just Now' } : m));
                    alert("🚚 All prepared meals flagged as Dispatched & Served.");
                  }} className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded text-[9.5px]">Dispatch Pending</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {meals.map((m, idx) => (
                    <div key={idx} className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs">
                      <div>
                        <span className="font-extrabold text-slate-800 text-[11px]">{m.room} ({m.patient})</span>
                        <p className="text-[10px] text-slate-400">Diet Type: {m.diet} • Timestamps: {m.time}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${m.status === 'Served' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'}`}>{m.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 3. PHYSIOTHERAPY PANEL */}
      {activePanel === "Physiotherapy Panel" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <HeartPulse className="w-5 h-5 text-indigo-700" /> Allied Physiotherapy & Rehabilitation Console
            </h3>
            <span className="text-[10px] bg-[#ecf4e6] text-[#006437] font-bold px-2.5 py-0.5 rounded">Rehab Compliance</span>
          </div>

          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "progressTracker")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "progressTracker" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Active Rehab Plans</button>
            <button onClick={() => setSubTab(activePanel, "therapyPlanner")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "therapyPlanner" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Gait & ROM Assessment</button>
          </div>

          {/* SUBTAB: Rehab Plans */}
          {getSubTab(activePanel) === "progressTracker" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">New Rehabilitation Regime</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPhysio.patientName) return;
                  const item = { id: `PHY-00${physioPlans.length + 1}`, ...newPhysio, progress: "0%" };
                  setPhysioPlans([...physioPlans, item]);
                  setNewPhysio({ patientName: "", condition: "", goals: "", therapist: "Dr. Alok Roy" });
                  alert("✓ Patient rehabilitation regime created successfully.");
                }} className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Patient Name</label>
                    <input type="text" required placeholder="e.g. Gopal Rao" value={newPhysio.patientName} onChange={e => setNewPhysio({ ...newPhysio, patientName: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Clinical Condition / Diagnosis</label>
                    <input type="text" required placeholder="e.g. Hemiplegia, Post-TKR knee pain" value={newPhysio.condition} onChange={e => setNewPhysio({ ...newPhysio, condition: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Rehabilitation Goals</label>
                    <input type="text" required placeholder="e.g. Knee extension degree, safe independent gait" value={newPhysio.goals} onChange={e => setNewPhysio({ ...newPhysio, goals: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    Register Physiotherapy Regime
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Active Rehabilitation Programs</span>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {physioPlans.map((pl, idx) => (
                    <div key={idx} className="p-2.5 border bg-white rounded shadow-3xs flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-slate-800 text-[11.5px]">{pl.patientName}</span>
                        <p className="text-[10px] text-slate-400">Diagnosis: {pl.condition} | Therapist: {pl.therapist}</p>
                        <p className="text-[9.5px] text-slate-500 font-medium">Rehab Goals: {pl.goals}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-mono font-black text-indigo-900">{pl.progress} Done</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Gait & ROM */}
          {getSubTab(activePanel) === "therapyPlanner" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Log Range of Motion & Progress Metrics</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setSessionLogs([{ date: "Today", ...newSession }, ...sessionLogs]);
                  alert("✓ Range of Motion & progress index saved to Patient Rehabilitation History.");
                }} className="space-y-2.5">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Select Active Patient</label>
                    <select value={newSession.patientName} onChange={e => setNewSession({ ...newSession, patientName: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      {physioPlans.map((pl, idx) => (
                        <option key={idx} value={pl.patientName}>{pl.patientName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Range Of Motion (ROM)</label>
                      <input type="text" placeholder="e.g. 95 degrees" value={newSession.rom} onChange={e => setNewSession({ ...newSession, rom: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Pain Index (1-10 Scale)</label>
                      <input type="number" value={newSession.painIndex} onChange={e => setNewSession({ ...newSession, painIndex: Number(e.target.value) })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Gait Speed (m/s)</label>
                      <input type="text" placeholder="e.g. 0.6 m/s" value={newSession.gaitSpeed} onChange={e => setNewSession({ ...newSession, gaitSpeed: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Modalities Used</label>
                      <input type="text" placeholder="e.g. IFT / Ultrasound" value={newSession.modalities} onChange={e => setNewSession({ ...newSession, modalities: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    Stash Assessment Entry
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Rehabilitative Session Logs</span>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {sessionLogs.map((lg, i) => (
                    <div key={i} className="p-2 border bg-white rounded shadow-3xs text-[10.5px]">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{lg.patientName}</span>
                        <span className="font-mono text-[9px] text-slate-400">{lg.date}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-slate-500 font-mono text-[9.5px] mt-1">
                        <div>ROM: {lg.rom}</div>
                        <div>Pain Index: {lg.painIndex}/10</div>
                        <div>Gait: {lg.gaitSpeed}</div>
                        <div>Modalities: {lg.modalities}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 4. CSSD PANEL */}
      {activePanel === "CSSD Panel" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <CheckSquare className="w-5 h-5 text-indigo-700" /> CSSD Autoclave Sterility Logs & Ward Dispensing
            </h3>
            <span className="text-[10px] bg-sky-150 text-sky-800 font-bold px-2.5 py-0.5 rounded">Autoclave Stamped</span>
          </div>

          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "sterilityCycles")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "sterilityCycles" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Autoclave Cycles</button>
            <button onClick={() => setSubTab(activePanel, "sporeChecks")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "sporeChecks" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Spore Biological Tests</button>
            <button onClick={() => setSubTab(activePanel, "kitRequests")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "kitRequests" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Surgical Kit Requests</button>
          </div>

          {/* SUBTAB: Sterility Cycles */}
          {getSubTab(activePanel) === "sterilityCycles" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Log Autoclave Steam Cycle</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCycle.batch) return;
                  const item = { id: `CYCLE-40${cssdCycles.length + 1}`, status: "Sterilized", ...newCycle };
                  setCssdCycles([item, ...cssdCycles]);
                  setNewCycle({ autoclaveId: "AC-1", batch: "", temp: "134°C", duration: "30 min", indicatorTape: "Passed" });
                  alert("✓ Autoclave sterilization cycle logged securely. Integration tag verified.");
                }} className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Autoclave Chamber ID</label>
                    <select value={newCycle.autoclaveId} onChange={e => setNewCycle({ ...newCycle, autoclaveId: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="AC-1">Chamber #1 (High Pressure)</option>
                      <option value="AC-2">Chamber #2 (Horizontal Boiler)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Sterility Batch Reference #</label>
                    <input type="text" required placeholder="e.g. B-24" value={newCycle.batch} onChange={e => setNewCycle({ ...newCycle, batch: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Hold Temp</label>
                      <select value={newCycle.temp} onChange={e => setNewCycle({ ...newCycle, temp: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                        <option value="134°C">134°C</option>
                        <option value="121°C">121°C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Hold Duration</label>
                      <select value={newCycle.duration} onChange={e => setNewCycle({ ...newCycle, duration: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                        <option value="30 min">30 mins</option>
                        <option value="45 min">45 mins</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    Certify Autoclave Cycle & Print Barcode
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Autoclave Sterility Index Registry</span>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {cssdCycles.map((cy, idx) => (
                    <div key={idx} className="p-2 border bg-white rounded shadow-3xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-700 text-[11px]">{cy.autoclaveId} • Batch {cy.batch}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Hold: {cy.temp} ({cy.duration}) | Indicator tape: {cy.indicatorTape}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${cy.status === 'Sterilized' ? 'bg-[#ecf4e6] text-[#006437] border border-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'}`}>{cy.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Spore Checks */}
          {getSubTab(activePanel) === "sporeChecks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Biological Spore Test Audit</span>
                <button onClick={() => {
                  const test = {
                    id: `SPORE-${Date.now().toString().substring(7)}`,
                    date: "Today",
                    result: "Negative (Passed)",
                    controlResult: "Positive (Valid)",
                    incubatorTemp: "57°C"
                  };
                  setSporeTests([test, ...sporeTests]);
                  alert("✓ Biological indicator spore vial cleared. Incubation validated negative.");
                }} className="w-full py-3 bg-[#006437] text-white font-bold rounded uppercase text-[10.5px] tracking-wider flex items-center justify-center gap-1.5">
                  <Play className="w-4 h-4 text-emerald-300" /> Incubate & Log Biological Indicator Spore Test
                </button>

                <div className="p-2 bg-emerald-50 text-[#006437] border border-emerald-100 rounded text-[9.5px] leading-relaxed">
                  <strong>Geobacillus stearothermophilus standard check:</strong><br />
                  Requires 24-hour incubation at 57°C to certify horizontal steam sterilizer pathogen clearance under ISO 11138.
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded border space-y-2">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Spore Test Logs History</span>
                <div className="space-y-1.5">
                  {sporeTests.map((t, idx) => (
                    <div key={idx} className="p-2 bg-white rounded border shadow-3xs text-[10.5px] flex justify-between">
                      <div>
                        <div className="font-bold text-slate-700">Audit {t.id}</div>
                        <div className="text-[9.5px] text-slate-400">Date: {t.date} • Incubator Temp: {t.incubatorTemp}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-black text-[#006437] bg-[#ecf4e6] border border-emerald-100 px-1.5 py-0.2 rounded">{t.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Kit Requests */}
          {getSubTab(activePanel) === "kitRequests" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Care Ward Sterile Kit Requests</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cssdRequests.map((req, idx) => (
                    <div key={idx} className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs">
                      <div>
                        <span className="font-extrabold text-slate-800 text-[11px]">{req.kitType} ({req.qty} Kits)</span>
                        <p className="text-[10px] text-slate-400">Requesting Care Area: {req.requestingDept}</p>
                      </div>
                      <div>
                        {req.status === 'Dispatched' ? (
                          <span className="text-[9px] font-bold text-emerald-600 bg-[#ecf4e6] border border-emerald-100 px-2 py-0.5 rounded">Dispatched</span>
                        ) : (
                          <button onClick={() => {
                            setCssdRequests(cssdRequests.map(r => r.id === req.id ? { ...r, status: 'Dispatched' } : r));
                            alert(`✓ Sterile ${req.kitType} dispatched to ${req.requestingDept}. Stamped batch code.`);
                          }} className="px-2.5 py-1 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded text-[9.5px]">
                            Disinfect & Dispatch
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 5. HOUSEKEEPING PANEL */}
      {activePanel === "Housekeeping Panel" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Settings className="w-5 h-5 text-indigo-700" /> Ward Cleanliness & Housekeeping Management
            </h3>
            <span className="text-[10px] bg-sky-150 text-sky-800 font-bold px-2.5 py-0.5 rounded">Housekeeping Duty</span>
          </div>

          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "wardStatus")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "wardStatus" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Ward Bed Sanitation</button>
            <button onClick={() => setSubTab(activePanel, "deepCleans")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "deepCleans" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Terminal Clean Disinfections</button>
          </div>

          {/* SUBTAB: Ward Sanitation */}
          {getSubTab(activePanel) === "wardStatus" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Interactive Bed/Ward Cleanliness Board</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {wardsChecklist.map((wd, idx) => (
                    <div key={idx} className="p-3 bg-white border rounded flex flex-col justify-between h-28 shadow-3xs">
                      <div>
                        <span className="font-bold text-slate-800 text-[11.5px]">{wd.wardName}</span>
                        <p className="text-[10px] text-slate-400">Cleaner Assigned: {wd.housekeeper}</p>
                        <p className="text-[9.5px] text-slate-500">Last cleaned: {wd.lastCleaned}</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-100 pt-1.5 mt-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${wd.status === 'Clean' ? 'bg-[#ecf4e6] text-[#006437]' : 'bg-amber-50 text-amber-800'}`}>{wd.status}</span>
                        {wd.status !== 'Clean' && (
                          <button onClick={() => {
                            setWardsChecklist(wardsChecklist.map(w => w.id === wd.id ? { ...w, status: 'Clean', lastCleaned: 'Just Now' } : w));
                            alert(`✓ ${wd.wardName} marked CLEAN. Stamped housekeeper checklist log.`);
                          }} className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9.5px]">Mark Clean</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Terminal Cleans */}
          {getSubTab(activePanel) === "deepCleans" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Log Terminal Disinfection</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTermClean.ward) return;
                  setTerminalCleans([{ date: "Today", ...newTermClean }, ...terminalCleans]);
                  alert("✓ Terminal deep disinfection logged with chemical certificate.");
                }} className="space-y-2.5">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Disinfected Area / Ward Bed</label>
                    <input type="text" required placeholder="e.g. ICU Bed 4 Complex" value={newTermClean.ward} onChange={e => setNewTermClean({ ...newTermClean, ward: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Disinfection Chemical Used</label>
                    <select value={newTermClean.chemicalUsed} onChange={e => setNewTermClean({ ...newTermClean, chemicalUsed: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="Sodium Hypochlorite 1%">Sodium Hypochlorite 1%</option>
                      <option value="Virex II 256">Virex II 256 (Quaternary Ammonium)</option>
                      <option value="Hydrogen Peroxide Vapor">Hydrogen Peroxide Vapor (Terminal OT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Sister In-Charge Witness Signature</label>
                    <input type="text" required placeholder="e.g. Sister Mercy" value={newTermClean.certifiedBy} onChange={e => setNewTermClean({ ...newTermClean, certifiedBy: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    File Sterile Deep Clean Certificate
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Terminal Deep-Disinfection Stamped Registry</span>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {terminalCleans.map((tc, idx) => (
                    <div key={idx} className="p-2 border bg-white rounded shadow-3xs text-[10.5px]">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{tc.ward}</span>
                        <span className="text-[9.5px] text-[#006437] font-mono">Disinfected</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Chemical: {tc.chemicalUsed} | Witness Certified by: {tc.certifiedBy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 6. BIOMEDICAL WASTE */}
      {activePanel === "Biomedical Waste" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Trash2 className="w-5 h-5 text-indigo-700" /> Biomedical Waste Segregation & National Transit Gate
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded">CBMWTF Protocol</span>
          </div>

          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "wasteSegregation")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "wasteSegregation" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Color-Coded Segregation Logs</button>
            <button onClick={() => setSubTab(activePanel, "ctfTransit")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "ctfTransit" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Transit Manifests</button>
          </div>

          {/* SUBTAB: Waste Segregation */}
          {getSubTab(activePanel) === "wasteSegregation" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Log Segregated Waste Bag</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newWaste.weight) return;
                  const item = { id: `BMW-00${wasteLogs.length + 1}`, colorBag: newWaste.colorBag, weight: `${newWaste.weight} kg`, source: newWaste.source, time: "Just Now" };
                  setWasteLogs([item, ...wasteLogs]);
                  setNewWaste({ colorBag: "Red", weight: "", source: "ICU Ward" });
                  alert("✓ Biomedical waste bag weighted, labeled, and barred for transit.");
                }} className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Biomedical Category Bag Color</label>
                    <select value={newWaste.colorBag} onChange={e => setNewWaste({ ...newWaste, colorBag: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="Red">Red (Infected Plastics/Tubes)</option>
                      <option value="Yellow">Yellow (Anatomical/Chemical waste)</option>
                      <option value="Blue">Blue (Cardboard/Glass containers)</option>
                      <option value="White">White (Sharps, syringe needles)</option>
                      <option value="Black">Black (General Municipal waste)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Certified Weight (kg)</label>
                    <input type="number" step="0.1" required placeholder="e.g. 4.5" value={newWaste.weight} onChange={e => setNewWaste({ ...newWaste, weight: e.target.value })} className="w-full p-2 border rounded bg-white font-mono text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Source Department / Ward</label>
                    <select value={newWaste.source} onChange={e => setNewWaste({ ...newWaste, source: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="ICU Ward">ICU Ward</option>
                      <option value="OT Block 1">OT Block 1</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Emergency Room">Emergency Room</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    Seal Bag & Apply Barcode Sticker
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Sealed Waste Registry Barcodes</span>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {wasteLogs.map((wl, idx) => (
                    <div key={idx} className="p-2 border bg-white rounded shadow-3xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full border border-slate-350`} style={{ backgroundColor: wl.colorBag.toLowerCase() === 'white' ? '#fff' : wl.colorBag.toLowerCase() === 'yellow' ? '#fde047' : wl.colorBag.toLowerCase() === 'red' ? '#ef4444' : wl.colorBag.toLowerCase() === 'blue' ? '#3b82f6' : '#1e293b' }}></span>
                          <span className="font-bold text-slate-700 text-[11px]">{wl.colorBag} Category Bag</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Location: {wl.source} | Logged: {wl.time}</div>
                      </div>
                      <span className="px-2.5 py-0.5 bg-slate-100 border text-slate-700 font-bold rounded font-mono text-[9px] uppercase">{wl.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Transit Manifests */}
          {getSubTab(activePanel) === "ctfTransit" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12 bg-slate-50 p-3.5 rounded border space-y-3">
                <div className="flex justify-between items-center border-b pb-1.5">
                  <span className="font-bold text-slate-800 uppercase text-[10px]">CBMWTF Transit manifests dispatched to government treatment plant</span>
                  <button onClick={() => {
                    alert("Manifest dispatched. Handshake token completed with central SPCB environmental server.");
                  }} className="px-2 py-0.5 bg-slate-900 text-white font-bold rounded text-[9.5px]">Generate Manifest</button>
                </div>

                <div className="space-y-1.5">
                  {manifests.map((man, idx) => (
                    <div key={idx} className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs text-[10.5px]">
                      <div>
                        <span className="font-extrabold text-slate-800 block">Manifest #{man.manifestNo}</span>
                        <p className="text-[10px] text-slate-400">Carrier vehicle: {man.vehicleNo} | Yellow payload: {man.weightYellow} | Red payload: {man.weightRed}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded text-[9px] uppercase">{man.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 7. AMBULANCE PANEL */}
      {activePanel === "Ambulance Panel" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Truck className="w-5 h-5 text-indigo-700 animate-bounce" /> Emergency GPS Ambulance Dispatch Fleet Console
            </h3>
            <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded">GPS Trauma Link</span>
          </div>

          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "fleetLive")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "fleetLive" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Fleet & Live Dispatch</button>
            <button onClick={() => setSubTab(activePanel, "equipment")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "equipment" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Defibrillator & O2 Checklist</button>
          </div>

          {/* SUBTAB: Fleet & Dispatch */}
          {getSubTab(activePanel) === "fleetLive" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Deploy Trauma Unit</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newDispatch.destination) return;
                  setAmbulanceFleet(ambulanceFleet.map(amb => amb.licensePlate === newDispatch.licensePlate ? { ...amb, status: "Dispatched", location: newDispatch.destination } : amb));
                  alert(`🚨 AMBULANCE dispatched to ${newDispatch.destination}! Route navigation coordinates locked.`);
                }} className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Select Standby Unit</label>
                    <select value={newDispatch.licensePlate} onChange={e => setNewDispatch({ ...newDispatch, licensePlate: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      {ambulanceFleet.filter(a => a.status === 'Standby').map((amb, idx) => (
                        <option key={idx} value={amb.licensePlate}>{amb.licensePlate} ({amb.type})</option>
                      ))}
                      {ambulanceFleet.filter(a => a.status === 'Standby').length === 0 && (
                        <option>No units available in standby</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Dispatched Destination Coordinates</label>
                    <input type="text" required placeholder="e.g. South Delhi Ring Road, Accident site" value={newDispatch.destination} onChange={e => setNewDispatch({ ...newDispatch, destination: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Emergency Triage Category</label>
                    <select value={newDispatch.priority} onChange={e => setNewDispatch({ ...newDispatch, priority: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="High Priority">ALS (Critical Trauma / Cardiac arrest)</option>
                      <option value="Standard Transfer">BLS (Stable transfer / Inter-hospital)</option>
                    </select>
                  </div>
                  <button type="submit" disabled={ambulanceFleet.filter(a => a.status === 'Standby').length === 0} className="w-full py-2 bg-red-700 text-white font-bold rounded uppercase text-[10px] hover:bg-red-800 disabled:opacity-50">
                    Deploy Standby Ambulance Unit
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Ambulance GPS Status Board</span>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {ambulanceFleet.map((amb, idx) => (
                    <div key={idx} className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs">
                      <div>
                        <span className="font-extrabold text-slate-800 text-[11px] block">Ambulance {amb.licensePlate} ({amb.type})</span>
                        <p className="text-[10px] text-slate-400">Crew: {amb.crew} | Location: {amb.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${amb.status === 'Dispatched' ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>{amb.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Equipment Check */}
          {getSubTab(activePanel) === "equipment" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Paramedic Vehicle checklist log</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-700" />
                    <span className="text-[11px] text-slate-700">Oxygen Cylinder Pressure {">"} 1500 psi verified</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-700" />
                    <span className="text-[11px] text-slate-700">ALS Lifepak Defibrillator battery charged</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-700" />
                    <span className="text-[11px] text-slate-700">Suction pump & emergency trauma airway kits intact</span>
                  </label>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 border rounded flex flex-col justify-between text-center space-y-2">
                <div className="w-10 h-10 bg-indigo-50 border-2 border-indigo-200 rounded-full flex items-center justify-center mx-auto text-indigo-800">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 uppercase text-[10.5px]">GPS Trauma Dispatch Controller</h4>
                  <p className="text-[10.5px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                    Click below to trigger a GPS and hardware calibration self-test for all three ambulance telemetry tablets.
                  </p>
                </div>
                <button onClick={() => alert("✓ All fleet GPS trackers responsive. SSL handshake active.")} className="w-full py-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded uppercase text-[10px]">
                  Calibrate Mobile GPS Hardware
                </button>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 8. PURCHASE PANEL */}
      {activePanel === "Purchase Panel" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <ShoppingCart className="w-5 h-5 text-indigo-700" /> Materials Procurement & Hospital Vendor Tendering
            </h3>
            <span className="text-[10px] bg-sky-150 text-sky-800 font-bold px-2.5 py-0.5 rounded">Procure-to-Pay</span>
          </div>

          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "procurements")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "procurements" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Purchase Requisitions (PR)</button>
            <button onClick={() => setSubTab(activePanel, "vendorQuotes")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "vendorQuotes" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Vendor Quotations Matrix</button>
          </div>

          {/* SUBTAB: Requisitions */}
          {getSubTab(activePanel) === "procurements" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Raise Purchase Requisition</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newRequisition.item) return;
                  const pr = { id: `PR-2026-00${requisitions.length + 1}`, status: "Awaiting Quotes", ...newRequisition };
                  setRequisitions([pr, ...requisitions]);
                  setNewRequisition({ item: "", qty: 100, dept: "Central Stores", priority: "Planned" });
                  alert("✓ Requisition logged. Bidding tender broadcast dispatched to selected vendors.");
                }} className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Item Description</label>
                    <input type="text" required placeholder="e.g. Infusion Pumps, Syringes" value={newRequisition.item} onChange={e => setNewRequisition({ ...newRequisition, item: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Required Quantity</label>
                      <input type="number" value={newRequisition.qty} onChange={e => setNewRequisition({ ...newRequisition, qty: Number(e.target.value) })} className="w-full p-2 border rounded bg-white font-mono text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Requesting Cost Center</label>
                      <select value={newRequisition.dept} onChange={e => setNewRequisition({ ...newRequisition, dept: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                        <option value="Central Stores">Central Stores</option>
                        <option value="ICU Department">ICU Department</option>
                        <option value="OT Block">OT Block</option>
                        <option value="Biomedical Dept">Biomedical Dept</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Urgency Level</label>
                    <select value={newRequisition.priority} onChange={e => setNewRequisition({ ...newRequisition, priority: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="Planned">Planned Stock replenishment</option>
                      <option value="Immediate">Immediate clinical need</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    File Requisition & Request Quotations
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Requisition Index Stash</span>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {requisitions.map((req, idx) => (
                    <div key={idx} className="p-2.5 border bg-white rounded shadow-3xs flex justify-between items-center text-[10.5px]">
                      <div>
                        <span className="font-extrabold text-slate-800 block">{req.item} ({req.qty} Units)</span>
                        <p className="text-[10px] text-slate-400">Dept: {req.dept} | PR Code: {req.id}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${req.status === 'PO Approved' ? 'bg-[#ecf4e6] text-[#006437]' : 'bg-indigo-50 text-indigo-700 animate-pulse'}`}>{req.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Quotes */}
          {getSubTab(activePanel) === "vendorQuotes" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Received Bids & Tenders Matrix</span>
                <div className="space-y-1.5">
                  {vendorQuotes.map((q, idx) => (
                    <div key={idx} className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs text-[10.5px]">
                      <div>
                        <span className="font-extrabold text-slate-800">{q.vendorName}</span>
                        <p className="text-[10px] text-slate-400">Bid price: {q.pricePerUnit} per unit | Estimated delivery: {q.deliveryTime} | Mapped PR: {q.prId}</p>
                      </div>
                      <div>
                        {q.status === 'Selected' ? (
                          <span className="text-[9px] font-bold text-[#006437] bg-[#ecf4e6] border border-emerald-100 px-2 py-0.5 rounded">Selected & Authorized</span>
                        ) : (
                          <button onClick={() => {
                            setVendorQuotes(vendorQuotes.map(qi => qi.vendorName === q.vendorName ? { ...qi, status: 'Selected' } : { ...qi, status: 'Awaiting Review' }));
                            alert(`✓ Authorized bid from ${q.vendorName}. Formatted Purchase Order (PO).`);
                          }} className="px-2.5 py-1 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded text-[9.5px]">
                            Authorize PO
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 9. INVENTORY PANEL */}
      {activePanel === "Inventory Panel" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Package className="w-5 h-5 text-indigo-700" /> General Hospital Stores & Consumables Inventory
            </h3>
            <span className="text-[10px] bg-[#ecf4e6] text-[#006437] font-bold px-2.5 py-0.5 rounded">Store Online</span>
          </div>

          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "stockRegister")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "stockRegister" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Stock Register</button>
            <button onClick={() => setSubTab(activePanel, "stockIssuance")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "stockIssuance" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Stock Issuance</button>
          </div>

          {/* SUBTAB: Stock Register */}
          {getSubTab(activePanel) === "stockRegister" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Add Consumable Stock Item</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newInvItem.name) return;
                  const item = { code: `INV-${newInvItem.category.substring(0,3).toUpperCase()}-0${inventories.length + 1}`, ...newInvItem };
                  setInventories([...inventories, item]);
                  setNewInvItem({ name: "", category: "Consumables", stock: 100, unit: "Pcs", reorder: 50, rack: "" });
                  alert("✓ Inventory stock item added and indexed successfully.");
                }} className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Item Name</label>
                    <input type="text" required placeholder="e.g. Alcohol Swabs" value={newInvItem.name} onChange={e => setNewInvItem({ ...newInvItem, name: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Category</label>
                      <select value={newInvItem.category} onChange={e => setNewInvItem({ ...newInvItem, category: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                        <option value="Consumables">Consumables</option>
                        <option value="PPE">PPE Equipment</option>
                        <option value="Fluids">IV Fluids / Solutions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Base Rack Location</label>
                      <input type="text" required placeholder="e.g. C-12" value={newInvItem.rack} onChange={e => setNewInvItem({ ...newInvItem, rack: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Opening Stock</label>
                      <input type="number" value={newInvItem.stock} onChange={e => setNewInvItem({ ...newInvItem, stock: Number(e.target.value) })} className="w-full p-2 border rounded bg-white font-mono text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Unit</label>
                      <input type="text" required placeholder="e.g. Pcs" value={newInvItem.unit} onChange={e => setNewInvItem({ ...newInvItem, unit: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Reorder Level</label>
                      <input type="number" value={newInvItem.reorder} onChange={e => setNewInvItem({ ...newInvItem, reorder: Number(e.target.value) })} className="w-full p-2 border rounded bg-white font-mono text-[11px]" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    File Inventory Index Record
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Stores Stock Ledger Matrix</span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {inventories.map((inv, idx) => (
                    <div key={idx} className="p-2 border bg-white rounded shadow-3xs flex justify-between items-center text-[10.5px]">
                      <div>
                        <span className="font-extrabold text-slate-800 block">{inv.name}</span>
                        <p className="text-[10px] text-slate-400">Category: {inv.category} | Rack: {inv.rack} | Code: {inv.code}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-sm font-mono font-black text-indigo-900">{inv.stock} {inv.unit}</span>
                        {inv.stock < inv.reorder ? (
                          <span className="text-[8.5px] font-bold text-rose-600 uppercase">⚠️ Under Reorder Level</span>
                        ) : (
                          <span className="text-[8.5px] font-bold text-[#006437] uppercase">Stock Adequate</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Issuance */}
          {getSubTab(activePanel) === "stockIssuance" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Issue stock to Ward</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const targetItem = inventories.find(inv => inv.code === newStockIssue.itemCode);
                  if (!targetItem) return;
                  if (targetItem.stock < newStockIssue.qty) {
                    alert("❌ Insufficient stock to fulfill issue quantity.");
                    return;
                  }
                  setInventories(inventories.map(inv => inv.code === newStockIssue.itemCode ? { ...inv, stock: inv.stock - newStockIssue.qty } : inv));
                  setStockIssues([{ id: `ISS-${Date.now().toString().substring(7)}`, ward: newStockIssue.ward, item: targetItem.name, qty: newStockIssue.qty, date: "Today" }, ...stockIssues]);
                  alert(`✓ Issued ${newStockIssue.qty} of ${targetItem.name} to ${newStockIssue.ward}.`);
                }} className="space-y-2.5">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Destined Ward / Clinic</label>
                    <select value={newStockIssue.ward} onChange={e => setNewStockIssue({ ...newStockIssue, ward: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      <option value="OPD Clinic 2">OPD Clinic 2</option>
                      <option value="ICU Ward Block B">ICU Ward Block B</option>
                      <option value="Emergency Treatment Room">Emergency Treatment Room</option>
                      <option value="Nursing Ward Block 3">Nursing Ward Block 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Inventory Item</label>
                    <select value={newStockIssue.itemCode} onChange={e => setNewStockIssue({ ...newStockIssue, itemCode: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                      {inventories.map((inv, idx) => (
                        <option key={idx} value={inv.code}>{inv.name} ({inv.stock} {inv.unit} remaining)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Quantity to Issue</label>
                    <input type="number" required value={newStockIssue.qty} onChange={e => setNewStockIssue({ ...newStockIssue, qty: Number(e.target.value) })} className="w-full p-2 border rounded bg-white font-mono text-[11px]" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    Authorize Stock Issuance
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Departmental Stock Issuance Log</span>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {stockIssues.map((st, i) => (
                    <div key={i} className="p-2 border bg-white rounded shadow-3xs text-[10.5px]">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{st.item} ({st.qty} Units issued)</span>
                        <span className="text-slate-400 font-mono text-[9px]">{st.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">To: {st.ward} | Dispatch reference: {st.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* 10. MAINTENANCE PANEL */}
      {activePanel === "Maintenance Panel" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Wrench className="w-5 h-5 text-indigo-700 animate-spin-slow" /> Facilities Maintenance & Engineering Calibrations
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded">Facilities Online</span>
          </div>

          <div className="flex border-b border-slate-100">
            <button onClick={() => setSubTab(activePanel, "workOrders")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "workOrders" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Work Orders</button>
            <button onClick={() => setSubTab(activePanel, "preventiveCheck")} className={`px-4 py-2 font-bold cursor-pointer transition ${getSubTab(activePanel) === "preventiveCheck" ? "border-b-2 border-indigo-600 text-indigo-950" : "text-slate-400"}`}>Facility Operations Metrics</button>
          </div>

          {/* SUBTAB: Work Orders */}
          {getSubTab(activePanel) === "workOrders" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">File Facility Work Order</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newWorkOrder.location) return;
                  const item = { id: `WO-9${workOrders.length + 2}`, status: "Assigned", ...newWorkOrder };
                  setWorkOrders([item, ...workOrders]);
                  setNewWorkOrder({ location: "", description: "", priority: "Medium", assignedTo: "Suresh Pal" });
                  alert("✓ Maintenance work order registered and assigned to duty technician.");
                }} className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Defective Location / Machine</label>
                    <input type="text" required placeholder="e.g. Ward 304 restroom leakage" value={newWorkOrder.location} onChange={e => setNewWorkOrder({ ...newWorkOrder, location: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5">Problem Description</label>
                    <textarea required placeholder="Describe the mechanical or facility defect..." value={newWorkOrder.description} onChange={e => setNewWorkOrder({ ...newWorkOrder, description: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Urgency Priority</label>
                      <select value={newWorkOrder.priority} onChange={e => setNewWorkOrder({ ...newWorkOrder, priority: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Immediate">Immediate / Safety risk</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Assigned Technician</label>
                      <select value={newWorkOrder.assignedTo} onChange={e => setNewWorkOrder({ ...newWorkOrder, assignedTo: e.target.value })} className="w-full p-2 border rounded bg-white text-[11px]">
                        <option value="Suresh Pal">Suresh Pal (Electrical)</option>
                        <option value="Vinay Kumar">Vinay Kumar (HVAC/Gas)</option>
                        <option value="Girish M.">Girish M. (Plumbing)</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold rounded uppercase text-[10px] hover:bg-indigo-950">
                    Dispatch Work Order Ticket
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Facilities Defect Registry</span>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {workOrders.map((wo, idx) => (
                    <div key={idx} className="p-2.5 border bg-white rounded shadow-3xs flex justify-between items-center text-[10.5px]">
                      <div>
                        <div className="font-bold text-slate-700">{wo.location}</div>
                        <p className="text-[10px] text-slate-400">Issue: {wo.description} | Tech: {wo.assignedTo}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        {wo.status === 'Completed' ? (
                          <span className="text-[9.5px] font-bold text-emerald-600 bg-[#ecf4e6] border border-emerald-100 px-2 py-0.5 rounded">Completed</span>
                        ) : (
                          <button onClick={() => {
                            setWorkOrders(workOrders.map(w => w.id === wo.id ? { ...w, status: 'Completed' } : w));
                            alert(`✓ Work order ticket ${wo.id} closed and marked completed.`);
                          }} className="px-2 py-0.5 bg-slate-950 text-white rounded text-[9.5px]">Close Ticket</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: Preventive Facilities Checklist */}
          {getSubTab(activePanel) === "preventiveCheck" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12 bg-slate-50 p-3.5 rounded border space-y-3">
                <div className="flex justify-between items-center border-b pb-1.5">
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Hospital Plant & Facilities Telemetry Indicators</span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">Updated: {dailyFacilityCheck.checkedAt}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white border rounded shadow-3xs text-center space-y-1">
                    <span className="text-[9.5px] text-slate-400 block font-sans">RO Water TDS levels</span>
                    <span className="text-xl font-black text-indigo-900 font-mono">{dailyFacilityCheck.roTds} ppm</span>
                    <span className="text-[8.5px] font-bold text-[#006437] bg-emerald-50 px-1 py-0.2 rounded font-mono">Normal ({"<"} 150 ppm)</span>
                  </div>
                  <div className="p-3 bg-white border rounded shadow-3xs text-center space-y-1">
                    <span className="text-[9.5px] text-slate-400 block font-sans">Diesel Generator Fuel Level</span>
                    <span className="text-xl font-black text-amber-700 font-mono">{dailyFacilityCheck.dgFuel}%</span>
                    <span className="text-[8.5px] font-bold text-[#006437] bg-emerald-50 px-1 py-0.2 rounded font-mono">Normal ({">"} 30% safety)</span>
                  </div>
                  <div className="p-3 bg-white border rounded shadow-3xs text-center space-y-1">
                    <span className="text-[9.5px] text-slate-400 block font-sans">O2 Gas Manifold Pressure</span>
                    <span className="text-xl font-black text-[#006437] font-mono">{dailyFacilityCheck.gasManifoldPressure} psi</span>
                    <span className="text-[8.5px] font-bold text-[#006437] bg-emerald-50 px-1 py-0.2 rounded font-mono">Normal (50 - 60 psi)</span>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-end">
                  <button onClick={() => {
                    setDailyFacilityCheck({
                      roTds: Math.floor(40 + Math.random() * 20),
                      dgFuel: Math.floor(75 + Math.random() * 10),
                      gasManifoldPressure: Math.floor(52 + Math.random() * 6),
                      checkedAt: new Date().toLocaleTimeString() + " Today"
                    });
                    alert("✓ Facility plant sensors refreshed. Telemetry is fully normal.");
                  }} className="px-3.5 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded uppercase shadow-3xs text-[10px]">
                    Refresh Facility Sensors
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
