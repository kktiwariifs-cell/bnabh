import { Patient, Appointment, BedCategory, AlertNotification, Incident, ComplianceMilestone } from "../types";

export const INITIAL_PATIENTS: Patient[] = [
  {
    name: "Rahul Kumar",
    uhid: "UH00012345",
    abhaId: "91-3456-7890-1234",
    abhaAddress: "rahulkumar@abdm",
    age: 38,
    gender: "Male",
    phone: "9876543210",
    allergies: ["No Known Allergies"],
    chronicConditions: ["Hypertension"],
    currentMedications: ["Amlodipine 5mg QD"],
    recentVisits: [
      { date: "12-May-2024", department: "General Medicine", doctor: "Dr. Amit Verma" },
      { date: "28-Apr-2024", department: "Cardiology", doctor: "Dr. Neha Singh" },
      { date: "10-Apr-2024", department: "Lab", doctor: "Dr. Sanya Mehta" }
    ]
  },
  {
    name: "Priya Patel",
    uhid: "UH00012346",
    abhaId: "42-8923-4567-8901",
    abhaAddress: "priya.patel@abdm",
    age: 29,
    gender: "Female",
    phone: "9988776655",
    allergies: ["Penicillin"],
    chronicConditions: ["Bronchial Asthma"],
    currentMedications: ["Albuterol Inhaler (PRN)", "Fluticasone Spray"],
    recentVisits: [
      { date: "22-May-2024", department: "Pulmonology", doctor: "Dr. Rajesh Iyer" },
      { date: "15-Apr-2024", department: "General Medicine", doctor: "Dr. Amit Verma" }
    ]
  },
  {
    name: "Karan Singh",
    uhid: "UH00012347",
    abhaId: "15-7634-1298-5432",
    abhaAddress: "karan.singh@abdm",
    age: 55,
    gender: "Male",
    phone: "9123456789",
    allergies: ["Sulfonamides", "Peanuts"],
    chronicConditions: ["Type 2 Diabetes", "Chronic Kidney Disease Stage 1"],
    currentMedications: ["Metformin 500mg BID", "Atorvastatin 10mg HS"],
    recentVisits: [
      { date: "18-May-2024", department: "Endocrinology", doctor: "Dr. Sanya Mehta" },
      { date: "02-May-2024", department: "Nephrology", doctor: "Dr. Rajesh Iyer" }
    ]
  },
  {
    name: "Sanya Sharma",
    uhid: "UH00012348",
    abhaId: "28-1122-3344-5566",
    abhaAddress: "sanyasharma@abdm",
    age: 42,
    gender: "Female",
    phone: "9812345670",
    allergies: ["Dust Mites", "No Known Drug Allergies"],
    chronicConditions: ["Hypothyroidism"],
    currentMedications: ["Levothyroxine 75mcg OD"],
    recentVisits: [
      { date: "14-May-2024", department: "Endocrinology", doctor: "Dr. Sanya Mehta" }
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "APT001",
    time: "10:00 AM",
    doctor: "Dr. Amit Verma",
    department: "Cardiology",
    patientName: "Rahul Kumar",
    patientUhid: "UH00012345",
    status: "Scheduled"
  },
  {
    id: "APT002",
    time: "11:30 AM",
    doctor: "Dr. Neha Singh",
    department: "General Physician",
    patientName: "Priya Patel",
    patientUhid: "UH00012346",
    status: "Scheduled"
  },
  {
    id: "APT003",
    time: "02:00 PM",
    doctor: "Dr. Sanya Mehta",
    department: "Endocrinology",
    patientName: "Karan Singh",
    patientUhid: "UH00012347",
    status: "Scheduled"
  },
  {
    id: "APT004",
    time: "04:30 PM",
    doctor: "Dr. Rajesh Iyer",
    department: "Pulmonology",
    patientName: "Sanya Sharma",
    patientUhid: "UH00012348",
    status: "Scheduled"
  }
];

export const INITIAL_BEDS: BedCategory[] = [
  { name: "General Ward", occupied: 35, total: 50 },
  { name: "Semi Private", occupied: 20, total: 30 },
  { name: "Private Room", occupied: 18, total: 20 },
  { name: "ICU", occupied: 15, total: 20 }
];

export const INITIAL_ALERTS: AlertNotification[] = [
  { id: "ALT001", type: "danger", title: "High Priority Lab Results Pending", count: 5, description: "Critical pathology updates awaiting doctor review." },
  { id: "ALT002", type: "warning", title: "Drug Expiry Alert", count: 12, description: "Emergency department medicines reaching expiration within 15 days." },
  { id: "ALT003", type: "warning", title: "Equipment Calibration Due", count: 8, description: "Defibrillators & OT ventilators overdue for standard calibration." },
  { id: "ALT004", type: "info", title: "Staff Training Expiry", count: 15, description: "Nursing staff compliance certification renewals due this month." },
  { id: "ALT005", type: "danger", title: "Patient Consent Pending", count: 3, description: "Surgical consent missing for scheduled morning OT procedures." }
];

export const INITIAL_MILESTONES: ComplianceMilestone[] = [
  // M1
  { id: "M1_1", milestone: "M1", name: "ABHA Registration", description: "Seamless ABHA card generation with Aadhaar/Mobile OTP authentication.", checked: true },
  { id: "M1_2", milestone: "M1", name: "UHID–ABHA Mapping", description: "Mapping legacy internal hospital UHID to unified digital ABHA Health IDs.", checked: true },
  { id: "M1_3", milestone: "M1", name: "Demographic Standards", description: "Enforcing NDHM standard demographics capture for all registrations.", checked: true },
  { id: "M1_4", milestone: "M1", name: "Health Facility Registry (HFR)", description: "Hospital registration on national HFR with facility IDs synchronized.", checked: true },
  { id: "M1_5", milestone: "M1", name: "Healthcare Professional Registry (HPR)", description: "Verifying and linking all working doctors & nurses on central HPR.", checked: true },
  { id: "M1_6", milestone: "M1", name: "Consent Management", description: "Basic compliance setup to capture electronic user privacy consent.", checked: true },
  
  // M2
  { id: "M2_1", milestone: "M2", name: "ABHA Verification (Aadhaar/VID)", description: "Direct real-time verification using official Aadhaar/VID endpoints.", checked: true },
  { id: "M2_2", milestone: "M2", name: "Link / Update / Merge ABHA", description: "Capabilities to link multiple records and sync demographic updates.", checked: true },
  { id: "M2_3", milestone: "M2", name: "ABHA Based Patient Identification", description: "Searching and identifying returning patients solely through barcode scan.", checked: true },
  { id: "M2_4", milestone: "M2", name: "Consent Capture (Digital)", description: "Full digital consent artifact signed and securely logged in DB.", checked: true },
  { id: "M2_5", milestone: "M2", name: "Share Health Records (Provider to PHR)", description: "Enabling clinical software to share generated health reports to PHRs.", checked: true },

  // M3
  { id: "M3_1", milestone: "M3", name: "Access Patient Health Records via ABHA", description: "Retrieving patient-permitted history from external providers on gateway.", checked: true },
  { id: "M3_2", milestone: "M3", name: "View Shared Documents (with Consent)", description: "Doctor view pane integrating certified medical records natively.", checked: true },
  { id: "M3_3", milestone: "M3", name: "Download / View / Print", description: "Secure downloading and standard format printing of external health logs.", checked: true },
  { id: "M3_4", milestone: "M3", name: "Clinical Data Exchange (FHIR APIs)", description: "Exchanging clinical records structured strictly in HL7 FHIR v4 resource bundles.", checked: true },
  { id: "M3_5", milestone: "M3", name: "e-Prescription & e-Reports Sharing", description: "Auto-signing and publishing prescription drafts straight to personal PHR lockers.", checked: true },

  // M4
  { id: "M4_1", milestone: "M4", name: "Health Information Exchange (HIE)", description: "Bidirectional real-time exchange gateway across major states and networks.", checked: true },
  { id: "M4_2", milestone: "M4", name: "Cross Facility Patient Search", description: "Securely locating emergency clinical files at external verified nodes.", checked: true },
  { id: "M4_3", milestone: "M4", name: "Continuity of Care Documents (CCD)", description: "Compiling discharge papers into global CCD schema.", checked: true },
  { id: "M4_4", milestone: "M4", name: "Provider Directory Lookup", description: "Accessing directory of clinical resources, specialties, and beds on network.", checked: true },
  { id: "M4_5", milestone: "M4", name: "Advanced Consent (Granular)", description: "Allowing users to selectively restrict access to specific dates or labs.", checked: true },
  { id: "M4_6", milestone: "M4", name: "Interoperability with ABDM Ecosystem", description: "Direct certified testing and gateway integration endorsement.", checked: true }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC001",
    type: "Medication Error",
    severity: "Moderate",
    date: "14-May-2024",
    reporter: "Nurse Sunita Sharma",
    patientName: "Rahul Kumar",
    description: "Amlodipine dose delayed by 3 hours due to pharmacy handover lag.",
    status: "Resolved",
    capaPlan: "Immediate correction: Drug administered. CAPA: Implemented barcodes on nursing sheets and digital alarms for medications."
  },
  {
    id: "INC002",
    type: "Patient Fall",
    severity: "Severe",
    date: "20-May-2024",
    reporter: "Ward In-charge Manoj",
    patientName: "Karan Singh",
    description: "Patient slipped while walking to bathroom in the ICU. Floor was slightly wet.",
    status: "Under Review",
    capaPlan: "Immediate correction: X-Ray done, no fracture. Under review: Wet floor signs placement procedure being updated."
  },
  {
    id: "INC003",
    type: "Near Miss",
    severity: "Mild",
    date: "25-May-2024",
    reporter: "Dr. Amit Verma",
    patientName: "Priya Patel",
    description: "Doctor prescribed Penicillin variant, but warning triggered on EHR highlighting her Penicillin allergy before administration.",
    status: "Open"
  },
  {
    id: "INC004",
    type: "Others",
    severity: "Mild",
    date: "28-May-2024",
    reporter: "Technician Ritu",
    patientName: "Sanya Sharma",
    description: "Ventilator battery backup alarm triggered. Backup power functional, but calibration check was overdue.",
    status: "Open"
  }
];

