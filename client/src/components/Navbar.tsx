import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Menu,
  X,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const mockNotifications = [
    { id: 1, text: "AI roadmap 'Cloud Engineer' successfully compiled.", time: "10m ago", read: false },
    { id: 2, text: "Internship deadline for 'Vercel Front End' is in 2 days.", time: "2h ago", read: false },
    { id: 3, text: "Resume score improved to 92/100 following AI tips.", time: "1d ago", read: true },
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200/50 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md px-4 md:px-6">
      {/* Left section: Toggle Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-50 dark:bg-zinc-900 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search bar */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
          searchFocused 
            ? 'border-brand-primary/50 bg-white dark:bg-zinc-900 shadow-sm shadow-brand-primary/5 ring-1 ring-brand-primary/20' 
            : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40'
        }`}>
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, skills, roadmaps..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-60 bg-transparent text-sm text-slate-700 dark:text-zinc-300 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Right section: AI Tag + Theme + Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Premium AI Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 dark:bg-brand-accent/15 border border-brand-primary/20 dark:border-brand-accent/30 text-brand-primary dark:text-brand-accent animate-pulse">
          <Sparkles className="h-3 w-3" />
          <span>AI Engine Connected</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/60 dark:border-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-50 dark:bg-zinc-900/50 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/60 dark:border-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-50 dark:bg-zinc-900/50 transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-brand-danger"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop Clicker */}
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 z-20 w-80 rounded-2xl border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xl text-slate-900 dark:text-zinc-100"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-900">
                    <span className="text-sm font-semibold">Notifications</span>
                    <span className="text-xs text-brand-primary cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {mockNotifications.map((n) => (
                      <div key={n.id} className="flex gap-3 text-xs leading-normal hover:bg-slate-50 dark:hover:bg-zinc-900/50 p-1.5 rounded-lg transition-colors">
                        <div className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-brand-primary'}`} />
                        <div>
                          <p className="text-slate-600 dark:text-zinc-300">{n.text}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile indicator */}
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent text-white flex items-center justify-center font-bold text-sm shadow-md">
          {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ST'}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
