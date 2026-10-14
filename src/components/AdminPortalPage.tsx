import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  MessageSquare,
  Cake,
  Eye,
  EyeOff,
  ShoppingBag,
  TrendingUp,
  Tag,
} from 'lucide-react';
import type { Order, Product, Category, OrderStatus, User } from '../types/bakery';
import { CakeFallbackImage } from './CakeFallbackImage';

interface AdminPortalPageProps {
  adminUser: User | null;
  orders: Order[];
  products: Product[];
  categories: Category[];
  onAdminLogin: (email: string, pass: string) => Promise<void>;
  onAdminLogout: () => void;
  onReturnToStore: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onCreateProduct: (productData: Partial<Product>) => Promise<void>;
  onUpdateProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  adminUser,
  orders,
  products,
  categories,
  onAdminLogin,
  onAdminLogout,
  onReturnToStore,
  onUpdateOrderStatus,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  // Login Form States (always refreshed and clean by default)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Authenticated Dashboard States
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics' | 'settings'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Clear and refresh all login fields immediately
  const handleRefreshDetails = () => {
    setAdminEmail('');
    setAdminPassword('');
    setLoginError(null);
    setShowPassword(false);
  };

  // Always refresh login details when viewing the login screen or whenever adminUser changes
  React.useEffect(() => {
    setAdminEmail('');
    setAdminPassword('');
    setLoginError(null);
    setShowPassword(false);
  }, [adminUser]);

  // Product Add / Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(categories[0]?.id || 'cat-1');
  const [prodPrice, setProdPrice] = useState(599);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState(20);
  const [prodWeights, setProdWeights] = useState('0.5 kg, 1 kg, 2 kg');
  const [prodFlavours, setProdFlavours] = useState('Chocolate, Vanilla');

  // Verify whether current logged in user is the single authorized admin
  const isAuthorizedAdmin =
    adminUser &&
    adminUser.email.toLowerCase() === 'thebakerscorner@admin.com' &&
    adminUser.role === 'admin';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (cleanEmail !== 'thebakerscorner@admin.com') {
      setLoginError(
        'Access Denied: Invalid administrator credentials or unauthorized email address.'
      );
      setLoginLoading(false);
      return;
    }

