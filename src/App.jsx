import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import FloatingButtons from './components/FloatingButtons';
import Footer from './components/Footer';

// Sections
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import MenuSection from './sections/MenuSection';
import CartDrawer from './sections/CartDrawer';
import TrackOrderModal from './sections/TrackOrderModal';
import ReservationSection from './sections/ReservationSection';
import OffersSection from './sections/OffersSection';
import GallerySection from './sections/GallerySection';
import TestimonialsSection from './sections/TestimonialsSection';
import EventsSection from './sections/EventsSection';
import ContactSection from './sections/ContactSection';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReservations from './pages/admin/AdminReservations';
import AdminMenu from './pages/admin/AdminMenu';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOffers from './pages/admin/AdminOffers';
import AdminGallery from './pages/admin/AdminGallery';
import AdminReviews from './pages/admin/AdminReviews';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';
import NotFound from './pages/NotFound';

import { useAuth } from './context/AuthContext';
import { getSettings } from './api/settings';

export default function App() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [adminTab, setAdminTab] = useState('dashboard');
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [settings, setSettings] = useState(null);

  // Hash router
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    async function loadSiteSettings() {
      const { data } = await getSettings();
      if (data) setSettings(data);
    }
    loadSiteSettings();
  }, []);

  const handleOpenReserve = () => {
    const elem = document.getElementById('reservation');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreMenu = () => {
    const elem = document.getElementById('menu');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTrackOrder = (orderNum = '', phone = '') => {
    setTrackOrderNumber(orderNum);
    setTrackPhone(phone);
    setTrackModalOpen(true);
  };

  // Route: /admin
  const isAdminRoute = currentHash.startsWith('#/admin');

  if (isAdminRoute) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-forest-950 flex items-center justify-center text-gold">
          <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>
      );
    }

    if (!user || !isAdmin) {
      return (
        <>
          <CustomCursor />
          <AdminLogin onLoginSuccess={() => setAdminTab('dashboard')} />
        </>
      );
    }

    return (
      <>
        <CustomCursor />
        <AdminLayout activeTab={adminTab} onSelectTab={setAdminTab}>
          {adminTab === 'dashboard' && <AdminDashboard onNavigate={setAdminTab} />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'reservations' && <AdminReservations />}
          {adminTab === 'menu' && <AdminMenu />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'offers' && <AdminOffers />}
          {adminTab === 'gallery' && <AdminGallery />}
          {adminTab === 'reviews' && <AdminReviews />}
          {adminTab === 'enquiries' && <AdminEnquiries />}
          {adminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      </>
    );
  }

  // Public Dining Website
  return (
    <div className="min-h-screen bg-forest-950 text-cream selection:bg-gold selection:text-forest-950 font-sans">
      <Preloader />
      <CustomCursor />
      
      {/* Top Navbar */}
      <Navbar
        onOpenReserve={handleOpenReserve}
        onOpenTrackOrder={() => handleOpenTrackOrder()}
        settings={settings}
      />

      {/* Main Public Sections in Order */}
      <main>
        <HeroSection
          onOpenReserve={handleOpenReserve}
          onExploreMenu={handleExploreMenu}
        />
        <AboutSection />
        <MenuSection />
        <ReservationSection />
        <OffersSection />
        <GallerySection />
        <TestimonialsSection />
        <EventsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <FloatingButtons
        phone={settings?.phone}
        whatsapp={settings?.whatsapp}
      />

      {/* Slide-in Cart Drawer */}
      <CartDrawer
        onOpenTrackOrder={handleOpenTrackOrder}
      />

      {/* Live Order Tracking Modal */}
      <TrackOrderModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        initialOrderNumber={trackOrderNumber}
        initialPhone={trackPhone}
      />
    </div>
  );
}
