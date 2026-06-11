import { useState, useEffect } from "react";
import { X, Heart, ShoppingBag, Plus, Minus, Star, Share2, HelpCircle, Check, Sparkles } from "lucide-react";
import { Product } from "../types";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  isWishlisted: boolean;
  onWishlistToggle: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: string, selectedSize: string, quantity: number) => void;
  relatedProducts: Product[];
  onRelatedSelect: (product: Product) => void;
}

export default function ProductModal({
  product,
  onClose,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  relatedProducts,
  onRelatedSelect,
}: ProductModalProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Product[]>([]);
  const [stylistNote, setStylistNote] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // Sync active image with product change
  useEffect(() => {
    setActiveImage(product.images[0]);
    setSelectedColor(product.colors[0] || "");
    setSelectedSize(product.sizes[0] || "");
    setQuantity(1);
    fetchAISuggestions();
  }, [product]);

  // Fetch true client recommendations via the server-side Gemini API!
  const fetchAISuggestions = async () => {
    setLoadingAI(true);
    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentItemId: product.id,
          preferences: { category: product.category, type: product.type },
          history: [product.category]
        }),
      });
      const data = await response.json();
      setAiSuggestions(data.recommendations || []);
      setStylistNote(data.aiThinking || "");
    } catch (e) {
      console.error("Failed to query luxury AI stylist suggestions", e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleShareLocal = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#product-${product.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddToCartLocal = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#121212] w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden border border-[#D4AF37]/20 flex flex-col max-h-[90vh]">
        
        {/* Modal close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#0B0B0B]/10 dark:bg-white/10 rounded-full hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] hover:text-[#0B0B0B] text-gray-500 dark:text-gray-300 transition-colors cursor-pointer"
          title="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content Grid */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Product Images Gallery */}
            <div className="space-y-4">
              <div className="aspect-[3/4] w-full overflow-hidden rounded bg-gray-100 dark:bg-black border border-black/5 dark:border-white/5 relative">
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                
                {product.stock === 0 && (
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-serif uppercase tracking-widest text-lg font-bold">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Thumbnails list */}
              {product.images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-20 rounded border overflow-hidden opacity-85 hover:opacity-100 transition-all ${
                        activeImage === img ? "border-[#D4AF37] ring-1 ring-[#D4AF37]" : "border-black/10 dark:border-white/10"
                      }`}
                    >
                      <img src={img} alt={`${product.name} Preview ${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info and Actions */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-[#D4AF37] font-bold tracking-[0.25em] uppercase">
                  {product.type} &gt; {product.category}
                </span>
                <h3 className="text-2xl font-serif text-gray-900 dark:text-white mt-1 font-semibold">
                  {product.name}
                </h3>
                
                {/* Rating & reviews metrics */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "fill-currentColor" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-white/60">
                    {product.rating} Out of 5 Stars ({product.ratingCount} Customer Reviews)
                  </span>
                </div>
              </div>

              {/* Pricing section */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg flex items-baseline justify-between border border-black/5 dark:border-white/5">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-none mb-1">Our Price</p>
                  <span className="text-2xl font-serif font-black text-[#D4AF37]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </div>
                {product.originalPrice > product.price && (
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-none mb-1">List Price</p>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="block text-[10px] font-bold text-red-500">
                      You Save {product.discount}% !
                    </span>
                  </div>
                )}
              </div>

              {/* Description body */}
              <div className="space-y-2">
                <h5 className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Description</h5>
                <p className="text-xs text-gray-500 dark:text-white/70 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Interactive Multi-Selectors */}
              <div className="grid grid-cols-2 gap-4">
                {/* Colors Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Select Color Variant</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 px-3 py-2 text-xs rounded text-gray-700 dark:text-white outline-none focus:border-[#D4AF37]"
                  >
                    {product.colors.map((c) => (
                      <option key={c} value={c} className="bg-white dark:bg-[#121212] text-black dark:text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Select Size Variant</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 px-3 py-2 text-xs rounded text-gray-700 dark:text-white outline-none focus:border-[#D4AF37]"
                  >
                    {product.sizes.map((s) => (
                      <option key={s} value={s} className="bg-white dark:bg-[#121212] text-black dark:text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity selector and Add-to-cart operations */}
              <div className="flex gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">Quantity</label>
                  <div className="flex items-center border border-black/15 dark:border-white/10 rounded overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-gray-700 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 pt-5 flex gap-2">
                  <button
                    onClick={handleAddToCartLocal}
                    disabled={product.stock === 0}
                    className="flex-1 bg-[#D4AF37] hover:bg-white border hover:border-[#D4AF37] text-black hover:text-black py-3 text-xs tracking-widest uppercase font-bold rounded shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.stock === 0 ? "Out of Stock" : "Confirm Purchase"}</span>
                  </button>

                  <button
                    onClick={() => onWishlistToggle(product)}
                    className={`px-3 border rounded flex items-center justify-center transition-all ${
                      isWishlisted
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] transform scale-102"
                        : "border-black/10 dark:border-white/15 h-12 text-gray-400 hover:text-white"
                    }`}
                    title={isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  >
                    <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                  </button>

                  <button
                    onClick={handleShareLocal}
                    className="px-3 border border-black/10 dark:border-white/15 rounded flex items-center justify-center text-gray-400 hover:text-[#D4AF37] transition-all cursor-pointer"
                    title="Copy luxurious share link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-500 animate-bounce" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Fast Meesho Redirect selling options if integrated */}
              {product.meeshoUrl && (
                <div className="p-3 bg-fuchsia-500/10 border border-fuchsia-500/25 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-fuchsia-600 rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest">Meesho Sync Live</span>
                  </div>
                  <a
                    href={product.meeshoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-fuchsia-600 text-white hover:bg-fuchsia-700 font-bold uppercase text-[9.5px] px-3.5 py-1.5 rounded tracking-widest transition-all"
                  >
                    Buy via Meesho Store &gt;
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Luxury AI Personal Stylist Recommendation Engine Section */}
          <div className="border-t border-black/10 dark:border-white/10 pt-8 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <h4 className="text-md font-serif uppercase tracking-widest font-black text-[#D4AF37]">
                AI Couture Wardrobe Stylist Advisory
              </h4>
            </div>

            {loadingAI ? (
              <div className="flex items-center gap-3 bg-[#D4AF37]/5 p-4 rounded border border-[#D4AF37]/25">
                <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-[#D4AF37] animate-spin" />
                <span className="text-[11px] text-[#D4AF37] italic font-semibold">Curation engine styling custom recommendations from current stocks...</span>
              </div>
            ) : (
              stylistNote && (
                <div className="bg-[#D4AF37]/5 p-4 rounded border border-[#D4AF37]/20 relative">
                  <p className="text-xs text-gray-700 dark:text-white/80 leading-relaxed font-light italic">
                    "{stylistNote}"
                  </p>
                  <span className="absolute bottom-2 right-4 text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                    - Madhu Marie, Senior Virtual Stylist
                  </span>
                </div>
              )
            )}

            {/* AI Curated suggested matching products preview lists */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Matching Pairings & Frequently Bought Together</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {aiSuggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onRelatedSelect(item);
                      setActiveImage(item.images[0]);
                    }}
                    className="cursor-pointer border border-black/5 dark:border-white/5 rounded p-2 text-center group space-y-1.5 hover:border-[#D4AF37]"
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <p className="text-[10px] font-semibold text-gray-800 dark:text-white truncate">{item.name}</p>
                    <p className="text-[9.5px] font-bold text-[#D4AF37]">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
