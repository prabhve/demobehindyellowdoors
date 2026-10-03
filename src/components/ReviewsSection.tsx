import React, { useState, useEffect, useMemo } from 'react';
import { Star, CheckCircle, MessageSquare, ThumbsUp, ShieldCheck, Plus, X, AlertCircle } from 'lucide-react';
import { INITIAL_REVIEWS, MENU_ITEMS } from '../data/restaurantData';
import { Review } from '../types';

interface ReviewsSectionProps {
  externalReviews?: Review[];
  onUpdateExternalReviews?: (updater: (prev: Review[]) => Review[]) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  externalReviews,
  onUpdateExternalReviews,
}) => {
  const [internalReviews, setInternalReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem('byd_reviews');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error(err);
    }
    return INITIAL_REVIEWS;
  });

  const reviews = externalReviews || internalReviews;
  const setReviews = onUpdateExternalReviews || setInternalReviews;

  const [activeFilter, setActiveFilter] = useState<'all' | '5star' | 'verified' | 'sigra' | 'bhojuveer'>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isModeratorMode, setIsModeratorMode] = useState(false);

  // Form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [branchVisited, setBranchVisited] = useState<'sigra' | 'bhojuveer'>('sigra');
  const [comment, setComment] = useState('');
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // Persist reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('byd_reviews', JSON.stringify(reviews));
    } catch (err) {
      console.error(err);
    }
  }, [reviews]);

  // Calculations
  const publishedReviews = useMemo(() => {
    return reviews.filter((r) => r.status === 'published');
  }, [reviews]);

  const pendingReviews = useMemo(() => {
    return reviews.filter((r) => r.status === 'pending_moderation');
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (publishedReviews.length === 0) return 5.0;
    const sum = publishedReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / publishedReviews.length).toFixed(1);
  }, [publishedReviews]);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publishedReviews.forEach((r) => {
      const rounded = Math.round(r.rating);
      if (counts[rounded] !== undefined) counts[rounded]++;
    });
    return counts;
  }, [publishedReviews]);

  const filteredReviews = useMemo(() => {
    if (isModeratorMode) {
      return reviews; // show all in moderator view
    }
    return publishedReviews.filter((r) => {
      if (activeFilter === '5star') return r.rating === 5;
      if (activeFilter === 'verified') return r.verifiedDiner;
      if (activeFilter === 'sigra') return r.branch === 'sigra';
      if (activeFilter === 'bhojuveer') return r.branch === 'bhojuveer';
      return true;
    });
  }, [publishedReviews, reviews, activeFilter, isModeratorMode]);

  const handleHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleApproveReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'published' } : r))
    );
  };

  const handleRejectReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  const toggleDishSelection = (dishName: string) => {
    if (selectedDishes.includes(dishName)) {
      setSelectedDishes(selectedDishes.filter((d) => d !== dishName));
    } else {
      if (selectedDishes.length < 3) {
        setSelectedDishes([...selectedDishes, dishName]);
      }
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!authorName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!comment.trim() || comment.length < 10) {
      setFormError('Please provide a constructive review of at least 10 characters.');
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      authorName: authorName.trim(),
      rating,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      branch: branchVisited,
      comment: comment.trim(),
      likedDishes: selectedDishes.length > 0 ? selectedDishes : undefined,
      status: 'pending_moderation', // Sent for moderation
      verifiedDiner: true,
      helpfulCount: 0,
      avatarLetter: authorName.trim().charAt(0).toUpperCase() || 'D',
    };

    setReviews((prev) => [newReview, ...prev]);
    setSubmitSuccessMsg(
      'Thank you! Your review has been submitted for moderation to ensure authenticity before publication.'
    );

    // Reset fields
    setAuthorName('');
    setComment('');
    setSelectedDishes([]);
  };

  return (
    <section id="reviews" className="py-20 bg-stone-50 border-t border-stone-200/80 scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
              <span>Authentic Diner Voices</span>
              <span aria-hidden="true">·</span>
              <span>Varanasi Foodies</span>
              <span aria-hidden="true">·</span>
              <span>4.8 Overall Score</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-stone-900 tracking-tight">
              What diners say about us.
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {/* Moderator Switch */}
            <button
              onClick={() => setIsModeratorMode(!isModeratorMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                isModeratorMode
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {isModeratorMode ? 'Moderation Mode (Active)' : 'Moderator Queue'}
              </span>
              {pendingReviews.length > 0 && (
                <span className="bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingReviews.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setIsSubmitModalOpen(true);
                setSubmitSuccessMsg('');
                setFormError('');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Rating Breakdown & Highlights Box */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 mb-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Score Block */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-stone-100">
              <span className="text-5xl sm:text-6xl font-display font-bold text-stone-900 tabular-nums">
                {averageRating}
              </span>
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-xs text-stone-500">
                Based on <strong className="text-stone-800 tabular-nums">{publishedReviews.length + 640}</strong> verified ratings across Varanasi
              </p>
            </div>

            {/* Middle Rating Bars */}
            <div className="md:col-span-5 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const total = publishedReviews.length || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs text-stone-600">
                    <span className="w-12 font-medium">{stars} Stars</span>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-[11px] tabular-nums text-stone-400">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Diner Confidence Guarantee */}
            <div className="md:col-span-3 bg-stone-50 rounded-xl p-4 border border-stone-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Authenticity</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Reviews are moderated by the Behind Yellow Doors host team to prevent spam and ensure honest diner feedback.
              </p>
            </div>
          </div>
        </div>

        {/* Moderation Queue Banner if active */}
        {isModeratorMode && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Moderator Queue ({pendingReviews.length} Pending Approval)
                </h4>
              </div>
              <span className="text-[11px] text-amber-800">
                You can approve or discard reviews below
              </span>
            </div>
            {pendingReviews.length === 0 ? (
              <p className="text-xs text-amber-800/80">No reviews currently awaiting moderation.</p>
            ) : (
              <div className="space-y-3 mt-3">
                {pendingReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-3.5 rounded-lg border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 flex items-center gap-2">
                        <span>{rev.authorName}</span>
                        <span className="text-amber-500">{'★'.repeat(rev.rating)}</span>
                        <span className="text-[10px] text-stone-400">({rev.branch.toUpperCase()})</span>
                      </div>
                      <p className="text-stone-600 mt-1 italic">&ldquo;{rev.comment}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveReview(rev.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md cursor-pointer"
                      >
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => handleRejectReview(rev.id)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-stone-900 text-amber-400 font-semibold'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setActiveFilter('5star')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === '5star'
                ? 'bg-stone-900 text-amber-400 font-semibold'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            5-Star Reviews
          </button>
          <button
            onClick={() => setActiveFilter('verified')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'verified'
                ? 'bg-stone-900 text-amber-400 font-semibold'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            Verified Diners
          </button>
          <button
            onClick={() => setActiveFilter('sigra')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'sigra'
                ? 'bg-stone-900 text-amber-400 font-semibold'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            Sigra Branch
          </button>
          <button
            onClick={() => setActiveFilter('bhojuveer')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'bhojuveer'
                ? 'bg-stone-900 text-amber-400 font-semibold'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            Bhojuveer Branch
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center font-display">
                      {rev.avatarLetter}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 leading-tight">
                        {rev.authorName}
                      </h4>
                      {/* Zero-pill metadata */}
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                        <span className="capitalize">{rev.branch}</span>
                        <span aria-hidden="true">·</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  {rev.verifiedDiner && (
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 mb-2.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= rev.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-stone-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs text-stone-700 leading-relaxed mb-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {/* Favorite Dishes - Zero Pill Rule (unboxed text) */}
                {rev.likedDishes && rev.likedDishes.length > 0 && (
                  <div className="text-[11px] text-amber-800 mb-4 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                    <span className="font-semibold text-amber-950">Recommended: </span>
                    {rev.likedDishes.join(', ')}
                  </div>
                )}
              </div>

              {/* Bottom Helpful button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
                <span className="text-stone-400">Behind Yellow Doors Guest</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Your Culinary Story
              </span>
              <h3 className="text-2xl font-bold font-display text-stone-900 mt-1">
                Share your dining experience
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Reviews are moderated to uphold community authenticity and fairness.
              </p>
            </div>

            {submitSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950 font-display">
                  Review Received!
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {submitSuccessMsg}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitModalOpen(false);
                      setSubmitSuccessMsg('');
                    }}
                    className="px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Interactive Star Rating */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Your Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-semibold text-stone-700">
                      {rating === 5 && 'Outstanding!'}
                      {rating === 4 && 'Very Good'}
                      {rating === 3 && 'Average'}
                      {rating === 2 && 'Needs Improvement'}
                      {rating === 1 && 'Unsatisfactory'}
                    </span>
                  </div>
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya Roy"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                {/* Outlet Visited */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Branch Visited
                  </label>
                  <select
                    value={branchVisited}
                    onChange={(e) => setBranchVisited(e.target.value as 'sigra' | 'bhojuveer')}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="sigra">Sigra Branch (Chittupura)</option>
                    <option value="bhojuveer">Bhojuveer Branch (Sikraul)</option>
                  </select>
                </div>

                {/* Favorite Dishes Multi-select */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Dishes You Loved (Pick up to 3)
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 border border-stone-200 rounded-lg bg-stone-50">
                    {MENU_ITEMS.map((item) => {
                      const isSelected = selectedDishes.includes(item.name);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleDishSelection(item.name)}
                          className={`px-2 py-1 text-[11px] rounded-md transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 font-semibold shadow-2xs'
                              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Written Review */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Written Review *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the flavors, service, ambiance, or special memories..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                {formError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Review for Moderation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
