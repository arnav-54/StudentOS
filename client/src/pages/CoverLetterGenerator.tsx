import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  CheckCircle,
  RefreshCw,
  Briefcase,
  Building,
  Loader2,
} from 'lucide-react';
import axios from 'axios';

const toneOptions = [
  { id: 'professional', label: 'Professional', desc: 'Formal and polished' },
  { id: 'conversational', label: 'Conversational', desc: 'Friendly and personable' },
  { id: 'technical', label: 'Technical', desc: 'Detail-oriented and precise' },
];

const mockCoverLetters: Record<string, string> = {
  professional: `Dear Hiring Manager,

I am writing to express my strong interest in the [ROLE] position at [COMPANY]. As a Computer Science student at Massachusetts Institute of Technology with hands-on experience in full-stack development, I am confident that my technical skills and passion for building scalable software make me an excellent fit for this role.

During my time developing StudentOS — an AI-powered academic platform — I architected and engineered a comprehensive full-stack application using React, TypeScript, Node.js, and Express. This project involved integrating Google Gemini AI for real-time resume optimization and interview preparation, implementing JWT-based authentication, and building interactive data visualizations with Recharts. The platform processes career analytics, manages document storage, and features a 5-column Kanban application tracker — demonstrating my ability to build complex, production-grade systems from concept to deployment.

I am particularly drawn to [COMPANY]'s commitment to [specific company value]. Your team's work on [specific product/feature] aligns closely with my interest in building tools that genuinely impact users' workflows and career trajectories.

What I bring to your team:
• Strong proficiency in React, TypeScript, and modern JavaScript ecosystems
• Experience designing RESTful APIs and integrating third-party AI services
• A product-oriented mindset — I build features that solve real user problems, not just technical exercises
• Proven ability to work across the stack, from responsive UI design to backend database architecture

I would welcome the opportunity to discuss how my experience and enthusiasm for software engineering can contribute to [COMPANY]'s mission. Thank you for considering my application, and I look forward to the possibility of joining your team.

Sincerely,
Alex Mercer`,

  conversational: `Hi there!

I'm Alex, a CS student at MIT, and I'm really excited about the [ROLE] opening at [COMPANY]. I've been following your team's work for a while now, and I genuinely think this would be an incredible fit.

Here's the short version of why: I recently built StudentOS — basically an entire SaaS platform from scratch. It's got AI-powered resume optimization (using Google Gemini), a Kanban job tracker, interactive portfolio timelines, mock interview grading, and a document locker. The whole thing runs on React, TypeScript, Node.js, and Tailwind CSS. Building it taught me a lot about what it takes to ship a real product, not just a homework assignment.

What gets me up in the morning is building tools that people actually want to use. I obsess over the little things — smooth animations, intuitive layouts, graceful error handling. I think software should feel alive, and that's the kind of energy I'd bring to [COMPANY].

Beyond the code, I'm someone who communicates clearly, asks good questions, and genuinely enjoys collaborating with designers, PMs, and other engineers. I'd love to chat more about how I could contribute to what you're building.

Looking forward to hearing from you!

Cheers,
Alex Mercer`,

  technical: `Dear Engineering Team,

I am applying for the [ROLE] position at [COMPANY]. My application is grounded in extensive hands-on experience building production-grade web applications with modern technology stacks.

Technical Project Highlight — StudentOS:
• Architecture: React 19 + TypeScript frontend, Express.js/Node.js backend, Prisma ORM with MongoDB
• AI Integration: Google Gemini API for natural language processing — bio generation, resume ATS optimization, career roadmap compilation, and interview response grading with structured JSON output parsing
• State Management: React Context API with localStorage persistence for auth/theme state; graceful API fallback patterns with mock data generators to ensure zero-downtime demos
• UI Engineering: Tailwind CSS v4 with custom design tokens, Framer Motion for physics-based animations (spring-animated sidebar, page transitions, staggered list reveals), Recharts for interactive data visualizations
• Features: JWT authentication with protected routing, 5-column Kanban board with drag-style state transitions, split-pane resume builder with print-to-PDF, file upload simulator with progress tracking, GitHub contribution heatmap, and real-time notification system

Key Technical Decisions:
• Implemented class-based dark mode with system preference detection (prefers-color-scheme media query) for accessibility
• Designed API layer with try/catch fallback architecture — every external API call degrades gracefully to pre-computed mock data
• Used Tailwind's @config directive with PostCSS plugin for v4 compatibility, ensuring zero CSS-in-JS runtime overhead

I am prepared to discuss these implementations in detail and demonstrate the application live during a technical interview.

Best regards,
Alex Mercer`,
};

const CoverLetterGenerator: React.FC = () => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!company || !role) return;
    setIsGenerating(true);
    setGeneratedLetter('');

    try {
      const response = await axios.post('http://localhost:5001/api/ai/cover-letter', {
        company,
        role,
        jobDescription,
        tone: selectedTone,
      });
      if (response.data?.coverLetter) {
        setGeneratedLetter(response.data.coverLetter);
        setIsGenerating(false);
        return;
      }
    } catch {
      // Fall through to mock
    }

    // Mock fallback
    setTimeout(() => {
      let letter = mockCoverLetters[selectedTone] || mockCoverLetters.professional;
      letter = letter.replace(/\[COMPANY\]/g, company);
      letter = letter.replace(/\[ROLE\]/g, role);
      setGeneratedLetter(letter);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${company.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-brand-primary rounded-full" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-8 w-8 text-brand-primary" />
            Cover Letter Generator
          </h1>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">
          Generate tailored, AI-powered cover letters in seconds. Choose your tone, paste the job description, and let Gemini do the writing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left: Input Form */}
        <div className="space-y-5">
          {/* Company & Role */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-500" />
              Target Position
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Position / Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Job Description (Optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                placeholder="Paste the job description here for more tailored results..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 font-mono"
              />
            </div>
          </div>

          {/* Tone Selector */}
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-accent" />
              Writing Tone
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {toneOptions.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedTone === tone.id
                      ? 'border-brand-primary/50 bg-brand-primary/5 dark:bg-brand-primary/10 ring-1 ring-brand-primary/20'
                      : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <p className={`text-xs font-bold ${selectedTone === tone.id ? 'text-brand-primary' : 'text-slate-700 dark:text-zinc-300'}`}>
                    {tone.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tone.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !company || !role}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-brand-primary/20"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating with Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Right: Generated Output */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Generated Letter</h3>
            {generatedLetter && (
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  {copied ? <CheckCircle className="h-3 w-3 text-brand-success" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-xs font-semibold text-brand-primary hover:bg-brand-primary/20 transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            )}
          </div>

          {isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
              <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">Crafting your personalized cover letter...</p>
            </div>
          ) : generatedLetter ? (
            <div className="flex-1 overflow-y-auto">
              <pre className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                {generatedLetter}
              </pre>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-12">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                <FileText className="h-8 w-8 text-slate-300 dark:text-zinc-700" />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">No letter generated yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Fill in the company name, role, and optionally the job description, then click Generate.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
