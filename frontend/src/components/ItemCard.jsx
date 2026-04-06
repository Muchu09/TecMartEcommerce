import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Heart, Eye, ShoppingCart, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import "./ItemCard.css";

/* ─── Star Rating Helper ─────────────────────────── */
function StarRating({ rating = 4.2, count = 0 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let cls = "empty";
    if (i <= Math.floor(rating)) cls = "filled";
    else if (i === Math.ceil(rating) && rating % 1 >= 0.3) cls = "half";
    stars.push(
      <span key={i} className={`ic-star ${cls}`} aria-hidden="true">★</span>
    );
  }
  return (
    <div className="ic-rating-row" role="img" aria-label={`${rating} out of 5 stars`}>
      <div className="ic-stars">{stars}</div>
      <span className="ic-rating-count">
        {rating.toFixed(1)}{count > 0 ? ` (${count})` : ""}
      </span>
    </div>
  );
}

/* ─── Skeleton Card ──────────────────────────────── */
export function ItemCardSkeleton() {
  return (
    <div className="ic-skeleton" aria-busy="true" aria-label="Loading item…">
      <div className="ic-skeleton-img" />
      <div className="ic-skeleton-body">
        <div className="ic-skeleton-line ic-skeleton-line-sm" />
        <div className="ic-skeleton-line ic-skeleton-line-lg" />
        <div className="ic-skeleton-line ic-skeleton-line-md" />
        <div className="ic-skeleton-line ic-skeleton-line-xl" />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <div className="ic-skeleton-line" style={{ height: 20, width: 55, borderRadius: 6 }} />
          <div className="ic-skeleton-line" style={{ height: 20, width: 70, borderRadius: 6 }} />
        </div>
        <div className="ic-spacer" />
        <div className="ic-skeleton-line ic-skeleton-btn" />
      </div>
    </div>
  );
}

/* ─── Fly-to-Cart Animation ──────────────────────── */
function useFlyToCart() {
  const fly = useCallback((fromEl, toSelector = "#cart-icon") => {
    const from = fromEl?.getBoundingClientRect();
    const toEl = document.querySelector(toSelector);
    if (!from || !toEl) return;
    const to = toEl.getBoundingClientRect();

    const particle = document.createElement("div");
    particle.className = "ic-fly-particle";
    particle.style.cssText = `left:${from.left + from.width / 2 - 10}px;top:${from.top + from.height / 2 - 10}px;`;
    document.body.appendChild(particle);

    particle.animate(
      [
        { left: `${from.left + from.width / 2 - 10}px`, top: `${from.top + from.height / 2 - 10}px`, opacity: 1, transform: "scale(1)" },
        { left: `${to.left + to.width / 2 - 10}px`,   top: `${to.top + to.height / 2 - 10}px`,   opacity: 0, transform: "scale(0.3)" },
      ],
      { duration: 650, easing: "cubic-bezier(0.2, 0.8, 0.8, 1)", fill: "forwards" }
    ).addEventListener("finish", () => particle.remove());
  }, []);

  return fly;
}

