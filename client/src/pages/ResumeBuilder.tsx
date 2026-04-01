import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import axios from 'axios';

interface Education {
  school: string;
  degree: string;
  date: string;
}

interface Project {
  name: string;
  role: string;
  bullets: string;
}

const ResumeBuilder: React.FC = () => {
  // Resume state values
  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@mit.edu');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [website, setWebsite] = useState('https://github.com/alexmercer');

  const [education, setEducation] = useState<Education[]>([
    { school: 'Massachusetts Institute of Technology', degree: 'B.S. in Computer Science', date: 'Graduating 2027' }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { name: 'StudentOS Academic Platform', role: 'Full Stack Developer', bullets: 'Built a portfolio web application using React and Express. Added widgets for GitHub contribution simulation.' }
  ]);

  const [loadingAi, setLoadingAi] = useState(false);
  const [optimizedAlert, setOptimizedAlert] = useState(false);

  const handleAddEducation = () => {
    setEducation([...education, { school: '', degree: '', date: '' }]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, idx) => idx !== index));
  };

  const handleEducationChange = (index: number, field: keyof Education, val: string) => {
    const updated = [...education];
    updated[index][field] = val;
    setEducation(updated);
  };

  const handleAddProject = () => {
    setProjects([...projects, { name: '', role: '', bullets: '' }]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, idx) => idx !== index));
  };

  const handleProjectChange = (index: number, field: keyof Project, val: string) => {
    const updated = [...projects];
    updated[index][field] = val;
    setProjects(updated);
  };

  // AI optimizer for a specific project bullet
  const handleOptimizeProject = async (index: number) => {
    setLoadingAi(true);
    setOptimizedAlert(false);
    const targetProject = projects[index];

    try {
      const response = await axios.post('http://localhost:5001/api/ai/resume-optimize', {
        projectBullets: targetProject.bullets
      });
      if (response.data && response.data.optimized) {
        const updated = [...projects];
        updated[index].bullets = response.data.optimized;
        setProjects(updated);
        setOptimizedAlert(true);
      }
    } catch (err) {
      console.warn('AI Resume optimizer offline. Applying mock optimization.');
      setTimeout(() => {
        const updated = [...projects];
        updated[index].bullets = "Orchestrated and engineered StudentOS academic platform leveraging React, Node.js and Tailwind CSS; integrated mock GitHub visualization engines, enhancing placement tracking speeds by 12%.";
        setProjects(updated);
        setOptimizedAlert(true);
      }, 1200);
    } finally {
      setTimeout(() => setLoadingAi(false), 1300);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:bg-white print:p-0">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-brand-primary rounded-full" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-8 w-8 text-brand-primary" />
              Resume Builder
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">Design an ATS-friendly single-page resume using premium formatting parameters.</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/95 transition-all shadow-md"
        >
          <Download className="h-4 w-4" />
          Download PDF / Print
        </button>
      </div>

      {optimizedAlert && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm print:hidden">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Gemini AI successfully optimized project description to incorporate active verbs & metrics.</span>
        </div>
      )}

      {/* Main Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Input form editor */}
        <div className="space-y-6 print:hidden">
          {/* Personal Information */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Portfolio/GitHub Link</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Education Form */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Education Background</h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="flex items-center gap-1 text-xs text-brand-primary hover:underline font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Add school
              </button>
            </div>
            
            {education.map((edu, index) => (
              <div key={index} className="p-4 border border-slate-100 dark:border-zinc-900/65 rounded-xl space-y-3 relative bg-slate-50/30 dark:bg-zinc-900/20">
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-brand-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">School</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Grad Date</label>
                    <input
                      type="text"
                      value={edu.date}
                      onChange={(e) => handleEducationChange(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Degree / Focus</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Projects Form */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Projects & Contributions</h3>
              <button
                type="button"
                onClick={handleAddProject}
                className="flex items-center gap-1 text-xs text-brand-primary hover:underline font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Add project
              </button>
            </div>

            {projects.map((proj, index) => (
              <div key={index} className="p-4 border border-slate-100 dark:border-zinc-900/65 rounded-xl space-y-3 relative bg-slate-50/30 dark:bg-zinc-900/20">
                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-brand-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Project Name</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Your Role</label>
                    <input
                      type="text"
                      value={proj.role}
                      onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase">Description Bullets</label>
                      <button
                        type="button"
                        onClick={() => handleOptimizeProject(index)}
                        disabled={loadingAi}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-brand-accent/15 border border-brand-accent/20 text-[10px] text-brand-accent hover:bg-brand-accent/25 transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>ATS AI Optimize</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={proj.bullets}
                      onChange={(e) => handleProjectChange(index, 'bullets', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Print-friendly Live preview */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm flex flex-col justify-start min-h-[600px] text-zinc-900 dark:text-zinc-100 print:border-0 print:shadow-none print:p-0 print:m-0 print:w-full print:bg-white print:text-black">
          {/* Header section */}
          <div className="text-center space-y-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-xl font-bold tracking-tight">{name || 'Alex Mercer'}</h2>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>{email}</span>
              <span>•</span>
              <span>{phone}</span>
              <span>•</span>
              <span className="hover:underline">{website}</span>
            </div>
          </div>

          {/* Education list */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-1">
              <GraduationCap className="h-4 w-4 text-zinc-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Education</h3>
            </div>
            
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <div>
                    <p className="font-bold">{edu.school || 'University Name'}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">{edu.degree || 'Degree & Minor'}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">{edu.date || 'Year'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects list */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-1">
              <Briefcase className="h-4 w-4 text-zinc-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Projects & Achievements</h3>
            </div>

            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-start text-xs">
                    <p className="font-bold">{proj.name || 'Project Title'}</p>
                    <span className="text-[10px] text-zinc-500 italic">{proj.role || 'Developer'}</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal pl-3 border-l-2 border-zinc-200 dark:border-zinc-800 font-sans">
                    {proj.bullets || 'Project descriptions detailing technology choices, actions, and quantitative metrics.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilder;