    try {
      await onAdminLogin(cleanEmail, adminPassword);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication error. Please check your admin credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogoutClick = () => {
    onAdminLogout();
    handleRefreshDetails();
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.grandTotal, 0);
  const totalOrders = orders.length;
  const pendingKitchenOrders = orders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Preparing'
  ).length;
  const lowStockCakes = products.filter((p) => p.stock <= 10);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.items.some((it) =>
        it.customization.cakeMessage?.toLowerCase().includes(q)
      );
    return matchesStatus && matchesSearch;
  });

  // Modal open handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories[0]?.id || 'cat-1');
    setProdPrice(599);
    setProdDesc('');
    setProdImage('');
    setProdStock(20);
    setProdWeights('0.5 kg, 1 kg, 2 kg');
    setProdFlavours('Chocolate, Vanilla');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.categoryId);
    setProdPrice(prod.basePrice);
    setProdDesc(prod.description);
    setProdImage(prod.image);
    setProdStock(prod.stock);
    setProdWeights(prod.supportedWeights.join(', '));
    setProdFlavours(prod.supportedFlavours.join(', '));
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightsArr = prodWeights.split(',').map((s) => s.trim()).filter(Boolean);
    const flavoursArr = prodFlavours.split(',').map((s) => s.trim()).filter(Boolean);
    const catName = categories.find((c) => c.id === prodCategory)?.name || 'Cakes';

    const payload: Partial<Product> = {
      name: prodName.trim(),
      categoryId: prodCategory,
      categoryName: catName,
      basePrice: Number(prodPrice),
      description: prodDesc.trim(),
      image: prodImage.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      stock: Number(prodStock),
      supportedWeights: weightsArr.length > 0 ? weightsArr : ['0.5 kg', '1 kg'],
      supportedFlavours: flavoursArr.length > 0 ? flavoursArr : ['Chocolate', 'Vanilla'],
    };

    if (editingProduct) {
      await onUpdateProduct(editingProduct.id, payload);
    } else {
      await onCreateProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  // -------------------------------------------------------------
  // VIEW 1: SEPARATE ADMIN LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#111113] flex flex-col justify-between text-[#f0f0f0]">
        {/* Top Header */}
        <header className="bg-[#161618] text-[#f0f0f0] py-4 px-6 border-b border-[rgba(240,240,240,0.1)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="font-syne font-extrabold text-xl uppercase tracking-tight text-[#f0f0f0]">
                THE BAKER'S CORNER
              </div>
              <span className="font-mono text-[10px] text-[#d48b7a] uppercase tracking-widest pl-2 border-l border-[rgba(240,240,240,0.15)]">
                Staff Atelier
              </span>
            </div>

            <button
              onClick={onReturnToStore}
              className="px-4 py-2 bg-[#1a1a1c] hover:bg-[#d48b7a] hover:text-[#111113] font-mono text-xs uppercase font-bold transition-all flex items-center gap-2 border border-[rgba(240,240,240,0.15)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Store</span>
            </button>
          </div>
        </header>

        {/* Center Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
          <div className="bg-[#1a1a1c] max-w-md w-full p-8 border border-[rgba(240,240,240,0.15)] shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#111113] border border-[rgba(240,240,240,0.15)] text-[#d48b7a] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="font-syne text-2xl font-extrabold uppercase text-[#f0f0f0]">
                Administrator Portal
              </h1>
              <p className="font-mono text-[11px] uppercase text-[#f0f0f0]/60 max-w-xs mx-auto">
                Authorized staff login for kitchen tickets, inventory controls, and order dispatch.
              </p>
            </div>

            {loginError && (
              <div className="bg-red-950/60 text-red-300 p-3.5 border border-red-800 font-mono text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="pb-1 border-b border-[rgba(240,240,240,0.1)]">
              <span className="font-mono text-[10px] font-bold text-[#d48b7a] uppercase tracking-wider">
                Admin Authentication
              </span>
            </div>

            <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-[#f0f0f0]/80 block mb-1 uppercase">
                  Administrator Email *
                </label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="Enter administrator email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                />
              </div>

              <div>
                <label className="text-[#f0f0f0]/80 block mb-1 uppercase">
                  Administrator Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#f0f0f0]/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#111113]" />
                      <span>Log In to Admin Portal</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-[rgba(240,240,240,0.1)] text-center">
              <button
                type="button"
                onClick={onReturnToStore}
                className="font-mono text-xs text-[#d48b7a] hover:underline uppercase font-bold"
              >
                ← Back to Customer Storefront
              </button>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center font-mono text-[11px] text-[#f0f0f0]/40 uppercase border-t border-[rgba(240,240,240,0.1)]">
          The Baker’s Corner Management Systems · Confirmed Access Only
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DEDICATED ADMIN DASHBOARD PAGE (Authenticated)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#111113] text-[#f0f0f0] flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#161618] text-[#f0f0f0] border-b border-[rgba(240,240,240,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="font-syne font-extrabold text-xl uppercase tracking-tight text-[#f0f0f0]">
              THE BAKER'S CORNER
            </div>
            <div className="pl-3 border-l border-[rgba(240,240,240,0.15)] font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#d48b7a] uppercase">Admin Console</span>
              </div>
              <span className="text-[10px] text-[#f0f0f0]/60 uppercase">
                Logged in as: <strong className="text-white">{adminUser.fullName || 'Executive Administrator'}</strong> · Executive Chef
              </span>
            </div>
          </div>

          {/* Action buttons: Storefront & Logout */}
          <div className="flex items-center gap-3 font-mono text-xs uppercase">
            <button
              onClick={onReturnToStore}
              className="px-4 py-2 bg-[#1a1a1c] hover:bg-[#d48b7a] hover:text-[#111113] text-[#f0f0f0] font-bold transition-all flex items-center gap-1.5 border border-[rgba(240,240,240,0.15)]"
            >
              <Cake className="w-3.5 h-3.5" />
              <span>Customer Store</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="px-4 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)]">
            <span className="font-mono text-[10px] text-[#f0f0f0]/60 uppercase tracking-widest block">
              Total Sales Volume
            </span>
            <p className="font-syne text-2xl font-extrabold text-[#d48b7a] tabular-nums mt-1">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <span className="font-mono text-[10px] text-emerald-400 uppercase">Live orders combined</span>
          </div>

          <div className="bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)]">
            <span className="font-mono text-[10px] text-[#f0f0f0]/60 uppercase tracking-widest block">
              Total Order Tickets
            </span>
            <p className="font-syne text-2xl font-extrabold text-[#f0f0f0] tabular-nums mt-1">
              {totalOrders}
            </p>
            <span className="font-mono text-[10px] text-[#f0f0f0]/50 uppercase">Recorded in database</span>
          </div>

          <div className="bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)]">
            <span className="font-mono text-[10px] text-[#f0f0f0]/60 uppercase tracking-widest block">
              Active In Kitchen
            </span>
            <p className="font-syne text-2xl font-extrabold text-amber-400 tabular-nums mt-1">
              {pendingKitchenOrders}
            </p>
            <span className="font-mono text-[10px] text-amber-400/80 uppercase">Pending or Preparing</span>
          </div>

          <div className="bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)]">
            <span className="font-mono text-[10px] text-[#f0f0f0]/60 uppercase tracking-widest block">
              Low Stock Cakes
            </span>
            <p className="font-syne text-2xl font-extrabold text-red-400 tabular-nums mt-1">
              {lowStockCakes.length}
            </p>
            <span className="font-mono text-[10px] text-red-400/80 uppercase">Requires fresh bake</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#1a1a1c] p-1.5 border border-[rgba(240,240,240,0.1)] flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 font-mono text-xs uppercase font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#d48b7a] text-[#111113]'
                : 'text-[#f0f0f0]/70 hover:text-white'
            }`}
          >
            Orders & Cake Messages ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 font-mono text-xs uppercase font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-[#d48b7a] text-[#111113]'
                : 'text-[#f0f0f0]/70 hover:text-white'
            }`}
          >
            Cake Catalogue & Stock ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 font-mono text-xs uppercase font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#d48b7a] text-[#111113]'
                : 'text-[#f0f0f0]/70 hover:text-white'
            }`}
          >
            Sales & Analytics
          </button>
        </div>

        {/* TAB 1: ORDERS & CAKE MESSAGES */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-[#1a1a1c] p-4 border border-[rgba(240,240,240,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#f0f0f0]/50 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search order #, customer, message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#d48b7a]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] uppercase focus:outline-none font-bold"
                >
                  <option value="all" className="bg-[#111113]">All Order Statuses</option>
                  <option value="Pending" className="bg-[#111113]">Pending</option>
                  <option value="Confirmed" className="bg-[#111113]">Confirmed</option>
                  <option value="Preparing" className="bg-[#111113]">Preparing in Kitchen</option>
                  <option value="Out for Delivery" className="bg-[#111113]">Out for Delivery</option>
                  <option value="Delivered" className="bg-[#111113]">Delivered</option>
                  <option value="Cancelled" className="bg-[#111113]">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Feed */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-[#1a1a1c] p-12 text-center border border-[rgba(240,240,240,0.1)] space-y-2">
                  <ShoppingBag className="w-10 h-10 text-[#d48b7a] opacity-40 mx-auto" />
                  <h3 className="font-syne text-base font-bold uppercase text-[#f0f0f0]">No orders found</h3>
                  <p className="font-mono text-xs uppercase text-[#f0f0f0]/50">Try resetting your filter or search keywords.</p>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#1a1a1c] p-6 border border-[rgba(240,240,240,0.1)] space-y-5"
                  >
                    {/* Header: Order info & Status Updater */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[rgba(240,240,240,0.1)] gap-4 font-mono text-xs">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-syne text-lg font-bold text-[#f0f0f0]">
                            Order #{ord.orderNumber}
                          </span>
                          <span className="text-[#f0f0f0]/50">
                            · {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[#f0f0f0]/70 mt-1">
                          Customer: <strong className="text-white">{ord.customerName}</strong> · Phone: {ord.customerPhone} · Email: {ord.customerEmail}
                        </p>
                        <p className="text-[#f0f0f0]/70 mt-0.5">
                          Delivery: <strong className="text-[#d48b7a]">{ord.deliveryDate}</strong> · Slot: {ord.deliveryTimeSlot}
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2.5 bg-[#111113] p-2 border border-[rgba(240,240,240,0.15)] shrink-0">
                        <span className="font-bold text-[#d48b7a] pl-1 uppercase">Status:</span>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 bg-[#1a1a1c] border border-[#d48b7a] font-mono text-xs font-bold text-[#f0f0f0] uppercase focus:outline-none"
                        >
                          <option value="Pending" className="bg-[#111113]">Pending</option>
                          <option value="Confirmed" className="bg-[#111113]">Confirmed</option>
                          <option value="Preparing" className="bg-[#111113]">Preparing in Kitchen</option>
                          <option value="Out for Delivery" className="bg-[#111113]">Out for Delivery</option>
                          <option value="Delivered" className="bg-[#111113]">Delivered</option>
                          <option value="Cancelled" className="bg-[#111113]">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Cake Customization Tickets */}
                    <div className="space-y-3">
                      <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#d48b7a]">
                        Kitchen Production Tickets ({ord.items.length} cakes):
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ord.items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-[#111113] p-4 border border-[rgba(240,240,240,0.1)] space-y-2.5 font-mono text-xs"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h5 className="font-syne text-sm font-bold uppercase text-[#f0f0f0]">
                                  {item.productName} × {item.quantity}
                                </h5>
                                <p className="text-[10px] text-[#f0f0f0]/60 uppercase mt-0.5">
                                  <span>Occasion:</span> {item.customization.occasion} · {item.customization.weight} · {item.customization.flavour}
                                  {item.customization.isEggless ? ' (100% Eggless)' : ' (With Egg)'}
                                </p>
                              </div>
                              <span className="font-syne font-bold text-xs tabular-nums text-[#d48b7a] shrink-0">
                                ₹{item.itemSubtotal}
                              </span>
                            </div>

                            {/* Prominent Cake Message Box */}
                            <div className="bg-[#1a1a1c] p-3 border border-[rgba(240,240,240,0.2)] space-y-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#d48b7a] flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Message Piped On Cake:</span>
                              </span>
                              {item.customization.hasMessage && item.customization.cakeMessage ? (
                                <p className="font-syne text-sm font-bold text-white leading-snug">
                                  &ldquo;{item.customization.cakeMessage}&rdquo;
                                </p>
                              ) : (
                                <p className="text-xs text-[#f0f0f0]/40 italic">
                                  No message requested by customer
                                </p>
                              )}
                            </div>

                            {item.customization.specialInstructions && (
                              <p className="text-[10px] text-[#f0f0f0]/70 bg-[#1a1a1c] p-2">
                                <strong>Baking Note:</strong> {item.customization.specialInstructions}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom shipping and payment details */}
                    <div className="pt-3 border-t border-[rgba(240,240,240,0.1)] flex flex-col sm:flex-row justify-between font-mono text-xs text-[#f0f0f0]/60 gap-2">
                      <div>
                        <strong className="text-white uppercase">Destination: </strong>
                        <span>
                          {ord.shippingAddress.streetAddress}, {ord.shippingAddress.city} - {ord.shippingAddress.pincode}
                        </span>
                      </div>
                      <div>
                        <strong className="text-white uppercase">Billing: </strong>
                        <span className="text-[#d48b7a] font-bold">
                          ₹{ord.grandTotal.toLocaleString('en-IN')}
                        </span>{' '}
                        <span>via {ord.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid Card/UPI'} ({ord.paymentStatus})</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CAKE CATALOG & INVENTORY */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1a1c] p-5 border border-[rgba(240,240,240,0.1)]">
              <div>
                <h3 className="font-syne text-lg font-bold uppercase text-[#f0f0f0]">
                  Bakery Menu & Cake Inventory
                </h3>
                <p className="font-mono text-xs uppercase text-[#f0f0f0]/50">
                  Update weights, base pricing, available flavours, and stock counts
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono text-xs uppercase font-bold flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4 text-[#111113]" />
                <span>Add New Cake</span>
              </button>
            </div>

            <div className="bg-[#1a1a1c] border border-[rgba(240,240,240,0.1)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-[#f0f0f0]">
                  <thead className="bg-[#161618] border-b border-[rgba(240,240,240,0.1)] text-[#d48b7a] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-4">Cake</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Base Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Weights</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(240,240,240,0.08)]">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#111113] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden shrink-0 bg-[#111113] border border-[rgba(240,240,240,0.15)]">
                            <CakeFallbackImage src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-syne font-bold uppercase text-sm block text-white">{prod.name}</span>
                            <span className="text-[10px] text-[#f0f0f0]/50 uppercase">
                              {prod.supportedFlavours.join(', ')}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-[#f0f0f0]/70 uppercase">{prod.categoryName}</td>
                        <td className="p-4 font-bold text-[#d48b7a] tabular-nums">₹{prod.basePrice}</td>
                        <td className="p-4">
                          <span
                            className={`font-bold tabular-nums px-2.5 py-1 text-[10px] uppercase border ${
                              prod.stock <= 10
                                ? 'bg-red-950/60 text-red-300 border-red-800'
                                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            }`}
                          >
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="p-4 text-[#f0f0f0]/60 uppercase">{prod.supportedWeights.join(', ')}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-2 text-[#f0f0f0]/70 hover:text-[#d48b7a] hover:bg-[#111113] transition-colors"
                              title="Edit cake"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(prod.id)}
                              className="p-2 text-[#f0f0f0]/70 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                              title="Delete cake"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SALES & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1c] p-6 border border-[rgba(240,240,240,0.1)] space-y-4">
              <h3 className="font-syne text-base font-bold uppercase text-[#f0f0f0] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#d48b7a]" />
                <span>Financial Highlights</span>
              </h3>
              <div className="space-y-2.5 font-mono text-xs text-[#f0f0f0]/80">
                <div className="flex justify-between p-3 bg-[#111113] border border-[rgba(240,240,240,0.1)]">
                  <span>Gross Order Value</span>
                  <strong className="text-[#d48b7a] tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between p-3 bg-[#111113] border border-[rgba(240,240,240,0.1)]">
                  <span>Average Ticket Size</span>
                  <strong className="text-white tabular-nums">
                    ₹{totalOrders ? Math.round(totalRevenue / totalOrders).toLocaleString('en-IN') : 0}
                  </strong>
                </div>
                <div className="flex justify-between p-3 bg-[#111113] border border-[rgba(240,240,240,0.1)]">
                  <span>Cash on Delivery Orders</span>
                  <strong className="text-white tabular-nums">
                    {orders.filter((o) => o.paymentMethod === 'COD').length}
                  </strong>
                </div>
                <div className="flex justify-between p-3 bg-[#111113] border border-[rgba(240,240,240,0.1)]">
                  <span>Prepaid Card/UPI Orders</span>
                  <strong className="text-white tabular-nums">
                    {orders.filter((o) => o.paymentMethod !== 'COD').length}
                  </strong>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1c] p-6 border border-[rgba(240,240,240,0.1)] space-y-4">
              <h3 className="font-syne text-base font-bold uppercase text-[#f0f0f0] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#d48b7a]" />
                <span>Production Metrics</span>
              </h3>
              <div className="space-y-2.5 font-mono text-xs text-[#f0f0f0]/80">
                <div className="flex justify-between p-3 bg-[#111113] border border-[rgba(240,240,240,0.1)]">
                  <span>Cakes with Piped Message</span>
                  <strong className="text-white tabular-nums">
                    {orders.reduce(
                      (count, o) => count + o.items.filter((i) => i.customization.hasMessage).length,
                      0
                    )}
                  </strong>
                </div>
                <div className="flex justify-between p-3 bg-[#111113] border border-[rgba(240,240,240,0.1)]">
                  <span>100% Eggless Sponges Ordered</span>
                  <strong className="text-white tabular-nums">
                    {orders.reduce(
                      (count, o) => count + o.items.filter((i) => i.customization.isEggless).length,
                      0
                    )}
                  </strong>
                </div>
                <div className="flex justify-between p-3 bg-[#111113] border border-[rgba(240,240,240,0.1)]">
                  <span>Admin Access Status</span>
                  <strong className="text-emerald-400">Authorized & Verified</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111113] text-[#f0f0f0] max-w-lg w-full p-6 border border-[rgba(240,240,240,0.2)] shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-[rgba(240,240,240,0.1)] pb-3">
              <h3 className="font-syne text-lg font-bold uppercase text-white">
                {editingProduct ? 'Edit Cake Details' : 'Add New Cake to Menu'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-[#f0f0f0]/60 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Cake Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-white focus:outline-none focus:border-[#d48b7a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-white focus:outline-none focus:border-[#d48b7a]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#111113]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-white focus:outline-none focus:border-[#d48b7a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-white focus:outline-none focus:border-[#d48b7a]"
                />
              </div>

              <div>
                <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-white font-sans focus:outline-none focus:border-[#d48b7a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Inventory Stock</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-white focus:outline-none focus:border-[#d48b7a]"
                  />
                </div>
                <div>
                  <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Supported Weights</label>
                  <input
                    type="text"
                    value={prodWeights}
                    onChange={(e) => setProdWeights(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-white focus:outline-none focus:border-[#d48b7a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#f0f0f0]/80 block mb-1 uppercase">Supported Flavours</label>
                <input
                  type="text"
                  value={prodFlavours}
                  onChange={(e) => setProdFlavours(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-white focus:outline-none focus:border-[#d48b7a]"
                />
              </div>

              <div className="pt-3 border-t border-[rgba(240,240,240,0.1)] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[rgba(240,240,240,0.2)] text-[#f0f0f0]/70 uppercase font-bold hover:bg-[#1a1a1c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-bold uppercase"
                >
                  Save Cake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
