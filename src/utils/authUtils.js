/**
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * @returns {boolean} 
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

/**
 * @param {string} token
 * @param {Object} userData
 */
export const saveUserSession = (token, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('currentUser', JSON.stringify(userData));
  window.dispatchEvent(new Event('storage'));
};


export const clearUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  window.dispatchEvent(new Event('storage'));
};

/**
 * @param {Object} updatedData 
 */
export const updateUserData = (updatedData) => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};