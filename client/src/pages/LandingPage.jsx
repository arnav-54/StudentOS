import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Cpu, 
  FileText, 
  Briefcase, 
  GitFork,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Flame,
  Lightbulb,
  Award,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  // --- 1. Interactive Pomodoro Widget State ---
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [pomoActive, setPomoActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (pomoActive) {
      interval = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds(pomoSeconds - 1);
        } else if (pomoSeconds === 0 && pomoMinutes > 0) {
          setPomoMinutes(pomoMinutes - 1);
          setPomoSeconds(59);
        } else {
          setPomoActive(false);
          clearInterval(interval);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoMinutes, pomoSeconds]);

  const resetPomo = () => {
    setPomoActive(false);
    setPomoMinutes(25);
    setPomoSeconds(0);
  };

  // --- 2. Interactive Checklist State ---
  const [tasks, setTasks] = useState([
    { id: 1, text: "Solve 1 LeetCode Daily", completed: true },
    { id: 2, text: "Update StudentOS resume bullet points", completed: false },
    { id: 3, text: "Generate interview roadmap with Gemini AI", completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // --- 3. Rotating Motivational Quotes ---
  const quotes = [
    { text: "Consistency beats talent when talent doesn't work hard.", author: "Dev Proverb" },
    { text: "Your only competition is the version of you from yesterday.", author: "Chads of Code" },
    { text: "The code you write today is the portfolio that gets you hired tomorrow.", author: "Silicon Valley Wisdom" },
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const qInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(qInterval);
  }, []);

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
      color: "text-brand-cyberPink bg-brand-cyberPink/10 border-brand-cyberPink/20",
    },
    {
      title: "Internship & Job Kanban",
      desc: "Ditch spreadsheets. Track applications from wishlist to final offers, attach documents directly, and compile application analytics.",
      icon: Briefcase,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030303] font-sans text-slate-800 dark:text-zinc-200 transition-colors duration-500 relative overflow-hidden">
      
      {/* Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-brand-primary/10 blur-[150px] dark:bg-brand-primary/15 animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-brand-cyberPink/8 blur-[180px] dark:bg-brand-cyberPink/12 animate-float-medium pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] h-[500px] w-[500px] rounded-full bg-brand-accent/5 blur-[130px] dark:bg-brand-accent/8 animate-float-slow pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-[#F8FAFC]/80 dark:bg-[#030303]/85 backdrop-blur-xl border-b border-slate-200/40 dark:border-zinc-900/50 transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-cyberPink text-white shadow-md shadow-brand-primary/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
              Student<span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-cyberPink">OS</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-brand-primary dark:hover:text-white transition-colors">Workspace Features</a>
            <a href="#workspace-demo" className="hover:text-brand-primary dark:hover:text-white transition-colors">Daily Grind</a>
            <a href="#stats" className="hover:text-brand-primary dark:hover:text-white transition-colors">Impact stats</a>
            <a href="#faq" className="hover:text-brand-primary dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/auth')} className="text-sm font-bold text-slate-700 hover:text-brand-primary dark:text-zinc-300 dark:hover:text-white px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900/60 transition-all cursor-pointer">
              Sign In
            </button>
            <button onClick={() => navigate('/auth')} className="flex items-center gap-1.5 text-sm font-bold bg-gradient-to-r from-brand-primary to-brand-cyberPink hover:opacity-95 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-brand-primary/25 hover:scale-[1.04] active:scale-[0.98] transition-all cursor-pointer">
              Start Building
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-primary/8 border border-brand-primary/20 text-brand-primary dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>THE ALL-IN-ONE CAREER GRINDSPACE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-slate-900 dark:text-white font-heading">
              Level up <br />
              your academic <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-cyberPink to-amber-400">grind.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 dark:text-zinc-400 leading-relaxed font-medium max-w-xl">
              Ditch messy spreadsheets. Optimize your resume, generate AI learning roadmaps, track internships, and build an interactive dev portfolio to stand out.
            </p>

            {/* Motivational Live Quote Ticker */}
            <div className="h-16 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="border-l-4 border-brand-cyberPink pl-4"
                >
                  <p className="text-sm font-semibold italic text-slate-700 dark:text-zinc-300">
                    "{quotes[quoteIndex].text}"
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                    — {quotes[quoteIndex].author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button onClick={() => navigate('/auth')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-cyberPink hover:opacity-95 text-white font-bold rounded-xl shadow-xl shadow-brand-primary/20 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer text-base">
                Claim Username
                <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} className="w-full sm:w-auto px-8 py-4 border border-slate-200 dark:border-zinc-800 bg-white/60 hover:bg-slate-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 font-bold rounded-xl hover:scale-[1.02] transition-all text-slate-700 dark:text-zinc-300 cursor-pointer text-base">
                Explore Tech Stack
              </button>
            </div>
          </div>

          {/* Right Image/Mockup Column */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative p-2 rounded-3xl bg-gradient-to-tr from-brand-primary/20 to-brand-cyberPink/20 border border-white/10 shadow-2xl overflow-visible max-w-[420px] w-full"
            >
              <img 
                src="/student_coding.png" 
                alt="GenZ Developer coding workspace" 
                className="rounded-2xl object-cover aspect-square shadow-inner border border-white/5"
              />
              
              {/* Floating tags */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 -left-8 glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-brand-primary/30 shadow-lg"
              >
                <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400">LeetCode streak</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">12 Days 🔥</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-16 -right-6 glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-brand-cyberPink/30 shadow-lg"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Resume Score</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">94/100 🚀</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 left-8 glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-brand-neon-green/30 shadow-lg"
              >
                <Lightbulb className="h-5 w-5 text-emerald-400" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400">AI Recommendation</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Build Next.js Project ⚡</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Workroom Widget (Daily Grind Area) */}
      <section id="workspace-demo" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-200/40 dark:border-zinc-900/50 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-extrabold text-brand-cyberPink tracking-widest">LIVE MOCKUP DEMO</span>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white font-heading">Your daily productivity HQ.</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-base font-medium">
            Test drive our built-in widgets below. This is what you come back to every day to keep your mind locked in and focused.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Pomodoro Timer Widget */}
          <div className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-slate-200/40 dark:border-zinc-900/60 bg-white/70 dark:bg-zinc-950/70 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[40px] pointer-events-none rounded-full" />
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-brand-primary tracking-wide">Focus Session</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary">Active</span>
              </div>
              <div className="space-y-1">
                <p className="text-7xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
                  {pomoMinutes.toString().padStart(2, '0')}:{pomoSeconds.toString().padStart(2, '0')}
                </p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pomodoro Timer</p>
              </div>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setPomoActive(!pomoActive)} 
                  className={`h-11 px-5 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-md transition-all cursor-pointer ${
                    pomoActive ? 'bg-rose-500 text-white shadow-rose-500/10' : 'bg-brand-primary text-white shadow-brand-primary/10 hover:scale-[1.02]'
                  }`}
                >
                  {pomoActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {pomoActive ? 'Pause' : 'Start Focus'}
                </button>
                <button 
                  onClick={resetPomo} 
                  className="h-11 w-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-8 text-xs text-slate-400 font-medium text-center bg-slate-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-900">
              ⚡ Try it out! Time your studying, coding, or applying sessions natively inside StudentOS.
            </div>
          </div>

          {/* Interactive Checklist Widget */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-slate-200/40 dark:border-zinc-900/60 bg-white/70 dark:bg-zinc-950/70 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-cyberPink/5 blur-[40px] pointer-events-none rounded-full" />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-brand-cyberPink tracking-wide">Daily Missions</span>
                <span className="text-xs font-bold text-slate-400">
                  {tasks.filter(t => t.completed).length}/{tasks.length} Completed
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map(task => (
                  <button 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl text-left border border-slate-100 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/30 hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-all cursor-pointer"
                  >
                    <div className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                      task.completed ? 'bg-brand-cyberPink border-brand-cyberPink text-white' : 'border-slate-300 dark:border-zinc-700'
                    }`}>
                      {task.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`text-xs font-semibold ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-zinc-200'
                    }`}>
                      {task.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 text-xs text-slate-400 font-medium bg-slate-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-900">
              🔥 Check and uncheck items above. Keeping up with tasks raises your StudentOS ranking scores.
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Window */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200/40 dark:border-zinc-900/50 relative z-10 text-center">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-extrabold text-brand-primary tracking-widest">PRODUCT INTERNALS</span>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white font-heading">Clean. Premium. Dark-themed.</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-base font-medium">
            Here's a preview of your Analytics dashboard. Tailored dark colors help minimize eye fatigue during night study sessions.
          </p>
        </div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="mx-auto max-w-5xl rounded-3xl border border-slate-200/50 dark:border-zinc-800 bg-[#07070B] p-2.5 shadow-2xl relative"
        >
          {/* Simulated Browser Frame Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-[#0C0C12] rounded-t-2xl">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] text-zinc-600 font-bold tracking-wider uppercase">studentos.app/dashboard/analytics</span>
            <div className="w-12" />
          </div>
          <img 
            src="/dashboard_mockup.png" 
            alt="StudentOS analytics dashboard preview" 
            className="rounded-b-2xl object-cover w-full h-auto max-h-[500px]"
          />
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-slate-200/40 dark:border-zinc-900/50 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <span className="text-xs uppercase font-extrabold text-brand-cyberPink tracking-widest font-heading">ENGINEERED SUITE</span>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white font-heading">Designed for high achievers.</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-base font-medium">Everything you need to level up your resume, GitHub contributions, and internship pipelines in one clean workspace.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => (
            <motion.div 
              key={feat.title} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }} 
              whileHover={{ y: -6, scale: 1.01 }} 
              className="glass-panel p-8 rounded-2xl flex flex-col justify-between hover:border-brand-primary/30 transition-all border border-slate-200/40 dark:border-zinc-900/60 bg-white/70 dark:bg-zinc-950/70 shadow-sm relative group cursor-pointer"
            >
              <div className="space-y-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shadow-sm ${feat.color}`}>
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white font-heading flex items-center gap-1.5 group-hover:text-brand-primary dark:group-hover:text-emerald-400 transition-colors">
                  {feat.title}
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200/40 dark:border-zinc-900/50 relative z-10">
        <div className="glass-panel bg-gradient-to-tr from-brand-primary/5 via-transparent to-brand-cyberPink/5 p-8 sm:p-14 rounded-3xl border border-slate-200/40 dark:border-zinc-900/60 bg-white/40 dark:bg-zinc-950/40">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            <div className="space-y-2">
              <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-cyberPink font-heading">25k+</p>
              <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Mock Interviews Run</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-emerald-400 font-heading">94.8%</p>
              <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400">ATS Pass Rate</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-brand-cyberPink font-heading">10 Days</p>
              <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Avg. Time to Placement</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 border-t border-slate-200/40 dark:border-zinc-900/50 relative z-10">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 dark:text-white mb-16 font-heading">Frequently Asked Questions</h2>
        <div className="space-y-4.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200/50 dark:border-zinc-900 rounded-2xl bg-white/70 dark:bg-zinc-950/70 overflow-hidden shadow-sm hover:border-brand-primary/30 dark:hover:border-zinc-800 transition-all duration-300">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} 
                className="w-full flex items-center justify-between p-6 text-left text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer font-heading"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 font-normal text-xl leading-none">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-sm text-slate-500 dark:text-zinc-400 leading-relaxed border-t border-slate-100 dark:border-zinc-900/60 font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/40 dark:border-zinc-900/50 bg-white/90 dark:bg-[#030303]/90 py-12 relative z-10 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-primary to-brand-cyberPink text-white">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Student<span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-cyberPink">OS</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">© 2026 StudentOS Inc. Built for peak academic performance.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
