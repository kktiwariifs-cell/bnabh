import React, { useState } from 'react';
import { Patient, Appointment, BedCategory, AlertNotification, Incident, ComplianceMilestone, HmsUser } from '../types';
import { 
  Shield, Users, Activity, HeartPulse, CreditCard, Droplet, Contact2, Package, 
  ChefHat, Truck, LogOut, BarChart3, UserCheck, Lock, CheckCircle2, ChevronRight, 
  HelpCircle, Sparkles, X, Plus, Search, Trash2, Edit, Settings, ClipboardCheck, 
  FileText, Check, History, UserPlus, Play, Bell, AlertTriangle, Printer, Info, 
  Key, Database, Network, DollarSign, MessageSquare, Cpu, Globe, ArrowRight, ShieldAlert,
  Flame, HardDrive, RefreshCw, Eye, BookOpen, Send, CheckSquare, ShieldCheck, Pill, FlaskConical
} from 'lucide-react';

// Sub-components
import PatientWidget from './PatientWidget';
import ClinicalSummaryWidget from './ClinicalSummaryWidget';
import BedBoardWidget from './BedBoardWidget';
import AppointmentsWidget from './AppointmentsWidget';
import AlertsWidget from './AlertsWidget';
import NabhModulesList from './NabhModulesList';
import NabhDashboardWidget from './NabhDashboardWidget';
import IntegrationsFeaturesWidget from './IntegrationsFeaturesWidget';
import FooterWidget from './FooterWidget';

interface PanelWorkspaceProps {
  activePanel: string;
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
  onAddPatient: (patient: Patient) => void;
  appointments: Appointment[];
  onAddAppointment: (app: Appointment) => void;
  beds: BedCategory[];
  onUpdateBeds: (beds: BedCategory[]) => void;
  alerts: AlertNotification[];
  onUpdateAlerts: (alerts: AlertNotification[]) => void;
  incidents: Incident[];
  onAddIncident: (inc: Incident) => void;
  milestones: ComplianceMilestone[];
  onToggleMilestone: (id: string) => void;
  onTriggerAiCapa: (incident: Incident) => void;
  aiGeneratingId: string | null;
  currentUser?: HmsUser | null;
}

