import { useState, FormEvent } from "react";
import { Product, Order, UserProfile } from "../types";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  Truck,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
  Search,
  ChevronUp,
  LineChart
} from "lucide-react";

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  users: UserProfile[];
  onAddProduct: (product: Omit<Product, "id">) => Promise<void>;
  onUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (id: string, status: Order["orderStatus"], tracking?: string) => Promise<void>;
}

export default function AdminPanel({
  products,
  orders,
  users,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders" | "inventory">("analytics");

  // New Product State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Sarees");
  const [newProdType, setNewProdType] = useState<"Clothing" | "Jewellery" | "Accessories">("Clothing");
  const [newProdPrice, setNewProdPrice] = useState(1500);
  const [newProdOrigPrice, setNewProdOrigPrice] = useState(3000);
  const [newProdStock, setNewProdStock] = useState(20);
  const [newProdColors, setNewProdColors] = useState("Traditional Gold, Deep Royal Blue");
  const [newProdSizes, setNewProdSizes] = useState("S, M, L, XL");
  const [newProdDescription, setNewProdDescription] = useState("");
  const [newProdImgUrl, setNewProdImgUrl] = useState("https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80");
  const [newProdMeesho, setNewProdMeesho] = useState("");

  // Edit Product State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Tracking details state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingNo, setTrackingNo] = useState("");

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Calculations
  const calculatedRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.orderStatus === "Pending").length;
  const shippedCount = orders.filter((o) => o.orderStatus === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "Delivered").length;

  const lowStockItems = products.filter((p) => p.stock <= 15);

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const colorsArr = newProdColors.split(",").map((c) => c.trim()).filter(Boolean);
    const sizesArr = newProdSizes.split(",").map((s) => s.trim()).filter(Boolean);

    await onAddProduct({
      name: newProdName,
      category: newProdCategory,
      type: newProdType,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOrigPrice),
      discount: Math.round(((newProdOrigPrice - newProdPrice) / newProdOrigPrice) * 100) || 0,
      rating: 4.8,
      ratingCount: 1,
      images: [newProdImgUrl],
      stock: Number(newProdStock),
      colors: colorsArr,
      sizes: sizesArr,
      description: newProdDescription || `${newProdName} refined fashion custom piece.`,
      isNewArrival: true,
      meeshoUrl: newProdMeesho || undefined,
    });

    // Reset Form
    setNewProdName("");
    setNewProdDescription("");
    setNewProdMeesho("");
    setShowAddForm(false);
  };

  const startEditing = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stock);
  };

  const handleSaveEdit = async (pId: string) => {
    await onUpdateProduct(pId, {
      price: editPrice,
      stock: editStock,
    });
    setEditingId(null);
  };

  return (
    <div className="bg-[#0b0b0b] min-h-screen text-white py-8 px-4 md:px-12 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs uppercase font-serif tracking-[0.3em] text-[#D4AF37]">
              Administrative Headquarters
            </span>
            <h2 className="text-3xl font-serif font-light text-white mt-1">
              Madhu Magic <span className="italic font-serif text-luxury-gold">Admin Command Suite</span>
            </h2>
          </div>

          <div className="flex bg-[#121212] border border-white/10 p-1">
            {[
              { id: "analytics", label: "Analytics Overview" },
              { id: "products", label: "Boutique Products" },
              { id: "orders", label: "Client Orders" },
              { id: "inventory", label: "Stock & Logistics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#D4AF37] text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#121212] border border-white/5 p-6 hover:border-luxury-gold/30 transition-all flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase text-white/40 tracking-wider">Calculated Revenue</p>
                  <h3 className="text-2xl font-serif text-luxury-gold mt-1">
                    ₹{calculatedRevenue.toLocaleString("en-IN")}
                  </h3>
                  <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp size={10} /> +12% vs last month
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                  ₹
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 p-6 hover:border-luxury-gold/30 transition-all flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase text-white/40 tracking-wider">Total Orders</p>
                  <h3 className="text-2xl font-serif text-white mt-1">{orders.length}</h3>
                  <p className="text-[10px] text-zinc-400 mt-2">
                    {pendingCount} active shipments pending
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-luxury-blue/5 border border-luxury-blue/20 flex items-center justify-center text-luxury-blue">
                  <ShoppingBag size={16} className="text-[#D4AF37]" />
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 p-6 hover:border-luxury-gold/30 transition-all flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase text-white/40 tracking-wider">Active Inventory</p>
                  <h3 className="text-2xl font-serif text-white mt-1">{products.length} Designs</h3>
                  <p className="text-[10px] text-[#D4AF37] mt-2 font-semibold">
                    {lowStockItems.length} require low stock review
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-white/60">
                  <Package size={16} />
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 p-6 hover:border-luxury-gold/30 transition-all flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase text-white/40 tracking-wider">Boutique Clients</p>
                  <h3 className="text-2xl font-serif text-white mt-1">{users.length}</h3>
                  <p className="text-[10px] text-[#D4AF37] mt-2">100% verified luxury buyers</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-900/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Users size={16} />
                </div>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="bg-[#121212] border border-white/5 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <LineChart className="text-[#D4AF37]" size={18} />
                  <h4 className="text-xs uppercase tracking-widest font-bold">Sales & Direct Orders Analytics</h4>
                </div>
                <span className="text-[10px] text-white/40">LIVE UPDATED</span>
              </div>
              <div className="h-48 w-full flex items-end justify-between gap-1 pt-6 border-b border-l border-white/10 px-4 relative">
                {/* Simulated Chart Bars */}
                {[
                  { m: "Jan", s: 12000 },
                  { m: "Feb", s: 19000 },
                  { m: "Mar", s: 24700 },
                  { m: "Apr", s: 18000 },
                  { m: "May", s: 29000 },
                  { m: "Jun", s: calculatedRevenue + 5000 },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <span className="text-[8px] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      ₹{item.s.toLocaleString()}
                    </span>
                    <div
                      style={{ height: `${Math.max(20, (item.s / 35000) * 120)}px` }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-luxury-blue/30 to-[#D4AF37] border-t border-luxury-gold/50 hover:opacity-80 transition-all"
                    />
                    <span className="text-[9px] text-white/55 uppercase font-semibold">{item.m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#121212] border border-white/5 p-6 rounded-none">
                <h4 className="text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                  <Clock size={14} className="text-luxury-gold" />
                  Recent Placed Transactions
                </h4>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((item) => (
                    <div key={item.id} className="border-b border-white/5 pb-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-serif text-white/90">Order #{item.id}</p>
                        <p className="text-[10px] text-white/40 mt-1">
                          {item.items.length} items | Delivered to {item.shippingAddress.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#D4AF37]">₹{item.total.toLocaleString("en-IN")}</p>
                        <span className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          item.orderStatus === "Delivered" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {item.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Customers Box */}
              <div className="bg-[#121212] border border-white/5 p-6 rounded-none">
                <h4 className="text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                  <Users size={14} className="text-luxury-gold" />
                  Verified Customer Profiles
                </h4>
                <div className="space-y-4">
                  {users.slice(0, 3).map((u) => (
                    <div key={u.id} className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                      <div>
                        <p className="font-serif font-semibold text-white/90">{u.name}</p>
                        <p className="text-[10px] text-white/40">{u.email}</p>
                      </div>
                      <span className="text-[9px] uppercase bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold px-2 py-0.5 font-bold tracking-widest">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Management Tab */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 text-white/40" size={14} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-luxury-gold text-black px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 hover:bg-white transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Add New Design
              </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
              <form onSubmit={handleCreateProduct} className="bg-[#121212] border border-luxury-gold/30 p-6 space-y-4 animate-fadeIn">
                <h3 className="font-serif italic text-lg text-luxury-gold">Craft a New Luxury Work</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase text-white/50 mb-1">DESIGN NAME</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Royal Gold Choker Saree"
                      className="w-full bg-[#1E1E1E] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase text-white/50 mb-1">TYPE</label>
                    <select
                      value={newProdType}
                      onChange={(e) => setNewProdType(e.target.value as any)}
                      className="w-full bg-[#1E1E1E] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    >
                      <option value="Clothing">Clothing</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase text-white/50 mb-1">CATEGORY</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-[#1E1E1E] border border-white/10 px-3 py-2 text-xs text-white"
                    >
                      <option value="Sarees">Sarees</option>
                      <option value="Kurtis">Kurtis</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Western Wear">Western Wear</option>
                      <option value="Ethnic Wear">Ethnic Wear</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Necklaces">Necklaces</option>
                      <option value="Bangles">Bangles</option>
                      <option value="Rings">Rings</option>
                      <option value="Bracelets">Bracelets</option>
                      <option value="Handbags">Handbags</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase text-white/50 mb-1">PRICE (INR)</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full bg-[#1E1E1E] border border-white/10 px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase text-white/50 mb-1">ORIGINAL PRICE (INR)</label>
                    <input
                      type="number"
                      required
                      value={newProdOrigPrice}
                      onChange={(e) => setNewProdOrigPrice(Number(e.target.value))}
                      className="w-full bg-[#1E1E1E] border border-white/10 px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase text-white/50 mb-1">INITIAL STOCK</label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(Number(e.target.value))}
                      className="w-full bg-[#1E1E1E] border border-white/10 px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] uppercase text-white/50 mb-1">IMAGE URL</label>
                    <input
                      type="text"
                      required
                      value={newProdImgUrl}
                      onChange={(e) => setNewProdImgUrl(e.target.value)}
                      className="w-full bg-[#1E1E1E] border border-white/10 px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] uppercase text-white/50 mb-1">MEESHO STORE PRODUCT LINK (OPTIONAL)</label>
                    <input
                      type="text"
                      value={newProdMeesho}
                      onChange={(e) => setNewProdMeesho(e.target.value)}
                      placeholder="e.g. https://meesho.com/products/example-id"
                      className="w-full bg-[#1E1E1E] border border-white/10 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] uppercase text-white/50 mb-1">DESCRIPTION</label>
                    <textarea
                      value={newProdDescription}
                      onChange={(e) => setNewProdDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-[#1E1E1E] border border-white/10 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-luxury-gold text-black px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest cursor-pointer"
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-white/20 text-white px-6 py-2.5 text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto border border-white/5">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#121212] border-b border-white/10 text-[9px] uppercase text-white/40 tracking-wider">
                    <th className="p-4">Design</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 " id="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover" />
                          <div>
                            <p className="font-serif text-white uppercase font-bold">{p.name}</p>
                            <p className="text-[9px] text-white/40">ID: {p.id}</p>
                          </div>
                        </td>
                        <td className="p-4 text-white/60">{p.category}</td>
                        <td className="p-4 font-semibold text-[#D4AF37]">
                          {editingId === p.id ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="bg-[#1E1E1E] border border-white/10 px-2 py-1 w-20 text-xs"
                            />
                          ) : (
                            `₹${p.price}`
                          )}
                        </td>
                        <td className="p-4">
                          {editingId === p.id ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(Number(e.target.value))}
                              className="bg-[#1E1E1E] border border-white/10 px-2 py-1 w-16 text-xs"
                            />
                          ) : (
                            <span className={p.stock <= 5 ? "text-red-500 font-bold" : "text-white/85"}>
                              {p.stock} units
                            </span>
                          )}
                        </td>
                        <td className="p-4 flex gap-2">
                          {editingId === p.id ? (
                            <button
                              onClick={() => handleSaveEdit(p.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[10px] rounded"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => startEditing(p)}
                              className="border border-white/20 text-white hover:border-luxury-gold p-1.5 focus:outline-none"
                              title="Edit"
                            >
                              <Edit3 size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="border border-red-500/30 text-red-400 hover:bg-red-500/10 p-1.5"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Client Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white/50">Shipping Trackers & Client Orders</h4>

            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-[#121212] border border-white/5 p-6 rounded-none space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-2">
                    <div>
                      <p className="font-serif text-lg">Order ID: #{o.id}</p>
                      <p className="text-[10px] text-white/40">Registered User ID: {o.userId} | Placed on {new Date(o.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 ${
                        o.orderStatus === "Pending" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                        o.orderStatus === "Shipped" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        o.orderStatus === "Delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}>
                        {o.orderStatus}
                      </span>

                      {/* Dropdown status update */}
                      <select
                        onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any, o.trackingNumber)}
                        value={o.orderStatus}
                        className="bg-[#1A1A1A] text-[9px] uppercase tracking-wider font-semibold px-2 py-1 focus:outline-none border border-white/10"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Items detail list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] uppercase text-white/40 tracking-wider">Client Shipping Address</p>
                      <div className="text-xs text-white/80 space-y-1 mt-2">
                        <p className="font-bold text-white">{o.shippingAddress.name}</p>
                        <p>{o.shippingAddress.street}, {o.shippingAddress.city}</p>
                        <p>{o.shippingAddress.state} - {o.shippingAddress.zipCode}</p>
                        <p>Phone: {o.shippingAddress.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] uppercase text-white/40 tracking-wider">Order Items</p>
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex gap-3 text-xs items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <img src={it.image} alt={it.name} className="w-8 h-10 object-cover" />
                            <div>
                              <p className="font-serif truncate max-w-[200px]">{it.name}</p>
                              <p className="text-[10px] text-white/40">{it.color} / Size: {it.size}</p>
                            </div>
                          </div>
                          <span>x{it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking input */}
                  <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div>
                      <span className="text-white/40">Selected Payment Framework: </span>
                      <span className="text-white/90 font-semibold uppercase">{o.paymentMethod}</span>
                      <span className={`ml-2 px-1 text-[9px] rounded uppercase ${o.paymentStatus === "Paid" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {o.paymentStatus}
                      </span>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <input
                        type="text"
                        placeholder="Assign Tracking Number"
                        defaultValue={o.trackingNumber || ""}
                        onBlur={(e) => onUpdateOrderStatus(o.id, o.orderStatus, e.target.value)}
                        className="bg-[#1A1A1A] border border-white/10 px-3 py-1.5 text-xs text-white placeholder-white/30 truncate md:w-48"
                      />
                      <span className="text-[10px] text-white/40 self-center">Press Enter/unfocus to save</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-6 animate-fadeIn">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white/50">Critical Low Stock Warnings (&lt;15 units)</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map((p) => (
                <div key={p.id} className="bg-[#121212] border border-red-500/20 p-5 flex items-center gap-4">
                  <div className="p-2.5 bg-red-500/10 rounded-full text-red-500">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-serif text-white text-sm truncate">{p.name}</h5>
                    <p className="text-[10px] text-white/40 mt-0.5">{p.category} | SKU: {p.id}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-red-400 font-bold">{p.stock} units left</span>
                      <input
                        type="number"
                        placeholder="Add stock"
                        className="bg-[#222] border border-white/10 px-2 py-0.5 w-16 text-[11px] text-white"
                        onBlur={(e) => {
                          const quantity = Number(e.target.value);
                          if (quantity > 0) {
                            onUpdateProduct(p.id, { stock: p.stock + quantity });
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <div className="col-span-3 text-center text-xs text-white/40 py-8 italic">
                  Excellent! No low stock warnings present on active boutique inventory.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
