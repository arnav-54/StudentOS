import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  UserCircle, 
  GitFork, 
  FileText, 
  Cpu, 
  Briefcase, 
  FolderLock, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BarChart3,
  Trophy,
  Mail,
  Calendar,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile & Bio', path: '/dashboard/profile', icon: UserCircle },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Smart Calendar', path: '/dashboard/calendar', icon: Calendar },
    { name: 'Timeline Portfolio', path: '/dashboard/timeline', icon: GitFork },
    { name: 'Resume Builder', path: '/dashboard/resume', icon: FileText },
    { name: 'Cover Letter', path: '/dashboard/cover-letter', icon: Mail },
    { name: 'AI Hub & Roadmap', path: '/dashboard/ai', icon: Cpu },
    { name: 'Internship Tracker', path: '/dashboard/jobs', icon: Briefcase },
    { name: 'Achievements', path: '/dashboard/achievements', icon: Trophy },
    { name: 'Document Locker', path: '/dashboard/documents', icon: FolderLock },
    { name: 'Study Notes', path: '/dashboard/notes', icon: BookOpen },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 70 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative z-20 flex flex-col h-screen border-r border-slate-200/60 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl shrink-0 overflow-y-auto overflow-x-hidden`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-zinc-900">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-md shadow-brand-primary/20 shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-300 font-sans tracking-tight"
            >
              StudentOS
            </motion.span>
          )}
        </div>

        {/* Collapsing button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-50 dark:bg-zinc-900 transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 py-6 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                isActive
                  ? 'text-brand-primary dark:text-emerald-400 bg-brand-primary/10 dark:bg-brand-primary/15'
                  : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-brand-primary dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                }`} />
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="truncate flex-1"
                  >
                    {item.name}
                  </motion.span>
                )}
                {isOpen && isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-brand-primary dark:text-emerald-400 shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile/Logout Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-zinc-900 space-y-3">
        {isOpen && (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-brand-primary dark:text-brand-accent shadow-inner text-sm">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ST'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">{user?.name || 'Student Name'}</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-danger hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 text-brand-danger" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