export const CORE_MODULES = [
  { name: "Patient Management (UHID/ABHA)", icon: "UserCheck", desc: "Patient demography registration, ABHA generation, KYC verification and legacy database linking." },
  { name: "OPD Management", icon: "Users", desc: "Outpatient clinical queues, doctor timetables, vitals capture, and digital prescriptions." },
  { name: "IPD Management", icon: "BedDouble", desc: "Inpatient admission, ward allocation, nursing care plan, clinical vitals sheet, and discharge flow." },
  { name: "Emergency & Triage", icon: "Activity", desc: "Red/Yellow/Green triage system, emergency logging, quick clinical vitals capture, and trauma response team alerts." },
  { name: "Nursing Management", icon: "ShieldCheck", desc: "Nursing duty rosters, drug administration cards, clinical logs, and patient care handovers." },
  { name: "Laboratory (LIS)", icon: "FlaskConical", desc: "Lab tests booking, analyzer integration, sample tracking, reference ranges validation, and e-report signing." },
  { name: "Radiology (RIS/PACS)", icon: "Image", desc: "Radiological scans logging, DICOM PACS integration, doctor remarks logging, and report sharing." },
  { name: "Pharmacy", icon: "Pills", desc: "Inventory control, batch tracking with alerts, multi-counter billing, and e-prescriptions dispensing." },
  { name: "OT Management", icon: "Scissors", desc: "Operation theater booking, surgical checklist verification, anesthesia logs, and post-op care reports." },
  { name: "ICU Management", icon: "HeartPulse", desc: "Intensive care multi-parameter monitors integration, continuous hourly vitals, and critical alarm routing." },
  { name: "Billing & Insurance", icon: "CreditCard", desc: "Corporate TPA billing, cash counters, itemized ward tariffs, and electronic claims submission." },
  { name: "Blood Bank", icon: "Droplet", desc: "Blood unit registers, donor screening, cross-matching testing, temperature logs, and expiry warnings." },
  { name: "Human Resource", icon: "Contact2", desc: "Doctor & staff directory, roster schedules, digital credentialing, and training tracking." },
  { name: "Inventory & Stores", icon: "Package", desc: "Consumables stock tracking, purchase orders workflow, vendor management, and reorder levels alerts." },
  { name: "Diet & Kitchen", icon: "ChefHat", desc: "Patient diet chart mapping, nutritionist guidelines, kitchen preparation logs, and meal routing." },
  { name: "Ambulance Management", icon: "Truck", desc: "Emergency fleet tracking, trip logs, oxygen cylinder inventories, and paramedical crew mapping." },
  { name: "Discharge & Follow-up", icon: "LogOut", desc: "Discharge checklists, automated follow-up SMS triggers, and outpatient review scheduling." },
  { name: "HMIS / Reports", icon: "BarChart3", desc: "Daily dashboard, clinical auditing, NABH KPI spreadsheets, and government statistical reports." }
];

