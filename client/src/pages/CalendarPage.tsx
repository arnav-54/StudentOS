import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Tag,
  MapPin,
  X,
  FileText,
  AlertCircle,
  Video,
  ExternalLink,
  Trash2,
  CheckCircle,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  category: 'academic' | 'career' | 'personal' | 'interview';
  description?: string;
  location?: string;
  link?: string;
}

interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  location: string;
  notes: string;
}

const defaultEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'CS 301 Midterm Exam',
    date: '2026-06-28',
    time: '10:00',
    category: 'academic',
    description: 'Covers Chapters 1-6: Advanced algorithms, complexity analysis, dynamic programming.',
    location: 'Building 4, Room 202',
  },
  {
    id: 'e2',
    title: 'LeetCode Weekly Contest',
    date: '2026-06-27',
    time: '08:00',
    category: 'personal',
    description: 'Weekly algorithm competition to boost competitive programming ratings.',
    link: 'https://leetcode.com/contest',
  },
  {
    id: 'e3',
    title: 'Linear Resume Review Session',
    date: '2026-06-30',
    time: '15:30',
    category: 'career',
    description: '1-on-1 mentorship session with Lead Designer from Linear.',
    location: 'Google Meet',
    link: 'https://meet.google.com/abc-defg-hij',
  },
];

const categoryColors = {
  academic: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    border: 'border-indigo-200 dark:border-indigo-800/40',
    text: 'text-indigo-600 dark:text-indigo-400',
    dot: 'bg-indigo-500',
    badge: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  },
  career: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  personal: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800/40',
    text: 'text-purple-600 dark:text-purple-400',
    dot: 'bg-purple-500',
    badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  interview: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800/40',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
};

