import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest-950 overflow-hidden"
        >
          {/* Subtle glowing ambient orb */}
          <div className="absolute w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />

          {/* Crest / Ornament */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center bg-forest-900/80 shadow-[0_0_25px_rgba(212,162,76,0.25)]">
              <Sparkles className="w-8 h-8 text-gold animate-spin-slow" />
            </div>
          </motion.div>

          {/* Restaurant Name in Animated Gold */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="text-center px-4"
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest text-gold-gradient drop-shadow-md">
              NANDANVAN
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-3 text-xs sm:text-sm uppercase tracking-[0.35em] text-cream/70 font-sans font-medium"
            >
              Multicuisine Restaurant • Rajkot
            </motion.p>
          </motion.div>

          {/* Progress bar line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 140 }}
            transition={{ delay: 0.4, duration: 1.4, ease: 'easeInOut' }}
            className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mt-8"
          />

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2 }}
            className="mt-4 text-[11px] tracking-widest text-gold/60 uppercase font-sans"
          >
            A Taste of Paradise
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
