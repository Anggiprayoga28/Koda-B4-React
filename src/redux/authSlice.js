import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * @param {Object} state - Current state
     */
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    /**
     * @param {Object} state - Current state
     * @param {Object} action - Action with user payload
     */
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    
    /**
     * @param {Object} state - Current state
     * @param {Object} action - Action with error payload
     */
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    
    /**
     * @param {Object} state - Current state
     */
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    /**
     * @param {Object} state - Current state
     */
    registerSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    
    /**
     * @param {Object} state - Current state
     * @param {Object} action - Action with error payload
     */
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    /**
     * @param {Object} state - Current state
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    /**
     * @param {Object} state - Current state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;