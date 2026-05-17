import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { MedicalRecord, Examination, Prescription } from '../utils/types';

const DATA_VERSION = 1;

interface ExportData {
  version: number;
  exportedAt: string;
  records: MedicalRecord[];
  examinations: Examination[];
  prescriptions: Prescription[];
}

interface ValidationError {
  field: string;
  message: string;
}

const validateRecord = (record: unknown, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const r = record as Record<string, unknown>;
  if (!r.id || typeof r.id !== 'string') errors.push({ field: `records[${index}].id`, message: '缺少有效的记录ID' });
  if (!r.recordDate || typeof r.recordDate !== 'string') errors.push({ field: `records[${index}].recordDate`, message: '缺少就诊日期' });
  if (!r.hospital || typeof r.hospital !== 'string') errors.push({ field: `records[${index}].hospital`, message: '缺少医院信息' });
  if (!r.diagnosis || typeof r.diagnosis !== 'string') errors.push({ field: `records[${index}].diagnosis`, message: '缺少诊断信息' });
  if (!r.chiefComplaint || typeof r.chiefComplaint !== 'string') errors.push({ field: `records[${index}].chiefComplaint`, message: '缺少主诉' });
  return errors;
};

const validateExamination = (exam: unknown, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const e = exam as Record<string, unknown>;
  if (!e.id || typeof e.id !== 'string') errors.push({ field: `examinations[${index}].id`, message: '缺少有效的检查ID' });
  if (!e.examDate || typeof e.examDate !== 'string') errors.push({ field: `examinations[${index}].examDate`, message: '缺少检查日期' });
  if (!e.title || typeof e.title !== 'string') errors.push({ field: `examinations[${index}].title`, message: '缺少检查标题' });
  if (!e.findings || typeof e.findings !== 'string') errors.push({ field: `examinations[${index}].findings`, message: '缺少检查结果' });
  return errors;
};

const validatePrescription = (prescription: unknown, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const p = prescription as Record<string, unknown>;
  if (!p.id || typeof p.id !== 'string') errors.push({ field: `prescriptions[${index}].id`, message: '缺少有效的处方ID' });
  if (!p.prescriptionDate || typeof p.prescriptionDate !== 'string') errors.push({ field: `prescriptions[${index}].prescriptionDate`, message: '缺少处方日期' });
  if (!Array.isArray(p.medications)) errors.push({ field: `prescriptions[${index}].medications`, message: '缺少药品清单' });
  return errors;
};

interface HealthStore {
  records: MedicalRecord[];
  examinations: Examination[];
  prescriptions: Prescription[];
  reset: () => void;
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
  updatePrescriptionStatus: (id: string, isActive: boolean) => void;
  exportData: () => string;
  importData: (data: string) => { success: boolean; message: string; errors?: ValidationError[] };
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      records: [],
      examinations: [],
      prescriptions: [],

      reset: () => {
        set({
          records: [],
          examinations: [],
          prescriptions: [],
        });
      },

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

      updatePrescriptionStatus: (id, isActive) => {
        set((state) => ({
          prescriptions: state.prescriptions.map((p) =>
            p.id === id ? { ...p, isActive, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      exportData: () => {
        const { records, examinations, prescriptions } = get();
        const exportData: ExportData = {
          version: DATA_VERSION,
          exportedAt: new Date().toISOString(),
          records,
          examinations,
          prescriptions,
        };
        return JSON.stringify(exportData, null, 2);
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          
          if (!parsed.version || !parsed.records || !parsed.examinations || !parsed.prescriptions) {
            return { success: false, message: '数据格式不正确，缺少必要的字段' };
          }
          
          const allErrors: ValidationError[] = [];
          
          parsed.records.forEach((record: unknown, index: number) => {
            allErrors.push(...validateRecord(record, index));
          });
          
          parsed.examinations.forEach((exam: unknown, index: number) => {
            allErrors.push(...validateExamination(exam, index));
          });
          
          parsed.prescriptions.forEach((prescription: unknown, index: number) => {
            allErrors.push(...validatePrescription(prescription, index));
          });
          
          if (allErrors.length > 0) {
            return { 
              success: false, 
              message: `发现 ${allErrors.length} 个验证错误，数据导入失败`, 
              errors: allErrors.slice(0, 10) 
            };
          }
          
          set({
            records: parsed.records,
            examinations: parsed.examinations,
            prescriptions: parsed.prescriptions,
          });
          return { success: true, message: `成功导入 ${parsed.records.length} 条记录、${parsed.examinations.length} 条检查、${parsed.prescriptions.length} 条处方` };
        } catch {
          return { success: false, message: '无法解析数据，请检查文件格式是否正确' };
        }
      },
    }),
    {
      name: 'health-records-storage',
    }
  )
);
