import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const authStorage = {
  get: () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("currentUser");
      const user = userStr ? JSON.parse(userStr) : null;
      return { token, user };
    } catch (error) {
      console.error("Error reading auth storage:", error);
      return { token: null, user: null };
    }
  },

  set: (user, token) => {
    try {
      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (error) {
      console.error("Error saving to auth storage:", error);
    }
  },

  clear: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  },
};

const { token, user } = authStorage.get();

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!(token && user),
  isLoading: false,
  loading: false,
  error: null,
  success: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const requestBody = {
        email: credentials.email,
        password: credentials.password,
      };

      console.log("Login request:", { email: credentials.email });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      if (data.success && data.data && data.data.token) {
        const userData = data.data.user || {};

        const userObject = {
          id: userData.id || null,
          fullName: userData.full_name || userData.fullName || "",
          email: userData.email || credentials.email,
          role: userData.role || data.data.role || "user",
          photoUrl: userData.photo_url || userData.photoUrl || null,
          phone: userData.phone || "",
          address: userData.address || "",
          createdAt: userData.created_at || userData.createdAt || "",
        };

        const token = data.data.token;

        authStorage.set(userObject, token);

        console.log("Login successful");

        return {
          user: userObject,
          token: token,
        };
      } else {
        return rejectWithValue(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue("Network error. Please check your connection.");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const stateToken = getState().auth.token;
      const localToken = localStorage.getItem("token");
      const token = stateToken || localToken;

      console.log("Getting profile...");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        console.log("Unauthorized (401)");
        return rejectWithValue("UNAUTHORIZED");
      }

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch profile");
      }

      if (data.success && data.data) {
        const userObject = {
          id: data.data.id || null,
          email: data.data.email || "",
          fullName: data.data.fullName || data.data.full_name || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
          photoUrl: data.data.photoUrl || data.data.photo_url || null,
          role: data.data.role || "user",
          createdAt: data.data.createdAt || data.data.created_at || "",
        };

        console.log("Profile fetched successfully");

        return userObject;
      } else {
        return rejectWithValue(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Get profile error:", error);
      return rejectWithValue("Network error. Please check your connection.");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const stateToken = getState().auth.token;
      const localToken = localStorage.getItem("token");
      const token = stateToken || localToken;

      console.log("Updating profile...");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const formData = new FormData();

      if (profileData.fullName !== undefined) {
        formData.append("full_name", profileData.fullName || "");
      }
      if (profileData.phone !== undefined) {
        formData.append("phone", profileData.phone || "");
      }
      if (profileData.address !== undefined) {
        formData.append("address", profileData.address || "");
      }

      if (profileData.photo instanceof File) {
        formData.append("photo", profileData.photo);
        console.log("Photo included in upload:", profileData.photo.name);
      }

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401) {
        console.log("Unauthorized (401)");
        return rejectWithValue("UNAUTHORIZED");
      }

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update profile");
      }

      if (data.success) {
        console.log("Profile update successful, re-fetching profile...");

        const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const profileData = await profileResponse.json();

        if (profileData.success && profileData.data) {
          const userObject = {
            id: profileData.data.id || null,
            email: profileData.data.email || "",
            fullName:
              profileData.data.fullName || profileData.data.full_name || "",
            phone: profileData.data.phone || "",
            address: profileData.data.address || "",
            photoUrl:
              profileData.data.photoUrl || profileData.data.photo_url || null,
            role: profileData.data.role || "user",
            createdAt:
              profileData.data.createdAt || profileData.data.created_at || "",
          };

          authStorage.set(userObject, token);

          console.log("Profile fetched after update:", {
            photoUrl: userObject.photoUrl ? "Updated" : "No change",
          });

          return userObject;
        }
      }

      return rejectWithValue(data.message || "Failed to update profile");
    } catch (error) {
      console.error("Update profile error:", error);
      return rejectWithValue("Network error. Please check your connection.");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { getState, rejectWithValue }) => {
    try {
      const stateToken = getState().auth.token;
      const localToken = localStorage.getItem("token");
      const token = stateToken || localToken;

      console.log("Changing password...");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const formData = new FormData();
      formData.append("old_password", passwordData.currentPassword || "");
      formData.append("new_password", passwordData.newPassword || "");
      formData.append("confirm_password", passwordData.confirmPassword || "");

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401) {
        console.log("Unauthorized (401)");
        return rejectWithValue("UNAUTHORIZED");
      }

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to change password");
      }

      if (data.success) {
        console.log("Password changed successfully");
        return data.message || "Password changed successfully";
      } else {
        return rejectWithValue(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Change password error:", error);
      return rejectWithValue("Network error. Please check your connection.");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      console.log("Logging out...");
      dispatch(logout());
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      return { success: true };
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const formData = new FormData();
      formData.append("full_name", userData.fullName || "");
      formData.append("phone", userData.phone || "");
      formData.append("address", userData.address || "");

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return {
          fullName: userData.fullName,
          phone: userData.phone,
          address: userData.address,
        };
      }

      return rejectWithValue(data.message || "Failed to update user");
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "auth/updateProfilePicture",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data && data.data.photoUrl) {
        return { photoUrl: data.data.photoUrl };
      }

      return rejectWithValue(data.message || "Failed to update photo");
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      console.log("Logout reducer called");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.loading = false;
      state.error = null;
      state.success = null;

      authStorage.clear();
      localStorage.removeItem("cart");
      localStorage.removeItem("favorites");
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        authStorage.set(action.payload, state.token);
      }
    },

    syncFromStorage: (state) => {
      const { token, user } = authStorage.get();
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Login fulfilled");
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.loading = false;
        state.error = null;
        state.success = "Login successful";
      })
      .addCase(login.rejected, (state, action) => {
        console.log("Login rejected:", action.payload);
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.loading = false;
        state.error = action.payload;
        authStorage.clear();
      })
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        console.log("Get profile fulfilled");
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.loading = false;
        state.error = null;
        authStorage.set(action.payload, state.token);
      })
      .addCase(getProfile.rejected, (state, action) => {
        console.log("Get profile rejected:", action.payload);
        state.isLoading = false;
        state.loading = false;
        state.error = action.payload;

        if (action.payload === "UNAUTHORIZED") {
          console.log("Auto-logout due to 401");
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
          authStorage.clear();
        }
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        console.log("Update profile fulfilled");
        state.user = action.payload;
        state.isLoading = false;
        state.loading = false;
        state.error = null;
        state.success = "Profile updated successfully";
        authStorage.set(action.payload, state.token);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        console.log("Update profile rejected:", action.payload);
        state.isLoading = false;
        state.loading = false;
        state.error = action.payload;

        if (action.payload === "UNAUTHORIZED") {
          console.log("Auto-logout due to 401");
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
          authStorage.clear();
        }
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        console.log("Change password fulfilled");
        state.isLoading = false;
        state.loading = false;
        state.error = null;
        state.success = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        console.log("Change password rejected:", action.payload);
        state.isLoading = false;
        state.loading = false;
        state.error = action.payload;

        if (action.payload === "UNAUTHORIZED") {
          console.log("Auto-logout due to 401");
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
          authStorage.clear();
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = {
          ...state.user,
          ...action.payload,
        };
        state.user = updatedUser;
        state.isLoading = false;
        state.loading = false;
        state.error = null;
        authStorage.set(updatedUser, state.token);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        if (state.user) {
          const updatedUser = {
            ...state.user,
            photoUrl: action.payload.photoUrl,
          };
          state.user = updatedUser;
          authStorage.set(updatedUser, state.token);
        }
        state.isLoading = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  clearAuthError,
  clearMessages,
  setUser,
  syncFromStorage,
} = authSlice.actions;

export default authSlice.reducer;
