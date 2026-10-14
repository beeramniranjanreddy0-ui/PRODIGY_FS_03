import React, { useState, useEffect } from 'react';
import { X, Sparkles, Upload, Calendar, Clock, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import type { Product, OccasionType, CakeCustomization, DeliverySlot } from '../types/bakery';
import { CakeFallbackImage } from './CakeFallbackImage';

const OCCASIONS: OccasionType[] = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Engagement',
  'Congratulations',
  'Baby Shower',
  'Farewell',
  'Graduation',
  "Valentine's Day",
  'Festival',
  'Just Because',
  'Other',
];

interface CustomCakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  deliverySlots: DeliverySlot[];
  onAddToCart: (productId: string, quantity: number, customization: CakeCustomization) => void;
  initialCustomization?: Partial<CakeCustomization>;
}

export const CustomCakeModal: React.FC<CustomCakeModalProps> = ({
  isOpen,
  onClose,
  product,
  deliverySlots,
  onAddToCart,
  initialCustomization,
}) => {
  if (!isOpen || !product) return null;

  // 1. Occasion
  const [occasion, setOccasion] = useState<OccasionType>(
    initialCustomization?.occasion || 'Birthday'
  );

  // 2. Weight
  const defaultWeight = product.supportedWeights[0] || '0.5 kg';
  const [selectedWeight, setSelectedWeight] = useState<string>(
    initialCustomization?.weight || defaultWeight
  );

  // 3. Flavour
  const defaultFlavour = product.supportedFlavours[0] || 'Chocolate';
  const [selectedFlavour, setSelectedFlavour] = useState<string>(
    initialCustomization?.flavour || defaultFlavour
  );

  // 4. Egg / Eggless
  const [isEggless, setIsEggless] = useState<boolean>(
    initialCustomization?.isEggless ?? true
  );

  // 5. Message Question
  const [hasMessage, setHasMessage] = useState<boolean>(
    initialCustomization?.hasMessage ?? true
  );
  const [cakeMessage, setCakeMessage] = useState<string>(
    initialCustomization?.cakeMessage || 'Happy Birthday!'
  );
  const [messageError, setMessageError] = useState<string | null>(null);

  // 6. Photo
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    initialCustomization?.photoUrl || null
  );

  // 7. Special instructions
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    initialCustomization?.specialInstructions || ''
  );

  // 8. Delivery
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState<string>(
    initialCustomization?.deliveryDate || defaultDateStr
  );
  const [deliverySlot, setDeliverySlot] = useState<string>(
    initialCustomization?.deliveryTimeSlot ||
      deliverySlots[0]?.label ||
      'Morning Express (09:00 AM - 12:00 PM)'
  );

  // 9. Quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Sync when initialCustomization updates
  useEffect(() => {
    if (initialCustomization) {
      if (initialCustomization.occasion) setOccasion(initialCustomization.occasion);
      if (initialCustomization.weight) setSelectedWeight(initialCustomization.weight);
      if (initialCustomization.flavour) setSelectedFlavour(initialCustomization.flavour);
      if (initialCustomization.isEggless !== undefined) setIsEggless(initialCustomization.isEggless);
      if (initialCustomization.hasMessage !== undefined) setHasMessage(initialCustomization.hasMessage);
      if (initialCustomization.cakeMessage) setCakeMessage(initialCustomization.cakeMessage);
      if (initialCustomization.photoUrl) setPhotoUrl(initialCustomization.photoUrl);
      if (initialCustomization.specialInstructions) setSpecialInstructions(initialCustomization.specialInstructions);
      if (initialCustomization.deliveryDate) setDeliveryDate(initialCustomization.deliveryDate);
      if (initialCustomization.deliveryTimeSlot) setDeliverySlot(initialCustomization.deliveryTimeSlot);
    }
  }, [initialCustomization]);

  // Pricing math
  const getWeightMultiplier = (weight: string) => {
    if (weight.includes('0.5')) return 1.0;
    if (weight.includes('1')) return 1.8;
    if (weight.includes('2')) return 3.4;
    if (weight.includes('3')) return 4.8;
    return 1.0;
  };

  const unitPrice = Math.round(product.basePrice * getWeightMultiplier(selectedWeight));
  const totalPrice = unitPrice * quantity;

  // File upload reader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Live validation for cake message
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 60) {
      setMessageError('Message cannot exceed 60 characters.');
    } else {
      setMessageError(null);
    }
    setCakeMessage(val.slice(0, 60));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasMessage) {
      if (!cakeMessage || !cakeMessage.trim()) {
        setMessageError('Please enter your cake message or select "No".');
        return;
      }
      if (cakeMessage.length > 60) {
        setMessageError('Cake message must not exceed 60 characters.');
        return;
      }
    }

    const finalCustomization: CakeCustomization = {
      occasion,
      weight: selectedWeight,
      flavour: selectedFlavour,
      isEggless,
      hasMessage,
      cakeMessage: hasMessage ? cakeMessage.trim() : null,
      photoUrl,
      specialInstructions: specialInstructions.trim() || undefined,
      deliveryDate,
      deliveryTimeSlot: deliverySlot,
    };

    onAddToCart(product.id, quantity, finalCustomization);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#111113] text-[#f0f0f0] max-w-4xl w-full overflow-hidden shadow-2xl border border-[rgba(240,240,240,0.15)] my-8 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(240,240,240,0.1)] flex items-center justify-between bg-[#161618] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a1a1c] border border-[rgba(240,240,240,0.15)] flex items-center justify-center text-[#d48b7a]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#d48b7a] font-bold">
                Atelier Workshop / Customizer
              </span>
              <h2 className="font-syne font-extrabold text-xl sm:text-2xl uppercase text-[#f0f0f0]">
                Customize {product.name}
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

        {/* Modal Scrollable Body */}
        <form onSubmit={handleFormSubmit} className="overflow-y-auto p-5 sm:p-8 space-y-8 flex-1">
          {/* Top Preview Banner */}
          <div className="bg-[#1a1a1c] p-4 border border-[rgba(240,240,240,0.1)] flex flex-col sm:flex-row gap-5 items-center">
            <div className="w-24 h-24 overflow-hidden shrink-0 bg-[#111113] border border-[rgba(240,240,240,0.15)]">
              <CakeFallbackImage src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="font-mono text-[10px] text-[#d48b7a] uppercase tracking-wider">{product.categoryName}</span>
              <h3 className="font-syne font-bold text-lg uppercase text-[#f0f0f0]">{product.name}</h3>
              <p className="font-sans text-xs text-[#f0f0f0]/70 line-clamp-1 mt-0.5">{product.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-[10px] uppercase text-[#f0f0f0]/60">Unit Price</span>
              <p className="font-syne font-extrabold text-2xl text-[#d48b7a] tabular-nums">
                ₹{unitPrice.toLocaleString('en-IN')}
              </p>
              <span className="font-mono text-[10px] text-[#f0f0f0]/60 uppercase">for {selectedWeight}</span>
            </div>
          </div>

          {/* Section A: Occasion Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a]">
                A. What is this cake for? <span className="text-red-400">*</span>
              </label>
              <span className="font-mono text-[10px] text-[#f0f0f0]/50 uppercase">Select occasion</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {OCCASIONS.map((occ) => {
                const isSelected = occasion === occ;
                return (
                  <button
                    type="button"
                    key={occ}
                    onClick={() => setOccasion(occ)}
                    className={`py-2.5 px-3 font-mono text-xs uppercase tracking-wider text-center transition-all border ${
                      isSelected
                        ? 'bg-[#d48b7a] text-[#111113] border-[#d48b7a] font-bold'
                        : 'bg-[#1a1a1c] text-[#f0f0f0]/80 border-[rgba(240,240,240,0.15)] hover:border-[#d48b7a]'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B & C: Cake Weight and Flavour Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cake Weight */}
            <div className="space-y-3">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a]">
                B. Select Weight <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.supportedWeights.map((w) => {
                  const isSelected = selectedWeight === w;
                  const priceForWeight = Math.round(product.basePrice * getWeightMultiplier(w));
                  return (
                    <button
                      type="button"
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`p-3 border text-left transition-all ${
                        isSelected
                          ? 'bg-[#d48b7a] text-[#111113] border-[#d48b7a]'
                          : 'bg-[#1a1a1c] text-[#f0f0f0] border-[rgba(240,240,240,0.15)] hover:border-[#d48b7a]'
                      }`}
                    >
                      <div className="font-mono font-bold text-xs uppercase">{w}</div>
                      <div
                        className={`font-mono text-[10px] tabular-nums mt-0.5 ${
                          isSelected ? 'text-[#111113]/80 font-bold' : 'text-[#d48b7a]'
                        }`}
                      >
                        ₹{priceForWeight.toLocaleString('en-IN')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cake Flavour */}
            <div className="space-y-3">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a]">
                C. Select Flavour <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.supportedFlavours.map((flv) => {
                  const isSelected = selectedFlavour === flv;
                  return (
                    <button
                      type="button"
                      key={flv}
                      onClick={() => setSelectedFlavour(flv)}
                      className={`py-3 px-3 border text-center font-mono text-xs uppercase tracking-wider transition-all ${
                        isSelected
                          ? 'bg-[#d48b7a] text-[#111113] border-[#d48b7a] font-bold'
                          : 'bg-[#1a1a1c] text-[#f0f0f0] border-[rgba(240,240,240,0.15)] hover:border-[#d48b7a]'
                      }`}
                    >
                      {flv}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section D: Cake Message Question */}
          <div className="bg-[#1a1a1c] p-6 border border-[rgba(240,240,240,0.1)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block font-syne text-base font-bold uppercase text-[#f0f0f0]">
                  D. Would you like a message piped on your cake?
                </label>
                <p className="font-sans text-xs text-[#f0f0f0]/60 mt-0.5">
                  Our pastry chefs pipe this message with dark chocolate ganache or royal icing.
                </p>
              </div>

              {/* Yes / No Choices */}
              <div className="flex items-center gap-2 p-1 bg-[#111113] border border-[rgba(240,240,240,0.15)] shrink-0">
                <button
                  type="button"
                  onClick={() => setHasMessage(true)}
                  className={`px-4 py-2 font-mono text-xs uppercase font-bold transition-all ${
                    hasMessage
                      ? 'bg-[#d48b7a] text-[#111113]'
                      : 'text-[#f0f0f0]/70 hover:text-white'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasMessage(false);
                    setMessageError(null);
                  }}
                  className={`px-4 py-2 font-mono text-xs uppercase font-bold transition-all ${
                    !hasMessage
                      ? 'bg-[#d48b7a] text-[#111113]'
                      : 'text-[#f0f0f0]/70 hover:text-white'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* If Yes: show input with live counter and example */}
            {hasMessage && (
              <div className="pt-2 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="cakeMessageInput" className="font-mono text-xs font-bold uppercase text-[#d48b7a]">
                    Your Cake Message <span className="text-red-400">*</span>
                  </label>
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      cakeMessage.length >= 55 ? 'text-amber-400 font-bold' : 'text-[#f0f0f0]/60'
                    }`}
                  >
                    {cakeMessage.length} / 60 characters
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="cakeMessageInput"
                    type="text"
                    maxLength={60}
                    value={cakeMessage}
                    onChange={handleMessageChange}
                    placeholder="e.g. Happy Birthday, Niro!"
                    className={`w-full px-4 py-3 border bg-[#111113] font-sans text-sm text-[#f0f0f0] focus:outline-none transition-all ${
                      messageError
                        ? 'border-red-400'
                        : 'border-[rgba(240,240,240,0.2)] focus:border-[#d48b7a]'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-[#f0f0f0]/50 uppercase">
                  <span>Example: &ldquo;Happy Birthday, Niro!&rdquo; or &ldquo;Forever & Always&rdquo;</span>
                  {messageError && (
                    <span className="text-red-400 flex items-center gap-1 font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {messageError}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section E: Additional Customization */}
          <div className="space-y-6">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a]">
              E. Additional Preferences & Delivery
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Egg or Eggless */}
              {product.supportsEggless && (
                <div className="bg-[#1a1a1c] p-4 border border-[rgba(240,240,240,0.1)] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-[#f0f0f0] flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400" />
                      100% Vegetarian / Eggless
                    </span>
                    <p className="font-sans text-[11px] text-[#f0f0f0]/60 mt-0.5">
                      Baked using premium natural dairy butter
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEggless(!isEggless)}
                    className={`relative inline-flex h-6 w-11 items-center transition-colors focus:outline-none ${
                      isEggless ? 'bg-emerald-500' : 'bg-[#2a2a2e]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 bg-[#111113] transition-transform ${
                        isEggless ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* Photo or Reference Upload */}
              <div className="bg-[#1a1a1c] p-4 border border-[rgba(240,240,240,0.1)]">
                <label className="block font-mono text-xs font-bold uppercase text-[#f0f0f0] mb-1">
                  Upload Reference Design (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-2 border border-dashed border-[#d48b7a] font-mono text-xs text-[#d48b7a] hover:bg-[#111113] transition-colors flex items-center gap-1.5 uppercase">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File (Max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {photoUrl ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={photoUrl}
                        alt="Uploaded preview"
                        className="w-9 h-9 object-cover border border-[rgba(240,240,240,0.2)]"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(null)}
                        className="font-mono text-[10px] text-red-400 hover:underline uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Date & Time Slot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-xs font-bold uppercase text-[#f0f0f0] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#d48b7a]" />
                  <span>Preferred Delivery Date</span>
                </label>
                <input
                  type="date"
                  min={defaultDateStr}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] font-mono text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs font-bold uppercase text-[#f0f0f0] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d48b7a]" />
                  <span>Delivery Time Slot</span>
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] font-mono text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                >
                  {deliverySlots.map((s) => (
                    <option key={s.id} value={s.label} className="bg-[#111113] text-white">
                      {s.label} {s.extraFee ? `(+₹${s.extraFee})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-bold uppercase text-[#f0f0f0]">
                Special Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Less sugar, extra cocoa nibs, or candle count..."
                className="w-full px-4 py-2.5 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] font-sans text-xs text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a] resize-none"
              />
            </div>
          </div>

          {/* Section F: Customization Summary */}
          <div className="bg-[#161618] p-5 border border-[rgba(240,240,240,0.1)] space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#d48b7a] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#d48b7a]" />
              <span>F. Customization Summary</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 font-mono text-xs">
              <div>
                <span className="text-[#f0f0f0]/50 uppercase">Occasion:</span>
                <p className="font-bold text-[#f0f0f0] uppercase">{occasion}</p>
              </div>
              <div>
                <span className="text-[#f0f0f0]/50 uppercase">Weight & Flavour:</span>
                <p className="font-bold text-[#f0f0f0] uppercase">
                  {selectedWeight} · {selectedFlavour}
                </p>
              </div>
              <div>
                <span className="text-[#f0f0f0]/50 uppercase">Dietary:</span>
                <p className="font-bold text-[#f0f0f0] uppercase">
                  {isEggless ? '100% Eggless' : 'Regular (Egg)'}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-[#f0f0f0]/50 uppercase">Cake Message:</span>
                <p className="font-bold text-[#d48b7a]">
                  {hasMessage && cakeMessage ? `"${cakeMessage}"` : 'None'}
                </p>
              </div>
              <div>
                <span className="text-[#f0f0f0]/50 uppercase">Delivery:</span>
                <p className="font-bold text-[#f0f0f0]">
                  {deliveryDate} ({deliverySlot.split(' ')[0]})
                </p>
              </div>
            </div>
          </div>

          {/* Section G: Add to Cart Action Footer */}
          <div className="pt-4 border-t border-[rgba(240,240,240,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 font-mono text-xs uppercase">
              <span className="text-[#f0f0f0]/70 font-bold">Quantity:</span>
              <div className="flex items-center border border-[rgba(240,240,240,0.2)] bg-[#1a1a1c] px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#f0f0f0] font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#f0f0f0] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#f0f0f0] font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-right">
                <span className="font-mono text-[10px] text-[#f0f0f0]/50 uppercase tracking-wider block">
                  Total Amount
                </span>
                <span className="font-syne font-extrabold text-2xl text-[#d48b7a] tabular-nums">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-8 py-3.5 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4 text-[#111113]" />
                <span>Add Custom Cake to Bag</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
