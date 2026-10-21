import React from 'react';
import { Utensils, Calendar, ShoppingBag, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileBottomNav({ onOpenReserve }) {
  const { itemCount, setIsDrawerOpen } = useCart();

  const scrollToMenu = () => {
    const elem = document.getElementById('menu');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-950/95 backdrop-blur-lg border-t border-gold/30 px-3 py-2 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.6)]">
      {/* Menu */}
      <button
        onClick={scrollToMenu}
        className="flex flex-col items-center justify-center p-1.5 text-cream/80 hover:text-gold active:scale-95 transition-transform"
      >
        <Utensils className="w-5 h-5 text-gold" />
        <span className="text-[10px] font-medium mt-0.5">Menu</span>
      </button>

      {/* Book Table */}
      <button
        onClick={onOpenReserve}
        className="flex flex-col items-center justify-center p-1.5 text-cream/80 hover:text-gold active:scale-95 transition-transform"
      >
        <Calendar className="w-5 h-5 text-gold" />
        <span className="text-[10px] font-medium mt-0.5">Reserve</span>
      </button>

      {/* Cart (with badge) */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="relative flex flex-col items-center justify-center p-1.5 text-cream/80 hover:text-gold active:scale-95 transition-transform"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-gold" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-saffron text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium mt-0.5">Cart</span>
      </button>

      {/* Call Reception */}
      <a
        href="tel:+919825084721"
        className="flex flex-col items-center justify-center p-1.5 text-cream/80 hover:text-gold active:scale-95 transition-transform"
      >
        <Phone className="w-5 h-5 text-gold" />
        <span className="text-[10px] font-medium mt-0.5">Call</span>
      </a>
    </div>
  );
}
