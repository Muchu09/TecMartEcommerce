import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const data = await usersAPI.getWishlist();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const addToWishlist = async (itemId) => {
    if (!isAuthenticated) return false;
    try {
      await usersAPI.addToWishlist(itemId);
      await fetchWishlist(); // Refresh to get full objects
      return true;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (!isAuthenticated) return false;
    try {
      await usersAPI.removeFromWishlist(itemId);
      setWishlist(prev => prev.filter(item => (item._id || item) !== itemId));
      return true;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (itemId) => {
    return wishlist.some(item => (item._id || item) === itemId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    totalFavorites: wishlist.length,
    refreshWishlist: fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
