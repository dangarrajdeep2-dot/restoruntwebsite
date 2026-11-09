import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  ShieldCheck,
  Globe,
  Share2,
  ArrowUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-forest-950 border-t border-gold/25 pt-12 sm:pt-16 pb-28 sm:pb-12 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gold/15">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-forest-900 shadow-lg">
                <span className="font-serif text-gold text-lg font-bold">N</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-gold-gradient block leading-none">
                  NANDANVAN
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-cream/70 font-sans">
                  Multicuisine Restaurant • Rajkot
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-cream/70 leading-relaxed font-light max-w-sm">
              An oasis of authentic taste near Munjka, Kalawad Road. Preserving Saurashtra’s culinary legacy alongside Royal Punjabi, South Indian, and sizzler innovations.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-forest-900 border border-gold/30 text-cream/70 hover:text-gold hover:border-gold flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-forest-900 border border-gold/30 text-cream/70 hover:text-gold hover:border-gold flex items-center justify-center transition-colors"
                aria-label="Social Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-cream/70">
              <li><a href="#home" className="hover:text-gold transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-gold transition-colors">Our Story</a></li>
              <li><a href="#menu" className="hover:text-gold transition-colors">Royal Menu</a></li>
              <li><a href="#reservation" className="hover:text-gold transition-colors">Book a Table (3D)</a></li>
              <li><a href="#offers" className="hover:text-gold transition-colors">Today's Offers</a></li>
              <li><a href="#gallery" className="hover:text-gold transition-colors">Ambiance Gallery</a></li>
              <li><a href="#events" className="hover:text-gold transition-colors">Banquets & Lawns</a></li>
              <li>
                <a
                  href="#/portal"
                  onClick={() => {
                    window.location.hash = '#/portal';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold transition-colors text-gold/80 flex items-center space-x-1 font-medium pt-1"
                >
                  <ShieldCheck className="w-3 h-3 text-gold" />
                  <span>Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Cuisines */}
          <div>
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-4">
              Cuisines
            </h4>
            <ul className="space-y-2.5 text-xs text-cream/70">
              <li>Authentic Kathiyawadi & Gujarati</li>
              <li>Royal Punjabi & Dum Biryani</li>
              <li>Crispy South Indian Dosas</li>
              <li>Wok-Tossed Indo-Chinese</li>
              <li>Sizzlers & Continental Pasta</li>
              <li>Strict Pure Jain Preparations</li>
              <li>Artisanal Mithai & Desserts</li>
            </ul>
          </div>

          {/* Visit & Hours */}
          <div>
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-4">
              Visit Us
            </h4>
            <div className="space-y-3 text-xs text-cream/70">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Near Munjka, Kalawad Road, Rajkot 360005</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+91 98250 84721</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>contact@nandanvanrajkot.com</span>
              </div>
              <div className="pt-2 text-gold font-semibold">
                Timings: 11:00 AM – 11:30 PM
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} Nandanvan Multicuisine Restaurant, Rajkot. All rights reserved.</p>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Direct Portal Login Link */}
            <a
              href="#/portal"
              onClick={() => {
                window.location.hash = '#/portal';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-forest-900 border border-gold/30 text-gold hover:bg-gold hover:text-forest-950 text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              title="Staff & Operations Portal Login"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-forest-900 border border-gold/30 text-gold hover:bg-gold hover:text-forest-950 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
