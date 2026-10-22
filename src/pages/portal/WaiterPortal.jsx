import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Plus, 
  Minus, 
  Send, 
  Bell, 
  CheckCircle2, 
  QrCode, 
  Share2, 
  MessageCircle, 
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

  // Billing Modal State
  const [billingOrder, setBillingOrder] = useState(null);
  const [billPhone, setBillPhone] = useState('');
  const [billSentSuccess, setBillSentSuccess] = useState(false);

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

    const { data, error } = await createTableOrder({
      table_number: tableNumber,
      waiter_name: profile?.full_name || 'Captain',
      waiter_id: profile?.id || 'staff-waiter-01',
      customer_name: customerName,
      phone: customerPhone,
      items: orderItems,
      notes: orderNotes,
    });

    setIsSubmitting(false);

    if (error) {
      alert('Error sending KOT: ' + error.message);
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

  // Generate UPI QR URI & WhatsApp Bill
  const openBillingModal = (order) => {
    setBillingOrder(order);
    setBillPhone(order.phone || '');
    setBillSentSuccess(false);
  };

  const upiId = settings?.upi_id || 'nandanvan@oksbi';
  const upiName = settings?.upi_name || 'Nandanvan Multicuisine Restaurant';
  const gstRate = settings?.gst_rate ?? 5;

  const calculateBillTotals = (order) => {
    if (!order) return { subtotal: 0, gst: 0, total: 0 };
    const subtotal = order.subtotal || order.items?.reduce((s, it) => s + it.price * it.qty, 0) || 0;
    const gst = Math.round(subtotal * (gstRate / 100));
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  const getDynamicUpiUri = (order) => {
    if (!order) return '';
    const { total } = calculateBillTotals(order);
    const note = `Table ${order.table_number || 'Dine-In'} Bill #${order.order_number}`;
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  const getUpiQrImageUrl = (order) => {
    const upiUri = getDynamicUpiUri(order);
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;
  };

  const handleSendWhatsAppBill = () => {
    if (!billingOrder) return;
    const cleanPhone = billPhone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit customer WhatsApp number');
      return;
    }

    const { subtotal, gst, total } = calculateBillTotals(billingOrder);
    const upiUri = getDynamicUpiUri(billingOrder);

    // Format itemized receipt
    const itemsText = (billingOrder.items || [])
      .map((it, idx) => `${idx + 1}. ${it.name} x${it.qty} = ₹${it.price * it.qty}`)
      .join('\n');

    const message = 
`🍽️ *NANDANVAN MULTICUISINE RESTAURANT*
📍 Near Munjka, Kalawad Road, Rajkot
📞 +91 98250 84721
──────────────────────
🧾 *DINE-IN BILL - TABLE #${billingOrder.table_number || '1'}*
📋 Order: ${billingOrder.order_number}
📅 Date: ${new Date().toLocaleDateString('en-IN')} | ⏰ ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
Waitstaff: ${billingOrder.waiter_name || profile?.full_name || 'Captain'}
──────────────────────
${itemsText}
──────────────────────
Subtotal: ₹${subtotal}
GST (${gstRate}%): ₹${gst}
*GRAND TOTAL: ₹${total}*
──────────────────────
💳 *Pay Instantly via UPI:*
${upiUri}
(UPI ID: ${upiId})

🙏 *Thank you for dining at Nandanvan! We hope you loved our food and hospitality. Have a wonderful day & visit us again soon!* ✨`;

    const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setBillSentSuccess(true);
  };

  const handleCloseTableBill = async () => {
    if (!billingOrder) return;
    await completeTableBill(billingOrder.id, {
      phone: billPhone,
      customer_name: billingOrder.customer_name,
      payment_method: 'UPI',
    });
    setBillingOrder(null);
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
        <div className="bg-emerald-600 text-white px-4 py-2.5 shadow-xl flex items-center justify-between border-b border-emerald-400 animate-pulse">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <Bell className="w-4 h-4" />
            <span>
              PICKUP READY: Cook marked Table {readyForPickOrders.map((o) => o.table_number).join(', ')} food ready!
            </span>
          </div>
          <button
            onClick={() => setActiveTab('active_tables')}
            className="px-2.5 py-1 rounded-lg bg-white text-emerald-900 text-xs font-extrabold uppercase shadow-sm"
          >
            Serve Now
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 'VIP1'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTableNumber(String(t))}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      tableNumber === String(t)
                        ? 'bg-gold-gradient text-forest-950 shadow-md scale-105'
                        : 'bg-forest-950 border border-gold/20 text-cream/80 hover:border-gold'
                    }`}
                  >
                    T-{t}
                  </button>
                ))}
              </div>

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
                            <span className="font-serif text-xl sm:text-2xl font-black text-gold">
                              TABLE {order.table_number || '1'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isReadyToPick
                                  ? 'bg-emerald-500 text-white'
                                  : isServed
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                              }`}
                            >
                              {isReadyToPick
                                ? '🔔 Ready to Pick'
                                : isServed
                                ? 'Served (Dining)'
                                : 'Cooking in Kitchen'}
                            </span>
                          </div>
                          <span className="text-[10px] text-cream/50 font-mono block mt-0.5">
                            Order #{order.order_number} • Waiter: {order.waiter_name || 'Captain'}
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
                            <span>
                              {it.name} <strong className="text-gold">x{it.qty}</strong>
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
                            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg active:scale-95"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>PICK FROM COOKER & SERVED TO TABLE</span>
                          </button>
                        )}

                        {/* 2. If already Served -> Ready to Bill (WhatsApp & UPI QR) */}
                        {isServed && (
                          <button
                            onClick={() => openBillingModal(order)}
                            className="flex-1 py-3 rounded-xl bg-gold-gradient text-forest-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-gold/30 active:scale-95"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>READY TO BILL (WHATSAPP & UPI QR)</span>
                          </button>
                        )}

                        {/* 3. If Still Cooking -> Option to also bill or wait */}
                        {isCooking && (
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 py-2 px-3 rounded-xl bg-forest-950 border border-gold/20 text-[11px] text-cream/60 flex items-center justify-center space-x-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                              <span>Cook is preparing in Kitchen</span>
                            </div>
                            <button
                              onClick={() => openBillingModal(order)}
                              className="px-3 py-2 rounded-xl bg-forest-900 border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/20"
                            >
                              Bill
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

      {/* ==================== BILLING & WHATSAPP UPI MODAL ==================== */}
      {billingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md bg-forest-900 border border-gold/40 rounded-3xl shadow-2xl p-5 text-xs relative">
            <button
              onClick={() => setBillingOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-forest-950 text-cream/60 hover:text-gold"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Bill Header */}
            <div className="text-center pb-3 border-b border-gold/20">
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-bold uppercase mb-1">
                <span>Nandanvan Multicuisine Restaurant</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-cream">
                Table #{billingOrder.table_number || '1'} Final Bill
              </h3>
              <p className="text-[10px] text-cream/50">Order Number: {billingOrder.order_number}</p>
            </div>

            {/* Itemized summary */}
            <div className="py-3 space-y-1.5 border-b border-gold/15 max-h-36 overflow-y-auto">
              {billingOrder.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between text-cream/80 text-[11px]">
                  <span>{it.name} x{it.qty}</span>
                  <span className="font-mono">₹{it.price * it.qty}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            {(() => {
              const { subtotal, gst, total } = calculateBillTotals(billingOrder);
              return (
                <div className="py-2.5 border-b border-gold/20 space-y-1 text-xs">
                  <div className="flex justify-between text-cream/60">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-cream/60">
                    <span>GST ({gstRate}%)</span>
                    <span className="font-mono">₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-base font-serif font-black text-gold pt-1">
                    <span>Total Amount Payable</span>
                    <span className="font-mono">₹{total}</span>
                  </div>
                </div>
              );
            })()}

            {/* Dynamic UPI QR Code Box */}
            <div className="py-3 flex flex-col items-center justify-center bg-forest-950/70 rounded-2xl my-3 border border-gold/20 p-3">
              <span className="text-[10px] text-gold uppercase tracking-wider font-bold mb-2">
                Scan with GPay / PhonePe / Paytm / BHIM
              </span>
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <img
                  src={getUpiQrImageUrl(billingOrder)}
                  alt="Dynamic UPI QR Code"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <span className="text-[10px] font-mono text-cream/60 mt-2">
                UPI ID: <strong className="text-gold">{upiId}</strong>
              </span>
            </div>

            {/* Customer WhatsApp Phone Input */}
            <div className="space-y-1 mb-3">
              <label className="block text-[11px] font-semibold text-cream/80">
                Customer Mobile Number (For WhatsApp Bill) *
              </label>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-2 rounded-xl bg-forest-950 border border-gold/25 text-gold font-bold text-xs">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98250 XXXXX"
                  value={billPhone}
                  onChange={(e) => setBillPhone(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-xs text-cream font-mono font-bold focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {billSentSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] mb-3 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp opened! Bill & UPI payment link delivered to customer.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSendWhatsAppBill}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Send Bill & UPI on WhatsApp 💬</span>
              </button>

              <button
                type="button"
                onClick={handleCloseTableBill}
                className="w-full py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Mark Payment Received & Free Table</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
