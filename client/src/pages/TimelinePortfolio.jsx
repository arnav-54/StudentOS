import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitFork, Plus, Trash2, Calendar, Award, BookOpen, Briefcase, Code, Link2, Share2, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
const TimelinePortfolio = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetch timeline events on mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/timeline');
                if (response.data && response.data.items) {
                    setEvents(response.data.items);
                }
            }
            catch (err) {
                console.error('Failed to fetch timeline:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);
    const [showAddModal, setShowAddModal] = useState(false);
    const [type, setType] = useState('project');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [link, setLink] = useState('');
    const [shareSuccess, setShareSuccess] = useState(false);
    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!title || !subtitle || !date)
            return;
        try {
            const response = await axios.post('http://localhost:5001/api/timeline', {
                type,
                title,
                subtitle,
                description,
                date,
                link: link || null
            });
            if (response.data && response.data.item) {
                setEvents([response.data.item, ...events]);
            }
            setShowAddModal(false);
            // Reset fields
            setType('project');
            setTitle('');
            setSubtitle('');
            setDescription('');
            setDate('');
            setLink('');
        }
        catch (err) {
            console.error('Failed to add event:', err);
        }
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/timeline/${id}`);
            setEvents(events.filter(e => e.id !== id));
        }
        catch (err) {
            console.error('Failed to delete event:', err);
        }
    };
    const handleShare = () => {
        setShareSuccess(true);
        navigator.clipboard.writeText(window.location.origin + "/portfolio");
        setTimeout(() => setShareSuccess(false), 3000);
    };
    const getEventIcon = (type) => {
        switch (type) {
            case 'project': return <Code className="h-4 w-4"/>;
            case 'hackathon': return <Award className="h-4 w-4"/>;
            case 'internship': return <Briefcase className="h-4 w-4"/>;
            case 'research': return <BookOpen className="h-4 w-4"/>;
            case 'leadership': return <GitFork className="h-4 w-4"/>;
            case 'achievement': return <Award className="h-4 w-4"/>;
        }
    };
    const getEventColor = (type) => {
        switch (type) {
            case 'project': return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
            case 'hackathon': return 'text-brand-accent bg-brand-accent/10 border-brand-accent/20';
            case 'internship': return 'text-brand-success bg-brand-success/10 border-brand-success/20';
            case 'research': return 'text-brand-warning bg-brand-warning/10 border-brand-warning/20';
            case 'leadership': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'achievement': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
        }
    };
    return (<div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-brand-primary rounded-full"/>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <GitFork className="h-8 w-8 text-brand-primary"/>
              Portfolio Timeline
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">Synthesize and share an interactive timeline of your projects, milestones, and work history.</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={handleShare} className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-zinc-800 bg-white/50 hover:bg-slate-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 text-sm font-semibold rounded-xl text-slate-700 dark:text-zinc-300 transition-colors">
            <Share2 className="h-4 w-4"/>
            Share Portfolio
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-5 py-2 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/95 transition-all shadow-md">
            <Plus className="h-4.5 w-4.5"/>
            Add Milestone
          </button>
        </div>
      </div>

      {shareSuccess && (<div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0"/>
          <span>Public portfolio URL copied to clipboard: https://studentos.app/alexmercer/portfolio</span>
        </div>)}

      {/* Vertical Timeline Track */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300">
        
        {/* Core track line */}
        <div className="relative border-l border-slate-200 dark:border-zinc-800 pl-8 ml-4 sm:ml-8 py-4 space-y-10">
          
          <AnimatePresence mode="popLayout">
            {events.map((event, idx) => (<motion.div key={event.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="relative">
                {/* Visual marker dot */}
                <div className={`absolute -left-[45px] top-1.5 h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>

                {/* Event details card */}
                <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/60 backdrop-blur-xl hover:border-brand-primary/30 transition-colors group relative flex flex-col justify-between gap-3">
                  {/* Delete / Actions */}
                  <button onClick={() => handleDelete(event.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-danger transition-opacity" title="Remove Milestone">
                    <Trash2 className="h-4 w-4"/>
                  </button>

                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{event.type}</span>
                      <span className="hidden sm:inline text-slate-300 dark:text-zinc-800">•</span>
                      <span className="text-[10px] font-semibold text-brand-primary dark:text-brand-accent flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5"/>
                        {event.date}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{event.title}</h3>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">{event.subtitle}</p>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">{event.description}</p>
                  </div>

                  {event.link && (<div className="flex justify-start">
                      <a href={event.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-brand-primary hover:underline font-semibold">
                        <Link2 className="h-3.5 w-3.5"/>
                        <span>Visit Resource</span>
                      </a>
                    </div>)}
                </div>

              </motion.div>))}
          </AnimatePresence>

          {events.length === 0 && (<div className="text-center py-12 text-slate-400 text-xs pl-0">
              No portfolio milestones recorded. Click "Add Milestone" to begin building your timeline.
            </div>)}

        </div>
      </div>

      {/* Modal for adding milestones */}
      {showAddModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}/>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 relative z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Record Milestone</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4"/>
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Event Category</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none">
                  <option value="project">Project Launch</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="internship">Internship</option>
                  <option value="research">Research Publication</option>
                  <option value="leadership">Leadership</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Event Title</label>
                <input type="text" required placeholder="e.g. Backend Dev Intern" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"/>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Subtitle / Association</label>
                <input type="text" required placeholder="e.g. Stripe" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Milestone Date</label>
                  <input type="text" required placeholder="e.g. Jun 2026" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Link URL (Optional)</label>
                  <input type="url" placeholder="e.g. https://stripe.com" value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Description details</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description of accomplishments..." className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"/>
              </div>

              <button type="submit" className="w-full py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/95 transition-all text-center">
                Publish Milestone
              </button>
            </form>
          </motion.div>
        </div>)}
    </div>);
};
export default TimelinePortfolio;
