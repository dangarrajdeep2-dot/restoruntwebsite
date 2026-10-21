import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Grid
} from 'lucide-react';
import confetti from 'canvas-confetti';
import DiningRoom3D from '../three/DiningRoom3D';
import { checkTableAvailability, createReservation } from '../api/reservations';
import { useLanguage } from '../context/LanguageContext';

export default function ReservationSection() {
  const { t } = useLanguage();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: defaultDate,
    time: '19:30',
    guests: 4,
    occasion: 'family_dinner',
    table_type: '4-seater',
    table_number: 'T-04',
    special_request: '',
  });

  const [selectedTable, setSelectedTable] = useState({
    id: 'T-04',
    type: '4-seater',
    name: 'Courtyard Table 4',
    capacity: 4,
  });

  const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d'
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  const tableOptions = [
    { id: 'T-01', type: '2-seater', name: 'Intimate Table 1 (2 guests)', capacity: 2 },
    { id: 'T-02', type: '2-seater', name: 'Intimate Table 2 (2 guests)', capacity: 2 },
    { id: 'T-03', type: '2-seater', name: 'Intimate Table 3 (2 guests)', capacity: 2 },
    { id: 'T-04', type: '4-seater', name: 'Courtyard Table 4 (4 guests)', capacity: 4 },
    { id: 'T-05', type: '4-seater', name: 'Courtyard Table 5 (4 guests)', capacity: 4 },
    { id: 'T-06', type: '4-seater', name: 'Courtyard Table 6 (4 guests)', capacity: 4 },
    { id: 'T-07', type: '6-seater', name: 'Family Table 7 (6 guests)', capacity: 6 },
    { id: 'T-08', type: '6-seater', name: 'Family Table 8 (6 guests)', capacity: 6 },
    { id: 'T-09', type: 'family-booth', name: 'Royal VIP Booth 9 (8 guests)', capacity: 8 },
  ];

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setFormData((prev) => ({
      ...prev,
      table_type: table.type,
      table_number: table.id,
      guests: Math.min(prev.guests, table.capacity || 4),
    }));
  };

  const handleCheckAvailability = async () => {
    setCheckingAvailability(true);
    setErrorMsg('');
    try {
      const { data, error } = await checkTableAvailability(
        formData.date,
        formData.time,
        formData.table_type
      );
      if (error) throw error;
      setAvailabilityStatus(data);
    } catch (err) {
      setErrorMsg(err.message || 'Could not verify table availability.');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.name.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await createReservation(formData);
      if (error) throw error;

      setSuccessBooking(data || formData);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4A24C', '#E8782A', '#0E2A1F'],
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete reservation. Please try another time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reservation" className="relative py-24 bg-forest-950 overflow-hidden">
      {/* Decorative ambiance */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-forest-900 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Table Reservation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream mb-4">
            {t.reservation.title}
          </h2>
          <p className="text-sm sm:text-base text-cream/70 font-light">
            {t.reservation.subtitle}
          </p>
        </div>

        {/* Success Modal / State */}
        <AnimatePresence>
          {successBooking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-12 max-w-2xl mx-auto p-8 rounded-2xl bg-forest-900 border-2 border-gold/60 shadow-[0_0_40px_rgba(212,162,76,0.3)] text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-cream mb-2">
                Table Reserved Successfully!
              </h3>
              <p className="text-sm text-cream/80 max-w-md mx-auto mb-6">
                Thank you, <strong className="text-gold">{successBooking.name}</strong>. Your royal table has been recorded. Our host will keep welcome drinks ready for your arrival.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-forest-950 border border-gold/20 mb-6 text-xs text-cream/80">
                <div>
                  <span className="text-cream/50 block">Date</span>
                  <span className="font-semibold text-gold">{successBooking.date}</span>
                </div>
                <div>
                  <span className="text-cream/50 block">Time</span>
                  <span className="font-semibold text-gold">{successBooking.time}</span>
                </div>
                <div>
                  <span className="text-cream/50 block">Table</span>
                  <span className="font-semibold text-gold">{formData.table_number} ({formData.table_type})</span>
                </div>
                <div>
                  <span className="text-cream/50 block">Party Size</span>
                  <span className="font-semibold text-gold">{successBooking.guests} Guests</span>
                </div>
              </div>

              <button
                onClick={() => setSuccessBooking(null)}
                className="px-6 py-2.5 rounded-full bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-gold/30"
              >
                Book Another Table
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid: Form on Left (5 cols), 3D Floorplan on Right (7 cols) */}
        {!successBooking && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-forest-900/60 backdrop-blur-md border border-gold/25 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <h3 className="font-serif text-xl font-bold text-cream mb-4 flex items-center justify-between">
                <span>Guest Details</span>
                {selectedTable && (
                  <span className="text-xs font-sans px-2.5 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
                    Selected: {selectedTable.id}
                  </span>
                )}
              </h3>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-cream/80 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikramaditya Jadeja"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Reservation Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Preferred Time *
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold"
                    >
                      <option value="12:00">12:00 PM (Lunch)</option>
                      <option value="12:45">12:45 PM (Lunch)</option>
                      <option value="13:30">01:30 PM (Lunch)</option>
                      <option value="19:00">07:00 PM (Dinner)</option>
                      <option value="19:30">07:30 PM (Dinner)</option>
                      <option value="20:15">08:15 PM (Dinner)</option>
                      <option value="21:00">09:00 PM (Dinner)</option>
                      <option value="21:45">09:45 PM (Dinner)</option>
                    </select>
                  </div>
                </div>

                {/* Guests & Occasion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Guests (1 to 20)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Occasion
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold"
                    >
                      <option value="family_dinner">Family Dinner</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="date_night">Date Night</option>
                      <option value="business">Business Meet</option>
                      <option value="casual">Casual Dining</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-xs font-medium text-cream/80 mb-1">
                    Special Requests (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.special_request}
                    onChange={(e) => setFormData({ ...formData, special_request: e.target.value })}
                    placeholder="e.g. Garden corner view, high-chair needed"
                    className="w-full px-3.5 py-2 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Live Availability Status */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={checkingAvailability}
                    className="text-xs text-gold underline hover:text-gold-light"
                  >
                    {checkingAvailability ? 'Checking tables...' : 'Check live table status'}
                  </button>

                  {availabilityStatus && (
                    <span className="text-xs font-semibold text-emerald-400">
                      ✓ {availabilityStatus.remaining_tables} table(s) available
                    </span>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-sm tracking-wider uppercase shadow-[0_4px_25px_rgba(212,162,76,0.3)] hover:shadow-[0_6px_30px_rgba(212,162,76,0.5)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>{loading ? 'Confirming Reservation...' : t.reservation.submit}</span>
                </button>
              </form>
            </motion.div>

            {/* Right: 3D Floorplan & 2D Fallback Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 flex flex-col space-y-4"
            >
              {/* Header with 3D / 2D Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-cream">
                    Virtual Dining Hall Layout
                  </h4>
                  <p className="text-xs text-cream/60">
                    Click any table to reserve. Selected table glows in gold.
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-forest-900 border border-gold/20">
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                      viewMode === '3d'
                        ? 'bg-gold text-forest-950 font-bold'
                        : 'text-cream/70 hover:text-gold'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>3D Hall</span>
                  </button>
                  <button
                    onClick={() => setViewMode('2d')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                      viewMode === '2d'
                        ? 'bg-gold text-forest-950 font-bold'
                        : 'text-cream/70 hover:text-gold'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>2D Grid</span>
                  </button>
                </div>
              </div>

              {/* 3D Scene View */}
              {viewMode === '3d' ? (
                <DiningRoom3D
                  selectedTable={selectedTable}
                  onSelectTable={handleTableSelect}
                />
              ) : (
                /* 2D Grid Fallback */
                <div className="p-6 rounded-2xl bg-forest-900/60 border border-gold/30 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {tableOptions.map((table) => {
                    const isSelected = selectedTable?.id === table.id;
                    return (
                      <button
                        type="button"
                        key={table.id}
                        onClick={() => handleTableSelect(table)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-gold/25 border-gold shadow-lg shadow-gold/20 ring-1 ring-gold'
                            : 'bg-forest-950/80 border-gold/20 hover:border-gold/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif font-bold text-cream text-sm">
                            {table.id}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-gold">
                            {table.capacity} Seats
                          </span>
                        </div>
                        <span className="text-xs text-cream/70 block">
                          {table.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Table details bar */}
              <div className="p-4 rounded-xl bg-forest-900/80 border border-gold/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-gold shadow-[0_0_8px_#D4A24C]" />
                    <span className="text-cream/90 font-medium">Selected Table</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-forest-600" />
                    <span className="text-cream/70">Available Table</span>
                  </div>
                </div>

                {selectedTable && (
                  <div className="text-gold font-medium">
                    Table {selectedTable.id} • Ideal for {selectedTable.capacity} guests
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        )}

      </div>
    </section>
  );
}
