import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link2, Check, X, Globe, MapPin, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

interface GalleryPreset {
  id: string;
  url: string;
  title: string;
  category: 'domestic' | 'international' | 'scenic';
  location: string;
}

const GALLERY_PRESETS: GalleryPreset[] = [
  // Domestic
  {
    id: 'kashmir-houseboat',
    url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    title: 'Kashmir Houseboat',
    category: 'domestic',
    location: 'Srinagar'
  },
  {
    id: 'kashmir-mountains',
    url: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
    title: 'Kashmir Valley',
    category: 'domestic',
    location: 'Gulmarg'
  },
  {
    id: 'kerala-backwaters',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    title: 'Kerala Backwaters',
    category: 'domestic',
    location: 'Alleppey'
  },
  {
    id: 'goa-beach',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    title: 'Sunny Goa Beach',
    category: 'domestic',
    location: 'Goa'
  },
  {
    id: 'taj-mahal',
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    title: 'Taj Mahal',
    category: 'domestic',
    location: 'Agra'
  },
  {
    id: 'ladakh-mountains',
    url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    title: 'Ladakh High Passes',
    category: 'domestic',
    location: 'Leh Ladakh'
  },
  {
    id: 'himachal-snow',
    url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    title: 'Snowy Solang Valley',
    category: 'domestic',
    location: 'Manali'
  },
  {
    id: 'rajasthan-fort',
    url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    title: 'Hawa Mahal Palace',
    category: 'domestic',
    location: 'Jaipur'
  },

  // International
  {
    id: 'bali-temple',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    title: 'Ulun Danu Bratan',
    category: 'international',
    location: 'Bali, Indonesia'
  },
  {
    id: 'singapore-skyline',
    url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    title: 'Marina Bay Sands',
    category: 'international',
    location: 'Singapore'
  },
  {
    id: 'dubai-burj',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    title: 'Burj Khalifa Tower',
    category: 'international',
    location: 'Dubai, UAE'
  },
  {
    id: 'maldives-overwater',
    url: 'https://images.unsplash.com/photo-1506665531195-3566af294817?auto=format&fit=crop&w=800&q=80',
    title: 'Luxury Water Villas',
    category: 'international',
    location: 'Maldives'
  },
  {
    id: 'paris-eiffel',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    title: 'Eiffel Tower',
    category: 'international',
    location: 'Paris, France'
  },
  {
    id: 'swiss-alps',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Zermatt Alps',
    category: 'international',
    location: 'Switzerland'
  },
  {
    id: 'thailand-beach',
    url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
    title: 'Phi Phi Islands',
    category: 'international',
    location: 'Phuket, Thailand'
  },

  // Scenic / Luxury
  {
    id: 'airplane-wing',
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    title: 'Flight in the Clouds',
    category: 'scenic',
    location: 'In Transit'
  },
  {
    id: 'cruise-ocean',
    url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
    title: 'Cruise Luxury Ship',
    category: 'scenic',
    location: 'Ocean Cruise'
  },
  {
    id: 'resort-pool',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    title: 'Infinite Resort Pool',
    category: 'scenic',
    location: 'Luxury Resort'
  },
  {
    id: 'travel- luggage',
    url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    title: 'Explorer Packing',
    category: 'scenic',
    location: 'Departure'
  }
];

const compressImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  value,
  onChange,
  label = 'Selected Image',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [presetCategory, setPresetCategory] = useState<'all' | 'domestic' | 'international' | 'scenic'>('all');
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setErrorMsg('');
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file.');
      return;
    }
    
    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        compressImage(e.target.result)
          .then((compressed) => {
            onChange(compressed);
          })
          .catch(() => {
            onChange(e.target!.result as string);
          });
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read the file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const filteredPresets = presetCategory === 'all'
    ? GALLERY_PRESETS
    : GALLERY_PRESETS.filter(item => item.category === presetCategory);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <label className="font-bold text-slate-700 block text-xs">{label}</label>}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 border border-slate-200 bg-white rounded-2xl p-4 shadow-sm">
        {/* Left Column: Image Preview Area */}
        <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Preview</span>
            <div className="relative aspect-video lg:aspect-square bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center group shadow-inner">
              {value ? (
                <>
                  <img
                    src={value}
                    alt="Preview"
                    
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onChange('')}
                      className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-[11px] text-slate-400">No Image Selected</p>
                </div>
              )}
            </div>
          </div>

          {value && (
            <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Image Source</span>
              <p className="text-[10px] text-slate-600 break-all truncate select-all font-mono">
                {value.startsWith('data:') ? 'Local Base64 File' : value}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Upload/Choose Options */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Navigation Tab Header */}
          <div className="flex border-b border-slate-100 mb-3 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-1.5 px-3.5 py-2 font-bold transition-all relative border-b-2 -mb-[1px] cursor-pointer ${
                activeTab === 'upload' ? 'border-[#00AEEF] text-[#00AEEF]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Local File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`flex items-center gap-1.5 px-3.5 py-2 font-bold transition-all relative border-b-2 -mb-[1px] cursor-pointer ${
                activeTab === 'preset' ? 'border-[#00AEEF] text-[#00AEEF]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Preset Travel Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-1.5 px-3.5 py-2 font-bold transition-all relative border-b-2 -mb-[1px] cursor-pointer ${
                activeTab === 'url' ? 'border-[#00AEEF] text-[#00AEEF]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Custom URL Link</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 flex flex-col justify-center min-h-[160px]">
            {activeTab === 'upload' && (
              <div className="space-y-2">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-[#00AEEF] bg-[#00AEEF]/5 scale-[0.99]'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-[#00AEEF] mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-bold text-slate-700">Drag & drop your image here, or <span className="text-[#00AEEF] hover:underline">browse files</span></p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, WEBP, GIF up to 5MB</p>
                </div>
                {errorMsg && (
                  <p className="text-[11px] text-rose-500 font-semibold">{errorMsg}</p>
                )}
              </div>
            )}

            {activeTab === 'preset' && (
              <div className="space-y-3">
                {/* Category selectors */}
                <div className="flex gap-1.5 text-[10px] bg-slate-100 p-1 rounded-lg w-max">
                  {(['all', 'domestic', 'international', 'scenic'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPresetCategory(cat)}
                      className={`px-2.5 py-1 rounded-md font-bold capitalize cursor-pointer transition-all ${
                        presetCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid of presets */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[180px] overflow-y-auto pr-1">
                  {filteredPresets.map((preset) => {
                    const isSelected = value === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          onChange(preset.url);
                          setErrorMsg('');
                        }}
                        className={`relative aspect-video rounded-lg overflow-hidden border text-left group cursor-pointer ${
                          isSelected ? 'border-2 border-[#00AEEF] ring-2 ring-sky-100' : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                          <p className="text-[8px] text-white font-bold truncate">{preset.title}</p>
                          <div className="flex items-center gap-0.5 text-[7px] text-slate-300">
                            <MapPin className="w-2 h-2 text-[#FDB813]" />
                            <span className="truncate">{preset.location}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#00AEEF] flex items-center justify-center shadow-sm">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-2">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Paste online image address URL (e.g. https://images.unsplash.com/...)"
                      value={value.startsWith('data:') ? '' : value}
                      onChange={(e) => {
                        onChange(e.target.value.trim());
                        setErrorMsg('');
                      }}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00AEEF] transition-colors bg-slate-50/50"
                    />
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Paste any live web URL. Ensure it starts with <code className="bg-slate-100 p-0.5 rounded text-slate-600">http://</code> or <code className="bg-slate-100 p-0.5 rounded text-slate-600">https://</code>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
