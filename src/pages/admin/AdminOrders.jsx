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
  FileText
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../api/orders';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data } = await getOrders();
      if (data) setOrders(data);
      setLoading(false);
    }
    loadData();
  }, []);

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
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-forest-900 border border-gold/30 rounded-2xl p-6 shadow-2xl printable-area">
            {/* Close */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-forest-800 text-cream/70 hover:text-gold no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Bill Header */}
            <div className="text-center pb-4 border-b border-gold/20 mb-4">
              <h3 className="font-serif text-2xl font-bold text-gold">
                NANDANVAN
              </h3>
              <p className="text-[11px] text-cream/70 uppercase tracking-widest">
                Multicuisine Restaurant • Rajkot
              </p>
              <p className="text-[10px] text-cream/50 mt-0.5">
                Near Munjka, Kalawad Road • +91 98250 84721
              </p>
            </div>

            {/* Order Metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs text-cream/80 mb-4">
              <div>
                <span className="text-cream/50 block">Order #:</span>
                <span className="font-mono font-bold text-gold">{selectedOrder.order_number}</span>
              </div>
              <div className="text-right">
                <span className="text-cream/50 block">Date & Time:</span>
                <span>{new Date(selectedOrder.created_at).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-cream/50 block">Customer:</span>
                <span className="font-bold text-cream">{selectedOrder.customer_name}</span>
                <span className="text-[11px] text-cream/70 block">{selectedOrder.phone}</span>
              </div>
              <div className="text-right">
                <span className="text-cream/50 block">Order Type / Mode:</span>
                <span className="capitalize font-semibold text-gold">{selectedOrder.order_type} ({selectedOrder.payment_method})</span>
              </div>
            </div>

            {selectedOrder.address && (
              <div className="p-2.5 rounded-lg bg-forest-950 border border-gold/15 text-xs text-cream/80 mb-4">
                <span className="text-cream/50 block">Delivery Address:</span>
                <span>{selectedOrder.address}</span>
              </div>
            )}

            {/* Items Breakdown */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold text-gold uppercase tracking-wider block">
                Dishes Ordered:
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {(selectedOrder.items || selectedOrder.order_items || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-cream/90 py-1 border-b border-forest-800">
                    <span>{item.name} × {item.qty}</span>
                    <span className="font-mono">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="pt-2 border-t border-gold/20 space-y-1 text-xs text-cream/80 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>₹{selectedOrder.delivery_charge || 0}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gold pt-2 border-t border-gold/15">
                <span>Total Amount:</span>
                <span>₹{selectedOrder.total}</span>
              </div>
            </div>

            {/* Actions (Hidden on Print) */}
            <div className="flex items-center gap-3 no-print">
              <button
                onClick={handlePrintBill}
                className="flex-1 py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill / KOT</span>
              </button>

              <a
                href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.customer_name)},%20your%20order%20%23${selectedOrder.order_number}%20at%20Nandanvan%20is%20${selectedOrder.status}.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center space-x-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
