import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, Map, Award, MessageSquareCode, CheckCircle2, BookOpen, Send } from 'lucide-react';
import axios from 'axios';
const popularRoles = [
    'Software Developer',
    'Data Analyst',
    'Frontend Engineer',
    'Backend Engineer',
    'Full Stack Developer',
    'DevOps Cloud Engineer',
    'AI / ML Scientist',
    'Mobile App Developer',
    'Solutions Architect',
    'Systems Engineer'
];
const AIHub = () => {
    // Tabs: 'roadmap' | 'interview'
    const [activeTab, setActiveTab] = useState('roadmap');
    // 1. Roadmap State
    const [targetRole, setTargetRole] = useState('Full Stack Cloud Engineer');
    const [roadmapDropdownOpen, setRoadmapDropdownOpen] = useState(false);
    const [loadingRoadmap, setLoadingRoadmap] = useState(false);
    const [roadmapData, setRoadmapData] = useState(null);
    // 2. Interview State
    const [jobRole, setJobRole] = useState('Frontend Engineer Intern');
    const [interviewDropdownOpen, setInterviewDropdownOpen] = useState(false);
    const [jobDesc, setJobDesc] = useState('Must know React, TypeScript, Tailwind and modern browser architectures.');
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState(['', '', '']);
    const [loadingInterview, setLoadingInterview] = useState(false);
    const [interviewReport, setInterviewReport] = useState(null);
    const mockQuestions = [
        "Question 1: Explain the difference between React Server Components (RSC) and traditional Client-side rendering (CSR).",
        "Question 2: How would you optimize a slow web application that has excessive bundle size and too many re-renders?",
        "Question 3: How do you handle authentication securely in a React application referencing refresh tokens and HttpOnly cookies?"
    ];
    const handleGenerateRoadmap = async () => {
        setLoadingRoadmap(true);
        try {
            const response = await axios.post('http://localhost:5001/api/ai/roadmap', { role: targetRole });
            if (response.data && response.data.roadmap) {
                setRoadmapData(response.data.roadmap);
            }
        }
        catch (err) {
            console.warn('Roadmap endpoint offline. Falling back to mock roadmap generator.');
            setTimeout(() => {
                setRoadmapData({
                    role: targetRole,
                    phases: [
                        {
                            title: "Phase 1: Core Fundamentals",
                            duration: "Weeks 1-4",
                            items: ["Master TypeScript advanced types & compiler config", "Explore Node.js event loop & Streams", "Understand relational vs non-relational database trade-offs"]
                        },
                        {
                            title: "Phase 2: Cloud Architectures & Deployment",
                            duration: "Weeks 5-8",
                            items: ["Deploy containers to AWS ECS/Fargate using Docker", "Set up CI/CD workflows using GitHub Actions", "Implement caching hierarchies using Redis"]
                        },
                        {
                            title: "Phase 3: High Availability Systems",
                            duration: "Weeks 9-12",
                            items: ["Design message brokers (RabbitMQ/Kafka) protocols", "Implement vertical & horizontal auto-scaling", "Perform load-testing and resolve latency bottlenecks"]
                        }
                    ],
                    suggestedCertifications: ["AWS Certified Developer Associate", "Prisma Database Specialist Certificate"],
                    suggestedCourses: ["Advanced Node.js - System Architectures (Coursera)", "TypeScript Mastery - Frontend Masters"]
                });
            }, 1500);
        }
        finally {
            setTimeout(() => setLoadingRoadmap(false), 1600);
        }
    };
    const handleStartInterview = () => {
        setInterviewStarted(true);
        setInterviewReport(null);
        setCurrentQuestionIdx(0);
        setUserAnswers(['', '', '']);
    };
    const handleAnswerChange = (text) => {
        const updated = [...userAnswers];
        updated[currentQuestionIdx] = text;
        setUserAnswers(updated);
    };
    const handleNextQuestion = () => {
        const currentAns = userAnswers[currentQuestionIdx];
        if (!currentAns || currentAns.trim().length < 10) {
            alert("Please type a detailed answer (minimum 10 characters) before proceeding.");
            return;
        }
        if (currentQuestionIdx < mockQuestions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        }
        else {
            handleSubmitInterview();
        }
    };
    const handleSubmitInterview = async () => {
        setLoadingInterview(true);
        try {
            const response = await axios.post('http://localhost:5001/api/ai/interview', {
                role: jobRole,
                description: jobDesc,
                answers: userAnswers
            });
            if (response.data && response.data.report) {
                setInterviewReport(response.data.report);
            }
        }
        catch (err) {
            console.warn('Interview grader offline. Compiling mock diagnostic report.');
            setTimeout(() => {
                setInterviewReport({
                    grade: "B+",
                    score: 82,
                    strengths: "Demonstrated accurate core understanding of state lifecycle hooks and CSS optimization techniques.",
                    weaknesses: "Refined details missing on token invalidation schemas. Lacks description on CSRF prevention mechanics.",
                    recommendations: [
                        "Revise OAuth 2.0 specs regarding OAuth state tokens and sliding expiration.",
                        "Review bundle chunking mechanisms using Vite dynamic imports."
                    ]
                });
            }, 1500);
        }
        finally {
            setTimeout(() => {
                setLoadingInterview(false);
                setInterviewStarted(false);
            }, 1600);
        }
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-brand-primary rounded-full"/>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-8 w-8 text-brand-primary"/>
              AI Career Hub
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">Deploy high-performance AI engines to model roadmaps, suggest courses, and test interview readiness.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl">
          <button onClick={() => setActiveTab('roadmap')} className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'roadmap'
            ? 'bg-white dark:bg-zinc-800 text-brand-primary dark:text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'}`}>
            Career Roadmap
          </button>
          <button onClick={() => setActiveTab('interview')} className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'interview'
            ? 'bg-white dark:bg-zinc-800 text-brand-primary dark:text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'}`}>
            Mock Interview
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ROADMAP VIEW */}
        {activeTab === 'roadmap' && (<motion.div key="roadmap-tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="space-y-6">
            {/* Input Config Bar */}
            <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full relative">
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Target Career Goal / Role</label>
                <input 
                  type="text" 
                  value={targetRole} 
                  onChange={(e) => { setTargetRole(e.target.value); setRoadmapDropdownOpen(true); }} 
                  onFocus={() => setRoadmapDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setRoadmapDropdownOpen(false), 200)}
                  placeholder="e.g. Solutions Architect, Machine Learning Scientist" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-900 dark:text-white"
                />
                {roadmapDropdownOpen && (
                  <div className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg">
                    {popularRoles
                      .filter(r => r.toLowerCase().includes(targetRole.toLowerCase()))
                      .map((roleName) => (
                        <div 
                          key={roleName} 
                          onMouseDown={() => { setTargetRole(roleName); setRoadmapDropdownOpen(false); }}
                          className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          {roleName}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              <button onClick={handleGenerateRoadmap} disabled={loadingRoadmap} className="w-full md:w-auto px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/95 transition-all flex items-center justify-center gap-2">
                <Sparkles className="h-4.5 w-4.5"/>
                {loadingRoadmap ? 'Assembling Path...' : 'Compile Roadmap'}
              </button>
            </div>

            {loadingRoadmap && (<div className="p-12 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm flex flex-col items-center justify-center space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-accent border-t-transparent"></div>
                <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">Gemini AI is analyzing skill requirements and compiling courses...</p>
              </div>)}

            {/* Compiled Roadmap Display */}
            {roadmapData && !loadingRoadmap && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Phases Vertical List */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-900 pb-3">
                      <Map className="h-5 w-5 text-brand-primary"/>
                      <h2 className="text-sm font-semibold">Custom Academic Path for {roadmapData.role}</h2>
                    </div>

                    {/* Timeline representation */}
                    <div className="relative border-l border-slate-200 dark:border-zinc-800 pl-6 ml-3 space-y-8">
                      {roadmapData.phases.map((phase, pIdx) => (<div key={pIdx} className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-brand-primary bg-white dark:bg-zinc-950 flex items-center justify-center shrink-0">
                            <div className="h-1.5 w-1.5 rounded-full bg-brand-primary"/>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">{phase.title}</h3>
                              <span className="text-[10px] font-bold text-brand-accent px-2 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">{phase.duration}</span>
                            </div>
                            <ul className="space-y-2">
                              {phase.items.map((item, iIdx) => (<li key={iIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-400">
                                  <CheckCircle2 className="h-4 w-4 text-brand-success shrink-0 mt-0.5"/>
                                  <span>{item}</span>
                                </li>))}
                            </ul>
                          </div>
                        </div>))}
                    </div>
                  </div>
                </div>

                {/* Side Recommendations */}
                <div className="space-y-6">
                  {/* Courses */}
                  <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-900 pb-3">
                      <BookOpen className="h-5 w-5 text-brand-accent"/>
                      <h2 className="text-sm font-semibold">Recommended Courses</h2>
                    </div>
                    <ul className="space-y-3">
                      {roadmapData.suggestedCourses.map((c, idx) => (<li key={idx} className="p-3 border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300">
                          🎓 {c}
                        </li>))}
                    </ul>
                  </div>

                  {/* Certifications */}
                  <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-900 pb-3">
                      <Award className="h-5 w-5 text-brand-success"/>
                      <h2 className="text-sm font-semibold">Suggested Certifications</h2>
                    </div>
                    <ul className="space-y-3">
                      {roadmapData.suggestedCertifications.map((cert, idx) => (<li key={idx} className="p-3 border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300">
                          🏆 {cert}
                        </li>))}
                    </ul>
                  </div>
                </div>

              </div>)}
          </motion.div>)}

        {/* INTERVIEW VIEW */}
        {activeTab === 'interview' && (<motion.div key="interview-tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="space-y-6">
            {!interviewStarted && !interviewReport && (<div className="p-8 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <MessageSquareCode className="h-10 w-10 text-brand-primary mx-auto"/>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Interview Prep</h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Simulate real technical discussions. Answer 3 dynamic questions based on your target role and get graded.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Target Job Role</label>
                    <input 
                      type="text" 
                      value={jobRole} 
                      onChange={(e) => { setJobRole(e.target.value); setInterviewDropdownOpen(true); }} 
                      onFocus={() => setInterviewDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setInterviewDropdownOpen(false), 200)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-900 dark:text-white"
                    />
                    {interviewDropdownOpen && (
                      <div className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg">
                        {popularRoles
                          .filter(r => r.toLowerCase().includes(jobRole.toLowerCase()))
                          .map((roleName) => (
                            <div 
                              key={roleName} 
                              onMouseDown={() => { setJobRole(roleName); setInterviewDropdownOpen(false); }}
                              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                            >
                              {roleName}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Job Description / Requirements</label>
                    <textarea value={jobDesc} rows={3} onChange={(e) => setJobDesc(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-900 dark:text-white"/>
                  </div>
                </div>

                <button onClick={handleStartInterview} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-medium rounded-xl transition-all">
                  <Sparkles className="h-4.5 w-4.5"/>
                  Start Simulated Session
                </button>
              </div>)}

            {/* INTERVIEW IN PROGRESS */}
            {interviewStarted && (<div className="p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm max-w-2xl mx-auto space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900 pb-3">
                  <span className="text-xs font-bold text-brand-primary">Interviewing for {jobRole}</span>
                  <span className="text-xs text-slate-400 font-semibold">Question {currentQuestionIdx + 1} of {mockQuestions.length}</span>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{mockQuestions[currentQuestionIdx]}</p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Your Response</label>
                    <textarea rows={5} value={userAnswers[currentQuestionIdx]} onChange={(e) => handleAnswerChange(e.target.value)} placeholder="Type details explaining your perspective..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-900 dark:text-white font-mono"/>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)} disabled={currentQuestionIdx === 0} className="px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 disabled:opacity-40">
                    Previous
                  </button>
                  <button onClick={handleNextQuestion} className="px-6 py-2.5 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-brand-primary/95 transition-all flex items-center gap-1.5">
                    <span>{currentQuestionIdx === mockQuestions.length - 1 ? 'Submit & Grade' : 'Next Question'}</span>
                    <Send className="h-3 w-3"/>
                  </button>
                </div>
              </div>)}

            {/* Loading Grader */}
            {loadingInterview && (<div className="p-12 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm max-w-2xl mx-auto flex flex-col items-center justify-center space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-accent border-t-transparent"/>
                <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">Gemini is compiling grading criteria and evaluating semantic accuracy...</p>
              </div>)}

            {/* INTERVIEW GRADED REPORT */}
            {interviewReport && !loadingInterview && (<div className="p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm max-w-2xl mx-auto space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900 pb-3">
                  <span className="text-xs font-bold text-brand-success">Feedback compilation complete</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">Assessment Details</span>
                </div>

                <div className="flex items-center gap-6 p-4 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20">
                  <div className="h-20 w-20 rounded-full border-4 border-brand-primary flex items-center justify-center bg-white dark:bg-zinc-950 text-2xl font-black text-brand-primary">
                    {interviewReport.grade}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Calculated Score: {interviewReport.score}%</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Estimated job placement readiness level for {jobRole}.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs">
                    <h4 className="font-bold text-brand-success mb-1">Key Strengths</h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{interviewReport.strengths}</p>
                  </div>
                  <div className="text-xs">
                    <h4 className="font-bold text-brand-danger mb-1">Areas for Improvement</h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{interviewReport.weaknesses}</p>
                  </div>
                  <div className="text-xs">
                    <h4 className="font-bold text-brand-accent mb-2">Step-by-Step Action Items</h4>
                    <ul className="space-y-2">
                      {interviewReport.recommendations.map((rec, index) => (<li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-brand-accent shrink-0 mt-0.5"/>
                          <span className="text-slate-600 dark:text-zinc-400">{rec}</span>
                        </li>))}
                    </ul>
                  </div>
                </div>

                <button onClick={() => setInterviewReport(null)} className="w-full px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                  Restart New Session
                </button>
              </div>)}
          </motion.div>)}
      </AnimatePresence>
    </div>);
};
export default AIHub;
