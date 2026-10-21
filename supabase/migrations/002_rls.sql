-- ====================================================================
-- 002_rls.sql: Row Level Security, Policies, and Secure RPCs
-- ====================================================================

-- 1. HELPER FUNCTION: Check if the calling user is an Admin (owner or staff)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT role INTO current_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN current_role IN ('owner', 'staff');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES POLICIES
-- Users can view their own profile; Admins can view all profiles
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
CREATE POLICY "Users can view own profile or admins view all" ON public.profiles
FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile; Admins can update any profile
DROP POLICY IF EXISTS "Users can update own profile or admins update all" ON public.profiles;
CREATE POLICY "Users can update own profile or admins update all" ON public.profiles
FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- 4. CATEGORIES POLICIES
-- Everyone can read categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories
FOR SELECT USING (true);

-- Only admins can insert, update, delete categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
FOR ALL USING (public.is_admin());

-- 5. MENU ITEMS POLICIES
-- Public can only view available items; Admins can view all items
DROP POLICY IF EXISTS "Public can view available menu items" ON public.menu_items;
CREATE POLICY "Public can view available menu items" ON public.menu_items
FOR SELECT USING (is_available = true OR public.is_admin());

-- Only admins can insert, update, delete menu items
DROP POLICY IF EXISTS "Admins can manage menu items" ON public.menu_items;
CREATE POLICY "Admins can manage menu items" ON public.menu_items
FOR ALL USING (public.is_admin());

-- 6. OFFERS POLICIES
-- Public can view active offers; Admins can view all offers
DROP POLICY IF EXISTS "Public can view active offers" ON public.offers;
CREATE POLICY "Public can view active offers" ON public.offers
FOR SELECT USING ((is_active = true AND valid_till > NOW()) OR public.is_admin());

-- Admins can manage offers
DROP POLICY IF EXISTS "Admins can manage offers" ON public.offers;
CREATE POLICY "Admins can manage offers" ON public.offers
FOR ALL USING (public.is_admin());

-- 7. GALLERY POLICIES
-- Public can view gallery
DROP POLICY IF EXISTS "Gallery is viewable by everyone" ON public.gallery;
CREATE POLICY "Gallery is viewable by everyone" ON public.gallery
FOR SELECT USING (true);

-- Admins can manage gallery
DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery;
CREATE POLICY "Admins can manage gallery" ON public.gallery
FOR ALL USING (public.is_admin());

-- 8. SETTINGS POLICIES
-- Public can view settings
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.settings;
CREATE POLICY "Settings are viewable by everyone" ON public.settings
FOR SELECT USING (true);

-- Admins can update settings
DROP POLICY IF EXISTS "Admins can update settings" ON public.settings;
CREATE POLICY "Admins can update settings" ON public.settings
FOR ALL USING (public.is_admin());

-- 9. REVIEWS POLICIES
-- Public can only view approved reviews; Admins can view all
DROP POLICY IF EXISTS "Approved reviews viewable by all" ON public.reviews;
CREATE POLICY "Approved reviews viewable by all" ON public.reviews
FOR SELECT USING (is_approved = true OR public.is_admin());

-- Anyone can submit a review, but is_approved MUST be forced to false
DROP POLICY IF EXISTS "Public can insert pending reviews" ON public.reviews;
CREATE POLICY "Public can insert pending reviews" ON public.reviews
FOR INSERT WITH CHECK (is_approved = false);

-- Admins can manage reviews (approve, edit, delete)
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
CREATE POLICY "Admins can manage reviews" ON public.reviews
FOR ALL USING (public.is_admin());

-- 10. ENQUIRIES POLICIES
-- Public can submit enquiries
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries" ON public.enquiries
FOR INSERT WITH CHECK (
  LENGTH(name) >= 2 AND LENGTH(phone) >= 10 AND LENGTH(message) >= 5
);

-- Only Admins can view and update enquiries
DROP POLICY IF EXISTS "Admins can manage enquiries" ON public.enquiries;
CREATE POLICY "Admins can manage enquiries" ON public.enquiries
FOR ALL USING (public.is_admin());

-- 11. RESERVATIONS POLICIES
-- Public can insert reservations
DROP POLICY IF EXISTS "Public can insert reservations" ON public.reservations;
CREATE POLICY "Public can insert reservations" ON public.reservations
FOR INSERT WITH CHECK (
  status = 'pending' AND LENGTH(name) >= 2 AND LENGTH(phone) >= 10
);

-- Only Admins can view, update, delete reservations
DROP POLICY IF EXISTS "Admins can manage reservations" ON public.reservations;
CREATE POLICY "Admins can manage reservations" ON public.reservations
FOR ALL USING (public.is_admin());

