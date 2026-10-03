import React from 'react';
import { X, MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react';
import { BRANCHES } from '../data/restaurantData';
import { BranchInfo } from '../types';

interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBranchForBooking: (branchId: 'sigra' | 'bhojuveer' | string) => void;
  branches?: BranchInfo[];
}

export const BranchesModal: React.FC<BranchesModalProps> = ({
  isOpen,
  onClose,
  onSelectBranchForBooking,
  branches = BRANCHES,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Behind Yellow Doors Locations
          </span>
          <h3 className="text-2xl font-bold font-display text-stone-900 mt-1">
            Our Two Sanctuaries in Varanasi
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Both branches feature our signature yellow doors, multi-cuisine dining, and hospitality.
          </p>
        </div>

        <div className="space-y-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-stone-50 border border-stone-200 rounded-xl p-5 sm:p-6 space-y-4 hover:border-amber-400/80 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                <div>
                  <h4 className="font-bold text-lg text-stone-900 font-display">
                    {branch.name}
                  </h4>
                  <p className="text-xs text-amber-800 font-medium">{branch.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectBranchForBooking(branch.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                >
                  Book Here
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900 block">{branch.address}</span>
                      <span className="text-stone-500">{branch.landmark}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{branch.timings}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                    <a
                      href={`tel:${branch.phone}`}
                      className="hover:text-amber-600 font-mono font-medium"
                    >
                      {branch.phone}
                    </a>
                    <span className="text-stone-300">/</span>
                    <a
                      href={`tel:${branch.altPhone}`}
                      className="hover:text-amber-600 font-mono"
                    >
                      {branch.altPhone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-stone-400 shrink-0" />
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:text-amber-900 font-medium inline-flex items-center gap-1 underline"
                    >
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Branch Features */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {branch.features.map((f, i) => (
                  <span
                    key={i}
                    className="bg-white border border-stone-200 text-stone-700 text-[11px] px-2.5 py-1 rounded-md"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
