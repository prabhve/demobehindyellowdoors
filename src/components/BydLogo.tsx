import React from 'react';

interface BydLogoProps {
  variant?: 'full' | 'mark' | 'horizontal' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isOpen?: boolean; // For animated door opening effect
}

export const BydLogo: React.FC<BydLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  isOpen = false,
}) => {
  // Dimensions based on size
  const sizeMap = {
    sm: { icon: 32, text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 42, text: 'text-sm', sub: 'text-[10px]' },
    lg: { icon: 64, text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 88, text: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // The Iconic Yellow Doors SVG Mark
  const renderDoorsIcon = (iconSize: number) => (
    <div
      style={{ width: iconSize, height: iconSize * 1.15 }}
      className="relative shrink-0 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 100 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Outer Arch Frame (Dark Bronze/Espresso) */}
        <path
          d="M 10 110 L 10 45 A 40 40 0 0 1 90 45 L 90 110 Z"
          fill="#1C1917"
          stroke="#F59E0B"
          strokeWidth="3"
        />

        {/* Interior Warm Dining Light (Visible when doors open) */}
        <path
          d="M 14 108 L 14 45 A 36 36 0 0 1 86 45 L 86 108 Z"
          fill="url(#warmGlow)"
        />

        {/* Interior Bistro Chandelier / Filament Light Glow */}
        <circle cx="50" cy="50" r="14" fill="#FDE68A" opacity="0.8" />
        <circle cx="50" cy="50" r="7" fill="#FEF3C7" />
        <path d="M 50 15 L 50 43" stroke="#D97706" strokeWidth="2" strokeDasharray="2 2" />

        {/* LEFT YELLOW DOOR */}
        <g
          className="transition-transform duration-700 ease-out origin-left"
          style={{
            transform: isOpen ? 'rotateY(-65deg) scaleX(0.7)' : 'rotateY(0deg)',
          }}
        >
          {/* Door Base Panel (Sunflower Yellow) */}
          <path
            d="M 14 108 L 14 45 A 36 36 0 0 1 50 20 L 50 108 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="2"
          />

          {/* Top Window Panes */}
          <rect x="20" y="38" width="11" height="24" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
          <rect x="35" y="38" width="11" height="24" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
          {/* Glass Mullions */}
          <line x1="20" y1="50" x2="31" y2="50" stroke="#B45309" strokeWidth="1" />
          <line x1="35" y1="50" x2="46" y2="50" stroke="#B45309" strokeWidth="1" />

          {/* Bottom Wood Wainscot Panels */}
          <rect x="20" y="68" width="26" height="34" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <rect x="23" y="72" width="20" height="26" rx="1.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />

          {/* Brass Door Handle */}
          <rect x="43" y="62" width="3.5" height="12" rx="1.5" fill="#78350F" />
          <circle cx="44.75" cy="68" r="2.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
        </g>

        {/* RIGHT YELLOW DOOR */}
        <g
          className="transition-transform duration-700 ease-out origin-right"
          style={{
            transform: isOpen ? 'rotateY(65deg) scaleX(0.7)' : 'rotateY(0deg)',
          }}
        >
          {/* Door Base Panel (Sunflower Yellow) */}
          <path
            d="M 50 20 A 36 36 0 0 1 86 45 L 86 108 L 50 108 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="2"
          />

          {/* Top Window Panes */}
          <rect x="54" y="38" width="11" height="24" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
          <rect x="69" y="38" width="11" height="24" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
          {/* Glass Mullions */}
          <line x1="54" y1="50" x2="65" y2="50" stroke="#B45309" strokeWidth="1" />
          <line x1="69" y1="52" x2="80" y2="52" stroke="#B45309" strokeWidth="1" />

          {/* Bottom Wood Wainscot Panels */}
          <rect x="54" y="68" width="26" height="34" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <rect x="57" y="72" width="20" height="26" rx="1.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />

          {/* Brass Door Handle */}
          <rect x="53.5" y="62" width="3.5" height="12" rx="1.5" fill="#78350F" />
          <circle cx="55.25" cy="68" r="2.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
        </g>

        {/* Center Door Threshold Line */}
        <line x1="50" y1="20" x2="50" y2="108" stroke="#78350F" strokeWidth="1.5" />

        {/* Door Sill Bottom Step */}
        <rect x="6" y="108" width="88" height="6" rx="1" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />

        {/* Gradient Defs */}
        <defs>
          <radialGradient id="warmGlow" cx="50" cy="50" r="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );

  // Variant: Just the mark
  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderDoorsIcon(currentSize.icon)}
      </div>
    );
  }

  // Variant: Horizontal compact (for Top Bar & Header)
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {renderDoorsIcon(currentSize.icon)}
        <div className="flex flex-col text-left">
          <span className="font-display font-bold text-stone-900 tracking-tight leading-none text-base sm:text-lg">
            Behind Yellow Doors
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600 mt-1 font-mono">
            Diner · Varanasi
          </span>
        </div>
      </div>
    );
  }

  // Variant: Compact (small lockup)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {renderDoorsIcon(28)}
        <span className="font-display font-bold text-stone-900 tracking-tight text-sm">
          BYD Diner
        </span>
      </div>
    );
  }

  // Variant: Full Badge (for Loading Screen, Hero & Footer)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {renderDoorsIcon(currentSize.icon)}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-700 font-mono">
          <span>Est. 2021</span>
          <span aria-hidden="true">·</span>
          <span>Varanasi</span>
        </div>
        <h2 className="font-display font-bold text-stone-950 tracking-tight text-xl sm:text-2xl uppercase">
          Behind Yellow Doors
        </h2>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">
          Diner & Artisanal Cafe
        </p>
      </div>
    </div>
  );
};
