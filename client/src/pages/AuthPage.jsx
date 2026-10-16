import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, GraduationCap, AlertCircle, CheckCircle2, Code2, Briefcase, BarChart3, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '../services/api';
import StudentOSLogo from '../components/StudentOSLogo';

const AuthPage = () => {
    const { login, signup, user, setAuthSession } = useAuth();
    const navigate = useNavigate();

    const goBack = () => {
        // If already logged in → go to dashboard, else go to landing page
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };
    const [isLogin, setIsLogin] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle OAuth redirect params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const id = params.get('id');
        const emailParam = params.get('email');
        const nameParam = params.get('name');
        const error = params.get('error');

        if (error) {
            setErrorMessage('Google sign-in was cancelled or encountered an issue. Please try again.');
        } else if (token && id && emailParam) {
            if (setAuthSession) {
                setAuthSession({
                    id,
                    name: nameParam || 'Google User',
                    email: emailParam,
                    token
                });
            } else {
                localStorage.setItem('studentos_user', JSON.stringify({
                    id,
                    name: nameParam || 'Google User',
                    email: emailParam,
                    token
                }));
            }
            navigate('/dashboard', { replace: true });
        }
    }, [navigate, setAuthSession]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        if (isLogin) {
            const success = await login(email, password);
            setLoading(false);
            if (success) {
                navigate('/dashboard');
            } else {
                setErrorMessage('Incorrect email or password. Please try again.');
            }
        } else {
            if (!name) {
                setErrorMessage('Full name is required.');
                setLoading(false);
                return;
            }
            const success = await signup(name, email, password);
            setLoading(false);
            if (success) {
                setShowOtp(true);
            } else {
                setErrorMessage('Could not create account. Email may already be in use.');
            }
        }
    };

    const handleOtpVerify = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1200);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans">
            {/* Left side: Branding Panel (Hidden on mobile) */}
            <div className="hidden lg:flex w-[45%] bg-[#09090B] relative overflow-hidden flex-col justify-between p-12 text-white border-r border-zinc-900">
                {/* Subtle background blobs */}
                <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 h-60 w-60 rounded-full bg-indigo-600/8 blur-[100px] pointer-events-none" />

                {/* Brand Header */}
                <div className="relative z-10">
                    <StudentOSLogo 
                        size={38} 
                        textClassName="text-white text-xl" 
                        onClick={goBack}
                    />
                </div>

                {/* Main Content */}
                <div className="my-auto space-y-10 relative z-10 max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-5"
                    >
                        <h1 className="text-4xl font-black tracking-tight leading-[1.1] text-white font-heading">
                            Your placement preparation, organized.
                        </h1>
                        <p className="text-zinc-400 text-base font-medium leading-relaxed">
                            Track job applications, monitor your GitHub and LeetCode progress, build your resume, and identify skill gaps — all from one dashboard.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="space-y-3"
                    >
                        {[
                            { icon: Briefcase, text: "Track applications from apply to offer" },
                            { icon: Code2, text: "See GitHub and LeetCode stats in one place" },
                            { icon: BarChart3, text: "Get a placement readiness score with gaps" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                                    <item.icon className="h-4 w-4 text-violet-400" />
                                </div>
                                <span className="text-sm font-medium text-zinc-300">{item.text}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Mini score preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Placement Readiness</span>
                            <span className="text-sm font-bold text-violet-400">74 / 100</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-[74%] bg-violet-500 rounded-full" />
                        </div>
                        <div className="grid grid-cols-3 gap-3 pt-1">
                            {[
                                { label: "LeetCode", val: "216" },
                                { label: "GitHub", val: "342+" },
                                { label: "Applied", val: "12" },
                            ].map((s, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-sm font-black text-white">{s.val}</p>
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="text-xs text-zinc-600 relative z-10">
                    <span>© 2026 StudentOS</span>
                </div>
            </div>

            {/* Right side: Auth Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-zinc-950">

                <div className="w-full max-w-md space-y-8 relative z-10">
                    {/* Top navigation helper */}
                    <div className="flex items-center justify-between pb-2">
                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center">
                            <StudentOSLogo size={32} onClick={goBack} />
                        </div>
                        <button
                            type="button"
                            onClick={goBack}
                            className="text-xs font-semibold text-slate-500 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors ml-auto flex items-center gap-1.5 cursor-pointer"
                        >
                            <span>{user ? '← Back to Dashboard' : '← Back to Home'}</span>
                        </button>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                            {showOtp ? 'Verify your email' : isLogin ? 'Welcome back' : 'Create your account'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
                            {showOtp
                                ? 'Enter the verification code we sent to your email'
                                : isLogin
                                    ? 'Sign in to your StudentOS dashboard'
                                    : 'Set up your free account to get started'}
                        </p>
                    </div>

                    {/* Form */}
                    <AnimatePresence mode="wait">
                        {showOtp ? (
                            <motion.form
                                key="otp-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleOtpVerify}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-heading">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="6-digit code"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-center text-lg tracking-widest font-mono font-bold transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
                                >
                                    {loading ? 'Verifying...' : 'Verify Code'}
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
                                    Didn't receive the code?{' '}
                                    <span
                                        onClick={() => alert('Code re-sent!')}
                                        className="text-violet-600 dark:text-violet-400 hover:underline cursor-pointer font-bold"
                                    >
                                        Resend
                                    </span>
                                </p>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="auth-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {errorMessage && (
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-semibold">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                {!isLogin && (
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-heading">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all font-medium text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-heading">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@university.edu"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-heading">
                                            Password
                                        </label>
                                        {isLogin && (
                                            <span className="text-xs text-violet-600 dark:text-violet-400 font-bold hover:underline cursor-pointer">
                                                Forgot password?
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            minLength={8}
                                            maxLength={128}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all font-medium text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer transition-colors"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {!isLogin && (
                                        <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
                                            <span>Must be at least 8 characters</span>
                                            <span className={password.length >= 8 ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                                                {password.length}/128
                                            </span>
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 text-sm"
                                >
                                    {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* OAuth Options */}
                    <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-zinc-800">
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-zinc-950 px-3 text-slate-400 font-bold tracking-wider">Or continue with</span>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => { window.location.href = `${API_BASE_URL}/auth/google`; }}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm font-semibold rounded-xl text-slate-700 dark:text-zinc-200 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.68 14.9 1 12 1 7.35 1 3.4 3.65 1.57 7.5l3.74 2.9C6.2 7.14 8.87 5.04 12 5.04z" />
                                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.75-4.87 3.75-8.5z" />
                                    <path fill="#FBBC05" d="M5.31 14.6c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.57 7.1C.57 9.1 0 11.49 0 14s.57 4.9 1.57 6.9l3.74-2.9c-.24-.7-.38-1.48-.38-2.4z" />
                                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.66-2.84c-1.02.68-2.32 1.09-4.3 1.09-3.13 0-5.8-2.1-6.75-5.36L1.51 15.9C3.34 19.75 7.29 23 12 23z" />
                                </svg>
                                Continue with Google
                            </button>
                        </div>

                        <p className="text-center text-sm text-slate-500 dark:text-zinc-400 font-medium">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <span
                                onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }}
                                className="text-violet-600 dark:text-violet-400 hover:underline font-bold cursor-pointer"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
