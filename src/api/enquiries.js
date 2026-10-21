import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialEnquiries } from '../data/mockData';

const STORAGE_KEY = 'nandanvan_enquiries';

const getLocalEnquiries = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEnquiries));
    return initialEnquiries;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialEnquiries;
  }
};

const saveLocalEnquiries = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export async function submitEnquiry(enquiry) {
  if (!isSupabaseConfigured) {
    const list = getLocalEnquiries();
    const newEnq = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString()
    };
    list.unshift(newEnq);
    saveLocalEnquiries(list);
    return { data: newEnq, error: null };
  }

  return await supabase.from('enquiries').insert({
    ...enquiry,
    status: 'new'
  }).select().single();
}

export async function getEnquiries() {
  if (!isSupabaseConfigured) {
    return { data: getLocalEnquiries(), error: null };
  }
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data: data && data.length ? data : getLocalEnquiries(), error: null };
  } catch (err) {
    return { data: getLocalEnquiries(), error: null };
  }
}

export async function updateEnquiryStatus(id, status) {
  if (!isSupabaseConfigured) {
    const list = getLocalEnquiries();
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      list[idx].updated_at = new Date().toISOString();
      saveLocalEnquiries(list);
      return { data: list[idx], error: null };
    }
    return { data: null, error: new Error('Enquiry not found') };
  }
  return await supabase.from('enquiries').update({ status }).eq('id', id).select().single();
}
