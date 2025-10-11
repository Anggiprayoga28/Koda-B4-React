import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction,
} from './authSlice';

export const login = (formData) => (dispatch) => {
  dispatch(loginStart());

  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        photoUrl: foundUser.photoUrl,
      };

      localStorage.setItem('currentUser', JSON.stringify(userSession));
      dispatch(loginSuccess(userSession));
      return { success: true };
    } else {
      const errorMsg = 'Invalid email or password';
      dispatch(loginFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    const errorMsg = 'An error occurred during login';
    dispatch(loginFailure(errorMsg));
    return { success: false, error: errorMsg };
  }
};

export const register = (formData) => (dispatch) => {
  dispatch(registerStart());

  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u) => u.email === formData.email);

    if (existingUser) {
      const errorMsg = 'Email already exists';
      dispatch(registerFailure(errorMsg));
      return { success: false, error: errorMsg };
    }

    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    dispatch(registerSuccess());
    return { success: true };
  } catch (error) {
    const errorMsg = 'An error occurred during registration';
    dispatch(registerFailure(errorMsg));
    return { success: false, error: errorMsg };
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('currentUser');
  dispatch(logoutAction());
};