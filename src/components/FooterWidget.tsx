import React, { useState } from 'react';
import { 
  FileSpreadsheet, ClipboardCheck, ShieldCheck, FileWarning, CalendarCheck, 
  SearchCode, HeartPulse, BarChart3, Medal, Compass, Sparkles, CheckCircle2, X
} from 'lucide-react';

export default function FooterWidget() {
  const [selectedItem, setSelectedItem] = useState<{ title: string; desc: string; stats?: string } | null>(null);

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

  return (
    <div className="space-y-4">
      {/* Grid containing reports and benefits */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Reports & Analytics Panel (Left 8 columns) */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <FileSpreadsheet className="w-4.5 h-4.5 text-indigo-700" /> Reports & Analytics
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {reports.map((rep, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedItem(rep)}
                className="p-2.5 rounded-lg border border-slate-100 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/25 transition text-center flex flex-col items-center justify-between group h-24"
              >
                <div className="p-1.5 bg-white rounded-lg shadow-3xs group-hover:bg-indigo-50 transition mb-1 flex items-center justify-center">
                  {rep.icon}
                </div>
                <span className="font-bold text-slate-700 text-[10.5px] leading-tight font-sans block">
                  {rep.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Benefits Panel (Right 4 columns) */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
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
                className="p-2.5 rounded-lg border border-slate-100 hover:border-sky-300 bg-slate-50 hover:bg-sky-50/25 transition text-center flex flex-col items-center justify-between group h-24"
              >
                <div className="p-1.5 bg-white rounded-lg shadow-3xs group-hover:bg-sky-50 transition mb-1 flex items-center justify-center">
                  {ben.icon}
                </div>
                <span className="font-bold text-slate-700 text-[10.5px] leading-tight font-sans block">
                  {ben.title}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Info Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden text-xs text-slate-700">
            <div className="bg-gradient-to-r from-[#006437] to-[#70C143] text-white px-4 py-2.5 font-bold flex justify-between items-center">
              <span>Accreditation & Quality Insights</span>
              <button onClick={() => setSelectedItem(null)} className="text-white hover:text-red-200 font-bold text-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-3 font-sans">
              <h4 className="font-bold text-slate-800 text-sm">{selectedItem.title}</h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">{selectedItem.desc}</p>
              
              {selectedItem.stats && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2 rounded text-[10.5px] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Audit Telemetry: {selectedItem.stats}</span>
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedItem(null)}
                className="px-3 py-1 bg-gradient-to-r from-[#006437] to-[#70C143] hover:from-emerald-800 hover:to-green-600 text-white rounded font-bold transition"
              >
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
