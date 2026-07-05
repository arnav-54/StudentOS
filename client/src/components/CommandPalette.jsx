import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  ArrowRight, 
  FileText, 
  Cpu, 
  Briefcase, 
  Calendar,
  BookOpen,
  User,
  LayoutDashboard
} from 'lucide-react';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const commands = [
    { name: 'Open Dashboard Overview', path: '/dashboard', icon: LayoutDashboard, category: 'General' },
    { name: 'View Profile & Bio', path: '/dashboard/profile', icon: User, category: 'General' },
    { name: 'AI Hub & Roadmaps', path: '/dashboard/ai', icon: Cpu, category: 'Learn' },
    { name: 'Study Notes Editor', path: '/dashboard/notes', icon: BookOpen, category: 'Learn' },
    { name: 'Smart Calendar Milestones', path: '/dashboard/calendar', icon: Calendar, category: 'Learn' },
    { name: 'ATS Resume Builder', path: '/dashboard/resume', icon: FileText, category: 'Build' },
    { name: 'Timeline Portfolio', path: '/dashboard/timeline', icon: Terminal, category: 'Build' },
    { name: 'Document Locker', path: '/dashboard/documents', icon: FileText, category: 'Build' },
    { name: 'Internship & Job Tracker', path: '/dashboard/jobs', icon: Briefcase, category: 'Career' },
    { name: 'AI Cover Letter Generator', path: '/dashboard/cover-letter', icon: FileText, category: 'Career' },
    { name: 'Achievements & Badges', path: '/dashboard/achievements', icon: Terminal, category: 'Career' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.toggleCommandPalette = () => setIsOpen((prev) => !prev);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete window.toggleCommandPalette;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filteredCommands.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(filteredCommands.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex].path);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[550px] z-50 px-4"
          >
            <div className="glass-vision-pro rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0C0C12]/95">
              
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-white/[0.01]">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value) || setSelectedIndex(0)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 font-extrabold select-none">
                  ESC
                </span>
              </div>

              {/* Command List */}
              <div className="max-h-[300px] overflow-y-auto p-2.5 space-y-1">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={cmd.name}
                        onClick={() => handleSelect(cmd.path)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/10'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <cmd.icon className={`h-4.5 w-4.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                          <span>{cmd.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] uppercase px-2 py-0.5 rounded-md font-black tracking-widest ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-white/5 border border-white/5 text-slate-500'
                          }`}>
                            {cmd.category}
                          </span>
                          {isSelected && <ArrowRight className="h-3.5 w-3.5 text-white animate-pulse" />}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-8 text-center space-y-1 text-slate-500">
                    <Terminal className="h-5 w-5 mx-auto opacity-45" />
                    <p className="text-xs font-bold">No commands matched "{query}"</p>
                  </div>
                )}
              </div>

              {/* Footer Helper */}
              <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px] text-slate-500 font-semibold select-none">
                <div className="flex items-center gap-1.5">
                  <span>↑↓ Navigate</span>
                  <span>·</span>
                  <span>Enter to select</span>
                </div>
                <span>Cmd+K to toggle</span>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
export { CommandPalette };
