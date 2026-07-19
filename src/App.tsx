import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_BEDS, 
  INITIAL_ALERTS, INITIAL_MILESTONES, INITIAL_INCIDENTS, CORE_MODULES 
} from './data/initialData';
import { Patient, Appointment, BedCategory, AlertNotification, Incident, ComplianceMilestone, HmsUser } from './types';

// Components
import PanelWorkspace from './components/PanelWorkspace';
import AbdmMilestonesWidget from './components/AbdmMilestonesWidget';
import AiCopilotWidget from './components/AiCopilotWidget';
import HmsLoginPortal from './components/HmsLoginPortal';

// Icons
import { 
  HeartPulse, Activity, ShieldCheck, Users, BedDouble, FlaskConical, Image as ImageIcon, 
  Pill, Scissors, CreditCard, Droplet, Contact2, Package, ChefHat, Truck, LogOut, 
  BarChart3, UserCheck, Lock, CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, Shield, Sparkles, X,
  ChevronDown, Settings, ClipboardCheck, Info, FileText, Search, Menu, Star, BookOpen, Compass
} from 'lucide-react';

const PANEL_CATEGORIES = [
  {
    name: "Administrative",
    icon: "Shield",
    panels: ["Super Admin Panel", "Corporate Admin Panel", "Hospital Admin Panel", "Medical Superintendent", "HR Department", "Finance & Accounts"]
  },
  {
    name: "Care Areas & Wards",
    icon: "BedDouble",
    panels: ["Reception", "OPD Panel", "IPD Panel", "Emergency Panel", "ICU Panel", "OT Panel", "Nursing Panel", "MRD Panel"]
  },
  {
    name: "Diagnostics & Allied",
    icon: "FlaskConical",
    panels: ["Laboratory Panel", "Radiology Panel", "Pharmacy Panel", "Blood Centre Panel", "Biomedical Engineering", "Infection Control Team", "Dietician Panel", "Physiotherapy Panel", "CSSD Panel", "Housekeeping Panel", "Biomedical Waste", "Ambulance Panel", "Purchase Panel", "Inventory Panel", "Maintenance Panel"]
  },
  {
    name: "Portals & Mobiles",
    icon: "UserCheck",
    panels: ["Doctor Portal Panel", "Patient Portal Panel", "Mobile App Panel"]
  },
  {
    name: "Compliance & Audits",
    icon: "CheckCircle2",
    panels: ["NABH Compliance Panel", "Analytics Dashboard", "ABDM Integration Panel"]
  }
];

