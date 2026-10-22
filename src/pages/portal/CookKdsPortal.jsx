import React, { useState, useEffect, useRef } from 'react';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Bell, 
  Flame, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  LogOut, 
  Check, 
  RefreshCw,
  AlertTriangle,
  Utensils
} from 'lucide-react';
import { getOrders, toggleOrderItemPrepared, markOrderReadyToPick } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';

export default function CookKdsPortal() {
  const { user, profile, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState('active'); // 'active' | 'ready' | 'all'
  const prevOrdersCount = useRef(0);

  // Web Audio Kitchen Bell Synthesizer
  const playKitchenBell = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // Double ding
      const playTone = (freq, delay) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + 0.6);
      };
      playTone(784, 0); // G5
      playTone(1046.5, 0.18); // C6
    } catch {
      // AudioContext policy
    }
  };

  const loadKdsOrders = async (isPoll = false) => {
    const { data } = await getOrders();
    if (data) {
      // Filter for dine-in orders that concern the kitchen
      const kitchenOrders = data.filter(
        (o) => o.order_type === 'dine-in' || (o.status !== 'cancelled')
      );

      // Check if new orders arrived to play sound
      const activeCount = kitchenOrders.filter((o) => o.status === 'sent_to_kitchen').length;
      if (isPoll && activeCount > prevOrdersCount.current) {
        playKitchenBell();
      }
      prevOrdersCount.current = activeCount;

      setOrders(kitchenOrders);
    }
    if (!isPoll) setLoading(false);
  };

  useEffect(() => {
    loadKdsOrders();

    // Listen to local storage and custom dispatch events for real-time reactivity
    const handleUpdate = () => loadKdsOrders(true);
    window.addEventListener('nandanvan_order_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Fast polling fallback for kitchen screen (every 2.5 seconds)
    const interval = setInterval(() => {
      loadKdsOrders(true);
    }, 2500);

    return () => {
      window.removeEventListener('nandanvan_order_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [soundEnabled]);

  const handleToggleItem = async (orderId, idx) => {
    await toggleOrderItemPrepared(orderId, idx);
    loadKdsOrders(true);
  };

  const handleReadyToPick = async (orderId) => {
    await markOrderReadyToPick(orderId);
    playKitchenBell();
    loadKdsOrders(true);
  };

  // FIFO Sorting: Oldest active orders first!
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(a.created_at) - new Date(b.created_at);
  });

  const activeOrders = sortedOrders.filter((o) => o.status === 'sent_to_kitchen');
  const readyOrders = sortedOrders.filter((o) => o.status === 'ready_to_pick');
  const displayedOrders = filter === 'active' 
    ? activeOrders 
    : filter === 'ready' 
    ? readyOrders 
    : sortedOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  const getTimeElapsed = (isoDate) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    return `${mins}m ago`;
  };

  const getUrgencyColor = (isoDate) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins >= 20) return 'border-rose-500 bg-rose-950/40 text-rose-300';
    if (mins >= 10) return 'border-amber-500 bg-amber-950/40 text-amber-300';
    return 'border-gold/30 bg-forest-900/60 text-gold';
  };

  return (
    <div className="min-h-screen bg-[#08130E] text-cream flex flex-col font-sans select-none">
      {/* KDS Header Bar */}
      <header className="bg-forest-950 border-b border-gold/30 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron shadow-md">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wider text-gold">
                NANDANVAN KITCHEN (KDS)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase animate-pulse">
                LIVE FIFO
              </span>
            </div>
            <p className="text-[11px] text-cream/60">
              Chef: <strong className="text-cream">{profile?.full_name || 'Kitchen Master'}</strong> • Orders sorted by arrival
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              soundEnabled
                ? 'bg-gold/20 border-gold/40 text-gold'
                : 'bg-forest-900 border-cream/20 text-cream/40'
            }`}
            title="Toggle Kitchen Chime Alert"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Bell ON' : 'Muted'}</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={() => loadKdsOrders(true)}
            className="p-2 rounded-xl bg-forest-900 border border-gold/30 text-gold hover:bg-gold/20"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Logout button */}
          <button
            onClick={signOut}
            className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-forest-950/80 border-b border-gold/20 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              filter === 'active'
                ? 'bg-gold-gradient text-forest-950 shadow-md'
                : 'bg-forest-900/60 text-cream/70 hover:text-gold'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-saffron" />
            <span>Cooking Now ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setFilter('ready')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              filter === 'ready'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-forest-900/60 text-cream/70 hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for Pickup ({readyOrders.length})</span>
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              filter === 'all'
                ? 'bg-forest-800 text-gold border border-gold/40'
                : 'bg-forest-900/60 text-cream/70 hover:text-gold'
            }`}
          >
            <span>All Active</span>
          </button>
        </div>

        <div className="text-[11px] text-cream/50 hidden md:block">
          Orders appear automatically the second Waiter sends KOT on phone.
        </div>
      </div>

      {/* Main KDS Grid (Strictly FIFO order) */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gold">
            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-gold" />
            <p className="text-sm font-semibold">Connecting to live Kitchen Queue...</p>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-forest-900 border border-gold/30 flex items-center justify-center mx-auto mb-4 text-gold/60">
              <ChefHat className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-cream mb-1">
              Kitchen Queue is All Clear!
            </h3>
            <p className="text-xs text-cream/60">
              No orders waiting in this view. When a floor waiter adds an order, it will chime and appear right here instantly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayedOrders.map((order, orderIndex) => {
              const isReady = order.status === 'ready_to_pick';
              const isServed = order.status === 'served';
              const allChecked = order.items && order.items.every((it) => it.is_prepared);
              const urgency = getUrgencyColor(order.created_at);

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border-2 flex flex-col justify-between shadow-2xl transition-all duration-300 overflow-hidden ${
                    isReady
                      ? 'bg-emerald-950/40 border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                      : isServed
                      ? 'bg-forest-950/80 border-gold/20 opacity-75'
                      : 'bg-forest-900/90 border-gold/40'
                  }`}
                >
                  {/* Card Header (Table & Order Info) */}
                  <div className="p-4 border-b border-gold/20 bg-forest-950/70">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-serif text-2xl sm:text-3xl font-extrabold text-gold tracking-tight">
                            {order.table_number ? `TABLE ${order.table_number}` : 'TAKEAWAY'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-forest-900 border border-gold/30 text-[10px] font-mono text-cream font-bold">
                            #{orderIndex + 1} FIFO
                          </span>
                        </div>
                        <span className="text-[10px] text-cream/60 font-mono block mt-0.5">
                          Order: {order.order_number} • Waiter: <strong className="text-cream">{order.waiter_name || 'Captain'}</strong>
                        </span>
                      </div>

                      {/* Time badge */}
                      <div className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center space-x-1 ${urgency}`}>
                        <Clock className="w-3 h-3" />
                        <span>{getTimeElapsed(order.created_at)}</span>
                      </div>
                    </div>

                    {/* Customer Notes / Allergies */}
                    {order.notes && (
                      <div className="mt-2 p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center space-x-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>Note: {order.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Menu Items Checklist (Cook ticks items as prepared) */}
                  <div className="p-4 space-y-2.5 flex-1 overflow-y-auto max-h-[360px]">
                    <div className="text-[10px] font-bold text-cream/40 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Menu Items to Prepare ({order.items?.length || 0})</span>
                      <span>Tick When Cooked</span>
                    </div>

                    {order.items?.map((item, idx) => {
                      const isPrepared = Boolean(item.is_prepared);

                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleItem(order.id, idx)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isPrepared
                              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                              : 'bg-forest-950/80 border-gold/20 hover:border-gold/60 text-cream'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {/* Tick checkbox */}
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                                isPrepared
                                  ? 'bg-emerald-500 border-emerald-400 text-white'
                                  : 'border-gold/40 bg-forest-900/60 text-transparent'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-bold ${isPrepared ? 'line-through text-cream/50' : 'text-cream'}`}>
                                  {item.name}
                                </span>
                              </div>
                              {item.notes && (
                                <span className="text-[10px] text-amber-300 block">
                                  {item.notes}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Item Quantity Badge */}
                          <div className="px-2.5 py-1 rounded-lg bg-gold-gradient text-forest-950 font-black text-sm shadow-sm flex-shrink-0">
                            x{item.qty}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Footer: Ready to Pick Button */}
                  <div className="p-4 border-t border-gold/20 bg-forest-950/80">
                    {isReady ? (
                      <div className="w-full py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 animate-bounce" />
                        <span>Notified Waiter • Ready for Table Pick</span>
                      </div>
                    ) : isServed ? (
                      <div className="w-full py-2.5 rounded-xl bg-forest-900 border border-gold/30 text-cream/70 font-semibold text-xs text-center">
                        ✓ Served to Customer
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReadyToPick(order.id)}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl transition-all active:scale-95 ${
                          allChecked
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30 animate-pulse'
                            : 'bg-gold-gradient text-forest-950 hover:shadow-gold/30'
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                        <span>READY TO PICK (ALERT WAITER)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
