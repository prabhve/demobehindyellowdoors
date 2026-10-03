import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle2, Clock, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cookingNotes, setCookingNotes] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSlip, setOrderSlip] = useState<{ id: string; time: string } | null>(null);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (items.length === 0) {
      setValidationError('Your tray is empty.');
      return;
    }
    if (orderType === 'dine_in' && !tableNumber.trim()) {
      setValidationError('Please enter your table number (or ask your server).');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number for order status updates.');
      return;
    }

    setIsOrdering(true);

    setTimeout(() => {
      const orderId = `KOT-${Math.floor(100 + Math.random() * 900)}`;
      const newOrder = {
        id: orderId,
        orderType,
        tableNumber: orderType === 'dine_in' ? tableNumber.trim() : undefined,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim(),
        cookingNotes: cookingNotes.trim() || undefined,
        items: [...items],
        subtotal,
        gst,
        total: grandTotal,
        status: 'received',
        createdAt: new Date().toISOString(),
      };

      try {
        const stored = localStorage.getItem('byd_orders');
        const ordersList = stored ? JSON.parse(stored) : [];
        ordersList.unshift(newOrder);
        localStorage.setItem('byd_orders', JSON.stringify(ordersList));
      } catch (err) {
        console.error('Failed to save order to localStorage', err);
      }

      setOrderSlip({
        id: orderId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setIsOrdering(false);
    }, 500);
  };

  const handleOrderDone = () => {
    onClearCart();
    setOrderSlip(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold font-display text-stone-900 text-lg">
              Your Diner Order Tray
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {orderSlip ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold font-display text-stone-900">
                Order Sent to Kitchen!
              </h4>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                {orderType === 'dine_in'
                  ? `Your order #${orderSlip.id} is being fired for Table ${tableNumber}. Estimated prep time: 15-20 mins.`
                  : `Your takeaway order #${orderSlip.id} is being packed fresh. We will notify you at ${customerPhone}.`}
              </p>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Order Slip:</span>
                  <span className="font-mono font-bold text-stone-900">{orderSlip.id}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Total Items:</span>
                  <span className="font-semibold text-stone-900">
                    {items.reduce((s, i) => s + i.quantity, 0)} Items
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Paid/Due:</span>
                  <span className="font-mono font-bold text-stone-900">₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOrderDone}
                className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Close & Clear Tray
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p className="text-sm mb-2 text-stone-600 font-medium">Your tray is empty.</p>
              <p className="text-xs">Browse the menu to add freshly prepared dishes, pizzas, or drinks.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Service Type Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    orderType === 'dine_in'
                      ? 'bg-white text-stone-950 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Dine-In Table Order
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    orderType === 'takeaway'
                      ? 'bg-white text-stone-950 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Takeaway Pickup
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-white"
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.dietary === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        <h4 className="font-semibold text-xs text-stone-900 line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                      <span className="font-mono text-xs text-stone-500 tabular-nums">
                        ₹{item.price} each · ₹{item.price * quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-900 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Form details */}
              <div className="pt-2 space-y-3">
                {orderType === 'dine_in' ? (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Table Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Table 4 or Booth 2"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your name for pickup..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Mobile Phone (For Order Status) *
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Kitchen Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra crisp crust, mild spice..."
                    value={cookingNotes}
                    onChange={(e) => setCookingNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {validationError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Bill Breakdown */}
        {!orderSlip && items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono tabular-nums">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant GST (5%):</span>
                <span className="font-mono tabular-nums">₹{gst}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-1.5 border-t border-stone-200">
                <span>Estimated Total:</span>
                <span className="font-mono text-base tabular-nums">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isOrdering}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isOrdering ? 'Firing to Kitchen...' : `Place ${orderType === 'dine_in' ? 'Table Order' : 'Takeaway Order'} · ₹${grandTotal}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
