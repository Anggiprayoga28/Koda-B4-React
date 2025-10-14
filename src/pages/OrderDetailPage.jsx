import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    document.title = `Order #${orderId} - Coffee Shop`;
  }, [orderId]);

  useEffect(() => {
    const foundOrder = getOrderById(orderId);
    setOrder(foundOrder);
  }, [orderId, getOrderById]);

  const handleBack = () => {
    navigate('/history-order'); 
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Order not found</p>
          <button 
            onClick={handleBack}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }) + ' at ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    if (status === 'Done' || status === 'Finish Order') return 'bg-green-100 text-green-700';
    if (status === 'Sending Goods') return 'bg-blue-100 text-blue-700';
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Order #{order.orderId}</h1>
        <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8">{formatDate(order.orderDate)}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 order-1 lg:order-1">
            <div className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-sm p-0 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Order Information</h2>
              
              <div className="space-y-0">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src='/Profile.svg' className="w-5 h-5" />
                    <span className="text-sm md:text-base">Full Name</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">{order.customerInfo.fullName}</p>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src='/Location.svg' className="w-5 h-5" />
                    <span className="text-sm md:text-base">Address</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">{order.customerInfo.address}</p>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src='/PhoneCall.svg' className="w-5 h-5" />
                    <span className="text-sm md:text-base">Phone</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">082116304338</p>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src='/u_postcard.svg' className="w-5 h-5" />
                    <span className="text-sm md:text-base">Payment Method</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">Cash</p>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src='/truck.svg' className="w-5 h-5" />
                    <span className="text-sm md:text-base">Shipping</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">{order.customerInfo.delivery}</p>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <img src='/u_process.svg' className="w-5 h-5" />
                    <span className="text-sm md:text-base">Status</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between md:grid md:grid-cols-2 mt-6 pt-6 border-t">
                <p className="text-base md:text-lg font-semibold text-gray-700">Total Transaksi</p>
                <p className="text-xl md:text-2xl font-bold text-orange-500">
                  Idr {Math.round(order.total).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-2">
            <div className="">
              <h2 className="text-xl font-semibold mb-4">Your Order</h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="bg-[#E8E8E84D] p-4 relative">
                    <div className="flex gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        {item.isFlashSale && (
                          <span className="inline-block bg-red-600 text-white px-2 py-0.5 text-xs font-bold rounded mb-1">
                            FLASH SALE!
                          </span>
                        )}
                        <h3 className="text-sm md:text-base font-semibold mb-1">{item.name}</h3>
                        <p className="text-xs text-[#4F5665] mb-2">
                          {item.quantity}pcs | {item.size} | {item.temp} | {order.customerInfo.delivery}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 line-through text-xs">
                            IDR {item.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-[#FF8906] text-sm font-semibold">
                            IDR {item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;