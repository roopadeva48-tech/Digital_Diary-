import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Home, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#FAF5EC] relative overflow-hidden">
      {/* Subtle paper grid background */}
      <div className="absolute inset-0 opacity-25 pointer-events-none paper-lined" />

      {/* Ambient warm glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E8D1BC]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#F3D9C4]/45 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#FFFDF9] rounded-2xl shadow-xl shadow-[#784524]/10 border border-[#E9DFD0] p-8 text-center relative z-10"
      >
        <div className="mb-4">
          <Logo size="sm" showSlogan={false} className="scale-90" />
        </div>

        <div className="my-6">
          <span className="text-6xl font-serif font-bold text-[#8C4E26] tracking-widest">404</span>
          <h2 className="text-xl font-serif-display font-bold text-[#453022] mt-2">
            Page Wandered Off
          </h2>
          <p className="text-xs sm:text-sm text-[#876A52] mt-2 font-editorial italic">
            Looks like this page isn't in your scrapbook yet, or may have been archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#EFE5D8]">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-medium text-xs sm:text-sm bg-[#9E5728] hover:bg-[#86461D] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#9E5728]/20 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-[#7D5436] font-medium text-xs sm:text-sm bg-[#FAF3E8] hover:bg-[#F2E5D4] border border-[#E8DACB] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Login</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
