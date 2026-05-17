import { NavLink } from 'react-router-dom';
import { Home, FileText, TestTube, Pill, User } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/records', icon: FileText, label: '记录' },
  { path: '/examinations', icon: TestTube, label: '检查' },
  { path: '/prescriptions', icon: Pill, label: '处方' },
  { path: '/profile', icon: User, label: '我的' },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                isActive ? 'text-primary-600' : 'text-gray-500'
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
