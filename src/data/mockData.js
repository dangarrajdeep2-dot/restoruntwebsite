// Master fallback mock dataset matching 003_seed.sql
export const initialSettings = {
  restaurant_name: 'Nandanvan Multicuisine Restaurant',
  phone: '+91 98250 84721',
  whatsapp: '+91 98250 84721',
  email: 'reservations@nandanvanrajkot.com',
  address: 'Near Munjka, Kalawad Road, Rajkot, Gujarat 360005, India',
  google_maps_url: 'https://maps.app.goo.gl/134VLgimHLRd4Gx8A',
  latitude: 22.2828711,
  longitude: 70.7381186,
  opening_time: '11:00:00',
  closing_time: '23:30:00',
  is_open: true,
  delivery_charge: 40.00,
  min_order: 200.00,
  zomato_url: 'https://www.zomato.com/rajkot/restaurants?q=Nandanvan',
  upi_id: 'nandanvan@oksbi',
  upi_name: 'Nandanvan Multicuisine Restaurant',
  gst_rate: 5,
  announcement: '✨ Experience royal dining in Rajkot. Book your weekend table in advance! Flat 15% off on dine-in above ₹1500.'
};

export const initialCategories = [
  { id: 'c1111111-1111-1111-1111-111111111111', name: 'Kathiyawadi & Gujarati', slug: 'kathiyawadi-gujarati', sort_order: 1, description: 'Authentic Saurashtra flavors, desi ghee tadka, and traditional clay-pot specials', icon: 'Soup' },
  { id: 'c2222222-2222-2222-2222-222222222222', name: 'Royal Punjabi & North Indian', slug: 'royal-punjabi', sort_order: 2, description: 'Rich gravies, slow-cooked paneer, and tandoori charcoal delights', icon: 'Flame' },
  { id: 'c3333333-3333-3333-3333-333333333333', name: 'South Indian Flavors', slug: 'south-indian', sort_order: 3, description: 'Crispy paper dosas, fluffy idlis, and fragrant coconut chutney', icon: 'Utensils' },
  { id: 'c4444444-4444-4444-4444-444444444444', name: 'Indo-Chinese Fusion', slug: 'indo-chinese', sort_order: 4, description: 'Wok-tossed noodles, spicy manchurian, and crispy schezwan starters', icon: 'ChefHat' },
  { id: 'c5555555-5555-5555-5555-555555555555', name: 'Sizzlers & Continental', slug: 'sizzlers-continental', sort_order: 5, description: 'Steaming hot sizzlers, artisanal pasta, and garlic butter toasts', icon: 'Sparkles' },
  { id: 'c6666666-6666-6666-6666-666666666666', name: 'Tandoori Breads & Rice', slug: 'breads-rice', sort_order: 6, description: 'Butter naan, garlic kulcha, dum pukht biryani, and jeera rice', icon: 'Wheat' },
  { id: 'c7777777-7777-7777-7777-777777777777', name: 'Royal Desserts & Mithai', slug: 'desserts', sort_order: 7, description: 'Traditional shrikhand, sizzling brownie, gulab jamun, and artisanal kulfi', icon: 'IceCream' },
  { id: 'c8888888-8888-8888-8888-888888888888', name: 'Beverages & Mocktails', slug: 'beverages', sort_order: 8, description: 'Desi chaas, fresh fruit mojitos, thick shakes, and saffron lassi', icon: 'Coffee' }
];

