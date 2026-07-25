import React from 'react';
import { useData } from '../context/DataContext';
import { Phone, Instagram, MessageCircle } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { companyInfo } = useData();

  // Clean phone number for WhatsApp URL
  const whatsappPhone = companyInfo.phone.replace(/[^0-9]/g, '');
  const prewrittenMessage = encodeURIComponent("Hello SkyNet Holidays, I am interested in booking a tour package. Please assist me.");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${prewrittenMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Instagram Button */}
      <a
        href={companyInfo.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow us on Instagram"
        className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 group"
      >
        <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </a>

      {/* Direct Call Button */}
      <a
        href={`tel:${companyInfo.phone}`}
        aria-label="Call SkyNet Holidays"
        className="w-11 h-11 rounded-full bg-[#00AEEF] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 group"
      >
        <Phone className="w-5 h-5 group-hover:animate-bounce" />
      </a>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all duration-200 group"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-500 group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-sm hidden md:inline">WhatsApp Enquiry</span>
      </a>
    </div>
  );
};
