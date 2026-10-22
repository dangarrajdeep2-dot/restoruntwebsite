import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Armchair,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
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

  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  const tableOptions = [
    { id: 'T-01', type: '2-seater', name: 'Couple Table 1', capacity: 2, zone: 'Window Garden' },
    { id: 'T-02', type: '2-seater', name: 'Couple Table 2', capacity: 2, zone: 'Window Garden' },
    { id: 'T-04', type: '4-seater', name: 'Courtyard Table 4', capacity: 4, zone: 'Main Hall' },
    { id: 'T-05', type: '4-seater', name: 'Courtyard Table 5', capacity: 4, zone: 'Main Hall' },
    { id: 'T-07', type: '6-seater', name: 'Family Table 7', capacity: 6, zone: 'Veranda Lawn' },
    { id: 'T-08', type: '6-seater', name: 'Family Table 8', capacity: 6, zone: 'Veranda Lawn' },
    { id: 'T-09', type: 'family-booth', name: 'Royal VIP Booth 9', capacity: 8, zone: 'Private Enclosure' },
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
        particleCount: 80,
        spread: 70,
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
    <section id="reservation" className="relative py-16 sm:py-24 bg-forest-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-900 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Table Booking</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-cream mb-2 sm:mb-3">
            {t.reservation.title}
          </h2>
          <p className="text-xs sm:text-base text-cream/70 font-light">
            Select your preferred seating zone and reserve your royal dining experience
          </p>
        </div>

        {/* Success Modal / State */}
        <AnimatePresence>
          {successBooking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-forest-900 border-2 border-gold/60 shadow-2xl text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-cream mb-2">
                Table Reserved Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-cream/80 max-w-md mx-auto mb-6">
                Thank you, <strong className="text-gold">{successBooking.name}</strong>. Your royal table has been recorded. Our host will keep welcome drinks ready.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-forest-950 border border-gold/20 mb-6 text-xs text-cream/80">
                <div>
                  <span className="text-cream/50 block text-[10px]">Date</span>
                  <span className="font-semibold text-gold">{successBooking.date}</span>
                </div>
                <div>
                  <span className="text-cream/50 block text-[10px]">Time</span>
                  <span className="font-semibold text-gold">{successBooking.time}</span>
                </div>
                <div>
                  <span className="text-cream/50 block text-[10px]">Table</span>
                  <span className="font-semibold text-gold">{formData.table_number}</span>
                </div>
                <div>
                  <span className="text-cream/50 block text-[10px]">Guests</span>
                  <span className="font-semibold text-gold">{successBooking.guests} People</span>
                </div>
              </div>

              <button
                onClick={() => setSuccessBooking(null)}
                className="px-6 py-2.5 rounded-full bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Book Another Table
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Layout: Table Selection + Reservation Form */}
        {!successBooking && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Table Selection Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-cream flex items-center space-x-2">
                  <Armchair className="w-4 h-4 text-gold" />
                  <span>Select Table & Seating Zone</span>
                </h3>
                {selectedTable && (
                  <span className="text-[11px] font-bold text-gold px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30">
                    Selected: {selectedTable.id}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2.5">
                {tableOptions.map((table) => {
                  const isSelected = selectedTable?.id === table.id;
                  return (
                    <button
                      type="button"
                      key={table.id}
                      onClick={() => handleTableSelect(table)}
                      className={`w-full p-2.5 sm:p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-gold/20 border-gold shadow-md ring-1 ring-gold'
                          : 'bg-forest-900/60 border-gold/20 hover:border-gold/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isSelected ? 'bg-gold text-forest-950' : 'bg-forest-950 text-gold border border-gold/30'
                        }`}>
                          {table.id}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-bold text-cream truncate">
                            {table.name}
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-cream/60 block truncate">
                            {table.capacity} guests • {table.zone}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gold text-forest-950 flex items-center justify-center flex-shrink-0 ml-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Form (7 cols) */}
            <div className="lg:col-span-7 bg-forest-900/60 backdrop-blur-md border border-gold/25 rounded-2xl p-5 sm:p-7 shadow-xl">
              <h3 className="font-serif text-lg font-bold text-cream mb-4">
                Guest Reservation Details
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
                    </select>
                  </div>
                </div>

                {/* Guests & Occasion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Guests Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Occasion
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold"
                    >
                      <option value="family_dinner">Family Dinner</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="casual">Casual Dining</option>
                    </select>
                  </div>
                </div>

                {/* Special Request */}
                <div>
                  <label className="block text-xs font-medium text-cream/80 mb-1">
                    Special Requests (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.special_request}
                    onChange={(e) => setFormData({ ...formData, special_request: e.target.value })}
                    placeholder="e.g. Garden corner view, high-chair needed"
                    className="w-full px-3.5 py-2 rounded-xl bg-forest-950/80 border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Live Availability Status */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={checkingAvailability}
                    className="text-gold underline hover:text-gold-light"
                  >
                    {checkingAvailability ? 'Checking tables...' : 'Check live table status'}
                  </button>

                  {availabilityStatus && (
                    <span className="font-semibold text-emerald-400">
                      ✓ {availabilityStatus.remaining_tables} table(s) available
                    </span>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-gold/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>{loading ? 'Confirming Reservation...' : t.reservation.submit}</span>
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
