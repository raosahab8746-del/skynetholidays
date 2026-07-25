import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Phone, Mail, Instagram, MapPin, Heart, ShieldCheck, Award } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { companyInfo, domesticStates, internationalCountries } = useData();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-[#00AEEF]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Best Luxury Travel Agency</h4>
              <p className="text-xs text-slate-400">Awarded for premier hospitality & custom tours</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-[#FDB813]/20 text-[#FDB813] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Verified Stays & Cabs</h4>
              <p className="text-xs text-slate-400">Handpicked 4-star/5-star luxury resorts</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 Dedicated Concierge</h4>
              <p className="text-xs text-slate-400">Personal tour manager support on WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Column 1: Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block">
              <Logo variant="light" showTagline={true} />
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              {companyInfo.aboutText}
            </p>

            {/* Contact details */}
            <div className="space-y-2 text-sm pt-2">
              <p className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#FDB813] shrink-0" />
                <span>{companyInfo.address}</span>
              </p>
              <p className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-[#00AEEF] shrink-0" />
                <a href={`tel:${companyInfo.phone}`} className="hover:text-[#00AEEF] transition-colors">
                  {companyInfo.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-[#00AEEF] shrink-0" />
                <a href={`mailto:${companyInfo.email}`} className="hover:text-[#00AEEF] transition-colors">
                  {companyInfo.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5 text-slate-300">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <a
                  href={companyInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline font-medium"
                >
                  Follow on Instagram
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base border-b border-slate-800 pb-2">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-[#00AEEF] transition-colors">Home</Link></li>
              <li><Link to="/domestic" className="hover:text-[#00AEEF] transition-colors">Domestic Tour Packages</Link></li>
              <li><Link to="/international" className="hover:text-[#00AEEF] transition-colors">International Tour Packages</Link></li>
              <li><Link to="/weekend-trips" className="hover:text-[#00AEEF] transition-colors">Weekend Getaways</Link></li>
              <li><Link to="/gallery" className="hover:text-[#00AEEF] transition-colors">Photo Gallery</Link></li>
              <li><Link to="/blogs" className="hover:text-[#00AEEF] transition-colors">Travel Blogs</Link></li>
              <li><Link to="/about" className="hover:text-[#00AEEF] transition-colors">About SkyNet Holidays</Link></li>
              <li><Link to="/contact" className="hover:text-[#00AEEF] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Top Domestic States */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base border-b border-slate-800 pb-2">Domestic Holidays</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {domesticStates.filter(st => st.packageCount > 0).slice(0, 8).map(st => (
                <li key={st.id}>
                  <Link to={`/domestic/${st.slug}`} className="hover:text-[#00AEEF] transition-colors flex items-center justify-between">
                    <span>{st.name} Packages</span>
                    <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{st.packageCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Top International Countries */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base border-b border-slate-800 pb-2">International Holidays</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {internationalCountries.filter(cnt => cnt.packageCount > 0).slice(0, 6).map(cnt => (
                <li key={cnt.id}>
                  <Link to={`/international/${cnt.slug}`} className="hover:text-[#00AEEF] transition-colors flex items-center justify-between">
                    <span>{cnt.name} Packages</span>
                    <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{cnt.packageCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkyNet Holidays. All rights reserved. Park Street Road, Jaipur, Rajasthan.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for Premium Luxury Travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
