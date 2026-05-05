import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to unwrap data and handle global errors
api.interceptors.response.use(
  (response) => {
    // Standard unwrap: if the response body has { success: true, data: ... }, return only data
    if (response.data && response.data.success === true && response.data.data !== undefined) {
      return response.data.data;
    }
    // For responses that might not follow the standard format but still have body
    if (response.data !== undefined) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response?.status === 401) {
      console.warn('Unauthorized access, clearing token...');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

/**
 * Auth API
 */
export const authAPI = {
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },
  register: async (username, email, password) => {
    return await api.post('/auth/register', { username, email, password });
  },
};

/**
 * Items API
 */
export const itemsAPI = {
  getItems: async (page = 1, limit = 50) => {
    return await api.get(`/items?page=${page}&limit=${limit}`);
  },
  getItem: async (id) => {
    return await api.get(`/items/${id}`);
  },
  createItem: async (itemData) => {
    return await api.post('/items', itemData);
  },
  updateItem: async (id, itemData) => {
    return await api.put(`/items/${id}`, itemData);
  },
  deleteItem: async (id) => {
    return await api.delete(`/items/${id}`);
  },
};

/**
 * Admin API
 */
export const adminAPI = {
  login: async (email, password) => {
    return await api.post('/admin/login', { email, password });
  },
  getProducts: async () => {
    return await api.get('/admin/products');
  },
  addProduct: async (itemData) => {
    return await api.post('/admin/product/add', itemData);
  },
  updateProduct: async (id, itemData) => {
    return await api.put(`/admin/product/${id}`, itemData);
  },
  deleteProduct: async (id) => {
    return await api.delete(`/admin/product/${id}`);
  },
  getStats: async () => {
    return await api.get('/admin/stats');
  },
  // Orders (admin)
  getOrders: async () => {
    return await api.get('/admin/orders');
  },
  updateOrderStatus: async (id, status) => {
    return await api.put(`/admin/orders/${id}`, { status });
  },
  // Support Tickets (admin)
  getTickets: async (status = 'all') => {
    return await api.get(`/admin/tickets?status=${status}`);
  },
  updateTicket: async (id, data) => {
    return await api.put(`/admin/tickets/${id}`, data);
  },
  deleteTicket: async (id) => {
    return await api.delete(`/admin/tickets/${id}`);
  },
};

/**
 * Support Tickets API (public)
 */
export const ticketsAPI = {
  submit: async (ticketData) => {
    return await api.post('/tickets', ticketData);
  },
};

/**
 * Orders API
 */
export const ordersAPI = {
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },
  getMyOrders: async () => {
    return await api.get('/orders/myorders');
  },
  getOrder: async (id) => {
    return await api.get(`/orders/${id}`);
  }
};

/**
 * Users API
 */
export const usersAPI = {
  getProfile: async () => {
    return await api.get('/users/profile');
  },
  updateProfile: async (userData) => {
    return await api.put('/users/profile', userData);
  },
  deleteProfile: async () => {
    return await api.delete('/users/profile');
  },
  addAddress: async (addressData) => {
    return await api.post('/users/address', addressData);
  },
  deleteAddress: async (id) => {
    return await api.delete(`/users/address/${id}`);
  },
  getWishlist: async () => {
    return await api.get('/users/wishlist');
  },
  addToWishlist: async (itemId) => {
    return await api.post('/users/wishlist', { itemId });
  },
  removeFromWishlist: async (itemId) => {
    return await api.delete(`/users/wishlist/${itemId}`);
  },
};

export default api;
