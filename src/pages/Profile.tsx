import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, Trash2, User, Shield, Bell, Database } from 'lucide-react';
import { useHealthStore } from '../stores/healthStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useState } from 'react';

export default function Profile() {
  const navigate = useNavigate();
  const { records, examinations, prescriptions, exportData, importData, reset } = useHealthStore();
  const [showClearModal, setShowClearModal] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalRecords = records.length;
  const totalExaminations = examinations.length;
  const totalPrescriptions = prescriptions.length;
  const activePrescriptions = prescriptions.filter((p) => p.isActive).length;

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-records-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importData(content);
      setImportResult({
        success: result.success,
        message: result.message,
      });
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">健康档案</h2>
            <p className="text-gray-500">数据仅存储在您的本地设备中</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
            <p className="text-sm text-gray-500">就医记录</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{totalExaminations}</p>
            <p className="text-sm text-gray-500">检验检查</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{totalPrescriptions}</p>
            <p className="text-sm text-gray-500">处方记录</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{activePrescriptions}</p>
            <p className="text-sm text-gray-500">进行中处方</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">数据安全</h3>
        </div>
        <p className="text-gray-600 mb-4">
          您的健康数据仅存储在本地浏览器中。我们不会将您的任何数据传输到服务器。
          建议定期导出数据备份以防数据丢失。
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            ✓ 数据使用浏览器本地存储<br />
            ✓ 无服务器数据传输<br />
            ✓ 随时可导出/导入完整数据
          </p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-secondary-600" />
          <h3 className="text-lg font-semibold text-gray-900">数据管理</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">导出数据</p>
              <p className="text-sm text-gray-500">将所有健康数据导出为 JSON 文件</p>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">导入数据</p>
              <p className="text-sm text-gray-500">从 JSON 文件导入健康数据</p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                导入
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-900">清除所有数据</p>
              <p className="text-sm text-red-600">删除所有本地存储的健康数据</p>
            </div>
            <Button variant="danger" onClick={() => setShowClearModal(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              清除
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-accent-600" />
          <h3 className="text-lg font-semibold text-gray-900">使用提示</h3>
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          <p>• 建议使用 Chrome、Firefox、Safari 等现代浏览器</p>
          <p>• 定期清理浏览器缓存可能导致数据丢失，请提前导出备份</p>
          <p>• 更换设备后可通过导入功能恢复数据</p>
          <p>• 如需删除数据，请使用「清除所有数据」功能</p>
        </div>
      </Card>

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="确认清除数据"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          确定要清除所有健康数据吗？此操作不可恢复，请提前导出备份。
        </p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setShowClearModal(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleClearData}>
            确认清除
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!importResult}
        onClose={() => setImportResult(null)}
        title={importResult?.success ? '导入成功' : '导入失败'}
        size="sm"
      >
        <p className={`mb-6 ${importResult?.success ? 'text-green-600' : 'text-red-600'}`}>
          {importResult?.message}
        </p>
        <div className="flex justify-end">
          <Button onClick={() => setImportResult(null)}>确定</Button>
        </div>
      </Modal>
    </div>
  );
}
