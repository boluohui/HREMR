import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHealthStore } from '../stores/healthStore';
import { ArrowLeft, Calendar, Download, Trash2, Image as ImageIcon, FileText, X } from 'lucide-react';
import { getExamTypeLabel, formatDate } from '../utils/formatters';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { useState } from 'react';
import clsx from 'clsx';
import type { ExamType } from '../utils/types';

const examTypeColors: Record<ExamType, string> = {
  blood: 'bg-red-100 text-red-700',
  urine: 'bg-yellow-100 text-yellow-700',
  imaging: 'bg-blue-100 text-blue-700',
  ultrasound: 'bg-green-100 text-green-700',
  ecg: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function ExamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getExamination, deleteExamination } = useHealthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const exam = id ? getExamination(id) : undefined;

  if (!exam) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Link to="/examinations" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">检查未找到</h1>
        </div>
        <EmptyState
          title="检查记录不存在"
          description="该检查记录可能已被删除"
          actionLabel="返回检查列表"
          onAction={() => navigate('/examinations')}
        />
      </div>
    );
  }

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link to="/examinations" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
        </div>
        <Button
          variant="outline"
          color="danger"
          size="sm"
          onClick={() => {
            if (confirm('确定要删除这条检查记录吗？')) {
              deleteExamination(exam.id);
              navigate('/examinations');
            }
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          删除
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <span className={clsx('inline-flex items-center font-medium rounded-full px-3 py-1 text-sm', examTypeColors[exam.examType])}>
                {getExamTypeLabel(exam.examType)}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {formatDate(exam.examDate)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">检查结果</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{exam.findings}</p>
              </div>
              
              {exam.conclusion && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">结论</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{exam.conclusion}</p>
                </div>
              )}
              
              {exam.interpretation && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">结果解读</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{exam.interpretation}</p>
                </div>
              )}
              
              {exam.normalRanges && exam.normalRanges.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">指标详情</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-600">项目</th>
                          <th className="px-4 py-2 text-left text-gray-600">结果</th>
                          <th className="px-4 py-2 text-left text-gray-600">参考值</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {exam.normalRanges.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-gray-900">{item.item}</td>
                            <td className="px-4 py-2 font-medium text-gray-900">{item.value} {item.unit}</td>
                            <td className="px-4 py-2 text-gray-600">{item.normalRange} {item.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">附件 ({exam.attachments.length})</h3>
            
            {exam.attachments.length === 0 ? (
              <p className="text-sm text-gray-500">暂无附件</p>
            ) : (
              <div className="space-y-3">
                {exam.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {attachment.type === 'image' ? (
                        <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {attachment.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {attachment.type === 'image' && (
                        <button
                          onClick={() => setSelectedImage(attachment.url)}
                          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-600"
                          title="预览图片"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownload(attachment.url, attachment.name)}
                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-600"
                        title="下载文件"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="预览"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
