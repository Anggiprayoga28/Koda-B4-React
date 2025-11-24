import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  try {
    const userData = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");

    if (userData && token) {
      return {
        user: JSON.parse(userData),
        token: token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error parsing stored user data:", error);
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState = getStoredUser();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    loginFailure: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");

      localStorage.removeItem("cart");
      localStorage.removeItem("favorites");
    },

    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
        localStorage.setItem("currentUser", JSON.stringify(state.user));
      }
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserProfile,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
