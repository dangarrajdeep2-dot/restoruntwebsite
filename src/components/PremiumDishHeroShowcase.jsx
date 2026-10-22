import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function PremiumDishHeroShowcase() {
  const containerRef = useRef(null);

  // Smooth mouse-follow parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center select-none py-4"
      style={{ perspective: 1200 }}
    >
      {/* 1. Ambient Warm Golden Atmosphere Behind Dish */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 via-saffron/10 to-transparent rounded-full blur-[90px] pointer-events-none" />

      {/* 2. Interactive Parallax Floating Plate Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [-8, 8, -8],
          rotateZ: [-0.5, 0.5, -0.5],
        }}
        transition={{
          y: {
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          rotateZ: {
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        className="relative w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] flex items-center justify-center cursor-pointer"
      >
        {/* Subtle Outer 24K Gold Filigree Accent Rings */}
        <div className="absolute inset-0 rounded-full border border-gold/30 shadow-[0_0_40px_rgba(212,162,76,0.18)] pointer-events-none" />
        <div className="absolute -inset-3 rounded-full border border-dashed border-gold/15 pointer-events-none" />

        {/* High-Resolution Luxury Plated Gourmet Dish Image */}
        <div className="relative w-[94%] h-[94%] rounded-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-2 border-gold/50 bg-forest-950 flex items-center justify-center group">
          <img
            src="/images/gourmet-hero-dish.jpg"
            alt="Nandanvan Signature Fine Dining Gourmet Creation"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            onError={(e) => {
              // Graceful fallback to Unsplash culinary image if local file fails
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85';
            }}
          />

          {/* Realistic Light Steam / Warm Shimmer Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-36 h-36 bg-white/10 rounded-full blur-2xl animate-pulse opacity-30" />
          </div>

          {/* Fine Ceramic Glass Reflection Highlights */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Dynamic Soft Shadow Beneath Plate */}
        <motion.div
          animate={{
            scale: [0.92, 1.05, 0.92],
            opacity: [0.5, 0.35, 0.5],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-8 w-3/4 h-8 bg-black/70 rounded-full blur-xl pointer-events-none"
        />
      </motion.div>

      {/* 3. Understated Luxury Caption (Pure aesthetics, NO ratings, NO order buttons) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-6 text-center max-w-md px-4"
      >
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-forest-900/80 border border-gold/25 text-gold text-[10px] tracking-widest uppercase font-semibold mb-1.5">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Nandanvan Signature Creation</span>
        </div>
        <p className="text-[11px] sm:text-xs text-cream/70 font-light tracking-wide leading-relaxed">
          Artisanal Gourmet Medallion • 24K Edible Gold • Microgreens • Roasted Heirloom Vegetables
        </p>
      </motion.div>
    </div>
  );
}
