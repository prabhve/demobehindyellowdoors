import React from 'react';
import { Utensils, Calendar, Camera, Star, ShoppingBag } from 'lucide-react';
import { BRANCHES } from '../data/restaurantData';

interface MobileBottomNavProps {
  onOpenReservation: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
  activeSection?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenReservation,
  onOpenCart,
  cartCount = 0,
  activeSection = 'menu',
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] px-2 flex items-center justify-around shadow-lg"
    >
      <a
        href="#menu"
        className={`flex flex-col items-center justify-center py-1 transition-colors min-w-[52px] ${
          activeSection === 'menu' ? 'text-amber-700 font-bold' : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <Utensils className="w-4 h-4" />
        <span className="text-[10px] font-medium mt-0.5">Menu</span>
      </a>

      <button
        onClick={onOpenReservation}
        className={`flex flex-col items-center justify-center py-1 transition-colors min-w-[52px] cursor-pointer ${
          activeSection === 'reservations' ? 'text-amber-700 font-bold' : 'text-amber-600 hover:text-amber-800'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span className="text-[10px] font-bold mt-0.5">Book</span>
      </button>

      {onOpenCart && (
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 text-stone-700 hover:text-stone-950 transition-colors min-w-[52px] cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-stone-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5">Tray {cartCount > 0 ? `(${cartCount})` : ''}</span>
        </button>
      )}

      <a
        href="#gallery"
        className={`flex flex-col items-center justify-center py-1 transition-colors min-w-[52px] ${
          activeSection === 'gallery' ? 'text-amber-700 font-bold' : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <Camera className="w-4 h-4" />
        <span className="text-[10px] font-medium mt-0.5">Gallery</span>
      </a>

      <a
        href="#reviews"
        className={`flex flex-col items-center justify-center py-1 transition-colors min-w-[52px] ${
          activeSection === 'reviews' ? 'text-amber-700 font-bold' : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <Star className="w-4 h-4" />
        <span className="text-[10px] font-medium mt-0.5">Reviews</span>
      </a>
    </nav>
  );
};