export default function PanelWorkspace({
  activePanel,
  patients,
  selectedPatient,
  onSelectPatient,
  onUpdatePatient,
  onAddPatient,
  appointments,
  onAddAppointment,
  beds,
  onUpdateBeds,
  alerts,
  onUpdateAlerts,
  incidents,
  onAddIncident,
  milestones,
  onToggleMilestone,
  onTriggerAiCapa,
  aiGeneratingId,
  currentUser,
}: PanelWorkspaceProps) {

  // Patient Dossier modal state
  const [dossierPatient, setDossierPatient] = useState<Patient | null>(null);
  const [dossierNotes, setDossierNotes] = useState<string>('');
  const [dossierSignatureHash, setDossierSignatureHash] = useState<string>('');
  const [dossierSigner, setDossierSigner] = useState<string>('');
  const [dossierSignerTitle, setDossierSignerTitle] = useState<string>('');
  const [isDossierSigning, setIsDossierSigning] = useState<boolean>(false);
  const [isDossierSyncing, setIsDossierSyncing] = useState<boolean>(false);
  const [isDossierPrinting, setIsDossierPrinting] = useState<boolean>(false);

  // Active Tab for PatientWidget and IPD Admission States
  const [patientActiveTab, setPatientActiveTab] = useState<string>('OPD');
  const [showIpdModal, setShowIpdModal] = useState<boolean>(false);
  const [ipdBedCategory, setIpdBedCategory] = useState<string>('General Ward');
  const [ipdDiagnosis, setIpdDiagnosis] = useState<string>('Acute Appendicitis');
  const [ipdDoctor, setIpdDoctor] = useState<string>('Dr. Amit Verma');

  // Interactive states for IPD Admission-Discharge-Transfer (ADT) List
  const [activeIpdActionPatient, setActiveIpdActionPatient] = useState<Patient | null>(null);
  const [ipdActionType, setIpdActionType] = useState<'discharge' | 'transfer' | null>(null);
  const [selectedTransferWard, setSelectedTransferWard] = useState<string>('Semi Private');
  const [dischargedUhids, setDischargedUhids] = useState<string[]>([]);
  const [patientWards, setPatientWards] = useState<Record<string, string>>({
    'UH00012345': 'General Ward',
    'UH00012346': 'General Ward',
    'UH00012347': 'General Ward'
  });
  const [patientBedNumbers, setPatientBedNumbers] = useState<Record<string, number>>({
    'UH00012345': 11,
    'UH00012346': 1,
    'UH00012347': 20
  });

  // OPD interactive states for Log Vitals and Send Lab
  const [vitalsPatientApp, setVitalsPatientApp] = useState<Appointment | null>(null);
  const [labPatientApp, setLabPatientApp] = useState<Appointment | null>(null);

  const [loggedVitalsMap, setLoggedVitalsMap] = useState<Record<string, { bp: string, hr: string, spo2: string, temp: string, resp: string }>>({});
  const [sentLabsMap, setSentLabsMap] = useState<Record<string, { tests: string[], priority: string, notes: string }>>({});

  // Individual Form States for Log Vitals Modal
  const [formBp, setFormBp] = useState('120/80');
  const [formHr, setFormHr] = useState('72');
  const [formSpo2, setFormSpo2] = useState('98');
  const [formTemp, setFormTemp] = useState('98.6');
  const [formResp, setFormResp] = useState('16');

  // Individual Form States for Send Lab Modal
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [labPriority, setLabPriority] = useState('Routine');
  const [labNotes, setLabNotes] = useState('');

  // Reset form states when modal opens
  React.useEffect(() => {
    if (vitalsPatientApp) {
      const existing = loggedVitalsMap[vitalsPatientApp.id];
      setFormBp(existing?.bp || '120/80');
      setFormHr(existing?.hr || '72');
      setFormSpo2(existing?.spo2 || '98');
      setFormTemp(existing?.temp || '98.6');
      setFormResp(existing?.resp || '16');
    }
  }, [vitalsPatientApp, loggedVitalsMap]);

  React.useEffect(() => {
    if (labPatientApp) {
      const existing = sentLabsMap[labPatientApp.id];
      setSelectedTests(existing?.tests || []);
      setLabPriority(existing?.priority || 'Routine');
      setLabNotes(existing?.notes || '');
    }
  }, [labPatientApp, sentLabsMap]);

  const handleSaveVitals = () => {
    if (!vitalsPatientApp) return;
    setLoggedVitalsMap(prev => ({
      ...prev,
      [vitalsPatientApp.id]: {
        bp: formBp,
        hr: formHr,
        spo2: formSpo2,
        temp: formTemp,
        resp: formResp
      }
    }));
    
    // Push an alert notification for visual feedback
    const newAlert: AlertNotification = {
      id: `AL-VT-${Date.now()}`,
      type: 'success',
      title: 'Vitals Logged Successfully',
      count: 1,
      description: `Vitals for ${vitalsPatientApp.patientName} logged (BP: ${formBp}, HR: ${formHr}) & synced to ABDM Gateway.`
    };
    onUpdateAlerts([newAlert, ...alerts]);

    setVitalsPatientApp(null);
  };

  const handleSendLab = () => {
    if (!labPatientApp) return;
    if (selectedTests.length === 0) {
      alert("Please select at least one laboratory test to request.");
      return;
    }
    setSentLabsMap(prev => ({
      ...prev,
      [labPatientApp.id]: {
        tests: [...selectedTests],
        priority: labPriority,
        notes: labNotes
      }
    }));

    // Push an alert notification for visual feedback
    const newAlert: AlertNotification = {
      id: `AL-LB-${Date.now()}`,
      type: 'info',
      title: 'Laboratory Request Sent',
      count: 1,
      description: `Lab request for ${labPatientApp.patientName} (${selectedTests.join(', ')}) sent to central lab.`
    };
    onUpdateAlerts([newAlert, ...alerts]);

    setLabPatientApp(null);
  };

  const toggleTestSelection = (testName: string) => {
    setSelectedTests(prev =>
      prev.includes(testName)
        ? prev.filter(t => t !== testName)
        : [...prev, testName]
    );
  };

  const handleIpdAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Update Bed occupancy
    const updatedBeds = beds.map(b => {
      if (b.name === ipdBedCategory) {
        return { ...b, occupied: Math.min(b.total, b.occupied + 1) };
      }
      return b;
    });
    onUpdateBeds(updatedBeds);

    // 2. Add Recent Visit log to selected patient
    const newVisit = {
      date: "Today",
      department: `IPD - ${ipdBedCategory}`,
      doctor: ipdDoctor
    };
    onUpdatePatient({
      ...selectedPatient,
      recentVisits: [newVisit, ...selectedPatient.recentVisits]
    });

    // 3. Create success alert
    const newAlert: AlertNotification = {
      id: `AL-IPD-${Date.now()}`,
      type: 'success',
      title: 'IPD Admission Confirmed',
      count: 1,
      description: `Patient ${selectedPatient.name} admitted to ${ipdBedCategory} under ${ipdDoctor} for ${ipdDiagnosis}.`
    };
    onUpdateAlerts([newAlert, ...alerts]);

    // Close modal
    setShowIpdModal(false);
  };

  const handleConfirmDischarge = () => {
    if (!activeIpdActionPatient) return;
    const p = activeIpdActionPatient;
    const ward = patientWards[p.uhid] || 'General Ward';

    // 1. Decrement bed occupied
    const updatedBeds = beds.map(b => {
      if (b.name === ward) {
        return { ...b, occupied: Math.max(0, b.occupied - 1) };
      }
      return b;
    });
    onUpdateBeds(updatedBeds);

    // 2. Add patient to discharged list
    setDischargedUhids(prev => [...prev, p.uhid]);

    // 3. Create success alert
    const newAlert: AlertNotification = {
      id: `AL-DIS-${Date.now()}`,
      type: 'success',
      title: 'Discharge Summary Signed Off',
      count: 1,
      description: `Discharge summary for ${p.name} signed off and patient discharged from ${ward}. Bed released.`
    };
    onUpdateAlerts([newAlert, ...alerts]);

    // Reset action state
    setActiveIpdActionPatient(null);
    setIpdActionType(null);
  };

  const handleConfirmTransfer = (newWard: string) => {
    if (!activeIpdActionPatient) return;
    const p = activeIpdActionPatient;
    const oldWard = patientWards[p.uhid] || 'General Ward';

    if (oldWard === newWard) {
      setActiveIpdActionPatient(null);
      setIpdActionType(null);
      return;
    }

    // 1. Update Bed occupancy
    const updatedBeds = beds.map(b => {
      if (b.name === oldWard) {
        return { ...b, occupied: Math.max(0, b.occupied - 1) };
      }
      if (b.name === newWard) {
        return { ...b, occupied: Math.min(b.total, b.occupied + 1) };
      }
      return b;
    });
    onUpdateBeds(updatedBeds);

    // 2. Update patient current ward mapping
    setPatientWards(prev => ({
      ...prev,
      [p.uhid]: newWard
    }));

    // 3. Create success alert
    const newAlert: AlertNotification = {
      id: `AL-XFER-${Date.now()}`,
      type: 'success',
      title: 'Bed Transfer Successful',
      count: 1,
      description: `Patient ${p.name} successfully transferred from ${oldWard} to ${newWard}.`
    };
    onUpdateAlerts([newAlert, ...alerts]);

    // Reset action state
    setActiveIpdActionPatient(null);
    setIpdActionType(null);
  };

  React.useEffect(() => {
    if (dossierPatient) {
      setDossierNotes('');
      setDossierSignatureHash('');
      setDossierSigner('');
      setDossierSignerTitle('');
    }
  }, [dossierPatient]);

  // Super Admin Local States
  const [adminTab, setAdminTab] = useState<'masters' | 'users' | 'system'>('masters');
  const [hospName, setHospName] = useState('Apex Multi-Specialty Hospital');
  const [branches, setBranches] = useState([
    { id: 'BR001', name: 'Main Campus (New Delhi)', type: 'Tertiary Care', beds: 120 },
    { id: 'BR002', name: 'South Delhi Extension', type: 'Satellite OPD', beds: 15 },
    { id: 'BR003', name: 'Gurugram Wellness Block', type: 'Rehab & Diagnostics', beds: 30 }
  ]);
  const [newBranchName, setNewBranchName] = useState('');
  
  const [adminUsers, setAdminUsers] = useState([
    { id: 'USR01', name: 'Dr. Amit Verma', role: 'Medical Director', dept: 'Cardiology', active: true },
    { id: 'USR02', name: 'Nurse Sunita Sharma', role: 'Nursing In-charge', dept: 'ICU', active: true },
    { id: 'USR03', name: 'Quality Officer Manoj', role: 'Quality Manager (NABH)', dept: 'Administration', active: true },
    { id: 'USR04', name: 'Billing Executive Priya', role: 'Finance Executive', dept: 'Accounts', active: true }
  ]);
  const [selectedAdminRole, setSelectedAdminRole] = useState('Medical Director');
  const rolePermissions: Record<string, string[]> = {
    'Medical Director': ['View Patient File', 'Write Prescription', 'Authorize OT', 'SOP Approval', 'Clinical Privileging'],
    'Nursing In-charge': ['View Patient File', 'Log Vitals', 'Drug Administration', 'Shift Handover', 'Incident Reporting'],
    'Quality Manager (NABH)': ['View Incident Logs', 'Draft CAPA', 'Document Control', 'Audit Review', 'KPI Dashboard Access'],
    'Finance Executive': ['View Billing Registry', 'Submit Claims', 'Process Payment', 'Ward Tariff Edit']
  };

  // Systems configs
  const [whatsappKey, setWhatsappKey] = useState('wh_live_ae8f921bc90a092c');
  const [smsKey, setSmsKey] = useState('sms_live_992ef9ca88172df');
  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [backupLogs, setBackupLogs] = useState([
    { id: 'BK01', date: 'Today, 04:00 AM', size: '256 MB', status: 'Success (Encrypted S3)' },
    { id: 'BK02', date: 'Yesterday, 04:00 AM', size: '254 MB', status: 'Success (Encrypted S3)' },
    { id: 'BK03', date: '28-Jun-2026, 04:00 AM', size: '255 MB', status: 'Success (Encrypted S3)' }
  ]);

  // Document Control (Policies & SOPs) States
  const [selectedDocId, setSelectedDocId] = useState('SOP-01');
  const documents = [
    { id: 'SOP-01', type: 'SOP', name: 'HA-SOP-01: Bedside Handover Protocol', dept: 'Nursing', version: 'V2.3', date: '12-May-2026', author: 'Nurse Sunita', status: 'Approved', workflow: ['Drafted', 'Reviewed', 'Approved'] },
    { id: 'SOP-02', type: 'Clinical Protocol', name: 'CP-04: Emergency Acute Coronary Syndrome Response', dept: 'Cardiology', version: 'V3.0', date: '28-May-2026', author: 'Dr. Amit Verma', status: 'Approved', workflow: ['Drafted', 'Reviewed', 'Approved'] },
    { id: 'SOP-03', type: 'Work Instruction', name: 'WI-08: Syringe Infusion Pump Calibration Check', dept: 'Biomedical Eng', version: 'V1.2', date: '15-Apr-2026', author: 'Tech Ritu', status: 'Under Review', workflow: ['Drafted', 'Reviewed'] },
    { id: 'SOP-04', type: 'Nursing Protocol', name: 'NP-05: Double-Check Medication Verification List', dept: 'Nursing', version: 'V4.1', date: '01-Jun-2026', author: 'Sister Gracy', status: 'Draft', workflow: ['Drafted'] }
  ];
  const [ackDepts, setAckDepts] = useState<Record<string, boolean>>({
    'ICU Nursing': true,
    'OPD Staff': true,
    'Emergency Trauma': false,
    'Pediatrics Ward': true
  });

  // Emergency Triage Local States
  const [emergencyPatients, setEmergencyPatients] = useState([
    { id: 'ER01', name: 'Unidentified Trauma Patient (Male)', age: 'Unknown', arrival: '10:15 AM', triage: 'Red', vitals: 'BP: 90/60, HR: 110, SpO2: 91%' },
    { id: 'ER02', name: 'Shyam Lal', age: 48, arrival: '10:30 AM', triage: 'Yellow', vitals: 'BP: 150/95, HR: 88, SpO2: 97%' },
    { id: 'ER03', name: 'Ritu Sen', age: 24, arrival: '10:45 AM', triage: 'Green', vitals: 'BP: 120/80, HR: 72, SpO2: 99%' }
  ]);
  const [triageName, setTriageName] = useState('');
  const [triageColor, setTriageColor] = useState<'Red' | 'Yellow' | 'Green'>('Yellow');
  const [triageVitals, setTriageVitals] = useState('');

  // Pharmacy States
  const [pharmacySearch, setPharmacySearch] = useState('');
  const [medicineStock, setMedicineStock] = useState([
    { code: 'RX001', name: 'Paracetamol 500mg (Crocin)', qty: 1500, expiry: '12-May-2028', rack: 'A-4', status: 'Normal' },
    { code: 'RX002', name: 'Amlodipine 5mg (Amlokind)', qty: 85, expiry: '15-Jul-2026', rack: 'B-2', status: 'Warning' },
    { code: 'RX003', name: 'Insulin Glargine 100 IU', qty: 12, expiry: '20-Oct-2026', rack: 'Cold-Fridge', status: 'Critical' },
    { code: 'RX004', name: 'Epinephrine Injection 1mg/ml', qty: 250, expiry: '14-Apr-2027', rack: 'Emergency-Kit', status: 'Normal' }
  ]);
  const [dispenseQueue, setDispenseQueue] = useState([
    { id: 'DQ01', patient: 'Rahul Kumar', med: 'Amlodipine 5mg QD - 30 Tabs', doctor: 'Dr. Amit Verma', status: 'Pending' },
    { id: 'DQ02', patient: 'Karan Singh', med: 'Metformin 500mg BID - 60 Tabs', doctor: 'Dr. Sanya Mehta', status: 'Pending' }
  ]);

  // Laboratory LIS States
  const [lisQueue, setLisQueue] = useState([
    { barId: 'LAB-9801', test: 'Complete Blood Count (CBC)', patient: 'Priya Patel', status: 'In Process', analyzer: 'Sysmex XN-1000 (Linked)' },
    { barId: 'LAB-9802', test: 'HbA1c Glycated Hemoglobin', patient: 'Karan Singh', status: 'Completed', result: '7.8% (High)', analyzer: 'Bio-Rad D-10 (Linked)' },
    { barId: 'LAB-9803', test: 'Kidney Function Test (KFT)', patient: 'Sanya Sharma', status: 'Pending', analyzer: 'Roche Cobas 6000 (Idle)' }
  ]);

  // Doctor Portal prescription builder
  const [prescMed, setPrescMed] = useState('');
  const [prescDosage, setPrescDosage] = useState('1 Tablet QD');

  // Reception States
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorType, setVisitorType] = useState('OPD Registration');
  const [visitorQueue, setVisitorQueue] = useState([
    { token: 'TKN-001', name: 'Alok Ranjan', phone: '9812345670', type: 'OPD Registration', checkin: '10:30 AM' },
    { token: 'TKN-002', name: 'Meera Deshmukh', phone: '9432109876', type: 'Specialist Inquiry', checkin: '10:45 AM' }
  ]);

  // ICU States
  const [icuAlertLimit, setIcuAlertLimit] = useState(130); 
  const [icuPatients, setIcuPatients] = useState([
    { bed: 'ICU-B1', patient: 'Rahul Kumar', hr: 82, bp: '120/80', spo2: 98, status: 'Normal' },
    { bed: 'ICU-B2', patient: 'Karan Singh', hr: 98, bp: '138/88', spo2: 94, status: 'Warning' },
    { bed: 'ICU-B3', patient: 'Priya Patel', hr: 72, bp: '115/75', spo2: 99, status: 'Normal' }
  ]);

  // OT States
  const [otActiveSchedules, setOtActiveSchedules] = useState([
    { ot: 'OT Block 1', surgeon: 'Dr. Neha Singh', procedure: 'Coronary Artery Bypass Graft (CABG)', status: 'Ongoing', patient: 'Karan Singh' },
    { ot: 'OT Block 2', surgeon: 'Dr. Amit Verma', procedure: 'Laparoscopic Cholecystectomy', status: 'Pre-op Checklist', patient: 'Rahul Kumar' }
  ]);
  const [otChecklist, setOtChecklist] = useState({
    patientIdentity: true,
    siteMarked: true,
    anesthesiaChecked: true,
    pulseOximeterOn: true,
    allergyKnown: true,
    sterileEquipment: false
  });

  // Radiology States
  const [radOrders, setRadOrders] = useState([
    { orderId: 'RAD-712', type: 'CT Chest Contrast', patient: 'Karan Singh', status: 'DICOM Ready', date: 'Today' },
    { orderId: 'RAD-713', type: 'Chest X-Ray PA View', patient: 'Priya Patel', status: 'Report Drafted', report: 'Clear lung fields, normal cardiothoracic ratio.', date: 'Today' },
    { orderId: 'RAD-714', type: 'MRI Brain with Angiography', patient: 'Rahul Kumar', status: 'Scheduled', date: 'Tomorrow' }
  ]);
  const [selectedRadOrder, setSelectedRadOrder] = useState<any>(null);
  const [newRadReport, setNewRadReport] = useState('');

  // Blood Centre States
  const [bloodBags, setBloodBags] = useState([
    { group: 'A+', count: 18 },
    { group: 'O+', count: 25 },
    { group: 'B+', count: 12 },
    { group: 'AB+', count: 5 },
    { group: 'A-', count: 3 },
    { group: 'O-', count: 8 },
    { group: 'B-', count: 4 },
    { group: 'AB-', count: 1 }
  ]);
  const [bloodRequests, setBloodRequests] = useState([
    { id: 'BLD-90', group: 'O-', units: 2, dept: 'Emergency ER', status: 'Pending' },
    { id: 'BLD-91', group: 'A+', units: 3, dept: 'OT Block 1', status: 'Released' }
  ]);

  // HR States
  const [hrRoster, setHrRoster] = useState([
    { doctor: 'Dr. Amit Verma', role: 'Medical Superintendent', shift: '09:00 AM - 05:00 PM', status: 'On Duty' },
    { doctor: 'Dr. Neha Singh', role: 'Interventional Cardiology', shift: '08:00 AM - 04:00 PM', status: 'In OT' },
    { doctor: 'Dr. Sanya Mehta', role: 'Pediatric Consultant', shift: '12:00 PM - 08:00 PM', status: 'Active OPD' },
    { doctor: 'Dr. Sanya Sharma', role: 'General Surgeon', shift: 'On Call (Night)', status: 'Standby' }
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Consultant');
  const [newStaffShift, setNewStaffShift] = useState('09:00 AM - 05:00 PM');

  // Finance States
  const [billingLedger, setBillingLedger] = useState([
    { invoice: 'INV-401', patient: 'Rahul Kumar', description: 'Consultation + Diagnostics bundle', amount: 2500, status: 'Paid' },
    { invoice: 'INV-402', patient: 'Karan Singh', description: 'Emergency trauma checkup + ECG', amount: 4800, status: 'Pending' },
    { invoice: 'INV-403', patient: 'Priya Patel', description: 'Ward Bed Charge (General)', amount: 1500, status: 'Claim Raised' }
  ]);
  const [insuranceClaims, setInsuranceClaims] = useState([
    { claimId: 'CLM-901', patient: 'Priya Patel', scheme: 'Ayushman Bharat (AB-PMJAY)', package: 'General Ward Day Charge', status: 'Awaiting Settlement' },
    { claimId: 'CLM-902', patient: 'Karan Singh', scheme: 'CGHS Beneficiary', package: 'Trauma Care & Cardiac ECG', status: 'Approved' }
  ]);
  const [billAmount, setBillAmount] = useState('1500');
  const [billDesc, setBillDesc] = useState('');

  // Mobile App Simulation States
  const [mobileScreen, setMobileScreen] = useState<'home' | 'abha_card' | 'records' | 'book'>('home');

  // ABDM Integration Panel States
  const [bridgeLogs, setBridgeLogs] = useState([
    { timestamp: '06:56:01', method: 'GET', endpoint: '/v1.0/consent-requests/status', status: '200 OK', latency: '42ms' },
    { timestamp: '06:57:12', method: 'POST', endpoint: '/v1.0/patients/sms/notify', status: '202 Accepted', latency: '120ms' },
    { timestamp: '06:58:45', method: 'POST', endpoint: '/v1.0/health-information/hip/on-request', status: '200 OK', latency: '75ms' }
  ]);
  const [clientId, setClientId] = useState('SBX_ApexHMS_9921');
  const [clientSecret, setClientSecret] = useState('••••••••••••••••••••••••••••••••');

  // Interactive functions
  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName) return;
    const newBr = {
      id: `BR00${branches.length + 1}`,
      name: newBranchName,
      type: 'General OPD',
      beds: 10
    };
    setBranches([...branches, newBr]);
    setNewBranchName('');
  };

  const handleTriageAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!triageName) return;
    const newTr = {
      id: `ER0${emergencyPatients.length + 1}`,
      name: triageName,
      age: '35',
      arrival: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      triage: triageColor,
      vitals: triageVitals || 'BP: 120/80, HR: 80, SpO2: 98%'
    };
    setEmergencyPatients([...emergencyPatients, newTr]);
    setTriageName('');
    setTriageVitals('');
  };

  const handleDispense = (id: string) => {
    setDispenseQueue(dispenseQueue.map(q => q.id === id ? { ...q, status: 'Dispensed & Billed' } : q));
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescMed) return;
    const updatedMeds = [...selectedPatient.currentMedications, `${prescMed} (${prescDosage})`].filter(m => m !== "None Logged");
    onUpdatePatient({
      ...selectedPatient,
      currentMedications: updatedMeds,
      recentVisits: [
        { date: 'Today', department: 'Consultation', doctor: 'Dr. Amit Verma (Doctor Portal)' },
        ...selectedPatient.recentVisits
      ]
    });
    setPrescMed('');
  };

  const triggerCodeBlue = () => {
    alert("🚨 CODE BLUE BROADCAST INITIATED! Critical Resuscitation Team alerted in ICU, Emergency Room, and OT Block 1.");
  };

  // Render the selected workspace
  return (
    <div className="space-y-4">
      {/* Active Panel Alert Bar */}
      <div className="bg-gradient-to-r from-[#006437] to-[#70C143] text-white rounded-lg px-4 py-3 shadow-md border border-emerald-800 flex justify-between items-center flex-wrap gap-2 animate-fade-in">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" /> Workspace Panel: {activePanel}
          </h2>
          <p className="text-[10px] text-emerald-100 mt-0.5 font-medium">
            Authorized Hospital Node #{hospName.replace(/\s+/g, '-').toLowerCase()} | Compliance Active
          </p>
        </div>
        <div className="text-[10.5px] font-mono bg-emerald-950/50 border border-emerald-700/50 rounded px-2 py-1 text-emerald-100">
          Gateway Protocol: <span className="font-bold text-emerald-300">ABDM-FHIR-v4.0</span>
        </div>
      </div>

      {/* RENDER CHOSEN MODULE */}
      
      {/* ==================== 1. NABH COMPLIANCE PANEL (Main Default Suite) ==================== */}
      {(activePanel === 'NABH Compliance Panel' || activePanel === 'Analytics Dashboard') && (
        <div className="space-y-4 animate-fade-in">
          {/* Row 1: Dashboard Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {/* Patient Card Widget (2 cols) */}
            <div className="md:col-span-2">
              <PatientWidget 
                patients={patients}
                selectedPatient={selectedPatient}
                onSelectPatient={onSelectPatient}
                onAddPatient={onAddPatient}
                activeTab={patientActiveTab}
                setActiveTab={(tab) => {
                  setPatientActiveTab(tab);
                  if (tab === 'IPD') {
                    setShowIpdModal(true);
                  } else if (tab === 'Appointments') {
                    const el = document.getElementById('appointments-widget-container');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                }}
              />
            </div>

            {/* Clinical Summary Widget (2 cols) */}
            <div className="md:col-span-2">
              <ClinicalSummaryWidget 
                selectedPatient={selectedPatient}
                onUpdatePatient={onUpdatePatient}
              />
            </div>

            {/* Bed Board Widget (1 col) */}
            <div className="md:col-span-1">
              <BedBoardWidget 
                beds={beds}
                patients={patients}
                onUpdateBeds={onUpdateBeds}
              />
            </div>
          </div>

          {/* Row 2: Secondary Row of Widgets (Appointments & Alerts) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppointmentsWidget 
              appointments={appointments}
              selectedPatient={selectedPatient}
              onAddAppointment={onAddAppointment}
            />
            <AlertsWidget 
              alerts={alerts}
              onUpdateAlerts={onUpdateAlerts}
            />
          </div>

          {/* Row 3: NABH Compliance Grid of 12 items */}
          <NabhModulesList 
            onAddIncident={onAddIncident}
            incidents={incidents}
            onOpenAudit={() => {}}
          />

          {/* Row 4: NABH Indicators and Trend Charts */}
          <NabhDashboardWidget 
            incidents={incidents}
            onTriggerAiCapa={onTriggerAiCapa}
            aiGeneratingId={aiGeneratingId}
          />

          {/* Row 5: Bottom row integrations */}
          <IntegrationsFeaturesWidget />

          {/* Row 6: Footer */}
          <FooterWidget />
        </div>
      )}

      {/* ==================== 2. SUPER ADMIN PANEL ==================== */}
      {activePanel === 'Super Admin Panel' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in">
          {/* Admin Tabs */}
          <div className="flex border-b border-slate-200 gap-1 text-xs">
            <button
              onClick={() => setAdminTab('masters')}
              className={`px-4 py-2 font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${adminTab === 'masters' ? 'border-indigo-900 text-indigo-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Database className="w-4 h-4" /> Hospital Masters
            </button>
            <button
              onClick={() => setAdminTab('users')}
              className={`px-4 py-2 font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${adminTab === 'users' ? 'border-indigo-900 text-indigo-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Users className="w-4 h-4" /> Users & Permissions
            </button>
            <button
              onClick={() => setAdminTab('system')}
              className={`px-4 py-2 font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${adminTab === 'system' ? 'border-indigo-900 text-indigo-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Settings className="w-4 h-4" /> System & Gateways
            </button>
          </div>

          {/* Admin Tab Contents */}
          {adminTab === 'masters' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hospital Details form */}
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                    <Info className="w-4 h-4 text-indigo-700" /> Hospital Metadata Master
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">Hospital Name</label>
                      <input 
                        type="text" 
                        value={hospName} 
                        onChange={(e) => setHospName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded bg-white text-xs" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-0.5">NABH Registration ID</label>
                        <input type="text" value="NABH-AP-2024-9981" disabled className="w-full p-2 border border-slate-200 rounded bg-slate-100 font-mono text-xs" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-0.5">ABDM HFR Facility ID</label>
                        <input type="text" value="IN-DL-APEX-901" disabled className="w-full p-2 border border-slate-200 rounded bg-slate-100 font-mono text-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branches registry list */}
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                    <Network className="w-4 h-4 text-indigo-700" /> Branch Location Master
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {branches.map(br => (
                      <div key={br.id} className="flex justify-between items-center p-2 bg-white border rounded">
                        <span className="font-bold text-slate-700">{br.name}</span>
                        <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">{br.type} ({br.beds} Beds)</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddBranch} className="flex gap-2 pt-1.5">
                    <input 
                      type="text" 
                      placeholder="Add Branch name..." 
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      className="flex-1 p-2 border border-slate-300 rounded bg-white" 
                    />
                    <button type="submit" className="px-3 bg-indigo-900 text-white rounded font-bold hover:bg-indigo-950 transition">
                      Add
                    </button>
                  </form>
                </div>
              </div>

              {/* Infrastructure Master Hierarchy */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                  <HardDrive className="w-4 h-4 text-indigo-700" /> Complete Infrastructure Hierarchies
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded border border-slate-200 shadow-3xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Buildings</span>
                    <span className="text-base font-extrabold text-indigo-950 font-mono">3</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Blocks A, B, C</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200 shadow-3xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Floors</span>
                    <span className="text-base font-extrabold text-indigo-950 font-mono">6</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Ground to 5th</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200 shadow-3xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Wards / Units</span>
                    <span className="text-base font-extrabold text-indigo-950 font-mono">12</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">ICU, Emergency, Gen</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200 shadow-3xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Specialities</span>
                    <span className="text-base font-extrabold text-indigo-950 font-mono">18</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Cardiology, Nephro+</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200 shadow-3xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Rooms & Beds</span>
                    <span className="text-base font-extrabold text-indigo-950 font-mono">120 Beds</span>
                    <span className="text-[9px] text-emerald-600 block font-semibold mt-0.5">● 81% Occupied</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'users' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Users List */}
                <div className="md:col-span-6 bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                    <Users className="w-4 h-4 text-indigo-700" /> Active Users List
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {adminUsers.map(user => (
                      <div key={user.id} className="p-2.5 bg-white border rounded flex justify-between items-center shadow-3xs">
                        <div>
                          <span className="font-bold text-slate-800 block">{user.name}</span>
                          <span className="text-[10px] text-slate-500">ID: {user.id} | Department: {user.dept}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded block">{user.role}</span>
                          <span className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5 block">● Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Granular Permissions Mapping matrix */}
                <div className="md:col-span-6 bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                    <Lock className="w-4 h-4 text-indigo-700" /> Role-Based Permissions Checklist
                  </h4>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Role to view permissions</label>
                    <select 
                      value={selectedAdminRole} 
                      onChange={(e) => setSelectedAdminRole(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white font-bold text-indigo-900"
                    >
                      {Object.keys(rolePermissions).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    {rolePermissions[selectedAdminRole]?.map((perm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-medium text-slate-700 bg-white p-2 border rounded">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{perm}</span>
                        <span className="ml-auto text-[9px] text-slate-400 italic">Enforced by RBAC</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Login & Security Policy settings */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                  <Lock className="w-4 h-4 text-indigo-700" /> Security & Two-Factor Authentication Policies
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <span className="font-bold text-slate-800 block">Login Policy</span>
                    <p className="text-[10px] text-slate-500 mt-1">Automatic session timeout after 15 minutes of idle time. Maximum 3 failed attempts.</p>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <span className="font-bold text-slate-800 block">Password Policy</span>
                    <p className="text-[10px] text-slate-500 mt-1">Mandatory rotation every 30 days. Password complexity enforced (numbers, letters, symbols).</p>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                  </div>
                  <div className="bg-white p-3 rounded border flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                      <p className="text-[10px] text-slate-500 mt-1">Required for all clinical users when logging in outside the hospital LAN.</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        type="button"
                        onClick={() => setTfaEnabled(!tfaEnabled)}
                        className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${tfaEnabled ? 'bg-indigo-900' : 'bg-slate-300'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${tfaEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                      <span className="font-bold text-[10px] text-slate-600">{tfaEnabled ? 'ENABLED' : 'DISABLED'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'system' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Gateway config credentials */}
                <div className="md:col-span-7 bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                    <Key className="w-4 h-4 text-indigo-700" /> Communications & Billing API Gateways
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">WhatsApp Business API Gateway Key</label>
                      <input 
                        type="password" 
                        value={whatsappKey}
                        onChange={(e) => setWhatsappKey(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded bg-white font-mono text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">SMS Gateway API Key (DND Exempt)</label>
                      <input 
                        type="password" 
                        value={smsKey}
                        onChange={(e) => setSmsKey(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded bg-white font-mono text-xs" 
                      />
                    </div>
                    <div className="bg-indigo-50 p-2.5 rounded border border-indigo-100 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-indigo-950 block">Payment Gateway (Razorpay Enabled)</span>
                        <span className="text-[10px] text-indigo-700 font-mono">Merchant ID: apex_hms_razor_live</span>
                      </div>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">CONNECTED</span>
                    </div>
                  </div>
                </div>

                {/* S3 data backup logs list */}
                <div className="md:col-span-5 bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                    <Database className="w-4 h-4 text-indigo-700" /> Data Backup & Recovery Logs
                  </h4>
                  <div className="space-y-2">
                    {backupLogs.map(log => (
                      <div key={log.id} className="p-2 bg-white border rounded flex justify-between items-center text-[10.5px]">
                        <div>
                          <span className="font-bold text-slate-700 block">{log.date}</span>
                          <span className="text-slate-400 text-[9.5px]">Backup Size: {log.size}</span>
                        </div>
                        <span className="text-[9.5px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{log.status}</span>
                      </div>
                    ))}
                    <button 
                      onClick={() => alert("💾 Initiated cold-storage daily backup bundle. Compiling HIPAA/ABDM-compliant database ledger... S3 replication complete.")}
                      className="w-full py-1.5 bg-indigo-900 text-white font-bold hover:bg-indigo-950 transition rounded shadow-3xs mt-2"
                    >
                      Trigger Database Backup Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== 3. CORPORATE / HOSPITAL ADMIN / MEDICAL DIRECTOR PANEL ==================== */}
      {(activePanel === 'Corporate Admin Panel' || activePanel === 'Hospital Admin Panel' || activePanel === 'Medical Superintendent' || activePanel === 'Medical Director Panel') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-indigo-700" /> Executive & Medical Superintendent Control Panel
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 shadow-3xs text-center space-y-1">
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Hospital-Acquired Infection Rate</span>
              <span className="text-2xl font-extrabold text-slate-800">1.2%</span>
              <span className="text-[10px] text-emerald-600 font-bold block">● Well within NABH &lt;1.5%</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 shadow-3xs text-center space-y-1">
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Average Emergency Waiting Time</span>
              <span className="text-2xl font-extrabold text-slate-800">14 Mins</span>
              <span className="text-[10px] text-emerald-600 font-bold block">● Optimal trauma response</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 shadow-3xs text-center space-y-1">
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Bed Occupancy Level</span>
              <span className="text-2xl font-extrabold text-slate-800">81.6%</span>
              <span className="text-[10px] text-indigo-900 font-bold block">98 of 120 Beds Occupied</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 shadow-3xs text-center space-y-1">
              <span className="text-slate-400 font-bold uppercase block text-[10px]">ABDM Consent Requests Approved</span>
              <span className="text-2xl font-extrabold text-slate-800">94.2%</span>
              <span className="text-[10px] text-emerald-600 font-bold block">● Dynamic exchange active</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1 border-b pb-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-700" /> High-Priority Executive Sign-Off Tasks
            </h4>
            <div className="space-y-2">
              <div className="bg-white p-2.5 border rounded flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 block">Approve Clinical Privileging Audit Sheet: Dr. Neha Singh</span>
                  <p className="text-[10.5px] text-slate-500">Prerequisite to allow specific interventional cardiology procedures in Cath Lab 2.</p>
                </div>
                <button onClick={() => alert("✅ Dr. Neha Singh's clinical privileging request has been reviewed and officially signed off.")} className="px-3 py-1 bg-indigo-900 text-white font-bold hover:bg-indigo-950 transition rounded text-[10px]">Sign Off Approval</button>
              </div>
              <div className="bg-white p-2.5 border rounded flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 block">Revision Lock Approval: SOP-01 Nursing Bedside Handover (V2.3)</span>
                  <p className="text-[10.5px] text-slate-500">Quality Manager reviewed and approved changes on shift telemetry alarms logging.</p>
                </div>
                <button onClick={() => alert("✅ SOP-01 Nursing Bedside Handover Protocol revision V2.3 officially locked and distributed.")} className="px-3 py-1 bg-indigo-900 text-white font-bold hover:bg-indigo-950 transition rounded text-[10px]">Authorize Document</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. QUALITY MANAGER / POLICIES VIEW ==================== */}
      {(activePanel === 'Quality Manager (NABH)' || activePanel === 'NABH Compliance Panel' || activePanel === 'SOP / Policies') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center flex-wrap gap-2">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-indigo-700" /> Hospital Policies & SOP Document Control
            </h3>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded">NABH Standards COP-1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Document Index List */}
            <div className="md:col-span-5 bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pb-1 border-b border-slate-100">
                Document Repository Index
              </div>
              <div className="space-y-1.5">
                {documents.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left p-2 rounded border transition flex justify-between items-center ${selectedDocId === doc.id ? 'bg-indigo-50 border-indigo-200 font-bold' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                  >
                    <div>
                      <span className="text-slate-800 text-[11px] block truncate">{doc.name}</span>
                      <span className="text-[9.5px] text-slate-400 font-mono">{doc.id} | Dept: {doc.dept}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1 rounded ${doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'Under Review' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{doc.status}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Document Viewer & Workflow */}
            <div className="md:col-span-7 bg-slate-50 p-3 rounded border border-slate-200 flex flex-col justify-between">
              {(() => {
                const doc = documents.find(d => d.id === selectedDocId) || documents[0];
                return (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">{doc.type} File Viewer</span>
                      <span className="font-mono text-indigo-900">{doc.version}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{doc.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 mt-1.5 font-mono">
                        <p>Author: <span className="font-sans text-slate-700 font-semibold">{doc.author}</span></p>
                        <p>Last Audited: <span className="font-sans text-slate-700 font-semibold">{doc.date}</span></p>
                      </div>
                    </div>

                    {/* Standard text mockup */}
                    <div className="bg-white p-2.5 border rounded text-[11px] leading-relaxed text-slate-600 max-h-32 overflow-y-auto font-serif shadow-inner">
                      <strong>1. Purpose:</strong> Ensure all clinical handovers are completed systematically at the bedside during shift rotations to eliminate medical transmission errors.<br />
                      <strong>2. Scope:</strong> Applies to all Intensive Care Units (ICU), general wards, and trauma rooms.<br />
                      <strong>3. Checklist:</strong> Identify patient using double-identity validation (UHID + ABHA card scan). Re-verify current medications, scheduled infusions, recent diagnostics outcomes, and consent forms prior to handoff.
                    </div>

                    {/* Version Control Flow Indicator */}
                    <div className="p-2 bg-indigo-50 border border-indigo-100 rounded space-y-1.5">
                      <span className="text-[10px] font-bold text-indigo-950 block">Approval Workflow Status:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-0.5 text-[9.5px] font-bold text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Drafted</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className={`flex items-center gap-0.5 text-[9.5px] font-bold ${doc.workflow.includes('Reviewed') ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {doc.workflow.includes('Reviewed') ? <CheckCircle2 className="w-3 h-3" /> : '○'} Reviewed
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className={`flex items-center gap-0.5 text-[9.5px] font-bold ${doc.workflow.includes('Approved') ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {doc.workflow.includes('Approved') ? <CheckCircle2 className="w-3 h-3" /> : '○'} Approved & Locked
                        </span>
                      </div>
                    </div>

                    {/* Department Distribution checklist */}
                    <div>
                      <span className="text-[10.5px] font-bold text-slate-700 block mb-1">Acknowledge & Distributed List (NABH Mandated Review Schedule):</span>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(ackDepts).map(dept => (
                          <label key={dept} className="flex items-center gap-1.5 cursor-pointer bg-white p-1 rounded border">
                            <input 
                              type="checkbox" 
                              checked={ackDepts[dept]} 
                              onChange={() => setAckDepts({...ackDepts, [dept]: !ackDepts[dept]})}
                              className="accent-indigo-900 rounded" 
                            />
                            <span className="text-[10.5px] text-slate-600 font-medium">{dept}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 5. EMERGENCY & TRIAGE PANEL ==================== */}
      {activePanel === 'Emergency Panel' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-red-700 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-red-600 animate-pulse" /> Emergency, Trauma & Resuscitation Center
            </h3>
            <div className="flex gap-2">
              <button onClick={triggerCodeBlue} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded shadow-md uppercase tracking-wider text-[10px] animate-pulse">
                CODE BLUE (Resus)
              </button>
              <button onClick={() => alert("🚨 CODE RED FIRE EMERGENCY DECLARED! Automatic zoning dampers shut, local water pumps armed.")} className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded shadow-md uppercase tracking-wider text-[10px]">
                CODE RED (Fire)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Triage Form */}
            <div className="md:col-span-4 bg-slate-50 p-3.5 rounded border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Triage Inflow Check-in</h4>
              <form onSubmit={handleTriageAdd} className="space-y-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-0.5">Patient / Incident Identifier</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Unidentified Trauma Patient #05"
                    value={triageName} 
                    onChange={e => setTriageName(e.target.value)}
                    className="w-full p-2 border rounded bg-white text-xs" 
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-0.5">Triage Priority Rating</label>
                  <div className="grid grid-cols-3 gap-1.5 text-center font-bold">
                    <button 
                      type="button" 
                      onClick={() => setTriageColor('Red')}
                      className={`p-1.5 rounded border text-[10px] ${triageColor === 'Red' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`}
                    >
                      RED (Critical)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setTriageColor('Yellow')}
                      className={`p-1.5 rounded border text-[10px] ${triageColor === 'Yellow' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-500 border-amber-200 hover:bg-amber-50'}`}
                    >
                      YELLOW
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setTriageColor('Green')}
                      className={`p-1.5 rounded border text-[10px] ${triageColor === 'Green' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}
                    >
                      GREEN
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-0.5">Vitals (Quick Logging)</label>
                  <input 
                    type="text" 
                    placeholder="BP, Heart Rate, SpO2..." 
                    value={triageVitals}
                    onChange={e => setTriageVitals(e.target.value)}
                    className="w-full p-2 border rounded bg-white text-xs" 
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-red-700 hover:bg-red-800 text-white rounded font-bold transition flex justify-center items-center gap-1 shadow-3xs uppercase">
                  <UserPlus className="w-4 h-4" /> Check-in & Triage
                </button>
              </form>
            </div>

            {/* Triage Live Queue Board */}
            <div className="md:col-span-8 bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5 flex justify-between items-center">
                <span>Active Triage Queue (Level-1 Board)</span>
                <span className="text-[10px] text-slate-400 font-mono">Live Sync: Active</span>
              </h4>
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto">
                {emergencyPatients.map(p => (
                  <div key={p.id} className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white ${p.triage === 'Red' ? 'bg-red-600 animate-ping' : p.triage === 'Yellow' ? 'bg-amber-500' : 'bg-emerald-600'}`}></span>
                        <span className="font-extrabold text-slate-800 text-[11.5px]">{p.name} ({p.age})</span>
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-extrabold uppercase ${p.triage === 'Red' ? 'bg-red-100 text-red-800' : p.triage === 'Yellow' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{p.triage}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1 font-mono">Vitals Snapshot: {p.vitals}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Arrival: {p.arrival}</span>
                      <button 
                        onClick={() => alert(`🏥 Direct transfer of ${p.name} from Triage ER to Emergency ICU bed.`)}
                        className="mt-1 px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white font-semibold rounded text-[10px] transition"
                      >
                        Direct Admit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 6. PHARMACY & INVENTORY PANEL ==================== */}
      {(activePanel === 'Pharmacy Panel' || activePanel === 'Pharmacy') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Pill className="w-5 h-5 text-indigo-700 animate-spin-slow" /> Pharmacy Dispensation & Narcotics Register
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">ABDM Connected Dispenser</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Stock Search Table */}
            <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 uppercase text-[10.5px]">Drug Batch & Expiry Matrix</span>
                <input 
                  type="text" 
                  placeholder="Filter stock by drug name..." 
                  value={pharmacySearch}
                  onChange={e => setPharmacySearch(e.target.value)}
                  className="p-1.5 text-[11px] border rounded bg-white w-44" 
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 border-b font-bold text-slate-500">
                      <th className="p-2">Code</th>
                      <th className="p-2">Generic & Brand</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Expiry</th>
                      <th className="p-2">Rack</th>
                      <th className="p-2 text-right">Alert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineStock.filter(m => m.name.toLowerCase().includes(pharmacySearch.toLowerCase())).map(med => (
                      <tr key={med.code} className="border-b bg-white last:border-0">
                        <td className="p-2 font-mono text-slate-400 font-semibold">{med.code}</td>
                        <td className="p-2 font-bold text-slate-700">{med.name}</td>
                        <td className="p-2 font-mono">{med.qty}</td>
                        <td className="p-2 font-mono">{med.expiry}</td>
                        <td className="p-2">{med.rack}</td>
                        <td className="p-2 text-right">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${med.status === 'Critical' ? 'bg-red-500 animate-pulse' : med.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} title={med.status}></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prescription Queue */}
            <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Incoming e-Prescriptions</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dispenseQueue.map(q => (
                  <div key={q.id} className="p-2.5 bg-white border rounded shadow-3xs flex flex-col justify-between h-24">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-800 block">{q.patient}</span>
                        <span className="text-[10px] text-indigo-700 font-semibold">{q.med}</span>
                      </div>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${q.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{q.status}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2.5">
                      <span className="text-[9px] text-slate-400">Prescribed by {q.doctor}</span>
                      {q.status === 'Pending' && (
                        <button 
                          onClick={() => handleDispense(q.id)}
                          className="px-2 py-1 bg-indigo-900 text-white font-bold hover:bg-indigo-950 transition rounded text-[9.5px]"
                        >
                          Dispense & Bill
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 7. LABORATORY (LIS) PANEL ==================== */}
      {activePanel === 'Laboratory Panel' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <FlaskConical className="w-5 h-5 text-indigo-700" /> Laboratory Information System (LIS Analyzer Interface)
            </h3>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded">HL7 HL2 Analyzer Gateway</span>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Incoming Test Specimen & Telemetry Queue</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lisQueue.map(item => (
                <div key={item.barId} className="bg-white p-3 rounded border shadow-3xs flex flex-col justify-between h-36">
                  <div>
                    <div className="flex justify-between items-center border-b pb-1 mb-1.5">
                      <span className="font-mono text-[9px] font-bold text-slate-400">{item.barId}</span>
                      <span className={`text-[8.5px] font-extrabold px-1.5 rounded uppercase ${item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{item.status}</span>
                    </div>
                    <span className="font-extrabold text-slate-800 text-[11.5px] block leading-snug">{item.test}</span>
                    <span className="text-[10px] text-slate-500 block">Patient Name: <strong>{item.patient}</strong></span>
                    {item.result && (
                      <span className="text-[11px] bg-rose-50 border border-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded block mt-1 font-mono">Outcome: {item.result}</span>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center mt-2 text-[9.5px]">
                    <span className="text-slate-400 font-mono">{item.analyzer}</span>
                    {item.status !== 'Completed' && (
                      <button 
                        onClick={() => alert(`🔬 Pulled results from ${item.analyzer}: Test payload completed, signed, and published to patient's ABDM PHR Locker.`)}
                        className="px-2 py-0.5 bg-indigo-900 text-white font-semibold hover:bg-indigo-950 transition rounded text-[9.5px]"
                      >
                        Auto-Pull
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 8. DOCTOR PORTAL ==================== */}
      {activePanel === 'Doctor Portal Panel' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Contact2 className="w-5 h-5 text-indigo-700" /> Professional Doctor Workspace (EHR Console)
            </h3>
            <span className="text-[10px] font-mono text-indigo-800 bg-indigo-50 border px-2 py-0.5 rounded">Logged: Dr. Amit Verma (M.D.)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Daily Appointments Queue */}
            <div className="md:col-span-4 bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Today's OPD Consultations</h4>
              <div className="space-y-1.5">
                {appointments.map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      const matchedP = patients.find(p => p.name === app.patientName);
                      if (matchedP) onSelectPatient(matchedP);
                    }}
                    className={`w-full text-left p-2 border rounded transition flex justify-between items-center ${selectedPatient.name === app.patientName ? 'bg-indigo-50 border-indigo-200 font-bold' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                  >
                    <div>
                      <span className="text-slate-800 block text-[11px] truncate">{app.patientName}</span>
                      <span className="text-[9.5px] text-slate-400 font-mono">Time: {app.time} | UHID: {app.patientUhid}</span>
                    </div>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">Consult</span>
                  </button>
                ))}
              </div>
            </div>

            {/* active patient record & e-prescription pad */}
            <div className="md:col-span-8 bg-slate-50 p-4 rounded border border-slate-200 space-y-3.5">
              <div className="flex justify-between items-center border-b pb-1.5">
                <h4 className="font-bold text-slate-800 uppercase text-[10.5px]">Consultation Sheet: <span className="text-indigo-950 font-bold font-sans">{selectedPatient.name} ({selectedPatient.age}/{selectedPatient.gender})</span></h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full font-sans">ABHA LINKED</span>
              </div>

              {/* Vitals & Demographics Snapshot */}
              <div className="bg-white p-2.5 rounded border grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Chronic Conditions</span>
                  <span className="font-semibold text-slate-700">{selectedPatient.chronicConditions.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Known Allergies</span>
                  <span className="font-semibold text-rose-600 font-bold">{selectedPatient.allergies.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Current Medications</span>
                  <span className="font-semibold text-slate-700">{selectedPatient.currentMedications.join(', ')}</span>
                </div>
              </div>

              {/* Dynamic e-prescription builder form */}
              <form onSubmit={handleAddPrescription} className="bg-white p-3 rounded border space-y-3">
                <span className="font-bold text-slate-800 block uppercase text-[10px] border-b pb-1">Bilingual e-Prescription Pad (Signed digitally)</span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block font-medium text-slate-700 mb-0.5">Medicine Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Amlodipine 5mg"
                      value={prescMed} 
                      onChange={e => setPrescMed(e.target.value)}
                      className="w-full p-2 border rounded bg-white text-xs" 
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block font-medium text-slate-700 mb-0.5">Dosage / Routine</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. 1 Tablet QD" 
                      value={prescDosage}
                      onChange={e => setPrescDosage(e.target.value)}
                      className="w-full p-2 border rounded bg-white text-xs" 
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-end">
                    <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold hover:bg-indigo-950 transition rounded shadow-3xs uppercase text-[10px]">
                      Add
                    </button>
                  </div>
                </div>
              </form>

              {/* Submit/Sign actions */}
              <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => alert(`✍️ Digital signature certified. Prescription bundle hashed using ABDM-HMIS token and shared instantly with ${selectedPatient.name}'s central PHR Lock account.`)}
                  className="px-4 py-1.5 bg-indigo-900 text-white font-bold hover:bg-indigo-950 transition rounded shadow-md uppercase text-[10px] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" /> Digitally Sign & Share with ABDM PHR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 9. PATIENT PORTAL ==================== */}
      {activePanel === 'Patient Portal Panel' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <UserCheck className="w-5 h-5 text-indigo-700" /> Patient Personal Health Record (PHR) Locker & Portal
            </h3>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded">Patient Lock ID: {selectedPatient.uhid}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Patient Personal Data Card */}
            <div className="md:col-span-4 bg-slate-50 p-4 rounded border border-slate-200 space-y-3.5">
              <div className="text-center space-y-1 pb-3 border-b">
                <div className="w-16 h-16 rounded-full bg-sky-100 border-2 border-sky-300 mx-auto flex items-center justify-center">
                  <UserPlus className="w-9 h-9 text-sky-600" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-base leading-tight mt-1">{selectedPatient.name}</h4>
                <span className="text-[10px] text-slate-400 font-mono block">ABHA ID: {selectedPatient.abhaId}</span>
              </div>

              <div className="space-y-1.5 text-[10.5px]">
                <p>Gender / Age: <strong className="text-slate-700">{selectedPatient.gender} / {selectedPatient.age} Years</strong></p>
                <p>Mobile: <strong className="text-slate-700">{selectedPatient.phone}</strong></p>
                <p>Address Lock: <strong className="text-slate-700">{selectedPatient.abhaAddress}</strong></p>
              </div>
            </div>

            {/* Health records download list */}
            <div className="md:col-span-8 bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">Unified Electronic Health Records (EHR FHIR Files)</h4>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="bg-white p-2.5 border rounded flex justify-between items-center shadow-3xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Outpatient Prescription - Consultation</span>
                    <span className="text-[10px] text-slate-400 font-mono">Date: Today | Issued by Dr. Amit Verma</span>
                  </div>
                  <button 
                    onClick={() => {
                      const fhirSample = {
                        resourceType: "Bundle",
                        type: "document",
                        entry: [
                          { resource: { resourceType: "Patient", name: selectedPatient.name, gender: selectedPatient.gender } },
                          { resource: { resourceType: "MedicationRequest", dosageInstruction: selectedPatient.currentMedications } }
                        ]
                      };
                      alert(`💾 FHIR v4 Document Payload downloaded: \n\n${JSON.stringify(fhirSample, null, 2)}`);
                    }} 
                    className="px-3 py-1 bg-indigo-900 text-white font-semibold hover:bg-indigo-950 transition rounded text-[10px]"
                  >
                    Download FHIR XML/JSON
                  </button>
                </div>

                <div className="bg-white p-2.5 border rounded flex justify-between items-center shadow-3xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Laboratory Report - Complete Blood Count (CBC)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Date: 12-May-2026 | Certified by Dr. Sanya Mehta</span>
                  </div>
                  <button onClick={() => alert("💾 Downloading PDF Lab Report with ABDM security seal.")} className="px-3 py-1 bg-indigo-900 text-white font-semibold hover:bg-indigo-950 transition rounded text-[10px]">Download PDF</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 10. RECEPTION PANEL ==================== */}
      {(activePanel === 'Reception' || activePanel === 'Reception Panel') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Users className="w-5 h-5 text-indigo-700" /> Front Desk Reception & Patient Check-in Terminal
            </h3>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded">Token Issuer Node: active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 bg-slate-50 p-3.5 rounded border space-y-3">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1 block">Issue New Token / Check-in</span>
              <form onSubmit={e => {
                e.preventDefault();
                if (!visitorName) return;
                const tokenNo = `TKN-00${visitorQueue.length + 1}`;
                setVisitorQueue([...visitorQueue, {
                  token: tokenNo,
                  name: visitorName,
                  phone: visitorPhone || '99999-88888',
                  type: visitorType,
                  checkin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                alert(`🎟️ Token Issued: ${tokenNo} for ${visitorName}. Please guide them to the respective waiting lounge.`);
                setVisitorName('');
                setVisitorPhone('');
              }} className="space-y-2.5">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Visitor / Patient Name</label>
                  <input type="text" value={visitorName} onChange={e => setVisitorName(e.target.value)} required placeholder="e.g. Alok Ranjan" className="w-full p-2 border rounded bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Mobile Number</label>
                  <input type="text" value={visitorPhone} onChange={e => setVisitorPhone(e.target.value)} placeholder="e.g. 98123-XXXXX" className="w-full p-2 border rounded bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Check-in Category</label>
                  <select value={visitorType} onChange={e => setVisitorType(e.target.value)} className="w-full p-2 border rounded bg-white">
                    <option value="OPD Registration">OPD New Registration</option>
                    <option value="Specialist Inquiry">Consultation Chamber Token</option>
                    <option value="Visiting Patient">General IPD Visitor Slip</option>
                    <option value="Emergency Inquiry">ER Emergency Triage Info</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold hover:bg-indigo-950 rounded uppercase shadow-3xs text-[10px] flex items-center justify-center gap-1">
                  <Printer className="w-3.5 h-3.5" /> Print slip & issue token
                </button>
              </form>
            </div>

            <div className="md:col-span-8 bg-slate-50 p-3.5 rounded border space-y-2.5">
              <div className="flex justify-between items-center border-b pb-1.5">
                <span className="font-bold text-slate-800 uppercase text-[10.5px]">Waiting Lounge Live Queue</span>
                <span className="text-[10px] text-indigo-700 font-bold font-mono">Total waiting: {visitorQueue.length}</span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {visitorQueue.map(v => (
                  <div key={v.token} className="p-2.5 bg-white border rounded flex justify-between items-center shadow-3xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded font-mono text-[9px]">{v.token}</span>
                        <span className="font-extrabold text-slate-800 text-[11.5px]">{v.name}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">{v.type}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Checked in: {v.checkin} | Phone: {v.phone}</p>
                    </div>
                    <button onClick={() => {
                      setVisitorQueue(visitorQueue.filter(q => q.token !== v.token));
                      alert(`✅ Token ${v.token} processed & called to counter.`);
                    }} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[9px]">
                      Call Next
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 11. OPD CLINIC WORKSPACE ==================== */}
      {(activePanel === 'OPD Panel' || activePanel === 'OPD') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-indigo-700" /> Outpatient Department (OPD) Nurse & Vitals Station
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">Compliance: ABDM Integrated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3.5 rounded border text-center space-y-2">
              <span className="text-2xl font-black text-indigo-900 block font-mono">14 Mins</span>
              <span className="font-bold text-slate-700 block uppercase text-[9px]">Average Consultation Wait Time</span>
              <p className="text-[10px] text-slate-400 leading-normal">Optimized using dynamic token routing based on patient clinical priority.</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded border text-center space-y-2">
              <span className="text-2xl font-black text-emerald-600 block font-mono">12 / 15</span>
              <span className="font-bold text-slate-700 block uppercase text-[9px]">Consultants On Duty</span>
              <p className="text-[10px] text-slate-400 leading-normal">Real-time duty logs synchronized with Central HR roster scheduling.</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded border text-center space-y-2">
              <span className="text-2xl font-black text-amber-500 block font-mono">92%</span>
              <span className="font-bold text-slate-700 block uppercase text-[9px]">First-Time Resolve Rate</span>
              <p className="text-[10px] text-slate-400 leading-normal">Helps reduce hospital return rates under NABH Quality Indicator guidelines.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border space-y-2">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1">Today's OPD Consultations Queue</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-52 overflow-y-auto pt-1">
              {appointments.map(app => {
                const vitals = loggedVitalsMap[app.id];
                const lab = sentLabsMap[app.id];
                return (
                  <div key={app.id} className="p-3 bg-white border rounded flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-3xs hover:border-indigo-200 transition">
                    <div>
                      <span className="font-extrabold text-slate-800 text-[11px] block">{app.patientName}</span>
                      <span className="text-[10px] text-indigo-700 font-semibold block">{app.department} | Slot: {app.time}</span>
                      <span className="text-[9.5px] text-slate-400 font-mono">UHID: {app.patientUhid}</span>
                      
                      {/* Vitals badge */}
                      {vitals && (
                        <div className="mt-1 flex flex-wrap gap-1 animate-fade-in">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded text-[8.5px] font-bold">
                            BP: {vitals.bp}
                          </span>
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded text-[8.5px] font-bold">
                            HR: {vitals.hr} bpm
                          </span>
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded text-[8.5px] font-bold">
                            SpO2: {vitals.spo2}%
                          </span>
                        </div>
                      )}

                      {/* Lab badge */}
                      {lab && (
                        <div className="mt-1 flex flex-wrap gap-1 animate-fade-in">
                          <span className="bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.5 rounded text-[8.5px] font-bold flex items-center gap-1">
                            <FlaskConical className="w-2.5 h-2.5 text-sky-600" />
                            {lab.tests.length} Lab tests ({lab.priority})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5 self-end sm:self-auto">
                      <button 
                        onClick={() => setVitalsPatientApp(app)} 
                        className={`px-2.5 py-1 text-white font-bold transition rounded text-[9.5px] flex items-center gap-1 ${
                          vitals 
                            ? 'bg-emerald-600 hover:bg-emerald-700' 
                            : 'bg-indigo-900 hover:bg-indigo-950'
                        }`}
                      >
                        {vitals ? '✓ Vitals Logged' : 'Log Vitals'}
                      </button>
                      <button 
                        onClick={() => setLabPatientApp(app)} 
                        className={`px-2 py-1 transition rounded text-[9.5px] flex items-center gap-1 ${
                          lab 
                            ? 'bg-sky-600 hover:bg-sky-700 text-white border-none' 
                            : 'bg-white border text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {lab ? '✓ Lab Sent' : 'Send Lab'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 12. IPD WARDS & ADMISSIONS ==================== */}
      {(activePanel === 'IPD Panel' || activePanel === 'IPD') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <HeartPulse className="w-5 h-5 text-indigo-700" /> Inpatient Department (IPD) Ward & ADT Dashboard
            </h3>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded">ADT Gateways Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1 block">Active Inpatient Bed Status</span>
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                {beds.map(cat => (
                  <div key={cat.name} className="p-2.5 bg-white border rounded shadow-3xs flex flex-col justify-between h-18">
                    <span className="font-bold text-slate-800">{cat.name}</span>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="font-mono text-xs font-black text-indigo-950">{cat.occupied} / {cat.total} Beds</span>
                      <span className="text-[8px] bg-red-100 text-red-800 px-1 py-0.5 rounded font-bold uppercase">Occupied</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
              <div className="flex justify-between items-center border-b pb-1.5">
                <span className="font-bold text-slate-800 uppercase text-[10.5px]">Active Admissions list (Admission-Discharge-Transfer)</span>
                <span className="text-[10px] text-slate-400 font-mono">Live Ward Map</span>
              </div>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {patients.filter(p => !dischargedUhids.includes(p.uhid)).slice(0, 3).length === 0 ? (
                  <div className="p-4 text-center bg-white border border-dashed border-slate-200 rounded text-[11px] text-slate-500 font-medium">
                    No active admissions in General Ward. All patients discharged or transferred.
                  </div>
                ) : (
                  patients.filter(p => !dischargedUhids.includes(p.uhid)).slice(0, 3).map(p => {
                    const currentWard = patientWards[p.uhid] || "General Ward";
                    const bedNum = patientBedNumbers[p.uhid] || 12;
                    return (
                      <div key={p.uhid} className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs animate-fade-in">
                        <div>
                          <span className="font-extrabold text-slate-800 text-[11.5px] block">{p.name} ({p.gender}/{p.age})</span>
                          <span className="text-[9.5px] text-indigo-700 font-semibold block">Allotted bed: {currentWard} B-{bedNum} | Admitted: 2 days ago</span>
                          <span className="text-[9px] text-slate-400 block font-mono">Primary Consultant: Dr. Amit Verma</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => {
                              setActiveIpdActionPatient(p);
                              setIpdActionType('discharge');
                            }} 
                            className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded text-[9.5px] cursor-pointer"
                          >
                            Discharge
                          </button>
                          <button 
                            onClick={() => {
                              setActiveIpdActionPatient(p);
                              setIpdActionType('transfer');
                              setSelectedTransferWard(currentWard === 'General Ward' ? 'Semi Private' : 'General Ward');
                            }} 
                            className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded text-[9.5px] cursor-pointer"
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 13. ICU MONITOR TERMINAL ==================== */}
      {(activePanel === 'ICU Panel' || activePanel === 'ICU') && (
        <div className="bg-[#85addb] text-slate-950 rounded-lg border border-[#628bbb] p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-[#628bbb] pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-red-900 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-red-700 animate-pulse" /> Intensive Care Unit (ICU) Real-Time Telemetry Monitor
            </h3>
            <span className="text-[10px] bg-red-700 text-white font-bold px-2.5 py-0.5 rounded flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span> Live Analyzer Status
            </span>
          </div>

          <div className="bg-white/90 border border-[#628bbb]/55 p-3 rounded-md flex justify-between items-center text-[10.5px] text-slate-900 shadow-3xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 uppercase">Systolic Hypertension Alarm Limit:</span>
              <span className="font-mono text-red-600 font-extrabold text-xs">{icuAlertLimit} mmHg</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input type="range" min="110" max="150" value={icuAlertLimit} onChange={e => setIcuAlertLimit(Number(e.target.value))} className="w-32 accent-red-600" />
              <span className="text-[9px] text-slate-600 font-bold">Adjust Threshold</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {icuPatients.map(pat => {
              const systolic = Number(pat.bp.split('/')[0]);
              const isAlarm = systolic > icuAlertLimit;
              return (
                <div key={pat.bed} className={`p-3.5 rounded-lg border flex flex-col justify-between h-40 transition-colors shadow-md ${isAlarm ? 'bg-red-950 border-red-500 animate-pulse text-white' : 'bg-[#0e2136] border-[#1d3d63] text-white'}`}>
                  <div>
                    <div className="flex justify-between items-start border-b border-slate-700/60 pb-1.5">
                      <div>
                        <span className="font-mono text-[9px] font-bold text-slate-300">{pat.bed}</span>
                        <h4 className="font-extrabold text-white text-[11.5px] truncate">{pat.patient}</h4>
                      </div>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${isAlarm ? 'bg-red-600 text-white animate-bounce' : pat.status === 'Warning' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-emerald-600 text-white'}`}>{isAlarm ? 'ALARM BP HIGH' : pat.status}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 text-center py-2.5 font-mono">
                      <div className="bg-black/45 p-1.5 rounded">
                        <span className="block text-[8px] text-slate-300 uppercase font-sans">Heart Rate</span>
                        <span className="text-sm font-black text-emerald-400">{pat.hr} <span className="text-[8px] text-slate-400">BPM</span></span>
                      </div>
                      <div className="bg-black/45 p-1.5 rounded">
                        <span className="block text-[8px] text-slate-300 uppercase font-sans">NIBP BP</span>
                        <span className={`text-sm font-black ${isAlarm ? 'text-red-400 animate-pulse' : 'text-white'}`}>{pat.bp}</span>
                      </div>
                      <div className="bg-black/45 p-1.5 rounded">
                        <span className="block text-[8px] text-slate-300 uppercase font-sans">SpO2 %</span>
                        <span className="text-sm font-black text-sky-400">{pat.spo2}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex justify-between items-center text-[9.5px]">
                    <span className="text-slate-400 font-mono">Sync: ECG Lead-II</span>
                    {isAlarm ? (
                      <button onClick={() => {
                        setIcuPatients(icuPatients.map(p => p.bed === pat.bed ? { ...p, bp: '122/81', status: 'Normal' } : p));
                        alert(`💉 Vasodilator medication administered to ${pat.patient}. BP stabilized at 122/81 mmHg.`);
                      }} className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded animate-pulse shadow-sm uppercase text-[9px]">
                        Inject Med & Stabilize
                      </button>
                    ) : (
                      <button onClick={() => alert(`🔊 Broadcaster triggered. Audio channel open with Bed ${pat.bed}.`)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded text-[9px]">
                        Speak to Bed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-1.5 border-t border-[#628bbb] flex justify-end gap-2 text-[10px]">
            <button onClick={triggerCodeBlue} className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white font-black rounded uppercase flex items-center gap-1.5 animate-pulse shadow-md">
              <AlertTriangle className="w-3.5 h-3.5 text-white" /> Emergency Trigger Code Blue
            </button>
          </div>
        </div>
      )}

      {/* ==================== 14. OPERATING THEATER (OT) ==================== */}
      {(activePanel === 'OT Panel' || activePanel === 'OT') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Settings className="w-5 h-5 text-indigo-700" /> Operating Theater (OT) Surgical Console & WHO Safety List
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded">NABH Core Standard: ACC-3</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3.5">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Surgical Pre-Op Safety Checklist (WHO Standard)</span>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                  <input type="checkbox" checked={otChecklist.patientIdentity} onChange={e => setOtChecklist({ ...otChecklist, patientIdentity: e.target.checked })} className="w-4 h-4 accent-indigo-700" />
                  <span className="text-[11px] text-slate-700">1. Verified Patient Identity, Site, Procedure & Consent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                  <input type="checkbox" checked={otChecklist.siteMarked} onChange={e => setOtChecklist({ ...otChecklist, siteMarked: e.target.checked })} className="w-4 h-4 accent-indigo-700" />
                  <span className="text-[11px] text-slate-700">2. Surgical Site Marking Marked & Verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                  <input type="checkbox" checked={otChecklist.anesthesiaChecked} onChange={e => setOtChecklist({ ...otChecklist, anesthesiaChecked: e.target.checked })} className="w-4 h-4 accent-indigo-700" />
                  <span className="text-[11px] text-slate-700">3. Anesthesia Machine & Medication Safety Check Done</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                  <input type="checkbox" checked={otChecklist.pulseOximeterOn} onChange={e => setOtChecklist({ ...otChecklist, pulseOximeterOn: e.target.checked })} className="w-4 h-4 accent-indigo-700" />
                  <span className="text-[11px] text-slate-700">4. Pulse Oximeter Placed on Patient & Functioning</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                  <input type="checkbox" checked={otChecklist.allergyKnown} onChange={e => setOtChecklist({ ...otChecklist, allergyKnown: e.target.checked })} className="w-4 h-4 accent-indigo-700" />
                  <span className="text-[11px] text-slate-700">5. Patient Allergies Known & Logged in EHR</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                  <input type="checkbox" checked={otChecklist.sterileEquipment} onChange={e => setOtChecklist({ ...otChecklist, sterileEquipment: e.target.checked })} className="w-4 h-4 accent-indigo-700" />
                  <span className="text-[11px] text-slate-700">6. Autoclave CSSD Sterile Equipment Verified & Hashed</span>
                </label>
              </div>

              {/* Progress bar */}
              <div className="pt-2 border-t border-slate-200">
                {Object.values(otChecklist).every(v => v) ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 p-2 rounded text-center font-bold">
                    ✓ WHO Surgical Checklist Complete
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 p-2 rounded text-center font-bold font-sans">
                    ⚠ Complete all 6 checklist steps before commencing incision
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5">
              <span className="font-bold text-slate-800 uppercase text-[10.5px] border-b pb-1 block">Active Surgical Schedule (Today's Cases)</span>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {otActiveSchedules.map(sc => (
                  <div key={sc.ot} className="p-3 bg-white border rounded flex flex-col sm:flex-row justify-between sm:items-center gap-2 shadow-3xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded text-[9px]">{sc.ot}</span>
                        <span className="font-extrabold text-slate-800 text-[11px]">{sc.procedure}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Surgeon: <strong>{sc.surgeon}</strong> | Patient: <strong>{sc.patient}</strong></p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase block text-center ${sc.status === 'Ongoing' ? 'bg-indigo-900 text-white animate-pulse' : 'bg-amber-100 text-amber-800'}`}>{sc.status}</span>
                      
                      {sc.status === 'Pre-op Checklist' && (
                        <button onClick={() => {
                          if (!Object.values(otChecklist).every(v => v)) {
                            alert("❌ Cannot commence incision: Complete all WHO surgical safety checklists first.");
                            return;
                          }
                          setOtActiveSchedules(otActiveSchedules.map(o => o.ot === sc.ot ? { ...o, status: 'Ongoing' } : o));
                          alert(`🔪 Surgical incision commenced for patient ${sc.patient}. OT Block 2 timer started.`);
                        }} className="mt-1 px-2.5 py-0.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded text-[9.5px]">
                          Start Surgery
                        </button>
                      )}

                      {sc.status === 'Ongoing' && (
                        <button onClick={() => {
                          setOtActiveSchedules(otActiveSchedules.filter(o => o.ot !== sc.ot));
                          alert(`🏁 Surgery successfully completed for patient ${sc.patient}. Patient moved to post-operative recovery ICU.`);
                        }} className="mt-1 px-2.5 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-[9.5px]">
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 15. NURSING PANEL ==================== */}
      {(activePanel === 'Nursing Panel' || activePanel === 'Nursing') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <ClipboardCheck className="w-5 h-5 text-indigo-700" /> Nursing Handover & Medication Administration Record (MAR)
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded">NABH Standard COP-2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1 block">Nurse Shift Handover Checklist</span>
              <div className="space-y-1.5 font-medium text-slate-700 text-[11px]">
                <p className="flex items-center gap-1.5">✓ Narcotic Register Balance Tally Check Done</p>
                <p className="flex items-center gap-1.5">✓ High-Alert Medications (ISMP list) verified & locked</p>
                <p className="flex items-center gap-1.5">✓ Code Blue emergency kit checked & certified (Vial counts correct)</p>
                <p className="flex items-center gap-1.5">✓ Critical telemetry values shared with incoming shifts</p>
              </div>
              <button onClick={() => alert("📝 Shift sign-off completed: Shift Nurse logged handover with digital stamp certificate.")} className="w-full py-1.5 bg-indigo-900 text-white font-bold rounded uppercase shadow-3xs hover:bg-indigo-950 transition">
                Sign Shift Handover Certificate
              </button>
            </div>

            <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2">
              <span className="font-bold text-slate-800 uppercase text-[10.5px] border-b pb-1.5 block">MAR (Medication Administration Record) Queue</span>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                <div className="p-2.5 bg-white border rounded flex justify-between items-center shadow-3xs">
                  <div>
                    <span className="font-extrabold text-slate-800 text-[11px] block">Rahul Kumar</span>
                    <span className="text-[10px] text-indigo-700 font-semibold block">Amlodipine 5mg - 1 Tablet QD</span>
                    <span className="text-[9px] text-slate-400 font-mono">Scheduled: 10:00 AM | status: pending nurse stamp</span>
                  </div>
                  <button onClick={() => alert("✓ Drug administered & stamped on Patient Medication Record.")} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[9.5px]">
                    Administer
                  </button>
                </div>
                <div className="p-2.5 bg-white border rounded flex justify-between items-center shadow-3xs">
                  <div>
                    <span className="font-extrabold text-slate-800 text-[11px] block">Karan Singh</span>
                    <span className="text-[10px] text-indigo-700 font-semibold block">Insulin Glargine - 10 Units SC</span>
                    <span className="text-[9px] text-slate-400 font-mono">Scheduled: 01:00 PM | status: dual check required</span>
                  </div>
                  <button onClick={() => alert("✓ Dual nurse sign-off certified. Insulin glargine administered.")} className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[9.5px]">
                    Dual-Verify & Give
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 16. MRD MEDICAL RECORDS ==================== */}
      {(activePanel === 'MRD Panel' || activePanel === 'MRD') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Database className="w-5 h-5 text-indigo-700" /> Medical Records Department (MRD) Digital Archives
            </h3>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded">Compliance: HIPAA & ABDM Certified</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 uppercase text-[10.5px]">Digital Archive Records Ledger</span>
              <input type="text" placeholder="Search archive by Patient UHID..." className="p-1.5 text-[10px] bg-white border rounded w-52 focus:outline-none" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b font-bold text-slate-500">
                    <th className="p-2">UHID</th>
                    <th className="p-2">Patient name</th>
                    <th className="p-2">Admission Date</th>
                    <th className="p-2">Discharge Summary</th>
                    <th className="p-2">Audit Access Log</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.uhid} className="border-b bg-white last:border-0 hover:bg-slate-50">
                      <td className="p-2 font-mono text-slate-400 font-semibold">{p.uhid}</td>
                      <td className="p-2 font-bold text-slate-700">{p.name}</td>
                      <td className="p-2 font-mono text-slate-500">12-May-2026</td>
                      <td className="p-2">
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[9px] uppercase">Finalized</span>
                      </td>
                      <td className="p-2 font-mono text-[10px] text-slate-400">Authorized by Dr. Verma at 10:42 AM</td>
                      <td className="p-2 text-right">
                        <button onClick={() => setDossierPatient(p)} className="px-2.5 py-1 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold rounded text-[10px] transition uppercase tracking-wider shadow-2xs">
                          Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 17. RADIOLOGY WORKSPACE ==================== */}
      {(activePanel === 'Radiology Panel' || activePanel === 'Radiology') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Cpu className="w-5 h-5 text-indigo-700 animate-spin-slow" /> Radiology Information System (RIS & DICOM PACS Link)
            </h3>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded">HL7 HL2 DICOM Receiver</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-2.5">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1 block">Active Imaging Orders</span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {radOrders.map(ord => (
                  <button key={ord.orderId} onClick={() => {
                    setSelectedRadOrder(ord);
                    setNewRadReport(ord.report || '');
                  }} className={`w-full text-left p-2.5 border rounded flex justify-between items-center transition ${selectedRadOrder?.orderId === ord.orderId ? 'bg-indigo-50 border-indigo-200 font-bold' : 'bg-white hover:bg-slate-50'}`}>
                    <div>
                      <span className="font-mono text-[9px] font-bold text-slate-400 block">{ord.orderId}</span>
                      <span className="text-slate-800 block text-[11px]">{ord.type}</span>
                      <span className="text-[9.5px] text-slate-500 font-semibold block">Patient: {ord.patient}</span>
                    </div>
                    <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded uppercase ${ord.status === 'Report Drafted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{ord.status}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-3.5">
              <span className="font-bold text-slate-800 uppercase text-[10.5px] border-b pb-1 block">DICOM Image Viewer & Report Pad</span>
              {selectedRadOrder ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10.5px]">
                    <span>Order: <strong>{selectedRadOrder.orderId} - {selectedRadOrder.type}</strong></span>
                    <span>Patient: <strong>{selectedRadOrder.patient}</strong></span>
                  </div>

                  <div className="bg-slate-900 border rounded-lg h-36 flex flex-col items-center justify-center text-center text-slate-400 font-mono text-[10px] space-y-1 relative overflow-hidden">
                    {/* Simulated PACS Scan View */}
                    <div className="absolute inset-0 bg-radial-gradient from-slate-800 to-slate-950 opacity-90"></div>
                    <div className="relative z-10 space-y-1">
                      <Network className="w-8 h-8 text-sky-400 mx-auto animate-pulse" />
                      <p className="text-white font-extrabold text-[11px]">PACS RECONSTRUCTED DICOM SLICE #42</p>
                      <p className="text-[9px] text-slate-500">Device Calibration: Certified | HL7 Link: Verified</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Radiologist Clinical Report Findings</label>
                    <textarea value={newRadReport} onChange={e => setNewRadReport(e.target.value)} required rows={3} placeholder="Write radiographic observations..." className="w-full p-2 border rounded bg-white" />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button onClick={() => {
                      setRadOrders(radOrders.map(o => o.orderId === selectedRadOrder.orderId ? { ...o, status: 'Report Drafted', report: newRadReport } : o));
                      alert(`💾 Radiology report for order ${selectedRadOrder.orderId} signed and shared instantly with ABDM network.`);
                    }} className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded uppercase shadow-3xs">
                      Digitally Sign & Sync Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 italic text-center p-4">
                  Select an imaging order from the queue to load the DICOM PACS terminal and write clinical findings.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 18. BLOOD CENTRE ==================== */}
      {(activePanel === 'Blood Centre Panel' || activePanel === 'Blood Centre') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Droplet className="w-5 h-5 text-rose-600 fill-rose-600 animate-pulse" /> National Blood Centre Inventory Registry
            </h3>
            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded">NABH Standard SEC-5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 bg-slate-50 p-3.5 rounded border space-y-3">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Stored ABO/Rh Blood Bags Inventory</span>
              <div className="grid grid-cols-4 gap-2 text-center">
                {bloodBags.map(bg => (
                  <div key={bg.group} className="bg-white p-2 border rounded shadow-3xs flex flex-col justify-between h-16">
                    <span className="font-mono font-black text-red-600 text-sm leading-none">{bg.group}</span>
                    <span className="text-[11px] font-mono text-slate-800 font-bold">{bg.count} bags</span>
                    <div className="flex justify-center gap-1 mt-1 text-[8px]">
                      <button onClick={() => setBloodBags(bloodBags.map(b => b.group === bg.group ? { ...b, count: b.count + 1 } : b))} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-1 rounded">+</button>
                      <button onClick={() => {
                        if (bg.count === 0) return;
                        setBloodBags(bloodBags.map(b => b.group === bg.group ? { ...b, count: b.count - 1 } : b));
                      }} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-1 rounded">-</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-6 bg-slate-50 p-3.5 rounded border space-y-2.5">
              <span className="font-bold text-slate-800 uppercase text-[10.5px] border-b pb-1.5 block">Crossmatch & Release Requests (Trauma/OT)</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bloodRequests.map(rq => (
                  <div key={rq.id} className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-800 font-bold rounded font-mono text-[9px]">{rq.group}</span>
                        <span className="font-bold text-slate-800 text-[11px]">{rq.units} Units Required</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{rq.dept} | Request: {rq.id}</p>
                    </div>
                    <div>
                      {rq.status === 'Pending' ? (
                        <button onClick={() => {
                          const matchedBag = bloodBags.find(b => b.group === rq.group);
                          if (matchedBag && matchedBag.count >= rq.units) {
                            setBloodBags(bloodBags.map(b => b.group === rq.group ? { ...b, count: b.count - rq.units } : b));
                            setBloodRequests(bloodRequests.map(r => r.id === rq.id ? { ...r, status: 'Released' } : r));
                            alert(`🩸 ${rq.units} Units of ${rq.group} crossmatched & released securely to ${rq.dept}.`);
                          } else {
                            alert(`❌ Insufficient stock of ${rq.group} bags. Please request alternative group or donors.`);
                          }
                        }} className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded text-[10px]">
                          Crossmatch & Release
                        </button>
                      ) : (
                        <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Transfused</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 19. BIOMEDICAL ENGINEERING ==================== */}
      {activePanel === 'Biomedical Engineering' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Cpu className="w-5 h-5 text-indigo-700" /> Biomedical Engineering Device Calibration Control
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded">ISO 13485 Compliance</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border space-y-2.5">
            <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">High-Risk Life Support Equipment Register</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 border rounded shadow-3xs flex flex-col justify-between h-28">
                <div>
                  <h4 className="font-bold text-slate-800 text-[11.5px]">ICU Defibrillator #1</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Calibrated: 12-May-2026</p>
                </div>
                <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-100">
                  <span className="text-[9.5px] text-emerald-600 font-bold">✓ Calibrated</span>
                  <button onClick={() => alert("Calibration certified. Traceability certificate uploaded to NHA infrastructure.")} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[9px] font-bold">Verify</button>
                </div>
              </div>

              <div className="bg-white p-3 border rounded shadow-3xs flex flex-col justify-between h-28">
                <div>
                  <h4 className="font-bold text-slate-800 text-[11.5px]">OT Ventilator Block 2</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Next Due: Tomorrow</p>
                </div>
                <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-100">
                  <span className="text-[9.5px] text-amber-500 font-bold">⚠ Calibration Due</span>
                  <button onClick={() => alert("Preventive maintenance complete. Calibration tag updated for another 180 days.")} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded text-[9px] uppercase">Calibrate</button>
                </div>
              </div>

              <div className="bg-white p-3 border rounded shadow-3xs flex flex-col justify-between h-28">
                <div>
                  <h4 className="font-bold text-slate-800 text-[11.5px]">Sysmex LIS Hematology Analyzer</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Error Code: none</p>
                </div>
                <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-100">
                  <span className="text-[9.5px] text-emerald-600 font-bold">✓ Status Online</span>
                  <button onClick={() => alert("Self-diagnostic ping: HL7 communication link verified at 0 ms latency.")} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[9px] font-bold">Self-Test</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 20. AMBULANCE FLEET ==================== */}
      {(activePanel === 'Ambulance Panel' || activePanel === 'Ambulance') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Truck className="w-5 h-5 text-indigo-700 animate-bounce" /> Emergency GPS Ambulance Dispatch Fleet Console
            </h3>
            <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded">Emergency Link Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded border space-y-3">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1.5 block">Active Ambulance Fleet List</span>
              
              <div className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs">
                <div>
                  <span className="font-extrabold text-slate-800 text-[11px] block">Ambulance DL-3C-9011 (ALS Cardiac)</span>
                  <p className="text-[10px] text-slate-400">Crew: EMT Sandeep | Location: South Delhi Ring Road</p>
                </div>
                <span className="px-2 py-0.5 bg-indigo-900 text-white font-extrabold rounded text-[9px] uppercase animate-pulse">Dispatched</span>
              </div>

              <div className="p-3 bg-white border rounded flex justify-between items-center shadow-3xs">
                <div>
                  <span className="font-extrabold text-slate-800 text-[11px] block">Ambulance DL-3C-1200 (BLS Unit)</span>
                  <p className="text-[10px] text-slate-400">Crew: EMT Rajeev | Location: Main Campus Standby</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[9px] uppercase">Standby</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded border flex flex-col justify-between h-44 text-center space-y-2">
              <div className="w-10 h-10 bg-indigo-100 border rounded-full flex items-center justify-center mx-auto text-indigo-800">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[10.5px]">GPS Trauma Dispatch Controller</h4>
                <p className="text-[10.5px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                  Click dispatch below to immediately deploy the standby BLS unit to incoming emergency accident telemetry coordinates.
                </p>
              </div>
              <button onClick={() => alert("🚨 AMBULANCE DL-3C-1200 DISPATCHED! Sirens active, EMT route instructions sent to mobile tablet.")} className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded uppercase text-[10px]">
                Deploy Standby Ambulance Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 21. HR DEPARTMENT PANEL ==================== */}
      {activePanel === 'HR Department' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Users className="w-5 h-5 text-indigo-700" /> Human Resources & Dynamic Clinician Duty Roster
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded">Roster Node Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 bg-slate-50 p-3.5 rounded border space-y-3">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1 block">Roster Shift Scheduler</span>
              <form onSubmit={e => {
                e.preventDefault();
                if (!newStaffName) return;
                setHrRoster([...hrRoster, {
                  doctor: newStaffName,
                  role: newStaffRole,
                  shift: newStaffShift,
                  status: 'Active OPD'
                }]);
                alert(`📅 Shift scheduled: ${newStaffName} (${newStaffRole}) assigned to ${newStaffShift}.`);
                setNewStaffName('');
              }} className="space-y-2.5">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Clinician Name</label>
                  <input type="text" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} required placeholder="e.g. Dr. Sanya Mehta" className="w-full p-2 border rounded bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Specialty / Role</label>
                  <input type="text" value={newStaffRole} onChange={e => setNewStaffRole(e.target.value)} required placeholder="e.g. Cardiology Consultant" className="w-full p-2 border rounded bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Shift Timing</label>
                  <select value={newStaffShift} onChange={e => setNewStaffShift(e.target.value)} className="w-full p-2 border rounded bg-white">
                    <option value="09:00 AM - 05:00 PM">09:00 AM - 05:00 PM (OPD Day)</option>
                    <option value="08:00 AM - 04:00 PM">08:00 AM - 04:00 PM (Surgical)</option>
                    <option value="12:00 PM - 08:00 PM">12:00 PM - 08:00 PM (Late-OPD)</option>
                    <option value="08:00 PM - 08:00 AM">08:00 PM - 08:00 AM (ER Night Call)</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold hover:bg-indigo-950 rounded uppercase shadow-3xs text-[10px]">
                  Add shift assignment
                </button>
              </form>
            </div>

            <div className="md:col-span-8 bg-slate-50 p-3.5 rounded border space-y-2.5">
              <span className="font-bold text-slate-800 uppercase text-[10.5px] border-b pb-1 block">Roster Registry & Check-In Status</span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {hrRoster.map(ros => (
                  <div key={ros.doctor} className="p-2.5 bg-white border rounded flex justify-between items-center shadow-3xs">
                    <div>
                      <span className="font-extrabold text-slate-800 text-[11.5px] block">{ros.doctor}</span>
                      <p className="text-[10px] text-slate-500">{ros.role} | Shift: <strong className="text-slate-700 font-mono">{ros.shift}</strong></p>
                    </div>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-100">{ros.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 22. FINANCE & BILLING PANEL ==================== */}
      {activePanel === 'Finance & Accounts' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <CreditCard className="w-5 h-5 text-indigo-700" /> Hospital Accounts & Ayushman Bharat Insurance Claims Ledger
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">Claim Settled: Instant Gateways</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 bg-slate-50 p-3.5 rounded border space-y-3">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1 block">Raise Patient Bill / Invoice</span>
              <form onSubmit={e => {
                e.preventDefault();
                if (!billDesc) return;
                const invNo = `INV-40${billingLedger.length + 1}`;
                setBillingLedger([...billingLedger, {
                  invoice: invNo,
                  patient: selectedPatient.name,
                  description: billDesc,
                  amount: Number(billAmount),
                  status: 'Paid'
                }]);
                alert(`💵 Bill issued: ${invNo} for ${selectedPatient.name}. Stamped Paid.`);
                setBillDesc('');
              }} className="space-y-2.5">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Selected Patient (Billed)</label>
                  <input type="text" value={selectedPatient.name} disabled className="w-full p-2 border rounded bg-slate-100" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Tariff Description</label>
                  <input type="text" value={billDesc} onChange={e => setBillDesc(e.target.value)} required placeholder="e.g. Ward day charges general" className="w-full p-2 border rounded bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Billed Amount (INR)</label>
                  <input type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} required className="w-full p-2 border rounded bg-white font-mono" />
                </div>
                <button type="submit" className="w-full py-2 bg-indigo-900 text-white font-bold hover:bg-indigo-950 rounded uppercase shadow-3xs text-[10px]">
                  Raise & Settle Bill
                </button>
              </form>
            </div>

            <div className="md:col-span-8 bg-slate-50 p-3.5 rounded border space-y-3">
              <div className="flex justify-between items-center border-b pb-1">
                <span className="font-bold text-slate-800 uppercase text-[10.5px]">Ayushman Bharat Claims (AB-PMJAY Clearing Queue)</span>
                <span className="text-[10px] text-indigo-700 font-bold">CGHS / PMJAY Linked</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {insuranceClaims.map(cl => (
                  <div key={cl.claimId} className="p-2.5 bg-white border rounded flex justify-between items-center shadow-3xs">
                    <div>
                      <span className="font-extrabold text-slate-800 text-[11px] block">{cl.patient} | {cl.claimId}</span>
                      <p className="text-[10px] text-slate-500">{cl.scheme} - {cl.package}</p>
                    </div>
                    {cl.status === 'Awaiting Settlement' ? (
                      <button onClick={() => {
                        setInsuranceClaims(insuranceClaims.map(c => c.claimId === cl.claimId ? { ...c, status: 'Approved & Disbursed' } : c));
                        alert(`💸 Claim ${cl.claimId} successfully audited against national digital standards. Disbursed instantly.`);
                      }} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[9.5px]">
                        Verify & Disburse
                      </button>
                    ) : (
                      <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{cl.status}</span>
                    )}
                  </div>
                ))}
              </div>

              <span className="font-bold text-slate-800 uppercase text-[10.5px] border-b pb-1 block">Patient Billing Transaction History</span>
              <div className="space-y-1 max-h-36 overflow-y-auto pt-1 font-mono text-[10.5px]">
                {billingLedger.map(inv => (
                  <div key={inv.invoice} className="p-1.5 bg-white border-b flex justify-between items-center">
                    <span>{inv.invoice} | {inv.patient}</span>
                    <span>INR {inv.amount} | <strong className="text-indigo-900">{inv.status}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 23. MOBILE APP SIMULATION ==================== */}
      {(activePanel === 'Mobile App Panel' || activePanel === 'Mobile App') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans flex flex-col items-center">
          <div className="border-b border-slate-100 pb-2 w-full flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <UserCheck className="w-5 h-5 text-indigo-700" /> Patient Portal Companion Application Simulator
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded">Simulator Mode</span>
          </div>

          <div className="w-64 bg-slate-900 rounded-[30px] p-3 shadow-2xl border-[6px] border-slate-800 relative">
            {/* Phone speaker/notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full z-20"></div>
            
            {/* Simulated Phone Screen Container */}
            <div className="bg-sky-950 text-white rounded-[20px] overflow-hidden min-h-[380px] p-3 flex flex-col justify-between font-sans">
              <div className="pt-4 flex justify-between items-center border-b border-sky-900/60 pb-1.5">
                <span className="text-[9px] font-bold">9:41 AM</span>
                <span className="text-[9px] bg-sky-500/10 text-sky-400 px-1.5 rounded border border-sky-500/20">ABHA Linked</span>
              </div>

              {/* Simulated Phone Content Router */}
              <div className="flex-1 py-3 text-[10.5px]">
                {mobileScreen === 'home' && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="font-bold text-xs">Namaste, {selectedPatient.name}!</p>
                    <div className="bg-sky-900/40 p-2 border border-sky-800 rounded-lg text-[10px]">
                      <span className="text-sky-300 font-bold uppercase block text-[8px]">ABHA Address</span>
                      <strong className="font-mono">{selectedPatient.abhaAddress}</strong>
                    </div>
                    <div className="space-y-1.5">
                      <span className="font-bold uppercase text-[8px] text-sky-400 block">Quick Services</span>
                      <button onClick={() => setMobileScreen('abha_card')} className="w-full p-2 bg-sky-900 hover:bg-sky-850 rounded text-left border border-sky-800 flex justify-between items-center">
                        <span>Show My ABHA Card</span>
                        <span>→</span>
                      </button>
                      <button onClick={() => setMobileScreen('records')} className="w-full p-2 bg-sky-900 hover:bg-sky-850 rounded text-left border border-sky-800 flex justify-between items-center">
                        <span>View My Health Reports</span>
                        <span>→</span>
                      </button>
                      <button onClick={() => setMobileScreen('book')} className="w-full p-2 bg-sky-900 hover:bg-sky-850 rounded text-left border border-sky-800 flex justify-between items-center">
                        <span>Request OPD Appointment</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                )}

                {mobileScreen === 'abha_card' && (
                  <div className="space-y-2.5 animate-fade-in">
                    <button onClick={() => setMobileScreen('home')} className="text-[9px] text-sky-300 underline font-bold uppercase">← Back to home</button>
                    <div className="bg-white text-slate-800 p-2.5 rounded-lg border border-teal-500/20 shadow space-y-1">
                      <span className="text-[7.5px] font-black text-teal-600 block leading-none">ABHA HEALTH ID CARD</span>
                      <p className="font-bold text-[11px] text-slate-900 truncate leading-snug">{selectedPatient.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono">ID: {selectedPatient.abhaId}</p>
                      <p className="text-[9px] text-slate-500">Address: {selectedPatient.abhaAddress}</p>
                      <div className="w-16 h-16 bg-slate-100 rounded border border-slate-300 flex items-center justify-center font-mono font-bold text-teal-800 text-xs mx-auto mt-1.5">QR</div>
                    </div>
                  </div>
                )}

                {mobileScreen === 'records' && (
                  <div className="space-y-2 animate-fade-in">
                    <button onClick={() => setMobileScreen('home')} className="text-[9px] text-sky-300 underline font-bold uppercase">← Back to home</button>
                    <span className="font-bold text-sky-300 block uppercase text-[8px] border-b border-sky-900/60 pb-1">FHIR Health Records</span>
                    <div className="space-y-1">
                      <div className="p-2 bg-sky-900/40 border border-sky-800 rounded">
                        <strong className="block text-white">OPD Consultation Summary</strong>
                        <span className="text-[9px] text-sky-300 font-mono">12-May-2026 | Dr. Amit Verma</span>
                      </div>
                      <div className="p-2 bg-sky-900/40 border border-sky-800 rounded">
                        <strong className="block text-white">Diagnostic Report (CBC)</strong>
                        <span className="text-[9px] text-sky-300 font-mono">08-May-2026 | Certified Lab</span>
                      </div>
                    </div>
                  </div>
                )}

                {mobileScreen === 'book' && (
                  <div className="space-y-2 animate-fade-in">
                    <button onClick={() => setMobileScreen('home')} className="text-[9px] text-sky-300 underline font-bold uppercase">← Back to home</button>
                    <span className="font-bold text-sky-300 block uppercase text-[8px] border-b border-sky-900/60 pb-1">Book OPD Consultation</span>
                    <div className="space-y-1.5 pt-1 text-[10px]">
                      <div>
                        <label className="block text-sky-300 mb-0.5">Select Department</label>
                        <select className="w-full p-1 bg-sky-900/80 border border-sky-800 text-white rounded">
                          <option>General Medicine</option>
                          <option>Cardiology</option>
                          <option>Pediatrics</option>
                          <option>Orthopedics</option>
                        </select>
                      </div>
                      <button onClick={() => {
                        alert("📅 Slot requested! You will receive an SMS confirmation with your token once the clinic approves.");
                        setMobileScreen('home');
                      }} className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded uppercase">
                        Request Slot
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone home bottom line */}
              <div className="w-24 h-1 bg-white/40 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 24. ABDM INTEGRATION CONSOLE ==================== */}
      {(activePanel === 'ABDM Integration Panel' || activePanel === 'ABDM Integration') && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in text-xs font-sans">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Network className="w-5 h-5 text-indigo-700 animate-spin-slow" /> ABDM Gateway Integration Bridge Controller
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">Gateway: Online</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 bg-slate-50 p-3.5 rounded border space-y-3">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1 block">Bridge Authentication credentials</span>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">NHA Client ID (Sandbox)</label>
                  <input type="text" value={clientId} onChange={e => setClientId(e.target.value)} className="w-full p-2 border rounded bg-white font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-0.5">NHA Client Secret</label>
                  <input type="text" value={clientSecret} onChange={e => setClientSecret(e.target.value)} className="w-full p-2 border rounded bg-white font-mono" />
                </div>
                <div className="bg-slate-900/5 p-2 rounded border border-slate-200 text-[10px] text-slate-500 font-sans">
                  The credentials configure connectivity to the central National Health Authority (NHA) gateway nodes.
                </div>
                <button onClick={() => alert("🔑 Credentials saved. Relinking bridge server...")} className="w-full py-2 bg-indigo-900 text-white font-bold hover:bg-indigo-950 rounded uppercase shadow-3xs text-[10px]">
                  Save credentials & link node
                </button>
              </div>
            </div>

            <div className="md:col-span-7 bg-slate-50 p-3.5 rounded border space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b pb-1.5">
                  <span className="font-bold text-slate-800 uppercase text-[10.5px]">NHA Gateway Log Stream Terminal</span>
                  <span className="text-[10px] text-emerald-600 font-bold font-mono">Latency: 42ms</span>
                </div>
                <div className="bg-slate-950 text-emerald-400 p-2.5 rounded-lg border border-slate-800 font-mono text-[9.5px] space-y-1 overflow-x-auto max-h-36 leading-tight mt-1.5">
                  {bridgeLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className="text-white font-bold">{log.method}</span>
                      <span className="text-sky-300">{log.endpoint}</span>
                      <span className="text-emerald-400 font-bold">{log.status}</span>
                      <span className="text-slate-500">({log.latency})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button onClick={() => {
                  setBridgeLogs([
                    { timestamp: new Date().toLocaleTimeString(), method: 'POST', endpoint: '/v1.0/consent-requests/init', status: '202 Accepted', latency: '68ms' },
                    ...bridgeLogs
                  ]);
                  alert("⚡ Mock ping successfully verified against National Health Authority. Latency: 42 ms.");
                }} className="px-3.5 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded uppercase shadow-3xs text-[10px]">
                  Test Gateway ping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 25. STANDARD SUPPORT FOR REMAINING MODULES (CSSD, HOUSEKEEPING, BIOMEDICAL WASTE, ETC.) ==================== */}
      {!['Super Admin Panel', 'NABH Compliance Panel', 'Analytics Dashboard', 'Corporate Admin Panel', 'Hospital Admin Panel', 'Medical Superintendent', 'Medical Director Panel', 'Quality Manager (NABH)', 'SOP / Policies', 'Emergency Panel', 'Pharmacy Panel', 'Pharmacy', 'Laboratory Panel', 'Doctor Portal Panel', 'Patient Portal Panel', 'Reception', 'Reception Panel', 'OPD Panel', 'OPD', 'IPD Panel', 'IPD', 'ICU Panel', 'ICU', 'OT Panel', 'OT', 'Nursing Panel', 'Nursing', 'MRD Panel', 'MRD', 'Radiology Panel', 'Radiology', 'Blood Centre Panel', 'Blood Centre', 'Biomedical Engineering', 'Ambulance Panel', 'Ambulance', 'HR Department', 'Finance & Accounts', 'Mobile App Panel', 'Mobile App', 'ABDM Integration Panel', 'ABDM Integration'].includes(activePanel) && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-xs font-sans space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <h3 className="font-extrabold text-indigo-950 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <Settings className="w-5 h-5 text-indigo-700 animate-pulse" /> {activePanel} Active Operational Console
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">Standard Operations Matrix</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allied checks checklist */}
            <div className="bg-slate-50 p-3.5 rounded border space-y-2.5">
              <span className="font-bold text-slate-800 uppercase text-[10px] border-b pb-1 block">ISO / NABH Safety Audits</span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-700" />
                  <span className="text-[11px] text-slate-700">Audit logs stamped and backed up to S3 bucket</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-700" />
                  <span className="text-[11px] text-slate-700">Autoclave sterilization temperature certified at 121°C</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-700" />
                  <span className="text-[11px] text-slate-700">Biomedical waste color segregation (Red, Yellow, Blue) done</span>
                </label>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded border text-center flex flex-col justify-between h-40 space-y-1">
              <div className="w-10 h-10 bg-indigo-50 border-2 border-indigo-200 rounded-full flex items-center justify-center mx-auto text-indigo-800">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider">Dynamic {activePanel} Log Node</h4>
                <p className="text-[10.5px] text-slate-500 leading-normal mt-1">
                  MAPPED TO NATIONAL ABDM (M1-M4) INGRESS ROUTERS AND CENTRAL TELEMETRY AUDIT LOGGING GATEWAYS.
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-1.5 border-t border-slate-200/85">
                <button onClick={() => alert(`📋 Displaying transaction telemetry audits for ${activePanel}. All local hashes match central ABDM gateways.`)} className="px-3 py-1 bg-indigo-900 text-white font-bold hover:bg-indigo-950 transition rounded text-[9.5px] uppercase">
                  Telemetry logs
                </button>
                <button onClick={() => alert(`📋 Opening standard operational procedures (SOPs) folder mapped to ${activePanel}.`)} className="px-3 py-1 bg-white border text-slate-700 font-bold hover:bg-slate-50 transition rounded text-[9.5px] uppercase">
                  Access SOPs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== HIGH-FIDELITY PATIENT DOSSIER MODAL ==================== */}
      {dossierPatient && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto print:absolute print:inset-0 print:bg-white print:z-[9999] print:p-0 print:m-0">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 relative overflow-hidden flex flex-col max-h-[95vh] print:max-h-full print:shadow-none print:border-none animate-fade-in font-sans">
            {/* Modal Top Decorative Bar */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-900 via-indigo-700 to-emerald-500 w-full print:hidden" />

            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50 print:bg-white print:border-b-2 print:border-slate-300">
              <div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1 print:border print:border-indigo-800 print:text-indigo-800">
                  ABDM FHIR-Aligned Health Record
                </span>
                <h3 className="text-base font-extrabold text-indigo-950 uppercase tracking-tight flex items-center gap-1.5 print:text-black">
                  <ClipboardCheck className="w-5 h-5 text-indigo-700 animate-pulse print:hidden" /> National Sandbox Dossier
                </h3>
                <p className="text-[10px] text-slate-500 font-medium font-mono mt-0.5">
                  Secure Cryptographic Handover Node: ABDM-v4.0.12-PROD
                </p>
              </div>
              <button 
                onClick={() => setDossierPatient(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition print:hidden"
                title="Dismiss Dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 print:overflow-visible">
              
              {/* STAMP / SIGNED METADATA */}
              {dossierSignatureHash ? (
                <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-3 flex items-center justify-between animate-fade-in print:bg-white print:border-emerald-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-800 flex-shrink-0 animate-pulse print:hidden">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-widest block font-mono print:text-emerald-700">
                        ● CRYPTOGRAPHICALLY SIGNED & SEALED
                      </span>
                      <span className="text-[11px] font-bold text-slate-800 block mt-0.5 print:text-black">
                        Authorized by: {dossierSigner} ({dossierSignerTitle})
                      </span>
                      <span className="text-[9.5px] font-medium font-mono text-slate-500 block mt-0.5 truncate max-w-md print:text-black">
                        SHA-256 ID: <span className="text-emerald-700 font-bold font-mono">{dossierSignatureHash}</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 print:text-black">
                    {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ) : (
                <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-3 flex items-center justify-between print:hidden">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 flex-shrink-0">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider block font-mono">
                        Awaiting Practitioner Digital Seal
                      </span>
                      <span className="text-[10.5px] text-slate-600 block mt-0.5">
                        Document finalized but requires a logged-in medical practitioner digital signature.
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">STATUS: PENDING</span>
                </div>
              )}

              {/* SECTION 1: Patient ABHA Profile Identity Card (Official Style) */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-xl p-5 text-white relative shadow-md overflow-hidden border border-slate-800 print:bg-white print:text-black print:border-2 print:border-black print:shadow-none">
                {/* Embedded subtle medical cross background */}
                <div className="absolute right-0 top-0 text-white/5 pointer-events-none translate-x-10 -translate-y-5 print:hidden">
                  <Activity className="w-64 h-64" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10 relative print:border-b-2 print:border-black">
                  <div>
                    <span className="text-[8px] bg-emerald-500 text-emerald-950 font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-widest block w-max print:bg-black print:text-white">
                      MINISTRY OF HEALTH & FAMILY WELFARE
                    </span>
                    <h4 className="font-extrabold text-lg tracking-tight uppercase mt-1 print:text-black">
                      Ayushman Bharat Health Account (ABHA)
                    </h4>
                  </div>
                  {/* Digital Signature Emblem */}
                  <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded border border-white/10 font-mono text-[9px] print:border-black print:text-black">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse print:bg-emerald-600" />
                    <span>ABDM NODE CONNECTED</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 relative">
                  {/* Photo Placeholder */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-lg p-3 h-32 print:border-black print:bg-white">
                    <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-extrabold text-xl print:text-black print:border-black print:bg-slate-100">
                      {dossierPatient.name.charAt(0)}
                    </div>
                    <span className="text-[9px] font-mono text-white/60 mt-2 tracking-wider print:text-black/60">PHOTO STAMP</span>
                  </div>

                  {/* Demographics details */}
                  <div className="md:col-span-6 grid grid-cols-2 gap-y-3.5 gap-x-2 text-[11px]">
                    <div>
                      <span className="text-white/50 text-[9px] block uppercase font-bold tracking-wider print:text-slate-500">Patient Name</span>
                      <span className="text-white font-extrabold text-xs uppercase print:text-black">{dossierPatient.name}</span>
                    </div>
                    <div>
                      <span className="text-white/50 text-[9px] block uppercase font-bold tracking-wider print:text-slate-500">ABHA ID (ABHA-14)</span>
                      <span className="text-white font-mono font-bold text-xs print:text-black">{dossierPatient.abhaId}</span>
                    </div>
                    <div>
                      <span className="text-white/50 text-[9px] block uppercase font-bold tracking-wider print:text-slate-500">ABHA Address</span>
                      <span className="text-white font-mono font-semibold text-[10px] break-all print:text-black">{dossierPatient.abhaAddress}</span>
                    </div>
                    <div>
                      <span className="text-white/50 text-[9px] block uppercase font-bold tracking-wider print:text-slate-500">UHID (Local Node)</span>
                      <span className="text-white font-mono font-semibold print:text-black">{dossierPatient.uhid}</span>
                    </div>
                    <div>
                      <span className="text-white/50 text-[9px] block uppercase font-bold tracking-wider print:text-slate-500">Age & Gender</span>
                      <span className="text-white font-bold print:text-black">{dossierPatient.age} Yrs / {dossierPatient.gender}</span>
                    </div>
                    <div>
                      <span className="text-white/50 text-[9px] block uppercase font-bold tracking-wider print:text-slate-500">Registered Phone</span>
                      <span className="text-white font-mono print:text-black">{dossierPatient.phone}</span>
                    </div>
                  </div>

                  {/* Simulated QR Code for Digital Verification */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center bg-white p-2.5 rounded-lg border border-white/10 self-center h-32 w-32 mx-auto md:mr-0 print:border-black">
                    <svg className="w-24 h-24 text-slate-950" viewBox="0 0 100 100">
                      <rect x="0" y="0" width="20" height="20" fill="currentColor" />
                      <rect x="5" y="5" width="10" height="10" fill="white" />
                      <rect x="80" y="0" width="20" height="20" fill="currentColor" />
                      <rect x="85" y="5" width="10" height="10" fill="white" />
                      <rect x="0" y="80" width="20" height="20" fill="currentColor" />
                      <rect x="5" y="85" width="10" height="10" fill="white" />
                      <rect x="30" y="10" width="10" height="5" fill="currentColor" />
                      <rect x="45" y="5" width="5" height="15" fill="currentColor" />
                      <rect x="60" y="20" width="15" height="10" fill="currentColor" />
                      <rect x="15" y="30" width="20" height="8" fill="currentColor" />
                      <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                      <rect x="70" y="50" width="12" height="15" fill="currentColor" />
                      <rect x="10" y="60" width="15" height="10" fill="currentColor" />
                      <rect x="30" y="75" width="25" height="12" fill="currentColor" />
                      <rect x="65" y="80" width="15" height="15" fill="currentColor" />
                    </svg>
                    <span className="text-[8px] text-slate-500 font-extrabold uppercase mt-1 tracking-wider font-mono print:text-black">
                      SCAN SECURE VERIFY
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Clinical Summary Vitals, Allergies, Vitals & Medications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Clinical Conditions & Allergies */}
                <div className="border rounded-lg p-4 space-y-3.5 bg-slate-50/50 print:bg-white print:border-black">
                  <h5 className="font-extrabold text-indigo-950 uppercase tracking-wider text-[11px] border-b pb-1.5 flex items-center gap-1.5 print:text-black print:border-black">
                    <ShieldAlert className="w-4 h-4 text-rose-600 print:hidden" /> Vitals & Clinical Risk Parameters
                  </h5>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider mb-1 print:text-black">ALLERGIES</span>
                      <div className="flex flex-wrap gap-1">
                        {dossierPatient.allergies.map((allergy, i) => {
                          const isNoAllergy = allergy.toLowerCase().includes('no known');
                          return (
                            <span 
                              key={i} 
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isNoAllergy 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 print:border-emerald-700' 
                                  : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse print:border-rose-700'
                              }`}
                            >
                              {allergy}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider mb-1 print:text-black">CHRONIC CONDITIONS</span>
                      <div className="flex flex-wrap gap-1">
                        {dossierPatient.chronicConditions.map((cond, i) => {
                          const isNone = cond.toLowerCase().includes('none');
                          return (
                            <span 
                              key={i} 
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isNone 
                                  ? 'bg-slate-100 text-slate-600 border border-slate-200 print:border-slate-500' 
                                  : 'bg-amber-100 text-amber-800 border border-amber-200 print:border-amber-700'
                              }`}
                            >
                              {cond}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Medications */}
                <div className="border rounded-lg p-4 space-y-3.5 bg-slate-50/50 print:bg-white print:border-black">
                  <h5 className="font-extrabold text-indigo-950 uppercase tracking-wider text-[11px] border-b pb-1.5 flex items-center gap-1.5 print:text-black print:border-black">
                    <Pill className="w-4 h-4 text-indigo-600 print:hidden" /> Current Medication Regimen
                  </h5>

                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider print:text-black">ACTIVE PHARMACOTHERAPY</span>
                    <ul className="space-y-1.5">
                      {dossierPatient.currentMedications.map((med, i) => {
                        const isNone = med.toLowerCase().includes('none');
                        return (
                          <li key={i} className="flex items-start gap-1.5 text-[10.5px]">
                            {isNone ? (
                              <span className="text-slate-500 italic print:text-black">No currently logged active medications.</span>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0 print:bg-black" />
                                <div>
                                  <span className="font-extrabold text-slate-800 block print:text-black">{med}</span>
                                  <span className="text-[9px] text-slate-400 font-medium font-mono uppercase print:text-slate-500">Prescribed by clinical node • Active</span>
                                </div>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Recent Encounter History Timeline */}
              <div className="border rounded-lg p-4 space-y-3 bg-slate-50/50 print:bg-white print:border-black">
                <h5 className="font-extrabold text-indigo-950 uppercase tracking-wider text-[11px] border-b pb-1.5 flex items-center gap-1.5 print:text-black print:border-black">
                  <History className="w-4 h-4 text-indigo-600 print:hidden" /> Enrolled Consultations & Encounters History
                </h5>

                <div className="relative border-l border-slate-200 ml-2.5 pl-4 space-y-4 pt-1 print:border-black">
                  {dossierPatient.recentVisits.map((visit, i) => (
                    <div key={i} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-indigo-600 rounded-full border border-white shadow-xs print:bg-black print:border-black" />
                      
                      <div className="text-[10.5px]">
                        <span className="font-mono text-[9px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-extrabold uppercase print:bg-white print:text-black print:border print:border-black">
                          {visit.date}
                        </span>
                        <div className="mt-1 font-bold text-slate-800 print:text-black">
                          {visit.department}
                        </div>
                        <div className="text-[10px] text-slate-500 print:text-black">
                          Attending Physician: <span className="font-semibold text-slate-700 print:text-black">{visit.doctor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: Interactive Practitioner Addendum */}
              <div className="border border-slate-200 rounded-lg p-4 bg-indigo-50/30 space-y-3.5 print:bg-white print:border-black">
                <h5 className="font-extrabold text-indigo-950 uppercase tracking-wider text-[11px] border-b pb-1.5 flex items-center gap-1.5 print:text-black print:border-black">
                  <FileText className="w-4 h-4 text-indigo-700 print:hidden" /> Interactive Clinical Addendum Notes
                </h5>

                <div className="space-y-2">
                  <label className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider block print:text-black">
                    APPEND CLINICAL OBSERVATIONS (DRAFT PROVISIONAL COMMENTS)
                  </label>
                  <textarea 
                    value={dossierNotes}
                    onChange={(e) => setDossierNotes(e.target.value)}
                    placeholder="Type diagnosis, clinical instructions, or care advisories here. These comments will compile directly into the sealed FHIR payload..."
                    className="w-full h-20 p-2.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-sans print:border-black print:text-black"
                    disabled={!!dossierSignatureHash || isDossierSigning}
                  />
                  {dossierSignatureHash && dossierNotes && (
                    <div className="text-[10px] text-emerald-800 font-extrabold bg-emerald-50 p-2 rounded border border-emerald-100 uppercase tracking-wider font-mono print:bg-white print:text-emerald-700 print:border-emerald-600">
                      🔒 Attached Comment Locked & Signed Cryptographically.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center print:hidden">
              
              {/* Left Group: ABDM Sandbox Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsDossierSyncing(true);
                    setTimeout(() => {
                      setIsDossierSyncing(false);
                      alert(`✅ ABDM Registry Sandbox Synchronized successfully!\nRecord hash synced to ABHA Gateway. Status: M1-M3 Certified.`);
                    }, 1200);
                  }}
                  disabled={isDossierSyncing || isDossierSigning}
                  className="px-3 py-1.5 bg-white border hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider rounded transition flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isDossierSyncing ? 'animate-spin' : ''}`} />
                  {isDossierSyncing ? 'Syncing...' : 'Sync ABDM'}
                </button>

                <button
                  onClick={() => {
                    setIsDossierPrinting(true);
                    setTimeout(() => {
                      setIsDossierPrinting(false);
                      window.print();
                    }, 1000);
                  }}
                  disabled={isDossierPrinting || isDossierSigning}
                  className="px-3 py-1.5 bg-white border hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider rounded transition flex items-center gap-1"
                  title="Print Dossier to PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  Print PDF
                </button>
              </div>

              {/* Right Group: Close or Sign */}
              <div className="flex gap-2">
                {!dossierSignatureHash ? (
                  <button
                    onClick={() => {
                      setIsDossierSigning(true);
                      setTimeout(() => {
                        const randomHash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
                        const signerName = currentUser?.fullName || 'Dr. Amit Verma';
                        const signerTitle = currentUser?.title || 'Attending Physician';
                        setDossierSignatureHash(`SHA256-${randomHash}`);
                        setDossierSigner(signerName);
                        setDossierSignerTitle(signerTitle);
                        setIsDossierSigning(false);
                      }, 1500);
                    }}
                    disabled={isDossierSigning}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase text-[10px] tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                  >
                    <Key className={`w-3.5 h-3.5 ${isDossierSigning ? 'animate-pulse' : ''}`} />
                    {isDossierSigning ? 'Generating Seal...' : 'Digitally Sign & Seal'}
                  </button>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-extrabold uppercase text-[10px]">
                    <ShieldCheck className="w-4 h-4" /> Locked & Sealed
                  </div>
                )}

                <button
                  onClick={() => setDossierPatient(null)}
                  className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold uppercase text-[10px] tracking-wider rounded transition shadow-2xs"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE LOG VITALS MODAL ==================== */}
      {vitalsPatientApp && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col font-sans">
            <div className="h-1.5 bg-indigo-900 w-full" />
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1">
                  OPD Nursing Station
                </span>
                <h3 className="text-sm font-black text-indigo-950 uppercase tracking-tight flex items-center gap-1.5">
                  <Activity className="w-4.5 h-4.5 text-indigo-700 animate-pulse" /> Capture Patient Vitals
                </h3>
              </div>
              <button 
                onClick={() => setVitalsPatientApp(null)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 space-y-1">
                <p className="font-extrabold text-indigo-950 text-xs">{vitalsPatientApp.patientName}</p>
                <p className="text-[10px] text-slate-500 font-medium">UHID: <span className="font-mono font-semibold">{vitalsPatientApp.patientUhid}</span> • Dept: {vitalsPatientApp.department}</p>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Blood Pressure (mmHg)</label>
                  <input 
                    type="text" 
                    value={formBp} 
                    onChange={e => setFormBp(e.target.value)}
                    placeholder="e.g. 120/80"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Heart Rate (bpm)</label>
                  <input 
                    type="number" 
                    value={formHr} 
                    onChange={e => setFormHr(e.target.value)}
                    placeholder="e.g. 72"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">SpO2 (Oxygen %)</label>
                  <input 
                    type="number" 
                    value={formSpo2} 
                    onChange={e => setFormSpo2(e.target.value)}
                    placeholder="e.g. 98"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Body Temperature (°F)</label>
                  <input 
                    type="text" 
                    value={formTemp} 
                    onChange={e => setFormTemp(e.target.value)}
                    placeholder="e.g. 98.6"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Respiratory Rate (/min)</label>
                <input 
                  type="number" 
                  value={formResp} 
                  onChange={e => setFormResp(e.target.value)}
                  placeholder="e.g. 16"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                />
              </div>

              <div className="text-[9.5px] bg-slate-50 border p-2.5 rounded text-slate-500 font-medium leading-normal flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-700 flex-shrink-0 mt-0.5" />
                <span>Entering vital statistics instantly pushes a secure, structured FHIR Observation packet to the sandbox registry node.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => setVitalsPatientApp(null)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold uppercase text-[10px] rounded hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveVitals}
                className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold uppercase text-[10px] tracking-wider rounded transition shadow-2xs flex items-center gap-1"
              >
                Save & Commit Vitals
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE SEND LAB REQUEST MODAL ==================== */}
      {labPatientApp && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col font-sans">
            <div className="h-1.5 bg-indigo-900 w-full" />
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1">
                  Diagnostics Gateway
                </span>
                <h3 className="text-sm font-black text-indigo-950 uppercase tracking-tight flex items-center gap-1.5">
                  <FlaskConical className="w-4.5 h-4.5 text-indigo-700 animate-pulse" /> Dispatch Laboratory Request
                </h3>
              </div>
              <button 
                onClick={() => setLabPatientApp(null)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 space-y-1">
                <p className="font-extrabold text-indigo-950 text-xs">{labPatientApp.patientName}</p>
                <p className="text-[10px] text-slate-500 font-medium">UHID: <span className="font-mono font-semibold">{labPatientApp.patientUhid}</span> • Dept: {labPatientApp.department}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Select Laboratory Panels</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded bg-slate-50/50">
                  {[
                    'Complete Blood Count (CBC)',
                    'Liver Function Test (LFT)',
                    'Kidney Function Test (KFT)',
                    'Lipid Profile (Fasting)',
                    'Thyroid Panel (T3, T4, TSH)',
                    'HbA1c / Glycated Hb',
                    'Urine Routine & Microscopy',
                    'Random Blood Sugar (RBS)',
                    'C-Reactive Protein (CRP)',
                    'D-Dimer Coagulation'
                  ].map(test => {
                    const isSelected = selectedTests.includes(test);
                    return (
                      <label 
                        key={test} 
                        className={`p-2 rounded border cursor-pointer flex items-center gap-1.5 transition text-[10px] font-bold ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-950' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleTestSelection(test)}
                          className="rounded text-indigo-900 focus:ring-indigo-500"
                        />
                        <span className="leading-tight">{test}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Priority Level</label>
                  <select 
                    value={labPriority} 
                    onChange={e => setLabPriority(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Routine">Routine (Turnaround: 12h)</option>
                    <option value="Urgent">Urgent / Priority (Turnaround: 4h)</option>
                    <option value="STAT">STAT / Critical (Turnaround: 1h)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Phlebotomy Slot</label>
                  <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold">
                    <option>Immediate / Next Phlebotomist</option>
                    <option>Scheduled (Morning Fasting)</option>
                    <option>Bedside Draw (Ward ICU)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Clinical Instructions / Indication notes</label>
                <textarea 
                  value={labNotes}
                  onChange={e => setLabNotes(e.target.value)}
                  placeholder="Specify custom test parameters, fast state instruction, clinical indication or drug history notes..."
                  className="w-full h-14 p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => setLabPatientApp(null)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold uppercase text-[10px] rounded hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendLab}
                className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold uppercase text-[10px] tracking-wider rounded transition shadow-2xs flex items-center gap-1"
              >
                Authorize Lab Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE IPD ADMISSION MODAL ==================== */}
      {showIpdModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col font-sans">
            <div className="h-1.5 bg-[#006437] w-full" />
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1">
                  IPD Admission Ward
                </span>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                  IPD Admission Form
                </h3>
              </div>
              <button 
                onClick={() => {
                  setShowIpdModal(false);
                  setPatientActiveTab('OPD');
                }} 
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIpdAdmission} className="p-4 space-y-4">
              <div className="p-2.5 bg-sky-50 border border-sky-100 rounded-lg flex flex-col gap-1">
                <p className="font-extrabold text-sky-950 text-xs">{selectedPatient.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">UHID: <span className="font-mono font-semibold">{selectedPatient.uhid}</span> • Age/Gender: {selectedPatient.age} Yrs / {selectedPatient.gender}</p>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Ward Category Select */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Bed / Ward Category</label>
                  <select 
                    value={ipdBedCategory}
                    onChange={e => setIpdBedCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  >
                    {beds.map(b => (
                      <option key={b.name} value={b.name}>
                        {b.name} (Occupied: {b.occupied}/{b.total})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Admission Diagnosis */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Admission Reason / Diagnosis</label>
                  <input 
                    type="text"
                    value={ipdDiagnosis}
                    onChange={e => setIpdDiagnosis(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    placeholder="e.g. Acute Appendicitis, Severe Pneumonia"
                    required
                  />
                </div>

                {/* Admitting Doctor */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Admitting Doctor</label>
                  <select 
                    value={ipdDoctor}
                    onChange={e => setIpdDoctor(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Dr. Amit Verma">Dr. Amit Verma (Cardiology)</option>
                    <option value="Dr. Neha Singh">Dr. Neha Singh (General Physician)</option>
                    <option value="Dr. Sanya Mehta">Dr. Sanya Mehta (Endocrinology)</option>
                    <option value="Dr. Rajesh Iyer">Dr. Rajesh Iyer (Pulmonology)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => {
                    setShowIpdModal(false);
                    setPatientActiveTab('OPD');
                  }}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold uppercase text-[10px] rounded hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 bg-[#006437] hover:bg-[#00502c] text-white font-extrabold uppercase text-[10px] tracking-wider rounded transition shadow-2xs"
                >
                  Confirm IPD Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE IPD ADT DISCHARGE MODAL ==================== */}
      {activeIpdActionPatient && ipdActionType === 'discharge' && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col font-sans">
            <div className="h-1.5 bg-rose-700 w-full" />
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1">
                  Discharge Patient
                </span>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                  Confirm Discharge Action
                </h3>
              </div>
              <button 
                onClick={() => {
                  setActiveIpdActionPatient(null);
                  setIpdActionType(null);
                }} 
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg flex flex-col gap-1">
                <p className="font-extrabold text-rose-950 text-xs">{activeIpdActionPatient.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">UHID: <span className="font-mono font-semibold">{activeIpdActionPatient.uhid}</span> • Age/Gender: {activeIpdActionPatient.age} Yrs / {activeIpdActionPatient.gender}</p>
                <p className="text-[10.5px] text-rose-800 font-semibold mt-1">Current Ward: {patientWards[activeIpdActionPatient.uhid] || 'General Ward'} B-{patientBedNumbers[activeIpdActionPatient.uhid] || 12}</p>
              </div>

              <div className="space-y-2 text-slate-600">
                <p className="font-medium">Are you sure you want to approve this patient's discharge?</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[11px]">
                  <li>Discharge summary will be compiled and locked automatically.</li>
                  <li>Bed <span className="font-semibold text-slate-700">{patientWards[activeIpdActionPatient.uhid] || 'General Ward'} B-{patientBedNumbers[activeIpdActionPatient.uhid] || 12}</span> will be released.</li>
                  <li>Real-time bed availability counts will update automatically.</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => {
                    setActiveIpdActionPatient(null);
                    setIpdActionType(null);
                  }}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold uppercase text-[10px] rounded hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDischarge}
                  type="button"
                  className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-extrabold uppercase text-[10px] tracking-wider rounded transition shadow-2xs cursor-pointer"
                >
                  Approve Discharge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE IPD ADT TRANSFER MODAL ==================== */}
      {activeIpdActionPatient && ipdActionType === 'transfer' && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col font-sans">
            <div className="h-1.5 bg-indigo-750 w-full" />
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1">
                  Bed Transfer
                </span>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                  Confirm Bed Transfer Action
                </h3>
              </div>
              <button 
                onClick={() => {
                  setActiveIpdActionPatient(null);
                  setIpdActionType(null);
                }} 
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg flex flex-col gap-1">
                <p className="font-extrabold text-indigo-950 text-xs">{activeIpdActionPatient.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">UHID: <span className="font-mono font-semibold">{activeIpdActionPatient.uhid}</span> • Age/Gender: {activeIpdActionPatient.age} Yrs / {activeIpdActionPatient.gender}</p>
                <p className="text-[10.5px] text-indigo-800 font-semibold mt-1">Current Ward: {patientWards[activeIpdActionPatient.uhid] || 'General Ward'} B-{patientBedNumbers[activeIpdActionPatient.uhid] || 12}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] font-extrabold text-slate-500 uppercase block">Select New Bed / Ward Category</label>
                <select 
                  value={selectedTransferWard}
                  onChange={e => setSelectedTransferWard(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                >
                  {beds.map(b => (
                    <option key={b.name} value={b.name} disabled={b.name === (patientWards[activeIpdActionPatient?.uhid] || 'General Ward')}>
                      {b.name} (Occupied: {b.occupied}/{b.total}) {b.name === (patientWards[activeIpdActionPatient?.uhid] || 'General Ward') ? ' [Current]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => {
                    setActiveIpdActionPatient(null);
                    setIpdActionType(null);
                  }}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold uppercase text-[10px] rounded hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleConfirmTransfer(selectedTransferWard)}
                  type="button"
                  className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold uppercase text-[10px] tracking-wider rounded transition shadow-2xs cursor-pointer"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
