import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Sparkles, 
  Calendar, 
  Flame, 
  ChevronRight, 
  Loader2, 
  Search, 
  RefreshCw, 
  ExternalLink,
  Trophy,
  Target,
  Zap,
  Activity,
  CheckCircle,
  Briefcase,
  BookOpen,
  Clock,
  TrendingUp
} from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LeetcodeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const heatmapColor = (val) => {
  if (val === 0) return 'bg-slate-100 dark:bg-zinc-900/60 border border-slate-200/20 dark:border-zinc-800/30';
  if (val === 1) return 'bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/10 dark:border-emerald-900/20';
  if (val === 2) return 'bg-emerald-300 dark:bg-emerald-800/50 border border-emerald-400/20';
  if (val === 3) return 'bg-emerald-500 dark:bg-emerald-600/70';
  return 'bg-emerald-600 dark:bg-emerald-400';
};

const DashboardHome = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace' | 'readiness' | 'skillgap' | 'mentor'
  
  // GitHub state
  const [ghUsername, setGhUsername] = useState(() => localStorage.getItem('studentos_gh_user') || '');
  const [ghStats, setGhStats] = useState(null);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState('');

  // LeetCode state
  const [lcUsername, setLcUsername] = useState(() => localStorage.getItem('studentos_lc_user') || '');
  const [lcStats, setLcStats] = useState(null);
  const [lcLoading, setLcLoading] = useState(false);

  // Mock fallback data
  const mockContribGrid = Array.from({ length: 7 }, () => 
    Array.from({ length: 15 }, () => Math.random() > 0.75 ? Math.floor(Math.random() * 4) : 0)
  );

  const mockLc = {
    username: 'student',
    ranking: 125400,
    totalSolved: 142,
    easySolved: 54,
    mediumSolved: 72,
    hardSolved: 16,
    acceptanceRate: 52.4,
  };

  const fetchGithub = useCallback(async (uname) => {
    if (!uname.trim()) return;
    setGhLoading(true);
    setGhError('');
    localStorage.setItem('studentos_gh_user', uname);
    try {
      const res = await axios.get(`http://localhost:5001/api/integrations/github/${uname.trim()}`);
      setGhStats(res.data.stats);
    } catch (err) {
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

  const fetchLeetcode = useCallback(async (uname) => {
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

  // Auto-fetch on mount if usernames exist
  useEffect(() => {
    if (ghUsername) fetchGithub(ghUsername);
    if (lcUsername) fetchLeetcode(lcUsername);
  }, []);

  const currentLc = lcStats || mockLc;
  const currentContribGrid = ghStats?.contributions || mockContribGrid;
  const calculatedCommits = ghStats ? (currentContribGrid.flat().reduce((a, b) => a + b, 0) * 12 + 120) : 342;
  const lcSolvedVal = currentLc.solved || currentLc.totalSolved || 0;
  const dynamicLcScore = Math.min(25, Math.max(10, Math.floor(lcSolvedVal / 4)));
  const dynamicGhScore = Math.min(15, Math.max(8, Math.floor(calculatedCommits / 25)));
  const dynamicResumeScore = 20;
  const dynamicInterviewScore = 15;
  const dynamicReadinessSum = dynamicResumeScore + dynamicGhScore + dynamicLcScore + dynamicInterviewScore;

  const upcomingDeadlines = [
    { id: 1, title: 'Vercel Front End Application', date: 'Jun 28, 2026', type: 'Job Application', priority: 'High' },
    { id: 2, title: 'Stripe Intern Prep Mock Session', date: 'Jul 01, 2026', type: 'AI Interview', priority: 'High' },
    { id: 3, title: 'AWS Cloud Practitioner Exam', date: 'Jul 05, 2026', type: 'Certification', priority: 'Medium' },
  ];

  const aiTips = [
    { 
      title: 'Resume ATS Boost', 
      desc: 'Reword "Helped set up docker" to "Orchestrated containerized node deployment across AWS scaling infrastructure" for 15% better match rate.', 
      label: 'Resume', 
      icon: Sparkles,
      color: 'border-l-brand-cyberPink text-brand-cyberPink' 
    },
    { 
      title: 'Leetcode Pattern Recommendation', 
      desc: "You haven't solved Dynamic Programming problems in 8 days. Revise DFS/BFS tree-based patterns before your Stripe interview.", 
      label: 'Practice', 
      icon: Target,
      color: 'border-l-[#8B5CF6] text-[#8B5CF6]' 
    },
  ];

  // --- 1. Skill Gap State ---
  const [targetRole, setTargetRole] = useState('Fullstack Developer');
  const roleSkills = {
    'Fullstack Developer': {
      current: ['React', 'Node.js', 'Express', 'JavaScript', 'MongoDB', 'HTML/CSS'],
      missing: ['Docker', 'AWS S3/EC2', 'CI/CD Pipelines', 'TypeScript', 'Redis']
    },
    'DevOps Cloud Engineer': {
      current: ['Node.js', 'Linux Basics', 'Git'],
      missing: ['Terraform', 'Kubernetes', 'Docker', 'AWS CloudFormation', 'Jenkins CI/CD', 'Prometheus/Grafana']
    },
    'AI / ML Engineer': {
      current: ['Python', 'SQL', 'JavaScript'],
      missing: ['PyTorch / TensorFlow', 'Pandas / NumPy', 'Scikit-Learn', 'Gemini / OpenAI API Integration', 'Vector Databases (Pinecone)']
    },
    'Mobile App Developer': {
      current: ['React', 'JavaScript', 'CSS'],
      missing: ['React Native', 'Swift / Kotlin', 'App Store / Play Store deployment', 'Redux State Management']
    }
  };

  const [loadingGap, setLoadingGap] = useState(false);
  const [gapAnalyzed, setGapAnalyzed] = useState(false);

  const analyzeGap = () => {
    setLoadingGap(true);
    setTimeout(() => {
      setLoadingGap(false);
      setGapAnalyzed(true);
    }, 1200);
  };

  // --- 2. AI Mentor State ---
  const [mentorGPA, setMentorGPA] = useState('8.5');
  const [mentorRole, setMentorRole] = useState('Fullstack Developer');
  const [mentorDays, setMentorDays] = useState('60');
  const [loadingMentor, setLoadingMentor] = useState(false);
  const [mentorPlan, setMentorPlan] = useState(null);

  const generateMentorPlan = () => {
    setLoadingMentor(true);
    setTimeout(() => {
      setLoadingMentor(false);
      setMentorPlan([
        { week: 'Week 1-2: Data Structures & Algorithms', tasks: ['Master Arrays & String manipulation on LeetCode', 'Solve 15 Easy & 5 Medium problems', 'Revise Big-O complexity time & space trade-offs'] },
        { week: 'Week 3-4: Tech Stack Deep Dive', tasks: ['Integrate TypeScript into current React/Node workspace', 'Implement Docker containerization for server deployment', 'Study database indexing on MongoDB'] },
        { week: 'Week 5-6: System Design & Project Build', tasks: ['Build a real-time notification engine with Socket.io', 'Analyze performance bottlenecks and add Redis caching layers', 'Publish project live on GitHub with optimized README'] },
        { week: 'Week 7-8: ATS Mock Drills & Applying', tasks: ['Complete 2 AI conversational mock interview rounds in AI Hub', 'Get Resume ATS score above 90 using resume optimization tips', 'Track at least 10 targeted job applications in Job Tracker'] },
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Redesigned Hero Header Section */}
      <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden glass-vision-pro flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-brand-primary/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[150px] bg-brand-cyberPink/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="space-y-2.5 z-10 text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Arnav'} ⚡
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Placement Readiness:</span>
            <span className="px-3 py-1 text-xs font-black bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 rounded-full">
              74% Score
            </span>
          </div>
        </div>

        {/* LeetCode Goals Progress bar */}
        <div className="z-10 w-full lg:max-w-xs space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-800 dark:text-zinc-200">Goal: 200 LeetCode Problems</span>
            <span className="text-slate-400">58 Remaining</span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-slate-200/10 dark:border-white/5">
            <div className="h-full bg-gradient-to-r from-[#F59E0B] to-amber-500 rounded-full" style={{ width: '71%' }} />
          </div>
        </div>
      </div>

      {/* Main KPI Cards Area (Top) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Streak card (Orange) */}
        <div className="glass-vision-pro p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#F59E0B]/30 transition-all border-l-3 border-l-[#F59E0B] text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-heading">Current Streak</span>
            <div className="p-1.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] shrink-0">
              <Flame className="h-4 w-4 fill-[#F59E0B]/10 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">5 Days</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Grind Active</p>
          </div>
        </div>

        {/* Applications card (Blue) */}
        <div className="glass-vision-pro p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all border-l-3 border-l-blue-500 text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-heading">Applications</span>
            <div className="p-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0">
              <Briefcase className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">12 Active</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">3 in Interviewing</p>
          </div>
        </div>

        {/* Study Hours card (Green) */}
        <div className="glass-vision-pro p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#10B981]/30 transition-all border-l-3 border-l-[#10B981] text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-heading">Study Hours</span>
            <div className="p-1.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] shrink-0">
              <Clock className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">28h <span className="text-[10px] font-bold text-[#10B981]">/ wk</span></p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pomodoro synced</p>
          </div>
        </div>

        {/* Readiness Score card (Purple) */}
        <div className="glass-vision-pro p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#8B5CF6]/30 transition-all border-l-3 border-l-[#8B5CF6] text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-heading">Readiness Score</span>
            <div className="p-1.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] shrink-0">
              <Trophy className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">{dynamicReadinessSum}%</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Target: 90% (Google)</p>
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-950/80 border border-slate-200/50 dark:border-zinc-900/50 max-w-fit shadow-inner">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'workspace'
              ? 'bg-white dark:bg-zinc-900 text-[#8B5CF6] dark:text-emerald-400 shadow-md'
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          Grindspace
        </button>
        <button
          onClick={() => setActiveTab('readiness')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'readiness'
              ? 'bg-white dark:bg-zinc-900 text-[#8B5CF6] dark:text-emerald-400 shadow-md'
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          Placement Audit 🏆
        </button>
        <button
          onClick={() => setActiveTab('skillgap')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'skillgap'
              ? 'bg-white dark:bg-zinc-900 text-[#8B5CF6] dark:text-emerald-400 shadow-md'
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          Skill Gap Analyzer 🔍
        </button>
        <button
          onClick={() => setActiveTab('mentor')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'mentor'
              ? 'bg-white dark:bg-zinc-900 text-[#8B5CF6] dark:text-emerald-400 shadow-md'
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          AI Career Mentor 🤖
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          
          {/* TAB 1: Core Grindspace */}
          {activeTab === 'workspace' && (
            <div className="space-y-8">
              
              {/* LeetCode & GitHub Panels (Color balanced) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* LeetCode stats Card (Amber/Yellow Theme) */}
                <div className="glass-vision-pro p-6 rounded-3xl flex flex-col justify-between shadow-lg hover:border-[#F59E0B]/30 transition-all duration-300 relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/5 blur-2xl rounded-full pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-heading flex items-center gap-1.5">
                        <LeetcodeIcon className="h-4.5 w-4.5 text-[#F59E0B]" />
                        LeetCode Tracker
                      </span>
                      <span className="text-[10px] font-black text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-xl border border-[#F59E0B]/20">
                        Contest Rating: {currentLc.contestRating ? currentLc.contestRating : 'Unrated'}
                      </span>
                    </div>

                    {/* Search Field */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="LeetCode username" 
                          value={lcUsername} 
                          onChange={(e) => setLcUsername(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && fetchLeetcode(lcUsername)} 
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 text-xs focus:outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all duration-300 font-semibold"
                        />
                      </div>
                      <button 
                        onClick={() => fetchLeetcode(lcUsername)} 
                        disabled={lcLoading} 
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white hover:bg-slate-50 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-slate-500 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                      >
                        {lcLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-6 pt-1">
                      {/* Circular Progress Ring */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle className="text-slate-100 dark:text-zinc-900" strokeWidth="8" stroke="currentColor" fill="transparent" r="38" cx="48" cy="48"/>
                          <circle className="text-[#F59E0B]" strokeWidth="8" strokeDasharray="238" strokeDashoffset={238 - (238 * currentLc.totalSolved) / 300} strokeLinecap="round" stroke="currentColor" fill="transparent" r="38" cx="48" cy="48"/>
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-lg font-black text-slate-900 dark:text-white font-heading">{currentLc.totalSolved}</span>
                          <span className="text-[9px] text-slate-400 font-bold block leading-none">Solved</span>
                        </div>
                      </div>

                      {/* Difficulty breakdown */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-emerald-400 flex items-center gap-1">Easy: <span className="font-extrabold text-slate-800 dark:text-zinc-200">{currentLc.easySolved}</span></span>
                          <span className="text-amber-400 flex items-center gap-1">Med: <span className="font-extrabold text-slate-800 dark:text-zinc-200">{currentLc.mediumSolved}</span></span>
                          <span className="text-rose-500 flex items-center gap-1">Hard: <span className="font-extrabold text-slate-800 dark:text-zinc-200">{currentLc.hardSolved}</span></span>
                        </div>
                        
                        <div className="space-y-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                          <div className="flex justify-between">
                            <span>Leetcode Streak</span>
                            <span className="text-amber-500">12 Days 🔥</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Global Rank</span>
                            <span className="text-slate-200">#{currentLc.ranking?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GitHub Contribution Panel (Emerald/Green Theme) */}
                <div className="glass-vision-pro p-6 rounded-3xl space-y-5 shadow-lg hover:border-[#10B981]/30 transition-all duration-300 relative overflow-hidden text-left">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#10B981]/5 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center border border-slate-200/10 dark:border-white/5">
                        <GithubIcon className="h-4.5 w-4.5 text-[#10B981]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black font-heading text-slate-900 dark:text-white">GitHub Tracker</h3>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Commits: {calculatedCommits}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="GitHub username" 
                          value={ghUsername} 
                          onChange={(e) => setGhUsername(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && fetchGithub(ghUsername)} 
                          className="pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 text-xs focus:outline-none focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10 transition-all duration-300 font-semibold w-36"
                        />
                      </div>
                      <button 
                        onClick={() => fetchGithub(ghUsername)} 
                        disabled={ghLoading} 
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white hover:bg-slate-50 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-slate-500 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                      >
                        {ghLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Contributions Grid */}
                  <div className="overflow-x-auto pb-2 pt-1 font-sans">
                    <div className="flex flex-col gap-2 min-w-[390px]">
                      {/* Months Header row */}
                      <div className="flex pl-8 text-[9px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider justify-between pr-4 select-none">
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                      </div>
                      
                      <div className="flex gap-2.5">
                        {/* Days Labels on Left */}
                        <div className="flex flex-col justify-between text-[8px] text-slate-400 dark:text-zinc-500 font-black py-0.5 select-none w-6 text-right shrink-0">
                          <span>Mon</span>
                          <span className="opacity-0">Tue</span>
                          <span>Wed</span>
                          <span className="opacity-0">Thu</span>
                          <span>Fri</span>
                          <span className="opacity-0">Sat</span>
                          <span className="opacity-0">Sun</span>
                        </div>

                        {/* Grid Columns */}
                        <div className="grid grid-flow-col grid-rows-7 gap-1 flex-1">
                          {currentContribGrid.flat().slice(0, 70).map((val, idx) => (
                            <div key={idx} className={`w-3.5 h-3.5 rounded-[3px] ${heatmapColor(val)} transition-all duration-300 hover:scale-115`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Less</span>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2.5 h-2.5 bg-slate-100 dark:bg-zinc-900 rounded-[3px]" />
                      <div className="w-2.5 h-2.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-[3px]" />
                      <div className="w-2.5 h-2.5 bg-emerald-300 dark:bg-emerald-800/50 rounded-[3px]" />
                      <div className="w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-600/70 rounded-[3px]" />
                      <div className="w-2.5 h-2.5 bg-emerald-600 dark:bg-emerald-400 rounded-[3px]" />
                    </div>
                    <span>More</span>
                  </div>
                </div>

              </div>

              {/* Deadlines & AI Insights Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Deadlines Widget */}
                <div className="p-6 rounded-3xl glass-vision-pro space-y-4 shadow-lg hover:border-[#8B5CF6]/30 transition-all duration-300 relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B5CF6]/5 blur-2xl rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-8 w-8 rounded-xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center border border-slate-200/10 dark:border-white/5">
                      <Calendar className="h-4.5 w-4.5 text-slate-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black font-heading text-slate-900 dark:text-white">Upcoming Deadlines</h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Milestones</p>
                    </div>
                  </div>
                  <div className="space-y-3.5">
                    {upcomingDeadlines.map((deadline) => (
                      <div 
                        key={deadline.id} 
                        className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-900/40 bg-slate-50/20 dark:bg-zinc-900/10 hover:border-[#8B5CF6]/10 transition-all"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-extrabold text-slate-800 dark:text-zinc-200 text-xs truncate">{deadline.title}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{deadline.type}</span>
                            <span className="text-[8px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider bg-rose-500/10 text-rose-500">
                              {deadline.priority}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-[#8B5CF6] dark:text-[#8B5CF6] px-2.5 py-1.5 rounded-xl bg-[#8B5CF6]/8 dark:bg-[#8B5CF6]/15 border border-[#8B5CF6]/15 shrink-0 shadow-sm">
                          {deadline.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights & Feedback (Purple Theme) */}
                <div className="p-6 rounded-3xl glass-vision-pro lg:col-span-2 space-y-5 shadow-lg hover:border-[#8B5CF6]/30 transition-all duration-300 relative overflow-hidden text-left">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-brand-violet/5 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center border border-slate-200/10 dark:border-white/5">
                      <Sparkles className="h-4.5 w-4.5 text-[#8B5CF6] animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black font-heading text-slate-900 dark:text-white">AI Insights & Optimization Feedback</h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Performance Engine</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiTips.map((tip, index) => (
                      <div 
                        key={index} 
                        className={`p-5 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/10 space-y-3.5 border-l-4 ${tip.color}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <tip.icon className="h-4 w-4" />
                            <span className="text-xs font-black text-slate-900 dark:text-white">{tip.title}</span>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-200/50 dark:bg-zinc-800 px-2.5 py-1 rounded-xl">
                            {tip.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold">
                          {tip.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Placement Audit (Readiness Score Audit) */}
          {activeTab === 'readiness' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* Score Circle Card (Green/Emerald Theme) */}
                <div className="glass-vision-pro p-8 rounded-3xl shadow-lg text-center flex flex-col justify-center items-center gap-4 relative text-left">
                  <div className="absolute inset-0 bg-radial-gradient from-brand-primary/10 via-transparent to-transparent pointer-events-none" />
                  <span className="text-xs uppercase font-black text-slate-400 tracking-widest">Composite Readiness</span>
                  
                  <div className="relative flex items-center justify-center">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle className="text-slate-100 dark:text-zinc-900" strokeWidth="10" stroke="currentColor" fill="transparent" r="64" cx="80" cy="80"/>
                      <circle className="text-[#10B981]" strokeWidth="10" strokeDasharray="402" strokeDashoffset={402 - (402 * dynamicReadinessSum) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="64" cx="80" cy="80"/>
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-5xl font-black text-slate-900 dark:text-white font-heading">{dynamicReadinessSum}</span>
                      <span className="text-slate-400 font-bold block text-xs mt-0.5">/ 100 XP</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <p className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">SDE Ready Status</p>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                      Your technical baseline is solid. Solve LeetCode problems to cross Google threshold target (90%).
                    </p>
                  </div>
                </div>

                {/* Score Audit Categories */}
                <div className="lg:col-span-2 glass-vision-pro p-8 rounded-3xl shadow-lg flex flex-col justify-between text-left">
                  <div className="space-y-5">
                    <h3 className="text-sm font-black font-heading uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                      <Trophy className="h-4.5 w-4.5 text-[#8B5CF6]" />
                      Readiness Breakdown & Audit
                    </h3>

                    <div className="space-y-4">
                      {/* Resume score */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-zinc-300">Resume Optimization (ATS)</span>
                          <span className="text-[#10B981] font-black">{dynamicResumeScore} / 25</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${(dynamicResumeScore / 25) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">⚠️ Suggestion: Replace personal photo and add quantified performance metrics in projects section.</p>
                      </div>

                      {/* GitHub contributions */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-zinc-300">GitHub Open Source Footprint</span>
                          <span className="text-[#10B981] font-black">{dynamicGhScore} / 15</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${(dynamicGhScore / 15) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">⚠️ Suggestion: Pin your top 3 repositories and write high-quality README profiles.</p>
                      </div>

                      {/* DSA Solving */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-zinc-300">LeetCode DSA Baseline</span>
                          <span className="text-[#F59E0B] font-black">{dynamicLcScore} / 25</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${(dynamicLcScore / 25) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">⚠️ Suggestion: Solve 10 more Medium difficulty trees/graphs questions.</p>
                      </div>

                      {/* Interview Prep */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-zinc-300">AI Mock Interview Rounds</span>
                          <span className="text-[#8B5CF6] font-black">{dynamicInterviewScore} / 20</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${(dynamicInterviewScore / 20) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">⚠️ Suggestion: Complete 1 full conversational mock session under AI Hub.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Skill Gap Analyzer */}
          {activeTab === 'skillgap' && (
            <div className="glass-vision-pro p-8 rounded-3xl shadow-lg space-y-6 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-900 pb-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-black font-heading uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="h-4.5 w-4.5 text-brand-primary" />
                    Target Role Gap Analyzer
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">Select your dream position to analyze missing skills against your current profile.</p>
                </div>
                
                {/* Role Dropdown */}
                <select 
                  value={targetRole} 
                  onChange={(e) => {
                    setTargetRole(e.target.value);
                    setGapAnalyzed(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <option value="Fullstack Developer">Fullstack Developer</option>
                  <option value="DevOps Cloud Engineer">DevOps Cloud Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="Mobile App Developer">Mobile App Developer</option>
                </select>
              </div>

              {/* Analysis Trigger Zone */}
              {!gapAnalyzed ? (
                <div className="py-12 text-center space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 text-brand-primary mx-auto flex items-center justify-center">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 max-w-sm mx-auto">
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">Run Target Profile Compare</p>
                    <p className="text-xs text-slate-400 font-medium">We will audit your resume, profile bio, and github languages against standard {targetRole} requirements.</p>
                  </div>
                  <button 
                    onClick={analyzeGap}
                    disabled={loadingGap}
                    className="flex items-center gap-1.5 mx-auto px-5 py-3 bg-brand-primary hover:opacity-95 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-brand-primary/10 transition-all cursor-pointer active:scale-98"
                  >
                    {loadingGap ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {loadingGap ? 'Analyzing Gap...' : 'Compare Skills Now'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Matching & Gaps Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matching skills */}
                    <div className="p-5 rounded-2xl border border-emerald-500/10 dark:border-emerald-500/20 bg-emerald-500/[0.02] space-y-3">
                      <span className="text-[10px] uppercase font-black text-[#10B981] tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" />
                        Current Matching Skills ({roleSkills[targetRole].current.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {roleSkills[targetRole].current.map(skill => (
                          <span key={skill} className="px-3 py-1.5 rounded-xl bg-[#10B981]/8 text-[#10B981] text-xs font-bold border border-[#10B981]/25">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing skills */}
                    <div className="p-5 rounded-2xl border border-rose-500/10 dark:border-rose-500/20 bg-rose-500/[0.02] space-y-3">
                      <span className="text-[10px] uppercase font-black text-rose-500 tracking-wider flex items-center gap-1.5 animate-pulse">
                        <Flame className="h-4 w-4" />
                        Missing Gap Skills ({roleSkills[targetRole].missing.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {roleSkills[targetRole].missing.map(skill => (
                          <span key={skill} className="px-3 py-1.5 rounded-xl bg-rose-500/8 text-rose-500 text-xs font-bold border border-rose-500/25">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-left space-y-0.5">
                      <p className="text-xs font-black text-slate-800 dark:text-zinc-200">Recommended learning path available</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Generate a localized step-by-step roadmap to fill the gaps in this stack.</p>
                    </div>
                    <button 
                      onClick={() => navigate('/dashboard/ai')}
                      className="px-4 py-2 bg-gradient-to-r from-brand-primary to-[#8B5CF6] text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02] shrink-0"
                    >
                      Generate AI Roadmap
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 4: AI Career Mentor */}
          {activeTab === 'mentor' && (
            <div className="glass-vision-pro p-8 rounded-3xl shadow-lg space-y-6 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#8B5CF6]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-900/60 pb-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-black font-heading uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="h-4.5 w-4.5 text-[#8B5CF6]" />
                    AI Career Advisor & Mentor
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">Input your goals to build a week-by-week personalized preparation sprint.</p>
                </div>
              </div>

              {/* Input Forms */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Current CGPA/GPA</label>
                  <input 
                    type="text" 
                    value={mentorGPA}
                    onChange={(e) => setMentorPlan(null) || setMentorGPA(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Target Job/Role</label>
                  <input 
                    type="text" 
                    value={mentorRole}
                    onChange={(e) => setMentorPlan(null) || setMentorRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Sprint Duration (Days)</label>
                  <select 
                    value={mentorDays}
                    onChange={(e) => setMentorPlan(null) || setMentorDays(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="30">30 Days Sprint</option>
                    <option value="60">60 Days Sprint</option>
                    <option value="90">90 Days Sprint</option>
                  </select>
                </div>
              </div>

              <div className="text-center pt-2">
                <button 
                  onClick={generateMentorPlan}
                  disabled={loadingMentor}
                  className="flex items-center gap-1.5 mx-auto px-5 py-3 bg-brand-primary hover:opacity-95 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-brand-primary/10 transition-all cursor-pointer active:scale-98"
                >
                  {loadingMentor ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {loadingMentor ? 'Structuring Sprint...' : 'Generate 60-Day Sprint'}
                </button>
              </div>

              {/* Sprint Outputs */}
              {mentorPlan && (
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-900/60 animate-fadeIn">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 dark:text-zinc-500 mb-4 text-left">Generated Preparation Roadmap</h4>
                  
                  <div className="space-y-4">
                    {mentorPlan.map((weekData, wIdx) => (
                      <div 
                        key={wIdx} 
                        className="p-5 rounded-2xl border border-slate-100 dark:border-zinc-900/60 bg-slate-50/20 dark:bg-zinc-900/20 text-left space-y-3"
                      >
                        <div className="flex items-center gap-2 text-[#8B5CF6]">
                          <Calendar className="h-4.5 w-4.5" />
                          <span className="text-xs font-black">{weekData.week}</span>
                        </div>
                        <div className="space-y-2 pl-6">
                          {weekData.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-zinc-300">
                              <div className="h-1.5 w-1.5 rounded-full bg-brand-cyberPink" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default DashboardHome;
