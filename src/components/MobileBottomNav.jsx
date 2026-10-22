import React from 'react';
import { Utensils, Calendar, ExternalLink, Phone } from 'lucide-react';

export default function MobileBottomNav({ onOpenReserve, settings }) {
  const scrollToMenu = () => {
    const elem = document.getElementById('menu');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const zomatoUrl = settings?.zomato_url || 'https://www.zomato.com/rajkot/restaurants?q=Nandanvan';

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-950/95 backdrop-blur-lg border-t border-gold/30 px-3 py-2 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.6)]">
      {/* 1. Menu */}
      <button
        onClick={scrollToMenu}
        className="flex flex-col items-center justify-center p-1.5 text-cream/80 hover:text-gold active:scale-95 transition-transform"
      >
        <Utensils className="w-5 h-5 text-gold" />
        <span className="text-[10px] font-medium mt-0.5">Menu</span>
      </button>

      {/* 2. Book Table */}
      <button
        onClick={onOpenReserve}
        className="flex flex-col items-center justify-center p-1.5 text-cream/80 hover:text-gold active:scale-95 transition-transform"
      >
        <Calendar className="w-5 h-5 text-gold" />
        <span className="text-[10px] font-medium mt-0.5">Reserve</span>
      </button>

      {/* 3. Order on Zomato (Direct link, no online orders on website) */}
      <a
        href={zomatoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center p-1.5 text-cream/80 hover:text-gold active:scale-95 transition-transform"
      >
        <div className="relative">
          <Utensils className="w-5 h-5 text-gold" />
          <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-saffron animate-ping" />
        </div>
        <span className="text-[10px] font-medium mt-0.5 text-gold flex items-center space-x-0.5">
          <span>Zomato</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </a>

      {/* 4. Call Reception */}
      <a
        href={`tel:${settings?.phone || '+919825084721'}`}
        className="flex flex-col items-center justify-center p-1.5 text-cream/80 hover:text-gold active:scale-95 transition-transform"
      >
        <Phone className="w-5 h-5 text-gold" />
        <span className="text-[10px] font-medium mt-0.5">Call</span>
      </a>
    </div>
  );
}
