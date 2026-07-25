import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Phone, Mail, Instagram, MapPin, Send, CheckCircle, Sparkles, User } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { companyInfo, addInquiry } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [message, setMessage] = useState('');

  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const id = addInquiry({
      customerName: name,
      customerEmail: email || 'N/A',
      customerPhone: phone,
      destination: destination || 'General Contact',
      message
    });

    // Formulate a beautiful WhatsApp contact message
    const formattedText = `*SkyNet Holidays - Contact Inquiry*
---------------------------------
*Name:* ${name}
*WhatsApp Phone:* ${phone}
*Email:* ${email || 'N/A'}
*Destination of Interest:* ${destination || 'General Contact'}
*Message/Requirements:* ${message || 'None'}`;

    const encodedText = encodeURIComponent(formattedText);
    const url = `https://wa.me/919358718087?text=${encodedText}`;
    setWhatsappUrl(url);
    setSubmittedId(id);

    // Try automatic redirect
    try {
      window.open(url, '_blank');
    } catch (err) {
      console.error("Popup blocked, fallback to direct navigation", err);
      window.location.href = url;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-[#00AEEF]">
          Get In Touch
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Contact SkyNet Holidays
        </h1>
        <p className="text-xs text-slate-500">
          Speak with our luxury travel advisors or drop by our Jaipur headquarters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 border border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#FDB813] tracking-widest">
              Headquarters
            </span>
            <h2 className="text-2xl font-bold">Jaipur Office</h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Address - NO GOOGLE MAPS LINK as strictly instructed */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FDB813]/20 text-[#FDB813] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Office Address</span>
                <p className="text-slate-200 font-medium">{companyInfo.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                <a href={`tel:${companyInfo.phone}`} className="text-white font-bold hover:text-[#00AEEF] transition-colors">
                  {companyInfo.phone}
                </a>
                {companyInfo.altPhone && (
                  <p className="text-slate-400 text-[11px]">{companyInfo.altPhone}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                <a href={`mailto:${companyInfo.email}`} className="text-white font-medium hover:text-[#00AEEF] transition-colors">
                  {companyInfo.email}
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Instagram Handle</span>
                <a
                  href={companyInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline font-bold"
                >
                  @skynetholidays_
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-slate-400 text-[11px]">
            <p>Office Hours: Monday – Saturday (9:30 AM to 8:00 PM IST)</p>
            <p className="text-emerald-400 font-semibold mt-1">✓ 24/7 WhatsApp Concierge Available</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          {submittedId ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Connecting to WhatsApp...</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you <strong className="text-slate-800">{name}</strong>. Inquiry Reference: <span className="font-mono font-bold text-[#00AEEF]">{submittedId}</span>.
              </p>
              <p className="text-xs text-slate-500">
                Please send the pre-filled details on WhatsApp to secure your custom itinerary design.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer animate-pulse"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send on WhatsApp</span>
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmittedId(null);
                    setWhatsappUrl('');
                    setName('');
                    setEmail('');
                    setPhone('');
                    setDestination('');
                    setMessage('');
                  }}
                  className="text-xs text-[#00AEEF] hover:underline"
                >
                  Or Submit Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Send Us a Direct Message</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Mehta"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9358718087"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="priyanshu@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Interested Destination</label>
                  <input
                    type="text"
                    placeholder="e.g. Kashmir, Japan, Bali, Rajasthan"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Travel Requirements / Question</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your travel dates, number of guests, or any questions..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00AEEF] to-sky-600 hover:from-sky-600 hover:to-[#00AEEF] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
