import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialOrders, initialMenuItems, initialSettings } from '../data/mockData';

const STORAGE_KEY = 'nandanvan_orders';

const getLocalOrders = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
    return initialOrders;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialOrders;
  }
};

const saveLocalOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export async function placeOrder(customer, items) {
  if (!isSupabaseConfigured) {
    // Local simulation of secure place_order RPC
    const menuStored = localStorage.getItem('nandanvan_menu_items');
    const menu = menuStored ? JSON.parse(menuStored) : initialMenuItems;
    const settingsStored = localStorage.getItem('nandanvan_settings');
    const settings = settingsStored ? JSON.parse(settingsStored) : initialSettings;

    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbItem = menu.find(m => m.id === item.menu_item_id);
      if (!dbItem) throw new Error('Menu item not found in catalog');
      const itemSub = dbItem.price * item.qty;
      subtotal += itemSub;
      verifiedItems.push({
        name: dbItem.name,
        price: dbItem.price,
        qty: item.qty,
        item_total: itemSub
      });
    }

    if (subtotal < (settings.min_order || 200)) {
      throw new Error(`Order subtotal (₹${subtotal}) is below minimum of ₹${settings.min_order || 200}`);
    }

    const delivery_charge = customer.order_type === 'delivery' ? (settings.delivery_charge || 40) : 0;
    const total = subtotal + delivery_charge;
    const seq = Math.floor(1000 + Math.random() * 9000);
    const order_number = `NV-${seq}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number,
      customer_name: customer.name,
      phone: customer.phone,
      address: customer.address || '',
      order_type: customer.order_type || 'delivery',
      payment_method: customer.payment_method || 'UPI',
      subtotal,
      delivery_charge,
      total,
      status: 'pending',
      notes: customer.notes || '',
      table_number: customer.table_number || '',
      created_at: new Date().toISOString(),
      items: verifiedItems
    };

    const currentOrders = getLocalOrders();
    currentOrders.unshift(newOrder);
    saveLocalOrders(currentOrders);

    return {
      data: {
        success: true,
        order_id: newOrder.id,
        order_number: newOrder.order_number,
        subtotal,
        delivery_charge,
        total,
        status: 'pending'
      },
      error: null
    };
  }

  // Real Supabase RPC execution
  try {
    const { data, error } = await supabase.rpc('place_order', {
      customer,
      items
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error placing order via RPC:', err);
    return { data: null, error: err };
  }
}

export async function trackOrder(orderNumber, phone) {
  if (!isSupabaseConfigured) {
    const orders = getLocalOrders();
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const cleanNum = orderNumber.trim().toUpperCase();

    const found = orders.find(o => 
      o.order_number.toUpperCase() === cleanNum &&
      o.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone
    );

    if (!found) {
      return {
        data: {
          found: false,
          message: 'No matching order found for this order number and phone number.'
        },
        error: null
      };
    }

    return {
      data: {
        found: true,
        order_number: found.order_number,
        customer_name: found.customer_name,
        order_type: found.order_type,
        status: found.status,
        subtotal: found.subtotal,
        delivery_charge: found.delivery_charge,
        total: found.total,
        table_number: found.table_number,
        created_at: found.created_at,
        items: found.items || []
      },
      error: null
    };
  }

  try {
    const { data, error } = await supabase.rpc('track_order', {
      p_order_number: orderNumber,
      p_phone: phone
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getOrders() {
  if (!isSupabaseConfigured) {
    return { data: getLocalOrders(), error: null };
  }
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data: data && data.length ? data : getLocalOrders(), error: null };
  } catch (err) {
    console.warn('Orders fetch error, using local fallback:', err.message);
    return { data: getLocalOrders(), error: null };
  }
}

export async function updateOrderStatus(orderId, status) {
  if (!isSupabaseConfigured) {
    const orders = getLocalOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      orders[idx].updated_at = new Date().toISOString();
      saveLocalOrders(orders);
      return { data: orders[idx], error: null };
    }
    return { data: null, error: new Error('Order not found') };
  }
  return await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
}
