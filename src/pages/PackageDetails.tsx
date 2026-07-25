import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PackageItem } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { BookingModal } from '../components/BookingModal';
import { ShareModal } from '../components/ShareModal';
import {
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Hotel,
  Utensils,
  Car,
  Compass,
  Calendar,
  ShieldCheck,
  Share2,
  MessageCircle,
  PhoneCall,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info,
  Luggage,
  HelpCircle,
  UserCheck
} from 'lucide-react';

interface PackageDetailsProps {
  onOpenInquiry: (dest?: string) => void;
}

export const PackageDetails: React.FC<PackageDetailsProps> = ({ onOpenInquiry }) => {
  const { slug } = useParams<{ slug: string }>();
  const { packages, companyInfo } = useData();
  const navigate = useNavigate();

  const pkg = packages.find(p => p.slug === slug) || packages[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'inclusions' | 'faqs' | 'reviews'>('itinerary');
  const [openItineraryDay, setOpenItineraryDay] = useState<number | null>(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // WhatsApp click
  const whatsappPhone = companyInfo.phone.replace(/[^0-9]/g, '');
  const prewrittenMessage = encodeURIComponent(`Hello SkyNet Holidays, I want to book/enquire about package: "${pkg.title}" (${pkg.duration}). Offer Price: ₹${pkg.offerPrice}. Please assist.`);
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${prewrittenMessage}`;

  const allImages = pkg.galleryImages && pkg.galleryImages.length > 0 ? pkg.galleryImages : [pkg.coverImage];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-[#00AEEF]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={pkg.type === 'domestic' ? '/domestic' : '/international'} className="hover:text-[#00AEEF]">
          {pkg.type === 'domestic' ? 'Domestic' : 'International'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={pkg.type === 'domestic' ? `/domestic/${pkg.parentSlug}` : `/international/${pkg.parentSlug}`}
          className="hover:text-[#00AEEF]"
        >
          {pkg.parentName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold line-clamp-1">{pkg.title}</span>
      </div>

      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#00AEEF] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {pkg.type} Tour
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00AEEF]" /> {pkg.parentName} • {pkg.regionName}
            </span>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {pkg.rating} ({pkg.reviewCount} Reviews)
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {pkg.title}
          </h1>
        </div>

        {/* Share & Contact Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-500" />
            <span>WhatsApp Inquiry</span>
          </a>
        </div>
      </div>

      {/* GALLERY & QUICK BOOKING BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Gallery Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-80 md:h-[420px] rounded-3xl overflow-hidden shadow-lg bg-slate-900 border border-slate-100">
            <ImageWithFallback
              src={allImages[activeImageIndex]}
              alt={pkg.title}
              className="w-full h-full object-cover transition-all duration-300"
              fallbackTitle={pkg.title}
              category={pkg.parentName}
            />

            <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#FDB813]" /> {pkg.duration}
            </span>
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-[#00AEEF] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <ImageWithFallback
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Pricing & Booking Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6 lg:sticky lg:top-24">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50/50 p-4 rounded-2xl border border-sky-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Special Discount Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#00AEEF]">₹{pkg.offerPrice.toLocaleString()}</span>
              <span className="text-sm text-slate-400 line-through">₹{pkg.price.toLocaleString()}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                {pkg.discountPercent}% OFF
              </span>
            </div>
            <p className="text-[11px] text-slate-500">*Per person on twin sharing basis including tax</p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Duration</span>
              <span className="font-bold text-slate-800">{pkg.duration}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Stay Category</span>
              <span className="font-bold text-slate-800">4★ Luxury Hotels</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Meal Plan</span>
              <span className="font-bold text-slate-800">{pkg.meals}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Transport</span>
              <span className="font-bold text-slate-800">Private AC Cab</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full bg-gradient-to-r from-[#00AEEF] to-sky-600 hover:from-sky-600 hover:to-[#00AEEF] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FDB813]" />
              <span>Book Now (No Advance Needed)</span>
            </button>

            <button
              onClick={() => onOpenInquiry(`Package: ${pkg.title}`)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Get Custom Quote / Modify Itinerary</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Ask Query on WhatsApp</span>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% Customized Tour. Free cancellation terms available.</span>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTS & OVERVIEW */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Tour Overview & Description</h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{pkg.description}</p>
          {pkg.longDescription && (
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap pt-2 border-t border-slate-100 mt-2">{pkg.longDescription}</p>
          )}
        </div>

        {/* Highlights */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[#00AEEF]">
            Key Tour Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pkg.highlights.map((hl, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                <span className="font-semibold">{hl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAILED TABS (ITINERARY, HOTELS, INCLUSIONS, FAQS, REVIEWS) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none bg-slate-50/50 p-2 gap-2">
          {[
            { id: 'itinerary', label: 'Day-wise Itinerary', icon: Calendar },
            { id: 'hotels', label: 'Hotels & Transport', icon: Hotel },
            { id: 'inclusions', label: 'Inclusions & Exclusions', icon: CheckCircle2 },
            { id: 'faqs', label: 'FAQs & Best Time', icon: HelpCircle },
            { id: 'reviews', label: `Reviews (${pkg.reviewCount})`, icon: Star }
          ].map(tab => {
            const IconComponent = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#00AEEF] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 md:p-8">
          {/* 1. ITINERARY TAB */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Detailed Day-wise Itinerary</h3>
              <div className="space-y-3">
                {pkg.dayItinerary.map((dayItem) => {
                  const isOpen = openItineraryDay === dayItem.day;
                  return (
                    <div
                      key={dayItem.day}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/30"
                    >
                      <button
                        onClick={() => setOpenItineraryDay(isOpen ? null : dayItem.day)}
                        className="w-full p-4 flex items-center justify-between text-left font-bold text-xs md:text-sm text-slate-800 hover:text-[#00AEEF] gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 min-w-[50px] h-8 rounded-xl bg-[#00AEEF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm whitespace-nowrap">
                            Day {dayItem.day}
                          </span>
                          <span>{dayItem.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-[#00AEEF]' : 'text-slate-400'}`} />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 space-y-3 bg-white">
                          <p className="leading-relaxed whitespace-pre-wrap">{dayItem.description}</p>
                          {dayItem.activities && (
                            <div className="text-[11px] bg-sky-50/50 p-2.5 rounded-xl border border-sky-100">
                              <span className="font-bold text-[#00AEEF]">Activities / Sightseeing:</span> {dayItem.activities}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-4 text-[11px] pt-2 border-t border-slate-100 text-slate-500 font-medium">
                            {dayItem.mealsIncluded && (
                              <span className="flex items-center gap-1">
                                <Utensils className="w-3.5 h-3.5 text-[#FDB813]" /> Meals: {dayItem.mealsIncluded}
                              </span>
                            )}
                            {(dayItem.hotel || dayItem.overnightStay) && (
                              <span className="flex items-center gap-1">
                                <Hotel className="w-3.5 h-3.5 text-[#00AEEF]" /> Overnight: {dayItem.hotel || dayItem.overnightStay}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. HOTELS & TRANSPORT TAB */}
          {activeTab === 'hotels' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-[#00AEEF]" /> Handpicked Stays
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pkg.hotelsDetailed && pkg.hotelsDetailed.length > 0 ? (
                    pkg.hotelsDetailed.map((hotel, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-[#FDB813] uppercase">
                          {hotel.rating ? `${hotel.rating} Star` : '4-Star Deluxe'}
                        </span>
                        <h4 className="font-bold text-sm text-slate-800">{hotel.name}</h4>
                        {hotel.location && (
                          <p className="text-[11px] text-slate-500">{hotel.location}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    pkg.hotels.map((hotelName, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-[#FDB813] uppercase">4-Star Deluxe</span>
                        <h4 className="font-bold text-sm text-slate-800">{hotelName}</h4>
                        <p className="text-[11px] text-slate-500">Luxury amenities, Wi-Fi, swimming pool & breakfast buffet.</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#FDB813]" /> Meals Included
                  </h4>
                  <p className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
                    {pkg.meals}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#00AEEF]" /> Transportation
                  </h4>
                  <p className="text-xs text-slate-600 bg-sky-50/50 p-3 rounded-2xl border border-sky-100">
                    {pkg.transportation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. INCLUSIONS & EXCLUSIONS TAB */}
          {activeTab === 'inclusions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inclusions */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> What's Included
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {pkg.inclusions.map((inc, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" /> What's Excluded
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {pkg.exclusions.map((exc, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 4. FAQS & BEST TIME TAB */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-1">
                  <span className="text-xs font-bold text-[#00AEEF] flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Best Time to Visit
                  </span>
                  <p className="text-xs text-slate-700">{pkg.bestTime}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                  <span className="text-xs font-bold text-[#FDB813] flex items-center gap-1">
                    <Luggage className="w-4 h-4 text-[#FDB813]" /> Things to Carry
                  </span>
                  <p className="text-xs text-slate-700">{pkg.thingsToCarry.join(', ')}</p>
                </div>

                {pkg.availableDates && pkg.availableDates.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Available Departures
                    </span>
                    <p className="text-xs text-slate-700">{pkg.availableDates.join(', ')}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
                {pkg.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-4 space-y-1 bg-slate-50/50">
                    <h4 className="font-bold text-xs md:text-sm text-slate-800">Q: {faq.question}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-slate-900">{pkg.rating}</span>
                  <div className="flex text-amber-400 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500">{pkg.reviewCount} Verified Reviews</span>
                </div>
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">100% Guest Satisfaction Rating</p>
                  <p>All reviews are from verified travelers who booked with SkyNet Holidays.</p>
                </div>
              </div>

              <div className="space-y-4">
                {pkg.reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 space-y-2 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#00AEEF] text-white font-bold flex items-center justify-center text-xs">
                          {rev.user.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{rev.user}</h4>
                          <span className="text-[10px] text-slate-400">{rev.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block text-right">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking & Share Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        pkg={pkg}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        pkg={pkg}
      />
    </div>
  );
};
