import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  UtensilsCrossed,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  ShoppingBag,
  Sparkles,
  Flame,
  CreditCard,
  Banknote,
  QrCode,
  DollarSign,
  Tag,
  User,
  Phone,
  Store,
} from 'lucide-react';
import { BranchInfo, CartItem, CuisineCategory, DietaryType, KitchenOrder, MenuItem } from '../../types';
import { SafeImage } from '../SafeImage';

interface ManualOrderModalProps {
  order: KitchenOrder | null;
  menuItems: MenuItem[];
  branches?: BranchInfo[];
  onClose: () => void;
  onSave: (order: KitchenOrder) => void;
}

const COMMON_TABLES = [
  'Table 1',
  'Table 2',
  'Table 3',
  'Table 4',
  'Table 5',
  'Table 6',
  'Table 7',
  'Table 8',
  'Rooftop 1',
  'Rooftop 2',
  'Courtyard T-1',
  'VIP Booth',
  'Bar Counter',
];

const QUICK_KITCHEN_NOTES = [
  '🌶️ Extra Spicy',
  '🍃 Jain / No Onion No Garlic',
  '👶 Mild Spice / Kids Friendly',
  '⚡ High Priority / Rush KOT',
  '🥗 Serve Starters First',
  '🍕 Extra Crispy Base',
  '💧 Pack 2 Water Bottles',
  '🧊 Extra Ice with Drinks',
];

const CATEGORIES: { id: CuisineCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Dishes' },
  { id: 'starters', label: 'Starters & Platters' },
  { id: 'pizza_pasta', label: 'Wood-Fired Pizza & Pasta' },
  { id: 'asian_dimsum', label: 'Asian & Dim Sum' },
  { id: 'texmex', label: 'Tex-Mex & Burgers' },
  { id: 'global_mains', label: 'Global Mains & Bowls' },
  { id: 'desserts', label: 'Desserts & Gelato' },
  { id: 'beverages', label: 'Beverages & Brews' },
];

