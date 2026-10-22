import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Store, Clock, Phone, IndianRupee, Bell } from 'lucide-react';
import { getSettings, updateSettings } from '../../api/settings';

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await getSettings();
      if (data) setForm(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavedSuccess(false);
    const payload = {
      ...form,
      delivery_charge: Number(form.delivery_charge),
      min_order: Number(form.min_order),
    };
    await updateSettings(payload);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (loading || !form) {
    return <div className="text-center py-12 text-cream/50">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-cream">Restaurant Settings</h3>
          <p className="text-xs text-cream/60">Configure restaurant open/closed status, hours, contact, and fees</p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 text-xs font-semibold flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Restaurant Status Card */}
        <div className="p-5 rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-cream mb-1 flex items-center space-x-2">
              <Store className="w-4 h-4 text-gold" />
              <span>Accepting Online Orders & Table Bookings</span>
            </h4>
            <p className="text-xs text-cream/60">
              When toggled off, checkout and reservations will temporarily show the restaurant is closed.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_open"
              checked={form.is_open}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-forest-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-cream after:border-gold after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Operating Timings */}
        <div className="p-5 rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl space-y-4">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Operating Hours (All 7 Days)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cream/80 font-medium mb-1">Opening Time</label>
              <input
                type="time"
                name="opening_time"
                value={form.opening_time}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-cream/80 font-medium mb-1">Closing Time</label>
              <input
                type="time"
                name="closing_time"
                value={form.closing_time}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Address */}
        <div className="p-5 rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl space-y-4">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Contact & Location</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cream/80 font-medium mb-1">Primary Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-cream/80 font-medium mb-1">WhatsApp Alert Number</label>
              <input
                type="text"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-cream/80 font-medium mb-1">Full Restaurant Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-cream/80 font-medium mb-1">Google Maps Direct Link</label>
            <input
              type="text"
              name="google_maps_url"
              value={form.google_maps_url}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream font-mono focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-cream/80 font-medium mb-1">Official Zomato Order Link</label>
            <input
              type="text"
              name="zomato_url"
              value={form.zomato_url || ''}
              onChange={handleChange}
              placeholder="https://www.zomato.com/rajkot/restaurants?q=Nandanvan"
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream font-mono focus:outline-none focus:border-gold"
            />
            <p className="text-[10px] text-cream/50 mt-1">
              Clicking "Order Online" on the website will redirect customers to this Zomato page.
            </p>
          </div>
        </div>

        {/* Pricing & Fees */}
        <div className="p-5 rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl space-y-4">
          <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center space-x-2">
            <IndianRupee className="w-4 h-4" />
            <span>Delivery & Order Limits</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cream/80 font-medium mb-1">Minimum Order Amount (₹)</label>
              <input
                type="number"
                min={0}
                name="min_order"
                value={form.min_order}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-cream/80 font-medium mb-1">Delivery Charge (₹)</label>
              <input
                type="number"
                min={0}
                name="delivery_charge"
                value={form.delivery_charge}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-cream/80 font-medium mb-1">Website Announcement Banner</label>
            <input
              type="text"
              name="announcement"
              value={form.announcement || ''}
              onChange={handleChange}
              placeholder="e.g. Welcome to Nandanvan - Enjoy Flat 15% off on dine-in this weekend!"
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
}
