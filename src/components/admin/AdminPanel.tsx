import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { BranchInfo, CuisineCategory, DietaryType, GalleryPhoto, KitchenOrder, MenuItem, Reservation, Review } from '../../types';
import { BydLogo } from '../BydLogo';
import { SafeImage } from '../SafeImage';

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
  onResetToDefaults: () => void;
}

type AdminTab = 'dashboard' | 'reservations' | 'menu' | 'gallery' | 'reviews' | 'orders' | 'branches';

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
  onResetToDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'all' | 'sigra' | 'bhojuveer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals for CRUD operations
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Preset food images for easy 1-click addition
  const presetFoodImages = [
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584208632869-05fa2b2a5971?auto=format&fit=crop&w=800&q=80',
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
    { id: 'menu', label: 'Menu & Dishes', icon: UtensilsCrossed, badge: menuItems.length },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon, badge: galleryPhotos.length },
    { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare, badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined, badgeColor: 'bg-amber-500' },
    { id: 'orders', label: 'Live Kitchen Orders', icon: ShoppingBag, badge: liveOrdersCount > 0 ? liveOrdersCount : undefined, badgeColor: 'bg-emerald-500' },
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
              Behind Yellow Doors <span className="text-amber-400 font-mono text-xs uppercase px-2 py-0.5 bg-amber-950/80 rounded border border-amber-600/40">Admin Suite</span>
            </h1>
            <p className="text-[10px] text-stone-400 font-mono hidden sm:block">
              Varanasi Flagship Management Console · Sigra & Bhojuveer
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3">
          {/* Branch Filter dropdown */}
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
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR (Features navigation) */}
        <aside className="w-64 bg-stone-900/90 border-r border-stone-800 flex flex-col justify-between shrink-0 p-3 sm:p-4 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
              Management Controls
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
                if (window.confirm('Reset all demo data (Menu, Bookings, Reviews, Gallery) back to default?')) {
                  onResetToDefaults();
                  showToast('Database reset to defaults.');
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] text-stone-400 hover:text-amber-400 hover:bg-stone-800/80 rounded-lg transition-colors cursor-pointer border border-stone-800"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="flex-1 bg-stone-950 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Manager Dashboard</h2>
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
                    className="text-[11px] text-amber-400 hover:underline mt-3 text-left flex items-center gap-1"
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
                    className="text-[11px] text-amber-400 hover:underline mt-3 text-left flex items-center gap-1"
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
                    className="text-[11px] text-amber-400 hover:underline mt-3 text-left flex items-center gap-1"
                  >
                    <span>Edit dishes & pricing</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Reviews Queue</span>
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-white tabular-nums">
                      {pendingReviewsCount}
                    </span>
                    <span className={`text-xs font-mono ${pendingReviewsCount > 0 ? 'text-amber-400' : 'text-stone-400'}`}>
                      {pendingReviewsCount > 0 ? 'Needs approval' : 'All clear'}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-[11px] text-amber-400 hover:underline mt-3 text-left flex items-center gap-1"
                  >
                    <span>Review moderation center</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Quick Actions & Recent Bookings Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Bookings Feed */}
                <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Latest Table Bookings</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('reservations')}
                      className="text-xs text-amber-400 hover:underline"
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

                {/* Quick Action Buttons */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                    <h3 className="font-bold text-sm text-white">Quick Tasks</h3>

                    <button
                      onClick={() => setIsAddDishOpen(true)}
                      className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Dish to Menu</span>
                    </button>

                    <button
                      onClick={() => setIsAddReservationOpen(true)}
                      className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors border border-stone-700"
                    >
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Manual Table Booking</span>
                    </button>

                    <button
                      onClick={() => setIsAddPhotoOpen(true)}
                      className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors border border-stone-700"
                    >
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Upload Gallery Photo</span>
                    </button>

                    <button
                      onClick={handleExportReservationsCSV}
                      className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors border border-stone-700"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Export Bookings CSV</span>
                    </button>
                  </div>
                </div>
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

          {/* TAB 3: MENU & DISHES EDITOR (CRUD + UPLOAD) */}
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

              {/* Search & Category Filter */}
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
                        {/* Image Thumbnail with Tag */}
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

                      {/* Card Action Controls */}
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
                  <h2 className="text-2xl font-bold font-display text-white">Photo Gallery Manager</h2>
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

              {/* Photos Grid */}
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
                        className="text-xs text-stone-300 hover:text-white flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Caption</span>
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-xs text-stone-400 hover:text-red-400 flex items-center gap-1"
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

          {/* TAB 5: REVIEWS & MODERATION CENTER */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Reviews Moderation Center</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Ensure review authenticity. Approve submitted customer testimonials or discard spam.
                </p>
              </div>

              {/* Reviews List */}
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

                    {/* Status & Moderation Controls */}
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
                        className="p-1 text-stone-500 hover:text-red-400 transition-colors"
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

          {/* TAB 6: KITCHEN & TAKEAWAY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Live Kitchen Order Slips (KOT)</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Real-time ticket feed for dine-in tables and takeaway counter orders.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-12 text-center text-stone-400">
                  <ShoppingBag className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-stone-300">No active orders right now.</p>
                  <p className="text-xs mt-1">Orders placed via the menu cart will populate here live.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2">
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            {ord.id}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="text-xs text-stone-300 mb-3">
                          <p className="font-semibold text-white">
                            {ord.orderType === 'dine_in' ? `Table: ${ord.tableNumber}` : `Takeaway Pickup: ${ord.customerName || 'Guest'}`}
                          </p>
                          <p className="text-stone-400 font-mono text-[11px]">Phone: {ord.customerPhone}</p>
                          {ord.cookingNotes && (
                            <p className="text-[11px] text-amber-300/80 italic mt-1 bg-stone-950 p-1.5 rounded border border-stone-800">
                              Note: {ord.cookingNotes}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5 text-xs text-stone-300 border-t border-stone-800 pt-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>
                                {it.quantity}x {it.item.name}
                              </span>
                              <span className="font-mono text-stone-400">₹{it.item.price * it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between font-bold text-white text-xs pt-2 mt-2 border-t border-stone-800">
                          <span>Total Amount:</span>
                          <span className="font-mono text-amber-400">₹{ord.total}</span>
                        </div>
                      </div>

                      {/* Status Stepper */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-800">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(
                              ord.id,
                              e.target.value as 'received' | 'preparing' | 'served' | 'completed' | 'cancelled'
                            )
                          }
                          className="bg-stone-950 border border-stone-700 text-xs rounded px-2 py-1 text-white font-medium focus:outline-none"
                        >
                          <option value="received">Received</option>
                          <option value="preparing">In Kitchen</option>
                          <option value="served">Served / Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1 text-stone-500 hover:text-red-400"
                          title="Remove slip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BRANCHES & OUTLETS SETTINGS */}
          {activeTab === 'branches' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Outlets & Store Operations</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Manage phone lines, addresses, operating hours, and capacity limits.
                </p>
              </div>

              <div className="space-y-6">
                {branches.map((b) => (
                  <div key={b.id} className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                      <div>
                        <h4 className="font-bold text-lg text-white">{b.name}</h4>
                        <p className="text-xs text-amber-400">{b.tagline}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-xs uppercase">
                        Capacity: {b.seatingCapacity} seats
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                        <label className="block text-stone-400 text-[11px] uppercase mb-1">Address & Landmark</label>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD / EDIT RESERVATION */}
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

      {/* MODAL 2: ADD / EDIT DISH */}
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

      {/* MODAL 3: ADD / EDIT PHOTO */}
      {(isAddPhotoOpen || editingPhoto) && (
        <PhotoEditModal
          photo={editingPhoto}
          presetImages={presetFoodImages}
          onClose={() => {
            setIsAddPhotoOpen(false);
            setEditingPhoto(null);
          }}
          onSave={handleSavePhoto}
        />
      )}
    </div>
  );
};

// ==========================================
// SUB-MODAL: RESERVATION CREATE / EDIT
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
  const [branch, setBranch] = useState<'sigra' | 'bhojuveer'>(reservation?.branch || 'sigra');
  const [date, setDate] = useState(reservation?.date || new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(reservation?.timeSlot || '7:30 PM');
  const [guests, setGuests] = useState(reservation?.guests || 2);
  const [seatingArea, setSeatingArea] = useState<'indoor_booth' | 'yellow_door_terrace' | 'family_lounge'>(
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

// ==========================================
// SUB-MODAL: DISH CREATE / EDIT
// ==========================================
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
  const [spiceLevel, setSpiceLevel] = useState<0 | 1 | 2 | 3>(dish?.spiceLevel || 1);
  const [description, setDescription] = useState(dish?.description || '');
  const [ingredientsText, setIngredientsText] = useState(dish?.ingredients ? dish.ingredients.join(', ') : '');
  const [image, setImage] = useState(dish?.image || presetImages[0]);

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

          <div className="grid grid-cols-2 gap-3 items-center">
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
            <div className="pt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="isChefsSpecial"
                checked={isChefsSpecial}
                onChange={(e) => setIsChefsSpecial(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700"
              />
              <label htmlFor="isChefsSpecial" className="text-stone-300 font-semibold cursor-pointer">
                Chef&apos;s Signature Special
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

          {/* Image URL with Preset Pickers */}
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

// ==========================================
// SUB-MODAL: PHOTO CREATE / EDIT
// ==========================================
interface PhotoEditModalProps {
  photo: GalleryPhoto | null;
  presetImages: string[];
  onClose: () => void;
  onSave: (photo: GalleryPhoto) => void;
}

const PhotoEditModal: React.FC<PhotoEditModalProps> = ({ photo, presetImages, onClose, onSave }) => {
  const [title, setTitle] = useState(photo?.title || '');
  const [category, setCategory] = useState<'food' | 'ambiance' | 'moments'>(photo?.category || 'food');
  const [location, setLocation] = useState(photo?.location || 'Sigra Wood-Fired Oven');
  const [caption, setCaption] = useState(photo?.caption || '');
  const [imageUrl, setImageUrl] = useState(photo?.imageUrl || presetImages[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const savedPhoto: GalleryPhoto = {
      id: photo ? photo.id : `photo-${Date.now()}`,
      title: title.trim(),
      category,
      location: location.trim(),
      caption: caption.trim(),
      imageUrl,
    };
    onSave(savedPhoto);
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
                onChange={(e) => setCategory(e.target.value as any)}
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

            <span className="text-[10px] text-stone-400 block mb-1">Or pick a preset asset:</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {presetImages.map((pImg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(pImg)}
                  className={`w-14 h-10 rounded border overflow-hidden shrink-0 ${
                    imageUrl === pImg ? 'border-amber-400 ring-1 ring-amber-400' : 'border-stone-800 opacity-60'
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
