import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUserProfile 
} from './authSlice';

export const login = (formData) => async (dispatch) => {
  dispatch(loginStart());
  
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success && data.data) {
      const userSession = {
        id: data.data.user.id,
        fullName: data.data.user.fullName,
        email: data.data.user.email,
        role: data.data.user.role,
        photoUrl: data.data.user.photoUrl || null,
        phone: data.data.user.phone || '',
        address: data.data.user.address || '',
      };

      dispatch(loginSuccess({
        user: userSession,
        token: data.data.token
      }));

      return { success: true, data: userSession };
    } else {
      dispatch(loginFailure());
      return { 
        success: false, 
        message: data.message || 'Login failed' 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    dispatch(loginFailure());
    return { 
      success: false, 
      message: 'Network error. Please check your connection.' 
    };
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
  
  window.location.href = '/login';
};

export const updateUser = (userData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (data.success) {
      dispatch(updateUserProfile(data.data));
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const updateProfilePicture = (formData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/profile-picture`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      dispatch(updateUserProfile({ photoUrl: data.data.photoUrl }));
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Update profile picture error:', error);
    return { success: false, message: 'Network error' };
  }
};