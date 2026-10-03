import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StorySection } from './components/StorySection';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { GallerySection } from './components/GallerySection';
import { VideoSection } from './components/VideoSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { BranchesModal } from './components/BranchesModal';
import { SpeedAuditBadge } from './components/SpeedAuditBadge';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LoadingScreen } from './components/LoadingScreen';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { BackToTopButton } from './components/BackToTopButton';
import { AdminPanel } from './components/admin/AdminPanel';
import { BranchInfo, CartItem, GalleryPhoto, KitchenOrder, MenuItem, Reservation, Review, SiteContent } from './types';
import { BRANCHES, DEFAULT_SITE_CONTENT, GALLERY_PHOTOS, INITIAL_REVIEWS, MENU_ITEMS } from './data/restaurantData';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('menu');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBranchesModalOpen, setIsBranchesModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // ----------------------------------------------------
  // PERSISTENT DATA STATES (Shared with Admin Panel)
  // ----------------------------------------------------

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const stored = localStorage.getItem('byd_reservations');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Initial sample reservations
    return [
      {
        id: 'BYD-9482',
        branch: 'sigra',
        fullName: 'Vikramaditya Rao',
        phone: '9838012345',
        email: 'vikram.rao@gmail.com',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '7:30 PM',
        guests: 4,
        seatingArea: 'indoor_booth',
        specialOccasion: 'Anniversary Dinner',
        specialRequests: 'Candlelight table, mild spices for children.',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'BYD-8124',
        branch: 'bhojuveer',
        fullName: 'Ananya & Kabir',
        phone: '9450098765',
        email: 'ananya.k@outlook.com',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '6:45 PM',
        guests: 2,
        seatingArea: 'yellow_door_terrace',
        specialOccasion: 'Romantic Date',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'BYD-7019',
        branch: 'sigra',
        fullName: 'Prof. S. N. Mukherjee',
        phone: '9125034567',
        email: 'sn.mukherjee@bhu.ac.in',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '1:00 PM',
        guests: 6,
        seatingArea: 'family_lounge',
        specialOccasion: 'Faculty Reunion',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('byd_reservations', JSON.stringify(reservations));
    } catch (e) {
      console.error(e);
    }
  }, [reservations]);

  // Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem('byd_menu');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return MENU_ITEMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('byd_menu', JSON.stringify(menuItems));
    } catch (e) {
      console.error(e);
    }
  }, [menuItems]);

  // Gallery Photos
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    try {
      const stored = localStorage.getItem('byd_gallery');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return GALLERY_PHOTOS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('byd_gallery', JSON.stringify(galleryPhotos));
    } catch (e) {
      console.error(e);
    }
  }, [galleryPhotos]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem('byd_reviews');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('byd_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Branches
  const [branches, setBranches] = useState<BranchInfo[]>(() => {
    try {
      const stored = localStorage.getItem('byd_branches');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return BRANCHES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('byd_branches', JSON.stringify(branches));
    } catch (e) {
      console.error(e);
    }
  }, [branches]);

  // Kitchen Orders (KOT)
  const [orders, setOrders] = useState<KitchenOrder[]>(() => {
    try {
      const stored = localStorage.getItem('byd_orders');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'KOT-342',
        orderType: 'dine_in',
        tableNumber: 'Table 4',
        customerPhone: '9838012345',
        cookingNotes: 'Extra crisp thin crust on pizza, mild spice.',
        items: [
          { item: MENU_ITEMS[4], quantity: 1 }, // Margherita
          { item: MENU_ITEMS[5], quantity: 1 }, // Spaghetti Aglio Olio
          { item: MENU_ITEMS[12], quantity: 2 }, // Malted Brownie Shake
        ],
        subtotal: 1360,
        gst: 68,
        total: 1428,
        status: 'preparing',
        createdAt: new Date(Date.now() - 1200000).toISOString(),
      },
      {
        id: 'KOT-218',
        orderType: 'takeaway',
        customerName: 'Priya Sharma',
        customerPhone: '9151805152',
        cookingNotes: 'Packed separate sauce.',
        items: [
          { item: MENU_ITEMS[10], quantity: 2 }, // Babycorn Burrito
          { item: MENU_ITEMS[13], quantity: 2 }, // Cold Brew
        ],
        subtotal: 1120,
        gst: 56,
        total: 1176,
        status: 'served',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('byd_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Site Content (Hero, Story, FAQs, Videos, Announcements, Social Links - Full CMS)
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const stored = localStorage.getItem('byd_site_content');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  useEffect(() => {
    try {
      localStorage.setItem('byd_site_content', JSON.stringify(siteContent));
    } catch (e) {
      console.error(e);
    }
  }, [siteContent]);

  // Reset demo data
  const handleResetToDefaults = () => {
    localStorage.removeItem('byd_menu');
    localStorage.removeItem('byd_gallery');
    localStorage.removeItem('byd_reviews');
    localStorage.removeItem('byd_branches');
    localStorage.removeItem('byd_orders');
    localStorage.removeItem('byd_reservations');
    localStorage.removeItem('byd_site_content');

    setMenuItems(MENU_ITEMS);
    setGalleryPhotos(GALLERY_PHOTOS);
    setReviews(INITIAL_REVIEWS);
    setBranches(BRANCHES);
    setOrders([]);
    setReservations([]);
    setSiteContent(DEFAULT_SITE_CONTENT);
  };

  // Quick reservation prefill
  const [bookingPrefill, setBookingPrefill] = useState<{
    branch: 'sigra' | 'bhojuveer' | string;
    date: string;
    guests: number;
  }>({
    branch: 'sigra',
    date: new Date().toISOString().split('T')[0],
    guests: 2,
  });

  // Cart State with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('byd_cart');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error(err);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('byd_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error(err);
    }
  }, [cartItems]);

  // Section observer for Navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['menu', 'reservations', 'gallery', 'videos', 'reviews', 'story', 'faq'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Handlers
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, ci) => acc + ci.quantity, 0);
  }, [cartItems]);

  const cartItemQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((ci) => {
      map[ci.item.id] = ci.quantity;
    });
    return map;
  }, [cartItems]);

  const scrollToReservation = () => {
    const el = document.getElementById('reservations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickReserve = (branch: 'sigra' | 'bhojuveer' | string, date: string, guests: number) => {
    setBookingPrefill({ branch, date, guests });
    scrollToReservation();
  };

  const handleBranchSelectedForBooking = (branchId: 'sigra' | 'bhojuveer' | string) => {
    setBookingPrefill((prev) => ({ ...prev, branch: branchId }));
    scrollToReservation();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Intro Loading Screen with Authentic Animated BYD Doors & Logo */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Top Diner Announcement Banner (CMS Editable) */}
      <AnnouncementBanner
        announcement={siteContent.announcement}
        onOpenReservation={scrollToReservation}
      />

      {/* 3-Zone Strict Top Bar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={scrollToReservation}
        onOpenBranches={() => setIsBranchesModalOpen(true)}
        activeSection={activeSection}
      />

      <main className="flex-1">
        {/* Cinematic Hero with yellow doors motif and quick booking widget (CMS Editable) */}
        <Hero
          onQuickReserve={handleQuickReserve}
          onExploreMenu={scrollToMenu}
          content={siteContent.hero}
        />

        {/* Heritage & Varanasi Sanctuaries Story (CMS Editable) */}
        <StorySection content={siteContent.story} />

        {/* Integrated Multi-Cuisine Menu Display (with live editable dishes) */}
        <MenuSection
          items={menuItems}
          onAddToCart={handleAddToCart}
          cartItemQuantities={cartItemQuantities}
        />

        {/* Seamless Instant Table Reservation System */}
        <ReservationSection
          initialBranch={bookingPrefill.branch}
          initialDate={bookingPrefill.date}
          initialGuests={bookingPrefill.guests}
          onNewReservation={(res) => setReservations((prev) => [res, ...prev])}
          branches={branches}
        />

        {/* High-Resolution Curated Photo Gallery with Lightbox (live editable) */}
        <GallerySection photos={galleryPhotos} />

        {/* Behind The Doors in Motion - Video & Reel Cinema (CMS Editable) */}
        <VideoSection videos={siteContent.videos} />

        {/* Dynamic Reviews Section with Moderation Workflow (live editable) */}
        <ReviewsSection
          externalReviews={reviews}
          onUpdateExternalReviews={(updater) => setReviews(updater)}
        />

        {/* Frequently Asked Questions Accordion (CMS Editable) */}
        <FaqSection
          faqs={siteContent.faqs}
          onOpenReservation={scrollToReservation}
        />
      </main>

      {/* Clean Editorial Footer with Admin Entry & CMS Social Links */}
      <Footer
        onOpenBranches={() => setIsBranchesModalOpen(true)}
        onOpenReservation={scrollToReservation}
        onOpenAdmin={() => setIsAdminOpen(true)}
        socialLinks={siteContent.socialLinks}
        branches={branches}
      />

      {/* Slide-out Order-To-Table & Takeaway Tray */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Branches & Directions Modal */}
      <BranchesModal
        isOpen={isBranchesModalOpen}
        onClose={() => setIsBranchesModalOpen(false)}
        onSelectBranchForBooking={handleBranchSelectedForBooking}
        branches={branches}
      />

      {/* Real-Time Speed & Responsiveness Audit Badge */}
      <SpeedAuditBadge />

      {/* Mobile Sticky Bottom Nav (<15% mobile viewport cap) */}
      <MobileBottomNav
        onOpenReservation={scrollToReservation}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
        activeSection={activeSection}
      />

      {/* Floating Back to Top Button with Circular Scroll Progress */}
      <BackToTopButton />

      {/* FULLSCREEN ADMIN PANEL WITH LEFT-SIDEBAR FEATURES */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        reservations={reservations}
        onUpdateReservations={setReservations}
        menuItems={menuItems}
        onUpdateMenuItems={setMenuItems}
        galleryPhotos={galleryPhotos}
        onUpdateGalleryPhotos={setGalleryPhotos}
        reviews={reviews}
        onUpdateReviews={setReviews}
        branches={branches}
        onUpdateBranches={setBranches}
        orders={orders}
        onUpdateOrders={setOrders}
        siteContent={siteContent}
        onUpdateSiteContent={setSiteContent}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
}
