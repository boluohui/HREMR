import { NavLink } from 'react-router-dom';
import { Home, FileText, TestTube, Pill, User } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/records', icon: FileText, label: '就医记录' },
  { path: '/examinations', icon: TestTube, label: '检验检查' },
  { path: '/prescriptions', icon: Pill, label: '处方管理' },
  { path: '/profile', icon: User, label: '个人设置' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">健康档案</h1>
            <p className="text-xs text-gray-500">Personal Health Record</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">数据安全保障</p>
          <p className="text-xs text-gray-500">所有数据仅存储在您的本地设备中</p>
        </div>
      </div>
    </aside>
  );
}
