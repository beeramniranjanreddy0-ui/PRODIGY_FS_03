import React, { useState } from 'react';
import { X, Star, Sparkles, ShoppingBag, ShieldCheck, Clock, Heart, MessageSquare } from 'lucide-react';
import type { Product, CakeCustomization, DeliverySlot } from '../types/bakery';
import { CakeFallbackImage } from './CakeFallbackImage';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  allProducts: Product[];
  deliverySlots: DeliverySlot[];
  onOpenCustomizer: (product: Product, initialCustom?: Partial<CakeCustomization>) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCartDirect: (productId: string, quantity: number, customization: CakeCustomization) => void;
  onAddReview: (productId: string, review: { userName: string; rating: number; comment: string }) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  allProducts,
  deliverySlots,
  onOpenCustomizer,
  onSelectProduct,
  onAddToCartDirect,
  onAddReview,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!isOpen || !product) return null;

  const [selectedWeight, setSelectedWeight] = useState<string>(product.supportedWeights[0] || '0.5 kg');
  const [selectedFlavour, setSelectedFlavour] = useState<string>(product.supportedFlavours[0] || 'Chocolate');
  const [isEggless, setIsEggless] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.image);

  // Review submission state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const getWeightMultiplier = (weight: string) => {
    if (weight.includes('0.5')) return 1.0;
    if (weight.includes('1')) return 1.8;
    if (weight.includes('2')) return 3.4;
    if (weight.includes('3')) return 4.8;
    return 1.0;
  };

  const calculatedUnitPrice = Math.round(product.basePrice * getWeightMultiplier(selectedWeight));
  const calculatedTotal = calculatedUnitPrice * quantity;

  // Filter related cakes
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) return;
    onAddReview(product.id, {
      userName: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment,
    });
    setReviewerName('');
    setReviewerComment('');
    setShowReviewForm(false);
  };

  const handleQuickAdd = (isBuyNow = false) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const defaultCustom: CakeCustomization = {
      occasion: 'Birthday',
      weight: selectedWeight,
      flavour: selectedFlavour,
      isEggless,
      hasMessage: true,
      cakeMessage: 'Best Wishes!',
      deliveryDate: dateStr,
      deliveryTimeSlot: deliverySlots[0]?.label || 'Morning Express (09:00 AM - 12:00 PM)',
    };

    if (isBuyNow) {
      onOpenCustomizer(product, defaultCustom);
    } else {
      onAddToCartDirect(product.id, quantity, defaultCustom);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#111113] text-[#f0f0f0] max-w-5xl w-full overflow-hidden shadow-2xl border border-[rgba(240,240,240,0.15)] my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[rgba(240,240,240,0.1)] flex items-center justify-between bg-[#161618] shrink-0">
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#d48b7a]">
            <span>Spec Sheet</span>
            <span aria-hidden="true" className="text-[#f0f0f0]/40">/</span>
            <span className="text-[#f0f0f0]/80">{product.categoryName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#f0f0f0]/70 hover:text-white hover:bg-[#1a1a1c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8 flex-1">
          {/* Main 2-Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Left */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-[4/3] overflow-hidden bg-[#161618] border border-[rgba(240,240,240,0.1)] relative">
                <CakeFallbackImage src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                {onToggleWishlist && (
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className="absolute top-4 right-4 w-9 h-9 bg-[#111113]/80 hover:bg-[#111113] border border-[rgba(240,240,240,0.2)] flex items-center justify-center text-[#f0f0f0] hover:text-[#d48b7a] transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#d48b7a] text-[#d48b7a]' : ''}`} />
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              {product.galleryImages && product.galleryImages.length > 1 && (
                <div className="flex gap-3">
                  {product.galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-18 h-18 overflow-hidden border transition-all ${
                        activeImage === img ? 'border-[#d48b7a]' : 'border-[rgba(240,240,240,0.15)] opacity-60'
                      }`}
                    >
                      <CakeFallbackImage src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Baker Guarantee */}
              <div className="bg-[#1a1a1c] p-4 border border-[rgba(240,240,240,0.1)] grid grid-cols-2 gap-3 font-mono text-xs text-[#f0f0f0]/70 uppercase">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#d48b7a]" />
                  <span>Baked Same-Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d48b7a]" />
                  <span>3-Hour Dispatch</span>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module Right */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#f0f0f0]/60 uppercase mb-2">
                  <div className="flex items-center gap-1 text-[#d48b7a]">
                    <Star className="w-4 h-4 fill-[#d48b7a] text-[#d48b7a]" />
                    <span className="font-bold text-[#f0f0f0] tabular-nums">{product.rating}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <span>{product.reviewCount} reviews</span>
                  <span aria-hidden="true">·</span>
                  <span className={product.stock > 0 ? 'text-emerald-400 font-medium' : 'text-red-400'}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>

                <h1 className="font-syne font-extrabold text-2xl sm:text-3xl uppercase text-[#f0f0f0] tracking-tight">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-syne font-extrabold text-3xl text-[#d48b7a] tabular-nums">
                    ₹{calculatedUnitPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-xs text-[#f0f0f0]/60 uppercase">
                    for {selectedWeight} · Taxes included
                  </span>
                </div>
              </div>

              <p className="font-sans text-xs sm:text-sm text-[#f0f0f0]/70 leading-relaxed">
                {product.description}
              </p>

              {/* Weight Options */}
              <div className="space-y-2">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a]">
                  Select Weight
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.supportedWeights.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border transition-all ${
                        selectedWeight === w
                          ? 'bg-[#d48b7a] text-[#111113] border-[#d48b7a]'
                          : 'bg-[#1a1a1c] text-[#f0f0f0] border-[rgba(240,240,240,0.15)] hover:border-[#d48b7a]'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavour Options */}
              <div className="space-y-2">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a]">
                  Select Flavour
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.supportedFlavours.map((flv) => (
                    <button
                      key={flv}
                      type="button"
                      onClick={() => setSelectedFlavour(flv)}
                      className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border transition-all ${
                        selectedFlavour === flv
                          ? 'bg-[#d48b7a] text-[#111113] border-[#d48b7a]'
                          : 'bg-[#1a1a1c] text-[#f0f0f0] border-[rgba(240,240,240,0.15)] hover:border-[#d48b7a]'
                      }`}
                    >
                      {flv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eggless Preference */}
              {product.supportsEggless && (
                <div className="flex items-center gap-3 bg-[#1a1a1c] p-3 border border-[rgba(240,240,240,0.15)]">
                  <input
                    type="checkbox"
                    id="egglessCheck"
                    checked={isEggless}
                    onChange={(e) => setIsEggless(e.target.checked)}
                    className="w-4 h-4 accent-[#d48b7a]"
                  />
                  <label htmlFor="egglessCheck" className="font-mono text-xs uppercase font-bold text-[#f0f0f0] cursor-pointer">
                    100% Eggless / Vegetarian (Pure dairy butter)
                  </label>
                </div>
              )}

              {/* Quantity Selector & CTAs */}
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold uppercase text-[#f0f0f0]/70">Qty:</span>
                  <div className="flex items-center border border-[rgba(240,240,240,0.2)] bg-[#1a1a1c] px-3 py-1 font-mono text-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center text-[#f0f0f0] font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-[#f0f0f0] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#f0f0f0] font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-mono text-xs text-[#f0f0f0]/70 uppercase tabular-nums">
                    Total: <strong className="text-[#d48b7a]">₹{calculatedTotal.toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onOpenCustomizer(product, { weight: selectedWeight, flavour: selectedFlavour, isEggless })}
                    className="flex-1 py-3.5 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#111113]" />
                    <span>Customize Occasion & Message</span>
                  </button>

                  <button
                    onClick={() => handleQuickAdd(false)}
                    className="py-3.5 px-6 bg-transparent border border-[#f0f0f0] hover:border-[#d48b7a] hover:text-[#d48b7a] text-[#f0f0f0] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-[#1a1a1c] p-6 sm:p-8 border border-[rgba(240,240,240,0.1)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(240,240,240,0.1)]">
              <div>
                <h3 className="font-syne text-xl font-bold uppercase text-[#f0f0f0]">Patron Reviews</h3>
                <p className="font-mono text-[11px] uppercase text-[#f0f0f0]/50 mt-0.5">
                  Verified feedback from celebratory orders
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="font-mono text-xs uppercase font-bold text-[#d48b7a] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Write Review</span>
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-[#111113] p-4 border border-[rgba(240,240,240,0.15)] space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase text-[#d48b7a]">Share Your Tasting Note</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] font-mono focus:outline-none focus:border-[#d48b7a]"
                  />
                  <select
                    value={reviewerRating}
                    onChange={(e) => setReviewerRating(Number(e.target.value))}
                    className="px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] font-mono focus:outline-none focus:border-[#d48b7a]"
                  >
                    <option value={5}>5 Stars - Pure Perfection</option>
                    <option value={4}>4 Stars - Delicious & Fresh</option>
                    <option value={3}>3 Stars - Good</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Tell us about the flavour balance, ganache texture, or delivery timing..."
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] font-sans focus:outline-none focus:border-[#d48b7a]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono text-xs uppercase font-bold tracking-wider"
                >
                  Publish Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-[rgba(240,240,240,0.1)] pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-syne font-bold text-xs uppercase text-[#f0f0f0]">{rev.userName}</span>
                      <span className="font-mono text-[10px] text-[#f0f0f0]/50 uppercase">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#d48b7a] mb-1">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-[#d48b7a] text-[#d48b7a]" />
                      ))}
                    </div>
                    <p className="font-sans text-xs text-[#f0f0f0]/70 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="font-mono text-xs text-[#f0f0f0]/50 uppercase">
                  No reviews recorded yet for this recipe.
                </p>
              )}
            </div>
          </div>

          {/* Related Cakes */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-syne text-lg font-bold uppercase text-[#f0f0f0]">
                Complementary Selections
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="cursor-pointer bg-[#1a1a1c] p-3 border border-[rgba(240,240,240,0.1)] hover:border-[#d48b7a] transition-all flex items-center gap-3"
                  >
                    <div className="w-16 h-16 overflow-hidden shrink-0 bg-[#111113]">
                      <CakeFallbackImage src={rel.image} alt={rel.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-syne font-bold text-xs uppercase text-[#f0f0f0] line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="font-mono text-xs font-bold text-[#d48b7a] mt-0.5 tabular-nums">
                        ₹{rel.basePrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
