export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document';
  url: string;
  size: number;
  uploadedAt: string;
}

export interface MedicalRecord {
  id: string;
  recordDate: string;
  hospital: string;
  department: string;
  doctorName?: string;
  diagnosis: string;
  chiefComplaint: string;
  physicalExam?: string;
  labFindings?: string;
  treatment?: string;
  doctorAdvice?: string;
  followUpDate?: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface NormalRange {
  item: string;
  value: string;
  unit: string;
  normalRange: string;
}

export type ExamType = 'blood' | 'urine' | 'imaging' | 'ultrasound' | 'ecg' | 'other';

export interface Examination {
  id: string;
  examDate: string;
  examType: ExamType;
  title: string;
  findings: string;
  conclusion?: string;
  interpretation?: string;
  normalRanges?: NormalRange[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  notes?: string;
}

export interface Reminder {
  id: string;
  medicationIndex: number;
  time: string;
  enabled: boolean;
}

export interface Prescription {
  id: string;
  prescriptionDate: string;
  hospital?: string;
  doctorName?: string;
  diagnosis?: string;
  medications: Medication[];
  notes?: string;
  isActive: boolean;
  reminders: Reminder[];
  createdAt: string;
  updatedAt: string;
}
