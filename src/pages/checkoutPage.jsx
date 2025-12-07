import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import api from '../config/axiosConfig';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [cartData, setCartData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    deliveryMethod: 'dine_in',
    paymentMethodId: 1,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/checkout',
          message: 'Please login to continue checkout'
        }
      });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await api.get('/cart');
        
        if (response.data.success) {
          setCartData(response.data.data);
        } else {
          throw new Error('Failed to load cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!loading && cartData && (!cartData.items || cartData.items.length === 0)) {
      const timer = setTimeout(() => {
        navigate('/product', {
          state: {
            message: 'Your cart is empty. Please add some products first.'
          }
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cartData, loading, navigate]);

  const deliveryFee = formData.deliveryMethod === 'door_delivery' ? 10000 : 0;
  const subtotal = cartData?.subtotal || 0;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const checkoutData = new FormData();
      checkoutData.append('email', formData.email);
      checkoutData.append('full_name', formData.fullName);
      checkoutData.append('address', formData.address);
      checkoutData.append('delivery_method', formData.deliveryMethod);
      checkoutData.append('payment_method_id', formData.paymentMethodId);

      const response = await api.post('/transactions/checkout', checkoutData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        navigate('/history-order', {
          state: { 
            message: 'Order placed successfully!',
            orderNumber: response.data.data?.orderNumber || response.data.data?.order_number
          }
        });
      } else {
        throw new Error(response.data.message || 'Checkout failed');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || err.message || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E6447] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Redirecting to products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E6447] focus:border-transparent" 
                      placeholder="John Doe" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E6447] focus:border-transparent" 
                      placeholder="john@example.com" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E6447] focus:border-transparent" 
                      placeholder="08123456789" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                    <textarea 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      required 
                      rows="3" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E6447] focus:border-transparent" 
                      placeholder="Enter your complete address" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Delivery Method
                </h2>
                
                <select 
                  name="deliveryMethod" 
                  value={formData.deliveryMethod} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E6447] focus:border-transparent"
                >
                  <option value="dine_in">Dine In - Free</option>
                  <option value="door_delivery">Door Delivery - Rp 10,000</option>
                  <option value="pick_up">Pick Up - Free</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
                
                <select 
                  name="paymentMethodId" 
                  value={formData.paymentMethodId} 
                  onChange={(e) => setFormData({...formData, paymentMethodId: parseInt(e.target.value)})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E6447] focus:border-transparent"
                >
                  <option value="1">Cash</option>
                  <option value="2">Credit Card</option>
                  <option value="3">E-Wallet</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full bg-[#8E6447] text-white py-3 rounded-lg font-semibold hover:bg-[#7A5538] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Processing...' : `Place Order - Rp ${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartData.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img 
                      src={item.imageUrl || item.image_url || '/placeholder.png'} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded" 
                      onError={(e) => e.target.src = '/placeholder.png'} 
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">
                        {item.size && `${item.size} • `}
                        {item.temperature && `${item.temperature} • `}
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-#7A5538">
                        Rp {(item.subtotal || item.totalPrice || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">Rp {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-#7A5538">Rp {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;