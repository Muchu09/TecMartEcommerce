import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Settings, ShoppingBag, Heart, LogOut, CheckCircle, Activity, Key, Bell, ChevronRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { itemsAPI, usersAPI, ordersAPI } from "../services/api";
import "./Dashboard.css"; // We will create this CSS file

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`dash-toast ${type}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <Activity size={20} />}
      <span>{message}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();



  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [profile, setProfile] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", newPassword: "" });

  const [orders, setOrders] = useState([]);
  const { wishlist: wishlistItems, removeFromWishlist } = useWishlist();

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchData = async () => {
    setLoading(true);
    try {
        const [userProfile, userOrders] = await Promise.all([
        usersAPI.getProfile(),
        ordersAPI.getMyOrders()
      ]);

      setProfile(userProfile);
      setOrders(Array.isArray(userOrders) ? userOrders : []);

    } catch (err) {
      showToast("Failed to load dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passForm.current) {
      showToast("Please enter your current password.", "error");
      return;
    }
    if (passForm.newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    try {
      await usersAPI.updateProfile({
        password: passForm.newPassword,
        currentPassword: passForm.current,
      });
      setChangingPassword(false);
      setPassForm({ current: "", newPassword: "" });
      showToast("Password updated successfully.");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password.";
      showToast(msg, "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you really sure you want to delete your account? This cannot be undone.")) return;
    try {
      await usersAPI.deleteProfile();
      logout();
      navigate("/");
    } catch (err) {
      showToast("Account deletion failed.", "error");
    }
  }

  const handlePreferencesToggle = async (key) => {
    try {
      const newPrefs = { ...(profile?.preferences || {}), [key]: !(profile?.preferences?.[key]) };
      const updated = await usersAPI.updateProfile({ preferences: newPrefs });
      setProfile(updated);
      showToast("Preferences updated.");
    } catch (err) {
      showToast("Failed to update preferences.", "error");
    }
  }

  const handleRemoveFromWishlist = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    await removeFromWishlist(itemId);
    showToast("Removed from favorites.");
  }

  const handleLogoutAll = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "wishlist", label: "Favorites", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            <div className="profile-img-container">
               <img
                 src={profile?.profilePicture || "https://ui-avatars.com/api/?name=User&background=random"}
                 alt="Profile"
                 className="profile-img"
               />
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{profile?.username || "Loading..."}</h2>
              <p className="profile-email">{profile?.email}</p>
              {user?.role === 'admin' && <div className="admin-badge">Administrator</div>}
            </div>
          </div>

          <nav className="sidebar-nav">
            <p className="nav-label">Overview</p>
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-btn admin-link">
                <Key size={20} className="nav-icon text-amber-500" />
                <span className="nav-text">Admin Dashboard</span>
              </Link>
            )}
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon size={20} className="nav-icon" />
                <span className="nav-text">{tab.label}</span>
                {activeTab === tab.id && <ChevronRight size={16} className="nav-arrow" />}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogoutAll} className="logout-btn">
              <LogOut size={18} className="logout-icon" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Interface */}
        <main className="dashboard-main">
          <div className="main-content-wrapper">
            {loading ? (
              <div className="dashboard-skeleton">
                <div className="skeleton-title"></div>
                <div className="skeleton-card"></div>
              </div>
            ) : (
              <div className="dashboard-content fade-in">
                
                {/* ── ORDERS TAB ── */}
                {activeTab === "orders" && (
                  <div className="tab-pane">
                    <header className="tab-header">
                      <h1 className="tab-title">Order History</h1>
                      <p className="tab-subtitle">Keep track of your recent purchases.</p>
                    </header>

                    {orders.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon-box"><ShoppingBag size={40} /></div>
                        <h3>No recent orders</h3>
                        <p>Purchase items to see them here.</p>
                        <Link to="/" className="btn-primary">Start Browsing</Link>
                      </div>
                    ) : (
                      <div className="order-list">
                        {orders.map(order => (
                          <div key={order._id} className="order-card">
                            <div className="order-img-box">
                               <img src={order.item?.image || 'https://via.placeholder.com/150'} alt="" />
                            </div>
                            <div className="order-details">
                              <div className="order-top">
                                <h3>{order.item?.title || 'Unknown Product'}</h3>
                                <span className={`status-badge ${order.status}`}>{order.status}</span>
                              </div>
                              <p className="order-id">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>

                              <div className="order-bottom">
                                 <div className="order-price">
                                   <label>Total Amount</label>
                                   <span>₹{order.totalAmount.toLocaleString()}</span>
                                 </div>
                                 <div className="order-actions">
                                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    {order.item?._id && (
                                       <Link to={`/item/${order.item._id}`} className="btn-secondary">Buy Again</Link>
                                    )}
                                 </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── WISHLIST TAB ── */}
                {activeTab === "wishlist" && (
                  <div className="tab-pane">
                    <header className="tab-header">
                       <h1 className="tab-title">Saved Favorites</h1>
                       <p className="tab-subtitle">Items you've heart-ed for later.</p>
                    </header>

                    {wishlistItems.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon-box pink"><Heart size={40} /></div>
                        <h3>Your wishlist is empty</h3>
                        <p>Keep track of products you love by clicking the heart icon.</p>
                        <Link to="/" className="btn-primary">Explore Marketplace</Link>
                      </div>
                    ) : (
                      <div className="wishlist-grid">
                        {wishlistItems.map((item) => (
                          <Link to={`/item/${item._id}`} key={item._id} className="wishlist-card">
                             <div className="wl-img-box">
                              <img src={item.image} alt={item.title} />
                              <div className="wl-fav-icon" onClick={(e) => handleRemoveFromWishlist(e, item._id)}>
                                <Heart size={18} fill="currentColor" />
                              </div>
                            </div>
                            <div className="wl-details">
                              <span className="wl-category">{item.category}</span>
                              <h3 className="wl-title">{item.title}</h3>
                              <div className="wl-bottom">
                                <span className="wl-price">₹{item.price.toLocaleString()}</span>
                                <span className="wl-action">Details <ChevronRight size={14} /></span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── SETTINGS TAB ── */}
                {activeTab === "settings" && (
                  <div className="tab-pane settings-pane">
                    <header className="tab-header">
                       <h1 className="tab-title">Account Settings</h1>
                       <p className="tab-subtitle">Manage your personal preferences and security.</p>
                    </header>

                    <div className="settings-list">
                      
                      {/* Password Config */}
                      <div className="settings-section">
                        <div className="settings-section-header">
                          <div className="settings-icon"><Key size={20} /></div>
                          <div>
                            <h2>Security</h2>
                            <p>Update your account password.</p>
                          </div>
                        </div>

                        {changingPassword ? (
                          <form onSubmit={handleChangePassword} className="password-form">
                            <div className="form-group">
                              <label>Current Password</label>
                              <input type="password" placeholder="••••••••" value={passForm.current} onChange={e => setPassForm({ ...passForm, current: e.target.value })} required />
                            </div>
                            <div className="form-group">
                               <label>New Password</label>
                              <input type="password" placeholder="••••••••" value={passForm.newPassword} minLength={6} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} required />
                            </div>
                            <div className="form-actions">
                              <button type="submit" className="btn-primary">Save Changes</button>
                              <button type="button" onClick={() => setChangingPassword(false)} className="btn-secondary">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <div className="settings-form-container">
                            <button onClick={() => setChangingPassword(true)} className="btn-outline">Change Password</button>
                          </div>
                        )}
                      </div>

                      {/* Notification Config */}
                      <div className="settings-section">
                         <div className="settings-section-inner">
                            <div className="settings-section-header no-margin">
                              <div className="settings-icon blue"><Bell size={20} /></div>
                              <div>
                                <h2>Notifications</h2>
                                <p>Receive relevant alerts on order updates.</p>
                              </div>
                            </div>
                            
                            <label className="toggle-switch">
                              <input type="checkbox" checked={profile?.preferences?.notifications} onChange={() => handlePreferencesToggle('notifications')} />
                              <span className="slider"></span>
                            </label>
                         </div>
                      </div>

                    </div>

                    {/* Danger Zone */}
                    <div className="danger-zone">
                       <div className="danger-zone-inner">
                          <div>
                            <h2>Danger Zone</h2>
                            <p>Permanently delete your account and all associated data. This action is irreversible.</p>
                          </div>
                          <button onClick={handleDeleteAccount} className="btn-danger">Delete Account</button>
                       </div>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
