import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  ShoppingBag, 
  Flame, 
  Eye, 
  Filter, 
  Check, 
  Clock,
  Layers
} from 'lucide-react';
import { getCategories } from '../api/categories';
import { getMenuItems } from '../api/menu';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import DishViewerModal from '../three/DishViewerModal';

export default function MenuSection() {
  const { t } = useLanguage();
  const { addToCart, items: cartItems } = useCart();

  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // all | veg | jain | non-veg
  const [searchQuery, setSearchQuery] = useState('');
  const [selected3DDish, setSelected3DDish] = useState(null);
  const [addedAnimationDishId, setAddedAnimationDishId] = useState(null);

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
      // Type filter (veg, jain, non-veg)
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

  const handleAddToCart = (dish) => {
    addToCart(dish, 1);
    setAddedAnimationDishId(dish.id);
    setTimeout(() => setAddedAnimationDishId(null), 1200);
  };

  const getDishCartQty = (dishId) => {
    const item = cartItems.find((i) => i.id === dishId);
    return item ? item.qty : 0;
  };

  return (
    <section id="menu" className="relative py-24 bg-forest-950">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-forest-900 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nandanvan Gastronomy</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream mb-4">
            {t.menu.title}
          </h2>
          <p className="text-sm sm:text-base text-cream/70 font-light">
            {t.menu.subtitle}
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.menu.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-forest-900/90 border border-gold/25 text-cream text-xs sm:text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
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

          {/* Veg / Jain / Non-Veg Diet Filter Pills */}
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1">
            {[
              { id: 'all', label: t.menu.all },
              { id: 'veg', label: t.menu.veg, dot: 'bg-emerald-500' },
              { id: 'jain', label: t.menu.jain, dot: 'bg-amber-500' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
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

        {/* Sticky Category Tabs */}
        <div className="sticky top-16 z-30 py-3 mb-10 bg-forest-950/90 backdrop-blur-md border-y border-gold/20">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
                activeCategory === 'all'
                  ? 'bg-gold-gradient text-forest-950 font-bold shadow-[0_0_15px_rgba(212,162,76,0.3)]'
                  : 'bg-forest-900/80 border border-gold/20 text-cream/80 hover:text-gold hover:border-gold/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? 'bg-gold-gradient text-forest-950 font-bold shadow-[0_0_15px_rgba(212,162,76,0.3)]'
                    : 'bg-forest-900/80 border border-gold/20 text-cream/80 hover:text-gold hover:border-gold/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        {loading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-forest-900/40 border border-gold/15 p-4 animate-pulse flex flex-col space-y-3"
              >
                <div className="w-full h-44 rounded-xl bg-forest-800/60" />
                <div className="h-4 bg-forest-800/60 rounded w-3/4" />
                <div className="h-3 bg-forest-800/40 rounded w-full" />
                <div className="h-8 bg-forest-800/60 rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="text-center py-16 bg-forest-900/30 rounded-2xl border border-gold/20">
            <p className="text-cream/60 text-base">No dishes found matching your selection.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold hover:bg-gold/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredDishes.map((dish) => {
                const qtyInCart = getDishCartQty(dish.id);
                const isJustAdded = addedAnimationDishId === dish.id;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={dish.id}
                    className="group rounded-2xl bg-forest-900/50 backdrop-blur-sm border border-gold/20 hover:border-gold/50 shadow-lg hover:shadow-[0_8px_30px_rgba(212,162,76,0.15)] transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Dish Image Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-forest-950">
                      <img
                        src={dish.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'}
                        alt={dish.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-80" />

                      {/* Top badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        {/* Diet Type Dot Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md ${
                            dish.type === 'jain'
                              ? 'bg-amber-900/80 text-amber-300 border border-amber-500/40'
                              : dish.type === 'veg'
                              ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-900/80 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          ● {dish.type}
                        </span>

                        {dish.chef_special && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/90 text-forest-950 flex items-center space-x-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Special</span>
                          </span>
                        )}
                      </div>

                      {/* 3D Viewer trigger button */}
                      <button
                        onClick={() => setSelected3DDish(dish)}
                        className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-forest-950/80 border border-gold/40 text-gold text-[11px] font-semibold flex items-center space-x-1 backdrop-blur-md hover:bg-gold hover:text-forest-950 transition-colors shadow-md"
                        title="Open interactive 3D view"
                      >
                        <Eye className="w-3 h-3" />
                        <span>3D View</span>
                      </button>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title & Spice */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3
                            onClick={() => setSelected3DDish(dish)}
                            className="font-serif text-lg font-bold text-cream hover:text-gold transition-colors cursor-pointer line-clamp-1"
                          >
                            {dish.name}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-cream/70 line-clamp-2 leading-relaxed mb-3">
                          {dish.description}
                        </p>
                      </div>

                      {/* Footer: Price & Add to Cart button */}
                      <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xs text-gold/80 font-medium">₹</span>
                          <span className="font-serif text-xl font-bold text-gold">
                            {dish.price}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(dish)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gold-gradient text-forest-950 hover:shadow-[0_0_15px_rgba(212,162,76,0.4)]'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add {qtyInCart > 0 ? `(${qtyInCart})` : ''}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* 3D OrbitControls Modal */}
      {selected3DDish && (
        <DishViewerModal
          dish={selected3DDish}
          onClose={() => setSelected3DDish(null)}
        />
      )}
    </section>
  );
}
