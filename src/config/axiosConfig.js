// axiosConfig.js (atau nama file kamu)

import axios from 'axios';
import { clearUserSession } from '../utils/authUtils';
// ⛔ HAPUS hook dari sini
// import { useSelector } from 'react-redux';
import { store } from '../redux/store';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // ✅ AMBIL STATE LEWAT STORE, BUKAN HOOK
    const state = store.getState();
    const token = state?.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - logging out');
      clearUserSession();
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Access forbidden');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default api;

export const apiClient = {
  auth: {
    login: (formData) => api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    register: (formData) => api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    forgotPassword: (formData) => api.post('/auth/forgot-password', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    verifyOTP: (formData) => api.post('/auth/verify-otp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  },
  
  profile: {
    get: () => api.get('/profile'),
    update: (formData) => api.patch('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  },
  
  cart: {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart', data),
    update: (itemId, data) => api.patch(`/cart/${itemId}`, data),
    remove: (itemId) => api.delete(`/cart/${itemId}`),
    clear: () => api.delete('/cart'),
  },
  
  products: {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
  },
  
  orders: {
    create: (data) => api.post('/orders', data),
    getHistory: (params) => api.get('/orders/history', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    cancel: (id) => api.patch(`/orders/${id}/cancel`),
  },
  
  admin: {
    users: {
      getAll: (params) => api.get('/admin/users', { params }),
      getById: (id) => api.get(`/admin/users/${id}`),
      create: (formData) => api.post('/admin/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      update: (id, formData) => api.patch(`/admin/users/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      delete: (id) => api.delete(`/admin/users/${id}`),
    },
  },
};
