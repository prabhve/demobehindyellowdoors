import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Star, Flame, Sparkles, X, Info } from 'lucide-react';
import { MENU_ITEMS } from '../data/restaurantData';
import { CuisineCategory, DietaryType, MenuItem } from '../types';
import { SafeImage } from './SafeImage';
import { ScrollReveal } from './ScrollReveal';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
  cartItemQuantities: Record<string, number>;
  items?: MenuItem[];
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onAddToCart,
  cartItemQuantities,
  items = MENU_ITEMS,
}) => {
  const [activeCategory, setActiveCategory] = useState<CuisineCategory>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg' | 'special'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDishModal, setSelectedDishModal] = useState<MenuItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'starters', label: 'Small Plates & Starters' },
    { id: 'pizza_pasta', label: 'Wood-Fired Pizza & Pasta' },
    { id: 'global_mains', label: 'Global Mains & Handis' },
    { id: 'texmex', label: 'Tex-Mex & Tacos' },
    { id: 'beverages', label: 'Artisanal Coffee & Shakes' },
    { id: 'desserts', label: 'Decadent Desserts' },
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Dietary match
      if (dietaryFilter === 'veg' && item.dietary !== 'veg') return false;
      if (dietaryFilter === 'non-veg' && item.dietary !== 'non-veg') return false;
      if (dietaryFilter === 'special' && !item.isChefsSpecial) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesIngredients = item.ingredients?.some((ing) =>
          ing.toLowerCase().includes(q)
        );
        return matchesName || matchesDesc || matchesIngredients;
      }
      return true;
    });
  }, [activeCategory, dietaryFilter, searchQuery]);

  return (
    <section id="menu" className="py-20 bg-[#FAF8F5] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
              <span>Culinary Offerings</span>
              <span aria-hidden="true">·</span>
              <span>Crafted Fresh Daily</span>
              <span aria-hidden="true">·</span>
              <span>Varanasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-stone-900 tracking-tight mb-4">
              The Integrated Dining Menu
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              From slow-fermented Neapolitan sourdough pizzas to aromatic tandoori charcoal delicacies,
              explore the multi-cuisine flavors that have made Behind Yellow Doors a Varanasi icon.
            </p>
          </div>
        </ScrollReveal>

        {/* Search & Dietary Filters Bar */}
        <ScrollReveal animation="fade-up" delay={100} duration={600}>
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search dishes, pasta, shakes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-8 py-2.5 text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dietary Filter Segmented Control */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-full md:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  dietaryFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Diets
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  dietaryFilter === 'veg'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Vegetarian</span>
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('non-veg')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>Non-Veg</span>
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('special')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  dietaryFilter === 'special'
                    ? 'bg-white text-amber-700 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Chef&apos;s Specials</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as CuisineCategory)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-amber-400 font-semibold shadow-xs'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
          <span>
            Showing <strong className="text-stone-800 tabular-nums">{filteredItems.length}</strong> creations
          </span>
          <span className="text-[11px] text-stone-400">
            Click any dish to inspect ingredients & pairings
          </span>
        </div>

        {/* Dish Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
            <p className="text-stone-500 text-sm mb-2">No menu items match your search or filter.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setDietaryFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-amber-700 underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const qtyInCart = cartItemQuantities[item.id] || 0;
              return (
                <ScrollReveal
                  key={item.id}
                  animation="fade-up"
                  delay={Math.min((index % 6) * 60, 300)}
                  duration={500}
                  className="h-full flex"
                >
                  <div
                    className="bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group w-full"
                  >
                    {/* Image container */}
                    <div
                      onClick={() => setSelectedDishModal(item)}
                      className="relative aspect-16/10 cursor-pointer overflow-hidden bg-stone-100"
                    >
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        fallbackTitle={item.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />

                      {/* Gradient scrim for tags */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Clean unboxed tags inside image */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center p-0.5 border ${
                            item.dietary === 'veg'
                              ? 'border-emerald-600 bg-white'
                              : 'border-rose-600 bg-white'
                          }`}
                          title={item.dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.dietary === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                        </span>

                        {item.isChefsSpecial && (
                          <span className="bg-stone-900/90 backdrop-blur-xs text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-xs">
                            Chef&apos;s Signature
                          </span>
                        )}
                      </div>

                      {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
                        <div className="absolute top-3 right-3 flex items-center text-amber-400 bg-stone-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded-xs text-[10px]">
                          <Flame className="w-3 h-3 text-amber-400 mr-0.5" />
                          <span>{'Spicy'.slice(0, item.spiceLevel * 2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3
                            onClick={() => setSelectedDishModal(item)}
                            className="font-bold text-stone-900 text-base group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-1"
                          >
                            {item.name}
                          </h3>
                          <span className="font-mono font-bold text-stone-900 text-sm tabular-nums shrink-0">
                            ₹{item.price}
                          </span>
                        </div>

                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-3">
                          {item.description}
                        </p>

                        {/* Clean unboxed ingredients snippet - Zero Pill rule */}
                        {item.ingredients && (
                          <div className="text-[11px] text-stone-400 truncate mb-4">
                            {item.ingredients.slice(0, 3).join(' · ')}
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedDishModal(item)}
                          className="text-xs text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        {qtyInCart > 0 ? (
                          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                            <span className="text-xs font-semibold text-amber-900">
                              {qtyInCart} in tray
                            </span>
                            <button
                              type="button"
                              onClick={() => onAddToCart(item)}
                              className="w-6 h-6 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center font-bold text-xs cursor-pointer"
                              title="Add another"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onAddToCart(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Table Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>

      {/* Dish Backstory & Details Modal */}
      {selectedDishModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedDishModal(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-16/9 bg-stone-100">
              <SafeImage
                src={selectedDishModal.image}
                alt={selectedDishModal.name}
                fallbackTitle={selectedDishModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                  <span className="capitalize">{selectedDishModal.dietary}</span>
                  <span aria-hidden="true">·</span>
                  <span>₹{selectedDishModal.price}</span>
                </div>
                <h3 className="text-xl font-bold font-display">{selectedDishModal.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                  Preparation & Description
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {selectedDishModal.description}
                </p>
              </div>

              {selectedDishModal.ingredients && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Key Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs text-stone-700">
                    {selectedDishModal.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="bg-stone-100 border border-stone-200/80 px-2 py-1 rounded-md"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900">
                <strong>Chef&apos;s Recommendation:</strong> Pairs harmoniously with our Artisan Hazelnut
                Cold Brew or Fresh Italian Mint Mojito.
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDishModal(null)}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(selectedDishModal);
                    setSelectedDishModal(null);
                  }}
                  className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Order · ₹{selectedDishModal.price}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
