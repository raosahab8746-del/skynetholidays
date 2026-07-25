import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { X, MapPin, Sparkles, ZoomIn } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useData();

  const categories = ['All', 'Nature', 'Adventure', 'Beach', 'Wildlife', 'Culture', 'International', 'Domestic'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);

  const filteredGallery = gallery.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-[#00AEEF]">
          Visual Journeys
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          SkyNet Holidays Photo Gallery
        </h1>
        <p className="text-xs text-slate-500">
          Glimpse through breathtaking landscapes, luxury resorts, and memorable guest moments.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#00AEEF] text-white shadow-md shadow-sky-500/20 scale-105'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredGallery.map(item => (
          <div
            key={item.id}
            onClick={() => setLightboxImage(item)}
            className="break-inside-avoid relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 group cursor-pointer bg-slate-900"
          >
            <ImageWithFallback
              src={item.image}
              alt={item.title}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              fallbackTitle={item.title}
              category={item.category}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold text-[#FDB813] uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="font-bold text-base">{item.title}</h3>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#00AEEF]" /> {item.location}
              </p>
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/70 p-2 rounded-full text-white">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              <ImageWithFallback
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto object-contain"
                fallbackTitle={lightboxImage.title}
                category={lightboxImage.category}
              />
            </div>
            <div className="p-6 text-white space-y-1">
              <span className="text-xs font-bold text-[#FDB813] uppercase">
                {lightboxImage.category}
              </span>
              <h2 className="text-2xl font-bold">{lightboxImage.title}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00AEEF]" /> {lightboxImage.location}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
