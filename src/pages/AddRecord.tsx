import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHealthStore } from '../stores/healthStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Card from '../components/common/Card';
import FileUpload from '../components/common/FileUpload';
import type { Attachment } from '../utils/types';

export default function AddRecord() {
  const navigate = useNavigate();
  const { addRecord } = useHealthStore();

  const [formData, setFormData] = useState({
    recordDate: new Date().toISOString().split('T')[0],
    hospital: '',
    department: '',
    doctorName: '',
    diagnosis: '',
    chiefComplaint: '',
    physicalExam: '',
    labFindings: '',
    treatment: '',
    doctorAdvice: '',
    followUpDate: '',
  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.recordDate) newErrors.recordDate = '请选择就诊日期';
    if (!formData.hospital.trim()) newErrors.hospital = '请输入医院名称';
    if (!formData.department.trim()) newErrors.department = '请输入科室';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = '请输入诊断结果';
    if (!formData.chiefComplaint.trim()) newErrors.chiefComplaint = '请输入主诉';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addRecord({
      ...formData,
      attachments,
    });
    navigate('/records');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">添加就医记录</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="就诊日期"
              name="recordDate"
              type="date"
              value={formData.recordDate}
              onChange={handleChange}
              error={errors.recordDate}
              required
            />
            <Input
              label="医院名称"
              name="hospital"
              placeholder="例如：某某医院"
              value={formData.hospital}
              onChange={handleChange}
              error={errors.hospital}
              required
            />
            <Input
              label="科室"
              name="department"
              placeholder="例如：内科"
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
              required
            />
            <Input
              label="医生姓名"
              name="doctorName"
              placeholder="可选"
              value={formData.doctorName}
              onChange={handleChange}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">诊断信息</h3>
          <div className="space-y-4">
            <Input
              label="诊断结果"
              name="diagnosis"
              placeholder="主要诊断"
              value={formData.diagnosis}
              onChange={handleChange}
              error={errors.diagnosis}
              required
            />
            <Textarea
              label="主诉"
              name="chiefComplaint"
              placeholder="主要症状和不适"
              value={formData.chiefComplaint}
              onChange={handleChange}
              error={errors.chiefComplaint}
              required
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">详细信息</h3>
          <div className="space-y-4">
            <Textarea
              label="体格检查"
              name="physicalExam"
              placeholder="体格检查结果"
              value={formData.physicalExam}
              onChange={handleChange}
            />
            <Textarea
              label="实验室检查"
              name="labFindings"
              placeholder="各项检查结果"
              value={formData.labFindings}
              onChange={handleChange}
            />
            <Textarea
              label="治疗方案"
              name="treatment"
              placeholder="治疗方法和建议"
              value={formData.treatment}
              onChange={handleChange}
            />
            <Textarea
              label="医嘱"
              name="doctorAdvice"
              placeholder="医生建议和注意事项"
              value={formData.doctorAdvice}
              onChange={handleChange}
            />
            <Input
              label="复诊日期"
              name="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={handleChange}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">上传附件</h3>
          <FileUpload
            attachments={attachments}
            onChange={setAttachments}
          />
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            取消
          </Button>
          <Button type="submit">保存记录</Button>
        </div>
      </form>
    </div>
  );
}
