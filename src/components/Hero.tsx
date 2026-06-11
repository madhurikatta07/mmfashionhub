import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Sparkles, TrendingUp, RefreshCw } from "lucide-react";

interface HeroProps {
  onShopNow: () => void;
  onExplore: () => void;
  onNewArrivals: () => void;
}

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80",
    title: "Elevate Your Style",
    italicTitle: "With Royal Grace",
    subtitle: "Explore sovereign handloom Banarasi silk sarees and designer clothing crafted with absolute visual perfection.",
    tag: "IMPERIAL SILK EDIT",
    discount: "Up to 50% Luxury Waiver"
  },
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80",
    title: "Celestial Jewellery",
    italicTitle: "Uncut Maharaja Kundans",
    subtitle: "Adorn yourself with hand-selected freshwater pearls and majestic gold plated necklaces representing premium Indian luxury.",
    tag: "TANISHQ STYLE CHOKERS",
    discount: "Flat 20% Off Fine Gold Sets"
  },
  {
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1600&q=80",
    title: "Chic Western Gowns",
    italicTitle: "Midnight Cocktail Poetry",
    subtitle: "Indulge in structured velvet fabrics, tailored sweetheart hemlines, and professional party outfits for high-society events.",
    tag: "COUTURE COCKTAIL CAPSULE",
    discount: "Exclusive 2026 Collection"
  }
];

export default function Hero({ onShopNow, onExplore, onNewArrivals }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section id="hero-slider-section" className="relative h-[550px] md:h-[680px] bg-[#0B0B0B] overflow-hidden text-white flex items-center">
      {/* Background Image Slider with Zoom effect */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-1000 transform scale-102 filter brightness-[0.45] dark:brightness-[0.35]"
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/70 to-transparent z-10" />
      </div>

      {/* Hero Content inside Grid */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Main Info Blocks with Fade transition */}
          <div className="space-y-6 md:space-y-8 max-w-xl animate-fadeIn">
            
            {/* Tagline / Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.tag}</span>
            </div>

            {/* Title / Beautiful Serif Style headers */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light leading-[1.1] tracking-wide text-white">
              {slide.title} <br />
              <span className="italic text-[#D4AF37] font-semibold">{slide.italicTitle}</span>
            </h2>

            {/* Subtitle */}
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md font-light">
              {slide.subtitle}
            </p>

            {/* Seasonal promotion details */}
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] tracking-widest font-semibold">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <span>OFFER: {slide.discount}</span>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onShopNow}
                id="hero-shop-now-btn"
                className="bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-[#D4AF37]/20 rounded cursor-pointer"
              >
                Shop Now
              </button>
              <button
                onClick={onExplore}
                id="hero-explore-btn"
                className="border border-white/20 text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all bg-white/5 backdrop-blur-md rounded cursor-pointer"
              >
                Explore Collection
              </button>
              <button
                onClick={onNewArrivals}
                id="hero-new-arrivals-btn"
                className="hidden sm:inline-flex items-center gap-1 text-[10px] text-white/50 hover:text-white uppercase tracking-widest py-3 font-semibold border-b border-white/20 hover:border-[#D4AF37] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                New Arrivals
              </button>
            </div>
          </div>

          {/* Luxury Showcase Interactive floating card */}
          <div className="hidden md:flex justify-end perspective-1000">
            <div className="relative w-80 bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-2xl space-y-4 hover:border-[#D4AF37]/50 transition-all gold-hover transform hover:rotate-1">
              <span className="absolute -top-3 -right-3 bg-[#D4AF37] text-[#0B0B0B] px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">
                Best Seller
              </span>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold">Classic Style Suggestion</p>
              <h4 className="text-xl font-serif text-white">Madhu Magic Banarasi</h4>
              <p className="text-xs text-white/60 font-light">
                Hand-woven luxury sarees perfectly paired with antique Kundan studs for preeminent royal events.
              </p>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wider text-[#D4AF37]">₹3,499 onward</span>
                <span className="text-[9px] text-[#D4AF37]/80 uppercase tracking-widest flex items-center gap-1 bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                  <RefreshCw className="w-3 h-3 animate-spin" /> In Stock
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows for Slider */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">
        <button
          onClick={handlePrev}
          id="hero-prev-btn"
          className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0B0B0B] hover:border-[#D4AF37] transition-all text-white bg-white/5 backdrop-blur-md cursor-pointer"
          title="Previous slide"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs tracking-widest font-bold font-serif text-white/50">
          <span className="text-[#D4AF37]">0{currentSlide + 1}</span> / 0{HERO_SLIDES.length}
        </span>
        <button
          onClick={handleNext}
          id="hero-next-btn"
          className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0B0B0B] hover:border-[#D4AF37] transition-all text-white bg-white/5 backdrop-blur-md cursor-pointer"
          title="Next slide"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Luxury aesthetic edge divider lines */}
      <div className="absolute left-[8%] top-0 w-[1px] h-full bg-white/5 pointer-events-none" />
      <div className="absolute right-[8%] top-0 w-[1px] h-full bg-white/5 pointer-events-none" />
    </section>
  );
}
