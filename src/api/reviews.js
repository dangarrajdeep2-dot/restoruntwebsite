import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialReviews } from '../data/mockData';

const STORAGE_KEY = 'nandanvan_reviews';

const getLocalReviews = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReviews));
    return initialReviews;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialReviews;
  }
};

const saveLocalReviews = (reviews) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
};

export async function getApprovedReviews() {
  if (!isSupabaseConfigured) {
    const list = getLocalReviews().filter(r => r.is_approved);
    return { data: list, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data: data && data.length ? data : getLocalReviews().filter(r => r.is_approved), error: null };
  } catch (err) {
    return { data: getLocalReviews().filter(r => r.is_approved), error: null };
  }
}

export async function getAllReviews() {
  if (!isSupabaseConfigured) {
    return { data: getLocalReviews(), error: null };
  }
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data: data && data.length ? data : getLocalReviews(), error: null };
  } catch (err) {
    return { data: getLocalReviews(), error: null };
  }
}

export async function submitReview({ name, rating, comment }) {
  if (!isSupabaseConfigured) {
    const list = getLocalReviews();
    const newRev = {
      id: `rev-${Date.now()}`,
      name,
      rating: Number(rating),
      comment,
      is_approved: false, // Must be pending
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      created_at: new Date().toISOString()
    };
    list.unshift(newRev);
    saveLocalReviews(list);
    return { data: newRev, error: null };
  }

  return await supabase.from('reviews').insert({
    name,
    rating: Number(rating),
    comment,
    is_approved: false,
    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
  }).select().single();
}

export async function updateReviewApproval(id, isApproved) {
  if (!isSupabaseConfigured) {
    const list = getLocalReviews();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx].is_approved = isApproved;
      saveLocalReviews(list);
      return { data: list[idx], error: null };
    }
    return { data: null, error: new Error('Review not found') };
  }
  return await supabase.from('reviews').update({ is_approved: isApproved }).eq('id', id).select().single();
}

export async function deleteReview(id) {
  if (!isSupabaseConfigured) {
    const list = getLocalReviews().filter(r => r.id !== id);
    saveLocalReviews(list);
    return { error: null };
  }
  return await supabase.from('reviews').delete().eq('id', id);
}
