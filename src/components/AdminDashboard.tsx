import React, { useState } from 'react';
import {
  X,
  Package,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Search,
  Filter,
} from 'lucide-react';
import type { Order, Product, Category, OrderStatus } from '../types/bakery';
import { CakeFallbackImage } from './CakeFallbackImage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: Product[];
  categories: Category[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onCreateProduct: (productData: Partial<Product>) => Promise<void>;
  onUpdateProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  products,
  categories,
  onUpdateOrderStatus,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'stats'>('orders');

  // Order filter
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Product form fields
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(categories[0]?.id || 'cat-1');
  const [prodPrice, setProdPrice] = useState(599);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState(25);
  const [prodWeights, setProdWeights] = useState('0.5 kg, 1 kg, 2 kg');
  const [prodFlavours, setProdFlavours] = useState('Chocolate, Vanilla, Truffle');

  // Stats calculation
  const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Preparing'
  ).length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.items.some((i) => i.customization.cakeMessage?.toLowerCase().includes(orderSearch.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories[0]?.id || 'cat-1');
    setProdPrice(599);
    setProdDesc('Artisanal bakery creation made fresh to order.');
    setProdImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80');
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
    const payload: Partial<Product> = {
      name: prodName,
      categoryId: prodCategory,
      basePrice: Number(prodPrice),
      description: prodDesc,
      image: prodImage,
      stock: Number(prodStock),
      supportedWeights: prodWeights.split(',').map((w) => w.trim()).filter(Boolean),
      supportedFlavours: prodFlavours.split(',').map((f) => f.trim()).filter(Boolean),
    };

    if (editingProduct) {
      await onUpdateProduct(editingProduct.id, payload);
    } else {
      await onCreateProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-6xl w-full overflow-hidden shadow-2xl border border-[#EADCCE] my-6 flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EADCCE] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2C1810] text-[#FAF7F2] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#E8C2B0]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#966147] font-semibold">
                Bakery Operations Control
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C1810]">
                Admin Management Console
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#785949] hover:text-[#2C1810] hover:bg-[#F2E5D8] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#F5EBE6] px-6 py-2.5 border-b border-[#EADCCE] flex items-center gap-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#2C1810] text-[#FAF7F2] shadow-xs'
                : 'text-[#4A2818] hover:text-[#2C1810]'
            }`}
          >
            Orders & Cake Messages ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'products'
                ? 'bg-[#2C1810] text-[#FAF7F2] shadow-xs'
                : 'text-[#4A2818] hover:text-[#2C1810]'
            }`}
          >
            Product Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'stats'
                ? 'bg-[#2C1810] text-[#FAF7F2] shadow-xs'
                : 'text-[#4A2818] hover:text-[#2C1810]'
            }`}
          >
            Sales Analytics
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1">
          {/* Top KPI Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#EADCCE] shadow-xs">
              <span className="text-[11px] text-[#785949] uppercase tracking-wider block">Total Revenue</span>
              <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums mt-1">
                ₹{totalSales.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#EADCCE] shadow-xs">
              <span className="text-[11px] text-[#785949] uppercase tracking-wider block">Total Orders</span>
              <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums mt-1">
                {totalOrdersCount}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#EADCCE] shadow-xs">
              <span className="text-[11px] text-[#785949] uppercase tracking-wider block">Pending / Kitchen</span>
              <p className="font-serif text-2xl font-bold text-amber-700 tabular-nums mt-1">
                {pendingOrdersCount}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#EADCCE] shadow-xs">
              <span className="text-[11px] text-[#785949] uppercase tracking-wider block">Low Stock Alerts</span>
              <p className="font-serif text-2xl font-bold text-red-600 tabular-nums mt-1">
                {lowStockProducts.length}
              </p>
            </div>
          </div>

          {/* TAB 1: ORDERS & CAKE MESSAGES */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EADCCE]">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#785949] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search order #, customer, message..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#FAF7F2] border border-[#D5C2B1] rounded-xl text-xs text-[#2C1810]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-[#785949]" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#FAF7F2] border border-[#D5C2B1] rounded-xl text-xs text-[#2C1810]"
                  >
                    <option value="all">All Order Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing in Kitchen</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Cards */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <p className="text-center py-8 text-xs text-[#785949]">No orders matching criteria.</p>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl p-5 border border-[#EADCCE] shadow-xs space-y-4"
                    >
                      {/* Top Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2E5D8] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#2C1810]">#{ord.orderNumber}</span>
                            <span className="text-xs text-[#785949]">
                              Customer: <strong>{ord.customerName}</strong> ({ord.customerPhone})
                            </span>
                          </div>
                          <p className="text-[11px] text-[#785949] mt-0.5">
                            Delivery: <strong>{ord.deliveryDate}</strong> · Slot: {ord.deliveryTimeSlot} · Address: {ord.shippingAddress.streetAddress}, {ord.shippingAddress.city}
                          </p>
                        </div>

                        {/* Status dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#785949]">Update Status:</span>
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="px-3 py-1.5 bg-[#FAF7F2] border border-[#2C1810] rounded-xl text-xs font-bold text-[#2C1810]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing in Kitchen</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items and Custom Cake Message Highlights */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-[#785949] uppercase tracking-wider">
                          Bakery Production Tickets:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {ord.items.map((it) => (
                            <div
                              key={it.id}
                              className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EADCCE] space-y-1.5"
                            >
                              <div className="flex justify-between font-bold text-xs text-[#2C1810]">
                                <span>{it.productName} × {it.quantity}</span>
                                <span className="tabular-nums">₹{it.itemSubtotal}</span>
                              </div>
                              <p className="text-[11px] text-[#785949]">
                                <strong>Custom:</strong> {it.customization.occasion} · {it.customization.weight} · {it.customization.flavour}
                                {it.customization.isEggless ? ' (100% Eggless)' : ''}
                              </p>

                              {/* Highlighted Cake Message Box */}
                              <div className="bg-white p-2.5 rounded-lg border border-[#D5C2B1] mt-1">
                                <span className="text-[10px] uppercase font-bold text-[#966147] block flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Piped Cake Message:</span>
                                </span>
                                {it.customization.hasMessage && it.customization.cakeMessage ? (
                                  <p className="text-xs font-serif font-bold text-[#2C1810] mt-0.5">
                                    &ldquo;{it.customization.cakeMessage}&rdquo;
                                  </p>
                                ) : (
                                  <p className="text-xs text-[#785949] italic mt-0.5">
                                    Customer requested: No message written on cake
                                  </p>
                                )}
                              </div>

                              {it.customization.specialInstructions && (
                                <p className="text-[10px] text-[#785949] italic">
                                  Notes: {it.customization.specialInstructions}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT INVENTORY MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#EADCCE]">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#2C1810]">
                    Manage Cake Catalog & Inventory
                  </h3>
                  <span className="text-xs text-[#785949]">
                    Add, edit pricing, update stock, and modify flavor options
                  </span>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#2C1810] text-[#FAF7F2] rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1C0F0A]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Cake</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-[#EADCCE] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#2C1810]">
                    <thead className="bg-[#FAF7F2] border-b border-[#EADCCE] text-[#785949] font-bold">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Base Price</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Weights</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2E5D8]">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#FAF7F2]/50">
                          <td className="p-3 flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#EADCCE]">
                              <CakeFallbackImage src={prod.image} alt={prod.name} className="w-full h-full" />
                            </div>
                            <span className="font-semibold line-clamp-1">{prod.name}</span>
                          </td>
                          <td className="p-3 text-[#785949]">{prod.categoryName}</td>
                          <td className="p-3 font-bold tabular-nums">₹{prod.basePrice}</td>
                          <td className="p-3">
                            <span
                              className={`font-semibold tabular-nums ${
                                prod.stock <= 10 ? 'text-red-600' : 'text-emerald-700'
                              }`}
                            >
                              {prod.stock} units
                            </span>
                          </td>
                          <td className="p-3 text-[#785949]">{prod.supportedWeights.join(', ')}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-1.5 text-[#966147] hover:text-[#2C1810]"
                                title="Edit cake"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteProduct(prod.id)}
                                className="p-1.5 text-[#966147] hover:text-red-600"
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

          {/* TAB 3: STATS & ANALYTICS */}
          {activeTab === 'stats' && (
            <div className="bg-white p-6 rounded-2xl border border-[#EADCCE] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                Bakery Business Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#5A3825]">
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADCCE] space-y-2">
                  <h4 className="font-bold text-[#2C1810]">Revenue Metrics</h4>
                  <p>Average Order Value: ₹{totalOrdersCount ? Math.round(totalSales / totalOrdersCount) : 0}</p>
                  <p>Cash on Delivery Orders: {orders.filter((o) => o.paymentMethod === 'COD').length}</p>
                  <p>Online Prepaid Orders: {orders.filter((o) => o.paymentMethod !== 'COD').length}</p>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADCCE] space-y-2">
                  <h4 className="font-bold text-[#2C1810]">Customization Metrics</h4>
                  <p>
                    Orders With Custom Messages:{' '}
                    {orders.filter((o) => o.items.some((i) => i.customization.hasMessage)).length}
                  </p>
                  <p>
                    Eggless Cake Orders:{' '}
                    {orders.filter((o) => o.items.some((i) => i.customization.isEggless)).length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-6 border border-[#EADCCE] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EADCCE] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                {editingProduct ? 'Edit Cake' : 'Add New Cake to Menu'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-[#785949]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#2C1810] block mb-1">Cake Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#D5C2B1] text-[#2C1810]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#D5C2B1] text-[#2C1810]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#D5C2B1] text-[#2C1810]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#2C1810] block mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#D5C2B1] text-[#2C1810]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2C1810] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#D5C2B1] text-[#2C1810]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#D5C2B1] text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Supported Weights (comma-separated)</label>
                  <input
                    type="text"
                    value={prodWeights}
                    onChange={(e) => setProdWeights(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#D5C2B1] text-[#2C1810]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#2C1810] block mb-1">Supported Flavours (comma-separated)</label>
                <input
                  type="text"
                  value={prodFlavours}
                  onChange={(e) => setProdFlavours(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#D5C2B1] text-[#2C1810]"
                />
              </div>

              <div className="pt-3 border-t border-[#EADCCE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#D5C2B1] rounded-full text-[#785949]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C1810] text-[#FAF7F2] font-semibold rounded-full hover:bg-[#1C0F0A]"
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
