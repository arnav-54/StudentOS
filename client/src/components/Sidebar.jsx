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

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Workspace',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20' },
        { name: 'AI Mentor', path: '/dashboard/ai', icon: Cpu, color: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20' },
        { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar, color: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20' },
      ]
    },
    {
      title: 'Learn',
      items: [
        { name: 'Roadmaps', path: '/dashboard/ai', icon: Cpu, color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' },
        { name: 'Study Notes', path: '/dashboard/notes', icon: BookOpen, color: 'text-sky-500 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20' },
      ]
    },
    {
      title: 'Build',
      items: [
        { name: 'Resume Builder', path: '/dashboard/resume', icon: FileText, color: 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20' },
        { name: 'Portfolio', path: '/dashboard/timeline', icon: GitFork, color: 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' },
        { name: 'Documents', path: '/dashboard/documents', icon: FolderLock, color: 'text-violet-500 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20' },
      ]
    },
    {
      title: 'Career',
      items: [
        { name: 'Job Tracker', path: '/dashboard/jobs', icon: Briefcase, color: 'text-green-500 dark:text-green-400 bg-green-500/10 border border-green-500/20' },
        { name: 'Cover Letters', path: '/dashboard/cover-letter', icon: Mail, color: 'text-orange-500 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20' },
      ]
    },
    {
      title: 'Profile',
      items: [
        { name: 'Achievements', path: '/dashboard/achievements', icon: Trophy, color: 'text-fuchsia-500 dark:text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20' },
        { name: 'Settings & Bio', path: '/dashboard/profile', icon: UserCircle, color: 'text-slate-500 dark:text-zinc-400 bg-slate-500/10 border border-slate-500/20' },
      ]
    }
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
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-zinc-900 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-cyberPink text-white shadow-md shadow-brand-primary/20 shrink-0 animate-pulse">
            <GraduationCap className="h-5 w-5" />
          </div>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-300 font-sans tracking-tight"
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
      <nav className="flex-1 space-y-6 py-6 px-3">
        {categories.map((cat) => (
          <div key={cat.title} className="space-y-1.5">
            {isOpen && (
              <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-3 mb-1">
                {cat.title}
              </p>
            )}
            <div className="space-y-1">
              {cat.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 relative ${
                      isActive
                        ? 'text-brand-primary dark:text-emerald-400 bg-brand-primary/[0.08] dark:bg-brand-primary/15 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900/30 hover:translate-x-1'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-5 rounded-r-full bg-brand-primary dark:bg-emerald-400"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className={`p-1.5 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${item.color} ${
                        isActive ? 'shadow-md scale-105 ring-1 ring-white/10' : 'opacity-85 group-hover:opacity-100 group-hover:scale-105'
                      }`}>
                        <item.icon className="h-3.5 w-3.5" />
                      </div>
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
                        <ChevronRight className="h-3 w-3 text-brand-primary dark:text-emerald-400 shrink-0" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile/Logout Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-zinc-900 space-y-3 bg-slate-50/30 dark:bg-zinc-900/10">
        {isOpen && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl border border-slate-100 dark:border-zinc-900/50 bg-slate-50/50 dark:bg-zinc-900/40">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-violet text-white flex items-center justify-center font-bold shadow-md shadow-brand-primary/10 text-xs tracking-wider">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ST'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{user?.name || 'Student Name'}</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-danger hover:bg-rose-500/10 dark:hover:bg-rose-500/15 transition-all duration-300 hover:scale-[1.01]"
        >
          <LogOut className="h-5 w-5 text-brand-danger transition-transform group-hover:translate-x-0.5" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
