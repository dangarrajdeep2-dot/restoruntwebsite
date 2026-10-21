-- ====================================================================
-- 003_seed.sql: Master Seed Data for Nandanvan Multicuisine Restaurant
-- ====================================================================

-- 1. SETTINGS ROW
INSERT INTO public.settings (
  restaurant_name,
  phone,
  whatsapp,
  email,
  address,
  google_maps_url,
  latitude,
  longitude,
  opening_time,
  closing_time,
  is_open,
  delivery_charge,
  min_order,
  announcement
) VALUES (
  'Nandanvan Multicuisine Restaurant',
  '+91 98250 84721',
  '+91 98250 84721',
  'reservations@nandanvanrajkot.com',
  'Near Munjka, Kalawad Road, Rajkot, Gujarat 360005, India',
  'https://maps.app.goo.gl/134VLgimHLRd4Gx8A',
  22.2828711,
  70.7381186,
  '11:00:00',
  '23:30:00',
  TRUE,
  40.00,
  200.00,
  '✨ Experience royal dining in Rajkot. Book your weekend table in advance! Flat 15% off on dine-in above ₹1500.'
) ON CONFLICT DO NOTHING;

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, slug, sort_order, description, icon) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Kathiyawadi & Gujarati', 'kathiyawadi-gujarati', 1, 'Authentic Saurashtra flavors, desi ghee tadka, and traditional clay-pot specials', 'Soup'),
  ('c2222222-2222-2222-2222-222222222222', 'Royal Punjabi & North Indian', 'royal-punjabi', 2, 'Rich gravies, slow-cooked paneer, and tandoori charcoal delights', 'Flame'),
  ('c3333333-3333-3333-3333-333333333333', 'South Indian Flavors', 'south-indian', 3, 'Crispy paper dosas, fluffy idlis, and fragrant coconut chutney', 'Utensils'),
  ('c4444444-4444-4444-4444-444444444444', 'Indo-Chinese Fusion', 'indo-chinese', 4, 'Wok-tossed noodles, spicy manchurian, and crispy schezwan starters', 'ChefHat'),
  ('c5555555-5555-5555-5555-555555555555', 'Sizzlers & Continental', 'sizzlers-continental', 5, 'Steaming hot sizzlers, artisanal pasta, and garlic butter toasts', 'Sparkles'),
  ('c6666666-6666-6666-6666-666666666666', 'Tandoori Breads & Rice', 'breads-rice', 6, 'Butter naan, garlic kulcha, dum pukht biryani, and jeera rice', 'Wheat'),
  ('c7777777-7777-7777-7777-777777777777', 'Royal Desserts & Mithai', 'desserts', 7, 'Traditional shrikhand, sizzling brownie, gulab jamun, and artisanal kulfi', 'IceCream'),
  ('c8888888-8888-8888-8888-888888888888', 'Beverages & Mocktails', 'beverages', 8, 'Desi chaas, fresh fruit mojitos, thick shakes, and saffron lassi', 'Coffee')
ON CONFLICT (slug) DO NOTHING;

