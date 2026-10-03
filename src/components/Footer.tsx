import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUp, Instagram, Facebook, ShieldCheck, Lock } from 'lucide-react';
import { BRANCHES } from '../data/restaurantData';
import { BydLogo } from './BydLogo';

interface FooterProps {
  onOpenBranches: () => void;
  onOpenReservation: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBranches, onOpenReservation, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-20 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800/80">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#" className="flex items-center gap-3 group">
              <BydLogo variant="mark" size="sm" />
              <span className="text-2xl font-bold font-display text-white tracking-tight group-hover:text-amber-400 transition-colors">
                Behind Yellow Doors
              </span>
            </a>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              &ldquo;Making Banaras spicier, happier and deliciously yellow.&rdquo; Varanasi’s landmark multi-cuisine diner and artisanal cafe. Handcrafted Neapolitan sourdough pizzas, charcoal tandoori kebabs, slow-brewed coffee, and memories crafted in warm golden light.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Sigra Outlet */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Sigra Flagship
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="leading-snug text-stone-300">
                {BRANCHES[0].address}
              </p>
              <p className="text-stone-500">{BRANCHES[0].landmark}</p>
              <div className="pt-1">
                <a
                  href={`tel:${BRANCHES[0].phone}`}
                  className="hover:text-amber-400 font-mono text-stone-300 block"
                >
                  {BRANCHES[0].phone}
                </a>
              </div>
              <p className="text-stone-500 flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>11:30 AM – 11:00 PM</span>
              </p>
            </div>
          </div>

          {/* Col 3: Bhojuveer Outlet */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Bhojuveer Cafe Lounge
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="leading-snug text-stone-300">
                {BRANCHES[1].address}
              </p>
              <p className="text-stone-500">{BRANCHES[1].landmark}</p>
              <div className="pt-1">
                <a
                  href={`tel:${BRANCHES[1].phone}`}
                  className="hover:text-amber-400 font-mono text-stone-300 block"
                >
                  {BRANCHES[1].phone}
                </a>
              </div>
              <p className="text-stone-500 flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>11:30 AM – 11:00 PM</span>
              </p>
            </div>
          </div>

          {/* Col 4: Quick Actions */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Integrated Menu
                </a>
              </li>
              <li>
                <a href="#reservations" className="hover:text-white transition-colors">
                  Table Reservations
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Photo Gallery
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Diner Reviews
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBranches}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Branch Locations
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer py-1 px-2 rounded bg-amber-950/60 border border-amber-800/60 transition-colors"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Admin Panel</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Quiet Copyright, Staff Portal & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Behind Yellow Doors Diner (BYD Diner). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-stone-500 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Manager Suite</span>
            </button>
            <span className="text-stone-600">·</span>
            <span className="text-stone-400">Varanasi, Uttar Pradesh, India</span>
            <span className="text-stone-600">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

