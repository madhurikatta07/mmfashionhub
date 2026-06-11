export interface Product {
  id: string;
  name: string;
  category: string; // e.g. "Sarees", "Kurtis", "Dresses", "Western Wear", "Ethnic Wear", "Party Wear", "Earrings", "Necklaces", "Bangles", "Bracelets", "Rings", "Handbags", "Accessories"
  type: "Clothing" | "Jewellery" | "Accessories";
  price: number;
  originalPrice: number;
  discount: number; // percentage
  rating: number;
  ratingCount: number;
  images: string[]; // gallery of images
  stock: number;
  colors: string[];
  sizes: string[];
  description: string;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  meeshoUrl?: string; // Meesho product link if available
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
    image: string;
  }[];
  couponCode?: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  createdAt: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  image: string;
}
