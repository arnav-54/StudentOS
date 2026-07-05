import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, Sparkles, GraduationCap, AlertCircle } from 'lucide-react';
const AuthPage = () => {
    const { login, signup, mockLogin } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        if (isLogin) {
            const success = await login(email, password);
            setLoading(false);
            if (success) {
                navigate('/dashboard');
            }
            else {
                setErrorMessage('Invalid credentials. Check connection or try another combination.');
            }
        }
        else {
            if (!name) {
                setErrorMessage('Name is required.');
                setLoading(false);
                return;
            }
            // Sign up flows to OTP simulator
            const success = await signup(name, email, password);
            setLoading(false);
            if (success) {
                setShowOtp(true);
            }
            else {
                setErrorMessage('Failed to sign up. Try again.');
            }
        }
    };
    const handleOtpVerify = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulating OTP Code validation
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
    };
    const handleDemoAccess = async () => {
        await mockLogin();
        navigate('/dashboard');
    };
    return (<div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans">
      {/* Left side: Premium Branding & Visual Carousel (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#09090B] relative overflow-hidden flex-col justify-between p-12 text-white border-r border-zinc-900 grid-bg">
        {/* Decorative Floating Blobs */}
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-brand-primary/10 blur-[130px] animate-float-slow"/>
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-brand-violet/15 blur-[130px] animate-float-medium"/>

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-violet text-white shadow-lg shadow-brand-primary/20 border border-white/10">
            <GraduationCap className="h-6 w-6"/>
          </div>
          <span className="text-xl font-extrabold tracking-tight font-heading">StudentOS</span>
        </div>

        {/* Dynamic Display / Quotes */}
        <div className="my-auto space-y-8 relative z-10 max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/10 border border-brand-accent/20 text-brand-accent">
              <Sparkles className="h-3 w-3 animate-spin"/>
              <span>Next Gen Academic Platform</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400 font-heading">
              Your entire student journey, optimized.
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              Unlock a unified dashboard combining live academic history, interactive timelines, AI roadmapping, resume scoring, and mock interviews.
            </p>
          </motion.div>

          {/* Interactive Floating Card mock */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10 shadow-lg shadow-brand-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-brand-success animate-ping"/>
                <span className="text-xs font-bold text-slate-300">AI Placement Readiness</span>
              </div>
              <span className="text-sm font-bold text-brand-accent">94% Ready</span>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-gradient-to-r from-brand-primary to-brand-violet rounded-full"/>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">⚡ Add 1 more certification path to maximize matching rates.</p>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-zinc-500 relative z-10 flex justify-between font-medium">
          <span>© 2026 StudentOS Inc.</span>
          <span>Designed with Stripe & Linear philosophy</span>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-white dark:bg-zinc-950">
        {/* Glow blob for mobile background visual */}
        <div className="lg:hidden absolute top-0 right-0 h-48 w-48 rounded-full bg-brand-primary/5 blur-3xl"/>

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-violet text-white shadow-lg border border-white/10">
                <GraduationCap className="h-7 w-7"/>
              </div>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
              {showOtp ? 'Verification required' : isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
              {showOtp
            ? 'We sent a mock validation code to your email'
            : isLogin
                ? 'Sign in to access your customized academic operating system'
                : 'Get started with your personalized student dashboard today'}
            </p>
          </div>

          {/* Form wrapper */}
          <AnimatePresence mode="wait">
            {showOtp ? (<motion.form key="otp-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleOtpVerify} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 font-heading">
                    Enter OTP Code (Simulated: any code)
                  </label>
                  <div className="relative">
                    <input type="text" required placeholder="123456" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-center text-lg tracking-widest font-mono font-bold transition-all duration-300"/>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-brand-primary to-brand-violet hover:opacity-95 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-brand-primary/15 cursor-pointer">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  <ArrowRight className="h-4 w-4"/>
                </button>

                <p className="text-center text-xs text-slate-500 mt-4 font-semibold">
                  Didn't receive a code?{' '}
                  <span onClick={() => alert("Mock code re-sent!")} className="text-brand-primary hover:underline cursor-pointer">
                    Resend Code
                  </span>
                </p>
              </motion.form>) : (<motion.form key="auth-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (<div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-danger/10 border border-brand-danger/20 text-brand-danger text-sm font-semibold">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0"/>
                    <span>{errorMessage}</span>
                  </div>)}

                {!isLogin && (<div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 font-heading">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400"/>
                      <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300 font-semibold text-sm"/>
                    </div>
                  </div>)}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 font-heading">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400"/>
                    <input type="email" required placeholder="you@school.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300 font-semibold text-sm"/>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-heading">
                      Password
                    </label>
                    {isLogin && (<span className="text-xs text-brand-primary font-bold hover:underline cursor-pointer">
                        Forgot Password?
                      </span>)}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400"/>
                    <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300 font-semibold text-sm"/>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-brand-primary to-brand-violet hover:opacity-95 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-brand-primary/15 cursor-pointer text-sm">
                  {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4.5 w-4.5"/>
                </button>
              </motion.form>)}
          </AnimatePresence>

          {/* Social Logins and Demo Mode */}
          <div className="space-y-4 pt-5 border-t border-slate-100 dark:border-zinc-900">
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-950 px-3 text-slate-400 font-bold tracking-wider">Or continue with</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={handleDemoAccess} className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-zinc-800 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 text-xs font-bold rounded-xl text-slate-700 dark:text-zinc-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm">
                ⚡ Demo
              </button>
              <button type="button" onClick={() => {
            window.location.href = "http://localhost:5001/api/auth/google";
        }} className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-zinc-800 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 text-xs font-bold rounded-xl text-slate-700 dark:text-zinc-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.68 14.9 1 12 1 7.35 1 3.4 3.65 1.57 7.5l3.74 2.9C6.2 7.14 8.87 5.04 12 5.04z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.75-4.87 3.75-8.5z"/>
                  <path fill="#FBBC05" d="M5.31 14.6c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.57 7.1C.57 9.1 0 11.49 0 14s.57 4.9 1.57 6.9l3.74-2.9c-.24-.7-.38-1.48-.38-2.4z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.66-2.84c-1.02.68-2.32 1.09-4.3 1.09-3.13 0-5.8-2.1-6.75-5.36L1.51 15.9C3.34 19.75 7.29 23 12 23z"/>
                </svg>
                Google
              </button>
              <button type="button" onClick={() => {
            window.location.href = "http://localhost:5001/api/auth/github";
        }} className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-zinc-800 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 text-xs font-bold rounded-xl text-slate-700 dark:text-zinc-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm">
                <svg className="h-3.5 w-3.5 fill-current text-slate-700 dark:text-zinc-300" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            <p className="text-center text-sm text-slate-500 mt-3 font-semibold">
              {isLogin ? "New to StudentOS?" : "Already have an account?"}{' '}
              <span onClick={() => setIsLogin(!isLogin)} className="text-brand-primary dark:text-emerald-400 hover:underline font-bold cursor-pointer">
                {isLogin ? 'Create Account' : 'Sign In'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>);
};
export default AuthPage;
