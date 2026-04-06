import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingBag, ArrowLeft, Loader2, Sparkles, ChevronRight, ShoppingCart, Check, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import "./Wishlist.css";

export default function Wishlist() {
  const { wishlist: items, loading, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleRemove = async (id) => {
    await removeFromWishlist(id);
  };

  const handleAddToCart = (item) => {
    if (item.status !== "available") {
      alert("This item is currently out of stock.");
      return;
    }
    addToCart({ ...item, quantity: 1 });
  };

  return (
    <div className="wishlist-wrapper">
      <div className="wishlist-container">
        <header className="wishlist-header">
          <div className="header-info-anim">
            <div className="header-tag">
              <Sparkles size={12} /> Curated Collection
            </div>
            <h1 className="header-title">Saved Favorites</h1>
            <p className="header-desc">
              Manage your most-wanted items and bring them home with a single click.
            </p>
          </div>
          <Link to="/" className="back-link">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </header>

        {loading ? (
          <div className="wish-loading-box">
            <Loader2 className="animate-spin-custom wish-loading-spinner" size={40} />
            <p className="wish-loading-text">Syncing your vault...</p>
          </div>
        ) : error ? (
          <div className="wish-error-box">
            <p className="wish-error-text">{error}</p>
            <button onClick={() => window.location.reload()} className="wish-btn-primary">Retry Access</button>
          </div>
        ) : items.length === 0 ? (
          <div className="wish-empty-box">
            <div className="wish-empty-icon">
              <Heart size={56} />
            </div>
            <h2 className="wish-empty-title">Your vault is empty</h2>
            <p className="wish-empty-desc">Add products you love by clicking the heart icon on any listing.</p>
            <Link to="/" className="wish-btn-primary">Explore Marketplace</Link>
          </div>
        ) : (
          <div className="wish-grid">
            {items.map((item, index) => (
              <div key={item._id}
                className="wishlist-card wishlist-item-anim"
                style={{ animationDelay: `${index * 0.1}s` }}
                id={`wish-item-${item._id}`}
              >

                <div className="wish-img-section">
                  <img src={item.image || "https://via.placeholder.com/400"} alt={item.title} className="wish-main-img" />
                  <div className="wish-cat-tag">{item.category || "SPORTS"}</div>
                </div>

                <div className="wish-content">
                  <h3 className="wish-item-title">{item.title}</h3>
                  <div className="wish-price-row">
                    <span className="wish-price-val">₹{item.price.toLocaleString()}</span>
                    <span className="wish-price-label">Total</span>
                  </div>

                  <p className="wish-item-desc">{item.description}</p>

                  <div className="wish-actions">
                    <button 
                      onClick={() => handleAddToCart(item)} 
                      className={`btn-wish-cart ${item.status !== "available" ? "disabled" : ""}`}
                      disabled={item.status !== "available"}
                      id={`add-to-cart-${item._id}`}
                    >
                        <div className="cart-icon-pill">
                            {item.status !== "available" ? <X size={12} strokeWidth={3} /> : <ShoppingCart size={12} strokeWidth={3} />}
                        </div>
                        <div className="btn-text-stacked">
                            {item.status !== "available" ? (
                                <><span>SOLD</span><span>OUT</span></>
                            ) : (
                                <><span>ADD</span><span>TO</span><span>CART</span></>
                            )}
                        </div>
                    </button>

                    <Link to={`/item/${item._id}`} className="btn-wish-icon btn-wish-next" title="View Product" id={`view-item-${item._id}`}>
                      <ChevronRight size={22} />
                    </Link>

                    <button onClick={() => handleRemove(item._id)} className="btn-wish-icon btn-wish-remove" title="Remove" id={`remove-item-${item._id}`}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
