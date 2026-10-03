import React, { useState } from 'react';
import { Calendar, Users, MapPin, ArrowRight, Clock, Star, Sparkles, Play } from 'lucide-react';
import { SiteContent } from '../types';
import { BydLogo } from './BydLogo';
import { DEFAULT_SITE_CONTENT } from '../data/restaurantData';

interface HeroProps {
  onQuickReserve: (branch: 'sigra' | 'bhojuveer', date: string, guests: number) => void;
  onExploreMenu: () => void;
  content?: SiteContent['hero'];
}

export const Hero: React.FC<HeroProps> = ({
  onQuickReserve,
  onExploreMenu,
  content = DEFAULT_SITE_CONTENT.hero,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<'sigra' | 'bhojuveer'>('sigra');
  const [selectedGuests, setSelectedGuests] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickReserve(selectedBranch, selectedDate, selectedGuests);
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#FAF8F5]">
      {/* Subtle architectural backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Hero Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Clean unboxed editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-4">
              <span>{content.kicker}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-stone-950 leading-[1.12] mb-6 text-balance">
              {content.headlinePart1}{' '}
              <span className="relative inline-block text-amber-600 italic font-normal">
                {content.headlineHighlight}
                <span className="absolute bottom-1.5 left-0 w-full h-1.5 bg-amber-300/50 -z-10 rounded-xs" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mb-8">
              {content.subtitle}
            </p>

            {/* Quick Interactive Reservation Bar */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-md border border-stone-200/90 p-3 sm:p-4 mb-8 max-w-2xl"
            >
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
                <span>Instant Table Booking</span>
                <span className="text-amber-700 font-mono text-[11px] normal-case">
                  No booking fee · Instant confirmation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                {/* Branch picker */}
                <div className="flex flex-col">
                  <label htmlFor="hero-branch" className="text-[11px] font-medium text-stone-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    Outlet
                  </label>
                  <select
                    id="hero-branch"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value as 'sigra' | 'bhojuveer')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-base sm:text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="sigra">Sigra (Chittupura)</option>
                    <option value="bhojuveer">Bhojuveer (Sikraul)</option>
                  </select>
                </div>

                {/* Date picker */}
                <div className="flex flex-col">
                  <label htmlFor="hero-date" className="text-[11px] font-medium text-stone-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    Date
                  </label>
                  <input
                    id="hero-date"
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-base sm:text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Guests picker */}
                <div className="flex flex-col">
                  <label htmlFor="hero-guests" className="text-[11px] font-medium text-stone-500 mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-600" />
                    Party Size
                  </label>
                  <select
                    id="hero-guests"
                    value={selectedGuests}
                    onChange={(e) => setSelectedGuests(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-base sm:text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="1">1 Person (Solo diner)</option>
                    <option value="2">2 Guests (Couple / Pair)</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests (Standard table)</option>
                    <option value="6">6 Guests (Family booth)</option>
                    <option value="8">8+ Guests (Celebration lounge)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <span>Find Available Table</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onExploreMenu}
                  className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            </form>

            {/* Social Proof & Metrics - Zero Pill Rule applied */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-600">
              <div className="flex items-center gap-1 font-semibold text-stone-900">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{content.ratingScore}</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{content.reviewCountText}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {content.todayHoursText}
              </span>
            </div>
          </div>

          {/* Right Column: Visual Composition with Yellow Door Motif (Supports Image or Video) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-stone-900 border-4 border-amber-400/90 aspect-4/3 sm:aspect-5/4">
                {content.mediaType === 'video' ? (
                  <video
                    src={content.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={content.mediaUrl}
                    alt="Behind Yellow Doors Diner Ambience"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Measured Scrim for Media Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                  <div className="flex items-center gap-2 mb-1.5 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>The Signature Atmosphere</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold mb-1">
                    {content.atmosphereTitle || 'Warm light. Acoustic warmth. Exceptional food.'}
                  </h2>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {content.atmosphereSubtitle || 'Designed for family dinners, cozy romantic dates, and vibrant friendly reunions.'}
                  </p>
                </div>
              </div>

              {/* Floating Mini Experience Card */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 bg-white p-3.5 rounded-xl shadow-lg border border-stone-200/80 flex items-center gap-3.5 max-w-sm">
                <div className="w-12 h-14 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                  <BydLogo variant="mark" size="sm" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{content.badgeTitle}</h4>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    {content.badgeSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
