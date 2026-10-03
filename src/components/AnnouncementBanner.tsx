import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { SiteContent } from '../types';

interface AnnouncementBannerProps {
  announcement: SiteContent['announcement'];
  onOpenReservation: () => void;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  announcement,
  onOpenReservation,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!announcement.enabled || isDismissed) return null;

  return (
    <aside
      aria-label="Diner Announcement"
      className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-amber-500/30 relative z-30 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 text-center truncate">
          <span className="bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono shrink-0">
            {announcement.badge}
          </span>
          <span className="text-xs text-stone-200 truncate">
            {announcement.text}
          </span>
          {announcement.linkText && (
            <button
              onClick={onOpenReservation}
              className="text-amber-400 hover:text-amber-300 font-semibold underline shrink-0 inline-flex items-center gap-1 cursor-pointer ml-1"
            >
              <span>{announcement.linkText}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-stone-400 hover:text-white p-1 shrink-0 cursor-pointer"
          aria-label="Dismiss Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
