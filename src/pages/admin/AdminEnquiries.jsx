import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Phone, 
  MessageCircle, 
  Search, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { getEnquiries, updateEnquiryStatus } from '../../api/enquiries';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data } = await getEnquiries();
      if (data) setEnquiries(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateEnquiryStatus(id, status);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const filtered = enquiries.filter(
    (e) => statusFilter === 'all' || e.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {['all', 'new', 'contacted', 'closed'].map((st) => (
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
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Message / Requirements</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cream/50">
                    No banquet enquiries recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-forest-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-cream">{enq.name}</div>
                      <div className="text-[11px] text-cream/60 font-mono">{enq.phone}</div>
                    </td>
                    <td className="py-3 px-4 capitalize font-semibold text-gold">
                      {enq.event_type}
                    </td>
                    <td className="py-3 px-4 font-medium text-cream">
                      {enq.event_date}
                    </td>
                    <td className="py-3 px-4 font-bold text-cream">
                      {enq.guests || 'N/A'}
                    </td>
                    <td className="py-3 px-4 max-w-xs text-cream/80 text-[11px] leading-relaxed">
                      {enq.message}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase focus:outline-none bg-forest-950 ${
                          enq.status === 'new'
                            ? 'bg-saffron/20 text-saffron border-saffron/40'
                            : enq.status === 'contacted'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={`tel:${enq.phone}`}
                          className="p-2 rounded-lg bg-forest-950 border border-gold/30 text-gold hover:bg-gold hover:text-forest-950"
                          title="Call Lead"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20thank%20you%20for%20your%20interest%20in%20Nandanvan%20banquets%20for%20your%20${enq.event_type}!`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-emerald-600/80 border border-emerald-400 text-white hover:bg-emerald-500"
                          title="WhatsApp Lead"
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
