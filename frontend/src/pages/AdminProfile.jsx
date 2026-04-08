import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Camera, Lock, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { usersAPI } from "../services/api";
import "./AdminProfile.css";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`admin-toast animate-in slide-in-from-bottom flex items-center gap-3 ${type}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{message}</span>
    </div>
  );
};

export default function AdminProfile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    username: user?.name || "",
    email: user?.email || "",
    profilePicture: user?.profilePicture || "",
    currentPassword: "",
    password: "",
    confirmPassword: ""
  });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return showToast("Passwords do not match!", "error");
    }

    setLoading(true);
    try {
      // Create payload matching what usersAPI.updateProfile expects
      // Note: backend uses 'username' and 'email'
      const payload = {
        username: formData.username,
        email: formData.email,
        profilePicture: formData.profilePicture
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.currentPassword = formData.currentPassword;
      }

      await usersAPI.updateProfile(payload);
      await refreshUser();
      showToast("Profile updated successfully!");
      setFormData({ ...formData, password: "", confirmPassword: "", currentPassword: "" });
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <h1 className="admin-page-title">Profile Settings</h1>
        <p className="admin-page-subtitle">Manage your account details and security settings</p>
      </div>

      <div className="admin-profile-grid">
        {/* Profile Card */}
        <div className="admin-profile-card">
          <div className="admin-profile-card-header">
             <div className="admin-profile-avatar-wrapper">
                <div className="admin-profile-avatar">
                   {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
                </div>
                <button className="admin-avatar-edit-btn" title="Change Avatar">
                  <Camera size={14} />
                </button>
             </div>
             <div className="admin-profile-info">
                <h3>{user?.name}</h3>
                <span className="admin-badge">System Administrator</span>
             </div>
          </div>
          
          <div className="admin-profile-stats">
            <div className="admin-stat-item">
              <span className="stat-label">Last Login</span>
              <span className="stat-value">Today, 10:45 AM</span>
            </div>
            <div className="admin-stat-item">
              <span className="stat-label">Role</span>
              <span className="stat-value capitalize">{user?.role || 'admin'}</span>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="admin-settings-card">
          <form onSubmit={handleSubmit} className="admin-profile-form">
            <div className="form-section">
              <div className="section-title">
                <User size={18} className="text-blue-500" />
                <h4>Personal Information</h4>
              </div>
              <div className="form-grid">
                <div className="admin-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    placeholder="Enter your name"
                    required 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="admin@example.com"
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="form-divider"></div>

            <div className="form-section">
              <div className="section-title">
                <Lock size={18} className="text-amber-500" />
                <h4>Security & Password</h4>
              </div>
              <p className="section-desc">Leave password fields blank if you don't want to change it.</p>
              
              <div className="admin-form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={formData.currentPassword} 
                  onChange={handleChange} 
                  placeholder="••••••••"
                  required={formData.password !== ""}
                />
              </div>

              <div className="form-grid">
                <div className="admin-form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Minimal 6 characters"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-footer">
              <button type="submit" className="admin-save-btn" disabled={loading}>
                {loading ? <Loader className="animate-spin" size={18} /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
