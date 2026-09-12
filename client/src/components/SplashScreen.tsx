import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // Hold for ~2.0s then trigger completion
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      id="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF6EE] text-[#4A3423] p-6 select-none overflow-hidden"
    >
      {/* Subtle paper texture background lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none paper-lined" />

      {/* Ambient warm radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#EED3B1]/40 to-[#F6B78B]/20 blur-3xl pointer-events-none" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 left-12 opacity-60 hidden sm:block"
      >
        <span className="text-3xl">🌸</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-16 right-16 opacity-60 hidden sm:block"
      >
        <span className="text-3xl">✨</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-20 right-20 opacity-60 hidden sm:block"
      >
        <span className="text-2xl">🍂</span>
      </motion.div>

      {/* Main Logo Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center max-w-full px-4"
      >
        <Logo size="xl" showSlogan={true} className="scale-80 xs:scale-90 sm:scale-100 max-w-full origin-center" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 flex items-center gap-2 text-[#99633B] text-xs sm:text-sm font-medium tracking-wide bg-[#F4E9DC]/80 px-4 py-1.5 rounded-full border border-[#DFCEBA] text-center"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C47D42] animate-pulse shrink-0" />
          <span>Opening your personal scrapbook...</span>
        </motion.div>

        {/* Progress bar */}
        <div className="mt-8 w-48 h-1 bg-[#E8DACB] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.1, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#C47D42] to-[#8C4E26] rounded-full"
          />
        </div>
      </motion.div>

      {/* Skip button for quick convenience */}
      <motion.button
        id="btn-skip-splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onComplete}
        className="absolute bottom-6 right-6 flex items-center gap-1 text-xs text-[#8C6D53] hover:text-[#4A3423] transition-colors py-1.5 px-3 rounded-md hover:bg-[#EFE2D3]"
      >
        <span>Skip intro</span>
        <ArrowRight className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
};
