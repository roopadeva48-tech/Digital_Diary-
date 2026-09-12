import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthFormProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate auth network latency with animated spinner
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: isLogin ? (email.split('@')[0] || 'Journaler') : name.trim(),
        email: email.trim(),
        avatar: '🌸'
      });
    }, 1100);
  };

  const handleDemoLogin = () => {
    setEmail('roopadeva48@gmail.com');
    setPassword('scrapbook2026');
    setName('Roopa Deva');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: 'Roopa Deva',
        email: 'roopadeva48@gmail.com',
        avatar: '🌸'
      });
    }, 700);
  };

  return (
    <div
      id="auth-container"
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#FAF5EC] relative overflow-hidden"
    >
      {/* Subtle paper grid background */}
      <div className="absolute inset-0 opacity-25 pointer-events-none paper-lined" />

      {/* Warm ambient corner blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E8D1BC]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#F3D9C4]/35 blur-3xl pointer-events-none" />

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Decorative Scrapbook washi tape on top of card */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#E2C3A7]/85 rotate-[-2deg] rounded-sm shadow-sm flex items-center justify-center border-t border-b border-[#D4AE8D]/60 pointer-events-none z-20">
          <span className="text-[10px] tracking-widest text-[#734A2D] font-serif uppercase font-semibold">
            {isLogin ? 'WELCOME BACK' : 'BEGIN JOURNEY'}
          </span>
        </div>

        <div className="bg-[#FFFDF9] rounded-2xl shadow-xl shadow-[#784524]/10 border border-[#E9DFD0] p-6 sm:p-8 pt-9 relative">
          {/* Logo Header */}
          <div className="text-center mb-6">
            <Logo size="sm" showSlogan={false} className="scale-90" />
            <h1 className="mt-2 text-2xl font-serif-display font-bold text-[#453022]">
              {isLogin ? 'Sign in to AuraPages' : 'Create Your Sanctuary'}
            </h1>
            <p className="text-xs sm:text-sm text-[#876A52] mt-1 font-editorial italic">
              {isLogin
                ? 'Your memories and cherished thoughts are waiting for you'
                : 'Start crafting your personal digital scrapbook with lovely stickers & notes'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#F4EDE2] p-1 rounded-xl mb-6 border border-[#E4D8C7]">
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                isLogin
                  ? 'bg-white text-[#563622] shadow-sm font-semibold'
                  : 'text-[#876A52] hover:text-[#453022]'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-signup-btn"
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                !isLogin
                  ? 'bg-white text-[#563622] shadow-sm font-semibold'
                  : 'text-[#876A52] hover:text-[#453022]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form with animated transitions */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
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
                    Full Name
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
                      placeholder="e.g. Roopa Deva"
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

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5B422F]">
                Email Address
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
                  placeholder="your.name@example.com"
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
                  Password
                </label>
                {isLogin && (
                  <span className="text-[11px] text-[#A67C52] hover:underline cursor-pointer">
                    Forgot?
                  </span>
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
                  placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
                  className={`w-full pl-9 pr-10 py-2.5 bg-[#FAF7F0] rounded-xl border text-sm text-[#3E2B1F] placeholder:text-[#B7A18F] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/40 transition ${
                    errors.password ? 'border-red-400 bg-red-50/20' : 'border-[#DECFC0]'
                  }`}
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A88C76] hover:text-[#5B422F] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                  <span>{isLogin ? 'Signing into scrapbook...' : 'Creating your account...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Log In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access button for immediate testing */}
          <div className="mt-5 pt-5 border-t border-[#EFE5D8] flex flex-col items-center gap-3">
            <button
              id="btn-demo-access"
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium text-[#7D5436] bg-[#F5EADB] hover:bg-[#EBDCCB] transition flex items-center justify-center gap-1.5 border border-[#E0CFBD]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C47D42]" />
              <span>Explore Demo as <b>Roopa Deva</b></span>
            </button>

            <p className="text-xs text-[#8A715C]">
              {isLogin ? (
                <>
                  Don't have a journal yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setErrors({});
                    }}
                    className="text-[#9E5728] font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setErrors({});
                    }}
                    className="text-[#9E5728] font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
