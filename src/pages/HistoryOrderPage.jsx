import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package } from 'lucide-react';
import Notification from '../components/ui/Notification';
import Pagination from '../components/admin/Pagination';
import { getOrderHistory } from '../services/apiService';

const HistoryOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedMonth, setSelectedMonth] = useState('January 2023');
  const [showMessage, setShowMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const itemsPerPage = 4;

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
    fetchOrders();
  }, [activeTab, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (activeTab && activeTab !== 'all') {
        params.status = activeTab;
      }
      
      console.log('Fetching orders with params:', params);
      
      const response = await getOrderHistory(params);
      console.log('Orders response:', response);
      
      const ordersData = response.data || [];
      
      const mappedOrders = ordersData.map(order => ({
        id: order.id || order.order_id,
        invoice: order.invoice || order.order_number || order.id,
        date: order.date || order.created_at || order.order_date || new Date().toLocaleDateString(),
        total: order.total || order.total_amount || order.grandTotal || 0,
        status: order.status || 'pending',
        statusDisplay: getStatusDisplay(order.status || 'pending'),
        imageProduct: order.imageProduct || order.image_url || order.product_image || '/placeholder.png'
      }));
      
      setOrders(mappedOrders);
      setTotalPages(response.meta?.totalPages || 1);
      setTotalItems(response.meta?.totalItems || ordersData.length);
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error details:', error.response?.data);
      showNotification('Failed to load order history', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
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
      showNotification('Message sent successfully!', 'success');
      setMessage('');
      setShowMessage(false);
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-5xl font-light">History Order</h1>
          <span className="bg-gray-200 text-gray-700 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base">
            {totalItems}
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
                  className="appearance-none bg-[#F1F1F1] px-4 py-3 md:py-5 pr-10 font-medium cursor-pointer hover:border-gray-400 transition w-full"
                  disabled
                >
                  <option>January 2023</option>
                  <option>February 2023</option>
                  <option>March 2023</option>
                  <option>April 2023</option>
                  <option>May 2023</option>
                  <option>June 2023</option>
                </select>
                <img src='/Calendar.svg' className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex bg-[#E8E8E84D] p-2 shadow-sm overflow-hidden order-2 md:order-1 w-full md:w-auto">
                <button
                  onClick={() => handleTabChange('pending')}
                  className={`flex-1 md:flex-none px-3 md:px-6 py-3 font-medium transition text-sm md:text-base ${
                    activeTab === 'pending' 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  On Progress
                </button>
                <button
                  onClick={() => handleTabChange('shipping')}
                  className={`flex-1 md:flex-none px-3 md:px-6 py-3 font-medium transition text-sm md:text-base ${
                    activeTab === 'shipping' 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sending Goods
                </button>
                <button
                  onClick={() => handleTabChange('done')}
                  className={`flex-1 md:flex-none px-3 md:px-6 py-3 font-medium transition text-sm md:text-base ${
                    activeTab === 'done' 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Finish Order
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No orders found in this category</p>
                <p className="text-gray-400 text-sm">Your order history will appear here after checkout</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-[#E8E8E84D] p-4 md:p-6 hover:shadow-md transition">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                        <img 
                          src={order.imageProduct} 
                          alt="Order" 
                          className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg hidden md:block"
                          onError={(e) => e.target.src = '/placeholder.png'}
                        />
                        
                        <div className="flex-1 w-full">
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                            <div>
                              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-1">
                                <img src='/glass.svg' className="w-4 h-4" />
                                <span>No. Order</span>
                              </div>
                              <div className="font-semibold line-clamp-1 text-sm md:text-base">#{order.invoice}</div>
                              <button 
                                onClick={() => handleViewOrder(order.id)}
                                className="text-orange-500 text-xs md:text-sm font-medium mt-1 hover:underline"
                              >
                                Views Order Detail
                              </button>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-1">
                                <img src='/Calendar.svg' className="w-4 h-4" />
                                <span>Date</span>
                              </div>
                              <div className="font-semibold text-sm md:text-base">{order.date}</div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-1">
                                <img src='/Repeat.svg' className="w-4 h-4" />
                                <span>Total</span>
                              </div>
                              <div className="font-semibold text-sm md:text-base">Idr {order.total.toLocaleString()}</div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-1">
                                <img src='/u_process.svg' className="w-4 h-4" />
                                <span>Status</span>
                              </div>
                              <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                                order.status === 'pending' || order.status === 'processing' ? 'bg-orange-100 text-orange-600' :
                                order.status === 'shipping' || order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                order.status === 'done' || order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {order.statusDisplay}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                  />
                )}
              </>
            )}

            <div className="block lg:hidden mt-8">
              <div className="border border-gray-300 p-6">
                <div className="flex mb-2">
                  <img src="/messages.svg" alt="messages" className='items-center justify-center w-12 h-12' />
                </div>
                
                <h3 className="text-lg font-semibold text-[#4F5665] mb-2">Send Us Message</h3>
                
                <p className="text-gray-600 text-xs mb-3">
                  if your unable to find answer or find your product quickly, please describe your problem and tell us. we will give you solution.
                </p>

                <button 
                  onClick={() => setShowMessage(!showMessage)}
                  className="w-full bg-[#FF8906] text-[#0B132A] py-2.5 rounded-lg hover:bg-orange-600 transition font-medium"
                >
                  {showMessage ? 'Hide Message Form' : 'Send Message'}
                </button>

                {showMessage && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-orange-500"
                      rows="4"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="w-full mt-3 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="border border-gray-300 p-6 sticky w-120 h-60 top-4">
              <div className="flex mb-2">
                <img src="/messages.svg" alt="messages" className='items-center justify-center w-16 h-16' />
              </div>
              
              <h3 className="text-xl font-semibold text-[#4F5665] mb-2">Send Us Message</h3>
              
              <p className="text-gray-600 text-sm mb-2">
                if your unable to find answer or find your product quickly, please describe your problem and tell us. we will give you solution.
              </p>

              <button 
                onClick={() => setShowMessage(!showMessage)}
                className="w-full bg-[#FF8906] text-[#0B132A] py-2 rounded-lg hover:bg-orange-600 transition font-medium"
              >
                {showMessage ? 'Hide Message Form' : 'Send Message'}
              </button>

              {showMessage && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-orange-500"
                    rows="4"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="w-full mt-3 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition"
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