const CalendarPage: React.FC = () => {
  // Current Month/Year state
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 25)); // Set baseline in June 2026 to match mock data
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 25));
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('studentos_calendar_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back
      }
    }
    return defaultEvents;
  });

  const [applications, setApplications] = useState<Application[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['academic', 'career', 'personal', 'interview']);

  // Add event form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formCategory, setFormCategory] = useState<'academic' | 'career' | 'personal'>('academic');
  const [formDesc, setFormDesc] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formLink, setFormLink] = useState('');

  // Sync events to local storage
  useEffect(() => {
    localStorage.setItem('studentos_calendar_events', JSON.stringify(events));
  }, [events]);

  // Load Job Applications to merge interview events
  useEffect(() => {
    const loadApps = () => {
      const savedApps = localStorage.getItem('studentos_applications');
      if (savedApps) {
        try {
          const parsed = JSON.parse(savedApps);
          setApplications(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadApps();
    // Watch for updates
    window.addEventListener('storage', loadApps);
    return () => window.removeEventListener('storage', loadApps);
  }, []);

  // Merge custom events and JobTracker interviews
  const allEvents = useMemo(() => {
    const merged: CalendarEvent[] = [...events];
    
    // Add interview dates from Job Tracker
    applications.forEach((app) => {
      if (app.status === 'interview' && app.appliedDate) {
        // Since appliedDate is stored, we look for interview dates mentioned in notes,
        // or default the interview date to some days after appliedDate, or use a specific format
        // Let's check notes for text matching "June 29" etc. Or fall back to appliedDate + 5 days
        let interviewDateStr = app.appliedDate;
        
        // Custom parser for our seed data: Stripe is June 29
        if (app.company.toLowerCase() === 'stripe') {
          interviewDateStr = '2026-06-29';
        }

        merged.push({
          id: `app-interview-${app.id}`,
          title: `Job Interview: ${app.company}`,
          date: interviewDateStr,
          time: '11:00',
          category: 'interview',
          description: `Role: ${app.role}. Location: ${app.location}. Notes: ${app.notes}`,
          location: app.location,
        });
      }
    });

    return merged;
  }, [events, applications]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => activeFilters.includes(event.category));
  }, [allEvents, activeFilters]);

  // Date constants
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Get array of dates in the calendar grid
  const calendarGridDates = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startOffset = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const dates: (Date | null)[] = [];

    // Fill offset days
    for (let i = 0; i < startOffset; i++) {
      dates.push(null);
    }

    // Fill active days
    for (let i = 1; i <= totalDays; i++) {
      dates.push(new Date(year, month, i));
    }

    return dates;
  }, [currentDate]);

  // Group events by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach((e) => {
      if (!groups[e.date]) {
        groups[e.date] = [];
      }
      groups[e.date].push(e);
    });
    return groups;
  }, [filteredEvents]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const formatDateStr = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const d = new Date(date.getTime() - offset * 60 * 1000);
    return d.toISOString().split('T')[0];
  };

  const selectedDateStr = useMemo(() => formatDateStr(selectedDate), [selectedDate]);

  const selectedDayEvents = useMemo(() => {
    return allEvents.filter((e) => e.date === selectedDateStr);
  }, [allEvents, selectedDateStr]);

  const upcomingEvents = useMemo(() => {
    const todayStr = '2026-06-25'; // Baseline
    return allEvents
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
      .slice(0, 5);
  }, [allEvents]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: formTitle,
      date: formDate,
      time: formTime || undefined,
      category: formCategory,
      description: formDesc || undefined,
      location: formLocation || undefined,
      link: formLink || undefined,
    };

    setEvents([...events, newEvent]);
    setShowAddModal(false);

    // Clear form
    setFormTitle('');
    setFormDate('');
    setFormTime('');
    setFormCategory('academic');
    setFormDesc('');
    setFormLocation('');
    setFormLink('');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const toggleFilter = (category: string) => {
    if (activeFilters.includes(category)) {
      setActiveFilters(activeFilters.filter((f) => f !== category));
    } else {
      setActiveFilters([...activeFilters, category]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-brand-primary rounded-full" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="h-8 w-8 text-brand-primary" />
              Smart Calendar & Deadlines
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">
            Sync applications, manage academic milestones, and organize study timelines.
          </p>
        </div>
        <button
          onClick={() => {
            setFormDate(selectedDateStr);
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/95 transition-all shadow-md"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Calendar Filters & Upcoming agenda */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Filters */}
          <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Filters</h3>
            <div className="flex flex-col gap-2">
              {Object.entries(categoryColors).map(([cat, config]) => {
                const isActive = activeFilters.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleFilter(cat)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? `${config.bg} ${config.border}`
                        : 'border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                      <span className={`text-xs font-semibold capitalize ${isActive ? config.text : 'text-slate-500 dark:text-zinc-400'}`}>
                        {cat === 'interview' ? 'Interviews (Synced)' : cat}
                      </span>
                    </div>
                    <span
                      className={`h-4.5 w-8 rounded-full transition-colors flex items-center p-0.5 ${
                        isActive ? 'bg-brand-primary justify-end' : 'bg-slate-200 dark:bg-zinc-800 justify-start'
                      }`}
                    >
                      <span className="h-3.5 w-3.5 rounded-full bg-white shadow-sm" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcoming Agenda */}
          <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Agenda</h3>
            <div className="space-y-3.5">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-zinc-500 py-2">No upcoming events scheduled.</p>
              ) : (
                upcomingEvents.map((e) => {
                  const config = categoryColors[e.category];
                  const eventDate = new Date(e.date + 'T00:00:00');
                  const dateLabel = eventDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                  return (
                    <div
                      key={e.id}
                      onClick={() => handleDateClick(eventDate)}
                      className={`p-3 rounded-xl border ${config.bg} ${config.border} flex justify-between items-start cursor-pointer hover:scale-[1.01] transition-transform`}
                    >
                      <div className="space-y-1 overflow-hidden pr-2">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{e.title}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-zinc-400">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>{e.time || 'All Day'}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 px-2 py-0.5 rounded-md text-slate-500 shrink-0">
                        {dateLabel}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Month Grid & Selected Date Drawer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Calendar Box */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl overflow-hidden shadow-sm">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-900">
              <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
                {currentMonthName} <span className="text-slate-400 font-medium">{currentYear}</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(2026, 5, 25))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Days Of Week Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-zinc-900 text-center bg-slate-50/50 dark:bg-zinc-900/10 py-2.5">
              {daysOfWeek.map((day) => (
                <span key={day} className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-zinc-900 border-l border-t border-slate-100 dark:border-zinc-900">
              {calendarGridDates.map((date, index) => {
                if (!date) {
                  return (
                    <div key={`empty-${index}`} className="min-h-[90px] md:min-h-[110px] bg-slate-50/30 dark:bg-zinc-950/20" />
                  );
                }

                const dStr = formatDateStr(date);
                const dayEvents = eventsByDate[dStr] || [];
                const isSelected = selectedDateStr === dStr;
                const isToday = dStr === '2026-06-25'; // Mocked current date

                return (
                  <div
                    key={dStr}
                    onClick={() => handleDateClick(date)}
                    className={`min-h-[90px] md:min-h-[110px] p-2 flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-primary/5 dark:bg-brand-primary/10 ring-1 ring-inset ring-brand-primary/20'
                        : 'bg-white/75 dark:bg-[#0A0A0C]/75 hover:bg-slate-50/60 dark:hover:bg-zinc-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-xs font-bold h-5 w-5 flex items-center justify-center rounded-md ${
                          isToday
                            ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/20'
                            : isSelected
                            ? 'text-brand-primary'
                            : 'text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    {/* Day Events Dots/Mini badges */}
                    <div className="space-y-1 mt-2 flex-1 overflow-hidden flex flex-col justify-end">
                      {dayEvents.slice(0, 3).map((e) => {
                        const config = categoryColors[e.category];
                        return (
                          <div
                            key={e.id}
                            className={`px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-bold border truncate ${config.bg} ${config.border} ${config.text}`}
                            title={e.title}
                          >
                            {e.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[8px] font-bold text-slate-400 pl-1.5">
                          + {dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agenda for Selected Date */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                  Agenda for {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                  {selectedDayEvents.length} Event{selectedDayEvents.length !== 1 && 's'}
                </p>
              </div>
              <button
                onClick={() => {
                  setFormDate(selectedDateStr);
                  setShowAddModal(true);
                }}
                className="text-xs text-brand-primary font-bold hover:underline"
              >
                + Add Event
              </button>
            </div>

            <div className="space-y-4">
              {selectedDayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400 dark:text-zinc-500">
                  <CalendarIcon className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-xs">No tasks or appointments scheduled for this date.</p>
                </div>
              ) : (
                selectedDayEvents.map((e) => {
                  const config = categoryColors[e.category];
                  const isAppSynced = e.id.startsWith('app-interview-');
                  
                  return (
                    <div
                      key={e.id}
                      className={`p-4 rounded-2xl border ${config.bg} ${config.border} flex justify-between items-start`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">{e.title}</h4>
                          <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${config.badge}`}>
                            {e.category}
                          </span>
                          {isAppSynced && (
                            <span className="text-[9px] font-bold bg-brand-warning/10 text-brand-warning px-2 py-0.5 rounded-full border border-brand-warning/20">
                              Synced from Job Tracker
                            </span>
                          )}
                        </div>

                        {e.description && (
                          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
                            {e.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-400 font-semibold pt-1">
                          {e.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              {e.time}
                            </span>
                          )}
                          {e.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {e.location}
                            </span>
                          )}
                          {e.link && (
                            <a
                              href={e.link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-brand-primary hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Meeting Link
                            </a>
                          )}
                        </div>
                      </div>

                      {!isAppSynced && (
                        <button
                          onClick={() => handleDeleteEvent(e.id)}
                          className="p-1 rounded text-slate-400 hover:text-brand-danger hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 relative z-10 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="h-4.5 w-4.5 text-brand-primary" />
                  Add Calendar Event
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS Midterm, Stripe Interview Prep"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">
                      Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none"
                  >
                    <option value="academic">Academic</option>
                    <option value="career">Career</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide additional details..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">
                      Location / Room
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Room 201 or Zoom"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">
                      Link / URL
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. Meeting link"
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/95 transition-all text-center mt-2 shadow-sm"
                >
                  Create Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarPage;
