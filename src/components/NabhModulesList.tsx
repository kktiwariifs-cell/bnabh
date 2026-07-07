import React, { useState } from 'react';
import { NABH_COMPLIANCE_MODULES } from '../data/initialData';
import { Incident } from '../types';
import { 
  Gauge, AlertTriangle, ShieldAlert, FileText, ClipboardCheck, Users, 
  HeartPulse, Award, Wrench, GraduationCap, UserCheck, Activity,
  CheckCircle2, AlertOctagon, X, Sparkles, BookOpen, Clock, FilePlus2, Play
} from 'lucide-react';

interface NabhModulesListProps {
  onAddIncident: (incident: Incident) => void;
  incidents: Incident[];
  onOpenAudit: () => void;
}

export default function NabhModulesList({
  onAddIncident,
  incidents,
  onOpenAudit,
}: NabhModulesListProps) {
  const [selectedModule, setSelectedModule] = useState<typeof NABH_COMPLIANCE_MODULES[0] | null>(null);
  
  // Incident Form state
  const [incType, setIncType] = useState<'Medication Error' | 'Patient Fall' | 'Near Miss' | 'Others'>('Medication Error');
  const [incSeverity, setIncSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [incPatientName, setIncPatientName] = useState('Rahul Kumar');
  const [incReporter, setIncReporter] = useState('Dr. Amit Verma');
  const [incDesc, setIncDesc] = useState('');

  // SOP state
  const [sops, setSops] = useState([
    { code: "SOP-CL-001", title: "Hand Hygiene & Infection Control", version: "v3.2", status: "Approved", date: "12-Jan-2024" },
    { code: "SOP-NUR-014", title: "High Alert Medications Administration", version: "v2.1", status: "Approved", date: "28-Feb-2024" },
    { code: "SOP-ICU-089", title: "Patient Fall Prevention Checklist", version: "v4.0", status: "In Revision", date: "15-May-2024" },
    { code: "SOP-ADMIN-05", title: "Emergency Disaster Management", version: "v1.1", status: "Pending Approval", date: "Today" }
  ]);
  const [newSopTitle, setNewSopTitle] = useState('');

  // Audit state
  const [auditScores, setAuditScores] = useState({
    hygiene: 92,
    records: 87,
    equip: 95,
    consent: 100
  });

  const handleLogIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incDesc) return;

    const newIncident: Incident = {
      id: `INC${(incidents.length + 1).toString().padStart(3, '0')}`,
      type: incType,
      severity: incSeverity,
      date: "Today",
      reporter: incReporter,
      patientName: incPatientName,
      description: incDesc,
      status: 'Open'
    };

    onAddIncident(newIncident);
    setIncDesc('');
    setSelectedModule(null); // Close drawer
  };

  const handleAddSop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSopTitle) return;

    const code = `SOP-NEW-${Math.floor(100 + Math.random() * 900)}`;
    const newSop = {
      code,
      title: newSopTitle,
      version: "v1.0",
      status: "Pending Approval",
      date: "Today"
    };

    setSops([...sops, newSop]);
    setNewSopTitle('');
  };

  const approveSop = (code: string) => {
    setSops(sops.map(s => s.code === code ? { ...s, status: 'Approved' } : s));
  };

  // Map icon strings to Lucide components
  const getIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "Gauge": return <Gauge className={`${className} text-sky-600`} />;
      case "AlertTriangle": return <AlertTriangle className={`${className} text-rose-500`} />;
      case "ShieldAlert": return <ShieldAlert className={`${className} text-amber-500`} />;
      case "FileText": return <FileText className={`${className} text-blue-500`} />;
      case "ClipboardCheck": return <ClipboardCheck className={`${className} text-emerald-500`} />;
      case "Users2": return <Users className={`${className} text-indigo-500`} />;
      case "HeartPulse": return <HeartPulse className={`${className} text-rose-500`} />;
      case "Award": return <Award className={`${className} text-purple-500`} />;
      case "Wrench": return <Wrench className={`${className} text-slate-500`} />;
      case "GraduationCap": return <GraduationCap className={`${className} text-indigo-500`} />;
      case "UserCheck": return <UserCheck className={`${className} text-emerald-500`} />;
      case "Activity": return <Activity className={`${className} text-sky-500`} />;
      default: return <Gauge className={`${className}`} />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Module Bar Title */}
      <div className="bg-[#85addb] text-slate-950 border border-[#628bbb] px-4 py-2 rounded-lg font-black text-center tracking-wide shadow-sm flex items-center justify-center gap-2 text-sm uppercase">
        <Award className="w-5 h-5 text-indigo-950" /> NABH Compliance Modules
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {NABH_COMPLIANCE_MODULES.map((mod, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedModule(mod);
              if (mod.name.includes("Audit Management")) {
                onOpenAudit(); // Special event to open standard audit sheet in parent if desired
              }
            }}
            className="bg-white p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left flex flex-col justify-between group h-28"
          >
            <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition w-fit mb-2">
              {getIcon(mod.icon)}
            </div>
            <span className="font-bold text-slate-800 text-[11px] leading-tight group-hover:text-indigo-900 transition font-sans">
              {mod.name}
            </span>
          </button>
        ))}
      </div>

      {/* Slide-out Interactive Sandbox Drawer */}
      {selectedModule && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in">
            {/* Drawer Header */}
            <div className="bg-indigo-950 text-white px-4 py-3.5 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-900/50 rounded">
                  {getIcon(selectedModule.icon, "w-5 h-5 text-white")}
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-indigo-200 tracking-wider">Compliance Sandbox</h4>
                  <h3 className="font-bold text-sm text-white leading-tight">{selectedModule.name}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedModule(null)}
                className="p-1 hover:bg-white/10 rounded text-indigo-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="bg-indigo-50/60 p-3.5 border border-indigo-100 rounded-lg">
                <h5 className="font-bold text-indigo-900 mb-1 flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-indigo-700" /> Standard Overview
                </h5>
                <p className="font-sans leading-relaxed text-slate-600">{selectedModule.desc}</p>
              </div>

              {/* DYNAMIC INTERACTION LAYER BY MODULE TYPE */}
              
              {/* Type 1: Incident Reporting & CAPA */}
              {selectedModule.name.includes("Incident Reporting") && (
                <div className="space-y-4">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide flex items-center gap-1.5">
                    <FilePlus2 className="w-4 h-4 text-indigo-600" /> Log Compliance Incident (Sentinel/Near Miss)
                  </div>

                  <form onSubmit={handleLogIncidentSubmit} className="space-y-3 bg-slate-50 p-3.5 border border-slate-100 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">Incident Type</label>
                        <select 
                          value={incType} 
                          onChange={e => setIncType(e.target.value as any)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                        >
                          <option value="Medication Error">Medication Error</option>
                          <option value="Patient Fall">Patient Fall</option>
                          <option value="Near Miss">Near Miss</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">Severity</label>
                        <select 
                          value={incSeverity} 
                          onChange={e => setIncSeverity(e.target.value as any)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                        >
                          <option value="Mild">Mild / Low Risk</option>
                          <option value="Moderate">Moderate Risk</option>
                          <option value="Severe">Severe / Sentinel</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">Involved Patient</label>
                        <select 
                          value={incPatientName} 
                          onChange={e => setIncPatientName(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                        >
                          <option value="Rahul Kumar">Rahul Kumar</option>
                          <option value="Priya Patel">Priya Patel</option>
                          <option value="Karan Singh">Karan Singh</option>
                          <option value="Sanya Sharma">Sanya Sharma</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">Logging Officer</label>
                        <input 
                          type="text" 
                          value={incReporter} 
                          onChange={e => setIncReporter(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Description of Incident</label>
                      <textarea 
                        required
                        rows={3}
                        value={incDesc}
                        onChange={e => setIncDesc(e.target.value)}
                        placeholder="State clearly what happened, immediate corrective actions taken, and who was notified..."
                        className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-sans"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-2 bg-indigo-900 text-white font-bold rounded hover:bg-indigo-800 transition flex items-center justify-center gap-1"
                    >
                      <AlertOctagon className="w-4 h-4 text-rose-300" /> Save Incident & Sync to KPI Charts
                    </button>
                  </form>

                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-500 uppercase text-[10px] tracking-wide">Recent Logs for Audit Check:</div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {incidents.slice().reverse().map(inc => (
                        <div key={inc.id} className="p-2 border border-slate-100 rounded bg-white space-y-1 shadow-2xs">
                          <div className="flex justify-between items-center font-semibold text-[11px]">
                            <span className="text-slate-800">{inc.type} - {inc.id}</span>
                            <span className={`px-1 rounded-full text-[9px] ${inc.severity === 'Severe' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                              {inc.severity}
                            </span>
                          </div>
                          <p className="text-slate-500 font-sans">{inc.description}</p>
                          <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                            <span>By: {inc.reporter}</span>
                            <span>{inc.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Type 2: Document Control (SOP/Policy) */}
              {selectedModule.name.includes("Document Control") && (
                <div className="space-y-4">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide">
                    Controlled Quality Manuals & SOPs
                  </div>

                  <form onSubmit={handleAddSop} className="flex gap-2 bg-slate-50 p-2 border border-slate-200 rounded">
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Needle Stick Injury Protocol" 
                      value={newSopTitle}
                      onChange={e => setNewSopTitle(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded focus:outline-none bg-white"
                    />
                    <button type="submit" className="px-3 py-1 bg-indigo-900 text-white rounded text-xs font-semibold hover:bg-indigo-800">
                      Upload Draft
                    </button>
                  </form>

                  <div className="space-y-2">
                    {sops.map(s => (
                      <div key={s.code} className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800 font-mono text-[11px]">{s.code} - {s.version}</div>
                          <div className="text-slate-700 font-medium font-sans">{s.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Logged: {s.date}</div>
                        </div>

                        <div>
                          {s.status === 'Approved' ? (
                            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active SOP
                            </span>
                          ) : s.status === 'In Revision' ? (
                            <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 text-[10px] font-bold">
                              <Clock className="w-3 h-3 text-amber-600" /> Under Review
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1 items-end">
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded border border-slate-200 uppercase font-bold">Draft Pending</span>
                              <button 
                                onClick={() => approveSop(s.code)}
                                className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold"
                              >
                                Approve
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Type 3: Quality Management & KPI Dashboard */}
              {selectedModule.name.includes("Quality Management") && (
                <div className="space-y-4 font-sans">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide">
                    Live NABH Quality KPIs & Targets
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 space-y-1">
                      <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                        <span>Bed Occupancy Rate</span>
                        <span className="text-emerald-700">81% / Target: &gt;80%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '81%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block">Status: Compliant (Highly Optimized)</span>
                    </div>

                    <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 space-y-1">
                      <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                        <span>Infection Rate (HAI)</span>
                        <span className="text-amber-700">1.2% / Target: &lt;1.5%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '80%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block">Status: At-Risk (Close to upper trigger)</span>
                    </div>

                    <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 space-y-1">
                      <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                        <span>Medication Error Rate</span>
                        <span className="text-emerald-700">0.6% / Target: &lt;1.0%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block">Status: Highly Compliant</span>
                    </div>

                    <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 space-y-1">
                      <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                        <span>Patient Satisfaction</span>
                        <span className="text-emerald-700">92% / Target: &gt;90%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block">Status: Compliant</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback general template for others */}
              {!selectedModule.name.includes("Incident") && !selectedModule.name.includes("Document") && !selectedModule.name.includes("Quality") && (
                <div className="space-y-4 font-sans text-slate-600">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide">
                    Compliance Audit Logs & Procedures
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Standard Verification Active
                    </div>
                    
                    <p className="text-[11px] leading-relaxed">
                      All protocols for <strong>{selectedModule.name}</strong> are currently running under active digital surveillance. The system automatically cross-references electronic health records, professional registers, and equipment calibration sheets against standard benchmarks.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-white p-2 rounded border border-slate-100 shadow-3xs">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Last Audit Score</span>
                        <span className="font-bold text-lg text-slate-800 font-mono">98.4%</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-100 shadow-3xs">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Next Audit Due</span>
                        <span className="font-bold text-xs text-sky-700 font-mono">15-Jul-2024</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-700 uppercase text-[10px]">Mandatory Checkpoints (NABH Chapter):</div>
                    <div className="space-y-1.5 bg-white border border-slate-100 rounded p-2.5">
                      <label className="flex items-start gap-2 text-slate-700">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-indigo-600" />
                        <div>
                          <strong className="block text-[11px]">Comprehensive Policy Logging</strong>
                          <span className="text-[10px] text-slate-400">Policy documented and accessible digitally to all ward nurses.</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-2 text-slate-700 mt-2 block">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-indigo-600" />
                        <div>
                          <strong className="block text-[11px]">Staff Competency Evaluation</strong>
                          <span className="text-[10px] text-slate-400">At least 90% of personnel must complete the credential check.</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-2 text-slate-700 mt-2 block">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-indigo-600" />
                        <div>
                          <strong className="block text-[11px]">Continuous Audit Cycle</strong>
                          <span className="text-[10px] text-slate-400">Record quarterly review results in central compliance registers.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Bot Prompt trigger */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 bg-gradient-to-r from-sky-50 to-indigo-50 p-3 rounded-lg">
                <Sparkles className="w-4 h-4 text-indigo-700 animate-pulse flex-shrink-0" />
                <div className="flex-1 text-[11px] text-indigo-950 font-medium">
                  Need a custom audit summary or compliance policy drafted by AI?
                </div>
                <span className="text-[10px] bg-indigo-700 text-white px-2 py-0.5 rounded font-bold font-sans">Use AI Copilot below</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
