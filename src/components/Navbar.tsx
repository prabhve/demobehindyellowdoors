import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, MapPin } from 'lucide-react';
import { BydLogo } from './BydLogo';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  onOpenBranches: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenReservation,
  onOpenBranches,
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Menu', href: '#menu' },
    { name: 'Reservations', href: '#reservations' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Cinema Reels', href: '#videos' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Our Story', href: '#story' },
    { name: 'FAQs', href: '#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-xs border-b border-stone-200/80 py-3.5'
            : 'bg-[#FAF8F5] border-b border-stone-200/60 py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Single brand element with authentic Yellow Doors Logo Mark */}
          <a
            href="#"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <BydLogo variant="mark" size="sm" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-display group-hover:text-amber-600 transition-colors whitespace-nowrap">
              Behind Yellow Doors
            </span>
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-stone-950 font-semibold'
                      : 'hover:text-stone-950'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </a>
              );
            })}
            <button
              onClick={onOpenBranches}
              className="flex items-center gap-1.5 text-stone-600 hover:text-stone-950 transition-colors whitespace-nowrap cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Sigra & Bhojuveer</span>
            </button>
          </nav>

          {/* Medium screen navigation (compact) */}
          <nav className="hidden md:flex xl:hidden items-center gap-4 text-xs font-medium text-stone-600">
            {navLinks.slice(0, 5).map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-stone-950 font-semibold'
                      : 'hover:text-stone-950'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </a>
              );
            })}
            <button
              onClick={onOpenBranches}
              className="flex items-center gap-1 text-stone-600 hover:text-stone-950 transition-colors whitespace-nowrap cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>Sanctuaries</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              aria-label={`View order bag with ${cartCount} items`}
              className="relative p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenReservation}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              Reserve Table
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-stone-900/60 backdrop-blur-xs">
          <div className="fixed top-[65px] left-0 right-0 bg-[#FAF8F5] border-b border-stone-200 px-6 py-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Locations in Varanasi
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBranches();
                }}
                className="text-xs font-semibold text-amber-700 underline"
              >
                Sigra & Bhojuveer Info
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-stone-800 hover:text-amber-600 py-1.5 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full py-3 text-center text-sm font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
              >
                Book a Table Now
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="w-full py-2.5 text-center text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                View Order / Takeaway Tray ({cartCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
