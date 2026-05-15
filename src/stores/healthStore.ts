import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { MedicalRecord, Examination, Prescription } from '../utils/types';

interface HealthStore {
  records: MedicalRecord[];
  examinations: Examination[];
  prescriptions: Prescription[];
  addRecord: (record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecord: (id: string, record: Partial<MedicalRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecord: (id: string) => MedicalRecord | undefined;
  addExamination: (exam: Omit<Examination, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExamination: (id: string, exam: Partial<Examination>) => void;
  deleteExamination: (id: string) => void;
  getExamination: (id: string) => Examination | undefined;
  addPrescription: (prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrescription: (id: string, prescription: Partial<Prescription>) => void;
  deletePrescription: (id: string) => void;
  getPrescription: (id: string) => Prescription | undefined;
  exportData: () => string;
  importData: (data: string) => boolean;
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      records: [],
      examinations: [],
      prescriptions: [],

      addRecord: (record) => {
        const now = new Date().toISOString();
        set((state) => ({
          records: [
            {
              ...record,
              id: uuidv4(),
              createdAt: now,
              updatedAt: now,
            },
            ...state.records,
          ],
        }));
      },

      updateRecord: (id, record) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...record, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }));
      },

      getRecord: (id) => {
        return get().records.find((r) => r.id === id);
      },

      addExamination: (exam) => {
        const now = new Date().toISOString();
        set((state) => ({
          examinations: [
            {
              ...exam,
              id: uuidv4(),
              createdAt: now,
              updatedAt: now,
            },
            ...state.examinations,
          ],
        }));
      },

      updateExamination: (id, exam) => {
        set((state) => ({
          examinations: state.examinations.map((e) =>
            e.id === id ? { ...e, ...exam, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },

      deleteExamination: (id) => {
        set((state) => ({
          examinations: state.examinations.filter((e) => e.id !== id),
        }));
      },

      getExamination: (id) => {
        return get().examinations.find((e) => e.id === id);
      },

      addPrescription: (prescription) => {
        const now = new Date().toISOString();
        set((state) => ({
          prescriptions: [
            {
              ...prescription,
              id: uuidv4(),
              createdAt: now,
              updatedAt: now,
            },
            ...state.prescriptions,
          ],
        }));
      },

      updatePrescription: (id, prescription) => {
        set((state) => ({
          prescriptions: state.prescriptions.map((p) =>
            p.id === id ? { ...p, ...prescription, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deletePrescription: (id) => {
        set((state) => ({
          prescriptions: state.prescriptions.filter((p) => p.id !== id),
        }));
      },

      getPrescription: (id) => {
        return get().prescriptions.find((p) => p.id === id);
      },

      exportData: () => {
        const { records, examinations, prescriptions } = get();
        return JSON.stringify({ records, examinations, prescriptions }, null, 2);
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.records && parsed.examinations && parsed.prescriptions) {
            set({
              records: parsed.records,
              examinations: parsed.examinations,
              prescriptions: parsed.prescriptions,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'health-records-storage',
    }
  )
);
