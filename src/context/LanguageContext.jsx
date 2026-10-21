import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    restaurantName: 'Nandanvan',
    subtitle: 'Multicuisine Restaurant • Rajkot',
    tagline: 'A Taste of Paradise',
    heroDesc: 'Where royal Saurashtra tradition meets refined multicuisine dining. Set amidst tranquil landscaped greens near Munjka, Kalawad Road.',
    nav: {
      home: 'Home',
      about: 'About',
      menu: 'Menu',
      reservation: 'Reservation',
      offers: 'Offers',
      gallery: 'Gallery',
      reviews: 'Reviews',
      events: 'Events',
      contact: 'Contact',
      admin: 'Admin Portal',
      reserveTable: 'Reserve Table',
      orderOnline: 'Order Online'
    },
    menu: {
      title: 'Our Royal Menu',
      subtitle: 'Crafted with pure ingredients, hand-ground spices & centuries of culinary heritage',
      all: 'All Dishes',
      veg: 'Pure Veg',
      jain: 'Jain Friendly',
      nonVeg: 'Non-Veg',
      searchPlaceholder: 'Search dishes, e.g. Paneer Tikka, Biryani, Olo...',
      addToCart: 'Add to Cart',
      spiceLevel: 'Spice Level',
      chefSpecial: "Chef's Special",
      viewIn3D: 'View in 3D'
    },
    reservation: {
      title: 'Reserve Your Royal Table',
      subtitle: 'Select your preferred table in our 3D dining hall and reserve instantly',
      date: 'Reservation Date',
      time: 'Preferred Time',
      guests: 'Number of Guests',
      tableType: 'Table Seating',
      occasion: 'Special Occasion',
      specialRequests: 'Special Requests',
      submit: 'Confirm Reservation',
      success: 'Table Reserved Successfully!'
    },
    cart: {
      title: 'Your Royal Feast Cart',
      empty: 'Your cart is currently empty',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      total: 'Total Amount',
      checkout: 'Proceed to Checkout',
      orderType: 'Order Type',
      delivery: 'Doorstep Delivery',
      pickup: 'Takeaway / Pickup',
      dineIn: 'Dine-In Table Order',
      paymentMethod: 'Payment Mode',
      placeOrder: 'Place Secure Order'
    },
    contact: {
      openNow: 'Open Now',
      closed: 'Currently Closed',
      getDirections: 'Get Directions',
      callUs: 'Call Reception',
      whatsappUs: 'Chat on WhatsApp',
      addressTitle: 'Location & Address'
    }
  },
  gu: {
    restaurantName: 'નંદનવન',
    subtitle: 'મલ્ટીક્યુઝિન રેસ્ટોરન્ટ • રાજકોટ',
    tagline: 'સ્વાદનું સ્વર્ગ - નંદનવન',
    heroDesc: 'જ્યાં સૌરાષ્ટ્રની શાહી પરંપરા અને આધુનિક મલ્ટીક્યુઝિન સ્વાદનો અનોખો સંગમ થાય છે. મુંજકા, કાલાવડ રોડ પર કુદરતી હરિયાળી વચ્ચે.',
    nav: {
      home: 'મુખ્ય પૃષ્ઠ',
      about: 'અમારા વિશે',
      menu: 'મેનુ',
      reservation: 'ટેબલ બુકિંગ',
      offers: 'ઑફર્સ',
      gallery: 'ગેલેરી',
      reviews: 'અભિપ્રાય',
      events: 'બેન્ક્વેટ / ઇવેન્ટ્સ',
      contact: 'સંપર્ક',
      admin: 'એડમિન પોર્ટલ',
      reserveTable: 'ટેબલ બુક કરો',
      orderOnline: 'ઓનલાઈન ઓર્ડર'
    },
    menu: {
      title: 'અમારું શાહી મેનુ',
      subtitle: 'શુદ્ધ સામગ્રી, દેશી ઘીના તડકા અને પરંપરાગત સ્વાદ સાથે તૈયાર કરેલ વાનગીઓ',
      all: 'બધી વાનગીઓ',
      veg: 'શુદ્ધ શાકાહારી',
      jain: 'જૈન વાનગીઓ',
      nonVeg: 'નોન-વેજ',
      searchPlaceholder: 'વાનગી શોધો, જેમ કે પનીર, બિરયાની, ઓળો...',
      addToCart: 'કાર્ટમાં ઉમેરો',
      spiceLevel: 'તીખાશ સ્તર',
      chefSpecial: 'શેફ સ્પેશ્યલ',
      viewIn3D: '3D માં જુઓ'
    },
    reservation: {
      title: 'તમારું શાહી ટેબલ બુક કરો',
      subtitle: 'અમારા 3D હોલમાં તમારું મનપસંદ ટેબલ પસંદ કરો અને તુરંત કન્ફર્મ કરો',
      date: 'તારીખ',
      time: 'સમય',
      guests: 'મહેમાનોની સંખ્યા',
      tableType: 'બેઠક વ્યવસ્થા',
      occasion: 'પ્રસંગ',
      specialRequests: 'ખાસ વિનંતી',
      submit: 'બુકિંગ કન્ફર્મ કરો',
      success: 'ટેબલ સફળતાપૂર્વક બુક થઈ ગયું!'
    },
    cart: {
      title: 'તમારી વાનગીઓનું કાર્ટ',
      empty: 'કાર્ટ હજી ખાલી છે',
      subtotal: 'કુલ રકમ',
      deliveryFee: 'ડિલિવરી ચાર્જ',
      total: 'ચૂકવવાપાત્ર રકમ',
      checkout: 'ઓર્ડર કરો',
      orderType: 'ઓર્ડર પ્રકાર',
      delivery: 'હોમ ડિલિવરી',
      pickup: 'ટેકઅવે / પાર્સલ',
      dineIn: 'ટેબલ ડાઇન-ઇન',
      paymentMethod: 'ચૂકવણી પદ્ધતિ',
      placeOrder: 'ઓર્ડર સબમિટ કરો'
    },
    contact: {
      openNow: 'હમણાં ખુલ્લું છે',
      closed: 'હમણાં બંધ છે',
      getDirections: 'રસ્તો જુઓ (મેપ્સ)',
      callUs: 'કોલ કરો',
      whatsappUs: 'વોટ્સએપ કરો',
      addressTitle: 'સરનામું અને સ્થાન'
    }
  },
  hi: {
    restaurantName: 'नंदनवन',
    subtitle: 'मल्टीकुज़ीन रेस्टोरेंट • राजकोट',
    tagline: 'स्वाद का स्वर्ग - नंदनवन',
    heroDesc: 'काठियावाड़ी और शाही भारतीय जायके का अनूठा अनुभव। मुंजका, कालावड रोड, राजकोट में हरे-भरे प्राकृतिक माहौल के बीच।',
    nav: {
      home: 'होम',
      about: 'हमारे बारे में',
      menu: 'मेन्यू',
      reservation: 'टेबल बुकिंग',
      offers: 'ऑफर्स',
      gallery: 'गैलरी',
      reviews: 'समीक्षाएं',
      events: 'इवेंट्स और बैंक्वेट',
      contact: 'संपर्क',
      admin: 'एडमिन लॉगिन',
      reserveTable: 'टेबल बुक करें',
      orderOnline: 'ऑनलाइन ऑर्डर'
    },
    menu: {
      title: 'हमारा शाही मेन्यू',
      subtitle: 'शुद्ध सामग्री, देसी घी का तड़का और दिलकश लजीज व्यंजन',
      all: 'सभी व्यंजन',
      veg: 'शुद्ध शाकाहारी',
      jain: 'जैन अनुकूल',
      nonVeg: 'नॉन-वेज',
      searchPlaceholder: 'व्यंजन खोजें, जैसे पनीर टिक्का, दाल बुखारा...',
      addToCart: 'कार्ट में जोड़ें',
      spiceLevel: 'तीखापन',
      chefSpecial: 'शेफ स्पेशल',
      viewIn3D: '3D में देखें'
    },
    reservation: {
      title: 'शाही टेबल आरक्षित करें',
      subtitle: '3D डाइनिंग हॉल में पसंदीदा टेबल चुनें और तुरंत बुकिंग करें',
      date: 'तारीख',
      time: 'समय',
      guests: 'अतिथियों की संख्या',
      tableType: 'सीटिंग प्रकार',
      occasion: 'अवसर',
      specialRequests: 'विशेष अनुरोध',
      submit: 'आरक्षण सुनिश्चित करें',
      success: 'टेबल सफलतापूर्वक बुक हो गया!'
    },
    cart: {
      title: 'आपका भोजन कार्ट',
      empty: 'कार्ट अभी खाली है',
      subtotal: 'उपकुल',
      deliveryFee: 'डिलीवरी शुल्क',
      total: 'कुल राशि',
      checkout: 'चेकआउट आगे बढ़ाएं',
      orderType: 'ऑर्डर का प्रकार',
      delivery: 'होम डिलीवरी',
      pickup: 'पार्सल / टेकअवे',
      dineIn: 'डाइन-इन टेबल',
      paymentMethod: 'भुगतान विधि',
      placeOrder: 'ऑर्डर सबमिट करें'
    },
    contact: {
      openNow: 'अब खुला है',
      closed: 'फिलहाल बंद है',
      getDirections: 'रास्ता देखें (गूगल मैप)',
      callUs: 'कॉल करें',
      whatsappUs: 'व्हाट्सएप करें',
      addressTitle: 'स्थान और पता'
    }
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('nandanvan_lang') || 'en';
  });

  const changeLanguage = (newLang) => {
    if (['en', 'gu', 'hi'].includes(newLang)) {
      setLang(newLang);
      localStorage.setItem('nandanvan_lang', newLang);
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
