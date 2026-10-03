import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle2, MapPin, Sparkles, Phone, Mail, AlertCircle, Share2, Download, Search, X } from 'lucide-react';
import { BRANCHES } from '../data/restaurantData';
import { BranchInfo, Reservation } from '../types';
import { BydLogo } from './BydLogo';
import { ScrollReveal } from './ScrollReveal';

interface ReservationSectionProps {
  initialBranch?: 'sigra' | 'bhojuveer' | string;
  initialDate?: string;
  initialGuests?: number;
  onNewReservation?: (res: Reservation) => void;
  branches?: BranchInfo[];
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  initialBranch = 'sigra',
  initialDate,
  initialGuests = 2,
  onNewReservation,
  branches = BRANCHES,
}) => {
  const [branch, setBranch] = useState<'sigra' | 'bhojuveer' | string>(initialBranch);
  const [date, setDate] = useState<string>(
    initialDate || new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('7:30 PM');
  const [guests, setGuests] = useState<number>(initialGuests);
  const [seatingArea, setSeatingArea] = useState<'indoor_booth' | 'yellow_door_terrace' | 'family_lounge'>('indoor_booth');
  const [specialOccasion, setSpecialOccasion] = useState<string>('Casual Dining');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lookup state
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [foundReservation, setFoundReservation] = useState<Reservation | null>(null);
  const [lookupMessage, setLookupMessage] = useState('');

  // Sync initial props
  useEffect(() => {
    if (initialBranch) setBranch(initialBranch);
    if (initialDate) setDate(initialDate);
    if (initialGuests) setGuests(initialGuests);
  }, [initialBranch, initialDate, initialGuests]);

  const lunchSlots = ['11:30 AM', '12:15 PM', '1:00 PM', '1:45 PM', '2:30 PM', '3:15 PM'];
  const dinnerSlots = ['6:00 PM', '6:45 PM', '7:30 PM', '8:15 PM', '9:00 PM', '9:45 PM', '10:15 PM'];

  const selectedBranchData = branches.find((b) => b.id === branch) || branches[0] || BRANCHES[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please provide a valid 10-digit phone number for table confirmation.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `BYD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReservation: Reservation = {
        id: generatedId,
        branch,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        date,
        timeSlot,
        guests,
        seatingArea,
        specialOccasion,
        specialRequests: specialRequests.trim(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      try {
        const stored = localStorage.getItem('byd_reservations');
        const list: Reservation[] = stored ? JSON.parse(stored) : [];
        list.unshift(newReservation);
        localStorage.setItem('byd_reservations', JSON.stringify(list));
      } catch (err) {
        console.error('Storage error', err);
      }

      onNewReservation?.(newReservation);

      setConfirmedReservation(newReservation);
      setIsSubmitting(false);
    }, 600);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupMessage('');
    setFoundReservation(null);

    const q = lookupQuery.trim().toLowerCase();
    if (!q) {
      setLookupMessage('Please enter your Booking ID (e.g. BYD-1234) or phone number.');
      return;
    }

    try {
      const stored = localStorage.getItem('byd_reservations');
      const list: Reservation[] = stored ? JSON.parse(stored) : [];
      const match = list.find(
        (r) =>
          r.id.toLowerCase() === q ||
          r.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
      );

      if (match) {
        setFoundReservation(match);
      } else {
        setLookupMessage('No reservation found matching this reference. Please check and try again.');
      }
    } catch {
      setLookupMessage('Unable to retrieve reservation history.');
    }
  };

  const handleCancelReservation = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        const stored = localStorage.getItem('byd_reservations');
        let list: Reservation[] = stored ? JSON.parse(stored) : [];
        list = list.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r));
        localStorage.setItem('byd_reservations', JSON.stringify(list));
        if (confirmedReservation?.id === id) {
          setConfirmedReservation({ ...confirmedReservation, status: 'cancelled' });
        }
        if (foundReservation?.id === id) {
          setFoundReservation({ ...foundReservation, status: 'cancelled' });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const downloadCalendarFile = (res: Reservation) => {
    const calendarContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Behind Yellow Doors Diner//Reservation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Dinner Reservation at Behind Yellow Doors (${res.branch === 'sigra' ? 'Sigra' : 'Bhojuveer'})`,
      `DESCRIPTION:Table for ${res.guests} guests under ${res.fullName}. Ref: ${res.id}`,
      `LOCATION:Behind Yellow Doors Diner, ${res.branch === 'sigra' ? 'Sigra' : 'Bhojuveer'}, Varanasi`,
      `DTSTART:${res.date.replace(/-/g, '')}T190000`,
      `DTEND:${res.date.replace(/-/g, '')}T210000`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([calendarContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BYD_Reservation_${res.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="reservations" className="py-20 bg-stone-50 border-t border-stone-200/80 scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                <span>Instant Confirmation</span>
                <span aria-hidden="true">·</span>
                <span>Reserve a Table</span>
                <span aria-hidden="true">·</span>
                <span>Sigra & Bhojuveer</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-stone-900 tracking-tight">
                A table waits Behind Yellow Doors.
              </h2>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button
                onClick={() => {
                  setIsLookupOpen(true);
                  setLookupMessage('');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-stone-500" />
                <span>Find My Booking</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Booking Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Booking Interface */}
          <ScrollReveal animation="fade-up" delay={100} duration={650} className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-6 sm:p-8">
              <form onSubmit={handleBookingSubmit} className="space-y-8">
              {/* Step 1: Branch Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
                  1. Select Diner Outlet
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {branches.map((b) => {
                    const isSelected = branch === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBranch(b.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-stone-900">{b.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                        </div>
                        <p className="text-xs text-stone-500 mb-2 truncate">{b.address}</p>
                        <div className="flex flex-wrap gap-1 text-[11px] text-amber-800">
                          {b.features.slice(0, 2).map((feat, i) => (
                            <span key={i} className="inline-block bg-white/80 border border-amber-200/60 px-1.5 py-0.5 rounded-sm">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Date & Seating Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="res-date" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    2. Date of Visit
                  </label>
                  <input
                    id="res-date"
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setDate(new Date().toISOString().split('T')[0])}
                      className="text-[11px] font-medium text-stone-600 hover:text-stone-950 underline"
                    >
                      Today
                    </button>
                    <span className="text-stone-300">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        setDate(tomorrow.toISOString().split('T')[0]);
                      }}
                      className="text-[11px] font-medium text-stone-600 hover:text-stone-950 underline"
                    >
                      Tomorrow
                    </button>
                    <span className="text-stone-300">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sat = new Date();
                        sat.setDate(sat.getDate() + ((6 - sat.getDay() + 7) % 7));
                        setDate(sat.toISOString().split('T')[0]);
                      }}
                      className="text-[11px] font-medium text-stone-600 hover:text-stone-950 underline"
                    >
                      This Saturday
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    Seating Preference
                  </label>
                  <select
                    value={seatingArea}
                    onChange={(e) =>
                      setSeatingArea(e.target.value as 'indoor_booth' | 'yellow_door_terrace' | 'family_lounge')
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="indoor_booth">Indoor Cozy Booth (Air Conditioned)</option>
                    <option value="yellow_door_terrace">Sunlit Yellow Door Terrace</option>
                    <option value="family_lounge">Quiet Family / Celebration Lounge</option>
                  </select>
                  <p className="text-[11px] text-stone-500 mt-1.5">
                    We will prioritize your preferred section based on arrival table turnover.
                  </p>
                </div>
              </div>

              {/* Step 3: Time Slot */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    3. Select Time Slot
                  </label>
                  <span className="text-[11px] text-amber-700 font-mono">
                    Selected: {timeSlot}
                  </span>
                </div>

                {/* Lunch slots */}
                <div className="mb-3">
                  <span className="text-[11px] text-stone-500 font-medium block mb-1.5">
                    Lunch & Afternoon Hours
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {lunchSlots.map((slot) => {
                      const isSelected = timeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`py-2 px-2 text-xs font-medium rounded-lg text-center transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-stone-900 text-amber-400 font-semibold shadow-xs'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dinner slots */}
                <div>
                  <span className="text-[11px] text-stone-500 font-medium block mb-1.5">
                    Evening & Dinner Hours
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                    {dinnerSlots.map((slot) => {
                      const isSelected = timeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`py-2 px-2 text-xs font-medium rounded-lg text-center transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-stone-900 text-amber-400 font-semibold shadow-xs'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 4: Guests & Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    4. Party Size
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-lg text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center bg-stone-50 border border-stone-200 rounded-lg py-2 text-stone-900 font-semibold text-sm tabular-nums">
                      {guests} {guests === 1 ? 'Guest' : 'Guests'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(15, guests + 1))}
                      className="w-10 h-10 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-lg text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    Special Occasion (Optional)
                  </label>
                  <select
                    value={specialOccasion}
                    onChange={(e) => setSpecialOccasion(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Casual Dining">Casual Dining / Regular Meal</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Anniversary Dinner">Anniversary Dinner</option>
                    <option value="Romantic Date">Romantic Candlelight Date</option>
                    <option value="Family Reunion">Family Reunion</option>
                    <option value="Business Lunch">Business / Team Meeting</option>
                  </select>
                </div>
              </div>

              {/* Step 5: Contact Details */}
              <div className="pt-4 border-t border-stone-200 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  5. Contact Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-base sm:text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number (10 digits) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-base sm:text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address (for voucher)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-base sm:text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Dietary preferences or special requests (e.g. Jain food required, need high chair for toddler, corner table...)"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-base sm:text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Securing Your Table...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm Reservation · No Deposit Required</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-stone-400 mt-2">
                  We hold reserved tables for up to 15 minutes past your booking time.
                </p>
              </div>
            </form>
          </div>
        </ScrollReveal>

        {/* Right Column: Branch Summary & Diner Assurance */}
        <ScrollReveal animation="fade-left" delay={200} duration={650} className="lg:col-span-4">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Selected Outlet Details</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-display mb-1">
                {selectedBranchData.name}
              </h3>
              <p className="text-xs text-stone-600 mb-3">{selectedBranchData.address}</p>
              <div className="space-y-2 text-xs text-stone-600 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <a href={`tel:${selectedBranchData.phone}`} className="hover:text-amber-600 font-mono">
                    {selectedBranchData.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{selectedBranchData.timings}</span>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-xs font-semibold text-stone-900 mb-2 uppercase tracking-wide">
                  Outlet Highlights
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {selectedBranchData.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Diner Hospitality Policy */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                The Yellow Doors Guarantee
              </h4>
              <p className="text-xs text-amber-950/80 leading-relaxed mb-3">
                Need to reschedule or cancel? You can update your booking at any time with no cancellation penalties.
                For large party reservations (10+ people), our hospitality manager coordinates custom menus.
              </p>
              <div className="text-[11px] font-mono text-amber-800">
                Manager Line: +91 6393 138 560
              </div>
            </div>
          </div>
        </ScrollReveal>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmedReservation && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setConfirmedReservation(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <BydLogo variant="mark" size="md" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Table Reserved Successfully
              </span>
              <h3 className="text-2xl font-bold font-display text-stone-900 mt-1">
                We look forward to hosting you!
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Booking Reference: <span className="font-mono font-bold text-stone-900">{confirmedReservation.id}</span>
              </p>
            </div>

            {/* Voucher card */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6 space-y-2.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-stone-200/80">
                <span className="text-stone-500">Guest Name:</span>
                <span className="font-semibold text-stone-900">{confirmedReservation.fullName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200/80">
                <span className="text-stone-500">Location:</span>
                <span className="font-semibold text-stone-900">
                  {confirmedReservation.branch === 'sigra' ? 'Sigra Branch (Chittupura)' : 'Bhojuveer Branch'}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200/80">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-semibold text-stone-900 font-mono">
                  {confirmedReservation.date} at {confirmedReservation.timeSlot}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200/80">
                <span className="text-stone-500">Guests & Occasion:</span>
                <span className="font-semibold text-stone-900">
                  {confirmedReservation.guests} Guests · {confirmedReservation.specialOccasion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Seating Area:</span>
                <span className="font-semibold text-stone-900 capitalize">
                  {confirmedReservation.seatingArea.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => downloadCalendarFile(confirmedReservation)}
                className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Print Voucher
              </button>
              <button
                type="button"
                onClick={() => setConfirmedReservation(null)}
                className="py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lookup Reservation Modal */}
      {isLookupOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setIsLookupOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-stone-900 mb-2">
              Find Existing Reservation
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Enter your Booking Reference (e.g. BYD-7821) or phone number to view or manage your reservation.
            </p>

            <form onSubmit={handleLookup} className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Booking ID or 10-digit Phone..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Search Booking
              </button>
            </form>

            {lookupMessage && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg mb-3">
                {lookupMessage}
              </p>
            )}

            {foundReservation && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="font-bold text-stone-900">{foundReservation.id}</span>
                  <span
                    className={`font-semibold capitalize px-2 py-0.5 rounded-xs text-[10px] ${
                      foundReservation.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {foundReservation.status}
                  </span>
                </div>
                <p className="text-stone-700">
                  <strong>{foundReservation.fullName}</strong> · {foundReservation.guests} Guests
                </p>
                <p className="text-stone-600 font-mono text-[11px]">
                  {foundReservation.date} at {foundReservation.timeSlot} ({foundReservation.branch.toUpperCase()})
                </p>

                {foundReservation.status === 'confirmed' && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleCancelReservation(foundReservation.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold underline cursor-pointer"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
