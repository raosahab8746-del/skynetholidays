import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  category?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  category,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-slate-800 via-sky-900 to-slate-900 flex flex-col items-center justify-center text-white p-4 text-center select-none ${className}`}
      >
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00AEEF_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center mb-2 text-[#00AEEF]">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#FDB813] font-semibold mb-1">
            {category || 'SkyNet Holidays'}
          </span>
          <h4 className="font-medium text-sm text-slate-100 max-w-[85%] truncate">
            {fallbackTitle || alt || 'Luxury Destination'}
          </h4>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
