import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  getMe: () => api.get('/auth/me'),
  updateMe: (payload) => api.put('/auth/me', payload),
  changePassword: (payload) => api.put('/auth/change-password', payload),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
};

export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (payload) => api.post('/restaurants', payload),
  update: (id, payload) => api.put(`/restaurants/${id}`, payload),
  getMine: () => api.get('/restaurants/me'),
};

export const menuAPI = {
  getByRestaurant: (restaurantId) => api.get(`/restaurants/${restaurantId}/menu`),
  create: (payload) => api.post('/menu-items', payload),
  update: (id, payload) => api.put(`/menu-items/${id}`, payload),
  remove: (id) => api.delete(`/menu-items/${id}`),
};

export const orderAPI = {
  create: (payload) => api.post('/orders', payload),
  getMy: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, payload) => api.patch(`/orders/${id}/status`, payload),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
};

export const reviewAPI = {
  create: (payload) => api.post('/reviews', payload),
  getByRestaurant: (restaurantId) => api.get(`/reviews/restaurant/${restaurantId}`),
};

export const paymentAPI = {
  createOrder: (payload) => api.post('/payments/create-order', payload),
  verify: (payload) => api.post('/payments/verify', payload),
  fail: (orderId) => api.post('/payments/fail', { orderId }),
  history: () => api.get('/payments/history'),
};

export const uploadAPI = {
  image: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getOrders: (params) => api.get('/admin/orders', { params }),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  moderateReview: (id, moderationStatus) => api.patch(`/reviews/${id}/moderate`, { moderationStatus }),
};

export default api;
