import React from 'react';
import { useData } from '../context/DataContext';
import { Award, ShieldCheck, Heart, Sparkles, MapPin, Users, Globe, Plane } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { companyInfo } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#00AEEF] bg-sky-50 px-3 py-1 rounded-full">
          About SkyNet Holidays
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          Redefining Luxury Travel Experiences Since 2014
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Headquartered in Jaipur, Rajasthan, SkyNet Holidays is India's leading luxury travel curator specializing in bespoke domestic and international journeys.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl space-y-3 relative overflow-hidden border border-slate-700">
          <div className="w-12 h-12 rounded-2xl bg-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center font-bold text-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {companyInfo.mission}
          </p>
        </div>

        <div className="bg-gradient-to-br from-sky-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-3 relative overflow-hidden border border-sky-800">
          <div className="w-12 h-12 rounded-2xl bg-[#FDB813]/20 text-[#FDB813] flex items-center justify-center font-bold text-xl">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Our Vision</h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {companyInfo.vision}
          </p>
        </div>
      </div>

      {/* Achievements Counter */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="space-y-1">
          <span className="text-3xl lg:text-4xl font-extrabold text-[#00AEEF]">12+</span>
          <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Years Excellence</span>
        </div>
        <div className="space-y-1">
          <span className="text-3xl lg:text-4xl font-extrabold text-[#FDB813]">45,000+</span>
          <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Happy Travelers</span>
        </div>
        <div className="space-y-1">
          <span className="text-3xl lg:text-4xl font-extrabold text-emerald-600">99.4%</span>
          <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Satisfaction Rate</span>
        </div>
        <div className="space-y-1">
          <span className="text-3xl lg:text-4xl font-extrabold text-purple-600">200+</span>
          <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Luxury Hotel Partners</span>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Why Travel With Us</h2>
          <p className="text-xs text-slate-500">The core values that make SkyNet Holidays India's most trusted luxury brand.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#00AEEF] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Bespoke Customization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every traveler is unique. We design itineraries tailored around your pace, culinary choices, and favorite luxury stay styles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FDB813] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Handpicked Quality</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We personally inspect houseboats in Kashmir, desert camps in Jaisalmer, and pool villas in Bali before recommending them.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Zero Hidden Charges</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent pricing with all driver allowances, toll taxes, and breakfasts included upfront in your official voucher.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
