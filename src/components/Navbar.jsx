import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu as MenuIcon, 
  X, 
  ShoppingBag, 
  PhoneCall, 
  Calendar,
  Globe,
  ShieldCheck,
  Clock,
  Utensils,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onOpenReserve, onOpenTrackOrder, settings }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const { itemCount, setIsDrawerOpen } = useCart();
  const { lang, changeLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.menu, href: '#menu' },
    { name: t.nav.offers, href: '#offers' },
    { name: t.nav.gallery, href: '#gallery' },
    { name: t.nav.reviews, href: '#reviews' },
    { name: t.nav.events, href: '#events' },
    { name: t.nav.contact, href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-forest-950/95 backdrop-blur-md border-b border-gold/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2.5 sm:py-3'
            : 'bg-gradient-to-b from-forest-950/95 to-transparent py-3 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Brand */}
            <a href="#home" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-forest-900/60 shadow-[0_0_15px_rgba(212,162,76,0.2)] group-hover:border-gold transition-colors">
                <span className="font-serif text-gold text-lg font-bold">N</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-gold-gradient leading-none">
                  NANDANVAN
                </span>
                <span className="text-[10px] tracking-[0.25em] text-cream/70 font-sans uppercase">
                  Rajkot • Multicuisine
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm font-medium text-cream/80 hover:text-gold transition-colors tracking-wide relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="p-2 rounded-lg bg-forest-900/60 border border-gold/20 text-cream/80 hover:text-gold hover:border-gold/40 transition-all flex items-center space-x-1 text-xs"
                  aria-label="Change Language"
                >
                  <Globe className="w-4 h-4 text-gold" />
                  <span className="font-semibold uppercase">{lang}</span>
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-32 bg-forest-900 border border-gold/30 rounded-lg shadow-xl overflow-hidden py-1 z-50"
                    >
                      {[
                        { code: 'en', label: 'English' },
                        { code: 'gu', label: 'ગુજરાતી' },
                        { code: 'hi', label: 'हिन्दी' },
                      ].map((item) => (
                        <button
                          key={item.code}
                          onClick={() => {
                            changeLanguage(item.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gold/20 transition-colors flex items-center justify-between ${
                            lang === item.code ? 'text-gold font-bold bg-gold/10' : 'text-cream/80'
                          }`}
                        >
                          <span>{item.label}</span>
                          {lang === item.code && <span className="text-gold">✓</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              {/* Order on Zomato CTA */}
              <a
                href={settings?.zomato_url || "https://www.zomato.com/rajkot/restaurants?q=Nandanvan"}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-forest-900/80 border border-gold/30 text-gold hover:border-gold hover:bg-gold/10 text-xs font-semibold tracking-wider uppercase transition-all backdrop-blur-sm group"
                title="Order on Zomato"
              >
                <Utensils className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                <span>Zomato</span>
                <ExternalLink className="w-3 h-3 text-gold/70" />
              </a>

              {/* Reserve Table CTA (Desktop) */}
              <button
                onClick={onOpenReserve}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold-600 via-gold to-gold-400 text-forest-950 font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(212,162,76,0.3)] hover:shadow-[0_0_25px_rgba(212,162,76,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.nav.reserveTable}</span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg bg-forest-900/60 border border-gold/20 text-gold hover:bg-forest-800 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-forest-950/98 border-l border-gold/30 p-6 flex flex-col justify-between shadow-2xl xl:hidden overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gold/20">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-xl font-bold text-gold-gradient">NANDANVAN</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-cream/70 hover:text-gold"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <nav className="mt-6 flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-base font-medium text-cream/80 hover:text-gold py-2 border-b border-forest-900/60 transition-colors flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs text-gold/60">→</span>
                  </a>
                ))}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenTrackOrder();
                  }}
                  className="text-left text-base font-medium text-cream/80 hover:text-gold py-2 border-b border-forest-900/60 transition-colors flex items-center justify-between"
                >
                  <span>Track Order</span>
                  <span className="text-xs text-gold/60">🔍</span>
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-gold/20 flex flex-col space-y-3">
              <a
                href={settings?.zomato_url || "https://www.zomato.com/rajkot/restaurants?q=Nandanvan"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-forest-900 border border-gold/40 text-cream font-semibold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 hover:border-gold transition-colors"
              >
                <Utensils className="w-4 h-4 text-gold" />
                <span>Order on Zomato</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold/70" />
              </a>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenReserve();
                }}
                className="w-full py-3 rounded-xl bg-gold-gradient text-forest-950 font-bold text-sm tracking-wider uppercase text-center shadow-lg"
              >
                {t.nav.reserveTable}
              </button>

              <a
                href="tel:+919825084721"
                className="text-xs text-center text-cream/60 flex items-center justify-center space-x-1 hover:text-gold pt-2"
              >
                <PhoneCall className="w-3 h-3 text-gold" />
                <span>+91 98250 84721</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