-- 3. MENU ITEMS (30+ dishes)
INSERT INTO public.menu_items (category_id, name, description, price, type, spice_level, image_url, chef_special, is_available, calories, preparation_time) VALUES
  -- Kathiyawadi & Gujarati
  ('c1111111-1111-1111-1111-111111111111', 'Ringan No Olo (Desi Baingan Bharta)', 'Smoky roasted eggplant mashed and slow-cooked in pure groundnut oil with green garlic and red chillies.', 220.00, 'veg', 2, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 260, 20),
  ('c1111111-1111-1111-1111-111111111111', 'Kathiyawadi Sev Tameta Nu Shaak', 'Tangy vine tomatoes simmered in a spicy Saurashtra masala topped with generous Ratlami sev.', 190.00, 'veg', 3, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 310, 15),
  ('c1111111-1111-1111-1111-111111111111', 'Lasaniya Bataka (Garlic Baby Potatoes)', 'Tender baby potatoes drenched in a fiery Kathiyawadi garlic-chili paste and mustard tempering.', 195.00, 'veg', 3, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 290, 15),
  ('c1111111-1111-1111-1111-111111111111', 'Bajra No Rotlo with Desi Makhan & Gol', 'Traditional hand-patted pearl millet flatbread served with homemade white churned butter and organic jaggery.', 90.00, 'veg', 1, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 220, 15),
  ('c1111111-1111-1111-1111-111111111111', 'Bharela Bhinda Masala (Jain Available)', 'Baby okra stuffed with roasted gram flour, crushed peanuts, sesame seeds, and fragrant spices.', 210.00, 'jain', 2, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 240, 20),

  -- Royal Punjabi
  ('c2222222-2222-2222-2222-222222222222', 'Nandanvan Special Paneer Tikka Lababdar', 'Charcoal-grilled cottage cheese cubes simmered in a luscious cashew-tomato gravy garnished with cream.', 320.00, 'veg', 2, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 420, 25),
  ('c2222222-2222-2222-2222-222222222222', 'Dal Bukhara (24-Hour Slow Cooked)', 'Velvety black lentils simmered overnight with tomatoes, butter, and cream on a low wood fire.', 280.00, 'veg', 1, 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 380, 20),
  ('c2222222-2222-2222-2222-222222222222', 'Kadhai Paneer Shahi', 'Fresh cottage cheese, crisp bell peppers, and whole coriander seeds cooked in freshly ground kadhai masala.', 300.00, 'veg', 2, 'https://images.unsplash.com/photo-1567184109411-b28f2b740523?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 370, 20),
  ('c2222222-2222-2222-2222-222222222222', 'Mushroom Do Pyaza', 'Button mushrooms and carmelized pearl onions folded into a rich golden onion-tomato gravy.', 290.00, 'veg', 2, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 280, 20),
  ('c2222222-2222-2222-2222-222222222222', 'Malai Kofta Imperial (Jain Available)', 'Delicate dumplings of paneer and dried fruits bathed in a sweet, velvety white cashew cream sauce.', 310.00, 'jain', 1, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 440, 25),

  -- South Indian Flavors
  ('c3333333-3333-3333-3333-333333333333', 'Mysore Masala Dosa with Ghee', 'Crispy fermented rice crepe smeared with fiery red garlic chutney and spiced potato masala.', 180.00, 'veg', 2, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 320, 15),
  ('c3333333-3333-3333-3333-333333333333', 'Cheese Burst Paper Dosa', 'Ultra-crispy giant paper dosa loaded with melted mozzarella and cheddar cheese.', 240.00, 'veg', 1, 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 410, 15),
  ('c3333333-3333-3333-3333-333333333333', 'Steamed Ghee Podi Idli (4 Pcs)', 'Melt-in-mouth steamed rice cakes tossed in aromatic spiced gun-powder and farm-fresh pure ghee.', 150.00, 'veg', 2, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 220, 12),
  ('c3333333-3333-3333-3333-333333333333', 'Onion Uttapam with Trio Chutneys', 'Thick savory pancake topped with sweet caramelised onions, green chilies, and fresh coriander.', 160.00, 'veg', 1, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 270, 15),

  -- Indo-Chinese Fusion
  ('c4444444-4444-4444-4444-444444444444', 'Paneer Chilli Dry (Wok Tossed)', 'Crispy cubes of cottage cheese tossed with bell peppers, spring onion, ginger, and dark soy sauce.', 270.00, 'veg', 3, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 340, 18),
  ('c4444444-4444-4444-4444-444444444444', 'Veg Manchurian Gravy', 'Crisp vegetable dumplings simmered in an aromatic dark garlic, ginger, and scallion broth.', 240.00, 'veg', 2, 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 310, 18),
  ('c4444444-4444-4444-4444-444444444444', 'Schezwan Fried Rice & Crispy Noodles', 'Wok-charred basmati rice stir-fried with seasonal veggies in our house-crafted fiery Schezwan paste.', 230.00, 'veg', 3, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 360, 15),
  ('c4444444-4444-4444-4444-444444444444', 'Crispy Thread Paneer with Plum Dip', 'Fine wonton pastry threads wrapped around marinated spiced paneer strips and fried golden.', 290.00, 'veg', 2, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 380, 20),

  -- Sizzlers & Continental
  ('c5555555-5555-5555-5555-555555555555', 'Nandanvan Signature Paneer Steak Sizzler', 'Marinated grilled paneer steak on buttered herb rice, grilled exotic vegetables, french fries, and pepper sauce.', 390.00, 'veg', 2, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 560, 25),
  ('c5555555-5555-5555-5555-555555555555', 'Wild Mushroom Penne Alfredo', 'Al dente penne pasta tossed in a velvety parmesan and garlic cream sauce with sauteed cremini mushrooms.', 320.00, 'veg', 1, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281682?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 480, 20),
  ('c5555555-5555-5555-5555-555555555555', 'Classic Margherita Pizza (Wood-Fired Style)', 'Hand-stretched thin crust topped with San Marzano tomato sauce, fresh mozzarella, and sweet basil leaves.', 310.00, 'veg', 1, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 520, 20),

  -- Tandoori Breads & Rice
  ('c6666666-6666-6666-6666-666666666666', 'Dum Handi Veg Biryani with Burani Raita', 'Fragrant aged long-grain basmati rice layered with spiced garden vegetables, saffron milk, and fried onions.', 290.00, 'veg', 2, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 410, 25),
  ('c6666666-6666-6666-6666-666666666666', 'Chilli Garlic Butter Naan', 'Clay-oven baked refined flour bread infused with roasted garlic, fresh cilantro, and green chilli.', 75.00, 'veg', 2, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 190, 10),
  ('c6666666-6666-6666-6666-666666666666', 'Amritsari Paneer Stuffed Kulcha', 'Flaky tandoori kulcha packed with spiced grated paneer and carom seeds, brushed with butter.', 95.00, 'veg', 2, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 260, 12),
  ('c6666666-6666-6666-6666-666666666666', 'Jeera Rice with Desi Ghee', 'Fluffy aromatic basmati rice tempered with roasted cumin seeds and farm fresh ghee.', 160.00, 'veg', 1, 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 220, 12),

  -- Desserts & Mithai
  ('c7777777-7777-7777-7777-777777777777', 'Rajwadi Saffron Shrikhand with Pistachios', 'Velvety hung curd blended with Kashmiri saffron strands, green cardamom, and slivered almonds.', 160.00, 'veg', 1, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 290, 5),
  ('c7777777-7777-7777-7777-777777777777', 'Sizzling Hot Brownie with Vanilla Bean Gelato', 'Decadent dark chocolate brownie served on a cast iron sizzler platter with hot Belgian fudge sauce.', 220.00, 'veg', 1, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 480, 10),
  ('c7777777-7777-7777-7777-777777777777', 'Gulab Jamun with Rabdi Parfait', 'Hot golden milk-solid dumplings soaked in rose-cardamom syrup paired with thick slow-reduced rabdi.', 180.00, 'veg', 1, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 380, 10),

  -- Beverages & Mocktails
  ('c8888888-8888-8888-8888-888888888888', 'Kathiyawadi Masala Chaas (Spiced Buttermilk)', 'Chilled light buttermilk churned with roasted cumin, rock salt, mint, and fresh green chili.', 50.00, 'veg', 1, 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 60, 5),
  ('c8888888-8888-8888-8888-888888888888', 'Royal Kesar Badam Lassi in Clay Kulhad', 'Rich thick yogurt blended with saffron, crushed badam, and pistachios topped with malai.', 120.00, 'veg', 1, 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80', TRUE, TRUE, 260, 8),
  ('c8888888-8888-8888-8888-888888888888', 'Nandanvan Paradise Blue Lagoon Mojito', 'Crushed fresh garden mint, lime wedges, blue curacao syrup, and sparkling soda over crushed ice.', 150.00, 'veg', 1, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', FALSE, TRUE, 140, 5)
ON CONFLICT DO NOTHING;

-- 4. TODAY'S OFFERS
INSERT INTO public.offers (title, description, discount_text, code, valid_till, is_active, banner_url) VALUES
  ('Royal Feast Dine-in Discount', 'Enjoy flat 20% off on all billings above ₹1,500 when dining at our Munjka garden restaurant.', '20% OFF', 'ROYAL20', NOW() + INTERVAL '7 days', TRUE, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'),
  ('Free Sizzling Brownie on Family Tables', 'Order any 4 main courses and receive our chef special Sizzling Brownie with Rabdi completely free.', 'FREE DESSERT', 'SWEETFEAST', NOW() + INTERVAL '5 days', TRUE, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'),
  ('Free Home Delivery in Rajkot', 'Zero delivery charge across Rajkot on online orders above ₹499.', 'FREE DELIVERY', 'DELFREE', NOW() + INTERVAL '14 days', TRUE, 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80')
ON CONFLICT DO NOTHING;

-- 5. REVIEWS (Approved testimonials)
INSERT INTO public.reviews (name, rating, comment, is_approved, avatar_url) VALUES
  ('Harshvardhan Jadeja', 5, 'Best multicuisine restaurant near Munjka! The Dal Bukhara and Ringan No Olo with hot bajra rotlo were out of this world. Outstanding garden ambiance for families.', TRUE, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
  ('Pooja Patel', 5, 'Hosted my daughter''s birthday party at Nandanvan. Staff hospitality was 10/10, food was served hot and delicious, and the evening lighting is magical.', TRUE, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'),
  ('Dr. Jayesh Mehta', 5, 'Their Jain preparation is strictly pure and extraordinarily flavorful. The Malai Kofta and Bharela Bhinda tasted heavenly. Highly recommended in Rajkot.', TRUE, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'),
  ('Ananya Trivedi', 5, 'The 3D interactive table booking on their website was seamless. When we reached, our 6-seater family booth was ready with welcome drinks. Loved the experience!', TRUE, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80')
ON CONFLICT DO NOTHING;

-- 6. GALLERY IMAGES
INSERT INTO public.gallery (image_url, caption, category) VALUES
  ('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 'Royal Garden Dining Ambiance at Dusk', 'ambiance'),
  ('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', 'Warm Intimate Seating & Chandeliers', 'ambiance'),
  ('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80', 'Signature Clay-Pot Kathiyawadi Platter', 'food'),
  ('https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80', 'Paneer Tikka Lababdar with Charred Tandoori Naan', 'food'),
  ('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', 'Nandanvan Sizzler Platter with Exotic Herbs', 'food'),
  ('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', 'Grand Banquet Hall for Weddings & Engagements', 'events'),
  ('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', 'Lush Green Outdoor Lawn for Celebrations', 'outdoor'),
  ('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80', 'Master Chefs preparing Authentic Flavors', 'chef')
ON CONFLICT DO NOTHING;
