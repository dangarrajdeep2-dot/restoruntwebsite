import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialCategories } from '../data/mockData';

const STORAGE_KEY = 'nandanvan_categories';

const getLocalCategories = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCategories));
    return initialCategories;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialCategories;
  }
};

const saveLocalCategories = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export async function getCategories() {
  if (!isSupabaseConfigured) {
    return { data: getLocalCategories(), error: null };
  }
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return { data: data && data.length ? data : getLocalCategories(), error: null };
  } catch (err) {
    console.warn('Using local categories fallback:', err.message);
    return { data: getLocalCategories(), error: null };
  }
}

export async function createCategory(category) {
  if (!isSupabaseConfigured) {
    const items = getLocalCategories();
    const newItem = { ...category, id: `cat-${Date.now()}`, created_at: new Date().toISOString() };
    items.push(newItem);
    saveLocalCategories(items);
    return { data: newItem, error: null };
  }
  return await supabase.from('categories').insert(category).select().single();
}

export async function updateCategory(id, updates) {
  if (!isSupabaseConfigured) {
    const items = getLocalCategories();
    const index = items.findIndex(c => c.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      saveLocalCategories(items);
      return { data: items[index], error: null };
    }
    return { data: null, error: new Error('Category not found') };
  }
  return await supabase.from('categories').update(updates).eq('id', id).select().single();
}

export async function deleteCategory(id) {
  if (!isSupabaseConfigured) {
    const items = getLocalCategories().filter(c => c.id !== id);
    saveLocalCategories(items);
    return { error: null };
  }
  return await supabase.from('categories').delete().eq('id', id);
}
