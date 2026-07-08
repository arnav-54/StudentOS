import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Zap, Target, BookOpen, FileText, Briefcase, MessageSquare, Code, Shield, Rocket, Crown, Lock, CheckCircle2, } from 'lucide-react';
const achievements = [
    // Career
    { id: '1', title: 'First Application', description: 'Submit your first job application through the tracker.', icon: Briefcase, category: 'career', xp: 50, unlocked: false, rarity: 'common' },
    { id: '2', title: 'Pipeline Builder', description: 'Track 10 applications simultaneously.', icon: Target, category: 'career', xp: 150, unlocked: false, rarity: 'rare', progress: 0, total: 10 },
    { id: '3', title: 'Interview Ready', description: 'Complete 5 mock interview sessions.', icon: MessageSquare, category: 'career', xp: 200, unlocked: false, rarity: 'rare', progress: 0, total: 5 },
    { id: '4', title: 'Offer Collector', description: 'Receive your first job offer.', icon: Trophy, category: 'career', xp: 500, unlocked: false, rarity: 'epic' },
    { id: '5', title: 'FAANG Finalist', description: 'Reach interview stage at a FAANG company.', icon: Crown, category: 'career', xp: 1000, unlocked: false, rarity: 'legendary' },
    // Learning
    { id: '6', title: 'Roadmap Pioneer', description: 'Generate your first AI career roadmap.', icon: Rocket, category: 'learning', xp: 75, unlocked: false, rarity: 'common' },
    { id: '7', title: 'Knowledge Seeker', description: 'Complete 3 phases of a career roadmap.', icon: BookOpen, category: 'learning', xp: 300, unlocked: false, rarity: 'rare', progress: 0, total: 3 },
    { id: '8', title: 'Certified Pro', description: 'Add 3 certifications to your profile.', icon: Shield, category: 'learning', xp: 250, unlocked: false, rarity: 'rare', progress: 0, total: 3 },
    // Coding
    { id: '9', title: 'Code Warrior', description: 'Solve 50 LeetCode problems.', icon: Code, category: 'coding', xp: 200, unlocked: false, rarity: 'rare', progress: 0, total: 50 },
    { id: '10', title: 'Century Club', description: 'Reach 100 LeetCode problems solved.', icon: Zap, category: 'coding', xp: 500, unlocked: false, rarity: 'epic', progress: 0, total: 100 },
    { id: '11', title: 'Git Guru', description: 'Make 200+ GitHub commits this year.', icon: Code, category: 'coding', xp: 300, unlocked: false, rarity: 'rare', progress: 0, total: 200 },
    // Milestones
    { id: '12', title: 'Profile Complete', description: 'Fill in all profile fields and link external accounts.', icon: CheckCircle2, category: 'milestone', xp: 100, unlocked: false, rarity: 'common' },
    { id: '13', title: 'Resume Craftsman', description: 'Build and optimize a resume using AI tools.', icon: FileText, category: 'milestone', xp: 150, unlocked: false, rarity: 'common' },
    { id: '14', title: 'ATS Master', description: 'Achieve a resume ATS score of 90+.', icon: Star, category: 'milestone', xp: 400, unlocked: false, rarity: 'epic', progress: 0, total: 90 },
    { id: '15', title: '30-Day Streak', description: 'Maintain a 30-day activity streak.', icon: Flame, category: 'milestone', xp: 750, unlocked: false, rarity: 'legendary', progress: 0, total: 30 },
];
const rarityConfig = {
    common: { label: 'Common', border: 'border-slate-300 dark:border-zinc-700', bg: 'bg-slate-100 dark:bg-zinc-900', text: 'text-slate-500', glow: '' },
    rare: { label: 'Rare', border: 'border-blue-400/50 dark:border-blue-500/30', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-500', glow: '' },
    epic: { label: 'Epic', border: 'border-purple-400/50 dark:border-purple-500/30', bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-500', glow: 'shadow-purple-500/10' },
    legendary: { label: 'Legendary', border: 'border-amber-400/50 dark:border-amber-500/30', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-500', glow: 'shadow-lg shadow-amber-500/10' },
};
const categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'career', label: 'Career' },
    { id: 'learning', label: 'Learning' },
    { id: 'coding', label: 'Coding' },
    { id: 'milestone', label: 'Milestones' },
];
const Achievements = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const filtered = useMemo(() => {
        return activeCategory === 'all'
            ? achievements
            : achievements.filter((a) => a.category === activeCategory);
    }, [activeCategory]);
    const totalXP = achievements.filter((a) => a.unlocked).reduce((acc, a) => acc + a.xp, 0);
    const totalPossibleXP = achievements.reduce((acc, a) => acc + a.xp, 0);
    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    const level = Math.floor(totalXP / 500) + 1;
    const xpInCurrentLevel = totalXP % 500;
    return (<div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-brand-warning rounded-full"/>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-8 w-8 text-brand-warning"/>
            Achievements & Progress
          </h1>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">
          Earn badges, collect XP, and track your career milestones.
        </p>
      </div>

      {/* Level / XP Hero Card */}
      <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Level Circle */}
          <div className="relative">
            <svg className="w-28 h-28" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-zinc-900"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="url(#levelGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(xpInCurrentLevel / 500) * 314} 314`} transform="rotate(-90 60 60)"/>
              <defs>
                <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5"/>
                  <stop offset="100%" stopColor="#8B5CF6"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent">{level}</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Level</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200">Career Explorer</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{xpInCurrentLevel} / 500 XP to Level {level + 1}</p>
            </div>
            <div className="h-2.5 w-full max-w-sm bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500" style={{ width: `${(xpInCurrentLevel / 500) * 100}%` }}/>
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="text-center">
                <p className="text-lg font-black text-brand-primary">{totalXP.toLocaleString()}</p>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total XP</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-brand-success">{unlockedCount}/{achievements.length}</p>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Unlocked</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-brand-accent">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl w-fit">
        {categories.map((cat) => (<button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeCategory === cat.id
                ? 'bg-white dark:bg-zinc-800 text-brand-primary dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'}`}>
            {cat.label}
          </button>))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((achievement, idx) => {
            const rarity = rarityConfig[achievement.rarity];
            return (<motion.div key={achievement.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} whileHover={{ y: -3 }} className={`relative p-5 rounded-2xl border ${rarity.border} ${achievement.unlocked ? 'bg-white dark:bg-zinc-950' : 'bg-slate-50/50 dark:bg-zinc-900/30 opacity-60'} ${rarity.glow} transition-all group`}>
              {/* Locked overlay */}
              {!achievement.unlocked && (<div className="absolute top-3 right-3">
                  <Lock className="h-4 w-4 text-slate-400 dark:text-zinc-600"/>
                </div>)}

              <div className="flex items-start gap-4">
                {/* Icon badge */}
                <div className={`h-12 w-12 rounded-xl ${rarity.bg} border ${rarity.border} flex items-center justify-center shrink-0 ${achievement.unlocked ? '' : 'grayscale'}`}>
                  <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? rarity.text : 'text-slate-400 dark:text-zinc-600'}`}/>
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">{achievement.title}</h3>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${rarity.bg} ${rarity.text} border ${rarity.border}`}>
                      {rarity.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">{achievement.description}</p>

                  {/* Progress bar if applicable */}
                  {achievement.progress !== undefined && achievement.total !== undefined && (<div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400 font-medium">Progress</span>
                        <span className="font-bold text-slate-600 dark:text-zinc-300">{achievement.progress}/{achievement.total}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${achievement.unlocked ? 'bg-brand-success' : 'bg-brand-primary'}`} style={{ width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%` }}/>
                      </div>
                    </div>)}

                  {/* Footer info */}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-bold text-brand-accent">+{achievement.xp} XP</span>
                    {achievement.unlocked && achievement.unlockedDate && (<span className="text-[9px] text-slate-400 font-medium">Earned {achievement.unlockedDate}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>);
        })}
      </div>
    </div>);
};
export default Achievements;
