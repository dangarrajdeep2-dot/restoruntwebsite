import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  ShoppingBag, 
  Flame, 
  Check, 
  Clock, 
  Layers, 
  X, 
  Info,
  Utensils,
  ExternalLink
} from 'lucide-react';
import { getCategories } from '../api/categories';
import { getMenuItems } from '../api/menu';
import { useLanguage } from '../context/LanguageContext';

export default function MenuSection({ settings }) {
  const { t } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // all | veg | jain
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDishDetail, setSelectedDishDetail] = useState(null);

  const zomatoUrl = settings?.zomato_url || 'https://www.zomato.com/rajkot/restaurants?q=Nandanvan';

  // Fetch data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [catRes, dishRes] = await Promise.all([
        getCategories(),
        getMenuItems({ availableOnly: false }),
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (dishRes.data) setDishes(dishRes.data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category filter
      if (activeCategory !== 'all') {
        const cat = categories.find((c) => c.slug === activeCategory);
        if (cat && dish.category_id !== cat.id) return false;
      }
      // Type filter (veg, jain)
      if (selectedType !== 'all' && dish.type !== selectedType) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesDesc = (dish.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [dishes, categories, activeCategory, selectedType, searchQuery]);

  return (
    <section id="menu" className="relative py-16 sm:py-24 bg-forest-950">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-900 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nandanvan Gastronomy</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-cream mb-2 sm:mb-3">
            {t.menu.title}
          </h2>
          <p className="text-xs sm:text-base text-cream/70 font-light px-2">
            {t.menu.subtitle}
          </p>

          {/* Zomato Delivery Partner Notice */}
          <div className="mt-3.5 inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-forest-900/80 border border-gold/30 text-cream text-[11px] sm:text-xs backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online delivery is fulfilled exclusively via our official partner</span>
            <a
              href={zomatoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>Zomato</span>
              <ExternalLink className="w-3 h-3 text-gold" />
            </a>
          </div>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.menu.searchPlaceholder}
              className="w-full pl-10 pr-8 py-2.5 rounded-full bg-forest-900/90 border border-gold/25 text-cream text-xs sm:text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-cream/50 hover:text-gold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Veg / Jain Diet Filter Pills */}
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: t.menu.all },
              { id: 'veg', label: t.menu.veg, dot: 'bg-emerald-500' },
              { id: 'jain', label: t.menu.jain, dot: 'bg-amber-500' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  selectedType === type.id
                    ? 'bg-gold text-forest-950 font-bold shadow-md'
                    : 'bg-forest-900/70 border border-gold/20 text-cream/80 hover:border-gold/50'
                }`}
              >
                {type.dot && <span className={`w-2 h-2 rounded-full ${type.dot}`} />}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sticky Category Tabs (Ultra-Clean Horizontal Scroll) */}
        <div className="sticky top-16 z-30 py-2.5 mb-8 bg-forest-950/95 backdrop-blur-md border-y border-gold/20">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeCategory === 'all'
                  ? 'bg-gold-gradient text-forest-950 font-bold shadow-md'
                  : 'bg-forest-900/80 border border-gold/20 text-cream/80 hover:text-gold'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>All Categories</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? 'bg-gold-gradient text-forest-950 font-bold shadow-md'
                    : 'bg-forest-900/80 border border-gold/20 text-cream/80 hover:text-gold'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-forest-900/40 border border-gold/15 p-3.5 animate-pulse flex flex-col space-y-3"
              >
                <div className="w-full h-40 rounded-xl bg-forest-800/60" />
                <div className="h-4 bg-forest-800/60 rounded w-3/4" />
                <div className="h-3 bg-forest-800/40 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="text-center py-12 bg-forest-900/30 rounded-2xl border border-gold/20">
            <p className="text-cream/60 text-sm">No dishes found matching your selection.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredDishes.map((dish) => {
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    key={dish.id}
                    className="group rounded-2xl bg-forest-900/50 backdrop-blur-sm border border-gold/20 hover:border-gold/50 shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Dish Image */}
                    <div 
                      onClick={() => setSelectedDishDetail(dish)}
                      className="relative h-44 sm:h-48 w-full overflow-hidden bg-forest-950 cursor-pointer"
                    >
                      <img
                        src={dish.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'}
                        alt={dish.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-70" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md ${
                            dish.type === 'jain'
                              ? 'bg-amber-900/90 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-900/90 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          ● {dish.type}
                        </span>

                        {dish.chef_special && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold text-forest-950 flex items-center space-x-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Special</span>
                          </span>
                        )}
                      </div>

                      {/* Info hint */}
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-forest-950/80 text-cream/70 text-[10px] flex items-center space-x-1">
                        <Info className="w-3 h-3 text-gold" />
                        <span>Details</span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          onClick={() => setSelectedDishDetail(dish)}
                          className="font-serif text-base sm:text-lg font-bold text-cream hover:text-gold transition-colors cursor-pointer line-clamp-1 mb-1"
                        >
                          {dish.name}
                        </h3>

                        <p className="text-xs text-cream/70 line-clamp-2 leading-relaxed mb-3">
                          {dish.description}
                        </p>
                      </div>

                      {/* Footer: Price & Zomato Order Button */}
                      <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                        <div className="flex items-baseline space-x-0.5">
                          <span className="text-xs text-gold/80 font-medium">₹</span>
                          <span className="font-serif text-xl font-bold text-gold">
                            {dish.price}
                          </span>
                        </div>

                        <a
                          href={zomatoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 bg-gold-gradient text-forest-950 hover:shadow-md transition-all active:scale-95 group/btn"
                        >
                          <Utensils className="w-3 h-3" />
                          <span>Order (Zomato)</span>
                          <ExternalLink className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Clean, Fast Dish Detail Modal (No Heavy 3D) */}
      <AnimatePresence>
        {selectedDishDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-forest-900 border border-gold/30 rounded-2xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedDishDetail(null)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-forest-950/70 text-cream/70 hover:text-gold"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-56 w-full overflow-hidden bg-forest-950">
                <img
                  src={selectedDishDetail.image_url}
                  alt={selectedDishDetail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-forest-950/90 text-gold border border-gold/30">
                    ● {selectedDishDetail.type}
                  </span>
                  {selectedDishDetail.chef_special && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold text-forest-950">
                      Chef's Special
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-serif text-2xl font-bold text-cream">
                    {selectedDishDetail.name}
                  </h3>
                  <span className="font-serif text-2xl font-bold text-gold">
                    ₹{selectedDishDetail.price}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-cream/70 leading-relaxed mb-6 font-light">
                  {selectedDishDetail.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                  <div className="p-3 rounded-xl bg-forest-950 border border-gold/20 flex items-center justify-between">
                    <span className="text-cream/60 flex items-center space-x-1">
                      <Flame className="w-4 h-4 text-saffron" />
                      <span>Spice Level</span>
                    </span>
                    <span className="font-bold text-saffron">
                      {'🌶️'.repeat(selectedDishDetail.spice_level || 1)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-forest-950 border border-gold/20 flex items-center justify-between">
                    <span className="text-cream/60 flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gold" />
                      <span>Prep Time</span>
                    </span>
                    <span className="font-bold text-cream">
                      ~{selectedDishDetail.preparation_time || 15} mins
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={zomatoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-gold/30 transition-all active:scale-95 group"
                  >
                    <Utensils className="w-4 h-4 text-forest-950" />
                    <span>Order this on Zomato • ₹{selectedDishDetail.price}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-forest-950 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