export const NABH_COMPLIANCE_MODULES = [
  { name: "Quality Management & KPI Dashboard", icon: "Gauge", desc: "Continuous monitoring of clinical and administrative key performance indicators like occupancy, average stay, and infection rates." },
  { name: "Incident Reporting & CAPA", icon: "AlertTriangle", desc: "Systematic logging of sentinel events, patient falls, and medication errors with automated Corrective & Preventive Action sheets." },
  { name: "Infection Control & HAI Surveillance", icon: "ShieldAlert", desc: "Hospital-Acquired Infection auditing, surgical site checkups, syringe inventory tracking, and quarantine triggers." },
  { name: "Document Control (SOP/Policy)", icon: "FileText", desc: "Central repository of all standard operating procedures (SOPs), policy documents, and training checklists with revision locks." },
  { name: "Audit Management (Internal & External)", icon: "ClipboardCheck", desc: "Internal medical audits, hygiene inspections, clinical record completeness checking, and External NABH review checklists." },
  { name: "Committee Management", icon: "Users2", desc: "Roster of Hospital Infection Control, Pharmacotherapeutic, and Safety committees, scheduling minutes and action items." },
  { name: "Patient Safety Indicators", icon: "HeartPulse", desc: "Mandatory indicators including correct site surgery checks, medication matching, and patient identification safety." },
  { name: "Staff Credentialing & Privileging", icon: "Award", desc: "Verifying and updating professional licenses, clinical skill certificates, and doctor-wise specific clinical privileging approvals." },
  { name: "Equipment Management", icon: "Wrench", desc: "Preventive maintenance schedules, device calibrations logs, and breakdowns logs for critical equipment (ventilators, MRI, etc.)." },
  { name: "Training Management & Competency", icon: "GraduationCap", desc: "Standardized staff training logs, emergency resuscitation skills tracking, and post-test scores audits." },
  { name: "Consent Management", icon: "UserCheck", desc: "Bilingual, informed, surgical and anesthesia consents with date/time stamping and witness logging." },
  { name: "Risk Management", icon: "Activity", desc: "Hospital hazards checklists, fire safety audit alerts, supply chain risks lists, and business continuity templates." }
];

