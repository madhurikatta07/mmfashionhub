import { useState, useRef, useEffect } from "react";
import { Search, Heart, ShoppingBag, Menu, X, User, ShieldAlert, LogOut } from "lucide-react";
import { Product, UserProfile } from "../types";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onSearch: (query: string) => void;
  onNavigate: (section: string) => void;
  onProductSelect: (product: Product) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onAdminClick: () => void;
  products: Product[];
}

export default function Navbar({
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  onSearch,
  onNavigate,
  onProductSelect,
  currentUser,
  onLogout,
  onLoginClick,
  onAdminClick,
  products,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle auto-complete logic
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    onSearch(val);
    if (val.trim().length > 1) {
      const filtered = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(val.toLowerCase()) ||
            p.category.toLowerCase().includes(val.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (product: Product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    onProductSelect(product);
  };

  const handleMenuItemClick = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#0B0B0B] text-white border-b border-white/10 shadow-lg select-none">
      {/* Promo Banner */}
      <div id="promo-banner" className="bg-[#D4AF37] text-[#0B0B0B] py-1.5 text-center text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase px-4">
        Complimentary Luxury Velvet Storage Box on Orders Above ₹5,000 | Store live on Meesho Hub
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Menus (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-widest font-medium text-white/70">
            <button
              onClick={() => handleMenuItemClick("home")}
              className="hover:text-[#D4AF37] transition-all cursor-pointer font-semibold relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all"
            >
              Home
            </button>
            <button
              onClick={() => handleMenuItemClick("collections")}
              className="hover:text-[#D4AF37] transition-all cursor-pointer font-semibold"
            >
              Collections
            </button>
            <button
              onClick={() => handleMenuItemClick("clothing")}
              className="hover:text-[#D4AF37] transition-all cursor-pointer font-semibold"
            >
              Clothing
            </button>
            <button
              onClick={() => handleMenuItemClick("jewellery")}
              className="hover:text-[#D4AF37] transition-all cursor-pointer font-semibold"
            >
              Jewellery
            </button>
            <button
              onClick={() => handleMenuItemClick("portfolio")}
              className="hover:text-[#D4AF37] transition-all cursor-pointer font-semibold"
            >
              Portfolio
            </button>
            <button
              onClick={() => handleMenuItemClick("blog")}
              className="hover:text-[#D4AF37] transition-all cursor-pointer font-semibold"
            >
              Styling Blog
            </button>
            <button
              onClick={() => handleMenuItemClick("faq")}
              className="hover:text-[#D4AF37] transition-all cursor-pointer font-semibold"
            >
              FAQ
            </button>
          </nav>

          {/* Hamburger (Mobile) */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-btn"
              className="text-white hover:text-[#D4AF37] transition-all cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Central Branded Logo & Typography */}
          <div className="text-center cursor-pointer" onClick={() => handleMenuItemClick("home")}>
            <h1 className="text-xl md:text-2xl font-serif tracking-[0.2em] md:tracking-[0.25em] text-[#D4AF37] font-semibold leading-none">
              MADHU MAGIC
            </h1>
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/50 mt-1">
              Fashion Hub
            </p>
          </div>

          {/* Right Utilities (Search, Wishlist, Cart, Theme, Login) */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
            {/* Search Input Box */}
            <div ref={searchRef} className="relative hidden md:flex items-center border-b border-white/20 pb-1">
              <input
                id="search-input"
                type="text"
                placeholder="SEARCH COLLECTION..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-transparent text-[10px] outline-none w-28 lg:w-40 placeholder-white/30 tracking-widest text-[#D4AF37] font-semibold"
              />
              <Search className="w-3.5 h-3.5 text-white/50 ml-1" />

              {/* Suggestions auto-complete list */}
              {showSuggestions && suggestions.length > 0 && (
                <div id="search-suggestions" className="absolute top-full left-0 right-0 mt-2 bg-[#121212] border border-white/10 rounded-md shadow-2xl overflow-hidden z-50">
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSuggestionSelect(p)}
                      className="w-full text-left px-4 py-2.5 text-[11px] text-white/80 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] border-b border-white/5 last:border-b-0 transition-all flex items-center gap-3"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded object-cover" />
                      <div className="truncate">
                        <p className="font-semibold truncate">{p.name}</p>
                        <p className="text-[9px] text-white/40">{p.category} | ₹{p.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onWishlistClick}
              id="wishlist-btn"
              className="relative p-1.5 hover:text-[#D4AF37] text-white/85 transition-all cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#D4AF37] text-[#0B0B0B] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              id="cart-btn"
              className="relative p-1.5 hover:text-[#D4AF37] text-white/85 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#D4AF37] text-[#0B0B0B] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Component */}
            <ThemeToggle />

            {/* Admin or Login Section */}
            {currentUser ? (
              <div className="flex items-center gap-1">
                {currentUser.role === "admin" && (
                  <button
                    onClick={onAdminClick}
                    id="admin-dashboard-btn"
                    className="p-1.5 hover:text-[#D4AF37] text-[#D4AF37] transition-all cursor-pointer flex items-center gap-1 text-[10px] tracking-widest font-bold uppercase"
                    title="Admin Dashboard"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}
                <button
                  onClick={() => handleMenuItemClick("profile")}
                  className="p-1.5 hover:text-[#D4AF37] text-white/80 transition-all cursor-pointer flex items-center gap-1 text-[10px] tracking-widest"
                  title="My Profile & Orders"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline truncate max-w-[60px] font-semibold">{currentUser.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1 hover:text-red-400 text-white/50 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                id="login-trigger-btn"
                className="text-[10px] uppercase tracking-widest border border-white/20 px-3.5 py-1.5 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all bg-[#D4AF37]/5 font-semibold cursor-pointer rounded"
              >
                Login
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Drawer (Accordion navigation) */}
      {isOpen && (
        <div id="mobile-nav-panel" className="lg:hidden bg-[#121212] border-t border-white/10 px-4 py-6 space-y-4 animate-fadeIn">
          {/* Mobile Search input */}
          <div className="relative border-b border-white/20 pb-1">
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-transparent text-[11px] outline-none w-full placeholder-white/30 tracking-widest text-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-white/50 absolute right-1 top-0" />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1A1A1A] border border-white/10 rounded shadow-lg z-50">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      handleSuggestionSelect(p);
                      setIsOpen(false);
                    }}
                    className="p-3 text-[11px] hover:bg-[#D4AF37]/10 flex items-center gap-3 cursor-pointer"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-6 h-6 object-cover rounded" />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 font-serif italic text-lg tracking-widest text-white/90">
            <button onClick={() => handleMenuItemClick("home")} className="text-left py-1 hover:text-[#D4AF37]">Home</button>
            <button onClick={() => handleMenuItemClick("collections")} className="text-left py-1 hover:text-[#D4AF37]">Collections</button>
            <button onClick={() => handleMenuItemClick("clothing")} className="text-left py-1 hover:text-[#D4AF37]">Clothing (Sarees, Kurtis & Dresses)</button>
            <button onClick={() => handleMenuItemClick("jewellery")} className="text-left py-1 hover:text-[#D4AF37]">Jewellery (Earrings, Necklaces & Rings)</button>
            <button onClick={() => handleMenuItemClick("portfolio")} className="text-left py-1 hover:text-[#D4AF37]">Luxury Portfolio</button>
            <button onClick={() => handleMenuItemClick("blog")} className="text-left py-1 hover:text-[#D4AF37]">Fashion Blogs & Tips</button>
            <button onClick={() => handleMenuItemClick("faq")} className="text-left py-1 hover:text-[#D4AF37]">FAQ & Returns</button>
            <button onClick={() => handleMenuItemClick("contact")} className="text-left py-1 hover:text-[#D4AF37]">Contact Us</button>
          </div>
        </div>
      )}
    </header>
  );
}
