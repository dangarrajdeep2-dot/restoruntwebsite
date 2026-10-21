import React, { useState, useEffect } from 'react';
import { Star, Check, Trash2, Clock, ThumbsUp } from 'lucide-react';
import { getAllReviews, updateReviewApproval, deleteReview } from '../../api/reviews';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('pending'); // 'pending' | 'approved'
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const { data } = await getAllReviews();
    if (data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    await updateReviewApproval(id, true);
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r))
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = reviews.filter((r) =>
    tab === 'pending' ? !r.is_approved : r.is_approved
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              tab === 'pending'
                ? 'bg-gold text-forest-950 font-bold shadow-md'
                : 'bg-forest-900 border border-gold/20 text-cream/70 hover:border-gold/50'
            }`}
          >
            Pending Approval ({reviews.filter((r) => !r.is_approved).length})
          </button>
          <button
            onClick={() => setTab('approved')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              tab === 'approved'
                ? 'bg-gold text-forest-950 font-bold shadow-md'
                : 'bg-forest-900 border border-gold/20 text-cream/70 hover:border-gold/50'
            }`}
          >
            Live Approved ({reviews.filter((r) => r.is_approved).length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 py-12 text-center text-cream/50 bg-forest-900/40 rounded-2xl border border-gold/15">
            No reviews found in this tab.
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src={rev.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${rev.name}`}
                      alt={rev.name}
                      className="w-8 h-8 rounded-full border border-gold/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-cream">{rev.name}</h4>
                      <span className="text-[10px] text-cream/50">
                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-gold">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-cream/80 leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-forest-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gold/80">
                  Status: {rev.is_approved ? 'Approved' : 'Pending Review'}
                </span>

                <div className="flex items-center space-x-2">
                  {!rev.is_approved && (
                    <button
                      onClick={() => handleApprove(rev.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1 hover:bg-emerald-500 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-lg bg-forest-950 text-red-400 border border-red-500/30 hover:bg-red-900/60"
                    title="Reject & Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
