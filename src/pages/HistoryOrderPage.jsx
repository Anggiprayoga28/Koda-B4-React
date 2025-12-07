import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package } from 'lucide-react';
import { toast } from 'react-toastify';

import Notification from '../components/ui/Notification';
import Pagination from '../components/admin/Pagination';

import { getOrderHistory, clearMessages } from '../redux/slices/checkoutSlice';

const HistoryOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { 
    orders, 
    pagination,
    loading, 
    error 
  } = useSelector((state) => state.checkout);

  const [activeTab, setActiveTab] = useState('pending');
  const [selectedMonth, setSelectedMonth] = useState('January 2023');
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 4;

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view order history');
      navigate('/login', { state: { from: '/history-order' } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.title = 'Order History - Coffee Shop | Track Your Orders';
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      showNotification(location.state.message, 'success');
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (error) {
      showNotification(error, 'error');
      dispatch(clearMessages());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [activeTab, currentPage, isAuthenticated]);

  const fetchOrders = async () => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };
    
    if (activeTab && activeTab !== 'all') {
      params.status = activeTab;
    }
    
    console.log('Fetching orders with params:', params);
    
    try {
      await dispatch(getOrderHistory(params)).unwrap();
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success('Message sent successfully!');
      setMessage('');
      setShowMessage(false);
    } else {
      toast.error('Please enter a message');
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusDisplay = (status) => {
    if (!status) return 'Unknown';
    
    const statusLower = status.toLowerCase();
    
    const statusMap = {
      'pending': 'On Progress',
      'processing': 'On Progress',
      'in_progress': 'On Progress',
      'shipping': 'Sending Goods',
      'shipped': 'Sending Goods',
      'in_delivery': 'Sending Goods',
      'done': 'Finish Order',
      'completed': 'Finish Order',
      'delivered': 'Finish Order',
      'finished': 'Finish Order',
      'cancelled': 'Cancelled',
      'canceled': 'Cancelled',
      'failed': 'Failed'
    };
    
    return statusMap[statusLower] || status;
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (['pending', 'processing', 'in_progress'].includes(statusLower)) {
      return 'bg-#F9F6F0 text-#7A5538';
    }
    if (['shipping', 'shipped', 'in_delivery'].includes(statusLower)) {
      return 'bg-blue-100 text-blue-600';
    }
    if (['done', 'completed', 'delivered', 'finished'].includes(statusLower)) {
      return 'bg-green-100 text-green-600';
    }
    if (['cancelled', 'canceled', 'failed'].includes(statusLower)) {
      return 'bg-red-100 text-red-600';
    }
    return 'bg-gray-100 text-gray-600';
  };

  const mappedOrders = orders.map(order => ({
    id: order.id || order.order_id,
    invoice: order.invoice || order.order_number || order.id,
    date: formatDate(order.date || order.created_at || order.order_date),
    total: order.total || order.total_amount || order.grandTotal || 0,
    status: order.status || 'pending',
    statusDisplay: getStatusDisplay(order.status || 'pending'),
    imageProduct: order.imageProduct || order.image_url || order.product_image || '/placeholder.png'
  }));

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-#8E6447 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-5xl font-light">History Order</h1>
          <span className="bg-gray-200 text-gray-700 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base">
            {pagination.totalItems || 0}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6 md:mb-8">
              <div className="relative w-full md:w-auto order-1 md:order-2">
                <select 
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-[#F1F1F1] px-4 py-3 md:py-5 pr-10 font-medium cursor-pointer hover:border-gray-400 transition w-full rounded-lg"
                  disabled
                >
                  <option>January 2023</option>
                  <option>February 2023</option>
                  <option>March 2023</option>
                  <option>April 2023</option>
                  <option>May 2023</option>
                  <option>June 2023</option>
                </select>
                <svg 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="flex bg-[#E8E8E84D] p-2 shadow-sm overflow-hidden rounded-lg order-2 md:order-1 w-full md:w-auto">
                <button
                  onClick={() => handleTabChange('pending')}
                  className={`flex-1 md:flex-none px-3 md:px-6 py-3 font-medium transition text-sm md:text-base rounded-lg ${
                    activeTab === 'pending' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  On Progress
                </button>
                <button
                  onClick={() => handleTabChange('shipping')}
                  className={`flex-1 md:flex-none px-3 md:px-6 py-3 font-medium transition text-sm md:text-base rounded-lg ${
                    activeTab === 'shipping' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sending Goods
                </button>
                <button
                  onClick={() => handleTabChange('done')}
                  className={`flex-1 md:flex-none px-3 md:px-6 py-3 font-medium transition text-sm md:text-base rounded-lg ${
                    activeTab === 'done' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Finish Order
                </button>
              </div>
            </div>

            {loading && mappedOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-#8E6447 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : mappedOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No orders found in this category</p>
                <p className="text-gray-400 text-sm">Your order history will appear here after checkout</p>
                <button
                  onClick={() => navigate('/products')}
                  className="mt-4 px-6 py-2.5 bg-#8E6447 text-white rounded-lg hover:bg-#7A5538 transition"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {mappedOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                        <img 
                          src={order.imageProduct} 
                          alt="Order" 
                          className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg hidden md:block"
                        />
                        
                        <div className="flex-1 w-full">
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                            <div>
                              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>No. Order</span>
                              </div>
                              <div className="font-semibold line-clamp-1 text-sm md:text-base">
                                #{order.invoice}
                              </div>
                              <button 
                                onClick={() => handleViewOrder(order.id)}
                                className="text-#8E6447 text-xs md:text-sm font-medium mt-1 hover:underline"
                              >
                                View Order Detail
                              </button>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Date</span>
                              </div>
                              <div className="font-semibold text-sm md:text-base">
                                {order.date}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Total</span>
                              </div>
                              <div className="font-semibold text-sm md:text-base">
                                IDR {order.total.toLocaleString()}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Status</span>
                              </div>
                              <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.statusDisplay}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      totalItems={pagination.totalItems}
                    />
                  </div>
                )}
              </>
            )}

            <div className="block lg:hidden mt-8">
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex mb-4">
                  <svg className="w-12 h-12 text-#8E6447" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-semibold text-[#4F5665] mb-2">Send Us Message</h3>
                
                <p className="text-gray-600 text-xs mb-3">
                  If you're unable to find an answer or find your product quickly, please describe your problem and tell us. We will give you a solution.
                </p>

                <button 
                  onClick={() => setShowMessage(!showMessage)}
                  className="w-full bg-[#8E6447] text-white py-2.5 rounded-lg hover:bg-#7A5538 transition font-medium"
                >
                  {showMessage ? 'Hide Message Form' : 'Send Message'}
                </button>

                {showMessage && (
                  <div className="mt-6 p-4 bg-#F9F6F0 rounded-lg">
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-#8E6447 focus:border-transparent"
                      rows="4"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="w-full mt-3 bg-#8E6447 text-white py-2 rounded-lg font-medium hover:bg-#7A5538 transition"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="border border-gray-300 rounded-lg p-6 bg-white sticky top-24">
              <div className="flex mb-4">
                <svg className="w-16 h-16 text-#8E6447" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-[#4F5665] mb-2">Send Us Message</h3>
              
              <p className="text-gray-600 text-sm mb-4">
                If you're unable to find an answer or find your product quickly, please describe your problem and tell us. We will give you a solution.
              </p>

              <button 
                onClick={() => setShowMessage(!showMessage)}
                className="w-full bg-[#8E6447] text-white py-2 rounded-lg hover:bg-#7A5538 transition font-medium"
              >
                {showMessage ? 'Hide Message Form' : 'Send Message'}
              </button>

              {showMessage && (
                <div className="mt-6 p-4 bg-#F9F6F0 rounded-lg">
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-#8E6447 focus:border-transparent"
                    rows="4"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="w-full mt-3 bg-#8E6447 text-white py-2 rounded-lg font-medium hover:bg-#7A5538 transition"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryOrderPage;