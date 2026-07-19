import React, { useState } from 'react';
import { NABH_COMPLIANCE_MODULES } from '../data/initialData';
import { Incident } from '../types';
import { 
  Gauge, AlertTriangle, ShieldAlert, FileText, ClipboardCheck, Users, 
  HeartPulse, Award, Wrench, GraduationCap, UserCheck, Activity,
  CheckCircle2, AlertOctagon, X, Sparkles, BookOpen, Clock, FilePlus2, Play,
  Check, Plus, Shield, Calendar, Flame, RefreshCw, AlertCircle,
  Search, Trash2, Eye, Ban, ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

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

  // ==========================================
  // STATE MANAGEMENT FOR THE 12 ACTIVE MODULES
  // ==========================================

  // --- Module 1: Quality Management & KPI Dashboard ---
  const [kpis, setKpis] = useState([
    { id: 'kpi-1', name: "Bed Occupancy Rate", current: 81, target: 80, status: "Compliant", unit: "%" },
    { id: 'kpi-2', name: "Infection Rate (HAI)", current: 1.2, target: 1.5, status: "At-Risk", unit: "%", inverse: true },
    { id: 'kpi-3', name: "Medication Error Rate", current: 0.6, target: 1.0, status: "Compliant", unit: "%", inverse: true },
    { id: 'kpi-4', name: "Patient Satisfaction", current: 92, target: 90, status: "Compliant", unit: "%" },
  ]);
  const handleUpdateKpiValue = (id: string, value: number) => {
    setKpis(prev => prev.map(k => {
      if (k.id === id) {
        let status = "Compliant";
        if (k.inverse) {
          status = value > k.target ? "Critical" : value > k.target * 0.8 ? "At-Risk" : "Compliant";
        } else {
          status = value < k.target * 0.9 ? "Critical" : value < k.target ? "At-Risk" : "Compliant";
        }
        return { ...k, current: Number(value.toFixed(1)), status };
      }
      return k;
    }));
  };
  const handleSimulateKpis = () => {
    setKpis(prev => prev.map(k => {
      const delta = (Math.random() - 0.5) * (k.current > 5 ? 4 : 0.4);
      const value = Math.max(0, k.current + delta);
      return { ...k, current: Number(value.toFixed(1)) };
    }));
  };

  // --- Module 2: Incident Reporting & CAPA ---
  const [incType, setIncType] = useState<'Medication Error' | 'Patient Fall' | 'Near Miss' | 'Others'>('Medication Error');
  const [incSeverity, setIncSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [incPatientName, setIncPatientName] = useState('Rahul Kumar');
  const [incReporter, setIncReporter] = useState('Dr. Amit Verma');
  const [incDesc, setIncDesc] = useState('');

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

  // --- Module 3: Infection Control & HAI Surveillance ---
  const [surveillanceWards, setSurveillanceWards] = useState([
    { ward: "ICU Complex", rate: 1.4, auditsCount: 15, isolationBeds: 3, level: "Standard" },
    { ward: "Surgical Ward", rate: 0.9, auditsCount: 22, isolationBeds: 1, level: "Contact" },
    { ward: "Neonatal ICU", rate: 0.2, auditsCount: 30, isolationBeds: 2, level: "Airborne" },
    { ward: "Emergency Ward", rate: 1.8, auditsCount: 10, isolationBeds: 0, level: "Standard" }
  ]);
  const [surgicalCheckCount, setSurgicalCheckCount] = useState(48);
  const [infectionLog, setInfectionLog] = useState<string[]>([
    "Syringe disposal audits complete: 98% compliance.",
    "Isolation Ward B checkup successful.",
  ]);

  const handleTriggerIsolationLevel = (wardIndex: number, level: string) => {
    setSurveillanceWards(prev => prev.map((w, idx) => idx === wardIndex ? { ...w, level } : w));
    setInfectionLog(prev => [
      `Precaution protocol updated to ${level} for ${surveillanceWards[wardIndex].ward}.`,
      ...prev
    ]);
  };

  const handleLogCheckup = () => {
    setSurgicalCheckCount(prev => prev + 1);
    setInfectionLog(prev => [
      `Logged surgical site safety checkup #${surgicalCheckCount + 1}. All sterile criteria met.`,
      ...prev
    ]);
  };

  // --- Module 4: Document Control (SOP/Policy) ---
  const [sops, setSops] = useState([
    { code: "SOP-CL-001", title: "Hand Hygiene & Infection Control", version: "v3.2", status: "Approved", date: "12-Jan-2024" },
    { code: "SOP-NUR-014", title: "High Alert Medications Administration", version: "v2.1", status: "Approved", date: "28-Feb-2024" },
    { code: "SOP-ICU-089", title: "Patient Fall Prevention Checklist", version: "v4.0", status: "In Revision", date: "15-May-2024" },
    { code: "SOP-ADMIN-05", title: "Emergency Disaster Management", version: "v1.1", status: "Pending Approval", date: "Today" }
  ]);
  const [newSopTitle, setNewSopTitle] = useState('');

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

  // --- Module 5: Audit Management (Internal & External) ---
  const [auditChecklist, setAuditChecklist] = useState([
    { id: 1, text: "Informed surgical consents verified & stamped for active cases?", checked: true },
    { id: 2, text: "High-alert drugs locked in dual-cabinets & signed by two nurses?", checked: true },
    { id: 3, text: "Hospital-acquired infection surveillance forms filled for ICU?", checked: false },
    { id: 4, text: "Emergency fire exit ways free of clinical storage/obstacles?", checked: true },
    { id: 5, text: "Calibration certificates present on emergency defibrillators?", checked: false },
    { id: 6, text: "ABHA / ABDM digital logs registered correctly for admissions?", checked: true }
  ]);
  const [auditAlert, setAuditAlert] = useState<string | null>(null);

  const toggleAuditCheck = (id: number) => {
    setAuditChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };
  const auditScore = Math.round((auditChecklist.filter(item => item.checked).length / auditChecklist.length) * 100);

  const handleGenerateAuditReport = () => {
    setAuditAlert(`NABH Internal Audit Sheet Compiled! Final Score: ${auditScore}%. Verification certificates saved to clinical drive.`);
    setTimeout(() => setAuditAlert(null), 8000);
  };

  // --- Module 6: Committee Management ---
  const [committees] = useState([
    { name: "Hospital Infection Control Committee (HICC)", chair: "Dr. Sunita Sen", frequency: "Monthly" },
    { name: "Pharmacotherapeutic & Drug Safety Committee", chair: "Dr. Amit Verma", frequency: "Bi-Monthly" },
    { name: "Patient Safety & Code Blue Committee", chair: "Dr. Rajesh Iyer", frequency: "Quarterly" },
    { name: "Disaster & Fire Safety Committee", chair: "Admin Officer Khanna", frequency: "Quarterly" }
  ]);
  const [committeeMinutes, setCommitteeMinutes] = useState([
    { id: 1, committee: "HICC Meeting #42", chair: "Dr. Sunita Sen", date: "Yesterday", text: "Reviewed syringe audits. Enhanced hand hygiene tracking." },
    { id: 2, committee: "Drug Safety Meeting #19", chair: "Dr. Amit Verma", date: "10-Jun-2024", text: "Dual nurse sign-offs for Heparin made mandatory." }
  ]);
  const [selectedCommittee, setSelectedCommittee] = useState("Hospital Infection Control Committee (HICC)");
  const [newMinuteText, setNewMinuteText] = useState("");

  const handlePostMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinuteText) return;
    const activeComm = committees.find(c => c.name === selectedCommittee);
    const newMinute = {
      id: Date.now(),
      committee: activeComm ? activeComm.name : selectedCommittee,
      chair: activeComm ? activeComm.chair : "Clinical Director",
      date: "Today",
      text: newMinuteText
    };
    setCommitteeMinutes([newMinute, ...committeeMinutes]);
    setNewMinuteText("");
  };

  // --- Module 7: Patient Safety Indicators ---
  const [timeoutCheck, setTimeoutCheck] = useState({
    identityVerified: true,
    siteMarked: true,
    anesthesiaChecked: false,
    instrumentsCounted: false
  });
  const [signOffLogs, setSignOffLogs] = useState([
    { drug: "Insulin Infusion", nurse1: "Nurse Deepa", nurse2: "Nurse Sini", time: "10 mins ago" },
    { drug: "Heparin Injection", nurse1: "Nurse George", nurse2: "Dr. Verma", time: "1 hour ago" }
  ]);
  const [signOffDrug, setSignOffDrug] = useState("Insulin Infusion");
  const [nurse1, setNurse1] = useState("");
  const [nurse2, setNurse2] = useState("");

  const handleDualSignoffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nurse1 || !nurse2) return;
    setSignOffLogs([
      { drug: signOffDrug, nurse1, nurse2, time: "Just Now" },
      ...signOffLogs
    ]);
    setNurse1("");
    setNurse2("");
  };

