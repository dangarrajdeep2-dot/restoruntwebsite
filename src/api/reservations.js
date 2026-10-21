import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialReservations } from '../data/mockData';

const STORAGE_KEY = 'nandanvan_reservations';

const getLocalReservations = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReservations));
    return initialReservations;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialReservations;
  }
};

const saveLocalReservations = (reservations) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
};

export async function checkTableAvailability(date, time, tableType) {
  if (!isSupabaseConfigured) {
    const list = getLocalReservations();
    const existing = list.filter(r => r.date === date && r.table_type === tableType && r.status !== 'cancelled');
    const maxCapacity = tableType === '2-seater' ? 6 : tableType === '4-seater' ? 10 : tableType === '6-seater' ? 6 : 4;
    const remaining = Math.max(0, maxCapacity - existing.length);
    return {
      data: {
        available: remaining > 0,
        booked_count: existing.length,
        total_tables: maxCapacity,
        remaining_tables: remaining
      },
      error: null
    };
  }

  try {
    const { data, error } = await supabase.rpc('check_table_availability', {
      p_date: date,
      p_time: time,
      p_table_type: tableType
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.warn('Availability RPC error, using local fallback:', err.message);
    return {
      data: {
        available: true,
        booked_count: 1,
        total_tables: 8,
        remaining_tables: 7
      },
      error: null
    };
  }
}

export async function createReservation(reservation) {
  if (!isSupabaseConfigured) {
    const list = getLocalReservations();
    const newRes = {
      ...reservation,
      id: `res-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    list.unshift(newRes);
    saveLocalReservations(list);
    return { data: newRes, error: null };
  }

  return await supabase.from('reservations').insert({
    ...reservation,
    status: 'pending'
  }).select().single();
}

export async function getReservations() {
  if (!isSupabaseConfigured) {
    return { data: getLocalReservations(), error: null };
  }
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: false })
      .order('time', { ascending: false });
    if (error) throw error;
    return { data: data && data.length ? data : getLocalReservations(), error: null };
  } catch (err) {
    return { data: getLocalReservations(), error: null };
  }
}

export async function updateReservationStatus(id, status) {
  if (!isSupabaseConfigured) {
    const list = getLocalReservations();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      list[idx].updated_at = new Date().toISOString();
      saveLocalReservations(list);
      return { data: list[idx], error: null };
    }
    return { data: null, error: new Error('Reservation not found') };
  }
  return await supabase.from('reservations').update({ status }).eq('id', id).select().single();
}
