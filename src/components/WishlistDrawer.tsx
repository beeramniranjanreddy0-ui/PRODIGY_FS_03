import React from 'react';
import { X, Heart, Sparkles, Trash2 } from 'lucide-react';
import type { Product } from '../types/bakery';
import { CakeFallbackImage } from './CakeFallbackImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onCustomize,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111113] text-[#f0f0f0] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[rgba(240,240,240,0.15)]">
        {/* Header */}
        <div className="p-5 border-b border-[rgba(240,240,240,0.1)] bg-[#161618] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1a1a1c] border border-[rgba(240,240,240,0.15)] flex items-center justify-center text-[#d48b7a]">
              <Heart className="w-4 h-4 fill-[#d48b7a]" />
            </div>
            <div>
              <h2 className="font-syne font-extrabold text-lg uppercase text-[#f0f0f0]">Saved Celebrations</h2>
              <span className="font-mono text-xs text-[#f0f0f0]/60 uppercase tabular-nums">
                {wishlist.length} {wishlist.length === 1 ? 'recipe saved' : 'recipes saved'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#f0f0f0]/70 hover:text-white hover:bg-[#1a1a1c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Heart className="w-12 h-12 text-[#d48b7a] opacity-30 mx-auto" />
              <h3 className="font-syne font-extrabold text-lg uppercase text-[#f0f0f0]">Your saved list is empty</h3>
              <p className="font-mono text-xs uppercase text-[#f0f0f0]/50">
                Click the heart on any cake card to bookmark it for upcoming birthdays and gatherings.
              </p>
            </div>
          ) : (
            wishlist.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#1a1a1c] p-4 border border-[rgba(240,240,240,0.1)] flex gap-4 items-center"
              >
                <div className="w-16 h-16 overflow-hidden bg-[#111113] shrink-0 border border-[rgba(240,240,240,0.1)]">
                  <CakeFallbackImage src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 font-mono text-xs">
                  <h4 className="font-syne font-bold uppercase text-[#f0f0f0] line-clamp-1">{prod.name}</h4>
                  <p className="text-[10px] text-[#f0f0f0]/50 uppercase">{prod.categoryName}</p>
                  <p className="font-syne font-bold text-sm text-[#d48b7a] tabular-nums mt-0.5">
                    ₹{prod.basePrice.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onCustomize(prod);
                    }}
                    className="p-2 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] transition-colors"
                    title="Customize & Order"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(prod)}
                    className="p-2 text-[#f0f0f0]/50 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
