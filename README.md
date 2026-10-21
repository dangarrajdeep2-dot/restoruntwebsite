# 🌿 Nandanvan Multicuisine Restaurant

> A luxury, production-ready website and management system for **Nandanvan Multicuisine Restaurant**, Near Munjka, Kalawad Road, Rajkot, Gujarat, India.
> **Google Maps Location:** [https://maps.app.goo.gl/134VLgimHLRd4Gx8A](https://maps.app.goo.gl/134VLgimHLRd4Gx8A) (Coordinates: `22.2828711, 70.7381186`).

---

## ✨ Features & Architecture

### 1. Public Dining Experience
- **Cinematic 3D Hero Scene (`@react-three/fiber` & `@react-three/drei`):**
  - Procedural Royal Brass Thali with authentic delicacies (Paneer Butter Masala, Dal Bukhara, Kathiyawadi Ringan Olo, Basmati Saffron Rice, Bajra Rotlo with white butter, rolled papadum).
  - Floating aromatic spices, star anise, cardamom, and rose petals.
  - Delicate rising steam particle system.
  - Interactive mouse-parallax camera response with 2D WebGL fallback.
- **Interactive 3D Virtual Dining Room:**
  - 3D floor plan representing the dining hall and garden veranda (2-seater intimate, 4-seater courtyard, 6-seater family tables, and VIP family booths).
  - Hover glows table in gold; click selects and populates the booking form.
  - 2D grid toggle fallback for mobile accessibility.
  - Table availability check preventing double bookings.
- **Dynamic Royal Menu:**
  - Sticky category tabs, live search, and dietary filter pills (Pure Veg, Jain Friendly, Non-Veg).
  - Interactive 3D Dish Modal: view dishes in 360° with OrbitControls.
  - Spice level indicators (1–3 chillies), Chef's Special badges, prep times, and calories.
- **Slide-in Cart & Order Checkout Drawer:**
  - Quantity controls, delivery fee calculation, minimum order verification.
  - Order types: Doorstep Delivery (with Rajkot address), Takeaway, and Table Dine-In.
  - Payment modes: UPI QR / COD.
  - Secure Postgres RPC `place_order` execution with server-side price validation.
  - Confetti celebration, order confirmation number (e.g. `NV-1002`), and instant WhatsApp sharing.
- **Live Order Tracking:**
  - Protected Postgres RPC `track_order` allowing customers to verify kitchen status without exposing table data.
- **Today's Offers:**
  - Real-time live countdown timer (Days, Hours, Minutes, Seconds) with one-click promo code copying.
- **Masonry Gallery & Fullscreen Lightbox:**
  - Filter by Ambiance, Cuisine, Events, and Garden Patio.
  - Lightbox with keyboard navigation (Esc, Left/Right arrows).
- **Testimonials & Public Review Submission:**
  - Star ratings carousel with client avatars.
  - Public submission form with automatic pending moderation state.
- **Events & Banquet Catering:**
  - Dedicated proposal enquiry form for weddings, birthdays, and corporate lawn events.
- **Live Contact & Location:**
  - Dynamic "Open Now / Closed" indicator calculated in real-time.
  - Embedded Google Maps with one-click "Get Directions".
  - Click-to-call and instant WhatsApp host chat.
- **Multilingual Support:**
  - One-click language switcher between **English**, **ગુજરાતી (Gujarati)**, and **हिन्दी (Hindi)**.
- **Design System:**
  - Royal color palette: Forest Green (`#0E2A1F`), Gold (`#D4A24C`), Cream (`#FFF6E5`), Saffron (`#E8782A`).
  - Google Fonts: Playfair Display (headings) & Poppins (body).
  - Custom gold cursor for desktop mouse users.
  - Full Dark/Light theme toggle.

---

### 2. Owner & Staff Admin Portal (`#/admin`)
- **Authentication & Security:**
  - Supabase Auth integration with strict Role-Based Access Control (`owner` and `staff`).
  - Unauthorized visitors are automatically denied.
- **Executive Dashboard:**
  - Live revenue metrics, total orders, pending bookings, banquet leads.
  - Interactive 7-day revenue area chart built with `recharts`.
  - Top 5 signature dishes with revenue contribution.
  - Live order feed powered by **Supabase Realtime** with audio chime notifications.
- **Order Management:**
  - Filter by status (`pending`, `confirmed`, `preparing`, `out-for-delivery`, `completed`, `cancelled`) and search.
  - Order detail modal with a printable receipt / KOT format.
  - One-click WhatsApp update deep link.
- **Table Reservations & Banquet Enquiries:**
  - Accept or cancel bookings.
  - Direct click-to-call and WhatsApp links.
- **Menu Catalog Manager:**
  - Add, edit, or delete dishes.
  - Instant toggle for stock availability (`Available` vs `Out of Stock`).
  - Image upload directly to Supabase Storage bucket `menu-images`.
- **Category Manager:**
  - Organize and reorder dining sections.
- **Offers & Promo Manager:**
  - Create promotional codes with expiration dates and discount tags.
- **Gallery & Storage Manager:**
  - Upload ambiance and culinary photos to the `gallery` bucket.
- **Review Moderation:**
  - One-click approve or reject customer testimonials.
- **Store Settings:**
  - Master switch for Online Orders (Open/Closed).
  - Operating hours, contact numbers, minimum order limit, and delivery charges.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 (Vite), Tailwind CSS v3, Framer Motion, Lucide React
- **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Charts:** `recharts`
- **Backend / Database:** Supabase (`@supabase/supabase-js`):
  - PostgreSQL Database with Row Level Security (RLS)
  - Supabase Auth
  - Supabase Storage (`menu-images`, `gallery`)
  - Supabase Realtime Channels
  - Supabase Edge Functions (Deno)

---

## 🚀 Setup & Installation

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd nandanvan-restaurant
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Never expose the `service_role` key in frontend client configuration).*

