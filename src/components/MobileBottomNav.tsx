import React from 'react';
import { Utensils, Calendar, Camera, Star, Phone } from 'lucide-react';
import { BRANCHES } from '../data/restaurantData';

interface MobileBottomNavProps {
  onOpenReservation: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenReservation }) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 px-3 flex items-center justify-around shadow-lg"
    >
      <a
        href="#menu"
        className="flex flex-col items-center justify-center py-1 text-stone-600 hover:text-stone-900 transition-colors min-w-[50px]"
      >
        <Utensils className="w-4 h-4" />
        <span className="text-[10px] font-medium mt-0.5">Menu</span>
      </a>

      <button
        onClick={onOpenReservation}
        className="flex flex-col items-center justify-center py-1 text-amber-700 hover:text-amber-800 transition-colors min-w-[50px] cursor-pointer"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-[10px] font-bold mt-0.5">Book</span>
      </button>

      <a
        href="#gallery"
        className="flex flex-col items-center justify-center py-1 text-stone-600 hover:text-stone-900 transition-colors min-w-[50px]"
      >
        <Camera className="w-4 h-4" />
        <span className="text-[10px] font-medium mt-0.5">Gallery</span>
      </a>

      <a
        href="#reviews"
        className="flex flex-col items-center justify-center py-1 text-stone-600 hover:text-stone-900 transition-colors min-w-[50px]"
      >
        <Star className="w-4 h-4" />
        <span className="text-[10px] font-medium mt-0.5">Reviews</span>
      </a>

      <a
        href={`tel:${BRANCHES[0].phone}`}
        className="flex flex-col items-center justify-center py-1 text-stone-600 hover:text-stone-900 transition-colors min-w-[50px]"
      >
        <Phone className="w-4 h-4" />
        <span className="text-[10px] font-medium mt-0.5">Call</span>
      </a>
    </nav>
  );
};
