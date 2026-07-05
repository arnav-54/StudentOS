import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AIChatAssistant from './AIChatAssistant';
import CommandPalette from './CommandPalette';
import { AnimatePresence, motion } from 'framer-motion';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden w-screen bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Sidebar component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-h-screen relative">
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-slate-200/20 dark:bg-zinc-800/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-slate-200/20 dark:bg-zinc-800/5 blur-[120px] pointer-events-none" />

        {/* Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 dark:bg-[#030303]/60 p-4 md:p-6 lg:p-8 grid-bg relative z-10">
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