export const initialMenuItems = [
  // Kathiyawadi & Gujarati
  {
    id: 'm1',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Ringan No Olo (Desi Baingan Bharta)',
    description: 'Smoky roasted eggplant mashed and slow-cooked in pure groundnut oil with green garlic and red chillies.',
    price: 220,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 260,
    preparation_time: 20
  },
  {
    id: 'm2',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Kathiyawadi Sev Tameta Nu Shaak',
    description: 'Tangy vine tomatoes simmered in a spicy Saurashtra masala topped with generous Ratlami sev.',
    price: 190,
    type: 'veg',
    spice_level: 3,
    image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 310,
    preparation_time: 15
  },
  {
    id: 'm3',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Lasaniya Bataka (Garlic Baby Potatoes)',
    description: 'Tender baby potatoes drenched in a fiery Kathiyawadi garlic-chili paste and mustard tempering.',
    price: 195,
    type: 'veg',
    spice_level: 3,
    image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 290,
    preparation_time: 15
  },
  {
    id: 'm4',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Bajra No Rotlo with Desi Makhan & Gol',
    description: 'Traditional hand-patted pearl millet flatbread served with homemade white churned butter and organic jaggery.',
    price: 90,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 220,
    preparation_time: 15
  },
  {
    id: 'm5',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Bharela Bhinda Masala (Jain Friendly)',
    description: 'Baby okra stuffed with roasted gram flour, crushed peanuts, sesame seeds, and fragrant spices.',
    price: 210,
    type: 'jain',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 240,
    preparation_time: 20
  },

  // Royal Punjabi
  {
    id: 'm6',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Nandanvan Special Paneer Tikka Lababdar',
    description: 'Charcoal-grilled cottage cheese cubes simmered in a luscious cashew-tomato gravy garnished with cream.',
    price: 320,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 420,
    preparation_time: 25
  },
  {
    id: 'm7',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Dal Bukhara (24-Hour Slow Cooked)',
    description: 'Velvety black lentils simmered overnight with tomatoes, butter, and cream on a low wood fire.',
    price: 280,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 380,
    preparation_time: 20
  },
  {
    id: 'm8',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Kadhai Paneer Shahi',
    description: 'Fresh cottage cheese, crisp bell peppers, and whole coriander seeds cooked in freshly ground kadhai masala.',
    price: 300,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1567184109411-b28f2b740523?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 370,
    preparation_time: 20
  },
  {
    id: 'm9',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Malai Kofta Imperial (Jain)',
    description: 'Delicate dumplings of paneer and dried fruits bathed in a sweet, velvety white cashew cream sauce.',
    price: 310,
    type: 'jain',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 440,
    preparation_time: 25
  },

  // South Indian
  {
    id: 'm10',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Mysore Masala Dosa with Ghee',
    description: 'Crispy fermented rice crepe smeared with fiery red garlic chutney and spiced potato masala.',
    price: 180,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 320,
    preparation_time: 15
  },
  {
    id: 'm11',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Cheese Burst Paper Dosa',
    description: 'Ultra-crispy giant paper dosa loaded with melted mozzarella and cheddar cheese.',
    price: 240,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 410,
    preparation_time: 15
  },
  {
    id: 'm12',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Steamed Ghee Podi Idli (4 Pcs)',
    description: 'Melt-in-mouth steamed rice cakes tossed in aromatic spiced gun-powder and farm-fresh pure ghee.',
    price: 150,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 220,
    preparation_time: 12
  },

  // Indo-Chinese
  {
    id: 'm13',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Paneer Chilli Dry (Wok Tossed)',
    description: 'Crispy cubes of cottage cheese tossed with bell peppers, spring onion, ginger, and dark soy sauce.',
    price: 270,
    type: 'veg',
    spice_level: 3,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 340,
    preparation_time: 18
  },
  {
    id: 'm14',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Veg Manchurian Gravy',
    description: 'Crisp vegetable dumplings simmered in an aromatic dark garlic, ginger, and scallion broth.',
    price: 240,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 310,
    preparation_time: 18
  },
  {
    id: 'm15',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Schezwan Fried Rice & Crispy Noodles',
    description: 'Wok-charred basmati rice stir-fried with seasonal veggies in our house-crafted fiery Schezwan paste.',
    price: 230,
    type: 'veg',
    spice_level: 3,
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 360,
    preparation_time: 15
  },

  // Sizzlers & Continental
  {
    id: 'm16',
    category_id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Nandanvan Signature Paneer Steak Sizzler',
    description: 'Marinated grilled paneer steak on buttered herb rice, grilled exotic vegetables, french fries, and pepper sauce.',
    price: 390,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 560,
    preparation_time: 25
  },
  {
    id: 'm17',
    category_id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Wild Mushroom Penne Alfredo',
    description: 'Al dente penne pasta tossed in a velvety parmesan and garlic cream sauce with sauteed cremini mushrooms.',
    price: 320,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281682?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 480,
    preparation_time: 20
  },
  {
    id: 'm18',
    category_id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Classic Margherita Wood-Fired Pizza',
    description: 'Hand-stretched thin crust topped with San Marzano tomato sauce, fresh mozzarella, and sweet basil leaves.',
    price: 310,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 520,
    preparation_time: 20
  },

  // Breads & Rice
  {
    id: 'm19',
    category_id: 'c6666666-6666-6666-6666-666666666666',
    name: 'Dum Handi Veg Biryani with Burani Raita',
    description: 'Fragrant aged long-grain basmati rice layered with spiced garden vegetables, saffron milk, and fried onions.',
    price: 290,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 410,
    preparation_time: 25
  },
  {
    id: 'm20',
    category_id: 'c6666666-6666-6666-6666-666666666666',
    name: 'Chilli Garlic Butter Naan',
    description: 'Clay-oven baked refined flour bread infused with roasted garlic, fresh cilantro, and green chilli.',
    price: 75,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 190,
    preparation_time: 10
  },
  {
    id: 'm21',
    category_id: 'c6666666-6666-6666-6666-666666666666',
    name: 'Amritsari Paneer Stuffed Kulcha',
    description: 'Flaky tandoori kulcha packed with spiced grated paneer and carom seeds, brushed with butter.',
    price: 95,
    type: 'veg',
    spice_level: 2,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 260,
    preparation_time: 12
  },

  // Desserts
  {
    id: 'm22',
    category_id: 'c7777777-7777-7777-7777-777777777777',
    name: 'Rajwadi Saffron Shrikhand with Pistachios',
    description: 'Velvety hung curd blended with Kashmiri saffron strands, green cardamom, and slivered almonds.',
    price: 160,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 290,
    preparation_time: 5
  },
  {
    id: 'm23',
    category_id: 'c7777777-7777-7777-7777-777777777777',
    name: 'Sizzling Hot Brownie with Vanilla Gelato',
    description: 'Decadent dark chocolate brownie served on a cast iron sizzler platter with hot Belgian fudge sauce.',
    price: 220,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 480,
    preparation_time: 10
  },
  {
    id: 'm24',
    category_id: 'c7777777-7777-7777-7777-777777777777',
    name: 'Gulab Jamun with Rabdi Parfait',
    description: 'Hot golden milk-solid dumplings soaked in rose-cardamom syrup paired with thick slow-reduced rabdi.',
    price: 180,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 380,
    preparation_time: 10
  },

  // Beverages
  {
    id: 'm25',
    category_id: 'c8888888-8888-8888-8888-888888888888',
    name: 'Kathiyawadi Masala Chaas (Spiced Buttermilk)',
    description: 'Chilled light buttermilk churned with roasted cumin, rock salt, mint, and fresh green chili.',
    price: 50,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 60,
    preparation_time: 5
  },
  {
    id: 'm26',
    category_id: 'c8888888-8888-8888-8888-888888888888',
    name: 'Royal Kesar Badam Lassi in Clay Kulhad',
    description: 'Rich thick yogurt blended with saffron, crushed badam, and pistachios topped with malai.',
    price: 120,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80',
    chef_special: true,
    is_available: true,
    calories: 260,
    preparation_time: 8
  },
  {
    id: 'm27',
    category_id: 'c8888888-8888-8888-8888-888888888888',
    name: 'Nandanvan Paradise Blue Lagoon Mojito',
    description: 'Crushed fresh garden mint, lime wedges, blue curacao syrup, and sparkling soda over crushed ice.',
    price: 150,
    type: 'veg',
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    chef_special: false,
    is_available: true,
    calories: 140,
    preparation_time: 5
  }
];

