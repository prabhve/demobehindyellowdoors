import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { FaqItem } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface FaqSectionProps {
  faqs: FaqItem[];
  onOpenReservation: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs, onOpenReservation }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-20 bg-white border-t border-stone-200/80 scroll-mt-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Common Queries</span>
              <span aria-hidden="true">·</span>
              <span>Diner Information</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-stone-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl mx-auto">
              Everything you need to know about dining, reservations, special requests, and our Varanasi locations.
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <ScrollReveal
                key={faq.id}
                animation="fade-up"
                delay={Math.min(index * 60, 300)}
                duration={500}
              >
                <div
                  className="border border-stone-200 rounded-xl overflow-hidden transition-all bg-stone-50/50"
                >
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-stone-900 hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    <span className="font-display">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-white">
                      <p className="pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Quick Contact Prompt */}
        <ScrollReveal animation="fade-up" delay={200} duration={600}>
          <div className="mt-10 p-5 rounded-xl bg-amber-50/80 border border-amber-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                Have a special dietary requirement or large group booking?
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-600">
                Our hospitality managers at Sigra (+91 6393 138 560) and Bhojuveer are here to assist.
              </p>
            </div>
            <button
              onClick={onOpenReservation}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Reserve Table Now
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
