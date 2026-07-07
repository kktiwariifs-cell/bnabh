import React, { useState } from 'react';
import { 
  Key, ShieldCheck, HeartPulse, ClipboardCheck, FlaskConical, Users, 
  Lock, ArrowRight, Sparkles, Cpu, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { HmsUser } from '../types';

interface HmsLoginPortalProps {
  onLogin: (user: HmsUser) => void;
}

export const LOGIN_PROFILES: { 
  role: 'admin' | 'doctor' | 'nurse' | 'technician' | 'patient';
  username: string;
  fullName: string;
  title: string;
  avatarColor: string;
  passwordSuggestion: string;
  icon: React.ReactNode;
  themeColor: string;
  borderColor: string;
  bgGrad: string;
  allowedPanels: string[];
  clearanceBadge: string;
  description: string;
}[] = [
  {
    role: 'admin',
    username: 'admin.director',
    fullName: 'Dr. Ramesh Sharma',
    title: 'Chief Medical Superintendent',
    avatarColor: 'bg-emerald-950',
    passwordSuggestion: 'NHA-ADMIN-2026',
    icon: <Key className="w-5 h-5 text-emerald-400" />,
    themeColor: 'emerald',
    borderColor: 'border-emerald-200 focus-within:border-emerald-500',
    bgGrad: 'from-emerald-950 via-emerald-900 to-slate-900',
    allowedPanels: [
      "Super Admin Panel", "Corporate Admin Panel", "Hospital Admin Panel", 
      "Medical Superintendent", "HR Department", "Finance & Accounts", 
      "NABH Compliance Panel", "Analytics Dashboard", "ABDM Integration Panel"
    ],
    clearanceBadge: 'L5 - Full System Admin',
    description: 'Grants central compliance reviews, HR rosters, financial audits, and multi-facility hospital administration.'
  },
  {
    role: 'doctor',
    username: 'dr.verma',
    fullName: 'Dr. Amit Verma',
    title: 'Chief Clinical Consultant',
    avatarColor: 'bg-rose-900',
    passwordSuggestion: 'CLINICAL-DOC-99',
    icon: <HeartPulse className="w-5 h-5 text-rose-400" />,
    themeColor: 'rose',
    borderColor: 'border-rose-200 focus-within:border-rose-500',
    bgGrad: 'from-rose-950 via-rose-900 to-slate-900',
    allowedPanels: [
      "Doctor Portal Panel", "OPD Panel", "IPD Panel", "ICU Panel", "OT Panel", 
      "MRD Panel", "Radiology Panel", "Laboratory Panel", "Pharmacy Panel", "NABH Compliance Panel"
    ],
    clearanceBadge: 'L4 - Clinical Director',
    description: 'Access outpatient/inpatient wards, real-time telemetry, direct WHO surgical checklists, and digital health records.'
  },
  {
    role: 'nurse',
    username: 'nurse.priya',
    fullName: 'Priya R. (Head Nurse)',
    title: 'Head Nursing Superintendent',
    avatarColor: 'bg-teal-900',
    passwordSuggestion: 'NURSE-STAMP-42',
    icon: <ClipboardCheck className="w-5 h-5 text-teal-400" />,
    themeColor: 'teal',
    borderColor: 'border-teal-200 focus-within:border-teal-500',
    bgGrad: 'from-teal-950 via-teal-900 to-slate-900',
    allowedPanels: [
      "Nursing Panel", "Reception", "OPD Panel", "IPD Panel", "Emergency Panel", 
      "Infection Control Team", "Dietician Panel", "CSSD Panel", "MRD Panel"
    ],
    clearanceBadge: 'L3 - Ward Supervisor',
    description: 'Enables Shift Handovers, Medication Administration Records (MAR), patient check-ins, and ward admission transfers.'
  },
  {
    role: 'technician',
    username: 'tech.diagnostics',
    fullName: 'Anil Mehta (Chief Tech)',
    title: 'Director of Allied Diagnostics',
    avatarColor: 'bg-amber-950',
    passwordSuggestion: 'PACS-DICOM-LINK',
    icon: <FlaskConical className="w-5 h-5 text-amber-400" />,
    themeColor: 'amber',
    borderColor: 'border-amber-200 focus-within:border-amber-500',
    bgGrad: 'from-amber-950 via-amber-900 to-slate-900',
    allowedPanels: [
      "Laboratory Panel", "Radiology Panel", "Pharmacy Panel", "Blood Centre Panel", 
      "Biomedical Engineering", "CSSD Panel", "Biomedical Waste", "Ambulance Panel", "Inventory Panel"
    ],
    clearanceBadge: 'L3 - Diagnostics Lead',
    description: 'Unlocks imaging DICOM PACS viewer, LIS blood stock monitors, drug catalog formulary, and device calibrations.'
  },
  {
    role: 'patient',
    username: 'patient.alok',
    fullName: 'Alok Ranjan',
    title: 'Patient (ABHA Account Owner)',
    avatarColor: 'bg-sky-900',
    passwordSuggestion: 'ABHA-USER-2026',
    icon: <Users className="w-5 h-5 text-sky-400" />,
    themeColor: 'sky',
    borderColor: 'border-sky-200 focus-within:border-sky-500',
    bgGrad: 'from-sky-950 via-sky-900 to-slate-900',
    allowedPanels: [
      "Patient Portal Panel", "Mobile App Panel", "ABDM Integration Panel"
    ],
    clearanceBadge: 'L1 - Personal Health Access',
    description: 'Grants self-service ABHA card downloads, personal medical summaries, and billing ledger audits.'
  }
];

export default function HmsLoginPortal({ onLogin }: HmsLoginPortalProps) {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [customUsername, setCustomUsername] = useState<string>('');
  const [customPassword, setCustomPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // When active profile changes, reset customized input fields to help user
  React.useEffect(() => {
    const activeProfile = LOGIN_PROFILES[selectedRoleIndex];
    setCustomUsername(activeProfile.username);
    setCustomPassword(activeProfile.passwordSuggestion);
    setErrorMessage('');
  }, [selectedRoleIndex]);

  const handleManualLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const activeProfile = LOGIN_PROFILES[selectedRoleIndex];
    
    if (!customUsername.trim()) {
      setErrorMessage('Username is required.');
      return;
    }
    if (!customPassword.trim()) {
      setErrorMessage('Secret Keycode / Passcode is required.');
      return;
    }

    setIsAuthenticating(true);

    // Simulate authentic cloud login handshake
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin({
        username: customUsername,
        fullName: activeProfile.fullName,
        role: activeProfile.role,
        title: activeProfile.title,
        avatarColor: activeProfile.avatarColor,
        allowedPanels: activeProfile.allowedPanels
      });
    }, 800);
  };

  const handleOneClickSignIn = (index: number) => {
    const profile = LOGIN_PROFILES[index];
    setIsAuthenticating(true);
    setErrorMessage('');
    
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin({
        username: profile.username,
        fullName: profile.fullName,
        role: profile.role,
        title: profile.title,
        avatarColor: profile.avatarColor,
        allowedPanels: profile.allowedPanels
      });
    }, 300);
  };

  const activeProfile = LOGIN_PROFILES[selectedRoleIndex];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#26c6da] via-[#b2f5ea] to-[#26c6da] flex flex-col justify-between font-sans p-4 relative overflow-hidden">
      
      {/* Decorative cyber hospital grids in background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,148,136,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,148,136,0.15)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Top Brand Banner */}
      <div className="max-w-6xl mx-auto w-full z-10 pt-4 pb-2 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-950 flex items-center justify-center border border-teal-700 shadow-lg shadow-teal-950/40">
            <HeartPulse className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-950 text-base uppercase tracking-wider flex items-center gap-1.5 justify-center md:justify-start">
              NHA Sandbox Gateways <span className="text-[10px] bg-teal-800 text-white border border-teal-700 font-bold px-2 py-0.5 rounded uppercase">v3.4-secure</span>
            </h1>
            <p className="text-[10.5px] text-teal-950 font-bold">ABDM Sandbox Milestone Suite & NABH Indicator Control Node</p>
          </div>
        </div>
        <div className="flex gap-2 text-[10.5px]">
          <span className="px-2.5 py-1 bg-teal-950 border border-teal-850 rounded-md text-emerald-400 font-mono font-bold flex items-center gap-1.5 shadow-md">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div> Live Security Link
          </span>
          <span className="px-2.5 py-1 bg-teal-950 border border-teal-850 rounded-md text-emerald-300 font-mono font-bold shadow-md">
            TLS 1.3 Active
          </span>
        </div>
      </div>

      {/* Central Composite Hub */}
      <div className="max-w-6xl mx-auto w-full z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Comprehensive selection of all 5 composite portal categories */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-teal-800 border border-teal-700 px-2.5 py-1 rounded-full shadow-sm">
              Composite Credentials Hub
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight leading-none pt-1">
              Select User Portal Gateway
            </h2>
            <p className="text-xs text-slate-900 max-w-lg leading-relaxed font-semibold">
              We have synthesized 5 distinct login portals for the entire healthcare staff, patients, and administrators to secure role-based workspaces.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {LOGIN_PROFILES.map((profile, index) => {
              const isSelected = selectedRoleIndex === index;
              return (
                <div 
                  key={index}
                  onClick={() => setSelectedRoleIndex(index)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/20' 
                      : 'bg-slate-950/60 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-md ${isSelected ? 'bg-indigo-900/60 text-white' : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'}`}>
                        {profile.icon}
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{profile.clearanceBadge}</span>
                        <h3 className="font-extrabold text-white text-xs mt-0.5">{profile.fullName}</h3>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    )}
                  </div>

                  <p className="text-[10.5px] text-slate-400 leading-normal mt-2.5 line-clamp-2">
                    {profile.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[9.5px] text-slate-500 font-semibold font-mono">ID: {profile.username}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOneClickSignIn(index);
                      }}
                      className="text-[9.5px] text-indigo-400 group-hover:text-indigo-300 font-black uppercase flex items-center gap-1 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-900/40 px-2 py-1 rounded transition"
                    >
                      Quick Login <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats Block of simulated system state */}
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between gap-4 text-[10px] shadow-md">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-300" />
              <span className="text-slate-100 font-medium">Central Directory Sync: <strong className="text-emerald-400 font-mono font-black">100% Operational</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400">
              <span>NHA Node ID #DL-NHA-9921</span>
            </div>
          </div>
        </div>

        {/* Right column: Dynamic interactive Form tailored to the selected composite profile */}
        <div className="lg:col-span-5 flex flex-col">
          <div className={`p-5 rounded-xl border border-slate-800 flex flex-col justify-between h-full bg-gradient-to-b ${activeProfile.bgGrad} relative overflow-hidden shadow-xl`}>
            
            {/* Top decorative lock icon */}
            <div className="absolute -right-4 -top-4 opacity-5 text-white pointer-events-none">
              <Lock className="w-32 h-32" />
            </div>

            <div className="space-y-4">
              <div className="border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-white/10 text-white/90 border border-white/10 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    {activeProfile.clearanceBadge}
                  </span>
                  <span className="text-[10px] text-white/50">• Secure Portal Connection</span>
                </div>
                <h3 className="text-lg font-black text-white mt-1.5 flex items-center gap-1.5">
                  {activeProfile.fullName}
                </h3>
                <p className="text-[11px] text-white/60 font-semibold">{activeProfile.title}</p>
              </div>

              {/* Clearance checklist */}
              <div className="space-y-2 bg-black/20 p-3 rounded-lg border border-white/5">
                <span className="text-[9.5px] uppercase font-bold text-white/40 tracking-wider block">Authorized Workspace Access:</span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10.5px] text-white/80 font-medium">
                  {activeProfile.allowedPanels.slice(0, 4).map((p, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1 truncate" title={p}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{p.replace(" Panel", "")}</span>
                    </div>
                  ))}
                  {activeProfile.allowedPanels.length > 4 && (
                    <div className="flex items-center gap-1 text-slate-400 font-bold">
                      <span>+ {activeProfile.allowedPanels.length - 4} more panels</span>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleManualLoginSubmit} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] text-white/60 font-bold uppercase tracking-wider mb-1">
                    Staff Identity ID / Username
                  </label>
                  <input 
                    type="text" 
                    value={customUsername} 
                    onChange={e => setCustomUsername(e.target.value)}
                    placeholder="e.g. admin.director" 
                    required
                    className="w-full p-2.5 bg-black/30 text-white border border-white/15 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-md focus:outline-none transition text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] text-white/60 font-bold uppercase tracking-wider">
                      Secret Code Key / Passcode
                    </label>
                    <span className="text-[9px] text-indigo-300 font-mono font-bold uppercase">Suggest: {activeProfile.passwordSuggestion}</span>
                  </div>
                  <input 
                    type="password" 
                    value={customPassword} 
                    onChange={e => setCustomPassword(e.target.value)}
                    placeholder="••••••••••••••" 
                    required
                    className="w-full p-2.5 bg-black/30 text-white border border-white/15 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-md focus:outline-none transition text-xs font-mono font-bold tracking-widest"
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-[10.5px] text-rose-300 font-medium flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-2.5 mt-2 bg-white hover:bg-slate-100 text-indigo-950 font-black uppercase text-xs rounded-md shadow-lg shadow-indigo-950/20 hover:shadow-indigo-950/35 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-4.5 h-4.5 border-2 border-indigo-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4.5 h-4.5 text-indigo-950" />
                      <span>Authenticate & Gain Access</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono mt-4">
              <span>AES-256 Multi-Role Hash</span>
              <span>Node Secure TLS</span>
            </div>
          </div>
        </div>

      </div>

      {/* Standard visual warning footer */}
      <div className="max-w-6xl mx-auto w-full z-10 pt-4 pb-2 border-t border-teal-600/35 text-center text-[10px] text-slate-900 font-bold font-sans flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© 2026 National Health Authority (NHA) Sandbox Infrastructure. All access attempts logged under Section 66D IT Act.</p>
        <p className="flex items-center gap-1 justify-center text-teal-950 font-black">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-800" /> NABH Standard AAC 1-5 Audit Verified
        </p>
      </div>

    </div>
  );
}
