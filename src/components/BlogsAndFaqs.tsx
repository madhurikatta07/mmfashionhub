import React, { useState } from "react";
import { BlogArticle, FAQItem } from "../types";
import { ChevronDown, ChevronUp, Clock, User, ArrowRight, Eye } from "lucide-react";

interface BlogsAndFaqsProps {
  blogs: BlogArticle[];
  faqs: FAQItem[];
}

export default function BlogsAndFaqs({ blogs, faqs }: BlogsAndFaqsProps) {
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQIndex(activeFAQIndex === index ? null : index);
  };

  return (
    <div className="space-y-16 py-12 border-t border-white/5">
      {/* Portfolio/Lookbook & Blogs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" id="portfolio-blog">
        {/* Blog Showcase */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37]">
              Fashion Musings & Guidance
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-light text-white">
              The <span className="italic font-serif text-luxury-gold">Madhu Magic</span> Column
            </h3>
          </div>

          <div className="space-y-4">
            {blogs.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedBlog(article)}
                id={`blog-item-${article.id}`}
                className="group border border-white/5 bg-[#121212]/50 p-5 hover:border-luxury-gold/35 transition-all cursor-pointer flex gap-4"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-neutral-900 overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-luxury-gold/80 block mb-1">
                      {article.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-serif text-white group-hover:text-luxury-gold line-clamp-2 transition-colors">
                      {article.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/5 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      By {article.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Lookbooks */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37]">
              Grand Celebrations & Lookbooks
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-light text-white">
              Boutique <span className="italic font-serif text-luxury-gold">Masterworks Portfolio</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: "Royal Wedding Curation",
                desc: "Banarasi brocades teamed with Kundan emerald ornaments.",
                img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
                badge: "Wedding Collection"
              },
              {
                title: "Festive Dandiya Night",
                desc: "Air-textured silk Anarkalis styled with Polki bracelets.",
                img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
                badge: "Festival Collection"
              },
              {
                title: "Cocktail Gala Elite",
                desc: "Midnight velvet dresses styled with flawless solitaire crown rings.",
                img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
                badge: "Latest Collection"
              },
              {
                title: "High-Trend Urban Wear",
                desc: "Gold-button classic blazers on tailored coordinates.",
                img: "https://images.unsplash.com/photo-1490224968588-519a5fcaaacd?w=600&q=80",
                badge: "Trending Products"
              }
            ].map((port, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/5] overflow-hidden border border-white/5 cursor-pointer bg-black"
              >
                <img
                  src={port.img}
                  alt={port.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-4 flex flex-col justify-end text-left">
                  <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                    {port.badge}
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm text-white group-hover:text-luxury-gold transition-colors">
                    {port.title}
                  </h4>
                  <p className="text-[9px] text-white/50 mt-1 line-clamp-2 leading-relaxed font-light">
                    {port.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion FAQ Area */}
      <div className="space-y-6 pt-8 border-t border-white/5" id="faq-section">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37]">
            Answers & Clarity
          </span>
          <h3 className="text-2xl md:text-3xl font-serif font-light text-white">
            Client <span className="italic font-serif text-luxury-gold">Frequently Asked Queries</span>
          </h3>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-white/10 bg-[#121212]/80 overflow-hidden rounded-none transition-colors"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                id={`faq-btn-${idx}`}
                className="w-full text-left p-4 flex justify-between items-center text-xs sm:text-sm font-semibold text-white/90 hover:text-[#D4AF37] transition-all"
              >
                <span>{faq.question}</span>
                {activeFAQIndex === idx ? (
                  <ChevronUp size={16} className="text-luxury-gold" />
                ) : (
                  <ChevronDown size={16} className="text-white/40" />
                )}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out px-4 overflow-hidden ${
                  activeFAQIndex === idx ? "max-h-40 pb-4 border-t border-white/5 pt-3.5" : "max-h-0"
                }`}
              >
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Detail Modal Expand */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-luxury-gold/50 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 relative text-left">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-sm"
            >
              ✕ CLOSE
            </button>

            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold">
              {selectedBlog.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-white">{selectedBlog.title}</h2>

            <div className="flex gap-4 text-xs text-white/40">
              <span>By {selectedBlog.author}</span>
              <span>•</span>
              <span>{selectedBlog.date}</span>
              <span>•</span>
              <span>{selectedBlog.readTime}</span>
            </div>

            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-64 object-cover border border-white/5"
            />

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed whitespace-pre-line font-light">
              {selectedBlog.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
