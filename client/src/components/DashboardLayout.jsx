import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AIChatAssistant from './AIChatAssistant';
import CommandPalette from './CommandPalette';
import { AnimatePresence, motion } from 'framer-motion';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Auto-close sidebar on mobile navigation
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden w-screen bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-zinc-100 transition-colors duration-300 relative">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-h-screen relative w-full">
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-slate-200/20 dark:bg-zinc-800/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-slate-200/20 dark:bg-zinc-800/5 blur-[120px] pointer-events-none" />

        {/* Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 dark:bg-[#030303]/60 p-3 sm:p-4 md:p-6 lg:p-8 grid-bg relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mx-auto w-full max-w-7xl"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Chat Assistant */}
      <AIChatAssistant />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />
    </div>
  );
};

export default DashboardLayout;
