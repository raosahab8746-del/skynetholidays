import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ChevronRight, MapPin, Clock, Star, CheckCircle2, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';

interface DomesticStatePackagesProps {
  onOpenInquiry: (dest?: string) => void;
}

export const DomesticStatePackages: React.FC<DomesticStatePackagesProps> = ({ onOpenInquiry }) => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const { domesticStates, packages } = useData();

  const currentState = domesticStates.find(s => s.slug === stateSlug) || domesticStates[0];
  const statePackages = packages.filter(p => p.parentSlug === currentState.slug);

  // Filters
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(200000);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPackages = statePackages.filter(pkg => {
    if (selectedRegion !== 'all' && !pkg.regionName.toLowerCase().includes(selectedRegion.toLowerCase())) {
      return false;
    }
    if (pkg.offerPrice > maxBudget) {
      return false;
    }
    if (selectedCategory !== 'all' && pkg.budgetCategory !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-[#00AEEF]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/domestic" className="hover:text-[#00AEEF]">Domestic Packages</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold">{currentState.name}</span>
      </div>

      {/* State Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 md:p-10 shadow-xl border border-slate-800">
        <div className="absolute inset-0 z-0 opacity-40">
          <ImageWithFallback
            src={currentState.bannerImage || currentState.image}
            alt={currentState.name}
            className="w-full h-full object-cover"
            fallbackTitle={currentState.name}
            category="Domestic State"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>

        <div className="relative z-10 space-y-3 max-w-3xl">
          <span className="bg-[#FDB813] text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {currentState.tag}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold">{currentState.name} Tour Packages</h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            {currentState.description}
          </p>

          {/* Sub Regions badges */}
          <div className="pt-2 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400 font-semibold">Key Regions:</span>
            {currentState.regions.map((reg, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRegion(selectedRegion === reg.name ? 'all' : reg.name)}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                  selectedRegion === reg.name
                    ? 'bg-[#00AEEF] text-white shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20'
                }`}
              >
                {reg.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-[#00AEEF]" />
          <span>Filter {currentState.name} Packages</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Sub Region Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-500">Region:</label>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-[#00AEEF]"
            >
              <option value="all">All Regions</option>
              {currentState.regions.map((reg, idx) => (
                <option key={idx} value={reg.name}>{reg.name}</option>
              ))}
            </select>
          </div>

          {/* Luxury Category */}
          <div className="flex items-center gap-2">
            <label className="text-slate-500">Category:</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-[#00AEEF]"
            >
              <option value="all">All Categories</option>
              <option value="budget">Budget Friendly</option>
              <option value="mid">Mid-Range Deluxe</option>
              <option value="luxury">Luxury Premium</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedRegion('all');
              setMaxBudget(200000);
              setSelectedCategory('all');
            }}
            className="text-xs text-[#00AEEF] font-bold hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Package List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map(pkg => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <ImageWithFallback
                src={pkg.coverImage}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                fallbackTitle={pkg.title}
                category={pkg.parentName}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <span className="absolute top-3 left-3 bg-[#00AEEF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {pkg.duration}
              </span>

              {pkg.discountPercent > 0 && (
                <span className="absolute top-3 right-3 bg-[#FDB813] text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  SAVE {pkg.discountPercent}%
                </span>
              )}

              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00AEEF]" /> {pkg.regionName}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-slate-900/60 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>{pkg.rating} ({pkg.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Content */}
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

              {/* Inclusions summary */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Inclusions</span>
                <p className="line-clamp-2 text-[11px]">{pkg.inclusions.join(' • ')}</p>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Per Person</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#00AEEF]">
                      ₹{pkg.offerPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{pkg.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/package/${pkg.slug}`}
                    className="bg-slate-900 hover:bg-[#00AEEF] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => onOpenInquiry(`Package: ${pkg.title}`)}
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

      {filteredPackages.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <h3 className="text-lg font-bold text-slate-800">No packages found for selected filters</h3>
          <p className="text-xs text-slate-500">Try resetting filters to view all packages in {currentState.name}.</p>
          <button
            onClick={() => {
              setSelectedRegion('all');
              setMaxBudget(200000);
              setSelectedCategory('all');
            }}
            className="bg-[#00AEEF] text-white px-5 py-2 rounded-full text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
