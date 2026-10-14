import React, { useState } from 'react';
import { Cake } from 'lucide-react';

interface CakeFallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '4:3' | '16:9' | '1:1';
}

export const CakeFallbackImage: React.FC<CakeFallbackImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = '4:3',
}) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#F4EBE1] ${className}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}

      {(hasError || !loaded) && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FDF9F3] to-[#EFE2D3] text-[#4A2818] ${
            hasError ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E2D2C2] flex items-center justify-center shadow-sm mb-2 text-[#966147]">
            <Cake className="w-6 h-6" />
          </div>
          <span className="text-xs font-serif text-[#785949] text-center line-clamp-1">
            {alt || "Artisanal Cake"}
          </span>
          <span className="text-[10px] text-[#A68878] uppercase tracking-wider mt-0.5">
            The Baker's Corner
          </span>
        </div>
      )}
    </div>
  );
};
