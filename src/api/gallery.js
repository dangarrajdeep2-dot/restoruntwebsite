import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialGallery } from '../data/mockData';

const STORAGE_KEY = 'nandanvan_gallery';

const getLocalGallery = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGallery));
    return initialGallery;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialGallery;
  }
};

const saveLocalGallery = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export async function getGallery(category = null) {
  if (!isSupabaseConfigured) {
    let list = getLocalGallery();
    if (category && category !== 'all') {
      list = list.filter(g => g.category === category);
    }
    return { data: list, error: null };
  }
  try {
    let query = supabase.from('gallery').select('*');
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return { data: data && data.length ? data : getLocalGallery(), error: null };
  } catch (err) {
    return { data: getLocalGallery(), error: null };
  }
}

export async function createGalleryItem(item) {
  if (!isSupabaseConfigured) {
    const list = getLocalGallery();
    const newItem = { ...item, id: `gal-${Date.now()}`, created_at: new Date().toISOString() };
    list.unshift(newItem);
    saveLocalGallery(list);
    return { data: newItem, error: null };
  }
  return await supabase.from('gallery').insert(item).select().single();
}

export async function deleteGalleryItem(id) {
  if (!isSupabaseConfigured) {
    const list = getLocalGallery().filter(g => g.id !== id);
    saveLocalGallery(list);
    return { error: null };
  }
  return await supabase.from('gallery').delete().eq('id', id);
}
