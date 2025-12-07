import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getProductDetail = createAsyncThunk(
  'product/getProductDetail',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/${productId}/detail`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error('Product not found');
      }

      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch product';
      return rejectWithValue(message);
    }
  }
);

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const hasFilters = params.search || params.category_id || params.is_favorite || 
                        params.is_flash_sale || params.is_buy1get1 || 
                        params.min_price || params.max_price;
      
      const endpoint = hasFilters ? '/products/filter' : '/products';
      
      const response = await axios.get(
        `${API_BASE_URL}${endpoint}`,
        { params }
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

export const getFavoriteProducts = createAsyncThunk(
  'product/getFavoriteProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/favorite`
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch favorites';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  currentProduct: null,
  images: [],
  sizes: [],
  temperatures: [],
  reviews: [],
  recommendations: [],
  averageRating: 0,
  totalReviews: 0,
  
  products: [],
  pagination: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  },
  
  loading: false,
  error: null,
  detailLoading: false,
  detailError: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductDetail: (state) => {
      state.currentProduct = null;
      state.images = [];
      state.sizes = [];
      state.temperatures = [];
      state.reviews = [];
      state.recommendations = [];
      state.averageRating = 0;
      state.totalReviews = 0;
      state.detailError = null;
    },
    clearProductError: (state) => {
      state.error = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        const data = action.payload;
        
        state.currentProduct = data.product;
        state.images = data.images || [];
        state.sizes = data.sizes || [];
        state.temperatures = data.temperatures || [];
        state.reviews = data.reviews || [];
        state.recommendations = data.recommendations || [];
        state.averageRating = data.averageRating || 0;
        state.totalReviews = data.totalReviews || 0;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })

      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.products = action.payload.data || [];
          
          if (action.payload.meta) {
            state.pagination = {
              page: action.payload.meta.page || 1,
              limit: action.payload.meta.limit || 10,
              totalItems: action.payload.meta.totalItems || 0,
              totalPages: action.payload.meta.totalPages || 0,
            };
          }
        }
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFavoriteProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFavoriteProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.products = action.payload.data || [];
        }
      })
      .addCase(getFavoriteProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetail, clearProductError } = productSlice.actions;
export default productSlice.reducer;