import React from 'react';
import { Sparkles, Heart, Utensils, Coffee } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-20 bg-white border-t border-stone-200/80 scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 aspect-4/3 sm:aspect-1/1 bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                alt="Behind Yellow Doors Diner Ambience in Varanasi"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
                  Established in Varanasi
                </span>
                <h3 className="font-display text-2xl font-bold">
                  Two Sanctuaries. One Philosophy.
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Sigra Flagship & Bhojuveer Cafe Lounge
                </p>
              </div>
            </div>

            {/* Accent badge */}
            <div className="absolute -bottom-5 -right-5 bg-amber-400 text-stone-950 p-4 rounded-xl shadow-md hidden sm:block max-w-[200px]">
              <span className="block text-2xl font-bold font-display leading-tight">100%</span>
              <span className="text-xs font-semibold uppercase tracking-wider">
                Scratch Cooking & Handcrafted Dough
              </span>
            </div>
          </div>

          {/* Right Editorial Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <span>Our Heritage & Vision</span>
              <span aria-hidden="true">·</span>
              <span>The Yellow Doors Story</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-stone-900 tracking-tight leading-tight">
              A portal into worldly flavors, warm amber light, and genuine Varanasi hospitality.
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              When we first opened our distinctive yellow double doors in Varanasi, we envisioned more
              than just another dining room. We wanted to build a sanctuary where friends lose track of
              time over blistered Neapolitan crusts, where families celebrate quiet milestones over
              smoky tandoor platters, and where creative minds gather for slow-drip single-origin cold brews.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                  <Utensils className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-stone-900">Honest Global Cuisine</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Real San Marzano plum tomatoes, bronze-extruded pastas, house-churned cream marinades, and fresh local herbs.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                  <Coffee className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-stone-900">Curated Cafe & Vibes</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Carefully tuned acoustic playlists, warm filament illumination, and cozy booths built for hours of genuine laughter.
                </p>
              </div>
            </div>

            {/* Zero-Pill metadata quote */}
            <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 italic">
              &ldquo;Step behind the yellow doors. Whatever the world outside feels like, in here you are always family.&rdquo;
              <span className="block not-italic font-semibold text-stone-800 mt-1">
                — The BYD Culinary & Host Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
