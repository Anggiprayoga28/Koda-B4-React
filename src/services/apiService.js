import axios from 'axios';
import productsData from '../data/products.json';
import promosData from '../data/promos.json';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async () => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(productsData.products);
      }, 100); 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * @param {number} id - Product ID
 */
export const getProductById = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = productsData.products.find(p => p.id === parseInt(id));
        if (!product) {
          reject(new Error('Product not found'));
        }
        resolve(product);
      }, 100);
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * @param {string} category - Product category
 */
export const getProductsByCategory = async (category) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productsData.products.filter(p => p.category === category);
        resolve(products);
      }, 100);
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const getPromos = async () => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(promosData.promos);
      }, 100);
    });
  } catch (error) {
    console.error('Error fetching promos:', error);
    throw error;
  }
};

/**
 * @param {number} id - Promo ID
 */
export const getPromoById = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const promo = promosData.promos.find(p => p.id === parseInt(id));
        if (!promo) {
          reject(new Error('Promo not found'));
        }
        resolve(promo);
      }, 100);
    });
  } catch (error) {
    console.error('Error fetching promo:', error);
    throw error;
  }
};

export const api = {
  products: {
    getAll: () => apiClient.get('/products'),
    getById: (id) => apiClient.get(`/products/${id}`),
    create: (data) => apiClient.post('/products', data),
    update: (id, data) => apiClient.put(`/products/${id}`, data),
    delete: (id) => apiClient.delete(`/products/${id}`)
  },
  promos: {
    getAll: () => apiClient.get('/promos'),
    getById: (id) => apiClient.get(`/promos/${id}`),
    create: (data) => apiClient.post('/promos', data),
    update: (id, data) => apiClient.put(`/promos/${id}`, data),
    delete: (id) => apiClient.delete(`/promos/${id}`)
  }
};

export default {
  getProducts,
  getProductById,
  getProductsByCategory,
  getPromos,
  getPromoById,
  api
};