import React, { useState } from 'react';
import { INTEGRATIONS, KEY_FEATURES, TECH_STACK } from '../data/initialData';
import { 
  Database, Network, Heart, DollarSign, ShieldCheck, MessageSquare, Cpu, Globe,
  ArrowRight, Sparkles, Terminal, X, HelpCircle, Activity, Landmark, Workflow
} from 'lucide-react';

export default function IntegrationsFeaturesWidget() {
  const [selectedTechDetail, setSelectedTechDetail] = useState<{ title: string; desc: string } | null>(null);

  // Workflow steps corresponding to standard ABDM/NABH loops
  const workflowSteps = [
    { id: 1, label: "Patient Registration", sub: "ABHA Card Creation", detail: "Patient registers using their Aadhaar/Mobile number, generates an ABHA card, and links their internal hospital UHID." },
    { id: 2, label: "OPD/IPD Consultation", sub: "Doctor Clinical Vitals", detail: "The doctor reviews historical PHR data, captures vitals, logs signs, and structures clinical diagnoses." },
    { id: 3, label: "Investigation", sub: "LIS / RIS Analyzers", detail: "Diagnostic orders are sent to laboratory or radiology systems electronically. Results are auto-saved on EHR." },
    { id: 4, label: "Treatment", sub: "Nursing Care Cards", detail: "Nurses administer drugs, capture continuous ward data, and log daily observations under active alarm surveillance." },
    { id: 5, label: "e-Prescription", sub: "Digital Signing", detail: "Doctor enters medications and digitally signs the prescription with unique compliance keys." },
    { id: 6, label: "Discharge & Billing", sub: "TPA & PHR Sync", detail: "Items are compiled, corporative claims processed, and the discharge report is pushed securely to the national PHR gateway." }
  ];

  const handleTechClick = (title: string, desc: string) => {
    setSelectedTechDetail({ title, desc });
  };

  const getIntegrationIcon = (name: string) => {
    if (name.includes("LIS")) return <Database className="w-3.5 h-3.5 text-blue-500" />;
    if (name.includes("HL7")) return <Network className="w-3.5 h-3.5 text-indigo-500" />;
    if (name.includes("ABDM")) return <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />;
    if (name.includes("Payment")) return <DollarSign className="w-3.5 h-3.5 text-emerald-500" />;
    if (name.includes("Insurance")) return <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />;
    if (name.includes("SMS")) return <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />;
    if (name.includes("Device")) return <Cpu className="w-3.5 h-3.5 text-purple-500" />;
    return <Globe className="w-3.5 h-3.5 text-slate-500" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 text-xs">
      
      {/* Column 1: Integrations (Left - 3 cols) */}
      <div className="xl:col-span-3 bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
        <div className="border-b border-slate-100 pb-1.5 mb-2.5">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-sky-700" /> System Integrations
          </h4>
        </div>
        
        <div className="space-y-1.5 flex-1">
          {INTEGRATIONS.map((integ, idx) => (
            <button
              key={idx}
              onClick={() => handleTechClick(integ.name, integ.desc)}
              className="w-full text-left p-1.5 rounded border border-slate-50 hover:border-sky-300 hover:bg-sky-50/30 transition flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                {getIntegrationIcon(integ.name)}
                <span className="font-semibold text-slate-700 truncate">{integ.name}</span>
              </div>
              <HelpCircle className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Column 2: Key Features (Middle Left - 3 cols) */}
      <div className="xl:col-span-3 bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
        <div className="border-b border-slate-100 pb-1.5 mb-2.5">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-700" /> Key Features
          </h4>
        </div>

        <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[290px] pr-1">
          {KEY_FEATURES.map((feat, idx) => (
            <button
              key={idx}
              onClick={() => handleTechClick(feat.name, feat.desc)}
              className="w-full text-left p-1.5 rounded border border-slate-50 hover:border-emerald-300 hover:bg-emerald-50/30 transition flex items-center justify-between gap-1"
            >
              <span className="font-semibold text-slate-700 truncate">{feat.name}</span>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded font-mono">Info</span>
            </button>
          ))}
        </div>
      </div>

      {/* Column 3: Sample Workflow Flow diagram (Middle Right - 4 cols) */}
      <div className="xl:col-span-4 bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
        <div className="border-b border-slate-100 pb-1.5 mb-2.5">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Workflow className="w-4 h-4 text-indigo-700" /> Clinical & ABDM Workflow
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-2 flex-1">
          {workflowSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => handleTechClick(step.label, step.detail)}
              className="p-2 border border-slate-100 bg-slate-50 hover:bg-indigo-50/30 hover:border-indigo-300 rounded-lg text-left transition flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-slate-400 font-mono text-[10px]">STEP {step.id}</span>
                  {idx < 5 && <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition" />}
                </div>
                <div className="font-bold text-slate-800 text-[11px] leading-tight font-sans">{step.label}</div>
              </div>
              <div className="text-[10px] text-slate-400 font-medium font-sans truncate mt-1">{step.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Column 4: Technology Stack (Right - 2 cols) */}
      <div className="xl:col-span-2 bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
        <div className="border-b border-slate-100 pb-1.5 mb-2.5">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-slate-700" /> Tech Stack
          </h4>
        </div>

        <div className="space-y-2 flex-1 flex flex-col justify-center font-mono text-[10.5px]">
          <div>
            <span className="text-slate-400 block font-sans">Frontend</span>
            <span className="font-semibold text-indigo-900">{TECH_STACK.Frontend}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-sans">Backend</span>
            <span className="font-semibold text-indigo-900">{TECH_STACK.Backend}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-sans">Database</span>
            <span className="font-semibold text-indigo-900">{TECH_STACK.Database}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-sans">Deployment</span>
            <span className="font-semibold text-indigo-900">{TECH_STACK.Deployment}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-sans">Security</span>
            <span className="font-semibold text-indigo-900">{TECH_STACK.Security}</span>
          </div>
        </div>
      </div>

      {/* Info Overlay Box if clicked */}
      {selectedTechDetail && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden text-xs">
            <div className="bg-slate-900 text-white px-4 py-2.5 font-bold flex justify-between items-center">
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-yellow-400" /> Technical Specification</span>
              <button onClick={() => setSelectedTechDetail(null)} className="text-white hover:text-red-200 font-bold text-sm">&times;</button>
            </div>
            <div className="p-4 space-y-2 font-sans">
              <h4 className="font-bold text-slate-800 text-sm">{selectedTechDetail.title}</h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">{selectedTechDetail.desc}</p>
              
              <div className="bg-slate-50 border border-slate-100 p-2 rounded text-[10px] text-slate-500 font-mono leading-relaxed">
                <strong>ABDM Compliant Protocol:</strong><br />
                - JSON schema structured payloads<br />
                - SHA-256 integrity logs hash verified<br />
                - M1-M4 secure token-handshake gateway
              </div>
            </div>
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedTechDetail(null)}
                className="px-3 py-1 bg-slate-800 text-white rounded font-bold hover:bg-slate-950 transition"
              >
                Close Spec
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
