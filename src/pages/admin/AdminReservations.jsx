import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Phone, 
  MessageCircle, 
  Check, 
  X, 
  Clock, 
  Users, 
  Search,
  Filter
} from 'lucide-react';
import { getReservations, updateReservationStatus } from '../../api/reservations';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data } = await getReservations();
      if (data) setReservations(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateReservationStatus(id, status);
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const filtered = reservations.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.name?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.table_type?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guest name or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900 border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex space-x-2">
          {['all', 'pending', 'confirmed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-gold text-forest-950 font-bold'
                  : 'bg-forest-900 border border-gold/20 text-cream/70 hover:border-gold/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-forest-950 border-b border-gold/20 text-gold uppercase tracking-wider">
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Party Size</th>
                <th className="py-3 px-4">Table / Occasion</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-cream/50">
                    No reservations recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-forest-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-cream">{res.name}</div>
                      <div className="text-[11px] text-cream/60 font-mono">{res.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-cream font-medium">{res.date}</div>
                      <div className="text-[11px] text-gold">{res.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-cream">{res.guests} Guests</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-cream capitalize">{res.table_type}</div>
                      <div className="text-[11px] text-cream/60 capitalize">{res.occasion || 'Casual'}</div>
                      {res.special_request && (
                        <div className="text-[10px] text-gold/80 italic mt-0.5">"{res.special_request}"</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={res.status}
                        onChange={(e) => handleStatusChange(res.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase focus:outline-none bg-forest-950 ${
                          res.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : res.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-gold/20 text-gold border-gold/30'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={`tel:${res.phone}`}
                          className="p-2 rounded-lg bg-forest-950 border border-gold/30 text-gold hover:bg-gold hover:text-forest-950 transition-colors"
                          title="Call Guest"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(res.name)},%20your%20table%20reservation%20at%20Nandanvan%20Restaurant%20for%20${res.date}%20at%20${res.time}%20is%20${res.status}!`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-emerald-600/80 border border-emerald-400 text-white hover:bg-emerald-500 transition-colors"
                          title="WhatsApp Guest"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
