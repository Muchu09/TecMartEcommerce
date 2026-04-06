import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Heart, ArrowLeft, ShieldCheck,
  Truck, RotateCcw, CheckCircle, Plus, Minus, PackageCheck
} from "lucide-react";
import { itemsAPI, usersAPI } from "../services/api";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import "./ItemDetails.css";

/* ─── Toast ─────────────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState(null);

  const show = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  return { toast, show };
}

function ToastNotification({ toast }) {
  if (!toast) return null;
  return (
    <div className={`pd-toast pd-toast-${toast.type}`} key={toast.id}>
      {toast.type === "success" && <CheckCircle size={16} />}
      {toast.type === "cart" && <ShoppingCart size={16} />}
      {toast.message}
    </div>
  );
}

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isWishlisted = isInWishlist(id);
  const [addingToCart, setAddingToCart] = useState(false);

  const { toast, show: showToast } = useToast();

  /* Check if already in cart */
  const cartItem = cart.find((i) => i._id === id);
  const isInCart = !!cartItem;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchItem = async () => {
      try {
        const data = await itemsAPI.getItem(id);
        setItem(data);
      } catch (err) {
        setError("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  /* ─── Wishlist ───────────────────────────────────── */
  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(id);
        showToast("Removed from favorites.", "success");
      } else {
        await addToWishlist(id);
        showToast("Added to your favorites! ❤️", "success");
      }
    } catch (err) {
      showToast("Failed to update favorites.", "error");
    }
  };

  /* ─── Add to Cart ────────────────────────────────── */
  const handleAddToCart = () => {
    if (!item || item.status !== "available") return;

    setAddingToCart(true);
    addToCart({ ...item, quantity });

    showToast(
      isInCart
        ? `Cart updated — ${item.title.slice(0, 26)}${item.title.length > 26 ? "…" : ""}`
        : `Added to cart — ${item.title.slice(0, 26)}${item.title.length > 26 ? "…" : ""}`,
      "cart"
    );

    setTimeout(() => setAddingToCart(false), 700);
  };

  /* ─── Buy Now (direct checkout) ──────────────────── */
  const handleBuyNow = () => {
    if (!item || item.status !== "available") return;
    addToCart({ ...item, quantity });
    navigate("/cart");
  };

  /* ─── Quantity ───────────────────────────────────── */
  const decQty = () => setQuantity((p) => Math.max(1, p - 1));
  const incQty = () => setQuantity((p) => p + 1);

  /* ─── States ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="pd-loading-container">
        <div className="pd-spineer"></div>
        <p>Loading premium experience...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="pd-error-container">
        <p className="pd-error-text">{error || "Product not found"}</p>
        <button onClick={() => navigate(-1)} className="pd-btn-back">
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  const isAvailable = item.status === "available";

  return (
    <div className="pd-wrapper fade-in">

      {/* Global Toast */}
      <ToastNotification toast={toast} />

      {/* Back Navigation */}
      <div className="pd-top-nav">
        <button onClick={() => navigate(-1)} className="pd-back-link">
          <ArrowLeft size={16} /> Back to browsing
        </button>
      </div>

      <div className="pd-container">

        {/* ── Gallery ──────────────────────────────── */}
        <div className="pd-gallery">
          <div className="pd-main-image-box">
            <span className={`pd-status-badge absolute ${isAvailable ? "available" : "sold"}`}>
              {isAvailable ? "In Stock" : "Sold Out"}
            </span>
            <img
              src={item.image || "https://via.placeholder.com/800"}
              alt={item.title}
              className="pd-main-image"
            />
          </div>

          <div className="pd-perks-row">
            <div className="pd-perk">
              <ShieldCheck size={20} className="pd-perk-icon text-blue" />
              <span>1 Year Warranty</span>
            </div>
            <div className="pd-perk">
              <Truck size={20} className="pd-perk-icon text-green" />
              <span>Free Fast Delivery</span>
            </div>
            <div className="pd-perk">
              <RotateCcw size={20} className="pd-perk-icon text-purple" />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>

        {/* ── Info ─────────────────────────────────── */}
        <div className="pd-info">

          <div className="pd-title-area">
            <span className="pd-category-tag">{item.category || "Premium Technology"}</span>
            <h1 className="pd-title">{item.title}</h1>
            <div className="pd-price-wrap">
              <span className="pd-price">₹{item.price.toLocaleString()}</span>
              <span className="pd-price-tax">Incl. of all taxes</span>
            </div>
          </div>

          <div className="pd-divider" />

          <p className="pd-description">{item.description}</p>

          {/* ── Action Area ────────────────────────── */}
          {isAvailable && (
            <div className="pd-action-area">

              {/* Quantity selector */}
              <div className="pd-quantity-section">
                <label className="pd-label">Quantity</label>
                <div className="pd-qty-controls">
                  <button
                    onClick={decQty}
                    className="pd-qty-btn"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="pd-qty-display">{quantity}</span>
                  <button
                    onClick={incQty}
                    className="pd-qty-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="pd-total-box">
                <span className="pd-total-label">Subtotal</span>
                <span className="pd-total-price">
                  ₹{(item.price * quantity).toLocaleString()}
                </span>
              </div>

            </div>
          )}

          {/* In-cart indicator */}
          {isInCart && (
            <div className="pd-incart-badge">
              <PackageCheck size={15} />
              Already in cart · {cartItem.quantity} item{cartItem.quantity !== 1 ? "s" : ""}
              <button className="pd-incart-view" onClick={() => navigate("/cart")}>
                View Cart →
              </button>
            </div>
          )}

          {/* ── Buttons ──────────────────────────────── */}
          <div className="pd-buttons-group">
            {isAvailable ? (
              <>
                {/* Add to Cart */}
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`pd-btn pd-btn-cart ${addingToCart ? "adding" : ""}`}
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={20} className={addingToCart ? "cart-icon-bounce" : ""} />
                  {addingToCart
                    ? "Added!"
                    : isInCart
                    ? "Update Cart"
                    : "Add to Cart"}
                </button>

                {/* Wishlist */}
                <button
                  id="wishlist-btn"
                  onClick={toggleWishlist}
                  className={`pd-btn pd-btn-wishlist ${isWishlisted ? "active" : ""}`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    size={20}
                    className="wishlist-icon"
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                  {isWishlisted ? "Saved" : "Save for Later"}
                </button>
              </>
            ) : (
              <button disabled className="pd-btn pd-btn-sold">
                <ShoppingCart size={20} />
                Out of Stock
              </button>
            )}
          </div>

          {/* ── Buy Now ─────────────────────────────── */}
          {isAvailable && (
            <button
              id="buy-now-btn"
              className="pd-btn-buynow"
              onClick={handleBuyNow}
            >
              Buy Now · ₹{(item.price * quantity).toLocaleString()}
            </button>
          )}

        </div>
      </div>

    </div>
  );
}