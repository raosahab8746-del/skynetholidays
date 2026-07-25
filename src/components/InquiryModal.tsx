import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { X, Send, Sparkles, CheckCircle, Calendar, MapPin, Users, Phone, Mail, User } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  defaultDestination = ''
}) => {
  const { addInquiry, packages } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [destination, setDestination] = useState(defaultDestination);
  const [preferredDate, setPreferredDate] = useState('');
  const [duration, setDuration] = useState('5-7 Days');
  const [budget, setBudget] = useState('Standard (₹20k-₹40k / person)');
  const [message, setMessage] = useState('');

  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      let parsedPackageTitle = '';
      let initialDestValue = defaultDestination;

      if (defaultDestination.startsWith('Package: ')) {
        parsedPackageTitle = defaultDestination.replace('Package: ', '');
      } else if (defaultDestination.startsWith('Promo Code: ')) {
        // Leave it as is
      } else {
        // Check if defaultDestination matches a package title
        const matchedPkg = packages.find(p => p.title.toLowerCase() === defaultDestination.toLowerCase());
        if (matchedPkg) {
          parsedPackageTitle = matchedPkg.title;
        }
      }

      if (parsedPackageTitle) {
        const found = packages.find(p => p.title === parsedPackageTitle);
        if (found) {
          setSelectedPackageId(found.id);
          initialDestValue = found.parentName;
        } else {
          setSelectedPackageId('');
        }
      } else {
        setSelectedPackageId('');
      }

      setDestination(initialDestValue);
    }
  }, [isOpen, defaultDestination, packages]);

  if (!isOpen) return null;

  const handlePackageChange = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    if (pkgId) {
      const found = packages.find(p => p.id === pkgId);
      if (found) {
        setDestination(found.parentName);
      }
    } else {
      setDestination('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const id = addInquiry({
      customerName: name,
      customerEmail: email || 'N/A',
      customerPhone: phone,
      destination: destination || 'General Inquiry',
      preferredDate,
      duration,
      budget,
      message
    });

    // Formulate a beautiful WhatsApp message
    const formattedText = `*SkyNet Holidays - Custom Quote Request*
---------------------------------
*Name:* ${name}
*WhatsApp Phone:* ${phone}
*Email:* ${email || 'N/A'}
*Destination:* ${destination || 'General Inquiry'}
*Travel Date:* ${preferredDate || 'Not specified'}
*Duration:* ${duration}
*Budget:* ${budget}
*Requirements/Message:* ${message || 'None'}`;

    const encodedText = encodeURIComponent(formattedText);
    const url = `https://wa.me/919358718087?text=${encodedText}`;
    setWhatsappUrl(url);
    setSubmittedId(id);

    // Try automatic redirect
    try {
      window.open(url, '_blank');
    } catch (err) {
      console.error("Popup blocked, fallback to direct location or button", err);
      window.location.href = url;
    }
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    setWhatsappUrl('');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 p-6 text-white relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00AEEF] animate-ping" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#FDB813]">SkyNet Concierge</span>
          </div>
          <h3 className="text-xl font-bold">Request Custom Quote</h3>
          <p className="text-xs text-slate-300 mt-1">Get personalized travel itineraries & exclusive deals within 30 minutes.</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submittedId ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Connecting to WhatsApp...</h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Thank you, <strong className="text-slate-800">{name}</strong>. Inquiry Reference: <span className="font-mono font-bold text-[#00AEEF]">{submittedId}</span>
              </p>
              <p className="text-xs text-slate-500">
                Please send the pre-filled details on WhatsApp to finalize your custom travel request.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-full text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer animate-pulse"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Proceed to WhatsApp</span>
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
                    />
                  </div>
                </div>
              </div>

              {/* Select Package (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Package (Optional)</label>
                <div className="relative">
                  <select
                    value={selectedPackageId}
                    onChange={e => handlePackageChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] bg-white text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="">-- No specific package (General Custom Plan) --</option>
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.parentName})
                      </option>
                    ))}
                  </select>
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
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Kashmir, Japan, Bali"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Travel Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tentative Travel Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] text-slate-700"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] text-slate-700"
                  >
                    <option value="2-4 Days">2-4 Days (Weekend)</option>
                    <option value="5-7 Days">5-7 Days (Standard)</option>
                    <option value="8-12 Days">8-12 Days (Grand Tour)</option>
                  </select>
                </div>
              </div>

              {/* Special Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Mention guest count, hotel preferences, or special requests..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] text-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00AEEF] to-sky-600 hover:from-sky-600 hover:to-[#00AEEF] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FDB813]" />
                <span>Submit Quote Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