-- 12. ORDERS & ORDER ITEMS POLICIES
-- Public cannot insert directly (must use place_order RPC); Admins can do everything
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders
FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items
FOR ALL USING (public.is_admin());

-- ====================================================================
-- RPC FUNCTIONS (SECURE BUSINESS LOGIC)
-- ====================================================================

-- A. ANTI-SPAM THROTTLE FUNCTION: Check rate limit per phone
CREATE OR REPLACE FUNCTION public.check_phone_rate_limit(p_phone TEXT, p_table TEXT, p_max_per_hour INT DEFAULT 5)
RETURNS BOOLEAN AS $$
DECLARE
  recent_count INT;
BEGIN
  IF p_table = 'orders' THEN
    SELECT COUNT(*) INTO recent_count
    FROM public.orders
    WHERE phone = p_phone AND created_at > NOW() - INTERVAL '1 hour';
  ELSIF p_table = 'reservations' THEN
    SELECT COUNT(*) INTO recent_count
    FROM public.reservations
    WHERE phone = p_phone AND created_at > NOW() - INTERVAL '1 hour';
  ELSE
    recent_count := 0;
  END IF;

  RETURN recent_count < p_max_per_hour;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- B. RPC: CHECK TABLE AVAILABILITY
-- Table capacity guidelines:
-- 2-seater: max 6 tables, 4-seater: max 10 tables, 6-seater: max 6 tables, family-booth: max 4 tables
CREATE OR REPLACE FUNCTION public.check_table_availability(
  p_date DATE,
  p_time TIME,
  p_table_type TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_booked_count INT;
  v_max_tables INT;
  v_is_available BOOLEAN;
BEGIN
  -- Determine total tables available by type
  CASE p_table_type
    WHEN '2-seater' THEN v_max_tables := 6;
    WHEN '4-seater' THEN v_max_tables := 10;
    WHEN '6-seater' THEN v_max_tables := 6;
    WHEN 'family-booth' THEN v_max_tables := 4;
    WHEN 'garden-patio' THEN v_max_tables := 5;
    WHEN 'vip-lounge' THEN v_max_tables := 3;
    ELSE v_max_tables := 4;
  END CASE;

  -- Count existing active bookings within +/- 1 hour and 30 minutes window
  SELECT COUNT(*) INTO v_booked_count
  FROM public.reservations
  WHERE date = p_date
    AND status IN ('pending', 'confirmed')
    AND table_type = p_table_type
    AND time >= (p_time - INTERVAL '90 minutes')
    AND time <= (p_time + INTERVAL '90 minutes');

  v_is_available := (v_booked_count < v_max_tables);

  RETURN jsonb_build_object(
    'available', v_is_available,
    'booked_count', v_booked_count,
    'total_tables', v_max_tables,
    'remaining_tables', GREATEST(0, v_max_tables - v_booked_count)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. RPC: PLACE ORDER
-- Validates input, checks restaurant opening status & minimum order, looks up prices from DB, calculates total
CREATE OR REPLACE FUNCTION public.place_order(
  customer JSONB,
  items JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_phone TEXT;
  v_name TEXT;
  v_address TEXT;
  v_order_type TEXT;
  v_payment_method TEXT;
  v_notes TEXT;
  v_table_number TEXT;
  v_is_open BOOLEAN;
  v_min_order NUMERIC(10, 2);
  v_delivery_fee NUMERIC(10, 2);
  v_subtotal NUMERIC(10, 2) := 0;
  v_calculated_delivery NUMERIC(10, 2) := 0;
  v_final_total NUMERIC(10, 2) := 0;
  v_new_order_id UUID;
  v_new_order_number TEXT;
  v_item RECORD;
  v_db_item RECORD;
  v_item_count INT;
BEGIN
  -- Extract customer fields
  v_name := TRIM(COALESCE(customer->>'name', ''));
  v_phone := TRIM(COALESCE(customer->>'phone', ''));
  v_address := customer->>'address';
  v_order_type := COALESCE(customer->>'order_type', 'delivery');
  v_payment_method := COALESCE(customer->>'payment_method', 'UPI');
  v_notes := customer->>'notes';
  v_table_number := customer->>'table_number';

  -- Validation
  IF LENGTH(v_name) < 2 THEN
    RAISE EXCEPTION 'Customer name must be at least 2 characters.';
  END IF;

  IF LENGTH(v_phone) < 10 OR LENGTH(v_phone) > 15 THEN
    RAISE EXCEPTION 'Please provide a valid 10-digit phone number.';
  END IF;

  -- Anti-spam rate limit
  IF NOT public.check_phone_rate_limit(v_phone, 'orders', 5) THEN
    RAISE EXCEPTION 'Order limit reached for this phone number. Please try again in an hour or contact the restaurant directly.';
  END IF;

  -- Validate items count
  SELECT jsonb_array_length(items) INTO v_item_count;
  IF v_item_count IS NULL OR v_item_count = 0 THEN
    RAISE EXCEPTION 'Your order must contain at least one item.';
  END IF;

  -- Check restaurant settings
  SELECT is_open, min_order, delivery_charge
  INTO v_is_open, v_min_order, v_delivery_fee
  FROM public.settings
  LIMIT 1;

  IF v_is_open IS NOT NULL AND v_is_open = FALSE THEN
    RAISE EXCEPTION 'The restaurant is currently closed for online orders. Please check operating hours.';
  END IF;

  -- Compute subtotal with verified database prices (never trust client prices!)
  FOR v_item IN SELECT * FROM jsonb_to_recordset(items) AS (menu_item_id UUID, qty INT)
  LOOP
    IF v_item.qty <= 0 THEN
      RAISE EXCEPTION 'Item quantity must be greater than zero.';
    END IF;

    SELECT id, name, price, is_available INTO v_db_item
    FROM public.menu_items
    WHERE id = v_item.menu_item_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Menu item not found in catalog.';
    END IF;

    IF NOT v_db_item.is_available THEN
      RAISE EXCEPTION 'Dish "%" is currently out of stock.', v_db_item.name;
    END IF;

    v_subtotal := v_subtotal + (v_db_item.price * v_item.qty);
  END LOOP;

  -- Check minimum order
  IF v_min_order IS NOT NULL AND v_subtotal < v_min_order THEN
    RAISE EXCEPTION 'Order subtotal (₹%) is below the minimum order amount of ₹%.', v_subtotal, v_min_order;
  END IF;

  -- Delivery charge applies only for delivery orders
  IF v_order_type = 'delivery' THEN
    v_calculated_delivery := COALESCE(v_delivery_fee, 40.00);
  ELSE
    v_calculated_delivery := 0.00;
  END IF;

  v_final_total := v_subtotal + v_calculated_delivery;

  -- Insert order
  INSERT INTO public.orders (
    customer_name,
    phone,
    address,
    order_type,
    payment_method,
    subtotal,
    delivery_charge,
    total,
    status,
    notes,
    table_number
  ) VALUES (
    v_name,
    v_phone,
    v_address,
    v_order_type,
    v_payment_method,
    v_subtotal,
    v_calculated_delivery,
    v_final_total,
    'pending',
    v_notes,
    v_table_number
  )
  RETURNING id, order_number INTO v_new_order_id, v_new_order_number;

  -- Insert verified order items
  FOR v_item IN SELECT * FROM jsonb_to_recordset(items) AS (menu_item_id UUID, qty INT)
  LOOP
    SELECT name, price INTO v_db_item
    FROM public.menu_items
    WHERE id = v_item.menu_item_id;

    INSERT INTO public.order_items (
      order_id,
      menu_item_id,
      name,
      price,
      qty
    ) VALUES (
      v_new_order_id,
      v_item.menu_item_id,
      v_db_item.name,
      v_db_item.price,
      v_item.qty
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_new_order_id,
    'order_number', v_new_order_number,
    'subtotal', v_subtotal,
    'delivery_charge', v_calculated_delivery,
    'total', v_final_total,
    'status', 'pending'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D. RPC: TRACK ORDER
-- Allows customer to safely track their order status without exposing full table data
CREATE OR REPLACE FUNCTION public.track_order(
  p_order_number TEXT,
  p_phone TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_items JSONB;
BEGIN
  -- Look up order matching both order_number and phone (anti-tampering)
  SELECT id, order_number, customer_name, order_type, status, subtotal, delivery_charge, total, created_at, table_number
  INTO v_order
  FROM public.orders
  WHERE UPPER(TRIM(order_number)) = UPPER(TRIM(p_order_number))
    AND RIGHT(phone, 10) = RIGHT(TRIM(p_phone), 10);

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'found', false,
      'message', 'No matching order found for this order number and phone combination.'
    );
  END IF;

  -- Get order items
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', name,
      'price', price,
      'qty', qty,
      'item_total', (price * qty)
    )
  ) INTO v_items
  FROM public.order_items
  WHERE order_id = v_order.id;

  RETURN jsonb_build_object(
    'found', true,
    'order_number', v_order.order_number,
    'customer_name', v_order.customer_name,
    'order_type', v_order.order_type,
    'status', v_order.status,
    'subtotal', v_order.subtotal,
    'delivery_charge', v_order.delivery_charge,
    'total', v_order.total,
    'table_number', v_order.table_number,
    'created_at', v_order.created_at,
    'items', COALESCE(v_items, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
