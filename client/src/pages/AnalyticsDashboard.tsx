import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Target,
  Flame,
  Calendar,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const weeklyProgress = [
  { week: 'W1', applications: 3, interviews: 0, leetcode: 8, resumeScore: 62 },
  { week: 'W2', applications: 5, interviews: 1, leetcode: 14, resumeScore: 68 },
  { week: 'W3', applications: 7, interviews: 2, leetcode: 22, resumeScore: 74 },
  { week: 'W4', applications: 4, interviews: 3, leetcode: 31, resumeScore: 79 },
  { week: 'W5', applications: 8, interviews: 2, leetcode: 38, resumeScore: 82 },
  { week: 'W6', applications: 6, interviews: 4, leetcode: 45, resumeScore: 86 },
  { week: 'W7', applications: 9, interviews: 3, leetcode: 54, resumeScore: 88 },
  { week: 'W8', applications: 5, interviews: 5, leetcode: 62, resumeScore: 91 },
];

const applicationPipeline = [
  { name: 'Wishlist', value: 12, color: '#8B5CF6' },
  { name: 'Applied', value: 18, color: '#4F46E5' },
  { name: 'Interview', value: 7, color: '#F59E0B' },
  { name: 'Offer', value: 3, color: '#10B981' },
  { name: 'Rejected', value: 5, color: '#EF4444' },
];

const skillGrowth = [
  { skill: 'React', before: 65, after: 88 },
  { skill: 'TypeScript', before: 45, after: 78 },
  { skill: 'Node.js', before: 55, after: 82 },
  { skill: 'System Design', before: 30, after: 65 },
  { skill: 'SQL', before: 50, after: 72 },
  { skill: 'Docker', before: 20, after: 58 },
];

const interviewScores = [
  { session: 'Mock 1', score: 54, confidence: 40 },
  { session: 'Mock 2', score: 62, confidence: 55 },
  { session: 'Mock 3', score: 71, confidence: 60 },
  { session: 'Mock 4', score: 68, confidence: 65 },
  { session: 'Mock 5', score: 78, confidence: 72 },
  { session: 'Mock 6', score: 82, confidence: 78 },
  { session: 'Mock 7', score: 85, confidence: 82 },
  { session: 'Mock 8', score: 91, confidence: 88 },
];

const monthlyActivity = [
  { month: 'Jan', commits: 42, problems: 18, docs: 3 },
  { month: 'Feb', commits: 58, problems: 24, docs: 5 },
  { month: 'Mar', commits: 73, problems: 31, docs: 4 },
  { month: 'Apr', commits: 65, problems: 28, docs: 7 },
  { month: 'May', commits: 89, problems: 35, docs: 6 },
  { month: 'Jun', commits: 102, problems: 42, docs: 8 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-bold text-slate-800 dark:text-zinc-200 mb-1.5">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500 dark:text-zinc-400">{entry.name}:</span>
          <span className="font-bold text-slate-800 dark:text-zinc-200">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'8w' | '6m' | 'all'>('8w');

  const statCards = [
    { label: 'Applications Sent', value: '47', change: '+12', up: true, icon: Target, color: 'text-brand-primary' },
    { label: 'Interview Rate', value: '34%', change: '+8%', up: true, icon: TrendingUp, color: 'text-brand-success' },
    { label: 'Avg Interview Score', value: '82', change: '+14', up: true, icon: Award, color: 'text-brand-accent' },
    { label: 'Active Streak', value: '12d', change: '+3', up: true, icon: Flame, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-brand-primary rounded-full" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-brand-primary" />
              Analytics & Insights
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">
            Track your career momentum with data-driven visualizations.
          </p>
        </div>

        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl">
          {(['8w', '6m', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                timeRange === range
                  ? 'bg-white dark:bg-zinc-800 text-brand-primary dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {range === '8w' ? '8 Weeks' : range === '6m' ? '6 Months' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`h-5 w-5 ${card.color}`} />
              <div className={`flex items-center gap-0.5 text-[10px] font-bold ${card.up ? 'text-brand-success' : 'text-brand-danger'}`}>
                {card.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {card.change}
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Application Progress Area Chart */}
        <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-primary" />
              Weekly Application & Interview Trend
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#4F46E5" strokeWidth={2} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="interviews" name="Interviews" stroke="#10B981" strokeWidth={2} fill="url(#colorInterviews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Pipeline Pie */}
        <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <Target className="h-4 w-4 text-brand-accent" />
            Application Pipeline Breakdown
          </h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={applicationPipeline}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {applicationPipeline.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {applicationPipeline.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-slate-600 dark:text-zinc-400 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-900 flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Total</span>
                <span className="font-black text-slate-800 dark:text-zinc-200">{applicationPipeline.reduce((a, b) => a + b.value, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Score Progression */}
        <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-success" />
            Interview Score Progression
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interviewScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" name="Score" stroke="#4F46E5" strokeWidth={2.5} dot={{ fill: '#4F46E5', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#8B5CF6', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Growth Before/After Bar */}
        <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <Award className="h-4 w-4 text-brand-warning" />
            Skill Proficiency Growth
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillGrowth} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="skill" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="before" name="Before" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="after" name="After" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Activity Heatmap-style Bar */}
      <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl space-y-4 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand-primary" />
          Monthly Activity Breakdown
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="commits" name="Git Commits" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="problems" name="Problems Solved" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="docs" name="Docs Uploaded" fill="#10B981" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
