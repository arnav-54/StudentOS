import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import axios from 'axios';

const quickPrompts = [
  "Help me write a cold email to a recruiter",
  "Explain Big-O notation for my interview",
  "Review my project description for ATS",
  "Give me tips for system design interviews",
  "Suggest resume improvements for SDE roles",
];

const mockResponses = {
  default: `Great question! Here's what I'd recommend based on your profile:\n\n**Key Action Items:**\n1. Focus on quantifying your project impact with metrics (e.g., "reduced load time by 40%")\n2. Tailor your resume keywords to match the specific job description\n3. Practice explaining your projects in the STAR format\n\nWould you like me to help with any of these specifically?`,
  email: `Here's a template for a cold recruiter email:\n\n**Subject:** Software Engineering Intern — [Your University] Student with Full-Stack Experience\n\nHi [Recruiter Name],\n\nI'm [Your Name], a [Year] studying [Major] at [University]. I came across the [Role] position at [Company] and I'm genuinely excited about [specific thing about the company].\n\nI recently built StudentOS — a full-stack SaaS platform with AI-powered career tools, React/TypeScript frontend, and Express backend. I'd love to bring this kind of product thinking to your team.\n\nWould you be open to a 15-minute chat?\n\nBest,\n[Your Name]`,
  "big-o": `**Big-O Notation Crash Course for Interviews:**\n\n| Complexity | Name | Example |\n|---|---|---|\n| O(1) | Constant | Hash table lookup |\n| O(log n) | Logarithmic | Binary search |\n| O(n) | Linear | Array traversal |\n| O(n log n) | Linearithmic | Merge sort |\n| O(n²) | Quadratic | Nested loops |\n| O(2ⁿ) | Exponential | Recursive fibonacci |\n\n**Interview Tip:** Always discuss time AND space complexity. Mention trade-offs like "I can reduce time to O(n) by using a hash map, trading O(n) extra space."`,
  resume: `**ATS Resume Optimization Tips:**\n\n✅ **Do:**\n- Start bullets with strong action verbs (Engineered, Orchestrated, Optimized)\n- Include metrics: "Reduced API latency by 35%", "Served 10K+ daily users"\n- Match exact keywords from the job description\n- Use standard section headers (Experience, Education, Skills)\n\n❌ **Don't:**\n- Use tables, columns, or graphics (ATS can't parse them)\n- Include photos or custom fonts\n- Write "References available upon request"\n\nWant me to optimize a specific bullet point?`,
  system: `**System Design Interview Framework (FAANG-ready):**\n\n**1. Clarify Requirements (2-3 min)**\n- Functional vs non-functional requirements\n- Scale: users, QPS, data volume\n\n**2. High-Level Design (5-7 min)**\n- API endpoints\n- Database schema\n- Core architecture diagram\n\n**3. Deep Dive (10-15 min)**\n- Database choice & sharding strategy\n- Caching layers (Redis, CDN)\n- Load balancing & horizontal scaling\n\n**4. Address Bottlenecks (3-5 min)**\n- Single points of failure\n- Rate limiting\n- Monitoring & alerting\n\nPractice with: URL shortener, chat system, or notification service.`,
};

function getSmartResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  if (lower.includes('email') || lower.includes('recruiter') || lower.includes('cold')) {
    return mockResponses.email;
  }
  if (lower.includes('big-o') || lower.includes('big o') || lower.includes('complexity') || lower.includes('notation')) {
    return mockResponses['big-o'];
  }
  if (lower.includes('resume') || lower.includes('ats') || lower.includes('bullet')) {
    return mockResponses.resume;
  }
  if (lower.includes('system design') || lower.includes('architecture') || lower.includes('scalab')) {
    return mockResponses.system;
  }
  return mockResponses.default;
}

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey! 👋 I'm your StudentOS AI assistant powered by Gemini. I can help with resume tips, interview prep, cold emails, career advice, and more. What do you need help with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Try real API first, then fall back to smart mock
    try {
      const response = await axios.post('http://localhost:5001/api/ai/chat', {
        message: messageText,
      });
      if (response.data?.reply) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Fall through to mock
    }

    // Mock fallback with typing delay
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSmartResponse(messageText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-tr from-brand-primary via-brand-violet to-brand-cyberPink text-white shadow-2xl flex items-center justify-center cursor-pointer animate-orb-glow border border-white/15"
          >
            <Sparkles className="h-6.5 w-6.5 animate-spin" style={{ animationDuration: '6s' }} />
            {/* Notification ping */}
            <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed z-50 flex flex-col bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden transition-all duration-300 ${
              isExpanded
                ? 'bottom-0 right-0 w-full sm:w-[520px] h-full sm:h-[calc(100vh-2rem)] sm:bottom-4 sm:right-4 rounded-none sm:rounded-2xl'
                : 'bottom-4 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] rounded-2xl'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white flex items-center justify-center">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">AI Assistant</p>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-success animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-medium">Powered by Gemini</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === 'assistant'
                        ? 'bg-gradient-to-tr from-brand-primary to-brand-accent text-white'
                        : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    {msg.role === 'assistant' ? <Sparkles className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === 'assistant'
                        ? 'bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-zinc-800 rounded-tl-sm'
                        : 'bg-brand-primary text-white rounded-tr-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent text-white flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 text-brand-primary animate-spin" />
                    <span className="text-xs text-slate-400">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 shrink-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick prompts</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="px-3 py-1.5 text-[10px] font-medium bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-800 rounded-full hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/30 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-slate-100 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-900/20 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your career..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 rounded-xl bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary/90 disabled:opacity-40 transition-all shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
