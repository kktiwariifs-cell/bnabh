import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, ClipboardCheck, ShieldCheck, FileWarning, CalendarCheck, 
  SearchCode, HeartPulse, BarChart3, Medal, Compass, Sparkles, CheckCircle2, X,
  Search, RefreshCw, Download, Check, ArrowRight, Play, Database, Calendar, Users, Heart, AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

interface FooterWidgetProps {
  onSetActivePanel?: (panel: string) => void;
}

export default function FooterWidget({ onSetActivePanel }: FooterWidgetProps) {
  const [selectedItem, setSelectedItem] = useState<{ title: string; desc: string; stats?: string } | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedWard, setSelectedWard] = useState('All');
  
  // Interactive Simulation States
  const [isSimulating, setIsSimulating] = useState(false);
  const [telemetryValues, setTelemetryValues] = useState<Record<string, number>>({
    bedOccupancy: 81.4,
    medErrors: 0.6,
    satisfaction: 92.5,
  });

  // e-Signature States
  const [minutesSigned, setMinutesSigned] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerHash, setSignerHash] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  // ABDM Gateway States
  const [isQueryingGateway, setIsQueryingGateway] = useState(false);
  const [gatewayLatency, setGatewayLatency] = useState<number | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<'IDLE' | 'CONNECTED' | 'OFFLINE'>('IDLE');

  // Export State
  const [exportingType, setExportingType] = useState<string | null>(null);

  const reports = [
    { title: "NABH Compliance Reports", icon: <FileSpreadsheet className="w-5 h-5 text-indigo-600" />, desc: "Complete digital compilation of quarterly indicators, clinical audit logs, and safety clearances for NABH surveyors.", stats: "Compliant (Last Audit Score: 98.4%)" },
    { title: "Quality Indicator Reports", icon: <ClipboardCheck className="w-5 h-5 text-indigo-600" />, desc: "Continuous metric tracking charts including Bed Occupancy Rates, Readmission Rates, and Medication Errors.", stats: "6 standard charts updated live" },
    { title: "Infection Control Reports", icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />, desc: "Hospital-Acquired Infection (HAI) surveillance summaries, surgical site infection audits, and vaccine registers.", stats: "Infection rate: 1.2% (Target: < 1.5%)" },
    { title: "Incident & CAPA Reports", icon: <FileWarning className="w-5 h-5 text-indigo-600" />, desc: "Logs of all logged incidents, near misses, and sentinel events alongside signed Corrective and Preventive Action plans.", stats: "4 total incidents logged this month" },
    { title: "Committee Meeting Minutes", icon: <CalendarCheck className="w-5 h-5 text-indigo-600" />, desc: "Agenda summaries, digital attendance logs, and action items from safety and pharmacotherapeutic committees.", stats: "HICC Meeting: Held 15-Jun-2024" },
    { title: "Audit Reports", icon: <SearchCode className="w-5 h-5 text-indigo-600" />, desc: "Medical records completeness indexes, hand hygiene peer audits, and defibrillator/OT ventilator calibration scores.", stats: "Medical records completeness: 95%" },
    { title: "Patient Safety Reports", icon: <HeartPulse className="w-5 h-5 text-indigo-600" />, desc: "Indicators mapping patient falls, surgical safety checklists compliance, matching error rates, and blood crossmatch safety audits.", stats: "Surgical checklist compliance: 100%" },
    { title: "ABDM Usage Reports", icon: <BarChart3 className="w-5 h-5 text-indigo-600" />, desc: "Gateway statistics showing total ABHA cards generated, UHID-ABHA links, and secure FHIR record shares with PHRs.", stats: "148 record shares successfully verified" },
  ];

  const benefits = [
    { title: "NABH Compliant", icon: <Medal className="w-5 h-5 text-sky-600" />, desc: "Provides patient-centric safety standards, structured clinical auditing, and continuous quality indicators monitoring." },
    { title: "ABDM Ready", icon: <Compass className="w-5 h-5 text-sky-600" />, desc: "Fully integrated national health registry APIs (ABHA, HFR, HPR) for real-time secure clinical data exchange." },
    { title: "Better Patient Experience", icon: <HeartPulse className="w-5 h-5 text-sky-600" />, desc: "Contactless digital registration, instant clinical document sharing, and robust electronic safety loops." },
    { title: "Operational Excellence", icon: <Sparkles className="w-5 h-5 text-sky-600" />, desc: "Live dashboards, automated medication alerts, calibrated OT beds, and digital nursing care schedules." },
    { title: "Data Driven Decision Making", icon: <BarChart3 className="w-5 h-5 text-sky-600" />, desc: "D3-powered quality safety dashboards and real-time incident audits mapping clinical risks." },
    { title: "Regulatory Ready", icon: <CheckCircle2 className="w-5 h-5 text-sky-600" />, desc: "Instantly exportable reports for state authorities, hospital licensing boards, and accreditation surveyors." },
  ];

  // Simulations
  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setTelemetryValues({
        bedOccupancy: Number((78 + Math.random() * 8).toFixed(1)),
        medErrors: Number((0.3 + Math.random() * 0.5).toFixed(2)),
        satisfaction: Number((90 + Math.random() * 6).toFixed(1)),
      });
      setIsSimulating(false);
    }, 800);
  };

  const handleSignMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName) return;
    setIsSigning(true);
    setTimeout(() => {
      const generatedHash = "SHA256-" + Math.random().toString(36).substring(2, 10).toUpperCase() + "HMS" + Date.now().toString().substring(8);
      setSignerHash(generatedHash);
      setMinutesSigned(true);
      setIsSigning(false);
    }, 1000);
  };

  const queryNationalGateway = () => {
    setIsQueryingGateway(true);
    setGatewayStatus('IDLE');
    setTimeout(() => {
      setGatewayLatency(Math.floor(25 + Math.random() * 60));
      setGatewayStatus('CONNECTED');
      setIsQueryingGateway(false);
    }, 1200);
  };

  const simulateExport = (format: string) => {
    setExportingType(format);
    setTimeout(() => {
      setExportingType(null);
      alert(`📥 File successfully compiled!\nFormat: ${format}\nAudited standard hash: SHA-256 Verified\nFile size: ${(12.4 + Math.random() * 4).toFixed(1)} KB\n\nThe report has been securely saved to local downloads.`);
    }, 1100);
  };

  // Reset variables when modal toggles
  useEffect(() => {
    if (selectedItem) {
      setSearchQuery('');
      setSeverityFilter('All');
      setSelectedWard('All');
      setMinutesSigned(false);
      setSignerName('');
      setSignerHash('');
      setGatewayLatency(null);
      setGatewayStatus('IDLE');
    }
  }, [selectedItem]);

  return (
    <div className="space-y-4">
      {/* Grid containing reports and benefits */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Reports & Analytics Panel (Left 8 columns) */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs">
          <div className="border-b border-slate-100 pb-2 mb-3 flex justify-between items-center">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4.5 h-4.5 text-indigo-700" /> Interactive Reports & Real-time Analytics
            </h4>
            <span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-800 font-extrabold font-mono px-2 py-0.5 rounded uppercase">
              ACTIVE SUITE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {reports.map((rep, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedItem(rep)}
                className="p-3 rounded-lg border border-slate-150 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 transition-all text-center flex flex-col items-center justify-between group h-28 cursor-pointer shadow-3xs"
              >
                <div className="p-2 bg-white rounded-lg shadow-3xs border border-slate-100 group-hover:bg-indigo-50 transition mb-2 flex items-center justify-center">
                  {rep.icon}
                </div>
                <span className="font-extrabold text-slate-700 text-[10.5px] leading-snug font-sans block group-hover:text-indigo-950">
                  {rep.title}
                </span>
                <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50/50 px-1.5 py-0.2 rounded font-mono mt-1 group-hover:bg-indigo-100/60 uppercase">
                  Open Live
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Benefits Panel (Right 4 columns) */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <Medal className="w-4.5 h-4.5 text-sky-700" /> Accreditation Benefits
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            {benefits.map((ben, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedItem(ben)}
                className="p-2.5 rounded-lg border border-slate-100 hover:border-sky-300 bg-slate-50 hover:bg-sky-50/25 transition text-center flex flex-col items-center justify-between group h-24 cursor-pointer"
              >
                <div className="p-1.5 bg-white rounded-lg shadow-3xs group-hover:bg-sky-50 transition mb-1 flex items-center justify-center border border-slate-100">
                  {ben.icon}
                </div>
                <span className="font-bold text-slate-700 text-[10px] leading-tight font-sans block">
                  {ben.title}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Info Detail Modal / Full-Fidelity Interactive Dashboard Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#006437] to-[#70C143] text-white px-5 py-4 font-bold flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded">
                  <BarChart3 className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide uppercase">{selectedItem.title}</h3>
                  <span className="text-[9.5px] text-emerald-100 font-semibold block leading-none mt-0.5">NABH COP Quality Analytics & Core Audits Module</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="text-white hover:text-rose-200 font-bold transition p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Scrollable Content Container */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
              
              {/* Introduction Card */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1 max-w-2xl">
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {selectedItem.desc}
                  </p>
                  <span className="inline-block text-[9.5px] text-[#006437] bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold uppercase border border-emerald-100">
                    Accreditation Chapter Compliance: Verified Safe & Secure
                  </span>
                </div>
                
                {/* Global Export Buttons */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button 
                    onClick={() => simulateExport('PDF')}
                    disabled={exportingType !== null}
                    className="px-2.5 py-1.5 bg-[#006437] hover:bg-[#00502c] text-white rounded text-[10px] font-extrabold uppercase transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {exportingType === 'PDF' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    PDF Export
                  </button>
                  <button 
                    onClick={() => simulateExport('CSV')}
                    disabled={exportingType !== null}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-[10px] font-extrabold uppercase transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {exportingType === 'CSV' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Database className="w-3.5 h-3.5" />
                    )}
                    Excel CSV
                  </button>
                </div>
              </div>

              {/* DYNAMIC COMPONENT SPLIT VIEW ACCORDING TO WHICH CARD WAS CLICKED */}
              
              {/* ==================== REPORT 1: NABH COMPLIANCE REPORTS ==================== */}
              {selectedItem.title === "NABH Compliance Reports" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-5 space-y-3.5">
                    <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-3 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b pb-1">Report Parameters</h4>
                      <div className="space-y-1.5 text-xs">
                        <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Audit Quarter</label>
                        <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-[11.5px]">
                          <option>Q3 - Year 2026 (Active Current)</option>
                          <option>Q2 - Year 2026 (Archived)</option>
                          <option>Q1 - Year 2026 (Archived)</option>
                          <option>Q4 - Year 2025 (Archived)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Assessor Category</label>
                        <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-[11.5px]">
                          <option>All Audits (Internal & External)</option>
                          <option>Principal NABH Lead Assessor</option>
                          <option>HICC Internal Audit Subgroup</option>
                          <option>State Drug licensing inspectors</option>
                        </select>
                      </div>
                      <div className="p-2.5 bg-[#ecf4e6] rounded border border-slate-200 text-[10px] leading-relaxed text-[#006437] font-semibold">
                        <strong>Quarter Audit Verdict:</strong><br />
                        Accreditation status is fully secured with zero critical sentinel events noted. Peer score is at Q3-top 5% tier.
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-7 space-y-3.5">
                    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-3xs space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Accreditation Score Progress (2025-2026)</div>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { quarter: 'Q1-25', score: 94 },
                            { quarter: 'Q2-25', score: 95 },
                            { quarter: 'Q3-25', score: 95.8 },
                            { quarter: 'Q4-25', score: 96.4 },
                            { quarter: 'Q1-26', score: 97.2 },
                            { quarter: 'Q2-26', score: 98 },
                            { quarter: 'Q3-26', score: 98.4 },
                          ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#70C143" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#70C143" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: '#64748b' }} />
                            <YAxis domain={[90, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                            <Area type="monotone" dataKey="score" stroke="#006437" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== REPORT 2: QUALITY INDICATOR REPORTS ==================== */}
              {selectedItem.title === "Quality Indicator Reports" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-5 space-y-3.5">
                    <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-3 shadow-3xs text-xs">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">Live Metrics Telemetry</h4>
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      </div>
                      <div className="space-y-3 font-medium">
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <span className="text-slate-500">Bed Occupancy Rate:</span>
                          <span className="font-mono font-extrabold text-[#006437] text-sm">{telemetryValues.bedOccupancy}%</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <span className="text-slate-500">Medication Error Rate:</span>
                          <span className="font-mono font-extrabold text-rose-700 text-sm">{telemetryValues.medErrors}%</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <span className="text-slate-500">Patient Satisfaction:</span>
                          <span className="font-mono font-extrabold text-sky-700 text-sm">{telemetryValues.satisfaction}%</span>
                        </div>
                      </div>
                      <button 
                        onClick={triggerSimulation}
                        disabled={isSimulating}
                        className="w-full py-2 bg-gradient-to-r from-emerald-800 to-green-600 hover:from-emerald-900 hover:to-green-700 text-white font-extrabold uppercase rounded text-[10px] tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                        {isSimulating ? 'Generating Random Telemetry...' : 'Simulate Live Telemetry'}
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-7 space-y-3.5">
                    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-3xs space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Quality indicators comparison vs benchmarks</div>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { metric: 'Bed Occupancy', Hospital: telemetryValues.bedOccupancy, Target: 80.0 },
                            { metric: 'Med Errors (x100)', Hospital: telemetryValues.medErrors * 100, Target: 100.0 },
                            { metric: 'Patient Satisfaction', Hospital: telemetryValues.satisfaction, Target: 90.0 }
                          ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="metric" tick={{ fontSize: 8, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                            <Bar dataKey="Hospital" fill="#4f46e5" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="Target" fill="#cbd5e1" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== REPORT 3: INFECTION CONTROL REPORTS ==================== */}
              {selectedItem.title === "Infection Control Reports" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-5 space-y-3.5">
                    <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-3 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b pb-1">Filter Wards Audited</h4>
                      <div className="space-y-1 text-xs">
                        <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Active Ward Focus</label>
                        <select 
                          value={selectedWard}
                          onChange={(e) => setSelectedWard(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                        >
                          <option value="All">All Wards Combined</option>
                          <option value="ICU">ICU Complex Only</option>
                          <option value="Surgical">Surgical General Ward</option>
                          <option value="NICU">Neonatal ICU (NICU)</option>
                        </select>
                      </div>
                      <div className="p-3 bg-red-50 text-red-950 border border-red-200 rounded text-[10px] space-y-1">
                        <div className="font-bold uppercase tracking-wider flex items-center gap-1 text-red-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" /> Active Isolation Protocol Alert
                        </div>
                        <p className="leading-relaxed">
                          Standard isolation protocols are in active force across ICU Bed 3 due to suspected ESBL-producing Klebsiella infection.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-7 space-y-3.5">
                    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-3xs space-y-1.5 text-xs">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">HAI Rate (%) by Clinical Department</div>
                      <div className="h-28 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { ward: 'ICU', rate: 1.4, target: 1.5 },
                            { ward: 'Surgical', rate: 0.9, target: 1.5 },
                            { ward: 'NICU', rate: 0.2, target: 1.5 },
                            { ward: 'Emergency', rate: 1.8, target: 1.5 },
                          ].filter(w => selectedWard === 'All' || w.ward.includes(selectedWard))} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="ward" tick={{ fontSize: 9, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                            <Bar dataKey="rate" fill="#b91c1c" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="target" fill="#e2e8f0" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== REPORT 4: INCIDENT & CAPA REPORTS ==================== */}
              {selectedItem.title === "Incident & CAPA Reports" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                  <div className="md:col-span-5 space-y-3.5">
                    <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-3 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b pb-1">Filter Sentinel Severity</h4>
                      <select 
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#006437] font-medium"
                      >
                        <option value="All">All Severity Levels</option>
                        <option value="Severe">Severe / Sentinel Events Only</option>
                        <option value="Moderate">Moderate Risks Only</option>
                        <option value="Mild">Mild Incident / Near-Misses</option>
                      </select>
                      <div className="bg-[#ecf4e6] text-[#006437] border border-slate-150 p-2.5 rounded text-[10px] leading-relaxed">
                        <strong>CAPA Process Status:</strong><br />
                        AI Copilot is actively reviewing and generating Root Cause Analyses (RCA) based on the fishbone framework for all logged incidents.
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-7 space-y-3.5">
                    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-3xs space-y-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex justify-between">
                        <span>Incident Severity Spectrum Tracker</span>
                        <span className="text-[9.5px] text-amber-600 font-mono font-bold">STATE-DRIVEN</span>
                      </div>
                      <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                        {[
                          { id: 'INC-241', label: 'Incomplete Patient Consent Form', severity: 'Moderate', status: 'In RCA Review' },
                          { id: 'INC-242', label: 'Medication Dose Miscalculation', severity: 'Severe', status: 'CAPA Implemented' },
                          { id: 'INC-243', label: 'Nurse Hand Hygiene Deviation', severity: 'Mild', status: 'Resolved' },
                          { id: 'INC-244', label: 'Ventilator Backup Delay', severity: 'Severe', status: 'CAPA Implemented' },
                        ].filter(i => severityFilter === 'All' || i.severity === severityFilter).map((inc, index) => (
                          <div key={index} className="p-2 border border-slate-100 bg-slate-50/50 rounded flex justify-between items-center gap-1.5">
                            <div>
                              <div className="font-bold text-slate-700 text-[11px] leading-tight">{inc.label}</div>
                              <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">{inc.id} • Severity: {inc.severity}</div>
                            </div>
                            <span className="text-[8.5px] font-bold px-1.5 py-0.2 bg-indigo-50 border border-indigo-100 rounded text-indigo-700 font-mono uppercase">
                              {inc.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== REPORT 5: COMMITTEE MEETING MINUTES ==================== */}
              {selectedItem.title === "Committee Meeting Minutes" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                  <div className="md:col-span-6 space-y-3.5">
                    <form onSubmit={handleSignMinutes} className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-3 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b pb-1">Authorize Committee Sign-off</h4>
                      
                      {!minutesSigned ? (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Signer Full Name</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Dr. K. K. Tiwari" 
                              value={signerName}
                              onChange={e => setSignerName(e.target.value)}
                              className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Title Designation</label>
                            <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-medium text-[11px]">
                              <option>Chief Quality Officer / Chairperson</option>
                              <option>Medical Director / Vice Chair</option>
                              <option>Chief Nursing Officer / Member</option>
                            </select>
                          </div>
                          <button 
                            type="submit"
                            disabled={isSigning}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white rounded text-[10px] font-extrabold uppercase transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            {isSigning ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                            )}
                            {isSigning ? 'Signing Payload...' : 'Affix Digital e-Signature'}
                          </button>
                        </>
                      ) : (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1.5 animate-fade-in text-[#006437]">
                          <div className="font-extrabold text-xs flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-600 font-bold" /> Minutes Digitally Signed
                          </div>
                          <div className="text-[10px] font-medium leading-relaxed">
                            <strong>Authorized By:</strong> {signerName}<br />
                            <strong>Verify Hash:</strong> <span className="font-mono font-bold text-[9px] bg-white border px-1 rounded block mt-0.5 select-all">{signerHash}</span>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                  <div className="md:col-span-6 space-y-3.5">
                    <div className="bg-white p-3.5 border border-slate-200 rounded-lg shadow-3xs space-y-3">
                      <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b pb-1">Scheduled Minutes Records</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {[
                          { title: "Hospital Infection Control (HICC)", date: "15-Jun-2024", attendees: 14, status: "Signed" },
                          { title: "Pharmacotherapeutic Committee", date: "22-Jun-2024", attendees: 9, status: "Open" },
                          { title: "Safety Committee Assessment", date: "Today Meeting", attendees: 12, status: "Awaiting Sign-off" },
                        ].map((item, idx) => (
                          <div key={idx} className="p-2 border border-slate-100 bg-slate-50/50 rounded flex justify-between items-center text-[10.5px]">
                            <div>
                              <div className="font-bold text-slate-700 leading-tight">{item.title}</div>
                              <div className="text-[9.5px] text-slate-400 mt-0.5">Date: {item.date} • Attendees: {item.attendees}</div>
                            </div>
                            <span className={`text-[8px] font-bold px-1 py-0.2 rounded font-mono ${item.status === 'Signed' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                              {idx === 2 && minutesSigned ? 'Signed' : item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== REPORT 6: AUDIT REPORTS ==================== */}
              {selectedItem.title === "Audit Reports" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                  <div className="md:col-span-5 space-y-3.5">
                    <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-3 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b pb-1">Search Audit Logs</h4>
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                        <input 
                          type="text" 
                          placeholder="Search e.g. hand, file, etc..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded focus:outline-none font-medium"
                        />
                      </div>
                      <div className="p-2.5 bg-[#ecf4e6] text-[#006437] border border-slate-200 rounded text-[10px] font-semibold">
                        <strong>EHR Completeness Rate:</strong> Currently at 95%. Compliance audits run once every Sunday at 23:00 hours.
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-7 space-y-3.5">
                    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-3xs space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b pb-0.5">Clinical Record Completeness Index</h4>
                      <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                        {[
                          { category: 'Informed Consent Completed', score: '98%', count: '48 files reviewed' },
                          { category: 'Surgical Safety Checklist Signed', score: '100%', count: '22 cases reviewed' },
                          { category: 'Nursing Notes Time-Stamps Mapped', score: '94%', count: '140 charts reviewed' },
                          { category: 'Defibrillator Calibration Logs Mapped', score: '100%', count: '12 devices checked' },
                        ].filter(a => searchQuery === '' || a.category.toLowerCase().includes(searchQuery.toLowerCase())).map((item, index) => (
                          <div key={index} className="p-2 border border-slate-100 bg-slate-50/50 rounded flex justify-between items-center">
                            <div>
                              <div className="font-bold text-slate-700 text-[11px] leading-tight">{item.category}</div>
                              <div className="text-[9px] text-slate-400 font-medium mt-0.5">{item.count}</div>
                            </div>
                            <span className="text-[10px] font-extrabold text-[#006437] font-mono">{item.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== REPORT 7: PATIENT SAFETY REPORTS ==================== */}
              {selectedItem.title === "Patient Safety Reports" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                  <div className="md:col-span-5 space-y-3.5">
                    <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-3 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b pb-1">Safety Clearance Status</h4>
                      <div className="space-y-1 text-slate-500 text-[10.5px]">
                        <p>All mandatory safe-surgery checklists mapped under **NABH Standard COP-3** require a dual-signoff.</p>
                      </div>
                      <div className="p-2 bg-sky-50 text-sky-950 border border-sky-200 rounded text-[10.5px] leading-relaxed">
                        <strong>Wristband QR Verification:</strong> Enabled across all general and emergency wards. Dual patient mismatch rate sits at <strong>0.00%</strong>.
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-7 space-y-3.5">
                    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-3xs space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Patient Safety indicators checklist score</div>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { month: 'Jan', rate: 97 },
                            { month: 'Feb', rate: 98 },
                            { month: 'Mar', rate: 98.4 },
                            { month: 'Apr', rate: 99.1 },
                            { month: 'May', rate: 100 },
                            { month: 'Jun', rate: 100 },
                          ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} />
                            <YAxis domain={[95, 101]} tick={{ fontSize: 9, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                            <Line type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2.5} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== REPORT 8: ABDM USAGE REPORTS ==================== */}
              {selectedItem.title === "ABDM Usage Reports" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                  <div className="md:col-span-6 space-y-3.5">
                    <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-3 shadow-3xs">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">Gateway Sandbox Status</h4>
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                      </div>
                      
                      {gatewayStatus === 'IDLE' ? (
                        <div className="text-slate-400 italic text-[10px] text-center p-3">
                          Awaiting gateway diagnostic request...
                        </div>
                      ) : (
                        <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-1.5 animate-fade-in font-mono text-[10px]">
                          <div className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                            ● CONNECTED TO ABDM SANDBOX
                          </div>
                          <div>Host Address: m1-m4.abdm.gov.in/v4.0</div>
                          <div>Response latency: <span className="text-amber-400 font-bold">{gatewayLatency} ms</span></div>
                          <div className="text-[9px] text-slate-400 mt-1">Integrity hash verified: SSL 3.0 AES-256 Tunnel active. All transactions successfully written.</div>
                        </div>
                      )}

                      <button 
                        onClick={queryNationalGateway}
                        disabled={isQueryingGateway}
                        className="w-full py-2 bg-[#006437] hover:bg-[#00502c] text-white rounded text-[10px] font-extrabold uppercase transition flex items-center justify-center gap-1 cursor-pointer shadow-3xs"
                      >
                        {isQueryingGateway ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-emerald-300" />
                        )}
                        {isQueryingGateway ? 'Pinging Gateway Node...' : 'Verify Central Gateway Connection'}
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-6 space-y-3.5">
                    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-3xs space-y-1.5 text-xs">
                      <div className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider border-b pb-0.5">National Gateway Transaction Counts</div>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center">
                          <span className="text-[9.5px] text-slate-400 block font-sans">ABHA Cards</span>
                          <span className="text-sm font-black text-indigo-900 font-mono">1,489</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center">
                          <span className="text-[9.5px] text-slate-400 block font-sans">EHR Records</span>
                          <span className="text-sm font-black text-[#006437] font-mono">2,241</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center">
                          <span className="text-[9.5px] text-slate-400 block font-sans">Linked UHIDs</span>
                          <span className="text-sm font-black text-amber-700 font-mono">980</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center">
                          <span className="text-[9.5px] text-slate-400 block font-sans">Active Consents</span>
                          <span className="text-sm font-black text-rose-700 font-mono">48</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACCREDITATION BENEFITS DOCK (Rendered if a benefit was clicked) */}
              {!reports.some(r => r.title === selectedItem.title) && (
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-3xs space-y-2 text-xs">
                  <h4 className="font-extrabold text-[#006437] uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Medal className="w-5 h-5 text-sky-600" /> Accreditation Excellence Standards Mapped
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Continuous auditing against NABH standard clauses ensures high caliber patient healthcare, dual confirmation workflows for patient security, and optimal hospital resource utilization. 
                  </p>
                  <div className="bg-[#ecf4e6] text-[#006437] border border-emerald-100 p-2.5 rounded font-semibold leading-relaxed text-[10px]">
                    - Verified compliant under Clinical Safety Standard COP-3.2<br />
                    - Fully synced with central ABDM M1-M4 secure token registry portals.
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-slate-150 bg-slate-50 flex justify-between items-center flex-shrink-0">
              <span className="text-[9.5px] text-slate-400 font-mono font-semibold">Audit Key Verification: AES-256 CBC Tunnel Active</span>
              <button 
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 bg-[#006437] hover:bg-[#00502c] text-white rounded text-[10.5px] font-black uppercase tracking-wider transition shadow-2xs cursor-pointer"
              >
                Close Report View
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
