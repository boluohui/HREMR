import { useLocation } from 'react-router-dom';
import { Plus, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': '首页',
  '/records': '就医记录',
  '/examinations': '检验检查',
  '/prescriptions': '处方管理',
  '/profile': '个人设置',
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || '健康档案';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Link
            to="/records/add"
            className="hidden sm:flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加记录
          </Link>
        </div>
      </div>
    </header>
  );
}
