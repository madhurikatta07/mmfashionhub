import React, { useState, useEffect } from "react";
import { Product, CartItem, UserProfile, Order } from "./types";
import { INITIAL_PRODUCTS, TESTIMONIALS, FAQ_DATA } from "./data";
import ProductCard from "./components/ProductCard";
import AIStylist from "./components/AIStylist";
import AdminPanel from "./components/AdminPanel";
import BlogsAndFaqs from "./components/BlogsAndFaqs";

import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Instagram,
  Facebook,
  Youtube,
  Send,
  SlidersHorizontal,
  ChevronRight,
  User,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Check,
  CreditCard,
  Truck,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Award,
  ChevronLeft,
  Star as LucideStar
} from "lucide-react";

export default function App() {
  // Products, Orders, Users states synchronized with API backend
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<
    "shop" | "about" | "blog" | "contact" | "profile" | "admin"
  >("shop");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<"All" | "Clothing" | "Jewellery" | "Accessories">("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<"featured" | "priceLow" | "priceHigh" | "rating">("featured");
  const [filterTags, setFilterTags] = useState<{ bestseller?: boolean; newArrival?: boolean; trending?: boolean }>({});

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // discount percent
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Quick View product
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Login Modal / Registered State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authName, setAuthName] = useState("");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Simulated Payment Modal
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "payment" | "success">("cart");
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingStreet, setShippingStreet] = useState("");
  const [shippingCity, setShippingCity] = useState("Mumbai");
  const [shippingState, setShippingState] = useState("Maharashtra");
  const [shippingZip, setShippingZip] = useState("400001");
  const [selectedPayment, setSelectedPayment] = useState("UPI");
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Load backend products and active session orders on launch
  const syncData = async () => {
    try {
      const pRes = await fetch("/api/products");
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
      }
      const oRes = await fetch("/api/orders");
      if (oRes.ok) {
        const oData = await oRes.json();
        setOrders(oData);
      }
    } catch (err) {
      console.warn("Backend API sync failed, using static fallback context.", err);
    }
  };

  useEffect(() => {
    syncData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Hero backgrounds
  const HERO_SLIDES = [
    {
      title: "Elevate Your Style with Madhu Magic Hub",
      sub: "Discover premium handloom sarees, bespoke fine jewelry, and contemporary designer bags crafted to empower.",
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80",
    },
    {
      title: "Heritage Weaves & Timeless Pearls",
      sub: "Handcrafted Banarasi silk sarees & Maharaja Kundan choker necklaces for unmatched wedding and festive luxury.",
      img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80",
    },
    {
      title: "Chic Metropolitan Sovereignty",
      sub: "Double breasted blazers, high-slit velvet prom gowns, and crocodile embossed leather handbags styling you daily.",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1600&q=80",
    }
  ];

  // Auto Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Sync Search AutoComplete suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const match = products
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 4);
      setAutoCompleteSuggestions(match);
    } else {
      setAutoCompleteSuggestions([]);
    }
  }, [searchQuery, products]);

  // Filters & Sorting calculations
  const filteredProducts = products.filter((p) => {
    // Search
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // Type Filter
    if (selectedType !== "All" && p.type !== selectedType) return false;
    // Category Filter
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    // Price Filter
    if (p.price > priceRange) return false;
    // Tags
    if (filterTags.bestseller && !p.isBestseller) return false;
    if (filterTags.newArrival && !p.isNewArrival) return false;
    if (filterTags.trending && !p.isTrending) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceLow") return a.price - b.price;
    if (sortBy === "priceHigh") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // Default Featured
  });

  const uniqueCategories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  // Dynamic cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDiscountAmount = Math.round(cartSubtotal * (appliedDiscount / 100));
  const shippingCharge = cartSubtotal > 2000 || cartSubtotal === 0 ? 0 : 150;
  const gstTax = Math.round((cartSubtotal - cartDiscountAmount) * 0.05);
  const cartTotal = cartSubtotal - cartDiscountAmount + shippingCharge + gstTax;

  // Add item to cart
  const handleAddToCart = (product: Product, color: string, size: string, qty: number = 1) => {
    if (product.stock === 0) {
      showToast("Sorry, this design is currently sold out!");
      return;
    }
    const idx = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor === color &&
        item.selectedSize === size
    );
    if (idx !== -1) {
      const newCart = [...cart];
      newCart[idx].quantity += qty;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          product,
          selectedColor: color || product.colors[0] || "Standard",
          selectedSize: size || product.sizes[0] || "Standard",
          quantity: qty,
        },
      ]);
    }
    showToast(`Added ${product.name} to Cart.`);
  };

  // Remove / update item quantity
  const handleRemoveFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
  };

  const handleUpdateCartQty = (index: number, delta: number) => {
    const next = [...cart];
    next[index].quantity = Math.max(1, next[index].quantity + delta);
    setCart(next);
  };

  // Wishlisting
  const handleToggleWishlist = (product: Product) => {
    if (wishlist.includes(product.id)) {
      setWishlist(wishlist.filter((id) => id !== product.id));
      showToast(`Removed from private Lookbook Wishlist.`);
    } else {
      setWishlist([...wishlist, product.id]);
      showToast(`Saved to beautiful Lookbook Wishlist.`);
    }
  };

  // Coupon Engine
  const applyPromoCode = () => {
    if (couponCode.trim().toUpperCase() === "MAGICGOLD") {
      setAppliedDiscount(15);
      showToast("Promo MAGICGOLD applied! 15% discount subtracted.");
    } else {
      showToast("Invalid promo code. Try 'MAGICGOLD' for 15% Off.");
    }
  };

  // Place Order Action
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToast("Your boutique cart is empty!");
      return;
    }
    if (!shippingName || !shippingPhone || !shippingStreet) {
      showToast("Please provide all shipping name, phone, and street address details.");
      return;
    }

    const orderPayload = {
      userId: activeUser ? activeUser.id : "guest-user",
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
        image: item.product.images[0],
      })),
      couponCode: appliedDiscount > 0 ? "MAGICGOLD" : undefined,
      subtotal: cartSubtotal,
      discountAmount: cartDiscountAmount,
      shippingFee: shippingCharge,
      tax: gstTax,
      total: cartTotal,
      paymentMethod: selectedPayment,
      paymentStatus: selectedPayment === "Cash on Delivery" ? "Pending" : "Paid",
      orderStatus: "Pending",
      shippingAddress: {
        name: shippingName,
        phone: shippingPhone,
        street: shippingStreet,
        city: shippingCity,
        state: shippingState,
        zipCode: shippingZip,
        country: "India",
      },
      trackingNumber: `MM-${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const newlyCreatedOrder = await response.json();
        setLastPlacedOrder(newlyCreatedOrder);
        setOrders([newlyCreatedOrder, ...orders]);
        // Deduct inventory list stock levels locally as well
        const updatedProds = products.map((pr) => {
          const matchItem = cart.find((ct) => ct.product.id === pr.id);
          if (matchItem) {
            return { ...pr, stock: Math.max(0, pr.stock - matchItem.quantity) };
          }
          return pr;
        });
        setProducts(updatedProds);
        setCart([]);
        setAppliedDiscount(0);
        setCheckoutStep("success");
        showToast("Success! Your royal collection order is secure.");
      } else {
        throw new Error("Unable to log order at API side");
      }
    } catch (err) {
      console.warn("API write failed, logging order in-memory fallbacks.", err);
      // Fallback
      const fakeOrder: Order = {
        id: `order-fallback-${Date.now()}`,
        ...(orderPayload as any),
        createdAt: new Date().toISOString(),
      };
      setLastPlacedOrder(fakeOrder);
      setOrders([fakeOrder, ...orders]);
      setCart([]);
      setAppliedDiscount(0);
      setCheckoutStep("success");
    }
  };

  // Authentication Mock Client login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        setActiveUser(data.user);
        setIsLoginOpen(false);
        showToast(`Welcome back, ${data.user.name}!`);
        if (data.user.role === "admin") {
          setActiveTab("admin");
        }
      }
    } catch (err) {
      // Offline fallback
      const mockRole = loginEmail.toLowerCase().includes("admin") || loginEmail === "madhukatta0731@gmail.com" ? "admin" : "customer";
      const dummyUser: UserProfile = {
        id: `user-${Date.now()}`,
        email: loginEmail,
        name: authName || loginEmail.split("@")[0].toUpperCase(),
        role: mockRole,
      };
      setActiveUser(dummyUser);
      setIsLoginOpen(false);
      showToast(`Logged in successfully.`);
      if (mockRole === "admin") setActiveTab("admin");
    }
  };

  // Administrative handlers passed to Admin Panel Component
  const handleAddProduct = async (prodPayload: Omit<Product, "id">) => {
    try {
      const r = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prodPayload),
      });
      if (r.ok) {
        const fresh = await r.json();
        setProducts([...products, fresh]);
        showToast(`Design "${fresh.name}" added successfully.`);
      }
    } catch (e) {
      const fakeProd: Product = { id: `prod-${Date.now()}`, ...prodPayload };
      setProducts([...products, fakeProd]);
      showToast("Design added locally fallback mode.");
    }
  };

  const handleUpdateProduct = async (pId: string, updates: Partial<Product>) => {
    try {
      const r = await fetch(`/api/products/${pId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (r.ok) {
        const nextProd = await r.json();
        setProducts(products.map((p) => (p.id === pId ? nextProd : p)));
        showToast("Design parameter updated successfully.");
      }
    } catch (e) {
      setProducts(products.map((p) => (p.id === pId ? { ...p, ...updates } : p)));
      showToast("Design parameters updated locally.");
    }
  };

  const handleDeleteProduct = async (pId: string) => {
    try {
      const r = await fetch(`/api/products/${pId}`, { method: "DELETE" });
      if (r.ok) {
        setProducts(products.filter((p) => p.id !== pId));
        showToast("Design deleted from boutique collections.");
      }
    } catch (e) {
      setProducts(products.filter((p) => p.id !== pId));
      showToast("Design removed locally.");
    }
  };

  const handleUpdateOrderStatus = async (oId: string, status: Order["orderStatus"], tracking?: string) => {
    try {
      const r = await fetch(`/api/orders/${oId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status, trackingNumber: tracking }),
      });
      if (r.ok) {
        const updatedO = await r.json();
        setOrders(orders.map((o) => (o.id === oId ? updatedO : o)));
        showToast(`Order status updated to: ${status}`);
      }
    } catch (e) {
      setOrders(orders.map((o) => (o.id === oId ? { ...o, orderStatus: status, trackingNumber: tracking } : o)));
      showToast(`Order status updated locally: ${status}`);
    }
  };

  return (
    <div className="bg-[#0b0b0b] min-h-screen text-white font-sans flex flex-col relative selection:bg-luxury-gold selection:text-black">
      {/* Absolute Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black px-6 py-3 tracking-widest text-xs font-bold uppercase z-50 shadow-2xl border border-white/20 transition-all">
          {toastMessage}
        </div>
      )}

      {/* Top Promotional Bar */}
      <div className="bg-[#D4AF37] text-black py-2.5 text-center text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase px-4 relative z-40">
        Complimentary Luxury Packaging on all Orders Above ₹5,000 | Limited Edition Festive Drop
      </div>

      {/* Premium Header Sticky Block */}
      <header className="sticky top-0 z-40 border-b border-black/5 backdrop-blur-md bg-white/70 text-neutral-900 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-between">
          
          {/* Burger for responsive layout */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-neutral-900 hover:text-[#AA7A1E]"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Core navigational links */}
          <nav className="hidden md:flex gap-4.5 text-[9px] uppercase tracking-wider font-bold text-neutral-800">
            <button
              onClick={() => {
                setActiveTab("shop");
                setSelectedType("All");
                setSelectedCategory("All");
              }}
              className={`hover:text-[#AA7A1E] transition-colors ${
                activeTab === "shop" && selectedType === "All" ? "text-[#AA7A1E]" : ""
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => {
                setActiveTab("shop");
                setSelectedType("Clothing");
                setSelectedCategory("All");
              }}
              className={`hover:text-[#AA7A1E] transition-colors ${
                activeTab === "shop" && selectedType === "Clothing" ? "text-[#AA7A1E]" : ""
              }`}
            >
              Clothing
            </button>
            <button
              onClick={() => {
                setActiveTab("shop");
                setSelectedType("Jewellery");
                setSelectedCategory("All");
              }}
              className={`hover:text-[#AA7A1E] transition-colors ${
                activeTab === "shop" && selectedType === "Jewellery" ? "text-[#AA7A1E]" : ""
              }`}
            >
              Jewellery
            </button>
            <button onClick={() => setActiveTab("about")} className="hover:text-[#AA7A1E] transition-colors">
              History
            </button>
            <button onClick={() => setActiveTab("blog")} className="hover:text-[#AA7A1E] transition-colors">
              Blog
            </button>
            <button onClick={() => setActiveTab("contact")} className="hover:text-[#AA7A1E] transition-colors">
              Boutique Address
            </button>
          </nav>

          {/* Center Brand Crest */}
          <div className="text-center cursor-pointer select-none" onClick={() => setActiveTab("shop")}>
            <h1 className="text-base md:text-lg font-serif tracking-[0.2em] text-[#AA7A1E] font-medium leading-none">
              MADHU MAGIC
            </h1>
            <p className="text-[7.5px] uppercase tracking-[0.35em] text-neutral-600 font-serif">
              Fashion Hub
            </p>
          </div>

          {/* Interactive Action Hub */}
          <div className="flex items-center gap-3 sm:gap-4.5 relative">
            
            {/* Quick autocomplete search */}
            <div className="relative hidden lg:flex items-center border-b border-neutral-300 pb-0.5">
              <Search size={12} className="text-neutral-500 mr-1.5" />
              <input
                type="text"
                placeholder="SEARCH DESIGN"
                value={searchQuery}
                aria-label="Search items"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[9px] outline-none w-28 placeholder-neutral-500 tracking-wider uppercase text-neutral-900 border-none py-0"
              />
              {autoCompleteSuggestions.length > 0 && (
                <div className="absolute top-6.5 left-0 w-60 bg-white border border-neutral-200 shadow-xl p-1.5 z-50 space-y-1 rounded-sm">
                  {autoCompleteSuggestions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setQuickViewProduct(s);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-2 p-1 hover:bg-neutral-50 cursor-pointer text-left"
                    >
                      <img src={s.images[0]} alt="" className="w-5 h-7 object-cover" />
                      <div>
                        <p className="text-[9px] text-neutral-800 truncate max-w-[150px] uppercase font-bold">{s.name}</p>
                        <p className="text-[8.5px] text-[#AA7A1E]">₹{s.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Sign-In Trigger */}
            <div className="flex items-center gap-1">
              {activeUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="text-[8.5px] tracking-wider uppercase text-[#AA7A1E] font-bold hover:underline hidden sm:inline"
                  >
                    {activeUser.name}
                  </button>
                  {activeUser.role === "admin" && (
                    <button
                      onClick={() => setActiveTab("admin")}
                      className="text-[8px] bg-[#AA7A1E] text-white px-1.5 py-0.5 font-bold uppercase rounded-sm"
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveUser(null);
                      setActiveTab("shop");
                      showToast("Logged out secure.");
                    }}
                    title="Sign Out"
                    className="text-neutral-500 hover:text-red-600 p-0.5"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  id="btn-login-trigger"
                  className="p-1 text-neutral-800 hover:text-[#AA7A1E] flex items-center gap-1 transition-colors"
                >
                  <User size={14} />
                  <span className="text-[8.5px] uppercase tracking-wider font-bold hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Lookbook Heart Wishlist Counter */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              id="btn-wishlist-sidebar"
              className="relative p-1 text-neutral-800 hover:text-[#AA7A1E] transition-colors"
              aria-label="Toggle Lookbook"
            >
              <Heart size={14} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[7px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Cart Drawer Trigger */}
            <button
              onClick={() => {
                setCheckoutStep("cart");
                setIsCartOpen(true);
              }}
              id="btn-cart-sidebar"
              className="relative p-1 text-neutral-800 hover:text-[#AA7A1E] transition-colors"
              aria-label="Toggle Cart"
            >
              <ShoppingBag size={14} />
              {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#AA7A1E] text-white text-[7px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Hamburger Mobile Links */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-neutral-200 p-4 flex flex-col gap-3 text-[10px] uppercase tracking-wide font-bold text-neutral-800 z-40 relative shadow-md">
          <button
            onClick={() => {
              setActiveTab("shop");
              setSelectedType("All");
              setSelectedCategory("All");
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-1 hover:text-[#AA7A1E]"
          >
            All Collections
          </button>
          <button
            onClick={() => {
              setActiveTab("shop");
              setSelectedType("Clothing");
              setSelectedCategory("All");
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-1 hover:text-[#AA7A1E]"
          >
            Clothing Range
          </button>
          <button
            onClick={() => {
              setActiveTab("shop");
              setSelectedType("Jewellery");
              setSelectedCategory("All");
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-1 hover:text-[#AA7A1E]"
          >
            Fine Jewellery
          </button>
          <button
            onClick={() => {
              setActiveTab("about");
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-1 hover:text-[#AA7A1E]"
          >
            History & Story
          </button>
          <button
            onClick={() => {
              setActiveTab("blog");
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-1 hover:text-[#AA7A1E]"
          >
            Boutique Blog
          </button>
          <button
            onClick={() => {
              setActiveTab("contact");
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-1 hover:text-[#AA7A1E]"
          >
            Contact
          </button>
          <div className="border-t border-neutral-200 pt-3 flex flex-col gap-2">
            <input
              type="text"
              placeholder="SEARCH ITEMS"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 px-2.5 py-1.5 text-[9px] text-neutral-900 tracking-wider uppercase outline-none focus:border-[#AA7A1E]"
            />
          </div>
        </div>
      )}

      {/* Primary Landing Page view */}
      {activeTab === "shop" && (
        <main className="flex-grow animate-fadeIn">
          
          {/* Premium Animated Slider Hero Section */}
          <section className="relative h-[45vh] sm:h-[55vh] bg-black overflow-hidden flex items-center justify-center text-center px-6">
            {/* Carousel images layer */}
            <div className="absolute inset-0 z-0">
              <img
                src={HERO_SLIDES[activeHeroIndex].img}
                alt=""
                className="w-full h-full object-cover opacity-50 ml-auto transition-all duration-1000 ease-in-out scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-black/70" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <span className="text-[#D4AF37] text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase block">
                The Heritage Masterclass Edit
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light leading-[1.2] text-white">
                {HERO_SLIDES[activeHeroIndex].title.split(" ").slice(0, -3).join(" ")}{" "}<br className="hidden sm:inline" />
                <span className="italic font-serif text-[#D4AF37] block mt-1 sm:inline">
                  {HERO_SLIDES[activeHeroIndex].title.split(" ").slice(-3).join(" ")}
                </span>
              </h2>
              <p className="text-white/60 text-[11px] sm:text-xs max-w-lg mx-auto leading-relaxed font-light font-sans">
                {HERO_SLIDES[activeHeroIndex].sub}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <a
                  href="#boutique-listing"
                  className="bg-[#D4AF37] text-black px-6 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:border-black transition-colors"
                >
                  Shop Now
                </a>
                <button
                  onClick={() => {
                    setSelectedType("Jewellery");
                    const element = document.getElementById("boutique-listing");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border border-white/20 text-white px-6 py-2.5 text-[9px] tracking-[0.2em] uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                >
                  Explore Jewellery
                </button>
                <button
                  onClick={() => {
                    setFilterTags({ newArrival: true });
                    const element = document.getElementById("boutique-listing");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border border-[#D4AF37]/45 text-[#D4AF37] px-6 py-2.5 text-[9px] tracking-[0.2em] uppercase hover:bg-neutral-900 transition-all"
                >
                  New Arrivals
                </button>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-4 flex gap-2 z-20">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeHeroIndex === idx ? "bg-luxury-gold w-4" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </section>

          {/* Luxury Categories Bento Row */}
          <section className="bg-black/45 py-6 border-b border-white/10 px-6">
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="text-center">
                <span className="text-[9px] tracking-[0.25em] font-bold text-[#D4AF37] uppercase">Elite Categories</span>
                <h3 className="text-lg sm:text-xl font-serif text-white font-light">Design Specialties</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    name: "Royal Sarees",
                    tag: "Sarees",
                    type: "Clothing",
                    desc: "Handcrafted Mulberry silk & zari threads",
                    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
                  },
                  {
                    name: "Empress Necklaces",
                    tag: "Necklaces",
                    type: "Jewellery",
                    desc: "Genuine Kundan setting & precious pearls",
                    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
                  },
                  {
                    name: "Signature Handbags",
                    tag: "Handbags",
                    type: "Accessories",
                    desc: "Crocodile textures & bespoke gold clasps",
                    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
                  },
                  {
                    name: "Festive Lehenga & Gowns",
                    tag: "Ethnic Wear",
                    type: "Clothing",
                    desc: "Semi-stitched georgette collections",
                    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
                  }
                ].map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedType(cat.type as any);
                      setSelectedCategory(cat.tag);
                      const element = document.getElementById("boutique-listing");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group relative h-36 sm:h-44 overflow-hidden border border-white/5 cursor-pointer bg-[#101010]"
                  >
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 flex flex-col justify-end text-left">
                      <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                        {cat.type}
                      </span>
                      <h4 className="font-serif text-xs text-white group-hover:text-luxury-gold transition-colors leading-tight">
                        {cat.name}
                      </h4>
                      <p className="text-[9px] text-white/50 mt-0.5 line-clamp-2 leading-tight">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Interactive AI Stylist Frame */}
          <section className="max-w-7xl mx-auto px-6 py-3" id="ai-stylist-block">
            <AIStylist
              products={products}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleToggleWishlist}
              wishlist={wishlist}
            />
          </section>

          {/* Interactive Products Showcase & Advanced Filters */}
          <section className="max-w-7xl mx-auto px-6 py-6 space-y-4" id="boutique-listing">
            
            {/* Header filters bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-white/10 pb-3">
              
              <div>
                <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-[#D4AF37]">
                  Pure Custom Craft
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-light text-white mt-1">
                  Explore <span className="italic font-serif text-luxury-gold">Boutique Inventory</span>
                </h3>
                <p className="text-white/40 text-[10px] mt-1 font-light">
                  Showing {sortedProducts.length} luxurious items
                </p>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-4">
                
                {/* Type Filter Controls */}
                <div className="flex bg-[#121212] border border-white/10 p-1">
                  {["All", "Clothing", "Jewellery", "Accessories"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedType(t as any);
                        setSelectedCategory("All");
                      }}
                      className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold transition-all ${
                        selectedType === t
                          ? "bg-luxury-gold text-black"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Subcategory Selector dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40 uppercase font-semibold">Sub-Category:</span>
                  <select
                    value={selectedCategory}
                    aria-label="Filter by Sub-Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-[#121212] text-[10px] tracking-wider uppercase font-semibold text-white border border-white/10 px-2 py-1.5 focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {products
                      .filter((p) => selectedType === "All" || p.type === selectedType)
                      .map((p) => p.category)
                      .filter((val, i, arr) => arr.indexOf(val) === i)
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Sorting options */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40 uppercase font-semibold">Sort By:</span>
                  <select
                    value={sortBy}
                    aria-label="Sorting order"
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#121212] text-[10px] tracking-wider uppercase font-semibold text-white border border-white/10 px-2 py-1.5 focus:outline-none"
                  >
                    <option value="featured">Featured Picks</option>
                    <option value="priceLow">Price Low-to-High</option>
                    <option value="priceHigh">Price High-to-Low</option>
                    <option value="rating">Top Rated Designs</option>
                  </select>
                </div>

                {/* Clear filters Button */}
                {(selectedType !== "All" || selectedCategory !== "All" || searchQuery !== "" || Object.values(filterTags).some(Boolean)) && (
                  <button
                    onClick={() => {
                      setSelectedType("All");
                      setSelectedCategory("All");
                      setSearchQuery("");
                      setFilterTags({});
                      setPriceRange(10000);
                    }}
                    className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider border-b border-[#D4AF37]/50 hover:border-[#D4AF37] pb-0.5"
                  >
                    Clear Filter
                  </button>
                )}

              </div>
            </div>

            {/* Price slider & Flag switches */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#121212]/30 border border-white/5 p-4 items-center">
              
              {/* Slider */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] tracking-widest text-white/50 uppercase">Max Budget: ₹{priceRange.toLocaleString("en-IN")}</span>
                <input
                  type="range"
                  min="500"
                  max="12000"
                  step="500"
                  value={priceRange}
                  aria-label="Max Budget filter"
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-luxury-gold bg-zinc-800 h-1 rounded"
                />
              </div>

              {/* Best Seller switch */}
              <button
                onClick={() => setFilterTags({ ...filterTags, bestseller: !filterTags.bestseller })}
                className={`py-2 text-[10px] uppercase font-bold tracking-widest border text-center transition-all ${
                  filterTags.bestseller ? "border-[#D4AF37] text-[#D4AF37]" : "border-white/10 text-white/50"
                }`}
              >
                Bestsellers Only
              </button>

              {/* New Arrival switch */}
              <button
                onClick={() => setFilterTags({ ...filterTags, newArrival: !filterTags.newArrival })}
                className={`py-2 text-[10px] uppercase font-bold tracking-widest border text-center transition-all ${
                  filterTags.newArrival ? "border-luxury-blue text-white bg-luxury-blue/10" : "border-white/10 text-white/50"
                }`}
              >
                New Collection
              </button>

              {/* Trending switch */}
              <button
                onClick={() => setFilterTags({ ...filterTags, trending: !filterTags.trending })}
                className={`py-2 text-[10px] uppercase font-bold tracking-widest border text-center transition-all ${
                  filterTags.trending ? "border-emerald-500 text-emerald-400" : "border-white/10 text-white/50"
                }`}
              >
                Trending Styles
              </button>

            </div>

            {/* Real Product Listing grid */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#121212]/25 border border-white/5 space-y-3">
                <p className="text-sm text-white/50">No magnificent pieces match your configured search filters.</p>
                <button
                  onClick={() => {
                    setSelectedType("All");
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setFilterTags({});
                  }}
                  className="bg-luxury-gold text-black px-4 py-2 text-[10px] uppercase font-bold"
                >
                  Reset Showcase Listings
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.includes(p.id)}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                ))}
              </div>
            )}

          </section>

          {/* Customer Reviews & Feedback Slider */}
          <section className="bg-gradient-to-b from-[#101010] to-[#0A0A0A] py-8 border-t border-b border-white/5 px-6">
            <div className="max-w-4xl mx-auto space-y-4 text-center">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-[#D4AF37]">
                  Vouching for the Magic
                </span>
                <h3 className="text-lg md:text-xl font-serif text-white font-light mt-1 border-none pb-0">
                  Refined client diaries & testimonials
                </h3>
              </div>

              {/* Slider simulation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {TESTIMONIALS.map((tes) => (
                  <div key={tes.id} className="bg-black/40 border border-white/5 p-4.5 text-left flex flex-col justify-between">
                    <div>
                      <div className="flex text-luxury-gold gap-1 mb-2">
                        {[...Array(tes.rating)].map((_, i) => (
                          <LucideStar key={i} size={11} fill="#D4AF37" className="text-[#D4AF37]" />
                        ))}
                      </div>
                      <p className="text-xs text-white/70 italic leading-relaxed font-light">
                        "{tes.comment}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
                      <img src={tes.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-serif text-[11px] text-[#D4AF37] font-semibold">{tes.name}</p>
                        <p className="text-[9px] text-white/40">{tes.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Blogs lookbook and FAQs */}
          <section className="max-w-7xl mx-auto px-6 py-4">
            <BlogsAndFaqs blogs={INITIAL_PRODUCTS.slice(0, 1) ? [{
              id: "blog-1",
              title: "5 Ultimate Ways to Style Kundan Jewellery with Modern Outfits",
              excerpt: "Learn how to wear heavy royal Indian Kundan pieces with chic power suits, gowns, and western dresses.",
              content: "Traditional Kundan jewelry holds a beautiful, royal history, but why restrict it to weddings? Luxury fashion is all about self-expression and contrast. Here are five golden styling tips to pair Kundan earrings or necklaces with your modern wardrobe...",
              image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
              author: "Madhu K.",
              date: "June 08, 2026",
              readTime: "4 min read",
              category: "Jewellery Styling Tips"
            }, {
              id: "blog-2",
              title: "The Ultimate Guide to Selecting Your Dream Wedding Saree",
              excerpt: "Diving deep into the weave weight, real gold thread, and material selections of authentic Banarasi and Kanjeevarams.",
              content: "When it comes to bridal wear, the luxury of silk is unmatched. Silk represents status, heritage, and pure elegance. But how do you select an authentic saree that lasts for generations?...",
              image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
              author: "Madhu K.",
              date: "June 02, 2026",
              readTime: "6 min read",
              category: "Fashion Trends"
            }] : []} faqs={FAQ_DATA} />
          </section>

          {/* Unified Contact */}
          <section className="bg-[#121212]/20 border-t border-white/5 py-6 px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <div className="space-y-3">
                <span className="text-[9px] tracking-widest text-[#D4AF37] font-bold uppercase">Come visit us</span>
                <h3 className="font-serif text-2xl text-white">Madhu Magic <br />Boutique Atelier</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Step in to experience customized gold tailoring, live measurements, and our complete high jewelry collection.
                </p>
                <div className="space-y-2.5 text-xs text-white/80 pt-1.5">
                  <p className="flex items-center gap-3">
                    <MapPin size={14} className="text-[#D4AF37]" />
                    <span>Plot 42, Luxury Landmark Road, Juhu Scheme, Mumbai</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Phone size={14} className="text-[#D4AF37]" />
                    <span>+91 91234 56789</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail size={14} className="text-[#D4AF37]" />
                    <span>madhukatta0731@gmail.com</span>
                  </p>
                </div>

                <div className="pt-1">
                  <a
                    href="https://wa.me/919123456789?text=Hello%20Madhu%20Magic%20hub%2C%20I%20wish%20to%20know%20more%20on%20Saree%20styling%21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-black hover:opacity-90 px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest"
                  >
                    Chat via WhatsApp
                  </a>
                </div>
              </div>

              {/* Form card */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast(`Thank you ${contactName}! Our luxury host will contact you shortly.`);
                  setContactName("");
                  setContactEmail("");
                  setContactMessage("");
                }}
                className="bg-[#121212] border border-white/10 p-4.5 space-y-3.5 text-left"
              >
                <span className="text-[9px] tracking-widest text-[#D4AF37] font-bold block uppercase">Digital Concierge</span>
                
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-white/50 mb-1" htmlFor="input-name">your name</label>
                  <input
                    type="text"
                    id="input-name"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#1C1C1C] text-xs text-white p-2.5 border border-white/10 focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-white/50 mb-1" htmlFor="input-email">email address</label>
                  <input
                    type="email"
                    id="input-email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#1C1C1C] text-xs text-white p-2.5 border border-white/10 focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-white/50 mb-1" htmlFor="input-message">styling notes / inquiry</label>
                  <textarea
                    rows={3}
                    id="input-message"
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Ask about size tailoring..."
                    className="w-full bg-[#1C1C1C] text-xs text-white p-2.5 border border-white/10 focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-black font-bold uppercase text-[10px] py-3.5 tracking-widest"
                >
                  Send Inquiry
                </button>
              </form>

            </div>
          </section>

        </main>
      )}

      {/* History / About Us Tab */}
      {activeTab === "about" && (
        <main className="flex-grow max-w-4xl mx-auto px-6 py-16 space-y-12 animate-fadeIn text-left text-white font-serif">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-serif tracking-[0.3em] text-[#D4AF37]">The Heritage Core</span>
            <h2 className="text-4xl font-light">History of <span className="italic text-[#D4AF37]">Madhu Magic</span></h2>
          </div>

          <div className="space-y-6 text-sm text-white/70 leading-relaxed font-sans">
            <p>
              Founded under the creative guidance and magic of designer Madhu, <strong>Madhu Magic Fashion Hub</strong> was birthed with a singular grand vision: to preserve traditional Indian artisanal embroidery, while fashioning a clean modern bridge for the global citizen.
            </p>
            <p>
              By fusing raw mulberry Banarasi silks with unstitched boutique luxury blouses, and introducing hypoallergenic fine Kundan choker jewelry sets, we have secured high trust among brides and fashion enthusiasts worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="border border-white/5 p-6 bg-[#121212]">
              <h3 className="text-lg text-luxury-gold mb-2 font-serif">Our Noble Mission</h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans font-light">
                To curate authentic, design-led clothing and jewellery that fuels confidence, safeguards legacy art forms, and provides transparent direct storefronts via direct buy or partners like Meesho.
              </p>
            </div>
            <div className="border border-white/5 p-6 bg-[#121212]">
              <h3 className="text-lg text-luxury-gold mb-2 font-serif">Our Grand Vision</h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans font-light">
                To become the premier home of bespoke fusion wear in Asia, celebrated for immaculate hand-weaving, durable gold plating, and seamless digital try-on configurations.
              </p>
            </div>
            <div className="border border-white/5 p-6 bg-[#121212]">
              <h3 className="text-lg text-luxury-gold mb-2 font-serif">Customer Commitment</h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans font-light">
                A stress-free luxury journey. From custom gift packages wrapped in royal velvet case housing to rapid home deliveries and easy feedback mechanisms.
              </p>
            </div>
            <div className="border border-white/5 p-6 bg-[#121212]">
              <h3 className="text-lg text-luxury-gold mb-2 font-serif">Quality Standard</h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans font-light">
                Pure metals only. Our necklaces are completely nickel-free and double vacuum coated, ensuring lasting shine, and raw textiles boast perfect density thread weave.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* Blogs list page */}
      {activeTab === "blog" && (
        <main className="flex-grow max-w-5xl mx-auto px-6 py-16 space-y-6 animate-fadeIn">
          <div className="text-center">
            <span className="text-xs uppercase font-serif tracking-[0.3em] text-[#D4AF37]">Fashion Musings</span>
            <h2 className="text-3xl font-serif font-light text-white mt-1">Madhu Magic Style Lookbooks</h2>
          </div>
          <BlogsAndFaqs
            blogs={[{
              id: "blog-1",
              title: "5 Ultimate Ways to Style Kundan Jewellery with Modern Outfits",
              excerpt: "Learn how to wear heavy royal Indian Kundan pieces with chic power suits, gowns, and western dresses.",
              content: "Traditional Kundan jewelry holds a beautiful, royal history, but why restrict it to weddings? Luxury fashion is all about self-expression and contrast. Here are five golden styling tips to pair Kundan earrings or necklaces with your modern wardrobe...",
              image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
              author: "Madhu K.",
              date: "June 08, 2026",
              readTime: "4 min read",
              category: "Jewellery Styling Tips"
            }, {
              id: "blog-2",
              title: "The Ultimate Guide to Selecting Your Dream Wedding Saree",
              excerpt: "Diving deep into the weave weight, real gold thread, and material selections of authentic Banarasi and Kanjeevarams.",
              content: "When it comes to bridal wear, the luxury of silk is unmatched. Silk represents status, heritage, and pure elegance. But how do you select an authentic saree that lasts for generations?...",
              image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
              author: "Madhu K.",
              date: "June 02, 2026",
              readTime: "6 min read",
              category: "Fashion Trends"
            }]}
            faqs={FAQ_DATA}
          />
        </main>
      )}

      {/* Contact us / Boutique page */}
      {activeTab === "contact" && (
        <main className="flex-grow px-6 py-16 animate-fadeIn">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <span className="text-xs uppercase font-serif tracking-[0.3em] text-[#D4AF37]">Official Headquarters</span>
            <h2 className="text-3xl font-serif text-white font-light">Get in touch</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left pt-6">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-[#D4AF37]">Mumbai flagship atelier</h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans font-light">
                  Come in to inspect raw silks, match diamond simulated rings, customize bangles sizes, or discuss bridal hampers.
                </p>
                <div className="space-y-3.5 text-xs text-white/80 pt-2.5 font-sans">
                  <p className="flex items-center gap-3">
                    <MapPin size={16} className="text-[#D4AF37]" />
                    <span>Plot 42, Luxury Landmark Road, Juhu Scheme, Mumbai</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Phone size={16} className="text-[#D4AF37]" />
                    <span>+91 91234 56789</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail size={16} className="text-[#D4AF37]" />
                    <span>madhukatta0731@gmail.com</span>
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/919123456789?text=Hello%20Madhu%20Magic%20hub%2C%20I%20wish%20to%20know%20more%20on%20Saree%20styling%21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-black hover:opacity-90 px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Chat via WhatsApp
                  </a>
                </div>
              </div>

              {/* simulated Map */}
              <div className="relative aspect-video bg-[#1F1F1F] border border-white/10 flex items-center justify-center p-6 text-center">
                <div className="space-y-2">
                  <MapPin size={32} className="text-[#D4AF37] mx-auto animate-bounce" />
                  <h4 className="font-serif text-sm">Interactive Map Simulator</h4>
                  <p className="text-[10px] text-white/40 font-sans">Juhu Scheme flagship location pinpoint. Standard map framework is bypassed securely.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* User profile & tracked orders */}
      {activeTab === "profile" && (
        <main className="flex-grow max-w-4xl mx-auto px-6 py-16 space-y-12 animate-fadeIn text-left">
          {activeUser ? (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] tracking-widest text-[#D4AF37] font-bold uppercase font-serif">Customer Portal</span>
                  <h2 className="text-3xl font-serif text-white mt-1">Hello, {activeUser.name}</h2>
                  <p className="text-white/40 text-xs mt-1">{activeUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveUser(null);
                    setActiveTab("shop");
                    showToast("Logged out safely.");
                  }}
                  className="border border-red-500/30 text-red-400 hover:bg-red-500/15 py-1.5 px-4 text-[10px] font-bold uppercase tracking-widest"
                >
                  Sign Out Account
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Details card */}
                <div className="bg-[#121212] border border-white/5 p-6 rounded-none space-y-4 md:col-span-1">
                  <h3 className="font-serif text-lg text-luxury-gold">Address Book</h3>
                  <div className="text-xs text-white/80 space-y-1 font-sans">
                    <p className="font-semibold text-white">Default Shipping:</p>
                    <p>{activeUser.phone || "+91 91234 56789"}</p>
                    <p>12 Luxury Boulevard</p>
                    <p>Bandra West, Mumbai - 400050</p>
                    <p>India</p>
                  </div>
                </div>

                {/* Orders tracking */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-serif text-lg text-white">Your Order History</h3>
                  {orders.length === 0 ? (
                    <p className="text-xs text-white/40 italic py-6">You have not placed any boutique orders yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((o) => (
                        <div key={o.id} className="bg-[#121212] border border-white/5 p-5 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <div>
                              <p className="font-serif text-xs">Order ID: #{o.id}</p>
                              <p className="text-[10px] text-white/40 mt-0.5">Placed on: {new Date(o.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold ${
                              o.orderStatus === "Delivered" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-500"
                            }`}>
                              {o.orderStatus}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="flex gap-3 text-xs items-center justify-between">
                                <span className="font-serif truncate max-w-[200px] text-white/80">{it.name} (x{it.quantity})</span>
                                <span className="text-[#D4AF37]">₹{it.price}</span>
                              </div>
                            ))}
                          </div>

                          {o.trackingNumber && (
                            <div className="text-[10px] text-white/50 pt-2 border-t border-white/5 flex items-center gap-1.5">
                              <Truck size={12} className="text-[#D4AF37]" />
                              <span>Live BlueDart Tracking: <strong>{o.trackingNumber}</strong></span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 space-y-4 max-w-sm mx-auto">
              <User size={36} className="text-[#D4AF37] mx-auto" />
              <h3 className="font-serif text-lg">Sign In to access Portal</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Unlock order tracking address management and customized recommendations list history quickly.
              </p>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-luxury-gold text-black px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest"
              >
                Sign In Now
              </button>
            </div>
          )}
        </main>
      )}

      {/* Admin Panel suite */}
      {activeTab === "admin" && (
        <AdminPanel
          products={products}
          orders={orders}
          users={[
            { id: "cust-1", name: "Priya Patel", email: "priya@gmail.com", role: "customer" },
            { id: "admin-madhu", name: "Madhu Fashion Admin", email: "madhukatta0731@gmail.com", role: "admin" }
          ]}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {/* Styled Footer Block */}
      <footer className="bg-black border-t border-white/10 px-6 py-12 text-xs text-white/60 font-sans mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 text-left">
            <h4 className="font-serif text-lg text-luxury-gold tracking-widest uppercase">MADHU MAGIC</h4>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              Premium women's fashion wear and jewelry. Crafted under boutique expertise to celebrate traditional roots with urban confidence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-luxury-gold transition-colors"><Instagram size={16} /></a>
              <a href="#" className="text-white/60 hover:text-luxury-gold transition-colors"><Facebook size={16} /></a>
              <a href="#" className="text-white/60 hover:text-luxury-gold transition-colors"><Youtube size={16} /></a>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="text-[10px] uppercase tracking-widest text-white/80 font-bold font-serif">Luxury Collections</h5>
            <div className="flex flex-col gap-2 text-xs font-light">
              <button onClick={() => { setSelectedType("Clothing"); setSelectedCategory("Sarees"); setActiveTab("shop"); }} className="hover:text-luxury-gold text-left">Royal Sarees</button>
              <button onClick={() => { setSelectedType("Jewellery"); setSelectedCategory("Necklaces"); setActiveTab("shop"); }} className="hover:text-luxury-gold text-left">Polki Chokers</button>
              <button onClick={() => { setSelectedType("Clothing"); setSelectedCategory("Dresses"); setActiveTab("shop"); }} className="hover:text-luxury-gold text-left">Party Wear Gowns</button>
              <button onClick={() => { setSelectedType("Accessories"); setSelectedCategory("Handbags"); setActiveTab("shop"); }} className="hover:text-luxury-gold text-left">Crocodile Satchels</button>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="text-[10px] uppercase tracking-widest text-white/80 font-bold font-serif">Shopping & Help</h5>
            <div className="flex flex-col gap-2 text-xs font-light">
              <button onClick={() => setActiveTab("contact")} className="hover:text-luxury-gold text-left">Flagship store</button>
              <button onClick={() => setActiveTab("blog")} className="hover:text-luxury-gold text-left">Accordion FAQs</button>
              <button onClick={() => setIsLoginOpen(true)} className="hover:text-luxury-gold text-left">Client Login</button>
              <a
                href="https://meesho.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-luxury-gold text-left flex items-center gap-1"
              >
                Meesho Storefront
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] uppercase tracking-widest text-white/80 font-bold font-serif">Newsletter</h5>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Subscribe to obtain notice on heritage drops and receive a customized 15% discount code automatically.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Subscribed! Write down code "MAGICGOLD" for 15% Off checkout!`);
                setNewsletterEmail("");
              }}
              className="flex border-b border-white/20 pb-1"
            >
              <input
                type="email"
                required
                placeholder="YOUR EMAIL"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-transparent text-[10px] placeholder-white/30 text-white outline-none flex-grow tracking-widest uppercase"
              />
              <button type="submit" className="text-white hover:text-luxury-gold cursor-pointer">
                <Send size={12} />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-6 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/40 tracking-wider">
          <p>© 2026 MADHU MAGIC FASHION HUB. ALL ARTWORK SAFEGUARDED.</p>
          <div className="flex gap-4">
            <span>SECURE PAYMENT:</span>
            <span>STRIPE</span>
            <span>UPI</span>
            <span>PAYPAL</span>
            <span>COD</span>
          </div>
        </div>
      </footer>

      {/* QUICK VIEW DETAILS OVERLAY MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-luxury-gold/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative text-left grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-xs tracking-widest font-bold focus:outline-none"
            >
              ✕ CLOSE
            </button>

            {/* Gallery */}
            <div className="space-y-3">
              <div className="aspect-[3/4] bg-neutral-950 overflow-hidden border border-white/10">
                <img src={quickViewProduct.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {quickViewProduct.images.map((imgUrl, i) => (
                  <div key={i} className="aspect-square bg-zinc-900 border border-white/10 overflow-hidden">
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* details pane */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">{quickViewProduct.category}</span>
                <h3 className="text-2xl font-serif text-white mt-1 uppercase">{quickViewProduct.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2 mb-4">
                  <div className="flex text-luxury-gold">
                    {[...Array(5)].map((_, i) => (
                      <LucideStar key={i} size={12} fill={i < Math.floor(quickViewProduct.rating) ? "#D4AF37" : "none"} className="text-luxury-gold" />
                    ))}
                  </div>
                  <span className="text-xs text-white/40">({quickViewProduct.ratingCount} boutique checkouts)</span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed font-light">{quickViewProduct.description}</p>
              </div>

              {/* pricing */}
              <div className="space-y-3.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-bold text-luxury-gold">₹{quickViewProduct.price.toLocaleString()}</span>
                  {quickViewProduct.discount > 0 && (
                    <>
                      <span className="text-xs line-through text-white/40">₹{quickViewProduct.originalPrice.toLocaleString()}</span>
                      <span className="text-xs text-emerald-400 font-semibold">({quickViewProduct.discount}% discount)</span>
                    </>
                  )}
                </div>

                <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
                  <p><strong className="text-white/60 uppercase text-[10px]">Type Selection:</strong> {quickViewProduct.type}</p>
                  <p><strong className="text-white/60 uppercase text-[10px]">Fabric / Plating:</strong> Premium High Grade</p>
                  <p><strong className="text-white/60 uppercase text-[10px]">Aesthetic Style:</strong> Elegant Micro-Tailored</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct, quickViewProduct.colors[0] || "", quickViewProduct.sizes[0] || "", 1);
                    setQuickViewProduct(null);
                  }}
                  className="w-full bg-[#D4AF37] hover:bg-white text-black py-3 text-[11px] font-bold tracking-widest uppercase transition-colors"
                >
                  Confirm Choice & Add to Cart
                </button>
                {quickViewProduct.meeshoUrl && (
                  <a
                    href={quickViewProduct.meeshoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-luxury-gold text-luxury-gold block text-center py-2 text-[11px] font-bold uppercase tracking-widest"
                  >
                    View Official Meesho Storefront Link
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRIVATE LOOKBOOK / WISHLIST DRAWER OVERLAY */}
      {isWishlistOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#121212] border-l border-white/10 z-50 p-6 flex flex-col justify-between text-left animate-slideLeft shadow-2xl">
          <div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <h3 className="font-serif text-lg text-white uppercase tracking-wider flex items-center gap-2">
                <Heart size={16} className="text-[#D4AF37]" fill="#D4AF37" />
                Lookbook Wishlist
              </h3>
              <button onClick={() => setIsWishlistOpen(false)} className="text-white/40 hover:text-white uppercase text-[10px] tracking-wider font-bold">
                ✕ CLOSE
              </button>
            </div>

            {wishlist.length === 0 ? (
              <p className="text-xs text-white/40 italic py-10 text-center">Your private style lookbook is empty.</p>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {wishlist.map((id) => {
                  const p = products.find((pr) => pr.id === id);
                  if (!p) return null;
                  return (
                    <div key={p.id} className="flex gap-4 border-b border-white/5 pb-3">
                      <img src={p.images[0]} alt="" className="w-12 h-16 object-cover border border-white/10 flex-shrink-0" />
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <p className="font-serif text-xs uppercase font-bold text-white line-clamp-1">{p.name}</p>
                          <p className="text-[#D4AF37] text-xs font-semibold mt-0.5">₹{p.price}</p>
                        </div>
                        <button
                          onClick={() => {
                            handleAddToCart(p, p.colors[0] || "", p.sizes[0] || "", 1);
                            setIsWishlistOpen(false);
                          }}
                          className="text-[9px] uppercase tracking-tighter text-[#D4AF37] border-b border-[#D4AF37]/50 self-start pb-0.5"
                        >
                          Transfer to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-full bg-[#1A1A1A] text-white/80 py-3 uppercase text-[10px] tracking-widest font-bold border border-white/10"
          >
            Continue Custom Browsing
          </button>
        </div>
      )}

      {/* BOUTIQUE SHOPPING BAG / CHECKOUT DRAWER OVERLAY */}
      {isCartOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#111] border-l border-white/10 z-50 p-6 flex flex-col justify-between text-left animate-slideLeft shadow-2xl">
          <div className="flex-grow flex flex-col min-h-0">
            
            {/* Header progress tracker */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <h3 className="font-serif text-lg text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#D4AF37]" />
                Boutique Cart Bag
              </h3>
              
              <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase">
                <span className={checkoutStep === "cart" ? "text-luxury-gold" : "text-white/40"}>Cart</span>
                <ChevronRight size={10} className="text-white/30" />
                <span className={checkoutStep === "address" ? "text-luxury-gold" : "text-white/40"}>Address</span>
                <ChevronRight size={10} className="text-white/30" />
                <span className={checkoutStep === "payment" ? "text-luxury-gold" : "text-white/40"}>Secure Pay</span>
              </div>

              <button onClick={() => setIsCartOpen(false)} className="text-white/40 hover:text-white uppercase text-[10px] tracking-wider font-bold">
                ✕ CLOSE
              </button>
            </div>

            {/* STEP 1: CART LISTING VIEW */}
            {checkoutStep === "cart" && (
              <div className="flex-grow overflow-y-auto space-y-4 pr-1 min-h-0 flex flex-col">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-white/40 flex-grow flex flex-col justify-center items-center">
                    <ShoppingBag size={32} className="text-white/20 mb-3" />
                    <p className="text-xs italic">Your shopping bag is unoccupied.</p>
                  </div>
                ) : (
                  <div className="space-y-4 flex-grow overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 border-b border-white/5 pb-4">
                        <img src={item.product.images[0]} alt="" className="w-14 h-18 object-cover border border-white/10 flex-shrink-0" />
                        <div className="flex-grow flex flex-col justify-between text-xs">
                          <div className="space-y-0.5">
                            <p className="font-serif truncate max-w-[220px] font-bold uppercase text-white">{item.product.name}</p>
                            <p className="text-[10px] text-white/40">Color: {item.selectedColor} | Size: {item.selectedSize}</p>
                            <p className="text-[#D4AF37] font-semibold">₹{item.product.price} each</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center border border-white/10">
                              <button onClick={() => handleUpdateCartQty(idx, -1)} className="p-1 px-2.5 text-white/60 hover:text-white">
                                <Minus size={10} />
                              </button>
                              <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                              <button onClick={() => handleUpdateCartQty(idx, 1)} className="p-1 px-2.5 text-white/60 hover:text-white">
                                <Plus size={10} />
                              </button>
                            </div>

                            <button onClick={() => handleRemoveFromCart(idx)} className="text-rose-400 text-[10px] uppercase font-bold tracking-wider hover:underline">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Promo Code area */}
                {cart.length > 0 && (
                  <div className="pt-4 border-t border-white/5 flex gap-2">
                    <input
                      type="text"
                      placeholder="COUPON (MAGICGOLD)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-[#1C1C1C] border border-white/10 px-3 py-2 text-[10px] tracking-widest text-white uppercase placeholder-white/30 flex-grow"
                    />
                    <button onClick={applyPromoCode} className="bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors font-sans btn-coupon">
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: SHIPPING ADDRESS ENTRY */}
            {checkoutStep === "address" && (
              <div className="space-y-4 overflow-y-auto flex-grow pr-1">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">Shipping specifications</span>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] uppercase text-white/50 mb-1" htmlFor="ship-name">Recipient Name</label>
                    <input
                      type="text"
                      id="ship-name"
                      required
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="e.g. Priya Patel"
                      className="w-full bg-[#1C1C1C] text-xs text-white p-2.5 border border-white/10 focus:outline-none focus:border-luxury-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase text-white/50 mb-1" htmlFor="ship-phone">Contact Phone</label>
                    <input
                      type="text"
                      id="ship-phone"
                      required
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#1C1C1C] text-xs text-white p-2.5 border border-white/10 focus:outline-none focus:border-luxury-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase text-white/50 mb-1" htmlFor="ship-street">Street Address</label>
                    <input
                      type="text"
                      id="ship-street"
                      required
                      value={shippingStreet}
                      onChange={(e) => setShippingStreet(e.target.value)}
                      placeholder="Flat, Mansion, Boulevard..."
                      className="w-full bg-[#1C1C1C] text-xs text-white p-2.5 border border-white/10 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase text-white/50 mb-1" htmlFor="ship-city">City</label>
                      <input
                        type="text"
                        id="ship-city"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full bg-[#1C1C1C] text-xs p-2.5 border border-white/10"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase text-white/50 mb-1" htmlFor="ship-zip">Postcode</label>
                      <input
                        type="text"
                        id="ship-zip"
                        value={shippingZip}
                        onChange={(e) => setShippingZip(e.target.value)}
                        className="w-full bg-[#1C1C1C] text-xs p-2.5 border border-white/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SECURE PAYMENT SELECTION */}
            {checkoutStep === "payment" && (
              <div className="space-y-6 overflow-y-auto flex-grow pr-1">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">Select Gateway Integration</span>
                  <p className="text-white/40 text-xs mt-1">Select the preferred gateway platform for simulated authorization:</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { id: "Razorpay", label: "Razorpay Gateway" },
                    { id: "Stripe", label: "Stripe Merchant" },
                    { id: "PayPal", label: "PayPal Secured" },
                    { id: "UPI", label: "UPI Instant" },
                    { id: "CreditCard", label: "Credit Cards" },
                    { id: "Cash on Delivery", label: "Cash on Delivery" },
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      onClick={() => setSelectedPayment(pay.id)}
                      className={`p-4 border text-center transition-all flex flex-col justify-center items-center gap-2 ${
                        selectedPayment === pay.id
                          ? "border-luxury-gold bg-luxury-gold/5 text-luxury-gold"
                          : "border-white/10 text-white/60 hover:border-white/30"
                      }`}
                    >
                      <CreditCard size={16} />
                      <span className="text-[10px] uppercase tracking-widest font-bold font-sans">{pay.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: ORDER PLACEMENT CONGRATS */}
            {checkoutStep === "success" && lastPlacedOrder && (
              <div className="flex-grow flex flex-col justify-center items-center text-center space-y-6 py-10">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400">
                  <Check size={28} />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] tracking-widest text-[#D4AF37] font-bold uppercase">Order Finalized</span>
                  <h4 className="font-serif text-2xl text-white">Consignment under assembly</h4>
                  <p className="text-xs text-white/50 max-w-sm leading-relaxed">
                    A notification detailing shipment parameters has been initialized for delivery address in {lastPlacedOrder.shippingAddress.city}. Thank you for trusting Madhu Magic.
                  </p>
                </div>

                <div className="bg-[#1C1C1C] border border-white/5 p-4 rounded text-left w-full space-y-2">
                  <p className="text-xs text-white/80"><strong>Consignment Code:</strong> #{lastPlacedOrder.id}</p>
                  <p className="text-xs text-white/80"><strong>Tracking Code:</strong> {lastPlacedOrder.trackingNumber || "MM-Pending"}</p>
                  <p className="text-xs text-[#D4AF37]"><strong>Authorized Total:</strong> ₹{lastPlacedOrder.total.toLocaleString("en-IN")}</p>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep("cart");
                  }}
                  className="bg-luxury-gold text-black hover:bg-white transition-colors py-3 px-6 text-[10px] font-bold uppercase tracking-widest font-sans"
                >
                  Return Boutique
                </button>
              </div>
            )}

          </div>

          {/* Checkout Footer totals layout */}
          {cart.length > 0 && checkoutStep !== "success" && (
            <div className="border-t border-white/10 pt-4 mt-4 space-y-4 bg-black/40">
              
              <div className="space-y-2 text-xs text-white/80">
                <div className="flex justify-between">
                  <span>Bag Subtotal:</span>
                  <span className="font-semibold text-white">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount applied ({appliedDiscount}% Off):</span>
                    <span>-₹{cartDiscountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST/SGS Tax (5%):</span>
                  <span>₹{gstTax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Elite Delivery Charge:</span>
                  <span className="font-semibold text-white">{shippingCharge === 0 ? "Free Shipping" : `₹${shippingCharge}`}</span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-[#D4AF37] uppercase font-bold font-serif">Grand Estimated Cash:</span>
                  <span className="font-bold text-luxury-gold text-base">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Step navigations */}
              <div className="pt-2">
                {checkoutStep === "cart" && (
                  <button
                    onClick={() => setCheckoutStep("address")}
                    className="w-full bg-[#D4AF37] hover:bg-white text-black py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 cursor-pointer btn-ship"
                  >
                    Confirm Consignment Address
                    <ChevronRight size={13} />
                  </button>
                )}

                {checkoutStep === "address" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep("cart")}
                      className="border border-white/20 text-white/80 py-3.5 px-4 text-[10px] uppercase tracking-widest font-bold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (!shippingName || !shippingPhone || !shippingStreet) {
                          showToast("Please supply recipient address details completely first.");
                          return;
                        }
                        setCheckoutStep("payment");
                      }}
                      className="flex-grow bg-[#D4AF37] hover:bg-white text-black py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Configure Payment Option
                      <ChevronRight size={13} />
                    </button>
                  </div>
                )}

                {checkoutStep === "payment" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep("address")}
                      className="border border-white/20 text-white/80 py-3.5 px-4 text-[10px] uppercase tracking-widest font-bold"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer btn-order"
                    >
                      Authorize Transaction Total
                      <Check size={13} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* LOGIN & REGISTER SIDE DRAWER OVERLAY */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAuthSubmit}
            id="form-login-payload"
            className="bg-[#121212] border border-luxury-gold/50 max-w-sm w-full p-6 sm:p-8 space-y-6 relative text-left"
          >
            <button
              type="button"
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white uppercase text-[9px] tracking-widest font-bold cursor-pointer font-sans"
            >
              ✕ CLOSE
            </button>

            <div className="text-center space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold font-serif">Customer Lounge</span>
              <h3 className="text-xl sm:text-2xl font-serif text-white">
                {isRegisterMode ? "Register Profile" : "Boutique Sign In"}
              </h3>
            </div>

            <div className="space-y-4">
              {isRegisterMode && (
                <div>
                  <label className="block text-[9px] uppercase text-white/50 mb-1" htmlFor="auth-name">Your Full Name</label>
                  <input
                    type="text"
                    id="auth-name"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Priya Patel"
                    className="w-full bg-[#1C1C1C] text-xs text-white p-2.5 border border-white/10 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[9px] uppercase text-white/50 mb-1" htmlFor="auth-email">Email Address</label>
                <input
                  type="email"
                  id="auth-email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. madhukatta0731@gmail.com"
                  className="w-full bg-[#1C1C1C] text-xs text-white p-2.5 border border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase text-white/50 mb-1" htmlFor="auth-pass">Password</label>
                <input
                  type="password"
                  id="auth-pass"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1C1C1C] text-xs text-white p-2.5 border border-white/10 focus:outline-none"
                />
              </div>
            </div>

            <button
               type="submit"
               className="w-full bg-[#D4AF37] text-black font-bold uppercase text-[10px] py-3.5 tracking-widest cursor-pointer mt-2"
            >
              {isRegisterMode ? "REGISTER NEW DEBUT" : "AUTHORIZE ACCESS"}
            </button>

            {/* Quick help credential tip box */}
            <div className="bg-[#1C1C1C] p-3 text-[9px] border border-white/5 text-white/50 leading-normal">
              <span className="text-[#D4AF37] font-bold block mb-1">💡 Sandbox Admin Bypass Tip</span>
              Use mail <strong>madhukatta0731@gmail.com</strong> or password <strong>admin123</strong> to enter Admin dashboard controls immediately.
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-[10px] uppercase text-[#D4AF37] tracking-widest font-semibold hover:underline"
              >
                {isRegisterMode ? "Back to Sign In" : "Create New Boutique Account"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
