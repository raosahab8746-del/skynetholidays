import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Globe, ChevronRight, Search, Sparkles, MapPin } from 'lucide-react';

export const InternationalDestinations: React.FC = () => {
  const { internationalCountries, packages } = useData();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const filteredCountries = internationalCountries
    .filter(cnt => cnt.packageCount > 0)
    .filter(cnt => {
      const term = searchTerm.toLowerCase();
      const matchName = cnt.name.toLowerCase().includes(term);
      const matchRegion = cnt.regions.some(r => r.name.toLowerCase().includes(term));
      const matchDesc = cnt.description.toLowerCase().includes(term);
      return matchName || matchRegion || matchDesc;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#00AEEF]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">International Packages</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00AEEF] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#FDB813]" /> World Luxury Destinations
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              International Tour Destinations
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Explore 11 iconic international countries with handpicked 4-star stays, island cruises, and 24/7 concierge.
            </p>
          </div>

          {/* Search filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Country or City (e.g. Japan, Tokyo, Bali)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#00AEEF] shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map(country => {
          const countryPackages = packages.filter(p => p.parentSlug === country.slug);
          return (
            <div
              key={country.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={country.image}
                  alt={country.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackTitle={country.name}
                  category="International Country"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                <span className="absolute top-3 right-3 bg-[#00AEEF] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  {countryPackages.length || country.packageCount} Tour Packages
                </span>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold text-[#FDB813] block">
                    {country.tag}
                  </span>
                  <h2 className="text-2xl font-extrabold">{country.name}</h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {country.description}
                </p>

                {/* Sub Regions inside country */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Regions in {country.name}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {country.regions.map((reg, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs"
                      >
                        <MapPin className="w-3 h-3 text-[#00AEEF]" />
                        {reg.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <Link
                    to={`/international/${country.slug}`}
                    className="w-full bg-slate-900 hover:bg-[#00AEEF] text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <span>Browse {country.name} Itineraries</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Globe className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No international destination matching "{searchTerm}"</h3>
          <p className="text-xs text-slate-500">Try searching for Japan, Bali, Dubai, Thailand, Singapore, Maldives, etc.</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs font-bold text-[#00AEEF] hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};
