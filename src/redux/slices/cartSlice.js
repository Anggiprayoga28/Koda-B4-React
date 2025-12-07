import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, sizeId, temperatureId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      if (!token) {
        throw new Error('Please login to add items to cart');
      }

      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('quantity', quantity);
      if (sizeId) formData.append('size_id', sizeId);
      if (temperatureId) formData.append('temperature_id', temperatureId);

      const response = await axios.post(
        `${API_BASE_URL}/cart`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add to cart';
      return rejectWithValue(message);
    }
  }
);

export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      if (!token) {
        throw new Error('Please login to view cart');
      }

      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch cart';
      return rejectWithValue(message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      if (!token) {
        throw new Error('Please login');
      }

      const formData = new FormData();
      formData.append('quantity', quantity);

      const response = await axios.patch(
        `${API_BASE_URL}/cart/${cartItemId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update cart';
      return rejectWithValue(message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (cartItemId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      if (!token) {
        throw new Error('Please login');
      }

      const response = await axios.delete(`${API_BASE_URL}/cart/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { cartItemId, ...response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to remove item';
      return rejectWithValue(message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      if (!token) {
        throw new Error('Please login');
      }

      const response = await axios.delete(`${API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to clear cart';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
  loading: false,
  error: null,
  success: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
      state.error = null;
      state.success = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Product added to cart';
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.items = action.payload.data.items || [];
          state.subtotal = action.payload.data.subtotal || 0;
          state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        }
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Cart updated';
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Item removed from cart';
        state.items = state.items.filter((item) => item.id !== action.payload.cartItemId);
        state.subtotal = state.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Cart cleared';
        state.items = [];
        state.subtotal = 0;
        state.totalItems = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState, clearMessages } = cartSlice.actions;
export default cartSlice.reducer;
