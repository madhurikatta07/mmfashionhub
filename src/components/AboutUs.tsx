import { ShieldCheck, Heart, Diamond, Sparkles, BookOpen } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="about-us-section" className="py-20 bg-white dark:bg-[#0B0B0B] text-[#0B0B0B] dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs text-[#D4AF37] font-bold tracking-[0.3em] uppercase">THE HEART OF MADHU MAGIC</p>
          <h3 className="text-3xl md:text-4xl font-serif font-semibold">Our Luxury Story & Creed</h3>
          <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-white/60 font-light max-w-xl mx-auto">
            Where generations of traditional hand-loom fabrics and celestial jewelry designs meet cutting-edge global fashion frameworks.
          </p>
        </div>

        {/* Elegant Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Story & Fine Details */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs text-[#D4AF37] tracking-widest font-bold">
              <BookOpen className="w-4 h-4" />
              <span>THE CHRONICLES</span>
            </div>
            <h4 className="text-2xl font-serif text-[#0B0B0B] dark:text-white">A Hand-Crafted Dream of Royal Fashion</h4>
            <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed font-light">
              Founded under the pursuit of pure visual elegance, <strong>Madhu Magic Fashion Hub</strong> has blossomed into a preeminent sanctuary for women who define their style with confidence, royal culture, and luxurious poise.
            </p>
            <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed font-light">
              We specialize in elite women's textiles, custom Banarasi and Georgette weavers, high-brilliance Simulated Diamonds, and Rajputana Polki sets that capture the gorgeous, grand essence of classical Indian events.
            </p>

            {/* Core Values / Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <div className="p-2.5 bg-[#D4AF37]/10 rounded h-fit">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h5 className="text-xs tracking-wider uppercase font-bold text-[#D4AF37]">Quality Assurance</h5>
                  <p className="text-[11px] text-gray-500 dark:text-white/50 mt-1 leading-normal">
                    Multi-tier rigorous micro-inspection to guarantee correct zari thread-weights and entirely hypoallergenic gold plating.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-[#D4AF37]/10 rounded h-fit">
                  <Heart className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h5 className="text-xs tracking-wider uppercase font-bold text-[#D4AF37]">Customer Commitment</h5>
                  <p className="text-[11px] text-gray-500 dark:text-white/50 mt-1 leading-normal">
                    Polished direct delivery, luxury velvet storage boxes, and instant integration with secure Meesho catalog networks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="bg-gray-50 dark:bg-[#121212] border border-black/5 dark:border-white/5 p-8 rounded-lg space-y-4 hover:border-[#D4AF37]/30 transition-all gold-hover text-center">
              <div className="w-12 h-12 bg-[#D4AF37]/15 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                <Diamond className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-serif font-semibold tracking-wider text-[#0B0B0B] dark:text-[#D4AF37]">Our Noble Mission</h5>
              <p className="text-xs text-gray-500 dark:text-white/60 leading-relaxed font-light">
                To hand-craft visual legacies that inspire supreme inner strength, joy, and beauty across all global celebrations and daily ceremonies.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gray-50 dark:bg-[#121212] border border-black/5 dark:border-white/5 p-8 rounded-lg space-y-4 hover:border-[#D4AF37]/30 transition-all gold-hover text-center">
              <div className="w-12 h-12 bg-[#D4AF37]/15 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-serif font-semibold tracking-wider text-[#0B0B0B] dark:text-[#D4AF37]">Our Celestial Vision</h5>
              <p className="text-xs text-gray-500 dark:text-white/60 leading-relaxed font-light">
                To remain India's premier digital-first elite fashion boutique, establishing royal standards in ethical and luxury jewelry drapes.
              </p>
            </div>

            {/* Additional Luxury Image Placement Banner */}
            <div className="sm:col-span-2 relative h-40 bg-cover bg-center overflow-hidden rounded-lg brightness-90 border border-black/10 dark:border-white/5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80')" }}>
              <div className="absolute inset-0 bg-black/60 flex flex-col justify-center px-8 space-y-1">
                <span className="text-[9px] text-[#D4AF37] font-bold tracking-widest uppercase">MEMBER OF FEDERATION</span>
                <h6 className="text-lg font-serif text-white uppercase italic">Elite Handloom Heritage Approved</h6>
                <p className="text-[10px] text-white/60 font-light uppercase tracking-widest">Designed and sourced in India</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
