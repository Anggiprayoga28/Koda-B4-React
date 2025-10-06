export const storage = {
  getUsers: () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },
  
  saveUser: (user) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  clearCurrentUser: () => {
    localStorage.removeItem('currentUser');
  },
  
  findUserByEmail: (email) => {
    const users = storage.getUsers();
    return users.find(u => u.email === email);
  },
  
  authenticate: (email, password) => {
    const users = storage.getUsers();
    return users.find(u => u.email === email && u.password === password);
  }
};