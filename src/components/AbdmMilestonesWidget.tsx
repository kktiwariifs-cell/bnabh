import React, { useState } from 'react';
import { ComplianceMilestone, Patient } from '../types';
import { 
  Heart, CheckSquare, Square, RefreshCw, KeyRound, CheckCircle2, 
  Send, ShieldCheck, FileJson, ArrowLeftRight, Sparkles, HelpCircle, ChevronRight 
} from 'lucide-react';

interface AbdmMilestonesWidgetProps {
  milestones: ComplianceMilestone[];
  onToggleMilestone: (id: string) => void;
  selectedPatient: Patient;
  onCollapse?: () => void;
}

export default function AbdmMilestonesWidget({
  milestones,
  onToggleMilestone,
  selectedPatient,
  onCollapse,
}: AbdmMilestonesWidgetProps) {
  const [isContentCollapsed, setIsContentCollapsed] = useState(false);
  const [activeSandboxTab, setActiveSandboxTab] = useState<'Checklist' | 'ABHA' | 'Consent' | 'FHIR'>('Checklist');
  
  // ABHA sandbox states
  const [aadhaarInput, setAadhaarInput] = useState('1234 5678 9012');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedAbhaCard, setGeneratedAbhaCard] = useState<any | null>(null);

  // Consent sandbox states
  const [consentAbhaAddress, setConsentAbhaAddress] = useState(selectedPatient.abhaAddress || 'rahulkumar@abdm');
  const [consentStatus, setConsentStatus] = useState<'Idle' | 'Requested' | 'Approved' | 'Denied'>('Idle');
  const [consentArtifact, setConsentArtifact] = useState<any | null>(null);

  // FHIR validator states
  const [fhirResource, setFhirResource] = useState('Prescription');
  const [fhirOutput, setFhirOutput] = useState<string>('');

  // Group milestones by milestone ID (M1, M2, M3, M4)
  const m1List = milestones.filter(m => m.milestone === 'M1');
  const m2List = milestones.filter(m => m.milestone === 'M2');
  const m3List = milestones.filter(m => m.milestone === 'M3');
  const m4List = milestones.filter(m => m.milestone === 'M4');

  const handleSendOtp = () => {
    if (aadhaarInput.replace(/\s+/g, '').length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar ID.");
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpInput === '123456' || otpInput.length === 6) {
      setOtpVerified(true);
      
      // Generate ABHA card
      const num1 = Math.floor(1000 + Math.random() * 9000);
      const num2 = Math.floor(1000 + Math.random() * 9000);
      const num3 = Math.floor(1000 + Math.random() * 9000);
      const abhaNumber = `91-${num1}-${num2}-${num3}`;
      
      setGeneratedAbhaCard({
        name: selectedPatient.name,
        gender: selectedPatient.gender,
        dob: `${30 - Math.floor(selectedPatient.age/10)}-06-19${90 - (selectedPatient.age % 10)}`,
        abhaNumber,
        abhaAddress: `${selectedPatient.name.toLowerCase().replace(/\s+/g, '')}@abdm`,
        photoText: selectedPatient.name.substring(0, 2).toUpperCase()
      });
    } else {
      alert("Simulated OTP validation: Enter '123456' or any 6-digit PIN to verify.");
    }
  };

  const handleRequestConsent = () => {
    setConsentStatus('Requested');
    setTimeout(() => {
      setConsentStatus('Approved');
      setConsentArtifact({
        consentId: `CON-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "GRANTED",
        purpose: "DIRECT_CARE",
        patient: { abhaId: consentAbhaAddress },
        permissions: {
          accessMode: "VIEW",
          dateRange: { from: "2026-01-01", to: "2026-12-31" },
          hiTypes: ["PRESCRIPTION", "DIAGNOSTIC_REPORT", "DISCHARGE_SUMMARY"]
        },
        signature: "digital_signature_verified_sha256"
      });
    }, 1500);
  };

  const generateFhirBundle = (type: string) => {
    let bundle: any = {
      resourceType: "Bundle",
      type: "document",
      id: `FHIR-BND-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: "Patient/UH00012345",
          resource: {
            resourceType: "Patient",
            id: selectedPatient.uhid,
            name: [{ text: selectedPatient.name }],
            gender: selectedPatient.gender.toLowerCase(),
            telecom: [{ system: "phone", value: selectedPatient.phone }],
            identifier: [
              { system: "https://ndhm.gov.in/abha", value: selectedPatient.abhaId }
            ]
          }
        }
      ]
    };

    if (type === 'Prescription') {
      bundle.entry.push({
        fullUrl: "MedicationRequest/MED-01",
        resource: {
          resourceType: "MedicationRequest",
          status: "active",
          intent: "order",
          medicationCodeableConcept: {
            text: selectedPatient.currentMedications[0] || "Amlodipine 5mg QD"
          },
          subject: { reference: `Patient/${selectedPatient.uhid}` }
        }
      });
    } else if (type === 'DiagnosticReport') {
      bundle.entry.push({
        fullUrl: "DiagnosticReport/REP-01",
        resource: {
          resourceType: "DiagnosticReport",
          status: "final",
          code: { text: "Complete Blood Count (CBC)" },
          subject: { reference: `Patient/${selectedPatient.uhid}` },
          issued: "2026-06-30T10:00:00Z"
        }
      });
    }

    setFhirOutput(JSON.stringify(bundle, null, 2));
  };

  return (
    <div className="bg-[#85addb] text-slate-950 rounded-lg shadow-md border border-[#628bbb] overflow-hidden flex flex-col h-full font-sans transition-all duration-300">
      
      {/* Widget Header (Click to collapse/expand) */}
      <div 
        onClick={() => setIsContentCollapsed(!isContentCollapsed)}
        className="bg-[#7098c7] border-b border-[#628bbb] px-4 py-3 flex justify-between items-center flex-shrink-0 cursor-pointer select-none hover:bg-[#628bbb]/80 transition-all"
      >
        <h3 className="font-extrabold text-xs uppercase text-slate-950 tracking-wider flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-600 fill-rose-600 animate-pulse" /> ABDM Milestone Features
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] bg-slate-950 text-emerald-300 border border-slate-800 px-2 py-0.5 rounded font-bold font-mono">
            Ready M1–M4
          </span>
          <button
            className="p-1 rounded hover:bg-[#628bbb] text-slate-900 transition"
            title={isContentCollapsed ? "Expand Checklist" : "Collapse Checklist"}
          >
            {isContentCollapsed ? (
              <ChevronRight className="w-4 h-4 transform rotate-90 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {!isContentCollapsed && (
        <>
          {/* Sandbox Tabs Navigator */}
          <div className="grid grid-cols-4 text-center bg-[#7a9fcb] border-b border-[#628bbb] text-[10.5px] font-black tracking-wide">
            {(['Checklist', 'ABHA', 'Consent', 'FHIR'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveSandboxTab(tab);
                  if (tab === 'FHIR') generateFhirBundle(fhirResource);
                }}
                className={`py-2 border-r last:border-0 border-[#628bbb] transition uppercase ${activeSandboxTab === tab ? 'bg-white/35 text-slate-950 border-b-2 border-b-indigo-950' : 'text-slate-900 hover:text-slate-950 hover:bg-white/10'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main Sandbox Interactive Display */}
          <div className="p-4 flex-1 overflow-y-auto text-xs">
            
            {/* Tab 1: Checklist Overview */}
            {activeSandboxTab === 'Checklist' && (
              <div className="space-y-4">
                
                {/* M1 */}
                <div className="space-y-1.5">
                  <div className="font-black text-indigo-950 text-[10.5px] uppercase tracking-wider border-b border-[#628bbb] pb-0.5">
                    M1 - ABDM READINESS (Gateway)
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {m1List.map(item => (
                      <button
                        key={item.id}
                        onClick={() => onToggleMilestone(item.id)}
                        className="flex items-start gap-1.5 text-left text-slate-900 hover:text-black py-0.5"
                        title={item.description}
                      >
                        {item.checked ? <CheckSquare className="w-3.5 h-3.5 text-indigo-950 mt-0.5 flex-shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-700 mt-0.5 flex-shrink-0" />}
                        <span className="leading-tight font-sans text-[11px] font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* M2 */}
                <div className="space-y-1.5">
                  <div className="font-black text-indigo-950 text-[10.5px] uppercase tracking-wider border-b border-[#628bbb] pb-0.5">
                    M2 - ABHA LINKING CAPABILITY
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {m2List.map(item => (
                      <button
                        key={item.id}
                        onClick={() => onToggleMilestone(item.id)}
                        className="flex items-start gap-1.5 text-left text-slate-900 hover:text-black py-0.5"
                        title={item.description}
                      >
                        {item.checked ? <CheckSquare className="w-3.5 h-3.5 text-indigo-950 mt-0.5 flex-shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-700 mt-0.5 flex-shrink-0" />}
                        <span className="leading-tight font-sans text-[11px] font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* M3 */}
                <div className="space-y-1.5">
                  <div className="font-black text-indigo-950 text-[10.5px] uppercase tracking-wider border-b border-[#628bbb] pb-0.5">
                    M3 - ACCESS & EXCHANGE (EHR APIs)
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {m3List.map(item => (
                      <button
                        key={item.id}
                        onClick={() => onToggleMilestone(item.id)}
                        className="flex items-start gap-1.5 text-left text-slate-900 hover:text-black py-0.5"
                        title={item.description}
                      >
                        {item.checked ? <CheckSquare className="w-3.5 h-3.5 text-indigo-950 mt-0.5 flex-shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-700 mt-0.5 flex-shrink-0" />}
                        <span className="leading-tight font-sans text-[11px] font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* M4 */}
                <div className="space-y-1.5">
                  <div className="font-black text-indigo-950 text-[10.5px] uppercase tracking-wider border-b border-[#628bbb] pb-0.5">
                    M4 - ADVANCED EXCHANGE & HIE
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {m4List.map(item => (
                      <button
                        key={item.id}
                        onClick={() => onToggleMilestone(item.id)}
                        className="flex items-start gap-1.5 text-left text-slate-900 hover:text-black py-0.5"
                        title={item.description}
                      >
                        {item.checked ? <CheckSquare className="w-3.5 h-3.5 text-indigo-950 mt-0.5 flex-shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-700 mt-0.5 flex-shrink-0" />}
                        <span className="leading-tight font-sans text-[11px] font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: ABHA Card Generator Sandbox */}
            {activeSandboxTab === 'ABHA' && (
              <div className="space-y-3 font-sans">
                <div className="font-black text-indigo-950 uppercase tracking-wide text-[10px] border-b border-[#628bbb] pb-1">
                  Aadhaar-to-ABHA Onboarding Sandbox
                </div>

                {!otpVerified ? (
                  <div className="space-y-3 bg-white/70 p-3 border border-[#628bbb]/40 rounded-lg text-slate-900">
                    <div className="text-[11px] text-slate-850 font-medium">
                      Onboard <strong>{selectedPatient.name}</strong> securely into the national ABDM grid using mock KYC verification.
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-900 font-bold mb-1">Enter Patient Aadhaar Number</label>
                      <input 
                        type="text" 
                        value={aadhaarInput}
                        onChange={e => setAadhaarInput(e.target.value)}
                        disabled={otpSent}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-900 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    {!otpSent ? (
                      <button
                        onClick={handleSendOtp}
                        className="w-full py-1.5 bg-indigo-950 hover:bg-slate-900 text-white font-bold rounded flex items-center justify-center gap-1 transition"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Request Aadhaar OTP
                      </button>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-1.5 rounded text-[10.5px] font-semibold">
                          OTP sent to {selectedPatient.phone.substring(0, 3)}***{selectedPatient.phone.substring(7)}
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-900 font-bold mb-1">Enter 6-Digit Verification Code</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 123456"
                            value={otpInput}
                            onChange={e => setOtpInput(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-900 text-center font-mono font-bold focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setOtpSent(false)}
                            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded font-bold transition"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleVerifyOtp}
                            className="flex-1 py-1.5 bg-indigo-950 hover:bg-slate-900 text-white font-bold rounded transition"
                          >
                            Verify OTP
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-emerald-950 font-bold bg-emerald-100 p-2 border border-emerald-300 rounded">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-800" /> ABHA Created Successfully</span>
                      <button 
                        onClick={() => {
                          setOtpVerified(false);
                          setOtpSent(false);
                          setOtpInput('');
                          setGeneratedAbhaCard(null);
                        }}
                        className="text-[10px] underline hover:text-emerald-900"
                      >
                        Reset
                      </button>
                    </div>

                    {generatedAbhaCard && (
                      /* Beautiful Simulated ABHA card representation */
                      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-lg border border-indigo-800 p-3 shadow-lg space-y-2 relative overflow-hidden">
                        {/* Background logo effect */}
                        <div className="absolute right-0 bottom-0 opacity-10 font-bold text-7xl font-sans font-mono pointer-events-none select-none">
                          NHA
                        </div>

                        <div className="flex justify-between border-b border-teal-500/20 pb-1.5">
                          <div>
                            <h5 className="font-extrabold text-[10px] text-teal-400 tracking-wider">HEALTH ID - ABHA</h5>
                            <p className="text-[8px] text-slate-400 font-semibold uppercase">National Health Authority</p>
                          </div>
                          <span className="text-[11px] font-extrabold text-white">MINISTRY OF HEALTH</span>
                        </div>

                        <div className="flex gap-3 pt-1">
                          {/* Photo placeholder */}
                          <div className="w-12 h-14 bg-teal-500/20 rounded-md border border-teal-500/30 flex flex-col items-center justify-center flex-shrink-0 text-teal-300 font-bold text-sm">
                            {generatedAbhaCard.photoText}
                            <span className="text-[6px] text-slate-400 uppercase mt-1 leading-none font-sans">Verified</span>
                          </div>

                          <div className="flex-1 min-w-0 text-[10px]">
                            <p className="font-extrabold truncate text-[11px] text-white">{generatedAbhaCard.name}</p>
                            <p className="text-[9px] text-slate-300">ABHA Address: <span className="font-mono text-teal-300">{generatedAbhaCard.abhaAddress}</span></p>
                            <p className="text-[9px] text-slate-300">ABHA Number: <span className="font-mono text-teal-300 font-bold">{generatedAbhaCard.abhaNumber}</span></p>
                            
                            <div className="grid grid-cols-2 gap-2 mt-1.5 text-[8.5px] border-t border-teal-500/10 pt-1 text-slate-400">
                              <div>
                                <span className="block text-[7px] text-slate-500 uppercase">Gender</span>
                                <span className="font-semibold text-slate-300">{generatedAbhaCard.gender}</span>
                              </div>
                              <div>
                                <span className="block text-[7px] text-slate-500 uppercase">DOB</span>
                                <span className="font-semibold text-slate-300 font-mono">{generatedAbhaCard.dob}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Consent Manager Sandbox */}
            {activeSandboxTab === 'Consent' && (
              <div className="space-y-3 font-sans">
                <div className="font-black text-indigo-950 uppercase tracking-wide text-[10px] border-b border-[#628bbb] pb-1">
                  Gateway Consent Artifact Requestor
                </div>

                <div className="bg-white/70 p-3 border border-[#628bbb]/40 rounded-lg space-y-3 text-slate-900">
                  <div>
                    <label className="block text-[10px] text-slate-900 font-bold mb-1">Enter Patient ABHA Address</label>
                    <input 
                      type="text" 
                      value={consentAbhaAddress}
                      onChange={e => setConsentAbhaAddress(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-mono font-bold focus:outline-none"
                    />
                  </div>

                  {consentStatus === 'Idle' && (
                    <button
                      onClick={handleRequestConsent}
                      className="w-full py-1.5 bg-indigo-950 hover:bg-slate-900 text-white font-bold rounded flex items-center justify-center gap-1 transition"
                    >
                      <Send className="w-3.5 h-3.5" /> Request Consent Artifact
                    </button>
                  )}

                  {consentStatus === 'Requested' && (
                    <div className="py-4 text-center space-y-2">
                      <div className="w-5 h-5 border-2 border-indigo-950 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-slate-800 animate-pulse text-[10px] font-bold">Awaiting patient approval on PHR Locker App...</p>
                    </div>
                  )}

                  {consentStatus === 'Approved' && consentArtifact && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1 text-emerald-950 font-bold bg-emerald-100 p-1.5 border border-emerald-300 rounded">
                        <ShieldCheck className="w-4 h-4 text-emerald-800" /> Consent Signed & Granted
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded p-2 text-[10px] font-mono overflow-x-auto max-h-40 text-slate-100">
                        <pre className="text-slate-100 leading-tight">{JSON.stringify(consentArtifact, null, 2)}</pre>
                      </div>

                      <button
                        onClick={() => setConsentStatus('Idle')}
                        className="w-full py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold rounded"
                      >
                        Reset Sandbox
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: FHIR Resource Bundle Generator */}
            {activeSandboxTab === 'FHIR' && (
              <div className="space-y-3 font-sans">
                <div className="font-black text-indigo-950 uppercase tracking-wide text-[10px] border-b border-[#628bbb] pb-1">
                  HL7 FHIR v4 Resource Bundle Builder
                </div>

                <div className="bg-white/70 p-3 border border-[#628bbb]/40 rounded-lg space-y-3 text-slate-900">
                  <div>
                    <label className="block text-[10px] text-slate-900 font-bold mb-1">Select Document Category</label>
                    <select
                      value={fhirResource}
                      onChange={e => {
                        setFhirResource(e.target.value);
                        generateFhirBundle(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-bold focus:outline-none"
                    >
                      <option value="Prescription">e-Prescription (MedicationRequest)</option>
                      <option value="DiagnosticReport">Laboratory diagnostic report (DiagnosticReport)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] text-slate-900 font-bold flex justify-between uppercase">
                      <span>FHIR v4 JSON Payload</span>
                      <span className="text-indigo-950 font-black">Validated</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-850 rounded p-2 text-[9.5px] font-mono overflow-x-auto max-h-36 text-slate-100 leading-tight">
                      <pre className="text-slate-100">{fhirOutput}</pre>
                    </div>
                  </div>

                  <button
                    onClick={() => generateFhirBundle(fhirResource)}
                    className="w-full py-1.5 bg-indigo-950 hover:bg-slate-900 text-white font-bold rounded flex items-center justify-center gap-1 transition"
                  >
                    <FileJson className="w-3.5 h-3.5 text-slate-200" /> Re-Generate FHIR Bundle
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Network Sync Flow Widget (ABDM INTEGRATION flow from image) */}
          <div className="bg-[#7098c7] p-3.5 border-t border-[#628bbb] space-y-2">
            <div className="text-[10px] font-black text-slate-950 tracking-wider uppercase text-center border-b border-[#628bbb]/60 pb-1">
              ABDM Integration Node Network
            </div>

            <div className="flex items-center justify-between text-center text-[9px] font-bold tracking-tight py-1 relative">
              
              <div className="bg-white/70 p-1.5 rounded-lg border border-[#628bbb]/40 w-[58px] text-slate-900">
                <span className="text-indigo-950 font-black block">ABHA</span>
                <span className="text-[7.5px] text-slate-700">Patient ID</span>
              </div>

              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />

              <div className="bg-white/70 p-1.5 rounded-lg border border-[#628bbb]/40 w-[58px] text-slate-900">
                <span className="text-indigo-950 font-black block">HFR</span>
                <span className="text-[7.5px] text-slate-700">Facility Reg</span>
              </div>

              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />

              <div className="bg-white/70 p-1.5 rounded-lg border border-[#628bbb]/40 w-[58px] text-slate-900">
                <span className="text-indigo-950 font-black block">HPR</span>
                <span className="text-[7.5px] text-slate-700">Doctor Reg</span>
              </div>

              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />

              <div className="bg-white/70 p-1.5 rounded-lg border border-[#628bbb]/40 w-[58px] text-slate-900">
                <span className="text-indigo-950 font-black block">PHR</span>
                <span className="text-[7.5px] text-slate-700">Health Locker</span>
              </div>
            </div>

            <div className="bg-white/40 p-1.5 rounded border border-[#628bbb]/30 text-[9px] text-slate-950 text-center font-bold font-sans flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-800" /> National Health Authority Gateways Synchronized
            </div>
          </div>
        </>
      )}

    </div>
  );
}
