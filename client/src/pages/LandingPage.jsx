import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  GraduationCap, 
  FileText, 
  Briefcase, 
  GitMerge,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Code2,
  BarChart3,
  Users,
  BookOpen,
  Target,
  Star
} from 'lucide-react';
import StudentOSLogo from '../components/StudentOSLogo';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  // Pomodoro Timer State
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

  // Checklist State
  const [tasks, setTasks] = useState([
    { id: 1, text: "Solve 1 LeetCode problem today", completed: true },
    { id: 2, text: "Update resume with recent project", completed: false },
    { id: 3, text: "Review system design notes", completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const features = [
    {
      title: "Dev Timeline Portfolio",
      desc: "Document every project, internship, and research paper in a visual timeline. Share a public portfolio URL that actually impresses recruiters instead of a plain PDF.",
      icon: GitMerge,
      color: "text-violet-600 bg-violet-50 border-violet-100",
      darkColor: "dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/20",
    },
    {
      title: "Learning Roadmaps",
      desc: "Generate personalized learning paths based on your target role. Whether you're preparing for SDE, ML, or Product, get a structured week-by-week plan built around your current skills.",
      icon: BookOpen,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      darkColor: "dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20",
    },
    {
      title: "Resume Builder",
      desc: "Build ATS-compatible resumes with a live editor. Get line-by-line suggestions, optimize your bullet points for specific job descriptions, and export clean one-page PDFs.",
      icon: FileText,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      darkColor: "dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20",
    },
    {
      title: "Application Tracker",
      desc: "Replace the spreadsheet. Track every application from wishlist to offer stage with a Kanban board. Attach documents, set deadlines, and see where you stand at a glance.",
      icon: Briefcase,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      darkColor: "dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20",
    },
    {
      title: "GitHub & LeetCode Stats",
      desc: "Connect your GitHub and LeetCode accounts to see your contribution heatmap, problem-solving breakdown, and language distribution — all in one unified dashboard.",
      icon: Code2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      darkColor: "dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    },
    {
      title: "Placement Readiness Score",
      desc: "Get an objective score based on your LeetCode streak, GitHub activity, resume quality, and interview practice. Know exactly what to fix before your next application deadline.",
      icon: BarChart3,
      color: "text-sky-600 bg-sky-50 border-sky-100",
      darkColor: "dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20",
    },
  ];

  const faqs = [
    {
      q: "How is StudentOS different from LinkedIn or Notion?",
      a: "LinkedIn is a public social network. Notion is a blank canvas. StudentOS is built specifically for students who are actively preparing for placements — it connects your coding activity, resume, applications, and skill gaps in one place and shows you a clear picture of where you stand.",
    },
    {
      q: "Does it actually pull data from GitHub and LeetCode?",
      a: "Yes. Enter your GitHub username to see real contribution heatmaps, repository languages, and commit counts. For LeetCode, it pulls your actual solved count, difficulty breakdown, and global rank using the official API.",
    },
    {
      q: "Can I download my resume as a PDF?",
      a: "Yes. The Resume Builder generates a clean, single-page PDF that is formatted for ATS parsing. You control the layout and content — no templates that look identical to every other student.",
    },
    {
      q: "Is my data safe?",
      a: "Your data is stored securely with JWT-based authentication. We do not share or sell anything. You can delete your account and all associated data at any time.",
    },
  ];

  const stats = [
    { label: "Features built for students", value: "12+", sub: "tools in one place" },
    { label: "Resume sections supported", value: "8", sub: "fully editable" },
    { label: "Job tracker views", value: "Kanban", sub: "drag-and-drop" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030303] font-sans text-slate-800 dark:text-zinc-200 transition-colors duration-500 relative overflow-hidden">
      
      {/* Subtle background accents */}
      <div className="absolute top-[-5%] left-[-5%] h-[600px] w-[600px] rounded-full bg-violet-500/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[-5%] h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-slate-50/90 dark:bg-[#030303]/90 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-900/60 transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <StudentOSLogo size={36} onClick={() => navigate('/dashboard')} />

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-violet-600 dark:hover:text-white transition-colors">Features</a>
            <a href="#workspace-demo" className="hover:text-violet-600 dark:hover:text-white transition-colors">Workspace</a>
            <a href="#faq" className="hover:text-violet-600 dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/auth')} className="text-sm font-bold text-slate-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-white px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900/60 transition-all cursor-pointer">
              Sign In
            </button>
            <button onClick={() => navigate('/auth')} className="flex items-center gap-1.5 text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100 border border-violet-200 text-violet-700 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400">
              <Star className="h-3.5 w-3.5" />
              <span>Built specifically for engineering students</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white font-heading">
              One place for your entire{' '}
              <span className="text-violet-600 dark:text-violet-400">placement journey.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed font-medium max-w-xl">
              StudentOS brings together your resume, GitHub stats, LeetCode progress, job applications, and learning roadmaps into a single dashboard. No more juggling five different tools.
            </p>

            <div className="space-y-3">
              {[
                "Track every job application from apply to offer",
                "See your GitHub commits and LeetCode progress in one view",
                "Build an ATS-ready resume with a live editor",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{point}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button onClick={() => navigate('/auth')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-base">
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} className="w-full sm:w-auto px-8 py-4 border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:bg-slate-100 dark:hover:bg-zinc-900 font-bold rounded-xl hover:scale-[1.01] transition-all text-slate-700 dark:text-zinc-300 cursor-pointer text-base">
                See all features
              </button>
            </div>
          </div>

          {/* Right Stats/Preview Column */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              {/* Mini Dashboard Preview Card */}
              <div className="bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Placement Readiness</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-0.5">74 / 100</p>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90">
                      <circle stroke="#e2e8f0" strokeWidth="5" fill="none" r="20" cx="28" cy="28" className="dark:stroke-zinc-800" />
                      <circle stroke="#7c3aed" strokeWidth="5" strokeDasharray="125" strokeDashoffset="33" strokeLinecap="round" fill="none" r="20" cx="28" cy="28" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-violet-600 dark:text-violet-400">74%</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "LeetCode", val: "216", color: "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400" },
                    { label: "GitHub", val: "342+", color: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
                    { label: "Applications", val: "12", color: "bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400" },
                  ].map((item, i) => (
                    <div key={i} className={`rounded-xl px-3 py-2.5 text-center ${item.color}`}>
                      <p className="text-sm font-black">{item.val}</p>
                      <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application tracker mini card */}
              <div className="bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Recent Applications</p>
                <div className="space-y-2.5">
                  {[
                    { company: "Stripe", role: "SWE Intern", stage: "Interview", color: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
                    { company: "Vercel", role: "Frontend Eng.", stage: "Applied", color: "bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400" },
                    { company: "Razorpay", role: "Full Stack", stage: "Offer", color: "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400" },
                  ].map((app, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{app.company}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-500">{app.role}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${app.color}`}>{app.stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Students Struggle With Section */}
      <section className="border-t border-slate-200 dark:border-zinc-900/50 bg-white dark:bg-zinc-950/30 relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading mb-4">
              The placement process is scattered. StudentOS pulls it together.
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 font-medium">
              Most students manage their preparation across 6-8 different tools. StudentOS gives you one organized workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                before: "Spreadsheets for job tracking",
                after: "Kanban board with deadlines, stages, and document attachments",
                icon: Briefcase,
              },
              {
                before: "GitHub and LeetCode are separate sites",
                after: "See both in one dashboard with your combined activity score",
                icon: Code2,
              },
              {
                before: "Resume in Google Docs, no ATS optimization",
                after: "Live editor with formatting, export to PDF, and section-by-section feedback",
                icon: FileText,
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-slate-600 dark:text-zinc-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Before</p>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium">{item.before}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">With StudentOS</p>
                  <p className="text-sm text-slate-800 dark:text-zinc-200 font-semibold">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Workspace Demo */}
      <section id="workspace-demo" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-zinc-900/50 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="text-xs uppercase font-bold text-violet-600 dark:text-violet-400 tracking-widest">Interactive Demo</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading">Try the workspace tools</h2>
          <p className="text-slate-600 dark:text-zinc-400 font-medium">
            These widgets are built into the dashboard. Use the Pomodoro timer during study sessions and track daily goals with the checklist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Pomodoro Timer Widget */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900/60 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between shadow-sm">
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-violet-600 dark:text-violet-400 tracking-wide">Focus Session</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pomoActive ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'}`}>
                  {pomoActive ? 'Running' : 'Ready'}
                </span>
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
                  className={`h-11 px-6 rounded-xl font-bold flex items-center gap-1.5 text-sm transition-all cursor-pointer ${
                    pomoActive ? 'bg-rose-500 text-white' : 'bg-violet-600 text-white hover:bg-violet-700'
                  }`}
                >
                  {pomoActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {pomoActive ? 'Pause' : 'Start Focus'}
                </button>
                <button 
                  onClick={resetPomo} 
                  className="h-11 w-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-8 text-xs text-slate-500 dark:text-zinc-500 font-medium text-center bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
              Use focus sessions while solving LeetCode or reviewing system design. Sessions are tracked in your dashboard.
            </p>
          </div>

          {/* Interactive Checklist Widget */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900/60 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between shadow-sm">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 tracking-wide">Today's Goals</span>
                <span className="text-xs font-bold text-slate-400">
                  {tasks.filter(t => t.completed).length}/{tasks.length} done
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map(task => (
                  <button 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl text-left border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 hover:border-violet-200 dark:hover:border-violet-500/20 transition-all cursor-pointer"
                  >
                    <div className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                      task.completed ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-300 dark:border-zinc-600'
                    }`}>
                      {task.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`text-sm font-semibold ${
                      task.completed ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-200'
                    }`}>
                      {task.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-6 text-xs text-slate-500 dark:text-zinc-500 font-medium bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
              Set daily preparation goals. Your completion rate influences your overall placement readiness score.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-zinc-900/50 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-bold text-violet-600 dark:text-violet-400 tracking-widest">Everything Included</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading">A complete toolkit for placement season</h2>
          <p className="text-slate-600 dark:text-zinc-400 font-medium">Every module is purpose-built for what students actually need — not generic productivity features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div 
              key={feat.title} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.08, duration: 0.5 }} 
              className="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl flex flex-col gap-4 border border-slate-200 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${feat.color} ${feat.darkColor}`}>
                <feat.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {feat.title}
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mt-1.5">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Who is it for Section */}
      <section className="border-t border-slate-200 dark:border-zinc-900/50 bg-white dark:bg-zinc-950/30 relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading mb-6">
                Built for students who are serious about getting hired.
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: Target,
                    title: "Pre-final and final year students",
                    desc: "If you're preparing for campus placements or off-campus applications, StudentOS gives you the structure to stay organized and measure progress objectively.",
                  },
                  {
                    icon: Users,
                    title: "Students targeting product companies",
                    desc: "Google, Stripe, Razorpay, Vercel — companies that care about GitHub, DSA, and system design. StudentOS is built around exactly those criteria.",
                  },
                  {
                    icon: BookOpen,
                    title: "Students building their first portfolio",
                    desc: "The Dev Timeline turns your projects, internships, and achievements into a structured, shareable portfolio without needing a personal website.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</p>
                      <p className="text-sm text-slate-600 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Skill Gap Analysis</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white font-heading mt-1">Fullstack Developer</p>
                  </div>
                  <span className="text-xs font-bold bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-lg">5 gaps found</span>
                </div>
                <div className="space-y-2.5">
                  {["Docker & containerization", "TypeScript", "CI/CD pipelines", "Redis caching", "AWS deployment"].map((skill, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-400 dark:bg-rose-500 shrink-0" />
                      <span className="text-slate-600 dark:text-zinc-400 font-medium">{skill}</span>
                      <span className="ml-auto text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded">Missing</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Learning Plan</p>
                <div className="space-y-2">
                  {["Week 1-2: DSA patterns — Trees, Graphs, DP", "Week 3-4: TypeScript + Docker project", "Week 5-6: System design case studies"].map((week, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-violet-600 dark:text-violet-400">{i + 1}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{week}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-zinc-900/50 relative z-10">
        <h2 className="text-3xl font-black text-center text-slate-900 dark:text-white mb-12 font-heading">Common questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/50 overflow-hidden hover:border-violet-200 dark:hover:border-violet-500/20 transition-all duration-300">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} 
                className="w-full flex items-center justify-between p-6 text-left text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer font-heading"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 font-normal text-xl leading-none ml-4 shrink-0">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed border-t border-slate-100 dark:border-zinc-800 font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-200 dark:border-zinc-900/50 relative z-10">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading">
            Start organizing your placement preparation today.
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 font-medium max-w-xl mx-auto">
            Free to create an account. No credit card needed. Your data is yours.
          </p>
          <button onClick={() => navigate('/auth')} className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-base">
            Get Started for Free
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-900/50 bg-white dark:bg-[#030303] py-10 relative z-10 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Student<span className="text-violet-600 dark:text-violet-400">OS</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">© 2026 StudentOS. Built for students navigating placement season.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
