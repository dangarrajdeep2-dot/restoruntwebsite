import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  Camera
} from 'lucide-react';
import { getGallery } from '../api/gallery';

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function loadGallery() {
      const { data } = await getGallery();
      if (data) setItems(data);
    }
    loadGallery();
  }, []);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'ambiance', label: 'Ambiance' },
    { id: 'food', label: 'Cuisine' },
    { id: 'events', label: 'Events & Lawns' },
    { id: 'outdoor', label: 'Garden Patio' },
    { id: 'chef', label: 'Kitchen Master' },
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
    <section id="gallery" className="py-24 bg-forest-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-forest-900 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Glimpses</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream mb-3">
            The Nandanvan Gallery
          </h2>
          <p className="text-xs sm:text-sm text-cream/70 font-light">
            Step inside our tranquil garden ambiance, grand banquet lawns, and handcrafted feasts
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setLightboxIndex(null);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-2xl overflow-hidden bg-forest-900 border border-gold/20 cursor-pointer shadow-lg hover:border-gold/60 transition-all aspect-[4/3]"
            >
              <img
                src={item.image_url}
                alt={item.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[10px] text-gold uppercase tracking-widest font-bold">
                  {item.category}
                </span>
                <p className="text-xs font-medium text-cream line-clamp-2">
                  {item.caption}
                </p>
              </div>

              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-forest-950/70 text-gold border border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && filteredItems[lightboxIndex] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/95 backdrop-blur-xl">
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-forest-900 border border-gold/40 text-cream/80 hover:text-gold"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Button */}
              <button
                onClick={() =>
                  setLightboxIndex(
                    (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
                  )
                }
                className="absolute left-4 sm:left-8 z-20 p-3 rounded-full bg-forest-900/80 border border-gold/30 text-cream hover:text-gold"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev + 1) % filteredItems.length)
                }
                className="absolute right-4 sm:right-8 z-20 p-3 rounded-full bg-forest-900/80 border border-gold/30 text-cream hover:text-gold"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Main Lightbox Content */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-4xl w-full flex flex-col items-center"
              >
                <img
                  src={filteredItems[lightboxIndex].image_url}
                  alt={filteredItems[lightboxIndex].caption}
                  className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain border border-gold/40 shadow-2xl"
                />
                <div className="mt-4 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold px-2.5 py-0.5 rounded-full bg-forest-900 border border-gold/30 mb-2 inline-block">
                    {filteredItems[lightboxIndex].category}
                  </span>
                  <p className="text-sm font-medium text-cream max-w-lg mx-auto">
                    {filteredItems[lightboxIndex].caption}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
