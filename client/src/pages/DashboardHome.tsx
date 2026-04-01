import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Sparkles, 
  Calendar, 
  Flame, 
  TrendingUp, 
  ChevronRight,
  Loader2,
  Search,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface GithubStats {
  username: string;
  name: string;
  avatar: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  languages: { name: string; percentage: number }[];
  contributions: number[][];
}

interface LeetcodeStats {
  username: string;
  ranking: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
}

const heatmapColor = (val: number): string => {
  if (val === 0) return 'bg-slate-100 dark:bg-zinc-900/80';
  if (val === 1) return 'bg-emerald-200/70 dark:bg-emerald-950/60';
  if (val === 2) return 'bg-emerald-400/80 dark:bg-emerald-800/70';
  if (val === 3) return 'bg-emerald-500 dark:bg-emerald-600';
  return 'bg-emerald-700 dark:bg-emerald-400';
};

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  // GitHub state
  const [ghUsername, setGhUsername] = useState(() => localStorage.getItem('studentos_gh_user') || '');
  const [ghStats, setGhStats] = useState<GithubStats | null>(null);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState('');

  // LeetCode state
  const [lcUsername, setLcUsername] = useState(() => localStorage.getItem('studentos_lc_user') || '');
  const [lcStats, setLcStats] = useState<LeetcodeStats | null>(null);
  const [lcLoading, setLcLoading] = useState(false);

  // Mock fallback data (used when API is offline)
  const mockContribGrid = Array.from({ length: 7 }, () =>
    Array.from({ length: 15 }, () => Math.random() > 0.75 ? Math.floor(Math.random() * 4) + 1 : 0)
  );
  const mockLc: LeetcodeStats = {
    username: 'student',
    ranking: 125400,
    totalSolved: 142,
    easySolved: 54,
    mediumSolved: 72,
    hardSolved: 16,
    acceptanceRate: 52.4,
  };

  const fetchGithub = useCallback(async (uname: string) => {
    if (!uname.trim()) return;
    setGhLoading(true);
    setGhError('');
    localStorage.setItem('studentos_gh_user', uname);
    try {
      const res = await axios.get(`http://localhost:5001/api/integrations/github/${uname.trim()}`);
      setGhStats(res.data.stats);
    } catch (err: any) {
      console.warn('GitHub fetch failed, using mock:', err.message);
      setGhError('Could not fetch. Showing mock data.');
      setGhStats({
        username: uname,
        name: uname,
        avatar: '',
        bio: null,
        publicRepos: 24,
        followers: 85,
        languages: [
          { name: 'TypeScript', percentage: 38 },
          { name: 'JavaScript', percentage: 28 },
          { name: 'Python', percentage: 18 },
          { name: 'Go', percentage: 10 },
          { name: 'CSS', percentage: 6 },
        ],
        contributions: mockContribGrid,
      });
    } finally {
      setGhLoading(false);
    }
  }, []);

  const fetchLeetcode = useCallback(async (uname: string) => {
    if (!uname.trim()) return;
    setLcLoading(true);
    localStorage.setItem('studentos_lc_user', uname);
    try {
      const res = await axios.get(`http://localhost:5001/api/integrations/leetcode/${uname.trim()}`);
      setLcStats(res.data.stats);
    } catch {
      setLcStats({ ...mockLc, username: uname });
    } finally {
      setLcLoading(false);
    }
  }, []);

  // Auto-fetch on mount if usernames are saved
  useEffect(() => {
    if (ghUsername) fetchGithub(ghUsername);
    if (lcUsername) fetchLeetcode(lcUsername);
  }, []);

  const currentLc = lcStats || mockLc;
  const currentContribGrid = ghStats?.contributions || mockContribGrid;

  const upcomingDeadlines = [
    { id: 1, title: 'Vercel Front End Application', date: 'Jun 28, 2026', type: 'Job application' },
    { id: 2, title: 'Stripe Intern Prep Mock Session', date: 'Jul 01, 2026', type: 'Interview' },
    { id: 3, title: 'AWS Cloud Practitioner Exam', date: 'Jul 05, 2026', type: 'Certification' },
  ];

  const aiTips = [
    { title: 'Resume ATS boost', desc: 'Reword "Helped set up docker" to "Orchestrated containerized node deployment across AWS scaling infrastructure" for 15% better match rate.', label: 'Resume' },
    { title: 'Leetcode pattern suggestion', desc: "You haven't solved DP problems in 8 days. Revise DFS/BFS tree-based patterns before Stripe interview.", label: 'Practice' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back, {user?.name || 'Student'}</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Here's your academic and career progress outline for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-bg-cardDark text-xs font-semibold">
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
            <span>0 Day Streak</span>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-primary text-white rounded-xl text-xs font-semibold hover:bg-brand-primary/90 transition-all shadow-sm shadow-brand-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            Optimize Bio
          </button>
        </div>
      </div>

      {/* Main Grid Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Completion Gauge */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Profile Status</span>
              <span className="text-xs font-bold text-slate-400">0% Complete</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden mb-4">
              <div className="h-full w-0 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-700" />
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">Fill in your profile, add skills, and link your GitHub & LeetCode to unlock full features.</p>
          </div>
          <button className="mt-4 flex items-center gap-1 text-xs text-brand-primary hover:underline font-semibold text-left">
            Complete details <ChevronRight className="h-3 w-3" />
          </button>
        </motion.div>

        {/* Resume Score widget */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Resume ATS Score</span>
              <span className="text-xs font-bold text-slate-400">Not analyzed</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <svg className="w-16 h-16">
                  <circle className="text-slate-100 dark:text-zinc-900" strokeWidth="6" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32" />
                  <circle className="text-slate-300 dark:text-zinc-700" strokeWidth="6" strokeDasharray="163" strokeDashoffset={163} strokeLinecap="round" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32" />
                </svg>
                <span className="absolute text-sm font-bold text-slate-400">—</span>
              </div>
              <div className="text-xs space-y-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-200">No resume uploaded yet</p>
                <p className="text-slate-500 dark:text-zinc-400">Go to Resume Builder to create and analyze your resume with AI.</p>
              </div>
            </div>
          </div>
          <button className="mt-4 flex items-center gap-1 text-xs text-brand-primary hover:underline font-semibold text-left">
            Optimize Resume in Builder <ChevronRight className="h-3 w-3" />
          </button>
        </motion.div>

        {/* LeetCode Stats — Real API */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300"
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">LeetCode Tracker</span>
              {lcStats && (
                <span className="text-[10px] font-bold text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-full border border-brand-success/20">Live</span>
              )}
            </div>
            {/* Username Input */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="LeetCode username"
                  value={lcUsername}
                  onChange={(e) => setLcUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchLeetcode(lcUsername)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary/40"
                />
              </div>
              <button
                onClick={() => fetchLeetcode(lcUsername)}
                disabled={lcLoading}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-500 transition-colors"
              >
                {lcLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-slate-700 dark:text-zinc-300">{currentLc.totalSolved} Solved</span>
              <span className="text-slate-400">Rank #{currentLc.ranking?.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-500 font-semibold">Easy: {currentLc.easySolved}</span>
                <span className="text-amber-500 font-semibold">Medium: {currentLc.mediumSolved}</span>
                <span className="text-rose-500 font-semibold">Hard: {currentLc.hardSolved}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-900 rounded-full flex overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${(currentLc.easySolved / Math.max(currentLc.totalSolved, 1)) * 100}%` }} />
                <div className="h-full bg-amber-500" style={{ width: `${(currentLc.mediumSolved / Math.max(currentLc.totalSolved, 1)) * 100}%` }} />
                <div className="h-full bg-rose-500 rounded-r-full" style={{ width: `${(currentLc.hardSolved / Math.max(currentLc.totalSolved, 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section Title: Performance Summary */}
      <div className="flex items-center gap-2.5 pt-4">
        <div className="w-1 h-5 bg-brand-primary rounded-full" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase tracking-wider">Performance Summary</h2>
      </div>

      {/* GitHub Contributions — Real API */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl lg:col-span-2 space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <GithubIcon className="h-5 w-5 text-slate-900 dark:text-white" />
              <h3 className="text-sm font-semibold">GitHub Contributions</h3>
              {ghStats && !ghError && (
                <span className="text-[10px] font-bold text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-full border border-brand-success/20">Live</span>
              )}
            </div>
            {/* GitHub Username Input */}
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="GitHub username"
                  value={ghUsername}
                  onChange={(e) => setGhUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchGithub(ghUsername)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary/40 w-44"
                />
              </div>
              <button
                onClick={() => fetchGithub(ghUsername)}
                disabled={ghLoading}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-500 transition-colors"
              >
                {ghLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* GitHub Profile Preview */}
          {ghStats && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20">
              {ghStats.avatar && (
                <img src={ghStats.avatar} alt={ghStats.name} className="h-10 w-10 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{ghStats.name}</p>
                <p className="text-[10px] text-slate-400 truncate">@{ghStats.username} · {ghStats.publicRepos} repos · {ghStats.followers} followers</p>
              </div>
              <a href={`https://github.com/${ghStats.username}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-primary transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Contributions Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[500px]">
              {currentContribGrid.flat().map((val, idx) => (
                <div key={idx} className={`w-3.5 h-3.5 rounded-sm ${heatmapColor(val)} transition-colors`} />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Less</span>
            <div className="flex gap-1 items-center">
              <div className="w-2.5 h-2.5 bg-slate-100 dark:bg-zinc-900 rounded-sm" />
              <div className="w-2.5 h-2.5 bg-emerald-200 dark:bg-emerald-950 rounded-sm" />
              <div className="w-2.5 h-2.5 bg-emerald-400 dark:bg-emerald-800 rounded-sm" />
              <div className="w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-600 rounded-sm" />
              <div className="w-2.5 h-2.5 bg-emerald-700 dark:bg-emerald-400 rounded-sm" />
            </div>
            <span>More</span>
          </div>

          {/* Languages Breakdown */}
          {ghStats && ghStats.languages.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-900">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Languages</span>
              <div className="h-2.5 w-full rounded-full flex overflow-hidden">
                {ghStats.languages.map((lang, idx) => {
                  const colors = ['bg-brand-primary', 'bg-brand-accent', 'bg-brand-success', 'bg-brand-warning', 'bg-brand-danger'];
                  return <div key={lang.name} className={`h-full ${colors[idx % colors.length]}`} style={{ width: `${lang.percentage}%` }} />;
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {ghStats.languages.map((lang, idx) => {
                  const dotColors = ['bg-brand-primary', 'bg-brand-accent', 'bg-brand-success', 'bg-brand-warning', 'bg-brand-danger'];
                  return (
                    <span key={lang.name} className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                      <span className={`h-2 w-2 rounded-full ${dotColors[idx % dotColors.length]}`} />
                      {lang.name} <span className="font-bold text-slate-700 dark:text-zinc-300">{lang.percentage}%</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Deadlines Widget */}
        <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-600 dark:text-zinc-400" />
            <h3 className="text-sm font-semibold">Upcoming Deadlines</h3>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex justify-between items-start text-xs border-b border-slate-100 dark:border-zinc-900/60 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-zinc-200">{deadline.title}</p>
                  <p className="text-[10px] text-slate-400">{deadline.type}</p>
                </div>
                <span className="text-[10px] font-semibold text-brand-primary px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 shrink-0">{deadline.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Performance recommendations */}
      <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-accent" />
          <h3 className="text-sm font-semibold">AI Insights & Optimization Feedback</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiTips.map((tip, index) => (
            <div key={index} className="p-4 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-accent">{tip.title}</span>
                <span className="text-[10px] text-slate-400 bg-slate-200/50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{tip.label}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
