import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useHealthStore } from '../stores/healthStore';
import RecordCard from '../components/records/RecordCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import { formatYear } from '../utils/formatters';
import dayjs from 'dayjs';

export default function Records() {
  const { records } = useHealthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const years = ['all', ...new Set(records.map((r) => formatYear(r.recordDate)))];

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear =
      selectedYear === 'all' || formatYear(record.recordDate) === selectedYear;

    return matchesSearch && matchesYear;
  });

  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const year = formatYear(record.recordDate);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(record);
    return acc;
  }, {} as Record<string, typeof records>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索就医记录..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">全部年份</option>
            {years.filter((y) => y !== 'all').map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <Link to="/records/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              添加记录
            </Button>
          </Link>
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedRecords)
            .sort((a, b) => dayjs(b[1][0].recordDate).unix() - dayjs(a[1][0].recordDate).unix())
            .map(([year, yearRecords]) => (
              <div key={year}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold">
                    {yearRecords.length}
                  </span>
                  {year}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yearRecords.map((record, index) => (
                    <div
                      key={record.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <RecordCard record={record} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <EmptyState
          title={searchTerm || selectedYear !== 'all' ? '未找到匹配的记录' : '暂无就医记录'}
          description={
            searchTerm || selectedYear !== 'all'
              ? '尝试调整搜索条件或清除筛选'
              : '开始记录您的就医历史，方便随时查看和管理'
          }
          actionLabel={!searchTerm && selectedYear === 'all' ? '添加第一条记录' : undefined}
          onAction={!searchTerm && selectedYear === 'all' ? () => window.location.href = '/records/add' : undefined}
        />
      )}
    </div>
  );
}
