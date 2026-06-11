import React, { useState } from "react";
import { Product } from "../types";
import { Sparkles, Loader2, ArrowRight, CornerDownRight, Gem } from "lucide-react";

interface AIStylistProps {
  products: Product[];
  onAddToCart: (product: Product, color: string, size: string, qty: number) => void;
  onAddToWishlist: (product: Product) => void;
  wishlist: string[];
}

export default function AIStylist({ products, onAddToCart, onAddToWishlist, wishlist }: AIStylistProps) {
  const [preferredType, setPreferredType] = useState("Clothing");
  const [preferredCategory, setPreferredCategory] = useState("Sarees");
  const [preferredColor, setPreferredColor] = useState("Emperor Gold");
  const [mood, setMood] = useState("Royal Mughal Grandeur");
  const [loading, setLoading] = useState(false);
  const [stylistNote, setStylistNote] = useState<string>("");
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [crafted, setCrafted] = useState(false);

  const categories = {
    Clothing: ["Sarees", "Kurtis", "Dresses", "Western Wear", "Ethnic Wear"],
    Jewellery: ["Earrings", "Necklaces", "Bangles", "Bracelets", "Rings"],
    Accessories: ["Handbags", "Fashion Accessories"]
  };

  const handleRecommend = async () => {
    setLoading(true);
    setCrafted(true);
    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            type: preferredType,
            category: preferredCategory,
            color: preferredColor,
            mood: mood
          },
          history: [preferredCategory]
        })
      });
      const data = await response.json();
      setRecommendedProducts(data.recommendations || []);
      setStylistNote(data.aiThinking || "");
    } catch (error) {
      console.error(error);
      setStylistNote("My premium recommendation: combine our pure banarasi textiles with matching heritage jhumkas for unparalleled traditional grandeur.");
      // Fallback matching
      const filtered = products.filter(p => p.type === preferredType).slice(0, 3);
      setRecommendedProducts(filtered.length ? filtered : products.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121212] border border-luxury-gold/20 p-6 md:p-8 rounded-none relative overflow-hidden text-white my-8">
      {/* Absolute ambient light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-blue/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-luxury-gold/5 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
        {/* Style selection wizard */}
        <div className="w-full lg:w-5/12 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-luxury-gold animate-pulse" size={20} />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-luxury-gold">
              Interactive AI Wardrobe
            </span>
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-serif font-light leading-tight text-white">
              Consult Your <span className="italic font-serif text-luxury-gold">Personal Stylist</span>
            </h3>
            <p className="text-white/50 text-xs mt-2 leading-relaxed">
              Let Madhu Magic's elite stylist AI curate the perfect luxury ensemble tailored specifically to your aesthetic tastes, jewelry pairing styles, and occasions.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Preferred Type */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 uppercase">
                1. SELECT WARDROBE CORE:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Clothing", "Jewellery", "Accessories"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setPreferredType(t);
                      // Reset category choice to first of selected type
                      const typeCats = categories[t as keyof typeof categories];
                      if (typeCats) setPreferredCategory(typeCats[0]);
                    }}
                    className={`py-2 text-[11px] tracking-wider uppercase font-semibold text-center border transition-all ${
                      preferredType === t
                        ? "border-luxury-gold text-luxury-gold bg-luxury-gold/5"
                        : "border-white/10 text-white/80 hover:border-white/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom categories based on type */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                2. DESIRED PRODUCT CATEGORY:
              </label>
              <select
                value={preferredCategory}
                onChange={(e) => setPreferredCategory(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2 text-xs tracking-wider text-white focus:outline-none focus:border-luxury-gold"
              >
                {(categories[preferredType as keyof typeof categories] || []).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Preferred Highlight Color */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                  COLOR VALUE:
                </label>
                <select
                  value={preferredColor}
                  onChange={(e) => setPreferredColor(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-luxury-gold"
                >
                  <option value="Emperor Gold">Emperor Gold</option>
                  <option value="Deep Royal Blue">Deep Royal Blue</option>
                  <option value="Obsidian Black">Obsidian Black</option>
                  <option value="Scarlet Red">Scarlet Red</option>
                  <option value="Royal Emerald Gold">Emerald Green</option>
                  <option value="Romantic Pastel Pink">Pastel Pink</option>
                </select>
              </div>

              {/* Occasion / Mood */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                  OCCASION MOOD:
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/15 px-3 py-2.5 text-[11px] text-white focus:outline-none focus:border-luxury-gold"
                >
                  <option value="Royal Wedding Regal">Royal Wedding</option>
                  <option value="Festive Dandiya Sparkle">Festive Dandiya</option>
                  <option value="Soireé Cocktail Elite">Cocktail Hour</option>
                  <option value="High-Street Luxury Runway">High-Street Runway</option>
                  <option value="Traditional Devotional Ritual">Traditional Pooja</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRecommend}
              disabled={loading}
              className="w-full mt-2 bg-luxury-gold hover:bg-white text-black py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-black" size={14} />
                  Weaving Aesthetic Curations...
                </>
              ) : (
                <>
                  <Gem size={14} />
                  Simulate Curation Ensemble
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic feedback panel */}
        <div className="w-full lg:w-7/12 border border-white/10 bg-[#151515] p-6 flex flex-col justify-between self-stretch relative min-h-[320px]">
          {!crafted ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full border border-luxury-gold/35 flex items-center justify-center text-luxury-gold">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-serif italic text-lg text-white">Your Stylist Table is Prepared</h4>
                <p className="text-xs text-white/40 mt-1 max-w-sm">
                  Configure your luxury core and color highlights, then tap 'Simulate Curation' to receive customized matching recommendations instantly.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between gap-6">
              {/* AI stylist message */}
              <div className="bg-[#1C1C1C] border-l-2 border-luxury-gold p-4 relative">
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                  Personal Stylist Note
                </span>
                {loading ? (
                  <div className="space-y-2 py-1.5 animate-pulse">
                    <div className="h-2 bg-white/10 rounded w-5/6" />
                    <div className="h-2 bg-white/10 rounded w-4/6" />
                  </div>
                ) : (
                  <p className="text-xs text-white/80 italic font-serif leading-relaxed">
                    "{stylistNote}"
                  </p>
                )}
              </div>

              {/* Curated list */}
              <div>
                <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/60 mb-3 flex items-center gap-2">
                  <ArrowRight size={12} className="text-[#D4AF37]" />
                  Recommended Wardrobe Pairs
                </h4>

                {loading ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="bg-white/5 border border-white/5 h-28 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {recommendedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-[#1C1C1C] border border-white/5 p-2 flex flex-col relative group hover:border-[#D4AF37]/50 transition-colors"
                      >
                        <div className="aspect-[4/5] bg-neutral-950 overflow-hidden relative">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h5 className="text-[10px] font-serif tracking-tight text-white/90 truncate mt-2">
                          {p.name}
                        </h5>
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-[10px] text-luxury-gold font-semibold">
                            ₹{p.price.toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => onAddToCart(p, p.colors[0] || "", p.sizes[0] || "", 1)}
                            className="text-[9px] uppercase tracking-tighter text-white hover:text-luxury-gold border-b border-[#D4AF37] opacity-60 group-hover:opacity-100 transition-all font-semibold"
                          >
                            + ADD
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-[9px] text-white/30 flex items-center gap-1 mt-2">
                <CornerDownRight size={10} />
                Matched via real-time inventory scanning & dynamic style affinity weights.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
