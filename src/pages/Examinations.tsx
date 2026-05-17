import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useHealthStore } from '../stores/healthStore';
import ExamCard from '../components/examinations/ExamCard';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import FileUpload from '../components/common/FileUpload';
import type { ExamType, Attachment } from '../utils/types';

const examTypes: { value: ExamType; label: string }[] = [
  { value: 'blood', label: '血液检查' },
  { value: 'urine', label: '尿液检查' },
  { value: 'imaging', label: '影像检查' },
  { value: 'ultrasound', label: '超声检查' },
  { value: 'ecg', label: '心电图' },
  { value: 'other', label: '其他检查' },
];

export default function Examinations() {
  const { examinations, addExamination } = useHealthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    examDate: new Date().toISOString().split('T')[0],
    examType: 'blood' as ExamType,
    title: '',
    findings: '',
    conclusion: '',
    interpretation: '',
  });

  const filteredExaminations = examinations.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.findings.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.examDate) newErrors.examDate = '请选择检查日期';
    if (!formData.title.trim()) newErrors.title = '请输入检查标题';
    if (!formData.findings.trim()) newErrors.findings = '请输入检查结果';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addExamination({
      ...formData,
      attachments,
    });
    setShowAddModal(false);
    setFormData({
      examDate: new Date().toISOString().split('T')[0],
      examType: 'blood',
      title: '',
      findings: '',
      conclusion: '',
      interpretation: '',
    });
    setAttachments([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索检验检查..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加检查
        </Button>
      </div>

      {filteredExaminations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExaminations.map((exam, index) => (
            <div
              key={exam.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ExamCard exam={exam} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchTerm ? '未找到匹配的检查' : '暂无检验检查记录'}
          description={
            searchTerm
              ? '尝试调整搜索条件'
              : '添加您的检验检查结果，方便查看和管理'
          }
          actionLabel={!searchTerm ? '添加检验检查' : undefined}
          onAction={!searchTerm ? () => setShowAddModal(true) : undefined}
        />
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setErrors({});
          setAttachments([]);
        }}
        title="添加检验检查"
        size="lg"
      >
        <form onSubmit={handleAddExam} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="检查日期"
              type="date"
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
              error={errors.examDate}
              required
            />
            <Select
              label="检查类型"
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value as ExamType })}
              options={examTypes}
              required
            />
          </div>
          <Input
            label="检查标题"
            placeholder="例如：血常规、肝功能检查"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />
          <Textarea
            label="检查结果"
            placeholder="详细的检查结果"
            value={formData.findings}
            onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
            error={errors.findings}
            required
          />
          <Textarea
            label="结论"
            placeholder="检查结论"
            value={formData.conclusion}
            onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
          />
          <Textarea
            label="结果解读"
            placeholder="对检查结果的解读和建议"
            value={formData.interpretation}
            onChange={(e) => setFormData({ ...formData, interpretation: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上传报告单
            </label>
            <FileUpload
              attachments={attachments}
              onChange={setAttachments}
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => {
              setShowAddModal(false);
              setErrors({});
              setAttachments([]);
            }}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
