import { useState } from "react";
import { BlogArticle } from "../types";
import { BookOpen, Calendar, User, ArrowRight, X } from "lucide-react";

interface BlogSectionProps {
  articles: BlogArticle[];
}

export default function BlogSection({ articles }: BlogSectionProps) {
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  return (
    <section id="luxury-blog-section" className="py-20 bg-gray-50 dark:bg-[#121212] text-[#0B0B0B] dark:text-white transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs text-[#D4AF37] font-bold tracking-[0.3em] uppercase">THE COUTURE CHRONICLE</p>
          <h3 className="text-3xl md:text-4xl font-serif font-semibold">Fashion Trends & Styling Guides</h3>
          <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-white/60 font-light">
            Stay ahead of seasonal luxury. Insightful advice authored directly by premium stylists of the Madhu Magic Fashion Hub.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-[#0B0B0B] rounded-lg overflow-hidden border border-black/5 dark:border-white/5 flex flex-col justify-between hover:border-[#D4AF37] transition-all gold-hover"
            >
              <div>
                {/* Visual Image header */}
                <div className="aspect-video w-full overflow-hidden bg-black relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#D4AF37]" /> By {article.author}
                    </span>
                  </div>

                  <h4 className="text-base font-serif font-semibold leading-snug hover:text-[#D4AF37] transition-all cursor-pointer" onClick={() => setActiveArticle(article)}>
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-white/60 leading-relaxed font-light line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Read button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveArticle(article)}
                  className="text-xs text-[#D4AF37] hover:text-white tracking-widest uppercase font-black flex items-center gap-1 h-10 cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styled Article detailed Modal popup */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-[#0B0B0B] w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-[#D4AF37]/35 flex flex-col max-h-[85vh]">
            {/* Close */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-[#D4AF37] hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="aspect-video w-full rounded overflow-hidden">
                <img src={activeArticle.image} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-2">
                <span className="bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded">
                  {activeArticle.category}
                </span>
                <h3 className="text-2xl font-serif text-gray-900 dark:text-white font-semibold">
                  {activeArticle.title}
                </h3>
                <div className="flex gap-4 text-xs text-gray-400 pb-2 border-b border-black/5 dark:border-white/5">
                  <span>Published: <strong>{activeArticle.date}</strong></span>
                  <span>|</span>
                  <span>Author: <strong>{activeArticle.author}</strong></span>
                  <span>|</span>
                  <span>Read Time: <strong>{activeArticle.readTime}</strong></span>
                </div>
              </div>

              <p className="text-xs text-gray-700 dark:text-white/80 leading-relaxed font-light whitespace-pre-line">
                {activeArticle.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
