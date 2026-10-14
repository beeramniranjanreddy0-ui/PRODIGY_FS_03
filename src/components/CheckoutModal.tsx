import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Calendar, Clock, CreditCard, Banknote, AlertCircle } from 'lucide-react';
import type { CartItem, Order, User, DeliverySlot, OrderAddress } from '../types/bakery';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon: string | null;
  user: User | null;
  deliverySlots: DeliverySlot[];
  onPlaceOrder: (orderPayload: any) => Promise<Order>;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discountAmount,
  appliedCoupon,
  user,
  deliverySlots,
  onPlaceOrder,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  // Tomorrow as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  // Saved user address default
  const savedAddress = user?.savedAddresses?.[0];

  const [customerName, setCustomerName] = useState(user?.fullName || 'Niranjan Reddy');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'niro@example.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98490 12345');

  const [streetAddress, setStreetAddress] = useState(savedAddress?.streetAddress || '42 Baker Street, Jubilee Hills');
  const [apartment, setApartment] = useState(savedAddress?.apartment || 'Villa 104');
  const [city, setCity] = useState(savedAddress?.city || 'Hyderabad');
  const [state, setState] = useState(savedAddress?.state || 'Telangana');
  const [pincode, setPincode] = useState(savedAddress?.pincode || '500033');

  const [deliveryDate, setDeliveryDate] = useState(defaultDateStr);
  const [deliverySlot, setDeliverySlot] = useState(
    deliverySlots[0]?.label || 'Morning Express (09:00 AM - 12:00 PM)'
  );

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'SIMULATED_CARD' | 'SIMULATED_UPI'>('SIMULATED_CARD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Billing calculation
  const deliveryFee = subtotal >= 999 || subtotal === 0 ? 0 : 50;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.05);
  const grandTotal = taxableAmount + deliveryFee + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !streetAddress || !city || !pincode) {
      setSubmitError('Please fill in all required delivery and contact details.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const shippingAddress: OrderAddress = {
        fullName: customerName,
        phone: customerPhone,
        email: customerEmail,
        streetAddress,
        apartment,
        city,
        state,
        pincode,
      };

      const payload = {
        userId: user?.id || null,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items,
        couponCode: appliedCoupon,
        paymentMethod,
        deliveryDate,
        deliveryTimeSlot: deliverySlot,
      };

      const createdOrder = await onPlaceOrder(payload);
      onOrderSuccess(createdOrder);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#111113] text-[#f0f0f0] max-w-4xl w-full overflow-hidden shadow-2xl border border-[rgba(240,240,240,0.15)] my-8 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(240,240,240,0.1)] bg-[#161618] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a1a1c] border border-[rgba(240,240,240,0.15)] flex items-center justify-center text-[#d48b7a]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#d48b7a] font-bold">
                Doorstep Delivery Schedule
              </span>
              <h2 className="font-syne font-extrabold text-xl sm:text-2xl uppercase text-[#f0f0f0]">
                Checkout & Confirmation
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#f0f0f0]/70 hover:text-white hover:bg-[#1a1a1c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-8 space-y-8 flex-1">
          {submitError && (
            <div className="bg-red-950/60 text-red-300 p-4 border border-red-800 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Form inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact */}
              <div className="bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)] space-y-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a] flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#111113] border border-[rgba(240,240,240,0.2)] flex items-center justify-center text-[10px] text-[#f0f0f0]">
                    1
                  </span>
                  <span>Customer Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[#f0f0f0]/80 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#f0f0f0]/80 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#f0f0f0]/80 uppercase">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address */}
              <div className="bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)] space-y-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a] flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#111113] border border-[rgba(240,240,240,0.2)] flex items-center justify-center text-[10px] text-[#f0f0f0]">
                    2
                  </span>
                  <span>Delivery Address</span>
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="text-[#f0f0f0]/80 uppercase">Street Address & Landmark *</label>
                    <input
                      type="text"
                      required
                      placeholder="House / Flat No, Street name"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[#f0f0f0]/80 uppercase">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[#f0f0f0]/80 uppercase">State *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                      />
                    </div>
                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <label className="text-[#f0f0f0]/80 uppercase">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Date & Slot */}
              <div className="bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)] space-y-3 font-mono text-xs">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a] flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#111113] border border-[rgba(240,240,240,0.2)] flex items-center justify-center text-[10px] text-[#f0f0f0]">
                    3
                  </span>
                  <span>Delivery Schedule</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#f0f0f0]/80 uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#d48b7a]" />
                      <span>Delivery Date *</span>
                    </label>
                    <input
                      type="date"
                      min={defaultDateStr}
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#f0f0f0]/80 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#d48b7a]" />
                      <span>Time Slot *</span>
                    </label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                    >
                      {deliverySlots.map((s) => (
                        <option key={s.id} value={s.label} className="bg-[#111113] text-white">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)] space-y-3 font-mono text-xs">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a] flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#111113] border border-[rgba(240,240,240,0.2)] flex items-center justify-center text-[10px] text-[#f0f0f0]">
                    4
                  </span>
                  <span>Payment Method</span>
                </h3>

                <div className="space-y-2">
                  {/* Simulated Card / UPI */}
                  <label
                    className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-all ${
                      paymentMethod === 'SIMULATED_CARD'
                        ? 'border-[#d48b7a] bg-[#111113]'
                        : 'border-[rgba(240,240,240,0.15)] hover:border-[rgba(240,240,240,0.3)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'SIMULATED_CARD'}
                      onChange={() => setPaymentMethod('SIMULATED_CARD')}
                      className="mt-0.5 accent-[#d48b7a]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#d48b7a]" />
                        <span className="font-bold text-[#f0f0f0] uppercase">
                          Online Payment (Simulated / Dev Mode)
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-[#f0f0f0]/60 mt-0.5">
                        Simulated Instant Card/UPI settlement for development & testing. No real charges.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-[#d48b7a] bg-[#111113]'
                        : 'border-[rgba(240,240,240,0.15)] hover:border-[rgba(240,240,240,0.3)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-0.5 accent-[#d48b7a]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#d48b7a]" />
                        <span className="font-bold text-[#f0f0f0] uppercase">
                          Cash on Doorstep Delivery (COD)
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-[#f0f0f0]/60 mt-0.5">
                        Pay in cash or UPI QR upon receiving your freshly baked cake.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Order summary */}
            <div className="lg:col-span-5 bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)] space-y-4">
              <h3 className="font-syne text-sm font-bold uppercase text-[#f0f0f0] border-b border-[rgba(240,240,240,0.1)] pb-3">
                Order Review ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 font-mono text-xs">
                {items.map((it) => (
                  <div key={it.id} className="space-y-0.5 border-b border-[rgba(240,240,240,0.08)] pb-2 last:border-0">
                    <div className="flex justify-between font-bold text-[#f0f0f0] uppercase">
                      <span className="line-clamp-1">{it.productName} × {it.quantity}</span>
                      <span className="tabular-nums shrink-0 text-[#d48b7a]">₹{it.itemSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[10px] text-[#f0f0f0]/50 uppercase">
                      {it.customization.occasion} · {it.customization.weight} · {it.customization.flavour}
                    </p>
                    {it.customization.hasMessage && it.customization.cakeMessage && (
                      <p className="text-[10px] text-[#d48b7a] italic">
                        Message: &ldquo;{it.customization.cakeMessage}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-[rgba(240,240,240,0.1)] pt-3 space-y-1.5 font-mono text-xs text-[#f0f0f0]/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-bold text-[#f0f0f0]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon ({appliedCoupon})</span>
                    <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="tabular-nums">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-[#f0f0f0] border-t border-[rgba(240,240,240,0.1)] pt-2">
                  <span className="font-syne uppercase">Grand Total</span>
                  <span className="font-syne text-xl text-[#d48b7a] tabular-nums">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Confirming Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#111113]" />
                    <span>Confirm & Place Cake Order</span>
                  </>
                )}
              </button>

              <p className="font-mono text-[10px] uppercase text-center text-[#f0f0f0]/40">
                🔒 256-Bit SSL Secured Checkout · Kitchen Fresh Guarantee
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
