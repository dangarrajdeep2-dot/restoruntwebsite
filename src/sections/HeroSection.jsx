import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Utensils, Star, ChevronDown, Award, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSection({ onOpenReserve, onExploreMenu }) {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[90vh] sm:min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 flex items-center justify-center overflow-hidden bg-forest-950">
      {/* Background ambient lighting & grain */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-[550px] h-72 sm:h-[550px] bg-gradient-to-tr from-gold/15 to-saffron/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-6 z-10 text-center lg:text-left pt-4 lg:pt-0"
          >
            {/* Top Location Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-900/80 border border-gold/30 text-gold text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
              <span>Near Munjka, Kalawad Road • Rajkot</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-cream leading-[1.15] mb-4 sm:mb-6">
              A Taste of{' '}
              <span className="text-gold-gradient block sm:inline">Paradise</span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-xs sm:text-base text-cream/80 font-sans font-light leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8">
              {t.heroDesc}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-10">
              <button
                onClick={onOpenReserve}
                className="flex-1 sm:flex-none px-5 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gold-gradient text-forest-950 font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-[0_4px_25px_rgba(212,162,76,0.35)] hover:shadow-[0_6px_30px_rgba(212,162,76,0.5)] transition-all transform active:scale-95"
              >
                <Calendar className="w-4 h-4 text-forest-950" />
                <span>{t.nav.reserveTable}</span>
              </button>

              <button
                onClick={onExploreMenu}
                className="flex-1 sm:flex-none px-5 sm:px-8 py-3.5 sm:py-4 rounded-full bg-forest-900/80 border border-gold/40 text-cream font-semibold text-xs sm:text-sm tracking-wider uppercase hover:border-gold hover:bg-forest-800 transition-all flex items-center justify-center space-x-2 active:scale-95 backdrop-blur-sm"
              >
                <Utensils className="w-4 h-4 text-gold" />
                <span>{t.nav.orderOnline}</span>
              </button>
            </div>

            {/* Key Trust Metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gold/20 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center space-x-1 text-gold text-base sm:text-lg font-serif font-bold">
                  <span>4.9</span>
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                </div>
                <span className="text-[10px] sm:text-[11px] text-cream/60">500+ Reviews</span>
              </div>

              <div className="flex flex-col items-center lg:items-start border-x border-gold/15 px-2">
                <span className="text-gold text-base sm:text-lg font-serif font-bold">100% Pure</span>
                <span className="text-[10px] sm:text-[11px] text-cream/60">Gir Desi Ghee</span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <span className="text-gold text-base sm:text-lg font-serif font-bold">30+</span>
                <span className="text-[10px] sm:text-[11px] text-cream/60">Delicacies</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Image Column (Clean, High-Speed, No Heavy WebGL) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-square">
              
              {/* Outer decorative gold ring */}
              <div className="absolute inset-0 rounded-full border-2 border-gold/30 animate-spin-slow pointer-events-none" />
              <div className="absolute -inset-3 rounded-full border border-gold/15 pointer-events-none" />

              {/* Main Luxury Platter Visual */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full rounded-full overflow-hidden p-2 sm:p-3 shadow-[0_15px_50px_rgba(0,0,0,0.8)] bg-gradient-to-tr from-forest-900 to-forest-950 border border-gold/40 relative group"
              >
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=85"
                  alt="Nandanvan Signature Royal Platter"
                  className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Soft gradient edge vignette */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-forest-950/70 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Floating Chef Badge (Desktop & Mobile) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-2 -left-2 sm:bottom-4 sm:left-2 p-3 sm:p-3.5 rounded-2xl bg-forest-950/90 border border-gold/40 shadow-2xl backdrop-blur-md flex items-center space-x-2.5 max-w-[210px]"
              >
                <div className="p-2 rounded-xl bg-gold/20 text-gold flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gold tracking-wider block">
                    Kathiyawadi & Punjabi
                  </span>
                  <span className="text-xs text-cream/90 font-medium leading-tight block">
                    Desi Clay-Pot Flavors
                  </span>
                </div>
              </motion.div>

              {/* Floating Timing Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -top-2 -right-2 sm:top-4 sm:right-2 p-2.5 sm:p-3 rounded-2xl bg-forest-950/90 border border-gold/40 shadow-2xl backdrop-blur-md flex items-center space-x-2"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-cream/60 uppercase block">Open Daily</span>
                  <span className="text-xs font-bold text-cream">11 AM - 11:30 PM</span>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:flex flex-col items-center justify-center mt-6 text-cream/40">
          <span className="text-[10px] tracking-widest uppercase mb-1">Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-gold" />
        </div>
      </div>
    </section>
  );
}
