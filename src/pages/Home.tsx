import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import {
  Search,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  Star,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Compass,
  ArrowRight,
  ChevronLeft,
  Tag,
  PhoneCall,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeProps {
  onOpenInquiry: (dest?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenInquiry }) => {
  const {
    heroSlides,
    domesticStates,
    internationalCountries,
    packages,
    testimonials,
    offers,
    blogs
  } = useData();

  const navigate = useNavigate();

  // Hero Slider Index
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Selected place for custom front wallpaper preview
  const [selectedPlaceWallpaper, setSelectedPlaceWallpaper] = useState<{
    id: string;
    name: string;
    type: string;
    image: string;
    tag: string;
    slug: string;
    packageCount: number;
  } | null>(null);

  // Combine all domestic and international places for front wallpaper display
  const allPlacesList = [
    ...domesticStates.map(s => ({
      id: s.id,
      name: s.name,
      type: 'Domestic',
      image: s.image || s.bannerImage,
      tag: s.tag,
      slug: `/domestic/${s.slug}`,
      packageCount: s.packageCount
    })),
    ...internationalCountries.map(c => ({
      id: c.id,
      name: c.name,
      type: 'International',
      image: c.image || c.bannerImage,
      tag: c.tag,
      slug: `/international/${c.slug}`,
      packageCount: c.packageCount
    }))
  ].filter(place => place.packageCount > 0);

  useEffect(() => {
    if (heroSlides.length <= 1 || selectedPlaceWallpaper) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length, selectedPlaceWallpaper]);

  // Search Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'domestic' | 'international' | 'weekend'>('all');
  const [searchBudget, setSearchBudget] = useState<string>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCategory === 'domestic') {
      navigate(`/domestic?search=${encodeURIComponent(searchQuery)}`);
    } else if (searchCategory === 'international') {
      navigate(`/international?search=${encodeURIComponent(searchQuery)}`);
    } else if (searchCategory === 'weekend') {
      navigate(`/weekend-trips`);
    } else {
      if (searchQuery) {
        navigate(`/domestic?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate('/domestic');
      }
    }
  };

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqsList = [
    {
      q: "How do I book a tour package with SkyNet Holidays?",
      a: "You can easily select any package on our website and click 'Book Now' or 'Get Quote'. Our luxury travel advisor will contact you immediately via WhatsApp or Call to customize your itinerary, confirm hotels, and issue your official travel voucher."
    },
    {
      q: "Are flights and airfare included in the package cost?",
      a: "Our packages can be customized either as land-only (transfers, hotels, sightseeing, meals) or inclusive of flights from your home city (Delhi, Jaipur, Mumbai, Kolkata, Bangalore, etc.) based on your preference."
    },
    {
      q: "Can I customize the day-wise itinerary according to my schedule?",
      a: "100% Yes! All SkyNet Holidays packages are fully tailor-made. You can add extra nights, upgrade to 5-star pool villas, include romantic candlelight dinners, or tweak sightseeing spots freely."
    },
    {
      q: "What payment options are available and is there an advance requirement?",
      a: "We accept UPI, Credit/Debit cards, Net Banking, and Bank transfers. You only pay a minimal deposit to lock your hotel reservations, and the balance is paid upon arrival or before travel!"
    }
  ];

  const featuredPackages = packages.filter(p => p.featured || p.trending).slice(0, 6);

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SLIDER SECTION (FRONT WALLPAPER) */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex flex-col justify-between overflow-hidden bg-slate-950">
        {/* Background Wallpaper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPlaceWallpaper ? `place-${selectedPlaceWallpaper.id}` : `slide-${currentSlideIndex}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <ImageWithFallback
              src={
                selectedPlaceWallpaper
                  ? selectedPlaceWallpaper.image
                  : heroSlides[currentSlideIndex]?.bgImage || ''
              }
              alt={selectedPlaceWallpaper ? selectedPlaceWallpaper.name : heroSlides[currentSlideIndex]?.title || 'SkyNet Holidays'}
              className="w-full h-full object-cover object-center"
              fallbackTitle={selectedPlaceWallpaper ? selectedPlaceWallpaper.name : heroSlides[currentSlideIndex]?.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/40" />
          </motion.div>
        </AnimatePresence>

        {/* Previous / Next Wallpaper Arrows */}
        <div className="absolute top-1/2 -translate-y-12 left-4 right-4 z-20 flex justify-between pointer-events-none">
          <button
            onClick={() => {
              setSelectedPlaceWallpaper(null);
              setCurrentSlideIndex(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1));
            }}
            className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-[#00AEEF] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all pointer-events-auto hover:scale-110 shadow-lg cursor-pointer"
            aria-label="Previous Wallpaper"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setSelectedPlaceWallpaper(null);
              setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length);
            }}
            className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-[#00AEEF] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all pointer-events-auto hover:scale-110 shadow-lg cursor-pointer"
            aria-label="Next Wallpaper"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-8 text-center text-white space-y-6">
          {selectedPlaceWallpaper ? (
            <motion.div
              key={`selected-${selectedPlaceWallpaper.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00AEEF] text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  Wallpaper Preview: {selectedPlaceWallpaper.name} ({selectedPlaceWallpaper.type})
                </span>
                <button
                  onClick={() => setSelectedPlaceWallpaper(null)}
                  className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md border border-white/30 transition-all"
                >
                  Reset Wallpaper
                </button>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight drop-shadow-md">
                Explore {selectedPlaceWallpaper.name} Holiday Packages
              </h1>

              <p className="text-sm md:text-base text-slate-200 max-w-2xl mx-auto font-light">
                {selectedPlaceWallpaper.tag} • Featuring {selectedPlaceWallpaper.packageCount} Tailor-Made Luxury Packages
              </p>

              <div className="pt-2">
                <Link
                  to={selectedPlaceWallpaper.slug}
                  className="inline-flex items-center gap-2 bg-[#00AEEF] hover:bg-sky-600 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-xl transition-all hover:scale-105"
                >
                  <span>Explore {selectedPlaceWallpaper.name} Packages</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ) : (
            heroSlides.length > 0 && (
              <motion.div
                key={`slide-text-${currentSlideIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-[#FDB813] shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  {heroSlides[currentSlideIndex].tag}
                </span>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight drop-shadow-md">
                  {heroSlides[currentSlideIndex].title}
                </h1>

                <p className="text-sm md:text-lg text-slate-200 max-w-2xl mx-auto font-light">
                  {heroSlides[currentSlideIndex].subtitle}
                </p>
              </motion.div>
            )
          )}

          {/* SEARCH BAR CARD */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 md:p-5 shadow-2xl text-slate-900 border border-white/30 text-left mt-6">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              {/* Destination Search */}
              <div className="md:col-span-1.5">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00AEEF]" /> Destination
                </label>
                <input
                  type="text"
                  placeholder="Where to? (e.g. Kashmir, Japan, Bali)"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#00AEEF] focus:bg-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#00AEEF]" /> Package Type
                </label>
                <select
                  value={searchCategory}
                  onChange={e => setSearchCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#00AEEF]"
                >
                  <option value="all">All Packages</option>
                  <option value="domestic">Domestic Packages</option>
                  <option value="international">International Packages</option>
                  <option value="weekend">Weekend Trips</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#FDB813]" /> Budget / Person
                </label>
                <select
                  value={searchBudget}
                  onChange={e => setSearchBudget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#00AEEF]"
                >
                  <option value="all">Any Budget</option>
                  <option value="20000">Under ₹20,000</option>
                  <option value="50000">₹20,000 - ₹50,000</option>
                  <option value="100000">₹50,000 - ₹1,000,000</option>
                </select>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00AEEF] to-sky-600 hover:from-sky-600 hover:to-[#00AEEF] text-white py-2.5 rounded-2xl font-bold text-sm shadow-md shadow-sky-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Packages</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* BOTTOM FRONT WALLPAPER PLACES GALLERY STRIP */}
        <div className="relative z-20 w-full bg-slate-950/85 backdrop-blur-xl border-t border-white/10 py-3.5 px-4 mt-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FDB813]" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-white">
                  Featured Added Places Gallery
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                  {allPlacesList.length} Places Added
                </span>
              </div>
            </div>

            {/* Places Thumbnail Cards Carousel */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-sky-500/40">
              {allPlacesList.map((place) => {
                const isSelected = selectedPlaceWallpaper?.id === place.id;
                return (
                  <button
                    key={place.id}
                    onClick={() => {
                      setSelectedPlaceWallpaper(place);
                    }}
                    className={`group flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#00AEEF] text-white border-[#00AEEF] shadow-lg shadow-sky-500/40 ring-2 ring-white/50 scale-105'
                        : 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-200 hover:border-sky-400/50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl overflow-hidden relative shrink-0 border border-white/30 shadow-sm">
                      <ImageWithFallback
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        fallbackTitle={place.name}
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold leading-tight flex items-center gap-1">
                        <span>{place.name}</span>
                      </div>
                      <div className="text-[9px] opacity-80 font-medium">
                        {place.type} • {place.packageCount} Packages
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SPECIAL OFFERS BANNER */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map(off => (
              <div
                key={off.id}
                className="relative rounded-3xl overflow-hidden shadow-md bg-slate-900 text-white p-6 md:p-8 flex flex-col justify-between border border-sky-500/20 group"
              >
                <div className="absolute inset-0 z-0 opacity-40 group-hover:scale-105 transition-transform duration-500">
                  <ImageWithFallback
                    src={off.bgImage}
                    alt={off.title}
                    className="w-full h-full object-cover"
                    fallbackTitle={off.title}
                  />
                  <div className="absolute inset-0 bg-slate-950/70" />
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="inline-block bg-[#FDB813] text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {off.discountText}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold">{off.title}</h3>
                  <p className="text-xs text-slate-200">{off.subtitle}</p>
                </div>

                <div className="relative z-10 pt-6 flex items-center justify-between border-t border-white/10 mt-4">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Promo Code</span>
                    <span className="font-mono font-bold text-sm text-[#00AEEF] bg-slate-800/80 px-2.5 py-1 rounded-lg border border-sky-500/30">
                      {off.code}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenInquiry(`Promo Code: ${off.code}`)}
                    className="bg-[#00AEEF] hover:bg-sky-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Claim Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DOMESTIC PACKAGES HIERARCHY (STATES) */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#00AEEF] font-bold text-xs uppercase tracking-widest">
              <Compass className="w-4 h-4" />
              <span>Domestic Travel Hierarchy</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              Explore India State by State
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a state to view sub-regions and handpicked luxury tour itineraries.
            </p>
          </div>

          <Link
            to="/domestic"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00AEEF] hover:text-sky-700 group shrink-0"
          >
            <span>View All {domesticStates.filter(s => s.packageCount > 0).length} Domestic States</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {domesticStates.filter(state => state.packageCount > 0).map(state => (
            <Link
              key={state.id}
              to={`/domestic/${state.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
            >
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={state.image}
                  alt={state.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  fallbackTitle={state.name}
                  category="Domestic State"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                
                <span className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  {state.packageCount} Packages
                </span>

                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <h3 className="font-bold text-base leading-tight group-hover:text-[#00AEEF] transition-colors">
                    {state.name}
                  </h3>
                  <span className="text-[10px] text-[#FDB813] block font-medium">
                    {state.tag}
                  </span>
                </div>
              </div>

              <div className="p-3 text-xs text-slate-600 space-y-1.5 flex-1 flex flex-col justify-between">
                <div className="flex flex-wrap gap-1">
                  {state.regions.slice(0, 3).map((reg, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-50 text-[#00AEEF] text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {reg.name}
                    </span>
                  ))}
                  {state.regions.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-medium">+{state.regions.length - 3} more</span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#00AEEF] group-hover:underline">
                  <span>Explore Packages</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INTERNATIONAL PACKAGES HIERARCHY (COUNTRIES) */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#00AEEF] font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#FDB813]" />
              <span>International Luxury Holidays</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              Top Global Destinations
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose your dream international country to view cities, resorts, and tour details.
            </p>
          </div>

          <Link
            to="/international"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00AEEF] hover:text-sky-700 group shrink-0"
          >
            <span>View All {internationalCountries.filter(c => c.packageCount > 0).length} Countries</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {internationalCountries.filter(country => country.packageCount > 0).map(country => (
            <Link
              key={country.id}
              to={`/international/${country.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={country.image}
                  alt={country.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  fallbackTitle={country.name}
                  category="International"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />

                <span className="absolute top-2 right-2 bg-sky-500/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">
                  {country.packageCount} Tours
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-[#00AEEF] transition-colors">
                    {country.name}
                  </h3>
                  <span className="text-[11px] text-[#FDB813] block font-medium">
                    {country.tag}
                  </span>
                </div>
              </div>

              <div className="p-3 text-xs text-slate-600 space-y-2 flex-1 flex flex-col justify-between">
                <p className="line-clamp-2 text-[11px] text-slate-500">{country.description}</p>
                <div className="flex flex-wrap gap-1">
                  {country.regions.map((reg, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded">
                      {reg.name}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#00AEEF] group-hover:underline">
                  <span>Browse {country.name} Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED TOUR PACKAGES GRID */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#00AEEF] bg-sky-50 px-3 py-1 rounded-full">
            Handpicked Itineraries
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Featured Tour Packages
          </h2>
          <p className="text-xs text-slate-500">
            Most loved domestic and international holiday experiences with 5-star traveler reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPackages.map(pkg => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
            >
              {/* Cover Image */}
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={pkg.coverImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackTitle={pkg.title}
                  category={pkg.parentName}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#00AEEF] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-md">
                    {pkg.type}
                  </span>
                  {pkg.discountPercent > 0 && (
                    <span className="bg-[#FDB813] text-slate-900 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-md">
                      {pkg.discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#FDB813]" />
                    <span>{pkg.duration}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-slate-900/60 px-2 py-0.5 rounded-full backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{pkg.rating} ({pkg.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-[#00AEEF] uppercase tracking-wider block">
                    {pkg.parentName} • {pkg.regionName}
                  </span>
                  <Link
                    to={`/package/${pkg.slug}`}
                    className="font-bold text-slate-900 text-base line-clamp-2 hover:text-[#00AEEF] transition-colors"
                  >
                    {pkg.title}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2">{pkg.description}</p>
                </div>

                {/* Highlights list */}
                <ul className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {pkg.highlights.slice(0, 3).map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{hl}</span>
                    </li>
                  ))}
                </ul>

                {/* Pricing & CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Starting from</span>
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
                      Details
                    </Link>
                    <button
                      onClick={() => onOpenInquiry(`Package: ${pkg.title}`)}
                      className="bg-[#00AEEF] hover:bg-sky-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE SKYNET HOLIDAYS */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#FDB813]">
              The SkyNet Privilege
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold">Why Choose SkyNet Holidays</h2>
            <p className="text-xs md:text-sm text-slate-300">
              We go above and beyond standard tour operators to deliver bespoke luxury journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">100% Tailor-Made</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customized day-by-day itineraries matching your exact schedule, hotel category, and travel style.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FDB813]/20 text-[#FDB813] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Verified Stays</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Only top-rated 4-star & 5-star luxury hotels, private pool villas, and heritage houseboats.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">24/7 Personal Concierge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A dedicated tour manager available round-the-clock on WhatsApp to assist you throughout your journey.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Best Price Guarantee</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct B2B rates with top resorts and transport providers ensuring zero hidden costs and maximum value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#00AEEF]">
              Traveler Stories
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              What Our Guests Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">"{t.comment}"</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.location}</p>
                  </div>
                  <span className="text-[10px] bg-sky-50 text-[#00AEEF] font-semibold px-2 py-1 rounded-full">
                    {t.packageName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LATEST BLOGS PREVIEW */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#00AEEF]">
                Travel Inspiration
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Latest Blogs & Guides</h2>
            </div>
            <Link
              to="/blogs"
              className="text-xs font-bold text-[#00AEEF] hover:underline flex items-center gap-1"
            >
              <span>View All Blogs</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map(b => (
              <div key={b.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group">
                <div className="h-44 overflow-hidden relative">
                  <ImageWithFallback
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackTitle={b.title}
                    category={b.category}
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] px-2.5 py-1 rounded-full font-bold">
                    {b.category}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{b.date}</span>
                    <span>•</span>
                    <span>{b.readTime}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-2 hover:text-[#00AEEF] transition-colors">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">{b.excerpt}</p>

                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#00AEEF] hover:underline pt-2"
                  >
                    <span>Read Full Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#00AEEF]">Help & Support</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqsList.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-slate-800 flex items-center justify-between gap-4 hover:text-[#00AEEF]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openFaqIndex === idx ? 'rotate-180 text-[#00AEEF]' : ''
                  }`}
                />
              </button>

              {openFaqIndex === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
