import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction,
} from './authSlice';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = (formData) => async (dispatch) => {
  dispatch(loginStart());

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      const userSession = {
        id: data.data.user_id,
        fullName: data.data.full_name,
        email: data.data.email,
        photoUrl: data.data.photo_url || null,
        token: data.data.token,
      };

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      
      dispatch(loginSuccess(userSession));
      return { success: true };
    } else {
      const errorMsg = data.message || 'Invalid email or password';
      dispatch(loginFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorMsg = 'Network error. Please check your connection.';
    dispatch(loginFailure(errorMsg));
    return { success: false, error: errorMsg };
  }
};

export const register = (formData) => async (dispatch) => {
  dispatch(registerStart());

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      dispatch(registerSuccess());
      return { success: true, message: data.message };
    } else {
      const errorMsg = data.message || 'Registration failed';
      dispatch(registerFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    console.error('Registration error:', error);
    const errorMsg = 'Network error. Please check your connection.';
    dispatch(registerFailure(errorMsg));
    return { success: false, error: errorMsg };
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  dispatch(logoutAction());
};