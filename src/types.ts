export interface Visit {
  date: string;
  department: string;
  doctor: string;
}

export interface Patient {
  name: string;
  uhid: string;
  abhaId: string;
  abhaAddress: string;
  age: number;
  gender: string;
  phone: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  recentVisits: Visit[];
}

export interface Appointment {
  id: string;
  time: string;
  doctor: string;
  department: string;
  patientName: string;
  patientUhid: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  date?: string;
}

export interface BedCategory {
  name: string;
  occupied: number;
  total: number;
}

export interface AlertNotification {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  count: number;
  description: string;
}

export interface Incident {
  id: string;
  type: 'Medication Error' | 'Patient Fall' | 'Near Miss' | 'Others';
  severity: 'Mild' | 'Moderate' | 'Severe';
  date: string;
  reporter: string;
  patientName: string;
  description: string;
  capaPlan?: string;
  status: 'Open' | 'Under Review' | 'Resolved';
}

export interface ComplianceMilestone {
  id: string;
  milestone: 'M1' | 'M2' | 'M3' | 'M4';
  name: string;
  description: string;
  checked: boolean;
}

export interface HmsUser {
  username: string;
  fullName: string;
  role: 'admin' | 'doctor' | 'nurse' | 'technician' | 'patient';
  title: string;
  avatarColor: string;
  allowedPanels: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
