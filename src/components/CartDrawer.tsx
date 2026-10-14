import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Tag, ArrowRight, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import type { CartItem } from '../types/bakery';
import { CakeFallbackImage } from './CakeFallbackImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onEditCustomization: (item: CartItem) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discountAmount,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onEditCustomization,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Delivery fee calculation
  const deliveryFee = subtotal >= 999 || subtotal === 0 ? 0 : 50;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.05);
  const grandTotal = taxableAmount + deliveryFee + taxAmount;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError(null);
    setIsApplying(true);
    try {
      const ok = await onApplyCoupon(couponInput.trim());
      if (ok) {
        setCouponInput('');
      } else {
        setCouponError('Invalid coupon code or minimum order value not reached.');
      }
    } catch (err: any) {
      setCouponError(err.message || 'Coupon could not be applied');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#111113] text-[#f0f0f0] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[rgba(240,240,240,0.15)]">
        {/* Header */}
        <div className="p-5 border-b border-[rgba(240,240,240,0.1)] bg-[#161618] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1a1a1c] border border-[rgba(240,240,240,0.15)] flex items-center justify-center text-[#d48b7a]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-syne font-extrabold text-lg uppercase text-[#f0f0f0]">Your Cake Bag</h2>
              <span className="font-mono text-xs text-[#f0f0f0]/60 uppercase tabular-nums">
                {items.length} {items.length === 1 ? 'item' : 'items'}
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

        {/* Free Delivery Bar */}
        {subtotal > 0 && (
          <div className="bg-[#1a1a1c] px-5 py-2.5 font-mono text-[11px] text-[#f0f0f0]/80 border-b border-[rgba(240,240,240,0.1)] flex items-center justify-between">
            {subtotal >= 999 ? (
              <span className="font-bold text-emerald-400">
                ✓ Unlocked Free Doorstep Delivery.
              </span>
            ) : (
              <span>
                Add <strong className="text-[#d48b7a]">₹{999 - subtotal}</strong> more for Free Delivery
              </span>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-[#1a1a1c] border border-[rgba(240,240,240,0.1)] flex items-center justify-center text-[#d48b7a]">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="font-syne font-extrabold text-xl uppercase text-[#f0f0f0]">Your bag is empty</h3>
              <p className="font-sans text-xs text-[#f0f0f0]/60 max-w-xs">
                Explore our handcrafted chocolate truffles, red velvet sponges, or design a custom cake!
              </p>
              <button
                onClick={onContinueShopping}
                className="px-6 py-2.5 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono text-xs uppercase font-bold tracking-wider transition-all"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a1a1c] p-4 border border-[rgba(240,240,240,0.1)] space-y-3"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 overflow-hidden bg-[#111113] shrink-0 border border-[rgba(240,240,240,0.1)]">
                    <CakeFallbackImage src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-syne font-bold text-sm uppercase text-[#f0f0f0] line-clamp-1">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        title="Remove item"
                        className="text-[#f0f0f0]/60 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customization Details */}
                    <div className="font-mono text-[10px] text-[#f0f0f0]/60 uppercase mt-1 space-y-0.5">
                      <p>
                        <span>Occasion:</span> <strong className="text-[#f0f0f0]">{item.customization.occasion}</strong> · {item.customization.weight}
                      </p>
                      <p>
                        <span>Flavour:</span> <strong className="text-[#f0f0f0]">{item.customization.flavour}</strong>
                        {item.customization.isEggless ? ' (Eggless)' : ' (Egg)'}
                      </p>

                      {/* Cake Message Indicator */}
                      <div className="flex items-start gap-1 pt-0.5 text-[#d48b7a]">
                        <MessageCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="font-bold">
                          {item.customization.hasMessage && item.customization.cakeMessage
                            ? `"${item.customization.cakeMessage}"`
                            : 'No message written'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtotal & Quantity Steppers */}
                <div className="pt-2 border-t border-[rgba(240,240,240,0.1)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditCustomization(item)}
                      className="font-mono text-[10px] text-[#d48b7a] font-bold hover:underline uppercase flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Edit Customization</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Steppers */}
                    <div className="flex items-center border border-[rgba(240,240,240,0.2)] bg-[#111113] px-2 py-0.5 font-mono text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-5 h-5 flex items-center justify-center text-[#f0f0f0] font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold text-[#f0f0f0] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#f0f0f0] font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-syne text-sm font-bold text-[#d48b7a] tabular-nums">
                        ₹{item.itemSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Billing & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[rgba(240,240,240,0.1)] bg-[#161618] space-y-4 shrink-0">
            {/* Coupon Section */}
            <div>
              {appliedCoupon ? (
                <div className="bg-[#111113] p-2.5 border border-[#d48b7a] flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2 text-[#d48b7a] font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon {appliedCoupon} (-₹{discountAmount})</span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-red-400 hover:underline uppercase font-bold text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#f0f0f0]/50 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Coupon code (SWEET10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] font-mono text-xs uppercase focus:outline-none focus:border-[#d48b7a] text-[#f0f0f0]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 bg-[#f0f0f0] text-[#111113] hover:bg-[#d48b7a] font-mono text-xs uppercase font-bold disabled:opacity-50 transition-all"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="font-mono text-[10px] text-red-400 mt-1 flex items-center gap-1 uppercase">
                  <AlertCircle className="w-3 h-3" />
                  {couponError}
                </p>
              )}
            </div>

            {/* Bill Breakdown */}
            <div className="space-y-1.5 font-mono text-xs text-[#f0f0f0]/70 border-t border-[rgba(240,240,240,0.1)] pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#f0f0f0] tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span className="font-bold tabular-nums">
                    -₹{discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span className="tabular-nums">
                  {deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="tabular-nums">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-[#f0f0f0] border-t border-[rgba(240,240,240,0.1)] pt-2">
                <span className="font-syne uppercase text-sm">Grand Total</span>
                <span className="font-syne text-xl text-[#d48b7a] tabular-nums">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onContinueShopping}
                className="w-1/3 py-3 border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] font-mono text-xs uppercase font-bold hover:bg-[#111113] transition-colors"
              >
                Catalogue
              </button>
              <button
                onClick={onProceedToCheckout}
                className="w-2/3 py-3 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#111113]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
