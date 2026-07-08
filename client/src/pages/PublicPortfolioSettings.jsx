import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Globe, Copy, Check, ExternalLink, Share2, Eye, Shield, Link2, ToggleLeft, ToggleRight, Briefcase, GraduationCap, Code2, MapPin, Award, Star, } from 'lucide-react';
const PublicPortfolioSettings = () => {
    const { user } = useAuth();
    const [isPublic, setIsPublic] = useState(() => {
        try {
            const stored = localStorage.getItem('studentos_public');
            return stored ? JSON.parse(stored) : false;
        }
        catch {
            return false;
        }
    });
    const [slug, setSlug] = useState(() => {
        try {
            return localStorage.getItem('studentos_slug') || user?.name?.toLowerCase().replace(/\s+/g, '-') || 'student';
        }
        catch {
            return 'student';
        }
    });
    const [copied, setCopied] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const publicUrl = `https://studentos.app/u/${slug}`;
    useEffect(() => {
        localStorage.setItem('studentos_public', JSON.stringify(isPublic));
        localStorage.setItem('studentos_slug', slug);
    }, [isPublic, slug]);
    const copyLink = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    // Mock portfolio data for preview
    const profileData = {
        name: user?.name || 'Arnav Kumar',
        email: user?.email || 'arnav@example.com',
        title: 'Full-Stack Developer & CS Student',
        location: 'Delhi NCR, India',
        university: 'GGSIPU — B.Tech CSE',
        bio: 'Passionate about building scalable web applications. Currently learning system design and solving LeetCode to crack product-based companies.',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Tailwind CSS'],
        stats: { repos: 24, leetcode: 142, streak: 12, projects: 8 },
        timeline: [
            { date: 'Jun 2026', title: 'StudentOS Dashboard', desc: 'Built a full-stack student career management tool with AI integrations', type: 'project' },
            { date: 'May 2026', title: 'AWS Cloud Practitioner', desc: 'Passed the certification exam with a score of 860/1000', type: 'cert' },
            { date: 'Apr 2026', title: 'Vercel Frontend Intern', desc: 'Built reusable component library used by 3 product teams', type: 'work' },
            { date: 'Mar 2026', title: 'SIH 2025 Finalist', desc: 'Reached national finals with an AI-powered healthcare solution', type: 'award' },
        ],
    };
    const typeIcons = {
        project: <Code2 className="h-4 w-4 text-brand-primary"/>,
        cert: <Award className="h-4 w-4 text-brand-warning"/>,
        work: <Briefcase className="h-4 w-4 text-brand-success"/>,
        award: <Star className="h-4 w-4 text-brand-accent"/>,
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="h-6 w-6 text-brand-primary"/>
            Public Portfolio
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Create a shareable recruiter-ready profile page with a unique URL.</p>
        </div>
        <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-semibold hover:bg-brand-primary/90 transition-all shadow-sm shadow-brand-primary/20">
          <Eye className="h-4 w-4"/>
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {/* Settings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white dark:bg-bg-cardDark space-y-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500"/>
              Visibility Settings
            </h2>

            {/* Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Make Profile Public</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Recruiters and peers can view your portfolio via the link</p>
              </div>
              <button onClick={() => setIsPublic(!isPublic)} className="text-brand-primary">
                {isPublic ? <ToggleRight className="h-8 w-8"/> : <ToggleLeft className="h-8 w-8 text-slate-300"/>}
              </button>
            </div>

            {/* Slug Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5"/>
                Custom URL Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">studentos.app/u/</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-primary/40"/>
              </div>
            </div>

            {/* Public URL Copy */}
            <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Shareable URL</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-brand-primary truncate">
                  {publicUrl}
                </div>
                <button onClick={copyLink} className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                  {copied ? <Check className="h-4 w-4 text-brand-success"/> : <Copy className="h-4 w-4 text-slate-500"/>}
                </button>
              </div>
            </div>
          </div>

          {/* Share Links */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white dark:bg-bg-cardDark space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="h-4 w-4 text-slate-500"/>
              Quick Share
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {['LinkedIn', 'Twitter', 'WhatsApp', 'Email'].map((platform) => (<button key={platform} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:bg-slate-50 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-600 dark:text-zinc-300 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5"/>
                  Share on {platform}
                </button>))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <AnimatePresence>
          {showPreview && (<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white dark:bg-bg-cardDark overflow-hidden shadow-sm">
              {/* Preview Header */}
              <div className="px-4 py-2 bg-slate-100/80 dark:bg-zinc-900/80 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"/>
                  <div className="w-3 h-3 rounded-full bg-amber-400"/>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"/>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-mono text-slate-400">{publicUrl}</span>
                </div>
              </div>

              {/* Profile Preview Content */}
              <div className="p-6 space-y-5 max-h-[600px] overflow-y-auto">
                {/* Profile Header */}
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-primary/20">
                    {profileData.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{profileData.name}</h2>
                    <p className="text-xs text-brand-primary font-semibold">{profileData.title}</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/> {profileData.location}</span>
                    <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3"/> {profileData.university}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">{profileData.bio}</p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                { label: 'Repos', value: profileData.stats.repos },
                { label: 'LeetCode', value: profileData.stats.leetcode },
                { label: 'Streak', value: `${profileData.stats.streak}d` },
                { label: 'Projects', value: profileData.stats.projects },
            ].map((stat) => (<div key={stat.label} className="text-center py-2.5 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20">
                      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{stat.value}</p>
                      <p className="text-[10px] text-slate-400">{stat.label}</p>
                    </div>))}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profileData.skills.map((skill) => (<span key={skill} className="text-[10px] px-2 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-semibold border border-brand-primary/20">
                        {skill}
                      </span>))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Timeline</p>
                  <div className="space-y-3">
                    {profileData.timeline.map((item, idx) => (<div key={idx} className="flex gap-3 items-start">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                          {typeIcons[item.type]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{item.title}</p>
                            <span className="text-[10px] text-slate-400">{item.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
                        </div>
                      </div>))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 text-center">
                  <p className="text-[10px] text-slate-300 dark:text-zinc-700">Built with <span className="text-brand-primary font-semibold">StudentOS</span></p>
                </div>
              </div>
            </motion.div>)}
        </AnimatePresence>

        {!showPreview && (<div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 min-h-[400px]">
            <div className="text-center space-y-3">
              <Eye className="h-12 w-12 text-slate-200 dark:text-zinc-800 mx-auto"/>
              <p className="text-sm text-slate-400">Click "Show Preview" to see your public portfolio</p>
            </div>
          </div>)}
      </div>
    </div>);
};
export default PublicPortfolioSettings;
