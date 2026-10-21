import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialSettings } from '../data/mockData';

const STORAGE_KEY = 'nandanvan_settings';

const getLocalSettings = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSettings));
    return initialSettings;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialSettings;
  }
};

const saveLocalSettings = (settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export async function getSettings() {
  if (!isSupabaseConfigured) {
    return { data: getLocalSettings(), error: null };
  }
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return { data: data || getLocalSettings(), error: null };
  } catch (err) {
    return { data: getLocalSettings(), error: null };
  }
}

export async function updateSettings(updates) {
  if (!isSupabaseConfigured) {
    const current = getLocalSettings();
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    saveLocalSettings(updated);
    return { data: updated, error: null };
  }
  // Update single row in settings
  const { data: existing } = await supabase.from('settings').select('id').limit(1).maybeSingle();
  if (existing) {
    return await supabase.from('settings').update(updates).eq('id', existing.id).select().single();
  } else {
    return await supabase.from('settings').insert(updates).select().single();
  }
}
