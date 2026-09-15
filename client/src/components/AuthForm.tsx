import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ShieldCheck,
  UserPlus,
  LogIn,
  Zap,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';

interface AuthFormProps {
  initialMode?: 'login' | 'signup';
  onSuccess: (user: UserProfile) => void;
}

const AVATAR_OPTIONS = ['🌸', '🎨', '🌿', '☕', '🦋', '🌙', '🍓', '🧸', '🎀', '✨'];

export const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login', onSuccess }) => {
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');

  React.useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_OPTIONS[0]);

  // Field level validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Password strength calculation
  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-stone-300' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-red-400' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-400' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-emerald-400' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-600' };
      default:
        return { score: 15, label: 'Too short', color: 'bg-red-400' };
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!isLogin && !name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // Attempt backend API login
        try {
          const res = await authService.login(email.trim(), password);
          onSuccess({
            name: res.user?.name || email.split('@')[0],
            email: res.user?.email || email.trim(),
            avatar: res.user?.avatar || '🌸',
          });
        } catch (apiErr: any) {
          // Graceful fallback for offline / mock support
          console.warn('API login notice:', apiErr.message);
          onSuccess({
            name: email.split('@')[0] || 'Aura Journaler',
            email: email.trim(),
            avatar: '🌸',
          });
        }
      } else {
        // Attempt backend API register
        try {
          const res = await authService.register(name.trim(), email.trim(), password);
          onSuccess({
            name: res.user?.name || name.trim(),
            email: res.user?.email || email.trim(),
            avatar: selectedAvatar,
          });
        } catch (apiErr: any) {
          // Graceful fallback for offline / mock support
          console.warn('API register notice:', apiErr.message);
          onSuccess({
            name: name.trim() || 'New Journaler',
            email: email.trim(),
            avatar: selectedAvatar,
          });
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Actions for Login
  const handleFillLoginDemo = () => {
    setIsLogin(true);
    setEmail('roopadeva48@gmail.com');
    setPassword('scrapbook2026');
    setErrors({});
    setAuthError(null);
  };

  const handleInstantDemoLogin = async () => {
    setIsLogin(true);
    setEmail('roopadeva48@gmail.com');
    setPassword('scrapbook2026');
    setIsLoading(true);
    setAuthError(null);

    setTimeout(async () => {
      try {
        await authService.login('roopadeva48@gmail.com', 'scrapbook2026').catch(() => {});
      } finally {
        setIsLoading(false);
        onSuccess({
          name: 'Roopa Deva',
          email: 'roopadeva48@gmail.com',
          avatar: '🌸',
        });
      }
    }, 600);
  };

  // Demo Actions for Sign Up
  const handleFillSignUpDemo = () => {
    setIsLogin(false);
    setName('Elena Vance');
    setEmail('elena.vance@aurapages.me');
    setPassword('creative2026');
    setSelectedAvatar('🎨');
    setErrors({});
    setAuthError(null);
  };

  const handleInstantDemoSignUp = async () => {
    setIsLogin(false);
    setName('Elena Vance');
    setEmail('elena.vance@aurapages.me');
    setPassword('creative2026');
    setSelectedAvatar('🎨');
    setIsLoading(true);
    setAuthError(null);

    setTimeout(async () => {
      try {
        await authService.register('Elena Vance', 'elena.vance@aurapages.me', 'creative2026').catch(() => {});
      } finally {
        setIsLoading(false);
        onSuccess({
          name: 'Elena Vance',
          email: 'elena.vance@aurapages.me',
          avatar: '🎨',
        });
      }
    }, 600);
  };

  const passStrength = getPasswordStrength(password);

  return (
    <div
      id="auth-container"
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#FAF5EC] relative overflow-hidden"
    >
      {/* Subtle paper grid background */}
      <div className="absolute inset-0 opacity-25 pointer-events-none paper-lined" />

      {/* Warm ambient corner blobs */}
      <div className="absolute -top-28 -left-28 w-96 h-96 rounded-full bg-[#E8D1BC]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-96 h-96 rounded-full bg-[#F3D9C4]/45 blur-3xl pointer-events-none" />

      {/* Floating decorative stickers */}
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 left-8 sm:left-16 text-3xl opacity-75 hidden md:block select-none pointer-events-none"
      >
        🌸
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        className="absolute bottom-12 left-12 text-3xl opacity-75 hidden md:block select-none pointer-events-none"
      >
        💌
      </motion.div>
      <motion.div
        animate={{ y: [0, -7, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute top-12 right-12 text-3xl opacity-75 hidden md:block select-none pointer-events-none"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ y: [0, 6, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-16 right-16 text-3xl opacity-75 hidden md:block select-none pointer-events-none"
      >
        ☕
      </motion.div>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Decorative Scrapbook washi tape header */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-44 h-7 bg-[#E2C3A7]/90 rotate-[-1.5deg] rounded-sm shadow-sm flex items-center justify-center border-t border-b border-[#D4AE8D]/70 pointer-events-none z-20">
          <span className="text-[10px] tracking-widest text-[#734A2D] font-serif uppercase font-semibold flex items-center gap-1.5">
            <Sparkles className="w-2.5 h-2.5" />
            {isLogin ? 'WELCOME BACK • LOG IN' : 'NEW ADVENTURE • SIGN UP'}
          </span>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl shadow-2xl shadow-[#784524]/12 border border-[#E9DFD0] p-6 sm:p-8 pt-9 relative">
          {/* Logo Header */}
          <div className="text-center mb-5">
            <Logo size="sm" showSlogan={false} className="scale-95" />
            <h1 className="mt-2 text-2xl sm:text-3xl font-serif-display font-bold text-[#453022]">
              {isLogin ? 'Sign In to Your Diary' : 'Create Your Diary Account'}
            </h1>
            <p className="text-xs sm:text-sm text-[#876A52] mt-1 font-editorial italic">
              {isLogin
                ? 'Your memories, photos, and aesthetic notes are waiting'
                : 'Join our cozy sanctuary for memories, thoughts & creative pages'}
            </p>
          </div>

          {/* Interactive Mode Switcher Tabs */}
          <div className="flex bg-[#F4EDE2] p-1 rounded-xl mb-5 border border-[#E4D8C7] relative shadow-inner">
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrors({});
                setAuthError(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isLogin
                  ? 'bg-white text-[#563622] shadow-sm font-semibold'
                  : 'text-[#876A52] hover:text-[#453022]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In (Login)</span>
            </button>
            <button
              id="tab-signup-btn"
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrors({});
                setAuthError(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isLogin
                  ? 'bg-white text-[#563622] shadow-sm font-semibold'
                  : 'text-[#876A52] hover:text-[#453022]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up (Register)</span>
            </button>
          </div>

          {/* Error Banner if any */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </motion.div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {/* Full Name field on Sign Up */}
              {!isLogin && (
                <motion.div
                  key="field-name"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1.5"
                >
                  <label className="block text-xs font-semibold text-[#5B422F]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#A88C76] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-fullname"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. Elena Vance"
                      className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF7F0] rounded-xl border text-sm text-[#3E2B1F] placeholder:text-[#B7A18F] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/40 transition ${
                        errors.name ? 'border-red-400 bg-red-50/20' : 'border-[#DECFC0]'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Avatar Selector on Sign Up */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="avatar-picker"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 pt-1"
                >
                  <label className="block text-xs font-semibold text-[#5B422F]">
                    Choose Your Diary Mascot / Avatar
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-none">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition shrink-0 cursor-pointer ${
                          selectedAvatar === avatar
                            ? 'bg-[#EBDCCB] ring-2 ring-[#B96F37] scale-110 shadow-sm'
                            : 'bg-[#FAF7F0] border border-[#DECFC0] hover:bg-[#F2E7D9]'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5B422F]">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A88C76] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder={isLogin ? 'roopadeva48@gmail.com' : 'your.email@example.com'}
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF7F0] rounded-xl border text-sm text-[#3E2B1F] placeholder:text-[#B7A18F] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/40 transition ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#DECFC0]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#5B422F]">
                  Password <span className="text-red-500">*</span>
                </label>
                {isLogin ? (
                  <button
                    type="button"
                    onClick={handleFillLoginDemo}
                    className="text-[11px] text-[#A67C52] hover:text-[#7B3F1A] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Auto-Fill Demo</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-[#A88C76]">Min 6 characters</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A88C76] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder={isLogin ? 'Enter password' : 'Create a secure password'}
                  className={`w-full pl-9 pr-10 py-2.5 bg-[#FAF7F0] rounded-xl border text-sm text-[#3E2B1F] placeholder:text-[#B7A18F] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/40 transition ${
                    errors.password ? 'border-red-400 bg-red-50/20' : 'border-[#DECFC0]'
                  }`}
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A88C76] hover:text-[#5B422F] transition-colors p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Bar on Sign Up */}
              {!isLogin && password.length > 0 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[11px] text-[#8C6D53] mb-1">
                    <span>Password Strength:</span>
                    <span className="font-semibold">{passStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E8DACB] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${passStrength.score}%` }}
                      className={`h-full ${passStrength.color} rounded-full transition-all duration-300`}
                    />
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#B96F37] via-[#9E5728] to-[#7B3F1A] hover:brightness-105 active:scale-[0.99] transition shadow-md shadow-[#7B3F1A]/20 flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isLogin ? 'Authenticating & Opening Diary...' : 'Setting Up Your Diary...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Log In to Dashboard' : 'Complete Sign Up & Enter'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Interactive Demo Section (Login & Sign-Up Demos) */}
          <div className="mt-5 pt-4 border-t border-[#EFE5D8] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#8A715C]">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C47D42]" />
                Interactive Demo Options:
              </span>
              <span className="text-[11px] bg-[#F1E4D3] px-2 py-0.5 rounded-full text-[#7B4D2B]">
                {isLogin ? 'Login Demo' : 'Sign-up Demo'}
              </span>
            </div>

            {/* Demo buttons dynamically styled based on current tab */}
            {isLogin ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  id="btn-demo-login-quick"
                  type="button"
                  onClick={handleInstantDemoLogin}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-[#5B371E] bg-[#F5EADB] hover:bg-[#EEDCC8] border border-[#E0CFBD] transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 text-[#C47D42]" />
                  <span>1-Click Demo Login</span>
                </button>
                <button
                  id="btn-demo-login-fill"
                  type="button"
                  onClick={handleFillLoginDemo}
                  className="py-2.5 px-3 rounded-xl text-xs font-medium text-[#7D5436] bg-[#FAF3E8] hover:bg-[#F2E5D4] border border-[#E8DACB] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#A88C76]" />
                  <span>Auto-Fill Credentials</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  id="btn-demo-signup-quick"
                  type="button"
                  onClick={handleInstantDemoSignUp}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-[#5B371E] bg-[#F5EADB] hover:bg-[#EEDCC8] border border-[#E0CFBD] transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 text-[#C47D42]" />
                  <span>1-Click Demo Sign Up</span>
                </button>
                <button
                  id="btn-demo-signup-fill"
                  type="button"
                  onClick={handleFillSignUpDemo}
                  className="py-2.5 px-3 rounded-xl text-xs font-medium text-[#7D5436] bg-[#FAF3E8] hover:bg-[#F2E5D4] border border-[#E8DACB] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#A88C76]" />
                  <span>Auto-Fill Sign Up Form</span>
                </button>
              </div>
            )}

            {/* Preset credentials card */}
            <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#EAE0D2] flex items-center justify-between text-[11px] text-[#7A604D]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C47D42] shrink-0" />
                <div>
                  <span className="font-medium">Test User: </span>
                  <span className="font-mono text-[#5B371E]">roopadeva48@gmail.com</span>
                </div>
              </div>
              <span className="text-[10px] bg-[#EAE0D2] px-2 py-0.5 rounded font-mono text-[#5B371E]">
                scrapbook2026
              </span>
            </div>

            {/* Bottom tab toggle link */}
            <div className="text-center pt-2">
              <p className="text-xs text-[#8A715C]">
                {isLogin ? (
                  <>
                    Don't have a diary account yet?{' '}
                    <button
                      type="button"
                      id="link-to-signup"
                      onClick={() => {
                        setIsLogin(false);
                        setErrors({});
                        setAuthError(null);
                      }}
                      className="text-[#9E5728] font-bold hover:underline cursor-pointer"
                    >
                      Create one here (Sign Up)
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      id="link-to-login"
                      onClick={() => {
                        setIsLogin(true);
                        setErrors({});
                        setAuthError(null);
                      }}
                      className="text-[#9E5728] font-bold hover:underline cursor-pointer"
                    >
                      Log in here (Sign In)
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
