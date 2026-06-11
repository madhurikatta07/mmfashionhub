import { useState } from "react";
import { X, Trash2, ShieldCheck, Heart, CreditCard, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { CartItem, Product } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (product: Product, color: string, size: string, qty: number) => void;
  onRemoveItem: (product: Product, color: string, size: string) => void;
  onSaveForLater: (product: Product) => void;
  onPlaceOrder: (orderDetail: {
    items: CartItem[];
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    tax: number;
    total: number;
    couponCode: string;
    paymentMethod: string;
    shippingAddress: {
      name: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onSaveForLater,
  onPlaceOrder,
}: CartDrawerProps) {
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "payment" | "success">("cart");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [couponError, setCouponError] = useState("");
  const [addressError, setAddressError] = useState("");

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shippingFee = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  const tax = Math.round((subtotal - discountAmount) * 0.05); // 5% standard GST
  const total = subtotal - discountAmount + shippingFee + tax;

  const handleApplyCoupon = () => {
    setCouponError("");
    if (coupon.trim().toUpperCase() === "MADHU20") {
      setDiscountPercent(20);
      setAppliedCoupon("MADHU20 (20% Luxury Discount Applied)");
    } else if (coupon.trim().toUpperCase() === "FESTIVE10") {
      setDiscountPercent(10);
      setAppliedCoupon("FESTIVE10 (10% Off Applied)");
    } else {
      setCouponError("Invalid coupon! Type MADHU20 or FESTIVE10 for exclusive client savings.");
    }
    setCoupon("");
  };

  const handlePaymentSubmit = () => {
    setAddressError("");
    if (!name || !phone || !street || !city || !state || !zip) {
      setAddressError("Please high-light and complete all delivery destination details.");
      setCheckoutStep("address");
      return;
    }

    const oDetails = {
      items: cartItems,
      subtotal,
      discountAmount,
      shippingFee,
      tax,
      total,
      couponCode: appliedCoupon,
      paymentMethod,
      shippingAddress: {
        name,
        phone,
        street,
        city,
        state,
        zipCode: zip,
        country: "India",
      }
    };

    onPlaceOrder(oDetails);
    setPlacedOrderDetails({
      id: `order-${Math.floor(100000 + Math.random() * 900000)}`,
      total,
      trackingNumber: `MM-${Math.floor(12345000 + Math.random() * 90000000)}`,
      ...oDetails
    });
    setCheckoutStep("success");
  };

  const handleResetCheckout = () => {
    setCheckoutStep("cart");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-[#0B0B0B] h-full shadow-2xl flex flex-col select-none transition-colors border-l border-[#D4AF37]/35">
        
        {/* Header toolbar */}
        <div className="bg-[#0B0B0B] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />
            <h4 className="text-sm font-serif uppercase tracking-widest font-black text-[#D4AF37]">
              {checkoutStep === "cart" && "Luxury Shopping bag"}
              {checkoutStep === "address" && "Premium Shipping coordinates"}
              {checkoutStep === "payment" && "Secure Gateway checks"}
              {checkoutStep === "success" && "Order Booked !"}
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:text-[#D4AF37] text-white"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content workflow panels */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {checkoutStep === "cart" && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <p className="text-xs text-gray-400 uppercase tracking-widest leading-relaxed">No items currently drafted in bag.</p>
                  <button
                    onClick={onClose}
                    className="border border-[#D4AF37] text-[#D4AF37] px-6 py-2.5 text-[10.5px] uppercase tracking-widest font-bold font-sans rounded"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-3 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg hover:border-amber-500/10 transition-all"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover rounded bg-black"
                      />
                      <div className="flex-1 space-y-1">
                        <h5 className="text-xs font-semibold text-gray-800 dark:text-white line-clamp-1">{item.product.name}</h5>
                        <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold">{item.product.category}</p>
                        <p className="text-[10px] text-gray-500 dark:text-white/45">Color: {item.selectedColor} | Size: {item.selectedSize}</p>
                        
                        {/* Interactive Quantity control inside list */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-gray-400">Qty:</span>
                            <div className="flex items-center border border-black/10 dark:border-white/10 rounded">
                              <button
                                onClick={() => onUpdateQty(item.product, item.selectedColor, item.selectedSize, item.quantity - 1)}
                                className="px-1.5 py-0.5 text-gray-400 hover:text-white text-[10px]"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-gray-800 dark:text-white">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQty(item.product, item.selectedColor, item.selectedSize, item.quantity + 1)}
                                className="px-1.5 py-0.5 text-gray-400 hover:text-white text-[10px]"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <span className="text-xs font-serif font-black text-[#D4AF37]">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Save for later or Delete links */}
                        <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[9.5px]">
                          <button
                            onClick={() => onSaveForLater(item.product)}
                            className="text-gray-400 hover:text-[#D4AF37] tracking-widest uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Heart className="w-3 h-3 text-red-500" /> Save For Later
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.product, item.selectedColor, item.selectedSize)}
                            className="text-gray-400 hover:text-red-500 tracking-widest uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo coupons codes block */}
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-500">Apply Designer Voucher</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. MADHU20 (20% Off!)"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="bg-transparent border border-black/10 dark:border-white/10 rounded px-2.5 py-1.5 text-xs text-gray-800 dark:text-white outline-none flex-1 focus:border-[#D4AF37]"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-[#D4AF37] hover:bg-white text-black hover:text-black hover:border-[#D4AF37] border px-4 py-1.5 rounded text-[10px] tracking-widest font-bold uppercase transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-rose-500 text-[10px] font-semibold">{couponError}</p>
                    )}
                    {appliedCoupon && (
                      <p className="text-emerald-500 text-[10px] font-semibold animate-pulse">{appliedCoupon}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {checkoutStep === "address" && (
            <div className="space-y-4">
              <h5 className="text-xs uppercase tracking-widest font-black text-gray-400 border-b border-black/5 dark:border-white/5 pb-2">
                Provide Delivery Destination
              </h5>
              {addressError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] rounded font-semibold animate-pulse">
                  {addressError}
                </div>
              )}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Aradhana Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-800 dark:text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-800 dark:text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Street Mansion/Suite Details</label>
                  <input
                    type="text"
                    required
                    placeholder="Sector 5, DLF Phase 3"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-800 dark:text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-800 dark:text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">State</label>
                    <input
                      type="text"
                      required
                      placeholder="MH"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-800 dark:text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Pin Code</label>
                    <input
                      type="text"
                      required
                      placeholder="400001"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-transparent border border-black/10 dark:border-white/15 rounded px-3 py-2 text-xs text-gray-800 dark:text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {checkoutStep === "payment" && (
            <div className="space-y-4">
              <h5 className="text-xs uppercase tracking-widest font-black text-gray-400 border-b border-black/5 dark:border-white/5 pb-2">
                Select Secure Payment Channel
              </h5>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "UPI", label: "UPI & GPay" },
                  { id: "Stripe", label: "Stripe & Visa" },
                  { id: "Razorpay", label: "Razorpay Netbank" },
                  { id: "PayPal", label: "PayPal Express" },
                  { id: "Credit", label: "Credit/Debit Card" },
                  { id: "COD", label: "Cash on Delivery" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    className={`p-3.5 border rounded-lg text-center font-bold text-xs flex flex-col items-center gap-1 select-none cursor-pointer ${
                      paymentMethod === p.id
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] ring-1 ring-[#D4AF37]"
                        : "border-black/10 dark:border-white/10 hover:border-amber-500/20 text-gray-500 dark:text-white"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Security guarantees */}
              <div className="p-3 bg-emerald-500/10 rounded flex items-center gap-3 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                <p className="text-[10px] text-emerald-500 leading-normal font-semibold">
                  256-Bit SSL luxury encryption certified bank standards processed by Madhu Vaults.
                </p>
              </div>
            </div>
          )}

          {checkoutStep === "success" && placedOrderDetails && (
            <div className="text-center py-6 space-y-6 animate-pulse">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/35">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h5 className="text-lg font-serif italic text-emerald-500">Congratulations !</h5>
                <p className="text-xs text-gray-500 dark:text-white/60">
                  Your luxury fashion order <strong>{placedOrderDetails.id}</strong> has been booked and synced!
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 rounded-lg space-y-3 text-left text-xs">
                <div className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-widest font-black text-[#D4AF37]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Delivery Tracking info</span>
                </div>
                <div className="space-y-1 text-gray-500 dark:text-white/70">
                  <p><strong>Tracking Number:</strong> {placedOrderDetails.trackingNumber}</p>
                  <p><strong>Courier:</strong> Blue Dart Luxury Express</p>
                  <p><strong>Awaiting Status:</strong> Dispatch Queueing</p>
                  <p><strong>Destination:</strong> {placedOrderDetails.shippingAddress.name}, {placedOrderDetails.shippingAddress.city}</p>
                  <p><strong>Payment Mode:</strong> {placedOrderDetails.paymentMethod}</p>
                </div>
              </div>

              <button
                onClick={handleResetCheckout}
                className="w-full bg-[#D4AF37] text-black py-3 text-xs tracking-widest uppercase font-bold rounded hover:bg-white border hover:border-[#D4AF37] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

        </div>

        {/* Pricing aggregates footer drawer */}
        {checkoutStep !== "success" && cartItems.length > 0 && (
          <div className="bg-[#0B0B0B] text-white p-5 space-y-4 border-t border-white/20">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white/50">
                <span>Subtotal Items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>Design Discount</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-white/50">
                <span>Tax Charges (5% GST)</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Delivery & Shipping (Blue Dart)</span>
                <span>{shippingFee === 0 ? <span className="text-[#D4AF37] font-black uppercase">FREE</span> : `₹${shippingFee}`}</span>
              </div>
              <div className="border-t border-white/15 pt-2 flex justify-between font-serif font-black text-sm text-[#D4AF37]">
                <span>Total Amount Due</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Action flow buttons */}
            {checkoutStep === "cart" && (
              <button
                onClick={() => setCheckoutStep("address")}
                className="w-full bg-[#D4AF37] text-[#0B0B0B] hover:bg-white text-center py-3 text-xs tracking-widest uppercase font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1 hover:border-[#D4AF37]"
              >
                <span>Proceed To Shipping</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {checkoutStep === "address" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCheckoutStep("cart")}
                  className="border border-white/20 text-white px-4 py-3 text-[10.5px] uppercase tracking-widest font-bold rounded hover:border-[#D4AF37]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCheckoutStep("payment")}
                  className="flex-1 bg-[#D4AF37] text-black hover:bg-white py-3 text-xs tracking-widest uppercase font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1 hover:border-[#D4AF37]"
                >
                  <span>Select Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCheckoutStep("address")}
                  className="border border-white/20 text-white px-4 py-3 text-[10.5px] uppercase tracking-widest font-bold rounded hover:border-[#D4AF37]"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  className="flex-1 bg-[#D4AF37] text-black hover:bg-white py-3 text-xs tracking-widest uppercase font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1 hover:border-[#D4AF37]"
                >
                  <span>Finish Order</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
