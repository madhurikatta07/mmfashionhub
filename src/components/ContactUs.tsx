import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Heart } from "lucide-react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name || !email || !message) {
      setErrorMsg("Please fill in all crucial details.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 4000);
  };

  const handleWhatsAppChat = () => {
    // Elegant launch for luxury WhatsApp styling chat concierge
    const text = "%22Hello,%20I%20want%20to%20know%20more%20about%20your%20Royal%20Banarasi%20Sarees%20and%20Jewellery%20on%20Madhu%20Magic%20hub.%22";
    window.open(`https://wa.me/919999999999?text=${text}`, "_blank");
  };

  return (
    <section id="contact-us-section" className="py-20 bg-gray-50 dark:bg-[#121212] text-[#0B0B0B] dark:text-white transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs text-[#D4AF37] font-bold tracking-[0.3em] uppercase">DIRECT CONCIERGE</p>
          <h3 className="text-3xl md:text-4xl font-serif font-semibold">Contact Our Luxury Hub</h3>
          <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-white/60 font-light">
            Need customized bridal measurements, jewelry size advising, or order modifications? We are at your service.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: Info Coordinates */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#0B0B0B] p-6 rounded-lg border border-black/5 dark:border-white/5 space-y-4">
              <h4 className="text-sm uppercase tracking-widest font-black text-[#D4AF37] border-b border-black/5 dark:border-white/10 pb-2">
                Boutique Headquarters
              </h4>

              <div className="space-y-4 text-xs font-light text-gray-500 dark:text-white/70">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <h5 className="font-bold uppercase tracking-wider text-[#0B0B0B] dark:text-white mb-0.5">Physical Address</h5>
                    <p>Flat 101, Madhu Magic Towers, DLF Phase 1, Gurgaon, Haryana, India</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <h5 className="font-bold uppercase tracking-wider text-[#0B0B0B] dark:text-white mb-0.5">Calling Concierge</h5>
                    <p>+91 99999 12345 | Toll-Free: 1800 200 4500</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <h5 className="font-bold uppercase tracking-wider text-[#0B0B0B] dark:text-white mb-0.5">Email Support</h5>
                    <p>mmfashionhub@gmail.com | concierge@madhumagic.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Floating trigger panel */}
            <div className="bg-[#25D366]/10 border border-[#25D366]/25 p-6 rounded-lg text-center space-y-3">
              <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#25D366]/20">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-semibold text-[#0B0B0B] dark:text-white uppercase tracking-wider">Fast WhatsApp Support</h5>
              <p className="text-[11px] text-gray-500 dark:text-white/60 font-light leading-relaxed">
                Connect directly with our master stylists on WhatsApp for instant fabric checks, real images of designs, and fast discounts.
              </p>
              <button
                onClick={handleWhatsAppChat}
                className="w-full bg-[#25D366] text-white py-2.5 rounded text-xs uppercase tracking-widest font-black flex items-center justify-center gap-1.5 transition-all hover:bg-emerald-600 shadow-md cursor-pointer"
              >
                <span>Launch Chat Concierge</span>
              </button>
            </div>
          </div>

          {/* Center Form: Active Forms */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0B0B0B] p-8 rounded-lg border border-black/5 dark:border-white/10 space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-black text-[#D4AF37] border-b border-black/5 dark:border-white/10 pb-2">
              Transmit Encrypted Inquiry
            </h4>

            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <Heart className="w-6 h-6 fill-currentColor" />
                </div>
                <h5 className="text-md font-serif italic text-emerald-500">Inquiry Received !</h5>
                <p className="text-xs text-gray-500 dark:text-white/60">
                  Thank you for writing. Our personal styling desks will contact you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded font-semibold animate-pulse">
                    {errorMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-700 dark:text-white outline-none focus:border-[#D4AF37]"
                      placeholder="Aradhana Sharma"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Your Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-700 dark:text-white outline-none focus:border-[#D4AF37]"
                      placeholder="aradhana@gmail.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Subject / Inquiry Matter</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-700 dark:text-white outline-none focus:border-[#D4AF37]"
                    placeholder="Custom Sizing / Fabric Inquiries"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Message Details</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-700 dark:text-white outline-none focus:border-[#D4AF37]"
                    placeholder="Describe measurement adjustments or question particulars here..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#D4AF37] text-black px-8 py-3 text-xs tracking-widest uppercase font-black rounded hover:bg-white border hover:border-[#D4AF37] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Brand Locator Map placeholder - styled on a gorgeous black canvas */}
        <div className="mt-12 overflow-hidden rounded-lg border border-black/5 dark:border-white/10 h-72 relative bg-neutral-900 group">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity filter saturate-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37]">Virtual Showroom</span>
            <h5 className="text-xl font-serif">Delhi National Capital Region (NCR) Flagship</h5>
            <p className="text-xs text-white/50 max-w-md font-light uppercase tracking-widest">
              Visit our boutique stores inside DLF CyberCity Phase 1 for premium jewelry drapes and gold testing checks.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
