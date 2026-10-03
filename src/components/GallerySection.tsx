import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, MapPin, Camera } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/restaurantData';
import { GalleryPhoto } from '../types';
import { SafeImage } from './SafeImage';
import { ScrollReveal } from './ScrollReveal';

interface GallerySectionProps {
  photos?: GalleryPhoto[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ photos = GALLERY_PHOTOS }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'food' | 'ambiance' | 'moments'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const currentPhoto: GalleryPhoto | null =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] || null : null;

  const handlePrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredPhotos.length - 1));
    }
  }, [lightboxIndex, filteredPhotos.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! < filteredPhotos.length - 1 ? prev! + 1 : 0));
    }
  }, [lightboxIndex, filteredPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  return (
    <section id="gallery" className="py-20 bg-stone-900 text-white scroll-mt-14 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Behind The Lens</span>
                <span aria-hidden="true">·</span>
                <span>High-Resolution Photo Gallery</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-white">
                Moments behind the yellow doors.
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl">
                An intimate visual glimpse into our artisanal ovens, welcoming bistro spaces, and lively diner celebrations.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-6 md:mt-0 flex items-center gap-1.5 p-1 bg-stone-800/80 rounded-xl border border-stone-700/60 overflow-x-auto">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                All Moments
              </button>
              <button
                onClick={() => setActiveCategory('food')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === 'food'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Our Food
              </button>
              <button
                onClick={() => setActiveCategory('ambiance')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === 'ambiance'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Our Ambiance
              </button>
              <button
                onClick={() => setActiveCategory('moments')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === 'moments'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Customer Moments
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <ScrollReveal
              key={photo.id}
              animation="fade-up"
              delay={Math.min((index % 6) * 70, 350)}
              duration={550}
              className="h-full"
            >
              <div
                onClick={() => setLightboxIndex(index)}
                className="group relative rounded-xl overflow-hidden bg-stone-800 border border-stone-800 hover:border-amber-400/50 shadow-md cursor-pointer transition-all duration-300 aspect-4/3 h-full"
              >
                <SafeImage
                  src={photo.imageUrl}
                  alt={photo.title}
                  fallbackTitle={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Measured contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5">
                  <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-mono mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{photo.location}</span>
                  </div>
                  <h3 className="text-base font-bold font-display text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-snug line-clamp-2">
                    {photo.caption}
                  </p>

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/70 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentPhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-400">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <span className="text-stone-400 text-xs hidden sm:inline">·</span>
              <span className="text-xs text-stone-300 hidden sm:inline capitalize">
                Category: {currentPhoto.category}
              </span>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-white transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Visual Display & Controls */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-stone-900/70 hover:bg-stone-800 text-white transition-colors cursor-pointer"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Photo frame */}
            <div className="max-w-4xl max-h-[70vh] flex items-center justify-center">
              <img
                src={currentPhoto.imageUrl}
                alt={currentPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-stone-900/70 hover:bg-stone-800 text-white transition-colors cursor-pointer"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Captions */}
          <div className="max-w-3xl mx-auto text-center z-10 px-4">
            <h4 className="text-lg font-bold font-display text-white mb-1">
              {currentPhoto.title}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 mb-2 leading-relaxed">
              {currentPhoto.caption}
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-amber-400 font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentPhoto.location}
              </span>
              <span>·</span>
              <span>Behind Yellow Doors Archive</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
