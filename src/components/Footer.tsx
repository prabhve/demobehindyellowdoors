import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUp, Instagram, Facebook, ShieldCheck, Lock } from 'lucide-react';
import { BRANCHES, DEFAULT_SITE_CONTENT } from '../data/restaurantData';
import { BydLogo } from './BydLogo';
import { BranchInfo, SiteContent } from '../types';

interface FooterProps {
  onOpenBranches: () => void;
  onOpenReservation: () => void;
  onOpenAdmin: () => void;
  socialLinks?: SiteContent['socialLinks'];
  branches?: BranchInfo[];
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBranches,
  onOpenReservation,
  onOpenAdmin,
  socialLinks = DEFAULT_SITE_CONTENT.socialLinks,
  branches = BRANCHES,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sigraBranch = branches.find((b) => b.id === 'sigra') || branches[0] || BRANCHES[0];
  const bhojuveerBranch = branches.find((b) => b.id === 'bhojuveer') || branches[1] || BRANCHES[1];

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
              {socialLinks.brandBio ||
                '“Making Banaras spicier, happier and deliciously yellow.” Varanasi’s landmark multi-cuisine diner and artisanal cafe. Handcrafted Neapolitan sourdough pizzas, charcoal tandoori kebabs, slow-brewed coffee, and memories crafted in warm golden light.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${socialLinks.email}`}
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 flex items-center justify-center transition-colors"
                aria-label="Email BYD"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            {socialLinks.phone && (
              <div className="pt-1 text-xs text-stone-400">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Central Helpline</span>
                <a href={`tel:${socialLinks.phone}`} className="text-amber-400 hover:text-amber-300 font-mono font-semibold text-xs">
                  {socialLinks.phone}
                </a>
              </div>
            )}
          </div>

          {/* Col 2: Sigra Outlet */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {sigraBranch.name}
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="leading-snug text-stone-300">
                {sigraBranch.address}
              </p>
              <p className="text-stone-500">{sigraBranch.landmark}</p>
              <div className="pt-1">
                <a
                  href={`tel:${sigraBranch.phone}`}
                  className="hover:text-amber-400 font-mono text-stone-300 block"
                >
                  {sigraBranch.phone}
                </a>
              </div>
              <p className="text-stone-500 flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{sigraBranch.timings}</span>
              </p>
            </div>
          </div>

          {/* Col 3: Bhojuveer Outlet */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {bhojuveerBranch.name}
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="leading-snug text-stone-300">
                {bhojuveerBranch.address}
              </p>
              <p className="text-stone-500">{bhojuveerBranch.landmark}</p>
              <div className="pt-1">
                <a
                  href={`tel:${bhojuveerBranch.phone}`}
                  className="hover:text-amber-400 font-mono text-stone-300 block"
                >
                  {bhojuveerBranch.phone}
                </a>
              </div>
              <p className="text-stone-500 flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{bhojuveerBranch.timings}</span>
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
          <p>© {new Date().getFullYear()} {socialLinks.copyrightText || 'Behind Yellow Doors Diner (BYD Diner). All rights reserved.'}</p>
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

