import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";
import Navbar from './components/layout/Navbar';
import Footer from './components/landing/Footer';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import HistoryOrderPage from './pages/HistoryOrderPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProductListPage from './pages/ProductListPage';
import OrderListPage from './pages/OrderListPage';
import UserListPage from './pages/UserListPage';
import Notification from './components/ui/Notification';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('currentUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleLogin = (formData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        photoUrl: foundUser.photoUrl
      };
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      setUser(userSession);
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 100);
      
      return true;
    } else {
      showNotification('Invalid email or password', 'error');
      return false;
    }
  };

  const handleRegister = (formData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === formData.email);
    
    if (existingUser) {
      showNotification('Email already exists', 'error');
      return false;
    }
    
    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showNotification('Registration successful! Please login.', 'success');
    return true;
  };

  const handleForgotPassword = (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (user) {
      showNotification(`Password reset link sent to ${email}`, 'success');
      return true;
    } else {
      showNotification('Email not found', 'error');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    window.location.href = '/login';
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
        </div>
      );
    }
    
    return user ? children : <Navigate to="/login" replace />;
  };

  const Layout = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/dashboard') || 
                         location.pathname.startsWith('/admin');

    if (isAdminRoute) {
      return <>{children}</>;
    }

    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </>
    );
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}
        <div className="flex flex-col min-h-screen">
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage onForgotPassword={handleForgotPassword} />} />
              
              <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              <Route path="/history-order" element={<ProtectedRoute><HistoryOrderPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><ProductListPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UserListPage /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;