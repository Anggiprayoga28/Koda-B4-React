import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

console.log('API_BASE_URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Get all products from backend
 */
export const getProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    
    console.log('Products Response:', response.data);
    
    // Handle different response structures
    if (response.data.success && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
};

/**
 * Get favorite products from backend
 */
export const getFavoriteProducts = async () => {
  try {
    const response = await apiClient.get('/products/favorite');
    
    console.log('Favorite Products Response:', response.data);
    
    if (response.data.success && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching favorite products:', error.message);
    throw error;
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    
    console.log('Product Detail Response:', response.data);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else if (response.data.id) {
      return response.data;
    }
    
    throw new Error('Product not found');
  } catch (error) {
    console.error('Error fetching product:', error.message);
    throw error;
  }
};

/**
 * Get product detail with variants
 */
export const getProductDetail = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}/detail`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else if (response.data.id) {
      return response.data;
    }
    
    throw new Error('Product detail not found');
  } catch (error) {
    console.error('Error fetching product detail:', error.message);
    throw error;
  }
};

/**
 * Get categories
 */
export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    
    if (response.data.success && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }
};

/**
 * Get promos - Temporarily disabled, return empty array
 */
export const getPromos = async () => {
  // TODO: Implement when backend promo endpoint is ready
  console.log('Promos fetch skipped - endpoint not ready');
  return [];
};

/**
 * Get promo by ID
 */
export const getPromoById = async (id) => {
  const promos = await getPromos();
  return promos.find(p => p.id === parseInt(id));
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category) => {
  return getProducts({ category });
};

/**
 * Create new product
 */
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data.data || response.data;
    }
    throw new Error('Failed to create product');
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update existing product
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await apiClient.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data.data || response.data;
    }
    throw new Error('Failed to update product');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to delete product');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Upload product image
 */
export const uploadProductImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post('/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data.imageUrl || response.data.data;
    } else if (response.data.url) {
      return response.data.url;
    }
    
    throw new Error('Failed to upload image');
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default {
  getProducts,
  getFavoriteProducts,
  getProductById,
  getProductDetail,
  getCategories,
  getPromos,
  getPromoById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};