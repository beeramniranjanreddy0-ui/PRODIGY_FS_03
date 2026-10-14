import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpDown, Cake, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import type {
  Product,
  Category,
  CartItem,
  Order,
  User,
  DeliverySlot,
  CakeCustomization,
  OrderStatus,
} from './types/bakery';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { CustomCakeModal } from './components/CustomCakeModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersTrackerModal } from './components/OrdersTrackerModal';
import { AdminPortalPage } from './components/AdminPortalPage';
import { AuthModal } from './components/AuthModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AboutModal, ContactModal } from './components/AboutContactModals';
import { Footer } from './components/Footer';

export default function App() {
  // Page routing state: 'store' vs 'admin'
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    return window.location.hash === '#admin' ? 'admin' : 'store';
  });

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Customer session state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tbc_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Dedicated Admin session state (thebakerscorner@admin.com only) - always fresh on reload
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminPortalKey, setAdminPortalKey] = useState<number>(0);

  // Cart state
  const [cartId] = useState<string>(() => {
    let id = localStorage.getItem('tbc_cart_id');
    if (!id) {
      id = `cart-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem('tbc_cart_id', id);
    }
    return id;
  });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tbc_cart_items');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tbc_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter / Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [egglessOnly, setEgglessOnly] = useState<boolean>(false);

  // Active Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Active Selected Product for details / customizer
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [initialCustomization, setInitialCustomization] = useState<Partial<CakeCustomization> | undefined>(undefined);

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Listen to hash changes for page routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initial Data Fetch
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, prods, slots, ords] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
          api.getDeliverySlots(),
          api.getOrders(),
        ]);
        setCategories(cats);
        setProducts(prods);
        setDeliverySlots(slots);
        setOrders(ords.orders || []);
      } catch (err) {
        console.error('Failed to load initial bakery data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save cart & wishlist to local storage
  useEffect(() => {
    localStorage.setItem('tbc_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('tbc_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Subtotal calculation
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.itemSubtotal, 0);

  // Cart operations
  const handleAddToCart = async (
    productId: string,
    quantity: number,
    customization: CakeCustomization
  ) => {
    try {
      const res = await api.addToCart(cartId, productId, quantity, customization);
      setCartItems(res.items);
      setIsCustomModalOpen(false);
      setIsProductDetailOpen(false);
      setIsCartOpen(true);
      showToast(
        customization.hasMessage && customization.cakeMessage
          ? `Added "${customization.cakeMessage}" custom cake to bag!`
          : `Custom cake added to bag!`
      );
    } catch {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        const mult = customization.weight.includes('1')
          ? 1.8
          : customization.weight.includes('2')
          ? 3.4
          : customization.weight.includes('3')
          ? 4.8
          : 1.0;
        const unitPrice = Math.round(prod.basePrice * mult);
        const newItem: CartItem = {
          id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: prod.id,
          productName: prod.name,
          productImage: prod.image,
          unitPrice,
          quantity,
          itemSubtotal: unitPrice * quantity,
          customization,
        };
        const updated = [...cartItems, newItem];
        setCartItems(updated);
        setIsCustomModalOpen(false);
        setIsProductDetailOpen(false);
        setIsCartOpen(true);
        showToast('Cake added to bag with your custom preferences!');
      }
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await api.updateCartItem(cartId, itemId, quantity);
      setCartItems(res.items);
    } catch {
      const updated = cartItems.map((it) =>
        it.id === itemId
          ? { ...it, quantity, itemSubtotal: it.unitPrice * quantity }
          : it
      );
      setCartItems(updated);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const res = await api.removeCartItem(cartId, itemId);
      setCartItems(res.items);
      showToast('Item removed from bag');
    } catch {
      setCartItems(cartItems.filter((i) => i.id !== itemId));
    }
  };

  const handleApplyCoupon = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, cartSubtotal);
      if (res.valid) {
        setAppliedCoupon(res.code);
        setDiscountAmount(res.discount_amount || res.discountAmount || 0);
        showToast(`Coupon ${res.code} applied successfully!`);
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    showToast('Coupon removed');
  };

  // Open customizer directly for a product
  const handleOpenCustomizer = (
    product: Product,
    initCustom?: Partial<CakeCustomization>
  ) => {
    setActiveProduct(product);
    setInitialCustomization(initCustom);
    setIsCustomModalOpen(true);
  };

  // Edit an existing cart item customization
  const handleEditCustomization = (item: CartItem) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      setActiveProduct(prod);
      setInitialCustomization(item.customization);
      handleRemoveItem(item.id);
      setIsCartOpen(false);
      setIsCustomModalOpen(true);
    }
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
      showToast('Removed from saved celebrations');
    } else {
      setWishlist([...wishlist, product]);
      showToast('Added to saved celebrations ❤️');
    }
  };

  // Add review
  const handleAddReview = async (
    productId: string,
    review: { userName: string; rating: number; comment: string }
  ) => {
    try {
      const res = await api.addReview(productId, review);
      if (res.product) {
        setProducts(products.map((p) => (p.id === productId ? res.product : p)));
        setActiveProduct(res.product);
      }
      showToast('Thank you! Your review was published.');
    } catch {
      showToast('Review submitted.');
    }
  };

  // Checkout & Order submission
  const handlePlaceOrder = async (orderPayload: any) => {
    const res = await api.createOrder(orderPayload);
    setOrders([res.order, ...orders]);
    setCartItems([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem('tbc_cart_items');
    return res.order;
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setIsOrdersOpen(true);
    showToast(`Order #${order.orderNumber} placed successfully!`);
  };

  // Admin order status update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, status);
      setOrders(orders.map((o) => (o.id === orderId ? res.order : o)));
      showToast(`Order status updated to "${status}"`);
    } catch {
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
      );
    }
  };

  // Admin Product operations
  const handleCreateProduct = async (productData: Partial<Product>) => {
    try {
      const res = await api.createProduct(productData);
      setProducts([res.product, ...products]);
      showToast('New cake added to bakery catalog!');
    } catch (err: any) {
      showToast(err.message || 'Failed to create cake');
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await api.updateProduct(id, updates);
      setProducts(products.map((p) => (p.id === id ? res.product : p)));
      showToast('Cake details updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update cake');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      showToast('Cake deleted from catalog');
    } catch {
      showToast('Failed to delete cake');
    }
  };

  // -------------------------------------------------------------
  // CUSTOMER AUTHENTICATION (Login & Create Account)
  // -------------------------------------------------------------
  const handleCustomerLogin = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.user);
    localStorage.setItem('tbc_user', JSON.stringify(res.user));
    showToast(`Welcome back, ${res.user.fullName}!`);
  };

  const handleCustomerRegister = async (
    email: string,
    pass: string,
    name: string,
    phone?: string
  ) => {
    const res = await api.register(email, pass, name, phone);
    setUser(res.user);
    localStorage.setItem('tbc_user', JSON.stringify(res.user));
    showToast(`Account created! Welcome, ${res.user.fullName}!`);
  };

  const handleCustomerLogout = () => {
    setUser(null);
    localStorage.removeItem('tbc_user');
    showToast('Signed out of customer account');
  };

  // -------------------------------------------------------------
  // ADMIN AUTHENTICATION - thebakerscorner@admin.com only
  // -------------------------------------------------------------
  const handleAdminLogin = async (email: string, pass: string) => {
    const res = await api.adminLogin(email, pass);
    setAdminUser(res.user);
    localStorage.removeItem('tbc_admin_user');
    showToast('Executive Admin Access Granted');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setAdminPortalKey((k) => k + 1);
    localStorage.removeItem('tbc_admin_user');
    showToast('Admin session logged out successfully');
  };

  // Navigation helpers
  const navigateToAdmin = () => {
    setAdminPortalKey((k) => k + 1);
    setCurrentView('admin');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    setCurrentView('store');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.categoryId === selectedCategory ||
      p.slug.includes(selectedCategory);
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supportedFlavours.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEggless = !egglessOnly || p.supportsEggless;

    return matchesCategory && matchesSearch && matchesEggless;
  });

  // Sorted products
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.basePrice - a.basePrice);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // Bestsellers & Specials
  const bestsellingCakes = products.filter((p) => p.isBestseller).slice(0, 4);
  const celebrationSpecials = products.filter((p) => p.isSpecial).slice(0, 4);

  // =============================================================
  // SEPARATE ADMIN PORTAL PAGE ROUTE
  // =============================================================
  if (currentView === 'admin') {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-60 bg-[#2C1810] text-[#FAF7F2] px-5 py-3 rounded-2xl shadow-2xl border border-[#4A2818] flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
            <CheckCircle2 className="w-4 h-4 text-[#E8C2B0] shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        <AdminPortalPage
          key={`admin-portal-${adminPortalKey}`}
          adminUser={adminUser}
          orders={orders}
          products={products}
          categories={categories}
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
          onReturnToStore={navigateToStore}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onCreateProduct={handleCreateProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </>
    );
  }

  // =============================================================
  // CUSTOMER E-COMMERCE STOREFRONT
  // =============================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C1810]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-[#2C1810] text-[#FAF7F2] px-5 py-3 rounded-2xl shadow-2xl border border-[#4A2818] flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#E8C2B0] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        cartCount={cartItems.reduce((sum, it) => sum + it.quantity, 0)}
        wishlistCount={wishlist.length}
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={navigateToAdmin}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onNavigateHome={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCustomizer={() => {
          const customCake = products.find((p) => p.categoryId === 'cat-12') || products[0];
          if (customCake) handleOpenCustomizer(customCake);
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section */}
      <Hero
        onShopNow={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onCustomize={() => {
          const customCake = products.find((p) => p.categoryId === 'cat-12') || products[0];
          if (customCake) handleOpenCustomizer(customCake);
        }}
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdmin={navigateToAdmin}
        activeCategoryId={selectedCategory}
        onOpenProductByName={(name) => {
          const found = products.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
          if (found) {
            setActiveProduct(found);
            setIsProductDetailOpen(true);
          }
        }}
      />

      {/* Categories Grid */}
      <CategoryGrid
        categories={categories}
        selectedCategoryId={selectedCategory}
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Bestselling Cakes Strip */}
      {bestsellingCakes.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <section className="py-14 bg-[#161618] border-b border-[rgba(240,240,240,0.1)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[rgba(240,240,240,0.1)]">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#d48b7a] font-semibold">
                  Section 03 / Master Signatures
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase text-[#f0f0f0] tracking-tight">
                  Bestselling Celebration Cakes
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-mono text-xs uppercase tracking-wider text-[#d48b7a] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Full Catalogue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellingCakes.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenProduct={(p) => {
                    setActiveProduct(p);
                    setIsProductDetailOpen(true);
                  }}
                  onCustomize={(p) => handleOpenCustomizer(p)}
                  isWishlisted={wishlist.some((w) => w.id === prod.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bespoke Pâtisserie Custom Cake Promotion Banner */}
      <section className="py-16 bg-[#111113] border-b border-[rgba(240,240,240,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 bg-[#1a1a1c] border border-[rgba(240,240,240,0.1)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#d48b7a] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Section 04 / Bespoke Atelier</span>
              </span>
              <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-[#f0f0f0] uppercase tracking-tight leading-tight">
                Design Your Dream Cake With Custom Message & Flavours
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#f0f0f0]/70 max-w-2xl leading-relaxed">
                Choose from 12 occasion themes (Birthdays, Anniversaries, Weddings), select your custom weight (0.5 kg to 3 kg), specify Belgian ganache or crimson red velvet flavours, and have our pastry artists pipe your personalized chocolate cake message.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 font-mono text-[11px] text-[#d48b7a]">
                <span>✓ Piped Chocolate Cake Message</span>
                <span>·</span>
                <span>✓ Photo Sugar-Print Option</span>
                <span>·</span>
                <span>✓ 100% Eggless Option</span>
                <span>·</span>
                <span>✓ Midnight Delivery</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={() => {
                  const customCake = products.find((p) => p.categoryId === 'cat-12') || products[0];
                  if (customCake) handleOpenCustomizer(customCake);
                }}
                className="px-8 py-4 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#111113]" />
                <span>Start Cake Customizer</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog-section" className="py-16 bg-[#111113] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header & Controls Strip */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[rgba(240,240,240,0.1)]">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#d48b7a] font-semibold">
                Fresh From The Oven
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-extrabold uppercase text-[#f0f0f0] tracking-tight">
                {selectedCategory === 'all'
                  ? 'All Artisanal Creations'
                  : categories.find((c) => c.id === selectedCategory)?.name || 'Cakes'}
              </h2>
              <p className="font-mono text-xs text-[#f0f0f0]/60 mt-1 uppercase">
                Displaying {filteredProducts.length} handcrafted creations
              </p>
            </div>

            {/* Filter and Sort bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setEgglessOnly(!egglessOnly)}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider font-semibold border transition-all flex items-center gap-2 ${
                  egglessOnly
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                    : 'bg-[#1a1a1c] text-[#f0f0f0]/80 border-[rgba(240,240,240,0.2)] hover:border-[#d48b7a]'
                }`}
              >
                <span className="w-2 h-2 bg-emerald-400" />
                <span>Eggless Only</span>
              </button>

              <div className="flex items-center gap-2 bg-[#1a1a1c] px-3 py-1.5 border border-[rgba(240,240,240,0.2)] font-mono text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#d48b7a]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-mono text-xs text-[#f0f0f0] focus:outline-none"
                >
                  <option value="featured" className="bg-[#1a1a1c] text-white">Featured First</option>
                  <option value="price-asc" className="bg-[#1a1a1c] text-white">Price: Low to High</option>
                  <option value="price-desc" className="bg-[#1a1a1c] text-white">Price: High to Low</option>
                  <option value="rating" className="bg-[#1a1a1c] text-white">Highest Rated</option>
                </select>
              </div>

              {(selectedCategory !== 'all' || searchQuery || egglessOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setEgglessOnly(false);
                  }}
                  className="font-mono text-xs font-semibold text-[#d48b7a] hover:underline uppercase"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-[#d48b7a] border-t-transparent animate-spin mx-auto" />
              <p className="font-mono text-xs text-[#f0f0f0]/60 uppercase tracking-widest">
                Preheating bakery atelier...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-[#1a1a1c] border border-[rgba(240,240,240,0.1)] p-8">
              <Cake className="w-12 h-12 text-[#d48b7a] opacity-40 mx-auto" />
              <h3 className="font-syne text-xl font-bold uppercase text-[#f0f0f0]">
                No cakes matched your criteria
              </h3>
              <p className="font-sans text-xs text-[#f0f0f0]/60 max-w-sm mx-auto">
                Try searching for something else or browse all 12 of our freshly baked categories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setEgglessOnly(false);
                }}
                className="px-6 py-2.5 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono text-xs uppercase font-bold tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenProduct={(p) => {
                    setActiveProduct(p);
                    setIsProductDetailOpen(true);
                  }}
                  onCustomize={(p) => handleOpenCustomizer(p)}
                  isWishlisted={wishlist.some((w) => w.id === prod.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Birthday & Anniversary Specials Strip */}
      {celebrationSpecials.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <section className="py-14 bg-[#161618] border-t border-[rgba(240,240,240,0.1)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[rgba(240,240,240,0.1)]">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#d48b7a] font-semibold">
                  Milestones & Parties
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase text-[#f0f0f0]">
                  Birthday & Anniversary Specials
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {celebrationSpecials.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenProduct={(p) => {
                    setActiveProduct(p);
                    setIsProductDetailOpen(true);
                  }}
                  onCustomize={(p) => handleOpenCustomizer(p)}
                  isWishlisted={wishlist.some((w) => w.id === prod.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 bg-[#111113] border-t border-[rgba(240,240,240,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#d48b7a] font-semibold">
              Section 05 / Patron Reviews
            </span>
            <h2 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase text-[#f0f0f0]">
              Loved by Over 50,000 Celebrants
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1c] p-6 border border-[rgba(240,240,240,0.1)] space-y-3">
              <div className="flex items-center gap-1 text-[#d48b7a]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#d48b7a]" />
                ))}
              </div>
              <p className="font-sans text-xs text-[#f0f0f0]/80 leading-relaxed">
                “Ordered the 1 kg Belgian Chocolate Truffle with a custom birthday message for my sister. The ganache was glossy, rich, and the cake arrived exactly at 11:45 PM for our midnight surprise!”
              </p>
              <div className="pt-3 border-t border-[rgba(240,240,240,0.1)]">
                <strong className="font-syne text-xs uppercase text-[#f0f0f0] block">Pooja Krishnan</strong>
                <span className="font-mono text-[10px] text-[#f0f0f0]/50 uppercase">Birthday Celebration · Hyderabad</span>
              </div>
            </div>

            <div className="bg-[#1a1a1c] p-6 border border-[rgba(240,240,240,0.1)] space-y-3">
              <div className="flex items-center gap-1 text-[#d48b7a]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#d48b7a]" />
                ))}
              </div>
              <p className="font-sans text-xs text-[#f0f0f0]/80 leading-relaxed">
                “The Red Velvet cream cheese frosting is genuinely world-class. It was 100% eggless as requested and our elderly grandparents couldn't believe how soft and moist the layers were.”
              </p>
              <div className="pt-3 border-t border-[rgba(240,240,240,0.1)]">
                <strong className="font-syne text-xs uppercase text-[#f0f0f0] block">Vikramaditya Verma</strong>
                <span className="font-mono text-[10px] text-[#f0f0f0]/50 uppercase">25th Anniversary Special</span>
              </div>
            </div>

            <div className="bg-[#1a1a1c] p-6 border border-[rgba(240,240,240,0.1)] space-y-3">
              <div className="flex items-center gap-1 text-[#d48b7a]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#d48b7a]" />
                ))}
              </div>
              <p className="font-sans text-xs text-[#f0f0f0]/80 leading-relaxed">
                “The Custom Cake flow on the website is so intuitive! Being able to choose the exact occasion and preview the message with character counting ensured zero typos. Five stars!”
              </p>
              <div className="pt-3 border-t border-[rgba(240,240,240,0.1)]">
                <strong className="font-syne text-xs uppercase text-[#f0f0f0] block">Ananya Sen</strong>
                <span className="font-mono text-[10px] text-[#f0f0f0]/50 uppercase">Graduation Celebration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCustomizer={() => {
          const customCake = products.find((p) => p.categoryId === 'cat-12') || products[0];
          if (customCake) handleOpenCustomizer(customCake);
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Customer Modals */}
      <CustomCakeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        product={activeProduct}
        deliverySlots={deliverySlots}
        onAddToCart={handleAddToCart}
        initialCustomization={initialCustomization}
      />

      <ProductDetailModal
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        product={activeProduct}
        allProducts={products}
        deliverySlots={deliverySlots}
        onOpenCustomizer={(p, init) => {
          setIsProductDetailOpen(false);
          handleOpenCustomizer(p, init);
        }}
        onSelectProduct={(p) => setActiveProduct(p)}
        onAddToCartDirect={handleAddToCart}
        onAddReview={handleAddReview}
        isWishlisted={activeProduct ? wishlist.some((w) => w.id === activeProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        discountAmount={discountAmount}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onEditCustomization={handleEditCustomization}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => setIsCartOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        discountAmount={discountAmount}
        appliedCoupon={appliedCoupon}
        user={user}
        deliverySlots={deliverySlots}
        onPlaceOrder={handlePlaceOrder}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrdersTrackerModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={handleCustomerLogin}
        onRegister={handleCustomerRegister}
        onLogout={handleCustomerLogout}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onGoToAdminPortal={navigateToAdmin}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onCustomize={(p) => handleOpenCustomizer(p)}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
