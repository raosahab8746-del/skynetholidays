import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Phone, Mail, Instagram, MapPin, Menu, X, Sparkles, ChevronDown, MessageSquare } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenInquiry: (destination?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInquiry }) => {
  const { companyInfo, domesticStates, internationalCountries } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-[#00AEEF]">
      {/* Top Black Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left info: Phone, Email, Address */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${companyInfo.phone}`}
              className="flex items-center gap-1.5 hover:text-sky-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#00AEEF]" />
              <span>{companyInfo.phone}</span>
            </a>
            <a
              href={`mailto:${companyInfo.email}`}
              className="flex items-center gap-1.5 hover:text-sky-300 transition-colors hidden sm:flex"
            >
              <Mail className="w-3.5 h-3.5 text-[#00AEEF]" />
              <span>{companyInfo.email}</span>
            </a>
            {/* Address - NO GOOGLE MAPS LINK as explicitly required */}
            <div className="flex items-center gap-1.5 text-slate-400 hidden md:flex">
              <MapPin className="w-3.5 h-3.5 text-[#FDB813]" />
              <span>{companyInfo.address}</span>
            </div>
          </div>

          {/* Right info: Instagram */}
          <div className="flex items-center gap-4">
            <a
              href={companyInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors font-medium"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@skynetholidays_</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-[#00AEEF]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo showTagline={true} variant="light" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Home Link */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname === '/'
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>

            {/* Domestic Packages Dropdown */}
            <div className="relative group py-2">
              <Link
                to="/domestic"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/domestic')
                    ? 'text-white bg-white/20'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Domestic Packages</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-slate-100 max-h-96 overflow-y-auto scrollbar-thin">
                {domesticStates.filter(state => state.packageCount > 0).map(state => (
                  <Link
                    key={state.slug}
                    to={`/domestic/${state.slug}`}
                    className="block px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#00AEEF] hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-none"
                  >
                    {state.name === 'Gujarat' ? 'Rann of Kutch' : state.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* International Packages Dropdown */}
            <div className="relative group py-2">
              <Link
                to="/international"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/international')
                    ? 'text-white bg-white/20'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>International Packages</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-slate-100 max-h-96 overflow-y-auto scrollbar-thin">
                {internationalCountries.filter(country => country.packageCount > 0).map(country => (
                  <Link
                    key={country.slug}
                    to={`/international/${country.slug}`}
                    className="block px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#00AEEF] hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-none"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Weekend Trips */}
            <Link
              to="/weekend-trips"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/weekend-trips')
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Weekend Trips
            </Link>

            {/* Gallery */}
            <Link
              to="/gallery"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/gallery')
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Gallery
            </Link>

            {/* Blogs */}
            <Link
              to="/blogs"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/blogs')
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Blogs
            </Link>

            {/* About Us */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/about')
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              About Us
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/contact')
                  ? 'text-white bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry()}
              className="hidden sm:flex items-center gap-2 bg-white hover:bg-sky-50 text-[#00AEEF] px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#00AEEF]" />
              <span>Get Quote</span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#00AEEF] border-b border-sky-400/30 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin">
          <div className="flex flex-col space-y-1 pt-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                location.pathname === '/' ? 'text-white bg-white/20' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Home
            </Link>

            {/* Mobile Domestic Expandable */}
            <div className="space-y-1">
              <div className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white/90 flex justify-between items-center bg-white/5">
                <span>Domestic Packages</span>
              </div>
              <div className="pl-6 flex flex-col space-y-1 border-l border-white/20 py-1">
                {domesticStates.filter(state => state.packageCount > 0).map(state => (
                  <Link
                    key={state.slug}
                    to={`/domestic/${state.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    {state.name === 'Gujarat' ? 'Rann of Kutch' : state.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile International Expandable */}
            <div className="space-y-1 mt-2">
              <div className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white/90 flex justify-between items-center bg-white/5">
                <span>International Packages</span>
              </div>
              <div className="pl-6 flex flex-col space-y-1 border-l border-white/20 py-1">
                {internationalCountries.filter(country => country.packageCount > 0).map(country => (
                  <Link
                    key={country.slug}
                    to={`/international/${country.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/weekend-trips"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/weekend-trips') ? 'text-white bg-white/20' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Weekend Trips
            </Link>

            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/gallery') ? 'text-white bg-white/20' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Gallery
            </Link>

            <Link
              to="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/blogs') ? 'text-white bg-white/20' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Blogs
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/about') ? 'text-white bg-white/20' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                location.pathname.startsWith('/contact') ? 'text-white bg-white/20' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="pt-4 border-t border-sky-400/30 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#00AEEF] py-3 rounded-xl font-bold shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#FDB813]" />
              <span>Get Instant Quote</span>
            </button>
            
            <div className="text-xs text-white/80 px-2 space-y-1">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white" /> {companyInfo.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-white" /> {companyInfo.address}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
