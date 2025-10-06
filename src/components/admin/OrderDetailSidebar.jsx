import React from 'react';
import { X, User, MapPin, Phone, CreditCard, Truck, CheckCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

const OrderDetailSidebar = ({ isOpen, onClose, order, onUpdateStatus }) => {
  if (!isOpen || !order) return null;

  const getStatusVariant = (status) => {
    if (status === 'Finish Order' || status === 'Done') return 'success';
    if (status === 'On Progress' || status === 'Sending Goods') return 'warning';
    return 'default';
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
        <h2 className="text-2xl font-bold">Order #{order.orderId}</h2>
        <button onClick={onClose} className="text-red-500 hover:text-red-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-8 py-6 space-y-6 pb-32">
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{order.customerInfo.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{order.customerInfo.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">082116304338</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">Cash</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="font-medium">{order.customerInfo.delivery}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Status</p>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 bg-white w-full"
                >
                  <option value="On Progress">On progress</option>
                  <option value="Sending Goods">Sending Goods</option>
                  <option value="Finish Order">Finish Order</option>
                  <option value="Pending">Pending</option>
                  <option value="Waiting">Waiting</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Total Transaksi</p>
              <p className="text-2xl font-bold text-orange-500">
                Idr {Math.round(order.total).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Your Order</h3>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.quantity}pcs | {item.size} | {item.temp} | {order.customerInfo.delivery}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">
                      IDR {item.originalPrice?.toLocaleString()}
                    </span>
                    <span className="text-orange-500 font-bold">
                      IDR {item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 w-full max-w-lg bg-white border-t border-gray-200 px-8 py-6">
        <button
          onClick={() => {
            alert('Order updated successfully!');
            onClose();
          }}
          className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default OrderDetailSidebar;