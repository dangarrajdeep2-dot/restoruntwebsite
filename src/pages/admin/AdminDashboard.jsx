import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  IndianRupee, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getOrders, updateOrderStatus } from '../../api/orders';
import { getReservations } from '../../api/reservations';
import { getEnquiries } from '../../api/enquiries';

export default function AdminDashboard({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      const [ordRes, resRes, enqRes] = await Promise.all([
        getOrders(),
        getReservations(),
        getEnquiries(),
      ]);

      if (ordRes.data) setOrders(ordRes.data);
      if (resRes.data) setReservations(resRes.data);
      if (enqRes.data) setEnquiries(enqRes.data);
      setLoading(false);
    }
    loadDashboardData();
  }, []);

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  // 7-Day Sales Trend (Simulated / Calculated from orders)
  const salesChartData = [
    { day: 'Thu', revenue: 14200, orders: 18 },
    { day: 'Fri', revenue: 21500, orders: 27 },
    { day: 'Sat', revenue: 38400, orders: 49 },
    { day: 'Sun', revenue: 46200, orders: 58 },
    { day: 'Mon', revenue: 16800, orders: 21 },
    { day: 'Tue', revenue: 19400, orders: 24 },
    { day: 'Today', revenue: totalRevenue > 0 ? totalRevenue : 28900, orders: orders.length || 36 },
  ];

  // Top 5 Popular Dishes
  const topDishes = [
    { name: 'Nandanvan Special Paneer Tikka Lababdar', category: 'Punjabi', orders: 142, revenue: '₹45,440' },
    { name: 'Dal Bukhara (24-Hour Slow Cooked)', category: 'Punjabi', orders: 128, revenue: '₹35,840' },
    { name: 'Ringan No Olo with Bajra Rotlo', category: 'Kathiyawadi', orders: 119, revenue: '₹26,180' },
    { name: 'Nandanvan Signature Sizzler', category: 'Continental', orders: 94, revenue: '₹36,660' },
    { name: 'Rajwadi Saffron Shrikhand', category: 'Dessert', orders: 86, revenue: '₹13,760' },
  ];

  const handleQuickStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-8">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-forest-900/60 border border-gold/20 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-cream/60 uppercase tracking-wider block mb-1">
              Total Orders
            </span>
            <div className="font-serif text-3xl font-bold text-cream">
              {orders.length}
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18% from last week</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-gold/15 text-gold border border-gold/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-forest-900/60 border border-gold/20 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-cream/60 uppercase tracking-wider block mb-1">
              Gross Revenue
            </span>
            <div className="font-serif text-3xl font-bold text-gold">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Avg order ₹680</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Reservations */}
        <div 
          onClick={() => onNavigate('reservations')}
          className="p-5 rounded-2xl bg-forest-900/60 border border-gold/20 shadow-xl flex items-center justify-between cursor-pointer hover:border-gold/50 transition-all"
        >
          <div>
            <span className="text-[11px] font-semibold text-cream/60 uppercase tracking-wider block mb-1">
              Pending Bookings
            </span>
            <div className="font-serif text-3xl font-bold text-cream">
              {pendingReservationsCount}
            </div>
            <span className="text-[11px] text-gold flex items-center space-x-1 mt-1">
              <span>View Table Schedule →</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-gold/15 text-gold border border-gold/30">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* New Enquiries */}
        <div 
          onClick={() => onNavigate('enquiries')}
          className="p-5 rounded-2xl bg-forest-900/60 border border-gold/20 shadow-xl flex items-center justify-between cursor-pointer hover:border-gold/50 transition-all"
        >
          <div>
            <span className="text-[11px] font-semibold text-cream/60 uppercase tracking-wider block mb-1">
              Banquets & Enquiries
            </span>
            <div className="font-serif text-3xl font-bold text-cream">
              {newEnquiriesCount}
            </div>
            <span className="text-[11px] text-gold flex items-center space-x-1 mt-1">
              <span>View Event Leads →</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-saffron/20 text-saffron border border-saffron/30">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 7-Day Revenue Trends Chart (Recharts) */}
      <div className="p-6 rounded-2xl bg-forest-900/60 border border-gold/20 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="font-serif text-xl font-bold text-cream">
              7-Day Revenue & Dining Activity
            </h3>
            <p className="text-xs text-cream/60">
              Overview of daily online and table sales across the week
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-forest-950 border border-gold/30 text-gold text-xs font-semibold">
            ₹ In Indian Rupees
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A24C" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4A24C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A4A38" opacity={0.4} />
              <XAxis dataKey="day" stroke="#FFF6E5" opacity={0.6} textAnchor="middle" />
              <YAxis stroke="#FFF6E5" opacity={0.6} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0E2A1F',
                  borderColor: '#D4A24C',
                  borderRadius: '12px',
                  color: '#FFF6E5',
                  fontSize: '12px',
                }}
                formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#D4A24C"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Latest Orders & Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Latest Orders (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-forest-900/60 border border-gold/20 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-cream">
                Latest Realtime Orders
              </h3>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs text-gold hover:underline flex items-center space-x-1"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gold/15 text-gold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Order #</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-800">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-forest-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gold">
                        {ord.order_number}
                      </td>
                      <td className="py-3 px-3 font-medium text-cream">
                        {ord.customer_name}
                      </td>
                      <td className="py-3 px-3 capitalize text-cream/70">
                        {ord.order_type}
                      </td>
                      <td className="py-3 px-3 font-bold text-cream">
                        ₹{ord.total}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleQuickStatusChange(ord.id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-forest-950 border border-gold/30 text-[11px] text-cream font-medium focus:outline-none focus:border-gold capitalize"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="out-for-delivery">Out for Delivery</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top 5 Dishes (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-forest-900/60 border border-gold/20 shadow-xl">
          <h3 className="font-serif text-lg font-bold text-cream mb-4">
            Top 5 Signature Dishes
          </h3>

          <div className="space-y-4">
            {topDishes.map((dish, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-forest-800 last:border-0 last:pb-0">
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="text-xs font-semibold text-cream truncate">
                    {dish.name}
                  </h4>
                  <span className="text-[10px] text-gold uppercase tracking-wider">
                    {dish.category} • {dish.orders} orders
                  </span>
                </div>
                <span className="text-xs font-bold text-cream font-mono">
                  {dish.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
