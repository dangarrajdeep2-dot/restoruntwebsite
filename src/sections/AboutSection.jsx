import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
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
    <section id="about" className="relative py-24 bg-forest-900/60 overflow-hidden">
      {/* Decorative background aura */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-forest-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Image Collage with Parallax feel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main prominent image */}
              <div className="relative rounded-2xl overflow-hidden border border-gold/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Nandanvan Dining Ambiance"
                  className="w-full h-[400px] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-forest-950/80 backdrop-blur-md border border-gold/20">
                  <span className="text-gold font-serif text-sm font-semibold">
                    The Garden of Paradise • Munjka, Rajkot
                  </span>
                  <p className="text-cream/70 text-xs mt-1">
                    Tranquil landscaped gardens away from city bustle.
                  </p>
                </div>
              </div>

              {/* Overlapping secondary image */}
              <div className="hidden sm:block absolute -bottom-8 -right-8 w-56 h-56 rounded-2xl overflow-hidden border-2 border-gold/50 shadow-2xl bg-forest-900">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80"
                  alt="Authentic Kathiyawadi Cuisine"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -top-6 -left-6 bg-gold-gradient p-3.5 rounded-2xl shadow-xl flex items-center space-x-2 text-forest-950 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Since 2012</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Story and Heritage */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Culinary Heritage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-6">
              Rooted in Saurashtra, <br />
              <span className="text-gold-gradient">Celebrated Worldwide</span>
            </h2>

            <p className="text-cream/80 text-base leading-relaxed mb-6 font-light">
              Named after the celestial garden of serenity, <strong className="text-gold font-semibold">Nandanvan Multicuisine Restaurant</strong> was envisioned as a sanctuary where food is an emotion. Located strategically near Munjka on Kalawad Road, we welcome families and travelers seeking culinary perfection.
            </p>

            <p className="text-cream/70 text-sm leading-relaxed mb-8 font-light">
              From the wood-charred aroma of our signature <em>Ringan No Olo</em> and hand-patted <em>Bajra Rotla</em> with white churned butter, to slow-simmered <em>Dal Bukhara</em> and sizzling continental platters, every recipe is preserved with genuine warmth and Indian hospitality.
            </p>

            {/* Feature points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
                  <span className="text-xs sm:text-sm text-cream/90">{item}</span>
                </div>
              ))}
            </div>

            {/* Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gold/20">
              {stats.map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-gold">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-cream/60 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
