import React from 'react';
import { X, User, MapPin, Phone, CreditCard, Truck, CheckCircle, Package } from 'lucide-react';
import StatusBadge from './StatusBadge';

const OrderDetailSidebar = ({ isOpen, onClose, order, onUpdateStatus }) => {
  if (!isOpen || !order) return null;

  const getStatusVariant = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'finish order' || statusLower === 'done' || statusLower === 'completed') return 'success';
    if (statusLower === 'on progress' || statusLower === 'sending goods' || statusLower === 'processing') return 'warning';
    if (statusLower === 'pending' || statusLower === 'cancelled') return 'danger';
    return 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderId = order.order_id || order.orderId || order.id;
  const orderDate = order.order_date || order.orderDate || order.created_at;
  const orderStatus = order.status || 'Pending';
  const orderTotal = order.total || order.total_amount || 0;
  const orderItems = order.items || order.order_items || [];
  
  const customerInfo = order.customerInfo || order.customer_info || order.user || {};
  const customerName = customerInfo.fullName || customerInfo.full_name || customerInfo.name || order.user_name || 'N/A';
  const customerAddress = customerInfo.address || order.address || 'N/A';
  const customerPhone = customerInfo.phone || order.phone || 'N/A';
  const deliveryMethod = customerInfo.delivery || order.delivery_method || 'Standard Delivery';
  const paymentMethod = customerInfo.paymentMethod || order.payment_method || 'Cash';

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
        <div>
          <h2 className="text-2xl font-bold">Order #{orderId}</h2>
          <p className="text-sm text-gray-500 mt-1">{formatDate(orderDate)}</p>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-8 py-6 space-y-6 pb-32">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Order Information
          </h3>
          
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{customerName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{customerAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{customerPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{paymentMethod}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="font-medium">{deliveryMethod}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Order Status
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={orderStatus} variant={getStatusVariant(orderStatus)} />
            </div>
            
            <select
              value={orderStatus}
              onChange={(e) => onUpdateStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="On Progress">On Progress</option>
              <option value="Sending Goods">Sending Goods</option>
              <option value="completed">Completed</option>
              <option value="Finish Order">Finish Order</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items
          </h3>
          
          {orderItems.length > 0 ? (
            <div className="space-y-3">
              {orderItems.map((item, index) => {
                const itemName = item.name || item.product_name || 'Unknown Product';
                const itemQuantity = item.quantity || 1;
                const itemSize = item.size || 'Medium';
                const itemTemp = item.temp || item.temperature || 'Hot';
                const itemPrice = item.price || item.unit_price || 0;
                const itemImage = item.image || item.product_image || '/placeholder-product.jpg';
                
                return (
                  <div key={index} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                    <img 
                      src={itemImage} 
                      alt={itemName}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{itemName}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {itemQuantity}pcs | {itemSize} | {itemTemp}
                      </p>
                      <p className="text-orange-600 font-bold">
                        IDR {Math.round(itemPrice * itemQuantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No items in this order</p>
            </div>
          )}
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transaction</p>
              <p className="text-2xl font-bold text-orange-600">
                IDR {Math.round(orderTotal).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Items</p>
              <p className="text-lg font-semibold">{orderItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 w-full max-w-lg bg-white border-t border-gray-200 px-8 py-4">
        <button
          onClick={onClose}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetailSidebar;
