import { Product, BlogArticle, FAQItem, TestimonialItem } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-saree-royal",
    name: "Royal Banarasi Silk Saree",
    category: "Sarees",
    type: "Clothing",
    price: 3499,
    originalPrice: 6999,
    discount: 50,
    rating: 4.9,
    ratingCount: 142,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
    ],
    stock: 25,
    colors: ["Deep Royal Blue", "Emperor Gold", "Scarlet Red"],
    sizes: ["Unstitched Blouse Included"],
    description: "An exquisite Banarasi Silk Saree handwoven with genuine zari borders. Designed for weddings and grand festive celebrations, showcasing traditional Indian luxury and unparalleled craftsmanship.",
    isBestseller: true,
    isTrending: true,
    meeshoUrl: "https://meesho.com/products/banarasi-silk-saree-luxury"
  },
  {
    id: "prod-kurti-cotton",
    name: "Golden Embellished Anarkali Kurti",
    category: "Kurtis",
    type: "Clothing",
    price: 1899,
    originalPrice: 3799,
    discount: 50,
    rating: 4.8,
    ratingCount: 94,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80"
    ],
    stock: 45,
    colors: ["Crimson Gold", "Navy Blue", "Forest Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A gorgeous cotton-silk Anarkali Kurti detailed with intricate gold embroidery and a flared hemline. Comfortable yet deeply elegant, making it ideal for both evening party wear and festivals.",
    isNewArrival: true,
    meeshoUrl: "https://meesho.com/products/anarkali-kurti-elegant"
  },
  {
    id: "prod-dress-velvet",
    name: "Midnight Velvet Prom Gown",
    category: "Dresses",
    type: "Clothing",
    price: 4500,
    originalPrice: 8999,
    discount: 50,
    rating: 4.9,
    ratingCount: 68,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"
    ],
    stock: 12,
    colors: ["Obsidian Black", "Ruby Red", "Emerald Green"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Feel absolutely magnificent in our custom velvet gown. Features a tailored sweetheart neckline, subtle sparkling waist details, and a high-leg slit for maximum luxury appeal.",
    isTrending: true,
    meeshoUrl: "https://meesho.com/products/velvet-prom-gown-royal"
  },
  {
    id: "prod-western-blaze",
    name: "Metropolitan Gold Button Blazer",
    category: "Western Wear",
    type: "Clothing",
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    rating: 4.7,
    ratingCount: 81,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
    ],
    stock: 30,
    colors: ["Pristine White", "Royal Black", "Power Pink"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A sharp, tailored double-breasted blazer featuring premium gold-accented buttons. Instantly elevates western coordinates or party wear with structured confidence.",
    isNewArrival: true
  },
  {
    id: "prod-ear-jhumka",
    name: "Imperial Kundan & Pearl Jhumkas",
    category: "Earrings",
    type: "Jewellery",
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    rating: 4.9,
    ratingCount: 215,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"
    ],
    stock: 50,
    colors: ["24K Gold Plated"],
    sizes: ["Standard One Size"],
    description: "Handcrafted 24K gold plated Jhumkas adorned with selected uncut Kundan stones and dangling freshwater pearls. Perfect companions for ethnic wear and traditional sarees.",
    isBestseller: true,
    meeshoUrl: "https://meesho.com/products/imperial-kundan-jhumka"
  },
  {
    id: "prod-neck-emerald",
    name: "Classic Maharaja Emerald Choker Set",
    category: "Necklaces",
    type: "Jewellery",
    price: 5999,
    originalPrice: 11999,
    discount: 50,
    rating: 5.0,
    ratingCount: 38,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
    ],
    stock: 8,
    colors: ["Royal Emerald Gold"],
    sizes: ["Adjustable Neck Choker"],
    description: "An awe-inspiring masterpiece choker. Intricately laid Kundan clusters surrounded by lush forest emerald drops. Complete with matching luxury drops earrings.",
    isTrending: true,
    isBestseller: true
  },
  {
    id: "prod-bang-bridal",
    name: "Rajputana Royal Polki Bangles (Set of 4)",
    category: "Bangles",
    type: "Jewellery",
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    rating: 4.8,
    ratingCount: 76,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"
    ],
    stock: 15,
    colors: ["Traditional Gold"],
    sizes: ["2.4", "2.6", "2.8"],
    description: "A traditional set of four Polki glass-stone and floral-work gold-plated bangles. Highly durable plating styled with comfortable inner finishes.",
    meeshoUrl: "https://meesho.com/products/rajputana-polki-bangle-set"
  },
  {
    id: "prod-ring-engagement",
    name: "Eternal Solitaire Golden Crown Ring",
    category: "Rings",
    type: "Jewellery",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.7,
    ratingCount: 119,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"
    ],
    stock: 40,
    colors: ["Rose Gold", "Yellow Gold", "Platinum Finish"],
    sizes: ["6", "7", "8", "9"],
    description: "A stunning centerpiece ring shaped like an imperial crown, featuring a high-brilliance flawless simulated diamond solitaire. Perfect for gifts and declarations of love.",
    isNewArrival: true
  },
  {
    id: "prod-bag-handbag",
    name: "Golden Clasp Crocodile Texture Satchel",
    category: "Handbags",
    type: "Accessories",
    price: 3200,
    originalPrice: 6400,
    discount: 50,
    rating: 4.8,
    ratingCount: 88,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"
    ],
    stock: 20,
    colors: ["Classic Tan", "Scarlet Burgundy", "Midnight Black"],
    sizes: ["Medium Carryall"],
    description: "An elegant crocodile embossed luxury leather handbag detailed with a dynamic custom gold clasp. Crafted with double inner compartments for perfect organize-ability.",
    isBestseller: true
  },
  {
    id: "prod-ethnic-lehenga",
    name: "Ethereal Swarovski Georgette Lehenga",
    category: "Ethnic Wear",
    type: "Clothing",
    price: 7500,
    originalPrice: 14999,
    discount: 50,
    rating: 4.9,
    ratingCount: 52,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
    ],
    stock: 10,
    colors: ["Romantic Pastel Pink", "Serene Mint Green"],
    sizes: ["Semi-Stitched"],
    description: "An incredibly elegant Georgette Lehenga featuring hand-sewn Swarovski crystals and thread embroidery. Includes an embroidered Dupatta with matching borders.",
    isTrending: true,
    meeshoUrl: "https://meesho.com/products/swarovski-georgette-lehenga"
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testi-1",
    name: "Aradhana Sharma",
    role: "Verified Bridal Client",
    rating: 5,
    comment: "The Royal Banarasi Silk Saree is an absolute dream! The zari shine looks deeply premium and authentic, exactly like the leading heritage shops. Madhu Magic Hub has earned my lifelong trust.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80"
  },
  {
    id: "testi-2",
    name: "Meera Krishnan",
    role: "Loyal Shopper",
    rating: 5,
    comment: "I purchased the Maharaja Emerald Choker. It came in beautiful velvet gift box housing! Absolute visual luxury. Everyone at the dinner party could not stop asking about it.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
  },
  {
    id: "testi-3",
    name: "Pooja Malhotra",
    role: "Fashion Blogger",
    rating: 5,
    comment: "Excellent Meesho integration! I clicked product link on the Madhu Magic hub and checked out via Meesho with great discount, though buying directly has gorgeous packaging. Top notch user experience!",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80"
  }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "blog-1",
    title: "5 Ultimate Ways to Style Kundan Jewellery with Modern Outfits",
    excerpt: "Learn how to wear heavy royal Indian Kundan pieces with chic power suits, gowns, and western dresses.",
    content: `Traditional Kundan jewelry holds a beautiful, royal history, but why restrict it to weddings? Luxury fashion is all about self-expression and contrast. Here are five golden styling tips to pair Kundan earrings or necklaces with your modern wardrobe:

1. **The Power Suit Contrast**: Slide a Kundan choker inside a sharp, single-toned ivory blazer. The high-contrast gold turns a professional look into high-society elegance.
2. **The Classic Crisp White Shirt**: Roll up your sleeves, open the collar slightly, and lay a multi-layered Polki or Kundan necklace flat against your neck.
3. **Off-Shoulder Silk Gowns**: Minimalist gowns paired with heavy dangling Kundan Jhumkas look absolute ZARA chic!
4. **Denim and Diamonds**: Put on a luxury handloom kurti, light-wash luxury jeans, and pair them with micro-designed Kundan hoops.
5. **Color Block with Emeralds**: Pair deep royal blue sarees with ruby-red stones or light-mint emerald jewelry for ultimate visual pop.`,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    author: "Madhu K.",
    date: "June 08, 2026",
    readTime: "4 min read",
    category: "Jewellery Styling Tips"
  },
  {
    id: "blog-2",
    title: "The Ultimate Guide to Selecting Your Dream Wedding Saree",
    excerpt: "Diving deep into the weave weight, real gold thread, and material selections of authentic Banarasi and Kanjeevarams.",
    content: `When it comes to bridal wear, the luxury of silk is unmatched. Silk represents status, heritage, and pure elegance. But how do you select an authentic saree that lasts for generations?

- **Test the Silk Yarn**: True luxury weaves like our 'Royal Banarasi Silk' use pure Mulberry silk threads coupled with actual golden-wrapped metallic threads.
- **Inspect the Zari Work**: Authentic Zari features a majestic matte shine that sparkles under grand warm chandelier light without looking silver-painted.
- **Match the Weight**: A grand bridal saree weighs between 800g to 1.5kg owing to dense silk warp networks which hang gracefully, keeping neat drape pleats from slipping.
- **Color Selection**: While royal crimson and scarlet red will always remain bridal poetry, emerging luxurious colors include Emperor Gold, Emerald Green, and Romantic Royal Blues.`,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    author: "Madhu K.",
    date: "June 02, 2026",
    readTime: "6 min read",
    category: "Fashion Trends"
  },
  {
    id: "blog-3",
    title: "The Rise of Fusion Wear for Festive Celebrations",
    excerpt: "Explore how comfort meets grandeur in custom georgette lehengas and styled cotton-silk kurtis.",
    content: `Gone are the days when festive dressing meant compromising on touch and physical freedom. Women across the globe are seeking lighter yet visually high-concept clothing that permits dancing, hosting, and movement.

Enter Fusion Wear. By pairing breathable cotton-silk embellished Anarkalis with sleek gold-plated bracelets, you achieve a Nykaa Fashion signature look. Discover how to transition seamlessly from day ceremonies to night banquets with lightweight georgette layers.`,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
    author: "Madhu K.",
    date: "May 25, 2026",
    readTime: "3 min read",
    category: "Party Wear Guides"
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: "Do you offer international shipping?",
    answer: "Yes, Madhu Magic Fashion Hub ships to over 50 countries worldwide. Standard shipping is free in India, and premium express international shipping carries a flat luxury service charge of ₹1,500."
  },
  {
    question: "How do I purchase items on your Meesho storefront?",
    answer: "On our product cards, you will find a golden 'Buy via Meesho' button where applicable. Clicking this seamlessly redirects you directly to the Meesho product page where you can place orders under Meesho's delivery network."
  },
  {
    question: "What is your return and refund policy?",
    answer: "We offer a luxurious, stress-free 10-day return policy. Unworn items with original secure brand tags and gold-stamped box packaging are fully eligible for refunds or exchanges."
  },
  {
    question: "Are your jewellery pieces hypoallergenic?",
    answer: "Absolutely. All Madhu Magic jewellery collections are fully nickel-free, lead-free, and base-crafted using high-grade copper or sterling silver with real gold or rhodium multi-layer plating."
  },
  {
    question: "How can I track my direct online order?",
    answer: "Once shipped, you will receive an email confirmation containing a live tracking link. You can also view your live delivery progress directly inside your Customer Profile dashboard."
  }
];
