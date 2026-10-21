import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Bike, 
  Store, 
  UtensilsCrossed,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { placeOrder } from '../api/orders';

export default function CartDrawer({ onOpenTrackOrder }) {
  const { t } = useLanguage();
  const { 
    items, 
    updateQty, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    deliveryCharge, 
    minOrder, 
    total, 
    isDrawerOpen, 
    setIsDrawerOpen 
  } = useCart();

  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    order_type: 'delivery',
    payment_method: 'UPI',
    table_number: '',
    notes: '',
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProceedToCheckout = () => {
    if (subtotal < minOrder) {
      setErrorMessage(`Minimum order subtotal must be at least ₹${minOrder}. Please add more items.`);
      return;
    }
    setErrorMessage('');
    setStep('checkout');
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMessage('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (formData.order_type === 'delivery' && formData.address.trim().length < 5) {
      setErrorMessage('Please provide a complete delivery address in Rajkot.');
      return;
    }

    setLoading(true);

    try {
      const itemsPayload = items.map((i) => ({
        menu_item_id: i.id,
        qty: i.qty,
      }));

      const { data, error } = await placeOrder(formData, itemsPayload);

      if (error) {
        throw new Error(error.message || 'Failed to place order');
      }

      // Success
      setCompletedOrder({
        ...data,
        customer_name: formData.name,
        phone: formData.phone,
        items: [...items],
      });

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4A24C', '#E8782A', '#0E2A1F'],
      });

      clearCart();
      setStep('success');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppOrderLink = () => {
    if (!completedOrder) return '#';
    const text = `*Order Confirmation - Nandanvan Restaurant*\n` +
      `*Order #:* ${completedOrder.order_number}\n` +
      `*Name:* ${completedOrder.customer_name}\n` +
      `*Total:* ₹${completedOrder.total}\n` +
      `Please confirm my order preparation!`;
    return `https://wa.me/919825084721?text=${encodeURIComponent(text)}`;
  };

  const resetDrawer = () => {
    setStep('cart');
    setErrorMessage('');
    setCompletedOrder(null);
    setIsDrawerOpen(false);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetDrawer}
            className="absolute inset-0 bg-forest-950/75 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute inset-y-0 right-0 w-full max-w-md bg-forest-950 border-l border-gold/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-gold/20 flex items-center justify-between bg-forest-900/60">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-gold/15 text-gold border border-gold/30">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-cream">
                    {step === 'cart'
                      ? t.cart.title
                      : step === 'checkout'
                      ? 'Checkout Details'
                      : 'Order Confirmed!'}
                  </h3>
                  <span className="text-[11px] text-gold/80 font-mono">
                    {items.length} unique dish(es)
                  </span>
                </div>
              </div>

              <button
                onClick={resetDrawer}
                className="p-2 rounded-full hover:bg-forest-800 text-cream/70 hover:text-gold transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mx-4 mt-4 p-3 rounded-xl bg-red-900/30 border border-red-500/50 flex items-start space-x-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              
              {/* STEP 1: CART LIST */}
              {step === 'cart' && (
                <>
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-forest-900/80 border border-gold/20 flex items-center justify-center mb-4 text-gold/40">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <h4 className="font-serif text-lg text-cream mb-1">{t.cart.empty}</h4>
                      <p className="text-xs text-cream/60 max-w-xs mb-6">
                        Explore our royal menu and add fresh delicacies to start your feast.
                      </p>
                      <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="px-6 py-2.5 rounded-full bg-gold/20 border border-gold/40 text-gold font-semibold text-xs uppercase tracking-wider hover:bg-gold/30"
                      >
                        Browse Menu
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-forest-900/40 border border-gold/15 flex items-center justify-between gap-3"
                        >
                          {/* Item Thumbnail */}
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=150&q=80'}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover border border-gold/20 flex-shrink-0"
                          />

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-semibold text-cream truncate">
                              {item.name}
                            </h5>
                            <span className="text-xs text-gold font-serif font-bold">
                              ₹{item.price} each
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center border border-gold/30 rounded-lg bg-forest-950/60 overflow-hidden">
                              <button
                                onClick={() => updateQty(item.id, item.qty - 1)}
                                className="px-2 py-1 text-cream hover:bg-forest-800 text-xs"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-gold">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, item.qty + 1)}
                                className="px-2 py-1 text-cream hover:bg-forest-800 text-xs"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-cream/40 hover:text-red-400 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Minimum Order Hint */}
                      {subtotal < minOrder && (
                        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
                          <span>Min. order ₹{minOrder}</span>
                          <span className="font-semibold">Add ₹{minOrder - subtotal} more</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: CHECKOUT FORM */}
              {step === 'checkout' && (
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                  {/* Order Type Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                      {t.cart.orderType}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'delivery', label: 'Delivery', icon: Bike },
                        { id: 'pickup', label: 'Takeaway', icon: Store },
                        { id: 'dine-in', label: 'Dine-In', icon: UtensilsCrossed },
                      ].map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            type="button"
                            key={type.id}
                            onClick={() => setFormData({ ...formData, order_type: type.id })}
                            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                              formData.order_type === type.id
                                ? 'bg-gold/20 border-gold text-gold shadow-md'
                                : 'bg-forest-900/60 border-gold/20 text-cream/70 hover:border-gold/40'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* Delivery Address if delivery */}
                  {formData.order_type === 'delivery' && (
                    <div>
                      <label className="block text-xs font-medium text-cream/80 mb-1">
                        Delivery Address in Rajkot *
                      </label>
                      <textarea
                        name="address"
                        required
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Flat / Society / Landmark, Kalawad Road, etc."
                        className="w-full px-3.5 py-2 rounded-xl bg-forest-900/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold resize-none"
                      />
                    </div>
                  )}

                  {/* Table Number if Dine-In */}
                  {formData.order_type === 'dine-in' && (
                    <div>
                      <label className="block text-xs font-medium text-cream/80 mb-1">
                        Table Number (if seated)
                      </label>
                      <input
                        type="text"
                        name="table_number"
                        value={formData.table_number}
                        onChange={handleInputChange}
                        placeholder="e.g. Table 4 / Patio 2"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                      />
                    </div>
                  )}

                  {/* Notes / Special Instructions */}
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Chef Notes (Spiciness, Jain, cutlery)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Less spicy, extra green salad"
                      className="w-full px-3.5 py-2 rounded-xl bg-forest-900/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                      {t.cart.paymentMethod}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['UPI', 'COD'].map((method) => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setFormData({ ...formData, payment_method: method })}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            formData.payment_method === method
                              ? 'bg-gold/20 border-gold text-gold shadow-md'
                              : 'bg-forest-900/60 border-gold/20 text-cream/70 hover:border-gold/40'
                          }`}
                        >
                          {method === 'UPI' ? '⚡ UPI / QR Scan' : '💵 Cash on Delivery'}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 3: SUCCESS CONFIRMATION */}
              {step === 'success' && completedOrder && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <h4 className="font-serif text-2xl font-bold text-cream mb-1">
                    Order Received!
                  </h4>
                  <p className="text-xs text-cream/70 mb-5">
                    Our master kitchen has received your order and started preparation.
                  </p>

                  {/* Order Number Card */}
                  <div className="p-4 rounded-xl bg-forest-900 border border-gold/30 mb-6">
                    <span className="text-[11px] text-gold uppercase tracking-widest block mb-1">
                      Your Order Number
                    </span>
                    <span className="font-serif text-3xl font-bold text-gold-gradient tracking-wider">
                      {completedOrder.order_number}
                    </span>
                    <div className="mt-2 pt-2 border-t border-gold/15 flex justify-between text-xs text-cream/80">
                      <span>Total Amount:</span>
                      <span className="font-bold text-gold">₹{completedOrder.total}</span>
                    </div>
                  </div>

                  {/* WhatsApp Deep Link Button */}
                  <a
                    href={getWhatsAppOrderLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg mb-3"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Order on WhatsApp</span>
                  </a>

                  {/* Track Order CTA */}
                  <button
                    onClick={() => {
                      resetDrawer();
                      onOpenTrackOrder(completedOrder.order_number, completedOrder.phone);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-gold/40 text-gold font-semibold text-xs uppercase tracking-wider hover:bg-gold/10 transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>Track Live Status</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer Calculation & Action Buttons */}
            {step !== 'success' && items.length > 0 && (
              <div className="p-5 border-t border-gold/20 bg-forest-900/80 backdrop-blur-md">
                {/* Summary numbers */}
                <div className="space-y-1.5 text-xs text-cream/80 mb-4">
                  <div className="flex justify-between">
                    <span>{t.cart.subtotal}:</span>
                    <span className="font-medium text-cream">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.cart.deliveryFee}:</span>
                    <span className="font-medium text-cream">
                      {formData.order_type === 'delivery' ? `₹${deliveryCharge}` : 'FREE (Pickup)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gold pt-2 border-t border-gold/20">
                    <span>{t.cart.total}:</span>
                    <span className="font-serif text-lg">
                      ₹{formData.order_type === 'delivery' ? total : subtotal}
                    </span>
                  </div>
                </div>

                {/* Submit / Proceed buttons */}
                {step === 'cart' ? (
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 rounded-xl bg-gold-gradient text-forest-950 font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-[0_0_20px_rgba(212,162,76,0.4)] transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{t.cart.checkout}</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('cart')}
                      className="px-4 py-3 rounded-xl border border-gold/30 text-cream/80 text-xs font-semibold hover:border-gold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      form="checkout-form"
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-gold-gradient text-forest-950 font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-[0_0_20px_rgba(212,162,76,0.4)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Processing Order...</span>
                      ) : (
                        <span>{t.cart.placeOrder}</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
