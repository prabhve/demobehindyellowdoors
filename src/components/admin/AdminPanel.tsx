import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  UtensilsCrossed,
  Image as ImageIcon,
  MessageSquare,
  ShoppingBag,
  Store,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  X,
  ExternalLink,
  Phone,
  Clock,
  Users,
  Sparkles,
  Flame,
  ChevronRight,
  Filter,
  Film,
  FileText,
  HelpCircle,
  Play,
  Save,
  Globe,
  Share2,
  Printer,
  Receipt,
} from 'lucide-react';
import {
  BranchInfo,
  CuisineCategory,
  DietaryType,
  DinerVideo,
  FaqItem,
  GalleryPhoto,
  KitchenOrder,
  MenuItem,
  Reservation,
  Review,
  SiteContent,
} from '../../types';
import { BydLogo } from '../BydLogo';
import { SafeImage } from '../SafeImage';
import { ManualOrderModal } from './ManualOrderModal';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  // Shared States from App
  reservations: Reservation[];
  onUpdateReservations: (updater: (prev: Reservation[]) => Reservation[]) => void;
  menuItems: MenuItem[];
  onUpdateMenuItems: (updater: (prev: MenuItem[]) => MenuItem[]) => void;
  galleryPhotos: GalleryPhoto[];
  onUpdateGalleryPhotos: (updater: (prev: GalleryPhoto[]) => GalleryPhoto[]) => void;
  reviews: Review[];
  onUpdateReviews: (updater: (prev: Review[]) => Review[]) => void;
  branches: BranchInfo[];
  onUpdateBranches: (updater: (prev: BranchInfo[]) => BranchInfo[]) => void;
  orders: KitchenOrder[];
  onUpdateOrders: (updater: (prev: KitchenOrder[]) => KitchenOrder[]) => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (updater: (prev: SiteContent) => SiteContent) => void;
  onResetToDefaults: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'reservations'
  | 'menu'
  | 'gallery'
  | 'videos'
  | 'cms'
  | 'faqs'
  | 'reviews'
  | 'orders'
  | 'branches';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  reservations,
  onUpdateReservations,
  menuItems,
  onUpdateMenuItems,
  galleryPhotos,
  onUpdateGalleryPhotos,
  reviews,
  onUpdateReviews,
  branches,
  onUpdateBranches,
  orders,
  onUpdateOrders,
  siteContent,
  onUpdateSiteContent,
  onResetToDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'all' | 'sigra' | 'bhojuveer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals for CRUD operations
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);

  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<DinerVideo | null>(null);

  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  // Live Kitchen Orders State & Modals
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<KitchenOrder | null>(null);
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'dine_in' | 'takeaway'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'received' | 'preparing' | 'served' | 'completed' | 'cancelled'>('all');
  const [orderBranchFilter, setOrderBranchFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [printingOrder, setPrintingOrder] = useState<KitchenOrder | null>(null);

  // Local CMS form copy for editing site content
  const [localCms, setLocalCms] = useState<SiteContent>(siteContent);

  // Keep local CMS form in sync when siteContent changes (or resets)
  useEffect(() => {
    setLocalCms(siteContent);
  }, [siteContent]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const presetFoodImages = [
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584208632869-05fa2b2a5971?auto=format&fit=crop&w=800&q=80',
  ];

  const presetAmbianceImages = [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
  ];

  const presetMomentsImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  ];

  const presetHeroMedia = [
    {
      label: 'Warm Diner Interior (Photo)',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Wood-Fired Pizza Sourdough (Video Loop)',
      type: 'video' as const,
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-kneading-dough-42416-large.mp4',
    },
    {
      label: 'Sizzling Chocolate Brownie (Video Loop)',
      type: 'video' as const,
      url: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-chocolate-sauce-on-ice-cream-41589-large.mp4',
    },
    {
      label: 'Evening Candlelight Booths (Photo)',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Overview metrics
  const pendingReviewsCount = useMemo(() => {
    return reviews.filter((r) => r.status === 'pending_moderation').length;
  }, [reviews]);

  const activeReservationsCount = useMemo(() => {
    return reservations.filter((r) => r.status === 'confirmed').length;
  }, [reservations]);

  const liveOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'received' || o.status === 'preparing').length;
  }, [orders]);

  if (!isOpen) return null;

  // ----------------------------------------------------
  // CMS CONTENT ACTIONS
  // ----------------------------------------------------
  const handleSaveCmsContent = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteContent(() => localCms);
    showToast('A to Z Site Content updated and published live!');
  };

  // ----------------------------------------------------
  // VIDEO CRUD
  // ----------------------------------------------------
  const handleSaveVideo = (vid: DinerVideo) => {
    if (editingVideo) {
      onUpdateSiteContent((prev) => ({
        ...prev,
        videos: prev.videos.map((v) => (v.id === vid.id ? vid : v)),
      }));
      setLocalCms((prev) => ({
        ...prev,
        videos: prev.videos.map((v) => (v.id === vid.id ? vid : v)),
      }));
      showToast(`Video "${vid.title}" updated.`);
      setEditingVideo(null);
    } else {
      onUpdateSiteContent((prev) => ({
        ...prev,
        videos: [vid, ...prev.videos],
      }));
      setLocalCms((prev) => ({
        ...prev,
        videos: [vid, ...prev.videos],
      }));
      showToast(`New video "${vid.title}" published.`);
      setIsAddVideoOpen(false);
    }
  };

  const handleDeleteVideo = (id: string) => {
    if (window.confirm('Delete this video from the cinema section?')) {
      onUpdateSiteContent((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v.id !== id),
      }));
      setLocalCms((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v.id !== id),
      }));
      showToast('Video deleted.');
    }
  };

  // ----------------------------------------------------
  // FAQ CRUD
  // ----------------------------------------------------
  const handleSaveFaq = (faq: FaqItem) => {
    if (editingFaq) {
      onUpdateSiteContent((prev) => ({
        ...prev,
        faqs: prev.faqs.map((f) => (f.id === faq.id ? faq : f)),
      }));
      setLocalCms((prev) => ({
        ...prev,
        faqs: prev.faqs.map((f) => (f.id === faq.id ? faq : f)),
      }));
      showToast('FAQ item updated.');
      setEditingFaq(null);
    } else {
      onUpdateSiteContent((prev) => ({
        ...prev,
        faqs: [...prev.faqs, faq],
      }));
      setLocalCms((prev) => ({
        ...prev,
        faqs: [...prev.faqs, faq],
      }));
      showToast('New FAQ item published.');
      setIsAddFaqOpen(false);
    }
  };

  const handleDeleteFaq = (id: string) => {
    if (window.confirm('Delete this FAQ entry?')) {
      onUpdateSiteContent((prev) => ({
        ...prev,
        faqs: prev.faqs.filter((f) => f.id !== id),
      }));
      setLocalCms((prev) => ({
        ...prev,
        faqs: prev.faqs.filter((f) => f.id !== id),
      }));
      showToast('FAQ deleted.');
    }
  };

  // ----------------------------------------------------
  // RESERVATION ACTIONS
  // ----------------------------------------------------
  const handleSaveReservation = (res: Reservation) => {
    if (editingReservation) {
      onUpdateReservations((prev) =>
        prev.map((r) => (r.id === res.id ? res : r))
      );
      showToast(`Reservation #${res.id} updated successfully.`);
      setEditingReservation(null);
    } else {
      onUpdateReservations((prev) => [res, ...prev]);
      showToast(`New reservation #${res.id} booked for ${res.fullName}.`);
      setIsAddReservationOpen(false);
    }
  };

  const handleUpdateReservationStatus = (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    onUpdateReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showToast(`Reservation #${id} status changed to ${status.toUpperCase()}.`);
  };

  const handleDeleteReservation = (id: string) => {
    if (window.confirm(`Delete reservation #${id}?`)) {
      onUpdateReservations((prev) => prev.filter((r) => r.id !== id));
      showToast(`Reservation #${id} deleted.`);
    }
  };

  const handleExportReservationsCSV = () => {
    const headers = ['ID', 'Branch', 'Guest Name', 'Phone', 'Email', 'Date', 'Time Slot', 'Guests', 'Area', 'Status', 'Special Occasion', 'Created At'];
    const rows = reservations.map((r) => [
      r.id,
      r.branch,
      `"${r.fullName}"`,
      r.phone,
      r.email,
      r.date,
      r.timeSlot,
      r.guests,
      r.seatingArea,
      r.status,
      `"${r.specialOccasion || ''}"`,
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BYD_Reservations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reservations CSV exported successfully.');
  };

  // ----------------------------------------------------
  // MENU ACTIONS
  // ----------------------------------------------------
  const handleSaveDish = (dish: MenuItem) => {
    if (editingDish) {
      onUpdateMenuItems((prev) =>
        prev.map((item) => (item.id === dish.id ? dish : item))
      );
      showToast(`Dish "${dish.name}" updated successfully.`);
      setEditingDish(null);
    } else {
      onUpdateMenuItems((prev) => [dish, ...prev]);
      showToast(`New dish "${dish.name}" added to menu.`);
      setIsAddDishOpen(false);
    }
  };

  const handleDeleteDish = (id: string, name: string) => {
    if (window.confirm(`Remove "${name}" from the menu?`)) {
      onUpdateMenuItems((prev) => prev.filter((item) => item.id !== id));
      showToast(`"${name}" removed from the menu.`);
    }
  };

  // ----------------------------------------------------
  // GALLERY ACTIONS
  // ----------------------------------------------------
  const handleSavePhoto = (photo: GalleryPhoto) => {
    if (editingPhoto) {
      onUpdateGalleryPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? photo : p))
      );
      showToast(`Photo "${photo.title}" updated.`);
      setEditingPhoto(null);
    } else {
      onUpdateGalleryPhotos((prev) => [photo, ...prev]);
      showToast(`New photo "${photo.title}" added to gallery.`);
      setIsAddPhotoOpen(false);
    }
  };

  const handleDeletePhoto = (id: string) => {
    if (window.confirm('Delete this gallery photo?')) {
      onUpdateGalleryPhotos((prev) => prev.filter((p) => p.id !== id));
      showToast('Photo removed from gallery.');
    }
  };

  // ----------------------------------------------------
  // REVIEWS ACTIONS
  // ----------------------------------------------------
  const handleUpdateReviewStatus = (id: string, status: 'published' | 'pending_moderation' | 'rejected') => {
    onUpdateReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showToast(`Review status updated to ${status.replace('_', ' ').toUpperCase()}.`);
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Delete this user review?')) {
      onUpdateReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('Review permanently deleted.');
    }
  };

  // ----------------------------------------------------
  // KITCHEN ORDERS ACTIONS
  // ----------------------------------------------------
  const handleSaveOrder = (savedOrder: KitchenOrder) => {
    if (editingOrder) {
      onUpdateOrders((prev) =>
        prev.map((o) => (o.id === savedOrder.id ? savedOrder : o))
      );
      showToast(`Order #${savedOrder.id} (${savedOrder.orderType === 'dine_in' ? savedOrder.tableNumber : 'Takeaway'}) updated.`);
      setEditingOrder(null);
    } else {
      onUpdateOrders((prev) => [savedOrder, ...prev]);
      showToast(`Order #${savedOrder.id} dispatched to Kitchen.`);
      setIsAddOrderOpen(false);
    }
  };

  const handleExportOrdersCSV = () => {
    const headers = [
      'Order ID',
      'Type',
      'Table',
      'Customer',
      'Phone',
      'Server',
      'Branch',
      'Items Count',
      'Items List',
      'Cooking Notes',
      'Subtotal',
      'GST',
      'Discount',
      'Total',
      'Payment Method',
      'Payment Status',
      'Status',
      'Created At',
    ];

    const rows = orders.map((ord) => [
      ord.id,
      ord.orderType,
      `"${ord.tableNumber || 'N/A'}"`,
      `"${ord.customerName || 'Guest'}"`,
      ord.customerPhone,
      `"${ord.serverName || 'Captain'}"`,
      ord.branch || 'sigra',
      ord.items.reduce((s, i) => s + i.quantity, 0),
      `"${ord.items.map((i) => `${i.quantity}x ${i.item.name}`).join('; ')}"`,
      `"${ord.cookingNotes || ''}"`,
      ord.subtotal,
      ord.gst,
      ord.discount || 0,
      ord.total,
      ord.paymentMethod || 'pay_later',
      ord.paymentStatus || 'unpaid',
      ord.status,
      ord.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BYD_Kitchen_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Kitchen Orders CSV exported successfully.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'received' | 'preparing' | 'served' | 'completed' | 'cancelled') => {
    onUpdateOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order #${orderId} marked as ${status.toUpperCase()}.`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Delete order #${orderId}?`)) {
      onUpdateOrders((prev) => prev.filter((o) => o.id !== orderId));
      showToast(`Order #${orderId} deleted.`);
    }
  };

  // Navigation Items
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'reservations', label: 'Table Reservations', icon: Calendar, badge: reservations.length },
    { id: 'menu', label: 'Menu & Dishes (CRUD)', icon: UtensilsCrossed, badge: menuItems.length },
    { id: 'cms', label: 'Site Content (A to Z CMS)', icon: FileText, badgeColor: 'bg-amber-500' },
    { id: 'gallery', label: 'Photo Gallery CMS', icon: ImageIcon, badge: galleryPhotos.length },
    { id: 'videos', label: 'Videos & Cinema Reels', icon: Film, badge: siteContent.videos.length },
    { id: 'faqs', label: 'FAQs Manager', icon: HelpCircle, badge: siteContent.faqs.length },
    { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare, badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined, badgeColor: 'bg-amber-500' },
    { id: 'orders', label: 'Live Kitchen Orders (KOT)', icon: ShoppingBag, badge: liveOrdersCount > 0 ? liveOrdersCount : undefined, badgeColor: 'bg-emerald-500' },
    { id: 'branches', label: 'Outlets & Settings', icon: Store },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col text-stone-100 antialiased overflow-hidden select-none animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-60 bg-amber-400 text-stone-950 text-xs font-bold px-4 py-2.5 rounded-lg shadow-xl border border-amber-300 flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR */}
      <header className="h-14 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <BydLogo variant="mark" size="sm" />
          <div>
            <h1 className="font-display font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
              Behind Yellow Doors <span className="text-amber-400 font-mono text-xs uppercase px-2 py-0.5 bg-amber-950/80 rounded border border-amber-600/40">Full Admin & CMS Suite</span>
            </h1>
            <p className="text-[10px] text-stone-400 font-mono hidden sm:block">
              Varanasi Flagship Management Console · Content, Media, Bookings & Operations
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Features Trigger Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            title="Toggle Features Menu"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="capitalize">{activeTab}</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1 text-xs">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-stone-400 text-[11px]">Outlet:</span>
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value as 'all' | 'sigra' | 'bhojuveer')}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-stone-900 text-white">All Outlets</option>
              <option value="sigra" className="bg-stone-900 text-white">Sigra Flagship</option>
              <option value="bhojuveer" className="bg-stone-900 text-white">Bhojuveer Cafe</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors cursor-pointer border border-stone-700"
            title="Return to website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">View Live Website</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white transition-colors cursor-pointer border border-red-800/40"
            title="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* FULLSCREEN MAIN LAYOUT: LEFT SIDEBAR + RIGHT CONTENT */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 top-14 bg-black/75 z-40 md:hidden backdrop-blur-xs transition-opacity"
          />
        )}

        {/* LEFT SIDEBAR (Desktop fixed left, Mobile slide-in drawer) */}
        <aside
          className={`
            ${
              isMobileSidebarOpen
                ? 'fixed inset-y-14 left-0 z-50 w-72 bg-stone-900 border-r border-stone-800 shadow-2xl flex flex-col justify-between p-4 overflow-y-auto animate-in slide-in-from-left duration-200'
                : 'hidden'
            }
            md:flex md:w-64 md:relative md:inset-auto bg-stone-900/90 border-r border-stone-800 flex-col justify-between shrink-0 p-3 sm:p-4 overflow-y-auto
          `}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
              <span>A to Z Controls</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="md:hidden text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="space-y-1">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as AdminTab);
                      setSearchQuery('');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>

                    {tab.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-stone-950 text-amber-400'
                            : tab.badgeColor
                            ? `${tab.badgeColor} text-stone-950`
                            : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Utility Info & Reset */}
          <div className="pt-4 border-t border-stone-800 space-y-2.5">
            <div className="bg-stone-800/60 rounded-lg p-2.5 border border-stone-700/50 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center justify-between text-stone-300 font-semibold">
                <span>Varanasi Time</span>
                <span className="font-mono text-amber-400">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[10px] text-stone-400">Diner Live Status: Open</p>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset all demo data (Menu, Bookings, Reviews, Gallery, Videos, CMS) back to defaults?')) {
                  onResetToDefaults();
                  showToast('Database & CMS reset to defaults.');
                  setIsMobileSidebarOpen(false);
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] text-stone-400 hover:text-amber-400 hover:bg-stone-800/80 rounded-lg transition-colors cursor-pointer border border-stone-800"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Quick Tab Carousel Bar */}
          <div className="md:hidden bg-stone-900 border-b border-stone-800 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as AdminTab);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-stone-800/80 text-stone-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                  <span>{tab.label.split(' ')[0]}</span>
                  {tab.badge !== undefined && (
                    <span className="text-[9px] font-mono px-1 rounded-full bg-stone-950 text-amber-400">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-stone-950 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Manager Dashboard & CMS Hub</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Live operational overview for Behind Yellow Doors Sigra & Bhojuveer branches.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Bookings</span>
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-white tabular-nums">
                      {activeReservationsCount}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">Tables active</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="text-[11px] text-amber-400 hover:underline mt-3 text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage all bookings</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Live Kitchen Orders</span>
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-white tabular-nums">
                      {liveOrdersCount}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">In prep</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-[11px] text-amber-400 hover:underline mt-3 text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>View kitchen order slips</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Dishes</span>
                    <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-white tabular-nums">
                      {menuItems.length}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">On live menu</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="text-[11px] text-amber-400 hover:underline mt-3 text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>Edit dishes & pricing</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Media & Content</span>
                    <FileText className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-white tabular-nums">
                      {galleryPhotos.length + siteContent.videos.length}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">Photos & Videos</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('cms')}
                    className="text-[11px] text-amber-400 hover:underline mt-3 text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>Edit A to Z site content</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Quick Actions & Recent Bookings Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Latest Table Bookings</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('reservations')}
                      className="text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      View All ({reservations.length})
                    </button>
                  </div>

                  {reservations.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">No bookings recorded yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {reservations.slice(0, 5).map((r) => (
                        <div
                          key={r.id}
                          className="bg-stone-850 p-3 rounded-lg border border-stone-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{r.fullName}</span>
                              <span className="text-[10px] text-stone-400 font-mono">({r.phone})</span>
                              <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] uppercase font-mono">
                                {r.branch}
                              </span>
                            </div>
                            <p className="text-stone-400 text-[11px] mt-0.5">
                              {r.date} at {r.timeSlot} · {r.guests} Guests · {r.seatingArea.replace(/_/g, ' ')}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                                r.status === 'confirmed'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : r.status === 'cancelled'
                                  ? 'bg-red-950 text-red-400 border border-red-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}
                            >
                              {r.status}
                            </span>
                            <button
                              onClick={() => setEditingReservation(r)}
                              className="p-1 text-stone-400 hover:text-white"
                              title="Edit booking"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                    <h3 className="font-bold text-sm text-white">Management Shortcuts</h3>

                    <button
                      onClick={() => setIsAddDishOpen(true)}
                      className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Dish to Menu</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('cms')}
                      className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors border border-stone-700"
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Edit Website Titles & Content</span>
                    </button>

                    <button
                      onClick={() => setIsAddVideoOpen(true)}
                      className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors border border-stone-700"
                    >
                      <Film className="w-4 h-4 text-amber-400" />
                      <span>Upload / Embed New Video</span>
                    </button>

                    <button
                      onClick={() => setIsAddPhotoOpen(true)}
                      className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors border border-stone-700"
                    >
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Upload Gallery Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SITE CONTENT CMS (A TO Z EDITING) */}
          {activeTab === 'cms' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">A to Z Website Content CMS</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Edit hero headlines, subtitles, announcement banners, story pillars, and media live on the site.
                  </p>
                </div>

                <button
                  onClick={handleSaveCmsContent}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes Live</span>
                </button>
              </div>

              <form onSubmit={handleSaveCmsContent} className="space-y-8">
                {/* 1. TOP ANNOUNCEMENT BANNER */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Top Announcement Banner</span>
                      </h3>
                      <p className="text-[11px] text-stone-400">Notice bar displayed at the very top of the website.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-stone-300 cursor-pointer">
                        {localCms.announcement.enabled ? 'Active / Visible' : 'Hidden'}
                      </label>
                      <input
                        type="checkbox"
                        checked={localCms.announcement.enabled}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            announcement: { ...localCms.announcement, enabled: e.target.checked },
                          })
                        }
                        className="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={localCms.announcement.badge}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            announcement: { ...localCms.announcement, badge: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Action Button Text</label>
                      <input
                        type="text"
                        value={localCms.announcement.linkText || ''}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            announcement: { ...localCms.announcement, linkText: e.target.value },
                          })
                        }
                        placeholder="e.g. Book a Table"
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Action Target / Anchor</label>
                      <input
                        type="text"
                        value={localCms.announcement.linkUrl || ''}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            announcement: { ...localCms.announcement, linkUrl: e.target.value },
                          })
                        }
                        placeholder="e.g. #reservations"
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Announcement Message</label>
                      <input
                        type="text"
                        value={localCms.announcement.text}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            announcement: { ...localCms.announcement, text: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. HERO SECTION CMS */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
                  <div className="pb-3 border-b border-stone-800">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      <span>Hero Section Content (A to Z)</span>
                    </h3>
                    <p className="text-[11px] text-stone-400">Headlines, subtitles, atmosphere overlay, badge, and hero media.</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Editorial Top Kicker</label>
                      <input
                        type="text"
                        value={localCms.hero.kicker}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            hero: { ...localCms.hero, kicker: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Headline Part 1</label>
                        <input
                          type="text"
                          value={localCms.hero.headlinePart1}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, headlinePart1: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-display"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Headline Highlight (Yellow Italic)</label>
                        <input
                          type="text"
                          value={localCms.hero.headlineHighlight}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, headlineHighlight: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-amber-400 font-display"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Hero Subtitle Paragraph</label>
                      <textarea
                        rows={3}
                        value={localCms.hero.subtitle}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            hero: { ...localCms.hero, subtitle: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                      />
                    </div>

                    {/* Media Type & URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Hero Media Type</label>
                        <select
                          value={localCms.hero.mediaType}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, mediaType: e.target.value as 'image' | 'video' },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                        >
                          <option value="image">Photo Image</option>
                          <option value="video">Autoplay Video Loop</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Media URL (Image or MP4 Video)</label>
                        <input
                          type="url"
                          value={localCms.hero.mediaUrl}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, mediaUrl: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Hero Media Quick Presets */}
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-1.5">Quick Choose Hero Visual Preset:</span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {presetHeroMedia.map((hm, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setLocalCms({
                                ...localCms,
                                hero: {
                                  ...localCms.hero,
                                  mediaType: hm.type,
                                  mediaUrl: hm.url,
                                },
                              })
                            }
                            className={`px-3 py-1.5 text-[11px] rounded-lg border whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                              localCms.hero.mediaUrl === hm.url
                                ? 'bg-amber-400 text-stone-950 font-bold border-amber-300'
                                : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                            }`}
                          >
                            {hm.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Atmosphere Overlay Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Atmosphere Card Title</label>
                        <input
                          type="text"
                          value={localCms.hero.atmosphereTitle || ''}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, atmosphereTitle: e.target.value },
                            })
                          }
                          placeholder="Warm light. Acoustic warmth. Exceptional food."
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Atmosphere Card Subtitle</label>
                        <input
                          type="text"
                          value={localCms.hero.atmosphereSubtitle || ''}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, atmosphereSubtitle: e.target.value },
                            })
                          }
                          placeholder="Designed for family dinners, cozy romantic dates..."
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                    </div>

                    {/* Floating Mini Experience Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Floating Badge Title</label>
                        <input
                          type="text"
                          value={localCms.hero.badgeTitle}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, badgeTitle: e.target.value },
                            })
                          }
                          placeholder="2 Outlets in Varanasi"
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Floating Badge Subtitle</label>
                        <input
                          type="text"
                          value={localCms.hero.badgeSubtitle}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, badgeSubtitle: e.target.value },
                            })
                          }
                          placeholder="Sigra & Bhojuveer"
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                    </div>

                    {/* Badge details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Rating Text</label>
                        <input
                          type="text"
                          value={localCms.hero.ratingScore}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, ratingScore: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Review Count Text</label>
                        <input
                          type="text"
                          value={localCms.hero.reviewCountText}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, reviewCountText: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Hours Text</label>
                        <input
                          type="text"
                          value={localCms.hero.todayHoursText}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              hero: { ...localCms.hero, todayHoursText: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. STORY SECTION CMS */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
                  <div className="pb-3 border-b border-stone-800">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Heritage & Story Section (A to Z)</span>
                    </h3>
                    <p className="text-[11px] text-stone-400">Story copy, visual photography, culinary pillars, and founder quote.</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Story Kicker</label>
                      <input
                        type="text"
                        value={localCms.story.kicker}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            story: { ...localCms.story, kicker: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Headline</label>
                      <input
                        type="text"
                        value={localCms.story.headline}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            story: { ...localCms.story, headline: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-display"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Main Story Text</label>
                      <textarea
                        rows={3}
                        value={localCms.story.paragraph}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            story: { ...localCms.story, paragraph: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                      />
                    </div>

                    {/* Story Media Image URL & Presets */}
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Story Photography Image URL</label>
                      <input
                        type="url"
                        value={localCms.story.mediaUrl}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            story: { ...localCms.story, mediaUrl: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono mb-2"
                      />
                      <span className="text-[10px] text-stone-400 block mb-1">Quick Select Story Photo:</span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {presetAmbianceImages.map((pImg, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setLocalCms({
                                ...localCms,
                                story: { ...localCms.story, mediaUrl: pImg },
                              })
                            }
                            className={`w-14 h-10 rounded border overflow-hidden shrink-0 transition-all ${
                              localCms.story.mediaUrl === pImg
                                ? 'border-amber-400 ring-2 ring-amber-400'
                                : 'border-stone-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={pImg} alt="preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Story Card Overlay Title</label>
                        <input
                          type="text"
                          value={localCms.story.cardTitle || ''}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, cardTitle: e.target.value },
                            })
                          }
                          placeholder="Two Sanctuaries. One Philosophy."
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-display"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Story Card Overlay Subtitle</label>
                        <input
                          type="text"
                          value={localCms.story.cardSubtitle || ''}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, cardSubtitle: e.target.value },
                            })
                          }
                          placeholder="Sigra Flagship & Bhojuveer Cafe Lounge"
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Golden Accent Badge Number</label>
                        <input
                          type="text"
                          value={localCms.story.badgeNumber}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, badgeNumber: e.target.value },
                            })
                          }
                          placeholder="e.g. 100% or 10+ Years"
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-amber-400 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Golden Accent Badge Label</label>
                        <input
                          type="text"
                          value={localCms.story.badgeLabel}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, badgeLabel: e.target.value },
                            })
                          }
                          placeholder="Scratch Cooking & Handcrafted Dough"
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Pillar 1 Title</label>
                        <input
                          type="text"
                          value={localCms.story.feature1Title}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, feature1Title: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                        <label className="block text-stone-400 text-[11px] uppercase mt-2 mb-1">Pillar 1 Description</label>
                        <textarea
                          rows={2}
                          value={localCms.story.feature1Desc}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, feature1Desc: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Pillar 2 Title</label>
                        <input
                          type="text"
                          value={localCms.story.feature2Title}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, feature2Title: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                        <label className="block text-stone-400 text-[11px] uppercase mt-2 mb-1">Pillar 2 Description</label>
                        <textarea
                          rows={2}
                          value={localCms.story.feature2Desc}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, feature2Desc: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Founder / Host Quote</label>
                        <input
                          type="text"
                          value={localCms.story.quoteText}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, quoteText: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white italic"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Quote Attribution</label>
                        <input
                          type="text"
                          value={localCms.story.quoteAuthor}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              story: { ...localCms.story, quoteAuthor: e.target.value },
                            })
                          }
                          className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. SOCIAL LINKS & FOOTER CMS */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
                  <div className="pb-3 border-b border-stone-800">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-amber-400" />
                      <span>Social Media, Contact & Footer Brand CMS</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={localCms.socialLinks.instagram}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            socialLinks: { ...localCms.socialLinks, instagram: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={localCms.socialLinks.facebook}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            socialLinks: { ...localCms.socialLinks, facebook: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Official Email</label>
                      <input
                        type="email"
                        value={localCms.socialLinks.email}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            socialLinks: { ...localCms.socialLinks, email: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Helpline Phone</label>
                      <input
                        type="text"
                        value={localCms.socialLinks.phone || ''}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            socialLinks: { ...localCms.socialLinks, phone: e.target.value },
                          })
                        }
                        placeholder="+91 6393 138 560"
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Brand Editorial Bio</label>
                      <textarea
                        rows={2}
                        value={localCms.socialLinks.brandBio || ''}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            socialLinks: { ...localCms.socialLinks, brandBio: e.target.value },
                          })
                        }
                        placeholder="“Making Banaras spicier, happier and deliciously yellow.”"
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-[11px] uppercase mb-1">Copyright Footer Notice</label>
                      <textarea
                        rows={2}
                        value={localCms.socialLinks.copyrightText}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            socialLinks: { ...localCms.socialLinks, copyrightText: e.target.value },
                          })
                        }
                        className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Live</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: VIDEOS & REELS CMS */}
          {activeTab === 'videos' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Diner Videos & Cinema Reels CMS</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Upload MP4 video streams, culinary reels, and ambiance clips visible in the Cinema section.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddVideoOpen(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload / Add New Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {siteContent.videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-stone-950 mb-3">
                        <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center">
                            <Play className="w-4 h-4 ml-0.5 fill-stone-950" />
                          </div>
                        </div>
                        <span className="absolute top-2 left-2 bg-stone-950/80 text-amber-400 text-[10px] font-mono uppercase px-2 py-0.5 rounded">
                          {vid.category}
                        </span>
                        {vid.duration && (
                          <span className="absolute bottom-2 right-2 bg-stone-950/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                            {vid.duration}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-white mb-1">{vid.title}</h4>
                      <p className="text-xs text-stone-400 line-clamp-2 mb-2 leading-relaxed">{vid.description}</p>
                      <p className="text-[10px] text-stone-500 font-mono truncate">Stream: {vid.videoUrl}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between mt-3">
                      <button
                        onClick={() => setEditingVideo(vid)}
                        className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Video</span>
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded transition-colors cursor-pointer"
                        title="Delete video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FAQS MANAGER */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Frequently Asked Questions CMS</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Manage guest queries, reservation policies, parking, and dining answers.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddFaqOpen(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {siteContent.faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-display">{faq.question}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400">
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-stone-300 leading-relaxed pt-1">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingFaq(faq)}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded"
                        title="Edit FAQ"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1.5 bg-stone-800 hover:bg-red-900 text-stone-400 hover:text-white rounded"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RESERVATIONS MANAGER */}
          {activeTab === 'reservations' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Table Reservations Manager</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Manage guest table bookings, update arrival states, and add manual phone reservations.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleExportReservationsCSV}
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-stone-700 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setIsAddReservationOpen(true)}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Booking</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by guest name, phone, ref ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
                  <span className="text-stone-400 text-[11px]">Branch:</span>
                  <select
                    value={selectedBranchFilter}
                    onChange={(e) => setSelectedBranchFilter(e.target.value as 'all' | 'sigra' | 'bhojuveer')}
                    className="bg-stone-800 border border-stone-700 text-white rounded px-2 py-1 text-xs"
                  >
                    <option value="all">All Branches</option>
                    <option value="sigra">Sigra Branch</option>
                    <option value="bhojuveer">Bhojuveer Branch</option>
                  </select>
                </div>
              </div>

              {/* Reservations Table */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-850 text-stone-400 font-mono uppercase text-[10px] tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Ref ID</th>
                        <th className="py-3 px-4">Guest Details</th>
                        <th className="py-3 px-4">Outlet</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Party & Area</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800 text-stone-300">
                      {reservations
                        .filter((r) => {
                          if (selectedBranchFilter !== 'all' && r.branch !== selectedBranchFilter) return false;
                          if (searchQuery.trim()) {
                            const q = searchQuery.toLowerCase();
                            return (
                              r.fullName.toLowerCase().includes(q) ||
                              r.id.toLowerCase().includes(q) ||
                              r.phone.includes(q)
                            );
                          }
                          return true;
                        })
                        .map((res) => (
                          <tr key={res.id} className="hover:bg-stone-850/60 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                              {res.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white block">{res.fullName}</span>
                              <span className="text-stone-400 font-mono text-[11px]">{res.phone}</span>
                              {res.specialRequests && (
                                <span className="block text-[10px] text-amber-300/80 italic mt-0.5 truncate max-w-xs">
                                  &ldquo;{res.specialRequests}&rdquo;
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="uppercase text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-200">
                                {res.branch}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="block font-semibold text-white">{res.date}</span>
                              <span className="text-stone-400 font-mono text-[11px]">{res.timeSlot}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white">{res.guests} Guests</span>
                              <span className="block text-[11px] text-stone-400 capitalize">
                                {res.seatingArea.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={res.status}
                                onChange={(e) =>
                                  handleUpdateReservationStatus(
                                    res.id,
                                    e.target.value as 'confirmed' | 'pending' | 'cancelled'
                                  )
                                }
                                className={`text-[10px] font-bold uppercase rounded px-2 py-1 border focus:outline-none cursor-pointer ${
                                  res.status === 'confirmed'
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                    : res.status === 'cancelled'
                                    ? 'bg-red-950 text-red-400 border-red-800'
                                    : 'bg-amber-950 text-amber-400 border-amber-800'
                                }`}
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingReservation(res)}
                                  className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors"
                                  title="Edit reservation"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReservation(res.id)}
                                  className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded transition-colors"
                                  title="Delete reservation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MENU & DISHES EDITOR */}
          {activeTab === 'menu' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Menu & Dishes Manager</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Add new culinary creations, update descriptions & prices, and manage dietary tags live on the site.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddDishOpen(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>

              {/* Search */}
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search dishes by name or ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="text-xs text-stone-400 font-mono">
                  Showing {menuItems.length} menu offerings
                </div>
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems
                  .filter((item) => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
                  })
                  .map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden p-4 flex flex-col justify-between hover:border-stone-700 transition-colors"
                    >
                      <div>
                        <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-stone-950 mb-3">
                          <SafeImage
                            src={dish.image}
                            alt={dish.name}
                            fallbackTitle={dish.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span
                              className={`w-3 h-3 rounded-xs border ${
                                dish.dietary === 'veg' ? 'border-emerald-500 bg-white' : 'border-rose-500 bg-white'
                              } flex items-center justify-center p-0.5`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${dish.dietary === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            </span>
                            {dish.isChefsSpecial && (
                              <span className="bg-stone-950/80 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                                Chef Special
                              </span>
                            )}
                          </div>
                          <span className="absolute bottom-2 right-2 bg-stone-950/80 text-white font-mono font-bold text-xs px-2 py-0.5 rounded tabular-nums">
                            ₹{dish.price}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-sm text-white">{dish.name}</h4>
                          <span className="text-[10px] uppercase font-mono text-amber-500 bg-amber-950/80 px-1.5 py-0.5 rounded">
                            {dish.category.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <p className="text-xs text-stone-400 line-clamp-2 mb-2 leading-relaxed">
                          {dish.description}
                        </p>

                        {dish.ingredients && (
                          <p className="text-[10px] text-stone-500 truncate mb-3">
                            {dish.ingredients.join(' · ')}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400 font-mono">
                          ID: {dish.id}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingDish(dish)}
                            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish.id, dish.name)}
                            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded transition-colors cursor-pointer"
                            title="Delete dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: PHOTO GALLERY MANAGER */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Photo Gallery CMS</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Upload and organize diner photography into 'Our Food', 'Our Ambiance', and 'Customer Moments'.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddPhotoOpen(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-stone-950 mb-3">
                        <SafeImage
                          src={photo.imageUrl}
                          alt={photo.title}
                          fallbackTitle={photo.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-stone-950/80 text-amber-400 text-[10px] font-mono uppercase px-2 py-0.5 rounded">
                          {photo.category}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-white mb-1">{photo.title}</h4>
                      <p className="text-xs text-stone-400 mb-1 leading-snug">{photo.caption}</p>
                      <p className="text-[11px] text-amber-500 font-mono mb-3">📍 {photo.location}</p>
                    </div>

                    <div className="pt-2.5 border-t border-stone-800 flex items-center justify-between">
                      <button
                        onClick={() => setEditingPhoto(photo)}
                        className="text-xs text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Caption</span>
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-xs text-stone-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Reviews Moderation Center</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Ensure review authenticity. Approve submitted customer testimonials or discard spam.
                </p>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.authorName}</span>
                        <span className="text-amber-400 font-mono text-xs">{'★'.repeat(rev.rating)}</span>
                        <span className="text-stone-400 text-xs">({rev.branch.toUpperCase()})</span>
                        <span className="text-stone-500 text-[11px] font-mono">· {rev.date}</span>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>

                      {rev.likedDishes && (
                        <p className="text-[11px] text-amber-400/90 font-mono">
                          Liked: {rev.likedDishes.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded font-mono ${
                          rev.status === 'published'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : rev.status === 'rejected'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {rev.status.replace('_', ' ')}
                      </span>

                      {rev.status !== 'published' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'published')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'rejected')}
                          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: KITCHEN ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-6xl">
              {/* Header & Main Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold font-display text-white">Live Kitchen Order Slips (KOT)</h2>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full">
                      Live Kitchen Feed
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Real-time ticket feed for dine-in tables and takeaway counter orders. Create manual orders, modify active slips & print KOTs.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleExportOrdersCSV}
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-stone-700 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export KOT CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingOrder(null);
                      setIsAddOrderOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg transition-transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ New Table / Counter Order</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3">
                  <p className="text-[10px] font-mono uppercase text-stone-400">Total Slips</p>
                  <p className="text-xl font-bold text-white mt-0.5 font-display">{orders.length}</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3">
                  <p className="text-[10px] font-mono uppercase text-amber-400">In Queue (New)</p>
                  <p className="text-xl font-bold text-amber-400 mt-0.5 font-display">
                    {orders.filter((o) => o.status === 'received').length}
                  </p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3">
                  <p className="text-[10px] font-mono uppercase text-blue-400">In Kitchen (Prep)</p>
                  <p className="text-xl font-bold text-blue-400 mt-0.5 font-display">
                    {orders.filter((o) => o.status === 'preparing').length}
                  </p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3">
                  <p className="text-[10px] font-mono uppercase text-emerald-400">Served / Ready</p>
                  <p className="text-xl font-bold text-emerald-400 mt-0.5 font-display">
                    {orders.filter((o) => o.status === 'served').length}
                  </p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3">
                  <p className="text-[10px] font-mono uppercase text-stone-400">Dine-In Tables</p>
                  <p className="text-xl font-bold text-stone-200 mt-0.5 font-display">
                    {orders.filter((o) => o.orderType === 'dine_in').length}
                  </p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3">
                  <p className="text-[10px] font-mono uppercase text-amber-500">Gross Value</p>
                  <p className="text-lg font-bold text-white mt-0.5 font-mono">
                    ₹{orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0)}
                  </p>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search table, order ID, phone, customer, dish..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
                  {/* Type Filter */}
                  <div className="flex items-center gap-1 bg-stone-950 border border-stone-800 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setOrderTypeFilter('all')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        orderTypeFilter === 'all' ? 'bg-stone-800 text-white font-bold' : 'text-stone-400'
                      }`}
                    >
                      All Types
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderTypeFilter('dine_in')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        orderTypeFilter === 'dine_in' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
                      }`}
                    >
                      🍽️ Dine-In
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderTypeFilter('takeaway')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        orderTypeFilter === 'takeaway' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
                      }`}
                    >
                      🛍️ Takeaway
                    </button>
                  </div>

                  {/* Status Filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="bg-stone-950 border border-stone-800 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">All Statuses</option>
                    <option value="received">Received (Queue)</option>
                    <option value="preparing">In Kitchen (Prep)</option>
                    <option value="served">Served / Ready</option>
                    <option value="completed">Completed / Settled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Branch Filter */}
                  <select
                    value={orderBranchFilter}
                    onChange={(e) => setOrderBranchFilter(e.target.value)}
                    className="bg-stone-950 border border-stone-800 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">All Outlets</option>
                    <option value="sigra">Sigra Branch</option>
                    <option value="bhojuveer">Bhojuveer Branch</option>
                    {branches
                      .filter((b) => b.id !== 'sigra' && b.id !== 'bhojuveer')
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Order Cards Grid */}
              {orders.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-12 text-center text-stone-400">
                  <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <p className="text-base font-semibold text-stone-300">No active orders right now.</p>
                  <p className="text-xs mt-1 text-stone-500 mb-4">
                    Create a manual table order above or customer orders placed via the menu cart will populate here live.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOrder(null);
                      setIsAddOrderOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Table Order</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders
                    .filter((ord) => {
                      if (orderTypeFilter !== 'all' && ord.orderType !== orderTypeFilter) return false;
                      if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
                      if (orderBranchFilter !== 'all' && (ord.branch || 'sigra') !== orderBranchFilter) return false;
                      if (orderSearchQuery.trim()) {
                        const q = orderSearchQuery.toLowerCase();
                        const matchId = ord.id.toLowerCase().includes(q);
                        const matchTable = (ord.tableNumber || '').toLowerCase().includes(q);
                        const matchCust = (ord.customerName || '').toLowerCase().includes(q);
                        const matchPhone = ord.customerPhone.includes(q);
                        const matchDish = ord.items.some((i) => i.item.name.toLowerCase().includes(q));
                        return matchId || matchTable || matchCust || matchPhone || matchDish;
                      }
                      return true;
                    })
                    .map((ord) => (
                      <div
                        key={ord.id}
                        className={`bg-stone-900 border rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-lg transition-all ${
                          ord.status === 'received'
                            ? 'border-amber-500/50 bg-amber-950/10'
                            : ord.status === 'preparing'
                            ? 'border-blue-500/50 bg-blue-950/10'
                            : ord.status === 'served'
                            ? 'border-emerald-500/50 bg-emerald-950/10'
                            : 'border-stone-800'
                        }`}
                      >
                        <div>
                          {/* Slip Header */}
                          <div className="flex items-center justify-between pb-2.5 border-b border-stone-800 mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-amber-400 text-sm">
                                {ord.id}
                              </span>
                              <span
                                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                                  ord.orderType === 'dine_in'
                                    ? 'bg-amber-400 text-stone-950'
                                    : 'bg-stone-800 text-stone-300'
                                }`}
                              >
                                {ord.orderType === 'dine_in' ? `🍽️ ${ord.tableNumber || 'Table'}` : '🛍️ Takeaway'}
                              </span>
                            </div>

                            <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-500" />
                              <span>
                                {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </span>
                          </div>

                          {/* Guest & Server Info */}
                          <div className="text-xs text-stone-300 mb-3 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-white truncate">
                                {ord.customerName || (ord.orderType === 'dine_in' ? `${ord.tableNumber} Guest` : 'Counter Guest')}
                              </p>
                              {ord.guestCount && ord.orderType === 'dine_in' && (
                                <span className="text-[11px] text-stone-400 font-mono">
                                  {ord.guestCount} Guests
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                              <span>Phone: {ord.customerPhone}</span>
                              {ord.serverName && <span>Server: {ord.serverName}</span>}
                            </div>

                            {/* Kitchen Cooking Notes Alert */}
                            {ord.cookingNotes && (
                              <div className="mt-2 text-[11px] text-amber-300 bg-stone-950 p-2 rounded-lg border border-amber-500/30 flex items-start gap-1.5">
                                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span className="italic leading-relaxed">{ord.cookingNotes}</span>
                              </div>
                            )}
                          </div>

                          {/* Order Items List */}
                          <div className="space-y-1.5 text-xs text-stone-300 border-t border-stone-800 pt-2.5 max-h-48 overflow-y-auto pr-1">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="space-y-0.5">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-white flex items-center gap-1.5">
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        it.item.dietary === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'
                                      }`}
                                    />
                                    <span>
                                      {it.quantity}x {it.item.name}
                                    </span>
                                  </span>
                                  <span className="font-mono text-stone-400 text-[11px]">
                                    ₹{it.item.price * it.quantity}
                                  </span>
                                </div>
                                {it.instructions && (
                                  <p className="text-[10px] text-amber-300/80 italic pl-3">
                                    ↳ {it.instructions}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Financials Breakdown */}
                          <div className="pt-2 mt-2 border-t border-stone-800 space-y-1 text-xs">
                            <div className="flex justify-between items-center font-bold text-white">
                              <span>Grand Total:</span>
                              <span className="font-mono text-amber-400 text-sm">₹{ord.total}</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 pt-1">
                              <span className="capitalize">
                                Mode: {ord.paymentMethod ? ord.paymentMethod.replace('_', ' ') : 'Pay Later'}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                                  ord.paymentStatus === 'paid'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                                }`}
                              >
                                {ord.paymentStatus || 'Unpaid'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions & Status Toolbar */}
                        <div className="pt-2.5 border-t border-stone-800 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  ord.id,
                                  e.target.value as any
                                )
                              }
                              className={`text-xs rounded-lg px-2.5 py-1.5 font-bold uppercase border focus:outline-none cursor-pointer flex-1 ${
                                ord.status === 'received'
                                  ? 'bg-amber-950 text-amber-400 border-amber-800'
                                  : ord.status === 'preparing'
                                  ? 'bg-blue-950 text-blue-300 border-blue-800'
                                  : ord.status === 'served'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : ord.status === 'completed'
                                  ? 'bg-stone-950 text-stone-300 border-stone-800'
                                  : 'bg-red-950 text-red-400 border-red-800'
                              }`}
                            >
                              <option value="received">🟡 Received (Queue)</option>
                              <option value="preparing">🔵 In Kitchen (Prep)</option>
                              <option value="served">🟢 Served / Ready</option>
                              <option value="completed">⚪ Completed / Settled</option>
                              <option value="cancelled">🔴 Cancelled</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setPrintingOrder(ord)}
                              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Print KOT Slip"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingOrder(ord);
                                setIsAddOrderOpen(false);
                              }}
                              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Edit Table Order Slip (Add/Modify items)"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-1.5 bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete KOT Slip"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quick progression shortcuts */}
                          <div className="flex gap-1.5 pt-0.5">
                            {ord.status === 'received' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                                className="w-full py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded transition-colors cursor-pointer"
                              >
                                ▶ Start Prep in Kitchen
                              </button>
                            )}
                            {ord.status === 'preparing' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(ord.id, 'served')}
                                className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded transition-colors cursor-pointer"
                              >
                                ✓ Mark Dishes Served
                              </button>
                            )}
                            {ord.status === 'served' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                                className="w-full py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 text-[11px] font-bold rounded transition-colors cursor-pointer"
                              >
                                ★ Complete Bill & Free Table
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BRANCHES SETTINGS */}
          {activeTab === 'branches' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Outlets & Store Operations CMS</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Manage outlet names, locations, phone lines, seating capacity, google maps, and amenities.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newId = `outlet-${Date.now()}`;
                    const newBranch: BranchInfo = {
                      id: newId,
                      name: 'Behind Yellow Doors New Outlet',
                      tagline: 'Artisanal Cafe & Lounge',
                      address: 'Varanasi, Uttar Pradesh, India',
                      landmark: 'Near Major Landmark',
                      phone: '+91 6393 138 560',
                      altPhone: '+91 9151 805 152',
                      email: 'contact@byddiner.com',
                      timings: '11:30 AM – 11:00 PM Daily',
                      googleMapsUrl: 'https://maps.google.com',
                      seatingCapacity: 45,
                      features: ['Wood-Fired Pizza', 'Artisanal Coffee', 'Free High-Speed WiFi'],
                    };
                    onUpdateBranches((prev) => [...prev, newBranch]);
                    showToast('New outlet added! Fill in the details below.');
                  }}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Outlet</span>
                </button>
              </div>

              <div className="space-y-6">
                {branches.map((b) => (
                  <div key={b.id} className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800 gap-2">
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <h4 className="font-bold text-lg text-white font-display">{b.name}</h4>
                          <p className="text-xs text-amber-400">{b.tagline}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-stone-800 text-stone-300 font-mono text-xs">
                          Capacity: {b.seatingCapacity} seats
                        </span>
                        {branches.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete outlet "${b.name}"?`)) {
                                onUpdateBranches((prev) => prev.filter((item) => item.id !== b.id));
                                showToast(`Outlet "${b.name}" removed.`);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded transition-colors"
                            title="Delete Outlet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Outlet Display Name</label>
                        <input
                          type="text"
                          value={b.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, name: val } : item))
                            );
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Tagline / Ambiance Title</label>
                        <input
                          type="text"
                          value={b.tagline}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, tagline: val } : item))
                            );
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Seating Capacity (Guests)</label>
                        <input
                          type="number"
                          min="10"
                          value={b.seatingCapacity}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, seatingCapacity: val } : item))
                            );
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Primary Phone</label>
                        <input
                          type="text"
                          value={b.phone}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, phone: val } : item))
                            );
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Secondary / Manager Phone</label>
                        <input
                          type="text"
                          value={b.altPhone || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, altPhone: val } : item))
                            );
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Official Email</label>
                        <input
                          type="email"
                          value={b.email || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, email: val } : item))
                            );
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Full Street Address</label>
                        <input
                          type="text"
                          value={b.address}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, address: val } : item))
                            );
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Landmark</label>
                        <input
                          type="text"
                          value={b.landmark || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, landmark: val } : item))
                            );
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Operating Timings</label>
                        <input
                          type="text"
                          value={b.timings}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, timings: val } : item))
                            );
                          }}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Google Maps Direction URL</label>
                        <input
                          type="url"
                          value={b.googleMapsUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, googleMapsUrl: val } : item))
                            );
                          }}
                          placeholder="https://maps.google.com/..."
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Features & Amenities (Comma separated)</label>
                        <input
                          type="text"
                          value={b.features ? b.features.join(', ') : ''}
                          onChange={(e) => {
                            const val = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            onUpdateBranches((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, features: val } : item))
                            );
                          }}
                          placeholder="e.g. Wood-Fired Pizza, Valet Parking, Terrace Seating"
                          className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        </div>
      </div>

      {/* MODALS */}
      {(isAddReservationOpen || editingReservation) && (
        <ReservationEditModal
          reservation={editingReservation}
          onClose={() => {
            setIsAddReservationOpen(false);
            setEditingReservation(null);
          }}
          onSave={handleSaveReservation}
        />
      )}

      {(isAddDishOpen || editingDish) && (
        <DishEditModal
          dish={editingDish}
          presetImages={presetFoodImages}
          onClose={() => {
            setIsAddDishOpen(false);
            setEditingDish(null);
          }}
          onSave={handleSaveDish}
        />
      )}

      {(isAddPhotoOpen || editingPhoto) && (
        <PhotoEditModal
          photo={editingPhoto}
          foodPresets={presetFoodImages}
          ambiancePresets={presetAmbianceImages}
          momentsPresets={presetMomentsImages}
          onClose={() => {
            setIsAddPhotoOpen(false);
            setEditingPhoto(null);
          }}
          onSave={handleSavePhoto}
        />
      )}

      {(isAddVideoOpen || editingVideo) && (
        <VideoEditModal
          video={editingVideo}
          onClose={() => {
            setIsAddVideoOpen(false);
            setEditingVideo(null);
          }}
          onSave={handleSaveVideo}
        />
      )}

      {(isAddFaqOpen || editingFaq) && (
        <FaqEditModal
          faq={editingFaq}
          onClose={() => {
            setIsAddFaqOpen(false);
            setEditingFaq(null);
          }}
          onSave={handleSaveFaq}
        />
      )}

      {/* MANUAL TABLE & KITCHEN ORDER MODAL */}
      {(isAddOrderOpen || editingOrder) && (
        <ManualOrderModal
          order={editingOrder}
          menuItems={menuItems}
          branches={branches}
          onClose={() => {
            setIsAddOrderOpen(false);
            setEditingOrder(null);
          }}
          onSave={handleSaveOrder}
        />
      )}

      {/* THERMAL KOT SLIP QUICK PRINT DIALOG */}
      {printingOrder && (
        <div className="fixed inset-0 z-60 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Thermal KOT Slip · {printingOrder.id}</span>
              </h3>
              <button
                onClick={() => setPrintingOrder(null)}
                className="p-1 text-stone-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Slip Content */}
            <div className="bg-white text-stone-900 p-4 rounded-lg font-mono text-xs space-y-2.5 shadow-inner">
              <div className="text-center border-b border-dashed border-stone-400 pb-2">
                <h4 className="font-bold text-sm tracking-wider uppercase">BEHIND YELLOW DOORS</h4>
                <p className="text-[10px] text-stone-600 font-sans">Varanasi Flagship KOT</p>
                <p className="text-[10px] text-stone-500">{new Date(printingOrder.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex justify-between font-bold text-[11px] border-b border-dashed border-stone-400 pb-2">
                <span>{printingOrder.orderType === 'dine_in' ? `TABLE: ${printingOrder.tableNumber || 'Table'}` : 'TAKEAWAY PARCEL'}</span>
                <span>#{printingOrder.id}</span>
              </div>

              <div className="text-[10px] text-stone-600 space-y-0.5">
                <p>Guest: {printingOrder.customerName || 'Walk-in'} ({printingOrder.customerPhone})</p>
                {printingOrder.serverName && <p>Server: {printingOrder.serverName}</p>}
                {printingOrder.guestCount && <p>Party Size: {printingOrder.guestCount} Guests</p>}
              </div>

              <div className="border-t border-b border-stone-400 py-2 space-y-1">
                {printingOrder.items.map((it, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-semibold">
                      <span>{it.quantity}x {it.item.name}</span>
                      <span>₹{it.item.price * it.quantity}</span>
                    </div>
                    {it.instructions && (
                      <p className="text-[9px] text-amber-800 font-sans italic pl-2">
                        ↳ {it.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {printingOrder.cookingNotes && (
                <div className="bg-stone-100 p-2 rounded text-[10px] border border-stone-300">
                  <span className="font-bold">NOTE: </span>
                  <span>{printingOrder.cookingNotes}</span>
                </div>
              )}

              <div className="border-t border-dashed border-stone-400 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{printingOrder.subtotal}</span>
                </div>
                {printingOrder.discount && printingOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{printingOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{printingOrder.gst}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-stone-300">
                  <span>TOTAL:</span>
                  <span>₹{printingOrder.total}</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 pt-1">
                  <span>Mode: {printingOrder.paymentMethod ? printingOrder.paymentMethod.toUpperCase() : 'PAY LATER'}</span>
                  <span>State: {printingOrder.paymentStatus ? printingOrder.paymentStatus.toUpperCase() : 'UNPAID'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Thermal Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-MODAL: VIDEO EDIT
// ==========================================
interface VideoEditModalProps {
  video: DinerVideo | null;
  onClose: () => void;
  onSave: (vid: DinerVideo) => void;
}

const VideoEditModal: React.FC<VideoEditModalProps> = ({ video, onClose, onSave }) => {
  const [title, setTitle] = useState(video?.title || '');
  const [description, setDescription] = useState(video?.description || '');
  const [category, setCategory] = useState<'culinary' | 'ambiance' | 'stories'>(video?.category || 'culinary');
  const [videoUrl, setVideoUrl] = useState(video?.videoUrl || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(video?.thumbnailUrl || '');
  const [duration, setDuration] = useState(video?.duration || '0:45');

  const presetVideos = [
    {
      label: 'Wood-Fired Pizza Dough',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-kneading-dough-42416-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      title: 'Handcrafting Neapolitan Sourdough',
      category: 'culinary' as const,
      duration: '0:45',
      description: 'Watch Chef prepare our 48-hour slow fermented dough with San Marzano coulis.',
    },
    {
      label: 'Sizzling Brownie & Gelato',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-chocolate-sauce-on-ice-cream-41589-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      title: 'The Sizzling Cast Iron Brownie Experience',
      category: 'culinary' as const,
      duration: '0:32',
      description: 'Decadent dark chocolate molten fudge melting over Madagascar vanilla gelato.',
    },
    {
      label: 'Evening Bar & Ambiance',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waiter-serving-drinks-in-a-bar-42171-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      title: 'Evening Ambiance Behind Yellow Doors',
      category: 'ambiance' as const,
      duration: '1:10',
      description: 'Filament lighting, cozy banquette booths, and acoustic melodies at our Sigra dining hall.',
    },
    {
      label: 'Single Origin Pour Over Coffee',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-making-coffee-in-a-glass-pot-42418-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
      title: 'Artisan Single Origin Pour Over Coffee',
      category: 'culinary' as const,
      duration: '0:50',
      description: 'Slow-drip specialty brews crafted by certified baristas at Bhojuveer deck.',
    },
  ];

  const handleSelectPreset = (p: typeof presetVideos[0]) => {
    setTitle(p.title);
    setVideoUrl(p.videoUrl);
    setThumbnailUrl(p.thumbnailUrl);
    setCategory(p.category);
    setDuration(p.duration);
    setDescription(p.description);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) return;

    onSave({
      id: video ? video.id : `vid-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      duration: duration.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 text-white relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold font-display mb-1">
          {video ? 'Edit Diner Video Reel' : 'Add New Cinema Video'}
        </h3>
        <p className="text-xs text-stone-400 mb-5">
          Embed an MP4 clip or stream into the Cinema & Stories section.
        </p>

        {/* Quick Presets Bar */}
        <div className="mb-4 bg-stone-950 p-2.5 rounded-xl border border-stone-800">
          <span className="text-[10px] text-stone-400 block mb-1.5 font-semibold uppercase">1-Click Demo Video Presets:</span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {presetVideos.map((pv, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(pv)}
                className={`px-2.5 py-1 text-[11px] rounded-lg border whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  videoUrl === pv.videoUrl
                    ? 'bg-amber-400 text-stone-950 font-bold border-amber-300'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-amber-400/70'
                }`}
              >
                {pv.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Video Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sizzling Cast Iron Brownie Preparation"
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              >
                <option value="culinary">Culinary Craft</option>
                <option value="ambiance">Ambiance & Atmosphere</option>
                <option value="stories">Diner Moments</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Duration Tag</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 0:45"
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Video Stream URL (MP4 / WebM) *</label>
            <input
              type="url"
              required
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://...mp4"
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Cover Thumbnail Image URL</label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded"
            >
              Save Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// SUB-MODAL: FAQ EDIT
// ==========================================
interface FaqEditModalProps {
  faq: FaqItem | null;
  onClose: () => void;
  onSave: (faq: FaqItem) => void;
}

const FaqEditModal: React.FC<FaqEditModalProps> = ({ faq, onClose, onSave }) => {
  const [question, setQuestion] = useState(faq?.question || '');
  const [answer, setAnswer] = useState(faq?.answer || '');
  const [category, setCategory] = useState<'reservations' | 'food' | 'locations' | 'events'>(
    faq?.category || 'reservations'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    onSave({
      id: faq ? faq.id : `faq-${Date.now()}`,
      question: question.trim(),
      answer: answer.trim(),
      category,
    });
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 text-white relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold font-display mb-1">
          {faq ? 'Edit FAQ Item' : 'Add New FAQ Question'}
        </h3>
        <p className="text-xs text-stone-400 mb-5">
          Provide helpful information for diners in Varanasi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Question *</label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Do you have Jain food?"
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            >
              <option value="reservations">Reservations & Bookings</option>
              <option value="food">Food, Menu & Diets</option>
              <option value="locations">Locations & Parking</option>
              <option value="events">Private Events</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Answer *</label>
            <textarea
              rows={4}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Provide a clear, welcoming answer..."
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded"
            >
              Save FAQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// SUB-MODALS: RESERVATION, DISH, PHOTO
// ==========================================
interface ReservationEditModalProps {
  reservation: Reservation | null;
  onClose: () => void;
  onSave: (res: Reservation) => void;
}

const ReservationEditModal: React.FC<ReservationEditModalProps> = ({ reservation, onClose, onSave }) => {
  const [fullName, setFullName] = useState(reservation?.fullName || '');
  const [phone, setPhone] = useState(reservation?.phone || '');
  const [email, setEmail] = useState(reservation?.email || '');
  const [branch, setBranch] = useState<'sigra' | 'bhojuveer' | string>(reservation?.branch || 'sigra');
  const [date, setDate] = useState(reservation?.date || new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(reservation?.timeSlot || '7:30 PM');
  const [guests, setGuests] = useState(reservation?.guests || 2);
  const [seatingArea, setSeatingArea] = useState<'indoor_booth' | 'yellow_door_terrace' | 'family_lounge' | string>(
    reservation?.seatingArea || 'indoor_booth'
  );
  const [status, setStatus] = useState<'confirmed' | 'pending' | 'cancelled'>(reservation?.status || 'confirmed');
  const [specialRequests, setSpecialRequests] = useState(reservation?.specialRequests || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const res: Reservation = {
      id: reservation ? reservation.id : `BYD-${Math.floor(1000 + Math.random() * 9000)}`,
      branch,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date,
      timeSlot,
      guests: Number(guests),
      seatingArea,
      status,
      specialRequests: specialRequests.trim() || undefined,
      createdAt: reservation ? reservation.createdAt : new Date().toISOString(),
    };
    onSave(res);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 text-white relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold font-display mb-1">
          {reservation ? `Edit Reservation #${reservation.id}` : 'New Manual Table Booking'}
        </h3>
        <p className="text-xs text-stone-400 mb-5">
          Record diner details for phone bookings or table adjustments.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Guest Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Diner Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as 'sigra' | 'bhojuveer')}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              >
                <option value="sigra">Sigra Branch</option>
                <option value="bhojuveer">Bhojuveer Branch</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Party Size (Guests)</label>
              <input
                type="number"
                min="1"
                max="25"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              >
                <option value="12:15 PM">12:15 PM (Lunch)</option>
                <option value="1:00 PM">1:00 PM (Lunch)</option>
                <option value="2:30 PM">2:30 PM (Lunch)</option>
                <option value="6:45 PM">6:45 PM (Dinner)</option>
                <option value="7:30 PM">7:30 PM (Dinner)</option>
                <option value="8:15 PM">8:15 PM (Dinner)</option>
                <option value="9:00 PM">9:00 PM (Dinner)</option>
                <option value="9:45 PM">9:45 PM (Dinner)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Seating Section</label>
              <select
                value={seatingArea}
                onChange={(e) => setSeatingArea(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              >
                <option value="indoor_booth">Indoor Cozy Booth</option>
                <option value="yellow_door_terrace">Yellow Door Terrace</option>
                <option value="family_lounge">Family Lounge</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Booking Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Special Notes / Dietary Requirements</label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Anniversary candlelight table, baby chair needed..."
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded"
            >
              Save Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DishEditModalProps {
  dish: MenuItem | null;
  presetImages: string[];
  onClose: () => void;
  onSave: (dish: MenuItem) => void;
}

const DishEditModal: React.FC<DishEditModalProps> = ({ dish, presetImages, onClose, onSave }) => {
  const [name, setName] = useState(dish?.name || '');
  const [category, setCategory] = useState<CuisineCategory>(dish?.category || 'starters');
  const [price, setPrice] = useState(dish?.price || 350);
  const [dietary, setDietary] = useState<DietaryType>(dish?.dietary || 'veg');
  const [isChefsSpecial, setIsChefsSpecial] = useState(dish?.isChefsSpecial || false);
  const [isPopular, setIsPopular] = useState(dish?.isPopular || false);
  const [branchAvailability, setBranchAvailability] = useState<string[]>(
    dish?.branchAvailability || ['sigra', 'bhojuveer']
  );
  const [spiceLevel, setSpiceLevel] = useState<0 | 1 | 2 | 3>(dish?.spiceLevel || 1);
  const [description, setDescription] = useState(dish?.description || '');
  const [ingredientsText, setIngredientsText] = useState(dish?.ingredients ? dish.ingredients.join(', ') : '');
  const [image, setImage] = useState(dish?.image || presetImages[0]);

  const toggleBranch = (bId: string) => {
    setBranchAvailability((prev) =>
      prev.includes(bId) ? prev.filter((id) => id !== bId) : [...prev, bId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const ingArray = ingredientsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const savedDish: MenuItem = {
      id: dish ? dish.id : name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: name.trim(),
      category,
      price: Number(price),
      dietary,
      isChefsSpecial,
      isPopular,
      branchAvailability: branchAvailability.length > 0 ? (branchAvailability as any) : undefined,
      spiceLevel,
      description: description.trim(),
      ingredients: ingArray.length > 0 ? ingArray : undefined,
      image,
    };
    onSave(savedDish);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 text-white relative animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold font-display mb-1">
          {dish ? `Edit Dish: ${dish.name}` : 'Add New Culinary Creation'}
        </h3>
        <p className="text-xs text-stone-400 mb-5">
          Fill in dish details and preview live on the Behind Yellow Doors menu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Dish Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Quattro Funghi Truffle Pizza"
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min="50"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CuisineCategory)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              >
                <option value="starters">Small Plates & Starters</option>
                <option value="pizza_pasta">Wood-Fired Pizza & Pasta</option>
                <option value="global_mains">Global Mains & Curries</option>
                <option value="asian_dimsum">Asian Dim Sum & Bowls</option>
                <option value="texmex">Tex-Mex & Tacos</option>
                <option value="beverages">Artisanal Coffee & Shakes</option>
                <option value="desserts">Decadent Desserts</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Dietary Classification</label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value as DietaryType)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              >
                <option value="veg">Vegetarian (Green Leaf)</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="jain-available">Jain Friendly Available</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Spice Level (0 to 3)</label>
              <select
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(Number(e.target.value) as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              >
                <option value="0">Mild / No Spice (0)</option>
                <option value="1">Medium Spice (1)</option>
                <option value="2">Spicy & Tangy (2)</option>
                <option value="3">Fiery Chef Spiced (3)</option>
              </select>
            </div>
            <div className="pt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="isChefsSpecial"
                checked={isChefsSpecial}
                onChange={(e) => setIsChefsSpecial(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700 cursor-pointer"
              />
              <label htmlFor="isChefsSpecial" className="text-stone-300 font-semibold cursor-pointer">
                Chef&apos;s Special
              </label>
            </div>
            <div className="pt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="isPopular"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700 cursor-pointer"
              />
              <label htmlFor="isPopular" className="text-stone-300 font-semibold cursor-pointer">
                Diner Popular
              </label>
            </div>
          </div>

          {/* Branch Availability */}
          <div className="pt-1">
            <label className="block text-stone-400 text-[11px] mb-1.5 uppercase">Available at Outlets:</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={branchAvailability.includes('sigra')}
                  onChange={() => toggleBranch('sigra')}
                  className="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700"
                />
                <span>Sigra Flagship</span>
              </label>
              <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={branchAvailability.includes('bhojuveer')}
                  onChange={() => toggleBranch('bhojuveer')}
                  className="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700"
                />
                <span>Bhojuveer Lounge</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Crispy, fragrant, hand-stretched..."
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Key Ingredients (comma separated)</label>
            <input
              type="text"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="e.g. Buffalo Mozzarella, San Marzano, Fresh Basil"
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Photo Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono mb-2"
            />

            <span className="text-[10px] text-stone-400 block mb-1.5">Or choose a preset photography asset:</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {presetImages.map((pImg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(pImg)}
                  className={`w-14 h-10 rounded border overflow-hidden shrink-0 transition-all ${
                    image === pImg ? 'border-amber-400 ring-1 ring-amber-400' : 'border-stone-800 opacity-60'
                  }`}
                >
                  <img src={pImg} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded"
            >
              Save Dish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PhotoEditModalProps {
  photo: GalleryPhoto | null;
  foodPresets: string[];
  ambiancePresets: string[];
  momentsPresets: string[];
  onClose: () => void;
  onSave: (photo: GalleryPhoto) => void;
}

const PhotoEditModal: React.FC<PhotoEditModalProps> = ({
  photo,
  foodPresets,
  ambiancePresets,
  momentsPresets,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(photo?.title || '');
  const [category, setCategory] = useState<'food' | 'ambiance' | 'moments'>(photo?.category || 'food');
  const [location, setLocation] = useState(photo?.location || 'Sigra Wood-Fired Oven');
  const [caption, setCaption] = useState(photo?.caption || '');
  const [imageUrl, setImageUrl] = useState(photo?.imageUrl || foodPresets[0]);

  const activePresets =
    category === 'food'
      ? foodPresets
      : category === 'ambiance'
      ? ambiancePresets
      : momentsPresets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    onSave({
      id: photo ? photo.id : `photo-${Date.now()}`,
      title: title.trim(),
      category,
      location: location.trim(),
      caption: caption.trim(),
      imageUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 text-white relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold font-display mb-1">
          {photo ? 'Edit Gallery Photo' : 'Upload New Gallery Photo'}
        </h3>
        <p className="text-xs text-stone-400 mb-5">
          Add photography to the public lightbox showcase.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Photo Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Evening Candlelight on Terrace"
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Gallery Section</label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as 'food' | 'ambiance' | 'moments';
                  setCategory(newCat);
                  if (newCat === 'food') setImageUrl(foodPresets[0]);
                  else if (newCat === 'ambiance') setImageUrl(ambiancePresets[0]);
                  else setImageUrl(momentsPresets[0]);
                }}
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              >
                <option value="food">Our Food</option>
                <option value="ambiance">Our Ambiance</option>
                <option value="moments">Customer Moments</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 text-[11px] mb-1">Location Tag</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bhojuveer Cafe Deck"
                className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Context Caption</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Descriptive details for the lightbox viewer..."
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-white font-mono mb-2"
            />

            <span className="text-[10px] text-stone-400 block mb-1">
              Pick from {category.toUpperCase()} presets:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {activePresets.map((pImg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(pImg)}
                  className={`w-14 h-10 rounded border overflow-hidden shrink-0 transition-all ${
                    imageUrl === pImg
                      ? 'border-amber-400 ring-2 ring-amber-400'
                      : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={pImg} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded"
            >
              Save Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
