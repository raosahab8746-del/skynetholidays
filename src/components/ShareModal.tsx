import React, { useState } from 'react';
import { PackageItem } from '../types';
import { X, Copy, Check, Share2, MessageCircle, Mail } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: PackageItem;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, pkg }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappShareText = encodeURIComponent(`Check out this incredible tour package by SkyNet Holidays: ${pkg.title} (${pkg.duration}) for only ₹${pkg.offerPrice.toLocaleString()}! ${currentUrl}`);
  const whatsappShareUrl = `https://wa.me/?text=${whatsappShareText}`;

  const emailSubject = encodeURIComponent(`Tour Package: ${pkg.title} - SkyNet Holidays`);
  const emailBody = encodeURIComponent(`Hi,\n\nTake a look at this tour package from SkyNet Holidays:\n\n${pkg.title}\nDuration: ${pkg.duration}\nOffer Price: ₹${pkg.offerPrice.toLocaleString()}\n\nView details here: ${currentUrl}`);
  const mailToUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#00AEEF]">
          <Share2 className="w-5 h-5" />
          <h3 className="text-lg font-bold text-slate-900">Share Package</h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">Share this itinerary with friends, family, or travel companions.</p>

        <div className="space-y-3">
          {/* WhatsApp Share */}
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-2xl text-sm transition-all shadow-md shadow-emerald-500/20"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Share via WhatsApp</span>
          </a>

          {/* Email Share */}
          <a
            href={mailToUrl}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-2xl text-sm transition-all shadow-md"
          >
            <Mail className="w-5 h-5" />
            <span>Share via Email</span>
          </a>

          {/* Copy Link */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Package Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="bg-[#00AEEF] hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
