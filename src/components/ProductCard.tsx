import React from 'react';
import { Star, Sparkles, Heart } from 'lucide-react';
import type { Product } from '../types/bakery';
import { CakeFallbackImage } from './CakeFallbackImage';

interface ProductCardProps {
  product: Product;
  onOpenProduct: (product: Product) => void;
  onCustomize: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenProduct,
  onCustomize,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  return (
    <div className="group bg-[#1a1a1c] border border-[rgba(240,240,240,0.1)] hover:border-[#d48b7a]/70 flex flex-col transition-all duration-300 relative overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111113]">
        <button
          onClick={() => onOpenProduct(product)}
          className="w-full h-full block focus:outline-none"
        >
          <CakeFallbackImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
        </button>

        {/* Status indicator (Zero-Pill Discipline: clean architectural tag) */}
        {product.isBestseller && (
          <div className="absolute top-3 left-3 bg-[#111113]/90 text-[#d48b7a] border border-[#d48b7a]/40 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1">
            Bestseller
          </div>
        )}
        {!product.isBestseller && product.isSpecial && (
          <div className="absolute top-3 left-3 bg-[#111113]/90 text-[#f0f0f0] border border-[rgba(240,240,240,0.2)] font-mono text-[9px] uppercase tracking-widest px-2.5 py-1">
            Chef’s Reserve
          </div>
        )}

        {/* Wishlist toggle */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 w-8 h-8 bg-[#111113]/80 hover:bg-[#111113] border border-[rgba(240,240,240,0.15)] flex items-center justify-center text-[#f0f0f0] hover:text-[#d48b7a] transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-[#d48b7a] text-[#d48b7a]' : 'text-[#f0f0f0]'
              }`}
            />
          </button>
        )}

        {/* Quick view hover bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#111113] via-[#111113]/90 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex justify-center">
          <button
            onClick={() => onOpenProduct(product)}
            className="font-mono text-[10px] text-[#d48b7a] hover:text-white uppercase tracking-wider transition-colors"
          >
            Inspect Recipe & Reviews →
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#f0f0f0]/60 mb-1.5">
            <span>{product.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{product.supportedWeights[0]}</span>
            {product.supportsEggless && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">Eggless</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenProduct(product)}
            className="font-syne font-bold text-base uppercase text-[#f0f0f0] line-clamp-1 hover:text-[#d48b7a] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-[#f0f0f0]/70 line-clamp-2 mt-1.5 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 mt-3 border-t border-[rgba(240,240,240,0.1)] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#f0f0f0]/60">
              <Star className="w-3.5 h-3.5 fill-[#d48b7a] text-[#d48b7a]" />
              <span className="font-bold text-[#f0f0f0] tabular-nums">{product.rating}</span>
              <span className="text-[10px]">({product.reviewCount})</span>
            </div>
            <div className="font-syne font-extrabold text-xl text-[#d48b7a] tabular-nums mt-0.5">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onCustomize(product)}
            className="px-4 py-2 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 whitespace-nowrap group/btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#111113]" />
            <span>Customize</span>
          </button>
        </div>
      </div>
    </div>
  );
};

