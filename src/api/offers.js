import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialOffers } from '../data/mockData';

const STORAGE_KEY = 'nandanvan_offers';

const getLocalOffers = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOffers));
    return initialOffers;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialOffers;
  }
};

const saveLocalOffers = (offers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
};

export async function getActiveOffers() {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString();
    const list = getLocalOffers().filter(o => o.is_active && o.valid_till > now);
    return { data: list, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .gt('valid_till', new Date().toISOString())
      .order('valid_till', { ascending: true });
    if (error) throw error;
    return { data: data && data.length ? data : getLocalOffers(), error: null };
  } catch (err) {
    return { data: getLocalOffers(), error: null };
  }
}

export async function getAllOffers() {
  if (!isSupabaseConfigured) {
    return { data: getLocalOffers(), error: null };
  }
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data: data && data.length ? data : getLocalOffers(), error: null };
  } catch (err) {
    return { data: getLocalOffers(), error: null };
  }
}

export async function createOffer(offer) {
  if (!isSupabaseConfigured) {
    const list = getLocalOffers();
    const newOffer = { ...offer, id: `off-${Date.now()}`, created_at: new Date().toISOString() };
    list.unshift(newOffer);
    saveLocalOffers(list);
    return { data: newOffer, error: null };
  }
  return await supabase.from('offers').insert(offer).select().single();
}

export async function updateOffer(id, updates) {
  if (!isSupabaseConfigured) {
    const list = getLocalOffers();
    const idx = list.findIndex(o => o.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      saveLocalOffers(list);
      return { data: list[idx], error: null };
    }
    return { data: null, error: new Error('Offer not found') };
  }
  return await supabase.from('offers').update(updates).eq('id', id).select().single();
}

export async function deleteOffer(id) {
  if (!isSupabaseConfigured) {
    const list = getLocalOffers().filter(o => o.id !== id);
    saveLocalOffers(list);
    return { error: null };
  }
  return await supabase.from('offers').delete().eq('id', id);
}
