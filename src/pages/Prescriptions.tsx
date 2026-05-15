import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useHealthStore } from '../stores/healthStore';
import PrescriptionCard from '../components/prescriptions/PrescriptionCard';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';

interface MedicationInput {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  notes: string;
}

export default function Prescriptions() {
  const { prescriptions, addPrescription } = useHealthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [medications, setMedications] = useState<MedicationInput[]>([
    { name: '', dosage: '', frequency: '', duration: '', route: '口服', notes: '' },
  ]);

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medications.some((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '', frequency: '', duration: '', route: '口服', notes: '' },
    ]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index: number, field: keyof MedicationInput, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    addPrescription({
      prescriptionDate: formData.get('prescriptionDate') as string,
      hospital: formData.get('hospital') as string,
      doctorName: formData.get('doctorName') as string,
      diagnosis: formData.get('diagnosis') as string,
      medications: medications.filter((m) => m.name.trim()),
      notes: formData.get('notes') as string,
      isActive: true,
      reminders: [],
    });
    setShowAddModal(false);
    setMedications([{ name: '', dosage: '', frequency: '', duration: '', route: '口服', notes: '' }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索处方..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加处方
        </Button>
      </div>

      {filteredPrescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrescriptions.map((prescription, index) => (
            <div
              key={prescription.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PrescriptionCard prescription={prescription} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchTerm ? '未找到匹配的处方' : '暂无处方记录'}
          description={
            searchTerm ? '尝试调整搜索条件' : '添加您的处方信息，方便用药管理'
          }
          actionLabel={!searchTerm ? '添加处方' : undefined}
          onAction={!searchTerm ? () => setShowAddModal(true) : undefined}
        />
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="添加处方"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="处方日期"
              name="prescriptionDate"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              required
            />
            <Input
              label="医院"
              name="hospital"
              placeholder="开方医院"
            />
            <Input
              label="医生"
              name="doctorName"
              placeholder="开方医生"
            />
          </div>
          <Input
            label="诊断"
            name="diagnosis"
            placeholder="临床诊断"
          />

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">药品清单</h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddMedication}>
                <Plus className="w-4 h-4 mr-1" />
                添加药品
              </Button>
            </div>

            {medications.map((med, index) => (
              <div key={index} className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                <Input
                  label="药品名称"
                  placeholder="药品名"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                />
                <Input
                  label="剂量"
                  placeholder="如：500mg"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                />
                <Input
                  label="用法"
                  placeholder="如：每日3次"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                />
                <Input
                  label="疗程"
                  placeholder="如：7天"
                  value={med.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                />
                {medications.length > 1 && (
                  <div className="col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      删除
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Textarea
            label="备注"
            name="notes"
            placeholder="其他注意事项"
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
