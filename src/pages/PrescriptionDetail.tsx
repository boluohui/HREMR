import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, User, Pill, Bell, Clock, X, AlertCircle } from 'lucide-react';
import { useHealthStore } from '../stores/healthStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/formatters';
import type { Reminder } from '../utils/types';

const commonTimes = ['08:00', '12:00', '18:00', '22:00'];

export default function PrescriptionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPrescription, deletePrescription, updatePrescription, updatePrescriptionStatus } = useHealthStore();
  const prescription = id ? getPrescription(id) : undefined;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMedIndex, setSelectedMedIndex] = useState<number>(0);
  const [newReminder, setNewReminder] = useState({ time: '08:00', enabled: true });

  if (!prescription) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Link to="/prescriptions" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">处方未找到</h1>
        </div>
        <EmptyState
          title="处方记录不存在"
          description="该处方记录可能已被删除"
          actionLabel="返回处方列表"
          onAction={() => navigate('/prescriptions')}
        />
      </div>
    );
  }

  const handleDelete = () => {
    deletePrescription(prescription.id);
    navigate('/prescriptions');
  };

  const handleToggleStatus = () => {
    updatePrescriptionStatus(prescription.id, !prescription.isActive);
  };

  const handleAddReminder = (medIndex: number) => {
    setSelectedMedIndex(medIndex);
    setNewReminder({ time: commonTimes[0], enabled: true });
    setShowReminderModal(true);
  };

  const handleSaveReminder = () => {
    const newReminderItem: Reminder = {
      id: `reminder-${Date.now()}`,
      medicationIndex: selectedMedIndex,
      time: newReminder.time,
      enabled: newReminder.enabled,
    };
    
    const updatedReminders = [...prescription.reminders, newReminderItem];
    updatePrescription(prescription.id, { reminders: updatedReminders });
    setShowReminderModal(false);
  };

  const handleToggleReminder = (reminderId: string) => {
    const updatedReminders = prescription.reminders.map(r =>
      r.id === reminderId ? { ...r, enabled: !r.enabled } : r
    );
    updatePrescription(prescription.id, { reminders: updatedReminders });
  };

  const handleDeleteReminder = (reminderId: string) => {
    const updatedReminders = prescription.reminders.filter(r => r.id !== reminderId);
    updatePrescription(prescription.id, { reminders: updatedReminders });
  };

  const getMedicationReminders = (medIndex: number) => {
    return prescription.reminders.filter(r => r.medicationIndex === medIndex);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link to="/prescriptions" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {prescription.diagnosis || '处方详情'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={prescription.isActive ? "outline" : "primary"} 
            onClick={handleToggleStatus}
          >
            {prescription.isActive ? '标记为已完成' : '重新启用'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/prescriptions/${id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            删除
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <Badge variant={prescription.isActive ? 'success' : 'gray'} className="mb-2">
              {prescription.isActive ? '进行中' : '已完成'}
            </Badge>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {prescription.diagnosis || '处方'}
            </h2>
          </div>
          <Badge variant="secondary">{formatDate(prescription.prescriptionDate)}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">处方日期</p>
              <p className="font-medium text-gray-900">{formatDate(prescription.prescriptionDate)}</p>
            </div>
          </div>

          {prescription.hospital && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">开方医院</p>
                <p className="font-medium text-gray-900">{prescription.hospital}</p>
              </div>
            </div>
          )}

          {prescription.doctorName && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">开方医生</p>
                <p className="font-medium text-gray-900">{prescription.doctorName}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">药品清单</h3>
          <Badge variant="primary">{prescription.medications.length} 种药品</Badge>
        </div>

        <div className="space-y-4">
          {prescription.medications.map((med, index) => {
            const medReminders = getMedicationReminders(index);
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                      <Pill className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{med.name}</h4>
                      <p className="text-sm text-gray-500">{med.dosage}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleAddReminder(index)}
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    添加提醒
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">用法：</span>
                    <span className="text-gray-900">{med.frequency || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">疗程：</span>
                    <span className="text-gray-900">{med.duration || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">途径：</span>
                    <span className="text-gray-900">{med.route}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">频次：</span>
                    <span className="text-gray-900">{med.frequency || '-'}</span>
                  </div>
                </div>

                {med.notes && (
                  <div className="mt-3 text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                    <span className="font-medium">备注：</span>{med.notes}
                  </div>
                )}

                {medReminders.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-4 h-4 text-warning-500" />
                      <span className="text-sm font-medium text-gray-700">用药提醒</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {medReminders.map(reminder => (
                        <div 
                          key={reminder.id}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                            reminder.enabled 
                              ? 'bg-warning-100 text-warning-700' 
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{reminder.time}</span>
                          <button
                            onClick={() => handleToggleReminder(reminder.id)}
                            className="hover:opacity-70"
                            title={reminder.enabled ? '点击禁用' : '点击启用'}
                          >
                            {reminder.enabled ? '✓' : '✗'}
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className="hover:text-red-600 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {prescription.notes && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">备注</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{prescription.notes}</p>
        </Card>
      )}

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">用药提示</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 请严格按照医嘱用药，不要自行增减剂量</li>
          <li>• 如有不适，请及时就医</li>
          <li>• 妥善保存药品说明书，了解可能的不良反应</li>
          <li>• 定期复诊，根据医嘱调整用药方案</li>
        </ul>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="确认删除"
        size="sm"
      >
        <p className="text-gray-600 mb-6">确定要删除这条处方记录吗？此操作无法撤销。</p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            删除
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        title={`为 "${prescription.medications[selectedMedIndex]?.name}" 添加提醒`}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <Input
              label="提醒时间"
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
            />
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>提示：</strong>浏览器提醒功能需要在应用保持打开状态时才能正常工作。
              如需更可靠的提醒，建议使用手机闹钟或专门的服药提醒应用。
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => setShowReminderModal(false)}>
            取消
          </Button>
          <Button onClick={handleSaveReminder}>
            添加提醒
          </Button>
        </div>
      </Modal>
    </div>
  );
}