---

## 🗄️ Database Setup (Supabase SQL Migrations)

Run the SQL migration files in order inside your **Supabase Dashboard -> SQL Editor**:

1. **`supabase/migrations/001_schema.sql`**:
   - Creates tables: `profiles`, `categories`, `menu_items`, `orders`, `order_items`, `reservations`, `enquiries`, `reviews`, `offers`, `gallery`, `settings`.
   - Creates `order_number_seq` for human-readable IDs (`NV-1001`).
   - Sets up triggers for auto-updating timestamps and auth user profile creation.
2. **`supabase/migrations/002_rls.sql`**:
   - Enables Row Level Security on all tables.
   - Defines `is_admin()` helper function.
   - Creates secure public policies (read active catalog, insert reviews with `is_approved = false`).
   - Creates secure Postgres RPC functions:
     - `place_order(customer, items)`: Checks restaurant open status, verifies DB prices, enforces minimum order, and records orders.
     - `track_order(order_number, phone)`: Safe verification without leaking data.
     - `check_table_availability(date, time, table_type)`: Prevents double booking.
     - `check_phone_rate_limit(phone, table)`: Anti-spam throttle (max 5 per hour).
3. **`supabase/migrations/003_seed.sql`**:
   - Populates categories (Kathiyawadi, Punjabi, South Indian, Chinese, Continental, Desserts, Beverages).
   - Inserts 30+ authentic dishes with ₹ prices and photography.
   - Inserts default settings with Rajkot coordinates (`22.2828711, 70.7381186`).
   - Inserts sample active offers, verified testimonials, and gallery images.
4. **`supabase/migrations/004_storage.sql`**:
   - Creates public buckets `menu-images` and `gallery`.
   - Sets RLS policies so public can view and only admins can upload/delete.

---

## 👑 Creating the First Owner Admin

1. Sign up a new user via Supabase Auth (or have them log in once).
2. In the Supabase SQL Editor, run:
```sql
UPDATE public.profiles
SET role = 'owner'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```
3. Now log in at `#/admin` with that email and password to access the full Owner Dashboard!

*(Note: For instant local testing without live Supabase credentials, the app includes a graceful demo fallback mode where logging in with `owner@nandanvan.com` / `admin123` unlocks the Admin Portal immediately).*

---

## ⚡ Edge Function Deployment (Owner Notification)

The Edge Function at `supabase/functions/notify-owner` triggers email alerts via Resend and formats instant WhatsApp links.

1. Install the Supabase CLI:
```bash
npm install -g supabase
```
2. Login and link your project:
```bash
supabase login
supabase link --project-ref your-project-ref
```
3. Set your secrets:
```bash
supabase secrets set RESEND_API_KEY=re_123456789
supabase secrets set OWNER_EMAIL=reservations@nandanvanrajkot.com
supabase secrets set OWNER_WHATSAPP=+919825084721
```
4. Deploy the function:
```bash
supabase functions deploy notify-owner
```
5. In Supabase Dashboard -> **Database -> Webhooks**, create webhooks on `orders`, `reservations`, and `enquiries` table `INSERT` events pointing to this Edge Function.

---

## 🌐 Production Deployment

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. In Project Settings -> **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Deploying to Netlify
1. Connect your repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables under **Site configuration -> Environment variables**.

---

## 📱 Mobile & Responsive Testing
Tested across:
- **Mobile (375px):** Touch friendly, responsive navigation drawer, sticky category bar, 2D floorplan fallback.
- **Tablet (768px):** Adaptive 2-column menu and booking grid.
- **Desktop (1280px+):** Full 3D Three.js rotating thali scene, 3D interactive table selector, custom gold cursor.

---

© 2026 **Nandanvan Multicuisine Restaurant**, Near Munjka, Kalawad Road, Rajkot, Gujarat.
Built with ❤️ for culinary excellence.
