import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { MapPin, ChevronRight, Compass, Search, Sparkles } from 'lucide-react';

export const DomesticDestinations: React.FC = () => {
  const { domesticStates, packages } = useData();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const filteredStates = domesticStates
    .filter(st => st.packageCount > 0)
    .filter(st => {
      const term = searchTerm.toLowerCase();
      const matchName = st.name.toLowerCase().includes(term);
      const matchRegion = st.regions.some(r => r.name.toLowerCase().includes(term));
      const matchDesc = st.description.toLowerCase().includes(term);
      return matchName || matchRegion || matchDesc;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#00AEEF]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Domestic Packages</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00AEEF]">
              Explore Incredible India
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Domestic States & Regions
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Choose a state to explore curated sub-regions, hill stations, beaches, and luxury tour packages.
            </p>
          </div>

          {/* Search filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search State or Region (e.g. Gulmarg, Goa)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#00AEEF] shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* States Hierarchy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStates.map(state => {
          const statePackages = packages.filter(p => p.parentSlug === state.slug);
          return (
            <div
              key={state.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={state.image}
                  alt={state.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackTitle={state.name}
                  category="Domestic State"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                  {statePackages.length || state.packageCount} Packages Available
                </span>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold text-[#FDB813] block">
                    {state.tag}
                  </span>
                  <h2 className="text-2xl font-extrabold">{state.name}</h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {state.description}
                </p>

                {/* Sub Regions inside state */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Featured Destinations in {state.name}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {state.regions.map((reg, idx) => (
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
                    to={`/domestic/${state.slug}`}
                    className="w-full bg-slate-900 hover:bg-[#00AEEF] text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <span>View All {state.name} Packages</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Compass className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No states matching "{searchTerm}"</h3>
          <p className="text-xs text-slate-500">Try searching for Kashmir, Goa, Kerala, Rajasthan, Ladakh, etc.</p>
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