/* ─── Main ItemCard Component ────────────────────── */
export default function ItemCard({
  item,
  onBuy,
  isBought = false,
}) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(item._id);
  const [quantity, setQuantity]     = useState(1);
  const [addedAnim, setAddedAnim]   = useState(false);
  const cartBtnRef                  = useRef(null);
  const flyToCart                   = useFlyToCart();

  const currentPrice  = item?.price ?? 99;
  const originalPrice = item?.originalPrice ?? null;
  const discount      = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;
  const totalPrice    = currentPrice * quantity;

  const rating       = item?.rating       ?? (3.5 + Math.random() * 1.5);
  const reviewCount  = item?.reviewCount  ?? Math.floor(Math.random() * 200 + 10);
  const isOutOfStock = item?.status !== "available";
  const isNew        = item?.isNew        ?? false;
  const isSale       = discount !== null && discount > 0;

  /* details chips */
  const details = [
    item?.condition  && `${item.condition}`,
    item?.type       && `${item.type}`,
    item?.location   && `📍 ${item.location}`,
  ].filter(Boolean);

  /* ── handlers ── */
  const handleQtyChange = useCallback((delta) => (e) => {
    e.preventDefault();
    setQuantity((prev) => Math.max(1, prev + delta));
  }, []);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    if (isOutOfStock || isBought) return;

    addToCart({ ...item, price: currentPrice, quantity });
    flyToCart(cartBtnRef.current, "#cart-icon");

    setAddedAnim(true);
    const t = setTimeout(() => setAddedAnim(false), 1200);
    return () => clearTimeout(t);
  }, [item, currentPrice, quantity, isOutOfStock, isBought, addToCart, flyToCart]);

  const handleWishlist = useCallback(async (e) => {
    e.preventDefault();
    if (isWishlisted) {
      await removeFromWishlist(item._id);
    } else {
      await addToWishlist(item._id);
    }
  }, [item, isWishlisted, addToWishlist, removeFromWishlist]);

  const handleBuy = useCallback((e) => {
    e.preventDefault();
    if (!isBought && !isOutOfStock) onBuy?.({ ...item, price: totalPrice });
  }, [item, totalPrice, isBought, isOutOfStock, onBuy]);

  /* ── render ── */
  return (
    <article
      className={`ic-card${isOutOfStock ? " oos" : ""}`}
      aria-label={`${item?.title} product card`}
    >
      {/* ── Image Section ── */}
      <div className="ic-image-wrap">
        <img
          src={item?.image || "https://placehold.co/400x300/f3f4f6/9ca3af?text=No+Image"}
          alt={item?.title || "Product image"}
          className="ic-image"
          loading="lazy"
        />
        <div className="ic-image-overlay" aria-hidden="true" />

        {/* Badges */}
        <div className="ic-badges" aria-hidden="true">
          {isOutOfStock && <span className="ic-badge ic-badge-oos">Out of Stock</span>}
          {isSale       && <span className="ic-badge ic-badge-sale">−{discount}% Sale</span>}
          {isNew        && <span className="ic-badge ic-badge-new">New</span>}
          {isBought     && <span className="ic-badge ic-badge-purchased">Purchased</span>}
        </div>

        {/* Quick View */}
        <Link
          to={`/item/${item?._id}`}
          className="ic-quick-view"
          aria-label={`Quick view ${item?.title}`}
          tabIndex={0}
        >
          <Eye size={12} style={{ display: "inline", marginRight: 5 }} />
          Quick View
        </Link>

        {/* Admin Edit */}
        {user?.role === "admin" && (
          <Link
            to={`/admin/product/edit/${item?._id}`}
            className="ic-admin-edit"
            aria-label="Edit item"
            title="Edit item"
            tabIndex={0}
          >
            <Edit size={14} />
          </Link>
        )}
      </div>

      {/* ── Body ── */}
      <div className="ic-body">
        {/* Category */}
        {item?.category && (
          <span className="ic-category">{item.category}</span>
        )}

        {/* Title */}
        <Link to={`/item/${item?._id}`} className="ic-title-link" tabIndex={0}>
          <h3 className="ic-title">{item?.title || "Untitled Item"}</h3>
        </Link>

        {/* Rating */}
        <StarRating rating={parseFloat(rating.toFixed(1))} count={reviewCount} />

        {/* Price */}
        <div className="ic-price-row">
          <span className="ic-price">₹{currentPrice.toFixed(0)}</span>
          {originalPrice && (
            <span className="ic-price-original">₹{originalPrice.toFixed(0)}</span>
          )}
          {isSale && (
            <span className="ic-price-discount">−{discount}%</span>
          )}
        </div>

        {/* Detail Chips */}
        {details.length > 0 && (
          <div className="ic-details" aria-label="Item details">
            {details.map((d, i) => (
              <span key={i} className="ic-detail-chip">{d}</span>
            ))}
          </div>
        )}

        <div className="ic-spacer" />

        {/* ── Action Row ── */}
        <div className="ic-actions">
          {/* Quantity */}
          <div className="ic-qty" role="group" aria-label="Quantity selector">
            <button
              type="button"
              className="ic-qty-btn"
              onClick={handleQtyChange(-1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="ic-qty-val" aria-live="polite">{quantity < 10 ? `0${quantity}` : quantity}</span>
            <button
              type="button"
              className="ic-qty-btn"
              onClick={handleQtyChange(1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Wishlist */}
          <button
            type="button"
            className={`ic-wishlist-btn${isWishlisted ? " active" : ""}`}
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
          >
            <Heart
              size={17}
              className="ic-heart-icon"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* ── Cart / Buy Button ── */}
        <button
          ref={cartBtnRef}
          type="button"
          className={`ic-cart-btn${addedAnim ? " added" : ""}`}
          onClick={isBought ? undefined : (e) => { handleAddToCart(e); }}
          onDoubleClick={handleBuy}
          disabled={isOutOfStock}
          aria-label={
            isOutOfStock
              ? "Out of stock"
              : isBought
              ? "Already purchased"
              : `Add ${quantity} to cart for ₹${totalPrice.toFixed(0)}`
          }
          title={!isBought && !isOutOfStock ? "Double-click to buy now" : undefined}
        >
          <div className="ic-cart-btn-price">
            <span className="ic-cart-btn-amount">₹{totalPrice.toFixed(0)}</span>
            <span className="ic-cart-btn-tax">Tax included</span>
          </div>
          <span className="ic-cart-btn-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {isOutOfStock ? (
              "Out of Stock"
            ) : addedAnim ? (
              <><Check size={13} /> Added!</>
            ) : isBought ? (
              <><Check size={13} /> Purchased</>
            ) : (
              <><ShoppingCart size={13} /> Add to Cart</>
            )}
          </span>
        </button>
      </div>
    </article>
  );
}
