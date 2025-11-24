import axios from 'axios';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

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
  (error) => Promise.reject(error)
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
    return extractArrayData(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getFavoriteProducts = async () => {
  try {
    const response = await apiClient.get('/products/favorite');
    return extractArrayData(response);
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    const data = response?.data;
    if (data?.data) return data.data;
    return data;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    throw error;
  }
};

export const getProductDetail = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}/detail`);
    const data = response?.data;
    if (data?.data) return data.data;
    return data;
  } catch (error) {
    console.error('Error fetching product detail:', error);
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


export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return extractArrayData(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


export const getCart = async () => {
  try {
    const response = await apiClient.get('/cart');
    const raw = response?.data || {};
    return raw.data || { items: [], subtotal: 0 };
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (cartData) => {
  try {
    const formData = new FormData();
    formData.append('product_id', cartData.productId);
    formData.append('quantity', cartData.quantity);

    if (cartData.sizeId) {
      formData.append('size_id', cartData.sizeId);
    }
    if (cartData.temperatureId) {
      formData.append('temperature_id', cartData.temperatureId);
    }
    if (cartData.variantId) {
      formData.append('variant_id', cartData.variantId);
    }

    const response = await apiClient.post('/cart', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};



export const getOrders = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/orders', { params });
    return extractArrayData(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await apiClient.get(`/admin/orders/${id}`);
    const data = response?.data;
    if (data?.data) return data.data;
    return data;
  } catch (error) {
    console.error('Error fetching order by id:', error);
    throw error;
  }
};

export const getOrderDetail = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}/detail`);
    const data = response?.data;
    if (data?.data) return data.data;
    return data;
  } catch (error) {
    console.error('Error fetching order detail:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const response = await apiClient.put(`/admin/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/admin/orders/${id}/status`, { status });
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

export const getOrderHistory = async (params = {}) => {
  try {
    const response = await apiClient.get('/history', { params });
    const raw = response?.data || {};

    const data = Array.isArray(raw.data) ? raw.data : [];
    const meta = {
      totalPages:
        raw.total_pages ??
        raw.totalPages ??
        raw.meta?.total_pages ??
        raw.meta?.totalPages ??
        1,
      totalItems:
        raw.total_items ??
        raw.totalItems ??
        raw.meta?.total_items ??
        raw.meta?.totalItems ??
        data.length,
    };

    return { data, meta };
  } catch (error) {
    console.error('Error fetching order history:', error);
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

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/admin/users/${id}`);
    const data = response?.data;
    if (data?.data) return data.data;
    return data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export const createUser = async (formData) => {
  try {
    console.log('Creating user with data:', formData);
    
    const response = await apiClient.post('/admin/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Create user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export const updateUser = async (id, formData) => {
  try {
    console.log('Updating user ID:', id);
    console.log('Update data:', formData);
    
    const response = await apiClient.patch(`/admin/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Update user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    console.log('Deleting user ID:', id);
    const response = await apiClient.delete(`/admin/users/${id}`);
    console.log('Delete user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};


export const checkout = async (payload) => {
  try {
    const formData = new FormData();
    if (payload.email) formData.append('email', payload.email);
    if (payload.fullName) formData.append('full_name', payload.fullName);
    if (payload.address) formData.append('address', payload.address);
    if (payload.deliveryMethod) formData.append('delivery_method', payload.deliveryMethod);
    if (payload.paymentMethodId) {
      formData.append('payment_method_id', String(payload.paymentMethodId));
    }

    const response = await apiClient.post('/transactions/checkout', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};


export const getProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
    const data = response?.data;
    if (data?.data) return data.data;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.phone) formData.append('phone', profileData.phone);
    if (profileData.address) formData.append('address', profileData.address);
    if (profileData.photo) formData.append('photo', profileData.photo);

    const response = await apiClient.patch('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response?.data;
    if (data?.data) return data.data;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export default {
  getProducts,
  getFavoriteProducts,
  getProductById,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getCart,
  addToCart,
  getOrders,
  getOrderById,
  getOrderDetail,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderHistory,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  checkout,
  getProfile,
  updateProfile,
};