import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ChevronRight,
  MapPin, Phone, User, Package, CheckCircle, Shield, Truck,
  AlertCircle, ShoppingBag, X, Check
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { ordersAPI, usersAPI } from "../services/api";
import "./Cart.css";

/* ═══════════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════════ */
function Toast({ toasts }) {
  return (
    <div className="cp-toast-wrap" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`cp-toast ${t.type}`}>
          {t.type === "success" && <Check size={15} />}
          {t.type === "error" && <AlertCircle size={15} />}
          {t.type === "info" && <ShoppingCart size={15} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = "info", duration = 2800) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), duration);
  }, []);
  return { toasts, show };
}

/* ═══════════════════════════════════════════════════
   STEP INDICATOR
═══════════════════════════════════════════════════ */
function StepBar({ step }) {
  const steps = ["Cart", "Details", "Confirm"];
  return (
    <div className="cp-steps" aria-label="Checkout progress">
      {steps.map((s, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < step;
        const isActive = stepNum === step;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
            <div className={`cp-step ${isDone ? "done" : isActive ? "active" : ""}`}>
              <div className="cp-step-dot">
                {isDone ? <Check size={14} /> : stepNum}
              </div>
              <span className="cp-step-label">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`cp-step-line ${isDone ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CART ITEM ROW
═══════════════════════════════════════════════════ */
function CartItem({ item, onRemove, onQtyChange, toast }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => {
      onRemove(item._id);
      toast(`"${item.title}" removed from cart`, "info");
    }, 350);
  };

  const subtotal = (item.price * item.quantity);

  return (
    <div className={`cp-item${removing ? " cp-item-removing" : ""}`} role="listitem">
      {/* Image */}
      <div className="cp-item-img-wrap">
        <img
          src={item.image || "https://placehold.co/200x200/f3f4f6/9ca3af?text=Item"}
          alt={item.title}
          className="cp-item-img"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="cp-item-info">
        {item.category && <div className="cp-item-cat">{item.category}</div>}
        <h3 className="cp-item-name" title={item.title}>{item.title}</h3>
        <div className="cp-item-unit-price">₹{item.price?.toLocaleString()} each</div>
        {item.status && item.status !== 'available' && (
          <div className="cp-item-oos-badge">
            <AlertCircle size={12} /> Out of Stock
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="cp-item-controls">
        {/* Quantity */}
        <div className="cp-qty-group" role="group" aria-label="Quantity">
          <button
            className="cp-qty-btn"
            onClick={() => onQtyChange(item._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="cp-qty-val" aria-live="polite">{item.quantity}</span>
          <button
            className="cp-qty-btn"
            onClick={() => onQtyChange(item._id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Subtotal */}
        <div className="cp-item-subtotal" aria-label={`Subtotal ₹${subtotal.toLocaleString()}`}>
          ₹{subtotal.toLocaleString()}
        </div>

        {/* Remove */}
        <button
          className="cp-item-remove"
          onClick={handleRemove}
          aria-label={`Remove ${item.title}`}
          title="Remove item"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ORDER SUMMARY CARD
═══════════════════════════════════════════════════ */
function SummaryCard({ cart, totalPrice, onCheckout, step = 1 }) {
  const DELIVERY = totalPrice > 0 && totalPrice < 500 ? 50 : 0;
  const savings = cart.reduce((acc, i) => {
    const orig = i.originalPrice ?? 0;
    return orig > i.price ? acc + (orig - i.price) * i.quantity : acc;
  }, 0);
  const grandTotal = totalPrice + DELIVERY;

  return (
    <div className="cp-summary-card" aria-label="Order summary">
      <h2 className="cp-summary-title">Order Summary</h2>

      <div className="cp-summary-row">
        <span>Subtotal ({cart.reduce((a, i) => a + i.quantity, 0)} items)</span>
        <span className="val">₹{totalPrice.toLocaleString()}</span>
      </div>
      <div className="cp-summary-row">
        <span>Delivery</span>
        <span className="val" style={{ color: DELIVERY === 0 ? "#16a34a" : undefined }}>
          {DELIVERY === 0 ? "FREE" : `₹${DELIVERY.toLocaleString()}`}
        </span>
      </div>
      {savings > 0 && (
        <div className="cp-summary-row savings">
          <span>You save</span>
          <span className="val">−₹{savings.toLocaleString()}</span>
        </div>
      )}
      {DELIVERY === 0 && totalPrice > 0 && (
        <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, padding: "4px 0", textAlign: "center" }}>
          🎉 Free delivery on orders over ₹500!
        </div>
      )}

      <div className="cp-summary-divider" />
      <div className="cp-summary-total">
        <span className="label">Total</span>
        <span className="amount">₹{grandTotal.toLocaleString()}</span>
      </div>

      {/* COD badge */}
      <div className="cp-cod-badge" aria-label="Cash on Delivery available">
        <div className="cp-cod-icon">💵</div>
        <div className="cp-cod-badge-text">
          <strong>Cash on Delivery</strong>
          <span>Pay when your order arrives</span>
        </div>
      </div>

      <button
        className="cp-checkout-btn"
        onClick={onCheckout}
        disabled={cart.length === 0 || step === 2 || cart.some(i => i.status !== 'available')}
        aria-label={step === 2 ? "Finish details below" : "Proceed to checkout"}
      >
        <Package size={18} />
        {step === 2 ? "Complete Form" : cart.some(i => i.status !== 'available') ? "Remove Sold Items" : "Proceed to Checkout"}
        <ChevronRight size={16} />
      </button>

      <p className="cp-secure-note">
        <Shield size={12} />
        Secure & encrypted checkout
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DELIVERY FORM (COD)
═══════════════════════════════════════════════════ */
const EMPTY_FORM = { name: "", phone: "", address: "", city: "", zip: "", note: "" };

function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Full name is required";
  else if (form.name.trim().length < 2) errs.name = "Name is too short";
  if (!form.phone.trim()) errs.phone = "Phone number is required";
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim()))
    errs.phone = "Enter a valid phone number";
  if (!form.address.trim()) errs.address = "Delivery address is required";
  else if (form.address.trim().length < 8) errs.address = "Provide a full address";
  if (!form.city.trim()) errs.city = "City is required";
  if (!form.zip.trim()) errs.zip = "ZIP code is required";
  return errs;
}

function Field({ id, label, name, placeholder, type = "text", icon: Icon, value, onChange, error, inputRef }) {
  return (
    <div className="cp-form-group">
      <label className="cp-form-label" htmlFor={id}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={15}
            style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none"
            }}
          />
        )}
        <input
          ref={inputRef}
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`cp-form-input${error ? " error" : ""}`}
          style={Icon ? { paddingLeft: 36 } : undefined}
          autoComplete={name === "phone" ? "tel" : name === "address" ? "street-address" : name}
          aria-describedby={error ? `${id}-err` : undefined}
          aria-invalid={!!error}
        />
      </div>
      {error && (
        <div className="cp-form-error" id={`${id}-err`} role="alert">
          <AlertCircle size={11} />
          {error}
        </div>
      )}
    </div>
  );
}

function DeliveryForm({ totalAmount, onSuccess, onCancel, toast }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast("Please fix the highlighted fields", "error");
      return;
    }
    setLoading(true);
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onSuccess(form);
  };

  return (
    <div className="cp-form-card" role="region" aria-label="Delivery details">
      <h2 className="cp-form-title">
        <Truck size={18} />
        Delivery Details
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <Field id="cp-name" label="Full Name *" name="name" placeholder="e.g. John Smith" icon={User} value={form.name} onChange={handleChange} error={errors.name} inputRef={firstRef} />
        <Field id="cp-phone" label="Phone Number *" name="phone" placeholder="+91 98765 43210" icon={Phone} type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
        <Field id="cp-address" label="Street Address *" name="address" placeholder="123 Main Street" icon={MapPin} value={form.address} onChange={handleChange} error={errors.address} />
        <div className="cp-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field id="cp-city" label="City / Town *" name="city" placeholder="e.g. Mumbai" value={form.city} onChange={handleChange} error={errors.city} />
          <Field id="cp-zip" label="ZIP / Postal *" name="zip" placeholder="400001" value={form.zip} onChange={handleChange} error={errors.zip} />
        </div>

        <div className="cp-form-group">
          <label className="cp-form-label" htmlFor="cp-note">Note (optional)</label>
          <textarea
            id="cp-note"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Any delivery instructions…"
            className="cp-form-textarea"
          />
        </div>

        {/* COD reminder */}
        <div className="cp-cod-badge" style={{ marginBottom: 14 }}>
          <div className="cp-cod-icon" style={{ width: 32, height: 32, fontSize: 16, borderRadius: 8 }}>💵</div>
          <div className="cp-cod-badge-text">
            <strong>Cash on Delivery — ₹{totalAmount.toLocaleString()}</strong>
            <span>Pay in cash when your order arrives</span>
          </div>
        </div>

        <button
          type="submit"
          className="cp-place-order-btn"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <><div className="spinner" aria-hidden="true" /> Placing Order…</>
          ) : (
            <><CheckCircle size={18} /> Place Order</>
          )}
        </button>

        <button type="button" className="cp-cancel-form-btn" onClick={onCancel}>
          <X size={14} /> Back to Cart
        </button>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ORDER CONFIRMATION
═══════════════════════════════════════════════════ */
function OrderConfirmation({ order, onContinue }) {
  const orderId = `TM-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

  return (
    <div className="cp-confirm-wrap">
      <div className="cp-confirm-card" role="main" aria-label="Order confirmed">
        <div className="cp-confirm-icon" aria-hidden="true">✓</div>
        <h2>Order Placed! 🎉</h2>
        <p>
          Your order has been confirmed and will be delivered within <strong>2–4 business days</strong>.
          Pay <strong>₹{order.total.toLocaleString()}</strong> in cash on delivery.
        </p>

        <div className="cp-confirm-order-id">
          <Package size={14} />
          <span>Order ID:</span>
          {orderId}
        </div>

        <div className="cp-confirm-details">
          <div className="cp-confirm-row">
            <span>Customer</span>
            <span className="val">{order.name}</span>
          </div>
          <div className="cp-confirm-row">
            <span>Phone</span>
            <span className="val">{order.phone}</span>
          </div>
          <div className="cp-confirm-row">
            <span>Address</span>
            <span className="val">{order.address}, {order.city}</span>
          </div>
          <div className="cp-confirm-row">
            <span>Items</span>
            <span className="val">{order.itemCount} item{order.itemCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="cp-confirm-row">
            <span>Payment</span>
            <span className="val" style={{ color: "#16a34a" }}>💵 Cash on Delivery</span>
          </div>
          <div style={{ height: 1, background: "#e5e7eb", margin: "10px 0" }} />
          <div className="cp-confirm-row total">
            <span style={{ fontWeight: 700, color: "#0f172a" }}>Total to Pay</span>
            <span className="val">₹{order.total.toLocaleString()}</span>
          </div>
        </div>

        {order.note && (
          <p style={{ fontSize: 12, color: "#6b7280", background: "#f8fafc", borderRadius: 10, padding: "10px 14px", marginBottom: 20, textAlign: "left" }}>
            📝 Note: {order.note}
          </p>
        )}

        <div className="cp-confirm-actions">
          <button className="cp-confirm-shop-btn" onClick={onContinue}>
            <ShoppingBag size={15} style={{ marginRight: 6 }} />
            Continue Shopping
          </button>
          <button
            className="cp-confirm-track-btn"
            onClick={() => navigate('/dashboard')}
          >
            <Truck size={15} style={{ marginRight: 6 }} />
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   EMPTY CART
═══════════════════════════════════════════════════ */
function EmptyCart() {
  return (
    <div className="cp-empty" role="main" aria-label="Your cart is empty">
      <div className="cp-empty-illustration" aria-hidden="true">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything to your cart yet. Start exploring the marketplace!</p>
      <Link to="/" className="cp-empty-cta">
        <ShoppingBag size={18} />
        Continue Shopping
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN CART PAGE
═══════════════════════════════════════════════════ */
export default function Cart() {
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const { toasts, show: showToast } = useToast();

  // step: 1=cart, 2=form, 3=confirmed
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);

  /* derived */
  const DELIVERY = totalPrice > 0 && totalPrice < 500 ? 50 : 0;
  const grandTotal = totalPrice + DELIVERY;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderSuccess = async (form) => {
    try {
      // Create orders for each item in the cart
      await Promise.all(cart.map(item =>
        ordersAPI.createOrder({
          itemId: item._id,
          totalAmount: item.price * item.quantity,
          shippingAddress: {
            street: form.address,
            city: form.city,
            zip: form.zip
          },
          contactPhone: form.phone
        })
      ));

      // Synchronize address with user profile (save it if it's new)
      try {
        const userProfile = await usersAPI.getProfile();
        const addressExists = userProfile.addresses?.some(addr =>
          addr.street === form.address && addr.city === form.city
        );

        if (!addressExists) {
          await usersAPI.addAddress({
            label: `Checkout ${new Date().toLocaleDateString()}`,
            street: form.address,
            city: form.city,
            zip: form.zip,
            isDefault: userProfile.addresses?.length === 0
          });
        }
      } catch (e) {
        console.error("Failed to sync address", e);
      }

      const orderDetails = {
        ...form,
        total: grandTotal,
        itemCount: totalItems,
      };
      setOrder(orderDetails);
      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("🎉 Order placed successfully!", "success", 4000);
    } catch (err) {
      showToast("Failed to place order. Please try again.", "error");
    }
  };

  const handleContinueShopping = () => {
    setStep(1);
    navigate("/");
  };

  const handleClearCart = () => {
    if (!window.confirm("Remove all items from cart?")) return;
    clearCart();
    showToast("Cart cleared", "info");
  };

  /* ── STEP 3: Confirmation ── */
  if (step === 3 && order) {
    return (
      <>
        <OrderConfirmation order={order} onContinue={handleContinueShopping} />
        <Toast toasts={toasts} />
      </>
    );
  }

  /* ── STEP 1: Empty ── */
  if (cart.length === 0 && step === 1) {
    return (
      <>
        <EmptyCart />
        <Toast toasts={toasts} />
      </>
    );
  }

  /* ── STEP 1 + 2: Main page ── */
  return (
    <div className="cp-page">
      <div className="cp-inner">

        {/* Header */}
        <div className="cp-header">
          <div className="cp-header-left">
            <button className="cp-back-btn" onClick={() => step === 2 ? setStep(1) : navigate(-1)} aria-label="Go back">
              <ArrowLeft size={15} />
              {step === 2 ? "Back to Cart" : "Back"}
            </button>
            <h1 className="cp-title">
              My Cart
              {cart.length > 0 && <span>{cart.length} item{cart.length !== 1 ? "s" : ""}</span>}
            </h1>
          </div>
          {step === 1 && cart.length > 0 && (
            <button className="cp-clear-btn" onClick={handleClearCart} aria-label="Clear cart">
              <Trash2 size={13} /> Clear Cart
            </button>
          )}
        </div>

        {/* Step bar */}
        <StepBar step={step} />

        {/* Body */}
        <div className="cp-layout">
          {/* LEFT: Items or Form */}
          <div>
            {step === 1 ? (
              <section className="cp-items-panel" role="list" aria-label="Cart items">
                {cart.map((item, idx) => (
                  <div key={item._id} style={{ animationDelay: `${idx * 60}ms` }}>
                    <CartItem
                      item={item}
                      onRemove={removeFromCart}
                      onQtyChange={updateQuantity}
                      toast={showToast}
                    />
                  </div>
                ))}
              </section>
            ) : (
              <DeliveryForm
                totalAmount={grandTotal}
                onSuccess={handleOrderSuccess}
                onCancel={() => setStep(1)}
                toast={showToast}
              />
            )}
          </div>

          {/* RIGHT: Summary */}
          <div className="cp-sidebar">
            <SummaryCard
              cart={cart}
              totalPrice={totalPrice}
              onCheckout={handleCheckout}
              step={step}
            />

            {/* Trust badges */}
            <div style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.055)",
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              {[
                { icon: "🚚", title: "Free Delivery", sub: "Orders over ₹500" },
                { icon: "💵", title: "Pay on Delivery", sub: "No card required" },
                { icon: "🔒", title: "Buyer Protection", sub: "100% secure" },
              ].map((b) => (
                <div key={b.title} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  );
}
