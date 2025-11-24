import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
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
import { logoutUser } from './redux/authActions';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkoutPage';
import ProductPaymentDetails from './components/ProductPaymentDetails';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [notification, setNotification] = useState(null);

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

  const handleForgotPassword = (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u) => u.email === email);

    if (foundUser) {
      showNotification(`Password reset link sent to ${email}`, 'success');
      return true;
    } else {
      showNotification('Email not found', 'error');
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = '/login';
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const Layout = ({ children }) => {
    const location = useLocation();
    const isAdminRoute =
      location.pathname.startsWith('/dashboard') ||
      location.pathname.startsWith('/admin');

    if (isAdminRoute) {
      return <>{children}</>;
    }

    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </>
    );
  };

  return (
    <CartProvider>
      <OrderProvider>
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}

        <div className="flex flex-col min-h-screen">
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/forgot-password"
                element={
                  <ForgotPasswordPage onForgotPassword={handleForgotPassword} />
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment-detail"
                element={
                  <ProtectedRoute>
                    <ProductPaymentDetails />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/order/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history-order"
                element={
                  <ProtectedRoute>
                    <HistoryOrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <ProductListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <OrderListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <UserListPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </div>
      </OrderProvider>
    </CartProvider>
  );
}

export default App;