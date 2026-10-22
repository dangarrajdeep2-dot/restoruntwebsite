import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Plus, 
  Minus, 
  Send, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles, 
  LogOut, 
  Check, 
  RefreshCw, 
  X, 
  User, 
  Phone,
  FileText,
  AlertCircle
} from 'lucide-react';
import { getCategories } from '../../api/categories';
import { getMenuItems } from '../../api/menu';
import { getOrders, createTableOrder, markOrderServed, completeTableBill } from '../../api/orders';
import { getSettings } from '../../api/settings';
import { useAuth } from '../../context/AuthContext';

export default function WaiterPortal() {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('new_order'); // 'new_order' | 'active_tables'
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Table Order State
  const [tableNumber, setTableNumber] = useState('1');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [cart, setCart] = useState([]); // { dish, qty, notes }
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table Action Feedback Banner
  const [actionFeedback, setActionFeedback] = useState(null);

  // Load initial data
  const loadData = async (isPoll = false) => {
    const [catRes, dishRes, ordRes, setRes] = await Promise.all([
      getCategories(),
      getMenuItems({ availableOnly: true }),
      getOrders(),
      getSettings(),
    ]);

    if (catRes.data) setCategories(catRes.data);
    if (dishRes.data) setDishes(dishRes.data);
    if (setRes.data) setSettings(setRes.data);

    if (ordRes.data) {
      // Active dine-in orders
      const dineIn = ordRes.data.filter(
        (o) => o.order_type === 'dine-in' && o.status !== 'completed' && o.status !== 'cancelled'
      );
      setActiveOrders(dineIn);
    }
    if (!isPoll) setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Listen to real-time order update events
    const handleUpdate = () => loadData(true);
    window.addEventListener('nandanvan_order_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Fast polling fallback for floor staff (every 3 seconds)
    const interval = setInterval(() => {
      loadData(true);
    }, 3000);

    return () => {
      window.removeEventListener('nandanvan_order_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // Filter menu items
  const filteredDishes = dishes.filter((dish) => {
    if (selectedCategory !== 'all') {
      const cat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
      const match =
        (cat && dish.category_id === cat.id) ||
        dish.category_id === selectedCategory ||
        dish.category === selectedCategory ||
        dish.categories?.slug === selectedCategory ||
        (cat && dish.category === cat.name);
      if (!match) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (dish.name || '').toLowerCase().includes(q) || (dish.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  // Cart operations
  const handleAddToCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { dish, qty: 1, notes: '' }];
    });
  };

  const handleUpdateQty = (dishId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const getDishQtyInCart = (dishId) => {
    const item = cart.find((i) => i.dish.id === dishId);
    return item ? item.qty : 0;
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.dish.price * item.qty, 0);

  // Send KOT to Kitchen
  const handleSendToKitchen = async () => {
    if (cart.length === 0) {
      alert('Please add at least 1 menu item to the order');
      return;
    }

    setIsSubmitting(true);
    const orderItems = cart.map((i) => ({
      id: i.dish.id,
      name: i.dish.name,
      price: i.dish.price,
      qty: i.qty,
      notes: i.notes || '',
    }));

    const res = await createTableOrder({
      table_number: tableNumber,
      waiter_name: profile?.full_name || 'Captain',
      waiter_id: profile?.id || 'staff-waiter-01',
      customer_name: customerName,
      phone: customerPhone,
      items: orderItems,
      notes: orderNotes,
    });

    setIsSubmitting(false);

    if (res.error) {
      alert('Error sending KOT: ' + res.error.message);
      return;
    }

    // Reset form and switch to Active Tables
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setOrderNotes('');
    setActiveTab('active_tables');
    loadData(true);
  };

  // Mark Served
  const handleMarkServed = async (orderId) => {
    await markOrderServed(orderId);
    loadData(true);
  };

  // Mark Table Done & Ready for Next Customer
  const handleMarkTableDone = async (orderId, tableNumber) => {
    const confirmDone = window.confirm(`Table #${tableNumber} ka dining complete ho gaya hai? Is table ko "Done & Ready" mark karein?`);
    if (!confirmDone) return;

    await completeTableBill(orderId, {
      payment_method: 'COMPLETED'
    });
    setActionFeedback(`Table #${tableNumber} marked Done, Clean & Ready for new guests! ✨`);
    setTimeout(() => setActionFeedback(null), 4000);
    loadData(true);
  };

  // Orders that are ready for pickup (urgent notification for waiters)
  const readyForPickOrders = activeOrders.filter((o) => o.status === 'ready_to_pick');

  return (
    <div className="min-h-screen bg-forest-950 text-cream flex flex-col font-sans pb-32 sm:pb-24 select-none">
      {/* Top Header Bar */}
      <header className="bg-forest-900/90 border-b border-gold/30 px-4 py-3 sticky top-0 z-30 backdrop-blur-md flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif text-base font-bold text-gold">NANDANVAN</span>
              <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold uppercase">
                Captain
              </span>
            </div>
            <p className="text-[10px] text-cream/60">
              Waiter: <strong className="text-cream">{profile?.full_name || 'Floor Staff'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Active Orders Count Badge */}
          <button
            onClick={() => setActiveTab('active_tables')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              readyForPickOrders.length > 0
                ? 'bg-emerald-500 text-white border-emerald-400 animate-bounce shadow-lg shadow-emerald-500/30'
                : 'bg-forest-950/80 border-gold/30 text-gold'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Tables ({activeOrders.length})</span>
          </button>

          <button
            onClick={signOut}
            className="p-1.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Alert: Cook Marked Order "Ready to Pick" */}
      {readyForPickOrders.length > 0 && (
        <div className="bg-emerald-600 text-white px-4 py-3 shadow-2xl flex items-center justify-between border-b-2 border-emerald-300 animate-pulse sticky top-[60px] z-30">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-extrabold">
            <Bell className="w-5 h-5 text-amber-300 animate-bounce flex-shrink-0" />
            <span>
              🔔 READY TO PICK: Food ban gaya hai! Table {readyForPickOrders.map((o) => `#${o.table_number}`).join(', ')} ka food kitchen counter se lene jana hai!
            </span>
          </div>
          <button
            onClick={() => setActiveTab('active_tables')}
            className="px-3 py-1.5 rounded-xl bg-white text-emerald-950 text-xs font-black uppercase shadow-md active:scale-95 transition-all whitespace-nowrap ml-2"
          >
            Lene Jayein (Pick Now) →
          </button>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="p-3 bg-forest-900/60 border-b border-gold/15 flex gap-2">
        <button
          onClick={() => setActiveTab('new_order')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'new_order'
              ? 'bg-gold-gradient text-forest-950 shadow-md font-extrabold'
              : 'bg-forest-950/60 text-cream/70 hover:text-gold'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Table Order (KOT)</span>
        </button>

        <button
          onClick={() => setActiveTab('active_tables')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'active_tables'
              ? 'bg-gold-gradient text-forest-950 shadow-md font-extrabold'
              : 'bg-forest-950/60 text-cream/70 hover:text-gold'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active Tables ({activeOrders.length})</span>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
        {/* Table Action Feedback Banner */}
        {actionFeedback && (
          <div className="max-w-2xl mx-auto mb-3 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center space-x-2 shadow-xl border border-emerald-400 animate-pulse">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}
        {/* ==================== TAB 1: NEW TABLE ORDER ==================== */}
        {activeTab === 'new_order' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Table Number & Customer Details Card */}
            <div className="p-4 rounded-2xl bg-forest-900/80 border border-gold/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">
                  Step 1: Select Table Number
                </span>
                <span className="text-[10px] text-cream/50">Dine-in floor ordering</span>
              </div>

              {/* Table Quick Select Pills (Clean 4 cols on mobile, 8 on desktop) */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 'VIP1'].map((t) => {
                  const tStr = String(t);
                  const isRunning = activeOrders.some((o) => String(o.table_number).trim() === tStr);
                  const isSelected = tableNumber === tStr;

                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTableNumber(tStr)}
                      className={`relative py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-gold-gradient text-forest-950 shadow-md scale-105'
                          : isRunning
                          ? 'bg-forest-900 border border-emerald-500/50 text-emerald-300'
                          : 'bg-forest-950 border border-gold/20 text-cream/80 hover:border-gold'
                      }`}
                    >
                      <span>T-{t}</span>
                      {isRunning && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-forest-950" title="Active Running Table" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Running Table Notice */}
              {(() => {
                const existing = activeOrders.find((o) => String(o.table_number).trim() === String(tableNumber).trim());
                if (!existing) return null;
                return (
                  <div className="p-2.5 rounded-xl bg-gold/15 border border-gold/40 text-xs text-gold flex items-center justify-between">
                    <span>
                      ⚡ <strong>Table #{tableNumber} has an active running order</strong> ({existing.items?.length || 0} items). Added items will be merged into <strong>Round {(existing.rounds || 1) + 1}</strong> with a single combined bill!
                    </span>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gold/15">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-cream/60 mb-1">
                    Customer Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Guest Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-forest-950 border border-gold/25 text-xs text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-cream/60 mb-1">
                    Cooking Notes / Jain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Jain / Less spicy"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-forest-950 border border-gold/25 text-xs text-cream focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Menu Search & Category Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
                <input
                  type="text"
                  placeholder="Search dishes (Paneer, Biryani, Olo, Sizzler...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-full bg-forest-900 border border-gold/30 text-xs text-cream focus:outline-none focus:border-gold"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gold-gradient text-forest-950 shadow-md'
                      : 'bg-forest-900/80 text-cream/70 hover:text-gold border border-gold/20'
                  }`}
                >
                  All Items
                </button>
                {categories.map((c) => {
                  const shortName = c.name
                    .replace(' & North Indian', '')
                    .replace(' & Gujarati', '')
                    .replace(' Flavors', '')
                    .replace(' Fusion', '')
                    .replace(' & Continental', '')
                    .replace(' & Rice', '')
                    .replace('Royal ', '')
                    .replace(' & Mithai', '')
                    .replace(' & Mocktails', '');

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                        selectedCategory === c.slug
                          ? 'bg-gold-gradient text-forest-950 shadow-md'
                          : 'bg-forest-900/80 text-cream/70 hover:text-gold border border-gold/20'
                      }`}
                    >
                      {shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="space-y-2">
              {filteredDishes.map((dish) => {
                const inCartQty = getDishQtyInCart(dish.id);

                return (
                  <div
                    key={dish.id}
                    className="p-3 rounded-2xl bg-forest-900/70 border border-gold/20 flex items-center justify-between hover:border-gold/50 transition-colors"
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dish.type === 'jain' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        <h4 className="font-serif text-sm font-bold text-cream line-clamp-1">
                          {dish.name}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-gold">₹{dish.price}</span>
                    </div>

                    {/* Counter Buttons */}
                    <div className="flex items-center space-x-2">
                      {inCartQty > 0 ? (
                        <div className="flex items-center space-x-2 bg-forest-950 border border-gold/40 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(dish.id, -1)}
                            className="w-7 h-7 rounded-lg bg-forest-900 text-gold flex items-center justify-center font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-cream">
                            {inCartQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(dish.id, 1)}
                            className="w-7 h-7 rounded-lg bg-gold text-forest-950 flex items-center justify-center font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(dish)}
                          className="px-3.5 py-1.5 rounded-xl bg-gold/20 hover:bg-gold hover:text-forest-950 border border-gold/40 text-gold font-bold text-xs uppercase tracking-wider flex items-center space-x-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Floating Bottom Bar for Sending KOT */}
            {cart.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 p-3 bg-forest-950/95 border-t border-gold/40 backdrop-blur-md z-40 max-w-2xl mx-auto shadow-2xl">
                <div className="flex items-center justify-between mb-2 px-1 text-xs">
                  <span className="text-cream/80">
                    Table <strong>#{tableNumber}</strong> • <strong>{cart.length} items</strong>
                  </span>
                  <span className="font-serif text-base font-bold text-gold">
                    Subtotal: ₹{cartSubtotal}
                  </span>
                </div>

                <button
                  disabled={isSubmitting}
                  onClick={handleSendToKitchen}
                  className="w-full py-3.5 rounded-2xl bg-gold-gradient text-forest-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl hover:shadow-gold/30 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Sending to Kitchen...' : `SEND KOT TO COOK (TABLE ${tableNumber}) 🚀`}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: ACTIVE TABLES ==================== */}
        {activeTab === 'active_tables' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-gold">
                Live Tables on Floor ({activeOrders.length})
              </h3>
              <button
                onClick={() => loadData(true)}
                className="text-xs text-cream/60 hover:text-gold flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            {activeOrders.length === 0 ? (
              <div className="text-center py-16 p-6 rounded-2xl bg-forest-900/40 border border-gold/20">
                <Utensils className="w-10 h-10 text-gold/40 mx-auto mb-2" />
                <h4 className="font-serif text-base font-bold text-cream">No Active Tables</h4>
                <p className="text-xs text-cream/60 mt-1 mb-4">
                  All table orders have been completed and billed.
                </p>
                <button
                  onClick={() => setActiveTab('new_order')}
                  className="px-4 py-2 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider"
                >
                  Create New Table Order
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrders.map((order) => {
                  const isReadyToPick = order.status === 'ready_to_pick';
                  const isServed = order.status === 'served';
                  const isCooking = order.status === 'sent_to_kitchen';

                  return (
                    <div
                      key={order.id}
                      className={`p-4 rounded-2xl border-2 transition-all shadow-xl ${
                        isReadyToPick
                          ? 'bg-emerald-950/60 border-emerald-400 shadow-emerald-500/20 animate-pulse'
                          : isServed
                          ? 'bg-forest-900/80 border-gold/40'
                          : 'bg-forest-900/60 border-gold/25'
                      }`}
                    >
                      {/* Table Header */}
                      <div className="flex items-start justify-between pb-3 border-b border-gold/15">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-serif text-2xl font-black text-gold">
                              TABLE #{order.table_number || '1'}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider ${
                                isReadyToPick
                                  ? 'bg-emerald-500 text-white shadow-md animate-pulse'
                                  : isServed
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                              }`}
                            >
                              {isReadyToPick
                                ? '🔔 FOOD TAIYAR HAI (READY TO PICK)'
                                : isServed
                                ? 'Served (Customer Dining)'
                                : 'Cooker Preparing in Kitchen'}
                            </span>
                          </div>
                          {isReadyToPick && (
                            <span className="text-[11px] text-emerald-300 font-bold block mt-1">
                              👉 Cooker ne food bana diya hai! Counter se lene jana hai aur customer ko serve karna hai!
                            </span>
                          )}
                          <span className="text-[10px] text-cream/50 font-mono block mt-0.5">
                            KOT #{order.order_number} • Waiter: {order.waiter_name || 'Captain'}
                          </span>
                        </div>

                        <span className="font-serif text-base font-bold text-gold">
                          ₹{order.total || order.subtotal}
                        </span>
                      </div>

                      {/* Items list */}
                      <div className="py-2.5 space-y-1 border-b border-gold/15 text-xs text-cream/80">
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="flex items-center space-x-1.5">
                              <span>{it.name}</span>
                              <strong className="text-gold">x{it.qty}</strong>
                              {it.round && it.round > 1 && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-saffron/20 border border-saffron/30 text-saffron font-bold">
                                  R{it.round}
                                </span>
                              )}
                            </span>
                            <span className="text-cream/50">₹{it.price * it.qty}</span>
                          </div>
                        ))}
                      </div>

                      {/* ACTIONS PER STATUS */}
                      <div className="pt-3 flex flex-col sm:flex-row gap-2">
                        {/* 1. If Cook marked Ready to Pick -> Waiter marks Served */}
                        {isReadyToPick && (
                          <button
                            onClick={() => handleMarkServed(order.id)}
                            className="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/30 active:scale-95 transition-all"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>CONFIRM: PICK FROM COOKER & SERVE TABLE #{order.table_number}</span>
                          </button>
                        )}

                        {/* 2. If already Served -> Option to Add More Food OR Mark Done & Table Ready */}
                        {isServed && (
                          <div className="flex-1 flex gap-2">
                            <button
                              onClick={() => {
                                setTableNumber(String(order.table_number));
                                setActiveTab('new_order');
                              }}
                              className="px-3.5 py-3 rounded-xl bg-forest-950 border border-gold/40 text-gold hover:bg-gold/15 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-sm"
                              title="Customer wants to order additional food"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Items</span>
                            </button>

                            <button
                              onClick={() => handleMarkTableDone(order.id, order.table_number)}
                              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              <span>MARK DONE & TABLE READY ✅</span>
                            </button>
                          </div>
                        )}

                        {/* 3. If Still Cooking -> Option to also add more or mark table done */}
                        {isCooking && (
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 py-2 px-3 rounded-xl bg-forest-950 border border-gold/20 text-[11px] text-cream/60 flex items-center justify-center space-x-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                              <span>Cook is preparing {order.rounds > 1 ? `(Round ${order.rounds})` : ''}</span>
                            </div>
                            <button
                              onClick={() => {
                                setTableNumber(String(order.table_number));
                                setActiveTab('new_order');
                              }}
                              className="px-3 py-2 rounded-xl bg-forest-950 border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/15"
                              title="Add more items to this order"
                            >
                              + Items
                            </button>
                            <button
                              onClick={() => handleMarkTableDone(order.id, order.table_number)}
                              className="px-3 py-2 rounded-xl bg-forest-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-950/60 transition-colors"
                              title="Mark table finished"
                            >
                              Done & Ready
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
