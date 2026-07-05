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

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
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

        {/* Command Palette Trigger */}
        <button
          onClick={() => window.toggleCommandPalette?.()}
          className="hidden md:flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 hover:bg-slate-100 dark:hover:bg-zinc-900/60 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-all duration-200 text-xs font-bold cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search commands or tools...</span>
          </div>
          <span className="text-[10px] bg-slate-200/55 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded border border-slate-300/40 dark:border-white/5 font-extrabold text-slate-500 dark:text-zinc-400">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right section: AI Tag + Theme + Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Premium AI Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-primary/10 to-brand-violet/10 dark:from-brand-primary/20 dark:to-brand-violet/20 border border-brand-primary/20 dark:border-brand-violet/30 text-brand-primary dark:text-emerald-400 shadow-sm">
          <Sparkles className="h-3 w-3 text-brand-violet animate-spin" style={{ animationDuration: '3s' }} />
          <span>AI Engine Connected</span>
        </div>
 
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 dark:border-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-50/50 dark:bg-zinc-900/50 transition-colors shadow-sm cursor-pointer"
          aria-label="Toggle Theme"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-indigo-600" />}
          </motion.div>
        </motion.button>
 
        {/* Notifications Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 dark:border-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-50/50 dark:bg-zinc-900/50 transition-colors shadow-sm relative cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-danger border-2 border-white dark:border-zinc-950"></span>
          </motion.button>
 
          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop Clicker */}
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3.5 z-20 w-80 rounded-2xl border border-slate-200/60 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-black/60 text-slate-900 dark:text-zinc-100"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-900">
                    <span className="text-sm font-bold font-heading">Notifications</span>
                    <span className="text-xs font-semibold text-brand-primary dark:text-emerald-400 cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {mockNotifications.map((n) => (
                      <div key={n.id} className="flex gap-3 text-xs leading-normal hover:bg-slate-50 dark:hover:bg-zinc-900/50 p-2 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-zinc-900">
                        <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-brand-primary dark:bg-emerald-400'}`} />
                        <div>
                          <p className="text-slate-600 dark:text-zinc-300 font-medium">{n.text}</p>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">{n.time}</span>
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
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-violet text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-brand-primary/15 tracking-wider border border-white/10">
          {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ST'}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
