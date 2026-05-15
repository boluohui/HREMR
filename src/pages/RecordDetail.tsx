import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, User, Phone, FileText } from 'lucide-react';
import { useHealthStore } from '../stores/healthStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/formatters';

export default function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecord, deleteRecord } = useHealthStore();
  const record = id ? getRecord(id) : undefined;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!record) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">记录不存在</h2>
        <Button onClick={() => navigate('/records')}>返回列表</Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteRecord(record.id);
    navigate('/records');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">就医记录详情</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/records/${id}/edit`)}>
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">{record.diagnosis}</h2>
            <div className="flex gap-2">
              <Badge variant="primary">{record.department}</Badge>
              {record.followUpDate && <Badge variant="warning">需复诊</Badge>}
            </div>
          </div>
          <Badge variant="gray" size="md">{formatDate(record.recordDate)}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">就诊日期</p>
              <p className="font-medium text-gray-900">{formatDate(record.recordDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">就诊医院</p>
              <p className="font-medium text-gray-900">{record.hospital}</p>
            </div>
          </div>

          {record.doctorName && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">主治医生</p>
                <p className="font-medium text-gray-900">{record.doctorName}</p>
              </div>
            </div>
          )}

          {record.followUpDate && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">复诊日期</p>
                <p className="font-medium text-gray-900">{formatDate(record.followUpDate)}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">主诉</h3>
        <p className="text-gray-700 leading-relaxed">{record.chiefComplaint}</p>
      </Card>

      {record.physicalExam && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">体格检查</h3>
          <p className="text-gray-700 leading-relaxed">{record.physicalExam}</p>
        </Card>
      )}

      {record.labFindings && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">实验室检查</h3>
          <p className="text-gray-700 leading-relaxed">{record.labFindings}</p>
        </Card>
      )}

      {record.treatment && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">治疗方案</h3>
          <p className="text-gray-700 leading-relaxed">{record.treatment}</p>
        </Card>
      )}

      {record.doctorAdvice && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">医嘱</h3>
          <p className="text-gray-700 leading-relaxed">{record.doctorAdvice}</p>
        </Card>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="确认删除"
        size="sm"
      >
        <p className="text-gray-600 mb-6">确定要删除这条就医记录吗？此操作无法撤销。</p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            删除
          </Button>
        </div>
      </Modal>
    </div>
  );
}