export default function App() {
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<HmsUser | null>(null);
  const [showAllPanels, setShowAllPanels] = useState<boolean>(false);

  // Global States
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(INITIAL_PATIENTS[0]);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [beds, setBeds] = useState<BedCategory[]>(INITIAL_BEDS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [milestones, setMilestones] = useState<ComplianceMilestone[]>(INITIAL_MILESTONES);

  // Layout Tab selection
  const [activePanel, setActivePanel] = useState('NABH Compliance Panel');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Administrative": true,
    "Care Areas & Wards": false,
    "Diagnostics & Allied": false,
    "Portals & Mobiles": false,
    "Compliance & Audits": true
  });

  // User Friendliness & Search states
  const [panelSearch, setPanelSearch] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showQuickHelp, setShowQuickHelp] = useState(true);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState<boolean>(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState<boolean>(false);
  const [favoritePanels, setFavoritePanels] = useState<string[]>([
    "NABH Compliance Panel", "OPD Panel", "ICU Panel", "Emergency Panel", "Pharmacy Panel", "ABDM Integration Panel"
  ]);

  // Toggle Favorite Panel
  const toggleFavoritePanel = (panelName: string) => {
    setFavoritePanels(prev => 
      prev.includes(panelName) 
        ? prev.filter(p => p !== panelName) 
        : [...prev, panelName]
    );
  };

  // Triggered states
  const [selectedCoreModule, setSelectedCoreModule] = useState<typeof CORE_MODULES[0] | null>(null);
  const [triggeredIncidentForAi, setTriggeredIncidentForAi] = useState<Incident | null>(null);
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);

  // Toggle category collapse
  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // Synchronize sidebar accordion menus and override filters to support seamless cross-navigation
  useEffect(() => {
    if (activePanel) {
      // Find the category containing this active panel
      const matchedCategory = PANEL_CATEGORIES.find(cat => cat.panels.includes(activePanel));
      if (matchedCategory) {
        // Expand the matched category in the sidebar accordion menu
        setExpandedCategories(prev => ({
          ...prev,
          [matchedCategory.name]: true
        }));
      }

      // If the current user has restricted access but wants to load this panel (e.g. from favorites, or core handovers)
      // dynamically toggle the permission view mode to All so they can view it.
      if (currentUser && !currentUser.allowedPanels.includes(activePanel)) {
        setShowAllPanels(true);
      }
    }
  }, [activePanel, currentUser]);

  // Update a single patient's record (Allergies, Medications, Visits, etc.)
  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.uhid === updatedPatient.uhid ? updatedPatient : p));
    if (selectedPatient.uhid === updatedPatient.uhid) {
      setSelectedPatient(updatedPatient);
    }
  };

  // Add new patient registered
  const handleAddPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
    setSelectedPatient(newPatient); // Auto-focus new patient
  };

  // Add scheduled appointment
  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments([...appointments, newApp]);
    
    // Add visit record to patient as a scheduled visit
    const matchedPatient = patients.find(p => p.uhid === newApp.patientUhid);
    if (matchedPatient) {
      const updatedVisits = [
        { date: "Scheduled", department: newApp.department, doctor: newApp.doctor },
        ...matchedPatient.recentVisits
      ];
      handleUpdatePatient({
        ...matchedPatient,
        recentVisits: updatedVisits
      });
    }
  };

  // Add new logged Incident
  const handleAddIncident = (newIncident: Incident) => {
    setIncidents([...incidents, newIncident]);
  };

  // Toggle checklist milestone
  const handleToggleMilestone = (id: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, checked: !m.checked } : m));
  };

  // AI CAPA action trigger
  const handleTriggerAiCapa = (incident: Incident) => {
    setAiGeneratingId(incident.id);
    // Mimic quick analysis delay, then hand off to chat widget
    setTimeout(() => {
      setTriggeredIncidentForAi(incident);
      setAiGeneratingId(null);
    }, 1000);
  };

  // Map Core Module click to direct Panel and Spec
  const handleCoreModuleClick = (mod: typeof CORE_MODULES[0]) => {
    // Auto map to relevant interactive panel
    const name = mod.name;
    if (name.includes("Patient Management") || name.includes("Discharge")) {
      setActivePanel("Patient Portal Panel");
    } else if (name.includes("OPD")) {
      setActivePanel("OPD Panel");
    } else if (name.includes("IPD")) {
      setActivePanel("IPD Panel");
    } else if (name.includes("Emergency")) {
      setActivePanel("Emergency Panel");
    } else if (name.includes("ICU")) {
      setActivePanel("ICU Panel");
    } else if (name.includes("OT")) {
      setActivePanel("OT Panel");
    } else if (name.includes("Nursing")) {
      setActivePanel("Nursing Panel");
    } else if (name.includes("Laboratory")) {
      setActivePanel("Laboratory Panel");
    } else if (name.includes("Radiology")) {
      setActivePanel("Radiology Panel");
    } else if (name.includes("Pharmacy")) {
      setActivePanel("Pharmacy Panel");
    } else if (name.includes("Billing")) {
      setActivePanel("Finance & Accounts");
    } else if (name.includes("Blood Bank")) {
      setActivePanel("Blood Centre Panel");
    } else if (name.includes("Human Resource")) {
      setActivePanel("HR Department");
    } else if (name.includes("Inventory")) {
      setActivePanel("Inventory Panel");
    } else if (name.includes("Diet")) {
      setActivePanel("Dietician Panel");
    } else if (name.includes("Ambulance")) {
      setActivePanel("Ambulance Panel");
    } else if (name.includes("Reports") || name.includes("HMIS")) {
      setActivePanel("Analytics Dashboard");
    }
  };

  // Core Category / Panel Icon Selector
  const getCatIcon = (iconName: string, className = "w-4 h-4") => {
    switch (iconName) {
      case "Shield": return <Shield className={`${className} text-indigo-600`} />;
      case "BedDouble": return <BedDouble className={`${className} text-sky-600`} />;
      case "FlaskConical": return <FlaskConical className={`${className} text-amber-600`} />;
      case "UserCheck": return <UserCheck className={`${className} text-emerald-600`} />;
      case "CheckCircle2": return <CheckCircle2 className={`${className} text-teal-600`} />;
      default: return <Activity className={`${className}`} />;
    }
  };

  const getCoreModuleIcon = (iconName: string, className = "w-4 h-4") => {
    switch (iconName) {
      case "UserCheck": return <UserCheck className={`${className} text-blue-600`} />;
      case "Users": return <Users className={`${className} text-emerald-600`} />;
      case "BedDouble": return <BedDouble className={`${className} text-sky-600`} />;
      case "Activity": return <Activity className={`${className} text-rose-600`} />;
      case "ShieldCheck": return <ShieldCheck className={`${className} text-indigo-600`} />;
      case "FlaskConical": return <FlaskConical className={`${className} text-amber-600`} />;
      case "Image": return <ImageIcon className={`${className} text-purple-600`} />;
      case "Pills": return <Pill className={`${className} text-teal-600`} />;
      case "Scissors": return <Scissors className={`${className} text-slate-600`} />;
      case "HeartPulse": return <HeartPulse className={`${className} text-rose-600 animate-pulse`} />;
      case "CreditCard": return <CreditCard className={`${className} text-emerald-600`} />;
      case "Droplet": return <Droplet className={`${className} text-rose-600`} />;
      case "Contact2": return <Contact2 className={`${className} text-slate-600`} />;
      case "Package": return <Package className={`${className} text-amber-600`} />;
      case "ChefHat": return <ChefHat className={`${className} text-yellow-600`} />;
      case "Truck": return <Truck className={`${className} text-sky-600`} />;
      case "LogOut": return <LogOut className={`${className} text-rose-500`} />;
      case "BarChart3": return <BarChart3 className={`${className} text-indigo-600`} />;
      default: return <Activity className={`${className}`} />;
    }
  };

  const isPanelAllowed = (panelName: string) => {
    if (!currentUser) return false;
    if (showAllPanels) return true;
    return currentUser.allowedPanels.includes(panelName);
  };

  const filteredPanels = PANEL_CATEGORIES.flatMap(cat => cat.panels)
    .filter(isPanelAllowed)
    .filter(p => p.toLowerCase().includes(panelSearch.toLowerCase()));

  if (!currentUser) {
    return (
      <HmsLoginPortal 
        onLogin={(user) => {
          setCurrentUser(user);
          if (user.allowedPanels.length > 0) {
            setActivePanel(user.allowedPanels[0]);
          }
        }}
      />
    );
  }

  const leftVisible = !leftSidebarCollapsed;
  const rightVisible = !rightSidebarCollapsed;

  let middleColSpanClass = "xl:col-span-7";
  if (!leftVisible && !rightVisible) {
    middleColSpanClass = "xl:col-span-12";
  } else if (!leftVisible && rightVisible) {
    middleColSpanClass = "xl:col-span-9";
  } else if (leftVisible && !rightVisible) {
    middleColSpanClass = "xl:col-span-10";
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Main Header */}
      <header className="bg-gradient-to-r from-[#006437] to-[#70C143] text-white px-5 py-4 border-b border-emerald-900 shadow-md flex-shrink-0 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left Side: Brand and Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-inner border-2 border-emerald-400 flex-shrink-0">
            <HeartPulse className="w-7 h-7 text-red-600 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-xl tracking-tight leading-tight uppercase text-white font-sans flex items-center gap-2">
              NABH & ABDM Compliant Hospital Management System
            </h1>
            <p className="text-[11px] md:text-xs text-emerald-100 font-semibold tracking-wide flex items-center gap-1 mt-0.5">
              Complete HMS with Unified National Gateways & ABDM Milestones (M1–M4)
            </p>
          </div>
        </div>

        {/* Right Side: Badges & Authenticated User Profile */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3.5">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white text-[9.5px] font-extrabold uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> NABH Compliant
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white text-[9.5px] font-extrabold uppercase">
              <Activity className="w-3.5 h-3.5 text-emerald-300 animate-pulse" /> ABDM Ready
            </span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/20">
              <div className={`w-8.5 h-8.5 rounded-full ${currentUser.avatarColor === 'bg-indigo-950' ? 'bg-emerald-800' : currentUser.avatarColor} border border-white/25 flex items-center justify-center text-[10.5px] font-black text-white shadow-inner`}>
                {currentUser.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-white block leading-none">{currentUser.fullName}</span>
                  <span className="text-[8px] bg-white/20 text-white border border-white/30 px-1 py-0.2 rounded font-mono font-bold uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <span className="text-[9.5px] text-emerald-100 font-semibold block leading-tight mt-0.5">{currentUser.title}</span>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                className="p-1.5 bg-white/10 hover:bg-rose-950 hover:text-rose-200 border border-white/20 hover:border-rose-900 rounded-md text-white transition-all duration-150 flex items-center gap-1"
                title="Switch User / Logout Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase pr-0.5 hidden md:inline">Switch</span>
              </button>
            </div>
          )}
        </div>

      </header>

      {/* 2. Main Layout Container */}
      <main className="flex-1 p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Mobile & Tablet Panel Navigation Toggle Bar */}
        <div className="xl:hidden col-span-1 bg-white border border-slate-200 rounded-lg p-3 shadow-2xs flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition text-slate-700"
            >
              <Menu className="w-5 h-5 text-indigo-800" />
            </button>
            <div>
              <span className="text-[9.5px] uppercase font-extrabold text-slate-400 block">Current Department</span>
              <span className="text-xs font-black text-indigo-950 flex items-center gap-1">
                {activePanel}
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-[10px] uppercase rounded transition flex items-center gap-1 shadow-3xs"
          >
            <Compass className="w-3.5 h-3.5" /> Switch Station
          </button>
        </div>

        {/* SIDEBAR LEFT: 35+ Categorized Workspace Panels (Visible on Desktop, Drawer on Mobile) */}
        {leftVisible && (
          <aside className="hidden xl:flex xl:col-span-2 bg-[#ecf4e6] rounded-lg border border-slate-200 p-4 shadow-sm flex-col justify-between h-[calc(100vh-140px)] xl:sticky xl:top-4 overflow-y-auto animate-fade-in">
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h2 className="font-extrabold text-indigo-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-indigo-700 animate-spin-slow" /> HMS Panels
                </h2>
                <div className="flex items-center gap-1.5">
                  {currentUser && (
                    <button
                      onClick={() => setShowAllPanels(!showAllPanels)}
                      className={`text-[9px] px-1.5 py-0.5 rounded border transition-all font-extrabold uppercase ${
                        showAllPanels 
                          ? 'bg-emerald-800 border-emerald-800 text-white shadow-3xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-emerald-800'
                      }`}
                      title="Toggle show all 35+ panels or only allowed role panels"
                    >
                      {showAllPanels ? "All" : "Role"}
                    </button>
                  )}
                  <button
                    onClick={() => setLeftSidebarCollapsed(true)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-900 transition hidden xl:block"
                    title="Collapse Sidebar"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            {/* Filter Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search 35+ panels..."
                value={panelSearch}
                onChange={(e) => setPanelSearch(e.target.value)}
                className="w-full text-[10.5px] font-sans pl-8 pr-7 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-md focus:outline-none transition font-medium"
              />
              {panelSearch && (
                <button
                  onClick={() => setPanelSearch('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                >
                  &times;
                </button>
              )}
            </div>
            
            {/* 35+ Panels Categorized Accordions or Search Results */}
            <div className="space-y-2">
              {panelSearch.trim() !== '' ? (
                <div className="space-y-1">
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-1 pb-1">
                    Matching Panels ({filteredPanels.length})
                  </div>
                  {filteredPanels.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto space-y-0.5">
                      {filteredPanels.map((p, idx) => {
                        const isActive = activePanel === p;
                        const isFav = favoritePanels.includes(p);
                        return (
                          <div key={idx} className="flex items-center gap-1 group">
                            <button
                              onClick={() => {
                                setActivePanel(p);
                                setMobileSidebarOpen(false);
                              }}
                              className={`flex-1 text-left px-2.5 py-1.5 text-[10.5px] font-bold rounded transition flex items-center justify-between ${isActive ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                <span className="truncate">{p}</span>
                              </div>
                            </button>
                            <button
                              onClick={() => toggleFavoritePanel(p)}
                              className="p-1 rounded hover:bg-slate-100 text-slate-300 hover:text-amber-500 transition-colors"
                              title={isFav ? "Remove Pin" : "Pin Station"}
                            >
                              <Star className={`w-3 h-3 ${isFav ? 'text-amber-500 fill-amber-500' : ''}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-slate-400 italic text-[10px]">
                      No results found
                    </div>
                  )}
                </div>
              ) : (
                PANEL_CATEGORIES.map((cat, idx) => {
                  const allowedCatPanels = cat.panels.filter(isPanelAllowed);
                  if (allowedCatPanels.length === 0) return null;
                  const isExpanded = !!expandedCategories[cat.name];
                  return (
                    <div key={idx} className="border border-slate-100 rounded-md overflow-hidden">
                      <button
                        onClick={() => toggleCategory(cat.name)}
                        className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 text-left text-[11px] font-extrabold text-slate-800 transition"
                      >
                        <div className="flex items-center gap-1.5">
                          {getCatIcon(cat.icon)}
                          <span>{cat.name} ({allowedCatPanels.length})</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="bg-white p-1 space-y-0.5">
                          {allowedCatPanels.map((p, pIdx) => {
                            const isActive = activePanel === p;
                            const isFav = favoritePanels.includes(p);
                            return (
                              <div key={pIdx} className="flex items-center gap-1 group">
                                <button
                                  key={pIdx}
                                  onClick={() => setActivePanel(p)}
                                  className={`flex-1 text-left px-2 py-1 text-[10px] font-bold rounded transition flex items-center gap-1.5 ${isActive ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                  <span className="truncate">{p}</span>
                                </button>
                                <button
                                  onClick={() => toggleFavoritePanel(p)}
                                  className={`p-1 mr-0.5 rounded hover:bg-slate-100 text-slate-300 hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 ${isFav ? 'opacity-100 text-amber-500' : ''}`}
                                  title={isFav ? "Remove Pin" : "Pin Station"}
                                >
                                  <Star className={`w-3 h-3 ${isFav ? 'text-amber-500 fill-amber-500' : ''}`} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Core Modules Quick Spec Mapping */}
            <div className="pt-2 border-t border-slate-100">
              <div className="pb-1.5">
                <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-700" /> Core Handovers
                </h3>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-0.5 pr-1">
                {CORE_MODULES.map((mod, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCoreModuleClick(mod)}
                    className="w-full text-left px-1.5 py-1 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {getCoreModuleIcon(mod.icon, "w-3 h-3")}
                      <span className="truncate">{mod.name}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 mt-3 text-[9.5px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Host Node #DL-124
          </div>
        </aside>
        )}

        {/* MIDDLE AREA: Active Panel Workspace Section (Dynamic Column Span based on Sidebars) */}
        <section className={`${middleColSpanClass} space-y-4`}>
          
          {/* USER-FRIENDLY ADDITION: Quick Favorites Bar & Help SOP Panel */}
          <div className="space-y-3">
            {/* Pinned Stations Bar */}
            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 animate-fade-in text-xs font-sans">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-amber-50 rounded border border-amber-100 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">Pinned Quick-Access Workspaces</span>
                  <span className="text-[9px] text-slate-400 font-medium block">Customize pins by clicking the star icon next to panels in the selector</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {favoritePanels.map((p, idx) => {
                  const isActive = activePanel === p;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActivePanel(p)}
                      className={`px-3 py-1.5 rounded-md text-[10.5px] font-extrabold border transition duration-150 flex items-center gap-1.5 ${
                        isActive 
                          ? 'bg-emerald-800 border-emerald-800 text-white shadow-3xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {isActive && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                      {p.replace(" Panel", "")}
                    </button>
                  );
                })}
                {favoritePanels.length === 0 && (
                  <span className="text-[10.5px] text-slate-400 italic py-1">No pinned stations. Hover panel names in the selector list and click the star to pin.</span>
                )}
              </div>

              {/* View Mode layout controls */}
              <div className="flex items-center gap-1.5 border-t lg:border-t-0 lg:border-l border-slate-150 pt-2 lg:pt-0 lg:pl-3 hidden xl:flex">
                <button
                  onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
                  className={`px-2 py-1 rounded text-[9.5px] font-extrabold border transition flex items-center gap-1 ${
                    leftSidebarCollapsed 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Toggle Left Panel List"
                >
                  {leftSidebarCollapsed ? '⟨ Show Panel List' : '⟨ Hide Panel List'}
                </button>
                <button
                  onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
                  className={`px-2 py-1 rounded text-[9.5px] font-extrabold border transition flex items-center gap-1 ${
                    rightSidebarCollapsed 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-800' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Toggle Right ABDM Checklist"
                >
                  {rightSidebarCollapsed ? 'Show Checklist ⟩' : 'Hide Checklist ⟩'}
                </button>
              </div>
            </div>

            {/* Collapsible Helper Companion */}
            {showQuickHelp && (
              <div className="bg-gradient-to-r from-[#006437] to-[#70C143] text-emerald-50 rounded-lg p-3.5 shadow-2xs border border-emerald-800 relative animate-fade-in overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/10">
                  <HeartPulse className="w-48 h-48 text-white" />
                </div>
                <button 
                  onClick={() => setShowQuickHelp(false)}
                  className="absolute right-3 top-3 text-emerald-200 hover:text-white transition font-black text-sm"
                  title="Dismiss guide"
                >
                  &times;
                </button>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-emerald-900/40 rounded border border-emerald-700/50 mt-0.5 flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-emerald-100 animate-pulse-slow" />
                  </div>
                  <div className="space-y-1 max-w-[90%]">
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      NABH Quality Indicator & ABDM Guidance Console
                    </h4>
                    <p className="text-[11px] text-emerald-100 leading-relaxed font-sans">
                      Under **NABH Standard COP-3** and **ABDM Milestone guidelines**, this workstation binds digital health logs directly to official national sandbox registries. 
                    </p>
                    <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9.5px] font-mono text-emerald-100">
                      <span>🔍 <strong>Instant Filter</strong>: Type in the sidebar search box to jump to any of the 35+ departments.</span>
                      <span>⭐ <strong>Custom Dashboard</strong>: Click the Star icon on panels in the selector to populate your pinned bar.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <PanelWorkspace 
            activePanel={activePanel}
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
            onUpdatePatient={handleUpdatePatient}
            onAddPatient={handleAddPatient}
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            beds={beds}
            onUpdateBeds={setBeds}
            alerts={alerts}
            onUpdateAlerts={setAlerts}
            incidents={incidents}
            onAddIncident={handleAddIncident}
            milestones={milestones}
            onToggleMilestone={handleToggleMilestone}
            onTriggerAiCapa={handleTriggerAiCapa}
            aiGeneratingId={aiGeneratingId}
            currentUser={currentUser}
            onSetActivePanel={setActivePanel}
          />
        </section>

        {/* SIDEBAR RIGHT: ABDM Milestones Checklist (Dynamic layout based on rightVisible) */}
        {rightVisible && (
          <aside className="xl:col-span-3 space-y-4 animate-fade-in">
            <AbdmMilestonesWidget 
              milestones={milestones}
              onToggleMilestone={handleToggleMilestone}
              selectedPatient={selectedPatient}
              onCollapse={() => setRightSidebarCollapsed(true)}
            />
          </aside>
        )}

      </main>

      {/* Responsive Panel Drawer (Overlay Menu) for Mobile & Tablets */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex justify-start animate-fade-in" onClick={() => setMobileSidebarOpen(false)}>
          <div className="bg-[#ecf4e6] w-72 h-full flex flex-col justify-between p-4 shadow-2xl border-r border-slate-200 overflow-y-auto animate-slide-in font-sans" onClick={e => e.stopPropagation()}>
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-indigo-950 text-xs uppercase tracking-wider flex items-center gap-1">
                    <Settings className="w-3.5 h-3.5 text-indigo-700" /> HMS Panels
                  </h2>
                  {currentUser && (
                    <button
                      onClick={() => setShowAllPanels(!showAllPanels)}
                      className={`text-[8.5px] px-1.5 py-0.5 rounded border font-extrabold uppercase ${
                        showAllPanels 
                          ? 'bg-emerald-800 border-emerald-800 text-white shadow-3xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      {showAllPanels ? "All" : "Role"}
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search 35+ workspace panels..."
                  value={panelSearch}
                  onChange={(e) => setPanelSearch(e.target.value)}
                  className="w-full text-[11px] font-sans pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-md focus:outline-none transition font-medium"
                />
                {panelSearch && (
                  <button
                    onClick={() => setPanelSearch('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* Dynamic Panels */}
              <div className="space-y-2">
                {panelSearch.trim() !== '' ? (
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1 pb-1">
                      Matching Panels ({filteredPanels.length})
                    </div>
                    {filteredPanels.map((p, idx) => {
                      const isActive = activePanel === p;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActivePanel(p);
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-[10.5px] font-bold rounded transition flex items-center gap-1.5 ${isActive ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                          <span className="truncate">{p}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  PANEL_CATEGORIES.map((cat, idx) => {
                    const allowedCatPanels = cat.panels.filter(isPanelAllowed);
                    if (allowedCatPanels.length === 0) return null;
                    const isExpanded = !!expandedCategories[cat.name];
                    return (
                      <div key={idx} className="border border-slate-100 rounded-md overflow-hidden">
                        <button
                          onClick={() => toggleCategory(cat.name)}
                          className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 text-left text-[11px] font-extrabold text-slate-800 transition"
                        >
                          <div className="flex items-center gap-1.5">
                            {getCatIcon(cat.icon)}
                            <span>{cat.name} ({allowedCatPanels.length})</span>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="bg-white p-1 space-y-0.5">
                            {allowedCatPanels.map((p, pIdx) => {
                              const isActive = activePanel === p;
                              return (
                                <button
                                  key={pIdx}
                                  onClick={() => {
                                    setActivePanel(p);
                                    setMobileSidebarOpen(false);
                                  }}
                                  className={`w-full text-left px-2 py-1 text-[10px] font-bold rounded transition flex items-center gap-1.5 ${isActive ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                  <span className="truncate">{p}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Handovers */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-700" /> Core Handovers
                </h3>
                <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
                  {CORE_MODULES.map((mod, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleCoreModuleClick(mod);
                        setMobileSidebarOpen(false);
                      }}
                      className="w-full text-left px-1.5 py-1 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {getCoreModuleIcon(mod.icon, "w-3 h-3")}
                        <span className="truncate">{mod.name}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 mt-4 text-[9.5px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Host Node #DL-124
            </div>
          </div>
        </div>
      )}

      {/* 3. Global AI Copilot Overlay Chat Sidebar */}
      <AiCopilotWidget 
        selectedPatient={selectedPatient}
        incidents={incidents}
        beds={beds}
        milestones={milestones}
        openTriggeredIncident={triggeredIncidentForAi}
        onClearTriggeredIncident={() => setTriggeredIncidentForAi(null)}
      />

      {/* 4. Core Module Specification Modal popup */}
      {selectedCoreModule && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden text-xs">
            <div className="bg-gradient-to-r from-[#006437] to-[#70C143] text-white px-4 py-3 flex justify-between items-center font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                {getCoreModuleIcon(selectedCoreModule.icon, "w-4 h-4 text-emerald-100")} 
                {selectedCoreModule.name}
              </span>
              <button 
                onClick={() => setSelectedCoreModule(null)} 
                className="text-white hover:text-red-200 font-bold text-sm"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4 space-y-3 font-sans text-slate-700">
              <p className="leading-relaxed text-slate-600 text-[11px]">{selectedCoreModule.desc}</p>
              
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded">
                <div className="font-bold text-slate-800 mb-1">ABDM Compliance Specification:</div>
                <p className="text-[10px] leading-relaxed">
                  This core module maps and signs transactions strictly under Ayushman Bharat Digital Mission guidelines. Every clinical log, vital sign update, or sample handover automatically hashes transaction payloads and outputs XML/JSON secure telemetry aligned with National health registries.
                </p>
              </div>

              <div className="space-y-1 text-[10.5px]">
                <div className="font-bold text-emerald-800">Enforced Standards:</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>HL7 FHIR v4 Resource Bundle validation</li>
                  <li>AES-256 secure local payload database encryption</li>
                  <li>Linked to unified ABDM Consent Architecture (M2-M4)</li>
                </ul>
              </div>
            </div>

            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedCoreModule(null)}
                className="px-3 py-1 bg-gradient-to-r from-[#006437] to-[#70C143] hover:from-emerald-800 hover:to-green-600 text-white rounded font-bold transition"
              >
                Close Module Spec
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Floating absolute overlay toggles when sidebars are collapsed */}
      {leftSidebarCollapsed && (
        <button
          onClick={() => setLeftSidebarCollapsed(false)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white py-4 px-2 rounded-r-lg shadow-lg border border-l-0 border-emerald-600 transition duration-150 flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider cursor-pointer"
          title="Expand Left Panel List"
        >
          <ChevronRight className="w-4 h-4 text-emerald-300" />
          <span className="[writing-mode:vertical-lr] my-1 text-white">HMS Panels</span>
        </button>
      )}
      {rightSidebarCollapsed && (
        <button
          onClick={() => setRightSidebarCollapsed(false)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-l from-indigo-900 to-indigo-850 hover:from-indigo-950 hover:to-indigo-900 text-white py-4 px-2 rounded-l-lg shadow-lg border border-r-0 border-indigo-750 transition duration-150 flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider cursor-pointer"
          title="Expand ABDM Milestones Checklist"
        >
          <ChevronLeft className="w-4 h-4 text-indigo-300" />
          <span className="[writing-mode:vertical-lr] my-1 text-white">ABDM Milestones</span>
        </button>
      )}

    </div>
  );
}
