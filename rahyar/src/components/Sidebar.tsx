import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, User, Route, Trophy, FileText,
  FolderOpen, BookOpen, Award, MessageCircle, Settings, LogOut, GraduationCap
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/profile', label: 'پروفایل', icon: User },
  { path: '/learning-path', label: 'مسیر یادگیری', icon: Route },
  { path: '/leaderboard', label: 'جدول رتبه‌بندی', icon: Trophy },
  { path: '/tests', label: 'آزمون‌ها', icon: FileText },
  { path: '/projects', label: 'پروژه‌ها', icon: FolderOpen },
  { path: '/resources', label: 'منابع آموزشی', icon: BookOpen },
  { path: '/honors', label: 'افتخارات', icon: Award },
  { path: '/chat', label: 'دستیار هوشمند', icon: MessageCircle },
  { path: '/messages', label: 'پیام‌ها', icon: MessageCircle },
  { path: '/settings', label: 'تنظیمات', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-gradient-sidebar border-l border-sidebar-border flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">رَه‌یار</h1>
          <p className="text-xs text-sidebar-foreground/60">پلتفرم آموزشی</p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary font-semibold'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          خروج
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