;

  // --- Module 3 Isolation / Surveillance Ward Extensions ---
  const [newWardName, setNewWardName] = useState("");
  const [newWardRate, setNewWardRate] = useState("1.0");
  const handleAddWard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWardName) return;
    const newWardObj = {
      ward: newWardName,
      rate: parseFloat(newWardRate) || 0.0,
      auditsCount: 1,
      isolationBeds: 1,
      level: "Standard"
    };
    setSurveillanceWards([...surveillanceWards, newWardObj]);
    setInfectionLog(prev => [`New Surveillance Ward [${newWardName}] enrolled with base rate: ${newWardRate}%.`, ...prev]);
    setNewWardName("");
    setNewWardRate("1.0");
  };

  // --- Module 4 SOP Documents Extensions ---
  const [sopSearch, setSopSearch] = useState("");
  const handleDeleteSop = (code: string) => {
    setSops(prev => prev.filter(s => s.code !== code));
  };

  // --- Module 5 Audit Checklist Extensions ---
  const [newAuditItem, setNewAuditItem] = useState("");
  const handleAddAuditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditItem) return;
    const newItem = {
      id: Date.now(),
      text: newAuditItem,
      checked: false
    };
    setAuditChecklist([...auditChecklist, newItem]);
    setNewAuditItem("");
  };

  // --- Module 8 Staff Credentialing Extensions ---
  const [staffList, setStaffList] = useState([
    { name: "Dr. Sunita Sen", role: "MD, Chief Microbiologist", regNo: "MCI-18290", status: "Active", expiry: "2027-12-10", privileges: "Major Invasive Procedures, HICC Sign-off" },
    { name: "Dr. Amit Verma", role: "Senior Cardiologist", regNo: "MCI-44129", status: "Active", expiry: "2028-04-15", privileges: "Angioplasty, Cardiac ICU Management" },
    { name: "Nurse George", role: "Senior ICU Staff Nurse", regNo: "NUR-99201", status: "Active", expiry: "2027-08-22", privileges: "High-Alert Drug Administration, BLS" },
    { name: "Dr. Rajesh Iyer", role: "Anesthesiologist", regNo: "MCI-11028", status: "Expiring Soon", expiry: "Today", privileges: "General Anesthesia, Intubation" }
  ]);
  const [staffSearch, setStaffSearch] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Jr. Resident");
  const [newStaffReg, setNewStaffReg] = useState("");
  const [newStaffPrivs, setNewStaffPrivs] = useState("");
  const [privilegeDocName, setPrivilegeDocName] = useState("Dr. Sunita Sen");
  const [newPrivilegeText, setNewPrivilegeText] = useState("");
  
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffReg) return;
    const newStaff = {
      name: newStaffName,
      role: newStaffRole,
      regNo: newStaffReg,
      privileges: newStaffPrivs || "General Medical Supervision",
      status: "Active",
      expiry: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0]
    };
    setStaffList([...staffList, newStaff]);
    setNewStaffName("");
    setNewStaffReg("");
    setNewStaffPrivs("");
  };

  const handleDeleteStaff = (name: string) => {
    setStaffList(prev => prev.filter(s => s.name !== name));
  };

  const handleAddPrivilege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrivilegeText) return;
    setStaffList(prev => prev.map(s => {
      if (s.name === privilegeDocName) {
        return { ...s, privileges: `${s.privileges}, ${newPrivilegeText}` };
      }
      return s;
    }));
    setNewPrivilegeText("");
  };

  const handleRenewStaffLicense = (name: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.name === name) {
        return { ...s, status: "Active", expiry: "2028-12-31" };
      }
      return s;
    }));
  };

  // --- Module 9: Equipment Management ---
  const [equipmentList, setEquipmentList] = useState([
    { name: "ICU Ventilator Dräger v4", serial: "VT-90291", lastCalib: "2026-04-10", status: "Calibrated" },
    { name: "Siemens Magnetom 3T MRI", serial: "MR-88102", lastCalib: "2026-01-15", status: "Service Overdue" },
    { name: "ICU Defibrillator Phillips", serial: "DF-33829", lastCalib: "Today", status: "Calibrated" },
    { name: "Central Autoclave Sterilizer", serial: "AC-10022", lastCalib: "2026-03-01", status: "Calibrated" }
  ]);
  const [calibLog, setCalibLog] = useState<string[]>(["Ventilator VT-90291 calibration signed off last week."]);
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [newEqName, setNewEqName] = useState("");
  const [newEqSerial, setNewEqSerial] = useState("");
  const [newEqStatus, setNewEqStatus] = useState("Calibrated");

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName || !newEqSerial) return;
    const newEq = {
      name: newEqName,
      serial: newEqSerial,
      lastCalib: "Today",
      status: newEqStatus
    };
    setEquipmentList([...equipmentList, newEq]);
    setCalibLog(prev => [`New Equipment Registered: ${newEqName} (S/N: ${newEqSerial}) status set to ${newEqStatus}.`, ...prev]);
    setNewEqName("");
    setNewEqSerial("");
  };

  const handleDeleteEquipment = (serial: string) => {
    const targetEq = equipmentList.find(e => e.serial === serial);
    setEquipmentList(prev => prev.filter(eq => eq.serial !== serial));
    setCalibLog(prev => [`Equipment Removed: ${targetEq?.name || serial} (SN: ${serial}).`, ...prev]);
  };

  const handleCalibrateNow = (serial: string) => {
    setEquipmentList(prev => prev.map(eq => {
      if (eq.serial === serial) {
        return { ...eq, lastCalib: "Today", status: "Calibrated" };
      }
      return eq;
    }));
    const targetEq = equipmentList.find(e => e.serial === serial);
    setCalibLog(prev => [`Calibrated ${targetEq?.name} (${serial}) successfully. Calibration tag printed & attached.`, ...prev]);
  };

  const handleReportBreakdown = (serial: string) => {
    setEquipmentList(prev => prev.map(eq => {
      if (eq.serial === serial) {
        return { ...eq, status: "Breakdown - Alert Issued" };
      }
      return eq;
    }));
    const targetEq = equipmentList.find(e => e.serial === serial);
    setCalibLog(prev => [`ALERT: Breakdown reported on ${targetEq?.name} (${serial}). Maintenance crew dispatched.`, ...prev]);
  };

  // --- Module 10: Training Management & Competency ---
  const [trainings, setTrainings] = useState([
    { id: 1, title: "Basic Life Support & CPR", date: "15-Jun-2024", enrolled: 42, avgScore: "96%" },
    { id: 2, title: "NABH Chapter 3 Clinical Auditing", date: "22-Jun-2024", enrolled: 18, avgScore: "89%" },
    { id: 3, title: "Hand Hygiene & Surgical Scrubbing", date: "Today", enrolled: 35, avgScore: "100%" }
  ]);
  const [newTrainingTitle, setNewTrainingTitle] = useState("");
  const [trainingLogs, setTrainingLogs] = useState<string[]>([
    "Nurse George completed BLS recertification score: 100%.",
    "Staff nurse Shalini completed Fire Evacuation training score: 95%."
  ]);
  const [traineeName, setTraineeName] = useState("");
  const [traineeScore, setTraineeScore] = useState("95");
  const [traineeCourse, setTraineeCourse] = useState("Basic Life Support & CPR");

  const handleAddTrainingLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!traineeName) return;
    setTrainingLogs(prev => [`${traineeName} completed ${traineeCourse} with score: ${traineeScore}%. Log recorded for compliance checks.`, ...prev]);
    setTrainings(prev => prev.map(t => t.title === traineeCourse ? { ...t, enrolled: t.enrolled + 1 } : t));
    setTraineeName("");
  };

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainingTitle) return;
    const newCourse = {
      id: Date.now(),
      title: newTrainingTitle,
      date: "Scheduled (Next Week)",
      enrolled: 0,
      avgScore: "N/A"
    };
    setTrainings([...trainings, newCourse]);
    setNewTrainingTitle("");
  };

  // --- Module 11: Consent Management ---
  const [consentPatient, setConsentPatient] = useState("Rahul Kumar");
  const [consentProcedure, setConsentProcedure] = useState("Laparoscopic Cholecystectomy");
  const [consentLanguage, setConsentLanguage] = useState("English");
  const [consentWitness, setConsentWitness] = useState("Dr. Amit Verma");
  const [consentLogs, setConsentLogs] = useState([
    { id: "CNS-001", patient: "Rahul Kumar", procedure: "Surgical Incision", lang: "Hindi", stamp: "SHA256: 0x44fab484e9c2d9", witness: "Dr. Amit Verma", status: "Active", date: "Yesterday, 14:32", riskConfirmed: true, witnessSigned: true },
    { id: "CNS-002", patient: "Priya Patel", procedure: "Anesthesia Block", lang: "English", stamp: "SHA256: 0x93b2184e7a2e38", witness: "Nurse Deepa", status: "Active", date: "2 days ago, 10:15", riskConfirmed: true, witnessSigned: true }
  ]);
  const [generatedStamp, setGeneratedStamp] = useState<string | null>(null);
  const [consentSearch, setConsentSearch] = useState("");
  const [selectedConsentDetail, setSelectedConsentDetail] = useState<any | null>(null);

  const handleGenerateConsent = (e: React.FormEvent) => {
    e.preventDefault();
    const mockHash = `SHA256: 0x${Math.floor(100000 + Math.random() * 900000)}b${Math.floor(10 + Math.random() * 89)}a${Math.floor(100 + Math.random() * 899)}`;
    const newLog = {
      id: `CNS-${(consentLogs.length + 1).toString().padStart(3, '0')}`,
      patient: consentPatient,
      procedure: consentProcedure,
      lang: consentLanguage,
      stamp: mockHash,
      witness: consentWitness,
      status: "Active",
      date: new Date().toLocaleString("en-IN", { hour12: true }),
      riskConfirmed: true,
      witnessSigned: true
    };
    setConsentLogs([newLog, ...consentLogs]);
    setGeneratedStamp(mockHash);
  };

  const handleToggleConsentStatus = (id: string) => {
    setConsentLogs(prev => prev.map(log => {
      if (log.id === id) {
        const nextStatus = log.status === 'Active' ? 'Revoked' : 'Active';
        return { ...log, status: nextStatus };
      }
      return log;
    }));
    if (selectedConsentDetail && selectedConsentDetail.id === id) {
      setSelectedConsentDetail(prev => prev ? { ...prev, status: prev.status === 'Active' ? 'Revoked' : 'Active' } : null);
    }
  };

  const handleDeleteConsent = (id: string) => {
    setConsentLogs(prev => prev.filter(log => log.id !== id));
    if (selectedConsentDetail && selectedConsentDetail.id === id) {
      setSelectedConsentDetail(null);
    }
  };

  // --- Module 12: Risk Management ---
  const [riskItems, setRiskItems] = useState([
    { hazard: "Fire Safety & Smoke Detector Alarm Systems", level: "Critical", status: "OK", lastChecked: "Last Week" },
    { hazard: "Emergency Diesel Generator backup fuel capacity", level: "Low", status: "OK", lastChecked: "Yesterday" },
    { hazard: "Liquid Medical Oxygen (LMO) supply tank pressure", level: "Medium", status: "Checking", lastChecked: "1 hour ago" },
    { hazard: "Clinical supply chain drug stock critical shortage", level: "Medium", status: "Risk Mitigated", lastChecked: "2 days ago" }
  ]);
  const [drillActive, setDrillActive] = useState(false);
  const [riskActionLog, setRiskActionLog] = useState<string[]>([
    "Fire extinguisher inspection certified.",
    "Oxygen storage valve calibrated."
  ]);
  const [riskSearch, setRiskSearch] = useState("");
  const [newHazardName, setNewHazardName] = useState("");
  const [newHazardLevel, setNewHazardLevel] = useState("Medium");
  const [newHazardStatus, setNewHazardStatus] = useState("Checking");

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHazardName) return;
    const newRisk = {
      hazard: newHazardName,
      level: newHazardLevel,
      status: newHazardStatus,
      lastChecked: "Just Now"
    };
    setRiskItems([...riskItems, newRisk]);
    setRiskActionLog(prev => [`Added Hazard to Monitor Matrix: [${newHazardName}] rated as ${newHazardLevel} Risk.`, ...prev]);
    setNewHazardName("");
  };

  const handleToggleRiskStatus = (hazard: string) => {
    setRiskItems(prev => prev.map(item => {
      if (item.hazard === hazard) {
        const nextStatus = item.status === 'OK' ? 'Checking' : item.status === 'Checking' ? 'Action Required' : item.status === 'Action Required' ? 'Risk Mitigated' : 'OK';
        return { ...item, status: nextStatus, lastChecked: "Just Now" };
      }
      return item;
    }));
    setRiskActionLog(prev => [`Toggled monitoring status for [${hazard}].`, ...prev]);
  };

  const handleDeleteRisk = (hazard: string) => {
    setRiskItems(prev => prev.filter(item => item.hazard !== hazard));
    setRiskActionLog(prev => [`Deleted monitored Hazard: [${hazard}] from registry.`, ...prev]);
  };

  const handleTriggerDrill = () => {
    setDrillActive(true);
    setRiskActionLog(prev => ["MOCK EMERGENCY EVACUATION DRILL COMMENCED! Central alarm broadcasting across General & Private wards.", ...prev]);
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
        <Award className="w-5 h-5 text-indigo-950 animate-pulse" /> NABH Compliance Modules
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
            className="bg-white p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left flex flex-col justify-between group h-28 cursor-pointer relative"
          >
            <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition w-fit mb-2">
              {getIcon(mod.icon)}
            </div>
            
            {/* Active Status Badge for every single module to show they are activated */}
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

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
                  <h4 className="font-bold text-xs uppercase text-indigo-200 tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span> Active Compliance Sandbox
                  </h4>
                  <h3 className="font-bold text-sm text-white leading-tight">{selectedModule.name}</h3>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedModule(null);
                  setDrillActive(false);
                  setGeneratedStamp(null);
                }}
                className="p-1 hover:bg-white/10 rounded text-indigo-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="bg-indigo-50/60 p-3.5 border border-indigo-100 rounded-lg">
                <h5 className="font-bold text-indigo-900 mb-1 flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-indigo-700" /> NABH Standard Chapter
                </h5>
                <p className="font-sans leading-relaxed text-slate-600">{selectedModule.desc}</p>
              </div>

              {/* DYNAMIC INTERACTION LAYER BY MODULE TYPE */}
              
              {/* Module 1: Quality Management & KPI Dashboard */}
              {selectedModule.name.includes("Quality Management") && (
                <div className="space-y-4 font-sans">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <div className="font-bold text-slate-800 uppercase tracking-wide">
                      Interactive Quality Metrics & Slider Adjusters
                    </div>
                    <button 
                      onClick={handleSimulateKpis}
                      className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded flex items-center gap-1 transition"
                    >
                      <RefreshCw className="w-3 h-3" /> Auto Simulate Variance
                    </button>
                  </div>

                  <div className="space-y-3">
                    {kpis.map(k => (
                      <div key={k.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50 space-y-2">
                        <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                          <span>{k.name}</span>
                          <span className={
                            k.status === 'Compliant' ? 'text-emerald-700' :
                            k.status === 'At-Risk' ? 'text-amber-700' : 'text-rose-700'
                          }>
                            {k.current}{k.unit} / Target: {k.inverse ? '<' : '>'}{k.target}{k.unit}
                          </span>
                        </div>
                        
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          {/* Progress bar percentage limit */}
                          <div className={`h-full transition-all duration-300 ${
                            k.status === 'Compliant' ? 'bg-emerald-500' :
                            k.status === 'At-Risk' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} style={{ width: `${Math.min(100, k.current * (k.unit === '%' ? 1 : 20))}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center gap-3">
                          <span className="text-[10px] text-slate-400">
                            Status: <strong className={
                              k.status === 'Compliant' ? 'text-emerald-700' :
                              k.status === 'At-Risk' ? 'text-amber-700' : 'text-rose-700'
                            }>{k.status}</strong>
                          </span>
                          <div className="flex items-center gap-1.5 flex-1 max-w-44">
                            <span className="text-[9px] text-slate-400">Adjust:</span>
                            <input 
                              type="range" 
                              min={k.inverse ? 0 : 50} 
                              max={k.inverse ? 5 : 100} 
                              step={0.1}
                              value={k.current}
                              onChange={e => handleUpdateKpiValue(k.id, parseFloat(e.target.value))}
                              className="w-full accent-indigo-900 h-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Quality & KPI Trend Graph */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Real-time Compliance Performance Report</span>
                      <span className="text-[9px] text-indigo-700 font-mono font-bold">LIVE UPDATE</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={kpis.map(k => ({ name: k.id, score: k.current }))} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 7, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Area type="monotone" dataKey="score" stroke="#312e81" fill="#818cf8" fillOpacity={0.15} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 2: Incident Reporting & CAPA */}
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
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-xs"
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
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-xs"
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
                          className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-xs"
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
                          className="w-full px-2 py-1.5 border border-slate-300 rounded focus:outline-none bg-white text-xs"
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
                        className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-sans text-xs"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-2 bg-indigo-900 text-white font-bold rounded hover:bg-indigo-800 transition flex items-center justify-center gap-1 cursor-pointer"
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

                  {/* Visual Incident Severity Bar Chart */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Sentinel & Safety Incident Analysis Report</span>
                      <span className="text-[9px] text-rose-700 font-mono font-bold">STATE-DRIVEN</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { severity: 'Severe', count: incidents.filter(i => i.severity === 'Severe').length },
                          { severity: 'Moderate', count: incidents.filter(i => i.severity === 'Moderate').length },
                          { severity: 'Mild', count: incidents.filter(i => i.severity === 'Mild').length },
                        ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="severity" tick={{ fontSize: 8, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Bar dataKey="count" fill="#e11d48" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 3: Infection Control & HAI Surveillance */}
              {selectedModule.name.includes("Infection Control") && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <div className="font-bold text-slate-800 uppercase tracking-wide">
                      Live Ward Infection Audits
                    </div>
                    <button 
                      onClick={handleLogCheckup}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded flex items-center gap-1 transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Log Site Checkup
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border p-2.5 rounded-lg text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Ward Checks</span>
                      <span className="text-lg font-black text-slate-800">{surgicalCheckCount}</span>
                    </div>
                    <div className="bg-slate-50 border p-2.5 rounded-lg text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Autoclave Checks</span>
                      <span className="text-lg font-black text-emerald-700">100% OK</span>
                    </div>
                  </div>

                  {/* Add New Surveillance Ward Form */}
                  <form onSubmit={handleAddWard} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="font-bold text-slate-800 text-[10px] uppercase">Enroll New Surveillance Ward:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="Ward Name (e.g., ICU-C)" 
                        value={newWardName}
                        onChange={e => setNewWardName(e.target.value)}
                        className="p-1 border rounded bg-white text-xs"
                      />
                      <input 
                        type="number" 
                        required
                        step="0.1"
                        placeholder="Base HAI Rate %" 
                        value={newWardRate}
                        onChange={e => setNewWardRate(e.target.value)}
                        className="p-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <button type="submit" className="w-full py-1 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-[10px] rounded uppercase cursor-pointer">
                      Add Ward to Audit Registry
                    </button>
                  </form>

                  <div className="space-y-2">
                    <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Set Isolation Precaution Levels:</div>
                    {surveillanceWards.map((w, idx) => (
                      <div key={idx} className="p-3 border border-slate-150 rounded-lg bg-white flex justify-between items-center shadow-3xs">
                        <div>
                          <div className="font-bold text-slate-800 text-[11.5px]">{w.ward}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            HAI Rate: <strong className={w.rate > 1.2 ? "text-rose-600" : "text-emerald-700"}>{w.rate}%</strong> • Isolation beds: <strong>{w.isolationBeds}</strong>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 items-end">
                          <div className="flex gap-1">
                            {["Standard", "Contact", "Airborne"].map(l => (
                              <button
                                key={l}
                                onClick={() => handleTriggerIsolationLevel(idx, l)}
                                className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold cursor-pointer transition ${
                                  w.level === l 
                                    ? "bg-indigo-900 text-white" 
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                }`}
                              >
                                {l}
                              </button>
                            ))}
                          </div>
                          {surveillanceWards.length > 4 && (
                            <button 
                              onClick={() => setSurveillanceWards(prev => prev.filter((_, i) => i !== idx))}
                              className="text-[9px] text-rose-600 hover:text-rose-700 font-bold"
                            >
                              Remove Ward
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-[10px] max-h-32 overflow-y-auto">
                    <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1 mb-1">SYSTEM HAI AUDIT LOGS:</div>
                    {infectionLog.map((log, i) => (
                      <div key={i} className="leading-tight mb-1">• {log}</div>
                    ))}
                  </div>

                  {/* Visual HAI Infection Rate Bar Chart */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Hospital-Acquired Infection Rate Surveillance Report</span>
                      <span className="text-[9px] text-teal-700 font-mono font-bold">BY WARD</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={surveillanceWards} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="ward" tick={{ fontSize: 8, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Bar dataKey="rate" fill="#0f766e" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 4: Document Control (SOP/Policy) */}
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
                    <button type="submit" className="px-3 py-1 bg-indigo-900 text-white rounded text-xs font-semibold hover:bg-indigo-800 cursor-pointer">
                      Upload Draft
                    </button>
                  </form>

                  {/* Search bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search SOP by title or protocol code..."
                      value={sopSearch}
                      onChange={e => setSopSearch(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 border rounded bg-white text-[11px] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    {sops.filter(s => 
                      s.title.toLowerCase().includes(sopSearch.toLowerCase()) ||
                      s.code.toLowerCase().includes(sopSearch.toLowerCase())
                    ).map(s => (
                      <div key={s.code} className="p-3 border border-slate-150 rounded-lg bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800 font-mono text-[11px]">{s.code} - {s.version}</div>
                          <div className="text-slate-700 font-medium font-sans text-xs">{s.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Logged: {s.date}</div>
                        </div>

                        <div className="flex flex-col gap-1.5 items-end">
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
                                className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold cursor-pointer"
                              >
                                Approve
                              </button>
                            </div>
                          )}
                          <button 
                            onClick={() => handleDeleteSop(s.code)}
                            className="text-[9px] text-rose-600 hover:text-rose-700 font-bold"
                          >
                            Delete SOP
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Document Status Distribution */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Controlled SOP Status Distribution Report</span>
                      <span className="text-[9px] text-indigo-700 font-mono font-bold">BY STATUS</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={[
                          { status: 'Approved', count: sops.filter(s => s.status === 'Approved').length },
                          { status: 'Draft', count: sops.filter(s => s.status === 'Draft').length },
                          { status: 'In Revision', count: sops.filter(s => s.status === 'In Revision').length },
                        ]} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis type="number" tick={{ fontSize: 8, fill: '#64748b' }} />
                          <YAxis type="category" dataKey="status" tick={{ fontSize: 8, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Bar dataKey="count" fill="#4f46e5" radius={[0, 2, 2, 0]} barSize={10} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 5: Audit Management (Internal & External) */}
              {selectedModule.name.includes("Audit Management") && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <div className="font-bold text-slate-800 uppercase tracking-wide">
                      NABH Pre-Assessment Audits
                    </div>
                    <div className="p-1 bg-indigo-50 border text-indigo-900 font-bold px-2 rounded font-mono text-xs">
                      Live Compliance Score: {auditScore}%
                    </div>
                  </div>

                  {auditAlert && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded font-medium text-[11px] leading-snug animate-fade-in flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{auditAlert}</span>
                    </div>
                  )}

                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Toggle mandatory checks to calibrate real-time score. Score must be above 90% for NABH submission clearances.
                  </p>

                  {/* Add custom audit item form */}
                  <form onSubmit={handleAddAuditItem} className="p-2 bg-slate-50 border rounded-lg flex gap-1.5">
                    <input 
                      type="text"
                      required
                      placeholder="Add custom compliance checklist criteria..."
                      value={newAuditItem}
                      onChange={e => setNewAuditItem(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-xs bg-white"
                    />
                    <button type="submit" className="px-2 py-1 bg-indigo-900 hover:bg-indigo-800 text-white text-[11px] font-bold rounded cursor-pointer uppercase">
                      Add Check
                    </button>
                  </form>

                  <div className="space-y-2 bg-slate-50 p-3 rounded-lg border max-h-60 overflow-y-auto">
                    {auditChecklist.map(item => (
                      <label key={item.id} className="flex items-start gap-2.5 text-slate-700 hover:bg-slate-100 p-1.5 rounded transition cursor-pointer justify-between">
                        <div className="flex items-start gap-2.5">
                          <input 
                            type="checkbox" 
                            checked={item.checked} 
                            onChange={() => toggleAuditCheck(item.id)}
                            className="mt-0.5 rounded text-indigo-900 focus:ring-0 cursor-pointer" 
                          />
                          <span className="text-xs font-medium leading-tight">{item.text}</span>
                        </div>
                        {auditChecklist.length > 5 && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              setAuditChecklist(prev => prev.filter(a => a.id !== item.id));
                            }}
                            className="text-[9px] text-rose-600 hover:text-rose-700 font-bold ml-2"
                          >
                            Remove
                          </button>
                        )}
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleGenerateAuditReport}
                    className="w-full py-2 bg-indigo-900 text-white font-extrabold rounded hover:bg-indigo-800 text-xs tracking-wider uppercase transition cursor-pointer"
                  >
                    Generate Official Audit Certificate
                  </button>

                  {/* Visual Audit Progress Area Chart */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Audit Compliance Score Progress Report</span>
                      <span className="text-[9px] text-indigo-700 font-mono font-bold">HISTORICAL TREND</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { month: 'Jan', score: 68 },
                          { month: 'Feb', score: 72 },
                          { month: 'Mar', score: 79 },
                          { month: 'Apr', score: 84 },
                          { month: 'May', score: auditScore },
                        ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} domain={[40, 100]} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Area type="monotone" dataKey="score" stroke="#4f46e5" fill="#c7d2fe" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 6: Committee Management */}
              {selectedModule.name.includes("Committee Management") && (
                <div className="space-y-4">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide">
                    Hospital Committee Rosters & Minutes
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Active Committee Directories:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {committees.map((c, i) => (
                        <div key={i} className="p-2 bg-slate-50 border rounded-lg">
                          <div className="font-bold text-slate-800 text-[10.5px] leading-tight">{c.name}</div>
                          <div className="text-[9.5px] text-indigo-700 font-semibold mt-0.5">Chair: {c.chair}</div>
                          <div className="text-[9px] text-slate-400 font-medium font-mono">{c.frequency} meetings</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handlePostMinutes} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg space-y-2">
                    <div className="font-bold text-indigo-950 text-[10.5px]">Post New Meeting Minutes:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5 font-bold">Committee</label>
                        <select
                          value={selectedCommittee}
                          onChange={e => setSelectedCommittee(e.target.value)}
                          className="w-full p-1 border rounded bg-white text-[11px]"
                        >
                          {committees.map((c, i) => <option key={i} value={c.name}>{c.name.split(' Committee')[0]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5 font-bold">Date</label>
                        <input type="text" readOnly value="Today" className="w-full p-1 border rounded bg-slate-100 text-[11px]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5 font-bold">Decisions / Action Items</label>
                      <textarea
                        required
                        rows={2}
                        value={newMinuteText}
                        onChange={e => setNewMinuteText(e.target.value)}
                        placeholder="e.g. Conducted audit on medical waste colors. Resolved to change labels by tomorrow."
                        className="w-full p-1.5 border rounded bg-white text-[11px] font-sans"
                      />
                    </div>
                    <button type="submit" className="w-full py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-[10.5px] rounded cursor-pointer uppercase tracking-wider">
                      Publish Official Meeting Minutes
                    </button>
                  </form>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Recent Minutes Feed:</div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {committeeMinutes.map(m => (
                        <div key={m.id} className="p-2.5 border rounded-lg bg-white shadow-3xs space-y-1">
                          <div className="flex justify-between text-[10px] font-extrabold text-slate-500">
                            <span>{m.committee}</span>
                            <span className="font-mono">{m.date}</span>
                          </div>
                          <p className="text-slate-700 leading-normal text-xs">{m.text}</p>
                          <div className="text-[9.5px] text-indigo-700 font-semibold font-mono">Presided by: {m.chair}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Committee Meeting Bar Chart */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Committee Resolutions & Action Tracking</span>
                      <span className="text-[9px] text-indigo-700 font-mono font-bold">BY COMMITTEE</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={committees.map(c => ({
                          name: c.name.split(' Committee')[0],
                          minutes: committeeMinutes.filter(m => m.committee === c.name).length
                        }))} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Bar dataKey="minutes" fill="#1e1b4b" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 7: Patient Safety Indicators */}
              {selectedModule.name.includes("Patient Safety") && (
                <div className="space-y-4">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide">
                    Surgical Safety & High-Alert Sign-Offs
                  </div>

                  {/* Surgical safety box */}
                  <div className="p-3 border border-indigo-100 bg-indigo-50/50 rounded-lg space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-indigo-950 text-[11px]">Surgical Safety Time-Out Protocol</div>
                      {timeoutCheck.identityVerified && timeoutCheck.siteMarked && timeoutCheck.anesthesiaChecked && timeoutCheck.instrumentsCounted ? (
                        <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">Ready for Incision</span>
                      ) : (
                        <span className="bg-amber-100 border border-amber-200 text-amber-800 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">Checks Pending</span>
                      )}
                    </div>
                    
                    <p className="text-slate-500 text-[10px]">Patient: <strong>Sanya Sharma (Appendectomy)</strong></p>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <label className="flex items-center gap-1.5 bg-white p-1.5 border rounded cursor-pointer hover:bg-slate-50">
                        <input 
                          type="checkbox" 
                          checked={timeoutCheck.identityVerified}
                          onChange={e => setTimeoutCheck(prev => ({ ...prev, identityVerified: e.target.checked }))}
                          className="rounded text-indigo-900"
                        />
                        <span>Identity Confirmed</span>
                      </label>
                      <label className="flex items-center gap-1.5 bg-white p-1.5 border rounded cursor-pointer hover:bg-slate-50">
                        <input 
                          type="checkbox" 
                          checked={timeoutCheck.siteMarked}
                          onChange={e => setTimeoutCheck(prev => ({ ...prev, siteMarked: e.target.checked }))}
                          className="rounded text-indigo-900"
                        />
                        <span>Surgical Site Marked</span>
                      </label>
                      <label className="flex items-center gap-1.5 bg-white p-1.5 border rounded cursor-pointer hover:bg-slate-50">
                        <input 
                          type="checkbox" 
                          checked={timeoutCheck.anesthesiaChecked}
                          onChange={e => setTimeoutCheck(prev => ({ ...prev, anesthesiaChecked: e.target.checked }))}
                          className="rounded text-indigo-900"
                        />
                        <span>Anesthesia Safety Checked</span>
                      </label>
                      <label className="flex items-center gap-1.5 bg-white p-1.5 border rounded cursor-pointer hover:bg-slate-50">
                        <input 
                          type="checkbox" 
                          checked={timeoutCheck.instrumentsCounted}
                          onChange={e => setTimeoutCheck(prev => ({ ...prev, instrumentsCounted: e.target.checked }))}
                          className="rounded text-indigo-900"
                        />
                        <span>Sponges/Needles Counted</span>
                      </label>
                    </div>
                  </div>

                  {/* Dual Nursing form */}
                  <form onSubmit={handleDualSignoffSubmit} className="p-3 bg-slate-50 border rounded-lg space-y-2">
                    <div className="font-bold text-slate-800 text-[10.5px]">High-Alert Drug Dual Nursing Sign-off:</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5 font-bold">Drug</label>
                        <select
                          value={signOffDrug}
                          onChange={e => setSignOffDrug(e.target.value)}
                          className="w-full p-1 border rounded bg-white text-[11px]"
                        >
                          <option value="Insulin Infusion">Insulin Infusion</option>
                          <option value="Heparin Injection">Heparin Injection</option>
                          <option value="KCl Ampoule">KCl Ampoule</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5 font-bold">Nurse 1</label>
                        <input 
                          type="text" 
                          required
                          value={nurse1}
                          onChange={e => setNurse1(e.target.value)}
                          placeholder="Nurse Deepa" 
                          className="w-full p-1 border rounded bg-white text-[11px]" 
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5 font-bold">Nurse 2 (Witness)</label>
                        <input 
                          type="text" 
                          required
                          value={nurse2}
                          onChange={e => setNurse2(e.target.value)}
                          placeholder="Nurse George" 
                          className="w-full p-1 border rounded bg-white text-[11px]" 
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10.5px] rounded cursor-pointer uppercase">
                      Confirm Verification Stamp
                    </button>
                  </form>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Recent Dual Verified Stamps:</div>
                    <div className="space-y-1.5">
                      {signOffLogs.map((log, idx) => (
                        <div key={idx} className="p-2 border rounded bg-white flex justify-between items-center text-[11px]">
                          <div>
                            <span className="font-extrabold text-indigo-900 block">{log.drug}</span>
                            <span className="text-[10px] text-slate-500 font-medium">Logged: {log.time}</span>
                          </div>
                          <span className="text-[10.5px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                            ✔ Dual-Verified: {log.nurse1} & {log.nurse2}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Patient Safety Compliance Line Chart */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Surgical Time-Out & Dual-Signoff Compliance Rate</span>
                      <span className="text-[9px] text-indigo-700 font-mono font-bold">BY MONTH</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { month: 'Jan', rate: 92 },
                          { month: 'Feb', rate: 94 },
                          { month: 'Mar', rate: 95 },
                          { month: 'Apr', rate: 98 },
                          { month: 'May', rate: (timeoutCheck.identityVerified ? 25 : 0) + (timeoutCheck.siteMarked ? 25 : 0) + (timeoutCheck.anesthesiaChecked ? 25 : 0) + (timeoutCheck.instrumentsCounted ? 25 : 0) || 85 },
                        ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} domain={[70, 100]} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Line type="monotone" dataKey="rate" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 8: Staff Credentialing & Privileging */}
              {selectedModule.name.includes("Staff Credentialing") && (
                <div className="space-y-4">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide">
                    Professional Licenses & Clinical Privileges
                  </div>

                  {/* Register New Clinician Form */}
                  <form onSubmit={handleAddStaff} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="font-bold text-slate-800 text-[10.5px] uppercase">Enroll New Clinical Staff:</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newStaffName}
                          onChange={e => setNewStaffName(e.target.value)}
                          placeholder="e.g. Dr. Anaya Roy"
                          className="w-full p-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Role / Speciality</label>
                        <input
                          type="text"
                          required
                          value={newStaffRole}
                          onChange={e => setNewStaffRole(e.target.value)}
                          placeholder="e.g. Pediatrician"
                          className="w-full p-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Registration No.</label>
                        <input
                          type="text"
                          required
                          value={newStaffReg}
                          onChange={e => setNewStaffReg(e.target.value)}
                          placeholder="e.g. MCI-90281"
                          className="w-full p-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Allowed Privilege</label>
                        <input
                          type="text"
                          required
                          value={newStaffPrivs}
                          onChange={e => setNewStaffPrivs(e.target.value)}
                          placeholder="e.g. Neonatal Intubation"
                          className="w-full p-1 border rounded bg-white"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-[10.5px] rounded cursor-pointer uppercase">
                      Register Clinician Credential
                    </button>
                  </form>

                  <form onSubmit={handleAddPrivilege} className="p-3 bg-slate-50 border rounded-lg space-y-2.5">
                    <div className="font-bold text-slate-800 text-[10.5px] uppercase">Approve Additional Clinical Privilege:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5 font-bold">Clinician</label>
                        <select
                          value={privilegeDocName}
                          onChange={e => setPrivilegeDocName(e.target.value)}
                          className="w-full p-1 border rounded bg-white text-[11px]"
                        >
                          {staffList.map((s, i) => <option key={i} value={s.name}>{s.name} ({s.role})</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5 font-bold">Special Privilege</label>
                        <input
                          type="text"
                          required
                          value={newPrivilegeText}
                          onChange={e => setNewPrivilegeText(e.target.value)}
                          placeholder="e.g. Endovascular stent grafts"
                          className="w-full p-1 border rounded bg-white text-[11px]"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-[10.5px] rounded cursor-pointer uppercase">
                      Issue Authorization Seal
                    </button>
                  </form>

                  {/* Clinician Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search clinicians by name, role, registration number..."
                      value={staffSearch}
                      onChange={e => setStaffSearch(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 border rounded bg-white text-[11px] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Clinician Registers:</div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {staffList.filter(s => 
                        s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        s.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        s.regNo.toLowerCase().includes(staffSearch.toLowerCase())
                      ).map((s, i) => (
                        <div key={i} className="p-2.5 border rounded-lg bg-white space-y-1 flex justify-between items-center hover:shadow-xs transition">
                          <div>
                            <div className="font-bold text-slate-800 text-[11px]">{s.name} <span className="text-[10px] font-medium text-slate-400">({s.role})</span></div>
                            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Reg No: {s.regNo} | Expiry: {s.expiry}</div>
                            <div className="text-[10px] text-indigo-700 font-semibold mt-1">Allowed: {s.privileges}</div>
                          </div>

                          <div className="flex flex-col gap-1 items-end">
                            <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold border ${
                              s.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                              s.status === 'Expiring Soon' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                            }`}>
                              {s.status}
                            </span>
                            <div className="flex gap-1.5 mt-1">
                              {s.status !== 'Active' && (
                                <button
                                  onClick={() => handleRenewStaffLicense(s.name)}
                                  className="px-1.5 py-0.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-[9.5px] font-bold cursor-pointer"
                                >
                                  Renew
                                </button>
                              )}
                              {staffList.length > 3 && (
                                <button
                                  onClick={() => setStaffList(prev => prev.filter(item => item.regNo !== s.regNo))}
                                  className="px-1.5 py-0.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded text-[9.5px] font-bold"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Staff Credentials Status Breakdown */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Professional Licensure & Credentialing Report</span>
                      <span className="text-[9px] text-indigo-700 font-mono font-bold">STATE-DRIVEN</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { status: 'Active', count: staffList.filter(s => s.status === 'Active').length },
                          { status: 'Expiring Soon', count: staffList.filter(s => s.status === 'Expiring Soon').length },
                          { status: 'Expired', count: staffList.filter(s => s.status === 'Expired').length },
                        ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="status" tick={{ fontSize: 8, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Bar dataKey="count" fill="#4338ca" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 9: Equipment Management */}
              {selectedModule.name.includes("Equipment Management") && (
                <div className="space-y-4">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide">
                    Hospital Equipment Calibration Log
                  </div>

                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Critical bedside monitors and life-support ventilators require mandatory calibration every 6 months under NABH guidelines.
                  </p>

                  {/* Register New Equipment Form */}
                  <form onSubmit={handleAddEquipment} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="font-bold text-slate-800 text-[10.5px] uppercase">Register New Asset:</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Asset Name</label>
                        <input
                          type="text"
                          required
                          value={newEqName}
                          onChange={e => setNewEqName(e.target.value)}
                          placeholder="e.g. Syringe Infusion Pump"
                          className="w-full p-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Serial Number</label>
                        <input
                          type="text"
                          required
                          value={newEqSerial}
                          onChange={e => setNewEqSerial(e.target.value)}
                          placeholder="e.g. SP-4402"
                          className="w-full p-1 border rounded bg-white"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-[10.5px] rounded cursor-pointer uppercase">
                      Add to Asset Inventory
                    </button>
                  </form>

                  {/* Equipment Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search assets by name or serial number..."
                      value={equipmentSearch}
                      onChange={e => setEquipmentSearch(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 border rounded bg-white text-[11px] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {equipmentList.filter(eq => 
                      eq.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
                      eq.serial.toLowerCase().includes(equipmentSearch.toLowerCase())
                    ).map((eq, i) => (
                      <div key={i} className="p-3 border rounded-lg bg-white shadow-3xs flex justify-between items-center hover:shadow-xs transition">
                        <div>
                          <div className="font-bold text-slate-800 text-xs">{eq.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">SN: {eq.serial} | Last calibrated: {eq.lastCalib}</div>
                          <div className="text-[10px] mt-1">
                            Status: <strong className={
                              eq.status === 'Calibrated' ? "text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded" :
                              eq.status === 'Service Overdue' ? "text-amber-700 bg-amber-50 px-1 py-0.5 rounded animate-pulse" : "text-rose-700 bg-rose-50 px-1 py-0.5 rounded"
                            }>{eq.status}</strong>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 items-end">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCalibrateNow(eq.serial)}
                              className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[9.5px] font-black uppercase cursor-pointer"
                            >
                              Calibrate OK
                            </button>
                            <button
                              onClick={() => handleReportBreakdown(eq.serial)}
                              className="px-2 py-0.5 bg-white border border-rose-250 text-rose-700 hover:bg-rose-50 rounded text-[9.5px] font-bold cursor-pointer"
                            >
                              Breakdown
                            </button>
                          </div>
                          {equipmentList.length > 3 && (
                            <button 
                              onClick={() => setEquipmentList(prev => prev.filter(item => item.serial !== eq.serial))}
                              className="text-[9.5px] text-rose-600 hover:text-rose-700 font-bold"
                            >
                              Deregister Asset
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[9.5px]">
                    <div className="text-indigo-300 font-bold border-b border-slate-800 pb-0.5 mb-1 uppercase">Calibration Feed:</div>
                    {calibLog.map((log, i) => <div key={i} className="leading-tight mb-0.5">• {log}</div>)}
                  </div>

                  {/* Visual Equipment Calibration Pie/Bar Chart */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Biomedical Asset Calibration Integrity Report</span>
                      <span className="text-[9px] text-indigo-700 font-mono font-bold">STATE-DRIVEN</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { status: 'Calibrated', count: equipmentList.filter(e => e.status === 'Calibrated').length },
                          { status: 'Overdue', count: equipmentList.filter(e => e.status === 'Service Overdue').length },
                          { status: 'Breakdown', count: equipmentList.filter(e => e.status === 'Breakdown').length },
                        ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="status" tick={{ fontSize: 8, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Bar dataKey="count" fill="#0d9488" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 10: Training Management & Competency */}
              {selectedModule.name.includes("Training Management") && (
                <div className="space-y-4">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide">
                    Staff Clinical Competency Logs
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <form onSubmit={handleCreateTraining} className="p-2.5 bg-slate-50 border rounded-lg space-y-1.5">
                      <div className="font-bold text-slate-800 text-[10px] uppercase">Plan New Training:</div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Fire Resuscitation"
                        value={newTrainingTitle}
                        onChange={e => setNewTrainingTitle(e.target.value)}
                        className="w-full p-1 border rounded bg-white text-[11px]"
                      />
                      <button type="submit" className="w-full py-1 bg-indigo-900 hover:bg-indigo-800 text-white text-[10px] font-bold rounded cursor-pointer uppercase">
                        Schedule
                      </button>
                    </form>

                    <form onSubmit={handleAddTrainingLog} className="p-2.5 bg-slate-50 border rounded-lg space-y-1.5">
                      <div className="font-bold text-slate-800 text-[10px] uppercase">Record Exam Score:</div>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          required
                          placeholder="Staff Name"
                          value={traineeName}
                          onChange={e => setTraineeName(e.target.value)}
                          className="w-full p-1 border rounded bg-white text-[11px] min-w-0"
                        />
                        <select
                          value={traineeCourse}
                          onChange={e => setTraineeCourse(e.target.value)}
                          className="p-1 border rounded bg-white text-[10px] min-w-0"
                        >
                          {trainings.map((t, idx) => <option key={idx} value={t.title}>{t.title.substring(0, 15)}...</option>)}
                        </select>
                      </div>
                      <button type="submit" className="w-full py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold rounded cursor-pointer uppercase">
                        Log Exam Score
                      </button>
                    </form>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Training Catalog:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {trainings.map(t => (
                        <div key={t.id} className="p-2 bg-slate-50 border rounded-lg text-center">
                          <div className="font-bold text-slate-800 text-[10.5px] truncate">{t.title}</div>
                          <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">Enrolled: {t.enrolled}</div>
                          <div className="text-[9px] text-slate-400 font-mono mt-0.5">Avg: {t.avgScore}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 bg-slate-950 text-slate-200 p-2.5 rounded font-mono text-[9.5px]">
                    <div className="text-emerald-400 font-bold border-b border-slate-800 pb-0.5 mb-1 uppercase">Verified Competency Records:</div>
                    {trainingLogs.map((log, i) => <div key={i} className="leading-tight mb-0.5">• {log}</div>)}
                  </div>

                  {/* Visual Training Performance Bar Chart */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Clinical Staff Training Performance Report</span>
                      <span className="text-[9px] text-indigo-700 font-mono font-bold">STATE-DRIVEN</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trainings.map(t => ({
                          name: t.title.substring(0, 10),
                          score: parseFloat(t.avgScore) || 80
                        }))} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} domain={[50, 100]} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Bar dataKey="score" fill="#4f46e5" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 11: Consent Management */}
              {selectedModule.name.includes("Consent Management") && (
                <div className="space-y-4">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wide">
                    Bilingual Digital Consent Stamps
                  </div>

                  <form onSubmit={handleGenerateConsent} className="p-3 bg-slate-50 border rounded-lg space-y-2.5">
                    <div className="font-bold text-slate-800 text-[11px] flex justify-between items-center">
                      <span>Generate New Surgical & Anesthesia Consent:</span>
                      <select 
                        value={consentLanguage}
                        onChange={e => setConsentLanguage(e.target.value)}
                        className="p-1 border rounded bg-white text-[10px] font-bold text-indigo-900"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Patient Name</label>
                        <input
                          type="text"
                          required
                          value={consentPatient}
                          onChange={e => setConsentPatient(e.target.value)}
                          className="w-full p-1 border rounded bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Procedure Description</label>
                        <input
                          type="text"
                          required
                          value={consentProcedure}
                          onChange={e => setConsentProcedure(e.target.value)}
                          className="w-full p-1 border rounded bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-2 bg-amber-50 border border-amber-100 rounded text-[10px] text-slate-600 leading-snug">
                      {consentLanguage === "English" && "✔ Risks explained clearly. Patient has chosen laparoscopic entry route and consented to blood transfusion options."}
                      {consentLanguage === "Hindi" && "✔ जोखिमों को स्पष्ट रूप से समझाया गया। मरीज ने लेप्रोस्कोपिक विधि और रक्त आधान विकल्पों पर सहमति दी है।"}
                      {consentLanguage === "Kannada" && "✔ ಅಪಾಯಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಲಾಗಿದೆ. ರೋಗಿಯು ಲ್ಯಾಪರೊಸ್ಕೋಪಿಕ್ ವಿಧಾನಕ್ಕೆ ಒಪ್ಪಿಗೆ ನೀಡಿದ್ದಾರೆ."}
                      {consentLanguage === "Tamil" && "✔ அபாயங்கள் தெளிவாக விளக்கப்பட்டுள்ளன. நோயாளி லேப்ராஸ்கோபிக் முறைக்கு ஒப்புதல் அளித்துள்ளார்."}
                    </div>

                    <div className="flex gap-2">
                      <label className="flex items-center gap-1.5 text-[11px]">
                        <input type="checkbox" required defaultChecked className="rounded text-indigo-900" />
                        <span>Witness clinician signature</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={consentWitness}
                        onChange={e => setConsentWitness(e.target.value)}
                        className="p-1 border rounded text-[10px] flex-1 bg-white"
                      />
                    </div>

                    <button type="submit" className="w-full py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-extrabold text-[11px] rounded cursor-pointer uppercase">
                      Confirm Signature & Generate Blockchain Stamp
                    </button>
                  </form>

                  {generatedStamp && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-center font-mono text-[10px] text-emerald-800 animate-pulse">
                      <div className="font-extrabold text-xs">STAMP REGISTERED SUCCESSFULLY:</div>
                      <div className="mt-1">{generatedStamp}</div>
                      <div className="text-[9px] text-slate-400 mt-1">Stamping validated under central EMR gateway ID.</div>
                    </div>
                  )}

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Consent Registry Database:</div>
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold font-mono">
                        {consentLogs.length} Records
                      </span>
                    </div>

                    {/* Search Registry */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search patient, procedure, witness, language..."
                        value={consentSearch}
                        onChange={e => setConsentSearch(e.target.value)}
                        className="w-full pl-7 pr-3 py-1 border rounded bg-white text-[11px] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Detail Modal Overlay inside Drawer */}
                    {selectedConsentDetail && (
                      <div className="p-3 bg-slate-900 text-slate-100 rounded-lg space-y-3 border border-slate-800 shadow-xl relative animate-fadeIn">
                        <button 
                          onClick={() => setSelectedConsentDetail(null)}
                          className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="font-extrabold text-xs text-indigo-300 uppercase tracking-wide">Blockchain Stamp Audit Ledger</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                          <div>
                            <span className="text-slate-500 block uppercase text-[8px]">Consent ID</span>
                            <span className="font-bold text-white">{selectedConsentDetail.id}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase text-[8px]">Date & Time</span>
                            <span className="font-bold text-slate-300">{selectedConsentDetail.date || "Yesterday"}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block uppercase text-[8px]">Patient Name</span>
                            <span className="font-bold text-teal-300 text-[11px]">{selectedConsentDetail.patient}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block uppercase text-[8px]">Procedure Acknowledged</span>
                            <span className="font-bold text-indigo-300">{selectedConsentDetail.procedure}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase text-[8px]">Selected Lang</span>
                            <span className="font-bold text-white uppercase">{selectedConsentDetail.lang}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase text-[8px]">Witness Clinician</span>
                            <span className="font-bold text-emerald-300">{selectedConsentDetail.witness}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[9px] leading-tight">
                          <div className="text-teal-400 font-bold uppercase tracking-wider text-[8px]">SHA256 Cryptographic Hash:</div>
                          <div className="bg-slate-900 p-1 rounded border border-slate-800 break-all text-slate-300 select-all font-bold">
                            {selectedConsentDetail.stamp}
                          </div>
                          <div className="flex items-center gap-1.5 mt-2 text-slate-400 text-[8px]">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                            <span>STAMP ACTIVE ON NATIONAL ABDM REGISTER GATEWAY</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleConsentStatus(selectedConsentDetail.id)}
                            className={`flex-1 py-1 font-bold rounded text-[10px] cursor-pointer ${
                              selectedConsentDetail.status === 'Active'
                                ? 'bg-rose-900 hover:bg-rose-850 text-rose-200'
                                : 'bg-emerald-900 hover:bg-emerald-850 text-emerald-200'
                            }`}
                          >
                            {selectedConsentDetail.status === 'Active' ? 'Revoke Consent' : 'Activate Consent'}
                          </button>
                          <button
                            onClick={() => setSelectedConsentDetail(null)}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 font-bold rounded text-[10px]"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Registry List */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {consentLogs.filter(log => 
                        log.patient.toLowerCase().includes(consentSearch.toLowerCase()) ||
                        log.procedure.toLowerCase().includes(consentSearch.toLowerCase()) ||
                        log.witness.toLowerCase().includes(consentSearch.toLowerCase()) ||
                        log.lang.toLowerCase().includes(consentSearch.toLowerCase()) ||
                        log.id.toLowerCase().includes(consentSearch.toLowerCase())
                      ).map(log => (
                        <div 
                          key={log.id} 
                          className={`p-2 border rounded-lg bg-white flex flex-col gap-1.5 text-[11px] hover:shadow-sm transition ${
                            log.status === 'Revoked' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-250'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-extrabold text-slate-800 block leading-tight">
                                {log.patient}
                              </span>
                              <span className="text-[10.5px] text-indigo-950 font-bold block leading-tight mt-0.5">
                                {log.procedure}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider ${
                                log.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {log.status}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">{log.id}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-50 pt-1">
                            <div>
                              <span>Witness: <strong className="text-slate-700">{log.witness}</strong> | Lang: <strong>{log.lang}</strong></span>
                              {log.date && <span className="block text-[8.5px] text-slate-400 font-mono">{log.date}</span>}
                            </div>
                            <span className="font-mono text-[9px] bg-slate-50 text-slate-600 px-1 py-0.2 rounded border max-w-[100px] truncate" title={log.stamp}>
                              {log.stamp.substring(0, 15)}...
                            </span>
                          </div>

                          {/* Action Bar */}
                          <div className="flex gap-2 justify-end border-t border-slate-50 pt-1.5 mt-0.5">
                            <button
                              onClick={() => setSelectedConsentDetail(log)}
                              className="px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded text-[9.5px] flex items-center gap-1 cursor-pointer transition border border-slate-200"
                              title="Audit Stamp Verification"
                            >
                              <Eye className="w-3 h-3 text-slate-500" /> Verify Stamp
                            </button>
                            <button
                              onClick={() => handleToggleConsentStatus(log.id)}
                              className={`px-1.5 py-0.5 font-bold rounded text-[9.5px] flex items-center gap-0.5 cursor-pointer transition border ${
                                log.status === 'Active' 
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' 
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {log.status === 'Active' ? <Ban className="w-3 h-3 text-amber-600" /> : <Check className="w-3 h-3 text-emerald-600" />}
                              {log.status === 'Active' ? 'Revoke' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteConsent(log.id)}
                              className="p-1 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded transition cursor-pointer"
                              title="Delete Consent Record"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {consentLogs.filter(log => 
                        log.patient.toLowerCase().includes(consentSearch.toLowerCase()) ||
                        log.procedure.toLowerCase().includes(consentSearch.toLowerCase()) ||
                        log.witness.toLowerCase().includes(consentSearch.toLowerCase()) ||
                        log.lang.toLowerCase().includes(consentSearch.toLowerCase()) ||
                        log.id.toLowerCase().includes(consentSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="py-4 text-center text-slate-400 text-[10.5px]">
                          No records match search criteria.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visual Consent Language Distribution Pie Chart */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Informed Consent Bilingual Language Distribution Report</span>
                      <span className="text-[9px] text-indigo-700 font-mono font-bold">STATE-DRIVEN</span>
                    </div>
                    <div className="h-28 w-full flex justify-center items-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'English', value: consentLogs.filter(c => c.lang === 'English').length || 1 },
                              { name: 'Hindi', value: consentLogs.filter(c => c.lang === 'Hindi').length || 1 },
                              { name: 'Kannada', value: consentLogs.filter(c => c.lang === 'Kannada').length || 1 },
                              { name: 'Tamil', value: consentLogs.filter(c => c.lang === 'Tamil').length || 1 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={40}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {['#4f46e5', '#f59e0b', '#10b981', '#ec4899'].map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col text-[8.5px] text-slate-500 font-mono pl-2 border-l">
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> EN</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> HI</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> KA</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span> TA</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Module 12: Risk Management */}
              {selectedModule.name.includes("Risk Management") && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <div className="font-bold text-slate-800 uppercase tracking-wide">
                      Hospital Hazard Matrices & Safety Drill Alarms
                    </div>
                    <button
                      onClick={handleTriggerDrill}
                      className="px-2 py-1 bg-rose-700 hover:bg-rose-800 text-white font-black text-[10px] rounded flex items-center gap-1 transition animate-pulse cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5" /> Trigger Mock Fire Drill
                    </button>
                  </div>

                  {drillActive && (
                    <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 leading-normal animate-pulse text-[11px] font-bold border-l-4 border-l-rose-700 flex gap-2">
                      <AlertOctagon className="w-5 h-5 text-rose-700 flex-shrink-0" />
                      <div>
                        <div>📢 MOCK EMERGENCY FIRE DRILL ACTIVE across all wards!</div>
                        <div className="text-[10px] text-rose-600 mt-0.5 font-medium font-sans">EVACUATION DOORS RELEASED. SPRINKLERS ARMED. SIMULATION COUNTDOWN: 15:00 MINS.</div>
                      </div>
                    </div>
                  )}

                  {/* Register New Hazard Form */}
                  <form onSubmit={handleAddRisk} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="font-bold text-slate-800 text-[10.5px] uppercase">Identify New Hazard Risk:</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="col-span-2">
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Hazard Description</label>
                        <input
                          type="text"
                          required
                          value={newHazardName}
                          onChange={e => setNewHazardName(e.target.value)}
                          placeholder="e.g. Critical backup UPS generator fuel level low"
                          className="w-full p-1 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Risk Level</label>
                        <select
                          value={newHazardLevel}
                          onChange={e => setNewHazardLevel(e.target.value)}
                          className="w-full p-1 border rounded bg-white text-xs"
                        >
                          <option value="Critical">Critical Risk</option>
                          <option value="Medium">Medium Risk</option>
                          <option value="Low">Low Risk</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 uppercase mb-0.5">Action</label>
                        <button type="submit" className="w-full py-1 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-[10.5px] rounded cursor-pointer uppercase">
                          Log Hazard
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Hazard Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search hazard matrices by threat profile..."
                      value={riskSearch}
                      onChange={e => setRiskSearch(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 border rounded bg-white text-[11px] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {riskItems.filter(item => 
                      item.hazard.toLowerCase().includes(riskSearch.toLowerCase()) ||
                      item.level.toLowerCase().includes(riskSearch.toLowerCase())
                    ).map((item, idx) => (
                      <div key={idx} className="p-2.5 border rounded-lg bg-slate-50 flex flex-col justify-between hover:shadow-xs transition">
                        <div>
                          <div className="font-bold text-slate-800 text-[10.5px] leading-tight line-clamp-2" title={item.hazard}>
                            {item.hazard}
                          </div>
                          <div className="flex justify-between items-center mt-2.5">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              item.level === 'Critical' ? 'bg-rose-100 text-rose-800' :
                              item.level === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.level} Risk
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">Status: {item.status}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end border-t border-slate-200/60 pt-2 mt-2">
                          <button
                            onClick={() => {
                              setRiskItems(prev => prev.map((r, i) => i === idx ? { ...r, status: r.status === 'Resolved' ? 'Mitigating' : 'Resolved' } : r));
                              setRiskActionLog(prev => [`Status of "${item.hazard.substring(0, 20)}..." updated to ${item.status === 'Resolved' ? 'Mitigating' : 'Resolved'}`, ...prev]);
                            }}
                            className="text-[9.5px] text-indigo-700 hover:text-indigo-800 font-bold"
                          >
                            Toggle Status
                          </button>
                          {riskItems.length > 3 && (
                            <button
                              onClick={() => {
                                setRiskItems(prev => prev.filter((_, i) => i !== idx));
                                setRiskActionLog(prev => [`Deleted hazard risk: "${item.hazard.substring(0, 25)}..."`, ...prev]);
                              }}
                              className="text-[9.5px] text-rose-600 hover:text-rose-700 font-bold"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[9.5px]">
                    <div className="text-rose-400 font-bold border-b border-slate-800 pb-0.5 mb-1 uppercase">Disaster Management Registry:</div>
                    {riskActionLog.map((log, i) => <div key={i} className="leading-tight mb-0.5">• {log}</div>)}
                  </div>

                  {/* Visual Risk Matrices Bar Chart */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wide flex justify-between">
                      <span>Proactive Risk Threat Mitigation Matrix Report</span>
                      <span className="text-[9px] text-rose-700 font-mono font-bold">STATE-DRIVEN</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { level: 'Critical', count: riskItems.filter(r => r.level === 'Critical').length },
                          { level: 'Medium', count: riskItems.filter(r => r.level === 'Medium').length },
                          { level: 'Low', count: riskItems.filter(r => r.level === 'Low').length },
                        ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="level" tick={{ fontSize: 8, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                          <Bar dataKey="count" fill="#b91c1c" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Bot Prompt trigger */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 bg-gradient-to-r from-sky-50 to-indigo-50 p-3 rounded-lg">
                <Sparkles className="w-4 h-4 text-indigo-700 animate-pulse flex-shrink-0" />
                <div className="flex-1 text-[11px] text-indigo-950 font-medium font-sans">
                  Need a custom compliance policy drafted or pre-assessment review summarized?
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