export const ManualOrderModal: React.FC<ManualOrderModalProps> = ({
  order,
  menuItems,
  branches = [],
  onClose,
  onSave,
}) => {
  const isEditing = !!order;

  // Order Details State
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>(order?.orderType || 'dine_in');
  const [tableNumber, setTableNumber] = useState(order?.tableNumber || 'Table 1');
  const [customTable, setCustomTable] = useState('');
  const [customerName, setCustomerName] = useState(order?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(order?.customerPhone || '9838000000');
  const [branch, setBranch] = useState<string>(order?.branch || (branches[0]?.id || 'sigra'));
  const [serverName, setServerName] = useState(order?.serverName || 'Captain / Admin');
  const [guestCount, setGuestCount] = useState<number>(order?.guestCount || 2);
  const [cookingNotes, setCookingNotes] = useState(order?.cookingNotes || '');
  const [status, setStatus] = useState<KitchenOrder['status']>(order?.status || 'received');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card' | 'pay_later'>(
    (order?.paymentMethod as any) || 'pay_later'
  );
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | 'pending'>(
    order?.paymentStatus || 'unpaid'
  );
  const [discountAmount, setDiscountAmount] = useState<number>(order?.discount || 0);
  const [discountReason, setDiscountReason] = useState(order?.discountReason || '');
  const [applyGst, setApplyGst] = useState(true);

  // Cart / Order Items State
  const [items, setItems] = useState<CartItem[]>(order ? [...order.items] : []);

  // Menu Search & Filter
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CuisineCategory | 'all'>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Custom Ad-hoc Item modal state
  const [isAddingCustomItem, setIsAddingCustomItem] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('150');
  const [customItemDietary, setCustomItemDietary] = useState<DietaryType>('veg');

  // Thermal Print Preview state
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((m) => {
      if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
      if (dietaryFilter === 'veg' && m.dietary !== 'veg') return false;
      if (dietaryFilter === 'non-veg' && m.dietary !== 'non-veg') return false;
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.ingredients?.some((ing) => ing.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [menuItems, selectedCategory, dietaryFilter, menuSearch]);

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  }, [items]);

  const discount = Math.min(discountAmount || 0, subtotal);
  const taxableAmount = Math.max(0, subtotal - discount);
  const gst = applyGst ? Math.round(taxableAmount * 0.05) : 0;
  const grandTotal = taxableAmount + gst;

  // Handlers for cart
  const handleAddItem = (dish: MenuItem) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.item.id === dish.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + 1,
        };
        return next;
      }
      return [...prev, { item: dish, quantity: 1 }];
    });
  };

  const handleUpdateItemQuantity = (dishId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === dishId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleSetItemQuantity = (dishId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(dishId);
      return;
    }
    setItems((prev) =>
      prev.map((ci) => (ci.item.id === dishId ? { ...ci, quantity: qty } : ci))
    );
  };

  const handleUpdateItemInstruction = (dishId: string, instructions: string) => {
    setItems((prev) =>
      prev.map((ci) => (ci.item.id === dishId ? { ...ci, instructions } : ci))
    );
  };

  const handleRemoveItem = (dishId: string) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== dishId));
  };

  const handleAddCustomAdHocItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;
    const priceNum = Math.max(0, parseInt(customItemPrice, 10) || 0);
    const customDish: MenuItem = {
      id: `custom-${Date.now()}`,
      name: customItemName.trim(),
      category: 'starters',
      price: priceNum,
      dietary: customItemDietary,
      description: 'Custom chef request / off-menu order item',
      image:
        customItemDietary === 'veg'
          ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    };
    handleAddItem(customDish);
    setCustomItemName('');
    setCustomItemPrice('150');
    setIsAddingCustomItem(false);
  };

  const handleToggleNoteChip = (chip: string) => {
    if (cookingNotes.includes(chip)) {
      setCookingNotes(
        cookingNotes
          .replace(chip, '')
          .replace(/,\s*,/g, ',')
          .trim()
      );
    } else {
      setCookingNotes((prev) => (prev ? `${prev}, ${chip}` : chip));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (items.length === 0) {
      setValidationError('Please select at least 1 food or beverage item for the order.');
      return;
    }

    const resolvedTable =
      orderType === 'dine_in'
        ? (customTable.trim() ? customTable.trim() : tableNumber)
        : undefined;

    if (orderType === 'dine_in' && !resolvedTable) {
      setValidationError('Please specify the Table Number.');
      return;
    }

    const newOrder: KitchenOrder = {
      id: order?.id || `KOT-${Math.floor(100 + Math.random() * 900)}`,
      orderType,
      tableNumber: resolvedTable,
      customerName: customerName.trim() || (orderType === 'dine_in' ? `${resolvedTable} Guests` : 'Counter Guest'),
      customerPhone: customerPhone.trim() || '9838000000',
      cookingNotes: cookingNotes.trim() || undefined,
      items: [...items],
      subtotal,
      gst,
      total: grandTotal,
      status,
      createdAt: order?.createdAt || new Date().toISOString(),
      branch,
      serverName: serverName.trim() || 'Captain',
      guestCount: orderType === 'dine_in' ? guestCount : undefined,
      paymentMethod,
      paymentStatus,
      discount: discount > 0 ? discount : undefined,
      discountReason: discount > 0 ? discountReason.trim() || undefined : undefined,
    };

    onSave(newOrder);
  };

  return (
    <div className="fixed inset-0 z-55 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  {isEditing ? `Edit Order Slip #${order.id}` : 'Create Manual Table Order (KOT)'}
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-600/30">
                  {orderType === 'dine_in' ? 'Dine-In Table' : 'Takeaway Parcel'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Dispatch kitchen order ticket with custom dishes, instructions, table assignment & billing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPrintPreview(!showPrintPreview)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle KOT Thermal Slip Preview"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{showPrintPreview ? 'Hide KOT Slip' : 'KOT Preview'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VALIDATION ERROR BANNER */}
        {validationError && (
          <div className="bg-red-950/80 border-b border-red-800/80 text-red-200 text-xs px-4 py-2.5 flex items-center gap-2 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* PRINT THERMAL SLIP PREVIEW OVERLAY */}
        {showPrintPreview && (
          <div className="bg-stone-950 border-b border-amber-500/30 p-4 shrink-0 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-white text-stone-900 rounded-lg p-5 font-mono text-xs shadow-2xl space-y-3 border-2 border-stone-300">
              <div className="text-center border-b border-dashed border-stone-400 pb-2">
                <h4 className="font-bold text-sm uppercase tracking-wider">BEHIND YELLOW DOORS</h4>
                <p className="text-[10px] text-stone-600">KITCHEN ORDER TICKET (KOT)</p>
                <p className="text-[10px] text-stone-500">{new Date().toLocaleString()}</p>
              </div>

              <div className="flex justify-between text-[11px] font-bold border-b border-dashed border-stone-400 pb-2">
                <span>{orderType === 'dine_in' ? `TABLE: ${customTable || tableNumber}` : 'TAKEAWAY / PARCEL'}</span>
                <span>ID: {order?.id || 'KOT-NEW'}</span>
              </div>

              <div className="text-[10px] space-y-0.5 text-stone-600">
                <p>Server: {serverName} | Guests: {guestCount}</p>
                <p>Guest: {customerName || 'Walk-in'} ({customerPhone})</p>
                <p>Outlet: {branches.find((b) => b.id === branch)?.name || branch}</p>
              </div>

              <div className="border-t border-b border-stone-400 py-2 space-y-1">
                <div className="flex justify-between font-bold text-[10px] uppercase text-stone-700">
                  <span>Item</span>
                  <span>Qty / Rate</span>
                </div>
                {items.length === 0 ? (
                  <p className="text-stone-400 italic text-center py-2 text-[10px]">No items added yet</p>
                ) : (
                  items.map((it, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span>
                          {it.quantity}x {it.item.name}
                        </span>
                        <span>₹{it.item.price * it.quantity}</span>
                      </div>
                      {it.instructions && (
                        <p className="text-[9px] text-amber-800 font-sans italic pl-2">
                          ↳ {it.instructions}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              {cookingNotes && (
                <div className="bg-stone-100 p-2 rounded text-[10px] border border-stone-200">
                  <span className="font-bold">KITCHEN NOTE: </span>
                  <span>{cookingNotes}</span>
                </div>
              )}

              <div className="border-t border-dashed border-stone-400 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-stone-300">
                  <span>GRAND TOTAL:</span>
                  <span>₹{grandTotal}</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 pt-1">
                  <span>Payment: {paymentMethod.toUpperCase()} ({paymentStatus.toUpperCase()})</span>
                  <span>Status: {status.toUpperCase()}</span>
                </div>
              </div>

              <div className="text-center text-[9px] text-stone-400 pt-1">
                *** End of Slip · Fast Service Guaranteed ***
              </div>
            </div>
          </div>
        )}

        {/* MAIN MODAL FORM BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TOP CONFIG BAR: TYPE, TABLE, BRANCH & GUEST DETAILS */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-850">
              {/* Order Type Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Order Mode:</span>
                <div className="inline-flex p-1 bg-stone-900 border border-stone-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine_in')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      orderType === 'dine_in'
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Dine-In Table Order</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      orderType === 'takeaway'
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Takeaway / Parcel</span>
                  </button>
                </div>
              </div>

              {/* Outlet Branch Selector */}
              <div className="flex items-center gap-2 text-xs">
                <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-stone-400 font-semibold">Outlet:</span>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="bg-stone-900 border border-stone-800 text-white rounded-lg px-2.5 py-1.5 text-xs focus:border-amber-400 focus:outline-none"
                >
                  {branches.length > 0 ? (
                    branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="sigra">Sigra Branch (Mahmoorganj Rd)</option>
                      <option value="bhojuveer">Bhojuveer Branch (Cantt Area)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* DINE-IN TABLE SELECTION */}
            {orderType === 'dine_in' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-stone-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>Select Dine-In Table</span>
                    <span className="text-amber-400 font-mono text-[11px]">
                      (Active: {customTable || tableNumber})
                    </span>
                  </label>
                  <span className="text-[11px] text-stone-500">Click quick table or enter custom</span>
                </div>

                {/* Quick Table Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_TABLES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTableNumber(t);
                        setCustomTable('');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                        !customTable && tableNumber === t
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-sm'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Custom Table & Party Size Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-stone-400 text-[11px] uppercase mb-1">
                      Custom Table / Section
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Table 14 / Rooftop Terrace"
                      value={customTable}
                      onChange={(e) => setCustomTable(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white placeholder:text-stone-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] uppercase mb-1">
                      Guest Count (Covers)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                      <span className="text-stone-400 text-xs whitespace-nowrap">Guests</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] uppercase mb-1">
                      Server / Waiter Assigned
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Captain Aman / Rohan"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* GUEST DETAILS & CONTACT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-stone-400 text-[11px] uppercase mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-stone-500" />
                  <span>Guest Name / Tag (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder={orderType === 'dine_in' ? 'Walk-in Guest / Rahul Verma' : 'Takeaway Customer Name'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white placeholder:text-stone-600 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 text-[11px] uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-stone-500" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="9838012345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white font-mono placeholder:text-stone-600 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: MENU DISH SELECTOR (LEFT) & ORDER TICKET SUMMARY (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: LIVE MENU BROWSER & DISH PICKER (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>1. Browse & Add Menu Offerings</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                      {filteredMenuItems.length} dishes
                    </span>
                  </h4>
                  <p className="text-[11px] text-stone-400">Click any dish to add to this table order slip.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingCustomItem(!isAddingCustomItem)}
                  className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Off-Menu Custom Dish</span>
                </button>
              </div>

              {/* CUSTOM AD-HOC ITEM CREATOR FORM */}
              {isAddingCustomItem && (
                <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Add Special Off-Menu Chef Request</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomItem(false)}
                      className="text-stone-400 hover:text-white text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Dish name (e.g. Extra Truffle Dip)"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="bg-stone-950 border border-stone-800 rounded p-1.5 text-white col-span-1 sm:col-span-2"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="₹ Price"
                        value={customItemPrice}
                        onChange={(e) => setCustomItemPrice(e.target.value)}
                        className="w-20 bg-stone-950 border border-stone-800 rounded p-1.5 text-white font-mono"
                      />
                      <select
                        value={customItemDietary}
                        onChange={(e) => setCustomItemDietary(e.target.value as DietaryType)}
                        className="bg-stone-950 border border-stone-800 rounded p-1.5 text-white text-xs"
                      >
                        <option value="veg">Veg 🟢</option>
                        <option value="non-veg">Non-Veg 🔴</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddCustomAdHocItem}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded transition-colors"
                    >
                      Insert Into Order
                    </button>
                  </div>
                </div>
              )}

              {/* SEARCH & FILTERS */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search dishes, burgers, dim sum, mocktails..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex items-center gap-1 shrink-0 bg-stone-950 border border-stone-800 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setDietaryFilter('all')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        dietaryFilter === 'all' ? 'bg-stone-800 text-white font-bold' : 'text-stone-400'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setDietaryFilter('veg')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                        dietaryFilter === 'veg' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-emerald-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Veg</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDietaryFilter('non-veg')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                        dietaryFilter === 'non-veg' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-rose-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>Non-Veg</span>
                    </button>
                  </div>
                </div>

                {/* CATEGORIES CHIPS */}
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-stone-800">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                        selectedCategory === cat.id
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-300'
                          : 'bg-stone-950 text-stone-300 border-stone-850 hover:border-stone-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DISHES LIST GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-800">
                {filteredMenuItems.map((dish) => {
                  const currentInCart = items.find((ci) => ci.item.id === dish.id);
                  return (
                    <div
                      key={dish.id}
                      className={`bg-stone-950 border rounded-xl p-2.5 flex items-center justify-between gap-2.5 transition-all ${
                        currentInCart
                          ? 'border-amber-400/80 bg-amber-950/20'
                          : 'border-stone-800/80 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-900 relative">
                          <SafeImage
                            src={dish.image}
                            alt={dish.name}
                            fallbackTitle={dish.name}
                            className="w-full h-full object-cover"
                          />
                          <span
                            className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-xs border ${
                              dish.dietary === 'veg' ? 'border-emerald-500 bg-white' : 'border-rose-500 bg-white'
                            } flex items-center justify-center p-0.5`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                dish.dietary === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-white truncate">{dish.name}</h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-amber-400 text-xs">
                              ₹{dish.price}
                            </span>
                            {dish.isChefsSpecial && (
                              <span className="text-[9px] font-mono uppercase text-amber-300">
                                ★ Chef
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ADD / QTY BUTTONS */}
                      <div className="shrink-0">
                        {currentInCart ? (
                          <div className="flex items-center gap-1 bg-amber-400 text-stone-950 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(dish.id, -1)}
                              className="p-1 hover:bg-amber-300 rounded cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono font-bold text-xs px-1.5">
                              {currentInCart.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(dish.id, 1)}
                              className="p-1 hover:bg-amber-300 rounded cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddItem(dish)}
                            className="px-2.5 py-1.5 bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-stone-200 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE ORDER SLIP & BILL TRAY (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      <span>2. Active Order Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                    </h4>
                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setItems([])}
                        className="text-[11px] text-stone-400 hover:text-red-400 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* ORDER ITEMS LIST */}
                  {items.length === 0 ? (
                    <div className="py-8 text-center text-stone-500 space-y-2">
                      <UtensilsCrossed className="w-8 h-8 mx-auto text-stone-700" />
                      <p className="text-xs font-medium text-stone-400">Order tray is empty.</p>
                      <p className="text-[11px]">Click items on the left to build the table ticket.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 divide-y divide-stone-850 max-h-72 overflow-y-auto pr-1 pt-2 scrollbar-thin scrollbar-thumb-stone-800">
                      {items.map((ci) => (
                        <div key={ci.item.id} className="pt-2.5 first:pt-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    ci.item.dietary === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                />
                                <span className="font-bold text-xs text-white truncate">
                                  {ci.item.name}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-stone-400 pl-3.5">
                                ₹{ci.item.price} each
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemQuantity(ci.item.id, -1)}
                                  className="p-1 text-stone-400 hover:text-white rounded"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="font-mono text-xs font-bold text-white px-1">
                                  {ci.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemQuantity(ci.item.id, 1)}
                                  className="p-1 text-stone-400 hover:text-white rounded"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              <span className="font-mono font-bold text-xs text-amber-400 min-w-12 text-right">
                                ₹{ci.item.price * ci.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleRemoveItem(ci.item.id)}
                                className="p-1 text-stone-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Item Custom Instructions / Cooking modifier */}
                          <div className="pl-3.5">
                            <input
                              type="text"
                              placeholder="Add item note (e.g. less spicy, crispy)"
                              value={ci.instructions || ''}
                              onChange={(e) => handleUpdateItemInstruction(ci.item.id, e.target.value)}
                              className="w-full bg-stone-900 border border-stone-850 rounded px-2 py-0.5 text-[11px] text-stone-300 placeholder:text-stone-600 focus:outline-none focus:border-amber-400/60"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* KITCHEN COOKING NOTES & INSTRUCTIONS */}
                <div className="pt-3 border-t border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-stone-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kitchen Special Instructions</span>
                    </label>
                  </div>

                  {/* Quick Instruction Chips */}
                  <div className="flex flex-wrap gap-1">
                    {QUICK_KITCHEN_NOTES.map((chip) => {
                      const isSelected = cookingNotes.includes(chip);
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleToggleNoteChip(chip)}
                          className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 font-bold border-amber-300'
                              : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Enter additional cooking notes for the head chef & pantry..."
                    value={cookingNotes}
                    onChange={(e) => setCookingNotes(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* BILL BREAKDOWN & PAYMENT SETTLEMENT */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 space-y-2.5 text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>Subtotal</span>
                    <span className="font-mono text-white font-semibold">₹{subtotal}</span>
                  </div>

                  {/* DISCOUNT */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-stone-400 text-[11px]">Discount (₹)</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={subtotal}
                        placeholder="0"
                        value={discountAmount || ''}
                        onChange={(e) => setDiscountAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-20 bg-stone-950 border border-stone-800 rounded px-2 py-0.5 text-xs font-mono text-emerald-400 text-right focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* GST */}
                  <div className="flex items-center justify-between text-stone-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyGst}
                        onChange={(e) => setApplyGst(e.target.checked)}
                        className="accent-amber-400 rounded"
                      />
                      <span className="text-[11px]">GST (5% Tax)</span>
                    </label>
                    <span className="font-mono text-stone-300">₹{gst}</span>
                  </div>

                  {/* GRAND TOTAL */}
                  <div className="flex justify-between items-center pt-2 border-t border-stone-800 font-bold">
                    <span className="text-sm text-white">Grand Total</span>
                    <span className="font-mono text-base text-amber-400 font-black">
                      ₹{grandTotal}
                    </span>
                  </div>

                  {/* PAYMENT METHOD & STATUS */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800/80 text-[11px]">
                    <div>
                      <label className="block text-stone-400 uppercase text-[10px] mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-800 rounded p-1.5 text-white"
                      >
                        <option value="pay_later">Pay Later (Post-meal)</option>
                        <option value="cash">Cash Counter</option>
                        <option value="upi">UPI / QR Code</option>
                        <option value="card">Debit / Credit Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-400 uppercase text-[10px] mb-1">
                        Payment State
                      </label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-800 rounded p-1.5 text-white"
                      >
                        <option value="unpaid">Unpaid (Open Tab)</option>
                        <option value="paid">Paid & Settled</option>
                        <option value="pending">Pending Verification</option>
                      </select>
                    </div>
                  </div>

                  {/* INITIAL KITCHEN STATUS */}
                  <div className="pt-1">
                    <label className="block text-stone-400 uppercase text-[10px] mb-1">
                      KOT Ticket Queue Status
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['received', 'preparing', 'served'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatus(st)}
                          className={`py-1 rounded text-[11px] font-bold uppercase transition-colors border ${
                            status === st
                              ? st === 'received'
                                ? 'bg-amber-400 text-stone-950 border-amber-300'
                                : st === 'preparing'
                                ? 'bg-blue-600 text-white border-blue-400'
                                : 'bg-emerald-600 text-white border-emerald-400'
                              : 'bg-stone-950 text-stone-400 border-stone-800'
                          }`}
                        >
                          {st === 'received' ? 'Queue' : st === 'preparing' ? 'In Kitchen' : 'Served'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ACTION BAR */}
          <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-950/60 p-4 rounded-xl">
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span>
                Items: <b className="text-white">{items.reduce((s, i) => s + i.quantity, 0)}</b>
              </span>
              <span>·</span>
              <span>
                Total: <b className="text-amber-400 font-mono text-sm">₹{grandTotal}</b>
              </span>
              <span>·</span>
              <span>
                Table: <b className="text-white">{orderType === 'dine_in' ? customTable || tableNumber : 'Takeaway'}</b>
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes & Update KOT' : 'Send Order to Live Kitchen'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
