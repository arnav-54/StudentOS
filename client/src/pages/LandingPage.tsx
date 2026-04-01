import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  CheckCircle, 
  Cpu, 
  FileText, 
  Briefcase, 
  GitFork,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Star
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      title: "Interactive Dev Timelines",
      desc: "Plot all your achievements, research papers, projects, and internships into a stunning live timeline to show off to recruiters.",
      icon: GitFork,
      color: "text-brand-primary bg-brand-primary/10 border-brand-primary/20",
    },
    {
      title: "AI Career & Learning Paths",
      desc: "Generate node-based academic roadmaps, learning recommendations, and custom certification recommendations in seconds via Gemini.",
      icon: Cpu,
      color: "text-brand-accent bg-brand-accent/10 border-brand-accent/20",
    },
    {
      title: "ATS-Optimized Resumes",
      desc: "Build professional portfolios side-by-side with an editor, get line-by-line AI rewrites, and track resume optimization scores.",
      icon: FileText,
      color: "text-brand-success bg-brand-success/10 border-brand-success/20",
    },
    {
      title: "Internship & Job Kanban",
      desc: "Ditch spreadshets. Track applications from wishlist to final offers, attach documents directly, and compile application analytics.",
      icon: Briefcase,
      color: "text-brand-warning bg-brand-warning/10 border-brand-warning/20",
    },
  ];

  const faqs = [
    {
      q: "What makes StudentOS different from standard trackers?",
      a: "StudentOS is an all-in-one ecosystem. Instead of using separate tools for applications, portfolio building, and AI coaching, StudentOS integrates them. Your GitHub repositories, LeetCode stats, timeline events, and resume are linked together to output a single readiness score.",
    },
    {
      q: "Does it connect to real AI models?",
      a: "Yes. StudentOS utilizes the latest Google Gemini API to analyze skills, optimize resume bullet points to fit ATS systems, and run conversational mock interview practices.",
    },
    {
      q: "Can I download my resume as a PDF?",
      a: "Absolutely. The Resume Builder includes styled print targets that compile your changes into a clean, single-page, standard ATS layout that prints perfectly to PDF.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-800 dark:text-zinc-200 transition-colors duration-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-brand-primary/5 blur-[120px] dark:bg-brand-primary/10" />
      <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-brand-accent/5 blur-[150px] dark:bg-brand-accent/10 animate-float-slow" />

      {/* Floating Header */}
      <header className="sticky top-0 z-30 w-full bg-slate-50/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-zinc-900/60 transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-md shadow-brand-primary/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">StudentOS</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#stats" className="hover:text-slate-900 dark:hover:text-white transition-colors">Insights</a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/auth')}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="flex items-center gap-1 text-sm font-semibold bg-brand-primary hover:bg-brand-primary/95 text-white px-4 py-1.5 rounded-lg shadow-sm hover:scale-[1.02] transition-all"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 border border-brand-primary/20 text-brand-primary dark:text-brand-accent dark:bg-brand-accent/15 dark:border-brand-accent/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven Optimization Suite</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
            The intelligent operating system for <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-accent to-purple-400">your career.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Manage your courses, track applications, mock-interview with customized AI feedback, and synthesize a stellar developer portfolio timeline.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-medium rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all"
            >
              Access Workspace
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3 border border-slate-200 dark:border-zinc-800 bg-white/50 hover:bg-slate-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 font-semibold rounded-xl transition-colors text-slate-700 dark:text-zinc-300"
            >
              Explore Features
            </button>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-zinc-900/60 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Designed for high achievers.</h2>
          <p className="text-slate-500 dark:text-zinc-400">Everything you need to level up your resume, GitHub contributions, and internship pipelines in one clean workspace.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="glass-panel p-8 rounded-2xl flex flex-col justify-between hover:border-brand-primary/20 transition-all border border-slate-200/50 dark:border-zinc-800/80 bg-white dark:bg-zinc-950"
            >
              <div className="space-y-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${feat.color}`}>
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{feat.title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-zinc-900/60 relative z-10">
        <div className="glass-panel bg-gradient-to-tr from-brand-primary/5 to-brand-accent/5 p-8 sm:p-12 rounded-3xl border border-slate-200/50 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/70">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white bg-clip-text">20k+</p>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Mock Interviews Run</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">93.4%</p>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">ATS Pass Rate</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">12 Days</p>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Avg. Time to Placement</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-zinc-900/60 relative z-10">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200/60 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 font-normal">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="p-5 pt-0 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed border-t border-slate-100 dark:border-zinc-900">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-zinc-900/60 bg-white dark:bg-zinc-950 py-12 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent text-white">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold tracking-tight text-slate-900 dark:text-white">StudentOS</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 StudentOS Inc. Built for peak academic performance.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
