import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  PenTool, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { getApprovedReviews, submitReview } from '../api/reviews';

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    async function loadReviews() {
      const { data } = await getApprovedReviews();
      if (data && data.length) setReviews(data);
    }
    loadReviews();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      setErrorMsg('Please fill in your name and comment.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const { error } = await submitReview(form);
      if (error) throw error;
      setSubmitSuccess(true);
      setForm({ name: '', rating: 5, comment: '' });
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowReviewForm(false);
      }, 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-forest-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase mb-3">
              <Star className="w-3.5 h-3.5 fill-gold" />
              <span>Guest Experiences</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream">
              Words From Our Patrons
            </h2>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-5 py-2.5 rounded-full bg-forest-950/80 border border-gold/40 text-gold font-semibold text-xs tracking-wider uppercase hover:bg-gold hover:text-forest-950 transition-all flex items-center space-x-2 shadow-md"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{showReviewForm ? 'Close Review Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Review Submission Form Drawer / Card */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 p-6 sm:p-8 rounded-2xl bg-forest-950 border border-gold/30 shadow-2xl max-w-2xl mx-auto overflow-hidden"
            >
              <h3 className="font-serif text-xl font-bold text-cream mb-1">
                Share Your Dining Experience
              </h3>
              <p className="text-xs text-cream/60 mb-5">
                Your feedback helps us maintain royal standards. All reviews are approved by our team before publishing.
              </p>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {submitSuccess ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-cream mb-1">
                    Review Submitted!
                  </h4>
                  <p className="text-xs text-cream/70">
                    Thank you! Your review has been saved and will appear publicly once verified by our team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Star Rating Select */}
                  <div>
                    <label className="block text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                      Your Rating *
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setForm({ ...form, rating: star })}
                          className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= form.rating
                                ? 'text-gold fill-gold'
                                : 'text-cream/20'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Bhavik Vora"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-cream/80 mb-1">
                      Your Comments & Favorite Dishes *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      placeholder="Tell us about the taste, service, or garden ambiance..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-gold/25 text-cream text-xs sm:text-sm focus:outline-none focus:border-gold resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-gold/30 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review for Approval'}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel View */}
        {reviews.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl bg-forest-950 border border-gold/30 p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center"
              >
                {/* Decorative Quote Icon */}
                <div className="w-14 h-14 rounded-full bg-gold/15 text-gold border border-gold/30 flex items-center justify-center mb-6">
                  <Quote className="w-6 h-6 rotate-180" />
                </div>

                {/* Stars */}
                <div className="flex space-x-1.5 mb-6">
                  {Array.from({ length: reviews[currentIndex].rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Comment */}
                <p className="font-serif text-lg sm:text-2xl text-cream/90 italic leading-relaxed max-w-2xl mb-8">
                  "{reviews[currentIndex].comment}"
                </p>

                {/* Author Details */}
                <div className="flex items-center space-x-3">
                  <img
                    src={reviews[currentIndex].avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${reviews[currentIndex].name}`}
                    alt={reviews[currentIndex].name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold/50"
                  />
                  <div className="text-left">
                    <h4 className="font-sans font-bold text-cream text-sm sm:text-base">
                      {reviews[currentIndex].name}
                    </h4>
                    <span className="text-[11px] text-gold/80 uppercase tracking-widest font-sans">
                      Verified Patron • Rajkot
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-forest-950 border border-gold/30 text-cream hover:text-gold hover:border-gold transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex space-x-1.5">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-gold' : 'w-2 bg-cream/20'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-forest-950 border border-gold/30 text-cream hover:text-gold hover:border-gold transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
