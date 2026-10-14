import type {
  Product,
  Category,
  CartItem,
  Order,
  User,
  DeliverySlot,
  CakeCustomization,
} from '../types/bakery';

const API_BASE = '/api';

export const api = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    return data.categories || [];
  },

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    isBestseller?: boolean;
    isSpecial?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.isBestseller) query.append('isBestseller', 'true');
    if (params?.isSpecial) query.append('isSpecial', 'true');

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    const data = await res.json();
    return data.products || [];
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    const data = await res.json();
    return data.product;
  },

  async addReview(productId: string, review: { userName: string; rating: number; comment: string }) {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    return res.json();
  },

  // Delivery slots
  async getDeliverySlots(): Promise<DeliverySlot[]> {
    const res = await fetch(`${API_BASE}/delivery-slots`);
    const data = await res.json();
    return data.slots || [];
  },

  // Coupons
  async validateCoupon(code: string, orderValue: number) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderValue }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to validate coupon');
    }
    return res.json();
  },

  // Cart
  async getCart(cartId: string): Promise<{ items: CartItem[]; subtotal: number }> {
    const res = await fetch(`${API_BASE}/cart/${cartId}`);
    return res.json();
  },

  async addToCart(
    cartId: string,
    productId: string,
    quantity: number,
    customization: CakeCustomization
  ): Promise<{ item: CartItem; items: CartItem[] }> {
    const res = await fetch(`${API_BASE}/cart/${cartId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, customization }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add item to cart');
    }
    return res.json();
  },

  async updateCartItem(
    cartId: string,
    itemId: string,
    quantity: number
  ): Promise<{ item: CartItem; items: CartItem[] }> {
    const res = await fetch(`${API_BASE}/cart/${cartId}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    return res.json();
  },

  async removeCartItem(cartId: string, itemId: string) {
    const res = await fetch(`${API_BASE}/cart/${cartId}/items/${itemId}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async clearCart(cartId: string) {
    const res = await fetch(`${API_BASE}/cart/${cartId}`, { method: 'DELETE' });
    return res.json();
  },

  // Orders
  async createOrder(orderData: any): Promise<{ order: Order }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },

  async getOrders(userId?: string): Promise<{ orders: Order[] }> {
    const url = userId ? `${API_BASE}/orders?userId=${userId}` : `${API_BASE}/orders`;
    const res = await fetch(url);
    return res.json();
  },

  async getOrder(id: string): Promise<{ order: Order }> {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async updateOrderStatus(id: string, status: string): Promise<{ order: Order }> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`);
    return res.json();
  },

  async createProduct(productData: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, phone }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async adminLogin(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Admin login failed');
    }
    return res.json();
  },
};
