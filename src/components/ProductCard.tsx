import React, { useState } from "react";
import { Product } from "../types";
import { Heart, ShoppingBag, Eye, Share2, Star, ExternalLink, Check, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, color: string, size: string, qty: number) => void;
  onAddToWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  onQuickView,
}: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qty, setQty] = useState(1);

  // Handle direct share link
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasDiscount = product.discount > 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-[#121212]/90 border border-white/5 rounded-none overflow-hidden transition-all duration-300 hover:border-luxury-gold/50 flex flex-col h-full text-white"
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Badge container */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {product.isBestseller && (
          <span className="bg-luxury-gold text-luxury-black text-[9px] font-bold tracking-widest px-2.5 py-0.5 uppercase">
            Bestseller
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-luxury-blue text-white text-[9px] font-bold tracking-widest px-2.5 py-0.5 uppercase">
            New
          </span>
        )}
        {product.isTrending && (
          <span className="bg-emerald-600 text-white text-[9px] font-bold tracking-widest px-2.5 py-0.5 uppercase">
            Trending
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase">
            Only {product.stock} Left
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-white/10 text-white/60 text-[9px] font-bold px-2 py-0.5 uppercase backdrop-blur-md">
            Out of Stock
          </span>
        )}
      </div>

      {/* Heart Wishlist Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToWishlist(product);
        }}
        id={`btn-wishlist-${product.id}`}
        aria-label="Wishlist"
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-luxury-gold hover:text-black transition-colors backdrop-blur-md text-white border border-white/10"
      >
        <Heart size={15} fill={isWishlisted ? "#D4AF37" : "none"} className={isWishlisted ? "text-luxury-gold" : "text-white"} />
      </button>

      {/* Asset Display */}
      <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.images[currentImageIndex] || "https://images.unsplash.com/photo-1490224968588-519a5fcaaacd?w=600&q=80"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="w-full flex justify-between gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white py-2 text-[10px] tracking-widest uppercase font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-1.5"
            >
              <Eye size={12} />
              Quick View
            </button>
            <button
              onClick={handleShare}
              className="bg-white/15 backdrop-blur-md border border-white/20 text-white p-2 hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center"
              title="Share Design Link"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Metadata Detail Block */}
      <div className="p-4 flex flex-col flex-grow bg-[#151515]">
        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1 font-serif">
          {product.category}
        </span>
        <h3 className="text-[13px] font-serif tracking-wide text-white/90 group-hover:text-luxury-gold line-clamp-1 cursor-pointer transition-colors" onClick={() => onQuickView(product)}>
          {product.name}
        </h3>

        {/* Reviews */}
        <div className="flex items-center gap-1 mt-1.5 mb-2.5">
          <div className="flex text-luxury-gold">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.floor(product.rating) ? "#D4AF37" : "none"}
                className={i < Math.floor(product.rating) ? "text-luxury-gold" : "text-white/20"}
              />
            ))}
          </div>
          <span className="text-[10px] text-white/40">({product.ratingCount})</span>
        </div>

        {/* Pricing Layout */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-sm font-semibold tracking-wide text-luxury-gold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[11px] line-through text-white/40">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                ({product.discount}% Off)
              </span>
            </>
          )}
        </div>

        {/* Sizes and Colors Pickers */}
        <div className="mt-4 pt-3.5 border-t border-white/5 space-y-3">
          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-widest uppercase text-white/40">Color:</span>
              <div className="flex gap-1.5">
                {product.colors.slice(0, 4).map((col) => (
                  <button
                    key={col}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(col);
                    }}
                    title={col}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      selectedColor === col ? "border-luxury-gold scale-110" : "border-white/10"
                    }`}
                    style={{
                      backgroundColor:
                        col.includes("Blue") ? "#0F2D52" :
                        col.includes("Red") ? "#9B111E" :
                        col.includes("Green") ? "#004B23" :
                        col.includes("Gold") ? "#D4AF37" :
                        col.includes("Black") ? "#111" :
                        col.includes("White") ? "#FFF" :
                        col.includes("Tan") ? "#B38B6D" :
                        col.includes("Burgundy") ? "#800020" :
                        col.includes("Pink") ? "#FFB7C5" : "#777"
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && product.sizes[0] !== "Standard One Size" && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-widest uppercase text-white/40">Size:</span>
              <div className="flex gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(s);
                    }}
                    className={`text-[9px] px-1.5 py-0.5 border ${
                      selectedSize === s
                        ? "border-[#D4AF37] text-[#D4AF37] bg-white/5"
                        : "border-white/15 text-white/60 hover:text-white"
                    } transition-colors uppercase`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Action Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          {product.stock > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, selectedColor, selectedSize, qty);
              }}
              id={`btn-add-cart-${product.id}`}
              className="w-full bg-[#D4AF37] hover:bg-white text-black py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={12} />
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-white/5 text-white/30 border border-white/5 py-2.5 text-[10px] font-bold tracking-widest uppercase cursor-not-allowed"
            >
              Sold Out
            </button>
          )}

          {/* Integration with Meesho Link */}
          {product.meeshoUrl && (
            <a
              href={product.meeshoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full border border-[#D4AF37]/45 hover:border-luxury-gold text-luxury-gold text-center py-2 text-[10px] tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 bg-white/[0.01] hover:bg-neutral-800"
            >
              <span>Buy via Meesho</span>
              <ExternalLink size={10} className="text-luxury-gold" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
