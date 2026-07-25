import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Clock, Star, MapPin, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface WeekendTripsProps {
  onOpenInquiry: (dest?: string) => void;
}

export const WeekendTrips: React.FC<WeekendTripsProps> = ({ onOpenInquiry }) => {
  const { packages } = useData();

  // Weekend packages usually duration <= 4 days or type === 'weekend'
  const weekendPackages = packages.filter(p => p.type === 'weekend' || p.days <= 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#00AEEF]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Weekend Trips</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00AEEF] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FDB813]" /> Quick Getaways
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Short Weekend Tour Packages
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Recharge with 2-4 day short luxury escapes across hill stations, beaches, and heritage forts.
            </p>
          </div>

          <button
            onClick={() => onOpenInquiry('Weekend Trip Custom Plan')}
            className="bg-[#00AEEF] hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer"
          >
            Plan Custom Weekend Trip
          </button>
        </div>
      </div>

      {/* Weekend Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weekendPackages.map(pkg => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <ImageWithFallback
                src={pkg.coverImage}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                fallbackTitle={pkg.title}
                category="Weekend Getaway"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <span className="absolute top-3 left-3 bg-[#FDB813] text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                {pkg.duration}
              </span>

              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00AEEF]" /> {pkg.parentName}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-slate-900/60 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>{pkg.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <Link
                  to={`/package/${pkg.slug}`}
                  className="font-bold text-slate-900 text-base line-clamp-2 hover:text-[#00AEEF] transition-colors"
                >
                  {pkg.title}
                </Link>
                <p className="text-xs text-slate-500 line-clamp-2">{pkg.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Offer Price</span>
                  <span className="text-xl font-extrabold text-[#00AEEF]">
                    ₹{pkg.offerPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/package/${pkg.slug}`}
                    className="bg-slate-900 hover:bg-[#00AEEF] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => onOpenInquiry(`Weekend Package: ${pkg.title}`)}
                    className="bg-[#00AEEF] hover:bg-sky-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
