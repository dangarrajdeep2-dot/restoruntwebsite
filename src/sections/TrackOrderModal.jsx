import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bike, 
  AlertCircle,
  Phone
} from 'lucide-react';
import { trackOrder } from '../api/orders';

export default function TrackOrderModal({ isOpen, onClose, initialOrderNumber = '', initialPhone = '' }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialOrderNumber) setOrderNumber(initialOrderNumber);
    if (initialPhone) setPhone(initialPhone);
    if (initialOrderNumber && initialPhone) {
      handleSearch(initialOrderNumber, initialPhone);
    }
  }, [initialOrderNumber, initialPhone]);

  const handleSearch = async (numToSearch = orderNumber, phoneToSearch = phone) => {
    if (!numToSearch.trim() || !phoneToSearch.trim()) {
      setErrorMsg('Please enter both Order Number (e.g. NV-1001) and your Mobile Number.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await trackOrder(numToSearch, phoneToSearch);
      if (error) throw error;
      if (!data || !data.found) {
        setErrorMsg(data?.message || 'No matching order found for this combination.');
        setOrderResult(null);
      } else {
        setOrderResult(data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error tracking order.');
      setOrderResult(null);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'preparing', label: 'In Kitchen', icon: ChefHat },
    { key: 'out-for-delivery', label: 'Out for Delivery', icon: Bike },
    { key: 'completed', label: 'Delivered / Served', icon: CheckCircle2 },
  ];

  const getStatusIndex = (currentStatus) => {
    const idx = statusSteps.findIndex((s) => s.key === currentStatus);
    return idx === -1 ? 0 : idx;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-forest-900 border border-gold/30 rounded-2xl shadow-2xl p-6 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-forest-800 text-cream/70 hover:text-gold"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-2.5 mb-5">
            <div className="p-2 rounded-xl bg-gold/20 text-gold border border-gold/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-cream">
                Track Live Order
              </h3>
              <p className="text-xs text-cream/60">
                Enter your order number and phone to view kitchen status
              </p>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-gold uppercase tracking-wider mb-1">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. NV-1001"
                className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/30 text-cream text-xs focus:outline-none focus:border-gold uppercase"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gold uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/30 text-cream text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-gold/20 transition-all mb-4 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching Order...' : 'Track Order Status'}</span>
          </button>

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Result Card */}
          {orderResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-forest-950 border border-gold/30 space-y-4"
            >
              {/* Header result */}
              <div className="flex items-center justify-between pb-3 border-b border-gold/15">
                <div>
                  <span className="text-[10px] text-cream/60 uppercase">Customer</span>
                  <div className="text-sm font-bold text-cream">
                    {orderResult.customer_name}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-cream/60 uppercase">Order #</span>
                  <div className="text-sm font-serif font-bold text-gold">
                    {orderResult.order_number}
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div>
                <span className="text-xs font-semibold text-gold block mb-3">
                  Live Preparation Status:
                </span>
                <div className="space-y-3">
                  {statusSteps.map((step, idx) => {
                    const currentIndex = getStatusIndex(orderResult.status);
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs transition-colors ${
                            isDone
                              ? 'bg-gold text-forest-950 border-gold font-bold shadow-[0_0_10px_rgba(212,162,76,0.5)]'
                              : 'bg-forest-900 border-gold/20 text-cream/30'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span
                          className={`text-xs ${
                            isCurrent
                              ? 'text-gold font-bold uppercase tracking-wider'
                              : isDone
                              ? 'text-cream font-medium'
                              : 'text-cream/40'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              {orderResult.items && orderResult.items.length > 0 && (
                <div className="pt-3 border-t border-gold/15">
                  <span className="text-[11px] font-semibold text-cream/70 block mb-2">
                    Dishes in this order:
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {orderResult.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-cream/80">
                        <span>
                          {item.name} × {item.qty}
                        </span>
                        <span className="text-gold">₹{item.item_total || item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-gold/15 flex justify-between text-sm font-bold text-cream">
                    <span>Total Paid:</span>
                    <span className="text-gold font-serif text-base">
                      ₹{orderResult.total}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
