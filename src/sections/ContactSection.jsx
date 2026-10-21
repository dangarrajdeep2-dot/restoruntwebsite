import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Navigation, 
  Mail, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { getSettings } from '../api/settings';

export default function ContactSection() {
  const [settings, setSettings] = useState(null);
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await getSettings();
      if (data) {
        setSettings(data);
        calculateOpenStatus(data);
      }
    }
    loadSettings();
  }, []);

  const calculateOpenStatus = (st) => {
    if (!st || st.is_open === false) {
      setIsOpenNow(false);
      return;
    }

    // Current IST hours check
    const now = new Date();
    // Convert to IST
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60000);
    const currentMinutes = istDate.getHours() * 60 + istDate.getMinutes();

    const [openH, openM] = (st.opening_time || '11:00:00').split(':').map(Number);
    const [closeH, closeM] = (st.closing_time || '23:30:00').split(':').map(Number);

    const openMinutes = openH * 60 + (openM || 0);
    const closeMinutes = closeH * 60 + (closeM || 0);

    const open = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    setIsOpenNow(open);
  };

  const mapsUrl = settings?.google_maps_url || 'https://maps.app.goo.gl/134VLgimHLRd4Gx8A';
  const phone = settings?.phone || '+91 98250 84721';
  const address = settings?.address || 'Near Munjka, Kalawad Road, Rajkot, Gujarat 360005, India';

  return (
    <section id="contact" className="py-24 bg-forest-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-forest-950 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Nandanvan</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream mb-3">
            Find Us in Rajkot
          </h2>
          <p className="text-xs sm:text-sm text-cream/70 font-light">
            Conveniently situated near Munjka on Kalawad Road with abundant valet parking and garden walkways
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Contact Info & Status Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Live Open / Closed Status Card */}
            <div className="p-6 rounded-2xl bg-forest-950 border border-gold/30 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-cream/50 uppercase tracking-widest block mb-1">
                  Operating Status
                </span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      isOpenNow ? 'bg-emerald-400 shadow-[0_0_12px_#34D399]' : 'bg-rose-500'
                    }`}
                  />
                  <span className="font-serif text-xl font-bold text-cream">
                    {isOpenNow ? 'Open Now for Dining' : 'Currently Closed'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gold block font-semibold">11:00 AM – 11:30 PM</span>
                <span className="text-[10px] text-cream/50">All 7 Days Open</span>
              </div>
            </div>

            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-forest-950 border border-gold/20 shadow-xl flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-gold/15 text-gold border border-gold/30 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-1">
                  Location & Address
                </h4>
                <p className="text-sm text-cream leading-relaxed mb-4">
                  {address}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-gold/30 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Call */}
              <a
                href={`tel:${phone}`}
                className="p-4 rounded-xl bg-forest-950 border border-gold/25 text-cream hover:border-gold hover:text-gold transition-all flex items-center space-x-3 shadow-lg"
              >
                <div className="p-2.5 rounded-lg bg-gold/15 text-gold border border-gold/30">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-cream/50 uppercase block">Call Desk</span>
                  <span className="text-xs font-bold font-mono">{phone}</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${(settings?.whatsapp || '919825084721').replace(/[^0-9]/g, '')}?text=Hello%20Nandanvan,%20I%20would%20like%20to%20enquire%20about%20table%20reservations.`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-cream hover:border-emerald-400 transition-all flex items-center space-x-3 shadow-lg"
              >
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400/70 uppercase block">WhatsApp</span>
                  <span className="text-xs font-bold text-emerald-300">Chat with Host</span>
                </div>
              </a>
            </div>

            {/* Email & Delivery notice */}
            <div className="p-4 rounded-xl bg-forest-950/80 border border-gold/15 text-xs text-cream/70 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span>{settings?.email || 'reservations@nandanvanrajkot.com'}</span>
              </span>
              <span className="text-gold font-medium">Free Parking Available</span>
            </div>

          </div>

          {/* Right: Embedded Interactive Map (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-gold/30 shadow-2xl bg-forest-950 min-h-[360px] sm:min-h-[440px] relative">
            <iframe
              title="Nandanvan Multicuisine Restaurant Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.8797960309995!2d70.73554367586284!3d22.282871179698947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cbf560737d2f%3A0xe543ec860db73e16!2sNandanvan%20Restaurant!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter brightness-90 contrast-105"
            />
            {/* Overlay badge on map */}
            <div className="absolute top-4 right-4 p-3 rounded-xl bg-forest-950/90 backdrop-blur-md border border-gold/30 shadow-lg pointer-events-none text-xs text-cream/90 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>22.2828711° N, 70.7381186° E</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
