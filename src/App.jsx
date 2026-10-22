import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import FloatingButtons from './components/FloatingButtons';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';

// Public Sections (Fast, Responsive, 2D)
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
import AdminStaff from './pages/admin/AdminStaff';
import AdminSettings from './pages/admin/AdminSettings';
import PortalLogin from './pages/portal/PortalLogin';
import WaiterPortal from './pages/portal/WaiterPortal';
import CookKdsPortal from './pages/portal/CookKdsPortal';
import NotFound from './pages/NotFound';

import { useAuth } from './context/AuthContext';
import { getSettings } from './api/settings';

export default function App() {
  const { user, isAdmin, isWaiter, isCook, loading: authLoading } = useAuth();
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

  // 1. Cook Kitchen Display System (KDS)
  if (currentHash.startsWith('#/portal/cook')) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#08130E] flex items-center justify-center text-gold">
          <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>
      );
    }
    if (!user) {
      return <PortalLogin />;
    }
    // Route according to authenticated role if switching
    if (isWaiter) return <WaiterPortal />;
    if (isAdmin) {
      return (
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
          {adminTab === 'staff' && <AdminStaff />}
          {adminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      );
    }
    return <CookKdsPortal />;
  }

  // 2. Waiter Floor Captain Mobile Portal
  if (currentHash.startsWith('#/portal/waiter')) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-forest-950 flex items-center justify-center text-gold">
          <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>
      );
    }
    if (!user) {
      return <PortalLogin />;
    }
    // Route according to authenticated role if switching
    if (isCook) return <CookKdsPortal />;
    if (isAdmin) {
      return (
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
          {adminTab === 'staff' && <AdminStaff />}
          {adminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      );
    }
    return <WaiterPortal />;
  }

  // 3. General Unified Staff Portal (/#/portal, /#/staff, /#/login)
  if (currentHash.startsWith('#/portal') || currentHash.startsWith('#/staff') || currentHash.startsWith('#/login')) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-forest-950 flex items-center justify-center text-gold">
          <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>
      );
    }
    if (!user) {
      return <PortalLogin />;
    }
    if (isCook) return <CookKdsPortal />;
    if (isWaiter) return <WaiterPortal />;
    // If admin, show admin layout
    return (
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
        {adminTab === 'staff' && <AdminStaff />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // 4. Admin Management Route (/#/admin)
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
        <PortalLogin onLoginSuccess={() => { setAdminTab('dashboard'); }} />
      );
    }

    return (
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
        {adminTab === 'staff' && <AdminStaff />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Public Dining Website
  return (
    <div className="min-h-screen bg-forest-950 text-cream selection:bg-gold selection:text-forest-950 font-sans pb-24 sm:pb-0 overflow-x-hidden w-full max-w-full">
      <Preloader />
      <CustomCursor />
      
      {/* Top Navbar */}
      <Navbar
        onOpenReserve={handleOpenReserve}
        onOpenTrackOrder={() => handleOpenTrackOrder()}
        settings={settings}
      />

      {/* Main Public Sections */}
      <main>
        <HeroSection
          onOpenReserve={handleOpenReserve}
          onExploreMenu={handleExploreMenu}
          settings={settings}
        />
        <AboutSection />
        <MenuSection settings={settings} />
        <ReservationSection />
        <OffersSection />
        <GallerySection />
        <TestimonialsSection />
        <EventsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Desktop Floating Action Buttons */}
      <div className="hidden sm:block">
        <FloatingButtons
          phone={settings?.phone}
          whatsapp={settings?.whatsapp}
        />
      </div>

      {/* Mobile 1-Tap Quick Action Bottom Bar */}
      <MobileBottomNav
        onOpenReserve={handleOpenReserve}
        settings={settings}
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
