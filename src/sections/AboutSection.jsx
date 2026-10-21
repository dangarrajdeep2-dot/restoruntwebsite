import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Award, Users, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function AboutSection() {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const stats = [
    { label: 'Happy Guests Served', value: '150K+', icon: Users },
    { label: 'Signature Dishes', value: '85+', icon: Sparkles },
    { label: 'Master Chefs', value: '12', icon: Award },
    { label: 'Years of Excellence', value: '14+', icon: Heart },
  ];

  const highlights = [
    'Clay-pot Kathiyawadi slow-cooking with wood fire aroma',
    'Pure hand-churned Gir cow desi ghee & cold-pressed oils',
    'Separate Jain preparation section adhering to traditional purity',
    'Lush outdoor garden patio & royal family banqueting halls',
  ];

  return (
    <section id="about" className="relative py-16 sm:py-24 bg-forest-900/60 overflow-hidden">
      {/* Decorative aura */}
      <div className="absolute -top-40 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left: Image Collage (Hidden secondary on small mobile for clean layout) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden border border-gold/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Nandanvan Dining Ambiance"
                  className="w-full h-64 sm:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-forest-950/85 backdrop-blur-md border border-gold/20">
                  <span className="text-gold font-serif text-xs sm:text-sm font-semibold block">
                    The Garden of Paradise • Munjka, Rajkot
                  </span>
                  <p className="text-cream/70 text-[11px] sm:text-xs mt-0.5">
                    Tranquil landscaped gardens away from city bustle.
                  </p>
                </div>
              </div>

              {/* Overlapping secondary image (Desktop only) */}
              <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden border-2 border-gold/50 shadow-2xl bg-forest-900">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80"
                  alt="Authentic Kathiyawadi Cuisine"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -left-3 sm:-top-6 sm:-left-6 bg-gold-gradient px-3 py-1.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl flex items-center space-x-1.5 text-forest-950 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Since 2012</span>
              </div>
            </div>
          </div>

          {/* Right: Story and Heritage */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Culinary Heritage</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-4">
              Rooted in Saurashtra, <br />
              <span className="text-gold-gradient">Celebrated Worldwide</span>
            </h2>

            {/* Concise preview paragraph */}
            <p className="text-cream/80 text-xs sm:text-base leading-relaxed mb-4 font-light">
              Named after the celestial garden of serenity, <strong className="text-gold font-semibold">Nandanvan Multicuisine Restaurant</strong> was envisioned as a sanctuary where food is an emotion. Located near Munjka on Kalawad Road, Rajkot.
            </p>

            {/* Mobile Collapsible Drawer for deep story & highlights */}
            <div className="sm:hidden mb-4">
              <button
                onClick={() => setMobileExpanded(!mobileExpanded)}
                className="w-full py-2.5 px-4 rounded-xl bg-forest-950 border border-gold/30 text-gold text-xs font-semibold flex items-center justify-between"
              >
                <span>{mobileExpanded ? 'Hide Details' : 'Read Full Heritage & Highlights'}</span>
                {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {mobileExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 space-y-3"
                  >
                    <p className="text-cream/70 text-xs leading-relaxed font-light">
                      From wood-charred <em>Ringan No Olo</em> and hand-patted <em>Bajra Rotla</em> with white churned butter to 24-hour slow-cooked <em>Dal Bukhara</em> and sizzling platters, every recipe is crafted with genuine Saurashtra warmth.
                    </p>

                    <div className="space-y-2 pt-2">
                      {highlights.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-cream/90">{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Highlights (Always visible on desktop "pc ke liye done") */}
            <div className="hidden sm:block">
              <p className="text-cream/70 text-sm leading-relaxed mb-6 font-light">
                From the wood-charred aroma of our signature <em>Ringan No Olo</em> and hand-patted <em>Bajra Rotla</em> with white churned butter, to slow-simmered <em>Dal Bukhara</em> and sizzling continental platters, every recipe is preserved with genuine warmth.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-cream/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 sm:pt-6 border-t border-gold/20">
              {stats.map((stat, i) => (
                <div key={i} className="text-center sm:text-left p-2 rounded-xl bg-forest-950/40 sm:bg-transparent">
                  <div className="font-serif text-xl sm:text-3xl font-bold text-gold">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-cream/60 uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