export const INTEGRATIONS = [
  { name: "LIS / RIS / PACS", icon: "Database", desc: "Bidirectional interface with lab analyzers and medical scanning machines via standard protocols." },
  { name: "HL7 / FHIR APIs", icon: "Network", desc: "Native exchange of clinic summaries and medical records using HL7 FHIR structures." },
  { name: "ABDM (ABHA, HFR, HPR)", icon: "Heart", desc: "Unified national gateway APIs for Patient ABHA, Facility Registration, and Doctors registry." },
  { name: "Payment Gateway", icon: "DollarSign", desc: "UPI, Cards, and Netbanking integrations for contactless clinical billing." },
  { name: "Insurance TPAs", icon: "ShieldCheck", desc: "Direct electronic claim status queries and pre-authorization submissions." },
  { name: "SMS / WhatsApp / Email", icon: "MessageSquare", desc: "Automated clinic appointment confirmations, digital receipts, and follow-up links." },
  { name: "Device Integration", icon: "Cpu", desc: "Connecting bedside patient vitals monitors and ventilators to digital EHR logs." },
  { name: "Govt. Portals", icon: "Globe", desc: "Direct reports uploading for infectious diseases and vital statistics portals." }
];

export const KEY_FEATURES = [
  { name: "Role Based Access Control", desc: "Granular access limits keeping medical data secure according to doctor, nurse, or clerk roles." },
  { name: "Audit Trail & e-Signature", desc: "Permanent, immutable digital logs for every click, clinical edit, or e-prescription signed." },
  { name: "Barcode / QR Code Support", desc: "Fast patient identification wristbands, medicine tracking, and lab sample tube matching." },
  { name: "Real-time Dashboards", desc: "Live-updating views tracking IPD bed availability, emergency queues, and ICU alarms." },
  { name: "Mobile Apps (Android / iOS)", desc: "Lightweight portals allowing on-the-go patient charts reviewing and emergency approvals." },
  { name: "Offline Data Capture (Selective)", desc: "Enables field medical camps or disaster teams to log records and auto-sync later." },
  { name: "Multi-Location / Multi-Hospital", desc: "Unified dashboard connecting satellite clinics and branch hospitals seamlessly." },
  { name: "Cloud / On-Premise Deployment", desc: "Hybrid options accommodating on-site PACS storage with scalable cloud EHR portals." },
  { name: "Data Backup & Disaster Recovery", desc: "Encrypted, continuous database backups keeping records secure during server failures." },
  { name: "End-to-End Data Encryption", desc: "All data encrypted at-rest and in-transit according to AES-256 and HTTPS standards." }
];

export const TECH_STACK = {
  Frontend: "React / Angular",
  Backend: ".NET Core / Java Spring Boot",
  Database: "PostgreSQL / MS SQL",
  Integration: "FHIR, RESTful APIs",
  Deployment: "Cloud / On-Premise / Hybrid",
  Security: "SSL, Encryption, RBAC",
  Mobility: "Android / iOS / PWA"
};
