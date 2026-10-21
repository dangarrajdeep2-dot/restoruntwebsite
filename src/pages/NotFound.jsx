import React from 'react';
import { ArrowLeft, Sparkles, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forest-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-md">
        <div className="w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center bg-forest-900/80 mx-auto mb-6 shadow-2xl">
          <Compass className="w-10 h-10 text-gold animate-spin-slow" />
        </div>

        <h1 className="font-serif text-6xl sm:text-7xl font-bold text-gold-gradient mb-3">
          404
        </h1>

        <h2 className="font-serif text-2xl font-bold text-cream mb-3">
          Paradise Not Found
        </h2>

        <p className="text-xs sm:text-sm text-cream/70 leading-relaxed mb-8">
          The delicacy or chamber you are looking for has been moved or does not exist. Return to our dining hall.
        </p>

        <a
          href="#/"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-gold/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Nandanvan</span>
        </a>
      </div>
    </div>
  );
}
