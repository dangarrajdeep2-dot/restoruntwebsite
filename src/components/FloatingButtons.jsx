import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingButtons({ phone = '+919825084721', whatsapp = '+919825084721' }) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-[74px] right-3.5 sm:bottom-6 sm:right-6 z-40 flex flex-col space-y-2.5 sm:space-y-3 pointer-events-auto">
      {/* Quick Phone Call Button */}
      <a
        href={`tel:+${cleanPhone}`}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-forest-900/90 border border-gold/40 text-gold flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-gold hover:text-forest-950 transition-all transform active:scale-95 sm:hover:scale-110 group backdrop-blur-sm"
        aria-label="Call Nandanvan"
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5 sm:group-hover:animate-bounce" />
      </a>

      {/* WhatsApp Chat Button */}
      <a
        href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Nandanvan,%20I%20would%20like%20to%20enquire%20or%20book%20a%20table.`}
        target="_blank"
        rel="noreferrer"
        className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:bg-emerald-500 transition-all transform active:scale-95 sm:hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-saffron rounded-full border-2 border-forest-950 animate-ping" />
      </a>
    </div>
  );
}
