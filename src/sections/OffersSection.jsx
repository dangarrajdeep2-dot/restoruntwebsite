import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Tag, Clock, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getActiveOffers } from '../api/offers';

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-1.5 text-center">
      {[
        { label: 'Days', val: timeLeft.days },
        { label: 'Hours', val: timeLeft.hours },
        { label: 'Mins', val: timeLeft.minutes },
        { label: 'Secs', val: timeLeft.seconds },
      ].map((item, idx) => (
        <div key={idx} className="p-1.5 rounded-lg bg-forest-950/70 border border-gold/20">
          <span className="font-serif text-xs sm:text-sm font-bold text-gold block">
            {String(item.val).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-cream/50">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function OffersSection() {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [mobileShowAll, setMobileShowAll] = useState(false);

  useEffect(() => {
    async function loadOffers() {
      const { data } = await getActiveOffers();
      if (data) setOffers(data);
    }
    loadOffers();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!offers || offers.length === 0) return null;

  // On mobile, show 1 offer by default unless expanded. On desktop, show all!
  const displayedOffers = mobileShowAll ? offers : offers;

  return (
    <section id="offers" className="py-14 sm:py-20 bg-forest-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-2 sm:mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>Exclusive Delights</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-cream mb-2">
            Today's Royal Offers
          </h2>
          <p className="text-xs sm:text-sm text-cream/70 font-light">
            Enjoy handpicked discounts on dine-in experiences & online feasts
          </p>
        </div>

        {/* Mobile View Toggle */}
        <div className="sm:hidden mb-4 flex justify-end">
          <button
            onClick={() => setMobileShowAll(!mobileShowAll)}
            className="text-xs font-semibold text-gold flex items-center space-x-1"
          >
            <span>{mobileShowAll ? 'Show Top Offer' : `View All Offers (${offers.length})`}</span>
            {mobileShowAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedOffers.map((offer, idx) => {
            // If on mobile and not expanded, only show first card
            const hideOnMobile = !mobileShowAll && idx > 0;

            return (
              <div
                key={offer.id}
                className={`rounded-2xl bg-forest-900 border border-gold/25 shadow-xl hover:border-gold/50 transition-all flex flex-col justify-between overflow-hidden group ${
                  hideOnMobile ? 'hidden sm:flex' : 'flex'
                }`}
              >
                {/* Banner Image */}
                <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-forest-950">
                  <img
                    src={offer.banner_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-saffron text-white font-serif font-bold text-xs uppercase tracking-wider shadow-lg">
                    {offer.discount_text}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-cream mb-1 sm:mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-cream/70 leading-relaxed mb-4">
                      {offer.description}
                    </p>
                  </div>

                  <div>
                    {/* Countdown Timer */}
                    <div className="mb-4">
                      <span className="text-[11px] font-semibold text-gold flex items-center space-x-1 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        <span>Expires In:</span>
                      </span>
                      <CountdownTimer targetDate={offer.valid_till} />
                    </div>

                    {/* Promo Code copy button */}
                    {offer.code && (
                      <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 font-mono text-xs text-gold bg-forest-950 px-2.5 py-1 rounded-lg border border-gold/30">
                          <Tag className="w-3 h-3" />
                          <span className="font-bold">{offer.code}</span>
                        </div>

                        <button
                          onClick={() => handleCopyCode(offer.code)}
                          className="px-2.5 py-1 rounded-lg bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold text-xs font-semibold flex items-center space-x-1 transition-colors"
                        >
                          {copiedCode === offer.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
