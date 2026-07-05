import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, Trash2, MapPin, X } from 'lucide-react';
import axios from 'axios';
const JobTracker = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetch applications from backend
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/jobs');
                if (response.data) {
                    const list = Array.isArray(response.data) ? response.data : (response.data.applications || []);
                    setApplications(list);
                }
            }
            catch (err) {
                console.error('Failed to fetch applications:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);
    const [showAddModal, setShowAddModal] = useState(false);
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('wishlist');
    const [location, setLocation] = useState('Remote');
    const [notes, setNotes] = useState('');
    const columns = [
        { id: 'wishlist', label: 'Wishlist', color: 'border-t-purple-500' },
        { id: 'applied', label: 'Applied', color: 'border-t-brand-primary' },
        { id: 'interview', label: 'Interview', color: 'border-t-brand-warning' },
        { id: 'offer', label: 'Offer', color: 'border-t-brand-success' },
        { id: 'rejected', label: 'Rejected', color: 'border-t-brand-danger' },
    ];
    const handleAddApplication = async (e) => {
        e.preventDefault();
        if (!company || !role)
            return;
        try {
            const response = await axios.post('http://localhost:5001/api/jobs', {
                company,
                role,
                status,
                location,
                notes,
            });
            if (response.data) {
                const newApp = response.data.application || response.data;
                setApplications([...applications, newApp]);
            }
            setShowAddModal(false);
            setCompany('');
            setRole('');
            setStatus('wishlist');
            setLocation('Remote');
            setNotes('');
        }
        catch (err) {
            console.error('Failed to add application:', err);
        }
    };
    const handleMoveStatus = async (id, nextStatus) => {
        try {
            await axios.put(`http://localhost:5001/api/jobs/${id}`, {
                status: nextStatus
            });
            setApplications(applications.map(app => app.id === id ? { ...app, status: nextStatus } : app));
        }
        catch (err) {
            console.error('Failed to move status:', err);
        }
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/jobs/${id}`);
            setApplications(applications.filter(app => app.id !== id));
        }
        catch (err) {
            console.error('Failed to delete application:', err);
        }
    };
    return (<div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-brand-primary rounded-full"/>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-brand-primary"/>
              Internship Application Tracker
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">Visualize, prioritize, and structure your placement pipeline.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/95 transition-all shadow-md">
          <Plus className="h-4.5 w-4.5"/>
          Add Application
        </button>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Active</p>
          <p className="text-2xl font-black text-slate-800 dark:text-zinc-100">{applications.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Interviews</p>
          <p className="text-2xl font-black text-brand-warning">{applications.filter(a => a.status === 'interview').length}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Offers Received</p>
          <p className="text-2xl font-black text-brand-success">{applications.filter(a => a.status === 'offer').length}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Success Rate</p>
          <p className="text-2xl font-black text-brand-primary">
            {applications.length ? Math.round((applications.filter(a => ['interview', 'offer'].includes(a.status)).length / applications.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
            const colApps = applications.filter((app) => app.status === col.id);
            return (<div key={col.id} className="min-w-[200px] flex flex-col space-y-3">
              {/* Column Title */}
              <div className={`p-3 border-t-2 ${col.color} bg-white/60 dark:bg-[#0A0A0C]/60 backdrop-blur-sm rounded-xl flex items-center justify-between shadow-sm`}>
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wide">{col.label}</span>
                <span className="text-xs font-semibold bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-slate-500">{colApps.length}</span>
              </div>

              {/* Cards List */}
              <div className="flex-1 space-y-3 min-h-[350px]">
                <AnimatePresence mode="popLayout">
                  {colApps.map((app) => (<motion.div key={app.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="p-4 rounded-xl border border-slate-200/40 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 group">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{app.company}</h4>
                          <button onClick={() => handleDelete(app.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-danger transition-opacity">
                            <Trash2 className="h-3.5 w-3.5"/>
                          </button>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 truncate">{app.role}</p>

                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                          <MapPin className="h-3 w-3 shrink-0"/>
                          <span>{app.location}</span>
                        </div>
                        {app.notes && (<p className="text-[9px] text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-900/60 p-1.5 rounded border border-slate-100/50 dark:border-zinc-900/40 leading-normal line-clamp-2">
                            {app.notes}
                          </p>)}
                      </div>

                      {/* State transitions buttons */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                        <span>Move state:</span>
                        <div className="flex gap-1">
                          {columns.filter(c => c.id !== app.status).map(c => (<button key={c.id} onClick={() => handleMoveStatus(app.id, c.id)} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:text-brand-primary hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors" title={`Move to ${c.label}`}>
                              {c.label.substring(0, 1)}
                            </button>))}
                        </div>
                      </div>
                    </motion.div>))}
                </AnimatePresence>
              </div>
            </div>);
        })}
      </div>

      {/* Modal dialog for adding applications */}
      {showAddModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}/>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 relative z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Application Card</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4"/>
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Company Name</label>
                <input type="text" required placeholder="e.g. Vercel" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"/>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Role / Position</label>
                <input type="text" required placeholder="e.g. Developer Relations Intern" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none">
                    <option value="wishlist">Wishlist</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Application Notes</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Referral details, interview dates..." className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 focus:outline-none"/>
              </div>

              <button type="submit" className="w-full py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/95 transition-all text-center">
                Create Card
              </button>
            </form>
          </motion.div>
        </div>)}
    </div>);
};
export default JobTracker;
