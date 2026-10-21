import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Utensils, MapPin, ChevronDown, Award, Star } from 'lucide-react';
import FoodThaliHero3D from '../three/FoodThaliHero3D';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSection({ onOpenReserve, onExploreMenu }) {
  const { t } = useLanguage();
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 flex items-center justify-center overflow-hidden bg-forest-950">
      {/* Background radial atmosphere & subtle grain */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gold/15 to-saffron/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column (Col 1-7) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 z-10 text-center lg:text-left pt-6 lg:pt-0"
          >
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest-900/80 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
              <span>Near Munjka, Kalawad Road • Rajkot</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-cream leading-[1.1] mb-6">
              A Taste of{' '}
              <span className="text-gold-gradient block sm:inline">Paradise</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-cream/80 font-sans font-light leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              {t.heroDesc}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <button
                onClick={onOpenReserve}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-gradient text-forest-950 font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2.5 shadow-[0_4px_25px_rgba(212,162,76,0.35)] hover:shadow-[0_6px_30px_rgba(212,162,76,0.5)] transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <Calendar className="w-4 h-4 text-forest-950" />
                <span>{t.nav.reserveTable}</span>
              </button>

              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-forest-900/70 border border-gold/40 text-cream font-semibold text-sm tracking-wider uppercase hover:border-gold hover:bg-forest-800 transition-all flex items-center justify-center space-x-2.5 backdrop-blur-sm"
              >
                <Utensils className="w-4 h-4 text-gold" />
                <span>{t.nav.orderOnline}</span>
              </button>
            </div>

            {/* Highlight Badges / Trust Metric */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gold/20 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center space-x-1 text-gold text-lg font-serif font-bold">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-gold text-gold" />
                </div>
                <span className="text-[11px] text-cream/60">500+ Google Reviews</span>
              </div>

              <div className="flex flex-col items-center lg:items-start border-x border-gold/15 px-2">
                <span className="text-gold text-lg font-serif font-bold">100% Pure</span>
                <span className="text-[11px] text-cream/60">Desi Ghee & Fresh Herbs</span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <span className="text-gold text-lg font-serif font-bold">30+</span>
                <span className="text-[11px] text-cream/60">Royal Delicacies</span>
              </div>
            </div>
          </motion.div>

          {/* Right 3D Thali Scene Column (Col 8-12) */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[500px] lg:min-h-[640px]">
            {hasWebGL ? (
              <FoodThaliHero3D />
            ) : (
              // 2D WebGL Fallback Image
              <div className="relative w-full max-w-md aspect-square rounded-full overflow-hidden border-2 border-gold/40 shadow-2xl p-2 bg-forest-900">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
                  alt="Nandanvan Royal Thali"
                  className="w-full h-full object-cover rounded-full animate-spin-slow"
                />
              </div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="hidden sm:flex flex-col items-center justify-center mt-6 text-cream/40"
        >
          <span className="text-[10px] tracking-widest uppercase mb-1">Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-gold" />
        </motion.div>
      </div>
    </section>
  );
}
