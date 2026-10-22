import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  UtensilsCrossed, 
  Layers, 
  Gift, 
  Image, 
  Star, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu as MenuIcon, 
  X, 
  Bell, 
  ExternalLink,
  Sparkles,
  Users,
  ChefHat,
  Utensils
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function AdminLayout({ activeTab, onSelectTab, children }) {
  const { user, profile, signOut } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [realtimeNotification, setRealtimeNotification] = useState(null);

  // Sound chime synthesizer using Web Audio API (zero external assets needed)
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext not allowed before user gesture
    }
  };

  // Realtime subscription for Orders, Reservations, and Enquiries
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('admin-realtime-alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          playChime();
          setRealtimeNotification({
            type: 'Order',
            title: `New Order #${payload.new.order_number}`,
            desc: `₹${payload.new.total} by ${payload.new.customer_name}`,
          });
          setTimeout(() => setRealtimeNotification(null), 6000);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reservations' },
        (payload) => {
          playChime();
          setRealtimeNotification({
            type: 'Reservation',
            title: `New Table Booking`,
            desc: `${payload.new.name} for ${payload.new.guests} guests (${payload.new.date})`,
          });
          setTimeout(() => setRealtimeNotification(null), 6000);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'enquiries' },
        (payload) => {
          playChime();
          setRealtimeNotification({
            type: 'Enquiry',
            title: `New Event Enquiry`,
            desc: `${payload.new.event_type} by ${payload.new.name}`,
          });
          setTimeout(() => setRealtimeNotification(null), 6000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'menu', label: 'Menu Dishes', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'offers', label: 'Offers & Promos', icon: Gift },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
    { id: 'staff', label: 'Staff & Roles', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId) => {
    onSelectTab(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-forest-950 text-cream flex overflow-hidden">
      
      {/* Realtime Floating Notification Alert */}
      <AnimatePresence>
        {realtimeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-forest-900 border-2 border-gold shadow-2xl flex items-start space-x-3 max-w-sm"
          >
            <div className="p-2 rounded-xl bg-gold/20 text-gold border border-gold/40">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                Live {realtimeNotification.type} Alert
              </span>
              <h5 className="text-sm font-bold text-cream">
                {realtimeNotification.title}
              </h5>
              <p className="text-xs text-cream/70 mt-0.5">
                {realtimeNotification.desc}
              </p>
            </div>
            <button
              onClick={() => setRealtimeNotification(null)}
              className="text-cream/40 hover:text-gold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Left) */}
      <aside className="hidden lg:flex w-64 bg-forest-950 border-r border-gold/20 flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Brand */}
          <div className="p-3 mb-6 border-b border-gold/20 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full border border-gold flex items-center justify-center bg-forest-900 text-gold font-serif font-bold">
              N
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-gold-gradient block leading-none">
                NANDANVAN
              </span>
              <span className="text-[10px] tracking-widest uppercase text-cream/60">
                Staff Portal
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gold-gradient text-forest-950 font-bold shadow-md shadow-gold/20'
                      : 'text-cream/70 hover:bg-forest-900 hover:text-gold'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Portal Switchers */}
        {/* Portal Button: Navigates to Portal Login */}
        <div className="py-2.5 px-3 border-t border-gold/15 bg-forest-950/60 rounded-xl mx-2 mb-2">
          <button
            onClick={async () => {
              await signOut();
              window.location.hash = '#/portal';
            }}
            className="w-full py-2 px-3 rounded-lg bg-forest-900 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm active:scale-95"
            title="Go to Portal Login"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portal</span>
          </button>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-gold/20 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gold/20 text-gold border border-gold/30 flex items-center justify-center font-bold text-xs uppercase">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-cream truncate block">
                {profile?.full_name || 'Admin'}
              </span>
              <span className="text-[10px] text-gold uppercase tracking-wider block">
                Role: {profile?.role || 'owner'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="#/"
              className="flex-1 py-2 px-3 rounded-lg bg-forest-900 border border-gold/20 text-[11px] text-cream/80 hover:text-gold flex items-center justify-center space-x-1"
            >
              <span>Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={signOut}
              className="py-2 px-3 rounded-lg bg-red-950/40 border border-red-500/30 text-[11px] text-red-300 hover:bg-red-900/60 flex items-center space-x-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-forest-950/80 backdrop-blur-md border-b border-gold/20 px-4 sm:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-forest-900 border border-gold/20 text-gold"
              aria-label="Open sidebar"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-lg sm:text-xl font-bold text-cream capitalize">
              {activeTab} Management
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-900 border border-gold/25 text-xs text-cream/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Realtime Connected</span>
            </span>

            <button
              onClick={async () => {
                await signOut();
                window.location.hash = '#/portal';
              }}
              className="px-3 py-1.5 rounded-xl bg-forest-900 border border-gold/30 text-gold hover:bg-gold hover:text-forest-950 transition-colors text-xs font-semibold flex items-center space-x-1.5"
              title="Go to Portal Login"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>

            <a
              href="#/"
              className="px-3.5 py-1.5 rounded-xl bg-gold/15 border border-gold/30 text-gold hover:bg-gold hover:text-forest-950 transition-colors text-xs font-semibold flex items-center space-x-1.5"
            >
              <span>View Dining Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-forest-950">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute inset-0 bg-forest-950/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-y-0 left-0 w-72 bg-forest-950 border-r border-gold/30 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gold/20 mb-4">
                  <span className="font-serif text-lg font-bold text-gold-gradient">
                    NANDANVAN ADMIN
                  </span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 text-cream/60 hover:text-gold"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gold-gradient text-forest-950 font-bold'
                            : 'text-cream/70 hover:bg-forest-900 hover:text-gold'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-gold/20 flex items-center justify-between">
                <span className="text-xs text-cream/70">
                  {profile?.full_name || 'Staff User'}
                </span>
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
