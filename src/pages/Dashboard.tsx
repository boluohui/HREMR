import { Link, useNavigate } from 'react-router-dom';
import { FileText, TestTube, Pill, Calendar, Plus, ArrowRight } from 'lucide-react';
import { useHealthStore } from '../stores/healthStore';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatDate, getRelativeTime } from '../utils/formatters';
import dayjs from 'dayjs';

export default function Dashboard() {
  const navigate = useNavigate();
  const { records, examinations, prescriptions } = useHealthStore();

  const currentMonth = dayjs().month();
  const thisMonthRecords = records.filter(
    (r) => dayjs(r.recordDate).month() === currentMonth
  ).length;

  const recentRecords = records.slice(0, 5);
  const activePrescriptions = prescriptions.filter((p) => p.isActive).length;

  const stats = [
    {
      title: '就医记录',
      value: records.length,
      icon: <FileText className="w-6 h-6" />,
      variant: 'primary' as const,
    },
    {
      title: '本月就医',
      value: thisMonthRecords,
      icon: <Calendar className="w-6 h-6" />,
      variant: 'secondary' as const,
    },
    {
      title: '检验检查',
      value: examinations.length,
      icon: <TestTube className="w-6 h-6" />,
      variant: 'accent' as const,
    },
    {
      title: '进行中处方',
      value: activePrescriptions,
      icon: <Pill className="w-6 h-6" />,
      variant: 'gray' as const,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">近期就医记录</h3>
                <Link to="/records">
                  <Button variant="ghost" size="sm">
                    查看全部
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {recentRecords.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentRecords.map((record) => (
                  <Link
                    key={record.id}
                    to={`/records/${record.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {record.diagnosis}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {record.hospital} · {record.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {getRelativeTime(record.recordDate)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(record.recordDate)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FileText className="w-10 h-10 text-gray-400" />}
                title="暂无就医记录"
                description="开始记录您的就医历史，方便随时查看和管理"
                actionLabel="添加第一条记录"
                onAction={() => navigate('/records/add')}
              />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
            <div className="space-y-4">
              <Link to="/records/add">
                <Button variant="primary" className="w-full justify-center py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  添加就医记录
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/examinations">
                  <Button variant="outline" className="w-full justify-center py-2.5">
                    <TestTube className="w-5 h-5 mr-1.5" />
                    检验检查
                  </Button>
                </Link>
                <Link to="/prescriptions">
                  <Button variant="outline" className="w-full justify-center py-2.5">
                    <Pill className="w-5 h-5 mr-1.5" />
                    处方管理
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">健康提示</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  定期体检有助于早期发现健康问题
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  妥善保存就医资料，方便医生了解病史
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  按时服药，遵循医嘱用药
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
