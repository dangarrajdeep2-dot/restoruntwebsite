import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  GlassWater, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { submitEnquiry } from '../api/enquiries';

export default function EventsSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    event_type: 'wedding',
    event_date: '',
    guests: 150,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mobileFormOpen, setMobileFormOpen] = useState(false);

  const eventTypes = [
    { id: 'wedding', label: 'Wedding & Reception' },
    { id: 'banquet', label: 'Private Lawn Banquet' },
    { id: 'corporate', label: 'Corporate Meet / Conference' },
    { id: 'birthday', label: 'Birthday & Anniversary Bash' },
    { id: 'catering', label: 'Outdoor Live Catering in Rajkot' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.phone.length < 10) {
      setErrorMsg('Please enter a valid name and 10-digit mobile number.');
      return;
    }
    if (!formData.event_date) {
      setErrorMsg('Please pick a target event date.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await submitEnquiry(formData);
      if (error) throw error;
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        event_type: 'wedding',
        event_date: '',
        guests: 150,
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="events" className="py-16 sm:py-24 bg-forest-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-forest-900 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-3">
              <Building className="w-3.5 h-3.5" />
              <span>Banquets & Celebrations</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-cream mb-4">
              Host Your Celebrations at{' '}
              <span className="text-gold-gradient">Nandanvan</span>
            </h2>

            <p className="text-xs sm:text-base text-cream/70 leading-relaxed mb-6 font-light">
              From wedding receptions on landscaped green lawns to corporate meets and family milestones, Nandanvan offers Rajkot's finest hospitality with customized multicuisine buffets.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { title: 'Lawn Capacity: 50 to 800+ Guests', desc: 'Sprawling outdoor greenery with fairy lights & elegant stage setup' },
                { title: 'Customized Tasting Menus', desc: 'Kathiyawadi, North Indian & live dessert counters' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-forest-900/40 border border-gold/15">
                  <GlassWater className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-cream">{item.title}</h4>
                    <p className="text-[11px] text-cream/60 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Expand Form Trigger */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileFormOpen(!mobileFormOpen)}
                className="w-full py-3 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md"
              >
                <span>{mobileFormOpen ? 'Close Enquiry Form' : 'Request Banquet Proposal Form'}</span>
                {mobileFormOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Right Enquiry Form (Always visible on desktop, collapsible on mobile) */}
          <div className={`lg:col-span-6 ${mobileFormOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="p-5 sm:p-8 rounded-3xl bg-forest-900/80 backdrop-blur-xl border border-gold/30 shadow-2xl">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream mb-1">
                Plan Your Event
              </h3>
              <p className="text-xs text-cream/60 mb-5">
                Fill the brief details below and our banquet team will contact you.
              </p>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {success ? (
                <div className="p-6 text-center bg-forest-950 rounded-2xl border border-emerald-500/40">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-cream mb-1">
                    Enquiry Received!
                  </h4>
                  <p className="text-xs text-cream/70">
                    Our event team will call you shortly to discuss dates and menus.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-cream/80 font-medium mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priyank Trivedi"
                      className="w-full px-3 py-2.5 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-cream/80 font-medium mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile"
                        className="w-full px-3 py-2.5 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-cream/80 font-medium mb-1">Tentative Date *</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-cream/80 font-medium mb-1">Event Type *</label>
                      <select
                        value={formData.event_type}
                        onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                      >
                        {eventTypes.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-cream/80 font-medium mb-1">Expected Guests</label>
                      <input
                        type="number"
                        min={20}
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-cream/80 font-medium mb-1">Event Requirements *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Lawn booking, specific menus, timings..."
                      className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gold-gradient text-forest-950 font-bold uppercase tracking-wider shadow-md hover:shadow-gold/30 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting...' : 'Send Proposal Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
