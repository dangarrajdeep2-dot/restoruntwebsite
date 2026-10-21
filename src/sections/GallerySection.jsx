import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getGallery } from '../api/gallery';

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    async function loadGallery() {
      const { data } = await getGallery();
      if (data) setItems(data);
    }
    loadGallery();
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'ambiance', label: 'Ambiance' },
    { id: 'food', label: 'Cuisine' },
    { id: 'events', label: 'Events' },
    { id: 'outdoor', label: 'Garden Patio' },
  ];

  const filteredItems = items.filter(
    (item) => activeTab === 'all' || item.category === activeTab
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-forest-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-900 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-2 sm:mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Glimpses</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-cream mb-2">
            The Nandanvan Gallery
          </h2>
          <p className="text-xs sm:text-sm text-cream/70 font-light">
            Our tranquil garden ambiance, grand banquet lawns, and feasts
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setLightboxIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === cat.id
                  ? 'bg-gold text-forest-950 font-bold shadow-md'
                  : 'bg-forest-900/60 border border-gold/20 text-cream/80 hover:border-gold/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredItems.map((item, index) => {
            // On mobile, if not expanded, show first 4 images to prevent long scroll
            const hideOnMobile = !mobileExpanded && index >= 4;

            return (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className={`group relative rounded-2xl overflow-hidden bg-forest-900 border border-gold/20 cursor-pointer shadow-lg hover:border-gold/60 transition-all aspect-[4/3] ${
                  hideOnMobile ? 'hidden sm:block' : 'block'
                }`}
              >
                <img
                  src={item.image_url}
                  alt={item.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <span className="text-[10px] text-gold uppercase tracking-widest font-bold">
                    {item.category}
                  </span>
                  <p className="text-xs font-medium text-cream line-clamp-1">
                    {item.caption}
                  </p>
                </div>

                <div className="absolute top-2 right-2 p-1 rounded-full bg-forest-950/70 text-gold border border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Expand / Collapse Button */}
        {filteredItems.length > 4 && (
          <div className="sm:hidden mt-4 text-center">
            <button
              onClick={() => setMobileExpanded(!mobileExpanded)}
              className="px-5 py-2 rounded-full bg-forest-900 border border-gold/30 text-gold text-xs font-semibold inline-flex items-center space-x-1.5"
            >
              <span>{mobileExpanded ? 'Show Less Photos' : `View All Photos (${filteredItems.length})`}</span>
              {mobileExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && filteredItems[lightboxIndex] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/95 backdrop-blur-xl">
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-forest-900 border border-gold/40 text-cream/80 hover:text-gold"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  setLightboxIndex(
                    (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
                  )
                }
                className="absolute left-2 sm:left-6 z-20 p-2 sm:p-3 rounded-full bg-forest-900/80 border border-gold/30 text-cream hover:text-gold"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev + 1) % filteredItems.length)
                }
                className="absolute right-2 sm:right-6 z-20 p-2 sm:p-3 rounded-full bg-forest-900/80 border border-gold/30 text-cream hover:text-gold"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="relative max-w-4xl w-full flex flex-col items-center">
                <img
                  src={filteredItems[lightboxIndex].image_url}
                  alt={filteredItems[lightboxIndex].caption}
                  className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full rounded-2xl object-contain border border-gold/40 shadow-2xl"
                />
                <div className="mt-3 text-center px-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold px-2.5 py-0.5 rounded-full bg-forest-900 border border-gold/30 mb-1 inline-block">
                    {filteredItems[lightboxIndex].category}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-cream max-w-lg mx-auto">
                    {filteredItems[lightboxIndex].caption}
                  </p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
