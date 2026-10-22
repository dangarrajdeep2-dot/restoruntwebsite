import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialMenuItems } from '../data/mockData';

const STORAGE_KEY = 'nandanvan_menu_items_v2';

const getLocalMenu = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.removeItem('nandanvan_menu_items'); // remove deprecated key
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMenuItems));
    return initialMenuItems;
  }
  try {
    const parsed = JSON.parse(stored);
    // Auto-heal any stale 404 images from previous sessions
    const healed = parsed.map(item => {
      const fresh = initialMenuItems.find(i => i.id === item.id);
      if (fresh && (item.image_url?.includes('567184109411') || item.image_url?.includes('621996346565') || !item.image_url)) {
        return { ...item, image_url: fresh.image_url };
      }
      return item;
    });
    return healed;
  } catch {
    return initialMenuItems;
  }
};

const saveLocalMenu = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export async function getMenuItems({ categorySlug = null, type = null, availableOnly = false } = {}) {
  if (!isSupabaseConfigured) {
    let items = getLocalMenu();
    if (availableOnly) items = items.filter(i => i.is_available);
    if (type && type !== 'all') items = items.filter(i => i.type === type);
    return { data: items, error: null };
  }

  try {
    let query = supabase
      .from('menu_items')
      .select('*, categories!inner(slug, name)');

    if (availableOnly) {
      query = query.eq('is_available', true);
    }
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    if (categorySlug && categorySlug !== 'all') {
      query = query.eq('categories.slug', categorySlug);
    }

    const { data, error } = await query.order('created_at', { ascending: true });
    if (error) throw error;
    return { data: data && data.length ? data : getLocalMenu(), error: null };
  } catch (err) {
    console.warn('Using local menu fallback:', err.message);
    let items = getLocalMenu();
    if (availableOnly) items = items.filter(i => i.is_available);
    if (type && type !== 'all') items = items.filter(i => i.type === type);
    return { data: items, error: null };
  }
}

export async function createMenuItem(item) {
  if (!isSupabaseConfigured) {
    const items = getLocalMenu();
    const newItem = {
      ...item,
      id: `item-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    items.unshift(newItem);
    saveLocalMenu(items);
    return { data: newItem, error: null };
  }
  return await supabase.from('menu_items').insert(item).select().single();
}

export async function updateMenuItem(id, updates) {
  if (!isSupabaseConfigured) {
    const items = getLocalMenu();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      saveLocalMenu(items);
      return { data: items[index], error: null };
    }
    return { data: null, error: new Error('Menu item not found') };
  }
  return await supabase.from('menu_items').update(updates).eq('id', id).select().single();
}

export async function deleteMenuItem(id) {
  if (!isSupabaseConfigured) {
    const items = getLocalMenu().filter(i => i.id !== id);
    saveLocalMenu(items);
    return { error: null };
  }
  return await supabase.from('menu_items').delete().eq('id', id);
}
