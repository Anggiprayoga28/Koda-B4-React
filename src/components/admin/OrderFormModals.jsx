import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, Search } from 'lucide-react';
import { getProducts } from '../../services/apiService';

const OrderFormModal = ({ isOpen, onClose, onSave }) => {
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    full_name: '',
    address: '',
    phone: '',
    delivery_method: 'Dine in'
  });

  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      setCustomerInfo({
        email: '',
        full_name: '',
        address: '',
        phone: '',
        delivery_method: 'Dine in'
      });
      setSelectedItems([]);
      setSearchTerm('');
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product) => {
    const existingItem = selectedItems.find(item => item.product_id === product.id);
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || product.image,
        quantity: 1,
        size_id: null,
        temperature_id: null,
        variant_id: null
      }]);
    }
  };

  const updateQuantity = (productId, delta) => {
    setSelectedItems(selectedItems.map(item =>
      item.product_id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (productId) => {
    setSelectedItems(selectedItems.filter(item => item.product_id !== productId));
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = customerInfo.delivery_method === 'Door Delivery' ? 5000 : 0;
    return subtotal + deliveryFee;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!customerInfo.full_name.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (!customerInfo.email.trim()) {
      alert('Please enter customer email');
      return;
    }

    if (!validateEmail(customerInfo.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!customerInfo.phone.trim()) {
      alert('Please enter customer phone');
      return;
    }

    if (!customerInfo.address.trim()) {
      alert('Please enter delivery address');
      return;
    }

    if (selectedItems.length === 0) {
      alert('Please add at least one product');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        email: customerInfo.email.trim(),
        full_name: customerInfo.full_name.trim(),
        address: customerInfo.address.trim(),
        phone: customerInfo.phone.trim(),
        delivery_method: customerInfo.delivery_method,
        items: selectedItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          size_id: item.size_id,
          temperature_id: item.temperature_id,
          variant_id: item.variant_id
        })),
        total: calculateTotal()
      };

      console.log('Submitting order:', orderData);

      await onSave(orderData);
      
      setCustomerInfo({
        email: '',
        full_name: '',
        address: '',
        phone: '',
        delivery_method: 'Dine in'
      });
      setSelectedItems([]);
      setSearchTerm('');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(error.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 transition-colors p-1"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6 pb-32">
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  value={customerInfo.full_name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter Delivery Address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Delivery Method</label>
                <div className="flex gap-3">
                  {['Dine in', 'Door Delivery', 'Pick Up'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, delivery_method: method })}
                      disabled={loading}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                        customerInfo.delivery_method === method
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
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading || loadingProducts}
              />
              <Search className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
            </div>

            {loadingProducts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading products...</p>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 mb-4 border border-gray-200 rounded-lg p-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 10).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => addItem(product)}
                    >
                      <img 
                        src={product.image_url || product.image || '/placeholder.png'} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-orange-500 text-sm font-semibold">
                          IDR {product.price?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Stock: {product.stock || 0}</p>
                      </div>
                      <Plus className="w-5 h-5 text-orange-500" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No products found</p>
                )}
              </div>
            )}
          </div>

          {selectedItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Order Items ({selectedItems.length})
              </h3>
              
              <div className="space-y-3">
                {selectedItems.map((item) => (
                  <div key={item.product_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-3 mb-3">
                      <img 
                        src={item.image_url || '/placeholder.png'} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-orange-500 font-semibold">
                          IDR {item.price?.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-red-500 hover:text-red-600"
                        disabled={loading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, -1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                          disabled={loading}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, 1)}
                          className="w-8 h-8 bg-orange-500 text-white rounded flex items-center justify-center hover:bg-orange-600"
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="font-bold text-orange-500">
                        IDR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    IDR {selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                  </span>
                </div>
                {customerInfo.delivery_method === 'Door Delivery' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium">IDR 5,000</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-orange-500">
                    IDR {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 right-0 w-full max-w-xl bg-white border-t border-gray-200 px-8 py-6">
          <button
            onClick={handleSubmit}
            disabled={loading || selectedItems.length === 0}
            className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderFormModal;