export const initialOffers = [
  {
    id: 'o1',
    title: 'Royal Feast Dine-in Discount',
    description: 'Enjoy flat 20% off on all billings above ₹1,500 when dining at our Munjka garden restaurant.',
    discount_text: '20% OFF',
    code: 'ROYAL20',
    valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'o2',
    title: 'Free Sizzling Brownie on Family Tables',
    description: 'Order any 4 main courses and receive our chef special Sizzling Brownie with Rabdi completely free.',
    discount_text: 'FREE DESSERT',
    code: 'SWEETFEAST',
    valid_till: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    banner_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'o3',
    title: 'Free Home Delivery Across Rajkot',
    description: 'Zero delivery charge across Rajkot city on all online orders above ₹499.',
    discount_text: 'FREE DELIVERY',
    code: 'DELFREE',
    valid_till: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    banner_url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80'
  }
];

export const initialReviews = [
  {
    id: 'r1',
    name: 'Harshvardhan Jadeja',
    rating: 5,
    comment: 'Best multicuisine restaurant near Munjka! The Dal Bukhara and Ringan No Olo with hot bajra rotlo were out of this world. Outstanding garden ambiance for families.',
    is_approved: true,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    created_at: '2026-10-18T19:30:00Z'
  },
  {
    id: 'r2',
    name: 'Pooja Patel',
    rating: 5,
    comment: 'Hosted my daughter\'s birthday party at Nandanvan. Staff hospitality was 10/10, food was served hot and delicious, and the evening lighting is magical.',
    is_approved: true,
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    created_at: '2026-10-16T14:20:00Z'
  },
  {
    id: 'r3',
    name: 'Dr. Jayesh Mehta',
    rating: 5,
    comment: 'Their Jain preparation is strictly pure and extraordinarily flavorful. The Malai Kofta and Bharela Bhinda tasted heavenly. Highly recommended in Rajkot.',
    is_approved: true,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    created_at: '2026-10-14T20:10:00Z'
  },
  {
    id: 'r4',
    name: 'Ananya Trivedi',
    rating: 5,
    comment: 'The 3D interactive table booking on their website was seamless. When we reached, our 6-seater family booth was ready with welcome drinks. Loved the experience!',
    is_approved: true,
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    created_at: '2026-10-12T21:00:00Z'
  }
];

