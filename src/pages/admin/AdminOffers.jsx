import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Gift, Tag, Clock } from 'lucide-react';
import { getAllOffers, createOffer, updateOffer, deleteOffer } from '../../api/offers';

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    discount_text: '',
    code: '',
    valid_till: '',
    is_active: true,
    banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
  });

  const loadData = async () => {
    const { data } = await getAllOffers();
    if (data) setOffers(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      discount_text: '20% OFF',
      code: 'ROYAL20',
      valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true,
      banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (offer) => {
    setEditingId(offer.id);
    setForm({
      title: offer.title,
      description: offer.description,
      discount_text: offer.discount_text,
      code: offer.code || '',
      valid_till: offer.valid_till ? offer.valid_till.split('T')[0] : '',
      is_active: offer.is_active,
      banner_url: offer.banner_url || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo offer?')) return;
    await deleteOffer(id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const handleToggleActive = async (offer) => {
    const newActive = !offer.is_active;
    await updateOffer(offer.id, { is_active: newActive });
    setOffers((prev) =>
      prev.map((o) => (o.id === offer.id ? { ...o, is_active: newActive } : o))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      valid_till: new Date(form.valid_till).toISOString(),
    };

    if (editingId) {
      await updateOffer(editingId, payload);
    } else {
      await createOffer(payload);
    }
    setModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-cream">Offers & Promotional Codes</h3>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Offer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="p-5 rounded-2xl bg-forest-900/60 border border-gold/20 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-saffron/20 border border-saffron/40 text-saffron font-bold text-xs">
                  {offer.discount_text}
                </span>

                <div className="flex space-x-1">
                  <button
                    onClick={() => handleOpenEdit(offer)}
                    className="p-1.5 text-cream/70 hover:text-gold"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="p-1.5 text-cream/70 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-serif text-base font-bold text-cream mb-1">
                {offer.title}
              </h4>
              <p className="text-xs text-cream/70 mb-4 line-clamp-2">
                {offer.description}
              </p>

              <div className="flex items-center justify-between text-xs font-mono text-gold mb-3">
                <span>Code: {offer.code || 'None'}</span>
                <span>Till: {offer.valid_till ? offer.valid_till.split('T')[0] : 'N/A'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-forest-800 flex items-center justify-between">
              <span className="text-xs text-cream/60">Public Status:</span>
              <button
                onClick={() => handleToggleActive(offer)}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  offer.is_active
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {offer.is_active ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-forest-900 border border-gold/30 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-cream/70 hover:text-gold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-cream mb-4">
              {editingId ? 'Edit Offer' : 'Create Special Offer'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-cream/80 font-medium mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Royal Dine-in Feast"
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-cream/80 font-medium mb-1">Discount Tag *</label>
                  <input
                    type="text"
                    required
                    value={form.discount_text}
                    onChange={(e) => setForm({ ...form, discount_text: e.target.value })}
                    placeholder="20% OFF / FREE DESSERT"
                    className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-cream/80 font-medium mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. ROYAL20"
                    className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream font-mono uppercase focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">Valid Till Date *</label>
                <input
                  type="date"
                  required
                  value={form.valid_till}
                  onChange={(e) => setForm({ ...form, valid_till: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gold/30 text-cream/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold uppercase tracking-wider shadow-lg"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
