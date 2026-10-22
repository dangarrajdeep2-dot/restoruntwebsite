import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  X,
  Phone,
  FileText,
  Copy,
  Check,
  QrCode,
  Send,
  Sparkles
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../api/orders';
import { getSettings } from '../../api/settings';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // WhatsApp Billing State inside Admin Modal
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [billSentSuccess, setBillSentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [ordRes, setRes] = await Promise.all([
        getOrders(),
        getSettings()
      ]);
      if (ordRes.data) setOrders(ordRes.data);
      if (setRes.data) setSettings(setRes.data);
      setLoading(false);
    }
    loadData();
  }, []);

  // When selected order changes, initialize whatsapp phone
  useEffect(() => {
    if (selectedOrder) {
      setWhatsappPhone(selectedOrder.phone || '');
      setBillSentSuccess(false);
      setCopied(false);
    }
  }, [selectedOrder]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = ord.order_number?.toLowerCase().includes(q);
        const matchName = ord.customer_name?.toLowerCase().includes(q);
        const matchPhone = ord.phone?.includes(q);
        if (!matchNum && !matchName && !matchPhone) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handlePrintBill = () => {
    window.print();
  };

  const gstRate = settings?.gst_rate ?? 5;
  const upiId = settings?.upi_id || 'nandanvan@oksbi';
  const upiName = settings?.upi_name || 'Nandanvan Multicuisine Restaurant';
  const restaurantName = settings?.restaurant_name || 'Nandanvan Multicuisine Restaurant';
  const restaurantPhone = settings?.phone || '+91 98250 84721';
  const restaurantAddress = settings?.address || 'Near Munjka, Kalawad Road, Rajkot, Gujarat';

  const calculateOrderTotals = (order) => {
    if (!order) return { subtotal: 0, gst: 0, delivery: 0, total: 0 };
    const items = order.items || order.order_items || [];
    const subtotal = order.subtotal || items.reduce((sum, it) => sum + (it.price * it.qty), 0);
    const gst = Math.round(subtotal * (gstRate / 100));
    const delivery = Number(order.delivery_charge || 0);
    const total = order.total || (subtotal + gst + delivery);
    return { subtotal, gst, delivery, total };
  };

  const getDynamicUpiUri = (order) => {
    if (!order) return '';
    const { total } = calculateOrderTotals(order);
    const note = `${order.order_type === 'dine-in' ? `Table ${order.table_number || ''}` : 'Order'} #${order.order_number}`;
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  const getUpiQrImageUrl = (order) => {
    const upiUri = getDynamicUpiUri(order);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}`;
  };

  const generateBillMessage = (order) => {
    if (!order) return '';
    const { subtotal, gst, delivery, total } = calculateOrderTotals(order);
    const upiUri = getDynamicUpiUri(order);
    const items = order.items || order.order_items || [];
    
    const itemsText = items.map((it, idx) => {
      const roundTag = it.round && it.round > 1 ? ` [R${it.round}]` : '';
      return `${idx + 1}. ${it.name}${roundTag} x${it.qty} = ₹${it.price * it.qty}`;
    }).join('\n');

    const dateStr = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN');
    const timeStr = new Date(order.created_at || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    return `🍽️ *${restaurantName.toUpperCase()}*
📍 ${restaurantAddress}
📞 ${restaurantPhone}
──────────────────────
🧾 *TAX INVOICE / BILL*
📋 Order #: ${order.order_number}
📅 Date: ${dateStr} | ⏰ ${timeStr}
👤 Customer: ${order.customer_name || 'Guest'}
📍 Type: ${order.order_type === 'dine-in' ? `Table #${order.table_number || '1'} (Dine-In)` : (order.order_type || 'Order').toUpperCase()}
${order.waiter_name ? `👨‍🍳 Captain: ${order.waiter_name}\n` : ''}──────────────────────
*ITEMS ORDERED:*
${itemsText}
──────────────────────
Subtotal: ₹${subtotal}
GST (${gstRate}%): ₹${gst}
${delivery > 0 ? `Delivery Charges: ₹${delivery}\n` : ''}*GRAND TOTAL: ₹${total}*
──────────────────────
💳 *Pay via UPI (GPay/PhonePe/Paytm):*
${upiUri}
(UPI ID: ${upiId})

🙏 *Thank you for dining with us at ${restaurantName}! We hope you had a delightful experience and look forward to serving you again soon.* ✨`;
  };

  const handleSendWhatsApp = () => {
    if (!selectedOrder) return;
    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number for WhatsApp');
      return;
    }
    const message = generateBillMessage(selectedOrder);
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setBillSentSuccess(true);
  };

  const handleCopyBill = () => {
    if (!selectedOrder) return;
    const message = generateBillMessage(selectedOrder);
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'preparing': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'out-for-delivery': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gold/20 text-gold border-gold/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Name, Phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900 border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'preparing', label: 'Preparing' },
            { id: 'out-for-delivery', label: 'On Route' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-gold text-forest-950 font-bold shadow-md'
                  : 'bg-forest-900/60 border border-gold/20 text-cream/70 hover:border-gold/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-forest-950 border-b border-gold/20 text-gold uppercase tracking-wider">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cream/50">
                    No orders found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-forest-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gold">
                      {ord.order_number}
                    </td>
                    <td className="py-3 px-4 font-semibold text-cream">
                      {ord.customer_name}
                    </td>
                    <td className="py-3 px-4 text-cream/70 font-mono">
                      {ord.phone}
                    </td>
                    <td className="py-3 px-4 capitalize text-cream/80">
                      {ord.order_type}
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-gold">
                      ₹{ord.total}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusUpdate(ord.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase focus:outline-none bg-forest-950 ${getStatusColor(
                          ord.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg bg-forest-950 border border-gold/30 text-gold hover:bg-gold hover:text-forest-950 transition-colors"
                        title="View Order Details & Print Bill"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Printable Bill Modal */}
      {selectedOrder && (() => {
        const { subtotal, gst, delivery, total } = calculateOrderTotals(selectedOrder);
        const upiUri = getDynamicUpiUri(selectedOrder);
        const items = selectedOrder.items || selectedOrder.order_items || [];
        const isDineIn = selectedOrder.order_type === 'dine-in' || selectedOrder.table_number;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-forest-950/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg bg-forest-900 border border-gold/40 rounded-3xl p-5 sm:p-7 shadow-2xl printable-area my-auto">
              {/* Close Button (Hidden on Print) */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-forest-950/80 border border-gold/30 hover:bg-forest-800 text-cream/70 hover:text-gold no-print transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Bill Header */}
              <div className="text-center pb-4 border-b border-gold/25 mb-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-bold uppercase mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Official Tax Invoice & Receipt</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-gold tracking-tight">
                  NANDANVAN
                </h3>
                <p className="text-[11px] text-cream/70 uppercase tracking-widest font-semibold mt-0.5">
                  Multicuisine Restaurant • Rajkot
                </p>
                <p className="text-[10px] text-cream/50 mt-0.5">
                  Near Munjka, Kalawad Road • 📞 +91 98250 84721
                </p>
              </div>

              {/* Order Metadata Box */}
              <div className="grid grid-cols-2 gap-2 text-xs text-cream/80 mb-4 bg-forest-950/60 p-3 rounded-xl border border-gold/15">
                <div>
                  <span className="text-cream/50 block text-[10px] uppercase">Order Number</span>
                  <span className="font-mono font-bold text-gold text-sm">{selectedOrder.order_number}</span>
                </div>
                <div className="text-right">
                  <span className="text-cream/50 block text-[10px] uppercase">Date & Time</span>
                  <span className="font-mono text-[11px] text-cream">
                    {new Date(selectedOrder.created_at || Date.now()).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-cream/50 block text-[10px] uppercase">Customer</span>
                  <span className="font-bold text-cream">{selectedOrder.customer_name || 'Guest'}</span>
                  <span className="text-[11px] text-cream/60 block font-mono">{selectedOrder.phone || 'N/A'}</span>
                </div>
                <div className="text-right">
                  <span className="text-cream/50 block text-[10px] uppercase">Mode / Table</span>
                  <span className="font-bold text-gold capitalize text-xs">
                    {isDineIn ? `Table #${selectedOrder.table_number || '1'} (Dine-In)` : (selectedOrder.order_type || 'Takeaway')}
                  </span>
                  {selectedOrder.waiter_name && (
                    <span className="text-[10px] text-cream/50 block">Captain: {selectedOrder.waiter_name}</span>
                  )}
                </div>
              </div>

              {selectedOrder.address && (
                <div className="p-2.5 rounded-xl bg-forest-950/60 border border-gold/15 text-xs text-cream/80 mb-4">
                  <span className="text-cream/50 block text-[10px] uppercase">Delivery Address:</span>
                  <span>{selectedOrder.address}</span>
                </div>
              )}

              {/* Itemized Dishes Breakdown */}
              <div className="mb-4">
                <div className="flex justify-between items-center pb-1.5 border-b border-gold/20 text-[10px] font-bold text-gold uppercase tracking-wider">
                  <span>Item Details</span>
                  <span>Amount</span>
                </div>
                <div className="divide-y divide-forest-800/80 max-h-48 overflow-y-auto">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 text-xs text-cream/90">
                      <div className="flex items-center space-x-1.5">
                        <span>{item.name}</span>
                        <span className="font-bold text-gold">×{item.qty}</span>
                        {item.round && item.round > 1 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-saffron/20 border border-saffron/30 text-saffron font-bold">
                            R{item.round}
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-semibold">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal, GST, Delivery & Grand Total */}
              <div className="pt-2 border-t border-gold/25 space-y-1 text-xs text-cream/80 mb-4 bg-forest-950/40 p-3 rounded-xl border border-gold/15">
                <div className="flex justify-between text-cream/70">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-cream/70">
                  <span>GST ({gstRate}%):</span>
                  <span className="font-mono">₹{gst}</span>
                </div>
                {delivery > 0 && (
                  <div className="flex justify-between text-cream/70">
                    <span>Delivery Fee:</span>
                    <span className="font-mono">₹{delivery}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif font-black text-gold pt-2 border-t border-gold/20">
                  <span>GRAND TOTAL:</span>
                  <span className="font-mono">₹{total}</span>
                </div>
              </div>

              {/* Dynamic UPI QR Code (Renders in print/PDF too!) */}
              <div className="py-3 px-4 rounded-2xl bg-forest-950 border border-gold/30 flex items-center justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Instant UPI Payment QR
                  </span>
                  <p className="text-[11px] text-cream/70">
                    Scan with GPay / PhonePe / Paytm / BHIM
                  </p>
                  <p className="text-[10px] font-mono text-cream/50 mt-1">
                    UPI ID: <strong className="text-gold">{upiId}</strong>
                  </p>
                </div>
                <div className="p-1.5 bg-white rounded-xl shadow-md flex-shrink-0">
                  <img
                    src={getUpiQrImageUrl(selectedOrder)}
                    alt="UPI QR Code"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                  />
                </div>
              </div>

              {/* Automated WhatsApp Bill Sending Box (Hidden on Print) */}
              <div className="no-print p-4 rounded-2xl bg-forest-950 border-2 border-emerald-500/40 shadow-xl space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <MessageCircle className="w-4 h-4 fill-emerald-500 text-forest-950" />
                    <span>Send Automated WhatsApp Bill</span>
                  </span>
                  <span className="text-[10px] text-cream/60">Direct to Customer</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-2 rounded-xl bg-forest-900 border border-gold/30 text-gold font-bold text-xs">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit WhatsApp Number"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-forest-900 border border-gold/30 text-xs text-cream font-mono font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {billSentSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-[11px] flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>WhatsApp bill with UPI link generated and opened successfully!</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Bill 💬</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyBill}
                    className="px-3.5 py-2.5 rounded-xl bg-forest-900 border border-gold/30 text-gold hover:bg-gold/15 text-xs font-semibold flex items-center space-x-1 transition-all"
                    title="Copy full itemized bill text to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Actions: Print PDF & Close (Hidden on Print) */}
              <div className="flex items-center gap-3 no-print">
                <button
                  onClick={handlePrintBill}
                  className="flex-1 py-3 rounded-xl bg-gold-gradient text-forest-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-gold/30 active:scale-95 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Bill / Save PDF 📄</span>
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-3 rounded-xl bg-forest-950 border border-gold/30 text-cream/80 hover:text-gold text-xs font-bold uppercase transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
