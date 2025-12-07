import axios from 'axios';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8083/api';

const apiClient = axios.create({
  baseURL: VITE_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const extractArrayData = (res) => {
  const d = res?.data;
  if (!d) return [];
  if (Array.isArray(d)) return d;
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d.items)) return d.items;
  return [];
};

export const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/products', { 
      params: {
        ...params,
        limit: params.limit || 100,
        per_page: params.per_page || 100,
        page: params.page || 1
      }
    });
    
    console.log('Raw products response:', response.data);
    return extractArrayData(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await apiClient.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await apiClient.patch(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getOrders = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/orders', { params });
    console.log('Raw orders response:', response.data);
    return extractArrayData(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await apiClient.get(`/admin/orders/${id}`);
    console.log('Order detail response:', response.data);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const formData = new FormData();
    if (orderData.product_id) formData.append('product_id', orderData.product_id);
    if (orderData.quantity) formData.append('quantity', orderData.quantity);
    if (orderData.size) formData.append('size', orderData.size);
    if (orderData.notes) formData.append('notes', orderData.notes);
    
    const response = await apiClient.post('/orders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const formData = new FormData();
    if (orderData.product_id) formData.append('product_id', orderData.product_id);
    if (orderData.quantity) formData.append('quantity', orderData.quantity);
    if (orderData.size) formData.append('size', orderData.size);
    if (orderData.status) formData.append('status', orderData.status);
    if (orderData.notes) formData.append('notes', orderData.notes);
    
    const response = await apiClient.patch(`/admin/orders/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const formData = new FormData();
    formData.append('status', status);
    
    const response = await apiClient.patch(`/admin/orders/${id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const getUsers = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/users', { params });
    console.log('Raw users response:', response.data);
    return extractArrayData(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (formData) => {
  try {
    const response = await apiClient.post('/admin/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, formData) => {
  try {
    const response = await apiClient.patch(`/admin/users/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};