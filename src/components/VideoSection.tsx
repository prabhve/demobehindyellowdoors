import React, { useState } from 'react';
import { Play, Film, X, Clock, Sparkles } from 'lucide-react';
import { DinerVideo } from '../types';
import { SafeImage } from './SafeImage';
import { ScrollReveal } from './ScrollReveal';

interface VideoSectionProps {
  videos: DinerVideo[];
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videos }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'culinary' | 'ambiance' | 'stories'>('all');
  const [selectedVideo, setSelectedVideo] = useState<DinerVideo | null>(null);

  const filteredVideos = activeCategory === 'all'
    ? videos
    : videos.filter((v) => v.category === activeCategory);

  if (videos.length === 0) return null;

  return (
    <section id="videos" className="py-20 bg-stone-900 text-white scroll-mt-14 relative overflow-hidden border-t border-stone-800">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                <Film className="w-3.5 h-3.5" />
                <span>Diner Stories & Cinema</span>
                <span aria-hidden="true">·</span>
                <span>Behind The Doors in Motion</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-white">
                Watch our culinary craft unfold.
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl">
                From slow-fermented wood-fired crusts to bubbling cast iron desserts, experience the sights and sounds of BYD Diner.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="mt-6 md:mt-0 flex items-center gap-1.5 p-1 bg-stone-800/80 rounded-xl border border-stone-700/60 overflow-x-auto">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                All Reels
              </button>
              <button
                onClick={() => setActiveCategory('culinary')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === 'culinary'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Culinary Craft
              </button>
              <button
                onClick={() => setActiveCategory('ambiance')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === 'ambiance'
                    ? 'bg-amber-400 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Ambiance
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <ScrollReveal
              key={video.id}
              animation="fade-up"
              delay={Math.min(index * 90, 300)}
              duration={550}
              className="h-full"
            >
              <div
                onClick={() => setSelectedVideo(video)}
                className="group bg-stone-850 rounded-xl overflow-hidden border border-stone-800 hover:border-amber-400/60 shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
              >
                <div>
                  {/* Video Thumbnail with Play Button */}
                  <div className="relative aspect-16/9 bg-stone-950 overflow-hidden">
                    <SafeImage
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fallbackTitle={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-13 h-13 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-1 fill-stone-950" />
                      </div>
                    </div>

                    {video.duration && (
                      <span className="absolute bottom-2.5 right-2.5 bg-stone-950/85 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{video.duration}</span>
                      </span>
                    )}

                    <span className="absolute top-2.5 left-2.5 bg-stone-950/80 text-amber-400 text-[10px] font-mono uppercase px-2 py-0.5 rounded">
                      {video.category}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="font-display font-bold text-base text-white group-hover:text-amber-300 transition-colors mb-1.5">
                      {video.title}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center justify-between text-xs text-amber-400 font-semibold border-t border-stone-800/60">
                  <span>Play Cinema Clip</span>
                  <Play className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 relative">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-20 p-2 bg-stone-950/80 hover:bg-stone-800 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Close Video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video container */}
            <div className="relative aspect-16/9 bg-black">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video streaming.
              </video>
            </div>

            <div className="p-5 sm:p-6 bg-stone-900">
              <span className="text-[10px] font-mono uppercase text-amber-400">
                {selectedVideo.category} · Behind Yellow Doors Varanasi
              </span>
              <h3 className="text-xl font-bold font-display text-white mt-0.5 mb-1.5">
                {selectedVideo.title}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
