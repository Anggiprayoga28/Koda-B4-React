import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { products } from '../../data/products';

const OrderFormModal = ({ isOpen, onClose, onSave }) => {
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    delivery: 'Dine in'
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCustomerInfo({
        fullName: '',
        email: '',
        address: '',
        phone: '',
        delivery: 'Dine in'
      });
      setSelectedItems([]);
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product) => {
    const existingItem = selectedItems.find(item => item.id === product.id);
    if (existingItem) {
      setSelectedItems(selectedItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, {
        ...product,
        quantity: 1,
        size: 'Regular',
        temp: 'Ice'
      }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setSelectedItems(selectedItems.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const updateItemDetails = (id, field, value) => {
    setSelectedItems(selectedItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    const orderTotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = orderTotal * 0.1;
    return orderTotal + tax;  
  };

  const handleSubmit = () => {
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.address || !customerInfo.phone) {
      alert('Please fill in all customer information');
      return;
    }

    if (selectedItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    const orderData = {
      orderId: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      orderDate: new Date().toISOString(),
      customerInfo,
      items: selectedItems,
      orderTotal: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      tax: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1,
      delivery: 0,
      total: calculateTotal(),
      status: 'On Progress'
    };

    onSave(orderData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
        <h2 className="text-2xl font-bold text-gray-900">Add Order</h2>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-600 transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-8 py-6 space-y-6 pb-32">
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter Full Name"
                value={customerInfo.fullName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input
                type="tel"
                placeholder="Enter Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Address</label>
              <textarea
                placeholder="Enter Address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Delivery Method</label>
              <div className="flex gap-3">
                {['Dine in', 'Door Delivery', 'Pick Up'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setCustomerInfo({ ...customerInfo, delivery: method })}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                      customerInfo.delivery === method
                        ? 'bg-orange-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Add Products</h3>
          
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 mb-4"
          />

          <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
            {filteredProducts.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => addItem(product)}
              >
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-orange-500 text-sm font-semibold">IDR {product.price.toLocaleString()}</p>
                </div>
                <Plus className="w-5 h-5 text-orange-500" />
              </div>
            ))}
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Items ({selectedItems.length})</h3>
            
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-3 mb-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-orange-500 font-semibold">IDR {item.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Size</label>
                      <select
                        value={item.size}
                        onChange={(e) => updateItemDetails(item.id, 'size', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                      >
                        <option>Regular</option>
                        <option>Medium</option>
                        <option>Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Temp</label>
                      <select
                        value={item.temp}
                        onChange={(e) => updateItemDetails(item.id, 'temp', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                      >
                        <option>Ice</option>
                        <option>Hot</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Qty</label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 bg-orange-500 text-white rounded flex items-center justify-center hover:bg-orange-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  IDR {Math.round(calculateTotal()).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 right-0 w-full max-w-xl bg-white border-t border-gray-200 px-8 py-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Create Order
        </button>
      </div>
    </div>
  );
};

export default OrderFormModal;