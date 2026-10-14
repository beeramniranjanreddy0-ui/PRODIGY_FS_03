export type OccasionType =
  | 'Birthday'
  | 'Anniversary'
  | 'Wedding'
  | 'Engagement'
  | 'Congratulations'
  | 'Baby Shower'
  | 'Farewell'
  | 'Graduation'
  | "Valentine's Day"
  | 'Festival'
  | 'Just Because'
  | 'Other';

export interface CakeCustomization {
  occasion: OccasionType;
  weight: string; // e.g. "0.5 kg", "1 kg", "2 kg", "3 kg"
  flavour: string; // e.g. "Chocolate", "Vanilla", "Black Forest", etc.
  isEggless: boolean;
  hasMessage: boolean;
  cakeMessage: string | null;
  photoUrl?: string | null;
  specialInstructions?: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
}

export interface ProductVariant {
  weight: string;
  priceMultiplier: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  description: string;
  image: string;
  galleryImages: string[];
  supportedWeights: string[]; // ["0.5 kg", "1 kg", "2 kg", "3 kg"]
  supportedFlavours: string[]; // ["Chocolate", "Truffle", "Vanilla", ...]
  supportsEggless: boolean;
  stock: number;
  isBestseller?: boolean;
  isSpecial?: boolean;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: string; // unique uuid for this specific customization item
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  customization: CakeCustomization;
  itemSubtotal: number;
}

export interface DeliverySlot {
  id: string;
  label: string; // e.g. "Morning (09:00 AM - 12:00 PM)"
  isAvailable: boolean;
  extraFee?: number;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrderValue: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderAddress {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItemSnapshot {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  itemSubtotal: number;
  customization: CakeCustomization;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "TBC-2026-9482"
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: OrderAddress;
  items: OrderItemSnapshot[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string | null;
  deliveryFee: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: 'COD' | 'SIMULATED_CARD' | 'SIMULATED_UPI';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  deliveryDate: string;
  deliveryTimeSlot: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses?: OrderAddress[];
}
