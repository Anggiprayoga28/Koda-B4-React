import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    console.error('API Error:', error);
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
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Get favorite products from backend
 */
export const getFavoriteProducts = async () => {
  try {
    const response = await apiClient.get('/products/favorite');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    return [];
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Product not found');
  } catch (error) {
    console.error('Error fetching product:', error);
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
    }
    throw new Error('Product detail not found');
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};


export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};


export const getPromos = async () => {
  return [
    {
      id: 1,
      title: "Flash Sale 50%",
      description: "Get 50% off on selected items",
      image: "/promo1.png"
    }
  ];
};

export const getPromoById = async (id) => {
  const promos = await getPromos();
  return promos.find(p => p.id === parseInt(id));
};

export const getProductsByCategory = async (category) => {
  return getProducts({ category });
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
};