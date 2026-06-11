import { useState } from "react";
import { FAQItem } from "../types";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQSectionProps {
  faqData: FAQItem[];
}

export default function FAQSection({ faqData }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-accordions-section" className="py-20 bg-white dark:bg-[#0B0B0B] text-[#0B0B0B] dark:text-white transition-colors select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs text-[#D4AF37] font-bold tracking-[0.3em] uppercase">CUSTOMER DESK</p>
          <h3 className="text-3xl md:text-4xl font-serif font-semibold">Frequently Answered Queries</h3>
          <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-white/60 font-light">
            Providing premium consumer concierge insights about global shipping speeds, luxury returns protocols, and direct Meesho support.
          </p>
        </div>

        {/* FAQ Accordions stack */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-gray-50 dark:bg-[#121212] border border-black/5 dark:border-white/5 rounded-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full text-left p-5 flex justify-between items-center hover:text-[#D4AF37] transition-colors gap-4 cursor-pointer"
                  title={`Toggle answers for ${item.question}`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    <span className="text-sm font-sans font-semibold tracking-wide">{item.question}</span>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {/* Body details */}
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-gray-500 dark:text-white/60 leading-relaxed font-light border-t border-black/5 dark:border-white/5 animate-fadeIn">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
