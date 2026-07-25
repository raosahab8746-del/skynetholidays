import React, { useState } from 'react';
import { PackageItem } from '../types';
import { useData } from '../context/DataContext';
import { X, CheckCircle, Calendar, Users, Phone, Mail, User, ShieldCheck, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: PackageItem;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  pkg
}) => {
  const { addBooking } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const [bookingId, setBookingId] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  if (!isOpen) return null;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !travelDate) return;

    const id = addBooking({
      packageId: pkg.id,
      packageTitle: pkg.title,
      customerName: name,
      customerEmail: email || 'N/A',
      customerPhone: phone,
      travelDate,
      guestCount,
      specialRequests
    });

    const totalPrice = pkg.offerPrice * guestCount;

    // Formulate a beautiful WhatsApp booking message
    const formattedText = `*SkyNet Holidays - Booking Request*
---------------------------------
*Package Name:* ${pkg.title}
*Duration:* ${pkg.duration}
*Destination:* ${pkg.parentName || 'Specified on Package'}
*Lead Traveler:* ${name}
*WhatsApp Phone:* ${phone}
*Email:* ${email || 'N/A'}
*Travel Date:* ${travelDate}
*Guests:* ${guestCount} Person(s)
*Special Requirements:* ${specialRequests || 'None'}
*Total Value:* ₹${totalPrice.toLocaleString()}`;

    const encodedText = encodeURIComponent(formattedText);
    const url = `https://wa.me/919358718087?text=${encodedText}`;
    setWhatsappUrl(url);
    setBookingId(id);

    // Try automatic redirect
    try {
      window.open(url, '_blank');
    } catch (err) {
      console.error("Popup blocked, fallback to direct navigation", err);
      window.location.href = url;
    }
  };

  const handleResetAndClose = () => {
    setBookingId(null);
    setWhatsappUrl('');
    setName('');
    setEmail('');
    setPhone('');
    setTravelDate('');
    setSpecialRequests('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#FDB813] text-slate-900">
              {pkg.duration}
            </span>
            <span className="text-xs text-sky-300">{pkg.parentName}</span>
          </div>

          <h3 className="text-lg font-bold line-clamp-1">{pkg.title}</h3>
          
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xs text-slate-400">Offer Price:</span>
            <span className="text-2xl font-extrabold text-[#00AEEF]">₹{pkg.offerPrice.toLocaleString()}</span>
            <span className="text-xs text-slate-400 line-through">₹{pkg.price.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              SAVE {pkg.discountPercent}%
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {bookingId ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Connecting to WhatsApp...</h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Thank you <strong className="text-slate-800">{name}</strong>. Your Booking ID is: <span className="font-mono font-bold text-[#00AEEF]">{bookingId}</span>
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please send the pre-filled details on WhatsApp to secure your booking and receive your flight and hotel vouchers.
              </p>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer animate-pulse"
                >
                  <Phone className="w-4 h-4" />
                  <span>Send Booking on WhatsApp</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Traveler Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98290 00000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="vikram@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF]"
                    />
                  </div>
                </div>

                {/* Travel Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Travel Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={e => setTravelDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Guests</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 6, 8].map(count => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setGuestCount(count)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        guestCount === count
                          ? 'bg-[#00AEEF] text-white border-[#00AEEF] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {count} {count === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Requirements / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Honeymoon decorations, vegetarian food, extra bed, etc."
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-sky-50 border border-sky-100 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Total Package Value ({guestCount} Guests)</span>
                  <span className="text-slate-900 font-bold text-sm">
                    ₹{(pkg.offerPrice * guestCount).toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> No advance payment required today
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00AEEF] to-sky-600 hover:from-sky-600 hover:to-[#00AEEF] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FDB813]" />
                <span>Confirm Booking Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
