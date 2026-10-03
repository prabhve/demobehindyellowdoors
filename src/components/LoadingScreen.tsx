import React, { useState, useEffect } from 'react';
import { BydLogo } from './BydLogo';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [statusText, setStatusText] = useState('Preparing the diner...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Stage 1: Doors unlock and open
    const doorTimer = setTimeout(() => {
      setDoorsOpen(true);
      setStatusText('Unlocking the yellow doors...');
    }, 400);

    // Stage 2: Progress interval
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 14) + 6;
        if (next > 30 && next < 65) {
          setStatusText('Firing the wood-fired ovens...');
        } else if (next >= 65 && next < 95) {
          setStatusText('Setting your table in Varanasi...');
        } else if (next >= 95) {
          setStatusText('Welcome Behind Yellow Doors!');
        }
        return next > 100 ? 100 : next;
      });
    }, 90);

    return () => {
      clearTimeout(doorTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsFadingOut(true);
        const finishTimer = setTimeout(() => {
          onComplete();
        }, 500);
        return () => clearTimeout(finishTimer);
      }, 350);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  return (
    <div
      aria-label="Loading Behind Yellow Doors Diner"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] transition-all duration-500 ${
        isFadingOut ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated Brand Logo with Opening Doors */}
        <div className="mb-6 transform transition-all duration-700 ease-out">
          <BydLogo variant="full" size="xl" isOpen={doorsOpen} />
        </div>

        {/* Authentic Tagline from byddiner.com */}
        <p className="text-xs italic text-amber-800 font-serif-display max-w-xs mb-8">
          &ldquo;Making Banaras spicier, happier and deliciously yellow.&rdquo;
        </p>

        {/* High-Precision Loading Progress Bar */}
        <div className="w-full bg-stone-200/90 h-1.5 rounded-full overflow-hidden p-0.5 border border-stone-200 shadow-inner mb-3">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Live Loading Status text & Percentage */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-stone-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>{statusText}</span>
          </span>
          <span className="font-bold text-stone-800 tabular-nums">
            {progress}%
          </span>
        </div>

        {/* Skip button for fast accessibility */}
        <button
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 200);
          }}
          className="mt-8 text-[11px] text-stone-400 hover:text-stone-700 underline transition-colors cursor-pointer"
        >
          Skip into Diner →
        </button>
      </div>
    </div>
  );
};
