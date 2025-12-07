import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const checkout = createAsyncThunk(
  'checkout/checkout',
  async (checkoutData, { getState, dispatch, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      if (!token) {
        throw new Error('Please login to checkout');
      }

      const formData = new FormData();
      formData.append('email', checkoutData.email);
      formData.append('full_name', checkoutData.full_name);
      formData.append('address', checkoutData.address);
      formData.append('delivery_method', checkoutData.delivery_method);
      
      if (checkoutData.payment_method_id) {
        formData.append('payment_method_id', checkoutData.payment_method_id);
      }
      
      if (checkoutData.notes) {
        formData.append('notes', checkoutData.notes);
      }

      const response = await axios.post(
        `${API_BASE_URL}/transactions/checkout`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { getCart } = await import('./cartSlice');
      dispatch(getCart());

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to checkout';
      return rejectWithValue(message);
    }
  }
);

export const getOrderHistory = createAsyncThunk(
  'checkout/getOrderHistory',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      if (!token) {
        throw new Error('Please login to view order history');
      }

      const response = await axios.get(
        `${API_BASE_URL}/history`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch order history';
      return rejectWithValue(message);
    }
  }
);

export const getOrderDetail = createAsyncThunk(
  'checkout/getOrderDetail',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      if (!token) {
        throw new Error('Please login to view order details');
      }

      const response = await axios.get(
        `${API_BASE_URL}/orders/${orderId}/detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch order detail';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  order: null,
  checkoutSuccess: false,
  orders: [],
  pagination: {
    page: 1,
    limit: 4,
    totalItems: 0,
    totalPages: 0,
  },
  currentOrder: null,
  loading: false,
  error: null,
  success: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    clearCheckoutState: (state) => {
      state.order = null;
      state.checkoutSuccess = false;
      state.error = null;
      state.success = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.checkoutSuccess = false;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutSuccess = true;
        state.order = action.payload.data || null;
        state.success = action.payload.message || 'Order created successfully';
      })
      .addCase(checkout.rejected, (state, action) => {
        state.loading = false;
        state.checkoutSuccess = false;
        state.error = action.payload;
      })
      .addCase(getOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.orders = action.payload.data || [];
          
          if (action.payload.meta) {
            state.pagination = {
              page: action.payload.meta.page || 1,
              limit: action.payload.meta.limit || 4,
              totalItems: action.payload.meta.totalItems || 0,
              totalPages: action.payload.meta.totalPages || 0,
            };
          }
        }
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.currentOrder = action.payload.data || null;
        }
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckoutState, clearMessages, clearCurrentOrder } = checkoutSlice.actions;
export default checkoutSlice.reducer;