export const initialGallery = [
  { id: 'g1', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', caption: 'Royal Garden Dining Ambiance at Dusk', category: 'ambiance' },
  { id: 'g2', image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', caption: 'Warm Intimate Seating & Chandeliers', category: 'ambiance' },
  { id: 'g3', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80', caption: 'Signature Clay-Pot Kathiyawadi Platter', category: 'food' },
  { id: 'g4', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80', caption: 'Paneer Tikka Lababdar with Charred Tandoori Naan', category: 'food' },
  { id: 'g5', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', caption: 'Nandanvan Sizzler Platter with Exotic Herbs', category: 'food' },
  { id: 'g6', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', caption: 'Grand Banquet Hall for Weddings & Engagements', category: 'events' },
  { id: 'g7', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', caption: 'Lush Green Outdoor Lawn for Celebrations', category: 'outdoor' },
  { id: 'g8', image_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80', caption: 'Master Chefs preparing Authentic Flavors', category: 'chef' }
];

export const initialOrders = [
  {
    id: 'ord-101',
    order_number: 'NV-1001',
    customer_name: 'Rajesh Shah',
    phone: '9825123456',
    address: 'B-402, Royal Palace, Kalawad Road, Rajkot',
    order_type: 'delivery',
    payment_method: 'UPI',
    subtotal: 790,
    delivery_charge: 0,
    total: 790,
    status: 'preparing',
    notes: 'Please keep green chutney extra spicy.',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    items: [
      { name: 'Nandanvan Special Paneer Tikka Lababdar', price: 320, qty: 1 },
      { name: 'Dum Handi Veg Biryani with Burani Raita', price: 290, qty: 1 },
      { name: 'Chilli Garlic Butter Naan', price: 75, qty: 2 }
    ]
  },
  {
    id: 'ord-102',
    order_number: 'NV-1002',
    customer_name: 'Meera Vora',
    phone: '9898123456',
    address: 'Table 4 (Garden Terrace)',
    order_type: 'dine-in',
    payment_method: 'UPI',
    subtotal: 630,
    delivery_charge: 0,
    total: 630,
    status: 'confirmed',
    notes: 'Jain preparation for all items.',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    items: [
      { name: 'Bharela Bhinda Masala (Jain Friendly)', price: 210, qty: 1 },
      { name: 'Malai Kofta Imperial (Jain)', price: 310, qty: 1 },
      { name: 'Kathiyawadi Masala Chaas (Spiced Buttermilk)', price: 50, qty: 2 }
    ]
  }
];

export const initialReservations = [
  {
    id: 'res-1',
    name: 'Sanjaybhai Patel',
    phone: '9924567890',
    email: 'sanjay.patel@gmail.com',
    date: '2026-10-22',
    time: '20:00:00',
    guests: 6,
    occasion: 'family_dinner',
    table_type: 'family-booth',
    special_request: 'Quiet corner booth with garden view.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'res-2',
    name: 'Devangi Shukla',
    phone: '9876543210',
    email: 'devangi.s@yahoo.com',
    date: '2026-10-22',
    time: '19:30:00',
    guests: 2,
    occasion: 'anniversary',
    table_type: '2-seater',
    special_request: 'Rose petal table decoration requested.',
    status: 'pending',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  }
];

export const initialEnquiries = [
  {
    id: 'enq-1',
    name: 'Bhavin Bhatt',
    phone: '9428012345',
    event_type: 'wedding',
    event_date: '2026-11-20',
    guests: 250,
    message: 'Need full catering and lawn lawn booking for an evening wedding reception. Need Kathiyawadi + Punjabi menu tasting.',
    status: 'new',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  }
];
