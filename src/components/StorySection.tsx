import React from 'react';
import { Utensils, Coffee } from 'lucide-react';
import { SiteContent } from '../types';
import { DEFAULT_SITE_CONTENT } from '../data/restaurantData';
import { ScrollReveal } from './ScrollReveal';

interface StorySectionProps {
  content?: SiteContent['story'];
}

export const StorySection: React.FC<StorySectionProps> = ({
  content = DEFAULT_SITE_CONTENT.story,
}) => {
  return (
    <section id="story" className="py-20 bg-white border-t border-stone-200/80 scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Column with Scroll Reveal */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal animation="fade-right" duration={700}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 aspect-4/3 sm:aspect-1/1 bg-stone-900 group">
                <img
                  src={content.mediaUrl}
                  alt="Behind Yellow Doors Diner Ambience in Varanasi"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                  <span className="text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
                    Established in Varanasi
                  </span>
                  <h3 className="font-display text-2xl font-bold">
                    {content.cardTitle || 'Two Sanctuaries. One Philosophy.'}
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">
                    {content.cardSubtitle || 'Sigra Flagship & Bhojuveer Cafe Lounge'}
                  </p>
                </div>
              </div>

              {/* Accent badge */}
              <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-5 sm:-right-5 bg-amber-400 text-stone-950 p-3.5 sm:p-4 rounded-xl shadow-md inline-flex sm:block items-center gap-3 sm:max-w-[200px]">
                <span className="block text-2xl font-bold font-display leading-tight">
                  {content.badgeNumber}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {content.badgeLabel}
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Editorial Story with Scroll Reveal */}
          <div className="lg:col-span-7">
            <ScrollReveal animation="fade-left" delay={150} duration={700} className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
                <span>{content.kicker}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-stone-900 tracking-tight leading-tight">
                {content.headline}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {content.paragraph}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">{content.feature1Title}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {content.feature1Desc}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">{content.feature2Title}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {content.feature2Desc}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 italic">
                &ldquo;{content.quoteText}&rdquo;
                <span className="block not-italic font-semibold text-stone-800 mt-1">
                  {content.quoteAuthor}
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
