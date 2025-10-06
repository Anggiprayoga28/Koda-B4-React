import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, ShoppingBag, DollarSign, Package, ChevronRight, MessageCircle } from 'lucide-react';
import Notification from '../components/ui/Notification';

const HistoryOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('on-progress');
  const [selectedMonth, setSelectedMonth] = useState('January 2023');
  const [showMessage, setShowMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);

    if (location.state?.fromCheckout && location.state?.message) {
      showNotification(location.state.message, 'success');
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

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

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'on-progress') return order.status === 'On Progress';
    if (activeTab === 'sending-goods') return order.status === 'Sending Goods';
    if (activeTab === 'finish-order') return order.status === 'Finish Order';
    return true;
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      showNotification('Message sent successfully!', 'success');
      setMessage('');
      setShowMessage(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Order History - Coffee Shop | Track Your Orders</title>
        <meta name="description" content="View and track all your coffee shop orders. Check order status, details, and history." />
      </Helmet>

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-5xl font-light">History Order</h1>
          <span className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
            {filteredOrders.length}
          </span>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveTab('on-progress')}
                  className={`px-6 py-3 font-medium transition ${
                    activeTab === 'on-progress' 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  On Progress
                </button>
                <button
                  onClick={() => setActiveTab('sending-goods')}
                  className={`px-6 py-3 font-medium transition ${
                    activeTab === 'sending-goods' 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sending Goods
                </button>
                <button
                  onClick={() => setActiveTab('finish-order')}
                  className={`px-6 py-3 font-medium transition ${
                    activeTab === 'finish-order' 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Finish Order
                </button>
              </div>

              <div className="relative">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 font-medium cursor-pointer hover:border-gray-400 transition"
                >
                  <option>January 2023</option>
                  <option>February 2023</option>
                  <option>March 2023</option>
                  <option>April 2023</option>
                  <option>May 2023</option>
                  <option>June 2023</option>
                </select>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No orders found in this category</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.orderId} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                      <div className="flex items-center gap-6">
                        <img 
                          src={order.items[0]?.image || 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=150&h=150&fit=crop'} 
                          alt="Order" 
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1 grid grid-cols-4 gap-8">
                          <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                              <ShoppingBag className="w-4 h-4" />
                              <span>No. Order</span>
                            </div>
                            <div className="font-semibold">#{order.orderId}</div>
                            <button 
                              onClick={() => handleViewOrder(order.orderId)}
                              className="text-orange-500 text-sm font-medium mt-1 hover:underline"
                            >
                              Views Order Detail
                            </button>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                              <Calendar className="w-4 h-4" />
                              <span>Date</span>
                            </div>
                            <div className="font-semibold">{formatDate(order.orderDate)}</div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Total</span>
                            </div>
                            <div className="font-semibold">Idr {Math.round(order.total).toLocaleString()}</div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                              <Package className="w-4 h-4" />
                              <span>Status</span>
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'On Progress' ? 'bg-orange-100 text-orange-600' :
                              order.status === 'Sending Goods' ? 'bg-blue-100 text-blue-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 mt-8">
                  <button 
                    onClick={() => setCurrentPage(1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      currentPage === 1 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    1
                  </button>
                  <button 
                    onClick={() => setCurrentPage(2)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      currentPage === 2 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    2
                  </button>
                  <button 
                    onClick={() => setCurrentPage(3)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      currentPage === 3 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    3
                  </button>
                  <button 
                    onClick={() => setCurrentPage(4)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      currentPage === 4 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    4
                  </button>
                  <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-3">Send Us Message</h3>
              
              <p className="text-gray-600 text-sm text-center mb-6">
                if your unable to find answer or find your product quickly, please describe your problem and tell us. we will give you solution.
              </p>

              <button 
                onClick={() => setShowMessage(!showMessage)}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
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