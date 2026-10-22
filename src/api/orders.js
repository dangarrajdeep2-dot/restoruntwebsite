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
      window.dispatchEvent(new Event('nandanvan_order_update'));
      return { data: orders[idx], error: null };
    }
    return { data: null, error: new Error('Order not found') };
  }
  const res = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
  window.dispatchEvent(new Event('nandanvan_order_update'));
  return res;
}

export async function createTableOrder({ table_number, waiter_name, waiter_id, customer_name, phone, items, notes }) {
  const currentOrders = getLocalOrders();
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + gst;
  const seq = Math.floor(1000 + Math.random() * 9000);
  const order_number = `NV-T${seq}`;

  const newOrder = {
    id: `ord-table-${Date.now()}`,
    order_number,
    table_number: String(table_number),
    order_type: 'dine-in',
    waiter_id: waiter_id || 'staff-waiter-01',
    waiter_name: waiter_name || 'Captain',
    customer_name: customer_name || `Table ${table_number} Guest`,
    phone: phone || '',
    status: 'sent_to_kitchen', // sent_to_kitchen | ready_to_pick | served | completed
    subtotal,
    delivery_charge: 0,
    gst,
    total,
    notes: notes || '',
    payment_method: 'UPI',
    created_at: new Date().toISOString(),
    items: items.map((it, idx) => ({
      id: it.id || `item-${idx}`,
      name: it.name,
      price: Number(it.price),
      qty: Number(it.qty),
      notes: it.notes || '',
      is_prepared: false
    }))
  };

  currentOrders.unshift(newOrder);
  saveLocalOrders(currentOrders);
  window.dispatchEvent(new Event('nandanvan_order_update'));

  return { data: newOrder, error: null };
}

export async function toggleOrderItemPrepared(orderId, itemIndex) {
  const orders = getLocalOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order || !order.items || !order.items[itemIndex]) {
    return { data: null, error: new Error('Order or item not found') };
  }
  order.items[itemIndex].is_prepared = !order.items[itemIndex].is_prepared;
  saveLocalOrders(orders);
  window.dispatchEvent(new Event('nandanvan_order_update'));
  return { data: order, error: null };
}

export async function markOrderReadyToPick(orderId) {
  const orders = getLocalOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return { data: null, error: new Error('Order not found') };
  order.status = 'ready_to_pick';
  if (order.items) {
    order.items.forEach(it => { it.is_prepared = true; });
  }
  order.ready_at = new Date().toISOString();
  saveLocalOrders(orders);
  window.dispatchEvent(new Event('nandanvan_order_update'));
  return { data: order, error: null };
}

export async function markOrderServed(orderId) {
  const orders = getLocalOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return { data: null, error: new Error('Order not found') };
  order.status = 'served';
  order.served_at = new Date().toISOString();
  saveLocalOrders(orders);
  window.dispatchEvent(new Event('nandanvan_order_update'));
  return { data: order, error: null };
}

export async function completeTableBill(orderId, { phone, customer_name, payment_method }) {
  const orders = getLocalOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return { data: null, error: new Error('Order not found') };
  order.status = 'completed';
  if (phone) order.phone = phone;
  if (customer_name) order.customer_name = customer_name;
  if (payment_method) order.payment_method = payment_method;
  order.billed_at = new Date().toISOString();
  saveLocalOrders(orders);
  window.dispatchEvent(new Event('nandanvan_order_update'));
  return { data: order, error: null };
}
