import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function PremiumDishHeroShowcase() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parallax active on desktop only
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-sm sm:max-w-lg mx-auto flex flex-col items-center justify-center select-none py-2 sm:py-4 px-2"
      style={{ perspective: isMobile ? 'none' : 1200 }}
    >
      {/* 1. Ambient Warm Golden Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gold/15 via-saffron/10 to-transparent rounded-full blur-2xl sm:blur-[80px] pointer-events-none" />

      {/* 2. Plate Container (Static & Clean on mobile, subtle gentle float on desktop) */}
      <motion.div
        style={isMobile ? {} : {
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={isMobile ? {} : {
          y: [-6, 6, -6],
          rotateZ: [-0.3, 0.3, -0.3],
        }}
        transition={isMobile ? {} : {
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
          rotateZ: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative w-[230px] h-[230px] sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[420px] flex items-center justify-center"
      >
        {/* Subtle Outer 24K Gold Filigree Ring */}
        <div className="absolute inset-0 rounded-full border border-gold/30 shadow-[0_0_30px_rgba(212,162,76,0.15)] pointer-events-none" />
        <div className="absolute -inset-2 sm:-inset-3 rounded-full border border-dashed border-gold/15 pointer-events-none" />

        {/* High-Resolution Luxury Plated Gourmet Dish Image */}
        <div className="relative w-[92%] h-[92%] rounded-full overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.85)] border-2 border-gold/50 bg-forest-950 flex items-center justify-center">
          <img
            src="/images/gourmet-hero-dish.jpg"
            alt="Nandanvan Signature Fine Dining Gourmet Creation"
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85';
            }}
          />

          {/* Delicate Steam Overlay (Desktop only) */}
          {!isMobile && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-28 h-28 bg-white/10 rounded-full blur-2xl opacity-25" />
            </div>
          )}

          {/* Shimmer gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Shadow beneath plate (Desktop) */}
        {!isMobile && (
          <div className="absolute -bottom-6 w-3/4 h-6 bg-black/60 rounded-full blur-xl pointer-events-none" />
        )}
      </motion.div>

      {/* 3. Understated Luxury Caption */}
      <div className="mt-3 sm:mt-5 text-center max-w-sm px-2">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-forest-900/80 border border-gold/25 text-gold text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold mb-1">
          <Sparkles className="w-2.5 h-2.5 text-gold" />
          <span>Nandanvan Signature Creation</span>
        </div>
        <p className="text-[10px] sm:text-xs text-cream/70 font-light tracking-wide leading-relaxed">
          Gourmet Medallion • 24K Edible Gold • Fresh Microgreens
        </p>
      </div>
    </div>
  );
}
