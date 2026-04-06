import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User as UserIcon, Edit, MapPin, Shield, CheckCircle, Activity, Loader, Trash2, Map
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { usersAPI } from "../services/api";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-[9999] px-6 py-3 rounded-xl shadow-xl font-medium text-white flex items-center gap-3 transform transition-all animate-in slide-in-from-bottom flex ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <Activity size={20} />}
      {message}
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Profile State
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: "", email: "", phone: "", profilePicture: "" });

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: "", street: "", city: "", zip: "", isDefault: false });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchData = async () => {
    setLoading(true);
    try {
      const userProfile = await usersAPI.getProfile();
      setProfile(userProfile);
      setProfileForm({
        username: userProfile.username,
        email: userProfile.email,
        phone: userProfile.phone || "",
        profilePicture: userProfile.profilePicture || `https://ui-avatars.com/api/?name=${userProfile.username}&background=random`
      });
      setAddresses(userProfile.addresses || []);
    } catch (err) {
      showToast("Failed to fetch profile data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await usersAPI.updateProfile(profileForm);
      setProfile(updated);
      setEditingProfile(false);
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast("Could not update profile.", "error");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const updatedAddresses = await usersAPI.addAddress(addrForm);
      setAddresses(updatedAddresses);
      setAddingAddress(false);
      setAddrForm({ label: "", street: "", city: "", zip: "", isDefault: false });
      showToast("Address added successfully!");
    } catch (err) {
      showToast("Could not add address.", "error");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const updatedAddresses = await usersAPI.deleteAddress(id);
      setAddresses(updatedAddresses);
      showToast("Address deleted.");
    } catch (err) {
      showToast("Could not delete address.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="flex flex-col items-center gap-4" style={{ color: 'var(--color-primary)' }}>
          <Loader className="w-10 h-10 animate-spin" />
          <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] font-sans p-6 md:p-10 lg:p-12" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Header Area replacing sidebar dependency */}
        <div className="card flex items-center gap-6 mb-8">
           <div className="relative">
             <img
               src={profile?.profilePicture || "https://ui-avatars.com/api/?name=User"}
               alt="Profile"
               className="w-24 h-24 rounded-full object-cover border-4 shadow-md"
               style={{ borderColor: 'var(--color-bg-secondary)', background: 'var(--color-bg)' }}
             />
             <div className="absolute bottom-1 right-1 w-5 h-5 border-2 rounded-full" style={{ background: 'var(--color-success)', borderColor: 'var(--color-bg)' }}></div>
           </div>
           <div>
             <h2 className="text-2xl font-black" style={{ color: 'var(--color-text-primary)' }}>{profile?.username}</h2>
             <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{profile?.email}</p>
           </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Personal Information</h1>
          {!editingProfile && (
            <button onClick={() => setEditingProfile(true)} className="btn btn-outline flex items-center gap-2">
              <Edit size={16} /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Form / View */}
        <div className="card">
          {editingProfile ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="input-label">Username</label>
                  <input type="text" value={profileForm.username} onChange={e => setProfileForm({ ...profileForm, username: e.target.value })} className="input-field" required />
                </div>
                <div className="form-group">
                  <label className="input-label">Email Address</label>
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="input-field" required />
                </div>
                <div className="form-group">
                  <label className="input-label">Phone Number</label>
                  <input type="text" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" placeholder="+1..." />
                </div>
                <div className="form-group">
                  <label className="input-label">Profile Image URL</label>
                  <input type="text" value={profileForm.profilePicture} onChange={e => setProfileForm({ ...profileForm, profilePicture: e.target.value })} className="input-field" />
                </div>
                <div className="form-group">
                  <label className="input-label">Current Password</label>
                  <input type="password" value={profileForm.currentPassword || ""} onChange={e => setProfileForm({ ...profileForm, currentPassword: e.target.value })} className="input-field" placeholder="Required if changing password" />
                </div>
                <div className="form-group">
                  <label className="input-label">New Password</label>
                  <input type="password" value={profileForm.password || ""} onChange={e => setProfileForm({ ...profileForm, password: e.target.value })} className="input-field" placeholder="Leave blank to keep same" />
                </div>
              </div>
              <div className="flex gap-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" onClick={() => setEditingProfile(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Username</p>
                <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{profile?.username}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Email Address</p>
                <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{profile?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Phone</p>
                <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{profile?.phone || <span style={{ color: 'var(--color-text-tertiary)' }} className="italic">Not provided</span>}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Account Type</p>
                <p className="text-lg font-semibold capitalize flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}><Shield size={16} style={{ color: 'var(--color-primary)' }} /> {profile?.role}</p>
              </div>
            </div>
          )}
        </div>

        {/* Address Management */}
        <div>
          <div className="flex justify-between items-center mt-10 mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Delivery Addresses</h2>
            <button onClick={() => setAddingAddress(!addingAddress)} className="btn btn-outline btn-sm flex items-center gap-2">
              <MapPin size={16} /> {addingAddress ? "Cancel" : "Add Address"}
            </button>
          </div>

          {addingAddress && (
            <form onSubmit={handleAddAddress} className="card mb-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Label (e.g. Home, Office)" value={addrForm.label} onChange={e => setAddrForm({ ...addrForm, label: e.target.value })} className="input-field" required />
                <input type="text" placeholder="Street Address" value={addrForm.street} onChange={e => setAddrForm({ ...addrForm, street: e.target.value })} className="input-field" required />
                <input type="text" placeholder="City" value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} className="input-field" required />
                <input type="text" placeholder="ZIP / Postal Code" value={addrForm.zip} onChange={e => setAddrForm({ ...addrForm, zip: e.target.value })} className="input-field" required />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm({ ...addrForm, isDefault: e.target.checked })} className="w-4 h-4 rounded" style={{ accentColor: 'var(--color-primary)' }} />
                Make this default delivery address
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                <button type="button" onClick={() => setAddingAddress(false)} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {addresses.length === 0 ? (
              <div className="col-span-2 p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                <Map size={32} className="mb-2" style={{ color: 'var(--color-border)' }} />
                <p>No addresses found. Add one for smooth checkout!</p>
              </div>
            ) : (
              addresses.map((addr) => (
                <div key={addr._id} className="card relative group">
                  {addr.isDefault && <div className="absolute top-4 right-4 px-2.5 py-1 text-xs font-bold rounded-lg" style={{ background: 'var(--color-success-light)', color: 'var(--color-success-hover)' }}>DEFAULT</div>}
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text-primary)' }}>{addr.label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{addr.street}<br />{addr.city}, {addr.zip}</p>
                  <button onClick={() => handleDeleteAddress(addr._id)} className="mt-4 flex items-center gap-1.5 text-xs font-bold transition opacity-0 group-hover:opacity-100" style={{ color: 'var(--color-danger)' }}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
